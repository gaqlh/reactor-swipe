/* Reactor Swipe — la app (feed, miniaturas, hashtags, aleatorio, favoritos, me gusta, novedades). */
(function () {
  'use strict';

  const RS = window.RS;
  const ext = RS.ext;
  const viewEl = document.getElementById('view');
  const SVGNS = 'http://www.w3.org/2000/svg';

  // ================================================================ Utilidades de interfaz

  const ICONS = {
    home: '<path d="M4 10.5L12 4l8 6.5V20a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1z"/>',
    shuffle: '<path d="M16 4h4v4"/><path d="M4 20L20 4"/><path d="M20 16v4h-4"/><path d="M15 15l5 5"/><path d="M4 4l5 5"/>',
    star: '<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"/>',
    heart: '<path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20z"/>',
    down: '<path d="M17 4h3v10h-3z"/><path d="M17 14l-4 6.5a1.8 1.8 0 0 1-3.3-1.2l.8-4.3H5.6a2 2 0 0 1-2-2.3l1.1-6.2A2 2 0 0 1 6.7 5H17"/>',
    comment: '<path d="M20 12a8 8 0 0 1-11.8 7L4 20l1.1-4A8 8 0 1 1 20 12z"/>',
    external: '<path d="M14 4h6v6"/><path d="M20 4l-9 9"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
    grid: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
    feed: '<rect x="5" y="3" width="14" height="11" rx="2"/><path d="M5 18h14M5 21h9"/>',
    back: '<path d="M15 5l-7 7 7 7"/>',
    sliders: '<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>',
    refresh: '<path d="M20 11a8 8 0 0 0-14.5-4.5L4 8"/><path d="M4 4v4h4"/><path d="M4 13a8 8 0 0 0 14.5 4.5L20 16"/><path d="M20 20v-4h-4"/>',
    eyeoff: '<path d="M3 3l18 18"/><path d="M10.6 6.1A9.8 9.8 0 0 1 12 6c5 0 8.5 4.5 9.5 6-.5.8-1.6 2.3-3.1 3.6"/><path d="M6.6 7.6C4.7 8.9 3.2 10.9 2.5 12c1 1.5 4.5 6 9.5 6 1.6 0 3-.4 4.3-1.1"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    undo: '<path d="M9 14L4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>',
    up: '<path d="M12 19V5M6 11l6-6 6 6"/>',
    multi: '<rect x="7" y="7" width="13" height="13" rx="2"/><path d="M4 16V6a2 2 0 0 1 2-2h10"/>',
    play: '<path d="M8 5l11 7-11 7z"/>',
    bell: '<path d="M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>',
    belloff: '<path d="M6 16v-5a6 6 0 0 1 9.3-5"/><path d="M18 11v5l1.5 2H8"/><path d="M10 20.5a2 2 0 0 0 4 0"/><path d="M3 3l18 18"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6"/>',
    download: '<path d="M12 4v11"/><path d="M7 10l5 5 5-5"/><path d="M5 20h14"/>',
    upload: '<path d="M12 20V9"/><path d="M7 14l5-5 5 5"/><path d="M5 4h14"/>',
    muted: '<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M17 9l4 6M21 9l-4 6"/>',
    sound: '<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/><path d="M19 6a8.5 8.5 0 0 1 0 12"/>',
    hash: '<path d="M5 9h15M4 15h15M10 3L8 21M16 3l-2 18"/>',
    chevdown: '<path d="M6 9l6 6 6-6"/>',
    expand: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
    spinner: '<path d="M12 3a9 9 0 1 0 9 9"/>',
    alert: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5M12 16.5v.01"/>'
  };

  // Cada ícono se interpreta una sola vez como SVG y después se clona.
  const iconCache = {};
  const svgParser = new DOMParser();
  function icon(name, size, cls) {
    if (!iconCache[name]) {
      const doc = svgParser.parseFromString('<svg xmlns="' + SVGNS + '" viewBox="0 0 24 24">' + (ICONS[name] || '') + '</svg>', 'image/svg+xml');
      iconCache[name] = document.importNode(doc.documentElement, true);
    }
    const s = iconCache[name].cloneNode(true);
    s.setAttribute('width', size || 22);
    s.setAttribute('height', size || 22);
    s.setAttribute('aria-hidden', 'true');
    s.setAttribute('class', 'i i-' + name + (cls ? ' ' + cls : ''));
    return s;
  }

  const PROPS = new Set(['value', 'checked', 'disabled', 'muted', 'loop', 'controls']);
  function h(tag, props, ...kids) {
    const el = document.createElement(tag);
    if (props) {
      for (const k of Object.keys(props)) {
        const v = props[k];
        if (v == null || v === false) continue;
        if (k === 'class') el.className = v;
        else if (k === 'text') el.textContent = v;
        else if (k === 'style') {
          if (typeof v === 'string') el.setAttribute('style', v);
          else Object.assign(el.style, v);
        } else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
        else if (PROPS.has(k)) el[k] = v;
        else el.setAttribute(k, v === true ? '' : String(v));
      }
    }
    append(el, kids);
    return el;
  }
  function fill(el, ...kids) {
    el.replaceChildren();
    append(el, kids);
    return el;
  }
  function append(el, kids) {
    for (const k of kids) {
      if (k == null || k === false) continue;
      if (Array.isArray(k)) append(el, k);
      else el.append(k instanceof Node ? k : document.createTextNode(String(k)));
    }
  }

  const PAIRS = [
    ['#2B3A55', '#E8A87C'],
    ['#3D2B4F', '#F2C14E'],
    ['#1F4D45', '#9AD1C5'],
    ['#4A2C2A', '#F08A5D'],
    ['#2D3142', '#BFC0C0'],
    ['#3B4A2B', '#D9E58C']
  ];
  const MIX_COLORS = ['#F5A524', '#B69CFF', '#5AB0F0', '#62D2A2', '#FF8A65', '#F27BB0', '#7FD8E8', '#D8C3A5', '#C9D86A', '#E0B0FF'];
  function hashStr(s) {
    let x = 0;
    for (let i = 0; i < s.length; i++) x = (x * 31 + s.charCodeAt(i)) | 0;
    return Math.abs(x);
  }
  const colorFor = (s) => PAIRS[hashStr(String(s).toLowerCase()) % PAIRS.length];
  const fmt = (n) => Number(n || 0).toLocaleString('es');
  const enc = encodeURIComponent;

  function ago(t) {
    if (!t) return '';
    const s = (Date.now() - t) / 1000;
    if (s < 60) return 'ahora';
    if (s < 3600) return 'hace ' + Math.floor(s / 60) + ' min';
    if (s < 86400) return 'hace ' + Math.floor(s / 3600) + ' h';
    if (s < 86400 * 30) return 'hace ' + Math.floor(s / 86400) + ' d';
    return new Date(t).toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  function errText(e) {
    const m = String((e && e.message) || e || '');
    if (/fetch|network|load failed/i.test(m)) return 'No pude conectar con JoyReactor. Revisa tu conexión.';
    return m || 'Algo salió mal.';
  }

  let toastTimer = null;
  function toast(msg, actionLabel, action) {
    const t = document.getElementById('toast');
    fill(t,
      h('span', { text: msg }),
      actionLabel
        ? h('button', {
            onclick: () => {
              t.classList.remove('show');
              action();
            }
          }, actionLabel)
        : null
    );
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 3800);
  }

  function emptyBox(ic, title, text, extra) {
    return h('div', { class: 'empty' }, icon(ic, 36), h('strong', { text: title }), text ? h('span', { text }) : null, extra || null);
  }

  // ================================================================ Estado del usuario

  const S = { ui: { likesMode: 'grid' } };
  let pass = () => true;
  const timers = {};

  function persist(key, delay) {
    clearTimeout(timers[key]);
    timers[key] = setTimeout(() => {
      timers[key] = null;
      RS.save({ [key]: S[key] });
      if (key === 'favorites' || key === 'settings' || key === 'mix') syncNative();
    }, delay == null ? 250 : delay);
  }

  // App de Android: los avisos los revisa Android en segundo plano, así que le paso
  // qué vigilar y cómo (favoritos con campanita, ajustes y hashtags excluidos).
  function syncNative() {
    if (!RS.android) return;
    try {
      RS.android.syncConfig(
        JSON.stringify({
          favorites: Object.values(S.favorites).map((f) => ({ name: f.name, kind: f.kind, notify: !!f.notify })),
          settings: S.settings,
          exclude: S.mix.exclude,
          postFields: RS.POST_FIELDS
        })
      );
    } catch (e) {
      /* puente no disponible */
    }
  }

  function loadNativeNews() {
    if (!RS.android) return;
    let raw = {};
    try {
      raw = JSON.parse(RS.android.getNews() || '{}');
    } catch (e) {
      raw = {};
    }
    S.news = {
      items: (raw.items || []).map((x) => ({ id: x.id, tag: x.tag, kind: x.kind, at: x.at, post: RS.normalizePost(x.raw) })),
      unread: raw.unread || 0,
      lastCheck: raw.lastCheck || 0,
      known: {}
    };
    onNewsChanged();
  }
  function flush() {
    for (const k of Object.keys(timers)) {
      if (!timers[k]) continue;
      clearTimeout(timers[k]);
      timers[k] = null;
      RS.save({ [k]: S[k] });
    }
  }
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) flush();
  });
  window.addEventListener('pagehide', flush);

  const refreshFilter = () => (pass = RS.makeFilter(S));

  function markSeen(id) {
    if (!id || S.seenSet.has(id)) return;
    S.seenSet.add(id);
    S.seen.push(id);
    if (S.seen.length > 6000) {
      S.seen = S.seen.slice(-5000);
      S.seenSet = new Set(S.seen);
    }
    persist('seen', 2000);
  }

  // El proceso de fondo es el único que escribe las novedades; aquí solo se le pide.
  async function bg(msg) {
    if (ext) return ext.runtime.sendMessage(msg);
    if (RS.android) {
      if (msg.type === 'check-now') {
        const r = await RS.native('checkNow');
        loadNativeNews();
        return r;
      }
      if (msg.type === 'news-read') {
        RS.android.markNewsRead();
        loadNativeNews();
      }
      return null;
    }
    if (msg.type === 'check-now') {
      const r = await RS.checkNews();
      S.news = (await RS.load(['news'])).news;
      onNewsChanged();
      return r;
    }
    if (msg.type === 'news-read') {
      S.news.unread = 0;
      await RS.save({ news: S.news });
      onNewsChanged();
    }
    return null;
  }

  if (ext) {
    ext.storage.onChanged.addListener((ch, area) => {
      if (area === 'local' && ch.news && ch.news.newValue) {
        S.news = ch.news.newValue;
        onNewsChanged();
      }
    });
  }

  // ================================================================ Favoritos y mezcla

  function favList() {
    return Object.values(S.favorites).sort((a, b) =>
      a.kind === b.kind ? (a.addedAt || 0) - (b.addedAt || 0) : a.kind === 'category' ? -1 : 1
    );
  }
  function mixColor(name) {
    const i = favList().findIndex((f) => f.name === name);
    return MIX_COLORS[(i < 0 ? 0 : i) % MIX_COLORS.length];
  }

  async function addFavorite(name, extra) {
    let info;
    try {
      info = await RS.fetchTagInfo(name);
    } catch (e) {
      toast(errText(e));
      return null;
    }
    if (!info) {
      toast('No existe el hashtag «' + name + '»');
      return null;
    }
    const f = S.favorites[info.name] || { name: info.name, kind: info.kind, notify: info.kind === 'category', addedAt: Date.now(), pic: info.pic || 0 };
    Object.assign(f, extra || {});
    if (name.toLowerCase() !== info.name.toLowerCase()) f.aliases = Array.from(new Set((f.aliases || []).concat(name)));
    S.favorites[info.name] = f;
    if (!S.mix.sources[info.name]) S.mix.sources[info.name] = { on: true, w: 5 };
    refreshFavIndex();
    persist('favorites');
    persist('mix');
    invalidateRandom();
    return f;
  }

  function removeFavorite(name) {
    delete S.favorites[name];
    delete S.mix.sources[name];
    refreshFavIndex();
    persist('favorites');
    persist('mix');
    invalidateRandom();
  }

  // Índice para reconocer un favorito también por sus sinónimos (p. ej. «cat» → «cats»).
  let favIndex = new Map();
  function refreshFavIndex() {
    favIndex = new Map();
    for (const f of Object.values(S.favorites)) {
      favIndex.set(f.name.toLowerCase(), f);
      for (const a of f.aliases || []) favIndex.set(String(a).toLowerCase(), f);
    }
  }
  const favOf = (t) => favIndex.get(String(t).toLowerCase()) || null;

  function setMixOn(name, on) {
    const cfg = S.mix.sources[name] || (S.mix.sources[name] = { on: false, w: 5 });
    cfg.on = on;
    persist('mix');
    invalidateRandom();
  }

  function setNotify(name, on) {
    const f = S.favorites[name];
    if (!f) return;
    f.notify = on;
    persist('favorites');
    if (on) {
      toast(
        S.settings.notify ? 'Te avisaré de posts nuevos en ' + RS.label(f.name, f.kind) : 'Avisos desactivados en Ajustes',
        S.settings.notify ? null : 'Ajustes',
        () => nav('#/settings')
      );
    }
  }

  // ================================================================ Me gusta / No me gusta

  function toggleLike(p, forceOn) {
    const on = forceOn ? true : !S.likes[p.id];
    if (on) S.likes[p.id] = S.likes[p.id] || { at: Date.now(), post: p };
    else delete S.likes[p.id];
    persist('likes');
    document.querySelectorAll('[data-id="' + CSS.escape(p.id) + '"] .like').forEach((b) => {
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', String(on));
      if (on) {
        b.classList.remove('pop');
        void b.offsetWidth;
        b.classList.add('pop');
      }
    });
  }

  function dislike(it, card, feed) {
    const p = it.post;
    S.dislikes[p.id] = { at: Date.now(), post: p };
    if (S.likes[p.id]) {
      delete S.likes[p.id];
      persist('likes');
    }
    persist('dislikes');
    refreshFilter();
    pauseIn(card);
    const parent = card.parentNode;
    const next = card.nextSibling;
    card.remove();
    toast('Post ocultado: no volverá a aparecer', 'Deshacer', () => {
      delete S.dislikes[p.id];
      persist('dislikes');
      refreshFilter();
      const grid = !!(feed && feed.mode === 'grid');
      const again = grid ? buildThumb(it, feed) : buildCard(it, feed);
      if (parent) {
        parent.insertBefore(again, next && next.parentNode === parent ? next : null);
        if (!grid) again.scrollIntoView({ block: 'start' });
      }
    });
    if (feed) feed.checkMore();
  }

  // ================================================================ Observadores (videos y vistos)

  const nearIO = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const v = e.target;
        if (!v.getAttribute('src') && v.dataset.src) v.src = v.dataset.src;
        nearIO.unobserve(v);
      }
    },
    { rootMargin: '900px 0px' }
  );
  const playIO = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        const v = e.target;
        if (e.isIntersecting && e.intersectionRatio >= 0.6 && !viewer) {
          if (!v.getAttribute('src') && v.dataset.src) v.src = v.dataset.src;
          v.play().catch(() => {});
        } else v.pause();
      }
    },
    { threshold: [0, 0.6] }
  );
  const seenIO = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        markSeen(e.target.dataset.id);
        seenIO.unobserve(e.target);
      }
    },
    { threshold: 0.6 }
  );
  const pauseIn = (root) => root.querySelectorAll('video').forEach((v) => v.pause());

  function makeVideo(m, thumb) {
    const v = document.createElement('video');
    v.muted = true;
    v.defaultMuted = true;
    v.loop = true;
    v.playsInline = true;
    v.setAttribute('muted', '');
    v.setAttribute('playsinline', '');
    v.setAttribute('loop', '');
    v.preload = thumb ? 'metadata' : 'none';
    v.dataset.src = RS.videoUrl(m) + (thumb ? '#t=0.1' : '');
    if (!thumb) v.poster = RS.posterUrl(m);
    if (m.w && m.h) {
      v.width = m.w;
      v.height = m.h;
    }
    nearIO.observe(v);
    if (!thumb) playIO.observe(v);
    return v;
  }

  function soundBtn(v) {
    const b = h('button', { class: 'sound' });
    const paint = () => {
      fill(b, icon(v.muted ? 'muted' : 'sound', 18));
      b.setAttribute('aria-label', v.muted ? 'Activar sonido' : 'Silenciar');
    };
    b.addEventListener('click', (e) => {
      e.stopPropagation();
      v.muted = !v.muted;
      paint();
    });
    paint();
    return b;
  }

  // ================================================================ Tarjeta de post (una por pantalla)

  function avatar(p) {
    const c = colorFor(p.user || '?');
    const el = h('span', { class: 'avatar', style: { background: c[1] } }, (p.user || '?').charAt(0).toUpperCase());
    const url = RS.avatarUrl(p);
    if (url) {
      const img = new Image();
      img.alt = '';
      img.onload = () => fill(el, img);
      img.src = url;
    }
    return el;
  }

  /** Doble toque → dbl(); un toque → single() (si se da). Ignora botones y enlaces. */
  function onTaps(el, dbl, single) {
    let last = 0;
    let timer = null;
    el.addEventListener('click', (e) => {
      if (e.target.closest('button, a')) return;
      const now = Date.now();
      if (now - last < 320) {
        clearTimeout(timer);
        timer = null;
        last = 0;
        dbl();
        return;
      }
      last = now;
      if (single) timer = setTimeout(() => {
        timer = null;
        single();
      }, 320);
    });
  }

  const PROVIDERS = { YOUTUBE: 'YouTube', COUB: 'Coub', VIMEO: 'Vimeo', SOUNDCLOUD: 'SoundCloud', BANDCAMP: 'Bandcamp' };
  const ytThumb = (m) => 'https://i.ytimg.com/vi/' + enc(m.value) + '/hqdefault.jpg';
  const isTall = (m) => !!(m.w && m.h && m.h / m.w > 1.9);

  function embedLink(m, p) {
    return h('a', { class: 'embed', href: RS.embedUrl(m, p), target: '_blank', rel: 'noopener' },
      m.provider === 'YOUTUBE' ? h('img', { src: ytThumb(m), alt: '', loading: 'lazy' }) : null,
      h('span', { class: 'embed-label' }, icon('play', 18), 'Ver en ' + (PROVIDERS[m.provider] || 'JoyReactor'))
    );
  }

  function slide(m, p, i, feed) {
    const box = h('div', { class: 'slide' });
    if (m.kind === 'image') {
      box.append(h('img', { src: RS.imageUrl(m), alt: '', loading: 'lazy', decoding: 'async', width: m.w, height: m.h }));
      if (m.ext === 'gif') box.append(h('span', { class: 'mbadge', text: 'GIF' }));
      if (isTall(m)) box.append(h('button', { class: 'more', onclick: () => openViewer(feed, p, i) }, icon('expand', 18), 'Ver completa'));
      onTaps(box, () => openViewer(feed, p, i));
    } else if (m.kind === 'video') {
      const v = makeVideo(m);
      const snd = soundBtn(v);
      box.append(v, h('span', { class: 'mbadge', text: 'GIF' }), snd);
      onTaps(box, () => openViewer(feed, p, i), () => snd.click());
    } else {
      box.append(embedLink(m, p));
    }
    return box;
  }

  function carousel(slides, onIndex) {
    const track = h('div', { class: 'track' }, slides);
    const counter = h('span', { class: 'counter', text: '1/' + slides.length });
    const dots = h('div', { class: 'dots' }, slides.map((s, i) => h('span', { class: i ? '' : 'on' })));
    let idx = 0;
    track.addEventListener(
      'scroll',
      () => {
        const i = Math.round(track.scrollLeft / Math.max(1, track.clientWidth));
        if (i === idx) return;
        idx = i;
        counter.textContent = i + 1 + '/' + slides.length;
        Array.from(dots.children).forEach((d, j) => d.classList.toggle('on', j === i));
        if (onIndex) onIndex(i);
      },
      { passive: true }
    );
    return { track, counter, dots };
  }

  // Una imagen ocupa todo el espacio; varias van en carrusel (se deslizan hacia los lados).
  function buildMedia(p, feed) {
    const ms = p.media;
    if (!ms.length) return null;
    if (ms.length === 1) return h('div', { class: 'media single' }, slide(ms[0], p, 0, feed));
    const c = carousel(ms.map((m, i) => slide(m, p, i, feed)));
    const el = h('div', { class: 'media carousel' }, c.track, c.counter);
    el._dots = c.dots;
    return el;
  }

  function tagsRow(p) {
    return h('div', { class: 'tags' },
      p.tags.map((t) => h('a', { class: 'htag' + (favOf(t) ? ' fav' : ''), href: '#/tag/' + enc(t), text: '#' + t }))
    );
  }

  function buildCard(it, feed) {
    const p = it.post;
    const card = h('article', { class: 'card', 'data-id': p.id });
    if (it.label) card.append(h('div', { class: 'source', style: it.color ? { color: it.color } : null }, icon(it.icon || 'shuffle', 14), h('span', { text: it.label })));
    card.append(
      h('div', { class: 'head' },
        avatar(p),
        h('div', { class: 'who' }, h('span', { class: 'user', text: p.user || 'anónimo' }), h('span', { class: 'when', text: ago(p.time) })),
        h('span', { class: 'rating' + (p.rating < 0 ? ' neg' : ''), title: 'Rating en JoyReactor' }, icon('up', 14), String(p.rating).replace('.', ','))
      )
    );
    const media = buildMedia(p, feed);
    if (media) card.append(media);
    else card.classList.add('textonly');

    const liked = !!S.likes[p.id];
    const dots = media && media._dots && p.media.length <= 12 ? media._dots : null;
    if (dots) dots.className = 'dots ig';
    card.append(
      h('div', { class: 'actions' },
        dots,
        h('button', { class: 'act like' + (liked ? ' on' : ''), 'aria-label': 'Me gusta', 'aria-pressed': String(liked), onclick: () => toggleLike(p) }, icon('heart', 27)),
        h('button', { class: 'act', 'aria-label': 'No me gusta: ocultar para siempre', onclick: () => dislike(it, card, feed) }, icon('down', 25)),
        h('a', { class: 'act', href: RS.postUrl(p), target: '_blank', rel: 'noopener', 'aria-label': p.comments + ' comentarios en JoyReactor' }, icon('comment', 24), fmt(p.comments)),
        h('span', { class: 'grow' }),
        media ? h('button', { class: 'act dim', 'aria-label': 'Pantalla completa', onclick: () => openViewer(feed, p, currentIndex(card)) }, icon('expand', 21)) : null,
        h('a', { class: 'act dim', href: RS.postUrl(p), target: '_blank', rel: 'noopener', 'aria-label': 'Abrir el post original en JoyReactor' }, icon('external', 20))
      )
    );
    if (p.text) {
      const cap = h('p', { class: 'caption', text: p.text });
      cap.addEventListener('click', () => cap.classList.toggle('open'));
      card.append(cap);
    }
    if (p.tags.length) card.append(tagsRow(p));
    seenIO.observe(card);
    return card;
  }

  function currentIndex(card) {
    const track = card.querySelector('.track');
    return track ? Math.round(track.scrollLeft / Math.max(1, track.clientWidth)) : 0;
  }

  function thumbMedia(m) {
    if (!m) return null;
    if (m.kind === 'image') return h('img', { src: RS.imageUrl(m), alt: '', loading: 'lazy', decoding: 'async' });
    if (m.kind === 'video') {
      // Imagen fija del GIF; si no existe, el primer cuadro del video.
      const img = h('img', { src: RS.posterUrl(m), alt: '', loading: 'lazy', decoding: 'async' });
      img.addEventListener('error', () => img.replaceWith(makeVideo(m, true)), { once: true });
      return img;
    }
    if (m.provider === 'YOUTUBE') return h('img', { src: ytThumb(m), alt: '', loading: 'lazy' });
    return null;
  }

  // Miniatura: tocarla abre el post en el feed; abajo tiene «no me gusta» y «me gusta» a mano.
  function buildThumb(it, feed) {
    const p = it.post;
    const m = p.media[0];
    const cell = h('div', { class: 'thumb', 'data-id': p.id });
    const open = h('button', {
      class: 'thumb-open',
      'aria-label': 'Abrir post' + (p.tags.length ? ' ' + p.tags.slice(0, 3).map((t) => '#' + t).join(' ') : ''),
      onclick: () => feed.setMode('feed', p.id)
    });
    const media = thumbMedia(m);
    if (media) open.append(media);
    else open.append(h('span', { class: 'ttext', text: (p.text || (m ? PROVIDERS[m.provider] || 'Video' : 'Post de texto')).slice(0, 90) }));
    cell.append(open);
    if (p.media.length > 1) cell.append(h('span', { class: 'tb' }, icon('multi', 15)));
    else if (m && (m.kind === 'video' || m.ext === 'gif')) cell.append(h('span', { class: 'tb', text: 'GIF' }));

    const liked = !!S.likes[p.id];
    cell.append(
      h('div', { class: 'tacts' },
        h('button', { class: 'tact', 'aria-label': 'No me gusta: ocultar para siempre', onclick: () => dislike(it, cell, feed) }, icon('down', 19)),
        h('button', { class: 'tact like' + (liked ? ' on' : ''), 'aria-label': 'Me gusta', 'aria-pressed': String(liked), onclick: () => toggleLike(p) }, icon('heart', 21))
      )
    );
    return cell;
  }

  // ================================================================ Pantalla completa (doble toque)
  //
  // Funciona como Reels: arriba/abajo pasa de post (sigue el mismo feed y carga más solo),
  // a los lados recorre las imágenes del post. Doble toque o «atrás» para salir.

  let viewer = null;
  let afterViewerClose = null;

  function setFullscreen(on) {
    if (RS.android && RS.android.setFullscreen) {
      try {
        RS.android.setFullscreen(on);
      } catch (e) {
        /* sin pantalla completa nativa */
      }
      return;
    }
    try {
      if (on && !document.fullscreenElement && document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(() => {});
      if (!on && document.fullscreenElement) document.exitFullscreen().catch(() => {});
    } catch (e) {
      /* el navegador no lo permite */
    }
  }

  function openViewer(feed, p, mediaIndex) {
    closeViewer();
    let items = feed ? feed.items.filter((it) => !S.dislikes[it.post.id]) : [];
    if (!items.some((it) => it.post.id === p.id)) {
      items = [{ post: p }];
      feed = null;
    }
    const scroller = h('div', { class: 'vw-feed' });
    const v = { feed, scroller, current: null, muted: false, onAdd: null };
    viewer = v;
    v.el = h('div', { class: 'viewer', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Pantalla completa' },
      scroller,
      h('div', { class: 'vw-bar' }, h('button', { class: 'vw-btn', 'aria-label': 'Salir de pantalla completa', onclick: () => exitViewer() }, icon('x', 24)))
    );
    // Solo se cargan los posts cercanos; los lejanos se vacían para no gastar memoria.
    v.near = new IntersectionObserver(
      (es) => es.forEach((e) => (e.isIntersecting ? fillPage(e.target, 0) : emptyPage(e.target))),
      { root: scroller, rootMargin: '200% 0px' }
    );
    v.seen = new IntersectionObserver(
      (es) => es.forEach((e) => {
        if (e.isIntersecting) setCurrentPage(e.target);
      }),
      { root: scroller, threshold: 0.6 }
    );
    items.forEach((it) => scroller.append(makePage(it)));
    // Respaldo de los observadores: al terminar de deslizar, el post visible pasa a ser el actual.
    let settle = null;
    scroller.addEventListener(
      'scroll',
      () => {
        clearTimeout(settle);
        settle = setTimeout(() => {
          if (viewer !== v) return;
          const i = Math.round(scroller.scrollTop / Math.max(1, scroller.clientHeight));
          const page = scroller.children[i];
          if (!page) return;
          [scroller.children[i - 1], scroller.children[i + 1]].forEach((q) => q && fillPage(q, 0));
          if (v.current !== page) setCurrentPage(page);
        }, 90);
      },
      { passive: true }
    );
    if (feed) {
      v.onAdd = (added) => {
        if (viewer === v) added.forEach((it) => scroller.append(makePage(it)));
      };
      feed.listeners.add(v.onAdd);
    }

    document.querySelectorAll('#view video').forEach((x) => x.pause());
    document.body.append(v.el);
    document.body.classList.add('noscroll');
    // En el navegador el «atrás» cierra la pantalla completa vía historial; en la app lo maneja Android (RSApp.handleBack).
    if (!RS.android) {
      history.pushState({ rsViewer: true }, '');
      v.pushed = true;
    }
    setFullscreen(true);

    const start = scroller.querySelector('[data-id="' + CSS.escape(p.id) + '"]') || scroller.firstElementChild;
    if (start) {
      fillPage(start, mediaIndex || 0);
      scroller.scrollTop = start.offsetTop;
      setCurrentPage(start);
    }
  }

  function makePage(it) {
    const page = h('section', { class: 'vw-page', 'data-id': it.post.id });
    page._it = it;
    viewer.near.observe(page);
    viewer.seen.observe(page);
    return page;
  }

  function fillPage(page, mediaIndex) {
    if (!viewer || page.dataset.filled) return;
    const it = page._it;
    const p = it.post;
    const videos = [];
    const slides = p.media.map((m) => {
      const s = h('div', { class: 'vw-slide' });
      if (m.kind === 'image') {
        if (m.w && m.h / m.w > window.innerHeight / Math.max(1, window.innerWidth)) s.classList.add('tall');
        s.append(h('img', { src: RS.imageUrl(m, true), alt: '', decoding: 'async' }));
        onTaps(s, () => exitViewer());
      } else if (m.kind === 'video') {
        const vid = h('video', { src: RS.videoUrl(m), loop: true, playsinline: true, poster: RS.posterUrl(m), preload: 'auto' });
        vid.muted = viewer.muted;
        videos.push(vid);
        s.append(vid);
        onTaps(s, () => exitViewer(), toggleViewerSound);
      } else {
        s.append(embedLink(m, p));
      }
      return s;
    });

    let media;
    if (slides.length > 1) {
      const c = carousel(slides, syncViewerPlayback);
      c.track.className = 'vw-track';
      c.counter.className = 'vw-count';
      media = h('div', { class: 'vw-media' }, c.track, c.counter);
      page._track = c.track;
      page._counter = c.counter;
      if (slides.length <= 12) {
        c.dots.className = 'dots vw-dots';
        page._dots = c.dots;
      }
    } else if (slides.length) {
      media = h('div', { class: 'vw-media' }, slides[0]);
    } else {
      media = h('div', { class: 'vw-media text' }, h('p', { text: p.text || '' }));
      onTaps(media, () => exitViewer());
    }

    const liked = !!S.likes[p.id];
    const side = h('div', { class: 'vw-side' },
      h('button', { class: 'vw-act like' + (liked ? ' on' : ''), 'aria-label': 'Me gusta', 'aria-pressed': String(liked), onclick: () => toggleLike(p) }, icon('heart', 31)),
      h('button', { class: 'vw-act', 'aria-label': 'No me gusta: ocultar para siempre', onclick: () => dislikeInViewer(page) }, icon('down', 29)),
      h('a', { class: 'vw-act', href: RS.postUrl(p), target: '_blank', rel: 'noopener', 'aria-label': p.comments + ' comentarios en JoyReactor' }, icon('comment', 29), h('span', { text: fmt(p.comments) })),
      videos.length ? h('button', { class: 'vw-act vw-sound', 'aria-label': viewer.muted ? 'Activar sonido' : 'Silenciar', onclick: toggleViewerSound }, icon(viewer.muted ? 'muted' : 'sound', 27)) : null,
      h('a', { class: 'vw-act', href: RS.postUrl(p), target: '_blank', rel: 'noopener', 'aria-label': 'Abrir el post original en JoyReactor' }, icon('external', 25))
    );
    const info = h('div', { class: 'vw-info' },
      page._dots || null,
      it.label ? h('span', { class: 'vw-src', text: it.label }) : null,
      h('div', { class: 'vw-who' },
        h('strong', { text: p.user || 'anónimo' }),
        h('span', { text: ' · ' + ago(p.time) + ' · ' }),
        h('span', { class: 'vw-rating' }, icon('up', 13), String(p.rating).replace('.', ','))
      ),
      p.tags.length
        ? h('div', { class: 'vw-tags' },
            p.tags.map((t) =>
              h('a', {
                class: 'htag' + (favOf(t) ? ' fav' : ''),
                href: '#/tag/' + enc(t),
                text: '#' + t,
                onclick: (e) => {
                  e.preventDefault();
                  closeViewerThen(() => nav('#/tag/' + enc(t)));
                }
              })
            )
          )
        : null
    );

    fill(page, media, side, info);
    page._dots = null;
    page.dataset.filled = '1';
    page._videos = videos;
    if (mediaIndex && page._track) {
      page._track.scrollLeft = mediaIndex * page._track.clientWidth;
      page._counter.textContent = mediaIndex + 1 + '/' + slides.length;
    }
    if (viewer.current === page) syncViewerPlayback();
  }

  function emptyPage(page) {
    if (!page.dataset.filled || (viewer && viewer.current === page)) return;
    page.querySelectorAll('video').forEach((x) => {
      x.pause();
      x.removeAttribute('src');
      x.load();
    });
    fill(page);
    delete page.dataset.filled;
    page._track = null;
    page._videos = [];
  }

  function setCurrentPage(page) {
    if (!viewer) return;
    viewer.current = page;
    fillPage(page, 0);
    markSeen(page.dataset.id);
    syncViewerPlayback();
    const pages = viewer.scroller.children;
    const idx = Array.prototype.indexOf.call(pages, page);
    if (viewer.feed && idx >= pages.length - 3) viewer.feed.loadMore();
  }

  // Solo suena el video que está a la vista (post actual y, si es carrusel, imagen actual).
  function syncViewerPlayback() {
    if (!viewer) return;
    for (const page of viewer.scroller.children) {
      const vids = page._videos || [];
      if (!vids.length) continue;
      let visibleSlide = null;
      if (page === viewer.current) {
        if (page._track) visibleSlide = page._track.children[Math.round(page._track.scrollLeft / Math.max(1, page._track.clientWidth))];
        else visibleSlide = page.querySelector('.vw-slide');
      }
      for (const vid of vids) {
        if (visibleSlide && vid.parentNode === visibleSlide) vid.play().catch(() => {});
        else vid.pause();
      }
    }
  }

  function toggleViewerSound() {
    if (!viewer) return;
    viewer.muted = !viewer.muted;
    viewer.el.querySelectorAll('video').forEach((x) => (x.muted = viewer.muted));
    viewer.el.querySelectorAll('.vw-sound').forEach((b) => {
      fill(b, icon(viewer.muted ? 'muted' : 'sound', 27));
      b.setAttribute('aria-label', viewer.muted ? 'Activar sonido' : 'Silenciar');
    });
  }

  function dislikeInViewer(page) {
    const v = viewer;
    const it = page._it;
    const p = it.post;
    const feed = v.feed;
    S.dislikes[p.id] = { at: Date.now(), post: p };
    if (S.likes[p.id]) {
      delete S.likes[p.id];
      persist('likes');
    }
    persist('dislikes');
    refreshFilter();

    const listEl = feed && feed.list.querySelector('[data-id="' + CSS.escape(p.id) + '"]');
    const listParent = listEl && listEl.parentNode;
    const listNext = listEl && listEl.nextSibling;
    if (listEl) listEl.remove();

    const next = page.nextElementSibling || page.previousElementSibling;
    const after = page.nextSibling;
    page.querySelectorAll('video').forEach((x) => x.pause());
    v.near.unobserve(page);
    v.seen.unobserve(page);
    page.remove();
    if (next) setCurrentPage(next);
    else exitViewer();

    toast('Post ocultado: no volverá a aparecer', 'Deshacer', () => {
      delete S.dislikes[p.id];
      persist('dislikes');
      refreshFilter();
      if (listParent) {
        const again = feed.mode === 'grid' ? buildThumb(it, feed) : buildCard(it, feed);
        listParent.insertBefore(again, listNext && listNext.parentNode === listParent ? listNext : null);
      }
      if (viewer === v) {
        const pg = makePage(it);
        v.scroller.insertBefore(pg, after && after.parentNode === v.scroller ? after : null);
        fillPage(pg, 0);
        v.scroller.scrollTop = pg.offsetTop;
      }
    });
  }

  function closeViewer() {
    if (!viewer) return;
    const v = viewer;
    viewer = null;
    if (v.feed && v.onAdd) v.feed.listeners.delete(v.onAdd);
    v.near.disconnect();
    v.seen.disconnect();
    v.el.querySelectorAll('video').forEach((x) => x.pause());
    v.el.remove();
    document.body.classList.remove('noscroll');
    setFullscreen(false);

    // Al salir, el feed de abajo queda en el post que estabas viendo (también si después
    // entras a un hashtag y vuelves con «atrás»).
    const id = v.current && v.current.dataset.id;
    const feed = v.feed;
    if (id && feed) {
      feed.anchorId = id;
      feed.anchorHold = Date.now() + 1500;
      if (current && current.feed === feed) {
        feed.scrollToPost(id);
        // Repite cuando Android termine de mostrar otra vez las barras (cambia el alto de la pantalla).
        for (const ms of [150, 450]) setTimeout(() => current && current.feed === feed && feed.scrollToPost(id), ms);
      }
    }
  }

  // Sale de la pantalla completa sin moverse de la página en la que estabas.
  function exitViewer() {
    if (!viewer) return;
    if (viewer.pushed) history.back();
    else closeViewer();
  }

  function closeViewerThen(fn) {
    if (viewer && viewer.pushed) {
      afterViewerClose = fn;
      history.back();
    } else {
      closeViewer();
      fn();
    }
  }

  window.addEventListener('popstate', () => {
    const fn = afterViewerClose;
    afterViewerClose = null;
    closeViewer();
    if (fn) fn();
  });

  // ================================================================ Feed (scroll infinito)

  class Feed {
    constructor(o) {
      this.key = o.key;
      this.kind = o.kind; // 'pager' | 'random' | 'static'
      this.tag = o.tag || null;
      this.type = o.type || 'GOOD';
      this.gif = !!o.gif; // solo GIF y videos (hashtag)
      this.mode = o.mode || 'feed';
      this.source = o.source || '';
      this.staticItems = o.items || [];
      this.renderHead = o.head;
      this.renderExtra = o.extra;
      this.renderEmpty = o.empty;
      this.onMode = o.onMode;
      this.items = [];
      this.ids = new Set();
      this.next = null;
      this.cursor = 0;
      this.done = false;
      this.loading = false;
      this.failed = false;
      this.scrollY = 0;
      this.emptyStreak = 0;
      this.endText = '';
      this.listeners = new Set();

      this.headEl = h('header', { class: 'top' + (o.back ? ' has-back' : '') });
      this.extraEl = h('div', { class: 'feed-extra' });
      this.list = h('div', { class: 'list' });
      this.statusEl = h('div', { class: 'status' });
      this.sentinel = h('div', { class: 'sentinel' });
      this.root = h('div', { class: 'feed' }, this.headEl, this.extraEl, this.list, this.statusEl, this.sentinel);
      this.io = new IntersectionObserver((es) => {
        if (es.some((e) => e.isIntersecting)) this.loadMore();
      }, { rootMargin: '0px 0px 1600px 0px' });
      this.io.observe(this.sentinel);
      this.applyMode();
    }

    refreshHead() {
      fill(this.headEl, ...[].concat(this.renderHead ? this.renderHead(this) : []));
    }
    refresh() {
      this.refreshHead();
      fill(this.extraEl, ...[].concat(this.renderExtra ? this.renderExtra(this) : []));
    }
    applyMode() {
      this.list.className = 'list ' + (this.mode === 'grid' ? 'grid' : 'cards');
    }

    setStatus(kind, err) {
      const s = this.statusEl;
      if (kind === 'loading') {
        fill(s, icon('spinner', 20, 'spin'), this.kind === 'random' ? 'Sorteando posts de tu mezcla…' : 'Cargando más posts…');
      } else if (kind === 'error') {
        fill(s,
          emptyBox('alert', 'No se pudo cargar', errText(err), h('button', {
            class: 'btn ghost retry',
            onclick: () => {
              this.failed = false;
              this.loadMore();
            }
          }, 'Reintentar'))
        );
      } else if (kind === 'end') {
        if (this.items.length) fill(s, h('span', { text: this.endText || 'No hay más posts.' }));
        else fill(s, this.renderEmpty ? this.renderEmpty() : emptyBox('hash', 'No hay posts aquí', this.endText));
      } else fill(s);
    }

    async loadMore() {
      if (this.loading || this.done || this.failed || !this.root.isConnected) return;
      this.loading = true;
      this.setStatus('loading');
      try {
        let added = 0;
        for (let guard = 0; !added && !this.done && guard < 5; guard++) added += await this.fetchChunk();
        this.setStatus(this.done ? 'end' : '');
      } catch (e) {
        this.failed = true;
        this.setStatus('error', e);
      }
      this.loading = false;
      this.checkMore();
    }

    checkMore() {
      if (this.done || this.loading || this.failed || !this.root.isConnected) return;
      if (this.sentinel.getBoundingClientRect().top < window.innerHeight + 1600) setTimeout(() => this.loadMore(), 0);
    }

    async fetchChunk() {
      if (this.kind === 'pager' && this.gif) {
        const page = this.next == null ? 1 : this.next;
        const res = await RS.fetchGifPage(this.tag, this.type, page, S.settings.hideNsfw);
        this.next = page + 1;
        if (this.next > res.lastPage || !res.posts.length) {
          this.done = true;
          if (res.count >= RS.GIF_LIMIT) this.endText = 'Llegaste al límite: JoyReactor solo deja ver los ' + RS.GIF_LIMIT + ' GIF más recientes de cada hashtag. Prueba con «Top» o con el orden aleatorio.';
        }
        return this.add(res.posts.filter(RS.isAnimated).map((post) => ({ post })));
      }
      if (this.kind === 'pager') {
        const res = await RS.fetchPage(this.tag, this.type, this.next);
        this.next = this.next == null ? res.lastPage - 1 : this.next - 1;
        if (this.next < 1) this.done = true;
        return this.add(res.posts.map((post) => ({ post })));
      }
      if (this.kind === 'random') {
        // Con tag: solo ese hashtag, en orden aleatorio (calidad según el orden elegido arriba).
        const opts = { n: 4, skip: this.ids };
        if (this.tag) Object.assign(opts, { sources: [{ name: this.tag, kind: null, w: 1 }], type: this.type, era: 'any', noRepeat: false, gif: this.gif, hideNsfw: S.settings.hideNsfw });
        const batch = await RS.randomBatch({ favorites: S.favorites, mix: S.mix, seenSet: S.seenSet, filter: pass }, opts);
        const n = this.add(
          batch.map((x) =>
            this.tag
              ? { post: x.post }
              : {
                  post: x.post,
                  label: x.source ? 'De tu mezcla · ' + RS.label(x.source, x.sourceKind) : 'Al azar en todo JoyReactor',
                  color: x.source ? mixColor(x.source) : null
                }
          )
        );
        this.emptyStreak = n ? 0 : this.emptyStreak + 1;
        if (this.emptyStreak >= 4) {
          this.done = true;
          this.endText = this.tag
            ? 'Ya no encuentro más posts de #' + this.tag + ' que no hayas visto aquí. Toca «Barajar» para empezar otra vez.'
            : 'No encontré más posts nuevos con tu mezcla. Añade más hashtags o desactiva «No repetir lo que ya vi».';
        }
        return n;
      }
      const chunk = this.staticItems.slice(this.cursor, this.cursor + 15);
      this.cursor += chunk.length;
      if (this.cursor >= this.staticItems.length) this.done = true;
      return this.add(chunk);
    }

    add(items) {
      const added = [];
      const frag = document.createDocumentFragment();
      for (const it of items) {
        const p = it.post;
        if (!p || this.ids.has(p.id)) continue;
        if (this.kind === 'static' ? !!S.dislikes[p.id] : !pass(p)) continue;
        this.ids.add(p.id);
        this.items.push(it);
        frag.append(this.mode === 'grid' ? buildThumb(it, this) : buildCard(it, this));
        added.push(it);
      }
      this.list.append(frag);
      if (added.length) for (const fn of this.listeners) fn(added);
      return added.length;
    }

    topVisibleId() {
      const top = this.headEl.getBoundingClientRect().bottom;
      for (const el of this.list.children) if (el.getBoundingClientRect().bottom > top + 8) return el.dataset.id;
      return null;
    }

    scrollToPost(id) {
      const el = id && this.list.querySelector('[data-id="' + CSS.escape(id) + '"]');
      if (!el || !el.isConnected) return false;
      if (this.mode === 'grid') el.scrollIntoView({ block: 'center' });
      else window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - this.headEl.offsetHeight);
      return true;
    }

    setMode(mode, anchorId) {
      if (mode === this.mode && !anchorId) return;
      const anchor = anchorId || this.topVisibleId();
      pauseIn(this.list);
      this.mode = mode;
      this.applyMode();
      updateSnap();
      fill(this.list, ...this.items.filter((it) => !S.dislikes[it.post.id]).map((it) => (mode === 'grid' ? buildThumb(it, this) : buildCard(it, this))));
      this.refreshHead();
      if (this.onMode) this.onMode(mode);
      requestAnimationFrame(() => {
        const el = anchor && this.list.querySelector('[data-id="' + CSS.escape(anchor) + '"]');
        if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - this.headEl.offsetHeight);
        else window.scrollTo(0, 0);
        this.checkMore();
      });
    }

    reset() {
      pauseIn(this.list);
      this.items = [];
      this.ids.clear();
      this.next = null;
      this.cursor = 0;
      this.done = false;
      this.failed = false;
      this.emptyStreak = 0;
      this.endText = '';
      fill(this.list);
      this.refresh();
      window.scrollTo(0, 0);
      this.loadMore();
    }

    destroy() {
      this.io.disconnect();
      pauseIn(this.root);
    }
  }

  // ================================================================ Navegación

  const feeds = new Map();
  let current = null;
  const stack = [];
  let replacing = false;

  const nav = (hash) => (location.hash = hash);
  function navReplace(hash) {
    replacing = true;
    location.replace(hash);
  }
  function goBack(fallback) {
    if (stack.length > 1) history.back();
    else navReplace(fallback);
  }

  function cached(key, make) {
    let f = feeds.get(key);
    if (f) feeds.delete(key);
    else f = make();
    feeds.set(key, f);
    while (feeds.size > 6) {
      const [k, old] = feeds.entries().next().value;
      feeds.delete(k);
      old.destroy();
    }
    return f;
  }
  function invalidateRandom() {
    const f = feeds.get('random');
    if (f && !(current && current.feed === f)) {
      feeds.delete('random');
      f.destroy();
    }
  }

  function mount(nodes, feed) {
    if (current && current.feed) {
      const prev = current.feed;
      prev.scrollY = window.scrollY;
      if (!(prev.anchorHold && Date.now() < prev.anchorHold)) prev.anchorId = prev.topVisibleId();
      pauseIn(prev.root);
    }
    fill(viewEl, ...[].concat(nodes));
    current = { feed: feed || null };
    updateSnap();
    if (!feed) window.scrollTo(0, 0);
  }

  // En modo feed se ve un post por pantalla: el desplazamiento se «engancha» en cada post.
  function updateSnap() {
    document.documentElement.classList.toggle('snap', !!(current && current.feed && current.feed.mode === 'feed'));
  }

  function showFeed(f) {
    mount(f.root, f);
    f.refresh();
    const anchor = f.anchorId;
    if (!(anchor && f.scrollToPost(anchor))) window.scrollTo(0, f.scrollY || 0);
    // La cabecera del hashtag termina de dibujarse un momento después: vuelvo a alinear.
    if (anchor) setTimeout(() => current && current.feed === f && f.scrollToPost(anchor), 250);
    if (!f.items.length) f.loadMore();
    else f.checkMore();
  }

  function parseHash() {
    const raw = location.hash.replace(/^#/, '') || '/home';
    const qi = raw.indexOf('?');
    const path = qi < 0 ? raw : raw.slice(0, qi);
    const q = new URLSearchParams(qi < 0 ? '' : raw.slice(qi + 1));
    const parts = path
      .split('/')
      .filter(Boolean)
      .map((s) => {
        try {
          return decodeURIComponent(s);
        } catch (e) {
          return s;
        }
      });
    return { parts, q, key: raw };
  }

  const TAB_OF = { home: 'home', tag: 'home', search: 'home', news: 'home', random: 'random', mix: 'random', favorites: 'favorites', settings: 'favorites', likes: 'likes', hidden: 'likes' };

  function route() {
    const { parts, q, key } = parseHash();
    if (replacing && stack.length) stack[stack.length - 1] = key;
    else if (stack.length > 1 && stack[stack.length - 2] === key) stack.pop();
    else if (stack[stack.length - 1] !== key) stack.push(key);
    replacing = false;
    closeViewer();

    const name = parts[0] || 'home';
    document.querySelectorAll('#tabs a').forEach((a) => a.classList.toggle('on', a.dataset.tab === (TAB_OF[name] || 'home')));
    document.querySelectorAll('#tabs a').forEach((a) => (a.classList.contains('on') ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current')));

    if (name === 'tag' && parts[1]) return routeTag(parts[1], q);
    if (name === 'random') return routeRandom();
    if (name === 'mix') return routeMix();
    if (name === 'favorites') return routeFavorites();
    if (name === 'search') return routeSearch();
    if (name === 'likes') return routeLikes(q);
    if (name === 'hidden') return routeHidden();
    if (name === 'news') return routeNews();
    if (name === 'settings') return routeSettings();
    return routeHome(q);
  }

  // ================================================================ Piezas comunes

  const backBtn = (fallback) => h('button', { class: 'ib', 'aria-label': 'Volver', onclick: () => goBack('#' + fallback) }, icon('back', 24));
  const iconLink = (ic, label, href) => h('a', { class: 'ib', href, 'aria-label': label, title: label }, icon(ic, 22));

  function viewToggle(feed) {
    const b = (mode, ic, label) =>
      h('button', { class: feed.mode === mode ? 'on' : '', 'aria-label': label, 'aria-pressed': String(feed.mode === mode), onclick: () => feed.setMode(mode) }, icon(ic, 20));
    return h('div', { class: 'vtoggle' }, b('feed', 'feed', 'Vista feed'), b('grid', 'grid', 'Vista miniaturas'));
  }

  function fillBell(a) {
    const n = S.news.unread || 0;
    a.setAttribute('aria-label', n ? n + ' posts nuevos en tus favoritos' : 'Novedades');
    fill(a, icon('bell', 22), n ? h('span', { class: 'badge-count', text: n > 99 ? '99+' : String(n) }) : null);
  }
  function bellLink() {
    const a = h('a', { class: 'ib', href: '#/news', 'data-bell': '1' });
    fillBell(a);
    return a;
  }
  function onNewsChanged() {
    document.querySelectorAll('[data-bell]').forEach(fillBell);
  }

  function sortChips(currentType, onPick) {
    return h('nav', { class: 'chips', 'aria-label': 'Orden' },
      RS.TYPES.map((t) => h('button', { class: 'chip' + (t.id === currentType ? ' on' : ''), 'aria-pressed': String(t.id === currentType), onclick: () => onPick(t.id) }, t.label))
    );
  }

  // Círculo con la imagen del hashtag (la de JoyReactor); mientras carga, o si no tiene, «#».
  const picCache = new Map();
  function tagPic(name, cls, fallback, known) {
    const c = colorFor(name);
    const el = h('span', { class: cls, style: { background: c[0], color: c[1] } }, fallback);
    const show = (pic) => {
      if (!pic) return;
      const img = new Image();
      img.alt = '';
      img.onload = () => fill(el, img);
      img.src = RS.tagImageUrl(pic);
    };
    const key = String(name).toLowerCase();
    const fav = favOf(name);
    if (known !== undefined) show(known);
    else if (picCache.has(key)) show(picCache.get(key));
    else if (fav && fav.pic !== undefined) show(fav.pic);
    else {
      RS.fetchTagInfo(name)
        .then((info) => {
          const pic = info ? info.pic || 0 : 0;
          picCache.set(key, pic);
          if (fav && fav.pic === undefined) {
            fav.pic = pic;
            persist('favorites');
          }
          show(pic);
        })
        .catch(() => {});
    }
    return el;
  }

  function storiesRow() {
    const favs = favList();
    const row = h('section', { class: 'stories', 'aria-label': 'Tus favoritos' });
    for (const f of favs) {
      const c = colorFor(f.name);
      row.append(
        h('a', { class: 'story', href: '#/tag/' + enc(f.name) },
          h('span', { class: 'ring' }, tagPic(f.name, 'disc', f.kind === 'category' ? f.name.charAt(0).toUpperCase() : '#')),
          h('span', { class: 'label', text: f.name })
        )
      );
    }
    row.append(
      h('a', { class: 'story', href: '#/favorites' },
        h('span', { class: 'ring dashed' }, icon('plus', 22)),
        h('span', { class: 'label', text: favs.length ? 'Añadir' : 'Favoritos' })
      )
    );
    return row;
  }

  function switchBtn(on, label, onToggle) {
    const b = h('button', { class: 'switch', role: 'switch', 'aria-checked': String(!!on), 'aria-label': label }, h('span', { class: 'track' }, h('span', { class: 'knob' })));
    b.addEventListener('click', () => {
      const v = b.getAttribute('aria-checked') !== 'true';
      b.setAttribute('aria-checked', String(v));
      onToggle(v);
    });
    return b;
  }

  function seg(options, value, onPick) {
    const wrap = h('div', { class: 'seg' });
    for (const [val, label] of options) {
      const b = h('button', { class: val === value ? 'on' : '', 'aria-pressed': String(val === value) }, label);
      b.addEventListener('click', () => {
        wrap.querySelectorAll('button').forEach((x) => {
          x.classList.toggle('on', x === b);
          x.setAttribute('aria-pressed', String(x === b));
        });
        onPick(val);
      });
      wrap.append(b);
    }
    return wrap;
  }

  // ================================================================ Actualizaciones

  async function installUpdate() {
    if (!S.update) return;
    toast('Descargando la versión ' + S.update.version + '…');
    try {
      const r = await RS.native('installUpdate', S.update.url);
      if (r && r.needsPermission) toast('Activa «Permitir de esta fuente» para Reactor Swipe, vuelve y toca Actualizar otra vez.');
    } catch (e) {
      toast(errText(e));
    }
  }

  function updateBanner() {
    if (!S.update) return null;
    return h('div', { class: 'notice green' },
      h('strong', { text: 'Versión nueva disponible: ' + S.update.version }),
      h('span', { text: 'Toca Actualizar y después Instalar. Tus me gusta y favoritos se conservan.' }),
      h('div', { class: 'row-btns' },
        h('button', { class: 'btn', onclick: installUpdate }, icon('download', 18), 'Actualizar'),
        h('button', {
          class: 'btn quiet',
          onclick: () => {
            S.update = null;
            if (current && current.feed) current.feed.refresh();
          }
        }, 'Luego')
      )
    );
  }

  async function lookForUpdate(manual) {
    try {
      S.update = await RS.checkForUpdate();
    } catch (e) {
      if (manual) toast(errText(e));
      return;
    }
    if (manual) toast(S.update ? 'Hay una versión nueva: ' + S.update.version : 'Ya tienes la última versión (' + RS.version() + ')');
    if (S.update && current && current.feed && /^home:/.test(current.feed.key)) current.feed.refresh();
  }

  // ================================================================ Inicio

  function routeHome(q) {
    const type = RS.validType(q.get('sort')) || RS.validType(S.settings.homeSort) || 'GOOD';
    const f = cached('home:' + type, () =>
      new Feed({
        key: 'home:' + type,
        kind: 'pager',
        tag: null,
        type,
        head: (f) => [h('h1', { text: 'Inicio' }), bellLink(), iconLink('search', 'Buscar hashtag', '#/search'), viewToggle(f)],
        extra: () => [
          updateBanner(),
          storiesRow(),
          sortChips(type, (t) => {
            S.settings.homeSort = t;
            persist('settings');
            navReplace('#/home?sort=' + t);
          })
        ]
      })
    );
    showFeed(f);
  }

  // ================================================================ Hashtag

  function tagHero(name) {
    const el = h('section', { class: 'hero' });
    let info = null;

    const draw = () => {
      const fav = favOf(name) || (info && favOf(info.name));
      const canon = fav ? fav.name : info ? info.name : name;
      const inMix = !!(fav && S.mix.sources[canon] && S.mix.sources[canon].on);
      const notify = !!(fav && fav.notify);
      const c = colorFor(canon);
      const meta = info
        ? (info.kind === 'category' ? 'Categoría' : 'Hashtag') + (info.parent ? ' de ' + RS.label(info.parent, 'category') : '') + ' · ' + fmt(info.count) + ' posts'
        : 'Cargando…';

      const favBtn = h('button', {
        class: 'hbtn' + (fav ? ' fav' : ''),
        'aria-pressed': String(!!fav),
        onclick: async () => {
          if (fav) {
            removeFavorite(canon);
            toast('Quitado de favoritos');
          } else if (await addFavorite(name)) toast('Guardado en favoritos');
          draw();
        }
      }, icon('star', 18), fav ? 'Guardado' : 'Guardar');

      const mixBtn = h('button', {
        class: 'hbtn' + (inMix ? ' mix' : ''),
        'aria-pressed': String(inMix),
        onclick: async () => {
          if (!fav) {
            if (await addFavorite(name)) toast('Guardado y añadido a tu Aleatorio');
          } else {
            setMixOn(canon, !inMix);
            toast(inMix ? 'Fuera de tu Aleatorio' : 'Añadido a tu Aleatorio');
          }
          draw();
        }
      }, icon('shuffle', 18), inMix ? 'En mezcla' : 'Mezclar');

      const bellBtn = h('button', {
        class: 'hbtn' + (notify ? ' bell' : ''),
        'aria-pressed': String(notify),
        onclick: async () => {
          if (!fav) {
            const f = await addFavorite(name, { notify: true });
            if (f) setNotify(f.name, true);
          } else setNotify(canon, !notify);
          draw();
        }
      }, icon(notify ? 'bell' : 'belloff', 18), notify ? 'Avisando' : 'Avisarme');

      const related = [];
      if (info && info.subTags.length) related.push(...info.subTags);
      const relatedRow = info && (info.parent || related.length)
        ? h('div', { style: { display: 'flex', flexDirection: 'column', gap: '8px' } },
            h('span', { class: 'section-label', text: related.length ? 'Dentro de esta categoría' : 'Categoría' }),
            h('div', { class: 'related' },
              info.parent ? h('a', { class: 'tag', href: '#/tag/' + enc(info.parent), text: '↑ ' + RS.label(info.parent, 'category') }) : null,
              related.map((t) => h('a', { class: 'tag' + (favOf(t) ? ' fav' : ''), href: '#/tag/' + enc(t), text: '#' + t }))
            )
          )
        : null;

      fill(el,
        h('div', { class: 'hero-row' },
          tagPic(canon, 'hero-tile', '#', info ? info.pic || 0 : undefined),
          h('div', { class: 'grow' }, h('h2', { text: canon }), h('span', { class: 'meta', text: meta }))
        ),
        h('div', { class: 'hero-actions' }, favBtn, mixBtn, bellBtn),
        relatedRow
      );
    };

    draw();
    RS.fetchTagInfo(name)
      .then((i) => {
        info = i;
        if (i) draw();
        else fill(el, emptyBox('hash', 'Ese hashtag no existe', 'Revisa cómo está escrito.'));
      })
      .catch(() => draw());
    return el;
  }

  function routeTag(name, q) {
    const type = RS.validType(q.get('sort')) || 'GOOD';
    const random = q.get('order') === 'random';
    const gif = q.get('media') === 'gif';
    const key = 'tag:' + name.toLowerCase() + ':' + type + (random ? ':random' : '') + (gif ? ':gif' : '');
    const url = (o) => {
      const sort = o.sort || type;
      const rnd = o.random === undefined ? random : o.random;
      const onlyGif = o.gif === undefined ? gif : o.gif;
      return '#/tag/' + enc(name) + '?sort=' + sort + (rnd ? '&order=random' : '') + (onlyGif ? '&media=gif' : '');
    };
    const note = gif && random
      ? 'Solo GIF y videos de #' + name + ', en orden aleatorio.'
      : gif
        ? 'Solo GIF y videos de #' + name + '.'
        : random
          ? 'Orden aleatorio: posts de #' + name + ' de cualquier época.'
          : null;
    const f = cached(key, () =>
      new Feed({
        key,
        kind: random ? 'random' : 'pager',
        tag: name,
        type,
        gif,
        back: true,
        head: (f) => [
          backBtn('/home'),
          h('h1', { text: '#' + name }),
          h('button', {
            class: 'ib gifbtn' + (gif ? ' active' : ''),
            'aria-pressed': String(gif),
            'aria-label': gif ? 'Ver todos los posts' : 'Ver solo GIF y videos',
            title: gif ? 'Ver todos los posts' : 'Ver solo GIF y videos',
            onclick: () => navReplace(url({ gif: !gif }))
          }, 'GIF'),
          h('button', {
            class: 'ib' + (random ? ' active' : ''),
            'aria-pressed': String(random),
            'aria-label': random ? 'Volver al orden normal' : 'Ver en orden aleatorio',
            title: random ? 'Volver al orden normal' : 'Ver en orden aleatorio',
            onclick: () => navReplace(url({ random: !random }))
          }, icon('shuffle', 22)),
          viewToggle(f)
        ],
        extra: (f) => {
          const chips = sortChips(type, (t) => navReplace(url({ sort: t })));
          if (random) chips.append(h('button', { class: 'chip soft', onclick: () => f.reset() }, icon('refresh', 16), 'Barajar'));
          return [
            tagHero(name),
            note ? h('p', { class: 'countline', style: { padding: '12px 16px 0' }, text: note }) : null,
            chips
          ];
        },
        empty: gif ? () => emptyBox('play', 'Sin GIF ni videos', '#' + name + ' no tiene GIF ni videos con este orden. Prueba con «Todo».') : null
      })
    );
    showFeed(f);
  }

  // ================================================================ Buscar

  function searchBox(placeholder, autofocus, onFav) {
    const input = h('input', { type: 'search', placeholder, 'aria-label': placeholder, autocomplete: 'off', enterkeyhint: 'search' });
    const results = h('div', { class: 'results' });
    let timer = null;
    let seq = 0;
    input.addEventListener('input', () => {
      clearTimeout(timer);
      const q = input.value.trim().replace(/^#/, '');
      if (q.length < 2) {
        fill(results);
        return;
      }
      timer = setTimeout(async () => {
        const my = ++seq;
        try {
          const list = await RS.autocomplete(q);
          if (my !== seq) return;
          fill(results, ...(list.length ? list.slice(0, 15).map((t) => resultRow(t, onFav)) : [h('div', { class: 'status', text: 'Sin resultados para «' + q + '»' })]));
        } catch (e) {
          fill(results, h('div', { class: 'status', text: errText(e) }));
        }
      }, 250);
    });
    input.addEventListener('keydown', (e) => {
      const q = input.value.trim().replace(/^#/, '');
      if (e.key === 'Enter' && q) nav('#/tag/' + enc(q));
    });
    if (autofocus) setTimeout(() => input.focus(), 60);
    return { el: h('div', { class: 'search' }, h('label', {}, icon('search', 20), input)), results, input };
  }

  function resultRow(t, onFav) {
    const c = colorFor(t.name);
    const star = h('button', { class: 'ib star' }, icon('star', 22));
    const paint = () => {
      const on = !!favOf(t.name);
      star.classList.toggle('on', on);
      star.setAttribute('aria-pressed', String(on));
      star.setAttribute('aria-label', on ? 'Quitar #' + t.name + ' de favoritos' : 'Guardar #' + t.name + ' en favoritos');
    };
    star.addEventListener('click', async () => {
      const f = favOf(t.name);
      if (f) removeFavorite(f.name);
      else if (await addFavorite(t.name)) toast('Guardado en favoritos');
      paint();
      if (onFav) onFav();
    });
    paint();
    return h('div', { class: 'result' },
      h('a', { href: '#/tag/' + enc(t.name) },
        tagPic(t.name, 'htile', '#', t.image ? RS.numId(t.id) : 0),
        h('span', { class: 'rtext' },
          h('span', { class: 'n' }, t.name, t.nsfw ? h('span', { class: 'nsfw', text: 'NSFW' }) : null),
          h('span', { class: 'm', text: fmt(t.count) + ' posts' })
        )
      ),
      star
    );
  }

  function routeSearch() {
    const sb = searchBox('Buscar hashtag o categoría', true);
    mount([h('header', { class: 'top has-back' }, backBtn('/home'), h('h1', { text: 'Buscar' })), sb.el, sb.results]);
  }

  // ================================================================ Aleatorio

  function qualityLabel() {
    const q = { ALL: 'todo', GOOD: 'bueno', BEST: 'top' }[S.mix.quality] || 'bueno';
    const e = { any: '', year: ' · último año', month: ' · último mes' }[S.mix.era] || '';
    return 'Calidad mínima: ' + q + e;
  }

  function mixSummary() {
    const srcs = RS.mixSources(S);
    if (!srcs.length) {
      return h('div', { class: 'notice' },
        h('strong', { text: 'Tu mezcla está vacía' }),
        h('span', { text: 'Por ahora te muestro posts al azar de todo JoyReactor. Elige qué categorías y hashtags entran y cuánto pesa cada uno.' }),
        h('div', { class: 'row-btns' }, h('a', { class: 'btn blue', href: Object.keys(S.favorites).length ? '#/mix' : '#/favorites' }, icon('sliders', 18), 'Personalizar'))
      );
    }
    const total = srcs.reduce((a, s) => a + s.w, 0);
    const parts = srcs
      .map((s) => ({ name: s.name, kind: s.kind, pct: Math.round((s.w / total) * 100), color: mixColor(s.name) }))
      .sort((a, b) => b.pct - a.pct);
    return h('a', { class: 'mixcard', href: '#/mix' },
      h('div', { style: { display: 'flex', alignItems: 'baseline', gap: '8px' } }, h('h2', { class: 'grow', text: 'Tu mezcla' }), h('span', { class: 'sub', text: qualityLabel() })),
      h('div', { class: 'bar' }, parts.map((p) => h('span', { style: { width: p.pct + '%', background: p.color } }))),
      h('div', { class: 'legend' }, parts.map((p) => h('span', {}, h('i', { style: { background: p.color } }), RS.label(p.name, p.kind), ' ', h('em', { text: p.pct + '%' }))))
    );
  }

  function routeRandom() {
    const f = cached('random', () =>
      new Feed({
        key: 'random',
        kind: 'random',
        head: (f) => [
          h('h1', { text: 'Aleatorio' }),
          h('button', { class: 'ib', 'aria-label': 'Barajar otra vez', title: 'Barajar otra vez', onclick: () => f.reset() }, icon('refresh', 22)),
          h('a', { class: 'pill', href: '#/mix' }, icon('sliders', 18), 'Personalizar')
        ],
        extra: () => mixSummary()
      })
    );
    showFeed(f);
  }

  // ================================================================ Personalizar mezcla

  function routeMix() {
    const body = h('div', { class: 'page' });
    const head = h('header', { class: 'top has-back' }, backBtn('/random'), h('h1', { text: 'Tu mezcla aleatoria' }), h('a', { class: 'pill primary', href: '#/random' }, 'Listo'));

    const draw = () => {
      const favs = favList();
      const liveEls = [];
      const barEl = h('div', { class: 'bar', style: { height: '14px', borderRadius: '7px' } });
      const summaryEl = h('span', { class: 'smeta' });

      const live = () => {
        const srcs = RS.mixSources(S);
        const total = srcs.reduce((a, s) => a + s.w, 0) || 1;
        for (const x of liveEls) {
          const s = srcs.find((y) => y.name === x.name);
          x.el.textContent = s ? Math.round((s.w / total) * 100) + '%' : '—';
          x.el.style.color = s ? x.color : 'var(--text-3)';
        }
        fill(barEl, ...srcs.map((s) => h('span', { style: { width: (s.w / total) * 100 + '%', background: mixColor(s.name) } })));
        summaryEl.textContent = srcs.length
          ? srcs.length + (srcs.length === 1 ? ' fuente activa' : ' fuentes activas') + ' · se reparten según el peso'
          : 'Nada activado: el Aleatorio usará todo JoyReactor';
      };

      const row = (f) => {
        const cfg = S.mix.sources[f.name] || (S.mix.sources[f.name] = { on: false, w: 5 });
        const color = mixColor(f.name);
        const pctEl = h('span', { class: 'spct' });
        liveEls.push({ name: f.name, el: pctEl, color });
        const r = h('div', { class: 'srow' },
          h('div', { class: 'srow-top' },
            h('span', { class: 'sdot', style: { background: cfg.on ? color : '#3a3530' } }),
            h('div', { class: 'grow' },
              h('span', { class: 'sname', text: RS.label(f.name, f.kind), style: cfg.on ? null : { color: 'var(--text-3)' } }),
              h('span', { class: 'smeta', text: (f.kind === 'category' ? 'Categoría' : 'Hashtag') + (cfg.on ? ' · entra en la mezcla' : ' · fuera de la mezcla') })
            ),
            pctEl,
            switchBtn(cfg.on, 'Incluir ' + RS.label(f.name, f.kind) + ' en el Aleatorio', (on) => {
              setMixOn(f.name, on);
              draw();
            })
          )
        );
        if (cfg.on) {
          const range = h('input', { type: 'range', min: 1, max: 10, step: 1, value: cfg.w, 'aria-label': 'Peso de ' + RS.label(f.name, f.kind), style: { accentColor: color } });
          range.addEventListener('input', () => {
            cfg.w = Number(range.value);
            live();
          });
          range.addEventListener('change', () => {
            persist('mix');
            invalidateRandom();
          });
          r.append(h('label', { class: 'slider' }, 'Poco', range, 'Mucho'));
        }
        return r;
      };

      const cats = favs.filter((f) => f.kind === 'category');
      const tags = favs.filter((f) => f.kind !== 'category');

      const exInput = h('input', { class: 'input', type: 'text', placeholder: 'hashtag a excluir', 'aria-label': 'Hashtag a excluir', autocomplete: 'off', enterkeyhint: 'done' });
      const addEx = () => {
        const v = exInput.value.trim().replace(/^#/, '');
        if (!v) return;
        if (!S.mix.exclude.some((x) => x.toLowerCase() === v.toLowerCase())) S.mix.exclude.push(v);
        persist('mix');
        refreshFilter();
        invalidateRandom();
        draw();
      };
      exInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') addEx();
      });

      fill(body,
        h('section', { style: { padding: '16px 16px 14px', display: 'flex', flexDirection: 'column', gap: '10px', borderBottom: '1px solid var(--line)' } },
          h('p', { style: { fontSize: '14px', lineHeight: '1.45', color: '#c9c1b7' }, text: 'Elige qué entra en tu Aleatorio y cuánto pesa cada cosa. Así queda el reparto:' }),
          barEl,
          summaryEl
        ),
        favs.length
          ? null
          : emptyBox('star', 'Aún no tienes favoritos', 'Guarda categorías y hashtags con ★ y aparecerán aquí para mezclarlos.', h('a', { class: 'btn', href: '#/favorites' }, 'Ir a Favoritos')),
        cats.length ? h('h2', { class: 'sec section-label', text: 'Categorías favoritas' }) : null,
        cats.map(row),
        tags.length ? h('h2', { class: 'sec section-label', text: 'Hashtags favoritos' }) : null,
        tags.map(row),
        favs.length
          ? h('div', { style: { padding: '12px 16px 4px' } }, h('a', { class: 'btn ghost full', href: '#/favorites' }, icon('plus', 18), 'Añadir hashtag o categoría'))
          : null,
        h('h2', { class: 'sec section-label', text: 'Reglas' }),
        h('div', { class: 'field' },
          h('span', { class: 't', text: 'Calidad mínima' }),
          seg([['ALL', 'Todo'], ['GOOD', 'Bueno'], ['BEST', 'Top']], S.mix.quality, (v) => {
            S.mix.quality = v;
            persist('mix');
            invalidateRandom();
          })
        ),
        h('div', { class: 'field' },
          h('span', { class: 't', text: 'Época' }),
          seg([['any', 'Cualquiera'], ['year', 'Último año'], ['month', 'Último mes']], S.mix.era, (v) => {
            S.mix.era = v;
            persist('mix');
            invalidateRandom();
          })
        ),
        h('div', { class: 'line' },
          h('div', { class: 'grow' }, h('span', { class: 'sname', text: 'No repetir lo que ya vi' }), h('span', { class: 'smeta', text: 'Los posts que ya pasaron por tu pantalla no vuelven a salir en el sorteo.' })),
          switchBtn(S.mix.noRepeat, 'No repetir posts ya vistos', (on) => {
            S.mix.noRepeat = on;
            persist('mix');
            invalidateRandom();
          })
        ),
        h('div', { class: 'field', style: { paddingBottom: '28px' } },
          h('span', { class: 't', text: 'Nunca mostrar' }),
          h('span', { class: 'd', text: 'Los posts con estos hashtags desaparecen de todos los feeds.' }),
          S.mix.exclude.length
            ? h('div', { class: 'wrap' },
                S.mix.exclude.map((x) =>
                  h('button', {
                    class: 'xchip',
                    'aria-label': 'Volver a mostrar #' + x,
                    onclick: () => {
                      S.mix.exclude = S.mix.exclude.filter((y) => y !== x);
                      persist('mix');
                      refreshFilter();
                      invalidateRandom();
                      draw();
                    }
                  }, '#' + x, icon('x', 16))
                )
              )
            : null,
          h('div', { class: 'inline-add' }, exInput, h('button', { class: 'btn ghost', onclick: addEx }, 'Añadir'))
        )
      );
      live();
    };

    draw();
    mount([head, body]);
  }

  // ================================================================ Favoritos

  function routeFavorites() {
    const lists = h('div');
    const sb = searchBox('Buscar hashtag o categoría para guardar', false, () => drawLists());

    function drawLists() {
      const favs = favList();
      const srcs = RS.mixSources(S);
      const total = srcs.reduce((a, s) => a + s.w, 0) || 1;
      const mixText = (name) => {
        const s = srcs.find((x) => x.name === name);
        return s ? 'En tu mezcla · ' + Math.round((s.w / total) * 100) + '%' : 'Fuera de la mezcla';
      };
      const bellBtn = (f) =>
        h('button', {
          class: 'ib bellb' + (f.notify ? ' on' : ''),
          'aria-pressed': String(!!f.notify),
          'aria-label': (f.notify ? 'Dejar de avisar de ' : 'Avisarme de posts nuevos en ') + RS.label(f.name, f.kind),
          onclick: () => {
            setNotify(f.name, !f.notify);
            drawLists();
          }
        }, icon(f.notify ? 'bell' : 'belloff', 21));
      const starBtn = (f) =>
        h('button', {
          class: 'ib star on',
          'aria-pressed': 'true',
          'aria-label': 'Quitar ' + RS.label(f.name, f.kind) + ' de favoritos',
          onclick: () => {
            removeFavorite(f.name);
            drawLists();
            toast('Quitado de favoritos', 'Deshacer', async () => {
              S.favorites[f.name] = f;
              refreshFavIndex();
              S.mix.sources[f.name] = S.mix.sources[f.name] || { on: true, w: 5 };
              persist('favorites');
              persist('mix');
              invalidateRandom();
              drawLists();
            });
          }
        }, icon('star', 21));

      const cats = favs.filter((f) => f.kind === 'category');
      const tags = favs.filter((f) => f.kind !== 'category');

      fill(lists,
        h('div', { class: 'secline' }, h('h2', { class: 'grow section-label', text: 'Categorías' }), h('span', { class: 'c', text: cats.length + (cats.length === 1 ? ' guardada' : ' guardadas') })),
        h('div', { class: 'tiles' },
          cats.map((f) => {
            const c = colorFor(f.name);
            return h('div', { class: 'tile', style: { background: c[0] } },
              h('a', { href: '#/tag/' + enc(f.name) },
                tagPic(f.name, 'tile-pic', f.name.charAt(0).toUpperCase()),
                h('span', { class: 'tn', text: RS.label(f.name, f.kind) }),
                h('span', { class: 'tm', text: mixText(f.name) })
              ),
              h('div', { class: 'tbtns' }, bellBtn(f), starBtn(f))
            );
          }),
          h('button', { class: 'addtile', onclick: () => sb.input.focus() }, icon('plus', 22), 'Añadir categoría')
        ),
        h('div', { class: 'secline', style: { paddingTop: '26px' } }, h('h2', { class: 'grow section-label', text: 'Hashtags' }), h('span', { class: 'c', text: tags.length + (tags.length === 1 ? ' guardado' : ' guardados') })),
        tags.length
          ? tags.map((f) => {
              const c = colorFor(f.name);
              const inMix = !!(S.mix.sources[f.name] && S.mix.sources[f.name].on);
              return h('div', { class: 'result' },
                h('a', { href: '#/tag/' + enc(f.name) },
                  tagPic(f.name, 'htile', '#'),
                  h('span', { class: 'rtext' }, h('span', { class: 'n', text: f.name }), h('span', { class: 'm', text: mixText(f.name), style: inMix ? { color: 'var(--blue)' } : null }))
                ),
                h('button', {
                  class: 'ib mixb' + (inMix ? ' on' : ''),
                  'aria-pressed': String(inMix),
                  'aria-label': (inMix ? 'Sacar #' : 'Meter #') + f.name + (inMix ? ' del Aleatorio' : ' en el Aleatorio'),
                  onclick: () => {
                    setMixOn(f.name, !inMix);
                    drawLists();
                  }
                }, icon('shuffle', 20)),
                bellBtn(f),
                starBtn(f)
              );
            })
          : h('p', { class: 'countline', style: { paddingTop: '4px' }, text: 'Busca arriba y toca ★ para guardar hashtags. También puedes guardarlos desde el feed de cada hashtag.' }),
        h('p', { class: 'foot-note', text: 'La campanita avisa cuando hay posts nuevos. El icono de mezcla decide si entra en tu Aleatorio.' })
      );
    }

    drawLists();
    mount([h('header', { class: 'top' }, h('h1', { text: 'Favoritos' }), iconLink('gear', 'Ajustes', '#/settings')), sb.el, sb.results, lists]);
  }

  // ================================================================ Mis posts: me gusta / no me gusta

  function myTabs(active) {
    const nLikes = Object.keys(S.likes).length;
    const nDis = Object.keys(S.dislikes).length;
    return h('nav', { class: 'tabs2', 'aria-label': 'Historial' },
      h('a', { class: active === 'likes' ? 'on' : '', href: '#/likes', 'aria-current': active === 'likes' ? 'page' : null }, icon('heart', 19), 'Me gusta (' + nLikes + ')'),
      h('a', { class: active === 'hidden' ? 'on' : '', href: '#/hidden', 'aria-current': active === 'hidden' ? 'page' : null }, icon('down', 19), 'No me gusta (' + nDis + ')')
    );
  }

  function routeLikes(q) {
    const filter = q.get('tag') || '';
    const all = Object.values(S.likes).sort((a, b) => b.at - a.at);
    const counts = {};
    for (const x of all) for (const t of x.post.tags) counts[t] = (counts[t] || 0) + 1;
    const top = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([t]) => t);
    if (filter && !top.includes(filter)) top.unshift(filter);
    const items = all.filter((x) => !filter || x.post.tags.includes(filter)).map((x) => ({ post: x.post }));

    const f = new Feed({
      key: 'likes',
      kind: 'static',
      source: 'likes',
      items,
      mode: S.ui.likesMode,
      onMode: (m) => (S.ui.likesMode = m),
      head: (f) => [h('h1', { text: 'Mis posts' }), iconLink('download', 'Respaldo', '#/settings'), viewToggle(f)],
      extra: () => [
        myTabs('likes'),
        all.length
          ? h('nav', { class: 'chips', 'aria-label': 'Filtrar por hashtag' },
              h('button', { class: 'chip' + (filter ? '' : ' on'), onclick: () => navReplace('#/likes') }, 'Todos'),
              top.map((t) => h('button', { class: 'chip' + (filter === t ? ' on' : ''), onclick: () => navReplace('#/likes?tag=' + enc(t)) }, '#' + t))
            )
          : null,
        all.length ? h('p', { class: 'countline', text: items.length + (items.length === 1 ? ' post te gustó' : ' posts te gustaron') + (filter ? ' con #' + filter : '') }) : null
      ],
      empty: () => emptyBox('heart', 'Todavía no tienes me gusta', 'Toca el corazón o da dos toques en la imagen de cualquier post.')
    });
    showFeed(f);
  }

  function routeHidden() {
    const list = Object.values(S.dislikes).sort((a, b) => b.at - a.at);
    const excluded = new Set(S.mix.exclude.map((x) => x.toLowerCase()));
    const counts = {};
    for (const x of list.slice(0, 60)) for (const t of x.post.tags) counts[t] = (counts[t] || 0) + 1;
    const sug = Object.entries(counts)
      .filter(([t, n]) => n >= 3 && !excluded.has(t.toLowerCase()) && !favOf(t) && !S.dismissed.includes(t))
      .sort((a, b) => b[1] - a[1])[0];

    const sugBox = h('div');
    if (sug) {
      const [t, n] = sug;
      sugBox.append(
        h('section', { class: 'notice' },
          h('strong', { text: 'Ocultaste ' + n + ' posts con #' + t }),
          h('span', { text: '¿Lo excluyo de todos los feeds y del Aleatorio? Puedes revertirlo en Tu mezcla.' }),
          h('div', { class: 'row-btns' },
            h('button', {
              class: 'btn blue',
              onclick: () => {
                S.mix.exclude.push(t);
                persist('mix');
                refreshFilter();
                invalidateRandom();
                fill(sugBox, h('section', { class: 'notice green' }, h('span', { text: '#' + t + ' ya no aparecerá en ningún feed.' })));
              }
            }, 'Excluir #' + t),
            h('button', {
              class: 'btn quiet',
              onclick: () => {
                S.dismissed.push(t);
                persist('dismissed');
                fill(sugBox);
              }
            }, 'Ahora no')
          )
        )
      );
    }

    const rows = list.map((x) => {
      const p = x.post;
      const thumb = h('span', { class: 'hthumb' }, thumbMedia(p.media[0]));
      const a = h('span', { class: 'a', text: p.tags.length ? p.tags.slice(0, 4).map((t) => '#' + t).join(' ') : 'Post de ' + (p.user || 'anónimo') });
      const b = h('span', { class: 'b', text: 'Ocultado ' + ago(x.at) });
      const row = h('div', { class: 'hrow' }, h('a', { href: RS.postUrl(p), target: '_blank', rel: 'noopener', 'aria-label': 'Ver el post en JoyReactor', style: { flexShrink: '0' } }, thumb), h('div', { class: 'htext' }, a, b));
      const btn = h('button', { class: 'small-btn' });
      const paint = () => {
        const hidden = !!S.dislikes[p.id];
        row.classList.toggle('restored', !hidden);
        b.textContent = hidden ? 'Ocultado ' + ago(x.at) : 'Restaurado: vuelve a salir en tus feeds';
        btn.className = 'small-btn' + (hidden ? '' : ' ok');
        fill(btn, icon(hidden ? 'undo' : 'check', 16), hidden ? 'Restaurar' : 'Restaurado');
        btn.setAttribute('aria-label', hidden ? 'Restaurar este post' : 'Volver a ocultar este post');
      };
      btn.addEventListener('click', () => {
        if (S.dislikes[p.id]) delete S.dislikes[p.id];
        else S.dislikes[p.id] = x;
        persist('dislikes');
        refreshFilter();
        paint();
      });
      paint();
      row.append(btn);
      return row;
    });

    mount([
      h('header', { class: 'top' }, h('h1', { text: 'Mis posts' }), iconLink('download', 'Respaldo', '#/settings')),
      myTabs('hidden'),
      sugBox,
      list.length
        ? h('p', { class: 'countline', style: { paddingTop: '14px' }, text: list.length + (list.length === 1 ? ' post oculto.' : ' posts ocultos.') + ' No vuelven a aparecer en Inicio, en los hashtags ni en el Aleatorio.' })
        : emptyBox('down', 'No has ocultado nada', 'Con el pulgar hacia abajo un post desaparece para siempre. Aquí puedes recuperarlo.'),
      rows
    ]);
  }

  // ================================================================ Novedades

  function routeNews() {
    if (S.news.unread) bg({ type: 'news-read' });
    const watching = favList().filter((f) => f.notify);
    const items = (S.news.items || []).map((x) => ({ post: x.post, label: 'Nuevo en ' + RS.label(x.tag, x.kind), icon: 'bell', color: 'var(--green)' }));

    const checkBtn = h('button', { class: 'ib', 'aria-label': 'Comprobar ahora', title: 'Comprobar ahora' }, icon('refresh', 22));
    checkBtn.addEventListener('click', async () => {
      checkBtn.disabled = true;
      fill(checkBtn, icon('spinner', 22, 'spin'));
      try {
        const r = await bg({ type: 'check-now' });
        if (ext) S.news = (await RS.load(['news'])).news;
        toast(r && r.total ? (r.total === 1 ? '1 post nuevo' : r.total + ' posts nuevos') : 'No hay posts nuevos por ahora');
        if (r && r.total) routeNews();
      } catch (e) {
        toast(errText(e));
      }
      checkBtn.disabled = false;
      fill(checkBtn, icon('refresh', 22));
    });

    const f = new Feed({
      key: 'news',
      kind: 'static',
      items,
      back: true,
      head: (f) => [backBtn('/home'), h('h1', { text: 'Novedades' }), checkBtn, viewToggle(f)],
      extra: () =>
        watching.length
          ? h('p', { class: 'countline', style: { paddingTop: '12px' } },
              'Vigilando ' + watching.map((x) => RS.label(x.name, x.kind)).join(', ') + '. Última revisión: ' + (S.news.lastCheck ? ago(S.news.lastCheck) : 'todavía no') + '. ',
              h('a', { href: '#/settings', text: S.settings.notify ? 'Avisos cada ' + S.settings.interval + ' min' : 'Avisos desactivados' })
            )
          : h('div', { class: 'notice' },
              h('strong', { text: 'Elige de qué quieres enterarte' }),
              h('span', { text: 'Toca la campanita en tus categorías u hashtags favoritos y te avisaré cuando salgan posts nuevos.' }),
              h('div', { class: 'row-btns' }, h('a', { class: 'btn blue', href: '#/favorites' }, icon('bell', 18), 'Ir a Favoritos'))
            ),
      empty: () => emptyBox('bell', 'Sin novedades por ahora', watching.length ? 'Cuando salgan posts nuevos en lo que vigilas aparecerán aquí.' : null)
    });
    showFeed(f);
  }

  // ================================================================ Ajustes y respaldo

  async function exportBackup() {
    flush();
    const data = await RS.load(RS.KEYS.filter((k) => k !== 'eraCache'));
    data._app = 'reactor-swipe';
    data._version = 1;
    data._exported = new Date().toISOString();
    const name = 'reactor-swipe-respaldo-' + new Date().toISOString().slice(0, 10) + '.json';
    if (RS.android) {
      try {
        const r = await RS.native('saveFile', name, JSON.stringify(data));
        toast((r && r.message) || 'Respaldo guardado en Descargas');
      } catch (e) {
        toast(errText(e));
      }
      return;
    }
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = h('a', { href: url, download: name });
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 30000);
    toast('Respaldo descargado');
  }

  async function importBackup(file) {
    const data = JSON.parse(await file.text());
    if (!data || data._app !== 'reactor-swipe') throw new Error('Ese archivo no es un respaldo de Reactor Swipe.');
    if (!confirm('Esto reemplaza tus me gusta, no me gusta, favoritos y mezcla actuales. ¿Continuar?')) return;
    const out = {};
    for (const k of RS.KEYS) if (k !== 'eraCache' && k in data) out[k] = data[k];
    await RS.save(out);
    location.reload();
  }

  // Permisos de Android que hacen falta para que los avisos lleguen con la app cerrada.
  function androidPermissionRows() {
    const a = RS.android;
    if (!a) return null;
    const rows = [];
    let notifOk = true;
    let batteryOk = true;
    try {
      notifOk = a.notificationsAllowed();
      batteryOk = a.batteryUnrestricted();
    } catch (e) {
      /* puente antiguo */
    }
    if (!notifOk) {
      rows.push(
        h('div', { class: 'line' },
          h('div', { class: 'grow' }, h('span', { class: 'sname', text: 'Notificaciones bloqueadas' }), h('span', { class: 'smeta', text: 'Sin este permiso Android no muestra los avisos.' })),
          h('button', { class: 'small-btn', onclick: () => a.requestNotifications() }, 'Permitir')
        )
      );
    }
    if (!batteryOk) {
      rows.push(
        h('div', { class: 'line' },
          h('div', { class: 'grow' }, h('span', { class: 'sname', text: 'Revisar con la app cerrada' }), h('span', { class: 'smeta', text: 'Evita que el ahorro de batería retrase los avisos.' })),
          h('button', { class: 'small-btn', onclick: () => a.requestBatteryExemption() }, 'Permitir')
        )
      );
    }
    return rows;
  }

  function routeSettings() {
    const st = S.settings;
    const save = () => persist('settings', 0);
    const fileInput = h('input', { type: 'file', accept: 'application/json,.json', class: 'visually-hidden', 'aria-label': 'Archivo de respaldo' });
    fileInput.addEventListener('change', () => {
      const file = fileInput.files && fileInput.files[0];
      if (file) importBackup(file).catch((e) => toast(errText(e)));
      fileInput.value = '';
    });
    const checkNow = h('button', { class: 'btn ghost' }, icon('refresh', 18), 'Comprobar ahora');
    checkNow.addEventListener('click', async () => {
      checkNow.disabled = true;
      try {
        const r = await bg({ type: 'check-now' });
        toast(r && r.total ? r.total + ' posts nuevos: míralos en Novedades' : 'No hay posts nuevos por ahora', r && r.total ? 'Ver' : null, () => nav('#/news'));
      } catch (e) {
        toast(errText(e));
      }
      checkNow.disabled = false;
    });
    const watching = favList().filter((f) => f.notify);

    mount([
      h('header', { class: 'top has-back' }, backBtn('/favorites'), h('h1', { text: 'Ajustes' })),
      h('div', { class: 'setgroup' },
        h('h2', { class: 'sec section-label', style: { padding: '18px 16px 6px' }, text: 'Avisos de posts nuevos' }),
        h('div', { class: 'line' },
          h('div', { class: 'grow' }, h('span', { class: 'sname', text: 'Avisarme con notificación' }), h('span', { class: 'smeta', text: watching.length ? 'Vigilando: ' + watching.map((x) => RS.label(x.name, x.kind)).join(', ') : 'Activa la campanita en tus favoritos para elegir qué vigilar.' })),
          switchBtn(st.notify, 'Avisarme con notificación', (on) => {
            st.notify = on;
            save();
          })
        ),
        h('div', { class: 'field' },
          h('span', { class: 't', text: 'Revisar cada' }),
          seg([[15, '15 min'], [30, '30 min'], [60, '1 hora']], Number(st.interval), (v) => {
            st.interval = v;
            save();
          })
        ),
        h('div', { class: 'field' },
          h('span', { class: 't', text: 'Avisar de' }),
          seg([['NEW', 'Todo lo nuevo'], ['GOOD', 'Solo los buenos']], st.notifyType, (v) => {
            st.notifyType = v;
            save();
          })
        ),
        androidPermissionRows(),
        h('div', { class: 'field' },
          checkNow,
          RS.android
            ? null
            : h('span', { class: 'd', style: { marginTop: '4px' }, text: 'Android puede cerrar Firefox en segundo plano para ahorrar batería y entonces los avisos se retrasan. Si no te llegan: Ajustes de Android → Apps → Firefox → Batería → Sin restricciones.' })
        )
      ),
      h('div', { class: 'setgroup' },
        h('h2', { class: 'sec section-label', style: { padding: '18px 16px 6px' }, text: 'Contenido' }),
        h('div', { class: 'line' },
          h('div', { class: 'grow' }, h('span', { class: 'sname', text: 'Ocultar posts NSFW' }), h('span', { class: 'smeta', text: 'Se aplica a todos los feeds y a los avisos.' })),
          switchBtn(st.hideNsfw, 'Ocultar posts NSFW', (on) => {
            st.hideNsfw = on;
            save();
            refreshFilter();
            for (const [k, f] of feeds) {
              f.destroy();
              feeds.delete(k);
            }
          })
        )
      ),
      h('div', { class: 'setgroup' },
        h('h2', { class: 'sec section-label', style: { padding: '18px 16px 6px' }, text: 'Respaldo' }),
        h('div', { class: 'field' },
          h('span', { class: 'd', style: { marginTop: '0' }, text: 'Tus me gusta, no me gusta, favoritos y mezcla viven solo en este teléfono. Guarda un respaldo para no perderlos o para pasarlos a otro.' }),
          h('div', { class: 'inline-add' },
            h('button', { class: 'btn', onclick: exportBackup }, icon('download', 18), 'Exportar'),
            h('button', { class: 'btn ghost', onclick: () => fileInput.click() }, icon('upload', 18), 'Importar'),
            fileInput
          )
        )
      ),
      h('div', { class: 'setgroup' },
        h('h2', { class: 'sec section-label', style: { padding: '18px 16px 6px' }, text: 'Versión' }),
        h('div', { class: 'line' },
          h('div', { class: 'grow' }, h('span', { class: 'sname', text: 'Reactor Swipe ' + RS.version() }), h('span', { class: 'smeta', text: RS.android ? 'Cuando haya una versión nueva te llega un aviso: Actualizar → Instalar.' : 'Versión de navegador.' })),
          h('button', { class: 'small-btn', onclick: () => lookForUpdate(true) }, icon('refresh', 16), 'Buscar')
        )
      ),
      h('p', { class: 'about', text: 'Lee JoyReactor con su API pública; no publica nada ni guarda tus datos fuera del teléfono.' })
    ]);
  }

  // ================================================================ Arranque

  let lastResumeCheck = 0;
  window.RSApp = {
    tabId: null,
    navigate(hash) {
      if (location.hash === hash) route();
      else location.hash = hash;
    },
    // Botón «atrás» de Android: 1) cierra la pantalla completa, 2) vuelve a la página anterior,
    // 3) desde otra sección vuelve a Inicio, 4) desde Inicio sale de la app.
    handleBack() {
      if (viewer) {
        exitViewer();
        return 'handled';
      }
      if (stack.length > 1) {
        history.back();
        return 'handled';
      }
      if ((parseHash().parts[0] || 'home') !== 'home') {
        navReplace('#/home');
        return 'handled';
      }
      return 'exit';
    },
    // Android avisa cuando la app vuelve a primer plano.
    onResume() {
      loadNativeNews();
      if (/^#\/(settings|news)/.test(location.hash)) route();
      if (Date.now() - lastResumeCheck > 3 * 3600000) {
        lastResumeCheck = Date.now();
        lookForUpdate(false);
      }
    }
  };
  if (ext && ext.tabs && ext.tabs.getCurrent) {
    ext.tabs
      .getCurrent()
      .then((t) => {
        if (t) window.RSApp.tabId = t.id;
      })
      .catch(() => {});
  }

  function initTabs() {
    document.querySelectorAll('#tabs [data-icon]').forEach((s) => s.replaceWith(icon(s.dataset.icon, 24)));
    document.querySelectorAll('#tabs a').forEach((a) =>
      a.addEventListener('click', (e) => {
        if (a.getAttribute('href') === location.hash || (a.dataset.tab === 'home' && /^#\/home/.test(location.hash))) {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      })
    );
  }

  async function boot() {
    try {
      history.scrollRestoration = 'manual';
    } catch (e) {
      /* no disponible */
    }
    Object.assign(S, await RS.load(RS.KEYS.filter((k) => k !== 'eraCache')));
    S.seenSet = new Set(S.seen);
    refreshFilter();
    refreshFavIndex();
    if (RS.android) {
      loadNativeNews();
      syncNative();
      lastResumeCheck = Date.now();
    }
    initTabs();
    window.addEventListener('hashchange', route);
    route();
    // Si Android cerró Firefox y no se revisó en un buen rato, reviso al abrir la app.
    const stale = Date.now() - (S.news.lastCheck || 0) > (Number(S.settings.interval) || 15) * 60000;
    if (stale && favList().some((f) => f.notify)) bg({ type: 'check-now' }).catch(() => {});
    lookForUpdate(false);
  }

  boot().catch((e) => {
    fill(viewEl, emptyBox('alert', 'No pude iniciar Reactor Swipe', errText(e)));
  });
})();
