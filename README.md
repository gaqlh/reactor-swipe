# Reactor Swipe

App de **Android** que convierte JoyReactor en un feed tipo Instagram:

- **Un post por pantalla**: deslizas hacia arriba y pasa al siguiente. Se acabó el botón «Siguiente página».
- **Carrusel**: los posts con varias imágenes o videos se deslizan hacia los lados.
- **Doble toque = pantalla completa** (sin barras); doble toque o «atrás» para salir.
- **Miniaturas** con un botón. Cada miniatura tiene su ♥ y su 👎, y al tocarla se abre ese post.
- **Hashtags tocables**, y **favoritos** (categorías y hashtags) que salen como «historias» arriba del Inicio. Mantener presionado un hashtag 3 segundos lo guarda en favoritos, también en pantalla completa.
- **Página de cada hashtag** en orden aleatorio o cronológico, con filtros **GIF** y **Video** en la cabecera. Desde **Ajustes → Al abrir un hashtag** se cambia cómo vienen.
- **Perfiles de usuario**: al tocar el autor ves todos sus posts.
- **Buscar** hashtags y usuarios, con las **búsquedas recientes** como en Instagram.
- **GIF y videos** con barra para pausar, adelantar o retroceder, y botón para repetir. La etiqueta dice VIDEO cuando el post tiene sonido.
- **Aleatorio a tu medida**: eliges qué entra y cuánto pesa cada cosa. También hay calidad mínima, época, «no repetir lo ya visto» y hashtags excluidos.
- **Me gusta** con historial, y **No me gusta** que oculta el post para siempre (con historial para restaurar).
- **Historial** de los posts que miraste más de 10 segundos (100 por defecto; se puede cambiar a 50, 200 o 500).
- **Estadísticas** de uso: tiempo por día y por hora, qué ves, tus hashtags y usuarios más vistos.
- **«Atrás» te deja donde estabas**: en el mismo post, en la misma vista y, si venías de pantalla completa, otra vez en pantalla completa.
- **Avisos** de posts nuevos en tus favoritos con campanita, aunque la app esté cerrada.
- **Actualizaciones**: cuando hay versión nueva llega un aviso y son 2 toques (**Actualizar** e **Instalar**).
- **Respaldo**: exportar e importar tus datos (se guarda en Descargas).

Todo se guarda en el teléfono. No hace falta cuenta de JoyReactor.

## Instalarla (una sola vez)

1. Abre este enlace en el teléfono: **<https://github.com/gaqlh/reactor-swipe/releases/latest/download/reactor-swipe.apk>**
2. Abre el archivo descargado. Android te pedirá permitir instalar apps desde el navegador: actívalo y vuelve.
3. Toca **Instalar**. Si Play Protect avisa de «app desconocida», toca **Instalar de todos modos**.
4. Al abrirla, permite las notificaciones.

En **Favoritos → ⚙ Ajustes** aparece «Revisar con la app cerrada → Permitir». Actívalo para que los avisos lleguen a tiempo.

## Publicar una versión nueva (lo hace Claude)

```bash
npm run release
```

El comando sube el número de versión, crea la etiqueta en GitHub y espera a que GitHub Actions compile y publique la app. Los teléfonos con la app instalada reciben el aviso «versión disponible».

- `npm run release -- 1.2.0` publica una versión exacta.
- `npm run release -- --same` vuelve a publicar la versión actual.

### La clave de firma

Android solo acepta una actualización si viene firmada con la misma clave que la versión instalada. La clave está en `.secrets/` (no se sube a GitHub), con una copia en `OneDrive/Reactor Swipe/clave-de-firma (no compartir)/`. En GitHub está guardada como *secret* (`ANDROID_KEYSTORE_B64` y `ANDROID_KEYSTORE_PASSWORD`).

**No la borres:** sin ella habría que desinstalar la app y perder los datos para instalar versiones nuevas.

## Desarrollo

La interfaz es HTML/CSS/JS en `extension/` y se prueba en la PC:

```bash
npm install
```

```bash
npm run dev
```

Abre <http://localhost:5178/app.html> en vista de móvil. El servidor local hace de intermediario con JoyReactor: fuera de la app, su API y sus videos bloquean al navegador.

<http://localhost:5178/android.html> es la misma interfaz con el puente de Android simulado, para probar lo que solo pasa en la app: el botón «atrás» (`RSApp.handleBack()`), la pantalla completa, el respaldo y las actualizaciones.

| Carpeta / archivo | Qué es |
| --- | --- |
| `extension/` | La interfaz (feed, miniaturas, aleatorio, favoritos…). También funciona como extensión de Firefox |
| `extension/js/shared.js` | API GraphQL de JoyReactor, datos del usuario y aleatorio |
| `extension/js/app.js` | Pantallas y navegación |
| `android/` | App nativa: WebView con la interfaz, avisos (WorkManager), actualizaciones y pantalla completa |
| `.github/workflows/android.yml` | Compila y publica la app en GitHub |
| `tools/release.mjs` | Publica una versión nueva |
| `tools/dev-server.mjs` | Servidor de desarrollo con proxy |

### Notas técnicas

- **API:** `https://api.joyreactor.com/graphql`. Las páginas tienen unos 10 posts y van de la más vieja (1) a la más nueva.
- **Origen de la página:** la app sirve la interfaz desde sus assets en `https://joyreactor.com/__rs/` (`WebViewAssetLoader`). Con ese origen, la API acepta las peticiones y los videos (`mp4/`, que exigen el `Referer` de joyreactor.com) se cargan.
- **Imágenes:** `https://img10.joyreactor.com/pics/post/post-<id>.<ext>`. Con `full/` sale el tamaño original y con `static/…jpeg` la portada de un GIF.
- **Sinónimos:** muchos hashtags son sinónimos (`cat` → `cats`). Los favoritos se guardan con el nombre principal.
- **Avisos:** los revisa `NewsChecker.kt` cada 15/30/60 min. La primera vez que revisa un favorito solo toma nota de lo que hay, sin avisar.
