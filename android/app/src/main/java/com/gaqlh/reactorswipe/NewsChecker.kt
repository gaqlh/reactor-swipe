package com.gaqlh.reactorswipe

import android.content.Context
import org.json.JSONArray
import org.json.JSONObject
import java.io.IOException
import java.net.HttpURLConnection
import java.net.URL
import java.time.OffsetDateTime
import kotlin.math.ceil
import kotlin.math.max

/**
 * Revisa los favoritos con campanita y guarda los posts que no había visto.
 * La primera vez que revisa un favorito solo toma nota (no avisa de lo que ya existía).
 */
object NewsChecker {

    private const val API = "https://api.joyreactor.com/graphql"
    private const val DEFAULT_FIELDS = "id createdAt rating commentsCount nsfw unsafe text user { id username } tags { name } " +
        "attributes { type ... on PostAttributePicture { id image { width height type hasVideo } } " +
        "... on PostAttributeEmbed { id value image { width height type hasVideo } } }"

    class CheckResult {
        var total = 0
        val per = LinkedHashMap<String, Int>()
        fun toJson(): JSONObject = JSONObject().put("total", total).put("per", JSONObject(per as Map<*, *>))
    }

    fun gql(query: String, vars: JSONObject): JSONObject {
        val conn = (URL(API).openConnection() as HttpURLConnection).apply {
            requestMethod = "POST"
            doOutput = true
            connectTimeout = 20000
            readTimeout = 30000
            setRequestProperty("Content-Type", "application/json")
            setRequestProperty("Referer", "https://joyreactor.com/")
        }
        try {
            conn.outputStream.use { it.write(JSONObject().put("query", query).put("variables", vars).toString().toByteArray()) }
            val code = conn.responseCode
            val stream = if (code in 200..299) conn.inputStream else conn.errorStream
            val body = stream?.bufferedReader()?.use { it.readText() } ?: ""
            if (code !in 200..299) throw IOException("JoyReactor respondió con error $code")
            val json = JSONObject(body)
            return json.optJSONObject("data")
                ?: throw IOException(json.optJSONArray("errors")?.optJSONObject(0)?.optString("message") ?: "Respuesta vacía de JoyReactor")
        } finally {
            conn.disconnect()
        }
    }

    private fun label(name: String, kind: String): String =
        if (kind == "category") name.replaceFirstChar { it.uppercase() } else "#$name"

    private fun time(s: String?): Long = try {
        OffsetDateTime.parse(s).toInstant().toEpochMilli()
    } catch (e: Exception) {
        0L
    }

    private fun hasExcluded(p: JSONObject, exclude: Set<String>): Boolean {
        if (exclude.isEmpty()) return false
        val tags = p.optJSONArray("tags") ?: return false
        for (k in 0 until tags.length()) {
            val name = tags.optJSONObject(k)?.optString("name") ?: continue
            if (name.lowercase() in exclude) return true
        }
        return false
    }

    /** Post retirado por JoyReactor (derechos de autor): sin imágenes y con una imagen de aviso como texto. */
    private fun isJunk(p: JSONObject): Boolean {
        val attrs = p.optJSONArray("attributes")
        if (attrs != null && attrs.length() > 0) return false
        val text = p.optString("text")
        return text.contains("/images/censorship/") || text.replace(Regex("<[^>]*>"), "").isBlank()
    }

