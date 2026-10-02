package com.gaqlh.reactorswipe

import android.content.Context
import androidx.work.Constraints
import androidx.work.ExistingPeriodicWorkPolicy
import androidx.work.NetworkType
import androidx.work.PeriodicWorkRequestBuilder
import androidx.work.WorkManager
import androidx.work.Worker
import androidx.work.WorkerParameters
import org.json.JSONArray
import org.json.JSONObject
import java.util.concurrent.TimeUnit

/** Revisa los favoritos en segundo plano, aunque la app esté cerrada. */
class NewsWorker(ctx: Context, params: WorkerParameters) : Worker(ctx, params) {
    override fun doWork(): Result = try {
        NewsChecker.run(applicationContext, notify = true)
        Result.success()
    } catch (e: Exception) {
        if (runAttemptCount < 2) Result.retry() else Result.success()
    }
}

/** Busca versiones nuevas de la app un par de veces al día. */
class UpdateWorker(ctx: Context, params: WorkerParameters) : Worker(ctx, params) {
    override fun doWork(): Result {
        try {
            Updater.checkAndNotify(applicationContext)
        } catch (e: Exception) {
            // Se vuelve a intentar en la próxima vuelta.
        }
        return Result.success()
    }
}

object Scheduler {

    fun ensure(ctx: Context) {
        val wm = WorkManager.getInstance(ctx)
        val prefs = Store.prefs(ctx)
        val cfg = Store.config(ctx)
        val settings = cfg.optJSONObject("settings") ?: JSONObject()
        val favs = cfg.optJSONArray("favorites") ?: JSONArray()
        val watching = (0 until favs.length()).any { favs.optJSONObject(it)?.optBoolean("notify") == true }
        val enabled = settings.optBoolean("notify", true) && watching
        val minutes = settings.optInt("interval", 15).coerceIn(15, 240).toLong()
        val online = Constraints.Builder().setRequiredNetworkType(NetworkType.CONNECTED).build()

        if (enabled) {
            val sameInterval = prefs.getLong("newsInterval", -1L) == minutes
            val request = PeriodicWorkRequestBuilder<NewsWorker>(minutes, TimeUnit.MINUTES).setConstraints(online).build()
            wm.enqueueUniquePeriodicWork(
                "news",
                if (sameInterval) ExistingPeriodicWorkPolicy.KEEP else ExistingPeriodicWorkPolicy.UPDATE,
                request
            )
            prefs.edit().putLong("newsInterval", minutes).apply()
        } else {
            wm.cancelUniqueWork("news")
            prefs.edit().remove("newsInterval").apply()
        }

        wm.enqueueUniquePeriodicWork(
            "updates",
            ExistingPeriodicWorkPolicy.KEEP,
            PeriodicWorkRequestBuilder<UpdateWorker>(12, TimeUnit.HOURS).setConstraints(online).build()
        )
    }
}
