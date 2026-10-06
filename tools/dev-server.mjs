// Servidor de desarrollo: sirve extension/ y hace de proxy hacia JoyReactor
// (la API bloquea navegadores de otros sitios y los videos exigen Referer de joyreactor.com;
// dentro de la extensión eso ya lo resuelven los permisos y background.js).
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { Readable } from 'node:stream';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'extension');
const PORT = Number(process.env.PORT) || 5178;
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml'
};
const MEDIA_HOST = /^img\d*\.joyreactor\.com$/;

async function readBody(req) {
  const chunks = [];
  for await (const c of req) chunks.push(c);
  return Buffer.concat(chunks);
}

async function proxyGraphql(req, res) {
  const body = await readBody(req);
  const up = await fetch('https://api.joyreactor.com/graphql', {
    method: 'POST',
    headers: { 'content-type': 'application/json', referer: 'https://joyreactor.com/' },
    body
  });
  res.writeHead(up.status, { 'content-type': up.headers.get('content-type') || 'application/json' });
  res.end(Buffer.from(await up.arrayBuffer()));
}

async function proxyMedia(req, res, url) {
  let target;
  try {
    target = new URL(url.searchParams.get('u') || '');
  } catch {
    res.writeHead(400).end('URL inválida');
    return;
  }
  if (target.protocol !== 'https:' || !MEDIA_HOST.test(target.hostname)) {
    res.writeHead(403).end('Solo imágenes de JoyReactor');
    return;
  }
  const headers = { referer: 'https://joyreactor.com/' };
  if (req.headers.range) headers.range = req.headers.range;
  // Si el navegador corta la petición (pasa mucho con videos), corto también la descarga de arriba.
  const ctrl = new AbortController();
  res.on('close', () => ctrl.abort());
  const up = await fetch(target, { headers, signal: ctrl.signal });
  const out = {};
  for (const h of ['content-type', 'content-length', 'content-range', 'accept-ranges', 'cache-control']) {
    const v = up.headers.get(h);
    if (v) out[h] = v;
  }
  res.writeHead(up.status, out);
  if (up.body) Readable.fromWeb(up.body).on('error', () => res.destroy()).pipe(res);
  else res.end();
}

// RedGifs (1.10.0): la API pide un token temporal (dura 24 h y queda atado a la IP y al User-Agent) y sus
// archivos dan 403 con Referer de otro sitio. La app los pide como /__rg/api/… y /__rg/media/…: en Android
// los atiende MainActivity con RedGifs.kt; en la PC, este proxy, igual.
const RG_UA = 'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Mobile Safari/537.36 ReactorSwipe';
let rgToken = null;
async function rgTokenGet(fresh) {
  if (!fresh && rgToken && Date.now() - rgToken.at < 20 * 3600000) return rgToken.token;
  const r = await fetch('https://api.redgifs.com/v2/auth/temporary', { headers: { 'user-agent': RG_UA } });
  if (!r.ok) throw new Error('RedGifs no dio permiso (' + r.status + ')');
  rgToken = { token: (await r.json()).token, at: Date.now() };
  return rgToken.token;
}
async function proxyRgApi(req, res, url) {
  const rest = url.pathname.slice('/__rg/api'.length);
  if (!/^\/v[12]\/[A-Za-z0-9/_.%-]+$/.test(rest)) {
    res.writeHead(403).end('Ruta de RedGifs no permitida');
    return;
  }
  let up = null;
  // Si el token caducó (401), se pide otro una sola vez.
  for (let i = 0; i < 2; i++) {
    up = await fetch('https://api.redgifs.com' + rest + url.search, { headers: { authorization: 'Bearer ' + (await rgTokenGet(i > 0)), 'user-agent': RG_UA } });
    if (up.status !== 401) break;
  }
  res.writeHead(up.status, { 'content-type': up.headers.get('content-type') || 'application/json', 'cache-control': 'no-store' });
  res.end(Buffer.from(await up.arrayBuffer()));
}
async function proxyRgMedia(req, res, url) {
  const rest = url.pathname.slice('/__rg/media'.length);
  if (!/^\/[A-Za-z0-9_.-]+$/.test(rest)) {
    res.writeHead(403).end('Archivo de RedGifs no válido');
    return;
  }
  const headers = { 'user-agent': RG_UA };
  if (req.headers.range) headers.range = req.headers.range;
  const ctrl = new AbortController();
  res.on('close', () => ctrl.abort());
  const up = await fetch('https://media.redgifs.com' + rest, { headers, signal: ctrl.signal });
  const out = {};
  for (const h of ['content-type', 'content-length', 'content-range', 'accept-ranges', 'cache-control']) {
    const v = up.headers.get(h);
    if (v) out[h] = v;
  }
  res.writeHead(up.status, out);
  if (up.body) Readable.fromWeb(up.body).on('error', () => res.destroy()).pipe(res);
  else res.end();
}

