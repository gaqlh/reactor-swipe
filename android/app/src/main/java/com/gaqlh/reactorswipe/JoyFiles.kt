package com.gaqlh.reactorswipe

import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import java.io.ByteArrayInputStream
import java.net.HttpURLConnection
import java.net.URL

/**
 * Archivos de JoyReactor desde el mismo origen que la app (1.12.0). La interfaz pide
 * https://joyreactor.com/__jr/img10/pics/post/… y aquí se baja de https://img10.joyreactor.com/pics/post/…
 * con su Referer. Así la página puede copiarlos a un <canvas>: la foto recortada de un perfil y las
 * miniaturas del intro se guardan en el teléfono (con la dirección de JoyReactor el canvas queda bloqueado).
 */
object JoyFiles {
    private val PATH = Regex("""^/__jr/(img\d*)/(pics/[A-Za-z0-9/_.%-]+)$""")

    /** Lo pide MainActivity para cada petición a /__jr/…. */
    fun intercept(req: WebResourceRequest): WebResourceResponse {
        val m = PATH.matchEntire(req.url.encodedPath ?: "") ?: return text(403, "Archivo de JoyReactor no válido")
        return try {
            val conn = (URL("https://${m.groupValues[1]}.joyreactor.com/${m.groupValues[2]}").openConnection() as HttpURLConnection).apply {
                connectTimeout = 15000
                readTimeout = 60000
                instanceFollowRedirects = true
                setRequestProperty("Referer", "https://joyreactor.com/")
                setRequestProperty("User-Agent", "Mozilla/5.0 (Linux; Android) ReactorSwipe")
            }
            req.requestHeaders.entries.firstOrNull { it.key.equals("Range", ignoreCase = true) }?.let { conn.setRequestProperty("Range", it.value) }
            val code = conn.responseCode
            val out = HashMap<String, String>()
            for (h in listOf("Content-Length", "Content-Range", "Accept-Ranges", "Cache-Control")) conn.getHeaderField(h)?.let { out[h] = it }
            val type = (conn.contentType ?: "application/octet-stream").substringBefore(';').trim()
            val stream = (if (code < 400) conn.inputStream else conn.errorStream) ?: ByteArrayInputStream(ByteArray(0))
            WebResourceResponse(type, null, code, if (code == 200) "OK" else if (code == 206) "Partial Content" else "Status $code", out, stream)
        } catch (e: Exception) {
            text(502, e.message ?: "JoyReactor no respondió")
        }
    }

    private fun text(code: Int, msg: String) =
        WebResourceResponse("text/plain", "utf-8", code, if (code == 403) "Forbidden" else "Bad Gateway", emptyMap(), ByteArrayInputStream(msg.toByteArray()))
}
