# Reactor Swipe

App de **Android** que convierte JoyReactor en un feed tipo Instagram. Todo se guarda en el teléfono; no hace falta cuenta de JoyReactor.

## Qué hace

### Navegar

- **Abajo, cuatro botones**: Inicio, Buscar, **Tú** y **Ajustes**. **Aleatorio** se enciende en Ajustes › Funciones para el futuro; encendido, vuelve a la barra.
- **Tú**, como tu perfil de Instagram: arriba cuatro números (**cuentas** seguidas, **hashtags** seguidos, **me gusta** e **historial**: los dos primeros abren **Seguidos**, con Hashtags y Perfiles, y los otros dos cambian la cuadrícula de abajo); abajo, en cuadrícula, **Me gusta** (con tus carpetas) e **Historial**.
- **Descargar un post**: el botón ⬇ al lado de los comentarios (en la tarjeta y en pantalla completa) guarda las imágenes en tamaño completo y los GIF y videos como mp4 en la galería, en **Imágenes › ReactorSwipe**. Si el post tiene varias, pregunta si solo la que ves o todas.
- **Un post por pantalla**: deslizas hacia arriba y pasa al siguiente. Los posts con varias imágenes o videos se deslizan hacia los lados (carrusel con puntitos).
- **GIF y videos, en toda la app**: la barra de avance es una línea mínima que aparece al tocar (en los videos, con el tiempo) y **un toque rápido en el centro** pausa o sigue (en el feed, en el centro del video; en pantalla completa, en el centro de la pantalla). Dos toques abren la pantalla completa.
- **Arriba, como mucho dos botones**, los mismos en todas las pantallas. La vista es **un solo botón**: con un post por pantalla muestra ⊞ y pasa a miniaturas; en miniaturas muestra ▭ y vuelve a un post por pantalla.
- **La cabecera se esconde** al pasar al post siguiente (cada post gana ese alto) y vuelve al subir, aunque sea un poco.
- **Miniaturas** con un botón. Cada miniatura tiene su ♥ y su 👎, y al tocarla se abre ese post. **Me gusta** e **Historial** se abren siempre en miniaturas, limpias (sin botones), y sin botones de vista: tocar una abre el post en grande y tocar Favoritos abajo vuelve a las miniaturas. **Mantener presionada una miniatura medio segundo** (se cambia en Ajustes › Herramientas de debug) empieza a seleccionar: cada miniatura muestra una bolita, cada toque marca o desmarca y arriba quedan cuántas van, **Mover** (a una carpeta) y **Eliminar** (con Deshacer).
- **Carpetas en Me gusta**: las creas tú («Nueva» en la fila de carpetas, arriba de Me gusta). Seleccionas varios y tocas **Mover**; siguen también en Todos. Dentro de una carpeta, ⋯ cambia el nombre o la borra, y «Quitar» saca lo seleccionado.
- **Deslizar hacia abajo** desde arriba del todo recarga la página.
- **«Atrás» te deja donde estabas**: en el mismo post, en la misma vista y, si venías de pantalla completa, otra vez en pantalla completa. Si abriste un post desde las miniaturas, vuelves a ellas.
- **Inicio** muestra primero los posts nuevos de la gente que sigues y de los hashtags que sigues como cuenta (de la última semana y que no viste), empezando por quien más me gusta te ha dado. Arriba solo sale el aviso de **versión nueva**, sin tener que reiniciar la app (la busca al volver a ella y cada media hora); los demás (resumen de la semana, restaurar el respaldo) esperan en la **campanita**, que los cuenta.
- **Historias** arriba del Inicio: lo que publicaron en las **últimas 24 horas** la gente y los hashtags que sigues. El aro es naranja mientras quede algo sin ver; tocar una abre esos posts en pantalla completa, desde el primero sin ver. Como en Instagram, arriba hay una **rayita por post** que se llena (imágenes 5 s, GIF lo que duran, videos hasta el final) y pasa sola al siguiente y a la historia siguiente. Un toque a la **derecha** pasa al siguiente post, a la **izquierda** vuelve al anterior y en el **centro** pausa. En las historias los videos no se adelantan. Pasadas 24 horas desaparecen.
- **Aleatorio a tu medida**: eliges qué entra y cuánto pesa cada cosa (la línea de colores de arriba abre Personalizar). También hay calidad mínima, época, «no repetir lo ya visto» y hashtags excluidos.
- **Buscar es como el Explorar de Instagram**: una cuadrícula de posts de los hashtags que más miras (lo que miraste esta semana, tus me gusta y lo que sigues), con los GIF y videos en un cuadro alto, y de vez en cuando uno de un hashtag **nuevo para ti** (marca «✦ Nuevo»). Arriba, unas fichas: **Para ti**, tus tres hashtags más mirados y **✦ Descubrir**. Tocar un post lo abre en grande y se sigue deslizando; «atrás» vuelve a la cuadrícula. La **lupa** de arriba abre el buscador.
- **Intro al abrir la app**: tus últimos me gusta pasan en mosaico detrás del logo un segundo y medio; un toque lo salta.
- **Cruzar hashtags**: los posts que llevan varios hashtags a la vez (hasta 5), al azar como un hashtag. Se entra desde el buscador («Cruzar hashtags») o desde el ⋯ o el menú de un hashtag («Cruzar con otro hashtag…»). Arriba, cada hashtag es una ficha: tocarla lo quita y «Añadir» suma otro. JoyReactor cuenta hasta 1000 posts por búsqueda.
- **El buscador** (la lupa de Buscar) busca hashtags y usuarios, con las búsquedas recientes como en Instagram. Tolera errores de tipeo («touhuo» encuentra #Touhou Project) y encuentra palabras del medio («scarlet» → #Remilia Scarlet si ya la viste): lo exacto arriba y debajo «Parecidos». Enter abre el primero. Sin escribir muestra tus búsquedas recientes, los **perfiles que visitaste** y **Te pueden gustar** (los hashtags que más salen en tus me gusta y que no sigues, con + para seguirlos).

### Pantalla completa (doble toque)

- Sin barras del sistema; doble toque o «atrás» para salir. Arriba y abajo pasa de post.
- **Un toque rápido en el centro** pausa el video o el GIF y otro lo sigue donde quedó: la franja es la cuarta parte central de la pantalla. Un toque largo, o uno fuera de esa franja, no pausa.
- **Mantener el dedo y arrastrarlo a los lados** adelanta o atrasa. La sensibilidad (cuánto avanza al cruzar la pantalla) se elige en Ajustes › Pantalla completa.
- El sonido empieza **apagado** y se prende con el **botón amarillo**, que solo aparece en los videos.
- La barra de avance es una línea mínima que aparece al tocar; en los videos muestra además el tiempo.
- **Tocar la parte de abajo** (o subir el dedo desde ahí) muestra los **botones de Android** unos 3 segundos, sin pasar de post; solo un arrastre largo pasa al siguiente. Tampoco se esconden si tocas la pantalla mientras están.
- **Girar el teléfono**: con un GIF o video a la vista en el feed, ponerlo horizontal lo abre en pantalla completa; al volver a vertical se cierra en el mismo post. En horizontal se esconde todo (también el nombre del autor): tocar la parte de abajo muestra un momento la barra y los botones, y un toque rápido en el centro pausa.
- Las estrellas del autor y el rating del post no se muestran, ni aquí ni en el feed; se activan en Ajustes › Cómo se ve.

### Hashtags

- En cada post salen **solo los hashtags más específicos** de cada cadena, con su carpeta en chiquito al lado, sin los de formato (#gif, #video). Si quedan más de 4, «+N» muestra todos.
- **Categorías**: en JoyReactor los hashtags forman un árbol, como carpetas (fandoms › anime › Touhou Project). La página de cada hashtag muestra dónde está («Está dentro de») y qué tiene dentro («Subcategorías»).
- **Árbol de hashtags** (herramienta temporal, en Ajustes › Herramientas de debug y en el ⋯ de cada hashtag): recorre las carpetas y lo que tiene dentro cada una.
- La **página de cada hashtag** tiene pestañas: **Todos** y **Videos y GIF**, que muestra todos los posts que traen un GIF o un video, tengan o no la etiqueta #gif o #video. Un hashtag se ve siempre **al azar** (sin botón de orden); deslizar hacia abajo vuelve a barajar. Un hashtag que sigues **como cuenta** se ve como un perfil: en orden, en miniaturas y con el botón de barajar.
- Arriba tiene tres botones: **Seguir**, la **campanita** (avisos de posts nuevos) y **⋯** (ponerle un GIF, meterlo o sacarlo del Aleatorio si está encendido, ver el árbol y bloquearlo).
- **Seguir** pregunta cómo: **como hashtag** (se ve barajado, entra en tu Aleatorio y sale como «historia» arriba del Inicio; está en Seguidos › Hashtags) o **como cuenta** (se ve como el perfil de un usuario: en orden, en miniaturas y con una pestaña más, **Favoritos**, con tus me gusta de ese hashtag; está en Seguidos › Perfiles y lo nuevo va primero en Inicio). Tocar «Siguiendo» deja cambiar de forma o dejar de seguir. Al empezar a seguirlo, la app pregunta si quieres ponerle un GIF.
- **Fotos propias**: a un hashtag se le pone un **GIF o video** de sus propios posts (se elige el pedazo, de 1 a 3 segundos, que se repite); a un usuario y a un hashtag que sigues **como cuenta**, una **imagen** de sus posts (o uno de sus GIF, que queda **quieto** en el momento que elijas): los hashtags se mueven y los perfiles no. Imágenes y GIF salen juntos, **en el mismo orden que en su feed**. Para elegir hay tres pestañas: **Sus posts** (todos: se van cargando al bajar), **Tus me gusta** de esa cuenta y **Elegidas**: tocar uno lo **marca** con una bolita, y en Elegidas quedan solo los marcados (en un hashtag, **con los GIF moviéndose** para comparar) y se toca el definitivo (con uno solo, «Usar esta» va directo). Cancelar el recorte vuelve a elegir; al guardar, los demás marcados se descartan. Se recorta con un círculo (arrastrar con un dedo; alejar o acercar con dos o con la barra; alejando entra el GIF entero). Se elige desde el ⋯ de cada fila de Seguidos (o el ⋯ de la página del hashtag, o al empezar a seguirlo) y ahí mismo se cambia o se quita. El GIF de un hashtag se mueve en todos lados donde sale (historias, Buscar, Tú, Seguidos, su página). **Tocar la foto** de la cabecera de un usuario, un hashtag o una cuenta la muestra en grande.
- **Mantener presionado un hashtag** medio segundo (en un post, en pantalla completa o en las subcategorías de la cabecera) abre su menú: cuántos posts tiene, en qué carpeta está, cuántos de tus me gusta lo llevan, seguirlo (como hashtag o como cuenta) y bloquearlo, sin entrar a él.
- **Bloquear hashtags** desde ese menú o desde ⋯: sus posts no salen en ningún feed ni en los avisos (con «Deshacer»). La lista está en Ajustes.
- **Lo que sigues gana sobre lo bloqueado**: un post con un hashtag bloqueado se ve igual si lleva uno que sigues (como hashtag o como cuenta), salvo que el bloqueado esté dentro del que sigues (si sigues #anime y bloqueas #Anime Ero, #Anime Ero sigue bloqueado). Bloquear un hashtag que sigues es dejar de seguirlo (con Deshacer).
- **El número de posts** de un hashtag descuenta lo bloqueado: una subcategoría bloqueada (algo que tiene dentro) se descuenta entera, y de otros hashtags bloqueados, los posts que comparten. JoyReactor cuenta los compartidos solo hasta 1000; si llega, el número sale como «como mucho». Como lo que sigues gana, si sigues otros hashtags el número sale «al menos». Las subcategorías bloqueadas salen tachadas.

### Usuarios

- **Perfil** en miniaturas, como en Instagram, con las pestañas **Todos**, **Videos y GIF** y **Favoritos** (los posts suyos que te gustaron: JoyReactor no deja ver los favoritos de otras personas).
- Botones **Seguir** y **Avisarme** (notificación cuando publique). Al seguir a alguien, la app pregunta si quieres ponerle una foto sacada de sus posts. También se sigue sin salir del post: **Seguir** aparece al lado del nombre del autor, en la tarjeta y en pantalla completa, mientras no lo sigas.
- **Reputación** de 1 a 5 estrellas (calidad, trayectoria y actividad), plegada: se abre al tocarla. Las estrellas también salen junto al nombre en cada post.
- **Historial de perfiles**: los últimos 50 que visitaste (Buscar › Perfiles que visitaste).

### RedGifs

- **Dos fuentes**: además de JoyReactor, la app muestra posts de **RedGifs**, mezclados (uno de RedGifs cada tres de JoyReactor) en Inicio, Buscar y los hashtags. En **Ajustes › Fuentes** eliges **Las dos**, solo **JoyReactor** o solo **RedGifs**.
- **Cada post lleva un mini icono** con su fuente: **JR** (naranja) o **RG** (rosado). Con las dos fuentes lo llevan todos; con una sola, solo los de la otra.
- **Pestaña RedGifs** en cada hashtag y en cada usuario, al lado de «Videos y GIF». En un hashtag muestra la etiqueta de RedGifs del mismo nombre; en un usuario, el creador de RedGifs que **unas** con él. Arriba de la pestaña dice con qué está unido y **Cambiar** (o **Unir**) busca en RedGifs mientras escribes.
- **Mezclar**: en las cuentas (usuarios y hashtags que sigues como cuenta), un interruptor en la pestaña RedGifs mete esos posts en **Todos**, mezclados con los de JoyReactor.
- **Seguir en RedGifs**, igual que en JoyReactor: los **creadores** (en Seguidos › Perfiles) y las **etiquetas**, como hashtag (al azar, en las historias) o como cuenta (en orden y en miniaturas). Tocar una etiqueta de un post de RedGifs abre su página. Lo que sigues sale en las historias y lo nuevo, primero en Inicio.
- **Fotos propias** también para creadores y etiquetas de RedGifs (imagen quieta para los perfiles, GIF que se mueve para las etiquetas), con el mismo selector.
- Los avisos de posts nuevos son solo de JoyReactor. Los posts de RedGifs se abren en RedGifs desde el botón de comentarios.

### Favoritos, historial y estadísticas

- **Me gusta** con una animación del corazón. **No me gusta** oculta el post para siempre (los ocultos se recuperan en Ajustes).
- **Historial** de los posts que miraste más de 10 segundos (100 por defecto; se puede cambiar a 50, 200 o 500). Lo que ya está en Favoritos no sale ahí.
- **Resumen de la semana**: los 10 usuarios y los 10 hashtags que más **tiempo** miraste, contando solo el hashtag más específico de cada post. Se calcula una vez al terminar la semana. **El lunes a las 9** llega una notificación (cuánto miraste, tu usuario #1 y tu hashtag #1) que abre el resumen como **historias**. En la app hay además un aviso en la campanita de Inicio y un puntito en ⚙ hasta que lo mires; después queda en Ajustes › Resumen de la semana.
- **Estadísticas** de uso: tiempo por día y por hora, qué ves, tus hashtags y usuarios más vistos.
- **Fechas de los posts** ocultas por defecto; se activan en Ajustes › Herramientas de debug.
- **Seguidos**: cada hashtag con su campanita y **Siguiendo** (tocarlo deja de seguir, con Deshacer); debajo del nombre, cuánto pesa en tu Aleatorio. Las fotos se ven grandes; el tamaño (Chica, Mediana, Grande, Muy grande) se cambia en Herramientas de debug, y con las grandes los botones pasan debajo del nombre.
- **Ajustes** (un botón de la barra): Tu actividad, Lo que no quieres ver (hashtags bloqueados, posts ocultos, NSFW), Avisos, Cómo se ve, **Funciones para el futuro** (Aleatorio), **Herramientas de debug** (tiempo para seleccionar, tamaño de las fotos de Seguidos, fecha de los posts, árbol de hashtags) y Respaldo y versión. Las opciones de un interruptor (cada cuánto revisar, la sensibilidad) solo se ven si está encendido.

### Lo demás

- **Sin posts basura**: los posts que JoyReactor retiró por derechos de autor no salen en ningún lado. La app anota qué páginas solo tienen retirados para no volver a pedirlas, y el número de posts de un usuario o hashtag ya no cuenta los retirados ni los que JoyReactor cuenta pero no entrega.
- **Avisos** de posts nuevos en los hashtags y usuarios con campanita, aunque la app esté cerrada.
- **Actualizaciones**: cuando hay versión nueva llega un aviso y son 2 toques (**Actualizar** e **Instalar**). En Ajustes › Versión, **Actualizar** busca y, si hay una nueva, la descarga y abre el instalador.
- **Respaldo automático**: cuando cambia algo importante (o una vez al día) la app escribe un respaldo en **Descargas › ReactorSwipe**, que no se borra al desinstalar. Si reinstalas, la campanita de Inicio ofrece **Restaurar** (o Ajustes › Respaldo y versión › Restaurar) y eliges ese archivo. Ojo: desinstalar la app borra todo lo que guarda; para actualizar no hace falta desinstalar.

## Instalarla (una sola vez)

1. Abre este enlace en el teléfono: **<https://github.com/gaqlh/reactor-swipe/releases/latest/download/reactor-swipe.apk>**
2. Abre el archivo descargado. Android te pedirá permitir instalar apps desde el navegador: actívalo y vuelve.
3. Toca **Instalar**. Si Play Protect avisa de «app desconocida», toca **Instalar de todos modos**.
4. Al abrirla, permite las notificaciones.

En **Ajustes** aparece «Revisar con la app cerrada → Permitir». Actívalo para que los avisos lleguen a tiempo.

## Publicar una versión nueva (lo hace Claude)

```bash
npm run release
```

El comando sube el número de versión, crea la etiqueta en GitHub, espera a que GitHub Actions compile y publique la app y genera el QR para instalarla en `dist/reactor-swipe-qr.png`. Los teléfonos con la app instalada reciben el aviso «versión disponible».

- `npm run release -- 1.4.0` publica una versión exacta.
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

Abre <http://localhost:5178/android.html> en vista de móvil: es la interfaz con el puente de Android simulado, para probar lo que solo pasa en la app (el botón «atrás» con `RSApp.handleBack()`, la pantalla completa, los botones del sistema, el respaldo y las actualizaciones). <http://localhost:5178/app.html> es la versión de navegador. El servidor local hace de intermediario con JoyReactor: fuera de la app, su API y sus videos bloquean al navegador.

| Carpeta / archivo | Qué es |
| --- | --- |
| `extension/` | La interfaz. También funciona como extensión de Firefox |
| `extension/js/shared.js` | API GraphQL de JoyReactor, datos del usuario, aleatorio y avisos |
| `extension/js/app.js` | Pantallas, navegación y gestos |
| `extension/app.css` | Estilos (tema oscuro) |
| `android/` | App nativa: WebView con la interfaz, avisos (WorkManager), actualizaciones y pantalla completa |
| `.github/workflows/android.yml` | Compila y publica la app en GitHub |
| `tools/release.mjs` | Publica una versión nueva |
| `tools/make_qr.py` | Genera el QR para instalar |
| `tools/dev-server.mjs` | Servidor de desarrollo con proxy |

### Notas técnicas

- **API:** `https://api.joyreactor.com/graphql`. Las páginas tienen 10 posts y van de la más vieja (1) a la más nueva.
- **Origen de la página:** la app sirve la interfaz desde sus assets en `https://joyreactor.com/__rs/` (`WebViewAssetLoader`). Con ese origen, la API acepta las peticiones y los videos (`mp4/`, que exigen el `Referer` de joyreactor.com) se cargan.
- **Imágenes:** `https://img10.joyreactor.com/pics/post/post-<id>.<ext>`. Con `full/` sale el tamaño original y con `static/…jpeg` la portada de un GIF.
- **Sinónimos:** muchos hashtags son sinónimos (`cat` → `cats`). Los que sigues se guardan con el nombre principal.
- **Árbol de hashtags:** cada hashtag tiene su cadena de carpetas (`hierarchy`) y lo que tiene dentro (`tagPager`). La app guarda el árbol en el teléfono para mostrar solo lo más específico.
- **Caché:** lo que encuentra la pestaña «Videos y GIF» de cada hashtag se guarda en el teléfono (IndexedDB, aparte de tus datos). Al volver solo se pide lo nuevo.
- **Avisos:** los revisa `NewsChecker.kt` cada 15/30/60 min. La primera vez que revisa un hashtag o usuario solo toma nota de lo que hay, sin avisar.
- **RedGifs:** su API (`api.redgifs.com/v2`) pide un token temporal atado a la IP y al navegador, y sus archivos dan 403 con el `Referer` de otro sitio. Por eso la interfaz los pide como `https://joyreactor.com/__rg/api/…` y `/__rg/media/…`: en el teléfono los atiende `RedGifs.kt` (guarda el token y pide otro solo si caduca) y en la PC, `tools/dev-server.mjs`.
- **Resumen de los lunes:** la interfaz le pasa a Android el tiempo y el top de la semana (`syncWeek`) cada vez que se usa; `Weekly.kt` revisa cada hora si ya es lunes desde las 9 y avisa una vez por semana.
