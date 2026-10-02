package com.gaqlh.reactorswipe

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.provider.Settings
import androidx.core.content.FileProvider
import org.json.JSONObject
import java.io.File
import java.io.IOException
import java.net.HttpURLConnection
import java.net.URL

/** Actualizaciones desde los releases de GitHub: aviso, descarga e instalador de Android. */
object Updater {

    private const val REPO = "gaqlh/reactor-swipe"
    private const val LATEST = "https://api.github.com/repos/$REPO/releases/latest"
    private const val ALLOWED_PREFIX = "https://github.com/$REPO/releases/download/"
    private const val APK_NAME = "reactor-swipe.apk"

    data class Release(val version: String, val url: String)

    fun latest(): Release? {
        val conn = (URL(LATEST).openConnection() as HttpURLConnection).apply {
            connectTimeout = 15000
            readTimeout = 20000
            setRequestProperty("Accept", "application/vnd.github+json")
            setRequestProperty("User-Agent", "ReactorSwipe")
        }
        try {
            if (conn.responseCode != 200) return null
            val json = JSONObject(conn.inputStream.bufferedReader().use { it.readText() })
            val version = json.optString("tag_name").removePrefix("v")
            val assets = json.optJSONArray("assets") ?: return null
            for (i in 0 until assets.length()) {
                val a = assets.optJSONObject(i) ?: continue
                if (a.optString("name") == APK_NAME) return Release(version, a.optString("browser_download_url"))
            }
            return null
        } finally {
            conn.disconnect()
        }
    }

    fun isNewer(candidate: String, current: String): Boolean {
        val a = candidate.split('.', '-').map { it.toIntOrNull() ?: 0 }
        val b = current.split('.', '-').map { it.toIntOrNull() ?: 0 }
        for (i in 0 until maxOf(a.size, b.size)) {
            val d = a.getOrElse(i) { 0 } - b.getOrElse(i) { 0 }
            if (d != 0) return d > 0
        }
        return false
    }

    fun checkAndNotify(ctx: Context) {
        val rel = latest() ?: return
        if (!isNewer(rel.version, BuildConfig.VERSION_NAME)) return
        val prefs = Store.prefs(ctx)
        if (prefs.getString("notifiedVersion", null) == rel.version) return
        Notifs.update(ctx, rel.version)
        prefs.edit().putString("notifiedVersion", rel.version).apply()
    }

    /** Descarga el APK y abre el instalador de Android (el usuario solo toca «Instalar»). */
    fun downloadAndInstall(activity: Activity, url: String): JSONObject {
        if (!url.startsWith(ALLOWED_PREFIX)) throw IOException("Enlace de actualización no válido")
        if (!activity.packageManager.canRequestPackageInstalls()) {
            activity.runOnUiThread {
                activity.startActivity(Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES, Uri.parse("package:" + activity.packageName)))
            }
            return JSONObject().put("needsPermission", true)
        }
        val dir = File(activity.cacheDir, "updates").apply { mkdirs() }
        val file = File(dir, APK_NAME)
        val conn = (URL(url).openConnection() as HttpURLConnection).apply {
            instanceFollowRedirects = true
            connectTimeout = 20000
            readTimeout = 60000
            setRequestProperty("User-Agent", "ReactorSwipe")
        }
        try {
            if (conn.responseCode !in 200..299) throw IOException("La descarga falló (${conn.responseCode})")
            conn.inputStream.use { input -> file.outputStream().use { output -> input.copyTo(output) } }
        } finally {
            conn.disconnect()
        }
        val uri = FileProvider.getUriForFile(activity, activity.packageName + ".files", file)
        val install = Intent(Intent.ACTION_VIEW)
            .setDataAndType(uri, "application/vnd.android.package-archive")
            .addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION or Intent.FLAG_ACTIVITY_NEW_TASK)
        activity.runOnUiThread { activity.startActivity(install) }
        return JSONObject().put("ok", true)
    }
}
