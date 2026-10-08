package com.gaqlh.reactorswipe

import android.Manifest
import android.annotation.SuppressLint
import android.content.BroadcastReceiver
import android.content.Intent
import android.content.IntentFilter
import android.content.pm.PackageManager
import android.content.res.Configuration
import android.graphics.Bitmap
import android.graphics.Color
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.SystemClock
import android.content.Context
import android.provider.DocumentsContract
import android.provider.Settings
import android.view.View
import android.view.ViewGroup
import android.view.WindowManager
import android.webkit.ValueCallback
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.FrameLayout
import androidx.activity.ComponentActivity
import androidx.activity.OnBackPressedCallback
import androidx.activity.result.contract.ActivityResultContracts
import androidx.core.content.ContextCompat
import androidx.core.view.ViewCompat
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat
import androidx.webkit.WebViewAssetLoader
import org.json.JSONObject

/**
 * Pantalla única de la app: un WebView con la interfaz de Reactor Swipe.
 *
 * La interfaz se sirve desde los assets en https://joyreactor.com/__rs/ (nunca sale a la red).
 * Así la página tiene el mismo origen que JoyReactor: su API la acepta y los videos se cargan.
 * Cualquier otro enlace se abre en el navegador.
 */
class MainActivity : ComponentActivity() {

    companion object {
        const val HOST = "joyreactor.com"
        const val START_URL = "https://$HOST/__rs/app.html"
        const val EXTRA_ROUTE = "route"
        private val BG = Color.parseColor("#0F0E0D")
        /** Cuánto quedan a la vista los botones de Android en pantalla completa. */
        private const val BARS_MS = 3000L
    }

    lateinit var web: WebView
        private set
    private lateinit var root: FrameLayout
    private var fullscreen = false
    private var fileCallback: ValueCallback<Array<Uri>>? = null

    // ---- Privacidad (1.16.0, lo pidió el usuario; Ajustes › Privacidad, las dos encendidas de entrada).
    // · Tapar en apps recientes: al pasar a segundo plano se pone encima una capa del color de fondo y FLAG_SECURE, así
    //   la miniatura de recientes sale tapada; al volver se quitan (las capturas de pantalla dentro de la app siguen
    //   funcionando). En Android 13+ además setRecentsScreenshotEnabled(false).
    // · Esconder al bloquear: al apagarse la pantalla con la app abierta, la app pasa a segundo plano; al desbloquear
    //   se ve el escritorio.
    private var cover: View? = null
    private val screenOff = object : BroadcastReceiver() {
        override fun onReceive(context: Context, intent: Intent) {
            if (Intent.ACTION_SCREEN_OFF == intent.action && Store.prefs(this@MainActivity).getBoolean("privLock", true)) moveTaskToBack(true)
        }
    }
    private fun hideRecents() = Store.prefs(this).getBoolean("privRecents", true)

    /** Lo llama Bridge.setPrivacy cuando cambian los ajustes. */
    fun applyPrivacy() {
        if (Build.VERSION.SDK_INT >= 33) setRecentsScreenshotEnabled(!hideRecents())
    }

