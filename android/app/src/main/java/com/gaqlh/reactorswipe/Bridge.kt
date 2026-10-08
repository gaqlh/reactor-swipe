package com.gaqlh.reactorswipe

import android.annotation.SuppressLint
import android.content.ContentValues
import android.content.Context
import android.content.Intent
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.net.Uri
import android.os.Environment
import android.os.PowerManager
import android.provider.MediaStore
import android.provider.Settings
import android.webkit.JavascriptInterface
import org.json.JSONObject
import java.io.IOException
import java.net.HttpURLConnection
import java.net.URL
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors

/**
 * Lo que la interfaz (JavaScript) puede pedirle a Android, expuesto como window.RSAndroid.
 * Las tareas lentas responden con window.__rsNative.resolve(id, json).
 */
class Bridge(private val activity: MainActivity) {

    private val ctx: Context = activity.applicationContext
    private val io: ExecutorService = Executors.newFixedThreadPool(2)

    @JavascriptInterface
    fun getVersion(): String = BuildConfig.VERSION_NAME

    @JavascriptInterface
    fun getNews(): String = Store.news(ctx).toString()

    /**
     * Cuándo se instaló la app (no cambia al actualizar; sí al desinstalar y volver a instalar). Con eso
     * la interfaz se da cuenta de que Android le devolvió datos viejos de su copia en Google (1.12.0).
     */
    @JavascriptInterface
    fun installedAt(): String = try {
        ctx.packageManager.getPackageInfo(ctx.packageName, 0).firstInstallTime.toString()
    } catch (e: Exception) {
        "0"
    }

    @JavascriptInterface
    fun markNewsRead() {
        Store.markRead(ctx)
        Notifs.cancelNews(ctx)
    }

    /** Ajustes › Privacidad (1.16.0): tapar en apps recientes y esconder al bloquear (ver MainActivity). */
    @JavascriptInterface
    fun setPrivacy(recents: Boolean, lock: Boolean) {
        Store.prefs(ctx).edit().putBoolean("privRecents", recents).putBoolean("privLock", lock).apply()
        activity.runOnUiThread { activity.applyPrivacy() }
    }

    @JavascriptInterface
    fun syncConfig(json: String) {
        Store.saveConfig(ctx, json)
        Scheduler.ensure(ctx)
    }

    /** Resumen de los lunes: tiempo y top de la semana (y si ya lo miraste en la app). */
    @JavascriptInterface
    fun syncWeek(json: String) {
        Store.saveWeek(ctx, json)
        Weekly.onSeen(ctx)
    }

    /** ¿Hay Wi-Fi (o cable)? En Buscar, con Wi-Fi la vista previa de cada video dura más (1.13.2). */
    @JavascriptInterface
    fun onWifi(): Boolean = try {
        val cm = ctx.getSystemService(ConnectivityManager::class.java)
        val caps = cm?.getNetworkCapabilities(cm.activeNetwork)
        caps != null && (caps.hasTransport(NetworkCapabilities.TRANSPORT_WIFI) || caps.hasTransport(NetworkCapabilities.TRANSPORT_ETHERNET))
    } catch (e: Exception) {
        false
    }

    @JavascriptInterface
    fun notificationsAllowed(): Boolean = Notifs.canNotify(ctx)

    @JavascriptInterface
    fun requestNotifications() {
        activity.runOnUiThread { activity.maybeAskNotifications(true) }
    }

    @JavascriptInterface
    fun batteryUnrestricted(): Boolean =
        ctx.getSystemService(PowerManager::class.java)?.isIgnoringBatteryOptimizations(ctx.packageName) ?: true

