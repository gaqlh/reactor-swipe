# Reactor Swipe

App de **Android** que convierte JoyReactor en un feed tipo Instagram. Todo se guarda en el teléfono; no hace falta cuenta de JoyReactor.

## Qué hace

### Navegar

- **Abajo, cuatro botones**: Inicio, Buscar, **Tú** y **Ajustes**. **Aleatorio** se enciende en Ajustes › Funciones para el futuro; encendido, vuelve a la barra.
- **Tú**, como tu perfil de Instagram: arriba cuatro números (**cuentas** seguidas, **hashtags** seguidos, **me gusta** e **historial**: los dos primeros abren **Seguidos**, con Hashtags y Perfiles, y los otros dos cambian la cuadrícula de abajo); abajo, en cuadrícula, **Me gusta** (con tus carpetas) e **Historial**.
- **Descargar un post**: el botón ⬇ al lado de los comentarios (en la tarjeta y en pantalla completa) guarda las imágenes en tamaño completo y los GIF y videos como mp4 en la galería, en **Imágenes › ReactorSwipe**. Si el post tiene varias, pregunta si solo la que ves o todas.
- **Un post por pantalla**: deslizas hacia arriba y pasa al siguiente. Los posts con varias imágenes o videos se deslizan hacia los lados (carrusel con puntitos).
- **GIF y videos, en toda la app**: la barra de avance es una línea mínima que aparece al tocar (en los videos, con el tiempo) y **un toque rápido en el centro** pausa o sigue (en el feed, en el centro del video; en pantalla completa, en el centro de la pantalla). Dos toques abren la pantalla completa.
- **Arriba, como mucho dos botones**, los mismos en todas las pantallas. **Inicio, Aleatorio y Novedades** son un post por pantalla; todo lo demás son **miniaturas**, y un toque en una abre la **pantalla completa**.
- **La cabecera se esconde** al pasar al post siguiente (cada post gana ese alto) y vuelve al subir, aunque sea un poco.
- **Miniaturas** con un botón. Cada miniatura tiene su ♥ y su 👎, y al tocarla se abre en pantalla completa. **Tú** es como un perfil: tus cinco números (el quinto, el tiempo de **hoy**, abre las **Estadísticas**) y «No has publicado nada aún»; **Me gusta**, **Historial** y lo que sigues se abren tocando su número (Me gusta e Historial, en miniaturas limpias, sin botones). **Mantener presionada una miniatura medio segundo** (se cambia en Ajustes › Herramientas de debug) empieza a seleccionar: cada miniatura muestra una bolita, cada toque marca o desmarca y arriba quedan cuántas van, **Mover** (a una carpeta) y **Eliminar** (con Deshacer). Al desmarcar la última se sale sola de la selección.
- **Carpetas en Me gusta**: las creas tú («Nueva» en la fila de carpetas, arriba de Me gusta). Seleccionas varios y tocas **Mover**; siguen también en Todos. Dentro de una carpeta, ⋯ cambia el nombre o la borra, y «Quitar» saca lo seleccionado.
- **Deslizar hacia abajo** desde arriba del todo recarga la página.
- **«Atrás» te deja donde estabas**: en el mismo post, en la misma vista y, si venías de pantalla completa, otra vez en pantalla completa. Si abriste un post desde las miniaturas, vuelves a ellas.
- **Perfiles y hashtags se abren en miniaturas**, y en ellos «atrás» va por pasos: cierra la pantalla completa (quedas en el mismo post y en la vista en que estabas), después pasa de un post por pantalla a las miniaturas, después vuelve al principio de la página y recién ahí sale.
- **Inicio** muestra solo los posts de las **cuentas de RedGifs que sigues** (creadores y etiquetas que sigues como cuenta), del más nuevo al más viejo (lo general está en Buscar), **intercalando las cuentas**: no salen dos seguidos de la misma mientras otra tenga posts (con tres o más, tampoco con uno solo en medio). Además, **3 de cada 10 posts son de creadores que no sigues**, de las etiquetas de RedGifs que más consumes (las que sigues, tus me gusta, tu historial y lo que miras), con la marca «Te puede gustar · #etiqueta» y su botón Seguir. **Lo que ya viste no vuelve a salir** al abrir la app otra vez: siguen los posts siguientes de tus cuentas (para ver otra vez lo visto, entra a su perfil). Cada post lleva **su fecha**, como en el perfil de las cuentas que sigues. Lo que publicaron en las últimas 24 horas es solo **historia**: pasa a Inicio y a su perfil cuando deja de serlo. El aviso de **versión nueva** es una **línea fina encima de la barra de abajo** («Versión X lista · Actualizar ✕»): se va sola a los pocos segundos y vuelve la próxima vez que abras la app (la busca al abrir, al volver a ella y cada media hora). Los demás avisos (resumen de la semana, tu mes en historias, restaurar el respaldo) esperan en la **campanita**, que los cuenta.
- **Historias** arriba del Inicio: lo que publicaron en las **últimas 24 horas** la gente y los hashtags que sigues. El aro es naranja mientras quede algo sin ver; tocar una abre esos posts en pantalla completa, desde el primero sin ver. Como en Instagram, arriba hay una **rayita por post** que se llena (imágenes 5 s, GIF lo que duran, videos hasta el final) y pasa sola al siguiente y a la historia siguiente. Un toque a la **derecha** pasa al siguiente post, a la **izquierda** vuelve al anterior y en el **centro** pausa. En las historias los videos no se adelantan ni se pausan, y solo quedan los botones de «no me gusta» y del sonido (si tiene). **Deslizar a la izquierda** pasa a la historia de la cuenta siguiente, **a la derecha** a la anterior, y **hacia abajo** cierra. En el perfil de un creador de RedGifs que sigues, si tiene historia la foto lleva el aro y tocarla la abre. Pasadas 24 horas desaparecen. La fila y las **fotos de perfil** de lo que sigues quedan **guardadas en el teléfono**: al abrir la app salen enseguida, sin bajarlas otra vez.
- **Aleatorio a tu medida**: eliges qué entra y cuánto pesa cada cosa (la línea de colores de arriba abre Personalizar). También hay calidad mínima, época, «no repetir lo ya visto» y hashtags excluidos.
- **Buscar es como el Explorar de Instagram**: una cuadrícula de posts de los hashtags que más miras (lo que miraste esta semana, tus me gusta y lo que sigues), con los GIF y videos en un cuadro alto, y de vez en cuando uno de un hashtag **nuevo para ti** (marca «✦ Nuevo»). Lo de RedGifs son **videos de creadores** (verticales y con sonido, como los de una cuenta personal), no GIF sueltos. **Entre el 30 y el 40 % de lo que se ve se mueve**: los GIF y videos (de JoyReactor y de RedGifs) elegidos al azar repiten sus **primeros segundos** (5 con Wi-Fi, 3 con datos móviles; solo se baja ese pedazo); al bajar, se sueltan los que salen y se mueven otros. Tocar un post lo abre entero en pantalla completa y se sigue deslizando; «atrás» vuelve a la cuadrícula. La **lupa** de arriba abre el buscador.
- **Intro al abrir la app**: tus últimos me gusta pasan en mosaico detrás del logo (un segundo y medio; un toque lo salta). Las miniaturas quedan guardadas en el teléfono, así se ven al instante sin bajarlas al abrir, y hasta **cuatro** de tus GIF se mueven: justo arriba, abajo, a la izquierda y a la derecha del logo (se guardan sus primeros 3 segundos). Lo que deja de estar entre tus últimos me gusta se borra del teléfono. En Ajustes › Herramientas de debug › Intro al abrir eliges cuánto dura (0,8 a 4 s) y lo ves sin reiniciar la app.
- **Cruzar hashtags**: los posts que llevan varios hashtags a la vez (hasta 5), al azar como un hashtag. Se entra desde el buscador («Cruzar hashtags») o desde el ⋯ o el menú de un hashtag («Cruzar con otro hashtag…»). Arriba, cada hashtag es una ficha: tocarla lo quita y «Añadir» suma otro. JoyReactor cuenta hasta 1000 posts por búsqueda.
- **El buscador** (la lupa de Buscar) busca hashtags y usuarios, con las búsquedas recientes como en Instagram. Con RedGifs encendido busca también sus etiquetas y creadores, y cada resultado lleva su fuente (**JR** o **RG**), separado en **Cuentas** y **Hashtags**. Para encontrar una cuenta de RedGifs basta escribir su nombre, aunque sea con algún error (o pegar el enlace `redgifs.com/users/…`); las **verificadas** llevan una estrellita. **Buscar** (Enter) esconde el teclado y deja la lista de resultados; no abre ninguno solo. Tolera errores de tipeo («touhuo» encuentra #Touhou Project) y encuentra palabras del medio («scarlet» → #Remilia Scarlet si ya la viste): lo exacto arriba y debajo «Parecidos». Sin escribir muestra tus búsquedas recientes, los **perfiles que visitaste** y **Te pueden gustar** (los hashtags que más salen en tus me gusta y que no sigues, con + para seguirlos).

### Pantalla completa (doble toque)

- Sin barras del sistema; doble toque o «atrás» para salir. Arriba y abajo pasa de post.
- **Un toque rápido en el centro** pausa el video o el GIF y otro lo sigue donde quedó: la franja es la cuarta parte central de la pantalla. Un toque largo, o uno fuera de esa franja, no pausa.
- **Mantener el dedo y arrastrarlo a los lados** adelanta o atrasa. La sensibilidad (cuánto avanza al cruzar la pantalla) se elige en Ajustes › Pantalla completa. Mientras arrastras (aquí o en la barrita), el video salta entre sus «cuadros completos», que se muestran al instante, y al soltar va al segundo exacto; el video queda quieto hasta que sueltas.
- La **foto del autor** va al lado de su nombre, con **Seguir** si no lo sigues. **Si el post lleva el hashtag de una cuenta que sigues** (un hashtag seguido como cuenta, de JoyReactor o de RedGifs), arriba sale **la cuenta** en vez de quien lo subió, y con varias, **juntas como en Instagram** («Sweetie Fox y Lana Rhoades», con las fotos encimadas; tocar el nombre deja elegir a cuál ir). Quien lo subió queda en chiquito al lado de la fecha, y el hashtag de la cuenta ya no sale entre los hashtags del post. Igual en el feed y en las historias. El nombre, Seguir y los hashtags se ven siempre con el teléfono vertical (también en las historias); en horizontal se esconden.
- El sonido empieza **apagado** cada vez que entras (en Ajustes › Cómo se ve › Recordar el sonido puede seguir como lo dejaste) y se prende con el botón de la bocina, que solo aparece en los videos.
- **Privacidad** (Ajustes › Privacidad, encendidas de entrada): la app sale **tapada en las apps recientes** y, si bloqueas el teléfono con la app abierta, se pone **negra en el acto** y al desbloquearlo queda **en segundo plano** (si el teléfono la deja adelante, se ve negra hasta que la vuelves a abrir; un toque la destapa).
- Los videos de RedGifs se ven en **alta calidad** (1080p) en pantalla completa y en las historias; en el feed, en calidad de teléfono para gastar menos.
- La barra de avance es una línea mínima que aparece al tocar; en los videos muestra además el tiempo.
- **Tocar la parte de abajo** (o subir el dedo desde ahí) muestra los **botones de Android** unos 3 segundos, sin pasar de post; solo un arrastre largo pasa al siguiente. Tampoco se esconden si tocas la pantalla mientras están.
- **Girar el teléfono**: con un GIF o video a la vista en el feed, ponerlo horizontal lo abre en pantalla completa; al volver a vertical se cierra en el mismo post. En horizontal se esconde todo (también el nombre del autor): tocar la parte de abajo muestra un momento la barra y los botones, y un toque rápido en el centro pausa.
- Las estrellas del autor y el rating del post no se muestran, ni aquí ni en el feed; se activan en Ajustes › Cómo se ve.

### Hashtags

- En cada post salen **solo los hashtags más específicos** de cada cadena, con su carpeta en chiquito al lado, sin los de formato (#gif, #video). Si quedan más de 4, «+N» muestra todos.
- **Categorías**: en JoyReactor los hashtags forman un árbol, como carpetas (fandoms › anime › Touhou Project). La página de cada hashtag muestra dónde está («Está dentro de») y qué tiene dentro («Subcategorías»).
- **Árbol de hashtags** (herramienta temporal, en Ajustes › Herramientas de debug y en el ⋯ de cada hashtag): recorre las carpetas y lo que tiene dentro cada una.
- La **página de cada hashtag** tiene pestañas: **Todos** y **Videos y GIF**, que muestra todos los posts que traen un GIF o un video, tengan o no la etiqueta #gif o #video. Un hashtag se ve siempre **al azar** (sin botón de orden) y se abre en miniaturas; deslizar hacia abajo vuelve a barajar. Un hashtag que sigues **como cuenta** se ve como un perfil: en orden, en miniaturas y con el botón de barajar.
- Arriba tiene tres botones: **Seguir**, la **campanita** (avisos de posts nuevos) y **⋯** (ponerle un GIF, meterlo o sacarlo del Aleatorio si está encendido, ver el árbol y bloquearlo).
- **Seguir** pregunta cómo: **como hashtag** (se ve barajado, entra en tu Aleatorio y sale como «historia» arriba del Inicio; está en Seguidos › Hashtags) o **como cuenta** (se ve como el perfil de un usuario: en orden, en miniaturas y con una pestaña más, **Favoritos**, con tus me gusta de ese hashtag; está en Seguidos › Perfiles y lo nuevo va primero en Inicio). Tocar «Siguiendo» deja cambiar de forma o dejar de seguir. Al empezar a seguirlo, la app pregunta si quieres ponerle un GIF.
- **Buscar dentro de un perfil**: la **lupa** de la cabecera (en usuarios y cuentas, de JoyReactor y de RedGifs) abre una barra bajo las pestañas con los hashtags que más usa, en **círculos con su foto** (la que le pusiste, la del hashtag o la de uno de sus posts) y el nombre debajo. Tocar uno muestra solo esos posts (se pueden juntar varios) y escribir busca en sus posts (en JoyReactor, en el texto y los hashtags; en RedGifs solo se puede por hashtags: lo escrito se usa como hashtag). Mientras escribes salen también los hashtags que existen con ese nombre, para tocarlos. Vale en todas las pestañas, también en Favoritos. Cerrar la lupa vuelve a todo.
- **Fotos propias**: a un hashtag se le pone un **GIF o video** de sus propios posts (se elige el pedazo, de 1 a 3 segundos, que se repite); a un usuario y a un hashtag que sigues **como cuenta**, una **imagen** de sus posts (o uno de sus GIF, que queda **quieto** en el momento que elijas): los hashtags se mueven y los perfiles no. Imágenes y GIF salen juntos, **en el mismo orden que en su feed**. Para elegir hay tres pestañas: **Sus posts** (todos: se van cargando al bajar), **Tus me gusta** de esa cuenta y **Elegidas**: tocar uno lo **marca** con una bolita, y en Elegidas quedan solo los marcados (en un hashtag, **con los GIF moviéndose** para comparar) y se toca el definitivo (con uno solo, «Usar esta» va directo). Cancelar el recorte vuelve a elegir; al guardar, los demás marcados se descartan. Se recorta con un círculo (arrastrar con un dedo; alejar o acercar con dos o con la barra; alejando entra el GIF entero). Se elige desde el ⋯ de cada fila de Seguidos (o el ⋯ de la página del hashtag, o al empezar a seguirlo) y ahí mismo se cambia o se quita. El GIF de un hashtag se mueve en todos lados donde sale (historias, Buscar, Tú, Seguidos, su página). Al guardar una foto, el recorte se guarda en el teléfono como imagen (así una foto quieta nunca se mueve y se ve sin internet) y entra en el respaldo. **Tocar la foto** de la cabecera de un usuario, un hashtag o una cuenta la muestra en grande.
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

- **De dónde es cada post**: el **logo** de JoyReactor (la carita naranja) o de RedGifs (RG rojo) va arriba a la derecha del post, en el feed y en pantalla completa. Los mismos logos marcan la fuente en el buscador y en las pestañas.
- **Hashtags que sigues como cuenta** (de JoyReactor o de RedGifs): las mismas pestañas que una cuenta, con su nombre; barajar va arriba, al lado de la lupa.
- **Perfiles de RedGifs** (cuentas y etiquetas que sigues como cuenta) con las mismas pestañas que los de JoyReactor: **Todos**, **Videos y GIF**, **JoyReactor** (el usuario o hashtag con el que lo uniste, con «Mezclar con RedGifs en Todos») y **Favoritos** (tus me gusta).
- **Dos fuentes**: además de JoyReactor, la app muestra posts de **RedGifs**, mezclados (uno de RedGifs cada tres de JoyReactor) en Inicio, Buscar y los hashtags. En **Ajustes › Fuentes** eliges **Las dos**, solo **JoyReactor** o solo **RedGifs**.
- **Cada post lleva el logo** de su fuente.
- **Pestaña RedGifs** en cada hashtag y en cada usuario, al lado de «Videos y GIF». En un hashtag muestra la etiqueta de RedGifs del mismo nombre; en un usuario, el creador de RedGifs que **unas** con él. Arriba de la pestaña dice con qué está unido y **Cambiar** (o **Unir**) busca en RedGifs mientras escribes.
- **Mezclar**: en las cuentas (usuarios y hashtags que sigues como cuenta), un interruptor en la pestaña RedGifs mete esos posts en **Todos**, mezclados con los de JoyReactor.
- **Seguir en RedGifs**, igual que en JoyReactor: los **creadores** (en Seguidos › Perfiles) y las **etiquetas**, como hashtag (al azar, en las historias) o como cuenta (en orden y en miniaturas). Tocar una etiqueta de un post de RedGifs abre su página. Lo que sigues sale en las historias y lo nuevo, primero en Inicio.
- **Fotos propias** también para creadores y etiquetas de RedGifs (imagen quieta para los perfiles, GIF que se mueve para las etiquetas), con el mismo selector.
- Los avisos de posts nuevos son solo de JoyReactor. Los posts de RedGifs se abren en RedGifs desde el botón de comentarios.

### Favoritos, historial y estadísticas

- **Me gusta** con una animación del corazón. **No me gusta** oculta el post para siempre (los ocultos se recuperan en Ajustes).
- **Historial** de los posts que miraste más de 10 segundos (100 por defecto; se puede cambiar a 50, 200 o 500). Lo que ya está en Favoritos no sale ahí.
- **Resumen de la semana**: los 10 usuarios y los 10 hashtags que más **tiempo** miraste, contando solo el hashtag más específico de cada post. Se calcula una vez al terminar la semana. **El lunes a las 9** llega una notificación (cuánto miraste, tu usuario #1 y tu hashtag #1) que abre el resumen como **historias**. En la app hay además un aviso en la campanita de Inicio y un puntito en ⚙ hasta que lo mires; después queda en Ajustes › Resumen de la semana.
- **Estadísticas** (en Tú, tocando el número «hoy»): cuarenta datos en ocho grupos (Tiempo, Lo que miras, Tus gustos, Me gusta, Lo que sigues, Búsquedas y descargas, Datos y teléfono, Curiosidades), con botones arriba para saltar a cada grupo. Tiempo hoy, en la semana, el mes y en total, gráficos de 7 y 30 días, a qué hora, racha, sesiones y récords; posts vistos, tipos, JoyReactor contra RedGifs, segundos por post, videos vistos enteros, pantalla completa, de dónde viene lo que ves e historias; tus hashtags y cuentas por tiempo (semana, mes, siempre), los que subieron y bajaron, los nuevos del mes, categorías, los 5 que te describen y qué miras de día y de noche; me gusta por día, por carpeta, sus hashtags y cuentas, el primero y el último; lo que sigues, lo que más publica y lo que casi no miras; búsquedas y descargas; datos usados, ahorrados en Explorar y espacio en el teléfono; y **tu mes en historias** (también avisado en la campanita la primera semana de cada mes). Todo se mide en el teléfono y entra en el respaldo.
- **Fechas de los posts** ocultas por defecto; se activan en Ajustes › Herramientas de debug.
- **Seguidos**: cada hashtag con su campanita y **Siguiendo** (tocarlo deja de seguir, con Deshacer); debajo del nombre, cuánto pesa en tu Aleatorio. Las fotos se ven grandes; el tamaño (Chica, Mediana, Grande, Muy grande) se cambia en Herramientas de debug, y con las grandes los botones pasan debajo del nombre.
- **Ajustes** (un botón de la barra): Tu actividad, Lo que no quieres ver (hashtags bloqueados, posts ocultos, NSFW), Avisos, Cómo se ve, **Funciones para el futuro** (Aleatorio), **Herramientas de debug** (tiempo para seleccionar, tamaño de las fotos de Seguidos, fecha de los posts, duración del intro, árbol de hashtags) y Respaldo y versión. Las opciones de un interruptor (cada cuánto revisar, la sensibilidad) solo se ven si está encendido.

### Lo demás

- **Consume menos**: en el feed quedan cargados solo el post que ves, los dos anteriores y los dos siguientes (que se **precargan** para que al llegar ya se vean bien); los demás dejan de descargarse. La pantalla completa hace lo mismo.
- **Sin posts basura**: los posts que JoyReactor retiró por derechos de autor no salen en ningún lado. La app anota qué páginas solo tienen retirados para no volver a pedirlas, y el número de posts de un usuario o hashtag ya no cuenta los retirados ni los que JoyReactor cuenta pero no entrega.
- **Avisos** de posts nuevos en los hashtags y usuarios con campanita, aunque la app esté cerrada.
- **Actualizaciones**: cuando hay versión nueva sale una línea fina encima de la barra de abajo y son 2 toques (**Actualizar** e **Instalar**). En Ajustes › Versión, **Actualizar** busca y, si hay una nueva, la descarga y abre el instalador.
- **Respaldo automático**: cuando cambia algo importante (o una vez al día) la app escribe un respaldo en **Descargas › ReactorSwipe**, que no se borra al desinstalar. Lleva todo: me gusta, lo que sigues (también lo de RedGifs), carpetas y las fotos ya recortadas. Si reinstalas, la campanita de Inicio ofrece **Restaurar** (o Ajustes › Respaldo y versión › Restaurar) y el selector se abre en esa carpeta. Restaurar **suma** el respaldo a lo que ya tienes: no se pierde nada de ninguno de los dos. Si al reinstalar Android te devuelve una copia vieja de tus datos (la guarda en tu cuenta de Google), la app se da cuenta y la campanita ofrece sumar el respaldo más nuevo. Ojo: desinstalar la app borra todo lo que guarda; para actualizar no hace falta desinstalar.

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
