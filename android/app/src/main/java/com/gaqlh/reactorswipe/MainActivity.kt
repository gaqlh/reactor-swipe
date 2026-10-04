package com.gaqlh.reactorswipe

import android.Manifest
import android.annotation.SuppressLint
import android.content.Intent
import android.content.pm.PackageManager
import android.content.res.Configuration
import android.graphics.Color
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.provider.Settings
import android.view.ViewGroup
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
    }

    lateinit var web: WebView
        private set
    private lateinit var root: FrameLayout
    private var fullscreen = false
    private var fileCallback: ValueCallback<Array<Uri>>? = null

    private val pickFile = registerForActivityResult(ActivityResultContracts.GetContent()) { uri ->
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
            override fun shouldInterceptRequest(view: WebView, request: WebResourceRequest): WebResourceResponse? =
                assets.shouldInterceptRequest(request.url)

            override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest): Boolean {
                val url = request.url
                if (url.host == HOST && url.path.orEmpty().startsWith("/__rs/")) return false
                openExternal(url.toString())
                return true
            }
        }

        web.webChromeClient = object : WebChromeClient() {
            override fun onShowFileChooser(
                view: WebView,
                callback: ValueCallback<Array<Uri>>,
                params: FileChooserParams
            ): Boolean {
                fileCallback?.onReceiveValue(null)
                fileCallback = callback
                return try {
                    pickFile.launch("*/*")
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
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        val route = intent.getStringExtra(EXTRA_ROUTE) ?: return
        if (!route.startsWith("#/")) return
        web.evaluateJavascript("window.RSApp && RSApp.navigate(${JSONObject.quote(route)})", null)
    }

    override fun onResume() {
        super.onResume()
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

    private val rehideBars = Runnable {
        if (fullscreen) WindowInsetsControllerCompat(window, window.decorView).hide(WindowInsetsCompat.Type.systemBars())
    }

    /**
     * En pantalla completa, muestra un momento las barras del sistema (los tres botones de Android).
     * La interfaz lo pide al deslizar desde el borde, para que no haga falta empezar justo en la orilla.
     */
    fun peekSystemBars() {
        if (!fullscreen) return
        WindowInsetsControllerCompat(window, window.decorView).show(WindowInsetsCompat.Type.systemBars())
        root.removeCallbacks(rehideBars)
        root.postDelayed(rehideBars, 3500)
    }

    /** Oculta (o vuelve a mostrar) las barras del sistema para el visor a pantalla completa. */
    fun setFullscreen(on: Boolean) {
        fullscreen = on
        root.removeCallbacks(rehideBars)
        val controller = WindowInsetsControllerCompat(window, window.decorView)
        if (on) {
            controller.systemBarsBehavior = WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
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
