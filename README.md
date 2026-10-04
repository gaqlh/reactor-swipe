# Reactor Swipe

App de **Android** que convierte JoyReactor en un feed tipo Instagram:

- **Un post por pantalla**: deslizas hacia arriba y pasa al siguiente. Se acabó el botón «Siguiente página».
- **Carrusel**: los posts con varias imágenes o videos se deslizan hacia los lados.
- **Doble toque = pantalla completa** (sin barras); doble toque o «atrás» para salir. En pantalla completa, **un toque pausa** el video o GIF y otro lo sigue; **mantener el dedo y arrastrarlo a los lados** lo adelanta o atrasa (sensibilidad en Ajustes); el sonido empieza apagado y se prende con el **botón amarillo** (solo en videos). La barra del video es una línea mínima, como la de los GIF. Subir el dedo desde la parte de abajo muestra los botones de Android (solo un arrastre largo pasa de post). En horizontal todo se esconde y tocar abajo muestra los controles.
- **Deslizar hacia abajo** desde arriba del todo recarga la página.
- **Miniaturas** con un botón. Cada miniatura tiene su ♥ y su 👎, y al tocarla se abre ese post.
- **Abajo, cinco pestañas**: Inicio, Buscar, Aleatorio, **Seguidos** (hashtags y categorías / usuarios que sigues) y **Favoritos** (tus me gusta y el historial). Ajustes se abre con ⚙ desde Favoritos.
- **Hashtags tocables**, solo los más específicos de cada cadena (con su carpeta en chiquito) y «+N» para ver todos. Los que sigues salen como «historias» arriba del Inicio. Mantener presionado un hashtag 3 segundos lo sigue, también en pantalla completa.
- **Categorías**: en JoyReactor los hashtags forman un árbol, como carpetas (fandoms › anime › Touhou Project). La página de cada hashtag muestra dónde está («Está dentro de») y qué tiene dentro («Subcategorías»).
- **Página de cada hashtag** que abre siempre con **todos** sus posts, lo más reciente primero, o con **Barajar** en orden aleatorio. Los filtros **GIF** y **Video** de la cabecera se activan solo si los tocas.
- **Perfiles de usuario**: al tocar el autor ves todos sus posts en **miniaturas**, como en Instagram, con las pestañas **Todos**, **Videos y GIF** y **Favoritos** (los posts suyos que te gustaron: JoyReactor no deja ver los favoritos de otras personas), los botones **Seguir** y **Avisarme** (notificación cuando publique) y su **reputación** de 1 a 5 estrellas (calidad, trayectoria y actividad). Las estrellas también salen junto al nombre en cada post.
- **Inicio** muestra primero los posts nuevos de la gente que sigues, empezando por quien más me gusta te ha dado.
- **Historial de usuarios**: los últimos 50 perfiles que visitaste (Favoritos › Historial › Usuarios).
- **Resumen de la semana** (en Ajustes): los 10 usuarios y los 10 hashtags que más **tiempo** miraste, contando solo el hashtag más específico de cada post. Se calcula una vez al terminar la semana.
- **Buscar** hashtags y usuarios, con las **búsquedas recientes** como en Instagram.
- **GIF** con una barra casi transparente que solo aparece al tocar la pantalla y se arrastra para adelantar o retroceder. Los **videos** tienen pausa, barra y tiempo. Los dos tienen botón para repetir, y la etiqueta dice VIDEO cuando el post tiene sonido.
- **Aleatorio a tu medida**: eliges qué entra y cuánto pesa cada cosa. También hay calidad mínima, época, «no repetir lo ya visto» y hashtags excluidos.
- **Me gusta** con una animación del corazón, y **No me gusta** que oculta el post para siempre (los ocultos se recuperan desde Ajustes).
- **Sin posts basura**: los posts que JoyReactor retiró por derechos de autor no salen en ningún lado (antes eran cuadros vacíos de «Post de texto»). La app anota qué páginas solo tienen retirados para no volver a pedirlas, y el número de posts de un usuario o hashtag ya no los cuenta.
- **Girar el teléfono**: con un GIF o video a la vista, ponerlo horizontal lo abre en pantalla completa; al volver a vertical se cierra en el mismo post.
- **Fechas de los posts** ocultas por defecto; se activan en Ajustes.
- **Bloquear hashtags** con el botón ⊘ de cada hashtag: sus posts no salen en ningún feed ni en los avisos. La lista está en Ajustes.
- **Historial** de los posts que miraste más de 10 segundos (100 por defecto; se puede cambiar a 50, 200 o 500).
- **Estadísticas** de uso: tiempo por día y por hora, qué ves, tus hashtags y usuarios más vistos.
- **«Atrás» te deja donde estabas**: en el mismo post, en la misma vista y, si venías de pantalla completa, otra vez en pantalla completa. Si abriste un post desde las miniaturas, vuelves a ellas.
- **Avisos** de posts nuevos en los hashtags que sigues con campanita, aunque la app esté cerrada.
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
| `extension/` | La interfaz (feed, miniaturas, aleatorio, seguidos, favoritos…). También funciona como extensión de Firefox |
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
- **Sinónimos:** muchos hashtags son sinónimos (`cat` → `cats`). Los que sigues se guardan con el nombre principal.
- **Avisos:** los revisa `NewsChecker.kt` cada 15/30/60 min. La primera vez que revisa un hashtag solo toma nota de lo que hay, sin avisar.
