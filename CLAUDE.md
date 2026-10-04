# Reactor Swipe: guía para Claude

App de Android que muestra joyreactor.com como un feed tipo Instagram. La lee y usa una sola persona, que habla español y usa Android. Toda la interfaz y los textos van en español. Qué hace la app y cómo se instala está en `README.md`.

## Cada versión, en este orden

1. Cambiar el código: la interfaz está en `extension/` y la parte nativa en `android/`.
2. Probar en la PC con `npm run dev` y abrir <http://localhost:5178/android.html> en vista móvil. Es la interfaz con el puente de Android simulado (atrás, pantalla completa, respaldo, actualizaciones). En la PC no hay Java ni Android SDK, así que el APK solo se compila en GitHub Actions.
3. Publicar con `npm run release`. Sube `VERSION`, hace commit y etiqueta `vX.Y.Z`, espera a que Actions compile y firme el APK y genera el QR en `dist/reactor-swipe-qr.png`. Los teléfonos reciben el aviso de versión nueva.
4. Enviar el QR al usuario con SendUserFile.
5. Contar los cambios en la página de novedades (artifact), no en texto. Ver la memoria `changelog-artifact`.

## Reglas

- **Nunca perder datos del usuario.** Viven en el `localStorage` del WebView, con claves `rs:*` en el origen `https://joyreactor.com`. Se conservan al actualizar mientras no cambien el `applicationId` ni la clave de firma. Todo dato nuevo va en `DEFAULTS` (`extension/js/shared.js`) con un valor por defecto. No renombrar ni borrar claves existentes.
- **Nunca subir secretos.** El repo es público. La clave de firma está en `.secrets/` (en `.gitignore`), con copia en OneDrive y como *secrets* del repo (`ANDROID_KEYSTORE_B64`, `ANDROID_KEYSTORE_PASSWORD`, alias `reactorswipe`).
- **Las funciones nuevas grandes se proponen antes de programarlas** cuando el usuario lo pide (por ejemplo, la reputación de usuarios).
- **Decir siempre qué se probó.** Hasta ahora todo se probó solo en la simulación de la PC, nunca en un teléfono.

## Dónde está cada cosa

| Archivo | Qué hay |
| --- | --- |
| `extension/js/shared.js` | API GraphQL, normalización de posts, `DEFAULTS` y guardado, aleatorio (`randomBatch`), fuentes de GIF y videos (`createMediaSource`), búsqueda de actualizaciones |
| `extension/js/app.js` | Toda la interfaz: router por hash con pila de «atrás», clase `Feed`, visor de pantalla completa (`openViewer`), giro del teléfono (`keepPlace`, `openRotated`), hashtag (`routeTag`, `tagHero`), usuario (`routeUser`, `setFollow`, `addUserVisit`), buscador (`searchBox`), Seguidos (`routeFollowing`), Favoritos (`routeLikes`, `routeHistory`, `routeVisited`), resumen semanal (`routeWeek`), estadísticas (`recordView`, `routeStats`), ajustes |
| `extension/app.css` | Tema oscuro. Tokens en `:root`; acento `#f5a524` |
| `android/app/src/main/java/com/gaqlh/reactorswipe/` | `MainActivity` (WebView, atrás, pantalla completa), `Bridge` (puente `RSAndroid`), `NewsChecker` y `Workers` (avisos y actualizaciones), `Updater`, `Store`, `Notifs` |
| `tools/release.mjs`, `tools/make_qr.py` | Publicar y generar el QR |
| `tools/dev-server.mjs` | Servidor de desarrollo con proxy a JoyReactor y `/android.html` |

Estilo del código: JavaScript sin frameworks. Para crear y vaciar nodos se usan los helpers `h()` y `fill()` (nunca `replaceChildren(null)`, que pinta «null»). Las clases de iconos llevan el prefijo `i-`. Los comentarios van en español.

## API de JoyReactor (`https://api.joyreactor.com/graphql`)

