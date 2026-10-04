/* Reactor Swipe — la app (feed, miniaturas, hashtags, usuarios, aleatorio, seguidos, favoritos, novedades). */
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
    image: '<rect x="3.5" y="4.5" width="17" height="15" rx="2.5"/><circle cx="9" cy="10" r="1.8"/><path d="M20.5 16l-5-5-9 8.5"/>',
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
    alert: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5M12 16.5v.01"/>',
    pause: '<rect x="6.5" y="5" width="3.5" height="14" rx="1"/><rect x="14" y="5" width="3.5" height="14" rx="1"/>',
    replay: '<path d="M3.5 12a8.5 8.5 0 1 0 2.6-6.1"/><path d="M3 4.5V9h4.5"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4.5 20.5a7.5 7.5 0 0 1 15 0"/>',
    chart: '<path d="M4 20V11M10 20V5M16 20v-8M21 20H3"/>',
    film: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M10 9.3v5.4l4.6-2.7z"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    trash: '<path d="M4 7h16M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13"/>',
    ban: '<circle cx="12" cy="12" r="8.5"/><path d="M6 6l12 12"/>',
    trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H5a3 3 0 0 0 3.2 4M16 6h3a3 3 0 0 1-3.2 4"/><path d="M12 13v4M9 20.5h6M10 17h4v3.5h-4z"/>',
    chevright: '<path d="M9 5l7 7-7 7"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8"/><path d="M18 14.2a6.5 6.5 0 0 1 3.5 5.8"/>',
    userplus: '<circle cx="10" cy="8" r="4"/><path d="M3 20.5a7 7 0 0 1 12.5-4.3"/><path d="M19 14v6M16 17h6"/>',
    usercheck: '<circle cx="10" cy="8" r="4"/><path d="M3 20.5a7 7 0 0 1 12.5-4.3"/><path d="M15.5 18l2 2 4-4.5"/>'
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

  function buzz(ms) {
    try {
      if (navigator.vibrate) navigator.vibrate(ms);
    } catch (e) {
      /* sin vibración */
    }
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
      if (key === 'favorites' || key === 'following' || key === 'settings' || key === 'mix') syncNative();
    }, delay == null ? 250 : delay);
  }

  // App de Android: los avisos los revisa Android en segundo plano, así que le paso qué vigilar
  // y cómo (hashtags y usuarios con campanita, ajustes y hashtags excluidos).
  function syncNative() {
    if (!RS.android) return;
    try {
      RS.android.syncConfig(
        JSON.stringify({
          favorites: Object.values(S.favorites).map((f) => ({ name: f.name, kind: f.kind, notify: !!f.notify })),
          following: Object.values(S.following).map((f) => ({ name: f.name, notify: !!f.notify })),
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
  // La fecha de cada post y, en pantalla completa, la reputación y el rating se dibujan siempre y se
  // ocultan con CSS (así cambiar el ajuste no recarga nada).
  function applyDisplay() {
    document.documentElement.classList.toggle('show-dates', !!S.settings.showDates);
    document.documentElement.classList.toggle('show-scores', !!S.settings.showScores);
  }

  function markSeen(id, post) {
    if (!id || S.seenSet.has(id)) return;
    S.seenSet.add(id);
    S.seen.push(id);
    if (post) recordView(post);
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

  // ================================================================ Hashtags que sigues y mezcla

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

  // Seguir un hashtag o una categoría (en el código y en los datos se llaman «favoritos»):
  // los dos van juntos en Seguidos › Hashtags.
  function savedText(asked, f) {
    const same = f.name.toLowerCase() === String(asked).toLowerCase();
    return 'Ahora sigues #' + asked + (same ? '' : ' (es lo mismo que #' + f.name + ')');
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

  // Hashtags bloqueados: sus posts no salen en ningún feed ni en los avisos (se guardan en mix.exclude).
  const isBlocked = (t) => !!t && S.mix.exclude.some((x) => x.toLowerCase() === String(t).toLowerCase());
  function setBlocked(t, on) {
    const low = String(t).toLowerCase();
    S.mix.exclude = S.mix.exclude.filter((x) => x.toLowerCase() !== low);
    if (on) S.mix.exclude.push(t);
    persist('mix');
    refreshFilter();
    // Los feeds guardados tienen posts que ahora sobran o faltan: se rehacen (menos el que está a la vista).
    for (const [k, fd] of feeds) {
      if (current && current.feed === fd) continue;
      fd.destroy();
      feeds.delete(k);
    }
  }
  function blockedField(onChange, withTitle) {
    const el = h('div', { class: 'field', style: { paddingBottom: '28px' } });
    const input = h('input', { class: 'input', type: 'text', placeholder: 'hashtag a bloquear', 'aria-label': 'Hashtag a bloquear', autocomplete: 'off', enterkeyhint: 'done' });
    const changed = () => {
      draw();
      if (onChange) onChange();
    };
    const add = () => {
      const v = input.value.trim().replace(/^#/, '');
      if (!v) return;
      if (!isBlocked(v)) setBlocked(v, true);
      input.value = '';
      changed();
    };
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') add();
    });
    const draw = () =>
      fill(el,
        withTitle === false ? null : h('span', { class: 't', text: 'Hashtags bloqueados' }),
        h('span', { class: 'd', text: 'Los posts con estos hashtags no salen en ningún feed ni en los avisos. También puedes bloquear un hashtag desde su página, con el botón ⊘.' }),
        S.mix.exclude.length
          ? h('div', { class: 'wrap' },
              S.mix.exclude.map((x) =>
                h('button', {
                  class: 'xchip',
                  'aria-label': 'Desbloquear #' + x,
                  onclick: () => {
                    setBlocked(x, false);
                    changed();
                  }
                }, '#' + x, icon('x', 16))
              )
            )
          : null,
        h('div', { class: 'inline-add' }, input, h('button', { class: 'btn ghost', onclick: add }, 'Bloquear'))
      );
    draw();
    return el;
  }

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
    if (on && !S.likes[p.id]) {
      today().likes++;
      saveStats();
    }
    if (on) S.likes[p.id] = S.likes[p.id] || { at: Date.now(), post: p };
    else delete S.likes[p.id];
    persist('likes');
    // Lo que ya está en Favoritos no se repite en el Historial (y si lo estás mirando, sale en el acto).
    if (on && S.history.some((x) => x.id === p.id)) {
      S.history = S.history.filter((x) => x.id !== p.id);
      persist('history', 1500);
    }
    const hf = current && current.feed;
    if (on && hf && hf.source === 'history') hf.drop(p.id);
    document.querySelectorAll('[data-id="' + CSS.escape(p.id) + '"] .like').forEach((b) => {
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', String(on));
      animateLike(b, on);
    });
    if (on) buzz(12);
  }

  // El corazón rebota y suelta un anillo con chispas; al quitar el me gusta solo se encoge un poco.
  const reduceMotion = window.matchMedia ? matchMedia('(prefers-reduced-motion: reduce)') : null;
  function animateLike(b, on) {
    b.classList.remove('pop', 'unpop');
    void b.offsetWidth;
    b.classList.add(on ? 'pop' : 'unpop');
    b.querySelectorAll('.burst').forEach((x) => x.remove());
    if (!on || (reduceMotion && reduceMotion.matches)) return;
    const burst = h('span', { class: 'burst', 'aria-hidden': 'true' }, h('span', { class: 'ring' }));
    for (let i = 0; i < 8; i++) burst.append(h('span', { class: 'spark', style: '--a:' + (i * 45 + 22) + 'deg' }));
    b.append(burst);
    setTimeout(() => burst.remove(), 750);
  }

  function dislike(it, card, feed) {
    const p = it.post;
    S.dislikes[p.id] = { at: Date.now(), post: p };
    today().dislikes++;
    saveStats();
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
        markSeen(e.target.dataset.id, e.target._post);
        seenIO.unobserve(e.target);
      }
    },
    { threshold: 0.6 }
  );

  // ---- Historial: los posts que miraste más de 10 segundos (máximo configurable, por defecto 100).
  // También se mide cuánto tiempo miras cada post, para el Resumen de la semana (ver creditTime).
  const DWELL_MS = 10000;
  let dwell = null;
  function focusPost(p) {
    if (!p) return blurPost();
    if (dwell && dwell.id === p.id) return;
    blurPost();
    dwell = { id: p.id, post: p, start: Date.now(), timer: setTimeout(() => addHistory(p), DWELL_MS) };
  }
  function blurPost() {
    if (dwell) {
      clearTimeout(dwell.timer);
      creditTime(dwell.post, Date.now() - dwell.start);
    }
    dwell = null;
  }
  function addHistory(p) {
    if (S.likes[p.id]) return; // ya está en Favoritos
    const max = Number(S.settings.historyMax) || 100;
    S.history = [{ id: p.id, at: Date.now(), post: p }].concat((S.history || []).filter((x) => x.id !== p.id)).slice(0, max);
    persist('history', 1500);
  }
  const dwellIO = new IntersectionObserver(
    (entries) => {
      if (viewer) return;
      for (const e of entries) {
        if (e.isIntersecting && e.intersectionRatio >= 0.6) focusPost(e.target._post);
        else if (dwell && dwell.id === e.target.dataset.id) blurPost();
      }
    },
    { threshold: [0, 0.6] }
  );
  // Vuelve a contar el tiempo del post que quedó a la vista (al cerrar la pantalla completa o volver a la app).
  function refocusVisible() {
    if (viewer) {
      if (viewer.current && viewer.current._it) focusPost(viewer.current._it.post);
      return;
    }
    const f = current && current.feed;
    if (!f || f.mode !== 'feed' || !f.root.isConnected) return blurPost();
    const id = f.topVisibleId();
    const card = id && f.list.querySelector('[data-id="' + CSS.escape(id) + '"]');
    focusPost(card && card._post);
  }
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

  // Un GIF y un video llegan con el mismo formato: si al reproducirlo tiene sonido, es un video.
  function watchAudio(v, onAudio) {
    const check = () => {
      const has = v.mozHasAudio || (v.webkitAudioDecodedByteCount || 0) > 0 || (v.audioTracks && v.audioTracks.length > 0);
      if (has) {
        v.removeEventListener('timeupdate', check);
        onAudio();
      } else if (v.currentTime > 3) v.removeEventListener('timeupdate', check);
    };
    v.addEventListener('timeupdate', check);
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
      if (e.target.closest('button, a, input, .mini, .scrub')) return;
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

  const EMBEDS = {
    YOUTUBE: (v) => 'https://www.youtube-nocookie.com/embed/' + enc(v) + '?playsinline=1&rel=0&modestbranding=1',
    COUB: (v) => 'https://coub.com/embed/' + enc(v) + '?muted=false&autostart=false&originalSize=false&startWithHD=false',
    VIMEO: (v) => 'https://player.vimeo.com/video/' + enc(v)
  };

  // Video de YouTube/Coub/Vimeo: reproductor dentro de la app; los demás, enlace al sitio.
  function embedLink(m, p) {
    const src = EMBEDS[m.provider] && EMBEDS[m.provider](m.value);
    if (src) {
      return h('div', { class: 'embed' },
        h('iframe', {
          src,
          loading: 'lazy',
          allow: 'autoplay; encrypted-media; picture-in-picture; fullscreen',
          allowfullscreen: true,
          referrerpolicy: 'strict-origin-when-cross-origin',
          title: 'Video de ' + (PROVIDERS[m.provider] || 'JoyReactor')
        })
      );
    }
    return embedLinkOut(m, p);
  }

  const fmtTime = (t) => {
    if (!isFinite(t) || t < 0) t = 0;
    const m = Math.floor(t / 60);
    const sec = Math.floor(t % 60);
    return m + ':' + (sec < 10 ? '0' : '') + sec;
  };

  // Reproductor mínimo para videos: pausa/reproducir, barra para adelantar o atrasar y tiempo.
  function miniPlayer(initial) {
    const btn = h('button', { class: 'mini-btn', 'aria-label': 'Pausar' }, icon('pause', 16));
    const range = h('input', { class: 'mini-range', type: 'range', min: 0, max: 1000, step: 1, value: 0, 'aria-label': 'Posición del video' });
    const time = h('span', { class: 'mini-time', text: '0:00' });
    const el = h('div', { class: 'mini' }, btn, range, time);
    let v = null;
    let off = null;
    let seeking = false;
    const paint = () => {
      if (!v) return;
      const d = v.duration || 0;
      if (!seeking && d) range.value = String(Math.round((v.currentTime / d) * 1000));
      time.textContent = fmtTime(v.currentTime) + ' / ' + fmtTime(d);
      fill(btn, icon(v.paused ? 'play' : 'pause', 16));
      btn.setAttribute('aria-label', v.paused ? 'Reproducir' : 'Pausar');
      el.classList.toggle('ready', d > 0);
    };
    const bind = (video) => {
      if (off) off.abort();
      v = video;
      el.hidden = !v;
      if (!v) return;
      off = new AbortController();
      for (const ev of ['timeupdate', 'play', 'pause', 'loadedmetadata', 'durationchange']) v.addEventListener(ev, paint, { signal: off.signal });
      paint();
    };
    range.addEventListener('input', () => {
      if (!v || !v.duration) return;
      seeking = true;
      v.currentTime = (Number(range.value) / 1000) * v.duration;
      time.textContent = fmtTime(v.currentTime) + ' / ' + fmtTime(v.duration);
    });
    range.addEventListener('change', () => (seeking = false));
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!v) return;
      if (v.paused) v.play().catch(() => {});
      else v.pause();
    });
    for (const ev of ['click', 'dblclick', 'pointerdown', 'touchstart']) el.addEventListener(ev, (e) => e.stopPropagation(), { passive: true });
    bind(initial || null);
    return { el, bind };
  }

  // Barra de los GIF (y, en pantalla completa, también de los videos): una línea casi transparente a
  // todo lo ancho. Solo aparece mientras tocas la pantalla (y un momento después); se arrastra para ir
  // a otro momento. Con un video muestra además el tiempo, en chiquito.
  const SCRUB_HIDE_MS = 1800;
  function scrubBar(initial) {
    const bar = h('span', { class: 'scrub-fill' });
    const time = h('span', { class: 'scrub-time' });
    const el = h('div', { class: 'scrub', role: 'slider', 'aria-label': 'Posición del video', 'aria-valuemin': '0', 'aria-valuemax': '100' }, time, h('span', { class: 'scrub-track' }, bar));
    let v = null;
    let raf = 0;
    let hideTimer = null;
    let dragging = false;
    let wasPlaying = false;
    const paint = () => {
      const d = v && v.duration;
      const r = d ? Math.min(1, v.currentTime / d) : 0;
      bar.style.transform = 'scaleX(' + r + ')';
      el.setAttribute('aria-valuenow', String(Math.round(r * 100)));
      if (el.classList.contains('timed') && d) time.textContent = fmtTime(v.currentTime) + ' / ' + fmtTime(d);
    };
    const loop = () => {
      paint();
      raf = el.classList.contains('show') ? requestAnimationFrame(loop) : 0;
    };
    const show = () => {
      if (!v) return;
      clearTimeout(hideTimer);
      el.classList.add('show');
      paint();
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const hideSoon = () => {
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => {
        if (!dragging) el.classList.remove('show');
      }, SCRUB_HIDE_MS);
    };
    const seekTo = (x) => {
      if (!v || !v.duration) return;
      const r = el.getBoundingClientRect();
      v.currentTime = Math.max(0, Math.min(0.999, (x - r.left) / Math.max(1, r.width))) * v.duration;
      paint();
    };
    el.addEventListener('pointerdown', (e) => {
      if (!v) return;
      e.stopPropagation();
      dragging = true;
      el.classList.add('drag');
      show();
      try {
        el.setPointerCapture(e.pointerId);
      } catch (err) {
        /* sin captura */
      }
      wasPlaying = !v.paused;
      v.pause();
      seekTo(e.clientX);
    });
    el.addEventListener('pointermove', (e) => {
      if (dragging) seekTo(e.clientX);
    });
    const end = () => {
      if (!dragging) return;
      dragging = false;
      el.classList.remove('drag');
      if (v && wasPlaying) v.play().catch(() => {});
      hideSoon();
    };
    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', end);
    for (const ev of ['click', 'dblclick', 'touchstart']) el.addEventListener(ev, (e) => e.stopPropagation(), { passive: true });
    // Tocar cualquier parte del GIF la muestra; al soltar se va sola.
    const watch = (zone) => {
      zone.addEventListener('pointerdown', show, { passive: true });
      zone.addEventListener('pointerup', hideSoon, { passive: true });
      zone.addEventListener('pointercancel', hideSoon, { passive: true });
    };
    const bind = (video, timed) => {
      v = video || null;
      el.hidden = !v;
      el.classList.toggle('timed', !!(v && timed));
      if (!v) el.classList.remove('show');
      paint();
    };
    bind(initial || null);
    return { el, bind, watch };
  }

  // Vuelve a empezar el GIF/video que está a la vista dentro de una tarjeta o página.
  function replayIn(scope, index) {
    const slides = scope.querySelectorAll('.slide, .vw-slide');
    const slideEl = slides[index] || slides[0];
    const v = (slideEl && slideEl.querySelector('video')) || scope.querySelector('video');
    if (!v) return;
    if (!v.getAttribute('src') && v.dataset.src) v.src = v.dataset.src;
    v.currentTime = 0;
    v.play().catch(() => {});
  }

  function embedLinkOut(m, p) {
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
      snd.hidden = !m.real; // los GIF no suenan: el botón aparece si resulta ser un video
      const badge = h('span', { class: 'mbadge', text: m.real ? 'VIDEO' : 'GIF' });
      // Videos: reproductor con pausa y tiempo. GIF: solo la barra limpia que aparece al tocar.
      const ctl = m.real ? miniPlayer(v) : scrubBar(v);
      if (!m.real) ctl.watch(box);
      box.append(v, badge, snd, ctl.el);
      watchAudio(v, () => {
        m.real = true;
        badge.textContent = 'VIDEO';
        snd.hidden = false;
      });
      onTaps(box, () => openViewer(feed, p, i), () => m.real && snd.click());
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
    track._idx = 0; // imagen a la vista (sirve para volver a ella al girar el teléfono)
    track.addEventListener(
      'scroll',
      () => {
        // Al girar cambia el ancho y la posición se descuadra: eso no cuenta como deslizar.
        if (Date.now() < resizeLock) return;
        const i = Math.round(track.scrollLeft / Math.max(1, track.clientWidth));
        if (i === idx) return;
        idx = i;
        track._idx = i;
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

  // ================================================================ Hashtags más específicos
  //
  // Cada post lleva toda la cadena de carpetas (fandoms › anime › Touhou Project › Cirno) y además
  // etiquetas de formato (#gif, #video). Se muestra solo lo más específico de cada cadena, con su
  // carpeta al lado en chiquito, y las estadísticas y el resumen cuentan solo eso. El árbol se pide una
  // vez por hashtag (de a 60 por consulta) y se guarda en el teléfono: S.tagTree.
  const TREE_MAX = 8000;
  const TAGS_SHOWN = 4;
  const tkey = (t) => String(t).toLowerCase();
  const knownTree = (t) => S.tagTree[tkey(t)];
  const treeWaiting = new Set();
  const treeRows = new Set(); // filas de hashtags que se vuelven a dibujar cuando llega el árbol
  let treeTimer = null;
  function needTree(tags) {
    for (const t of tags) if (!RS.isFormatTag(t) && !knownTree(t)) treeWaiting.add(t);
    if (treeWaiting.size && !treeTimer) treeTimer = setTimeout(loadTree, 120);
  }
  async function loadTree() {
    treeTimer = null;
    const names = Array.from(treeWaiting).slice(0, 60);
    names.forEach((n) => treeWaiting.delete(n));
    if (!names.length) return;
    try {
      const paths = await RS.fetchTagPaths(names);
      const now = Date.now();
      for (const n of names) S.tagTree[tkey(n)] = { p: paths[n] || [], at: now };
      const keys = Object.keys(S.tagTree);
      if (keys.length > TREE_MAX) {
        keys
          .sort((a, b) => S.tagTree[a].at - S.tagTree[b].at)
          .slice(0, keys.length - TREE_MAX)
          .forEach((k) => delete S.tagTree[k]);
      }
      persist('tagTree', 3000);
      for (const row of Array.from(treeRows)) if (row._draw()) treeRows.delete(row);
    } catch (e) {
      /* sin conexión: mientras tanto se ven todos los hashtags */
    }
    if (treeWaiting.size && !treeTimer) treeTimer = setTimeout(loadTree, 120);
  }
  /** Los hashtags más específicos de un post (sin los de formato), cada uno con su carpeta de arriba. */
  function leafTags(tags) {
    const list = tags.filter((t) => !RS.isFormatTag(t));
    const inPost = new Set(list.map(tkey));
    const above = new Set();
    for (const t of list) {
      const k = knownTree(t);
      if (k) for (const a of k.p) if (inPost.has(tkey(a))) above.add(tkey(a));
    }
    return list
      .filter((t) => !above.has(tkey(t)))
      .map((t) => {
        const k = knownTree(t);
        const parent = k && k.p[0] && !RS.isFormatTag(k.p[0]) ? k.p[0] : null;
        return { name: t, parent };
      });
  }

  // Botón de hashtag: un toque lo abre; mantenerlo presionado 3 s lo sigue (Seguidos).
  // (Es un botón y no un enlace: Android cancela la pulsación larga sobre los enlaces.)
  function tagButton(t, onOpen, parent) {
    return holdToFavorite(
      h('button', { type: 'button', class: 'htag' + (favOf(t) ? ' fav' : ''), 'data-tag': t, draggable: 'false', onclick: onOpen }, '#' + t, parent ? h('small', { class: 'tparent', text: parent }) : null),
      t
    );
  }

  // Fila de hashtags de un post: lo más específico (hasta 4) y «+N» para ver todos.
  function tagsRow(p, onOpen, cls) {
    const open = onOpen || ((t) => nav('#/tag/' + enc(t)));
    const row = h('div', { class: cls || 'tags' });
    let all = false;
    row._draw = () => {
      const complete = !p.tags.some((t) => !RS.isFormatTag(t) && !knownTree(t));
      const shown = all ? p.tags.map((t) => ({ name: t, parent: null })) : leafTags(p.tags).slice(0, TAGS_SHOWN);
      const rest = p.tags.length - shown.length;
      fill(row,
        shown.map((x) => tagButton(x.name, () => open(x.name), x.parent)),
        !all && rest > 0
          ? h('button', {
              type: 'button',
              class: 'htag more',
              'aria-label': 'Ver los ' + p.tags.length + ' hashtags',
              onclick: (e) => {
                e.stopPropagation();
                all = true;
                row._draw();
              }
            }, '+' + rest)
          : null
      );
      return complete;
    };
    if (!row._draw()) {
      needTree(p.tags);
      treeRows.add(row);
    }
    return row;
  }

  // Mantener presionado un hashtag 3 segundos lo sigue (se ve una línea que se llena).
  const HOLD_MS = 3000;
  function holdToFavorite(el, tag) {
    let timer = null;
    let x0 = 0;
    let y0 = 0;
    const cancel = () => {
      clearTimeout(timer);
      timer = null;
      el.classList.remove('holding');
    };
    el.addEventListener('pointerdown', (e) => {
      if (e.button) return;
      x0 = e.clientX;
      y0 = e.clientY;
      el.classList.add('holding');
      timer = setTimeout(async () => {
        timer = null;
        el.classList.remove('holding');
        el.dataset.held = '1';
        buzz(40);
        if (favOf(tag)) {
          toast('Ya sigues #' + tag);
          return;
        }
        const fav = await addFavorite(tag);
        if (!fav) return;
        toast(savedText(tag, fav));
        document.querySelectorAll('.htag[data-tag]').forEach((a) => {
          if (favOf(a.dataset.tag)) a.classList.add('fav');
        });
      }, HOLD_MS);
    });
    el.addEventListener('pointermove', (e) => {
      if (timer && Math.hypot(e.clientX - x0, e.clientY - y0) > 10) cancel();
    });
    for (const ev of ['pointerup', 'pointercancel', 'pointerleave']) el.addEventListener(ev, cancel);
    el.addEventListener(
      'click',
      (e) => {
        if (!el.dataset.held) return;
        delete el.dataset.held;
        e.preventDefault();
        e.stopImmediatePropagation();
      },
      true
    );
    el.addEventListener('contextmenu', (e) => e.preventDefault());
    return el;
  }

  // ---- Reputación del autor (ver RS.reputation en shared.js).
  const decimal = (n) => String(n).replace('.', ',');
  function repStars(r, cls) {
    return h('span', { class: 'rep' + (cls ? ' ' + cls : ''), title: 'Reputación: ' + decimal(r.stars) + ' de 5', 'aria-label': 'Reputación ' + decimal(r.stars) + ' de 5' }, icon('star', 12), decimal(r.stars));
  }
  // Los posts guardados antes de la 1.0.8 no traen los números del autor: se piden aparte (una vez por usuario).
  function repChip(p, cls) {
    const el = h('span', { class: 'rep-slot' });
    const put = (a) => {
      const r = RS.reputation(a);
      if (r) fill(el, repStars(r, cls));
    };
    if (p.author) put(p.author);
    else if (p.user)
      RS.fetchUserInfo(p.user)
        .then((u) => u && put(u.author))
        .catch(() => {});
    return el;
  }
  // Cinco estrellas con relleno parcial (media estrella incluida).
  function starRow(n) {
    const row = h('span', { class: 'stars5', role: 'img', 'aria-label': decimal(n) + ' de 5 estrellas' });
    for (let i = 0; i < 5; i++) {
      const part = Math.max(0, Math.min(1, n - i));
      row.append(h('span', { class: 'st', style: '--p:' + part }, icon('star', 22), icon('star', 22)));
    }
    return row;
  }

  function buildCard(it, feed) {
    const p = it.post;
    const card = h('article', { class: 'card', 'data-id': p.id });
    if (it.label) card.append(h('div', { class: 'source', style: it.color ? { color: it.color } : null }, icon(it.icon || 'shuffle', 14), h('span', { text: it.label })));
    card.append(
      h('div', { class: 'head' },
        p.user
          ? h('a', { class: 'who-link', href: '#/user/' + enc(p.user), 'aria-label': 'Ver todos los posts de ' + p.user },
              avatar(p),
              h('div', { class: 'who' }, h('span', { class: 'user-line' }, h('span', { class: 'user', text: p.user }), repChip(p)), h('span', { class: 'when', text: ago(p.time) }))
            )
          : [avatar(p), h('div', { class: 'who' }, h('span', { class: 'user', text: 'anónimo' }), h('span', { class: 'when', text: ago(p.time) }))],
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
        p.media.some((m) => m.kind === 'video')
          ? h('button', { class: 'act dim', 'aria-label': 'Ver el GIF desde el principio', title: 'Desde el principio', onclick: () => replayIn(card, currentIndex(card)) }, icon('replay', 23))
          : null,
        media ? h('button', { class: 'act dim', 'aria-label': 'Pantalla completa', onclick: () => openViewer(feed, p, currentIndex(card)) }, icon('expand', 21)) : null
      )
    );
    if (p.text) {
      const cap = h('p', { class: 'caption', text: p.text });
      cap.addEventListener('click', () => cap.classList.toggle('open'));
      card.append(cap);
    }
    if (p.tags.length) card.append(tagsRow(p));
    card._post = p;
    seenIO.observe(card);
    dwellIO.observe(card);
    return card;
  }

  function currentIndex(card) {
    const track = card.querySelector('.track');
    return track ? track._idx || 0 : 0;
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
    else if (m && (m.kind === 'embed' || (m.kind === 'video' && m.real))) cell.append(h('span', { class: 'tb' }, icon('play', 14)));
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
    // El sonido empieza siempre apagado; se prende con el botón amarillo.
    const v = { feed, scroller, current: null, muted: true, onAdd: null, openedAt: Date.now() };
    viewer = v;
    stats().fsOpens++;
    saveStats();
    v.el = h('div', { class: 'viewer', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Pantalla completa' },
      scroller,
      h('div', { class: 'vw-bar' }, h('button', { class: 'vw-btn', 'aria-label': 'Salir de pantalla completa', onclick: () => exitViewer() }, icon('x', 24)))
    );
    v.seekEl = h('div', { class: 'vw-seek', 'aria-hidden': 'true' });
    v.el.append(v.seekEl);
    edgeZones(v.el);
    viewerGestures(v);
    v.el.addEventListener('pointerdown', viewerPointerDown, true);
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
    let sndBtn = null;
    const slides = p.media.map((m) => {
      const s = h('div', { class: 'vw-slide' });
      if (m.kind === 'image') {
        s._ratio = m.w && m.h ? m.h / m.w : 0;
        if (s._ratio > window.innerHeight / Math.max(1, window.innerWidth)) s.classList.add('tall');
        s.append(h('img', { src: RS.imageUrl(m, true), alt: '', decoding: 'async' }));
        onTaps(s, () => exitViewer());
      } else if (m.kind === 'video') {
        const vid = h('video', { src: RS.videoUrl(m), loop: true, playsinline: true, poster: RS.posterUrl(m), preload: 'auto' });
        vid.muted = viewer.muted;
        vid._real = !!m.real;
        watchAudio(vid, () => {
          m.real = true;
          vid._real = true;
          if (sndBtn) sndBtn.hidden = false;
          if (page._scrub && viewer && viewer.current === page) page._scrub.bind(vid, true);
        });
        videos.push(vid);
        s.append(vid, h('span', { class: 'vw-paused', 'aria-hidden': 'true' }, icon('play', 40)));
        // Un toque pausa (o sigue); dos toques salen de la pantalla completa. En horizontal, tocar la
        // parte de abajo solo muestra los controles. Justo después de arrastrar para adelantar, no pausa.
        onTaps(s, () => exitViewer(), () => {
          if (Date.now() - (vid._seekedAt || 0) < 700) return;
          if (isLandscape() && lastDownY > window.innerHeight * (1 - LAND_CTL_ZONE)) return;
          togglePause(vid, s);
        });
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
      (sndBtn = videos.length ? soundButton() : null)
    );
    // Solo los videos tienen sonido: con GIF el botón no aparece.
    if (sndBtn) sndBtn.hidden = !videos.some((x) => x._real);
    // Barra mínima, como la de los GIF, también para los videos (con el tiempo en chiquito).
    const scrub = videos.length ? scrubBar(null) : null;
    if (scrub) scrub.watch(media);
    page._scrub = scrub;
    const info = h('div', { class: 'vw-info' },
      scrub ? scrub.el : null,
      page._dots || null,
      it.label ? h('span', { class: 'vw-src', text: it.label }) : null,
      h('div', { class: 'vw-who' },
        p.user
          ? h('a', {
              class: 'vw-user',
              href: '#/user/' + enc(p.user),
              onclick: (e) => {
                e.preventDefault();
                closeViewerThen(() => nav('#/user/' + enc(p.user)));
              }
            }, icon('user', 15), p.user)
          : h('strong', { text: 'anónimo' }),
        // Estrellas del autor y rating del post: solo si se activan en Ajustes.
        p.user ? h('span', { class: 'vw-score' }, repChip(p, 'media')) : null,
        h('span', { class: 'when', text: ' · ' + ago(p.time) }),
        h('span', { class: 'vw-score' }, ' · ', h('span', { class: 'vw-rating' }, icon('up', 13), String(p.rating).replace('.', ',')))
      ),
      p.tags.length ? tagsRow(p, (t) => closeViewerThen(() => nav('#/tag/' + enc(t))), 'vw-tags') : null
    );

    fill(page, media, side, info);
    page._dots = null;
    page.dataset.filled = '1';
    page._videos = videos;
    if (mediaIndex && page._track) {
      page._track.scrollLeft = mediaIndex * page._track.clientWidth;
      page._track._idx = mediaIndex;
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

  function setCurrentPage(page, force) {
    if (!viewer) return;
    // Mientras se gira el teléfono pasan otros posts por delante: no cambian el actual.
    if (!force && Date.now() < resizeLock && viewer.current && page !== viewer.current) return;
    // El post que dejas atrás vuelve a reproducirse solo la próxima vez que llegues a él.
    if (viewer.current && viewer.current !== page) {
      (viewer.current._videos || []).forEach((x) => (x._userPaused = false));
      viewer.current.querySelectorAll('.vw-slide.paused').forEach((x) => x.classList.remove('paused'));
    }
    viewer.current = page;
    fillPage(page, 0);
    markSeen(page.dataset.id, page._it && page._it.post);
    focusPost(page._it && page._it.post);
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
      let shown = null;
      for (const vid of vids) {
        if (visibleSlide && vid.parentNode === visibleSlide) {
          if (!vid._userPaused) vid.play().catch(() => {});
          shown = vid;
        } else vid.pause();
      }
      if (page === viewer.current && page._scrub) page._scrub.bind(shown || null, !!(shown && shown._real));
    }
  }

  // Botón de sonido de la pantalla completa: amarillo para que se vea; empieza apagado.
  function soundButton() {
    const b = h('button', { class: 'vw-act vw-sound', onclick: toggleViewerSound });
    paintSound(b);
    return b;
  }
  function paintSound(b) {
    fill(b, h('span', { class: 'snd' }, icon(viewer.muted ? 'muted' : 'sound', 24)));
    b.classList.toggle('on', !viewer.muted);
    b.setAttribute('aria-pressed', String(!viewer.muted));
    b.setAttribute('aria-label', viewer.muted ? 'Activar sonido' : 'Silenciar');
  }
  function toggleViewerSound() {
    if (!viewer) return;
    viewer.muted = !viewer.muted;
    viewer.el.querySelectorAll('video').forEach((x) => (x.muted = viewer.muted));
    viewer.el.querySelectorAll('.vw-sound').forEach(paintSound);
  }

  // Un toque en pantalla completa pausa el video o el GIF; otro toque lo sigue desde donde quedó.
  function togglePause(vid, slideEl) {
    if (vid.paused) {
      vid._userPaused = false;
      vid.play().catch(() => {});
    } else {
      vid._userPaused = true;
      vid.pause();
    }
    slideEl.classList.toggle('paused', !!vid._userPaused);
  }

  // Con el teléfono horizontal todo se esconde (el nombre del autor, siempre). Tocar la parte de abajo
  // de la pantalla muestra un momento la barra y los botones; tocar en otro lado pausa el video.
  const CONTROLS_MS = 2600;
  const LAND_CTL_ZONE = 0.35; // la parte de abajo: el 35 % de la altura
  let lastDownY = 0;
  function showControls() {
    const v = viewer;
    if (!v) return;
    v.el.classList.add('ctl');
    clearTimeout(v.ctlTimer);
    v.ctlTimer = setTimeout(() => v.el.classList.remove('ctl'), CONTROLS_MS);
  }
  function viewerPointerDown(e) {
    lastDownY = e.clientY;
    if (!isLandscape() || e.clientY > window.innerHeight * (1 - LAND_CTL_ZONE)) showControls();
  }

  // ---- Gestos con el dedo en pantalla completa:
  // · Mantener el dedo sobre un video o GIF y arrastrarlo a los lados lo adelanta o lo atrasa
  //   (se apaga en Ajustes; seekSpan = segundos al cruzar la pantalla de lado a lado).
  // · En la app, subir el dedo desde la parte de abajo muestra los botones de Android en vez de pasar
  //   de post; solo un arrastre largo (más de LONG_SWIPE_MS) pasa al siguiente.
  const SEEK_HOLD_MS = 280;
  const LONG_SWIPE_MS = 650;
  const bottomZone = () => Math.max(80, window.innerHeight * 0.12);
  function peekBars() {
    try {
      if (RS.android && typeof RS.android.peekSystemBars === 'function') RS.android.peekSystemBars();
    } catch (e) {
      /* puente antiguo */
    }
  }
  function viewerGestures(v) {
    let g = null;
    v.el.addEventListener(
      'touchstart',
      (e) => {
        if (g) clearTimeout(g.timer);
        g = null;
        if (e.touches.length !== 1 || e.target.closest('.scrub, input, .vw-edge')) return;
        const t = e.touches[0];
        g = { x0: t.clientX, y0: t.clientY, at: Date.now(), mode: '', bottom: !!RS.android && t.clientY > window.innerHeight - bottomZone() };
        const slideEl = e.target.closest('.vw-slide');
        const vid = slideEl && slideEl.querySelector('video');
        if (vid && S.settings.seekDrag && !e.target.closest('button, a')) g.timer = setTimeout(() => startSeek(g, vid), SEEK_HOLD_MS);
      },
      { passive: true }
    );
    v.el.addEventListener(
      'touchmove',
      (e) => {
        if (!g) return;
        const t = e.touches[0];
        const dx = t.clientX - g.x0;
        const dy = t.clientY - g.y0;
        if (g.mode === 'seek') {
          e.preventDefault();
          moveSeek(g, dx);
          return;
        }
        if (Math.hypot(dx, dy) > 10) clearTimeout(g.timer);
        if (!g.bottom || g.mode === 'native' || g.mode === 'done') return;
        if (g.mode === '') {
          // Hacia abajo o hacia los lados se desliza como siempre; hacia arriba, se frena.
          if (dy > 0 || Math.abs(dx) > Math.abs(dy)) {
            g.mode = 'native';
            return;
          }
          g.mode = 'hold';
        }
        e.preventDefault();
        if (g.mode === 'hold' && dy < -12) {
          g.mode = 'peek';
          peekBars();
        }
        if (g.mode === 'peek' && Date.now() - g.at > LONG_SWIPE_MS && dy < -90) {
          g.mode = 'done';
          const next = viewer && viewer.current && viewer.current.nextElementSibling;
          if (next) viewer.scroller.scrollTo({ top: next.offsetTop, behavior: 'smooth' });
        }
      },
      { passive: false }
    );
    const end = () => {
      if (!g) return;
      clearTimeout(g.timer);
      if (g.mode === 'seek') endSeek(g);
      g = null;
    };
    v.el.addEventListener('touchend', end, { passive: true });
    v.el.addEventListener('touchcancel', end, { passive: true });
  }
  function startSeek(g, vid) {
    if (!viewer || !vid.duration) return;
    g.mode = 'seek';
    g.vid = vid;
    g.t0 = vid.currentTime;
    g.wasPlaying = !vid.paused;
    vid.pause();
    buzz(10);
    showSeek(vid, 0);
  }
  function moveSeek(g, dx) {
    const v = g.vid;
    const d = v.duration || 0;
    if (!d) return;
    const span = Math.min(d, Number(S.settings.seekSpan) || 60);
    const to = Math.max(0, Math.min(d - 0.05, g.t0 + (dx / Math.max(1, window.innerWidth)) * span));
    v.currentTime = to;
    showSeek(v, to - g.t0);
  }
  function endSeek(g) {
    g.vid._seekedAt = Date.now();
    if (g.wasPlaying && !g.vid._userPaused) g.vid.play().catch(() => {});
    if (viewer) viewer.seekEl.classList.remove('show');
  }
  function showSeek(vid, delta) {
    if (!viewer) return;
    const d = vid.duration || 0;
    const pct = d ? Math.round((vid.currentTime / d) * 100) : 0;
    fill(viewer.seekEl,
      h('b', { text: (delta < 0 ? '−' : '+') + fmtTime(Math.abs(delta)) }),
      h('span', { text: fmtTime(vid.currentTime) + ' / ' + fmtTime(d) }),
      h('i', {}, h('u', { style: 'width:' + pct + '%' }))
    );
    viewer.seekEl.classList.add('show');
  }

  // En horizontal, en la app, deslizar desde los lados muestra los botones de Android (en esa
  // posición la barra de Android queda a un costado). Abajo lo resuelve viewerGestures.
  function edgeZones(el) {
    if (!RS.android || typeof RS.android.peekSystemBars !== 'function') return;
    el.classList.add('edge');
    for (const side of ['left', 'right']) {
      const z = h('div', { class: 'vw-edge ' + side, 'aria-hidden': 'true' });
      let x0 = 0;
      let y0 = 0;
      let fired = false;
      z.addEventListener('pointerdown', (e) => {
        x0 = e.clientX;
        y0 = e.clientY;
        fired = false;
        try {
          z.setPointerCapture(e.pointerId);
        } catch (err) {
          /* sin captura */
        }
      });
      z.addEventListener('pointermove', (e) => {
        if (fired || !e.buttons) return;
        const d = side === 'left' ? e.clientX - x0 : x0 - e.clientX;
        if (d < 12) return;
        fired = true;
        try {
          RS.android.peekSystemBars();
        } catch (err) {
          /* puente antiguo */
        }
      });
      el.append(z);
    }
  }

  function dislikeInViewer(page) {
    const v = viewer;
    const it = page._it;
    const p = it.post;
    const feed = v.feed;
    S.dislikes[p.id] = { at: Date.now(), post: p };
    today().dislikes++;
    saveStats();
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
    if (next) setCurrentPage(next, true);
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
    stats().fsMs += Math.min(Date.now() - (v.openedAt || Date.now()), 2 * 3600000);
    saveStats();
    blurPost();
    setTimeout(refocusVisible, 600);
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
      feed.lastTopId = id;
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
    if (viewer && viewer.feed && viewer.current) viewer.feed.reopen = viewer.current.dataset.id;
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

  // ================================================================ Girar el teléfono
  //
  // Al girar cambia el tamaño de todo y la página quedaba en otro post (o en otra imagen del
  // carrusel). Ahora se recuerda dónde estabas y se vuelve ahí. Si pones el teléfono horizontal
  // mientras ves un GIF o un video en el feed, se abre en pantalla completa; al volver a ponerlo
  // vertical, se cierra y quedas en el mismo post.

  let resizeLock = 0;
  const isLandscape = () => window.innerWidth > window.innerHeight;
  const touchDevice = () => !!RS.android || !!(window.matchMedia && matchMedia('(pointer: coarse)').matches);
  let landscape = isLandscape();

  // Post del feed que está a la vista. Se anota al desplazarte y, por si no llegan esos eventos
  // (pasa con la pantalla apagada o el panel de pruebas oculto), también cada 700 ms. Nunca
  // mientras se gira: el tamaño ya cambió pero la página todavía no se reacomodó.
  let knownSize = window.innerWidth + 'x' + window.innerHeight;
  function noteTop() {
    const f = current && current.feed;
    if (Date.now() < resizeLock || window.innerWidth + 'x' + window.innerHeight !== knownSize) return;
    if (viewer || !f || f.mode !== 'feed' || !f.root.isConnected) return;
    f.lastTopId = f.topVisibleId();
  }
  let topTimer = null;
  window.addEventListener(
    'scroll',
    () => {
      clearTimeout(topTimer);
      topTimer = setTimeout(noteTop, 120);
    },
    { passive: true }
  );
  setInterval(noteTop, 700);

  function realignTracks(root) {
    root.querySelectorAll('.track, .vw-track').forEach((t) => {
      if (t._idx) t.scrollLeft = t._idx * t.clientWidth;
    });
  }

  function keepPlace() {
    if (viewer) {
      const page = viewer.current;
      const ratio = window.innerHeight / Math.max(1, window.innerWidth);
      viewer.scroller.querySelectorAll('.vw-slide').forEach((sl) => sl._ratio && sl.classList.toggle('tall', sl._ratio > ratio));
      if (page && page.isConnected) {
        viewer.scroller.scrollTop = page.offsetTop;
        realignTracks(page);
      }
      return;
    }
    const f = current && current.feed;
    if (!f || f.mode !== 'feed' || !f.root.isConnected || !f.lastTopId) return;
    f.scrollToPost(f.lastTopId);
    const card = f.list.querySelector('[data-id="' + CSS.escape(f.lastTopId) + '"]');
    if (card) realignTracks(card);
  }

  // Horizontal con un GIF o video a la vista en el feed: pantalla completa.
  function openRotated() {
    const f = current && current.feed;
    if (!f || f.mode !== 'feed' || !f.root.isConnected) return;
    const id = f.lastTopId || f.topVisibleId();
    const card = id && f.list.querySelector('[data-id="' + CSS.escape(id) + '"]');
    if (!card || !card._post || !RS.isAnimated(card._post)) return;
    openViewer(f, card._post, currentIndex(card));
    if (viewer) viewer.byRotation = true;
  }

  window.addEventListener('resize', () => {
    resizeLock = Date.now() + 900;
    knownSize = window.innerWidth + 'x' + window.innerHeight;
    const now = isLandscape();
    const turned = now !== landscape;
    landscape = now;
    if (turned && touchDevice()) {
      if (now && !viewer) openRotated();
      else if (!now && viewer && viewer.byRotation) exitViewer();
    }
    // Algunos teléfonos vuelven a mostrar las barras del sistema al girar.
    if (viewer && RS.android) setFullscreen(true);
    keepPlace();
    for (const ms of [120, 350, 700]) setTimeout(keepPlace, ms);
  });

  // ================================================================ Posts retirados (derechos de autor)
  //
  // Por cada usuario o hashtag se anota qué páginas tienen posts retirados o que faltan:
  // { página: [retirados, recibidos, era la última (1/0), esperados] }. JoyReactor a veces cuenta posts
  // que después no entrega (#Sweetie Fox dice 346 y entrega 339): también se descuentan.
  // Las páginas que solo traen retirados no se vuelven a pedir; la más nueva sí, siempre, porque ahí
  // aparecen los posts nuevos. Así, volver a una cuenta bloqueada cuesta una sola consulta.
  const JUNK_SOURCES = 300;
  const PAGE_FULL = 10;
  // Posts que no se pueden ver: retirados más los que faltan (las anotaciones de la 1.2.0 no tienen faltantes).
  function junkKnown(key) {
    const r = S.junkScan[key];
    return r ? Object.values(r.p).reduce((a, x) => a + x[0] + Math.max(0, (x[3] == null ? x[1] : x[3]) - x[1]), 0) : 0;
  }
  // Cuántos posts se pueden ver de verdad: los que dice JoyReactor menos los retirados ya encontrados.
  const validCount = (key, total) => Math.max(0, (total || 0) - junkKnown(key));
  const tagJunkKey = (name) => 'tag:' + String(name).toLowerCase() + ':ALL';
  const userJunkKey = (name) => 'user:' + String(name).toLowerCase();
  function junkScan(key) {
    const scan = { skipped: 0, changed: false };
    scan.skip = (page, last) => {
      const r = S.junkScan[key];
      const x = r && r.p[page];
      if (!x || page >= last || x[0] < x[1]) return false;
      // Una página anotada cuando era la última pudo llenarse después: esa se vuelve a pedir.
      if (x.length < 3 ? x[1] < PAGE_FULL : x[2]) return false;
      scan.skipped += x[0];
      return true;
    };
    scan.note = (page, last, posts, total) => {
      const junk = posts.filter(RS.isJunk).length;
      const expected = page < last ? PAGE_FULL : Math.max(posts.length, (total || 0) - PAGE_FULL * (last - 1));
      let r = S.junkScan[key];
      const old = r && r.p[page];
      if (junk || posts.length < expected) {
        const entry = [junk, posts.length, page >= last ? 1 : 0, expected];
        if (old && old.join() === entry.join()) return;
        if (!r) r = S.junkScan[key] = { p: {}, at: 0 };
        r.p[page] = entry;
        r.at = Date.now();
      } else if (old) {
        delete r.p[page];
        if (!Object.keys(r.p).length) delete S.junkScan[key];
      } else return;
      scan.changed = true;
      const keys = Object.keys(S.junkScan);
      if (keys.length > JUNK_SOURCES) {
        keys
          .sort((a, b) => S.junkScan[a].at - S.junkScan[b].at)
          .slice(0, keys.length - JUNK_SOURCES)
          .forEach((k) => delete S.junkScan[k]);
      }
      persist('junkScan', 3000);
    };
    return scan;
  }

  // ================================================================ Feed (scroll infinito)

  // Pestañas del perfil de un usuario (la de Favoritos sale de tus me gusta, ver fetchChunk).
  const SHOW_TEST = { all: () => true, anim: RS.isAnimated };

  class Feed {
    constructor(o) {
      this.key = o.key;
      this.kind = o.kind; // 'pager' | 'random' | 'static'
      this.tag = o.tag || null;
      this.type = o.type || 'GOOD';
      this.kinds = o.kinds || []; // hashtag: ['gif'], ['video'], ['gif','video'] o [] (todo)
      this.memoryKey = o.memoryKey || null; // recuerda en qué post quedaste (Me gusta, Historial…)
      this.anchorId = o.anchor || null;
      this.pendingAnchor = o.anchor || null;
      this.user = o.user || null; // todos los posts de un usuario
      this.show = o.show || 'all'; // perfil: 'all' | 'anim' | 'fav' (pestañas Todos, Videos y GIF, Favoritos)
      this.userSrc = null;
      this.mediaSrc = null;
      this.mode = o.mode || 'feed';
      this.source = o.source || '';
      this.staticItems = o.items || [];
      this.renderHead = o.head;
      this.renderExtra = o.extra;
      this.renderSub = o.sub;
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
      this.junk = 0; // posts retirados por derechos de autor que se saltaron
      this.prelude = o.prelude || null; // Inicio: posts que van antes que todo (los de la gente que sigues)
      this.preluded = false;
      this.scan = null; // páginas con posts retirados ya revisadas (ver junkScan)
      this.dry = false; // la última tanda no trajo nada que ver: la próxima pide varias páginas a la vez
      this.total = 0; // cuántos posts dice JoyReactor que hay (para descontar los retirados)
      this.hero = null; // cabecera del hashtag o del usuario, que muestra cuántos posts hay
      this.reloadItems = o.reload || null; // listas guardadas (Me gusta, Historial): se releen al recargar
      this.listeners = new Set();

      this.headEl = h('header', { class: 'top' + (o.back ? ' has-back' : '') });
      this.extraEl = h('div', { class: 'feed-extra' });
      // Barra que queda fija bajo la cabecera al bajar (pestañas del perfil).
      this.subEl = h('div', { class: 'feed-sub' });
      this.list = h('div', { class: 'list' });
      this.statusEl = h('div', { class: 'status' });
      this.sentinel = h('div', { class: 'sentinel' });
      this.root = h('div', { class: 'feed' }, this.headEl, this.extraEl, this.subEl, this.list, this.statusEl, this.sentinel);
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
      fill(this.subEl, ...[].concat(this.renderSub ? this.renderSub(this) : []));
    }
    applyMode() {
      this.list.className = 'list ' + (this.mode === 'grid' ? 'grid' : 'cards');
    }

    setStatus(kind, err) {
      const s = this.statusEl;
      if (kind === 'loading') {
        const src = this.userSrc;
        const text = this.kind === 'random'
          ? 'Sorteando posts de tu mezcla…'
          : this.show === 'anim' && src && src.count
            ? 'Buscando videos y GIF… revisé ' + fmt(src.posts.length) + ' de ' + fmt(src.count) + ' posts'
            : 'Cargando más posts…';
        fill(s, icon('spinner', 20, 'spin'), text);
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
        // Ya no hace falta el alto mínimo de setShow: si la pestaña está vacía, el aviso queda a la vista.
        this.list.style.minHeight = '';
        if (this.items.length) fill(s, h('span', { text: this.endText || 'No hay más posts.' }));
        else if (this.junk || (this.scan && this.scan.skipped)) fill(s, emptyBox('ban', 'No hay nada para ver aquí', 'JoyReactor retiró estos posts por derechos de autor.'));
        else fill(s, this.renderEmpty ? this.renderEmpty(this) : emptyBox('hash', 'No hay posts aquí', this.endText));
      } else fill(s);
    }

    async loadMore() {
      if (this.loading || this.done || this.failed || !this.root.isConnected) return;
      this.loading = true;
      this.setStatus('loading');
      try {
        let added = 0;
        for (let guard = 0; !added && !this.done && guard < 5; guard++) {
          added += await this.fetchChunk();
          if (!added && !this.done) this.setStatus('loading');
        }
        this.setStatus(this.done ? 'end' : '');
      } catch (e) {
        this.failed = true;
        this.setStatus('error', e);
      }
      this.loading = false;
      if (this.pendingAnchor && this.root.isConnected && this.scrollToPost(this.pendingAnchor)) this.pendingAnchor = null;
      // La cabecera descuenta los posts retirados que se van encontrando.
      if (this.hero && this.hero._redraw && this.scan && this.scan.changed) {
        this.scan.changed = false;
        this.hero._redraw();
      }
      this.checkMore();
    }

    checkMore() {
      if (this.done || this.loading || this.failed || !this.root.isConnected) return;
      if (this.sentinel.getBoundingClientRect().top < window.innerHeight + 1600) setTimeout(() => this.loadMore(), 0);
    }

    async fetchChunk() {
      // Inicio: primero los posts nuevos de la gente que sigues; después, el feed de siempre.
      let pre = 0;
      if (this.prelude && !this.preluded) {
        this.preluded = true;
        pre = this.add(await this.prelude().catch(() => []));
      }
      return pre + (await this.fetchMain());
    }

    async fetchMain() {
      if (this.kind === 'pager' && this.kinds.length) {
        if (!this.mediaSrc) this.mediaSrc = RS.createMediaSource(this.tag, this.type, S.settings.hideNsfw, this.kinds);
        const res = await this.mediaSrc.next();
        if (res.done) {
          this.done = true;
          if (res.capped) this.endText = 'Llegaste al límite: JoyReactor solo deja ver los ' + RS.GIF_LIMIT + ' más recientes de cada tipo por hashtag. Prueba con «Barajar».';
          else this.endText = 'No hay más ' + (this.kinds.length > 1 ? 'GIF ni videos' : this.kinds[0] === 'gif' ? 'GIF' : 'videos') + '. Quita el filtro de arriba para ver todos los posts.';
        }
        return this.add(res.posts.filter((p) => RS.matchesKinds(p, this.kinds)).map((post) => ({ post })));
      }
      if (this.kind === 'pager' && this.user && this.show === 'fav') {
        // Favoritos: los posts de este usuario que te gustaron (JoyReactor no deja ver los favoritos de otras personas).
        const liked = likedFrom(this.user);
        const chunk = liked.slice(this.cursor, this.cursor + 30);
        this.cursor += chunk.length;
        if (this.cursor >= liked.length) {
          this.done = true;
          this.endText = liked.length === 1 ? 'Es el único post de ' + this.user + ' que te gustó.' : 'Son los ' + liked.length + ' posts de ' + this.user + ' que te gustaron.';
        }
        return this.add(chunk.map((x) => ({ post: x.post })));
      }
      if (this.kind === 'pager' && this.user) {
        // Las pestañas filtran la misma lista de posts; si una pestaña tiene pocos, se piden varias páginas a la vez.
        if (!this.scan) this.scan = junkScan('user:' + this.user.toLowerCase());
        if (!this.userSrc) this.userSrc = RS.createUserSource(this.user, this.scan);
        const src = this.userSrc;
        if (this.cursor >= src.posts.length && !src.done) await src.more(this.show === 'all' && !this.dry ? 1 : 4);
        this.total = src.count;
        // De a 30 por vez: lo ya cargado de otra pestaña puede ser mucho.
        const out = [];
        while (this.cursor < src.posts.length && out.length < 30) {
          const post = src.posts[this.cursor++];
          if (SHOW_TEST[this.show](post)) out.push({ post });
        }
        if (src.done && this.cursor >= src.posts.length) this.done = true;
        const n = this.add(out);
        this.dry = !n;
        return n;
      }
      if (this.kind === 'pager') {
        // Las páginas que ya se sabe que solo tienen posts retirados no se vuelven a pedir. Si la
        // tanda anterior no trajo nada que ver, se piden 4 páginas a la vez.
        if (!this.scan) this.scan = junkScan('tag:' + String(this.tag || '').toLowerCase() + ':' + this.type);
        const scan = this.scan;
        if (this.next == null) {
          const res = await RS.fetchPage(this.tag, this.type, null);
          this.total = res.count;
          this.last = res.lastPage;
          scan.note(res.lastPage, res.lastPage, res.posts, res.count);
          this.next = res.lastPage - 1;
          if (this.next < 1) this.done = true;
          const n = this.add(res.posts.map((post) => ({ post })));
          this.dry = !n;
          return n;
        }
        const list = [];
        let next = this.next;
        while (next >= 1 && list.length < (this.dry ? 4 : 1)) {
          if (!scan.skip(next, this.last)) list.push(next);
          next--;
        }
        const results = await Promise.all(list.map((pg) => RS.fetchPage(this.tag, this.type, pg)));
        this.next = next;
        if (this.next < 1) this.done = true;
        let n = 0;
        results.forEach((res, i) => {
          scan.note(list[i], this.last, res.posts, this.total);
          n += this.add(res.posts.map((post) => ({ post })));
        });
        this.dry = !n;
        return n;
      }
      if (this.kind === 'random') {
        // Con tag: solo ese hashtag, en orden aleatorio (calidad según el orden elegido arriba).
        const opts = { n: 4, skip: this.ids };
        if (this.tag) Object.assign(opts, { sources: [{ name: this.tag, kind: null, w: 1 }], type: this.type, era: 'any', noRepeat: false, mediaKinds: this.kinds, hideNsfw: S.settings.hideNsfw });
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
      let end = this.cursor + 15;
      if (this.pendingAnchor) {
        const idx = this.staticItems.findIndex((x) => x.post.id === this.pendingAnchor);
        if (idx >= end) end = idx + 4;
      }
      const chunk = this.staticItems.slice(this.cursor, end);
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
        // Los posts retirados por derechos de autor no salen en ningún lado (tampoco en Me gusta ni en el Historial).
        if (RS.isJunk(p)) {
          this.junk++;
          continue;
        }
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
      // Si abriste un post tocando su miniatura, «atrás» vuelve a las miniaturas (ver backToGrid).
      this.backToGrid = mode === 'feed' && this.mode === 'grid' && !!anchorId;
      pauseIn(this.list);
      this.mode = mode;
      this.applyMode();
      updateSnap();
      fill(this.list, ...this.items.filter((it) => !S.dislikes[it.post.id]).map((it) => (mode === 'grid' ? buildThumb(it, this) : buildCard(it, this))));
      this.refreshHead();
      if (this.onMode) this.onMode(mode);
      // Se alinea en el acto (sin esperar a requestAnimationFrame, que se congela si la página no se ve).
      const el = anchor && this.list.querySelector('[data-id="' + CSS.escape(anchor) + '"]');
      if (el && mode === 'grid') el.scrollIntoView({ block: 'center' });
      else if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - this.headEl.offsetHeight);
      else window.scrollTo(0, 0);
      this.checkMore();
    }

    // Cambia de pestaña en el perfil: se vuelve a filtrar lo que ya se cargó, sin pedirlo otra vez.
    setShow(show) {
      if (show === this.show) return;
      // Si ya bajaste más allá de las pestañas, quedan arriba; si no, la página no se mueve.
      const tabsY = this.extraEl.getBoundingClientRect().bottom + window.scrollY - this.headEl.offsetHeight;
      pauseIn(this.list);
      this.show = show;
      this.items = [];
      this.ids.clear();
      this.cursor = 0;
      this.done = false;
      this.failed = false;
      this.junk = 0;
      this.backToGrid = false;
      fill(this.list);
      // Alto mínimo para que, mientras carga, la página no se encoja y las pestañas sigan arriba.
      this.list.style.minHeight = '100vh';
      fill(this.subEl, ...[].concat(this.renderSub ? this.renderSub(this) : []));
      if (window.scrollY > tabsY) window.scrollTo(0, tabsY);
      this.loadMore();
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
      this.junk = 0;
      this.dry = false;
      this.mediaSrc = null;
      fill(this.list);
      this.refresh();
      window.scrollTo(0, 0);
      return this.loadMore();
    }

    // Saca un post de la lista a la vista (p. ej. del Historial al darle me gusta).
    drop(id) {
      const el = this.list.querySelector('[data-id="' + CSS.escape(id) + '"]');
      if (el) {
        pauseIn(el);
        el.remove();
      }
      this.items = this.items.filter((it) => it.post.id !== id);
      this.staticItems = this.staticItems.filter((it) => it.post.id !== id);
      fill(this.extraEl, ...[].concat(this.renderExtra ? this.renderExtra(this) : []));
      if (!this.items.length && this.done) this.setStatus('end');
    }

    // Deslizar hacia abajo arriba del todo: se vuelve a pedir todo desde el principio.
    refreshAll() {
      if (this.reloadItems) this.staticItems = this.reloadItems();
      this.userSrc = null;
      this.scan = null;
      this.preluded = false;
      return this.reset();
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
  // Atrás: en la app se vuelve a la página anterior de la pila de la app. El historial del navegador
  // no sirve ahí: se desfasa de la pila (p. ej. al volver a una pestaña tocándola abajo).
  let goingBack = false;
  function navBack() {
    if (!RS.android) return history.back();
    stack.pop();
    goingBack = true;
    location.replace('#' + stack[stack.length - 1]);
  }
  function goBack(fallback) {
    if (stack.length > 1) navBack();
    else navReplace(fallback);
  }
  // Abriste un post tocando su miniatura: «atrás» vuelve a las miniaturas, donde estabas.
  function backToGrid() {
    const f = current && current.feed;
    if (!f || !f.backToGrid || f.mode !== 'feed') return false;
    f.setMode('grid', f.topVisibleId());
    return true;
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

  // Dónde quedaste en Me gusta / Historial / Novedades (esas listas se rehacen cuando cambian).
  const feedMemory = new Map();

  function mount(nodes, feed) {
    if (current && current.feed) {
      const prev = current.feed;
      prev.scrollY = window.scrollY;
      if (!(prev.anchorHold && Date.now() < prev.anchorHold)) prev.anchorId = prev.topVisibleId();
      if (prev.memoryKey) feedMemory.set(prev.memoryKey, prev.anchorId);
      pauseIn(prev.root);
    }
    blurPost();
    if (feed) setTimeout(refocusVisible, 700);
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
    if (!(anchor && f.scrollToPost(anchor))) {
      if (anchor) f.pendingAnchor = anchor;
      window.scrollTo(0, f.scrollY || 0);
    }
    // La cabecera del hashtag termina de dibujarse un momento después: vuelvo a alinear.
    if (anchor) setTimeout(() => current && current.feed === f && f.scrollToPost(anchor), 250);
    // Si saliste de la pantalla completa para ver un hashtag o un usuario, al volver se reabre.
    const reopen = f.reopen;
    f.reopen = null;
    if (reopen && lastNavWasBack) {
      const it = f.items.find((x) => x.post.id === reopen);
      // En la app se abre en el mismo momento (no se alcanza a ver la lista); en el navegador, tras el «atrás».
      if (it && RS.android) openViewer(f, it.post, 0);
      else if (it) setTimeout(() => current && current.feed === f && !viewer && openViewer(f, it.post, 0), 60);
    }
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

  // Pestaña de abajo que se marca en cada página. Ajustes (y lo que cuelga de ahí) se abre desde Favoritos.
  const TAB_OF = {
    home: 'home', tag: 'home', user: 'home', news: 'home',
    search: 'search',
    random: 'random', mix: 'random',
    following: 'following', favorites: 'following',
    likes: 'likes', history: 'likes', visited: 'likes', settings: 'likes', hidden: 'likes', stats: 'likes', week: 'likes', topusers: 'likes', tree: 'likes'
  };
  let lastNavWasBack = false;

  function route() {
    const { parts, q, key } = parseHash();
    lastNavWasBack = false;
    if (goingBack) {
      goingBack = false;
      lastNavWasBack = true;
    } else if (replacing && stack.length) stack[stack.length - 1] = key;
    else if (stack[stack.length - 1] !== key) {
      // Si ya pasaste por esa página (p. ej. tocas «Me gusta» abajo estando en Estadísticas), se vuelve
      // a ella y se descarta lo de encima: así «atrás» no te lleva otra vez a Estadísticas.
      const i = stack.length > 1 ? stack.lastIndexOf(key, stack.length - 2) : -1;
      if (i >= 0) {
        stack.length = i + 1;
        lastNavWasBack = true;
      } else stack.push(key);
    }
    replacing = false;
    closeViewer();

    const name = parts[0] || 'home';
    document.querySelectorAll('#tabs a').forEach((a) => a.classList.toggle('on', a.dataset.tab === (TAB_OF[name] || 'home')));
    document.querySelectorAll('#tabs a').forEach((a) => (a.classList.contains('on') ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current')));

    if (name === 'tag' && parts[1]) return routeTag(parts[1], q);
    if (name === 'user' && parts[1]) return routeUser(parts[1]);
    if (name === 'random') return routeRandom();
    if (name === 'mix') return routeMix();
    // «favorites» era el nombre de Seguidos hasta la 1.0.9.
    if (name === 'following' || name === 'favorites') return routeFollowing(q);
    if (name === 'search') return routeSearch();
    if (name === 'likes') return routeLikes();
    if (name === 'history') return routeHistory();
    if (name === 'visited') return routeVisited();
    if (name === 'stats') return routeStats();
    if (name === 'week' || name === 'topusers') return routeWeek();
    if (name === 'tree') return routeTree(parts[1] || '');
    if (name === 'hidden') return routeHidden();
    if (name === 'news') return routeNews();
    if (name === 'settings') return routeSettings();
    return routeHome(q);
  }

  // ================================================================ Piezas comunes

  const backBtn = (fallback) => h('button', { class: 'ib', 'aria-label': 'Volver', onclick: () => backToGrid() || goBack('#' + fallback) }, icon('back', 24));
  const iconLink = (ic, label, href) => h('a', { class: 'ib', href, 'aria-label': label, title: label }, icon(ic, 22));

  function viewToggle(feed) {
    const b = (mode, ic, label) =>
      h('button', { class: feed.mode === mode ? 'on' : '', 'aria-label': label, 'aria-pressed': String(feed.mode === mode), onclick: () => feed.setMode(mode) }, icon(ic, 20));
    return h('div', { class: 'vtoggle' }, b('feed', 'feed', 'Vista feed'), b('grid', 'grid', 'Vista miniaturas'));
  }

  function viewToggleCompact(feed) {
    const toGrid = feed.mode !== 'grid';
    const label = toGrid ? 'Ver en miniaturas' : 'Ver un post por pantalla';
    return h('button', { class: 'ib', 'aria-label': label, title: label, onclick: () => feed.setMode(toGrid ? 'grid' : 'feed') }, icon(toGrid ? 'grid' : 'feed', 21));
  }

  function fillBell(a) {
    const n = S.news.unread || 0;
    a.setAttribute('aria-label', n ? n + ' posts nuevos en lo que sigues' : 'Novedades');
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
    const row = h('section', { class: 'stories', 'aria-label': 'Hashtags que sigues' });
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
      h('a', { class: 'story', href: '#/following' },
        h('span', { class: 'ring dashed' }, icon('plus', 22)),
        h('span', { class: 'label', text: favs.length ? 'Añadir' : 'Seguir' })
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
      h('span', { text: 'Toca Actualizar y después Instalar. Tus favoritos y lo que sigues se conservan.' }),
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
        prelude: followedFirst,
        head: (f) => [h('h1', { text: 'Inicio' }), bellLink(), viewToggle(f)],
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

  // Los posts nuevos (de la última semana y que no viste) de la gente que sigues van primero en
  // Inicio, empezando por quien más me gusta te ha dado.
  const FOLLOWED_DAYS = 7;
  function likesByUser() {
    const by = {};
    for (const x of Object.values(S.likes)) {
      const u = x.post && x.post.user;
      if (u) by[userKey(u)] = (by[userKey(u)] || 0) + 1;
    }
    return by;
  }
  async function followedFirst() {
    const list = Object.values(S.following);
    if (!list.length) return [];
    const recent = await RS.fetchUsersRecent(list.map((f) => f.name));
    const likes = likesByUser();
    const since = Date.now() - FOLLOWED_DAYS * 86400000;
    const order = list.slice().sort((a, b) => (likes[userKey(b.name)] || 0) - (likes[userKey(a.name)] || 0) || (b.addedAt || 0) - (a.addedAt || 0));
    const out = [];
    for (const f of order) {
      const posts = (recent[f.name] || []).filter((p) => p.time >= since && !S.seenSet.has(p.id)).sort((a, b) => b.time - a.time);
      for (const post of posts) out.push({ post, label: 'De @' + post.user + ', a quien sigues', icon: 'user', color: 'var(--accent)' });
    }
    return out;
  }
  // Al seguir o dejar de seguir a alguien, Inicio se vuelve a armar la próxima vez que entres.
  function invalidateHome() {
    for (const [k, f] of feeds) {
      if (!k.startsWith('home:') || (current && current.feed === f)) continue;
      feeds.delete(k);
      f.destroy();
    }
  }

  // ================================================================ Hashtag

  /** totalOf (opcional): cuántos posts dice la lista del hashtag, para descontar los retirados. */
  function tagHero(name, totalOf) {
    const el = h('section', { class: 'hero' });
    let info = null;

    const draw = () => {
      const fav = favOf(name) || (info && favOf(info.name));
      const canon = fav ? fav.name : info ? info.name : name;
      const inMix = !!(fav && S.mix.sources[canon] && S.mix.sources[canon].on);
      const notify = !!(fav && fav.notify);
      const c = colorFor(canon);
      const meta = info ? fmt(validCount(tagJunkKey(name), (totalOf && totalOf()) || info.count)) + ' posts' : 'Cargando…';

      const favBtn = h('button', {
        class: 'hbtn' + (fav ? ' fav' : ''),
        'aria-pressed': String(!!fav),
        onclick: async () => {
          if (fav) {
            removeFavorite(canon);
            toast('Dejaste de seguir #' + canon);
          } else {
            const nf = await addFavorite(name);
            if (nf) toast(savedText(name, nf));
          }
          draw();
        }
      }, icon(fav ? 'check' : 'plus', 18), fav ? 'Siguiendo' : 'Seguir');

      const mixBtn = h('button', {
        class: 'hbtn' + (inMix ? ' mix' : ''),
        'aria-pressed': String(inMix),
        onclick: async () => {
          if (!fav) {
            if (await addFavorite(name)) toast('Ahora sigues #' + canon + ' y entra en tu Aleatorio');
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

      // JoyReactor ordena los hashtags como carpetas: fandoms › anime › Touhou Project › Cirno.
      // Arriba van las categorías que lo contienen y abajo las que tiene dentro.
      const path = info ? (info.path && info.path.length ? info.path : info.parent ? [info.parent] : []) : [];
      const subs = info ? info.subTags : [];
      const tagLink = (t, cls) => h('a', { class: 'tag' + (cls ? ' ' + cls : '') + (favOf(t) ? ' fav' : ''), href: '#/tag/' + enc(t), text: t });
      const treeLink = info ? h('a', { class: 'tree-link', href: '#/tree/' + enc(canon) }, icon('chevright', 14), 'Ver en el árbol') : null;
      const pathRow = path.length
        ? h('div', { class: 'tree' },
            h('span', { class: 'section-label', text: 'Está dentro de' }),
            h('div', { class: 'crumbs' }, path.map((t, i) => [i ? h('span', { class: 'sep', 'aria-hidden': 'true', text: '›' }) : null, tagLink(t)]))
          )
        : null;
      const subsRow = subs.length
        ? h('div', { class: 'tree' },
            h('span', { class: 'section-label', text: 'Subcategorías' }),
            h('div', { class: 'related' }, subs.map((t) => tagLink(t)))
          )
        : null;

      const blocked = isBlocked(name) || isBlocked(canon);
      const blockBtn = h('button', {
        class: 'ib blockb' + (blocked ? ' on' : ''),
        'aria-pressed': String(blocked),
        'aria-label': (blocked ? 'Desbloquear #' : 'Bloquear #') + canon,
        title: (blocked ? 'Desbloquear #' : 'Bloquear #') + canon,
        onclick: () => {
          if (blocked) {
            setBlocked(name, false);
            if (canon !== name) setBlocked(canon, false);
            toast('#' + canon + ' desbloqueado');
          } else {
            setBlocked(canon, true);
            toast('#' + canon + ' bloqueado: sus posts ya no salen en ningún lado', 'Deshacer', () => {
              setBlocked(canon, false);
              route();
            });
          }
          route();
        }
      }, icon('ban', 22));
      fill(el,
        h('div', { class: 'hero-row' },
          tagPic(canon, 'hero-tile', '#', info ? info.pic || 0 : undefined),
          h('div', { class: 'grow' }, h('h2', { text: canon }), h('span', { class: 'meta', text: blocked ? 'Bloqueado · sus posts no salen en ningún feed' : meta })),
          blockBtn
        ),
        h('div', { class: 'hero-actions' }, favBtn, mixBtn, bellBtn),
        pathRow,
        subsRow,
        treeLink
      );
    };

    // El feed la vuelve a dibujar cuando encuentra posts retirados (cambia el número de posts).
    el._redraw = () => info !== null && draw();
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
    if (isBlocked(name)) {
      mount([
        h('header', { class: 'top' }, backBtn('/home'), h('h1', { text: '#' + name })),
        tagHero(name),
        emptyBox('ban', 'Bloqueaste #' + name, 'Sus posts no salen en ningún feed ni en los avisos.',
          h('button', {
            class: 'btn',
            onclick: () => {
              setBlocked(name, false);
              toast('#' + name + ' desbloqueado');
              route();
            }
          }, 'Desbloquear #' + name))
      ]);
      return;
    }
    // Un hashtag abre siempre con todos sus posts, lo más reciente primero. «Barajar» los pone en
    // orden aleatorio y los botones GIF y video de arriba son filtros que hay que tocar a propósito.
    const type = 'ALL';
    const random = q.get('order') === 'random';
    const order = random ? 'random' : 'recent';
    const media = q.get('media') || 'all';
    const showGif = media.includes('g') && media !== 'all';
    const showVideo = media.includes('v');
    const kinds = [showGif && 'gif', showVideo && 'video'].filter(Boolean);
    const key = 'tag:' + name.toLowerCase() + ':' + type + ':' + order + ':' + (kinds.join('+') || 'all');
    const url = (o) => {
      const g = o.gif === undefined ? showGif : o.gif;
      const v = o.video === undefined ? showVideo : o.video;
      const rnd = o.random === undefined ? random : o.random;
      return '#/tag/' + enc(name) + '?order=' + (rnd ? 'random' : 'recent') + '&media=' + ((g ? 'g' : '') + (v ? 'v' : '') || 'all');
    };
    const what = showGif && showVideo ? 'GIF y videos' : showGif ? 'Solo GIF' : showVideo ? 'Solo videos' : 'Todos los posts';
    const emptyWhat = showGif && showVideo ? 'GIF ni videos' : showGif ? 'GIF' : 'videos';
    const note = what + ' de #' + name + (random ? ', en orden aleatorio.' : ', lo más reciente primero.');
    const gifLabel = showGif ? 'Quitar el filtro GIF' : 'Mostrar solo GIF';
    const videoLabel = showVideo ? 'Quitar el filtro de videos' : 'Mostrar solo videos';
    const f = cached(key, () =>
      new Feed({
        key,
        kind: random ? 'random' : 'pager',
        tag: name,
        type,
        kinds,
        back: true,
        head: (f) => [
          backBtn('/home'),
          h('h1', { text: '#' + name }),
          h('button', { class: 'ib gifbtn' + (showGif ? ' active' : ''), 'aria-pressed': String(showGif), 'aria-label': gifLabel, title: gifLabel, onclick: () => navReplace(url({ gif: !showGif })) }, 'GIF'),
          h('button', { class: 'ib gifbtn' + (showVideo ? ' active' : ''), 'aria-pressed': String(showVideo), 'aria-label': videoLabel, title: videoLabel, onclick: () => navReplace(url({ video: !showVideo })) }, icon('film', 20)),
          viewToggleCompact(f)
        ],
        extra: (f) => {
          // «Todo» (lo más reciente primero) o «Barajar». Con «Barajar» puesto, tocarlo otra vez vuelve a mezclar.
          const chips = h('nav', { class: 'chips', 'aria-label': 'Orden' },
            h('button', { class: 'chip' + (random ? '' : ' on'), 'aria-pressed': String(!random), onclick: () => random && navReplace(url({ random: false })) }, 'Todo'),
            h('button', {
              class: 'chip' + (random ? ' on' : ''),
              'aria-pressed': String(random),
              onclick: () => {
                if (!random) return navReplace(url({ random: true }));
                toast('Barajado otra vez');
                f.reset();
              }
            }, icon('shuffle', 16), 'Barajar')
          );
          // Bloquear #gif (o #video…) esconde casi todos los GIF y videos: se avisa arriba.
          const fmtBlocked = kinds.length ? S.mix.exclude.filter(RS.isFormatTag) : [];
          const warn = fmtBlocked.length
            ? h('section', { class: 'notice', style: { margin: '12px 16px 0' } },
                h('strong', { text: 'Tienes bloqueado #' + fmtBlocked.join(', #') }),
                h('span', { text: 'Por eso faltan GIF o videos aquí: casi todos llevan esa etiqueta.' }),
                h('div', { class: 'row-btns' },
                  h('button', {
                    class: 'btn blue',
                    onclick: () => {
                      fmtBlocked.forEach((t) => setBlocked(t, false));
                      const stale = feeds.get(key);
                      feeds.delete(key);
                      if (stale) stale.destroy();
                      toast('Desbloqueado: #' + fmtBlocked.join(', #'));
                      route();
                    }
                  }, 'Desbloquear')
                )
              )
            : null;
          f.hero = tagHero(name, () => f.total);
          return [
            f.hero,
            warn,
            note ? h('p', { class: 'countline', style: { padding: '12px 16px 0' }, text: note }) : null,
            chips
          ];
        },
        empty: kinds.length
          ? () => {
              // Si bloqueaste #gif (o parecido), todos los GIF desaparecen: se explica y se ofrece desbloquear.
              const fmtBlocked = S.mix.exclude.filter(RS.isFormatTag);
              if (fmtBlocked.length)
                return emptyBox('ban', 'No se ven porque bloqueaste #' + fmtBlocked.join(', #'), 'Los GIF y los videos de JoyReactor llevan esas etiquetas.',
                  h('button', {
                    class: 'btn',
                    onclick: () => {
                      fmtBlocked.forEach((t) => setBlocked(t, false));
                      const stale = feeds.get(key);
                      feeds.delete(key);
                      if (stale) stale.destroy();
                      toast('Desbloqueado: #' + fmtBlocked.join(', #'));
                      route();
                    }
                  }, 'Desbloquear'));
              // Este hashtag no tiene GIF ni videos: en vez de una pantalla vacía, se muestran todos sus posts.
              setTimeout(() => {
                if (current && feeds.get(key) === current.feed) navReplace(url({ gif: false, video: false }));
              }, 0);
              toast('#' + name + ' no tiene ' + emptyWhat + ': te muestro todos sus posts');
              return emptyBox('play', 'No hay ' + emptyWhat, '#' + name + ' no tiene ' + emptyWhat + '.');
            }
          : null
      })
    );
    showFeed(f);
  }

  // ================================================================ Usuario

  /** totalOf (opcional): cuántos posts dice la lista del usuario, para descontar los retirados. */
  function userHero(name, totalOf) {
    const el = h('section', { class: 'hero' });
    let info;
    const draw = () => {
      const u = info;
      const shown = u ? u.name : name;
      const a = u && u.author;
      const r = RS.reputation(a);
      const part = (label, val, text) =>
        h('div', { class: 'rep-part' },
          h('span', { class: 'rp-l', text: label }),
          h('span', { class: 'rp-bar' }, h('i', { style: { width: Math.round(((val - 1) / 4) * 100) + '%' } })),
          h('span', { class: 'rp-v', text: decimal(Math.round(val * 10) / 10) }),
          h('span', { class: 'rp-t', text })
        );
      const on = isFollowed(shown);
      const followBtn = h('button', {
        class: 'follow-btn' + (on ? ' on' : ''),
        'aria-pressed': String(on),
        onclick: () => {
          setFollow(shown, u ? u.id : 0, !on);
          toast(on ? 'Dejaste de seguir a ' + shown : 'Ahora sigues a ' + shown + ': está en Seguidos › Usuarios');
          draw();
        }
      }, icon(on ? 'usercheck' : 'userplus', 19), on ? 'Siguiendo' : 'Seguir');
      const fol = S.following[userKey(shown)];
      const notify = !!(fol && fol.notify);
      const bellBtn = h('button', {
        class: 'hbtn' + (notify ? ' bell' : ''),
        'aria-pressed': String(notify),
        onclick: () => {
          setFollowNotify(shown, u ? u.id : 0, !notify);
          draw();
        }
      }, icon(notify ? 'bell' : 'belloff', 18), notify ? 'Avisando' : 'Avisarme');
      // JoyReactor cuenta también posts que ya no se pueden ver: se usa el número de su lista y se descuentan los retirados.
      const total = u ? validCount(userJunkKey(name), (totalOf && totalOf()) || u.posts) : 0;
      fill(el,
        h('div', { class: 'hero-row' },
          userPic(name, u && u.id, 'hero-tile'),
          h('div', { class: 'grow' },
            h('h2', { text: shown }),
            h('span', { class: 'meta', text: u ? fmt(total) + ' posts · rating ' + Number(u.rating).toLocaleString('es', { maximumFractionDigits: 0 }) : 'Cargando…' })
          )
        ),
        h('div', { class: 'hero-actions two' }, followBtn, bellBtn),
        // La reputación queda plegada: se abre al tocarla.
        r
          ? h('div', { class: 'rep-card' + (S.ui.repOpen ? '' : ' closed') },
              h('button', {
                type: 'button',
                class: 'rep-top',
                'aria-expanded': String(!!S.ui.repOpen),
                onclick: () => {
                  S.ui.repOpen = !S.ui.repOpen;
                  draw();
                }
              }, starRow(r.stars), h('b', { text: decimal(r.stars) }), h('span', { class: 'grow', text: 'de reputación' }), icon('chevdown', 18, 'rep-chev')),
              S.ui.repOpen
                ? [
                    part('Calidad', r.quality, Math.round((a.good / a.posts) * 100) + ' % de sus posts llegó a «Bueno»'),
                    part('Trayectoria', r.career, fmt(a.good) + ' en «Bueno» y ' + fmt(a.best) + ' en «Top» en toda su historia'),
                    part('Actividad', r.activity, fmt(Math.round(a.week)) + ' de rating esta semana'),
                    h('p', { class: 'rep-note', text: 'Calidad 40 % · Trayectoria 45 % · Actividad 15 %' })
                  ]
                : null
            )
          : null
      );
    };
    // Se vuelve a dibujar cada vez que entras (pudiste dejar de seguirlo desde Seguidos).
    el._redraw = () => {
      if (info !== null) draw();
    };
    draw();
    RS.fetchUserInfo(name)
      .then((u) => {
        info = u;
        if (u) {
          noteUserInfo(u);
          draw();
        } else {
          forgetUserVisit(name);
          fill(el, emptyBox('user', 'Ese usuario no existe', 'Revisa cómo está escrito.'));
        }
      })
      .catch(() => {});
    return el;
  }

  // Pestañas del perfil, como en Instagram: todos sus posts, solo videos y GIF, y tus favoritos de él.
  function profileTabs(f) {
    const tab = (show, ic, label) =>
      h('button', { class: 'ptab' + (f.show === show ? ' on' : ''), role: 'tab', 'aria-selected': String(f.show === show), onclick: () => f.setShow(show) }, icon(ic, 20), label);
    return h('div', { class: 'ptabs', role: 'tablist', 'aria-label': 'Qué posts ver' }, tab('all', 'grid', 'Todos'), tab('anim', 'film', 'Videos y GIF'), tab('fav', 'heart', 'Favoritos'));
  }

  /** Tus me gusta de un usuario, del más reciente al más viejo. */
  function likedFrom(name) {
    const k = userKey(name);
    return Object.values(S.likes)
      .filter((x) => x.post && userKey(x.post.user || '') === k)
      .sort((a, b) => b.at - a.at);
  }

  function routeUser(name) {
    if (!lastNavWasBack) addUserVisit(name);
    const key = 'user:' + name.toLowerCase();
    const f = cached(key, () => {
      const hero = userHero(name, () => feed.total);
      const feed = new Feed({
        key,
        kind: 'pager',
        user: name,
        mode: 'grid',
        back: true,
        head: () => [backBtn('/home'), h('h1', { text: '@' + name })],
        extra: () => {
          hero._redraw();
          return [hero];
        },
        sub: profileTabs,
        empty: (f) =>
          f.show === 'anim'
            ? emptyBox('film', 'Sin videos ni GIF', name + ' no publicó videos ni GIF.')
            : f.show === 'fav'
              ? emptyBox('heart', 'Todavía no hay favoritos', 'Aquí salen los posts de ' + name + ' que te gustaron. JoyReactor no deja ver los favoritos de otras personas.')
              : emptyBox('user', 'Sin posts', name + ' todavía no publicó nada.')
      });
      feed.hero = hero;
      return feed;
    });
    showFeed(f);
  }

  // ---- Usuarios que sigues y perfiles que visitaste (los últimos 50).
  const userKey = (n) => String(n).toLowerCase();
  const isFollowed = (n) => !!S.following[userKey(n)];
  function setFollow(name, userId, on) {
    const k = userKey(name);
    if (on) S.following[k] = S.following[k] || { name, userId: userId || 0, addedAt: Date.now(), notify: false };
    else delete S.following[k];
    persist('following', 0);
    invalidateHome();
  }
  // Campanita de un usuario: aviso cuando publique (seguirlo es requisito).
  function setFollowNotify(name, userId, on) {
    if (on && !isFollowed(name)) setFollow(name, userId, true);
    const f = S.following[userKey(name)];
    if (!f) return;
    f.notify = on;
    persist('following', 0);
    if (on) {
      toast(
        S.settings.notify ? 'Te avisaré cuando ' + f.name + ' publique algo' : 'Avisos desactivados en Ajustes',
        S.settings.notify ? null : 'Ajustes',
        () => nav('#/settings')
      );
    }
  }
  // Lo que vigilan los avisos: hashtags y usuarios con campanita.
  const watchList = () =>
    favList()
      .filter((f) => f.notify)
      .map((f) => RS.label(f.name, f.kind))
      .concat(Object.values(S.following).filter((f) => f.notify).map((f) => '@' + f.name));

  const USER_HISTORY_MAX = 50;
  function addUserVisit(name) {
    const k = userKey(name);
    const old = S.userHistory.find((x) => userKey(x.name) === k);
    S.userHistory = [{ name: old ? old.name : name, userId: old ? old.userId : 0, at: Date.now() }]
      .concat(S.userHistory.filter((x) => userKey(x.name) !== k))
      .slice(0, USER_HISTORY_MAX);
    persist('userHistory', 1500);
  }
  function forgetUserVisit(name) {
    const k = userKey(name);
    S.userHistory = S.userHistory.filter((x) => userKey(x.name) !== k);
    persist('userHistory', 1500);
  }
  // Cuando llegan sus datos se guarda el nombre bien escrito y el número de su avatar.
  function noteUserInfo(u) {
    const k = userKey(u.name);
    const x = S.userHistory.find((y) => userKey(y.name) === k);
    if (x && (x.userId !== u.id || x.name !== u.name)) {
      x.userId = u.id;
      x.name = u.name;
      persist('userHistory', 1500);
    }
    const f = S.following[k];
    if (f && (f.userId !== u.id || f.name !== u.name)) {
      f.userId = u.id;
      f.name = u.name;
      persist('following');
    }
  }

  function userPic(name, userId, cls) {
    const c = colorFor(name);
    const pic = h('span', { class: cls || 'htile', style: { background: c[1], color: '#0f0e0d' } }, String(name).charAt(0).toUpperCase());
    if (userId) {
      const img = new Image();
      img.alt = '';
      img.onload = () => fill(pic, img);
      img.src = RS.avatarUrl({ userId });
    }
    return pic;
  }

  // Botón «Seguir» / «Siguiendo» de las listas de usuarios.
  function followPill(name, userId, onChange) {
    const b = h('button', { class: 'small-btn follow' });
    const paint = () => {
      const on = isFollowed(name);
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', String(on));
      b.setAttribute('aria-label', (on ? 'Dejar de seguir a ' : 'Seguir a ') + name);
      fill(b, on ? 'Siguiendo' : 'Seguir');
    };
    b.addEventListener('click', (e) => {
      e.preventDefault();
      const on = !isFollowed(name);
      setFollow(name, userId, on);
      paint();
      if (onChange) onChange(on);
    });
    paint();
    return b;
  }

  // Fila de una persona: avatar, nombre, estrellas y un texto; a la derecha, los botones que se pasen.
  function personRow(name, userId, meta, onOpen, ...btns) {
    return h('div', { class: 'result' },
      h('a', { href: '#/user/' + enc(name), onclick: onOpen || null },
        userPic(name, userId),
        h('span', { class: 'rtext' }, h('span', { class: 'n', text: '@' + name }), h('span', { class: 'm user-line' }, repChip({ user: name }), h('span', { class: 'ellipsis', text: meta })))
      ),
      btns
    );
  }

  // ================================================================ Buscar

  function searchBox(placeholder, autofocus, onFav, withUsers, opts) {
    opts = opts || {};
    const input = h('input', { type: 'search', placeholder, 'aria-label': placeholder, autocomplete: 'off', enterkeyhint: 'search' });
    const results = h('div', { class: 'results' });
    let timer = null;
    let seq = 0;
    input.addEventListener('input', () => {
      clearTimeout(timer);
      const q = input.value.trim().replace(/^#/, '');
      if (q.length < 2) {
        fill(results, opts.idle ? opts.idle() : null);
        return;
      }
      timer = setTimeout(async () => {
        const my = ++seq;
        try {
          const qUser = q.replace(/^@/, '');
          const [list, user] = await Promise.all([
            q.startsWith('@') || opts.usersOnly ? Promise.resolve([]) : RS.autocomplete(q),
            withUsers ? RS.fetchUserInfo(qUser).catch(() => null) : Promise.resolve(null)
          ]);
          if (my !== seq) return;
          const rows = [];
          if (user) rows.push(userRow(user, opts.onPick, opts.onFollow));
          rows.push(...list.slice(0, 15).map((t) => resultRow(t, onFav, opts.onPick)));
          fill(results, ...(rows.length ? rows : [h('div', { class: 'status', text: 'Sin resultados para «' + q + '»' })]));
        } catch (e) {
          fill(results, h('div', { class: 'status', text: errText(e) }));
        }
      }, 250);
    });
    input.addEventListener('keydown', (e) => {
      const q = input.value.trim().replace(/^#/, '');
      if (e.key !== 'Enter' || !q) return;
      if (opts.usersOnly) return nav('#/user/' + enc(q.replace(/^@/, '')));
      if (opts.onPick) opts.onPick({ type: 'tag', name: q });
      nav('#/tag/' + enc(q));
    });
    if (autofocus) setTimeout(() => input.focus(), 60);
    if (opts.idle) fill(results, opts.idle());
    return { el: h('div', { class: 'search' }, h('label', {}, icon('search', 20), input)), results, input };
  }

  function userRow(u, onPick, onFollow) {
    return personRow(u.name, u.id, 'Usuario · ' + fmt(validCount(userJunkKey(u.name), u.posts)) + ' posts', () => onPick && onPick({ type: 'user', name: u.name, pic: u.id }), followPill(u.name, u.id, onFollow));
  }

  function resultRow(t, onFav, onPick) {
    const star = h('button', { class: 'ib followb' });
    const paint = () => {
      const on = !!favOf(t.name);
      star.classList.toggle('on', on);
      star.setAttribute('aria-pressed', String(on));
      star.setAttribute('aria-label', on ? 'Dejar de seguir #' + t.name : 'Seguir #' + t.name);
      fill(star, icon(on ? 'check' : 'plus', 22));
    };
    star.addEventListener('click', async () => {
      const f = favOf(t.name);
      if (f) {
        removeFavorite(f.name);
        toast('Dejaste de seguir #' + f.name);
      } else {
        const nf = await addFavorite(t.name);
        if (nf) toast(savedText(t.name, nf));
      }
      paint();
      if (onFav) onFav();
    });
    paint();
    return h('div', { class: 'result' },
      h('a', { href: '#/tag/' + enc(t.name), onclick: () => onPick && onPick({ type: 'tag', name: t.name, pic: t.image ? RS.numId(t.id) : 0 }) },
        tagPic(t.name, 'htile', '#', t.image ? RS.numId(t.id) : 0),
        h('span', { class: 'rtext' },
          h('span', { class: 'n' }, t.name, t.nsfw ? h('span', { class: 'nsfw', text: 'NSFW' }) : null),
          h('span', { class: 'm', text: fmt(validCount(tagJunkKey(t.name), t.count)) + ' posts' })
        )
      ),
      star
    );
  }

  function recordSearch(entry) {
    S.searches = [Object.assign({}, entry, { at: Date.now() })]
      .concat((S.searches || []).filter((x) => !(x.type === entry.type && x.name.toLowerCase() === entry.name.toLowerCase())))
      .slice(0, 30);
    persist('searches');
    stats().searches++;
    saveStats();
  }

  // Búsquedas recientes, como en Instagram: tocar abre, la ✕ quita una, «Borrar todo» las limpia.
  function recentSearches(redraw) {
    const list = S.searches || [];
    if (!list.length) return h('p', { class: 'foot-note', text: 'Aquí verás lo que buscaste. Escribe un hashtag, una categoría o el nombre de un usuario.' });
    const rows = list.map((x) => {
      const href = x.type === 'user' ? '#/user/' + enc(x.name) : '#/tag/' + enc(x.name);
      const pic = x.type === 'user' ? userPic(x.name, x.pic) : tagPic(x.name, 'htile', '#', x.pic === undefined ? undefined : x.pic);
      return h('div', { class: 'result' },
        h('a', { href, onclick: () => recordSearch(x) },
          pic,
          h('span', { class: 'rtext' },
            h('span', { class: 'n', text: (x.type === 'user' ? '@' : '#') + x.name }),
            h('span', { class: 'm', text: (x.type === 'user' ? 'Usuario' : 'Hashtag') + ' · ' + ago(x.at) })
          )
        ),
        h('button', {
          class: 'ib',
          'aria-label': 'Quitar ' + x.name + ' de las recientes',
          onclick: () => {
            S.searches = list.filter((y) => y !== x);
            persist('searches');
            redraw();
          }
        }, icon('x', 20))
      );
    });
    return h('div', {},
      h('div', { class: 'secline' },
        h('h2', { class: 'grow section-label', text: 'Recientes' }),
        h('button', {
          class: 'link-btn',
          onclick: () => {
            S.searches = [];
            persist('searches');
            redraw();
          }
        }, 'Borrar todo')
      ),
      rows
    );
  }

  function routeSearch() {
    let sb = null;
    const idle = () => recentSearches(() => fill(sb.results, idle()));
    sb = searchBox('Buscar hashtag o @usuario', true, null, true, { onPick: recordSearch, idle });
    mount([
      h('header', { class: 'top' }, h('h1', { text: 'Buscar' })),
      sb.el,
      sb.results
    ]);
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
        h('div', { class: 'row-btns' }, h('a', { class: 'btn blue', href: Object.keys(S.favorites).length ? '#/mix' : '#/following' }, icon('sliders', 18), 'Personalizar'))
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

      fill(body,
        h('section', { style: { padding: '16px 16px 14px', display: 'flex', flexDirection: 'column', gap: '10px', borderBottom: '1px solid var(--line)' } },
          h('p', { style: { fontSize: '14px', lineHeight: '1.45', color: '#c9c1b7' }, text: 'Elige qué entra en tu Aleatorio y cuánto pesa cada cosa. Así queda el reparto:' }),
          barEl,
          summaryEl
        ),
        favs.length
          ? null
          : emptyBox('hash', 'Todavía no sigues ningún hashtag', 'Sigue categorías y hashtags y aparecerán aquí para mezclarlos.', h('a', { class: 'btn', href: '#/following' }, 'Ir a Seguidos')),
        cats.length ? h('h2', { class: 'sec section-label', text: 'Categorías que sigues' }) : null,
        cats.map(row),
        tags.length ? h('h2', { class: 'sec section-label', text: 'Hashtags que sigues' }) : null,
        tags.map(row),
        favs.length
          ? h('div', { style: { padding: '12px 16px 4px' } }, h('a', { class: 'btn ghost full', href: '#/following' }, icon('plus', 18), 'Seguir otro hashtag o categoría'))
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
        blockedField()
      );
      live();
    };

    draw();
    mount([head, body]);
  }

  // ================================================================ Seguidos: hashtags y categorías / usuarios

  // Pestañas de arriba de una sección (Seguidos, Favoritos): cambian de página sin sumar pasos a «atrás».
  function pageTabs(label, active, tabs) {
    return h('nav', { class: 'tabs2', 'aria-label': label },
      tabs.map((t) =>
        h('a', {
          class: active === t.id ? 'on' : '',
          href: t.href,
          'aria-current': active === t.id ? 'page' : null,
          onclick: (e) => {
            e.preventDefault();
            if (active !== t.id) navReplace(t.href);
          }
        }, icon(t.ic, 18), t.label, t.n == null ? null : h('span', { class: 'tcount', text: String(t.n) }))
      )
    );
  }

  function followTabs(active) {
    return pageTabs('Qué sigues', active, [
      { id: 'tags', href: '#/following', ic: 'hash', label: 'Hashtags', n: Object.keys(S.favorites).length },
      { id: 'users', href: '#/following?tab=users', ic: 'user', label: 'Usuarios', n: Object.keys(S.following).length }
    ]);
  }

  function routeFollowing(q) {
    if (q.get('tab') === 'users') return routeFollowingUsers();
    const lists = h('div');
    const tabsEl = h('div');
    const sb = searchBox('Buscar hashtag o categoría para seguir', false, () => drawLists());

    function drawLists() {
      fill(tabsEl, followTabs('tags'));
      const favs = favList();
      const srcs = RS.mixSources(S);
      const total = srcs.reduce((a, s) => a + s.w, 0) || 1;
      const mixText = (name) => {
        const s = srcs.find((x) => x.name === name);
        return s ? 'mezcla ' + Math.round((s.w / total) * 100) + '%' : 'sin mezcla';
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
      const unfollowBtn = (f) =>
        h('button', {
          class: 'ib followb on',
          'aria-pressed': 'true',
          'aria-label': 'Dejar de seguir ' + RS.label(f.name, f.kind),
          onclick: () => {
            removeFavorite(f.name);
            drawLists();
            toast('Dejaste de seguir ' + RS.label(f.name, f.kind), 'Deshacer', () => {
              S.favorites[f.name] = f;
              refreshFavIndex();
              S.mix.sources[f.name] = S.mix.sources[f.name] || { on: true, w: 5 };
              persist('favorites');
              persist('mix');
              invalidateRandom();
              drawLists();
            });
          }
        }, icon('check', 21));
      const row = (f) => {
        const inMix = !!(S.mix.sources[f.name] && S.mix.sources[f.name].on);
        return h('div', { class: 'result' },
          h('a', { href: '#/tag/' + enc(f.name) },
            tagPic(f.name, 'htile', f.kind === 'category' ? f.name.charAt(0).toUpperCase() : '#'),
            h('span', { class: 'rtext' },
              h('span', { class: 'n', text: f.name }),
              h('span', { class: 'm', text: (f.kind === 'category' ? 'Categoría · ' : 'Hashtag · ') + mixText(f.name), style: inMix ? { color: 'var(--blue)' } : null })
            )
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
          unfollowBtn(f)
        );
      };

      fill(lists,
        favs.length
          ? h('p', { class: 'countline', style: { paddingTop: '10px' }, text: favs.length === 1 ? 'Sigues 1 hashtag.' : 'Sigues ' + favs.length + ' hashtags y categorías.' })
          : emptyBox('hash', 'Todavía no sigues ningún hashtag', 'Búscalo arriba y toca +, entra a un hashtag y toca Seguir, o mantén presionado un hashtag 3 segundos.'),
        favs.map(row),
        h('p', { class: 'foot-note', text: 'Las categorías son hashtags que tienen otros dentro, como carpetas (#anime tiene dentro #Touhou Project). Se siguen igual. La campanita avisa de posts nuevos y el icono de mezcla decide si entra en tu Aleatorio.' })
      );
    }

    drawLists();
    mount([h('header', { class: 'top' }, h('h1', { text: 'Seguidos' })), tabsEl, sb.el, sb.results, lists]);
  }

  function routeFollowingUsers() {
    const listEl = h('div');
    const tabsEl = h('div');
    const draw = () => {
      fill(tabsEl, followTabs('users'));
      const list = Object.values(S.following).sort((a, b) => (b.addedAt || 0) - (a.addedAt || 0));
      fill(listEl,
        list.length
          ? h('p', { class: 'countline', style: { paddingTop: '10px' }, text: list.length === 1 ? 'Sigues a 1 usuario.' : 'Sigues a ' + list.length + ' usuarios.' })
          : emptyBox('users', 'Todavía no sigues a nadie', 'Toca el nombre de quien publicó un post para ver su perfil y después toca Seguir.'),
        list.map((x) =>
          personRow(x.name, x.userId, 'Lo sigues desde ' + (ago(x.addedAt) || 'antes'), null,
            h('button', {
              class: 'ib bellb' + (x.notify ? ' on' : ''),
              'aria-pressed': String(!!x.notify),
              'aria-label': (x.notify ? 'Dejar de avisar cuando publique ' : 'Avisarme cuando publique ') + x.name,
              onclick: () => {
                setFollowNotify(x.name, x.userId, !x.notify);
                draw();
              }
            }, icon(x.notify ? 'bell' : 'belloff', 21)),
            followPill(x.name, x.userId, (on) => {
              if (on) return;
              draw();
              toast('Dejaste de seguir a ' + x.name, 'Deshacer', () => {
                S.following[userKey(x.name)] = x;
                persist('following', 0);
                draw();
              });
            })
          )
        )
      );
    };
    const sb = searchBox('Buscar @usuario', false, null, true, { usersOnly: true, onFollow: () => draw() });
    draw();
    mount([h('header', { class: 'top' }, h('h1', { text: 'Seguidos' })), tabsEl, sb.el, sb.results, listEl]);
  }

  // ================================================================ Favoritos: me gusta e historial

  const settingsLink = () => iconLink('gear', 'Ajustes', '#/settings');

  function favTabs(active) {
    return pageTabs('Favoritos', active, [
      { id: 'likes', href: '#/likes', ic: 'heart', label: 'Me gusta', n: Object.keys(S.likes).length },
      { id: 'history', href: '#/history', ic: 'clock', label: 'Historial' }
    ]);
  }

  // Dentro del Historial: los posts que miraste o los perfiles que visitaste.
  function historyChips(active) {
    const chip = (id, href, ic, label, n) =>
      h('button', { class: 'chip' + (active === id ? ' on' : ''), 'aria-pressed': String(active === id), onclick: () => active !== id && navReplace(href) }, icon(ic, 16), label + ' · ' + n);
    return h('nav', { class: 'chips', 'aria-label': 'Qué historial ver' },
      chip('posts', '#/history', 'image', 'Posts', (S.history || []).filter((x) => !S.likes[x.id]).length),
      chip('users', '#/visited', 'user', 'Usuarios', (S.userHistory || []).length)
    );
  }

  const likedItems = () => Object.values(S.likes).sort((a, b) => b.at - a.at).map((x) => ({ post: x.post }));
  function routeLikes() {
    const all = Object.values(S.likes).sort((a, b) => b.at - a.at);
    const items = likedItems();
    const sig = all.length + '|' + (all[0] ? all[0].at : 0);

    const f = cached('likes:' + sig, () => new Feed({
      key: 'likes',
      kind: 'static',
      source: 'likes',
      items,
      reload: likedItems,
      memoryKey: 'likes',
      anchor: feedMemory.get('likes'),
      mode: S.ui.likesMode,
      onMode: (m) => (S.ui.likesMode = m),
      head: (f) => [h('h1', { text: 'Favoritos' }), settingsLink(), viewToggle(f)],
      extra: () => [
        favTabs('likes'),
        all.length ? h('p', { class: 'countline', style: { paddingTop: '12px' }, text: all.length + (all.length === 1 ? ' post te gustó' : ' posts te gustaron') }) : null
      ],
      empty: () => emptyBox('heart', 'Todavía no tienes me gusta', 'Toca el corazón en cualquier post.')
    }));
    showFeed(f);
  }

  // ================================================================ Resumen de la semana
  //
  // Mientras miras un post se cuenta el tiempo (ver focusPost y blurPost) y se suma a su autor y a sus
  // hashtags. Al terminar la semana (lunes a domingo) se calcula una sola vez el resumen: los 10 usuarios
  // y los 10 hashtags que más tiempo miraste.

  function weekStart(t) {
    const d = new Date(t);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
    return d.getTime();
  }

  const TIME_MIN = 1500; // pasar de largo no cuenta
  const TIME_MAX = 10 * 60000; // si el teléfono quedó quieto en un post, cuenta como mucho 10 min
  function weekTime() {
    const st = stats();
    const key = String(weekStart(Date.now()));
    if (st.time.key !== key) {
      // Terminó la semana: se guarda para calcular el resumen una sola vez (ver finishWeek).
      if (st.time.key && Object.keys(st.time.users).length + Object.keys(st.time.tags).length) {
        S.weekly.pending = st.time;
        persist('weekly', 0);
      }
      st.time = { key, users: {}, tags: {}, ids: {} };
      saveStats();
      finishWeek();
    }
    return st.time;
  }
  function creditTime(p, ms) {
    if (!p || !(ms >= TIME_MIN)) return;
    const t = weekTime();
    ms = Math.min(ms, TIME_MAX);
    if (p.user) {
      t.users[p.user] = (t.users[p.user] || 0) + ms;
      if (p.userId) t.ids[p.user] = p.userId;
    }
    for (const x of leafTags(p.tags)) t.tags[x.name] = (t.tags[x.name] || 0) + ms;
    pruneCounts(t.tags, 800);
    pruneCounts(t.users, 400);
    saveStats();
  }

  // Los 10 usuarios y hashtags con más tiempo. Un hashtag se descarta si casi todo su tiempo viene de
  // otro que tiene dentro (fandoms ← anime ← Touhou Project): así quedan los específicos.
  async function summarize(t, lenient) {
    const top = (obj, n) => Object.entries(obj || {}).sort((a, b) => b[1] - a[1]).slice(0, n);
    const users = top(t.users, 10).map(([name, ms]) => ({ name, userId: (t.ids || {})[name] || 0, ms }));
    const cand = top(t.tags, 30);
    let paths = {};
    try {
      paths = await RS.fetchTagPaths(cand.map(([n]) => n));
    } catch (e) {
      if (!lenient) throw e; // sin conexión: el resumen final se calcula más tarde
    }
    const low = (x) => String(x).toLowerCase();
    const isAbove = (a, b) => (paths[b] || []).some((x) => low(x) === low(a)); // ¿a contiene a b?
    const tags = cand
      .filter(([name, ms]) => !cand.some(([other, ms2]) => other !== name && isAbove(name, other) && ms2 >= ms * 0.6))
      .slice(0, 10)
      .map(([name, ms]) => ({ name, ms }));
    return { users, tags };
  }
  let finishing = null;
  function finishWeek() {
    if (finishing || !S.weekly.pending) return finishing;
    const t = S.weekly.pending;
    finishing = summarize(t, false)
      .then((sum) => {
        const w = S.weekly;
        w.prev = w.week ? { users: w.users.map((u) => u.name), tags: w.tags.map((x) => x.name) } : null;
        Object.assign(w, { week: t.key, at: Date.now(), users: sum.users, tags: sum.tags, pending: null });
        persist('weekly', 0);
      })
      .catch(() => {})
      .finally(() => (finishing = null));
    return finishing;
  }

  function moveOf(prev, name, i) {
    if (!prev) return null;
    const j = prev.indexOf(name);
    if (j < 0) return h('span', { class: 'mv new', text: 'Nuevo' });
    if (j === i) return h('span', { class: 'mv same', text: '=' });
    return h('span', { class: 'mv ' + (j > i ? 'up' : 'down'), text: (j > i ? '▲ ' : '▼ ') + Math.abs(j - i) });
  }
  function rankUsers(list, prev) {
    return h('ol', { class: 'tops-list' },
      list.map((u, i) =>
        h('li', null,
          h('a', { href: '#/user/' + enc(u.name) },
            h('span', { class: 'tl-rank', text: String(i + 1) }),
            avatar({ user: u.name, userId: u.userId }),
            h('span', { class: 'tl-main' },
              h('span', { class: 'tl-name' }, h('span', { class: 'ellipsis', text: u.name }), repChip({ user: u.name })),
              h('span', { class: 'tl-sub' }, icon('clock', 13), fmtDur(u.ms))
            ),
            moveOf(prev, u.name, i)
          )
        )
      )
    );
  }
  function rankTags(list, prev) {
    return h('ol', { class: 'tops-list' },
      list.map((x, i) =>
        h('li', null,
          h('a', { href: '#/tag/' + enc(x.name) },
            h('span', { class: 'tl-rank', text: String(i + 1) }),
            tagPic(x.name, 'avatar', '#'),
            h('span', { class: 'tl-main' },
              h('span', { class: 'tl-name' }, h('span', { class: 'ellipsis', text: '#' + x.name })),
              h('span', { class: 'tl-sub' }, icon('clock', 13), fmtDur(x.ms))
            ),
            moveOf(prev, x.name, i)
          )
        )
      )
    );
  }

  function routeWeek() {
    weekTime();
    finishWeek();
    const w = S.weekly;
    const day = (t) => new Date(t).toLocaleDateString('es', { day: 'numeric', month: 'long' });
    const nextMonday = weekStart(Date.now()) + 7 * 86400000;
    const label = (text) => h('h2', { class: 'sec section-label', style: { padding: '18px 16px 4px' }, text });
    const live = h('div', {}, h('div', { class: 'status' }, icon('spinner', 20, 'spin'), 'Calculando…'));
    const final = w.week
      ? [
          h('p', { class: 'countline', style: { padding: '14px 16px 0' }, text: 'Semana del ' + day(Number(w.week)) + ' al ' + day(Number(w.week) + 6 * 86400000) + '. Es el tiempo que miraste los posts de cada uno; se calcula una vez, al terminar la semana.' }),
          label('Tus 10 usuarios'),
          w.users.length ? rankUsers(w.users, w.prev && w.prev.users) : h('p', { class: 'countline', text: 'Esa semana no hubo datos.' }),
          label('Tus 10 hashtags'),
          w.tags.length ? rankTags(w.tags, w.prev && w.prev.tags) : h('p', { class: 'countline', text: 'Esa semana no hubo datos.' }),
          w.prev ? h('p', { class: 'countline', text: '▲ y ▼: cuántos puestos subió o bajó respecto de la semana anterior.' }) : null
        ]
      : h('section', { class: 'notice' },
          h('strong', { text: 'Tu primer resumen estará listo el lunes ' + day(nextMonday) }),
          h('span', { text: 'Se calcula una vez, al terminar la semana, con el tiempo que miraste los posts de cada usuario y de cada hashtag. Abajo ves cómo va esta semana.' })
        );
    mount([
      h('header', { class: 'top has-back' }, backBtn('/settings'), h('h1', { text: 'Resumen de la semana' })),
      final,
      h('h2', { class: 'sec', style: { padding: '26px 16px 2px', fontSize: '17px', fontWeight: '800' }, text: 'Esta semana, hasta ahora' }),
      live
    ]);
    summarize(stats().time, true)
      .then((sum) => {
        if (!live.isConnected) return;
        fill(live,
          sum.users.length || sum.tags.length
            ? [label('Usuarios'), rankUsers(sum.users.slice(0, 5)), label('Hashtags'), rankTags(sum.tags.slice(0, 5))]
            : h('p', { class: 'countline', style: { paddingTop: '8px' }, text: 'Todavía no hay datos de esta semana. Se cuentan los posts que miras más de un segundo y medio.' })
        );
      })
      .catch(() => fill(live));
  }

  // ================================================================ Historial (vistos más de 10 s)
  // ================================================================ Historial (vistos más de 10 s)

  // Lo que ya está en Favoritos no sale en el Historial.
  const historyList = () => (S.history || []).filter((x) => !S.likes[x.id]);
  const historyItems = () => historyList().map((x) => ({ post: x.post, label: 'Visto ' + ago(x.at), icon: 'clock', color: 'var(--text-2)' }));
  function routeHistory() {
    const list = historyList();
    const max = Number(S.settings.historyMax) || 100;
    const sig = list.length + '|' + (list[0] ? list[0].at : 0);
    const items = historyItems();
    const f = cached('history:' + sig, () => new Feed({
      key: 'history',
      kind: 'static',
      source: 'history',
      items,
      reload: historyItems,
      memoryKey: 'history',
      anchor: feedMemory.get('history'),
      mode: S.ui.historyMode || 'grid',
      onMode: (m) => (S.ui.historyMode = m),
      head: (f) => [h('h1', { text: 'Favoritos' }), settingsLink(), viewToggle(f)],
      extra: () => [
        favTabs('history'),
        historyChips('posts'),
        list.length
          ? h('div', { class: 'countline', style: { display: 'flex', alignItems: 'center', gap: '8px' } },
              h('span', { class: 'grow', text: list.length + ' de ' + max + ' · los que miraste más de 10 segundos' }),
              h('button', {
                class: 'link-btn',
                onclick: () => {
                  if (!confirm('¿Borrar todo el historial?')) return;
                  S.history = [];
                  persist('history', 0);
                  routeHistory();
                }
              }, 'Borrar')
            )
          : null
      ],
      empty: () => emptyBox('clock', 'Tu historial está vacío', 'Aquí se guardan los posts que miras más de 10 segundos (hasta ' + max + '; los más viejos se van borrando).')
    }));
    showFeed(f);
  }

  function routeVisited() {
    const body = h('div');
    const chipsEl = h('div');
    const draw = () => {
      fill(chipsEl, historyChips('users'));
      const list = S.userHistory || [];
      fill(body,
        list.length
          ? h('div', { class: 'countline', style: { display: 'flex', alignItems: 'center', gap: '8px' } },
              h('span', { class: 'grow', text: list.length + ' de ' + USER_HISTORY_MAX + ' · los perfiles que visitaste' }),
              h('button', {
                class: 'link-btn',
                onclick: () => {
                  if (!confirm('¿Borrar el historial de usuarios?')) return;
                  S.userHistory = [];
                  persist('userHistory', 0);
                  draw();
                }
              }, 'Borrar')
            )
          : emptyBox('user', 'Todavía no visitaste perfiles', 'Toca el nombre de quien publicó un post para ver su perfil. Aquí se guardan los últimos ' + USER_HISTORY_MAX + '.'),
        list.map((x) =>
          personRow(x.name, x.userId, 'Visto ' + ago(x.at), null,
            followPill(x.name, x.userId),
            h('button', {
              class: 'ib',
              'aria-label': 'Quitar a ' + x.name + ' del historial',
              onclick: () => {
                S.userHistory = S.userHistory.filter((y) => y !== x);
                persist('userHistory', 0);
                draw();
              }
            }, icon('x', 20))
          )
        )
      );
    };
    draw();
    mount([h('header', { class: 'top' }, h('h1', { text: 'Favoritos' }), settingsLink()), favTabs('history'), chipsEl, body]);
  }

  function routeHidden() {
    const list = Object.values(S.dislikes).sort((a, b) => b.at - a.at);
    const excluded = new Set(S.mix.exclude.map((x) => x.toLowerCase()));
    const counts = {};
    for (const x of list.slice(0, 60)) for (const t of x.post.tags) counts[t] = (counts[t] || 0) + 1;
    const sug = Object.entries(counts)
      .filter(([t, n]) => n >= 3 && !excluded.has(t.toLowerCase()) && !RS.isFormatTag(t) && !favOf(t) && !S.dismissed.includes(t))
      .sort((a, b) => b[1] - a[1])[0];

    const sugBox = h('div');
    if (sug) {
      const [t, n] = sug;
      sugBox.append(
        h('section', { class: 'notice' },
          h('strong', { text: 'Ocultaste ' + n + ' posts con #' + t }),
          h('span', { text: '¿Lo bloqueo? Sus posts no saldrán en ningún feed. Puedes desbloquearlo en Ajustes.' }),
          h('div', { class: 'row-btns' },
            h('button', {
              class: 'btn blue',
              onclick: () => {
                setBlocked(t, true);
                fill(sugBox, h('section', { class: 'notice green' }, h('span', { text: '#' + t + ' bloqueado: ya no aparecerá en ningún feed.' })));
              }
            }, 'Bloquear #' + t),
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
      h('header', { class: 'top has-back' }, backBtn('/settings'), h('h1', { text: 'Posts ocultos' })),
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
    const watching = watchList();
    const items = (S.news.items || []).map((x) => ({ post: x.post, label: (x.kind === 'user' ? 'Nuevo de ' : 'Nuevo en ') + RS.label(x.tag, x.kind), icon: 'bell', color: 'var(--green)' }));

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

    const sig = items.length + '|' + (items[0] ? items[0].post.id : '');
    const f = cached('news:' + sig, () => new Feed({
      key: 'news',
      kind: 'static',
      items,
      memoryKey: 'news',
      anchor: feedMemory.get('news'),
      back: true,
      head: (f) => [backBtn('/home'), h('h1', { text: 'Novedades' }), checkBtn, viewToggle(f)],
      extra: () =>
        watching.length
          ? h('p', { class: 'countline', style: { paddingTop: '12px' } },
              'Vigilando ' + watching.join(', ') + '. Última revisión: ' + (S.news.lastCheck ? ago(S.news.lastCheck) : 'todavía no') + '. ',
              h('a', { href: '#/settings', text: S.settings.notify ? 'Avisos cada ' + S.settings.interval + ' min' : 'Avisos desactivados' })
            )
          : h('div', { class: 'notice' },
              h('strong', { text: 'Elige de qué quieres enterarte' }),
              h('span', { text: 'Toca la campanita en los hashtags o usuarios que sigues y te avisaré cuando salgan posts nuevos.' }),
              h('div', { class: 'row-btns' }, h('a', { class: 'btn blue', href: '#/following' }, icon('bell', 18), 'Ir a Seguidos'))
            ),
      empty: () => emptyBox('bell', 'Sin novedades por ahora', watching.length ? 'Cuando salgan posts nuevos en lo que vigilas aparecerán aquí.' : null)
    }));
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
    if (!confirm('Esto reemplaza tus me gusta, ocultos, lo que sigues, el historial y la mezcla actuales. ¿Continuar?')) return;
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
    const watching = watchList();

    const navLine = (ic, title, text, href) =>
      h('a', { class: 'line navline', href },
        h('span', { class: 'navline-ic' }, icon(ic, 20)),
        h('div', { class: 'grow' }, h('span', { class: 'sname', text: title }), h('span', { class: 'smeta', text })),
        icon('chevright', 18)
      );
    const nHidden = Object.keys(S.dislikes).length;

    mount([
      h('header', { class: 'top has-back' }, backBtn('/likes'), h('h1', { text: 'Ajustes' })),
      h('div', { class: 'setgroup' },
        h('h2', { class: 'sec section-label', style: { padding: '18px 16px 6px' }, text: 'Tu actividad' }),
        navLine('down', 'Posts ocultos', nHidden ? (nHidden === 1 ? '1 post' : fmt(nHidden) + ' posts') + ' con «no me gusta». Aquí puedes recuperarlos.' : 'Los posts con «no me gusta». Aquí puedes recuperarlos.', '#/hidden'),
        navLine('trophy', 'Resumen de la semana', 'Los 10 usuarios y hashtags que más tiempo miraste.', '#/week'),
        navLine('chart', 'Tus estadísticas', 'Cuánto y cómo usas la app (solo en este teléfono).', '#/stats')
      ),
      h('div', { class: 'setgroup' },
        h('h2', { class: 'sec section-label', style: { padding: '18px 16px 6px' }, text: 'Herramientas temporales' }),
        navLine('hash', 'Árbol de hashtags', 'Cómo se reparten las carpetas: qué hashtags hay dentro de cada uno.', '#/tree')
      ),
      h('div', { class: 'setgroup' },
        h('h2', { class: 'sec section-label', style: { padding: '18px 16px 6px' }, text: 'Avisos de posts nuevos' }),
        h('div', { class: 'line' },
          h('div', { class: 'grow' }, h('span', { class: 'sname', text: 'Avisarme con notificación' }), h('span', { class: 'smeta', text: watching.length ? 'Vigilando: ' + watching.join(', ') : 'Activa la campanita en los hashtags o usuarios que sigues para elegir qué vigilar.' })),
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
        h('h2', { class: 'sec section-label', style: { padding: '18px 16px 6px' }, text: 'Historial' }),
        h('div', { class: 'field' },
          h('span', { class: 't', text: 'Historial: guardar hasta' }),
          h('span', { class: 'd', text: 'Los posts que miras más de 10 segundos. Al llenarse se borran los más viejos.' }),
          seg([[50, '50'], [100, '100'], [200, '200'], [500, '500']], Number(st.historyMax) || 100, (v) => {
            st.historyMax = v;
            S.history = (S.history || []).slice(0, v);
            persist('history');
            save();
          })
        ),
        h('p', { class: 'smeta', style: { padding: '0 16px 16px' }, text: 'De los perfiles que visitas se guardan los últimos ' + USER_HISTORY_MAX + ' (Favoritos › Historial › Usuarios).' })
      ),
      h('div', { class: 'setgroup' },
        h('h2', { class: 'sec section-label', style: { padding: '18px 16px 6px' }, text: 'Hashtags bloqueados' }),
        blockedField(null, false)
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
        ),
        h('div', { class: 'line' },
          h('div', { class: 'grow' }, h('span', { class: 'sname', text: 'Mostrar la fecha de los posts' }), h('span', { class: 'smeta', text: 'Cuándo se publicó cada post («hace 3 h»). Viene apagado.' })),
          switchBtn(st.showDates, 'Mostrar la fecha de los posts', (on) => {
            st.showDates = on;
            save();
            applyDisplay();
          })
        ),
      ),
      h('div', { class: 'setgroup' },
        h('h2', { class: 'sec section-label', style: { padding: '18px 16px 6px' }, text: 'Pantalla completa' }),
        h('div', { class: 'line' },
          h('div', { class: 'grow' }, h('span', { class: 'sname', text: 'Adelantar arrastrando el dedo' }), h('span', { class: 'smeta', text: 'Mantén el dedo sobre un video o GIF y arrástralo: a la derecha adelanta, a la izquierda atrasa.' })),
          switchBtn(st.seekDrag, 'Adelantar arrastrando el dedo', (on) => {
            st.seekDrag = on;
            save();
          })
        ),
        h('div', { class: 'field' },
          h('span', { class: 't', text: 'Sensibilidad' }),
          h('span', { class: 'd', text: 'Cuánto avanza al cruzar la pantalla de lado a lado. En un video más corto, cruzarla recorre el video entero.' }),
          seg([[15, '15 s'], [30, '30 s'], [60, '1 min'], [120, '2 min']], Number(st.seekSpan) || 60, (v) => {
            st.seekSpan = v;
            save();
          })
        ),
        h('div', { class: 'line' },
          h('div', { class: 'grow' }, h('span', { class: 'sname', text: 'Estrellas y rating' }), h('span', { class: 'smeta', text: 'La reputación del autor (★) y el rating del post en JoyReactor (↑, la suma de los votos). Viene apagado.' })),
          switchBtn(st.showScores, 'Estrellas y rating en pantalla completa', (on) => {
            st.showScores = on;
            save();
            applyDisplay();
          })
        )
      ),
      h('div', { class: 'setgroup' },
        h('h2', { class: 'sec section-label', style: { padding: '18px 16px 6px' }, text: 'Respaldo' }),
        h('div', { class: 'field' },
          h('span', { class: 'd', style: { marginTop: '0' }, text: 'Tus me gusta, ocultos, lo que sigues, el historial y la mezcla viven solo en este teléfono. Guarda un respaldo para no perderlos o para pasarlos a otro.' }),
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

  // ================================================================ Estadísticas de uso (solo en este teléfono)

  function dayKey(t) {
    const d = new Date(t);
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function stats() {
    const st = S.stats || (S.stats = {});
    if (!st.since) st.since = Date.now();
    st.days = st.days || {};
    st.hours = st.hours || Array(24).fill(0);
    st.tags = st.tags || {};
    st.users = st.users || {};
    st.kinds = st.kinds || { image: 0, gif: 0, video: 0 };
    st.sections = st.sections || {};
    st.time = st.time || { key: '', users: {}, tags: {}, ids: {} }; // tiempo por usuario y hashtag de esta semana
    delete st.week; // vistas por hashtag de la 1.1.0, reemplazadas por st.time
    for (const k of ['sessions', 'fsOpens', 'fsMs', 'searches']) st[k] = st[k] || 0;
    return st;
  }

  function today() {
    const st = stats();
    const k = dayKey(Date.now());
    return st.days[k] || (st.days[k] = { ms: 0, posts: 0, likes: 0, dislikes: 0 });
  }

  function saveStats() {
    persist('stats', 4000);
  }

  // Deja solo los más usados cuando la lista crece mucho.
  function pruneCounts(obj, max) {
    const keys = Object.keys(obj);
    if (keys.length <= max) return;
    keys
      .sort((a, b) => obj[b] - obj[a])
      .slice(Math.floor(max * 0.7))
      .forEach((k) => delete obj[k]);
  }

  function recordView(p) {
    const st = stats();
    today().posts++;
    const section = parseHash().parts[0] || 'home';
    st.sections[section] = (st.sections[section] || 0) + 1;
    for (const x of leafTags(p.tags)) st.tags[x.name] = (st.tags[x.name] || 0) + 1;
    if (p.user) st.users[p.user] = (st.users[p.user] || 0) + 1;
    st.kinds[RS.isRealVideo(p) ? 'video' : RS.isGifPost(p) ? 'gif' : 'image']++;
    pruneCounts(st.tags, 600);
    pruneCounts(st.users, 300);
    saveStats();
  }

  // Tiempo con la app abierta y a la vista: se suma cada 15 s (por día y por hora).
  let activeFrom = null;
  let hiddenAt = 0;
  function tickTime() {
    if (activeFrom == null) return;
    const now = Date.now();
    const ms = now - activeFrom;
    activeFrom = now;
    if (ms <= 0 || ms > 60000) return; // el teléfono estuvo dormido: no cuenta
    const st = stats();
    today().ms += ms;
    st.hours[new Date(now).getHours()] += ms;
    saveStats();
  }

  function startUsageClock() {
    const st = stats();
    // Guarda solo los últimos 120 días.
    const cutoff = dayKey(Date.now() - 120 * 86400000);
    for (const k of Object.keys(st.days)) if (k < cutoff) delete st.days[k];
    st.sessions++;
    activeFrom = document.hidden ? null : Date.now();
    setInterval(tickTime, 15000);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        tickTime();
        activeFrom = null;
        hiddenAt = Date.now();
        blurPost();
      } else {
        if (hiddenAt && Date.now() - hiddenAt > 30 * 60000) stats().sessions++;
        activeFrom = Date.now();
        refocusVisible();
      }
    });
    saveStats();
  }

  function fmtDur(ms) {
    const min = Math.round(ms / 60000);
    if (min < 1) return ms > 0 ? 'menos de 1 min' : '0 min';
    if (min < 60) return min + ' min';
    const hrs = Math.floor(min / 60);
    const rest = min % 60;
    return hrs + ' h' + (rest ? ' ' + rest + ' min' : '');
  }

  const SECTION_NAMES = { home: 'Inicio', tag: 'Hashtags', random: 'Aleatorio', user: 'Perfiles', likes: 'Favoritos', history: 'Historial', news: 'Novedades', search: 'Buscar' };
  // Colores por tipo de contenido (paleta validada para fondo oscuro: azul, naranja, aguamarina).
  const KIND_COLORS = { image: '#3987e5', gif: '#d95926', video: '#199e70' };
  const KIND_NAMES = { image: 'Imágenes', gif: 'GIF', video: 'Videos' };

  // Barras verticales de una sola serie. Tocar una barra muestra su valor arriba.
  function columnChart(title, points, fmtValue, emptyText) {
    const max = Math.max(1, ...points.map((pt) => pt.value));
    const total = points.reduce((a, pt) => a + pt.value, 0);
    const readout = h('p', { class: 'chart-readout', text: total ? 'Toca una barra para ver el detalle' : emptyText });
    const bars = h('div', { class: 'cols', role: 'list' },
      points.map((pt) => {
        const b = h('button', {
          class: 'col',
          role: 'listitem',
          'aria-label': pt.long + ': ' + fmtValue(pt.value),
          onclick: () => {
            bars.querySelectorAll('.col.on').forEach((x) => x.classList.remove('on'));
            b.classList.add('on');
            readout.textContent = pt.long + ': ' + fmtValue(pt.value);
          }
        }, h('span', { class: 'col-bar', style: { height: Math.max(pt.value ? 3 : 0, (pt.value / max) * 100) + '%' } }));
        return b;
      })
    );
    const axis = h('div', { class: 'cols-axis' }, points.map((pt) => h('span', { text: pt.short || '' })));
    return h('section', { class: 'stat-card' }, h('h2', { class: 'stat-title', text: title }), readout, bars, axis);
  }

  // Lista de barras horizontales (ranking): nombre, valor y barra proporcional.
  function rankList(title, rows, fmtValue, emptyText, hrefOf) {
    const max = Math.max(1, ...rows.map((r) => r.value));
    return h('section', { class: 'stat-card' },
      h('h2', { class: 'stat-title', text: title }),
      rows.length
        ? h('ol', { class: 'rank' },
            rows.map((r) => {
              const label = hrefOf ? h('a', { class: 'rank-name', href: hrefOf(r), text: r.label }) : h('span', { class: 'rank-name', text: r.label });
              return h('li', {},
                h('div', { class: 'rank-top' }, label, h('span', { class: 'rank-val', text: fmtValue(r.value) })),
                h('span', { class: 'rank-bar' }, h('span', { style: { width: (r.value / max) * 100 + '%' } }))
              );
            })
          )
        : h('p', { class: 'chart-readout', text: emptyText })
    );
  }

  function routeStats() {
    tickTime();
    const st = stats();
    const todayStats = today();
    const dayList = [];
    for (let i = 13; i >= 0; i--) {
      const t = Date.now() - i * 86400000;
      const d = st.days[dayKey(t)] || { ms: 0, posts: 0, likes: 0, dislikes: 0 };
      const date = new Date(t);
      dayList.push({
        ms: d.ms,
        posts: d.posts,
        long: date.toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'short' }),
        short: i === 0 ? 'hoy' : i === 13 || i === 7 ? date.toLocaleDateString('es', { day: 'numeric', month: 'short' }) : ''
      });
    }
    const last7 = dayList.slice(-7);
    const ms7 = last7.reduce((a, d) => a + d.ms, 0);
    const allDays = Object.values(st.days);
    const totalMs = allDays.reduce((a, d) => a + d.ms, 0);
    const totalPosts = allDays.reduce((a, d) => a + d.posts, 0);
    const totalLikes = allDays.reduce((a, d) => a + d.likes, 0);
    const totalDis = allDays.reduce((a, d) => a + d.dislikes, 0);
    const likeRate = totalPosts ? Math.min(100, (totalLikes / totalPosts) * 100).toLocaleString('es', { maximumFractionDigits: 1 }) + ' %' : '—';

    const tile = (label, value, sub) => h('div', { class: 'stat-tile' }, h('span', { class: 'tile-label', text: label }), h('strong', { class: 'tile-value', text: value }), sub ? h('span', { class: 'tile-sub', text: sub }) : null);

    const kinds = st.kinds;
    const kindTotal = kinds.image + kinds.gif + kinds.video;
    const kindKeys = ['image', 'gif', 'video'];
    const pct = (n) => (kindTotal ? Math.round((n / kindTotal) * 100) : 0);

    const top = (obj, n) =>
      Object.entries(obj)
        .sort((a, b) => b[1] - a[1])
        .slice(0, n)
        .map(([label, value]) => ({ label, value }));
    const likedTags = {};
    for (const x of Object.values(S.likes)) for (const t of leafTags(x.post.tags)) likedTags[t.name] = (likedTags[t.name] || 0) + 1;

    const n = (v) => fmt(v);
    const postsFmt = (v) => fmt(v) + (v === 1 ? ' post' : ' posts');

    mount([
      h('header', { class: 'top has-back' }, backBtn('/settings'), h('h1', { text: 'Tus estadísticas' })),
      h('div', { class: 'stats-page' },
        h('div', { class: 'tiles-2' },
          tile('Hoy', fmtDur(todayStats.ms), fmt(todayStats.posts) + (todayStats.posts === 1 ? ' post visto' : ' posts vistos')),
          tile('Últimos 7 días', fmtDur(ms7), 'promedio ' + fmtDur(ms7 / 7) + ' por día'),
          tile('Posts vistos', fmt(totalPosts), 'en total'),
          tile('Me gusta', fmt(totalLikes), totalPosts ? 'te gusta el ' + likeRate + ' de lo que ves' : 'desde que se activaron las estadísticas'),
          tile('No me gusta', fmt(totalDis), 'posts ocultados'),
          tile('Pantalla completa', fmt(st.fsOpens) + (st.fsOpens === 1 ? ' vez' : ' veces'), fmtDur(st.fsMs) + ' en total')
        ),
        columnChart('Tiempo de uso por día', dayList.map((d) => ({ value: d.ms, long: d.long, short: d.short })), (v) => fmtDur(v), 'Todavía no hay datos de estos días.'),
        columnChart(
          '¿A qué hora usas la app?',
          st.hours.map((ms, hr) => ({ value: ms, long: 'De ' + hr + ':00 a ' + (hr + 1) + ':00', short: hr % 6 === 0 ? hr + 'h' : '' })),
          (v) => fmtDur(v),
          'Todavía no hay datos.'
        ),
        h('section', { class: 'stat-card' },
          h('h2', { class: 'stat-title', text: 'Qué tipo de posts ves' }),
          kindTotal
            ? [
                h('div', { class: 'stack', role: 'img', 'aria-label': kindKeys.map((k) => KIND_NAMES[k] + ' ' + pct(kinds[k]) + '%').join(', ') },
                  kindKeys.filter((k) => kinds[k]).map((k) => h('span', { style: { width: (kinds[k] / kindTotal) * 100 + '%', background: KIND_COLORS[k] } }))
                ),
                h('ul', { class: 'legend2' },
                  kindKeys.map((k) => h('li', {}, h('i', { style: { background: KIND_COLORS[k] } }), KIND_NAMES[k], h('span', { class: 'rank-val', text: pct(kinds[k]) + ' % · ' + n(kinds[k]) })))
                )
              ]
            : h('p', { class: 'chart-readout', text: 'Todavía no hay datos.' })
        ),
        rankList('Hashtags que más ves', top(st.tags, 10), postsFmt, 'Todavía no hay datos.', (r) => '#/tag/' + enc(r.label)),
        rankList('Hashtags de tus me gusta', top(likedTags, 5), (v) => fmt(v) + (v === 1 ? ' me gusta' : ' me gusta'), 'Todavía no le diste me gusta a nada.', (r) => '#/tag/' + enc(r.label)),
        rankList('Usuarios que más ves', top(st.users, 5), postsFmt, 'Todavía no hay datos.', (r) => '#/user/' + enc(r.label)),
        rankList('Dónde navegas', top(st.sections, 8).map((r) => ({ label: SECTION_NAMES[r.label] || r.label, value: r.value })), postsFmt, 'Todavía no hay datos.'),
        h('section', { class: 'stat-card' },
          h('h2', { class: 'stat-title', text: 'Más datos' }),
          h('ul', { class: 'facts' },
            h('li', {}, 'Veces que abriste la app', h('span', { class: 'rank-val', text: fmt(st.sessions) })),
            h('li', {}, 'Búsquedas', h('span', { class: 'rank-val', text: fmt(st.searches) })),
            h('li', {}, 'Tiempo total', h('span', { class: 'rank-val', text: fmtDur(totalMs) })),
            h('li', {}, 'Hashtags que sigues', h('span', { class: 'rank-val', text: fmt(Object.keys(S.favorites).length) })),
            h('li', {}, 'Usuarios que sigues', h('span', { class: 'rank-val', text: fmt(Object.keys(S.following).length) })),
            h('li', {}, 'En tu historial', h('span', { class: 'rank-val', text: fmt((S.history || []).length) }))
          )
        ),
        h('p', { class: 'foot-note' },
          'Desde el ' + new Date(st.since).toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' }) + ' · solo en este teléfono. ',
          h('button', {
            class: 'link-btn',
            onclick: () => {
              if (!confirm('¿Reiniciar todas las estadísticas?')) return;
              S.stats = {};
              stats();
              persist('stats', 0);
              routeStats();
            }
          }, 'Reiniciar')
        )
      )
    ]);
  }

  // ================================================================ Árbol de hashtags (herramienta temporal)
  //
  // Para entender cómo JoyReactor reparte los hashtags en carpetas: se elige uno (o una raíz) y se ve
  // lo que tiene dentro, abriendo cada carpeta en el lugar. Cada nivel se pide al abrirlo, de a 36.

  const TREE_ROOTS = ['fandoms', 'games', 'erotic', 'art', 'cats', 'gif', 'cosplay'];

  // Una carpeta del árbol: tocar la flecha la abre o la cierra; tocar el nombre la pone arriba.
  function treeNode(node, depth) {
    const kids = h('div', { class: 'tn-kids', hidden: true });
    let loaded = 0;
    let total = 0;
    let open = false;
    const toggle = h('button', { class: 'tn-toggle', 'aria-label': 'Abrir ' + node.name, 'aria-expanded': 'false', disabled: !node.inner }, node.inner ? icon('chevright', 16) : h('span', { class: 'tn-dot' }));
    const loadPage = async (more) => {
      const page = Math.floor(loaded / 36) + 1;
      const wait = h('div', { class: 'tn-wait', style: { '--d': depth + 1 } }, icon('spinner', 16, 'spin'), 'Cargando…');
      kids.append(wait);
      if (more) more.remove();
      try {
        const res = await RS.fetchTagChildren(node.name, page);
        total = res.total;
        loaded += res.children.length;
        wait.remove();
        kids.append(...res.children.map((c) => treeNode(c, depth + 1)));
        if (loaded < total && res.children.length) {
          const btn = h('button', { class: 'tn-more', style: { '--d': depth + 1 } }, 'Ver ' + Math.min(36, total - loaded) + ' más (quedan ' + fmt(total - loaded) + ')');
          btn.addEventListener('click', () => loadPage(btn));
          kids.append(btn);
        }
      } catch (e) {
        fill(wait, icon('alert', 16), errText(e));
      }
    };
    toggle.addEventListener('click', () => {
      open = !open;
      kids.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
      toggle.classList.toggle('open', open);
      if (open && !loaded) loadPage();
    });
    const row = h('div', { class: 'tn-row', style: { '--d': depth } },
      toggle,
      h('a', { class: 'tn-name', href: '#/tree/' + enc(node.name) }, node.name),
      h('span', { class: 'tn-meta', text: fmt(node.count) + ' posts' + (node.inner ? ' · ' + fmt(node.inner) + ' dentro' : '') })
    );
    return h('div', { class: 'tn' }, row, kids);
  }

  function routeTree(name) {
    const body = h('div', { class: 'tree-page' });
    const results = h('div', { class: 'results' });
    const input = h('input', { type: 'search', placeholder: 'Buscar un hashtag', 'aria-label': 'Buscar un hashtag para ver su árbol', autocomplete: 'off', enterkeyhint: 'search' });
    let timer = null;
    input.addEventListener('input', () => {
      clearTimeout(timer);
      const q = input.value.trim().replace(/^#/, '');
      if (q.length < 2) return fill(results);
      timer = setTimeout(async () => {
        try {
          const list = await RS.autocomplete(q);
          fill(results, list.slice(0, 8).map((t) => h('div', { class: 'result' }, h('a', { href: '#/tree/' + enc(t.name) }, tagPic(t.name, 'htile', '#', t.image ? RS.numId(t.id) : 0), h('span', { class: 'rtext' }, h('span', { class: 'n', text: t.name }), h('span', { class: 'm', text: fmt(t.count) + ' posts' }))))));
        } catch (e) {
          fill(results, h('div', { class: 'status', text: errText(e) }));
        }
      }, 250);
    });
    input.addEventListener('keydown', (e) => {
      const q = input.value.trim().replace(/^#/, '');
      if (e.key === 'Enter' && q) nav('#/tree/' + enc(q));
    });

    mount([
      h('header', { class: 'top has-back' }, backBtn('/settings'), h('h1', { text: 'Árbol de hashtags' })),
      h('p', { class: 'countline', style: { padding: '12px 16px 0' }, text: 'Herramienta temporal. Toca la flecha para abrir una carpeta y el nombre para ponerla arriba.' }),
      h('div', { class: 'search' }, h('label', {}, icon('search', 20), input)),
      results,
      body
    ]);

    if (!name) {
      // Sin hashtag elegido: las carpetas de más arriba (raíces) y las de lo que sigues.
      const roots = new Set(TREE_ROOTS);
      fill(body, h('h2', { class: 'sec section-label', style: { padding: '14px 16px 6px' }, text: 'Carpetas de más arriba' }), h('div', { class: 'status' }, icon('spinner', 20, 'spin'), 'Cargando…'));
      (async () => {
        try {
          const follow = favList().map((f) => f.name);
          const paths = follow.length ? await RS.fetchTagPaths(follow) : {};
          for (const f of follow) {
            const p = paths[f] || [];
            roots.add(p.length ? p[p.length - 1] : f);
          }
          const infos = await Promise.all(Array.from(roots).map((r) => RS.fetchTagChildren(r, 1).catch(() => null)));
          if (!body.isConnected) return;
          const nodes = infos.filter(Boolean).sort((a, b) => b.count - a.count).map((x) => treeNode({ name: x.name, count: x.count, inner: x.total }, 0));
          fill(body, h('h2', { class: 'sec section-label', style: { padding: '14px 16px 6px' }, text: 'Carpetas de más arriba' }), h('div', { class: 'tree-list' }, nodes));
        } catch (e) {
          fill(body, emptyBox('alert', 'No se pudo cargar', errText(e)));
        }
      })();
      return;
    }

    fill(body, h('div', { class: 'status' }, icon('spinner', 20, 'spin'), 'Cargando…'));
    (async () => {
      try {
        const [info, first] = await Promise.all([RS.fetchTagInfo(name), RS.fetchTagChildren(name, 1)]);
        if (!body.isConnected) return;
        const path = info && info.path ? info.path : [];
        const self = treeNode({ name: first.name, count: first.count, inner: first.total }, 0);
        fill(body,
          h('h2', { class: 'sec section-label', style: { padding: '14px 16px 6px' }, text: 'Está dentro de' }),
          h('div', { class: 'crumbs tree-crumbs' },
            path.length
              ? path.map((t, i) => [i ? h('span', { class: 'sep', 'aria-hidden': 'true', text: '›' }) : null, h('a', { class: 'tag', href: '#/tree/' + enc(t), text: t })])
              : h('span', { class: 'countline', style: { padding: 0 }, text: 'Nada: es una carpeta de más arriba.' })
          ),
          h('div', { class: 'tree-actions' },
            h('a', { class: 'small-btn', href: '#/tag/' + enc(first.name) }, icon('hash', 16), 'Abrir #' + first.name),
            h('a', { class: 'small-btn', href: '#/tree' }, 'Ver las raíces')
          ),
          h('h2', { class: 'sec section-label', style: { padding: '18px 16px 6px' }, text: first.total ? 'Lo que tiene dentro (' + fmt(first.total) + ')' : 'No tiene nada dentro' }),
          h('div', { class: 'tree-list' }, self)
        );
        // Se abre solo el primer nivel.
        if (first.total) self.querySelector('.tn-toggle').click();
      } catch (e) {
        fill(body, emptyBox('alert', 'No se pudo cargar', errText(e)));
      }
    })();
  }

  // ================================================================ Deslizar hacia abajo para recargar
  //
  // Arriba del todo de una página, arrastrar el dedo hacia abajo y soltar la vuelve a cargar.
  const PULL_MAX = 120;
  const PULL_GO = 76;
  // «Arriba del todo» con margen: en el feed de un post por pantalla, el primer enganche queda unos px más abajo.
  const atTop = () => window.scrollY <= 40;
  let ptrEl = null;
  function drawPull(d, back) {
    ptrEl.classList.toggle('back', !!back);
    ptrEl.classList.toggle('ready', d >= PULL_GO);
    ptrEl.style.transform = 'translate(-50%, ' + Math.round(d - 52) + 'px) rotate(' + Math.round(d * 3) + 'deg)';
    ptrEl.style.opacity = String(Math.min(1, d / 40));
  }
  async function refreshPage() {
    ptrEl.classList.add('busy');
    drawPull(PULL_GO);
    const started = Date.now();
    try {
      const f = current && current.feed;
      if (f) await f.refreshAll();
      else route();
    } catch (e) {
      /* el feed muestra su propio error */
    }
    await new Promise((r) => setTimeout(r, Math.max(0, 600 - (Date.now() - started))));
    ptrEl.classList.remove('busy');
    drawPull(0, true);
  }
  function initPullToRefresh() {
    ptrEl = h('div', { id: 'ptr', 'aria-hidden': 'true' }, icon('refresh', 22));
    document.body.append(ptrEl);
    let x0 = 0;
    let y0 = 0;
    let dist = 0;
    let state = ''; // '' | 'maybe' | 'pull'
    document.addEventListener(
      'touchstart',
      (e) => {
        state = '';
        if (viewer || e.touches.length !== 1 || !atTop() || ptrEl.classList.contains('busy')) return;
        if (e.target.closest('input, textarea, select')) return;
        state = 'maybe';
        dist = 0;
        x0 = e.touches[0].clientX;
        y0 = e.touches[0].clientY;
      },
      { passive: true }
    );
    document.addEventListener(
      'touchmove',
      (e) => {
        if (!state) return;
        const dx = e.touches[0].clientX - x0;
        const dy = e.touches[0].clientY - y0;
        if (state === 'maybe') {
          // Solo cuenta un arrastre hacia abajo, más vertical que horizontal, con la página arriba del todo.
          if (dy < -4 || Math.abs(dx) > 12 || !atTop()) {
            state = '';
            return;
          }
          if (dy < 10 || Math.abs(dx) > dy) return;
          state = 'pull';
        }
        dist = Math.min(PULL_MAX, (dy - 10) * 0.55);
        drawPull(Math.max(0, dist));
      },
      { passive: true }
    );
    const end = () => {
      if (state === 'pull') {
        if (dist >= PULL_GO) refreshPage();
        else drawPull(0, true);
      }
      state = '';
    };
    document.addEventListener('touchend', end, { passive: true });
    document.addEventListener('touchcancel', end, { passive: true });
  }

  // ================================================================ Arranque

  let lastResumeCheck = 0;
  window.RSApp = {
    tabId: null,
    navigate(hash) {
      if (location.hash === hash) route();
      else location.hash = hash;
    },
    // Botón «atrás» de Android: 1) cierra la pantalla completa, 2) vuelve a las miniaturas si abriste
    // un post desde ahí, 3) vuelve a la página anterior, 4) desde otra sección vuelve a Inicio,
    // 5) desde Inicio sale de la app.
    handleBack() {
      if (viewer) {
        exitViewer();
        return 'handled';
      }
      if (backToGrid()) return 'handled';
      if (stack.length > 1) {
        navBack();
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
    startUsageClock();
    refreshFilter();
    applyDisplay();
    refreshFavIndex();
    if (RS.android) {
      loadNativeNews();
      syncNative();
      lastResumeCheck = Date.now();
    }
    initTabs();
    initPullToRefresh();
    finishWeek();
    window.addEventListener('hashchange', route);
    route();
    // Si Android cerró Firefox y no se revisó en un buen rato, reviso al abrir la app.
    const stale = Date.now() - (S.news.lastCheck || 0) > (Number(S.settings.interval) || 15) * 60000;
    if (stale && watchList().length) bg({ type: 'check-now' }).catch(() => {});
    lookForUpdate(false);
  }

  boot().catch((e) => {
    fill(viewEl, emptyBox('alert', 'No pude iniciar Reactor Swipe', errText(e)));
  });
})();
