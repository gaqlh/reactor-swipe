# Reactor Swipe

Extensión de **Firefox para Android** que convierte JoyReactor en un feed tipo Instagram:

- **Scroll infinito**: se acabó el botón «Siguiente página».
- **Carrusel**: los posts con varias imágenes o videos se deslizan hacia los lados.
- **Feed ↔ miniaturas** con un botón; al tocar una miniatura se abre el feed en ese post.
- **Hashtags tocables**: abren el feed de ese hashtag dentro de la app.
- **Favoritos**: categorías y hashtags, que también aparecen como «historias» arriba del Inicio.
- **Aleatorio a tu medida**: eliges qué categorías y hashtags entran y cuánto pesa cada uno. También puedes fijar la calidad mínima y la época, evitar lo que ya viste y excluir hashtags.
- **Me gusta** (corazón, o dos toques en la imagen), con historial filtrable por hashtag.
- **No me gusta**: el post no vuelve a aparecer en ningún feed. Hay un historial para restaurarlo y, si ocultas mucho de un mismo hashtag, la app te sugiere excluirlo.
- **Avisos**: cuando sale un post nuevo en un favorito con la campanita activada, llega una notificación. Al tocarla se abre «Novedades».
- **Respaldo**: exportar e importar todos tus datos en un archivo.

Todo se guarda en el teléfono. No hace falta cuenta de JoyReactor.

## Instalarla en el teléfono

Necesitas **Android 10 o superior** y **Firefox** (el normal, de Play Store). Chrome para Android no acepta extensiones.

### 1. Firmar la extensión (una sola vez por versión, gratis)

Firefox solo instala extensiones firmadas por Mozilla. Hay una opción «sin publicar» (*unlisted*): Mozilla revisa y firma el archivo automáticamente en unos minutos, pero **no** lo publica en su tienda.

1. Crea una cuenta en <https://addons.mozilla.org> e inicia sesión.
2. Entra a <https://addons.mozilla.org/developers/addon/api/key/> y pulsa **Generar nuevas credenciales**. Obtendrás un *emisor JWT* (la clave) y un *secreto JWT*.
3. En la PC, dentro de esta carpeta, ejecuta (con tus credenciales; no las compartas con nadie):

   ```powershell
   $env:WEB_EXT_API_KEY = "user:12345:678"
   $env:WEB_EXT_API_SECRET = "tu-secreto"
   npm run sign
   ```

   El archivo firmado queda en `dist/` (termina en `.xpi`).

### 2. Instalarla en Firefox para Android

1. Pasa el `.xpi` firmado al teléfono (por Drive, WhatsApp o cable USB).
2. En Firefox: **Ajustes → Acerca de Firefox** y toca el logo de Firefox **5 veces** hasta que diga que se activó el menú de depuración.
3. Vuelve a **Ajustes**. Abajo aparece **Instalar complemento desde archivo**. Elige el `.xpi` y acepta los permisos.
4. Permite las notificaciones de Firefox si Android te lo pide.

> Sin firmar se puede probar en **Firefox Nightly**: en `about:config` pon `xpinstall.signatures.required` en `false` y usa el mismo «Instalar complemento desde archivo» con `dist/reactor-swipe-0.1.0.xpi`. Mozilla no garantiza que funcione siempre, así que la versión firmada es la recomendada.

### Para que los avisos lleguen

Firefox revisa tus favoritos cada 15, 30 o 60 minutos mientras sigue abierto en segundo plano. Para que Android no lo cierre: **Ajustes de Android → Apps → Firefox → Batería → Sin restricciones**. Si Android lo cerró igual, la revisión se hace apenas vuelves a abrir la app.

## Cómo se usa

- **Abrir la app**: en joyreactor.com toca el botón flotante **Swipe**, o entra desde el menú ⋮ de Firefox → **Extensiones → Reactor Swipe**.
- **Campanita** en Favoritos o en el feed de un hashtag: avisarme de posts nuevos.
- **Icono de mezcla** (flechas cruzadas): meter ese favorito en el Aleatorio. Los pesos se ajustan en **Aleatorio → Personalizar**.
- **Ajustes** (engranaje en Favoritos): frecuencia de avisos, «todo lo nuevo» o «solo los buenos», ocultar NSFW y respaldo.

## Desarrollo

```bash
npm install
```

```bash
npm run dev
```

Abre <http://localhost:5178/app.html> (conviene en vista de móvil). El servidor local hace de intermediario con JoyReactor, porque fuera de la extensión su API y sus videos bloquean al navegador.

```bash
npm run lint
```

```bash
npm run build
```

`build` genera `dist/reactor-swipe-<versión>.xpi` sin firmar. Antes de volver a firmar, sube el número de `version` en `extension/manifest.json`.

### Estructura

| Archivo | Qué hace |
| --- | --- |
| `extension/manifest.json` | Permisos y configuración de la extensión |
| `extension/js/shared.js` | API GraphQL de JoyReactor, almacenamiento, aleatorio y revisión de novedades |
| `extension/background.js` | Alarmas, notificaciones, apertura de la app y cabecera `Referer` para los videos |
| `extension/js/app.js` + `app.html` + `app.css` | La app |
| `extension/content.js` | Botón flotante en joyreactor.com |
| `tools/dev-server.mjs` | Servidor de desarrollo con proxy |
| `tools/make_icons.py` | Genera los íconos PNG |

### Notas técnicas

- API: `https://api.joyreactor.com/graphql`. Las páginas tienen unos 10 posts y van numeradas de la más vieja (1) a la más nueva.
- Imágenes: `https://img10.joyreactor.com/pics/post/post-<id>.<ext>` (`full/` para tamaño original, `static/…jpeg` para la portada de un GIF). Los videos (`mp4/`) solo responden con `Referer: https://joyreactor.com/`, y eso lo añade `background.js`.
- Muchos hashtags son sinónimos (por ejemplo, `cat` → `cats`). Los favoritos se guardan con el nombre principal y recuerdan el sinónimo.