- `tag(name){ postPager(type: NEW|GOOD|BEST|ALL){ count posts(page) } }`: 10 posts por página. La página 1 es la más vieja y la última es `ceil(count/10)`.
- `user(username: String!){ postPager … rating ratingWeek postNum goodPostNum bestPostNum }`.
- `search(query, tagNames, sortByDate, sortByRating, …){ postPager }`: máximo 1000 resultados. Aquí la página 1 es la más nueva.
- Las variables obligatorias van como `String!` (con `String` la API falla).
- Muchos hashtags son sinónimos (`cat` → `cats`): usar `mainTag`.
- Los avatares y los mp4 piden `Referer: https://joyreactor.com/`. Por eso la app sirve la interfaz desde `https://joyreactor.com/__rs/` con `WebViewAssetLoader`.
- Los GIF y los videos llegan igual (WEBM con `hasVideo`). Un video se reconoce por las etiquetas del post (`VIDEO_TAGS` en `shared.js`) y, al reproducirlo, por el sonido (`watchAudio`). Los GIF usan `scrubBar` (barra que aparece al tocar) y los videos `miniPlayer`.
- Cada post trae los números del autor (`user { rating ratingWeek postNum goodPostNum bestPostNum }`) en `p.author`; con eso `RS.reputation` calcula las estrellas: 40 % calidad, 45 % trayectoria (posts en «Bueno» y «Top» de toda su historia, escala logarítmica), 15 % actividad semanal. Los posts guardados antes de la 1.0.8 no traen `author` y se piden con `RS.fetchUserInfo`.

## Trampas conocidas

- En Android la pulsación larga se cancela sobre los enlaces: los hashtags son `<button>`, no `<a>`.
- El «atrás» de Android lo resuelve JavaScript con `RSApp.handleBack()`, que responde `handled` o `exit` (`MainActivity` usa `native` si la página no respondió). Para abrir la pantalla completa en Android no se usa `history.pushState`: solo en el navegador (`!RS.android`).
- Nombres históricos: los hashtags que el usuario **sigue** se guardan en `S.favorites` (antes la pestaña se llamaba Favoritos); la pestaña **Favoritos** de hoy son los me gusta (`S.likes`) y el historial. `#/favorites` sigue funcionando y abre Seguidos. Los usuarios seguidos van en `S.following` y los perfiles visitados en `S.userHistory` (máximo 50).
- JoyReactor no deja ver los favoritos de otro usuario (`favoritePostPager` responde «unauthorized»): la pestaña Favoritos del perfil muestra los me gusta del usuario de la app a ese autor.
- Posts retirados por derechos de autor: llegan sin `attributes` y con un `text` que es solo una imagen de `/images/censorship/` (p. ej. `copywrite.jpg`). `RS.isJunk` los saca de todos los feeds y `NewsChecker.isJunk` de los avisos.
- Las categorías son un árbol (`hierarchy` en la API: fandoms › anime › Touhou Project) y cada post lleva también las etiquetas de arriba. En la app, «categoría» = hashtag con otros dentro (`subTags`).
- Al girar el teléfono la actividad no se reinicia (`configChanges`); `keepPlace` vuelve al mismo post y a la misma imagen del carrusel (`track._idx`). Horizontal con un GIF o video a la vista abre la pantalla completa (`viewer.byRotation`) y vertical la cierra.
- Los hashtags bloqueados se guardan en `S.mix.exclude` (nombre histórico: antes era «Nunca mostrar» del Aleatorio). Se cambian siempre con `setBlocked`, que rehace los feeds guardados. Bloquear etiquetas de formato (`RS.isFormatTag`: #gif, #video…) esconde casi todos los GIF; la página del hashtag lo avisa.
- La pila de navegación es la de la app (`stack` en `app.js`). En Android, «atrás» usa `navBack()` sobre esa pila y no `history.back()`, que se desfasaba. Ir a una página que ya está en la pila (p. ej. tocar una pestaña de abajo) recorta la pila hasta ella.
- Si el panel del navegador de pruebas está oculto, se congelan `requestAnimationFrame` y los `IntersectionObserver`. Ninguna lógica debe depender solo de eso.