    @SuppressLint("BatteryLife")
    @JavascriptInterface
    fun requestBatteryExemption() {
        activity.runOnUiThread {
            try {
                activity.startActivity(Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS, Uri.parse("package:" + ctx.packageName)))
            } catch (e: Exception) {
                try {
                    activity.startActivity(Intent(Settings.ACTION_IGNORE_BATTERY_OPTIMIZATION_SETTINGS))
                } catch (ignored: Exception) {
                    // Este teléfono no tiene esos ajustes.
                }
            }
        }
    }

    @JavascriptInterface
    fun setFullscreen(on: Boolean) {
        activity.runOnUiThread { activity.setFullscreen(on) }
    }

    @JavascriptInterface
    fun peekSystemBars() {
        activity.runOnUiThread { activity.peekSystemBars() }
    }

    @JavascriptInterface
    fun checkNow(cb: String) = async(cb) { NewsChecker.run(ctx, notify = false).toJson() }

    @JavascriptInterface
    fun saveFile(name: String, content: String, cb: String) = async(cb) { saveToDownloads(name, content) }

    /** Respaldo automático: siempre el mismo archivo en Descargas/ReactorSwipe (no se borra al desinstalar). */
    @JavascriptInterface
    fun autoBackup(content: String, cb: String) = async(cb) { writeAutoBackup(content) }

    @JavascriptInterface
    fun installUpdate(url: String, cb: String) = async(cb) { Updater.downloadAndInstall(activity, url) }

    /** Descargar un post: la imagen o el mp4 va a la galería, en Imágenes/ReactorSwipe. */
    @JavascriptInterface
    fun saveMedia(url: String, name: String, cb: String) = async(cb) { saveToGallery(url, name) }

    private fun async(cb: String, work: () -> JSONObject) {
        io.execute {
            val result = try {
                work()
            } catch (e: Exception) {
                JSONObject().put("error", e.message ?: "Algo salió mal")
            }
            activity.runOnUiThread {
                activity.web.evaluateJavascript(
                    "window.__rsNative && __rsNative.resolve(${JSONObject.quote(cb)}, ${JSONObject.quote(result.toString())})",
                    null
                )
            }
        }
    }

    /**
     * Escribe el respaldo automático. Mientras la app siga instalada, vuelve a escribir el mismo archivo
     * (su dirección queda en las preferencias). Después de reinstalar, Android no deja tocar el archivo de
     * antes: se crea uno nuevo al lado («… (1).json») y el viejo queda como estaba.
     */
    private fun writeAutoBackup(content: String): JSONObject {
        val prefs = Store.prefs(ctx)
        val resolver = ctx.contentResolver
        val bytes = content.toByteArray()
        val known = prefs.getString("backupUri", null)
        if (known != null) {
            try {
                val out = resolver.openOutputStream(Uri.parse(known), "wt") ?: throw IOException("Sin acceso al respaldo")
                out.use { it.write(bytes) }
                return JSONObject().put("ok", true)
            } catch (e: Exception) {
                // Lo borraron o ya no es nuestro: se crea otro.
                prefs.edit().remove("backupUri").apply()
            }
        }
        val values = ContentValues().apply {
            put(MediaStore.Downloads.DISPLAY_NAME, "reactor-swipe-respaldo.json")
            put(MediaStore.Downloads.MIME_TYPE, "application/json")
            put(MediaStore.Downloads.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS + "/ReactorSwipe")
        }
        val uri = resolver.insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, values)
            ?: throw IOException("No se pudo crear el respaldo en Descargas")
        val out = resolver.openOutputStream(uri, "wt") ?: throw IOException("No se pudo escribir el respaldo")
        out.use { it.write(bytes) }
        prefs.edit().putString("backupUri", uri.toString()).apply()
        return JSONObject().put("ok", true)
    }

    /**
     * Baja un archivo de JoyReactor (pide el Referer de joyreactor.com) y lo guarda con MediaStore en
     * Imágenes/ReactorSwipe, así sale en la galería. Si la imagen en tamaño completo no existe, usa la normal.
     */
    private fun saveToGallery(url: String, name: String): JSONObject {
        if (!Regex("""^https://(img\d*\.joyreactor\.com/pics/post/|media\.redgifs\.com/)""").containsMatchIn(url)) throw IOException("Enlace no válido")
        val safeName = name.replace(Regex("[^A-Za-z0-9._-]"), "_")
        var conn = openMedia(url)
        if (conn.responseCode != 200 && url.contains("/full/")) {
            conn.disconnect()
            conn = openMedia(url.replace("/full/", "/"))
        }
        try {
            if (conn.responseCode != 200) throw IOException("JoyReactor respondió ${conn.responseCode}")
            val ext = safeName.substringAfterLast('.', "").lowercase()
            val video = ext == "mp4"
            val mime = when (ext) {
                "mp4" -> "video/mp4"
                "jpg" -> "image/jpeg"
                "png" -> "image/png"
                "gif" -> "image/gif"
                "webp" -> "image/webp"
                else -> "image/jpeg"
            }
            val resolver = ctx.contentResolver
            val values = ContentValues().apply {
                put(MediaStore.MediaColumns.DISPLAY_NAME, safeName)
                put(MediaStore.MediaColumns.MIME_TYPE, mime)
                put(MediaStore.MediaColumns.RELATIVE_PATH, Environment.DIRECTORY_PICTURES + "/ReactorSwipe")
                put(MediaStore.MediaColumns.IS_PENDING, 1)
            }
            val collection = if (video) MediaStore.Video.Media.EXTERNAL_CONTENT_URI else MediaStore.Images.Media.EXTERNAL_CONTENT_URI
            val made = try {
                resolver.insert(collection, values)
            } catch (e: IllegalArgumentException) {
                // Por si este Android no deja videos en Imágenes: van a Películas/ReactorSwipe.
                values.put(MediaStore.MediaColumns.RELATIVE_PATH, Environment.DIRECTORY_MOVIES + "/ReactorSwipe")
                resolver.insert(collection, values)
            }
            val uri = made ?: throw IOException("No se pudo crear el archivo en la galería")
            try {
                val out = resolver.openOutputStream(uri) ?: throw IOException("No se pudo escribir el archivo")
                out.use { o -> conn.inputStream.use { it.copyTo(o) } }
                resolver.update(uri, ContentValues().apply { put(MediaStore.MediaColumns.IS_PENDING, 0) }, null, null)
            } catch (e: Exception) {
                resolver.delete(uri, null, null)
                throw e
            }
            return JSONObject().put("ok", true).put("name", safeName)
        } finally {
            conn.disconnect()
        }
    }

    // Los archivos de JoyReactor piden su Referer; los de RedGifs, ninguno (con otro dan 403).
    private fun openMedia(url: String): HttpURLConnection =
        (URL(url).openConnection() as HttpURLConnection).apply {
            instanceFollowRedirects = true
            connectTimeout = 20000
            readTimeout = 60000
            if (url.contains("redgifs.com")) {
                setRequestProperty("User-Agent", RedGifs.UA)
            } else {
                setRequestProperty("Referer", "https://joyreactor.com/")
                setRequestProperty("User-Agent", "Mozilla/5.0 (Linux; Android) ReactorSwipe")
            }
        }

    private fun saveToDownloads(name: String, content: String): JSONObject {
        val safeName = name.replace(Regex("[^A-Za-z0-9._-]"), "_")
        val values = ContentValues().apply {
            put(MediaStore.Downloads.DISPLAY_NAME, safeName)
            put(MediaStore.Downloads.MIME_TYPE, "application/json")
            put(MediaStore.Downloads.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS)
        }
        val resolver = ctx.contentResolver
        val uri = resolver.insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, values)
            ?: throw IOException("No se pudo crear el archivo en Descargas")
        resolver.openOutputStream(uri)?.use { it.write(content.toByteArray()) }
            ?: throw IOException("No se pudo escribir el respaldo")
        return JSONObject().put("ok", true).put("message", "Respaldo guardado en Descargas: $safeName")
    }
}
