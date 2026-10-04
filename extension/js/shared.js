/* Reactor Swipe — código compartido entre la app y el proceso de fondo.
 * Habla con la API GraphQL de JoyReactor, normaliza los posts y guarda los datos del usuario. */
(function (g) {
  'use strict';

  const RS = (g.RS = g.RS || {});
  const ext = typeof browser !== 'undefined' && browser.runtime && browser.runtime.id ? browser : null;
  RS.ext = ext;
  RS.isExtension = !!ext;
  // Dentro de la app de Android existe el puente nativo «RSAndroid».
  const android = g.RSAndroid || null;
  RS.android = android;

  // En la extensión y en la app se habla directo con JoyReactor;
  // en modo desarrollo todo pasa por el proxy local de tools/dev-server.mjs.
  const direct = !!(ext || android) && !g.__RS_DEV_PROXY;
  const API_URL = direct ? 'https://api.joyreactor.com/graphql' : '/proxy/graphql';
  const IMG = 'https://img10.joyreactor.com/pics/post/';
  const PAGE_SIZE = 10;
  RS.SITE = 'https://joyreactor.com';

  RS.TYPES = [
    { id: 'NEW', label: 'Nuevo' },
    { id: 'GOOD', label: 'Bueno' },
    { id: 'BEST', label: 'Top' },
    { id: 'ALL', label: 'Todo' }
  ];
  RS.validType = (t) => (RS.TYPES.some((x) => x.id === t) ? t : null);

  // ---------------------------------------------------------------- Actualizaciones

  RS.REPO = 'gaqlh/reactor-swipe';
  RS.APK_URL = 'https://github.com/' + RS.REPO + '/releases/latest/download/reactor-swipe.apk';
  RS.version = () => (android ? android.getVersion() : ext ? ext.runtime.getManifest().version : 'desarrollo');

  // Llamadas asíncronas al puente nativo: Android responde con window.__rsNative.resolve(id, json).
  const pending = {};
  let seq = 0;
  g.__rsNative = {
    resolve(id, json) {
      const p = pending[id];
      if (!p) return;
      delete pending[id];
      let v = null;
      try {
        v = JSON.parse(json);
      } catch (e) {
        v = null;
      }
      if (v && v.error) p.reject(new Error(v.error));
      else p.resolve(v);
    }
  };
  RS.native = function (method, ...args) {
    return new Promise((resolve, reject) => {
      if (!android || typeof android[method] !== 'function') return reject(new Error('Función no disponible'));
      const id = 'n' + ++seq;
      pending[id] = { resolve, reject };
      try {
        android[method](...args.map(String), id);
      } catch (e) {
        delete pending[id];
        reject(e);
      }
    });
  };

  function cmpVersion(a, b) {
    const pa = String(a).split('.').map(Number);
    const pb = String(b).split('.').map(Number);
    for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
      const d = (pa[i] || 0) - (pb[i] || 0);
      if (d) return d;
    }
    return 0;
  }

  /** App de Android: devuelve { version, url } si hay una versión publicada más nueva; si no, null. */
  RS.checkForUpdate = async function () {
    if (!android) return null;
    const res = await fetch('https://api.github.com/repos/' + RS.REPO + '/releases/latest', { headers: { accept: 'application/vnd.github+json' }, cache: 'no-store' });
    if (!res.ok) return null;
    const rel = await res.json();
    const version = String(rel.tag_name || '').replace(/^v/, '');
    const apk = (rel.assets || []).find((a) => a.name === 'reactor-swipe.apk');
    return apk && cmpVersion(version, RS.version()) > 0 ? { version, url: apk.browser_download_url } : null;
  };

  // ---------------------------------------------------------------- API

  async function gql(query, variables) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 30000);
    let res;
    try {
      res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ query, variables: variables || {} }),
        signal: ctrl.signal
      });
    } catch (e) {
      throw new Error(e && e.name === 'AbortError' ? 'JoyReactor está tardando demasiado en responder.' : 'No pude conectar con JoyReactor. Revisa tu conexión.');
    } finally {
      clearTimeout(timer);
    }
    if (!res.ok) throw new Error('JoyReactor respondió con error ' + res.status);
    const json = await res.json();
    if (json.errors && !json.data) throw new Error(json.errors[0].message);
    return json.data || {};
  }
  RS.gql = gql;

  const POST_FIELDS = `id createdAt rating commentsCount nsfw unsafe text
    user { id username rating ratingWeek postNum goodPostNum bestPostNum }
    tags { name }
    attributes {
      type
      ... on PostAttributePicture { id image { width height type hasVideo } }
      ... on PostAttributeEmbed { id value image { width height type hasVideo } }
    }`;
  RS.POST_FIELDS = POST_FIELDS;

  function numId(gid) {
    try {
      return Number(atob(gid).split(':').pop()) || 0;
    } catch (e) {
      return 0;
    }
  }
  RS.numId = numId;

  function cleanText(html) {
    if (!html) return '';
    const txt = String(html)
      .replace(/&attribute_insert_\d+&/g, ' ')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n')
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#0?39;/g, "'")
      .replace(/&amp;/g, '&')
      .replace(/[ \t]+/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    return txt.length > 700 ? txt.slice(0, 700) + '…' : txt;
  }

  // Un GIF y un video llegan con el mismo formato; se distinguen por las etiquetas del post
  // (y, al reproducirlo, si tiene sonido: ver app.js).
  const VIDEO_TAGS = new Set(['video', 'videos', 'video with sound', 'with sound', 'sound', 'webm', 'coub', 'youtube', 'видео', 'со звуком', 'звук', 'видео со звуком']);

  /** Números del autor que sirven para su reputación (o null si el post no los trae). */
  function authorStats(u) {
    if (!u || u.postNum == null) return null;
    // Algunas cuentas (p. ej. «anon») traen números negativos de posts buenos: cuentan como cero.
    const n = (v) => Math.max(0, v || 0);
    return { rating: Math.round((u.rating || 0) * 10) / 10, week: Math.round((u.ratingWeek || 0) * 10) / 10, posts: n(u.postNum), good: n(u.goodPostNum), best: n(u.bestPostNum) };
  }

  // ---- Reputación de un usuario: de 1 a 5 estrellas, de a media estrella.
  // 40 % calidad: qué parte de sus posts llegó a «Bueno» (20 % = 2★, 40 % = 3★, 60 % = 4★, 80 % o más = 5★).
  // 45 % trayectoria: cuántos posts suyos llegaron a «Bueno» y a «Top» en toda su historia; los Top cuentan
  //       doble (10 = 2★, 100 = 3★, 1.000 = 4★, 10.000 = 5★). Así pesan mucho los posts antiguos bien votados.
  // 15 % actividad: el rating que ganó esta semana (10 = 2★, 100 = 3★, 1.000 = 4★, 10.000 = 5★).
  RS.REP_WEIGHTS = { quality: 0.4, career: 0.45, activity: 0.15 };
  const clampStars = (x) => Math.max(1, Math.min(5, x));
  RS.reputation = function (a) {
    if (!a || !(a.posts > 0)) return null;
    // Posts guardados antes de la 1.0.9 pueden traer números negativos (ver authorStats).
    const good = Math.max(0, a.good || 0);
    const best = Math.max(0, a.best || 0);
    const quality = clampStars(1 + good / a.posts / 0.2);
    const career = clampStars(1 + Math.log10(1 + good + best));
    const activity = clampStars(1 + Math.log10(1 + Math.max(0, a.week)));
    const W = RS.REP_WEIGHTS;
    const raw = W.quality * quality + W.career * career + W.activity * activity;
    return { stars: Math.round(raw * 2) / 2, raw, quality, career, activity };
  };

  // JoyReactor retira algunos posts por derechos de autor: llegan sin imágenes y con un único
  // texto, una imagen de aviso de /images/censorship/ (p. ej. copywrite.jpg).
  const CENSORED = /\/images\/censorship\//i;

  RS.normalizePost = function (p) {
    const media = [];
    const isVideoPost = (p.tags || []).some((t) => VIDEO_TAGS.has(String(t.name).toLowerCase()));
    for (const a of p.attributes || []) {
      const im = a.image || {};
      const id = numId(a.id);
      if (a.type === 'PICTURE') {
        // real: video de verdad (el post tiene la etiqueta «video»); si no, es un GIF convertido a video.
        if (im.hasVideo) media.push({ kind: 'video', id, w: im.width, h: im.height, real: isVideoPost });
        else media.push({ kind: 'image', id, w: im.width, h: im.height, ext: String(im.type || 'jpeg').toLowerCase().replace('jpg', 'jpeg') });
      } else if (a.value) {
        media.push({ kind: 'embed', id, provider: a.type, value: a.value, w: im.width || 16, h: im.height || 9 });
      }
    }
    return {
      id: p.id,
      num: numId(p.id),
      time: Date.parse(p.createdAt) || 0,
      rating: Math.round((p.rating || 0) * 10) / 10,
      comments: p.commentsCount || 0,
      nsfw: !!p.nsfw,
      unsafe: !!p.unsafe,
      user: p.user ? p.user.username : '',
      userId: p.user ? numId(p.user.id) : 0,
      author: authorStats(p.user),
      tags: (p.tags || []).map((t) => t.name),
      text: cleanText(p.text),
      censored: !media.length && CENSORED.test(p.text || ''),
      media
    };
  };

  /** Post que no tiene nada que ver: retirado por derechos de autor, o sin imágenes ni texto. */
  RS.isJunk = (p) => !!p && (p.censored || (!p.media.length && !p.text));

  // Los videos de JoyReactor solo se sirven si la petición dice venir de joyreactor.com.
  // En la extensión eso lo añade background.js; en desarrollo lo hace el proxy local.
  const viaProxy = (u) => (direct ? u : '/proxy/media?u=' + encodeURIComponent(u));
  RS.imageUrl = (m, full) => IMG + (full ? 'full/' : '') + 'post-' + m.id + '.' + (m.ext || 'jpeg');
  RS.videoUrl = (m) => viaProxy(IMG + 'mp4/post-' + m.id + '.mp4');
  RS.posterUrl = (m) => IMG + 'static/post-' + m.id + '.jpeg';
  // Avatares de usuarios y hashtags: también exigen el Referer de joyreactor.com.
  RS.avatarUrl = (p) => (p.userId ? viaProxy('https://img10.joyreactor.com/pics/avatar/user/' + p.userId) : '');
  RS.tagImageUrl = (tagId) => viaProxy('https://img10.joyreactor.com/pics/avatar/tag/' + tagId);
  RS.postUrl = (p) => RS.SITE + '/post/' + p.num;
  RS.embedUrl = function (m, p) {
    if (m.provider === 'YOUTUBE') return 'https://www.youtube.com/watch?v=' + encodeURIComponent(m.value);
    if (m.provider === 'COUB') return 'https://coub.com/view/' + encodeURIComponent(m.value);
    if (m.provider === 'VIMEO') return 'https://vimeo.com/' + encodeURIComponent(m.value);
    return RS.postUrl(p);
  };

  const PAGER_Q = `query($n:String,$t:PostLineType!,$p:Int){ tag(name:$n){ name postPager(type:$t){ count posts(page:$p){ ${POST_FIELDS} } } } }`;

  /** Una página de un feed. tag = null es la portada. page = null pide la más reciente. */
  RS.fetchPage = async function (tag, type, page) {
    const d = await gql(PAGER_Q, { n: tag || null, t: type, p: page == null ? null : page });
    if (!d.tag) throw new Error('No existe el hashtag «' + tag + '»');
    const pp = d.tag.postPager;
    countCache.set(tag + '|' + type, { count: pp.count, at: Date.now() });
    return {
      count: pp.count,
      lastPage: Math.max(1, Math.ceil(pp.count / PAGE_SIZE)),
      posts: (pp.posts || []).map(RS.normalizePost)
    };
  };

  // ---- GIF y videos de un hashtag. JoyReactor no deja filtrar por tipo de archivo, y buscar
  // «hashtag + gif» o «hashtag + video» dejaba fuera los que llevan otra etiqueta (#anime gif,
  // #video with sound…) o ninguna: en #Touhou Project eran 9 de cada 11. Por eso se recorren las
  // páginas del hashtag y quedan los posts que de verdad traen un GIF o un video.
  RS.isAnimated = (p) => p.media.some((m) => m.kind === 'video' || m.kind === 'embed' || m.ext === 'gif');
  RS.isRealVideo = (p) => p.media.some((m) => (m.kind === 'video' && m.real) || m.kind === 'embed');
  RS.isGifPost = (p) => p.media.some((m) => (m.kind === 'video' && !m.real) || m.ext === 'gif');
  /** Post solo de imágenes fijas (sin GIF ni video): pestaña «Imágenes» del perfil. */
  RS.isStillPost = (p) => p.media.length > 0 && !RS.isAnimated(p);
  /** kinds = ['gif'], ['video'] o ['gif','video']: ¿el post entra en ese filtro? */
  RS.matchesKinds = (p, kinds) =>
    (kinds.includes('gif') && kinds.includes('video') && RS.isAnimated(p)) ||
    (kinds.length === 1 && kinds[0] === 'gif' && RS.isGifPost(p) && !RS.isRealVideo(p)) ||
    (kinds.length === 1 && kinds[0] === 'video' && RS.isRealVideo(p));

  RS.FORMAT_TAGS = new Set(['gif', 'gifs', 'гифки', 'гифка', 'гиф', 'videogif', 'video gif', 'анимация', 'animation', 'animated'].concat(Array.from(VIDEO_TAGS)));
  RS.isFormatTag = (t) => RS.FORMAT_TAGS.has(String(t).toLowerCase());

  /** Varias páginas de un hashtag en una sola consulta: { count, lastPage, pages: [{ page, posts }] }. */
  RS.fetchPages = async function (tag, type, pages) {
    const parts = pages.map((pg, i) => `p${i}: posts(page:${Number(pg)}){ ${POST_FIELDS} }`).join(' ');
    const d = await gql(`query($n:String,$t:PostLineType!){ tag(name:$n){ postPager(type:$t){ count ${parts} } } }`, { n: tag || null, t: type });
    if (!d.tag) throw new Error('No existe el hashtag «' + tag + '»');
    const pp = d.tag.postPager;
    countCache.set(tag + '|' + type, { count: pp.count, at: Date.now() });
    return {
      count: pp.count,
      lastPage: Math.max(1, Math.ceil(pp.count / PAGE_SIZE)),
      pages: pages.map((pg, i) => ({ page: pg, posts: (pp['p' + i] || []).map(RS.normalizePost) }))
    };
  };

  // ---- Caché en el teléfono (IndexedDB) para lo que se puede volver a pedir, como los GIF y videos ya
  // encontrados en cada hashtag. No son datos del usuario: si se borra, solo se vuelve a pedir.
  const cacheDb = (() => {
    let opening = null;
    const open = () =>
      opening ||
      (opening = new Promise((resolve, reject) => {
        if (typeof indexedDB === 'undefined') return reject(new Error('Sin IndexedDB'));
        const rq = indexedDB.open('reactor-swipe-cache', 1);
        rq.onupgradeneeded = () => rq.result.createObjectStore('kv');
        rq.onsuccess = () => resolve(rq.result);
        rq.onerror = () => reject(rq.error);
      }));
    const run = (mode, fn) =>
      open().then(
        (db) =>
          new Promise((resolve, reject) => {
            const tx = db.transaction('kv', mode);
            const req = fn(tx.objectStore('kv'));
            tx.oncomplete = () => resolve(req.result);
            tx.onerror = () => reject(tx.error);
            tx.onabort = () => reject(tx.error);
          })
      );
    return {
      get: (k) => run('readonly', (s) => s.get(k)).catch(() => undefined),
      set: (k, v) => run('readwrite', (s) => s.put(v, k)).catch(() => {}),
      del: (k) => run('readwrite', (s) => s.delete(k)).catch(() => {})
    };
  })();
  RS.cacheDb = cacheDb;

  // Páginas ya revisadas de un hashtag: { v, born, count, n, pages: { página: [posts que se guardan] } }.
  // Las páginas se numeran desde la más vieja, así que una página completa (todas menos la más nueva)
  // no cambia cuando salen posts nuevos. Se guardan hasta SCAN_POSTS posts por hashtag, de los últimos
  // SCAN_TAGS hashtags, y se tiran a los SCAN_DAYS días (por si JoyReactor retiró algo).
  const SCAN_DAYS = 30;
  const SCAN_POSTS = 2000;
  const SCAN_TAGS = 30;
  async function touchScanIndex(key) {
    const index = (await cacheDb.get('scan-index')) || {};
    index[key] = Date.now();
    const keys = Object.keys(index).sort((a, b) => index[b] - index[a]);
    for (const old of keys.slice(SCAN_TAGS)) {
      delete index[old];
      cacheDb.del(old);
    }
    await cacheDb.set('scan-index', index);
  }

  /**
   * Todos los posts de un hashtag, de lo más nuevo a lo más viejo, de a varias páginas por consulta
   * (como createUserSource). La pestaña «Videos y GIF» filtra esta lista. scan (opcional) salta las
   * páginas que ya se sabe que solo tienen posts retirados (ver junkScan en app.js).
   * keep (opcional) = qué posts se guardan en el teléfono: con eso, al volver solo se pide la página más
   * nueva (y las que salieron desde la última vez); lo ya revisado sale del teléfono, sin consultas.
   * src.seen = cuántos posts se revisaron (los de las páginas guardadas cuentan aunque no se guarden).
   */
  RS.createTagSource = function (tag, type, scan, keep) {
    const src = { posts: [], count: 0, seen: 0, done: false, next: null, last: 0, busy: null };
    const key = 'scan:' + String(tag).toLowerCase() + ':' + type;
    let saved = null;
    let dirty = false;
    const ids = new Set();
    const add = (posts) => {
      for (const p of posts) {
        if (ids.has(p.id)) continue;
        ids.add(p.id);
        src.posts.push(p);
      }
    };
    const stored = (page) => !!(saved && saved.pages[page]);
    const remember = (page, posts) => {
      // La página más nueva todavía se va llenando: esa no se guarda.
      if (!saved || page >= src.last || saved.n >= SCAN_POSTS) return;
      const kept = posts.filter(keep);
      saved.pages[page] = kept;
      saved.n += kept.length;
      dirty = true;
    };
    const save = () => {
      if (!saved || !dirty) return;
      dirty = false;
      saved.count = src.count;
      cacheDb.set(key, saved).then(() => touchScanIndex(key));
    };
    src.more = (pages) => {
      if (src.busy) return src.busy;
      src.busy = (async () => {
        if (src.next == null) {
          if (keep) {
            const s = await cacheDb.get(key);
            saved = s && s.v === 1 && Date.now() - s.born < SCAN_DAYS * 86400000 ? s : { v: 1, born: Date.now(), count: 0, n: 0, pages: {} };
          }
          const res = await RS.fetchPage(tag, type, null);
          src.count = res.count;
          src.last = res.lastPage;
          if (scan) scan.note(res.lastPage, res.lastPage, res.posts, res.count);
          add(res.posts);
          src.seen += res.posts.length;
          src.next = res.lastPage - 1;
        } else {
          // Hasta `pages` páginas por pedir (en una sola consulta); las guardadas se intercalan en su
          // lugar sin consultar nada (como mucho 30 páginas por vez).
          const seq = [];
          let need = 0;
          let next = src.next;
          while (next >= 1 && need < (pages || 1) && seq.length < 30) {
            if (!(scan && scan.skip(next, src.last))) {
              const has = stored(next);
              // Si ya hay páginas guardadas para mostrar, se sirven sin consultar: lo que sigue se
              // pide recién cuando llegues ahí.
              if (!has && seq.length && seq.every(stored)) break;
              seq.push(next);
              if (!has) need++;
            }
            next--;
          }
          const want = seq.filter((p) => !stored(p));
          const got = new Map();
          if (want.length) {
            const res = await RS.fetchPages(tag, type, want);
            src.count = res.count;
            res.pages.forEach((x) => got.set(x.page, x.posts));
          }
          for (const p of seq) {
            if (got.has(p)) {
              const posts = got.get(p);
              if (scan) scan.note(p, src.last, posts, src.count);
              add(posts);
              src.seen += posts.length;
              remember(p, posts);
            } else {
              add(saved.pages[p]);
              src.seen += PAGE_SIZE;
            }
          }
          src.next = next;
          save();
        }
        if (src.next < 1) src.done = true;
      })().finally(() => (src.busy = null));
      return src.busy;
    };
    return src;
  };

  // ---- Perfil de un usuario y todos sus posts (página 1 = más vieja, como los hashtags).
  const USER_PAGER_Q = `query($u:String!,$p:Int){ user(username:$u){ id username postPager{ count posts(page:$p){ ${POST_FIELDS} } } } }`;
  RS.fetchUserPage = async function (username, page) {
    const d = await gql(USER_PAGER_Q, { u: username, p: page == null ? null : page });
    if (!d.user) throw new Error('No existe el usuario «' + username + '»');
    const pp = d.user.postPager;
    return {
      count: pp.count,
      lastPage: Math.max(1, Math.ceil(pp.count / PAGE_SIZE)),
      posts: (pp.posts || []).map(RS.normalizePost)
    };
  };

  /**
   * Todos los posts de un usuario, de lo más nuevo a lo más viejo, pedidos de a varias páginas
   * en paralelo. Las pestañas del perfil filtran esta misma lista, así que al cambiar de pestaña
   * no se vuelve a pedir nada. scan (opcional) = { skip(página, última), note(página, última, posts) }:
   * salta las páginas que ya se sabe que solo tienen posts retirados (ver junkScan en app.js).
   */
  RS.createUserSource = function (username, scan) {
    const src = { posts: [], count: 0, done: false, next: null, last: 0, busy: null };
    const ids = new Set();
    const add = (res) => {
      for (const p of res.posts) {
        if (ids.has(p.id)) continue;
        ids.add(p.id);
        src.posts.push(p);
      }
    };
    src.more = (pages) => {
      if (src.busy) return src.busy;
      src.busy = (async () => {
        if (src.next == null) {
          const res = await RS.fetchUserPage(username, null);
          src.count = res.count;
          src.last = res.lastPage;
          if (scan) scan.note(res.lastPage, res.lastPage, res.posts, res.count);
          add(res);
          src.next = res.lastPage - 1;
        } else {
          const list = [];
          let next = src.next;
          while (next >= 1 && list.length < (pages || 1)) {
            if (!(scan && scan.skip(next, src.last))) list.push(next);
            next--;
          }
          const results = await Promise.all(list.map((pg) => RS.fetchUserPage(username, pg)));
          results.forEach((res, i) => {
            if (scan) scan.note(list[i], src.last, res.posts, src.count);
            add(res);
          });
          src.next = next;
        }
        if (src.next < 1) src.done = true;
      })().finally(() => (src.busy = null));
      return src.busy;
    };
    return src;
  };

  // Los posts más nuevos (las dos últimas páginas) de varios usuarios o hashtags, en dos consultas:
  // { nombre: [posts] }. kind = 'user' | 'tag'.
  async function fetchRecent(kind, names) {
    if (!names.length) return {};
    const open = (i) => (kind === 'user' ? `user(username:$v${i}){ postPager` : `tag(name:$v${i}){ postPager(type:ALL)`);
    const type = kind === 'user' ? 'String!' : 'String';
    const vars = {};
    names.forEach((n, i) => (vars['v' + i] = n));
    const counts = await gql(`query(${names.map((n, i) => '$v' + i + ':' + type).join(',')}){ ${names.map((n, i) => `v${i}: ${open(i)}{ count } }`).join(' ')} }`, vars);
    const decl2 = [];
    const parts = [];
    const vars2 = {};
    names.forEach((n, i) => {
      const u = counts['v' + i];
      if (!u) return;
      const last = Math.max(1, Math.ceil(u.postPager.count / PAGE_SIZE));
      decl2.push('$v' + i + ':' + type);
      vars2['v' + i] = n;
      parts.push(`v${i}: ${open(i)}{ a: posts(page:${last}){ ${POST_FIELDS} } b: posts(page:${Math.max(1, last - 1)}){ ${POST_FIELDS} } } }`);
    });
    const d = parts.length ? await gql(`query(${decl2.join(',')}){ ${parts.join(' ')} }`, vars2) : {};
    const out = {};
    names.forEach((n, i) => {
      const u = d['v' + i];
      if (!u) return;
      const ids = new Set();
      out[n] = u.postPager.a.concat(u.postPager.b).filter((x) => !ids.has(x.id) && ids.add(x.id)).map(RS.normalizePost);
    });
    return out;
  }
  RS.fetchUsersRecent = (names) => fetchRecent('user', names);
  RS.fetchTagsRecent = (names) => fetchRecent('tag', names);

  // Cuántos posts de un hashtag llevan cada uno de los hashtags bloqueados: [{ name, n, capped, path }].
  // La búsqueda de JoyReactor cuenta hasta 1000. Si llega a 1000 y el bloqueado está dentro del hashtag
  // (una subcategoría), sus posts son todos de aquí y vale su propio total; si no, 1000 es solo un mínimo
  // (capped). path = las carpetas de arriba del bloqueado.
  RS.fetchBlockedOverlap = async function (name, blocked) {
    const list = blocked.slice(0, 30);
    if (!list.length) return [];
    const vars = { n: name };
    const F = 'name postPager(type:ALL){ count } hierarchy { name }';
    const parts = list.map((b, i) => {
      vars['b' + i] = b;
      return `s${i}: search(query:"", tagNames:[$n,$b${i}], showNsfw:true){ postPager{ count } } t${i}: tag(name:$b${i}){ ${F} mainTag { ${F} } }`;
    });
    const decl = ['$n:String!'].concat(list.map((b, i) => '$b' + i + ':String!')).join(',');
    const d = await gql(`query(${decl}){ ${parts.join(' ')} }`, vars);
    const low = (x) => String(x).toLowerCase();
    const out = [];
    list.forEach((b, i) => {
      const raw = d['t' + i];
      const t = raw && (raw.mainTag || raw);
      if (!t) return;
      const path = (t.hierarchy || []).map((x) => x.name).filter((x) => low(x) !== low(t.name));
      const inside = path.some((x) => low(x) === low(name));
      const hits = d['s' + i] ? d['s' + i].postPager.count : 0;
      const capped = hits >= 1000;
      out.push({ name: t.name, n: capped && inside ? t.postPager.count : hits, capped: capped && !inside, path });
    });
    return out;
  };

  // Categorías de arriba de varios hashtags (para el Resumen de la semana): { nombre: [de arriba] }.
  // El árbol casi no cambia, así que se guarda mientras la app esté abierta.
  const pathCache = new Map();
  RS.fetchTagPaths = async function (names) {
    const missing = names.filter((n) => !pathCache.has(n.toLowerCase())).slice(0, 60);
    if (missing.length) {
      const decl = missing.map((n, i) => '$n' + i + ':String').join(',');
      const vars = {};
      missing.forEach((n, i) => (vars['n' + i] = n));
      const F = 'name hierarchy { name }';
      const d = await gql(`query(${decl}){ ${missing.map((n, i) => `t${i}: tag(name:$n${i}){ ${F} mainTag { ${F} } }`).join(' ')} }`, vars);
      missing.forEach((n, i) => {
        const t = d['t' + i] && (d['t' + i].mainTag || d['t' + i]);
        const self = t ? t.name.toLowerCase() : n.toLowerCase();
        pathCache.set(n.toLowerCase(), t ? (t.hierarchy || []).map((x) => x.name).filter((x) => x.toLowerCase() !== self) : []);
      });
    }
    const out = {};
    for (const n of names) out[n] = pathCache.get(n.toLowerCase()) || [];
    return out;
  };

  /**
   * Lo que hay dentro de un hashtag (sus subcarpetas), de a 36 por página, de las más grandes a las
   * más chicas: { name, count, total, children: [{ name, count, inner }] }. inner = cuántas tiene dentro.
   * (Para la herramienta temporal «Árbol de hashtags».)
   */
  RS.fetchTagChildren = async function (name, page) {
    const d = await gql(
      `query($n:String,$p:Int){ tag(name:$n){ name count tagPager(type:BEST){ count tags(page:$p){ name count tagPager(type:BEST){ count } } } } }`,
      { n: name, p: page || 1 }
    );
    const t = d.tag;
    if (!t) throw new Error('No existe el hashtag «' + name + '»');
    return {
      name: t.name,
      count: t.count || 0,
      total: t.tagPager.count || 0,
      children: (t.tagPager.tags || []).map((c) => ({ name: c.name, count: c.count || 0, inner: (c.tagPager && c.tagPager.count) || 0 }))
    };
  };

  const userCache = new Map();
  RS.fetchUserInfo = function (username) {
    const key = String(username).toLowerCase();
    if (!userCache.has(key)) {
      const pr = gql(`query($u:String!){ user(username:$u){ id username rating ratingWeek postNum goodPostNum bestPostNum } }`, { u: username }).then((d) => {
        const u = d.user;
        return u ? { id: numId(u.id), name: u.username, rating: Math.round((u.rating || 0) * 10) / 10, posts: u.postNum || 0, author: authorStats(u) } : null;
      });
      pr.catch(() => userCache.delete(key));
      userCache.set(key, pr);
    }
    return userCache.get(key);
  };

  const tagCache = new Map();
  RS.fetchTagInfo = async function (name) {
    const key = String(name).toLowerCase();
    if (tagCache.has(key)) return tagCache.get(key);
    // Muchos hashtags son sinónimos (p. ej. «cat» → «cats»): uso siempre el principal.
    const F = 'id name count subscribers showAsCategory nsfw image { id } category { name } subTags { name } hierarchy { name }';
    const d = await gql(`query($n:String){ tag(name:$n){ ${F} mainTag { ${F} } } }`, { n: name });
    const t = d.tag && (d.tag.mainTag || d.tag);
    const info = t
      ? {
          name: t.name,
          count: t.count || 0,
          subscribers: t.subscribers || 0,
          nsfw: !!t.nsfw,
          parent: t.category ? t.category.name : null,
          // Las categorías de arriba, de la más grande a la más cercana (p. ej. fandoms › anime).
          path: (t.hierarchy || [])
            .map((x) => x.name)
            .filter((n) => n.toLowerCase() !== t.name.toLowerCase())
            .reverse(),
          subTags: (t.subTags || []).map((s) => s.name),
          kind: t.showAsCategory || (t.subTags || []).length ? 'category' : 'hashtag',
          pic: t.image ? numId(t.id) : 0
        }
      : null;
    tagCache.set(key, info);
    if (info) tagCache.set(info.name.toLowerCase(), info);
    return info;
  };

  RS.autocomplete = async function (mask) {
    const d = await gql(`query($m:String!){ tagAutocomplete(mask:$m){ id name count nsfw image { id } } }`, { m: mask });
    return d.tagAutocomplete || [];
  };

  // ---------------------------------------------------------------- Datos del usuario

  const DEFAULTS = {
    likes: {}, // id -> { at, post }
    dislikes: {}, // id -> { at, post }
    favorites: {}, // hashtags y categorías que sigues (pestaña Seguidos): nombre -> { name, kind, notify, addedAt }
    mix: { sources: {}, quality: 'GOOD', era: 'any', noRepeat: true, exclude: [] },
    seen: [],
    // tagGif, tagVideo y tagOrder ya no se usan: desde la 1.0.9 un hashtag abre siempre con todos sus posts.
    // showDates: mostrar la fecha de cada post (desde la 1.1.0 viene apagado).
    // showScores: estrellas del autor y rating del post en pantalla completa (desde la 1.2.0 viene apagado).
    // seekDrag / seekSpan: mantener el dedo y arrastrar a los lados adelanta el video; seekSpan = segundos al cruzar la pantalla.
    settings: { notify: true, interval: 15, notifyType: 'NEW', hideNsfw: false, homeSort: 'GOOD', tagGif: true, tagVideo: true, tagOrder: 'random', historyMax: 100, showDates: false, showScores: false, seekDrag: true, seekSpan: 60 },
    news: { items: [], known: {}, unread: 0, lastCheck: 0 },
    dismissed: [],
    history: [], // posts vistos más de 10 s: [{ id, at, post }], el más nuevo primero
    searches: [], // búsquedas recientes: [{ type: 'tag' | 'user', name, pic?, at }]
    stats: {}, // métricas de uso (ver app.js)
    topUsers: { week: '', at: 0, list: [], prev: [] }, // tus 10 usuarios por me gusta (hasta la 1.1.0; ya no se muestra)
    following: {}, // usuarios que sigues: nombre en minúsculas -> { name, userId, addedAt, notify }
    userHistory: [], // perfiles que visitaste (máximo 50): [{ name, userId, at }], el más nuevo primero
    // Páginas con posts retirados por derechos de autor, por usuario o hashtag (ver junkScan en app.js).
    junkScan: {}, // 'user:nombre' | 'tag:nombre:TIPO' -> { p: { página: [retirados, recibidos, era la última, esperados] }, at }
    // Árbol de los hashtags: nombre en minúsculas -> { p: [carpeta de arriba, la siguiente, …], at } (ver leafTags en app.js).
    tagTree: {},
    // Resumen de la semana ya calculado (los 10 usuarios y hashtags que más tiempo miraste).
    // seen: semana cuyo resumen ya miraste (historias o la lista); later: semana en que tocaste «Luego» en Inicio.
    weekly: { week: '', at: 0, users: [], tags: [], prev: null, pending: null, seen: '', later: '' },
    // Hashtags guardados como perfil (Seguidos › Perfiles): nombre en minúsculas -> { name, aliases, addedAt, pic }.
    tagProfiles: {},
    eraCache: {}
  };
  RS.KEYS = Object.keys(DEFAULTS);

  const clone = (v) => JSON.parse(JSON.stringify(v));
  const isPlain = (v) => v && typeof v === 'object' && !Array.isArray(v);

  const area = ext
    ? ext.storage.local
    : {
        async get(keys) {
          const out = {};
          for (const k of [].concat(keys)) {
            const v = localStorage.getItem('rs:' + k);
            if (v != null) out[k] = JSON.parse(v);
          }
          return out;
        },
        async set(obj) {
          for (const k in obj) localStorage.setItem('rs:' + k, JSON.stringify(obj[k]));
        }
      };

  RS.load = async function (keys) {
    const got = await area.get(keys);
    const out = {};
    for (const k of keys) {
      const def = clone(DEFAULTS[k]);
      const v = got[k];
      out[k] = v === undefined ? def : isPlain(def) && isPlain(v) ? Object.assign(def, v) : v;
    }
    return out;
  };
  RS.save = (obj) => area.set(obj);

  /** Filtro común a todos los feeds: no me gusta, hashtags excluidos, NSFW y posts retirados. */
  RS.makeFilter = function (st) {
    const dis = st.dislikes || {};
    const ex = new Set(((st.mix && st.mix.exclude) || []).map((s) => s.toLowerCase()));
    const hideNsfw = st.settings && st.settings.hideNsfw;
    return (p) => !dis[p.id] && !RS.isJunk(p) && !(hideNsfw && (p.nsfw || p.unsafe)) && !p.tags.some((t) => ex.has(t.toLowerCase()));
  };

  RS.label = (name, kind) =>
    !name ? 'todo JoyReactor' : kind === 'user' ? '@' + name : kind === 'category' ? name.charAt(0).toUpperCase() + name.slice(1) : '#' + name;

  // ---------------------------------------------------------------- Novedades (avisos)

  /**
   * Revisa los hashtags y usuarios con la campanita activada y guarda los posts que no había visto.
   * La primera vez que revisa uno solo toma nota de lo que hay (no avisa de lo viejo).
   */
  RS.checkNews = async function () {
    const st = await RS.load(['favorites', 'following', 'settings', 'news', 'dislikes', 'mix']);
    const news = st.news;
    const result = { total: 0, per: {} };
    const targets = Object.values(st.favorites)
      .filter((f) => f.notify)
      .concat(Object.values(st.following).filter((f) => f.notify).map((f) => ({ name: f.name, kind: 'user', user: true })));
    news.lastCheck = Date.now();
    if (!targets.length) {
      await RS.save({ news });
      return result;
    }
    const type = st.settings.notifyType === 'GOOD' ? 'GOOD' : 'NEW';

    // Los usuarios se piden con user(username) (variable obligatoria: String!) y sin tipo de lista.
    const declOf = (f, i) => '$n' + i + (f.user ? ':String!' : ':String');
    const pager = (f, i, inner) => (f.user ? `t${i}: user(username:$n${i}){ postPager{ ${inner} } }` : `t${i}: tag(name:$n${i}){ postPager(type:${type}){ ${inner} } }`);
    const decl = targets.map(declOf).join(',');
    const vars = {};
    targets.forEach((f, i) => (vars['n' + i] = f.name));
    const counts = await gql(`query(${decl}){ ${targets.map((f, i) => pager(f, i, 'count')).join(' ')} }`, vars);

    const decl2 = [];
    const parts = [];
    const vars2 = {};
    targets.forEach((f, i) => {
      const t = counts['t' + i];
      if (!t) return;
      const last = Math.max(1, Math.ceil(t.postPager.count / PAGE_SIZE));
      decl2.push(declOf(f, i));
      vars2['n' + i] = f.name;
      parts.push(pager(f, i, `a: posts(page:${last}){ ${POST_FIELDS} } b: posts(page:${Math.max(1, last - 1)}){ ${POST_FIELDS} }`));
    });
    const pages = parts.length ? await gql(`query(${decl2.join(',')}){ ${parts.join(' ')} }`, vars2) : {};

    const ok = RS.makeFilter(st);
    const have = new Set(news.items.map((x) => x.id));
    targets.forEach((f, i) => {
      const t = pages['t' + i];
      if (!t) return;
      const posts = t.postPager.a.concat(t.postPager.b).map(RS.normalizePost);
      const ids = posts.map((p) => p.id);
      const kkey = f.user ? '@' + f.name : f.name;
      const known = news.known[kkey];
      news.known[kkey] = Array.from(new Set(ids.concat(known || []))).slice(0, 80);
      if (!known) return;
      const knownSet = new Set(known);
      const fresh = posts.filter((p) => !knownSet.has(p.id) && !have.has(p.id) && ok(p));
      for (const p of fresh) {
        news.items.push({ id: p.id, tag: f.name, kind: f.kind, at: Date.now(), post: p });
        have.add(p.id);
      }
      if (fresh.length) {
        result.per[f.name] = fresh.length;
        result.total += fresh.length;
      }
    });
    news.items.sort((a, b) => b.post.time - a.post.time);
    news.items = news.items.slice(0, 300);
    news.unread = (news.unread || 0) + result.total;
    await RS.save({ news });
    return result;
  };

  // ---------------------------------------------------------------- Aleatorio

  const countCache = new Map();
  async function pagerCount(name, type) {
    const key = name + '|' + type;
    const c = countCache.get(key);
    if (c && Date.now() - c.at < 30 * 60 * 1000) return c.count;
    const d = await gql(`query($n:String,$t:PostLineType!){ tag(name:$n){ postPager(type:$t){ count } } }`, { n: name, t: type });
    if (!d.tag) throw new Error('No existe el hashtag «' + name + '»');
    countCache.set(key, { count: d.tag.postPager.count, at: Date.now() });
    return d.tag.postPager.count;
  }

  // Las páginas van de la más vieja (1) a la más nueva, así que para «último año / mes»
  // busco (búsqueda binaria) la primera página posterior a esa fecha y la guardo unos días.
  async function firstPageSince(name, type, since, lastPage) {
    const key = name + '|' + type + '|' + since;
    const { eraCache } = await RS.load(['eraCache']);
    const hit = eraCache[key];
    if (hit && Date.now() - hit.at < 3 * 86400000) return Math.min(hit.page, lastPage);
    const cutoff = Date.now() - (since === 'month' ? 31 : 366) * 86400000;
    let lo = 1;
    let hi = lastPage;
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      const d = await gql(`query($n:String,$t:PostLineType!,$p:Int){ tag(name:$n){ postPager(type:$t){ posts(page:$p){ createdAt } } } }`, {
        n: name,
        t: type,
        p: mid
      });
      const posts = (d.tag && d.tag.postPager.posts) || [];
      const newest = posts.reduce((m, x) => Math.max(m, Date.parse(x.createdAt) || 0), 0);
      if (newest < cutoff) lo = mid + 1;
      else hi = mid;
    }
    eraCache[key] = { page: lo, at: Date.now() };
    await RS.save({ eraCache });
    return lo;
  }

  const randInt = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
  RS.shuffle = shuffle;

  /** Fuentes activas de la mezcla con su peso. Vacía = todo JoyReactor. */
  RS.mixSources = function (st) {
    return Object.keys(st.favorites)
      .map((name) => ({ name, kind: st.favorites[name].kind, cfg: st.mix.sources[name] }))
      .filter((s) => s.cfg && s.cfg.on)
      .map((s) => ({ name: s.name, kind: s.kind, w: Math.max(1, Number(s.cfg.w) || 5) }));
  };

  /**
   * Un lote de posts al azar según la mezcla: sortea la fuente por peso, salta a una página
   * al azar de esa fuente y se queda con 1–2 posts que no estén vistos, ocultos ni excluidos.
   * st = { favorites, mix, seenSet, filter }
   * opts = { n, skip:Set, sources?, type?, era?, noRepeat?, mediaKinds? } — sources/type/era/noRepeat
   *        reemplazan a los de la mezcla (p. ej. un solo hashtag en orden aleatorio); mediaKinds = solo GIF/videos.
   */
  RS.randomBatch = async function (st, opts) {
    opts = opts || {};
    const n = opts.n || 4;
    const skip = opts.skip || new Set();
    const list = opts.sources || RS.mixSources(st);
    const sources = list.length ? list : [{ name: null, kind: null, w: 1 }];
    const total = sources.reduce((a, s) => a + s.w, 0);
    const pick = () => {
      let r = Math.random() * total;
      for (const s of sources) if ((r -= s.w) < 0) return s;
      return sources[sources.length - 1];
    };
    const type = RS.validType(opts.type) || RS.validType(st.mix.quality) || 'GOOD';
    const era = opts.era || st.mix.era || 'any';
    const noRepeat = opts.noRepeat !== undefined ? opts.noRepeat : st.mix.noRepeat;

    const one = async (src) => {
      let res;
      const kinds = opts.mediaKinds && opts.mediaKinds.length ? opts.mediaKinds : null;
      if (kinds) {
        // Solo GIF y/o videos: tres páginas al azar en una consulta, y quedan los posts animados.
        const count = await pagerCount(src.name, type);
        const last = Math.max(1, Math.ceil(count / PAGE_SIZE));
        const pages = Array.from(new Set(Array.from({ length: Math.min(3, last) }, () => randInt(1, last))));
        const many = await RS.fetchPages(src.name, type, pages);
        res = { posts: [].concat(...many.pages.map((x) => x.posts)) };
      } else {
        const count = await pagerCount(src.name, type);
        const last = Math.max(1, Math.ceil(count / PAGE_SIZE));
        const first = era === 'any' ? 1 : await firstPageSince(src.name, type, era, last);
        res = await RS.fetchPage(src.name, type, randInt(first, last));
      }
      const ok = res.posts.filter(
        (p) =>
          !skip.has(p.id) &&
          st.filter(p) &&
          !(noRepeat && st.seenSet && st.seenSet.has(p.id)) &&
          p.media.length &&
          (!kinds || RS.matchesKinds(p, kinds))
      );
      return shuffle(ok)
        .slice(0, kinds ? 4 : 2)
        .map((post) => ({ post, source: src.name, sourceKind: src.kind }));
    };

    let errors = 0;
    let firstError = null;
    const batches = await Promise.all(
      Array.from({ length: n }, () =>
        one(pick()).catch((e) => {
          errors++;
          firstError = firstError || e;
          return [];
        })
      )
    );
    if (errors === n && firstError) throw firstError;
    const out = [];
    const ids = new Set();
    for (const it of shuffle([].concat(...batches))) {
      if (ids.has(it.post.id)) continue;
      ids.add(it.post.id);
      out.push(it);
    }
    return out;
  };
})(typeof window !== 'undefined' ? window : self);
