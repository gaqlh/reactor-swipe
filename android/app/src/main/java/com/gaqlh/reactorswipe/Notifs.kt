package com.gaqlh.reactorswipe

import android.Manifest
import android.annotation.SuppressLint
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import androidx.core.content.ContextCompat

object Notifs {

    private const val CHANNEL_NEWS = "news"
    private const val CHANNEL_UPDATES = "updates"
    private const val ID_NEWS = 1
    private const val ID_UPDATE = 2
    private const val ACCENT = 0xFFF5A524.toInt()

    fun ensureChannels(ctx: Context) {
        val nm = ctx.getSystemService(NotificationManager::class.java) ?: return
        nm.createNotificationChannel(
            NotificationChannel(CHANNEL_NEWS, "Posts nuevos", NotificationManager.IMPORTANCE_DEFAULT).apply {
                description = "Avisos de posts nuevos en tus favoritos"
            }
        )
        nm.createNotificationChannel(
            NotificationChannel(CHANNEL_UPDATES, "Actualizaciones", NotificationManager.IMPORTANCE_LOW).apply {
                description = "Versiones nuevas de Reactor Swipe"
            }
        )
    }

    fun canNotify(ctx: Context): Boolean {
        val granted = Build.VERSION.SDK_INT < 33 ||
            ContextCompat.checkSelfPermission(ctx, Manifest.permission.POST_NOTIFICATIONS) == PackageManager.PERMISSION_GRANTED
        return granted && NotificationManagerCompat.from(ctx).areNotificationsEnabled()
    }

    private fun open(ctx: Context, route: String, code: Int): PendingIntent {
        val intent = Intent(ctx, MainActivity::class.java)
            .putExtra(MainActivity.EXTRA_ROUTE, route)
            .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_SINGLE_TOP)
        return PendingIntent.getActivity(ctx, code, intent, PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT)
    }

    @SuppressLint("MissingPermission")
    fun news(ctx: Context, total: Int, text: String) {
        if (!canNotify(ctx)) return
        ensureChannels(ctx)
        val title = if (total == 1) "1 post nuevo en tus favoritos" else "$total posts nuevos en tus favoritos"
        val n = NotificationCompat.Builder(ctx, CHANNEL_NEWS)
            .setSmallIcon(R.drawable.ic_notification)
            .setColor(ACCENT)
            .setContentTitle(title)
            .setContentText(text)
            .setStyle(NotificationCompat.BigTextStyle().bigText(text))
            .setContentIntent(open(ctx, "#/news", ID_NEWS))
            .setAutoCancel(true)
            .setNumber(total)
            .build()
        NotificationManagerCompat.from(ctx).notify(ID_NEWS, n)
    }

    fun cancelNews(ctx: Context) {
        NotificationManagerCompat.from(ctx).cancel(ID_NEWS)
    }

    @SuppressLint("MissingPermission")
    fun update(ctx: Context, version: String) {
        if (!canNotify(ctx)) return
        ensureChannels(ctx)
        val n = NotificationCompat.Builder(ctx, CHANNEL_UPDATES)
            .setSmallIcon(R.drawable.ic_notification)
            .setColor(ACCENT)
            .setContentTitle("Reactor Swipe $version disponible")
            .setContentText("Toca para abrir la app y actualizar.")
            .setContentIntent(open(ctx, "#/home", ID_UPDATE))
            .setAutoCancel(true)
            .build()
        NotificationManagerCompat.from(ctx).notify(ID_UPDATE, n)
    }
}
