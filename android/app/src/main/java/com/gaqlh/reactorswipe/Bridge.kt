package com.gaqlh.reactorswipe

import android.annotation.SuppressLint
import android.content.ContentValues
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Environment
import android.os.PowerManager
import android.provider.MediaStore
import android.provider.Settings
import android.webkit.JavascriptInterface
import org.json.JSONObject
import java.io.IOException
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

    @JavascriptInterface
    fun markNewsRead() {
        Store.markRead(ctx)
        Notifs.cancelNews(ctx)
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
