package com.gaqlh.reactorswipe

import android.content.Context
import androidx.work.ExistingPeriodicWorkPolicy
import androidx.work.PeriodicWorkRequestBuilder
import androidx.work.WorkManager
import androidx.work.Worker
import androidx.work.WorkerParameters
import org.json.JSONObject
import java.time.DayOfWeek
import java.time.ZonedDateTime
import java.time.temporal.TemporalAdjusters
import java.util.concurrent.TimeUnit
import kotlin.math.abs
import kotlin.math.roundToLong

/**
 * Resumen de los lunes: desde las 9:00 del lunes, una notificación con cuánto miraste la semana que
 * terminó, tu usuario #1 y tu hashtag #1. Los datos los manda la interfaz (syncWeek) cada vez que la
 * usas: { cur, pend, last: { week, total, user, userMs, tag, tagMs }, seen }. Si esa semana no usaste la
 * app, o si ya miraste el resumen dentro de la app, no avisa.
 */
object Weekly {

    private const val HOUR = 9
    private const val HOUR_MS = 3_600_000L

    /** Revisa cada hora si ya toca avisar (es barato: no usa la red). */
    fun schedule(ctx: Context) {
        WorkManager.getInstance(ctx).enqueueUniquePeriodicWork(
            "weekly",
            ExistingPeriodicWorkPolicy.KEEP,
            PeriodicWorkRequestBuilder<WeeklyWorker>(1, TimeUnit.HOURS).build()
        )
    }

    private fun weekOf(o: JSONObject?): Long = o?.optString("week")?.toLongOrNull() ?: 0L

    /** Las semanas se identifican por su lunes a las 0:00; se comparan con margen por los cambios de hora. */
    private fun sameWeek(a: Long, b: Long) = a > 0 && abs(a - b) < 3 * HOUR_MS

    fun check(ctx: Context) {
        val now = ZonedDateTime.now()
        val monday = now.toLocalDate().with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY))
        val from = monday.atTime(HOUR, 0).atZone(now.zone)
        // El lunes desde las 9; si el teléfono estuvo apagado, todavía el martes.
        if (now.isBefore(from) || !now.isBefore(from.plusDays(2))) return
        val target = monday.minusWeeks(1).atStartOfDay(now.zone).toInstant().toEpochMilli()
        val prefs = Store.prefs(ctx)
        if (sameWeek(prefs.getLong("weeklyNotified", 0L), target)) return
        val data = Store.week(ctx)
        if (sameWeek(data.optString("seen").toLongOrNull() ?: 0L, target)) return
        val week = listOf("cur", "pend", "last").map { data.optJSONObject(it) }.firstOrNull { sameWeek(weekOf(it), target) } ?: return
        val total = week.optLong("total")
        val user = week.optString("user")
        val tag = week.optString("tag")
        if (total < 60_000L && user.isEmpty() && tag.isEmpty()) return
        Notifs.weekly(ctx, total, user, week.optLong("userMs"), tag)
        prefs.edit().putLong("weeklyNotified", target).apply()
    }

    /** Si ya miraste el resumen en la app, la notificación sobra. */
    fun onSeen(ctx: Context) {
        val seen = Store.week(ctx).optString("seen").toLongOrNull() ?: return
        if (sameWeek(seen, Store.prefs(ctx).getLong("weeklyNotified", 0L))) Notifs.cancelWeekly(ctx)
    }

    /** «6 h 40 min», como en la app. */
    fun dur(ms: Long): String {
        val min = (ms / 60000.0).roundToLong()
        if (min < 1) return "menos de 1 min"
        if (min < 60) return "$min min"
        val rest = min % 60
        return "${min / 60} h" + if (rest > 0) " $rest min" else ""
    }
}

class WeeklyWorker(ctx: Context, params: WorkerParameters) : Worker(ctx, params) {
    override fun doWork(): Result {
        try {
            Weekly.check(applicationContext)
        } catch (e: Exception) {
            // Se vuelve a intentar en la próxima vuelta.
        }
        return Result.success()
    }
}
