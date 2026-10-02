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
    user { id username }
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
      tags: (p.tags || []).map((t) => t.name),
      text: cleanText(p.text),
      media
    };
  };

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

  // ---- Solo GIF y videos de un hashtag: la búsqueda de JoyReactor con «hashtag + gif» y
  // «hashtag + video», mezcladas en un solo listado. Cada búsqueda devuelve como máximo 1000
  // resultados (100 páginas); la página 1 es la más nueva (o la mejor, en Top).
  const SEARCH_Q = `query($t:[String!],$p:Int,$d:Boolean,$r:Boolean,$min:Int,$nsfw:Boolean){ search(query:"", tagNames:$t, sortByDate:$d, sortByRating:$r, minRating:$min, showNsfw:$nsfw){ postPager{ count posts(page:$p){ ${POST_FIELDS} } } } }`;
  const SEARCH_COUNT_Q = `query($t:[String!],$d:Boolean,$r:Boolean,$min:Int,$nsfw:Boolean){ search(query:"", tagNames:$t, sortByDate:$d, sortByRating:$r, minRating:$min, showNsfw:$nsfw){ postPager{ count } } }`;
  // «Bueno» se aproxima con rating mínimo 10 (la búsqueda no tiene el filtro «bueno» de los hashtags).
  const MEDIA_ORDER = { NEW: { d: true }, ALL: { d: true }, GOOD: { d: true, min: 10 }, BEST: { r: true } };
  RS.MEDIA_KINDS = ['gif', 'video'];
  RS.GIF_LIMIT = 1000;

  RS.isAnimated = (p) => p.media.some((m) => m.kind === 'video' || m.kind === 'embed' || m.ext === 'gif');
  RS.isRealVideo = (p) => p.media.some((m) => (m.kind === 'video' && m.real) || m.kind === 'embed');
  RS.isGifPost = (p) => p.media.some((m) => (m.kind === 'video' && !m.real) || m.ext === 'gif');
  /** kinds = ['gif'], ['video'] o ['gif','video']: ¿el post entra en ese filtro? */
  RS.matchesKinds = (p, kinds) =>
    (kinds.includes('gif') && kinds.includes('video') && RS.isAnimated(p)) ||
    (kinds.length === 1 && kinds[0] === 'gif' && RS.isGifPost(p) && !RS.isRealVideo(p)) ||
    (kinds.length === 1 && kinds[0] === 'video' && RS.isRealVideo(p));

  async function canonicalTag(tag) {
    const info = await RS.fetchTagInfo(tag).catch(() => null);
    return info ? info.name : tag;
  }
  const searchTags = (name, kind) => (name.toLowerCase() === kind ? [kind] : [name, kind]);
  const searchVars = (tags, type, hideNsfw) => {
    const o = MEDIA_ORDER[type] || MEDIA_ORDER.GOOD;
    return { t: tags, d: o.d || null, r: o.r || null, min: o.min == null ? null : o.min, nsfw: hideNsfw ? false : null };
  };

  /** Una página de «hashtag + gif» o «hashtag + video». */
  RS.fetchMediaPage = async function (tag, kind, type, page, hideNsfw) {
    const name = await canonicalTag(tag);
    const d = await gql(SEARCH_Q, Object.assign(searchVars(searchTags(name, kind), type, hideNsfw), { p: page }));
    const pp = d.search && d.search.postPager;
    if (!pp) throw new Error('No pude buscar GIF ni videos de «' + tag + '»');
    return {
      count: pp.count,
      lastPage: Math.max(1, Math.ceil(Math.min(pp.count, RS.GIF_LIMIT) / PAGE_SIZE)),
      posts: (pp.posts || []).map(RS.normalizePost)
    };
  };

  RS.mediaCount = async function (tag, kind, type, hideNsfw) {
    const key = 'media|' + tag + '|' + kind + '|' + type + '|' + !!hideNsfw;
    const c = countCache.get(key);
    if (c && Date.now() - c.at < 30 * 60 * 1000) return c.count;
    const name = await canonicalTag(tag);
    const d = await gql(SEARCH_COUNT_Q, searchVars(searchTags(name, kind), type, hideNsfw));
    const count = (d.search && d.search.postPager && d.search.postPager.count) || 0;
    countCache.set(key, { count, at: Date.now() });
    return count;
  };

  /**
   * Listado ordenado de GIF + videos de un hashtag: va pidiendo páginas de ambas búsquedas y
   * las intercala por fecha (o por rating en Top). next() devuelve el siguiente lote.
   */
  RS.createMediaSource = function (tag, type, hideNsfw, kinds) {
    const byRating = type === 'BEST';
    const key = (p) => (byRating ? p.rating : p.time);
    const subs = (kinds && kinds.length ? kinds : RS.MEDIA_KINDS).map((kind) => ({ kind, page: 0, last: Infinity, buf: [], done: false, capped: false }));
    const refill = async (s) => {
      s.page += 1;
      if (s.page > s.last) {
        s.done = true;
        return;
      }
      const res = await RS.fetchMediaPage(tag, s.kind, type, s.page, hideNsfw);
      s.last = res.lastPage;
      s.capped = res.count > RS.GIF_LIMIT;
      if (!res.posts.length) s.done = true;
      s.buf.push(...res.posts);
    };
    return {
      async next() {
        await Promise.all(subs.filter((s) => !s.done && !s.buf.length).map(refill));
        const out = [];
        // Saca siempre el más nuevo (o mejor) de los dos montones mientras ambos tengan algo.
        while (out.length < 20) {
          if (subs.some((s) => !s.done && !s.buf.length)) break;
          const live = subs.filter((s) => s.buf.length);
          if (!live.length) break;
          live.sort((a, b) => key(b.buf[0]) - key(a.buf[0]));
          out.push(live[0].buf.shift());
        }
        return {
          posts: out,
          done: subs.every((s) => s.done && !s.buf.length),
          capped: subs.some((s) => s.capped)
        };
      }
    };
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

  const userCache = new Map();
  RS.fetchUserInfo = async function (username) {
    const key = String(username).toLowerCase();
    if (userCache.has(key)) return userCache.get(key);
    const d = await gql(`query($u:String!){ user(username:$u){ id username rating postNum } }`, { u: username });
    const u = d.user;
    const info = u ? { id: numId(u.id), name: u.username, rating: Math.round((u.rating || 0) * 10) / 10, posts: u.postNum || 0 } : null;
    userCache.set(key, info);
    return info;
  };

  const tagCache = new Map();
  RS.fetchTagInfo = async function (name) {
    const key = String(name).toLowerCase();
    if (tagCache.has(key)) return tagCache.get(key);
    // Muchos hashtags son sinónimos (p. ej. «cat» → «cats»): uso siempre el principal.
    const F = 'id name count subscribers showAsCategory nsfw image { id } category { name } subTags { name }';
    const d = await gql(`query($n:String){ tag(name:$n){ ${F} mainTag { ${F} } } }`, { n: name });
    const t = d.tag && (d.tag.mainTag || d.tag);
    const info = t
      ? {
          name: t.name,
          count: t.count || 0,
          subscribers: t.subscribers || 0,
          nsfw: !!t.nsfw,
          parent: t.category ? t.category.name : null,
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
    favorites: {}, // nombre -> { name, kind, notify, addedAt }
    mix: { sources: {}, quality: 'GOOD', era: 'any', noRepeat: true, exclude: [] },
    seen: [],
    settings: { notify: true, interval: 15, notifyType: 'NEW', hideNsfw: false, homeSort: 'GOOD', tagGif: true, tagVideo: true, tagOrder: 'random', historyMax: 100 },
    news: { items: [], known: {}, unread: 0, lastCheck: 0 },
    dismissed: [],
    history: [], // posts vistos más de 10 s: [{ id, at, post }], el más nuevo primero
    searches: [], // búsquedas recientes: [{ type: 'tag' | 'user', name, pic?, at }]
    stats: {}, // métricas de uso (ver app.js)
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

  /** Filtro común a todos los feeds: no me gusta, hashtags excluidos y NSFW. */
  RS.makeFilter = function (st) {
    const dis = st.dislikes || {};
    const ex = new Set(((st.mix && st.mix.exclude) || []).map((s) => s.toLowerCase()));
    const hideNsfw = st.settings && st.settings.hideNsfw;
    return (p) => !dis[p.id] && !(hideNsfw && (p.nsfw || p.unsafe)) && !p.tags.some((t) => ex.has(t.toLowerCase()));
  };

  RS.label = (name, kind) => (!name ? 'todo JoyReactor' : kind === 'category' ? name.charAt(0).toUpperCase() + name.slice(1) : '#' + name);

  // ---------------------------------------------------------------- Novedades (avisos)

  /**
   * Revisa los favoritos con la campanita activada y guarda los posts que no había visto.
   * La primera vez que revisa un favorito solo toma nota de lo que hay (no avisa de lo viejo).
   */
  RS.checkNews = async function () {
    const st = await RS.load(['favorites', 'settings', 'news', 'dislikes', 'mix']);
    const news = st.news;
    const result = { total: 0, per: {} };
    const targets = Object.values(st.favorites).filter((f) => f.notify);
    news.lastCheck = Date.now();
    if (!targets.length) {
      await RS.save({ news });
      return result;
    }
    const type = st.settings.notifyType === 'GOOD' ? 'GOOD' : 'NEW';

    const decl = targets.map((f, i) => '$n' + i + ':String').join(',');
    const vars = {};
    targets.forEach((f, i) => (vars['n' + i] = f.name));
    const counts = await gql(
      `query(${decl}){ ${targets.map((f, i) => `t${i}: tag(name:$n${i}){ postPager(type:${type}){ count } }`).join(' ')} }`,
      vars
    );

    const decl2 = [];
    const parts = [];
    const vars2 = {};
    targets.forEach((f, i) => {
      const t = counts['t' + i];
      if (!t) return;
      const last = Math.max(1, Math.ceil(t.postPager.count / PAGE_SIZE));
      decl2.push('$n' + i + ':String');
      vars2['n' + i] = f.name;
      parts.push(
        `t${i}: tag(name:$n${i}){ postPager(type:${type}){ a: posts(page:${last}){ ${POST_FIELDS} } b: posts(page:${Math.max(1, last - 1)}){ ${POST_FIELDS} } } }`
      );
    });
    const pages = parts.length ? await gql(`query(${decl2.join(',')}){ ${parts.join(' ')} }`, vars2) : {};

    const ok = RS.makeFilter(st);
    const have = new Set(news.items.map((x) => x.id));
    targets.forEach((f, i) => {
      const t = pages['t' + i];
      if (!t) return;
      const posts = t.postPager.a.concat(t.postPager.b).map(RS.normalizePost);
      const ids = posts.map((p) => p.id);
      const known = news.known[f.name];
      news.known[f.name] = Array.from(new Set(ids.concat(known || []))).slice(0, 80);
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
   * opts = { n, skip:Set, sources?, type?, era?, noRepeat?, gif?, hideNsfw? } — sources/type/era/noRepeat
   *        reemplazan a los de la mezcla (p. ej. un solo hashtag en orden aleatorio); gif = solo GIF/videos.
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
        // Solo GIF y/o videos: elige el tipo según cuántos hay y salta a una página al azar.
        const counts = await Promise.all(kinds.map((k) => RS.mediaCount(src.name, k, type, opts.hideNsfw)));
        const capped = counts.map((c) => Math.min(c, RS.GIF_LIMIT));
        const totalMedia = capped.reduce((a, b) => a + b, 0);
        if (!totalMedia) return [];
        let r = Math.random() * totalMedia;
        let ki = 0;
        while (ki < capped.length - 1 && (r -= capped[ki]) >= 0) ki++;
        const lastPage = Math.max(1, Math.ceil(capped[ki] / PAGE_SIZE));
        res = await RS.fetchMediaPage(src.name, kinds[ki], type, randInt(1, lastPage), opts.hideNsfw);
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
        .slice(0, 2)
        .map((post) => ({ post, source: src.name, sourceKind: src.kind }));
    };

    const batches = await Promise.all(Array.from({ length: n }, () => one(pick()).catch(() => [])));
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
