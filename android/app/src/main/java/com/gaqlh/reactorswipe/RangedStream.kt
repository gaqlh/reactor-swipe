package com.gaqlh.reactorswipe

import java.io.InputStream
import java.net.HttpURLConnection

/**
 * Lo que se le devuelve al WebView por un pedido con Range (1.13.3; lo usan RedGifs y JoyFiles).
 *
 * El WebView aplica el Range por su cuenta sobre lo que le devolvemos: pregunta el tamaño (available()) para
 * validar el rango y después salta (skip) hasta el primer byte pedido. Como el servidor ya responde desde ese
 * byte, el salto no debe leer nada (virtualSkip), y available() tiene que decir el tamaño entero del archivo.
 * Antes, con lo que traía el búfer (unos pocos KB), el WebView rechazaba todo pedido que no empezara en 0 o
 * saltaba dos veces: al adelantar un video de RedGifs se congelaba y los pedazos (vista previa de Buscar, GIF
 * del intro) no llegaban.
 */
class RangedStream(private val inner: InputStream, private var virtualSkip: Long, private val size: Long) : InputStream() {

    override fun read(): Int = inner.read()

    override fun read(b: ByteArray, off: Int, len: Int): Int = inner.read(b, off, len)

    override fun skip(n: Long): Long {
        if (virtualSkip > 0) {
            val s = minOf(n, virtualSkip)
            virtualSkip -= s
            return s
        }
        return inner.skip(n)
    }

    override fun available(): Int = if (size > 0) minOf(size, Int.MAX_VALUE.toLong()).toInt() else 0

    override fun close() = inner.close()

    companion object {
        private val RANGE = Regex("""^bytes=(\d+)-""")
        private val TOTAL = Regex("""/(\d+)\s*$""")

        /** El cuerpo de conn (ya respondió con code) para un pedido que traía este Range (o ninguno). */
        fun of(conn: HttpURLConnection, code: Int, range: String?): InputStream {
            val start = if (code == 206) range?.trim()?.let { RANGE.find(it) }?.groupValues?.get(1)?.toLongOrNull() ?: 0L else 0L
            val total = conn.getHeaderField("Content-Range")?.let { TOTAL.find(it) }?.groupValues?.get(1)?.toLongOrNull()
                ?: if (code == 200) conn.contentLengthLong else -1L
            return RangedStream(conn.inputStream, start, total)
        }
    }
}