    private fun coverUp(on: Boolean) {
        if (on && hideRecents()) {
            window.addFlags(WindowManager.LayoutParams.FLAG_SECURE)
            if (cover == null) {
                cover = View(this).apply { setBackgroundColor(BG) }
                root.addView(cover, FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT))
            }
        } else {
            window.clearFlags(WindowManager.LayoutParams.FLAG_SECURE)
            cover?.let { root.removeView(it) }
            cover = null
        }
    }

    // El único archivo que pide la interfaz es el respaldo: el selector se abre en Descargas/ReactorSwipe,
    // donde lo escribe el respaldo automático (1.12.0).
    private val pickFile = registerForActivityResult(object : ActivityResultContracts.OpenDocument() {
        override fun createIntent(context: Context, input: Array<String>): Intent =
            super.createIntent(context, input).putExtra(
                DocumentsContract.EXTRA_INITIAL_URI,
                DocumentsContract.buildDocumentUri("com.android.externalstorage.documents", "primary:Download/ReactorSwipe")
            )
    }) { uri ->
        fileCallback?.onReceiveValue(if (uri != null) arrayOf(uri) else null)
        fileCallback = null
    }
    private val askNotifications = registerForActivityResult(ActivityResultContracts.RequestPermission()) { }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        Notifs.ensureChannels(this)

        WindowCompat.setDecorFitsSystemWindows(window, false)
        WindowInsetsControllerCompat(window, window.decorView).apply {
            isAppearanceLightStatusBars = false
            isAppearanceLightNavigationBars = false
        }

        root = FrameLayout(this).apply { setBackgroundColor(BG) }
        web = WebView(this).apply { setBackgroundColor(BG) }
        root.addView(web, FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT))
        setContentView(root)

        // Deja libre el espacio de las barras del sistema (y del teclado), salvo en pantalla completa.
        ViewCompat.setOnApplyWindowInsetsListener(root) { v, insets ->
            if (fullscreen) {
                v.setPadding(0, 0, 0, 0)
                // Android mostró los botones (deslizando desde el borde): quedan un rato y se vuelven a esconder.
                if (insets.isVisible(WindowInsetsCompat.Type.navigationBars())) keepBarsAWhile()
            } else {
                val bars = insets.getInsets(WindowInsetsCompat.Type.systemBars() or WindowInsetsCompat.Type.displayCutout())
                val ime = insets.getInsets(WindowInsetsCompat.Type.ime())
                v.setPadding(bars.left, bars.top, bars.right, maxOf(bars.bottom, ime.bottom))
            }
            WindowInsetsCompat.CONSUMED
        }

        web.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            mediaPlaybackRequiresUserGesture = false
            setSupportMultipleWindows(false)
            builtInZoomControls = true
            displayZoomControls = false
            allowFileAccess = false
            allowContentAccess = false
        }
        web.addJavascriptInterface(Bridge(this), "RSAndroid")

        val assets = WebViewAssetLoader.Builder()
            .setDomain(HOST)
            .addPathHandler("/__rs/", WebViewAssetLoader.AssetsPathHandler(this))
            .build()

        web.webViewClient = object : WebViewClient() {
            override fun shouldInterceptRequest(view: WebView, request: WebResourceRequest): WebResourceResponse? {
                val url = request.url
                // RedGifs (1.10.0): su API y sus archivos pasan por RedGifs.kt.
                if (url.host == HOST && url.path.orEmpty().startsWith("/__rg/")) return RedGifs.intercept(applicationContext, request)
                // Archivos de JoyReactor desde el mismo origen (1.12.0), para copiarlos a un canvas.
                if (url.host == HOST && url.path.orEmpty().startsWith("/__jr/")) return JoyFiles.intercept(request)
                return assets.shouldInterceptRequest(url)
            }

            override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest): Boolean {
                val url = request.url
                if (url.host == HOST && url.path.orEmpty().startsWith("/__rs/")) return false
                openExternal(url.toString())
                return true
            }
        }

        web.webChromeClient = object : WebChromeClient() {
            // Sin esto, un <video> que todavía no tiene su primer cuadro muestra el ícono gris de «play» de Android
            // (en el intro se veía un instante en los GIF; 1.16.0). Un punto transparente en su lugar.
            override fun getDefaultVideoPoster(): Bitmap = Bitmap.createBitmap(1, 1, Bitmap.Config.ARGB_8888)

            override fun onShowFileChooser(
                view: WebView,
                callback: ValueCallback<Array<Uri>>,
                params: FileChooserParams
            ): Boolean {
                fileCallback?.onReceiveValue(null)
                fileCallback = callback
                return try {
                    pickFile.launch(arrayOf("*/*"))
                    true
                } catch (e: Exception) {
                    fileCallback = null
                    false
                }
            }
        }

        // «Atrás» lo decide la interfaz (cerrar pantalla completa, página anterior…);
        // el historial del WebView a veces se salta páginas, por eso no se usa directamente.
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                web.evaluateJavascript("(window.RSApp && RSApp.handleBack) ? RSApp.handleBack() : 'native'") { result ->
                    when (result?.trim('"')) {
                        "handled" -> Unit
                        "exit" -> moveTaskToBack(true)
                        else -> if (web.canGoBack()) web.goBack() else moveTaskToBack(true)
                    }
                }
            }
        })

        if (savedInstanceState == null || web.restoreState(savedInstanceState) == null) {
            web.loadUrl(START_URL + routeOf(intent))
        }

        Scheduler.ensure(this)
        maybeAskNotifications(false)
        applyPrivacy()
        ContextCompat.registerReceiver(this, screenOff, IntentFilter(Intent.ACTION_SCREEN_OFF), ContextCompat.RECEIVER_NOT_EXPORTED)
    }

    override fun onDestroy() {
        try {
            unregisterReceiver(screenOff)
        } catch (e: Exception) {
            // ya no estaba
        }
        super.onDestroy()
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        val route = intent.getStringExtra(EXTRA_ROUTE) ?: return
        if (!route.startsWith("#/")) return
        web.evaluateJavascript("window.RSApp && RSApp.navigate(${JSONObject.quote(route)})", null)
    }

    override fun onResume() {
        super.onResume()
        coverUp(false)
        web.onResume()
        web.evaluateJavascript("window.RSApp && RSApp.onResume && RSApp.onResume()", null)
    }

    // Al girar el teléfono la app no se reinicia (configChanges), pero algunos teléfonos vuelven
    // a mostrar las barras del sistema: si estaba en pantalla completa, se ocultan otra vez.
    override fun onConfigurationChanged(newConfig: Configuration) {
        super.onConfigurationChanged(newConfig)
        if (fullscreen) setFullscreen(true)
    }

    override fun onPause() {
        coverUp(true)
        web.onPause()
        super.onPause()
    }

    override fun onSaveInstanceState(outState: Bundle) {
        super.onSaveInstanceState(outState)
        web.saveState(outState)
    }

    private fun routeOf(intent: Intent?): String =
        intent?.getStringExtra(EXTRA_ROUTE)?.takeIf { it.startsWith("#/") } ?: "#/home"

    fun openExternal(url: String) {
        val uri = Uri.parse(url)
        if (uri.scheme != "https" && uri.scheme != "http") return
        try {
            startActivity(Intent(Intent.ACTION_VIEW, uri).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK))
        } catch (e: Exception) {
            // No hay navegador que lo abra.
        }
    }

    /** Hasta cuándo se dejan a la vista los botones de Android en pantalla completa (reloj de uptime). */
    private var barsUntil = 0L
    /** Cuándo se escondieron las barras al entrar en pantalla completa (para no confundir eso con mostrarlas). */
    private var hiddenAt = 0L

    private val rehideBars = Runnable {
        barsUntil = 0L
        if (fullscreen) {
            hiddenAt = SystemClock.uptimeMillis()
            WindowInsetsControllerCompat(window, window.decorView).hide(WindowInsetsCompat.Type.systemBars())
        }
    }

    private fun keepBarsAWhile() {
        // Justo al esconderlas todavía llegan las medidas de antes, con los botones a la vista.
        if (SystemClock.uptimeMillis() - hiddenAt < 600) return
        barsUntil = SystemClock.uptimeMillis() + BARS_MS
        root.removeCallbacks(rehideBars)
        root.postDelayed(rehideBars, BARS_MS)
    }

    /**
     * En pantalla completa, muestra las barras del sistema (los tres botones de Android) unos segundos.
     * La interfaz lo pide al tocar la parte de abajo o subir el dedo desde ahí, para que no haga falta
     * empezar justo en la orilla.
     */
    fun peekSystemBars() {
        if (!fullscreen) return
        WindowInsetsControllerCompat(window, window.decorView).show(WindowInsetsCompat.Type.systemBars())
        hiddenAt = 0L
        keepBarsAWhile()
    }

    /**
     * Oculta (o vuelve a mostrar) las barras del sistema para el visor a pantalla completa.
     * Las barras se esconden con BEHAVIOR_DEFAULT: al deslizar desde el borde quedan fijas (no como
     * las pasajeras, que Android esconde en cuanto tocas la pantalla) y las esconde keepBarsAWhile.
     */
    fun setFullscreen(on: Boolean) {
        // Mientras los botones están a la vista a propósito, volver a pedir pantalla completa (al girar,
        // por ejemplo) no los esconde: se van solos al terminar el tiempo.
        if (on && fullscreen && SystemClock.uptimeMillis() < barsUntil) return
        fullscreen = on
        barsUntil = 0L
        root.removeCallbacks(rehideBars)
        val controller = WindowInsetsControllerCompat(window, window.decorView)
        if (on) {
            hiddenAt = SystemClock.uptimeMillis()
            controller.systemBarsBehavior = WindowInsetsControllerCompat.BEHAVIOR_DEFAULT
            controller.hide(WindowInsetsCompat.Type.systemBars())
        } else {
            controller.show(WindowInsetsCompat.Type.systemBars())
        }
        ViewCompat.requestApplyInsets(root)
    }

    /** Pide el permiso de notificaciones (Android 13+). Con force, si ya se negó, abre los ajustes. */
    fun maybeAskNotifications(force: Boolean) {
        val prefs = Store.prefs(this)
        if (Build.VERSION.SDK_INT >= 33 &&
            ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED
        ) {
            val askedBefore = prefs.getBoolean("askedNotifications", false)
            if (!force && askedBefore) return
            if (force && askedBefore && !shouldShowRequestPermissionRationale(Manifest.permission.POST_NOTIFICATIONS)) {
                openNotificationSettings()
                return
            }
            prefs.edit().putBoolean("askedNotifications", true).apply()
            askNotifications.launch(Manifest.permission.POST_NOTIFICATIONS)
        } else if (force) {
            openNotificationSettings()
        }
    }

    private fun openNotificationSettings() {
        try {
            startActivity(Intent(Settings.ACTION_APP_NOTIFICATION_SETTINGS).putExtra(Settings.EXTRA_APP_PACKAGE, packageName))
        } catch (e: Exception) {
            // Ajustes no disponibles.
        }
    }
}