    @Synchronized
    fun run(ctx: Context, notify: Boolean): CheckResult {
        val cfg = Store.config(ctx)
        val settings = cfg.optJSONObject("settings") ?: JSONObject()
        val favs = cfg.optJSONArray("favorites") ?: JSONArray()
        val targets = (0 until favs.length())
            .mapNotNull { favs.optJSONObject(it) }
            .filter { it.optBoolean("notify") && it.optString("name").isNotEmpty() }
        val result = CheckResult()

        if (targets.isEmpty()) {
            synchronized(Store) {
                val news = Store.news(ctx)
                news.put("lastCheck", System.currentTimeMillis())
                Store.saveNews(ctx, news)
            }
            return result
        }

        val fields = cfg.optString("postFields").ifEmpty { DEFAULT_FIELDS }
        val type = if (settings.optString("notifyType") == "GOOD") "GOOD" else "NEW"
        val hideNsfw = settings.optBoolean("hideNsfw", false)
        val excl = cfg.optJSONArray("exclude") ?: JSONArray()
        val exclude = (0 until excl.length()).map { excl.optString(it).lowercase() }.toHashSet()

        // 1) Cuántos posts tiene cada favorito → cuál es su última página.
        val vars = JSONObject()
        targets.forEachIndexed { i, f -> vars.put("n$i", f.getString("name")) }
        val decl = targets.indices.joinToString(",") { "\$n$it:String" }
        val parts = targets.indices.joinToString(" ") { "t$it: tag(name:\$n$it){ postPager(type:$type){ count } }" }
        val counts = gql("query($decl){ $parts }", vars)

        // 2) Las dos páginas más nuevas de cada uno.
        val vars2 = JSONObject()
        val decl2 = ArrayList<String>()
        val parts2 = StringBuilder()
        targets.forEachIndexed { i, f ->
            val count = counts.optJSONObject("t$i")?.optJSONObject("postPager")?.optInt("count") ?: return@forEachIndexed
            val last = max(1, ceil(count / 10.0).toInt())
            vars2.put("n$i", f.getString("name"))
            decl2.add("\$n$i:String")
            parts2.append(" t$i: tag(name:\$n$i){ postPager(type:$type){ a: posts(page:$last){ $fields } b: posts(page:${max(1, last - 1)}){ $fields } } }")
        }
        val pages = if (decl2.isEmpty()) JSONObject() else gql("query(${decl2.joinToString(",")}){$parts2 }", vars2)

        val labels = ArrayList<String>()
        synchronized(Store) {
            val known = Store.known(ctx)
            val news = Store.news(ctx)
            val old = news.optJSONArray("items") ?: JSONArray()
            val all = ArrayList<JSONObject>()
            val have = HashSet<String>()
            for (k in 0 until old.length()) {
                val item = old.optJSONObject(k) ?: continue
                all.add(item)
                have.add(item.optString("id"))
            }
            val now = System.currentTimeMillis()

            targets.forEachIndexed { i, f ->
                val pp = pages.optJSONObject("t$i")?.optJSONObject("postPager") ?: return@forEachIndexed
                val posts = ArrayList<JSONObject>()
                for (key in arrayOf("a", "b")) {
                    val arr = pp.optJSONArray(key) ?: continue
                    for (k in 0 until arr.length()) arr.optJSONObject(k)?.let { posts.add(it) }
                }
                val name = f.getString("name")
                val prev = known.optJSONArray(name)
                val merged = LinkedHashSet<String>()
                posts.forEach { merged.add(it.optString("id")) }
                if (prev != null) for (k in 0 until prev.length()) merged.add(prev.optString(k))
                known.put(name, JSONArray(merged.take(80)))
                if (prev == null) return@forEachIndexed

                val prevSet = HashSet<String>()
                for (k in 0 until prev.length()) prevSet.add(prev.optString(k))
                var n = 0
                for (p in posts) {
                    val id = p.optString("id")
                    if (id.isEmpty() || id in prevSet || id in have) continue
                    if (hideNsfw && (p.optBoolean("nsfw") || p.optBoolean("unsafe"))) continue
                    if (hasExcluded(p, exclude)) continue
                    if (isJunk(p)) continue
                    all.add(JSONObject().put("id", id).put("tag", name).put("kind", f.optString("kind")).put("at", now).put("raw", p))
                    have.add(id)
                    n++
                }
                if (n > 0) {
                    result.per[name] = n
                    result.total += n
                    labels.add(label(name, f.optString("kind")) + " ($n)")
                }
            }

            all.sortByDescending { time(it.optJSONObject("raw")?.optString("createdAt")) }
            news.put("items", JSONArray(all.take(300)))
            news.put("unread", news.optInt("unread") + result.total)
            news.put("lastCheck", now)
            Store.saveKnown(ctx, known)
            Store.saveNews(ctx, news)
        }

        if (notify && result.total > 0 && settings.optBoolean("notify", true)) {
            Notifs.news(ctx, result.total, labels.joinToString(" · "))
        }
        return result
    }
}
