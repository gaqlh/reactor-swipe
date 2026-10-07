package com.gaqlh.reactorswipe

import android.content.Context
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import org.json.JSONObject
import java.io.ByteArrayInputStream
import java.io.IOException
import java.net.HttpURLConnection
import java.net.URL

/**
 * RedGifs (1.10.0). La interfaz pide su API y sus archivos como https://joyreactor.com/__rg/api/… y
 * https://joyreactor.com/__rg/media/…, y MainActivity los atiende aquí (en la PC lo hace tools/dev-server.mjs):
 * · la API pide un token temporal, que dura 24 h y queda atado a la IP y al User-Agent. Se guarda y se pide
 *   otro solo cuando RedGifs responde 401: pedir muchos bloquea el acceso un buen rato.
 * · los archivos dan 403 con Referer de otro sitio: se piden sin Referer, pasando el Range de los videos.
 * · de a pedazos (MEDIA_CHUNK, 1.13.2): un «desde aquí hasta el final» se pide hasta 2 MB y el reproductor
 *   pide lo siguiente cuando lo necesita. Con el archivo entero en cada pedido, al adelantar un video el
 *   pedido nuevo quedaba esperando detrás de los viejos y el video se congelaba.
 */
object RedGifs {
    private const val API = "https://api.redgifs.com"
    private const val MEDIA = "https://media.redgifs.com"
    const val UA = "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Mobile Safari/537.36 ReactorSwipe"
    private val API_PATH = Regex("""^/v[12]/[A-Za-z0-9/_.%-]+$""")
    private val MEDIA_PATH = Regex("""^/[A-Za-z0-9_.%-]+$""")
    private const val TOKEN_MS = 20L * 3600 * 1000
    private const val MEDIA_CHUNK = 2L * 1024 * 1024
    private val RANGE = Regex("""^bytes=(\d+)-(\d*)$""")

    private var token: String? = null
    private var tokenAt = 0L

    @Synchronized
    private fun token(ctx: Context, fresh: Boolean): String {
        val prefs = Store.prefs(ctx)
        if (!fresh) {
            if (token == null) {
                token = prefs.getString("rgToken", null)
                tokenAt = prefs.getLong("rgTokenAt", 0L)
            }
            val t = token
            if (t != null && System.currentTimeMillis() - tokenAt < TOKEN_MS) return t
        }
        val conn = open("$API/v2/auth/temporary")
        try {
            if (conn.responseCode != 200) throw IOException("RedGifs no dio permiso (${conn.responseCode})")
            val t = JSONObject(conn.inputStream.bufferedReader().use { it.readText() }).getString("token")
            token = t
            tokenAt = System.currentTimeMillis()
            prefs.edit().putString("rgToken", t).putLong("rgTokenAt", tokenAt).apply()
            return t
        } finally {
            conn.disconnect()
        }
    }

    private fun open(url: String): HttpURLConnection =
        (URL(url).openConnection() as HttpURLConnection).apply {
            connectTimeout = 15000
            readTimeout = 30000
            instanceFollowRedirects = true
            setRequestProperty("User-Agent", UA)
        }

    /** Lo pide MainActivity para cada petición a /__rg/…; null = no es de RedGifs. */
    fun intercept(ctx: Context, req: WebResourceRequest): WebResourceResponse? {
        val path = req.url.encodedPath ?: return null
        return try {
            when {
                path.startsWith("/__rg/api/") -> api(ctx, path.removePrefix("/__rg/api"), req.url.encodedQuery)
                path.startsWith("/__rg/media/") -> media(path.removePrefix("/__rg/media"), req.requestHeaders)
                else -> null
            }
        } catch (e: Exception) {
            text(502, e.message ?: "RedGifs no respondió")
        }
    }

    private fun api(ctx: Context, path: String, query: String?): WebResourceResponse {
        if (!API_PATH.matches(path)) return text(403, "Ruta de RedGifs no permitida")
        val url = API + path + (if (query.isNullOrEmpty()) "" else "?$query")
        // Si el token caducó (401), se pide otro una sola vez.
        for (attempt in 0..1) {
            val conn = open(url)
            conn.setRequestProperty("Authorization", "Bearer " + token(ctx, attempt > 0))
            val code = conn.responseCode
            if (code == 401 && attempt == 0) {
                conn.disconnect()
                continue
            }
            val body = try {
                (if (code < 400) conn.inputStream else conn.errorStream)?.use { it.readBytes() } ?: ByteArray(0)
            } finally {
                conn.disconnect()
            }
            return WebResourceResponse("application/json", "utf-8", code, reason(code), mapOf("Cache-Control" to "no-store"), ByteArrayInputStream(body))
        }
        return text(401, "RedGifs no dio permiso")
    }

    private fun media(path: String, headers: Map<String, String>): WebResourceResponse {
        if (!MEDIA_PATH.matches(path)) return text(403, "Archivo de RedGifs no válido")
        val conn = open(MEDIA + path)
        val range = headers.entries.firstOrNull { it.key.equals("Range", ignoreCase = true) }?.value?.trim()
        val m = range?.let { RANGE.matchEntire(it) }
        if (m != null) {
            val start = m.groupValues[1].toLong()
            val asked = m.groupValues[2].toLongOrNull()
            val end = minOf(asked ?: Long.MAX_VALUE, start + MEDIA_CHUNK - 1)
            conn.setRequestProperty("Range", "bytes=$start-$end")
        } else if (range != null) {
            conn.setRequestProperty("Range", range)
        }
        val code = conn.responseCode
        val out = HashMap<String, String>()
        for (h in listOf("Content-Length", "Content-Range", "Accept-Ranges", "Cache-Control")) conn.getHeaderField(h)?.let { out[h] = it }
        val type = (conn.contentType ?: "application/octet-stream").substringBefore(';').trim()
        val stream = (if (code < 400) conn.inputStream else conn.errorStream) ?: ByteArrayInputStream(ByteArray(0))
        return WebResourceResponse(type, null, code, reason(code), out, stream)
    }

    private fun reason(code: Int) = when (code) {
        200 -> "OK"
        206 -> "Partial Content"
        401 -> "Unauthorized"
        403 -> "Forbidden"
        404 -> "Not Found"
        416 -> "Range Not Satisfiable"
        429 -> "Too Many Requests"
        else -> "Status $code"
    }

    private fun text(code: Int, msg: String) =
        WebResourceResponse("text/plain", "utf-8", code, reason(code), emptyMap(), ByteArrayInputStream(msg.toByteArray()))
}