// /android.html: la misma app pero con un puente RSAndroid simulado, para probar el modo Android en la PC.
// (Las peticiones siguen pasando por el proxy porque el navegador no tiene el origen joyreactor.com.)
const ANDROID_STUB = `<script>
window.RSAndroid = {
  getVersion: () => '0.0.0-sim',
  getNews: () => '{}',
  markNewsRead() {},
  syncConfig() {},
  syncWeek(json) { window.__simWeek = JSON.parse(json); },
  notificationsAllowed: () => true,
  batteryUnrestricted: () => true,
  requestNotifications() {},
  requestBatteryExemption() {},
  setFullscreen(on) { window.__simFullscreen = on; },
  peekSystemBars() { window.__simPeek = (window.__simPeek || 0) + 1; },
  checkNow(cb) { setTimeout(() => __rsNative.resolve(cb, JSON.stringify({ total: 0, per: {} })), 50); },
  saveFile(n, c, cb) { setTimeout(() => __rsNative.resolve(cb, JSON.stringify({ ok: true, message: 'Simulado: ' + n })), 50); },
  autoBackup(c, cb) { window.__simBackup = c; setTimeout(() => __rsNative.resolve(cb, JSON.stringify({ ok: true })), 50); },
  installUpdate(u, cb) { setTimeout(() => __rsNative.resolve(cb, JSON.stringify({ ok: true })), 50); },
  saveMedia(u, n, cb) { (window.__simSaved = window.__simSaved || []).push({ url: u, name: n }); setTimeout(() => __rsNative.resolve(cb, JSON.stringify({ ok: true, name: n })), 300); }
};
window.__RS_DEV_PROXY = true;
</script>`;

function serveAndroidSim(res) {
  fs.readFile(path.join(ROOT, 'app.html'), 'utf8', (err, html) => {
    if (err) {
      res.writeHead(500).end(String(err));
      return;
    }
    res.writeHead(200, { 'content-type': TYPES['.html'], 'cache-control': 'no-store' });
    res.end(html.replace('<script src="js/shared.js"></script>', ANDROID_STUB + '\n<script src="js/shared.js"></script>'));
  });
}

function serveStatic(res, pathname) {
  const file = path.normalize(path.join(ROOT, decodeURIComponent(pathname)));
  if (!file.startsWith(ROOT)) {
    res.writeHead(403).end();
    return;
  }
  fs.readFile(file, (err, data) => {
    if (err) {
      res.writeHead(404).end('No encontrado');
      return;
    }
    res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream', 'cache-control': 'no-store' });
    res.end(data);
  });
}

http
  .createServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost');
    try {
      if (url.pathname === '/proxy/graphql' && req.method === 'POST') return await proxyGraphql(req, res);
      if (url.pathname === '/proxy/media') return await proxyMedia(req, res, url);
      if (url.pathname.startsWith('/__rg/api/')) return await proxyRgApi(req, res, url);
      if (url.pathname.startsWith('/__rg/media/')) return await proxyRgMedia(req, res, url);
      if (url.pathname === '/android.html') return serveAndroidSim(res);
      if (url.pathname === '/') {
        res.writeHead(302, { location: '/app.html' }).end();
        return;
      }
      serveStatic(res, url.pathname);
    } catch (e) {
      if (e && e.name === 'AbortError') return;
      console.error(e);
      if (!res.headersSent) res.writeHead(502);
      res.end(String(e));
    }
  })
  .listen(PORT, '127.0.0.1', () => console.log(`Reactor Swipe (desarrollo): http://localhost:${PORT}/app.html`));
