package com.gaqlh.reactorswipe

import android.content.Context
import android.content.SharedPreferences
import org.json.JSONArray
import org.json.JSONObject

/** Datos que comparten la interfaz y la revisión en segundo plano. */
object Store {

    private const val NAME = "reactor_swipe"

    fun prefs(ctx: Context): SharedPreferences = ctx.getSharedPreferences(NAME, Context.MODE_PRIVATE)

    private fun parse(s: String?): JSONObject = try {
        if (s.isNullOrEmpty()) JSONObject() else JSONObject(s)
    } catch (e: Exception) {
        JSONObject()
    }

    /** Qué vigilar: favoritos (con campanita), ajustes y hashtags excluidos. Lo manda la interfaz. */
    @Synchronized
    fun config(ctx: Context): JSONObject = parse(prefs(ctx).getString("config", null))

    @Synchronized
    fun saveConfig(ctx: Context, json: String) {
        JSONObject(json) // valida
        prefs(ctx).edit().putString("config", json).apply()
    }

    /** Novedades: { items: [{id, tag, kind, at, raw}], unread, lastCheck }. */
    @Synchronized
    fun news(ctx: Context): JSONObject {
        val n = parse(prefs(ctx).getString("news", null))
        if (!n.has("items")) n.put("items", JSONArray())
        return n
    }

    @Synchronized
    fun saveNews(ctx: Context, news: JSONObject) {
        prefs(ctx).edit().putString("news", news.toString()).apply()
    }

    @Synchronized
    fun markRead(ctx: Context) {
        val n = news(ctx)
        n.put("unread", 0)
        saveNews(ctx, n)
    }

    /** Últimos posts ya vistos de cada favorito (para saber cuáles son nuevos). */
    @Synchronized
    fun known(ctx: Context): JSONObject = parse(prefs(ctx).getString("known", null))

    @Synchronized
    fun saveKnown(ctx: Context, known: JSONObject) {
        prefs(ctx).edit().putString("known", known.toString()).apply()
    }
}
