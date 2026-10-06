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
    usercheck: '<circle cx="10" cy="8" r="4"/><path d="M3 20.5a7 7 0 0 1 12.5-4.3"/><path d="M15.5 18l2 2 4-4.5"/>',
    dots: '<circle cx="5" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="19" cy="12" r="1.3"/>',
    camera: '<path d="M4 8.5h3.2l1.8-2.5h6l1.8 2.5H20v11H4z"/><circle cx="12" cy="13.5" r="3.5"/>',
    folder: '<path d="M3.5 7A1.5 1.5 0 0 1 5 5.5h4.5l2 2.5H19a1.5 1.5 0 0 1 1.5 1.5V18a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 18z"/>'
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

  const S = { ui: {} };
  let pass = () => true;
  const timers = {};

  function persist(key, delay) {
    clearTimeout(timers[key]);
    timers[key] = setTimeout(() => {
      timers[key] = null;
      RS.save({ [key]: S[key] });
      if (key === 'favorites' || key === 'following' || key === 'tagProfiles' || key === 'settings' || key === 'mix') syncNative();
      // Cambió algo que no se debe perder: el respaldo automático se pone al día en un rato.
      if (BACKUP_KEYS.has(key)) {
        clearTimeout(backupTimer);
        backupTimer = setTimeout(() => autoBackup(false).catch(() => {}), 20000);
      }
    }, delay == null ? 250 : delay);
  }
  const BACKUP_KEYS = new Set(['likes', 'dislikes', 'favorites', 'following', 'tagProfiles', 'mix', 'pics', 'folders', 'rgFollowing', 'rgTags', 'rgLinks', 'rgMix']);
  let backupTimer = null;

  // App de Android: los avisos los revisa Android en segundo plano, así que le paso qué vigilar
  // y cómo (hashtags y usuarios con campanita, ajustes y hashtags excluidos). Los hashtags que sigues
  // como cuenta (S.tagProfiles) van con los demás hashtags.
  function syncNative() {
    if (!RS.android) return;
    try {
      RS.android.syncConfig(
        JSON.stringify({
          favorites: Object.values(S.favorites)
            .map((f) => ({ name: f.name, kind: f.kind, notify: !!f.notify }))
            .concat(Object.values(S.tagProfiles).filter((t) => t.notify && !favOf(t.name)).map((t) => ({ name: t.name, kind: 'hashtag', notify: true }))),
          following: Object.values(S.following).map((f) => ({ name: f.name, notify: !!f.notify })),
          settings: S.settings,
          exclude: S.mix.exclude,
          // Para que lo que sigues gane sobre lo bloqueado también en los avisos (ver RS.makeFilter).
          followedTags: Object.values(S.favorites).concat(Object.values(S.tagProfiles)).flatMap((f) => [f.name].concat(f.aliases || [])),
          blockedParents: Object.fromEntries(S.mix.exclude.map((b) => [b.toLowerCase(), (knownTree(b) || { p: [] }).p])),
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

  // Lo que sigues gana sobre lo bloqueado, salvo que lo bloqueado esté dentro (ver RS.makeFilter): para
  // eso hacen falta las carpetas de arriba de cada hashtag bloqueado (S.tagTree; si faltan, se piden).
  const blockedParents = (t) => {
    const k = knownTree(t);
    if (!k) needTree([t]);
    return k ? k.p : null;
  };
  const refreshFilter = () => (pass = RS.makeFilter(S, isFollowedTag, blockedParents));
  // La fecha de cada post y, en pantalla completa, la reputación y el rating se dibujan siempre y se
  // ocultan con CSS (así cambiar el ajuste no recarga nada).
  function applyDisplay() {
    // Fotos de Seguidos: con las grandes, los botones pasan debajo del nombre (para que el nombre quepa).
    const rowPic = Number(S.settings.rowPic) || 64;
    document.documentElement.style.setProperty('--rowpic', rowPic + 'px');
    document.documentElement.classList.toggle('rowpic-big', rowPic >= 84);
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
    if (on) {
      S.mix.exclude.push(t);
      needTree([t]);
    }
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
        h('span', { class: 'd', text: 'Los posts con estos hashtags no salen en ningún feed ni en los avisos, salvo los que llevan un hashtag que sigues (si el bloqueado no está dentro de ese). También puedes bloquear un hashtag manteniéndolo presionado, o desde el botón ⋯ de su página.' }),
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

  // ================================================================ Descargar un post (1.8.0)
  //
  // El botón de descarga (al lado de comentarios, en la tarjeta y en pantalla completa) guarda las
  // imágenes en tamaño completo y los GIF y videos como mp4. En Android van a la galería, en
  // Imágenes › ReactorSwipe (Bridge.saveMedia). Con varias, pregunta si solo la que ves o todas.
  const savable = (p) => p.media.filter((m) => m.kind === 'image' || m.kind === 'video');
  const saving = new Set();
  function downloadPost(p, idx) {
    const list = savable(p);
    if (!list.length) return;
    const here = p.media[idx || 0];
    if (list.length === 1) return saveFiles(p, list);
    const n = list.length;
    openSheet('Descargar',
      h('div', { class: 'sheet-title', text: 'Descargar' }),
      list.includes(here)
        ? sheetRow(here.kind === 'video' ? 'film' : 'image', 'Solo esta', (list.indexOf(here) + 1) + ' de ' + n, () => {
            closeSheet();
            saveFiles(p, [here]);
          })
        : null,
      sheetRow('download', 'Todas (' + n + ')', null, () => {
        closeSheet();
        saveFiles(p, list);
      })
    );
  }
  async function saveFiles(p, ms) {
    if (saving.has(p.id)) return toast('Ya se está descargando');
    saving.add(p.id);
    const all = savable(p);
    let done = 0;
    try {
      for (const m of ms) {
        const f = RS.fileOf(m);
        const name = (RS.isRg(p) ? 'redgifs-' : 'reactor-') + p.num + (all.length > 1 ? '-' + (all.indexOf(m) + 1) : '') + '.' + f.ext;
        if (ms.length > 1) toast('Descargando ' + (done + 1) + ' de ' + ms.length + '…');
        else toast('Descargando…');
        if (RS.android) await RS.native('saveMedia', f.url, name);
        else await saveInBrowser(f.url, name);
        done++;
      }
      toast((done === 1 ? 'Guardado' : done + ' archivos guardados') + (RS.android ? ' en la galería, en ReactorSwipe' : ''));
    } catch (e) {
      toast((done ? 'Se guardaron ' + done + ' de ' + ms.length + '. ' : 'No se pudo descargar. ') + errText(e));
    }
    saving.delete(p.id);
  }
  // Fuera de Android (la PC): se baja el archivo y el navegador lo guarda.
  async function saveInBrowser(url, name) {
    const r = await fetch(RS.localUrl(url));
    if (!r.ok) throw new Error('JoyReactor respondió ' + r.status);
    const href = URL.createObjectURL(await r.blob());
    const a = h('a', { href, download: name });
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(href), 10000);
  }

  // ================================================================ RedGifs (1.10.0)
  //
  // Los posts de RedGifs se mezclan con los de JoyReactor en Inicio, en Explorar y en cada hashtag (uno
  // cada RG_EVERY de JoyReactor; ver Feed.add). En Ajustes › Fuentes se elige: las dos, solo JoyReactor o
  // solo RedGifs (S.settings.sources). Cada post lleva un mini icono de su fuente (srcBadge). Los creadores
  // de RedGifs se siguen aparte (S.rgFollowing): sus posts van primero en Inicio y salen en las historias.
  const RG_EVERY = 3;
  let rgErrorShown = false;
  const srcMode = () => (['jr', 'rg', 'both'].includes(S.settings.sources) ? S.settings.sources : 'both');
  // Con las dos fuentes, en todos los posts; con una sola, solo en los de la otra (p. ej. un me gusta viejo).
  function srcBadge(p, cls) {
    const rg = RS.isRg(p);
    const mode = srcMode();
    if (mode !== 'both' && mode === (rg ? 'rg' : 'jr')) return null;
    const label = rg ? 'De RedGifs' : 'De JoyReactor';
    return h('span', { class: 'srcb ' + (rg ? 'rg' : 'jr') + (cls ? ' ' + cls : ''), title: label, 'aria-label': label, text: rg ? 'RG' : 'JR' });
  }
  const rgKey = (name) => String(name).toLowerCase();
  const isRgFollowed = (name) => !!S.rgFollowing[rgKey(name)];
  function setRgFollow(name, on, pic) {
    if (on) S.rgFollowing[rgKey(name)] = S.rgFollowing[rgKey(name)] || { name, pic: pic || '', addedAt: Date.now() };
    else delete S.rgFollowing[rgKey(name)];
    persist('rgFollowing', 0);
    invalidateHome();
    storyCache = null;
  }
  // Foto de un creador de RedGifs: la que le pusiste, la suya (pedida sin Referer, que RedGifs rechaza) o su inicial.
  function rgPic(name, url, cls) {
    const own = picOf('rguser', name);
    if (own) return putPic(h('span', { class: cls || 'htile' }), own);
    const c = colorFor(name || '?');
    const el = h('span', { class: cls || 'htile', style: { background: c[1], color: '#0f0e0d' } }, String(name || '?').charAt(0).toUpperCase());
    if (url) {
      const img = new Image();
      img.alt = '';
      img.referrerPolicy = 'no-referrer';
      img.onload = () => fill(el, img);
      img.src = url;
    }
    return el;
  }
  // ¿Esta lista pide a RedGifs? Las páginas de RedGifs siempre (always); las demás, si RedGifs está en Ajustes ›
  // Fuentes y es Inicio o Explorar (general), su pestaña RedGifs (only), una cuenta que mezclas (mix) o
  // «Solo RedGifs».
  function rgActive(plan) {
    if (!plan || !plan.q) return false;
    if (plan.always) return true;
    const mode = srcMode();
    return mode !== 'jr' && !!(plan.general || plan.only || plan.mix || mode === 'rg');
  }

  // ---- Unir con RedGifs (1.10.0): un hashtag de JoyReactor con una etiqueta de RedGifs y una cuenta con un
  // creador. S.rgLinks guarda las dos direcciones: 'tag:<hashtag>' -> etiqueta, 'rgtag:<etiqueta>' -> hashtag,
  // 'user:<usuario>' -> creador, 'rguser:<creador>' -> usuario. Un hashtag sin unir usa la etiqueta de su
  // mismo nombre; una cuenta sin unir no tiene RedGifs. S.rgMix: las cuentas en las que elegiste ver las dos
  // fuentes mezcladas en Todos ('tag:<hashtag>' o 'user:<usuario>').
  const rgTagFor = (tag) => S.rgLinks['tag:' + tkey(tag)] || tag;
  const rgUserFor = (user) => S.rgLinks['user:' + tkey(user)] || null;
  const jrTagFor = (rgTag) => S.rgLinks['rgtag:' + tkey(rgTag)] || null;
  const jrUserFor = (creator) => S.rgLinks['rguser:' + tkey(creator)] || null;
  const rgMixOn = (kind, name) => !!S.rgMix[kind + ':' + tkey(name)];
  // kind: 'tag' o 'user' (lado JoyReactor); rgName null = quitar la unión.
  function setRgLink(kind, jrName, rgName) {
    const old = S.rgLinks[kind + ':' + tkey(jrName)];
    if (old) delete S.rgLinks['rg' + kind + ':' + tkey(old)];
    delete S.rgLinks[kind + ':' + tkey(jrName)];
    if (rgName) {
      const back = S.rgLinks['rg' + kind + ':' + tkey(rgName)];
      if (back) delete S.rgLinks[kind + ':' + tkey(back)];
      S.rgLinks[kind + ':' + tkey(jrName)] = rgName;
      S.rgLinks['rg' + kind + ':' + tkey(rgName)] = jrName;
    }
    persist('rgLinks', 0);
    dropFeeds();
  }
  function setRgMix(kind, name, on) {
    if (on) S.rgMix[kind + ':' + tkey(name)] = true;
    else delete S.rgMix[kind + ':' + tkey(name)];
    persist('rgMix', 0);
    dropFeeds(true);
  }

  // Arriba de la pestaña RedGifs de un hashtag o una cuenta: con qué está unido, «Cambiar» y, en las cuentas,
  // «Mezclar con JoyReactor en Todos».
  function rgLinkBar(kind, name, account) {
    const linked = kind === 'tag' ? rgTagFor(name) : rgUserFor(name);
    const own = !!S.rgLinks[kind + ':' + tkey(name)];
    return h('div', { class: 'rglink' },
      h('div', { class: 'rgl-row' },
        h('span', { class: 'srcb rg', text: 'RG' }),
        h('span', { class: 'grow', text: linked ? (kind === 'tag' ? '#' : '@') + linked + (kind === 'tag' && !own ? ' (mismo nombre)' : '') : 'Todavía no está unido con RedGifs' }),
        h('button', { type: 'button', class: 'link-btn', onclick: () => openRgLink(kind, name) }, linked ? 'Cambiar' : 'Unir')
      ),
      account && linked
        ? h('div', { class: 'rgl-row' },
            h('span', { class: 'grow', text: 'Mezclar con JoyReactor en Todos' }),
            switchBtn(rgMixOn(kind, name), 'Mezclar con JoyReactor en Todos', (on) => {
              setRgMix(kind, name, on);
              toast(on ? 'En Todos salen las dos fuentes mezcladas' : 'Todos vuelve a ser solo de JoyReactor');
            })
          )
        : null
    );
  }

  // Elegir con qué se une (lado JoyReactor: una etiqueta o un creador de RedGifs; lado RedGifs: un hashtag o
  // un usuario de JoyReactor). Mientras escribes se busca en el sitio que toca.
  function openRgLink(kind, name) {
    const toRg = kind === 'tag' || kind === 'user';
    const isTag = kind === 'tag' || kind === 'rgtag';
    const title = toRg
      ? (isTag ? 'Unir #' : 'Unir @') + name + (isTag ? ' con una etiqueta de RedGifs' : ' con su cuenta de RedGifs')
      : (isTag ? 'Unir #' : 'Unir @') + name + (isTag ? ' con un hashtag de JoyReactor' : ' con su cuenta de JoyReactor');
    const linked = kind === 'tag' ? S.rgLinks['tag:' + tkey(name)] : kind === 'user' ? rgUserFor(name) : kind === 'rgtag' ? jrTagFor(name) : jrUserFor(name);
    const input = h('input', { class: 'input', type: 'search', value: linked || name, placeholder: isTag ? 'Nombre del hashtag' : 'Nombre de la cuenta', 'aria-label': title, autocomplete: 'off', enterkeyhint: 'search' });
    const results = h('div', { class: 'results' });
    const done = (other) => {
      // En la página de un usuario la pestaña no va en la dirección: si estabas en RedGifs, sigues ahí.
      const onRgTab = kind === 'user' && current && current.feed && current.feed.show === 'rg';
      closeSheet();
      if (toRg) setRgLink(kind, name, other);
      else setRgLink(kind === 'rgtag' ? 'tag' : 'user', other, name);
      toast(other ? 'Unido: ' + (isTag ? '#' : '@') + name + ' y ' + (isTag ? '#' : '@') + other : 'Quitaste la unión');
      route();
      if (onRgTab && current && current.feed) current.feed.setShow('rg');
    };
    const row = (text, sub, pic) =>
      h('button', { type: 'button', class: 'sheet-row', onclick: () => done(text) }, pic || icon(isTag ? 'hash' : 'user', 22), h('span', { class: 'grow' }, h('span', { class: 'sr-l', text: (isTag ? '#' : '@') + text }), sub ? h('span', { class: 'sr-s', text: sub }) : null));
    let seq = 0;
    const search = async () => {
      const q = input.value.trim().replace(/^[#@]/, '');
      const my = ++seq;
      if (q.length < 2) return fill(results);
      fill(results, h('div', { class: 'status' }, icon('spinner', 18, 'spin'), 'Buscando…'));
      try {
        let rows = [];
        if (toRg && isTag) rows = (await RS.rgSuggest(q)).map((t) => row(t.text, fmt(t.gifs) + ' posts en RedGifs'));
        else if (toRg) {
          const list = await RS.rgCreators(q);
          rows = list.map((c) => row(c.username, (c.name && c.name !== c.username ? c.name + ' · ' : '') + fmt(c.gifs || 0) + ' posts', rgPic(c.username, c.profileImageUrl, 'htile')));
          if (!list.some((c) => tkey(c.username) === tkey(q))) rows.unshift(row(q, 'Usar este nombre tal cual'));
        } else if (isTag) {
          const found = await RS.searchTags(q, []);
          rows = found.exact.slice(0, 12).map((t) => row(t.name, fmt(t.count) + ' posts en JoyReactor'));
        } else {
          const u = await RS.fetchUserInfo(q).catch(() => null);
          rows = u ? [row(u.name, fmt(u.posts) + ' posts en JoyReactor')] : [h('div', { class: 'status', text: 'No hay una cuenta «' + q + '» en JoyReactor.' })];
        }
        if (my === seq) fill(results, ...(rows.length ? rows : [h('div', { class: 'status', text: 'Sin resultados para «' + q + '»' })]));
      } catch (e) {
        if (my === seq) fill(results, h('div', { class: 'status', text: errText(e) }));
      }
    };
    let timer = null;
    input.addEventListener('input', () => {
      clearTimeout(timer);
      timer = setTimeout(search, 300);
    });
    openSheet(title,
      h('div', { class: 'sheet-title', text: title }),
      h('div', { class: 'sheet-form' }, input),
      linked ? sheetRow('x', 'Quitar la unión', 'Con ' + (isTag ? '#' : '@') + linked + '.', () => done(null), 'danger') : null,
      results
    );
    search();
  }

  // ---- Etiquetas de RedGifs que sigues (1.10.0), como un hashtag (barajado, en las historias) o como cuenta
  // (en orden, en miniaturas, lo nuevo primero en Inicio): S.rgTags, nombre en minúsculas -> { name, as, addedAt }.
  const rgTagOf = (name) => S.rgTags[tkey(name)] || null;
  function followRgTag(name, as) {
    const before = rgTagOf(name);
    if (as) S.rgTags[tkey(name)] = { name, as, addedAt: (before && before.addedAt) || Date.now() };
    else delete S.rgTags[tkey(name)];
    persist('rgTags', 0);
    invalidateHome();
    storyCache = null;
    if (!as) {
      toast('Dejaste de seguir #' + name + ' (RedGifs)', 'Deshacer', () => {
        S.rgTags[tkey(name)] = before;
        persist('rgTags', 0);
        route();
      });
    } else toast('Sigues #' + name + ' (RedGifs) como ' + (as === 'account' ? 'cuenta' : 'hashtag'));
    // En el buscador solo se repintan sus botones (rehacer la página borraría lo escrito).
    document.querySelectorAll('[data-follow-rgtag]').forEach((b) => b._paint && b._paint());
    if (/^#\/(find|following)/.test(location.hash)) {
      if (pageFollowHook) pageFollowHook();
    } else route();
    if (as && !before && !picOf('rgtag', name)) askPic('rgtag', name);
  }
  function openRgFollowSheet(name) {
    const cur = rgTagOf(name);
    const pick = (as) => () => {
      closeSheet();
      followRgTag(name, as);
    };
    openSheet('Seguir #' + name,
      h('div', { class: 'sheet-title', text: 'Seguir #' + name + ' (RedGifs) como…' }),
      sheetRow('hash', 'Como hashtag', 'Lo ves al azar y sale en las historias de Inicio.', pick('tag'), cur && cur.as === 'tag' ? 'on' : '', cur && cur.as === 'tag' ? icon('check', 20) : null),
      sheetRow('userplus', 'Como cuenta', 'Lo ves como un perfil: en orden y en miniaturas. Lo nuevo, primero en Inicio.', pick('account'), cur && cur.as === 'account' ? 'on' : '', cur && cur.as === 'account' ? icon('check', 20) : null),
      cur ? sheetRow('x', 'Dejar de seguir', null, pick(null), 'danger') : null
    );
  }
  // Foto de una etiqueta de RedGifs: la tuya (un GIF que se mueve, o una imagen si la sigues como cuenta) o «#».
  function rgTagPic(name, cls) {
    const own = picOf('rgtag', name);
    if (own) return putPic(h('span', { class: cls }), own, !(rgTagOf(name) && rgTagOf(name).as === 'account'));
    const c = colorFor(name);
    return h('span', { class: cls, style: { background: c[0], color: c[1] } }, '#');
  }

  // ---- Página de una etiqueta de RedGifs (#/rgtag/<nombre>): sus posts al azar o, si la sigues como cuenta,
  // en orden y en miniaturas. Seguir, ⋯ (foto, unir con JoyReactor) y, si está unida, el enlace al hashtag.
  function routeRgTag(name, q) {
    const cur = rgTagOf(name);
    const account = !!(cur && cur.as === 'account');
    const random = account ? q.get('order') === 'random' : true;
    const key = 'rgtag:' + tkey(name) + ':' + (random ? 'r' : 'o') + (account ? ':c' : '');
    const hero = h('section', { class: 'hero tag-hero' });
    let total = null;
    const drawHero = () => {
      const now = rgTagOf(name);
      const jr = jrTagFor(name);
      fill(hero,
        h('div', { class: 'hero-row' },
          zoomable(rgTagPic(name, 'hero-tile'), () => rgTagPic(name, 'zoom-disc')),
          h('div', { class: 'grow' },
            h('h2', {}, name, ' ', h('span', { class: 'srcb rg', text: 'RG' })),
            h('span', { class: 'meta', text: total == null ? 'Etiqueta de RedGifs' : (total >= 10000 ? 'Más de 10.000' : fmt(total)) + ' posts en RedGifs' })
          )
        ),
        h('div', { class: 'hero-actions two' },
          h('button', { class: 'hbtn' + (now ? (now.as === 'account' ? ' prof' : ' fav') : ' go'), 'aria-haspopup': 'dialog', onclick: () => openRgFollowSheet(name) },
            icon(now ? 'check' : 'plus', 18), now ? 'Siguiendo' : 'Seguir', now ? h('small', { class: 'as', text: now.as === 'account' ? 'cuenta' : 'hashtag' }) : null),
          h('button', {
            class: 'hbtn ic',
            'aria-haspopup': 'dialog',
            'aria-label': 'Más opciones de #' + name,
            onclick: () =>
              openSheet('Más opciones de #' + name,
                h('div', { class: 'sheet-title', text: '#' + name + ' (RedGifs)' }),
                sheetRow(now && now.as === 'account' ? 'camera' : 'film', (picOf('rgtag', name) ? 'Cambiar ' : 'Poner ') + (now && now.as === 'account' ? 'la foto' : 'el GIF'), 'De sus posts o de tus me gusta.', () => openPicSheet('rgtag', name)),
                sheetRow('hash', jr ? 'Unida con #' + jr : 'Unir con un hashtag de JoyReactor', jr ? 'Toca para cambiarla. En #' + jr + ', su pestaña RedGifs muestra esta etiqueta.' : 'Así su pestaña RedGifs muestra esta etiqueta.', () => {
                  closeSheet();
                  openRgLink('rgtag', name);
                })
              )
          }, icon('dots', 22))
        ),
        jr ? h('a', { class: 'rgl-jump', href: '#/tag/' + enc(jr) }, h('span', { class: 'srcb jr', text: 'JR' }), 'Ver #' + jr + ' en JoyReactor') : null
      );
    };
    drawHero();
    RS.rgPage({ tags: name, order: 'trending' }, 1)
      .then((r) => {
        total = r.total;
        drawHero();
      })
      .catch(() => {});
    const f = cached(key, () =>
      new Feed({
        key,
        kind: 'pager',
        rgPlan: () => ({ q: { tags: name, order: random ? 'trending' : 'latest', random }, only: true, always: true }),
        mode: account ? 'grid' : 'feed',
        back: true,
        head: (f) => [backBtn('/home'), h('h1', { text: '#' + name }), viewToggle(f)],
        extra: () => hero,
        sub: () =>
          account
            ? h('div', { class: 'ptabs', role: 'tablist', 'aria-label': 'Orden' },
                h('button', { class: 'ptab' + (random ? '' : ' on'), role: 'tab', 'aria-selected': String(!random), onclick: () => random && navReplace('#/rgtag/' + enc(name)) }, icon('grid', 20), 'Lo nuevo'),
                h('button', { class: 'ptab shuf' + (random ? ' on' : ''), 'aria-pressed': String(random), 'aria-label': 'Barajar los posts', onclick: () => !random && navReplace('#/rgtag/' + enc(name) + '?order=random') }, icon('shuffle', 20))
              )
            : null,
        empty: () => emptyBox('hash', 'No encontré posts', 'Puede que RedGifs no responda o que esta etiqueta no tenga posts.')
      })
    );
    f.renderExtra = () => hero; // el feed guardado muestra la cabecera de esta vez (foto, Seguir…)
    showFeed(f);
  }

  // Cambiar las fuentes rehace todos los feeds guardados (y las historias).
  // keepShown: deja el que está en pantalla (Mezclar, en la pestaña RedGifs, cambia otra pestaña).
  function dropFeeds(keepShown) {
    for (const [k, f] of feeds) {
      if (keepShown && current && current.feed === f) continue;
      f.destroy();
      feeds.delete(k);
    }
    storyCache = null;
  }

  // ---- Perfil de un creador de RedGifs (#/rguser/<nombre>): sus posts, lo más nuevo primero, en miniaturas.
  function routeRgUser(name) {
    const key = 'rguser:' + rgKey(name);
    const hero = h('section', { class: 'hero' });
    let info = null;
    const drawHero = () => {
      const on = isRgFollowed(name);
      const pic = info && info.profileImageUrl;
      fill(hero,
        h('div', { class: 'hero-row' },
          zoomable(rgPic(name, pic, 'hero-tile'), () => rgPic(name, pic, 'zoom-disc')),
          h('div', { class: 'grow' },
            h('h2', {}, name, ' ', h('span', { class: 'srcb rg', text: 'RG' })),
            h('span', { class: 'meta', text: info ? fmt(info.gifs || info.publishedGifs || 0) + ' posts en RedGifs' : 'Creador de RedGifs' })
          )
        ),
        h('div', { class: 'hero-actions two' },
          h('button', {
            class: 'hbtn' + (on ? ' fav' : ' go'),
            onclick: () => {
              setRgFollow(name, !on, pic);
              toast(on ? 'Dejaste de seguir a ' + name : 'Sigues a ' + name + ' (RedGifs): sus posts nuevos, primero en Inicio');
              if (!on && !picOf('rguser', name)) askPic('rguser', name);
              drawHero();
            }
          }, icon(on ? 'check' : 'plus', 18), on ? 'Siguiendo' : 'Seguir'),
          h('button', {
            class: 'hbtn ic',
            'aria-haspopup': 'dialog',
            'aria-label': 'Más opciones de ' + name,
            onclick: () =>
              openSheet('Más opciones de ' + name,
                h('div', { class: 'sheet-title', text: '@' + name + ' (RedGifs)' }),
                sheetRow('camera', (picOf('rguser', name) ? 'Cambiar' : 'Poner') + ' la foto', 'Una imagen (o un GIF, quieto) de sus posts o de tus me gusta.', () => openPicSheet('rguser', name)),
                sheetRow('user', jrUserFor(name) ? 'Unida con @' + jrUserFor(name) : 'Unir con su cuenta de JoyReactor', jrUserFor(name) ? 'Toca para cambiarla. En su perfil de JoyReactor, la pestaña RedGifs muestra a este creador.' : 'Así su perfil de JoyReactor tiene una pestaña RedGifs.', () => {
                  closeSheet();
                  openRgLink('rguser', name);
                }),
                h('a', { class: 'sheet-row', href: 'https://www.redgifs.com/users/' + enc(name), target: '_blank', rel: 'noopener' }, icon('external', 22), h('span', { class: 'grow' }, h('span', { class: 'sr-l', text: 'Ver en RedGifs' })))
              )
          }, icon('dots', 22))
        ),
        jrUserFor(name) ? h('a', { class: 'rgl-jump', href: '#/user/' + enc(jrUserFor(name)) }, h('span', { class: 'srcb jr', text: 'JR' }), 'Ver @' + jrUserFor(name) + ' en JoyReactor') : null
      );
    };
    drawHero();
    RS.rgPage({ user: name, order: 'latest' }, 1)
      .then((r) => {
        info = r.user;
        drawHero();
      })
      .catch(() => {});
    const f = cached(key, () =>
      new Feed({
        key,
        kind: 'pager',
        rgPlan: () => ({ q: { user: name, order: 'latest' }, only: true, always: true }),
        mode: 'grid',
        back: true,
        head: (f) => [backBtn('/home'), h('h1', { text: name }), viewToggle(f)],
        extra: () => hero,
        empty: () => emptyBox('user', 'No encontré posts', 'Puede que RedGifs no responda o que este creador no tenga posts.')
      })
    );
    f.renderExtra = () => hero; // el feed guardado muestra la cabecera de esta vez (foto, Seguir…)
    showFeed(f);
  }

  // ================================================================ Observadores (videos y vistos)

  // ---- Reproductores de video. Chrome en Android deja tener pocos a la vez (unos 75 por página): si se
  // acaban, los GIF y videos nuevos no arrancan. Por eso en los feeds quedan cargados solo los últimos
  // MAX_LOADED que estuvieron cerca de la pantalla; al cargar uno más se suelta el más viejo
  // (releaseVideo), y si vuelves a él se carga otra vez (casi siempre desde lo ya descargado). La
  // pantalla completa suelta sola los posts lejanos (emptyPage) y todo al cerrarse.
  const MAX_LOADED = 30;
  const loaded = new Set(); // en orden: el primero es el que hace más que no se ve
  function releaseVideo(v) {
    loaded.delete(v);
    if (!v.getAttribute('src')) return;
    v.pause();
    v.removeAttribute('src');
    v.load();
  }
  const releaseIn = (root) => root.querySelectorAll('video').forEach(releaseVideo);
  function loadVideo(v) {
    if (!v.getAttribute('src') && v.dataset.src) v.src = v.dataset.src;
    loaded.delete(v);
    loaded.add(v);
    for (const old of loaded) {
      if (loaded.size <= MAX_LOADED) break;
      if (old._near && old.isConnected) continue; // el que está a la vista (o casi) no se suelta
      releaseVideo(old);
    }
  }
  // Si un video no carga (red o reproductor), se vuelve a intentar una vez, un momento después.
  function retryOnError(v, url) {
    v.addEventListener('error', () => {
      if (v._retried || !v.getAttribute('src')) return;
      v._retried = true;
      setTimeout(() => {
        if (!v.isConnected || !v.getAttribute('src')) return;
        v.src = url;
        v.load();
        if (!v._userPaused && (viewer ? v.closest('.viewer') : !v._thumb)) v.play().catch(() => {});
      }, 1500);
    });
  }
  const nearIO = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        const v = e.target;
        v._near = e.isIntersecting;
        if (e.isIntersecting && v.dataset.src) loadVideo(v);
      }
    },
    { rootMargin: '900px 0px' }
  );
  // Al volver a mostrar una página guardada, sus videos se vuelven a vigilar desde cero (si no, el
  // observador puede no avisar y el video a la vista no arranca).
  function reviveVideos(root) {
    root.querySelectorAll('video').forEach((v) => {
      if (!v.dataset.src) return;
      nearIO.unobserve(v);
      nearIO.observe(v);
      if (!v._thumb) {
        playIO.unobserve(v);
        playIO.observe(v);
      }
    });
  }
  // Lo que pausaste con un toque sigue pausado mientras esté a la vista; al irse, la próxima vez arranca solo.
  const playIO = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        const v = e.target;
        if (e.isIntersecting && e.intersectionRatio >= 0.6 && !viewer) {
          if (!v.getAttribute('src') && v.dataset.src) v.src = v.dataset.src;
          if (!v._userPaused) v.play().catch(() => {});
        } else {
          v.pause();
          if (!e.isIntersecting && v._userPaused) {
            v._userPaused = false;
            if (v.parentNode) v.parentNode.classList.remove('paused');
          }
        }
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
    v._thumb = !!thumb;
    if (!thumb) v.poster = RS.posterUrl(m);
    if (m.w && m.h) {
      v.width = m.w;
      v.height = m.h;
    }
    retryOnError(v, v.dataset.src);
    nearIO.observe(v);
    if (!thumb) playIO.observe(v);
    return v;
  }

  // Lo que ocupa el video dentro de su recuadro (se muestra entero, con bandas negras arriba y abajo
  // o a los lados): ahí está «el centro del video» para pausar en el feed.
  function videoBox(v) {
    const r = v.getBoundingClientRect();
    const vw = v.videoWidth || v.width;
    const vh = v.videoHeight || v.height;
    if (!vw || !vh || !r.width || !r.height) return v;
    const k = Math.min(r.width / vw, r.height / vh);
    const w = vw * k;
    const hh = vh * k;
    const left = r.left + (r.width - w) / 2;
    const top = r.top + (r.height - hh) / 2;
    return { getBoundingClientRect: () => ({ left, top, width: w, height: hh, right: left + w, bottom: top + hh }) };
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
    const own = !RS.isRg(p) && p.user && picOf('user', p.user);
    if (own) return putPic(h('span', { class: 'avatar' }), own);
    const c = colorFor(p.user || '?');
    const el = h('span', { class: 'avatar', style: { background: c[1] } }, (p.user || '?').charAt(0).toUpperCase());
    const url = RS.avatarUrl(p);
    if (url) {
      const img = new Image();
      img.alt = '';
      if (RS.isRg(p)) img.referrerPolicy = 'no-referrer'; // RedGifs rechaza el Referer de otro sitio
      img.onload = () => fill(el, img);
      img.src = url;
    }
    return el;
  }

  /**
   * Doble toque → dbl(); un toque → single(tap) (si se da). Ignora botones y enlaces.
   * tap = { y, ms }: dónde se tocó (alto de la pantalla) y cuánto duró el dedo apoyado.
   */
  function onTaps(el, dbl, single) {
    let last = 0;
    let timer = null;
    let downAt = 0;
    el.addEventListener('pointerdown', () => (downAt = Date.now()), { passive: true });
    el.addEventListener('click', (e) => {
      if (e.target.closest('button, a, input, .scrub')) return;
      const now = Date.now();
      if (now - last < 320) {
        clearTimeout(timer);
        timer = null;
        last = 0;
        dbl();
        return;
      }
      last = now;
      const tap = { y: e.clientY, ms: downAt ? now - downAt : 0 };
      if (single) timer = setTimeout(() => {
        timer = null;
        single(tap);
      }, 320);
    });
  }

  // Pausar es un toque rápido y en el centro: ni muy arriba ni muy abajo (así no se pausa sin querer
  // al buscar los botones de Android o al tocar cerca de los bordes). En pantalla completa cuenta la
  // pantalla (del 37,5 al 62,5 % del alto; en horizontal, del 35 al 55 %). En el feed (box = el
  // video) cuenta el video: la mitad central de su alto.
  const TAP_MS = 220;
  function pauseTap(tap, box) {
    if (!tap || tap.ms > TAP_MS) return false;
    if (box) {
      const r = box.getBoundingClientRect();
      return tap.y > r.top + r.height * 0.25 && tap.y < r.bottom - r.height * 0.25;
    }
    const H = window.innerHeight;
    const [top, bottom] = isLandscape() ? [0.35, 0.55] : [0.375, 0.625];
    return tap.y > H * top && tap.y < H * bottom;
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

  // Barra mínima de los GIF y los videos, en toda la app: una línea casi transparente a todo lo ancho.
  // Solo aparece mientras tocas la pantalla (y un momento después); se arrastra para ir a otro momento.
  // Con un video muestra además el tiempo, en chiquito.
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
      // GIF y videos: la barra mínima que aparece al tocar (en los videos, con el tiempo).
      const ctl = scrubBar(null);
      ctl.bind(v, !!m.real);
      ctl.watch(box);
      box.append(v, h('span', { class: 'vw-paused', 'aria-hidden': 'true' }, icon('play', 40)), badge, snd, ctl.el);
      watchAudio(v, () => {
        m.real = true;
        badge.textContent = 'VIDEO';
        snd.hidden = false;
        ctl.bind(v, true);
      });
      // Un toque rápido en el centro pausa (o sigue); dos toques, pantalla completa.
      onTaps(box, () => openViewer(feed, p, i), (tap) => pauseTap(tap, videoBox(v)) && togglePause(v, box));
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
      // Llegaron las carpetas de un hashtag bloqueado: Android las usa para los avisos.
      if (names.some(isBlocked)) syncNative();
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

  // Botón de hashtag: un toque lo abre; mantenerlo presionado abre su menú (openTagSheet).
  // (Es un botón y no un enlace: Android cancela la pulsación larga sobre los enlaces.)
  function tagButton(t, onOpen, parent) {
    return holdForMenu(
      h('button', { type: 'button', class: 'htag' + (isFollowedTag(t) ? ' fav' : ''), 'data-tag': t, draggable: 'false', onclick: onOpen }, '#' + t, parent ? h('small', { class: 'tparent', text: parent }) : null),
      t
    );
  }

  // Fila de hashtags de un post: lo más específico (hasta 4) y «+N» para ver todos.
  function tagsRow(p, onOpen, cls) {
    const open = onOpen || ((t) => nav('#/tag/' + enc(t)));
    const row = h('div', { class: cls || 'tags' });
    let all = false;
    row._draw = () => {
      // Las etiquetas de RedGifs no están en el árbol de JoyReactor: se muestran tal cual.
      const rg = RS.isRg(p);
      const complete = rg || !p.tags.some((t) => !RS.isFormatTag(t) && !knownTree(t));
      const shown = all ? p.tags.map((t) => ({ name: t, parent: null })) : rg ? p.tags.slice(0, TAGS_SHOWN).map((t) => ({ name: t, parent: null })) : leafTags(p.tags).slice(0, TAGS_SHOWN);
      const rest = p.tags.length - shown.length;
      fill(row,
        // Una etiqueta de RedGifs abre su página de RedGifs (sin el menú de JoyReactor al mantenerla).
        shown.map((x) =>
          rg
            ? h('button', { type: 'button', class: 'htag' + (rgTagOf(x.name) ? ' fav' : ''), draggable: 'false', onclick: () => (onOpen ? onOpen(x.name) : nav('#/rgtag/' + enc(x.name))) }, '#' + x.name)
            : tagButton(x.name, () => open(x.name), x.parent)
        ),
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

  // ---- Mantener presionado: llama a onFire si el dedo se queda quieto `ms`. Con el dedo usa los eventos
  // táctiles: en Android, al mantener una imagen el navegador cancela los de puntero para arrastrarla
  // (por eso no se podía seleccionar en Me gusta). Con el mouse, los de puntero. Mientras se espera, el
  // elemento lleva la clase `cls`; desplazar la página lo cancela, y el toque que termina una pulsación
  // larga no cuenta como un toque normal.
  let cancelHold = null;
  document.addEventListener('scroll', () => cancelHold && cancelHold(), { capture: true, passive: true });
  // ms: milisegundos, o una función que los da (un ajuste).
  function longPress(el, ms, cls, onFire, canStart) {
    let timer = null;
    let x0 = 0;
    let y0 = 0;
    let fired = false;
    let swallowUntil = 0;
    const cancel = () => {
      clearTimeout(timer);
      timer = null;
      el.classList.remove(cls);
      if (cancelHold === cancel) cancelHold = null;
    };
    const start = (x, y) => {
      if (canStart && !canStart()) return;
      cancel();
      fired = false;
      swallowUntil = 0;
      x0 = x;
      y0 = y;
      const dur = typeof ms === 'function' ? ms() : ms;
      el.style.setProperty('--hold', dur + 'ms');
      el.classList.add(cls);
      cancelHold = cancel;
      timer = setTimeout(() => {
        cancel();
        fired = true;
        buzz(30);
        onFire();
      }, dur);
    };
    const move = (x, y) => {
      if (timer && Math.hypot(x - x0, y - y0) > 12) cancel();
    };
    const end = () => {
      cancel();
      if (fired) swallowUntil = Date.now() + 600;
      fired = false;
    };
    el.addEventListener('touchstart', (e) => (e.touches.length === 1 ? start(e.touches[0].clientX, e.touches[0].clientY) : cancel()), { passive: true });
    el.addEventListener('touchmove', (e) => move(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
    el.addEventListener('touchend', end);
    el.addEventListener('touchcancel', end);
    el.addEventListener('pointerdown', (e) => e.pointerType === 'mouse' && !e.button && start(e.clientX, e.clientY));
    el.addEventListener('pointermove', (e) => e.pointerType === 'mouse' && move(e.clientX, e.clientY));
    for (const ev of ['pointerup', 'pointerleave']) el.addEventListener(ev, (e) => e.pointerType === 'mouse' && end());
    el.addEventListener(
      'click',
      (e) => {
        if (Date.now() > swallowUntil) return;
        swallowUntil = 0;
        e.preventDefault();
        e.stopImmediatePropagation();
      },
      true
    );
    el.addEventListener('contextmenu', (e) => e.preventDefault());
    el.addEventListener('dragstart', (e) => e.preventDefault());
    return el;
  }

  // Mantener presionado un hashtag medio segundo abre su menú (se ve una línea que se llena).
  const HOLD_MS = 500;
  function holdForMenu(el, tag) {
    return longPress(el, HOLD_MS, 'holding', () => openTagSheet(tag));
  }

  // ================================================================ Fotos propias
  //
  // A un usuario o a un hashtag que sigues como cuenta se le puede poner una imagen de sus posts, y a un
  // hashtag, un GIF o un video de los suyos (S.pics): tiene que ser de la misma cuenta (de sus posts o de tus
  // me gusta de ella; picPicker). Se recorta con un círculo y se guarda qué archivo y
  // qué parte, no una copia (ocupa casi nada y entra en el respaldo). Se elige desde el ⋯ de cada fila de
  // Seguidos, desde el ⋯ de la página del hashtag o al empezar a seguirlo (askPic). Los videos se mueven en
  // la página del hashtag y en las listas de Seguidos; en los demás lados se ven quietos (el primer
  // cuadro). Solo se reproducen los que están a la vista (picIO).
  const picKey = (kind, name) => kind + ':' + tkey(name);
  function picOf(kind, name) {
    if (!name) return null;
    let p = S.pics[picKey(kind, name)];
    if (!p && kind === 'tag') {
      const f = favOf(name) || tagProfileOf(name);
      if (f) p = S.pics[picKey('tag', f.name)];
    }
    return p || null;
  }
  const picIO = new IntersectionObserver((es) =>
    es.forEach((e) => {
      const v = e.target;
      if (e.isIntersecting) {
        if (!v.getAttribute('src')) v.src = v.dataset.src;
        if (!v.dataset.still) v.play().catch(() => {});
      } else if (v.getAttribute('src')) {
        v.pause();
        v.removeAttribute('src');
        v.load();
      }
    })
  );
  function releasePics(root) {
    root.querySelectorAll('video.cpicv').forEach((v) => {
      picIO.unobserve(v);
      v.pause();
      v.removeAttribute('src');
      v.load();
    });
  }
  // El recorte, en porcentajes del contenedor redondo (sirve para cualquier tamaño de foto).
  function picMedia(pic, animate) {
    const w = 100 / pic.s;
    const style = { position: 'absolute', width: w + '%', height: w * pic.r + '%', left: 50 - pic.cx * w + '%', top: 50 - pic.cy * w * pic.r + '%', maxWidth: 'none', objectFit: 'cover' };
    // Una foto quieta sacada de un GIF: el video detenido en ese momento (`frame`).
    if (pic.frame != null && pic.media.kind === 'video') {
      const v = document.createElement('video');
      v.className = 'cpicv';
      v.dataset.still = '1';
      v.muted = true;
      v.playsInline = true;
      v.setAttribute('muted', '');
      v.setAttribute('playsinline', '');
      // Se carga solo cuando está a la vista (picIO pone el src); sin reproducir, va al momento elegido.
      v.preload = 'auto';
      v.poster = RS.posterUrl(pic.media);
      v.dataset.src = RS.videoUrl(pic.media);
      Object.assign(v.style, style);
      v.addEventListener('loadedmetadata', () => (v.currentTime = pic.frame));
      picIO.observe(v);
      return v;
    }
    if (pic.len && animate) {
      const v = document.createElement('video');
      v.className = 'cpicv';
      v.muted = true;
      v.defaultMuted = true;
      v.playsInline = true;
      v.setAttribute('muted', '');
      v.setAttribute('playsinline', '');
      v.preload = 'none';
      v.poster = RS.posterUrl(pic.media);
      v.dataset.src = RS.videoUrl(pic.media);
      Object.assign(v.style, style);
      // Se repite solo el pedazo elegido.
      v.addEventListener('loadedmetadata', () => (v.currentTime = pic.start || 0));
      v.addEventListener('timeupdate', () => {
        if (v.currentTime >= (pic.start || 0) + pic.len || v.currentTime < (pic.start || 0) - 0.5) v.currentTime = pic.start || 0;
      });
      v.addEventListener('ended', () => {
        v.currentTime = pic.start || 0;
        v.play().catch(() => {});
      });
      picIO.observe(v);
      return v;
    }
    const img = h('img', { src: pic.len ? RS.posterUrl(pic.media) : RS.imageUrl(pic.media), alt: '', draggable: 'false' });
    Object.assign(img.style, style);
    return img;
  }
  function putPic(el, pic, animate) {
    el.classList.add('cpic');
    el.style.background = '#000';
    return fill(el, picMedia(pic, animate));
  }
  // ⋯ de cada fila de Seguidos: poner o cambiar la foto (usuario) o el GIF (hashtag), o quitarla.
  function rowMore(kind, name) {
    const user = kind === 'user' || kind === 'rguser';
    return h('button', { type: 'button', class: 'ib', 'aria-haspopup': 'dialog', 'aria-label': 'Más opciones de ' + (user ? '@' : '#') + name, onclick: () => {
      const own = picOf(kind, name);
      const want = picWant(kind, name);
      const sub = {
        image: 'Una imagen (o un GIF, quieto) de sus posts o de tus me gusta, recortada como quieras.',
        clip: 'Un pedazo de un GIF o video de sus posts o de tus me gusta, que se repite.'
      }[want];
      openSheet('Opciones de ' + (user ? '@' : '#') + name,
        h('div', { class: 'sheet-title', text: (user ? '@' : '#') + name }),
        sheetRow(want === 'clip' ? 'film' : 'camera', (own ? 'Cambiar ' : 'Poner ') + picWhat(want, true), sub, () => openPicSheet(kind, name)),
        own ? sheetRow('x', 'Quitar ' + picWhat(own.len ? 'clip' : 'image', true), kind === 'rguser' ? 'Vuelve la de RedGifs.' : user ? 'Vuelve la de JoyReactor.' : 'Vuelve la imagen del hashtag.', () => removePic(kind, own), 'danger') : null
      );
    } }, icon('dots', 22));
  }
  function removePic(kind, own) {
    closeSheet();
    delete S.pics[picKey(kind, own.name)];
    persist('pics', 0);
    toast('Quitaste ' + picWhat(own.len ? 'clip' : 'image', true), 'Deshacer', () => {
      S.pics[picKey(kind, own.name)] = own;
      persist('pics', 0);
      picsChanged();
    });
    picsChanged();
  }
  // Al empezar a seguir a alguien o un hashtag, la app pregunta si quieres ponerle foto.
  const askPic = (kind, name) => openPicSheet(kind, name, true);
  // Después de poner o quitar una foto: se vuelve a dibujar la página a la vista.
  function picsChanged() {
    route();
  }

  // Qué se le pone: a un usuario y a un hashtag que sigues como cuenta, una imagen; a un hashtag, un GIF o
  // video que se mueve. Eso distingue a los perfiles de los hashtags (lo pidió el usuario en la 1.7.1 y lo
  // repitió en la 1.8.1). Para una imagen también vale un GIF: queda quieto, en el momento que elijas (1.7.2).
  const picWant = (kind, name) =>
    kind === 'user' || kind === 'rguser' || (kind === 'rgtag' ? !!(rgTagOf(name) && rgTagOf(name).as === 'account') : tagProfileOf(name)) ? 'image' : 'clip';
  // Para elegir la foto de un creador o una etiqueta de RedGifs: sus posts, como las fuentes de JoyReactor.
  function rgPickSource(q) {
    const s = RS.createRgSource(q);
    const src = {
      posts: [],
      done: false,
      count: 0,
      seen: null,
      more: async () => {
        const got = await s.more();
        src.posts.push(...got);
        src.done = s.done;
      }
    };
    return src;
  }
  // Tus me gusta de RedGifs de un creador o con una etiqueta.
  const likedRg = (kind, name) =>
    Object.values(S.likes)
      .filter((x) => RS.isRg(x.post) && (kind === 'rguser' ? tkey(x.post.user || '') === tkey(name) : x.post.tags.some((t) => tkey(t) === tkey(name))))
      .sort((a, b) => b.at - a.at);
  const mediaFits = (m, want) => (want === 'clip' ? m.kind === 'video' : m.kind === 'image' || m.kind === 'video');
  const picWhat = (want, the) => ({ image: the ? 'la foto' : 'una foto', clip: the ? 'el GIF' : 'un GIF' })[want];
  // Las candidatas que vas marcando, por cuenta, mientras la app está abierta.
  const picCandidates = new Map();

  // Para elegir: «Sus posts» (todos, se van pidiendo al bajar; los GIF de un hashtag salen de lo mismo que
  // usa su pestaña Videos y GIF) o «Tus me gusta» de esa cuenta. Tocar una la marca como candidata (con
  // una bolita); en «Elegidas» quedan solo las marcadas y ahí se toca la definitiva. Con una sola marcada,
  // «Usar esta» va directo a recortarla.
  function picPicker(kind, name, want, onPick, first) {
    const user = kind === 'user' || kind === 'rguser';
    const key = picKey(kind, name);
    const chosen = picCandidates.get(key) || new Map();
    picCandidates.set(key, chosen);
    const grid = h('div', { class: 'pickgrid' });
    const status = h('div', { class: 'pickstatus' });
    const sentinel = h('div', { class: 'picksentinel' });
    const bar = h('div', { class: 'pickbar' });
    // Imágenes y GIF juntos, en el mismo orden que en su feed (lo pidió el usuario en la 1.8.0).
    const body = h('div', {}, grid, status, sentinel);
    const put = (list) => grid.append(...list.map(cell));
    const clear = () => {
      grid.querySelectorAll('video').forEach(stopVideo);
      fill(grid);
    };
    let tab = 'posts';
    let io = null;
    const mid = (x) => String(x.m.id);
    const cell = (x) => {
      const b = h('button', { type: 'button', class: 'pick' + (chosen.has(mid(x)) ? ' picked' : ''), 'aria-pressed': String(chosen.has(mid(x))), 'aria-label': 'Marcar como candidata', onclick: () => {
        if (chosen.has(mid(x))) chosen.delete(mid(x));
        else chosen.set(mid(x), x);
        const on = chosen.has(mid(x));
        b.classList.toggle('picked', on);
        b.setAttribute('aria-pressed', String(on));
        drawTabs();
        drawBar();
      } },
        h('img', { src: x.m.kind === 'image' ? RS.imageUrl(x.m) : RS.posterUrl(x.m), alt: '', draggable: 'false' }),
        x.m.kind === 'video' ? h('span', { class: 'tb', text: 'GIF' }) : null,
        h('span', { class: 'selmark', 'aria-hidden': 'true' }, icon('check', 16))
      );
      return b;
    };
    // En «Elegidas», más grandes y, para un hashtag, con los GIF moviéndose para compararlos (lo pidió el
    // usuario en la 1.8.0; para una foto, que queda quieta, se ven quietos): tocar una la recorta; la ✕ la desmarca.
    const liveGif = (m) => {
      const v = document.createElement('video');
      v.muted = true;
      v.defaultMuted = true;
      v.loop = true;
      v.autoplay = true;
      v.playsInline = true;
      v.setAttribute('muted', '');
      v.setAttribute('playsinline', '');
      v.preload = 'auto';
      v.poster = RS.posterUrl(m);
      v.src = RS.videoUrl(m);
      // Respaldo del autoplay (a veces no arranca solo).
      v.addEventListener('canplay', () => v.paused && v.play().catch(() => {}), { once: true });
      return v;
    };
    const finalCell = (x) =>
      h('div', { class: 'pickfinal' },
        h('button', { type: 'button', class: 'pick big', 'aria-label': 'Usar esta', onclick: () => onPick(x.m, x.post) },
          x.m.kind === 'video' && want === 'clip' ? liveGif(x.m) : h('img', { src: x.m.kind === 'image' ? RS.imageUrl(x.m) : RS.posterUrl(x.m), alt: '', draggable: 'false' }),
          x.m.kind === 'video' ? h('span', { class: 'tb', text: 'GIF' }) : null
        ),
        h('button', { type: 'button', class: 'pickx', 'aria-label': 'Desmarcar', onclick: () => {
          chosen.delete(mid(x));
          drawTabs();
          showChosen();
        } }, icon('x', 16))
      );
    const fromPosts = (posts) => {
      const out = [];
      for (const p of posts) {
        if (!p || RS.isJunk(p)) continue;
        for (const m of p.media) if (mediaFits(m, want)) out.push({ m, post: p.id });
      }
      return out;
    };

    // Sus posts: se piden de a poco y se agregan al llegar al final.
    const src =
      kind === 'rguser'
        ? rgPickSource({ user: name, order: 'latest' })
        : kind === 'rgtag'
          ? rgPickSource({ tags: name, order: 'top' })
          : user
            ? RS.createUserSource(name, junkScan(userJunkKey(name)))
            : RS.createTagSource(name, 'ALL', junkScan(tagJunkKey(name)), want === 'clip' ? RS.isAnimated : null);
    let cursor = 0;
    let shown = 0;
    let loading = false;
    async function loadMore() {
      if (loading || tab !== 'posts' || src.done) return;
      loading = true;
      fill(status, icon('spinner', 18, 'spin'), want === 'clip' ? 'Buscando GIF y videos…' : 'Buscando imágenes y GIF…');
      try {
        // Hasta encontrar una tanda (o revisar bastante): los hashtags grandes tienen pocos GIF por página.
        let added = 0;
        for (let round = 0; round < 6 && added < 12 && !src.done; round++) {
          await src.more(want === 'clip' ? 6 : 3);
          const list = fromPosts(src.posts.slice(cursor));
          cursor = src.posts.length;
          added += list.length;
          if (tab === 'posts') put(list);
        }
        shown += added;
        const seen = src.seen != null ? src.seen : src.posts.length;
        fill(status,
          src.done
            ? (shown ? 'No hay más.' : want === 'clip' ? 'No encontré GIF ni videos.' : 'No encontré imágenes ni GIF.')
            : want === 'clip' && src.count ? 'Revisé ' + fmt(seen) + ' de ' + fmt(src.count) + ' posts. Baja para ver más.' : 'Baja para ver más.'
        );
      } catch (e) {
        fill(status, errText(e), ' ', h('button', { type: 'button', class: 'link-btn', onclick: () => loadMore() }, 'Reintentar'));
      }
      loading = false;
      // Si todavía no se llena la pantalla, se sigue pidiendo.
      if (tab === 'posts' && !src.done && io && sentinel.getBoundingClientRect().top < window.innerHeight + 200) setTimeout(loadMore, 0);
    }
    const showPosts = () => {
      grid.className = 'pickgrid';
      clear();
      put(fromPosts(src.posts));
      fill(status);
      loadMore();
    };
    const showLiked = () => {
      grid.className = 'pickgrid';
      const liked = (kind === 'rguser' || kind === 'rgtag' ? likedRg(kind, name) : user ? likedFrom(name) : likedWithTag(name)).map((x) => x.post);
      const list = fromPosts(liked);
      clear();
      put(list);
      fill(status, list.length ? '' : 'Todavía no le diste me gusta a ' + (want === 'clip' ? 'GIF' : 'imágenes ni GIF') + ' de ' + (user ? '@' : '#') + name + '.');
    };
    function showChosen() {
      grid.className = 'pickgrid two';
      const list = Array.from(chosen.values());
      clear();
      fill(grid, ...list.map(finalCell));
      fill(status, list.length ? 'Toca la definitiva para recortarla.' : 'Todavía no marcaste ninguna. En «Sus posts» o «Tus me gusta», toca las que te gusten.');
    }
    const go = (id) => {
      tab = id;
      drawTabs();
      drawBar();
      if (id === 'posts') showPosts();
      else if (id === 'liked') showLiked();
      else showChosen();
    };
    const tabs = h('div', { class: 'ptabs picktabs', role: 'tablist' });
    function drawTabs() {
      fill(tabs,
        [['posts', 'grid', 'Sus posts'], ['liked', 'heart', 'Tus me gusta'], ['chosen', 'check', 'Elegidas' + (chosen.size ? ' · ' + chosen.size : '')]].map(([id, ic, label]) =>
          h('button', { type: 'button', class: 'ptab' + (tab === id ? ' on' : ''), role: 'tab', 'aria-selected': String(tab === id), onclick: () => tab !== id && go(id) }, icon(ic, 18), label)
        )
      );
    }
    // Abajo, mientras hay marcadas: con una, «Usar esta»; con varias, «Comparar».
    function drawBar() {
      const n = chosen.size;
      bar.hidden = !n || tab === 'chosen';
      if (bar.hidden) return fill(bar);
      fill(bar,
        h('span', { class: 'grow', text: n === 1 ? '1 marcada' : n + ' marcadas' }),
        n === 1
          ? h('button', { type: 'button', class: 'btn', onclick: () => {
              const x = chosen.values().next().value;
              onPick(x.m, x.post);
            } }, 'Usar esta')
          : h('button', { type: 'button', class: 'btn', onclick: () => go('chosen') }, 'Comparar ' + n)
      );
    }
    drawTabs();
    drawBar();
    // Se llama cuando el menú ya está en pantalla (el desplazamiento es el del menú).
    const start = () => {
      const pan = body.closest('.sheet-pan');
      io = new IntersectionObserver((es) => es.some((e) => e.isIntersecting) && loadMore(), { root: pan, rootMargin: '0px 0px 600px 0px' });
      io.observe(sentinel);
      // Respaldo del observador: al acercarse al final del menú.
      if (pan) pan.addEventListener('scroll', () => pan.scrollTop + pan.clientHeight > pan.scrollHeight - 600 && loadMore(), { passive: true });
      if (first === 'chosen' && chosen.size) go('chosen');
      else showPosts();
    };
    return { tabs, body, bar, start };
  }

  // ask: se abre al empezar a seguirlo («¿Le pones una foto?», con «Ahora no»).
  // first: 'chosen' abre en «Elegidas» (al cancelar el recorte se vuelve aquí, con las marcadas).
  function openPicSheet(kind, name, ask, first) {
    const own = picOf(kind, name);
    const user = kind === 'user' || kind === 'rguser';
    const want = picWant(kind, name);
    const who = (user ? '@' : '#') + name;
    const what = picWhat(want);
    const title = (want === 'clip' ? 'GIF de ' : 'Foto de ') + who;
    const howTo = {
      image: 'Toca las imágenes que te gusten (o un GIF, que queda quieto) y después elige la definitiva',
      clip: 'Toca los GIF que te gusten y después elige el definitivo'
    }[want];
    const picker = picPicker(kind, name, want, (m, post) => {
      closeSheet();
      openCropper(kind, name, m, post, want, () => openPicSheet(kind, name, ask, (picCandidates.get(picKey(kind, name)) || new Map()).size > 1 ? 'chosen' : null));
    }, first);
    openSheet(title,
      h('div', { class: 'sheet-title sheet-title-row' },
        h('span', { class: 'grow', text: ask ? '¿Le pones ' + what + ' a ' + who + '?' : title }),
        ask ? h('button', { type: 'button', class: 'link-btn', onclick: () => closeSheet() }, 'Ahora no') : null
      ),
      h('span', { class: 'sheet-label', text: howTo + (ask ? '. También puedes hacerlo después, desde el ⋯ de Seguidos.' : '.') }),
      !ask && own ? sheetRow('x', 'Quitar ' + picWhat(own.len ? 'clip' : 'image', true), kind === 'rguser' ? 'Vuelve la de RedGifs.' : user ? 'Vuelve la de JoyReactor.' : 'Vuelve la imagen del hashtag.', () => removePic(kind, own), 'danger') : null,
      picker.tabs,
      picker.body,
      picker.bar
    );
    picker.start();
  }

  // ---- Recortar: la imagen (o el video) con un círculo encima. Se arrastra con un dedo y se acerca con
  // dos o con la barra; en los videos se elige desde dónde y cuántos segundos se repiten.
  let cropper = null;
  function closeCropper() {
    if (!cropper) return false;
    const c = cropper;
    cropper = null;
    c.el.querySelectorAll('video').forEach((v) => {
      v.pause();
      v.removeAttribute('src');
      v.load();
    });
    c.el.remove();
    document.body.classList.remove('noscroll');
    return true;
  }
  // Cancelar (✕ o «atrás»): vuelve a elegir.
  function cancelCropper() {
    const c = cropper;
    if (!closeCropper()) return false;
    if (c.onCancel) c.onCancel();
    return true;
  }
  // want: 'clip' (un pedazo que se repite) o 'image' (una imagen; si es un GIF, el momento elegido, quieto).
  function openCropper(kind, name, m, postId, want, onCancel) {
    closeCropper();
    const isVid = m.kind === 'video';
    const still = isVid && want === 'image';
    const B = Math.min(window.innerWidth - 32, 420); // lado del cuadro
    const C = Math.round(B * 0.8); // diámetro del círculo
    const st = { x: 0, y: 0, z: 1, r: m.w && m.h ? m.h / m.w : 1, start: 0, len: 2, dur: 0 };
    let media;
    if (isVid) {
      media = document.createElement('video');
      media.muted = true;
      media.playsInline = true;
      media.setAttribute('muted', '');
      media.setAttribute('playsinline', '');
      media.autoplay = !still;
      media.preload = 'auto';
      media.src = RS.videoUrl(m);
      media.addEventListener('loadedmetadata', () => {
        st.r = media.videoHeight && media.videoWidth ? media.videoHeight / media.videoWidth : st.r;
        st.dur = media.duration || 0;
        layout(true);
        drawTime();
      });
      media.addEventListener('timeupdate', () => {
        if (!still && (media.currentTime >= st.start + st.len || media.currentTime < st.start - 0.5)) media.currentTime = st.start;
      });
      media.addEventListener('ended', () => {
        if (still) return;
        media.currentTime = st.start;
        media.play().catch(() => {});
      });
      // Respaldo del autoplay (a veces no arranca solo).
      if (!still) media.addEventListener('canplay', () => media.paused && media.play().catch(() => {}), { once: true });
    } else {
      media = h('img', { src: RS.imageUrl(m), alt: '', draggable: 'false' });
      media.addEventListener('load', () => {
        if (media.naturalWidth) st.r = media.naturalHeight / media.naturalWidth;
        layout(true);
      });
    }
    media.className = 'crop-media';
    const box = h('div', { class: 'crop-box', style: { width: B + 'px', height: B + 'px' } }, media,
      h('span', { class: 'crop-mask', style: { width: C + 'px', height: C + 'px', left: (B - C) / 2 + 'px', top: (B - C) / 2 + 'px' } })
    );
    // Empieza con el círculo lleno (zCover) y se puede alejar hasta que entre todo (zFit: lo que sobra del
    // círculo queda negro) o acercar hasta 4 veces.
    const zCover = () => Math.max(C / B, C / (B * st.r));
    const zFit = () => Math.min(C / B, C / (B * st.r));
    const zoom = h('input', { type: 'range', min: '0', max: '1', step: '0.001', value: '0', 'aria-label': 'Alejar o acercar' });
    let started = false;
    const layout = (reset) => {
      if (reset && !started) {
        st.z = zCover();
        started = true;
      }
      st.z = Math.min(Math.max(st.z, zFit()), zCover() * 4);
      const W = B * st.z;
      const H = W * st.r;
      const mx = Math.abs(W - C) / 2;
      const my = Math.abs(H - C) / 2;
      st.x = Math.max(-mx, Math.min(mx, st.x));
      st.y = Math.max(-my, Math.min(my, st.y));
      Object.assign(media.style, { width: W + 'px', height: H + 'px', left: (B - W) / 2 + st.x + 'px', top: (B - H) / 2 + st.y + 'px' });
      // La barra va en escala logarítmica: el medio queda cerca de «el círculo lleno».
      zoom.value = String(Math.log(st.z / zFit()) / Math.log((zCover() * 4) / zFit()));
    };
    zoom.addEventListener('input', () => {
      st.z = zFit() * Math.pow((zCover() * 4) / zFit(), Number(zoom.value));
      layout();
    });
    // Un dedo arrastra; dos acercan o alejan.
    const pts = new Map();
    let g = null;
    const snap = () => {
      const [a, b] = Array.from(pts.values());
      g = a ? { x: st.x, y: st.y, z: st.z, ax: a.x, ay: a.y, d: b ? Math.hypot(b.x - a.x, b.y - a.y) : 0 } : null;
    };
    box.addEventListener('pointerdown', (e) => {
      try {
        box.setPointerCapture(e.pointerId);
      } catch (err) {
        /* el dedo ya se levantó */
      }
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      snap();
    });
    box.addEventListener('pointermove', (e) => {
      if (!pts.has(e.pointerId) || !g) return;
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      const [a, b] = Array.from(pts.values());
      if (b && g.d) st.z = g.z * (Math.hypot(b.x - a.x, b.y - a.y) / g.d);
      else {
        st.x = g.x + a.x - g.ax;
        st.y = g.y + a.y - g.ay;
      }
      layout();
    });
    const lift = (e) => {
      pts.delete(e.pointerId);
      snap();
    };
    box.addEventListener('pointerup', lift);
    box.addEventListener('pointercancel', lift);

    // Videos: desde dónde y cuántos segundos (o, para una foto, en qué momento).
    const startIn = h('input', { type: 'range', min: '0', max: '0', step: '0.05', value: '0', 'aria-label': still ? 'Momento' : 'Desde dónde' });
    const timeTxt = h('span', { class: 'crop-time' });
    const drawTime = () => {
      startIn.max = String(Math.max(0, still ? st.dur - 0.05 : st.dur - st.len));
      startIn.value = String(st.start);
      timeTxt.textContent = still ? 'Momento: ' + st.start.toFixed(1).replace('.', ',') + ' s' : 'Desde ' + st.start.toFixed(1).replace('.', ',') + ' s · ' + st.len + ' s';
    };
    startIn.addEventListener('input', () => {
      st.start = Number(startIn.value);
      media.currentTime = st.start;
      drawTime();
    });
    if (still) media.addEventListener('loadedmetadata', () => media.pause());
    const lens = isVid && !still
      ? seg([[1, '1 s'], [2, '2 s'], [3, '3 s']], st.len, (v) => {
          st.len = v;
          st.start = Math.min(st.start, Math.max(0, st.dur - v));
          media.currentTime = st.start;
          drawTime();
        })
      : null;

    const save = () => {
      const W = B * st.z;
      const H = W * st.r;
      const canon = kind === 'tag' ? (favOf(name) || tagProfileOf(name) || { name }).name : name;
      S.pics[picKey(kind, canon)] = Object.assign(
        { name: canon, kind, media: { id: m.id, ext: m.ext, kind: m.kind, rg: m.rg }, post: postId, cx: 0.5 - st.x / W, cy: 0.5 - st.y / H, s: C / W, r: st.r, at: Date.now() },
        still ? { frame: st.start } : isVid ? { start: st.start, len: st.len } : {}
      );
      persist('pics', 0);
      // Ya está la definitiva: las demás marcadas se descartan.
      picCandidates.delete(picKey(kind, name));
      closeCropper();
      toast(isVid && !still ? 'Listo: #' + canon + ' tiene su GIF' : 'Listo: ' + (kind === 'user' || kind === 'rguser' ? '@' : '#') + canon + ' tiene tu foto');
      picsChanged();
    };
    const el = h('div', { class: 'cropper', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Recortar la foto' },
      h('header', { class: 'top' },
        h('button', { class: 'ib', 'aria-label': 'Cancelar', onclick: () => cancelCropper() }, icon('x', 24)),
        h('h1', { text: 'Recortar' }),
        h('button', { class: 'pill primary', onclick: save }, 'Guardar')
      ),
      h('div', { class: 'crop-body' },
        box,
        h('label', { class: 'crop-row' }, icon('search', 18), zoom),
        isVid ? [h('label', { class: 'crop-row' }, icon('film', 18), startIn), h('div', { class: 'crop-row' }, timeTxt, lens)] : null,
        h('p', { class: 'crop-hint', text: still ? 'Elige el momento del GIF con la segunda barra: queda como una imagen quieta. Arrastra con un dedo; aleja o acerca con dos o con la primera barra.' : isVid ? 'Arrastra con un dedo; aleja o acerca con dos o con la barra (alejando entra el GIF entero). Elige desde dónde y cuántos segundos se repiten.' : 'Arrastra con un dedo; aleja o acerca con dos o con la barra.' })
      )
    );
    document.body.append(el);
    document.body.classList.add('noscroll');
    cropper = { el, onCancel };
    layout(true);
    if (isVid) drawTime();
  }

  // ================================================================ Tú (Seguidos y Favoritos juntos)
  //
  // Como el perfil de Instagram: arriba tus números; abajo, en cuadrícula, tus me gusta (con tus
  // carpetas) y el historial.
  // Arriba, cuatro números (lo pidió el usuario en la 1.8.0): cuentas seguidas (usuarios y hashtags que
  // sigues como cuenta), hashtags seguidos, me gusta e historial. Los dos primeros abren Seguidos; me gusta
  // e historial cambian la cuadrícula de abajo, como sus pestañas (active: la que se ve). La fila de
  // círculos con lo que sigues se quitó en la 1.8.3 (lo pidió el usuario).
  function meHeader(active) {
    const nRgTags = Object.values(S.rgTags).filter((t) => t.as === 'tag').length;
    const nTags = Object.keys(S.favorites).length + nRgTags;
    const nProf = Object.keys(S.following).length + Object.keys(S.tagProfiles).length + Object.keys(S.rgFollowing).length + Object.keys(S.rgTags).length - nRgTags;
    const nLikes = Object.keys(S.likes).length;
    const nHist = historyList().length;
    const stat = (n, one, many, href, tab) =>
      h('a', {
        class: 'mestat' + (tab && tab === active ? ' on' : ''),
        href,
        'aria-current': tab && tab === active ? 'page' : null,
        onclick: tab
          ? (e) => {
              e.preventDefault();
              if (tab !== active) navReplace(href);
            }
          : null
      }, h('b', { text: fmt(n) }), h('span', { text: n === 1 ? one : many }));
    return h('section', { class: 'mehead' },
      h('div', { class: 'mestats' },
        stat(nProf, 'cuenta', 'cuentas', '#/following?tab=users'),
        stat(nTags, 'hashtag', 'hashtags', '#/following'),
        stat(nLikes, 'me gusta', 'me gusta', '#/likes', 'likes'),
        stat(nHist, 'historial', 'historial', '#/history', 'history')
      )
    );
  }

  // ---- Tus carpetas en Me gusta (S.folders: id -> { id, name, ids, at }). Un post puede estar en varias y
  // sigue en Todos. Se llenan seleccionando varios (mantener presionada una miniatura) y tocando Mover.
  const folderList = () => Object.values(S.folders).sort((a, b) => a.at - b.at);
  const folderIds = (f) => f.ids.filter((id) => S.likes[id]);
  function makeFolder(name) {
    const id = 'f' + Date.now().toString(36);
    S.folders[id] = { id, name, ids: [], at: Date.now() };
    persist('folders', 0);
    return S.folders[id];
  }
  // Pide un nombre (carpeta nueva o renombrar), en el menú que sube desde abajo.
  function askName(title, value, onOk) {
    const input = h('input', { class: 'input', type: 'text', value: value || '', placeholder: 'Nombre de la carpeta', maxlength: '40', 'aria-label': 'Nombre de la carpeta', enterkeyhint: 'done', autocomplete: 'off' });
    const ok = () => {
      const v = input.value.trim();
      if (!v) return input.focus();
      closeSheet();
      onOk(v);
    };
    input.addEventListener('keydown', (e) => e.key === 'Enter' && ok());
    openSheet(title, h('div', { class: 'sheet-title', text: title }), h('div', { class: 'sheet-form' }, input, h('button', { class: 'btn', onclick: ok }, 'Listo')));
    setTimeout(() => input.focus(), 80);
  }
  function folderCover(ids) {
    const posts = ids.map((id) => S.likes[id] && S.likes[id].post).filter(Boolean).slice(0, 4);
    return h('span', { class: 'fcov' + (posts.length > 1 ? ' four' : '') }, posts.length ? posts.map((p) => thumbMedia(p.media[0]) || h('span')) : icon('folder', 22));
  }
  // Fila de carpetas arriba de Me gusta: Todos, las tuyas y «Nueva».
  function folderStrip(active) {
    const all = Object.values(S.likes).sort((a, b) => b.at - a.at).map((x) => x.post.id);
    const tile = (f) => {
      const ids = f ? folderIds(f) : all;
      const on = f ? active === f.id : !active;
      const href = f ? '#/likes?folder=' + f.id : '#/likes';
      return h('a', { class: 'ftile' + (on ? ' on' : ''), href, 'aria-current': on ? 'true' : null, onclick: (e) => {
        e.preventDefault();
        if (!on) navReplace(href);
      } }, folderCover(ids), h('b', { text: f ? f.name : 'Todos' }), h('small', { text: fmt(ids.length) }));
    };
    return h('nav', { class: 'folders', 'aria-label': 'Tus carpetas' },
      tile(null),
      folderList().map(tile),
      h('button', { type: 'button', class: 'ftile new', onclick: () => askName('Nueva carpeta', '', (name) => {
        const f = makeFolder(name);
        navReplace('#/likes?folder=' + f.id);
        toast('Carpeta creada. En Todos, mantén presionada una miniatura, elige posts y toca Mover.');
      }) }, h('span', { class: 'fcov' }, icon('plus', 22)), h('b', { text: 'Nueva' }), h('small', { text: 'carpeta' }))
    );
  }
  // Dentro de una carpeta: su nombre y ⋯ (renombrar o borrarla; los posts siguen en Me gusta).
  function folderBar(f) {
    const n = folderIds(f).length;
    return h('div', { class: 'fbar' },
      h('span', { class: 'grow', text: f.name + ' · ' + (n === 1 ? '1 post' : fmt(n) + ' posts') }),
      h('button', { class: 'ib', 'aria-haspopup': 'dialog', 'aria-label': 'Opciones de la carpeta ' + f.name, onclick: () =>
        openSheet('Carpeta ' + f.name,
          h('div', { class: 'sheet-title', text: f.name }),
          sheetRow('folder', 'Cambiar el nombre', null, () => {
            closeSheet();
            askName('Nombre de la carpeta', f.name, (name) => {
              f.name = name;
              persist('folders', 0);
              route();
            });
          }),
          sheetRow('trash', 'Borrar la carpeta', 'Los posts siguen en Me gusta.', () => {
            closeSheet();
            delete S.folders[f.id];
            persist('folders', 0);
            navReplace('#/likes');
            toast('Borraste la carpeta «' + f.name + '»', 'Deshacer', () => {
              S.folders[f.id] = f;
              persist('folders', 0);
              navReplace('#/likes?folder=' + f.id);
            });
          }, 'danger')
        ) }, icon('dots', 22))
    );
  }
  // Mover lo seleccionado a una carpeta (desde otra carpeta, sale de esa).
  function moveSelected(feed, from) {
    const ids = Array.from(feed.sel);
    if (!ids.length) return;
    const what = ids.length === 1 ? '1 post' : ids.length + ' posts';
    const put = (f) => {
      closeSheet();
      f.ids = Array.from(new Set(f.ids.concat(ids)));
      if (from) from.ids = from.ids.filter((id) => !ids.includes(id));
      persist('folders', 0);
      endSelect(feed);
      if (from) ids.forEach((id) => feed.drop(id));
      else if (current && current.feed === feed) feed.refresh();
      toast(what + ' en «' + f.name + '»', 'Ver', () => nav('#/likes?folder=' + f.id));
    };
    openSheet('Mover a una carpeta',
      h('div', { class: 'sheet-title', text: 'Mover ' + what + ' a…' }),
      folderList().filter((f) => !from || f.id !== from.id).map((f) => sheetRow('folder', f.name, fmt(folderIds(f).length) + ' posts', () => put(f))),
      sheetRow('plus', 'Nueva carpeta', null, () => {
        closeSheet();
        askName('Nueva carpeta', '', (name) => put(makeFolder(name)));
      })
    );
  }
  // Quitar lo seleccionado de la carpeta (siguen en Me gusta).
  function unfileSelected(feed, f) {
    const ids = Array.from(feed.sel);
    if (!ids.length) return;
    f.ids = f.ids.filter((id) => !ids.includes(id));
    persist('folders', 0);
    endSelect(feed);
    ids.forEach((id) => feed.drop(id));
    toast((ids.length === 1 ? 'Quitaste 1 post' : 'Quitaste ' + ids.length + ' posts') + ' de «' + f.name + '»', 'Deshacer', () => {
      f.ids = Array.from(new Set(f.ids.concat(ids)));
      persist('folders', 0);
      route();
    });
  }

  // ---- Menú que sube desde abajo. Tocar fuera, «atrás» o Esc lo cierra.
  let sheetEl = null;
  function openSheet(label, ...kids) {
    closeSheet();
    const el = h('div', { class: 'sheet', role: 'dialog', 'aria-modal': 'true', 'aria-label': label },
      h('div', { class: 'sheet-pan' }, h('span', { class: 'sheet-grab', 'aria-hidden': 'true' }), ...kids)
    );
    el.addEventListener('click', (e) => e.target === el && closeSheet());
    document.body.append(el);
    void el.offsetWidth; // para que se vea subir (sin requestAnimationFrame, que se congela si no se ve)
    el.classList.add('open');
    sheetEl = el;
    return el;
  }
  function closeSheet() {
    if (!sheetEl) return false;
    const el = sheetEl;
    sheetEl = null;
    el.classList.remove('open');
    // Los GIF que se mueven dentro (las Elegidas del selector de foto) sueltan su reproductor.
    el.querySelectorAll('video').forEach(stopVideo);
    setTimeout(() => el.remove(), 220);
    return true;
  }
  function stopVideo(v) {
    v.pause();
    v.removeAttribute('src');
    v.load();
  }
  document.addEventListener('keydown', (e) => e.key === 'Escape' && (closePicZoom() || closeSheet()));

  // ---- Foto de perfil en grande (1.8.2): tocar la foto de la cabecera de un usuario, un hashtag o una
  // cuenta la abre en un círculo grande (el GIF de un hashtag, moviéndose); un toque, «atrás» o Esc la cierran.
  let zoomEl = null;
  function closePicZoom() {
    if (!zoomEl) return false;
    const el = zoomEl;
    zoomEl = null;
    releasePics(el);
    el.remove();
    return true;
  }
  function zoomable(el, make) {
    el.classList.add('zoomable');
    el.setAttribute('role', 'button');
    el.setAttribute('tabindex', '0');
    el.setAttribute('aria-label', 'Ver la foto en grande');
    const open = () => {
      closePicZoom();
      zoomEl = h('div', { class: 'piczoom', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Foto de perfil', onclick: () => closePicZoom() }, make());
      document.body.append(zoomEl);
    };
    el.addEventListener('click', open);
    el.addEventListener('keydown', (e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), open()));
    return el;
  }
  const sheetRow = (ic, label, sub, onclick, cls, right) =>
    h('button', { type: 'button', class: 'sheet-row' + (cls ? ' ' + cls : ''), onclick },
      icon(ic, 22),
      h('span', { class: 'grow' }, h('span', { class: 'sr-l', text: label }), sub ? h('span', { class: 'sr-s', text: sub }) : null),
      right || null
    );

  // ---- Un hashtag se sigue de dos formas: como hashtag (S.favorites: se ve barajado y entra en tu
  // Aleatorio y en las historias de Inicio) o como cuenta (S.tagProfiles: se ve como un perfil, en orden
  // y en miniaturas, y lo nuevo va primero en Inicio). Las dos salen en Seguidos.
  function followedAs(name, info) {
    const fav = favOf(name) || (info && favOf(info.name)) || null;
    const prof = tagProfileOf(name) || (info && tagProfileOf(info.name)) || null;
    return { fav, prof };
  }
  const isFollowedTag = (t) => !!(favOf(t) || tagProfileOf(t));

  /** as: 'tag' (como hashtag), 'account' (como cuenta) o null (dejar de seguir). */
  async function followTagAs(name, as, notify) {
    let info;
    try {
      info = await RS.fetchTagInfo(name);
    } catch (e) {
      toast(errText(e));
      return;
    }
    if (!info) return toast('No existe el hashtag «' + name + '»');
    const { fav, prof } = followedAs(name, info);
    const before = followSnapshot(fav, prof);
    // Al cambiar de forma se conserva la campanita.
    const bell = !!(notify || (fav && fav.notify) || (prof && prof.notify));
    if (fav && as !== 'tag') removeFavorite(fav.name);
    if (prof && as !== 'account') setTagProfile(prof.name, info, false);
    if (as === 'tag' && !fav) {
      if (!(await addFavorite(name, bell ? { notify: true } : null))) return;
    }
    if (as === 'account' && !prof) {
      setTagProfile(name, info, true);
      if (bell) setProfileNotify(info.name, true, true);
    }
    const avisos = notify ? (S.settings.notify ? ' y te avisaré de posts nuevos' : ' (los avisos están desactivados en Ajustes)') : '';
    if (as === 'tag') toast('Sigues #' + info.name + ' como hashtag' + avisos);
    else if (as === 'account') toast('Sigues #' + info.name + ' como cuenta' + avisos + ': está en Seguidos › Perfiles');
    else {
      toast('Dejaste de seguir #' + info.name, 'Deshacer', () => {
        restoreFollow(before);
        followChanged(name, !!before.prof, info.name);
      });
    }
    followChanged(name, !!prof !== (as === 'account'), info.name);
    if (as && !fav && !prof) askPic('tag', info.name);
  }
  // Cómo lo seguías, para Deshacer (restoreFollow).
  const followSnapshot = (fav, prof) => ({
    fav: fav && Object.assign({}, fav),
    mix: fav && S.mix.sources[fav.name] ? Object.assign({}, S.mix.sources[fav.name]) : null,
    prof: prof && Object.assign({}, prof)
  });
  function restoreFollow(b) {
    if (b.fav) {
      S.favorites[b.fav.name] = b.fav;
      S.mix.sources[b.fav.name] = b.mix || { on: true, w: 5 };
      refreshFavIndex();
      persist('favorites');
      persist('mix');
      invalidateRandom();
    }
    if (b.prof) {
      S.tagProfiles[tkey(b.prof.name)] = b.prof;
      persist('tagProfiles', 0);
      invalidateHome();
    }
  }
  // Después de seguir o dejar de seguir un hashtag se pintan sus etiquetas y, si estás en su página, se
  // redibuja la cabecera; si pasó a ser cuenta (o dejó de serlo) se vuelve a abrir, que cambia la vista.
  function followChanged(name, kindChanged, canon) {
    document.querySelectorAll('[data-tag]').forEach((a) => a.classList.toggle('fav', isFollowedTag(a.dataset.tag)));
    document.querySelectorAll('[data-follow-tag]').forEach((b) => b._paint && b._paint());
    if (pageFollowHook) pageFollowHook();
    const hero = viewEl.querySelector('.tag-hero');
    if (!hero) return;
    const { parts } = parseHash();
    const names = [tkey(name), tkey(canon || name)];
    const here = parts[0] === 'tag' && !!parts[1] && (names.includes(tkey(parts[1])) || (!!hero._canon && names.includes(tkey(hero._canon))));
    if (!here || !kindChanged) return hero._redraw && hero._redraw();
    // Cuenta = en orden y en miniaturas; hashtag = barajado: se vuelve a abrir con su vista de siempre.
    const hash = '#/tag/' + enc(parts[1]);
    if (location.hash === hash) route();
    else navReplace(hash);
  }
  function setProfileNotify(name, on, quiet) {
    const p = tagProfileOf(name);
    if (!p) return;
    p.notify = on;
    persist('tagProfiles', 0);
    if (on && !quiet) {
      toast(
        S.settings.notify ? 'Te avisaré de posts nuevos en #' + p.name : 'Avisos desactivados en Ajustes',
        S.settings.notify ? null : 'Ajustes',
        () => nav('#/settings')
      );
    }
  }

  // Bloquear (o desbloquear) un hashtag desde su menú: sus posts salen en el acto del feed a la vista.
  async function blockTag(name, on) {
    const info = await RS.fetchTagInfo(name).catch(() => null);
    const canon = info ? info.name : name;
    const redo = () => {
      const f = current && current.feed;
      const { parts } = parseHash();
      if (parts[0] === 'tag' && parts[1] && [tkey(name), tkey(canon)].includes(tkey(parts[1]))) return route();
      if (f && f.kind !== 'static') f.items.filter((it) => !pass(it.post)).forEach((it) => f.drop(it.post.id));
      const hero = viewEl.querySelector('.tag-hero');
      if (hero && hero._redraw) hero._redraw();
    };
    if (!on) {
      setBlocked(name, false);
      if (canon !== name) setBlocked(canon, false);
      toast('#' + canon + ' desbloqueado');
    } else {
      // Lo que sigues gana sobre lo bloqueado: bloquear uno que sigues es dejar de seguirlo.
      const { fav, prof } = followedAs(name, info);
      const before = fav || prof ? followSnapshot(fav, prof) : null;
      if (fav) removeFavorite(fav.name);
      if (prof) setTagProfile(prof.name, info, false);
      setBlocked(canon, true);
      toast('#' + canon + ' bloqueado' + (before ? ' y dejaste de seguirlo' : ': sus posts ya no salen en ningún lado'), 'Deshacer', () => {
        setBlocked(canon, false);
        if (before) {
          restoreFollow(before);
          followChanged(name, false, canon);
        }
        redo();
      });
      if (before) followChanged(name, false, canon);
    }
    redo();
  }

  // Cabecera de los menús de un hashtag: su imagen, cuántos posts tiene y lo que importa saber de él.
  function tagSheetHead(name) {
    const title = h('strong', { text: '#' + name });
    const meta = h('span', { class: 'sh-meta', text: 'Cargando…' });
    const more = h('span', { class: 'sh-more' });
    RS.fetchTagInfo(name)
      .then((info) => {
        if (!info) return fill(meta, 'Ese hashtag no existe');
        title.textContent = '#' + info.name;
        meta.textContent = [
          fmt(validCount(tagJunkKey(info.name), info.count)) + (info.count === 1 ? ' post' : ' posts'),
          info.subscribers ? fmt(info.subscribers) + ' suscriptores' : '',
          info.nsfw ? 'NSFW' : ''
        ].filter(Boolean).join(' · ');
        const liked = likedWithTag(info.name).length;
        const { fav, prof } = followedAs(name, info);
        more.textContent = [
          info.path.length ? 'Dentro de ' + info.path.slice(-2).join(' › ') : '',
          info.kind === 'category' ? 'tiene hashtags dentro' : '',
          liked ? (liked === 1 ? '1 de tus me gusta' : fmt(liked) + ' de tus me gusta') : '',
          prof ? 'lo sigues como cuenta' : fav ? 'lo sigues como hashtag' : '',
          isBlocked(info.name) ? 'bloqueado' : ''
        ].filter(Boolean).join(' · ');
      })
      .catch((e) => fill(meta, errText(e)));
    return h('div', { class: 'sheet-head' }, tagPic(name, 'sh-pic', '#'), h('div', { class: 'grow' }, title, meta, more));
  }

  // Seguir como hashtag o como cuenta; si ya lo sigues, también «Dejar de seguir».
  function followRows(name, notify) {
    const { fav, prof } = followedAs(name);
    const pick = (as, on) => () => {
      closeSheet();
      if (!on) followTagAs(name, as, notify);
    };
    return [
      sheetRow('hash', 'Como hashtag', S.settings.randomTab ? 'Lo ves al azar. Entra en tu Aleatorio y en las historias de Inicio.' : 'Lo ves al azar y sale en las historias de Inicio.', pick('tag', !!fav), fav ? 'on' : '', fav ? icon('check', 20) : null),
      sheetRow('userplus', 'Como cuenta', 'Lo ves como un perfil: en orden y en miniaturas. Lo nuevo, primero en Inicio.', pick('account', !!prof), prof ? 'on' : '', prof ? icon('check', 20) : null),
      fav || prof ? sheetRow('x', 'Dejar de seguir', null, pick(null, false), 'danger') : null
    ];
  }
  function openFollowSheet(name, notify) {
    openSheet('Seguir #' + name, h('div', { class: 'sheet-title', text: 'Seguir #' + name + ' como…' }), ...followRows(name, notify));
  }
  function blockRow(name) {
    const blocked = isBlocked(name);
    const sub = blocked ? null : isFollowedTag(name) ? 'Dejas de seguirlo y sus posts no salen en ningún feed ni en los avisos.' : 'Sus posts no salen en ningún feed ni en los avisos (salvo los que llevan un hashtag que sigues).';
    return sheetRow('ban', (blocked ? 'Desbloquear #' : 'Bloquear #') + name, sub, () => {
      closeSheet();
      blockTag(name, !blocked);
    }, blocked ? '' : 'danger');
  }
  // Menú de un hashtag (al mantenerlo presionado): qué es, seguirlo y bloquearlo.
  function openTagSheet(name) {
    openSheet('#' + name, tagSheetHead(name), h('span', { class: 'sheet-label', text: 'Seguir' }), ...followRows(name, false), crossRow(name), blockRow(name));
  }

  // ---- Reputación del autor (ver RS.reputation en shared.js).
  const decimal = (n) => String(n).replace('.', ',');
  function repStars(r, cls) {
    return h('span', { class: 'rep' + (cls ? ' ' + cls : ''), title: 'Reputación: ' + decimal(r.stars) + ' de 5', 'aria-label': 'Reputación ' + decimal(r.stars) + ' de 5' }, icon('star', 12), decimal(r.stars));
  }
  // Los posts guardados antes de la 1.0.8 no traen los números del autor: se piden aparte (una vez por usuario).
  function repChip(p, cls) {
    if (RS.isRg(p)) return null; // la reputación es de JoyReactor
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

  // «Seguir» al lado del autor (en la tarjeta y en pantalla completa) mientras no lo sigas: un toque y
  // desaparece de todos sus posts.
  function followInline(p, cls) {
    if (RS.isRg(p)) {
      if (!p.user || isRgFollowed(p.user)) return null;
      const key = 'rg:' + rgKey(p.user);
      return h('button', {
        type: 'button',
        class: cls || 'fol-inline',
        'data-follow': key,
        'aria-label': 'Seguir a ' + p.user + ' en RedGifs',
        onclick: (e) => {
          e.stopPropagation();
          setRgFollow(p.user, true, p.rgAvatar);
          document.querySelectorAll('[data-follow="' + CSS.escape(key) + '"]').forEach((b) => b.remove());
          toast('Ahora sigues a ' + p.user + ' (RedGifs): sus posts nuevos, primero en Inicio', 'Deshacer', () => setRgFollow(p.user, false));
        }
      }, 'Seguir');
    }
    if (!p.user || isFollowed(p.user)) return null;
    return h('button', {
      type: 'button',
      class: cls || 'fol-inline',
      'data-follow': userKey(p.user),
      'aria-label': 'Seguir a ' + p.user,
      onclick: (e) => {
        e.stopPropagation();
        setFollow(p.user, p.userId, true);
        document.querySelectorAll('[data-follow="' + CSS.escape(userKey(p.user)) + '"]').forEach((b) => b.remove());
        toast('Ahora sigues a ' + p.user + ': sus posts nuevos, primero en Inicio', 'Deshacer', () => setFollow(p.user, p.userId, false));
        askPic('user', p.user);
      }
    }, 'Seguir');
  }

  function buildCard(it, feed) {
    const p = it.post;
    const card = h('article', { class: 'card', 'data-id': p.id });
    if (it.label) card.append(h('div', { class: 'source', style: it.color ? { color: it.color } : null }, icon(it.icon || 'shuffle', 14), h('span', { text: it.label })));
    card.append(
      h('div', { class: 'head' },
        p.user
          ? h('a', { class: 'who-link', href: (RS.isRg(p) ? '#/rguser/' : '#/user/') + enc(p.user), 'aria-label': 'Ver todos los posts de ' + p.user },
              avatar(p),
              h('div', { class: 'who' }, h('span', { class: 'user-line' }, h('span', { class: 'user', text: p.user }), srcBadge(p), repChip(p)), h('span', { class: 'when', text: ago(p.time) }))
            )
          : [avatar(p), h('div', { class: 'who' }, h('span', { class: 'user-line' }, h('span', { class: 'user', text: 'anónimo' }), srcBadge(p)), h('span', { class: 'when', text: ago(p.time) }))],
        followInline(p),
        h('span', { class: 'grow' }),
        RS.isRg(p) ? null : h('span', { class: 'rating' + (p.rating < 0 ? ' neg' : ''), title: 'Rating en JoyReactor' }, icon('up', 14), String(p.rating).replace('.', ','))
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
        h('button', { class: 'act like' + (liked ? ' on' : ''), 'aria-label': 'Me gusta', 'aria-pressed': String(liked), onclick: () => toggleLike(p) }, icon('heart', 27)),
        h('button', { class: 'act', 'aria-label': 'No me gusta: ocultar para siempre', onclick: () => dislike(it, card, feed) }, icon('down', 25)),
        RS.isRg(p)
          ? h('a', { class: 'act', href: RS.postUrl(p), target: '_blank', rel: 'noopener', 'aria-label': 'Ver en RedGifs' }, icon('external', 22))
          : h('a', { class: 'act', href: RS.postUrl(p), target: '_blank', rel: 'noopener', 'aria-label': p.comments + ' comentarios en JoyReactor' }, icon('comment', 24), fmt(p.comments)),
        savable(p).length ? h('button', { class: 'act', 'aria-label': 'Descargar', onclick: () => downloadPost(p, currentIndex(card)) }, icon('download', 25)) : null,
        // Los puntitos del carrusel, centrados en el espacio que queda (con la descarga ya no caben al medio).
        h('span', { class: 'grow dots-slot' }, dots),
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
    if (m.kind === 'image') return h('img', { src: RS.imageUrl(m), alt: '', loading: 'lazy', decoding: 'async', draggable: 'false' });
    if (m.kind === 'video') {
      // Imagen fija del GIF; si no existe, el primer cuadro del video.
      const img = h('img', { src: RS.posterUrl(m), alt: '', loading: 'lazy', decoding: 'async', draggable: 'false' });
      img.addEventListener('error', () => img.replaceWith(makeVideo(m, true)), { once: true });
      return img;
    }
    if (m.provider === 'YOUTUBE') return h('img', { src: ytThumb(m), alt: '', loading: 'lazy', draggable: 'false' });
    return null;
  }

  // Miniatura: tocarla abre el post en el feed; abajo tiene «no me gusta» y «me gusta» a mano. En Me gusta
  // e Historial no lleva botones: mantenerla presionada empieza a seleccionar (holdToSelect).
  function buildThumb(it, feed) {
    const p = it.post;
    const m = p.media[0];
    const quiet = !!feed && (feed.source === 'likes' || feed.source === 'history');
    const explore = !!feed && feed.source === 'explore';
    const cell = h('div', { class: 'thumb' + (quiet && feed.sel && feed.sel.has(p.id) ? ' picked' : ''), 'data-id': p.id });
    const open = h('button', {
      class: 'thumb-open',
      'aria-label': 'Abrir post' + (p.tags.length ? ' ' + p.tags.slice(0, 3).map((t) => '#' + t).join(' ') : ''),
      onclick: () => (feed.sel ? toggleSelect(feed, p.id) : feed.setMode('feed', p.id))
    });
    const media = thumbMedia(m);
    if (media) open.append(media);
    else open.append(h('span', { class: 'ttext', text: (p.text || (m ? PROVIDERS[m.provider] || 'Video' : 'Post de texto')).slice(0, 90) }));
    cell.append(open);
    if (p.media.length > 1) cell.append(h('span', { class: 'tb' }, icon('multi', 15)));
    else if (m && (m.kind === 'embed' || (m.kind === 'video' && m.real))) cell.append(h('span', { class: 'tb' }, icon('play', 14)));
    else if (m && (m.kind === 'video' || m.ext === 'gif')) cell.append(h('span', { class: 'tb', text: 'GIF' }));
    const sb = srcBadge(p, 'tsrc');
    if (sb) cell.append(sb);

    // Explorar, como Instagram: sin botones; los GIF y videos en un cuadro alto y lo de Descubrir con su marca.
    if (explore) {
      if (m && (m.kind === 'video' || m.ext === 'gif')) cell.classList.add('tall');
      if (it.discover) cell.append(h('span', { class: 'tnew', text: '✦ Nuevo' }));
      return cell;
    }
    if (quiet) {
      cell.append(h('span', { class: 'selmark', 'aria-hidden': 'true' }, icon('check', 16)));
      holdToSelect(cell, feed, p.id);
      return cell;
    }
    const liked = !!S.likes[p.id];
    cell.append(
      h('div', { class: 'tacts' },
        h('button', { class: 'tact', 'aria-label': 'No me gusta: ocultar para siempre', onclick: () => dislike(it, cell, feed) }, icon('down', 19)),
        h('button', { class: 'tact like' + (liked ? ' on' : ''), 'aria-label': 'Me gusta', 'aria-pressed': String(liked), onclick: () => toggleLike(p) }, icon('heart', 21))
      )
    );
    return cell;
  }

  // ---- Seleccionar varios en Me gusta e Historial: mantener presionada una miniatura (medio segundo; se
  // cambia en Ajustes › Herramientas de debug) la marca y
  // empieza a seleccionar; después cada toque marca o desmarca. Arriba quedan cuántas van y «Eliminar»
  // (con Deshacer). La ✕, «atrás» o cambiar de página dejan de seleccionar.
  const selectHold = () => Number(S.settings.selectHold) || 500;
  function holdToSelect(cell, feed, id) {
    longPress(cell, selectHold, 'pressing', () => startSelect(feed, id), () => !feed.sel);
  }
  function startSelect(feed, id) {
    feed.sel = new Set();
    feed.root.classList.add('selecting');
    toggleSelect(feed, id);
  }
  function toggleSelect(feed, id) {
    if (feed.sel.has(id)) feed.sel.delete(id);
    else feed.sel.add(id);
    const cell = feed.list.querySelector('[data-id="' + CSS.escape(id) + '"]');
    if (cell) cell.classList.toggle('picked', feed.sel.has(id));
    feed.refreshHead();
  }
  function endSelect(feed) {
    if (!feed || !feed.sel) return false;
    feed.sel = null;
    feed.root.classList.remove('selecting');
    feed.list.querySelectorAll('.picked').forEach((c) => c.classList.remove('picked'));
    feed.refreshHead();
    return true;
  }
  // folder: la carpeta a la vista (ahí «Quitar» la saca de la carpeta en vez de eliminarla de Me gusta).
  function selectionHead(feed, what, folder) {
    const n = feed.sel.size;
    return [
      h('button', { class: 'ib', 'aria-label': 'Dejar de seleccionar', onclick: () => endSelect(feed) }, icon('x', 24)),
      h('h1', { text: n === 1 ? '1 seleccionado' : n + ' seleccionados' }),
      what === 'likes' ? h('button', { class: 'pill', disabled: !n, onclick: () => moveSelected(feed, folder) }, icon('folder', 18), 'Mover') : null,
      folder
        ? h('button', { class: 'pill danger', disabled: !n, onclick: () => unfileSelected(feed, folder) }, 'Quitar')
        : h('button', { class: 'pill danger', disabled: !n, 'aria-label': 'Eliminar', title: 'Eliminar', onclick: () => deleteSelected(feed, what) }, icon('trash', 18))
    ];
  }
  // what: 'likes' (los quita de Me gusta) o 'history' (los borra del historial).
  function deleteSelected(feed, what) {
    const ids = Array.from(feed.sel);
    if (!ids.length) return;
    const set = new Set(ids);
    let saved = [];
    if (what === 'likes') {
      saved = ids.filter((id) => S.likes[id]).map((id) => [id, S.likes[id]]);
      ids.forEach((id) => delete S.likes[id]);
      persist('likes', 0);
    } else {
      saved = S.history.filter((x) => set.has(x.id));
      S.history = S.history.filter((x) => !set.has(x.id));
      persist('history', 0);
    }
    endSelect(feed);
    ids.forEach((id) => feed.drop(id));
    const n = ids.length;
    const text = what === 'likes'
      ? n === 1 ? 'Quitaste 1 post de Me gusta' : 'Quitaste ' + n + ' posts de Me gusta'
      : n === 1 ? 'Borraste 1 post del historial' : 'Borraste ' + n + ' posts del historial';
    toast(text, 'Deshacer', () => {
      if (what === 'likes') {
        for (const [id, x] of saved) S.likes[id] = x;
        persist('likes', 0);
      } else {
        S.history = S.history.concat(saved).sort((a, b) => b.at - a.at);
        persist('history', 0);
      }
      // La lista guardada ya no los tiene: se arma otra vez.
      for (const [k, f2] of Array.from(feeds)) {
        if (!k.startsWith(what + ':')) continue;
        feeds.delete(k);
        if (f2 !== feed) f2.destroy();
      }
      route();
      if (!(current && current.feed === feed)) feed.destroy();
    });
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

  // story: son historias (sin barra para adelantar; la rayita de arriba la pone startStory).
  function openViewer(feed, p, mediaIndex, story) {
    closeViewer();
    let items = feed ? feed.items.filter((it) => !S.dislikes[it.post.id]) : [];
    if (!items.some((it) => it.post.id === p.id)) {
      items = [{ post: p }];
      feed = null;
    }
    const scroller = h('div', { class: 'vw-feed' });
    // El sonido empieza siempre apagado; se prende con el botón amarillo.
    const v = { feed, scroller, current: null, muted: true, onAdd: null, openedAt: Date.now(), story: story ? {} : null };
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
        // En una historia, un toque rápido en el centro también pausa una imagen (detiene la rayita).
        if (viewer.story) {
          s.append(h('span', { class: 'vw-paused', 'aria-hidden': 'true' }, icon('play', 40)));
          storyTaps(s, () => storyPause(s));
        } else onTaps(s, () => exitViewer());
      } else if (m.kind === 'video') {
        const vid = h('video', { src: RS.videoUrl(m), loop: true, playsinline: true, poster: RS.posterUrl(m), preload: 'auto' });
        retryOnError(vid, RS.videoUrl(m));
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
        // Un toque rápido en el centro pausa (o sigue); dos toques salen de la pantalla completa. Tocar
        // abajo muestra los botones de Android (ver viewerGestures) o, en horizontal, los controles.
        // Justo después de arrastrar para adelantar, no pausa.
        if (viewer.story) storyTaps(s, () => togglePause(vid, s));
        else {
          onTaps(s, () => exitViewer(), (tap) => {
            if (Date.now() - (vid._seekedAt || 0) < 700 || !pauseTap(tap)) return;
            togglePause(vid, s);
          });
        }
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
      if (viewer.story) storyTaps(media, () => storyPause(media));
      else onTaps(media, () => exitViewer());
    }

    const liked = !!S.likes[p.id];
    const side = h('div', { class: 'vw-side' },
      h('button', { class: 'vw-act like' + (liked ? ' on' : ''), 'aria-label': 'Me gusta', 'aria-pressed': String(liked), onclick: () => toggleLike(p) }, icon('heart', 31)),
      h('button', { class: 'vw-act', 'aria-label': 'No me gusta: ocultar para siempre', onclick: () => dislikeInViewer(page) }, icon('down', 29)),
      RS.isRg(p)
        ? h('a', { class: 'vw-act', href: RS.postUrl(p), target: '_blank', rel: 'noopener', 'aria-label': 'Ver en RedGifs' }, icon('external', 27))
        : h('a', { class: 'vw-act', href: RS.postUrl(p), target: '_blank', rel: 'noopener', 'aria-label': p.comments + ' comentarios en JoyReactor' }, icon('comment', 29), h('span', { text: fmt(p.comments) })),
      savable(p).length ? h('button', { class: 'vw-act', 'aria-label': 'Descargar', onclick: () => downloadPost(p, page._track ? page._track._idx || 0 : 0) }, icon('download', 29)) : null,
      (sndBtn = videos.length ? soundButton() : null)
    );
    // Solo los videos tienen sonido: con GIF el botón no aparece.
    if (sndBtn) sndBtn.hidden = !videos.some((x) => x._real);
    // Barra mínima, como la de los GIF, también para los videos (con el tiempo en chiquito). En las
    // historias no hay: no se adelanta (manda la rayita de arriba).
    const scrub = videos.length && !viewer.story ? scrubBar(null) : null;
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
              href: (RS.isRg(p) ? '#/rguser/' : '#/user/') + enc(p.user),
              onclick: (e) => {
                e.preventDefault();
                closeViewerThen(() => nav((RS.isRg(p) ? '#/rguser/' : '#/user/') + enc(p.user)));
              }
            }, icon('user', 15), p.user)
          : h('strong', { text: 'anónimo' }),
        srcBadge(p),
        followInline(p, 'fol-inline vw-fol'),
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

  // Un toque rápido en el centro pausa el video o el GIF; otro lo sigue desde donde quedó (en pantalla
  // completa y en el feed). Se ve el triángulo de reproducir en el centro.
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
  // de la pantalla muestra un momento la barra y los botones; un toque rápido en el centro pausa.
  const CONTROLS_MS = 2600;
  const LAND_CTL_ZONE = 0.35; // la parte de abajo: el 35 % de la altura
  function showControls() {
    const v = viewer;
    if (!v) return;
    v.el.classList.add('ctl');
    clearTimeout(v.ctlTimer);
    v.ctlTimer = setTimeout(() => v.el.classList.remove('ctl'), CONTROLS_MS);
  }
  function viewerPointerDown(e) {
    if (!isLandscape() || e.clientY > window.innerHeight * (1 - LAND_CTL_ZONE)) showControls();
  }

  // ---- Gestos con el dedo en pantalla completa:
  // · Mantener el dedo sobre un video o GIF y arrastrarlo a los lados lo adelanta o lo atrasa
  //   (se apaga en Ajustes; seekSpan = segundos al cruzar la pantalla de lado a lado).
  // · En la app, subir el dedo desde la parte de abajo (o tocarla) muestra los botones de Android en
  //   vez de pasar de post; solo un arrastre largo (más de LONG_SWIPE_MS) pasa al siguiente.
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
        g = {
          x0: t.clientX,
          y0: t.clientY,
          at: Date.now(),
          mode: '',
          moved: false,
          bottom: !!RS.android && t.clientY > window.innerHeight - bottomZone(),
          onControl: !!e.target.closest('button, a, input')
        };
        const slideEl = e.target.closest('.vw-slide');
        const vid = slideEl && slideEl.querySelector('video');
        if (vid && S.settings.seekDrag && !v.story && !e.target.closest('button, a')) g.timer = setTimeout(() => startSeek(g, vid), SEEK_HOLD_MS);
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
        if (Math.hypot(dx, dy) > 10) {
          clearTimeout(g.timer);
          g.moved = true;
        }
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
    const end = (e) => {
      if (!g) return;
      clearTimeout(g.timer);
      if (g.mode === 'seek') endSeek(g);
      // Un toque rápido abajo (con el teléfono vertical) muestra los botones de Android.
      else if (e.type === 'touchend' && g.bottom && !g.moved && !g.onControl && !isLandscape() && Date.now() - g.at < 600) peekBars();
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
    if (v.story) clearInterval(v.story.timer);
    stats().fsMs += Math.min(Date.now() - (v.openedAt || Date.now()), 2 * 3600000);
    saveStats();
    blurPost();
    setTimeout(refocusVisible, 600);
    if (v.feed && v.onAdd) v.feed.listeners.delete(v.onAdd);
    if (v.onClose) v.onClose();
    v.near.disconnect();
    v.seen.disconnect();
    releaseIn(v.el);
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

  // Respaldo de playIO: cada 1,5 s, el GIF o video del post a la vista tiene que estar cargado y
  // reproduciéndose (salvo que lo hayas pausado). En Android el observador a veces no avisa al deslizar
  // rápido o al volver a la app, y el video se quedaba quieto.
  function keepPlaying() {
    const f = current && current.feed;
    if (!f || viewer || document.hidden || f.mode !== 'feed' || !f.root.isConnected) return;
    const id = f.topVisibleId();
    const card = id && f.list.querySelector('[data-id="' + CSS.escape(id) + '"]');
    if (!card) return;
    const slides = card.querySelectorAll('.slide');
    const sl = slides[currentIndex(card)] || slides[0];
    const v = sl && sl.querySelector('video');
    if (!v || v._userPaused) return;
    const r = v.getBoundingClientRect();
    if (r.bottom < 60 || r.top > window.innerHeight - 60) return;
    if (v.dataset.src) {
      v._near = true;
      loadVideo(v);
    }
    if (v.paused) v.play().catch(() => {});
  }
  setInterval(keepPlaying, 1500);

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
      this.scanSrc = null; // hashtag: todos sus posts, para filtrar los GIF y videos (ver fetchMain)
      this.scanned = 0; // cuántos posts de scanSrc ya se revisaron (src.seen)
      this.sinceHit = 0; // posts revisados desde el último GIF o video encontrado
      this.held = false; // se dejó de buscar GIF y videos (muchos posts sin ninguno): sigue con un botón
      this.mode = o.mode || 'feed';
      this.source = o.source || '';
      this.staticItems = o.items || [];
      this.renderHead = o.head;
      this.renderExtra = o.extra;
      this.renderSub = o.sub;
      this.renderEmpty = o.empty;
      this.doneText = o.doneText || null; // listas guardadas: qué decir al terminar
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
      this.cross = o.cross || null; // cruzar hashtags: los que tiene que llevar cada post (kind 'cross')
      this.chip = o.chip || 'all'; // Explorar (kind 'explore'): la ficha elegida
      this.exp = null; // Explorar: tus hashtags y lo ya cargado (ver fetchExplore)
      this.crossOrder = null; // sus páginas, en orden aleatorio
      this.crossFirst = null; // los posts de la página 1, que llegan con la cuenta
      this.onTotal = o.onTotal || null;
      // RedGifs: rgPlan(feed) dice qué pedir, según la pestaña, lo que uniste y Ajustes › Fuentes (ver rgOn):
      // { q, general, only, mix, always } o null (solo JoyReactor).
      this.rgPlan = o.rgPlan || null;
      this.rgSrcs = null;
      this.rgQueue = []; // posts de RedGifs que esperan para mezclarse (ver add)
      this.rgTurn = 0;
      this.jrDone = false;
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
        const src = this.userSrc || this.scanSrc;
        const text = this.kind === 'random'
          ? 'Sorteando posts de tu mezcla…'
          : (this.show === 'anim' || this.kinds.length) && src && src.count
            ? 'Buscando videos y GIF… revisé ' + fmt(src.seen != null ? src.seen : src.posts.length) + ' de ' + fmt(src.count) + ' posts'
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
      } else if (kind === 'held') {
        const src = this.scanSrc;
        fill(s,
          emptyBox('film', 'No encontré más GIF ni videos', 'Revisé ' + fmt(src ? src.seen : 0) + ' de ' + fmt(src ? src.count : 0) + ' posts. Puede haber más, más atrás.',
            h('button', {
              class: 'btn ghost retry',
              onclick: () => {
                this.held = false;
                this.sinceHit = 0;
                this.loadMore();
              }
            }, 'Seguir buscando'))
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
      if (this.loading || this.done || this.failed || this.held || !this.root.isConnected) return;
      this.loading = true;
      this.setStatus('loading');
      try {
        let added = 0;
        for (let guard = 0; !added && !this.done && !this.held && guard < 5; guard++) {
          added += await this.fetchChunk();
          if (!added && !this.done && !this.held) this.setStatus('loading');
        }
        this.setStatus(this.done ? 'end' : this.held ? 'held' : '');
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
      if (this.done || this.loading || this.failed || this.held || !this.root.isConnected) return;
      if (this.sentinel.getBoundingClientRect().top < window.innerHeight + 1600) setTimeout(() => this.loadMore(), 0);
    }

    async fetchChunk() {
      // Inicio: primero los posts nuevos de la gente que sigues; después, el feed de siempre.
      let pre = 0;
      if (this.prelude && !this.preluded) {
        this.preluded = true;
        pre = this.add(await this.prelude().catch(() => []));
      }
      // RedGifs: sus posts esperan en rgQueue y add() los reparte entre los de JoyReactor. Con solo RedGifs
      // (o cuando JoyReactor se acaba o no tiene ese hashtag) salen solos.
      const plan = this.rgPlan ? this.rgPlan(this) : null;
      const rgOn = rgActive(plan);
      const jrOn = !(plan && plan.only) && !(rgOn && srcMode() === 'rg');
      if (plan && plan.only && !plan.q) {
        // La pestaña RedGifs de una cuenta que todavía no uniste: queda vacía, con la invitación a unir.
        this.done = true;
        return pre;
      }
      if (!rgOn) return pre + (await this.fetchMain());
      this.rgq = plan.q;
      if (this.rgQueue.length < RG_EVERY * 3) await this.fillRg();
      let n = 0;
      if (jrOn && !this.jrDone) {
        try {
          n = await this.fetchMain();
        } catch (e) {
          if (!this.rgQueue.length) throw e;
          this.jrDone = true; // p. ej. un hashtag que solo está en RedGifs
        }
        if (this.done) {
          this.jrDone = true;
          this.done = false;
        }
      }
      if (!jrOn || this.jrDone) {
        if (!this.rgQueue.length) await this.fillRg();
        n += this.add(this.rgQueue.splice(0, 12));
        if (!this.rgQueue.length && this.rgSrcs && this.rgSrcs.every((s) => s.done)) this.done = true;
      }
      return pre + n;
    }

    // Pide la página siguiente de RedGifs. rgq: { tags, order, random } | { user, order } | { order } o
    // { rotate: [hashtags] } (Explorar: se turnan tus hashtags más mirados).
    async fillRg() {
      if (!this.rgSrcs) {
        const qs = this.rgq.rotate ? this.rgq.rotate.map((t) => ({ tags: t, order: 'trending', random: true })) : [this.rgq];
        this.rgSrcs = qs.map((q) => RS.createRgSource(q));
      }
      const live = this.rgSrcs.filter((s) => !s.done);
      if (!live.length) return;
      const src = live[this.rgTurn++ % live.length];
      try {
        for (const post of await src.more()) {
          if (this.ids.has(post.id) || S.dislikes[post.id] || (this.kinds.length && !RS.matchesKinds(post, this.kinds)) || (this.show === 'anim' && !RS.isAnimated(post))) continue;
          this.rgQueue.push({ post });
        }
      } catch (e) {
        src.done = true; // RedGifs no respondió: sigue con JoyReactor
        if (!rgErrorShown) {
          rgErrorShown = true;
          toast(errText(e));
        }
      }
    }

    async fetchMain() {
      if (this.kind === 'pager' && this.kinds.length) {
        // Videos y GIF de un hashtag: se recorren sus páginas (de a 6 por consulta) y quedan los posts
        // que traen un GIF o un video, tengan o no la etiqueta #gif o #video (ver RS.createTagSource).
        // Lo encontrado queda guardado en el teléfono: al volver solo se pide lo nuevo.
        if (!this.scan) this.scan = junkScan('tag:' + String(this.tag || '').toLowerCase() + ':' + this.type);
        if (!this.scanSrc) this.scanSrc = RS.createTagSource(this.tag, this.type, this.scan, RS.isAnimated);
        const src = this.scanSrc;
        if (this.cursor >= src.posts.length && !src.done) await src.more(6);
        this.total = src.count;
        const out = [];
        while (this.cursor < src.posts.length && out.length < 30) {
          const post = src.posts[this.cursor++];
          if (RS.matchesKinds(post, this.kinds)) out.push({ post });
        }
        if (src.done && this.cursor >= src.posts.length) {
          this.done = true;
          this.endText = 'No hay más ' + (this.kinds.length > 1 ? 'GIF ni videos' : this.kinds[0] === 'gif' ? 'GIF' : 'videos') + '.';
        }
        const n = this.add(out);
        // Si en 1500 posts seguidos no aparece ninguno, se deja de buscar solo (ver setStatus 'held').
        this.sinceHit = n ? 0 : this.sinceHit + src.seen - this.scanned;
        this.scanned = src.seen;
        if (!n && !this.done && this.sinceHit >= 1500) this.held = true;
        return n;
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
      if (this.kind === 'explore') return this.add(await fetchExplore(this));
      if (this.kind === 'cross') {
        // Cruzar hashtags: los posts que llevan todos (RS.fetchCross). Se ven al azar, como un hashtag: la
        // primera consulta dice cuántas páginas hay y después se piden en orden aleatorio, de a 3.
        if (!this.crossOrder) {
          const first = await RS.fetchCross(this.cross, [1]);
          this.total = first.count;
          if (this.onTotal) this.onTotal(first.count);
          this.crossFirst = first.pages[0].posts;
          this.crossOrder = first.count ? RS.shuffle(Array.from({ length: first.lastPage }, (_, i) => i + 1)) : [];
        }
        const list = this.crossOrder.splice(0, this.dry ? 6 : 3);
        const need = list.filter((pg) => pg !== 1);
        const res = need.length ? await RS.fetchCross(this.cross, need) : { pages: [] };
        const posts = [];
        for (const pg of list) {
          const got = pg === 1 ? { posts: this.crossFirst } : res.pages.find((x) => x.page === pg);
          if (got) posts.push(...got.posts);
        }
        if (!this.crossOrder.length) {
          this.done = true;
          this.endText = this.total >= 1000 ? 'JoyReactor muestra hasta 1000 posts por búsqueda: ya los viste.' : 'No hay más posts que los lleven todos.';
        }
        const n = this.add(RS.shuffle(posts).map((post) => ({ post })));
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
            ? 'Ya no encuentro más posts de #' + this.tag + ' que no hayas visto aquí. Desliza hacia abajo arriba del todo para barajar otra vez.'
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
      if (this.cursor >= this.staticItems.length) {
        this.done = true;
        if (this.doneText) this.endText = this.doneText(this.staticItems.length);
      }
      return this.add(chunk);
    }

    add(items) {
      // RedGifs: cada RG_EVERY posts de JoyReactor entra uno de los que esperan.
      if (this.rgQueue.length && items.length && srcMode() === 'both' && !RS.isRg(items[0].post)) {
        const mixed = [];
        items.forEach((it, i) => {
          mixed.push(it);
          if ((i + 1) % RG_EVERY === 0 && this.rgQueue.length) mixed.push(this.rgQueue.shift());
        });
        items = mixed;
      }
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
      else window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - headOffset(this));
      return true;
    }

    setMode(mode, anchorId) {
      if (mode === this.mode && !anchorId) return;
      if (mode !== 'grid') endSelect(this);
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
      else if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - headOffset(this));
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
      this.rgSrcs = null;
      this.rgQueue = [];
      this.jrDone = false;
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
      this.scanSrc = null;
      this.scanned = 0;
      this.sinceHit = 0;
      this.held = false;
      this.rgSrcs = null;
      this.rgQueue = [];
      this.jrDone = false;
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
      if (this.prelude) recentMemo.clear(); // Inicio: lo nuevo de lo que sigues y las historias
      this.userSrc = null;
      this.scan = null;
      this.preluded = false;
      this.exp = null; // Explorar: otra mezcla, con tus hashtags al día
      return this.reset();
    }

    destroy() {
      this.io.disconnect();
      releaseIn(this.root);
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

  let pageFollowHook = null; // la página a la vista se redibuja al seguir o dejar de seguir un hashtag
  function mount(nodes, feed) {
    // Cada página empieza con la cabecera a la vista.
    setTopHidden(false);
    settledY = null;
    pageFollowHook = null;
    if (current && current.feed) {
      const prev = current.feed;
      endSelect(prev);
      prev.scrollY = window.scrollY;
      if (!(prev.anchorHold && Date.now() < prev.anchorHold)) prev.anchorId = prev.topVisibleId();
      if (prev.memoryKey) feedMemory.set(prev.memoryKey, prev.anchorId);
      pauseIn(prev.root);
    }
    blurPost();
    if (feed) setTimeout(refocusVisible, 700);
    releasePics(viewEl);
    fill(viewEl, ...[].concat(nodes));
    current = { feed: feed || null };
    updateSnap();
    if (!feed) window.scrollTo(0, 0);
  }

  // En modo feed se ve un post por pantalla: el desplazamiento se «engancha» en cada post.
  function updateSnap() {
    const snap = !!(current && current.feed && current.feed.mode === 'feed');
    document.documentElement.classList.toggle('snap', snap);
    if (!snap) setTopHidden(false);
  }

  // ---- Con un post por pantalla, la cabecera se esconde al pasar al post siguiente y vuelve al subir,
  // aunque sea un poco y el post no cambie. Escondida, cada post gana su alto (--card-h en app.css) y se
  // vuelve a alinear el que está a la vista.
  let topHidden = false;
  const headOffset = (f) => (topHidden ? 0 : f.headEl.offsetHeight);
  let settledY = null; // dónde quedó quieta la página la última vez (null: recién se abrió)
  let upward = 0; // cuánto se subió desde entonces, aunque después vuelva al mismo post
  let settleTimer = null;
  function setTopHidden(on, realign) {
    if (topHidden === on) return;
    const f = current && current.feed;
    const id = realign && f && f.mode === 'feed' && f.root.isConnected ? f.topVisibleId() : null;
    topHidden = on;
    document.documentElement.classList.toggle('top-off', on);
    if (id) f.scrollToPost(id);
    settledY = window.scrollY;
  }
  window.addEventListener(
    'scroll',
    () => {
      if (settledY != null) upward = Math.max(upward, settledY - window.scrollY);
      clearTimeout(settleTimer);
      settleTimer = setTimeout(settleTop, 140);
    },
    { passive: true }
  );
  function settleTop() {
    const y = window.scrollY;
    const up = upward;
    const from = settledY;
    upward = 0;
    settledY = y;
    const f = current && current.feed;
    if (from == null || viewer || !f || f.mode !== 'feed' || !f.root.isConnected) return;
    if (y < 80) setTopHidden(false, true);
    else if (y > from + 40) setTopHidden(true, true);
    else if (y < from - 40 || up > 30) setTopHidden(false, true);
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
    reviveVideos(f.root);
    settledY = window.scrollY; // desde aquí se mide si bajaste o subiste (cabecera que se esconde)
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

  // Botón de abajo que se marca en cada página: Inicio, Buscar, (Aleatorio), Tú y Ajustes. Seguidos y
  // Favoritos (Me gusta, Historial) son «Tú»; lo que cuelga de Ajustes, Ajustes.
  const TAB_OF = {
    home: 'home', tag: 'home', user: 'home', rguser: 'home', rgtag: 'home', news: 'home',
    search: 'search', find: 'search', visited: 'search', cross: 'search',
    random: 'random', mix: 'random',
    following: 'me', favorites: 'me', likes: 'me', history: 'me',
    settings: 'settings', hidden: 'settings', blocked: 'settings', debug: 'settings', stats: 'settings', week: 'settings', recap: 'settings', topusers: 'settings', tree: 'settings'
  };
  let lastNavWasBack = false;
  let lastNavFromTab = false; // se llegó tocando una pestaña de abajo
  let tabTapped = false;

  function route() {
    const { parts, q, key } = parseHash();
    lastNavWasBack = false;
    lastNavFromTab = tabTapped;
    tabTapped = false;
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
    closeSheet();
    closeCropper();
    closePicZoom();

    const name = parts[0] || 'home';
    document.querySelectorAll('#tabs a').forEach((a) => a.classList.toggle('on', a.dataset.tab === (TAB_OF[name] || 'home')));
    document.querySelectorAll('#tabs a').forEach((a) => (a.classList.contains('on') ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current')));
    syncTabs();

    if (name === 'tag' && parts[1]) return routeTag(parts[1], q);
    if (name === 'user' && parts[1]) return routeUser(parts[1]);
    if (name === 'rguser' && parts[1]) return routeRgUser(parts[1]);
    if (name === 'rgtag' && parts[1]) return routeRgTag(parts[1], q);
    if (name === 'random') return routeRandom();
    if (name === 'mix') return routeMix();
    // «favorites» era el nombre de Seguidos hasta la 1.0.9.
    if (name === 'following' || name === 'favorites') return routeFollowing(q);
    if (name === 'search') return routeSearch(q);
    if (name === 'find') return routeFind();
    if (name === 'cross') return routeCross(q);
    if (name === 'likes') return routeLikes(q);
    if (name === 'history') return routeHistory();
    if (name === 'visited') return routeVisited();
    if (name === 'stats') return routeStats();
    if (name === 'week' || name === 'topusers') return routeWeek();
    if (name === 'recap') return routeRecap();
    if (name === 'tree') return routeTree(parts[1] || '');
    if (name === 'hidden') return routeHidden();
    if (name === 'blocked') return routeBlocked();
    if (name === 'debug') return routeDebug();
    if (name === 'news') return routeNews();
    if (name === 'settings') return routeSettings();
    return routeHome(q);
  }

  // ================================================================ Piezas comunes

  const backBtn = (fallback) => h('button', { class: 'ib', 'aria-label': 'Volver', onclick: () => backToGrid() || goBack('#' + fallback) }, icon('back', 24));
  const iconLink = (ic, label, href) => h('a', { class: 'ib', href, 'aria-label': label, title: label }, icon(ic, 22));

  // Un solo botón para la vista, igual en todas las cabeceras: con un post por pantalla muestra las
  // miniaturas (y las pone al tocarlo); en miniaturas muestra un post por pantalla.
  function viewToggle(feed) {
    const toGrid = feed.mode !== 'grid';
    const label = toGrid ? 'Ver en miniaturas' : 'Ver un post por pantalla';
    return h('button', { class: 'ib', 'aria-label': label, title: label, onclick: () => feed.setMode(toGrid ? 'grid' : 'feed') }, icon(toGrid ? 'grid' : 'feed', 22));
  }

  // La campanita cuenta los posts nuevos de lo que vigilas y los avisos que esperan en Novedades: el
  // resumen de la semana sin mirar y, con la app recién instalada, restaurar el respaldo.
  const recapPending = () => recapUnseen() && S.weekly.later !== S.weekly.week;
  const restorePending = () => !!RS.android && !hasUserData() && !S.backup.skip;
  function fillBell(a) {
    const n = (S.news.unread || 0) + (recapPending() ? 1 : 0) + (restorePending() ? 1 : 0);
    a.setAttribute('aria-label', n ? 'Novedades: ' + n + (n === 1 ? ' aviso' : ' avisos') : 'Novedades');
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

  // Círculo con la imagen del hashtag (la de JoyReactor); mientras carga, o si no tiene, «#». Si le pusiste
  // un GIF (S.pics), ese, moviéndose en todos lados (lo pidió el usuario en la 1.8.2: Inicio, Buscar, Tú,
  // menús…; picIO solo reproduce los que están a la vista). Una cuenta no se mueve nunca: si tiene un GIF
  // de cuando era hashtag (o de la 1.8.0), se ve quieto.
  const picCache = new Map();
  function tagPic(name, cls, fallback, known) {
    const own = picOf('tag', name);
    if (own) return putPic(h('span', { class: cls }), own, !tagProfileOf(name));
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

  // ---- Historias: lo que publicaron en las últimas 24 horas la gente y los hashtags que sigues (como
  // hashtag o como cuenta). El aro es naranja mientras quede algo sin ver y gris cuando ya lo viste;
  // pasadas 24 horas la historia desaparece. Tocar una abre sus posts en pantalla completa, del más viejo
  // al más nuevo, empezando por el primero que no viste. Primero van las que tienen algo sin ver.
  const STORY_WINDOW = 24 * 3600000;
  let storyCache = null; // las últimas armadas: al volver a Inicio se dibujan en el acto mientras se piden
  async function loadStories() {
    const users = Object.values(S.following);
    const tags = favList()
      .map((f) => ({ name: f.name, kind: 'tag' }))
      .concat(Object.values(S.tagProfiles).filter((t) => !favOf(t.name)).map((t) => ({ name: t.name, kind: 'account', pic: t.pic })));
    // Los creadores y las etiquetas de RedGifs que sigues (si RedGifs está en Ajustes › Fuentes).
    const rgUsers = srcMode() !== 'jr' ? Object.values(S.rgFollowing) : [];
    const rgTagList = srcMode() !== 'jr' ? Object.values(S.rgTags) : [];
    const [byUser, byTag, byRg, byRgTag] = await Promise.all([
      recentOf('user', users.map((u) => u.name)),
      recentOf('tag', tags.map((t) => t.name)),
      Promise.all(rgUsers.map((u) => RS.rgPage({ user: u.name, order: 'latest' }, 1).then((r) => r.posts).catch(() => []))),
      Promise.all(rgTagList.map((t) => RS.rgPage({ tags: t.name, order: 'latest' }, 1).then((r) => r.posts).catch(() => [])))
    ]);
    const since = Date.now() - STORY_WINDOW;
    const fresh = (list) => (list || []).filter((p) => p.time >= since && !RS.isJunk(p) && pass(p) && !S.dislikes[p.id]).sort((a, b) => a.time - b.time);
    return users
      .map((u) => ({ kind: 'user', name: u.name, userId: u.userId, posts: fresh(byUser[u.name]) }))
      .concat(tags.map((t) => ({ kind: t.kind, name: t.name, pic: t.pic, posts: fresh(byTag[t.name]) })))
      .concat(rgUsers.map((u, i) => ({ kind: 'rg', name: u.name, pic: u.pic, posts: fresh(byRg[i]) })))
      .concat(rgTagList.map((t, i) => ({ kind: 'rgtag', name: t.name, posts: fresh(byRgTag[i]) })))
      .filter((s) => s.posts.length);
  }
  const storyUnseen = (s) => s.posts.some((p) => !S.seenSet.has(p.id));

  function storiesRow() {
    const row = h('section', { class: 'stories', 'aria-label': 'Historias de las últimas 24 horas' });
    const following = favList().length + Object.keys(S.following).length + Object.keys(S.tagProfiles).length + (srcMode() !== 'jr' ? Object.keys(S.rgFollowing).length + Object.keys(S.rgTags).length : 0);
    const draw = (list) => {
      const since = Date.now() - STORY_WINDOW;
      const live = (list || [])
        .map((s) => Object.assign({}, s, { posts: s.posts.filter((p) => p.time >= since && !S.dislikes[p.id]) }))
        .filter((s) => s.posts.length)
        .sort((a, b) => storyUnseen(b) - storyUnseen(a) || b.posts[b.posts.length - 1].time - a.posts[a.posts.length - 1].time);
      fill(row,
        live.map((s) =>
          h('button', { type: 'button', class: 'story', 'aria-label': 'Historia de ' + (s.kind === 'user' || s.kind === 'rg' ? '@' : '#') + s.name + ': ' + s.posts.length + (s.posts.length === 1 ? ' post' : ' posts') + ' de las últimas 24 horas', onclick: () => openStory(s, () => draw(list), live) },
            h('span', { class: 'ring' + (storyUnseen(s) ? '' : ' seen') }, s.kind === 'user' ? userPic(s.name, s.userId, 'disc') : s.kind === 'rg' ? rgPic(s.name, s.pic, 'disc') : s.kind === 'rgtag' ? rgTagPic(s.name, 'disc') : tagPic(s.name, 'disc', '#', s.pic)),
            h('span', { class: 'label', text: s.name })
          )
        ),
        // Sin nada que seguir, la fila invita a seguir; si lo sigues pero nadie publicó, no se ve.
        following ? null : h('a', { class: 'story', href: '#/following' }, h('span', { class: 'ring dashed' }, icon('plus', 22)), h('span', { class: 'label', text: 'Seguir' }))
      );
      row.hidden = !row.childElementCount;
    };
    draw(storyCache);
    if (following) {
      loadStories()
        .then((list) => {
          storyCache = list;
          draw(list);
        })
        .catch(() => {});
    }
    return row;
  }

  // Abre una historia: sus posts de las últimas 24 horas en pantalla completa, desde el primero sin ver.
  // Como en Instagram (1.8.2): arriba, una rayita por post que se llena (storyTick); al terminar sigue con
  // la siguiente historia de la fila (por eso van todas seguidas, desde la que tocaste) y, después de la
  // última, se cierra. En las historias los videos no se adelantan (lo pidió el usuario).
  function openStory(s, after, list) {
    const groups = list && list.includes(s) ? list.slice(list.indexOf(s)) : [s];
    const items = [];
    const ids = new Set();
    groups.forEach((st, g) => {
      for (const post of st.posts) {
        if (ids.has(post.id)) continue; // un post puede estar en dos historias: sale en la primera
        ids.add(post.id);
        items.push({ post, story: g, label: (st.kind === 'user' || st.kind === 'rg' ? 'Historia de @' : 'Historia de #') + st.name + (st.kind === 'rg' || st.kind === 'rgtag' ? ' (RedGifs)' : '') + ' · ' + ago(post.time), icon: 'clock' });
      }
    });
    const first = s.posts.find((p) => !S.seenSet.has(p.id)) || s.posts[0];
    // La pantalla completa trabaja sobre un feed: este no se dibuja en ningún lado.
    const feed = { items, listeners: new Set(), list: h('div'), mode: 'feed', loadMore() {}, scrollToPost: () => false };
    openViewer(feed, first, 0, true);
    if (!viewer) return;
    viewer.onClose = after;
    startStory(viewer);
  }

  // ---- La rayita de las historias. Una imagen dura STORY_IMG_MS; un GIF, lo que dura (repitiéndose hasta
  // STORY_IMG_MS si es corto); un video con sonido, hasta que termina. En un carrusel, la rayita del post
  // se reparte entre sus imágenes y pasa sola de una a otra. Pausar (toque rápido en el centro) la detiene.
  // Se cuenta con un temporizador y no con requestAnimationFrame, que se congela si no se ve.
  const STORY_IMG_MS = 5000;
  function startStory(v) {
    v.el.classList.add('stories-on');
    v.story = { bars: h('div', { class: 'vw-story', 'aria-hidden': 'true' }), group: -1, key: '', elapsed: 0, paused: false, moving: '', last: Date.now() };
    v.el.append(v.story.bars);
    v.story.timer = setInterval(() => storyTick(v), 100);
    storyTick(v);
  }
  function storyTick(v) {
    const st = v.story;
    if (viewer !== v) return clearInterval(st.timer);
    const now = Date.now();
    const dt = Math.min(400, now - st.last);
    st.last = now;
    const page = v.current;
    if (!page || !page._it) return;
    const g = page._it.story;
    const group = Array.prototype.filter.call(v.scroller.children, (x) => x._it.story === g);
    if (st.group !== g || st.bars.childElementCount !== group.length) {
      st.group = g;
      fill(st.bars, group.map(() => h('span', {}, h('i'))));
    }
    const track = page._track;
    const nSlides = track ? track.children.length : 1;
    const si = track ? Math.min(track._idx || 0, nSlides - 1) : 0;
    const key = page.dataset.id + ':' + si;
    const slideEl = track ? track.children[si] : page.querySelector('.vw-slide');
    const vid = slideEl ? slideEl.querySelector('video') : null;
    if (st.key !== key) {
      st.key = key;
      st.elapsed = 0;
      st.paused = false;
      st.moving = '';
      // Volviste a un video que ya había terminado: empieza de nuevo (si no, pasaría al siguiente en el acto).
      if (vid && vid.ended) vid.currentTime = 0;
    }
    let r;
    if (vid && vid._real && !vid.error) {
      // Video con sonido: la rayita va con el video y pasa al siguiente cuando termina.
      if (vid.loop) vid.loop = false;
      r = vid.duration ? vid.currentTime / vid.duration : 0;
      if (vid.ended) r = 1;
    } else {
      const playing = !document.hidden && !st.paused && (!vid || vid.error || (!vid.paused && vid.readyState >= 3));
      if (playing) st.elapsed += dt;
      const dur = vid && vid.duration && !vid.error ? Math.max(STORY_IMG_MS, vid.duration * 1000) : STORY_IMG_MS;
      r = st.elapsed / dur;
    }
    r = Math.max(0, Math.min(1, r));
    const idx = group.indexOf(page);
    Array.prototype.forEach.call(st.bars.children, (b, j) => {
      b.firstChild.style.transform = 'scaleX(' + (j < idx ? 1 : j > idx ? 0 : (si + r) / nSlides) + ')';
    });
    if (r >= 1 && st.moving !== key) {
      st.moving = key;
      storyNext(v, page, track, si, nSlides);
    }
  }
  function storyNext(v, page, track, si, nSlides) {
    if (track && si < nSlides - 1) return storySlide(v, track, si, si + 1);
    const next = page.nextElementSibling;
    if (!next) return exitViewer();
    // Al pasar a otra historia, empieza en su primer post sin ver (de un salto, sin marcar los de en medio).
    let to = next;
    if (next._it.story !== page._it.story) {
      for (let x = next; x && x._it.story === next._it.story; x = x.nextElementSibling) {
        if (!S.seenSet.has(x.dataset.id)) {
          to = x;
          break;
        }
      }
    }
    storyGo(v, page, to, to === next);
  }
  // Al post anterior (1.8.3): la imagen anterior del carrusel, el post anterior o, en el primero de
  // todos, el mismo desde el principio.
  function storyPrev(v, page, track, si) {
    v.story.elapsed = 0;
    if (track && si > 0) return storySlide(v, track, si, si - 1);
    const prev = page.previousElementSibling;
    if (prev) return storyGo(v, page, prev, true);
    page.querySelectorAll('video').forEach((x) => (x.currentTime = 0));
  }
  // Pasa a otro post (de a uno, deslizando; de un salto, sin marcar los de en medio como vistos).
  function storyGo(v, page, to, smooth) {
    fillPage(to, 0);
    v.scroller.scrollTo({ top: to.offsetTop, behavior: smooth ? 'smooth' : 'auto' });
    // Respaldo, por si el desplazamiento suave no ocurrió o no avisó: salta a ese post.
    setTimeout(() => {
      if (viewer !== v || v.current !== page) return;
      v.scroller.scrollTop = to.offsetTop;
      setCurrentPage(to, true);
    }, 900);
  }
  function storySlide(v, track, from, to) {
    track.scrollTo({ left: to * track.clientWidth, behavior: 'smooth' });
    // Respaldo, por si el carrusel no avisa que se movió.
    setTimeout(() => {
      if (viewer !== v || (track._idx || 0) !== from) return;
      track.scrollLeft = to * track.clientWidth;
      track._idx = to;
    }, 900);
  }
  // Toques en una historia (1.8.3, como Instagram): a la izquierda (el primer tercio) vuelve al post
  // anterior, a la derecha (el último tercio) pasa al siguiente y en el centro pausa. Sin esperar un
  // segundo toque: en las historias dos toques no cierran (para eso están la ✕ y «atrás»). Abajo, en la
  // app, el toque es para los botones de Android (viewerGestures).
  function storyTaps(el, onPause) {
    let downAt = 0;
    el.addEventListener('pointerdown', () => (downAt = Date.now()), { passive: true });
    el.addEventListener('click', (e) => {
      const v = viewer;
      if (!v || !v.story || !v.current || e.target.closest('button, a, input')) return;
      const ms = Date.now() - downAt;
      if (ms > 450 || (RS.android && e.clientY > window.innerHeight - bottomZone())) return;
      const x = e.clientX / Math.max(1, window.innerWidth);
      const page = v.current;
      const track = page._track;
      const nSlides = track ? track.children.length : 1;
      const si = track ? Math.min(track._idx || 0, nSlides - 1) : 0;
      if (x > 2 / 3) {
        v.story.moving = v.story.key; // que el temporizador no lo pase otra vez
        storyNext(v, page, track, si, nSlides);
      } else if (x < 1 / 3) storyPrev(v, page, track, si);
      else if (pauseTap({ y: e.clientY, ms })) onPause();
    });
  }
  // Pausar una imagen de una historia (en los GIF y videos pausa el video, y la rayita lo sigue).
  function storyPause(slideEl) {
    if (!viewer || !viewer.story) return;
    viewer.story.paused = !viewer.story.paused;
    slideEl.classList.toggle('paused', viewer.story.paused);
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

  // Descarga la versión nueva y abre el instalador de Android (ahí solo se toca «Instalar»). Mientras
  // descarga, el botón que se tocó queda ocupado.
  let installing = false;
  async function installUpdate(btn) {
    if (!S.update || installing) return;
    installing = true;
    const label = btn ? Array.from(btn.childNodes) : null;
    if (btn) {
      btn.disabled = true;
      fill(btn, icon('spinner', 16, 'spin'), 'Descargando…');
    }
    toast('Descargando la versión ' + S.update.version + '…');
    try {
      const r = await RS.native('installUpdate', S.update.url);
      if (r && r.needsPermission) toast('Activa «Permitir de esta fuente» para Reactor Swipe, vuelve y toca Actualizar otra vez.');
      else toast('Toca «Instalar» para terminar. Tus datos se conservan.');
    } catch (e) {
      toast(errText(e));
    }
    installing = false;
    if (btn) {
      btn.disabled = false;
      fill(btn, label);
    }
  }

  // Versión nueva: se busca al abrir la app, al volver a ella (como mucho cada 10 minutos) y cada media
  // hora mientras está abierta; el aviso sale en Inicio sin reiniciar. «Luego» lo esconde hasta que la
  // app se vuelva a abrir.
  const UPDATE_EVERY = 10 * 60000;
  let lastUpdateCheck = 0;
  let updateLater = '';
  function updateBanner() {
    if (!S.update || S.update.version === updateLater) return null;
    return h('div', { class: 'notice green' },
      h('strong', { text: 'Versión nueva disponible: ' + S.update.version }),
      h('span', { text: 'Toca Actualizar y después Instalar. Tus favoritos y lo que sigues se conservan.' }),
      h('div', { class: 'row-btns' },
        h('button', { class: 'btn', onclick: (e) => installUpdate(e.currentTarget) }, icon('download', 18), 'Actualizar'),
        h('button', {
          class: 'btn quiet',
          onclick: () => {
            updateLater = S.update.version;
            if (current && current.feed) current.feed.refresh();
          }
        }, 'Luego')
      )
    );
  }

  // manual = se tocó el botón de Ajustes: si hay una versión nueva, se descarga e instala en el acto.
  async function lookForUpdate(manual, btn) {
    const before = S.update ? S.update.version : '';
    lastUpdateCheck = Date.now();
    try {
      S.update = await RS.checkForUpdate();
    } catch (e) {
      if (manual) toast(errText(e));
      return;
    }
    if (manual && S.update && RS.android) return installUpdate(btn);
    if (manual) toast(S.update ? 'Hay una versión nueva: ' + S.update.version : 'Ya tienes la última versión (' + RS.version() + ')');
    if (S.update && S.update.version !== before && current && current.feed && /^home:/.test(current.feed.key)) current.feed.refresh();
  }
  setInterval(() => {
    if (!document.hidden && Date.now() - lastUpdateCheck > 30 * 60000) lookForUpdate(false);
  }, 60000);

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
        // RedGifs: Bueno = lo popular, Top = lo mejor de la semana, Nuevo y Todo = lo más nuevo.
        rgPlan: () => ({ q: { order: type === 'GOOD' ? 'popular' : type === 'BEST' ? 'top7' : 'latest' }, general: true }),
        head: (f) => [h('h1', { text: 'Inicio' }), bellLink(), viewToggle(f)],
        // En Inicio solo queda el aviso de versión nueva; los demás esperan en la campanita (Novedades).
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

  // Los posts nuevos (de la última semana y que no viste) de la gente que sigues y de los hashtags que
  // guardaste como perfil van primero en Inicio, empezando por quien más me gusta te ha dado.
  const FOLLOWED_DAYS = 7;
  function likesByUser() {
    const by = {};
    for (const x of Object.values(S.likes)) {
      const u = x.post && x.post.user;
      if (u) by[userKey(u)] = (by[userKey(u)] || 0) + 1;
    }
    return by;
  }
  // Los últimos 20 posts de cada usuario o hashtag que sigues, guardados unos minutos: los usan Inicio
  // (followedFirst) y las historias, que los piden a la vez (lo que ya se está pidiendo no se repite).
  // Se piden de a 12 por consulta.
  const recentMemo = new Map(); // 'user:nombre' | 'tag:nombre' -> { at, posts } o { at, wait: promesa }
  const RECENT_TTL = 5 * 60000;
  async function recentOf(kind, names) {
    const now = Date.now();
    const key = (n) => kind + ':' + tkey(n);
    const miss = names.filter((n) => {
      const m = recentMemo.get(key(n));
      return !m || (!m.wait && now - m.at > RECENT_TTL);
    });
    for (let i = 0; i < miss.length; i += 12) {
      const g = miss.slice(i, i + 12);
      const wait = (kind === 'user' ? RS.fetchUsersRecent(g) : RS.fetchTagsRecent(g))
        .then((got) => g.forEach((n) => recentMemo.set(key(n), { at: now, posts: got[n] || [] })))
        .catch(() => g.forEach((n) => recentMemo.delete(key(n))));
      g.forEach((n) => recentMemo.set(key(n), { at: now, wait }));
    }
    await Promise.all(names.map((n) => (recentMemo.get(key(n)) || {}).wait).filter(Boolean));
    const out = {};
    for (const n of names) out[n] = (recentMemo.get(key(n)) || {}).posts || [];
    return out;
  }

  async function followedFirst() {
    const users = Object.values(S.following);
    const tags = Object.values(S.tagProfiles);
    const rgUsers = srcMode() !== 'jr' ? Object.values(S.rgFollowing) : [];
    const rgAccounts = srcMode() !== 'jr' ? Object.values(S.rgTags).filter((t) => t.as === 'account') : [];
    if (!users.length && !tags.length && !rgUsers.length && !rgAccounts.length) return [];
    const [byUser, byTag, byRg, byRgTag] = await Promise.all([
      recentOf('user', users.map((f) => f.name)),
      recentOf('tag', tags.map((t) => t.name)),
      Promise.all(rgUsers.map((u) => RS.rgPage({ user: u.name, order: 'latest' }, 1).then((r) => r.posts).catch(() => []))),
      Promise.all(rgAccounts.map((t) => RS.rgPage({ tags: t.name, order: 'latest' }, 1).then((r) => r.posts).catch(() => [])))
    ]);
    const likes = likesByUser();
    const since = Date.now() - FOLLOWED_DAYS * 86400000;
    const sources = users
      .map((f) => ({ score: likes[userKey(f.name)] || 0, at: f.addedAt || 0, posts: byUser[f.name] || [], label: (p) => 'De @' + p.user + ', a quien sigues', icon: 'user' }))
      .concat(tags.map((t) => ({ score: likedWithTag(t.name).length, at: t.addedAt || 0, posts: byTag[t.name] || [], label: () => 'De #' + t.name + ', que sigues como cuenta', icon: 'hash' })))
      .concat(rgUsers.map((u, i) => ({ score: 0, at: u.addedAt || 0, posts: byRg[i] || [], label: () => 'De @' + u.name + ' (RedGifs), a quien sigues', icon: 'user' })))
      .concat(rgAccounts.map((t, i) => ({ score: 0, at: t.addedAt || 0, posts: byRgTag[i] || [], label: () => 'De #' + t.name + ' (RedGifs), que sigues como cuenta', icon: 'hash' })))
      .sort((a, b) => b.score - a.score || b.at - a.at);
    const out = [];
    const ids = new Set();
    for (const src of sources) {
      const posts = src.posts.filter((p) => p.time >= since && !S.seenSet.has(p.id) && !ids.has(p.id)).sort((a, b) => b.time - a.time);
      for (const post of posts) {
        ids.add(post.id);
        out.push({ post, label: src.label(post), icon: src.icon, color: 'var(--accent)' });
      }
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

  // El número de posts de un hashtag descuenta lo que bloqueaste: una subcategoría (algo que tiene
  // dentro) se descuenta entera; de otro hashtag bloqueado, los posts que comparten. JoyReactor cuenta
  // esos posts compartidos solo hasta 1000: si llega, lo que queda es un máximo («como mucho»).
  const overlapCache = new Map();
  function blockedOverlap(info) {
    const list = S.mix.exclude.filter((b) => tkey(b) !== tkey(info.name));
    if (!list.length) return Promise.resolve([]);
    const key = tkey(info.name) + '|' + list.map(tkey).sort().join('|');
    if (!overlapCache.has(key)) {
      overlapCache.set(key, RS.fetchBlockedOverlap(info.name, list).catch((e) => {
        overlapCache.delete(key);
        throw e;
      }));
    }
    return overlapCache.get(key);
  }
  function postsText(info, total, overlap) {
    // Si sigues este hashtag o una carpeta donde está, todos sus posts la llevan y lo que sigues gana
    // sobre lo bloqueado (ver RS.makeFilter): solo se descuenta lo bloqueado que está dentro de eso.
    const mine = [info.name].concat(info.path || []).filter(isFollowedTag).map(tkey);
    // Los posts que además llevan otro hashtag que sigues se ven igual: entonces lo que queda es un mínimo.
    const others = Object.values(S.favorites).concat(Object.values(S.tagProfiles)).some((f) => !mine.includes(tkey(f.name)));
    const onlyMine = 'solo ves los que llevan algo que sigues';
    const above = !mine.length && (info.path || []).find((t) => isBlocked(t));
    if (above) return others ? 'Está dentro de #' + above + ', que bloqueaste: ' + onlyMine : '0 posts · está dentro de #' + above + ', que bloqueaste';
    const hit = (overlap || []).filter((x) => x.n > 0 && mine.every((f) => x.path.some((p) => tkey(p) === f)));
    // Uno que está dentro de otro bloqueado ya se descontó con ese.
    const top = hit.filter((x) => !hit.some((y) => y !== x && x.path.some((p) => tkey(p) === tkey(y.name))));
    if (!top.length) return fmt(total) + ' posts';
    const left = Math.max(0, total - top.reduce((a, x) => a + x.n, 0));
    const names = top.sort((a, b) => b.n - a.n).map((x) => '#' + x.name);
    const list = names.slice(0, 2).join(', ') + (names.length > 2 ? ' y ' + (names.length - 2) + ' más' : '');
    if (!left && others) return 'Casi todos tienen ' + list + ': ' + onlyMine;
    const capped = top.some((x) => x.capped);
    return (capped && others ? 'unos ' : capped ? 'como mucho ' : others ? 'al menos ' : '') + fmt(left) + ' posts · sin ' + list;
  }

  /** totalOf (opcional): cuántos posts dice la lista del hashtag, para descontar los retirados. */
  function tagHero(name, totalOf) {
    const el = h('section', { class: 'hero tag-hero' });
    let info = null;
    let overlap = null; // posts que comparte con lo bloqueado (ver blockedOverlap)

    // Seguir (como hashtag o como cuenta), la campanita y «⋯» con lo demás: el Aleatorio, el árbol y bloquear.
    const draw = () => {
      const { fav, prof } = followedAs(name, info);
      const canon = fav ? fav.name : info ? info.name : name;
      el._canon = canon;
      const following = !!(fav || prof);
      const notify = !!((fav && fav.notify) || (prof && prof.notify));
      const meta = info ? postsText(info, validCount(tagJunkKey(name), (totalOf && totalOf()) || info.count), overlap) : 'Cargando…';

      const followBtn = h('button', {
        class: 'hbtn' + (following ? (prof ? ' prof' : ' fav') : ' go'),
        'aria-haspopup': 'dialog',
        onclick: () => openFollowSheet(name, false)
      }, icon(following ? 'check' : 'plus', 18), following ? 'Siguiendo' : 'Seguir', following ? h('small', { class: 'as', text: prof ? 'cuenta' : 'hashtag' }) : null);

      const bellBtn = h('button', {
        class: 'hbtn ic' + (notify ? ' bell' : ''),
        'aria-pressed': String(notify),
        'aria-label': notify ? 'Dejar de avisarme de #' + canon : 'Avisarme de posts nuevos en #' + canon,
        onclick: () => {
          if (!following) return openFollowSheet(name, true);
          if (fav) setNotify(fav.name, !notify);
          else setProfileNotify(prof.name, !notify);
          draw();
        }
      }, icon(notify ? 'bell' : 'belloff', 20));

      const moreBtn = h('button', {
        class: 'hbtn ic',
        'aria-haspopup': 'dialog',
        'aria-label': 'Más opciones de #' + canon,
        onclick: () => {
          const inMix = !!(fav && S.mix.sources[fav.name] && S.mix.sources[fav.name].on);
          openSheet('Más opciones de #' + canon,
            tagSheetHead(canon),
            prof
              ? sheetRow('camera', (picOf('tag', canon) ? 'Cambiar' : 'Poner') + ' la foto', 'Una imagen (o un GIF, quieto) de sus posts o de tus me gusta.', () => openPicSheet('tag', canon))
              : sheetRow('film', (picOf('tag', canon) ? 'Cambiar' : 'Poner') + ' el GIF o video', 'Un pedazo de un GIF o video de sus posts, como foto.', () => openPicSheet('tag', canon)),
            fav && S.settings.randomTab
              ? h('div', { class: 'sheet-row' },
                  icon('shuffle', 22),
                  h('span', { class: 'grow' }, h('span', { class: 'sr-l', text: 'En tu Aleatorio' }), h('span', { class: 'sr-s', text: 'Sus posts salen al barajar en Aleatorio.' })),
                  switchBtn(inMix, 'En tu Aleatorio', (on) => {
                    setMixOn(fav.name, on);
                    toast(on ? 'Añadido a tu Aleatorio' : 'Fuera de tu Aleatorio');
                  })
                )
              : null,
            crossRow(canon),
            info ? sheetRow('hash', 'Ver en el árbol', 'Qué hashtags tiene dentro, como carpetas.', () => {
              closeSheet();
              nav('#/tree/' + enc(canon));
            }) : null,
            blockRow(canon)
          );
        }
      }, icon('dots', 22));

      // JoyReactor ordena los hashtags como carpetas: fandoms › anime › Touhou Project › Cirno.
      // Arriba van las categorías que lo contienen y abajo las que tiene dentro. Mantener presionada una
      // abre su menú (seguirla o bloquearla sin entrar).
      const path = info ? (info.path && info.path.length ? info.path : info.parent ? [info.parent] : []) : [];
      const subs = info ? info.subTags : [];
      const tagLink = (t) =>
        holdForMenu(h('button', { type: 'button', class: 'tag' + (isFollowedTag(t) ? ' fav' : '') + (isBlocked(t) ? ' off' : ''), 'data-tag': t, onclick: () => nav('#/tag/' + enc(t)) }, t), t);
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
      fill(el,
        h('div', { class: 'hero-row' },
          // Sin foto propia ni imagen de JoyReactor no hay nada que agrandar (solo el «#»).
          picOf('tag', canon) || (info && info.pic)
            ? zoomable(tagPic(canon, 'hero-tile', '#', info ? info.pic || 0 : undefined), () => tagPic(canon, 'zoom-disc', '#', info ? info.pic || 0 : undefined))
            : tagPic(canon, 'hero-tile', '#', info ? info.pic || 0 : undefined),
          h('div', { class: 'grow' }, h('h2', { text: canon }), h('span', { class: 'meta', text: blocked ? 'Bloqueado · sus posts no salen en ningún feed' : meta }))
        ),
        h('div', { class: 'hero-actions trio' }, followBtn, bellBtn, moreBtn),
        pathRow,
        subsRow
      );
    };

    // El feed la vuelve a dibujar cuando encuentra posts retirados (cambia el número de posts).
    el._redraw = () => info !== null && draw();
    draw();
    RS.fetchTagInfo(name)
      .then((i) => {
        info = i;
        if (!i) {
          // Una etiqueta que solo está en RedGifs: su nombre y, abajo, sus posts.
          if (srcMode() !== 'jr') return fill(el, h('div', { class: 'hero-row' }, tagPic(name, 'hero-tile', '#', 0), h('div', { class: 'grow' }, h('h2', {}, name, ' ', h('span', { class: 'srcb rg', text: 'RG' })), h('span', { class: 'meta', text: 'Solo en RedGifs' }))));
          return fill(el, emptyBox('hash', 'Ese hashtag no existe', 'Revisa cómo está escrito.'));
        }
        draw();
        blockedOverlap(i)
          .then((list) => {
            overlap = list;
            if (list.length) draw();
          })
          .catch(() => {});
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
    // Un hashtag se ve siempre al azar (lo pidió el usuario en la 1.7.0: sin botón de orden). Si lo sigues
    // como cuenta, como el perfil de un usuario: en orden (lo más reciente primero), en miniaturas, con
    // Favoritos y con el botón de barajar. Las pestañas eligen qué se ve (Todos, Videos y GIF…).
    const profile = !!tagProfileOf(name);
    const type = 'ALL';
    const random = profile ? q.get('order') === 'random' : true;
    const tab = profile && q.get('show') === 'fav' ? 'fav' : q.get('show') === 'rg' && srcMode() !== 'jr' ? 'rg' : /[gv]/.test(q.get('media') || '') ? 'anim' : 'all';
    const kinds = tab === 'anim' ? ['gif', 'video'] : [];
    const key = 'tag:' + name.toLowerCase() + ':' + (random ? 'random' : 'recent') + ':' + tab + (profile ? ':perfil' : '');
    const url = (o) => {
      const t = o.tab || tab;
      const rnd = o.random === undefined ? random : o.random;
      return '#/tag/' + enc(name) + '?order=' + (rnd ? 'random' : 'recent') + (t === 'anim' ? '&media=gv' : t === 'fav' ? '&show=fav' : t === 'rg' ? '&show=rg' : '');
    };
    // Favoritos: tus me gusta con este hashtag (barajados, si toca).
    const favItems = () => {
      const list = likedWithTag(name).map((x) => ({ post: x.post }));
      return random ? RS.shuffle(list) : list;
    };
    const fmtBlocked = () => (kinds.length ? S.mix.exclude.filter(RS.isFormatTag) : []);
    const unblockFormats = (list) => {
      list.forEach((t) => setBlocked(t, false));
      const stale = feeds.get(key);
      feeds.delete(key);
      if (stale) stale.destroy();
      toast('Desbloqueado: #' + list.join(', #'));
      route();
    };
    const f = cached(key, () =>
      new Feed({
        key,
        kind: tab === 'fav' ? 'static' : random ? 'random' : 'pager',
        tag: name,
        type,
        kinds,
        // RedGifs: la pestaña RedGifs muestra su etiqueta (la de mismo nombre o la que uniste), al azar o, en
        // una cuenta en orden, lo más nuevo. En Todos entra solo si es una cuenta y elegiste mezclar.
        rgPlan: () =>
          tab === 'fav'
            ? null
            : { q: { tags: rgTagFor(name), order: profile && !random ? 'latest' : 'trending', random: !profile || random }, only: tab === 'rg', mix: profile && rgMixOn('tag', name) },
        items: tab === 'fav' ? favItems() : [],
        reload: tab === 'fav' ? favItems : null,
        doneText: (n) => (n === 1 ? 'Es el único post de #' + name + ' que te gustó.' : 'Son los ' + n + ' posts de #' + name + ' que te gustaron.'),
        mode: profile ? 'grid' : 'feed',
        back: true,
        head: (f) => [backBtn('/home'), h('h1', { text: '#' + name }), profile ? null : viewToggle(f)],
        extra: (f) => {
          // Bloquear #gif (o #video…) esconde casi todos los GIF y videos: se avisa arriba.
          const blocked = fmtBlocked();
          const warn = blocked.length
            ? h('section', { class: 'notice', style: { margin: '12px 16px 0' } },
                h('strong', { text: 'Tienes bloqueado #' + blocked.join(', #') }),
                h('span', { text: 'Por eso faltan GIF o videos aquí: casi todos llevan esa etiqueta.' }),
                h('div', { class: 'row-btns' }, h('button', { class: 'btn blue', onclick: () => unblockFormats(blocked) }, 'Desbloquear'))
              )
            : null;
          f.hero = tagHero(name, () => f.total);
          return [f.hero, warn];
        },
        sub: () => [tagTabs(tab, profile, random, url), tab === 'rg' ? rgLinkBar('tag', name, profile) : null],
        empty: () => {
          if (tab === 'fav') return emptyBox('heart', 'Todavía no hay favoritos', 'Aquí salen los posts de #' + name + ' que te gustaron.');
          if (tab === 'rg') return emptyBox('hash', 'RedGifs no tiene posts de #' + rgTagFor(name), 'Únelo con otra etiqueta de RedGifs: toca «Cambiar» arriba.');
          if (tab !== 'anim') return emptyBox('hash', 'No hay posts aquí', '');
          // Si bloqueaste #gif (o parecido), todos los GIF desaparecen: se explica y se ofrece desbloquear.
          const blocked = fmtBlocked();
          if (blocked.length)
            return emptyBox('ban', 'No se ven porque bloqueaste #' + blocked.join(', #'), 'Los GIF y los videos de JoyReactor llevan esas etiquetas.',
              h('button', { class: 'btn', onclick: () => unblockFormats(blocked) }, 'Desbloquear'));
          return emptyBox('film', 'Sin videos ni GIF', '#' + name + ' no tiene videos ni GIF.');
        }
      })
    );
    showFeed(f);
  }

  // Pestañas de un hashtag, como las del perfil; en las cuentas, a la derecha, el botón de barajar.
  function tagTabs(tab, profile, random, url) {
    const t = (id, ic, label) =>
      h('button', { class: 'ptab' + (tab === id ? ' on' : ''), role: 'tab', 'aria-selected': String(tab === id), 'aria-label': label, onclick: () => tab !== id && navReplace(url({ tab: id })) }, icon(ic, 20), h('span', { class: 'pl', text: label }));
    const shuffleLabel = random ? 'Volver al orden normal' : 'Barajar los posts';
    const rg = srcMode() !== 'jr';
    // Una cuenta con RedGifs tiene cinco pestañas: las que no están elegidas muestran solo el icono.
    return h('div', { class: 'ptabs' + (rg && profile ? ' many' : ''), role: 'tablist', 'aria-label': 'Qué posts ver' },
      t('all', 'grid', 'Todos'),
      t('anim', 'film', 'Videos y GIF'),
      // RedGifs (1.10.0): los posts de su etiqueta de RedGifs (la de mismo nombre o la que uniste).
      rg ? h('button', { class: 'ptab' + (tab === 'rg' ? ' on' : ''), role: 'tab', 'aria-selected': String(tab === 'rg'), 'aria-label': 'RedGifs', onclick: () => tab !== 'rg' && navReplace(url({ tab: 'rg' })) }, h('span', { class: 'srcb rg', text: 'RG' }), h('span', { class: 'pl', text: 'RedGifs' })) : null,
      profile ? t('fav', 'heart', 'Favoritos') : null,
      !profile ? null : h('button', {
        class: 'ptab shuf' + (random ? ' on' : ''),
        'aria-pressed': String(random),
        'aria-label': shuffleLabel,
        title: shuffleLabel,
        onclick: () => {
          navReplace(url({ random: !random }));
          toast(random ? 'Lo más reciente primero' : 'Barajado: desliza hacia abajo para barajar otra vez');
        }
      }, icon('shuffle', 20))
    );
  }

  // ---- Hashtags guardados como perfil (Seguidos › Perfiles): se ven como el perfil de un usuario, en
  // miniaturas y con Favoritos. S.tagProfiles: nombre en minúsculas -> { name, aliases, addedAt, pic }.
  function tagProfileOf(t) {
    const k = tkey(t);
    return S.tagProfiles[k] || Object.values(S.tagProfiles).find((x) => (x.aliases || []).some((a) => tkey(a) === k)) || null;
  }
  function setTagProfile(name, info, on) {
    const old = tagProfileOf(name) || (info && tagProfileOf(info.name));
    if (!on) {
      if (old) delete S.tagProfiles[tkey(old.name)];
    } else if (!old) {
      const canon = info ? info.name : name;
      const x = { name: canon, aliases: tkey(canon) === tkey(name) ? [] : [name], addedAt: Date.now() };
      if (info) x.pic = info.pic || 0;
      S.tagProfiles[tkey(canon)] = x;
    }
    persist('tagProfiles', 0);
    invalidateHome(); // sus posts nuevos van primero en Inicio
  }
  /** Tus me gusta que llevan este hashtag (o uno de sus sinónimos), del más reciente al más viejo. */
  function likedWithTag(name) {
    const p = tagProfileOf(name);
    const names = new Set([tkey(name)].concat(p ? [p.name].concat(p.aliases || []).map(tkey) : []));
    return Object.values(S.likes)
      .filter((x) => x.post && x.post.tags.some((t) => names.has(tkey(t))))
      .sort((a, b) => b.at - a.at);
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
          toast(on ? 'Dejaste de seguir a ' + shown : 'Ahora sigues a ' + shown + ': está en Seguidos › Perfiles');
          draw();
          if (!on) askPic('user', shown);
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
          zoomable(userPic(name, u && u.id, 'hero-tile'), () => userPic(name, u && u.id, 'zoom-disc')),
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
    // RedGifs (1.10.0): los posts del creador que uniste con esta cuenta (arriba, Unir o Cambiar y Mezclar).
    const rg =
      srcMode() !== 'jr'
        ? h('button', { class: 'ptab' + (f.show === 'rg' ? ' on' : ''), role: 'tab', 'aria-selected': String(f.show === 'rg'), onclick: () => f.setShow('rg') }, h('span', { class: 'srcb rg', text: 'RG' }), 'RedGifs')
        : null;
    return [
      h('div', { class: 'ptabs', role: 'tablist', 'aria-label': 'Qué posts ver' }, tab('all', 'grid', 'Todos'), tab('anim', 'film', 'Videos y GIF'), rg, tab('fav', 'heart', 'Favoritos')),
      f.show === 'rg' ? rgLinkBar('user', f.user, true) : null
    ];
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
        // RedGifs: la pestaña RedGifs (el creador que uniste) y, si lo elegiste, mezclado en Todos.
        rgPlan: (f) => (f.show === 'fav' ? null : { q: rgUserFor(name) ? { user: rgUserFor(name), order: 'latest' } : null, only: f.show === 'rg', mix: rgMixOn('user', name) }),
        head: () => [backBtn('/home'), h('h1', { text: '@' + name })],
        extra: () => {
          hero._redraw();
          return [hero];
        },
        sub: profileTabs,
        empty: (f) =>
          f.show === 'rg'
            ? rgUserFor(name)
              ? emptyBox('user', 'Sin posts en RedGifs', 'Puede que RedGifs no responda o que @' + rgUserFor(name) + ' no tenga posts.')
              : emptyBox('user', 'Todavía no está unido con RedGifs', 'Toca «Unir» arriba y elige su cuenta de RedGifs: sus posts saldrán aquí.')
            : f.show === 'anim'
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
      .concat(Object.values(S.tagProfiles).filter((t) => t.notify && !favOf(t.name)).map((t) => '#' + t.name))
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
    const own = picOf('user', name);
    if (own) return putPic(h('span', { class: cls || 'htile' }), own);
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
      if (on) askPic('user', name);
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

  // Nombres de hashtags y usuarios que la app ya conoce (lo que sigues, buscaste, te gustó, viste o
  // bloqueaste): sirven para encontrarlos aunque se escriban con errores. Se arman una vez por minuto.
  let knownCache = null;
  function knownNames() {
    if (knownCache && Date.now() - knownCache.at < 60000) return knownCache;
    const tags = new Map();
    const users = new Map();
    const tag = (t) => t && !RS.isFormatTag(t) && !tags.has(String(t).toLowerCase()) && tags.set(String(t).toLowerCase(), String(t));
    const user = (u, id) => {
      if (!u) return;
      const k = String(u).toLowerCase();
      const old = users.get(k);
      if (!old || (!old.userId && id)) users.set(k, { name: String(u), userId: id || (old && old.userId) || 0 });
    };
    Object.values(S.favorites).forEach((f) => tag(f.name));
    Object.values(S.tagProfiles).forEach((x) => tag(x.name));
    S.mix.exclude.forEach(tag);
    (S.searches || []).forEach((x) => (x.type === 'user' ? user(x.name, x.pic) : tag(x.name)));
    Object.values(S.following).forEach((f) => user(f.name, f.userId));
    (S.userHistory || []).forEach((x) => user(x.name, x.userId));
    for (const x of Object.values(S.likes).concat(S.history || [])) {
      if (!x.post) continue;
      x.post.tags.forEach(tag);
      user(x.post.user, x.post.userId);
    }
    const st = stats();
    Object.keys(st.tags).forEach(tag);
    Object.keys(st.users).forEach((u) => user(u));
    Object.keys(st.time.tags || {}).forEach(tag);
    Object.keys(st.time.users || {}).forEach((u) => user(u, (st.time.ids || {})[u]));
    // Del árbol guardado solo se conocen bien escritas las carpetas de arriba.
    for (const k of Object.keys(S.tagTree)) for (const p of S.tagTree[k].p || []) tag(p);
    knownCache = { at: Date.now(), tags: Array.from(tags.values()), users: Array.from(users.values()) };
    return knownCache;
  }
  // Los más parecidos a lo escrito (ver RS.fuzzyScore), del más parecido al menos.
  function closest(q, list, nameOf, max) {
    return list
      .map((x) => ({ x, s: RS.fuzzyScore(q, nameOf(x)) }))
      .filter((r) => r.s < Infinity)
      .sort((a, b) => a.s - b.s)
      .slice(0, max)
      .map((r) => r.x);
  }

  // RedGifs (1.10.2): con RedGifs encendido en Ajustes › Fuentes, salen también sus etiquetas y creadores, y
  // cada fila dice de dónde es (JR o RG). Pegar un enlace de un creador (redgifs.com/users/nombre) lo busca.
  // Enter ya no abre el primer resultado: esconde el teclado y deja la lista (lo pidió el usuario); solo al
  // cruzar hashtags (pickOnly) Enter elige el primero.
  const RG_USER_LINK = /redgifs\.com\/(?:users|u)\/([A-Za-z0-9_.-]+)/i;
  function searchBox(placeholder, autofocus, onFav, withUsers, opts) {
    opts = opts || {};
    const input = h('input', { type: 'search', placeholder, 'aria-label': placeholder, autocomplete: 'off', enterkeyhint: 'search' });
    const results = h('div', { class: 'results' });
    let timer = null;
    let seq = 0;
    const run = async (q) => {
      const my = ++seq;
      try {
        const link = RG_USER_LINK.exec(q);
        const rgOn = !opts.pickOnly && srcMode() !== 'jr';
        const qUser = link ? link[1] : q.replace(/^@/, '');
        const onlyUsers = !!link || q.startsWith('@') || opts.usersOnly;
        const known = knownNames();
        // Lo que se predice como siempre (el autocompletado de JoyReactor) y, debajo, lo parecido:
        // con errores de tipeo, con una palabra del medio o con lo escrito a medias. Si RedGifs no
        // responde, quedan los resultados de JoyReactor.
        const [found, user, rgTags, rgExact, rgMore] = await Promise.all([
          onlyUsers ? Promise.resolve({ exact: [], similar: [] }) : RS.searchTags(q, closest(q, known.tags, (t) => t, 8)),
          withUsers && !link ? RS.fetchUserInfo(qUser).catch(() => null) : Promise.resolve(null),
          rgOn && !onlyUsers ? RS.rgSuggest(q).catch(() => []) : [],
          rgOn && (withUsers || link) ? RS.rgUser(qUser) : null,
          rgOn && withUsers && !link ? RS.rgCreators(qUser).catch(() => []) : []
        ]);
        if (my !== seq) return;
        // Con RedGifs encendido, cada fila lleva su fuente.
        const badge = (s) => (rgOn ? srcChip(s) : null);
        const accounts = [];
        if (user) accounts.push(userRow(user, opts.onPick, opts.onFollow, badge('jr')));
        if (rgExact) accounts.push(rgCreatorRow(rgExact, opts.onPick, badge('rg')));
        const exactAccount = accounts.length > 0;
        accounts.push(...rgMore.filter((c) => !rgExact || rgKey(c.username) !== rgKey(rgExact.username)).slice(0, exactAccount ? 3 : 5).map((c) => rgCreatorRow(c, opts.onPick, badge('rg'))));
        // Hashtags de las dos fuentes, turnándose (cada lista ya trae primero lo que más se parece).
        const jrTags = found.exact.slice(0, 15).map((t) => resultRow(t, onFav, opts.onPick, opts.pickOnly, badge('jr')));
        const rgRows = rgTags.slice(0, 10).map((t) => rgTagResult(t, opts.onPick, badge('rg')));
        const tagRows = [];
        for (let i = 0; i < Math.max(jrTags.length, rgRows.length); i++) tagRows.push(jrTags[i], rgRows[i]);
        const label = (text) => h('h2', { class: 'section-label similar-label', text });
        const tagList = tagRows.filter(Boolean);
        const both = accounts.length && tagList.length;
        const rows = [];
        const putAccounts = () => accounts.length && rows.push(both ? label('Cuentas') : null, ...accounts);
        const putTags = () => tagList.length && rows.push(both ? label('Hashtags') : null, ...tagList);
        // Primero las cuentas solo si una se llama igual que lo escrito y tiene más posts que el hashtag de
        // ese nombre («susanna» es una cuenta; «cosplay» es sobre todo un hashtag).
        const k = tkey(qUser);
        const accountPosts = Math.max(user ? user.posts || 0 : 0, rgExact ? rgExact.gifs || rgExact.publishedGifs || 0 : 0);
        const tagPosts = Math.max(0, ...found.exact.filter((t) => tkey(t.name) === k).map((t) => t.count || 0), ...rgTags.filter((t) => tkey(t.text) === k).map((t) => t.gifs || 0));
        if (exactAccount && accountPosts >= tagPosts) {
          putAccounts();
          putTags();
        } else {
          putTags();
          putAccounts();
        }
        const likeUsers = withUsers && !link
          ? closest(qUser, known.users, (u) => u.name, 3).filter((u) => !user || u.name.toLowerCase() !== user.name.toLowerCase())
          : [];
        if (found.similar.length || likeUsers.length) {
          rows.push(label(rows.length ? 'Parecidos' : 'Quizás buscabas'));
          rows.push(...found.similar.map((t) => resultRow(t, onFav, opts.onPick, opts.pickOnly, badge('jr'))));
          rows.push(...likeUsers.map((u) => personRow(u.name, u.userId, 'Usuario', () => opts.onPick && opts.onPick({ type: 'user', name: u.name, pic: u.userId }), followPill(u.name, u.userId, opts.onFollow))));
        }
        const shown = rows.filter(Boolean);
        fill(results, ...(shown.length ? shown : [h('div', { class: 'status', text: 'Sin resultados para «' + (link ? link[1] : q) + '»' })]));
        results.dataset.q = q;
      } catch (e) {
        if (my === seq) fill(results, h('div', { class: 'status', text: errText(e) }));
      }
    };
    input.addEventListener('input', () => {
      clearTimeout(timer);
      const q = input.value.trim().replace(/^#/, '');
      if (q.length < 2) {
        seq++;
        delete results.dataset.q;
        fill(results, opts.idle ? opts.idle() : null);
        return;
      }
      timer = setTimeout(() => run(q), 250);
    });
    input.addEventListener('keydown', (e) => {
      const q = input.value.trim().replace(/^#/, '');
      if (e.key !== 'Enter' || !q) return;
      e.preventDefault();
      if (opts.pickOnly) {
        // Cruzar hashtags: Enter elige el primero (o lo escrito tal cual).
        const first = results.dataset.q === q && results.querySelector('.result a');
        if (first) return first.click();
        return opts.onPick({ type: 'tag', name: q });
      }
      // Esconde el teclado y deja a la vista la lista de resultados.
      input.blur();
      if (q.length < 2) return;
      clearTimeout(timer);
      if (results.dataset.q !== q) {
        fill(results, h('div', { class: 'status' }, icon('spinner', 18, 'spin'), 'Buscando…'));
        run(q);
      }
    });
    if (autofocus) setTimeout(() => input.focus(), 60);
    if (opts.idle) fill(results, opts.idle());
    return { el: h('div', { class: 'search' }, h('label', {}, icon('search', 20), input)), results, input };
  }

  function userRow(u, onPick, onFollow, badge) {
    const row = personRow(u.name, u.id, 'Usuario · ' + fmt(validCount(userJunkKey(u.name), u.posts)) + ' posts', () => onPick && onPick({ type: 'user', name: u.name, pic: u.id }), followPill(u.name, u.id, onFollow));
    if (badge) row.querySelector('.n').append(' ', badge);
    return row;
  }
  // La fuente de una fila del buscador: JR (JoyReactor) o RG (RedGifs).
  const srcChip = (s) => h('span', { class: 'srcb ' + s, title: s === 'rg' ? 'De RedGifs' : 'De JoyReactor', text: s.toUpperCase() });
  // Un creador de RedGifs en los resultados: su foto, cuántos posts tiene y Seguir.
  function rgCreatorRow(c, onPick, badge) {
    const name = c.username;
    const extra = c.name && c.name.toLowerCase() !== name.toLowerCase() ? c.name.slice(0, 40) + ' · ' : '';
    return h('div', { class: 'result' },
      h('a', { href: '#/rguser/' + enc(name), onclick: () => onPick && onPick({ type: 'rguser', name, pic: c.profileImageUrl || '' }) },
        rgPic(name, c.profileImageUrl, 'htile'),
        h('span', { class: 'rtext' },
          h('span', { class: 'n' }, '@' + name, badge ? ' ' : null, badge),
          h('span', { class: 'm ellipsis', text: extra + 'Creador · ' + fmt(c.gifs || c.publishedGifs || 0) + ' posts en RedGifs' })
        )
      ),
      rgFollowPill(name, c.profileImageUrl || '')
    );
  }
  function rgFollowPill(name, pic) {
    const b = h('button', { class: 'small-btn follow' });
    const paint = () => {
      const on = isRgFollowed(name);
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', String(on));
      b.setAttribute('aria-label', (on ? 'Dejar de seguir a ' : 'Seguir a ') + name);
      fill(b, on ? 'Siguiendo' : 'Seguir');
    };
    b.addEventListener('click', (e) => {
      e.preventDefault();
      const on = !isRgFollowed(name);
      setRgFollow(name, on, pic);
      paint();
      toast(on ? 'Sigues a ' + name + ' (RedGifs)' : 'Dejaste de seguir a ' + name);
      if (on && !picOf('rguser', name)) askPic('rguser', name);
    });
    paint();
    return b;
  }
  // Una etiqueta de RedGifs en los resultados: + abre «Seguir como hashtag o como cuenta».
  function rgTagResult(t, onPick, badge) {
    const name = t.text;
    const b = h('button', { class: 'ib followb', 'data-follow-rgtag': name, 'aria-haspopup': 'dialog', onclick: () => openRgFollowSheet(name) });
    b._paint = () => {
      const on = !!rgTagOf(name);
      b.classList.toggle('on', on);
      b.setAttribute('aria-label', on ? 'Siguiendo #' + name + ' (RedGifs)' : 'Seguir #' + name + ' (RedGifs)');
      fill(b, icon(on ? 'check' : 'plus', 22));
    };
    b._paint();
    return h('div', { class: 'result' },
      h('a', { href: '#/rgtag/' + enc(name), onclick: () => onPick && onPick({ type: 'rgtag', name }) },
        rgTagPic(name, 'htile'),
        h('span', { class: 'rtext' },
          h('span', { class: 'n' }, name, badge ? ' ' : null, badge),
          h('span', { class: 'm', text: fmt(t.gifs || 0) + ' posts en RedGifs' })
        )
      ),
      b
    );
  }

  // Fila de un hashtag en los resultados: + abre «Seguir como hashtag o como cuenta» (✓ si ya lo sigues).
  // pickOnly: tocarlo solo lo elige (cruzar hashtags), no abre el hashtag ni ofrece seguirlo.
  function resultRow(t, onFav, onPick, pickOnly, badge) {
    const star = pickOnly ? null : followTagBtn(t.name);
    return h('div', { class: 'result' },
      h('a', { href: '#/tag/' + enc(t.name), onclick: (e) => {
        if (pickOnly) e.preventDefault();
        if (onPick) onPick({ type: 'tag', name: t.name, pic: t.image ? RS.numId(t.id) : 0 });
      } },
        tagPic(t.name, 'htile', '#', t.image ? RS.numId(t.id) : 0),
        h('span', { class: 'rtext' },
          h('span', { class: 'n' }, t.name, t.nsfw ? h('span', { class: 'nsfw', text: 'NSFW' }) : null, badge ? ' ' : null, badge),
          h('span', { class: 'm', text: fmt(validCount(tagJunkKey(t.name), t.count)) + ' posts' + (badge ? ' en JoyReactor' : '') })
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
    if (!list.length) return null;
    const rows = list.map((x) => {
      // Lo de RedGifs (1.10.2) lleva su marca y abre su página.
      const rg = x.type === 'rguser' || x.type === 'rgtag';
      const person = x.type === 'user' || x.type === 'rguser';
      const href = '#/' + (x.type === 'user' || rg ? x.type : 'tag') + '/' + enc(x.name);
      const pic =
        x.type === 'user' ? userPic(x.name, x.pic)
        : x.type === 'rguser' ? rgPic(x.name, x.pic, 'htile')
        : x.type === 'rgtag' ? rgTagPic(x.name, 'htile')
        : tagPic(x.name, 'htile', '#', x.pic === undefined ? undefined : x.pic);
      return h('div', { class: 'result' },
        h('a', { href, onclick: () => recordSearch(x) },
          pic,
          h('span', { class: 'rtext' },
            h('span', { class: 'n' }, (person ? '@' : '#') + x.name, rg ? ' ' : null, rg ? srcChip('rg') : null),
            h('span', { class: 'm', text: (x.type === 'user' ? 'Usuario' : x.type === 'rguser' ? 'Creador de RedGifs' : x.type === 'rgtag' ? 'Hashtag de RedGifs' : 'Hashtag') + ' · ' + ago(x.at) })
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

  // Botón para seguir un hashtag desde una lista: + abre «como hashtag o como cuenta» (✓ si ya lo sigues).
  function followTagBtn(name) {
    const b = h('button', { class: 'ib followb', 'data-follow-tag': name, 'aria-haspopup': 'dialog', onclick: () => openFollowSheet(name, false) });
    b._paint = () => {
      const on = isFollowedTag(name);
      b.classList.toggle('on', on);
      b.setAttribute('aria-label', on ? 'Siguiendo #' + name + ': cambiar o dejar de seguir' : 'Seguir #' + name);
      fill(b, icon(on ? 'check' : 'plus', 22));
    };
    b._paint();
    return b;
  }

  // Buscar sin escribir: los perfiles que visitaste (en una fila) y hashtags que te pueden gustar.
  function visitedRow() {
    const list = (S.userHistory || []).slice(0, 15);
    if (!list.length) return null;
    return h('section', {},
      h('div', { class: 'secline' }, h('h2', { class: 'grow section-label', text: 'Perfiles que visitaste' }), h('a', { class: 'link-btn', href: '#/visited' }, 'Ver todos')),
      h('div', { class: 'avrow' },
        list.map((x) => h('a', { class: 'avitem', href: '#/user/' + enc(x.name) }, userPic(x.name, x.userId, 'avpic'), h('span', { text: x.name })))
      )
    );
  }
  // Los hashtags que más salen en tus me gusta (lo más específico de cada post) y que no sigues ni bloqueaste.
  function suggestedTags() {
    const counts = {};
    for (const x of Object.values(S.likes)) if (x.post) for (const t of leafTags(x.post.tags)) counts[t.name] = (counts[t.name] || 0) + 1;
    const list = Object.entries(counts)
      .filter(([t, n]) => n >= 2 && !isFollowedTag(t) && !isBlocked(t))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);
    if (!list.length) return null;
    return h('section', {},
      h('div', { class: 'secline' }, h('h2', { class: 'grow section-label', text: 'Te pueden gustar' })),
      list.map(([t, n]) =>
        h('div', { class: 'result' },
          h('a', { href: '#/tag/' + enc(t), onclick: () => recordSearch({ type: 'tag', name: t }) },
            tagPic(t, 'htile', '#'),
            h('span', { class: 'rtext' }, h('span', { class: 'n', text: '#' + t }), h('span', { class: 'm', text: 'En ' + n + ' de tus me gusta' }))
          ),
          followTagBtn(t)
        )
      )
    );
  }

  // ================================================================ Explorar (1.9.0)
  //
  // Buscar es como el Explorar de Instagram (lo eligió el usuario, opción B): arriba la lupa, que abre el
  // buscador (#/find), y unas fichas (Para ti, tus hashtags más mirados, ✦ Descubrir); debajo, una
  // cuadrícula de posts con los GIF y videos en un cuadro alto. Tocar uno lo abre en grande y se sigue
  // deslizando, como en Instagram; «atrás» (o tocar Buscar abajo) vuelve a la cuadrícula.
  // · Para ti: posts «Bueno» al azar de tus hashtags, pesados por lo que más miras (exploreTags), sin
  //   repetir lo que ya viste.
  // · Descubrir: más o menos 1 de cada 6 viene de un hashtag que no sigues ni miraste esta semana pero que
  //   sale junto a los tuyos (en tus me gusta, tu historial o lo ya cargado aquí). Lleva «✦ Nuevo».
  // Sin nada de eso (la app recién instalada), sale lo «Bueno» de todo JoyReactor.
  function exploreTags() {
    const score = new Map();
    const add = (t, w) => {
      if (!t || isBlocked(t) || RS.isFormatTag(t)) return;
      const x = score.get(tkey(t)) || { name: t, w: 0 };
      x.w += w;
      score.set(tkey(t), x);
    };
    for (const [t, ms] of Object.entries(weekTime().tags || {})) add(t, ms / 60000); // 1 por minuto mirado
    // Sin el árbol de un hashtag cuentan también sus carpetas (#anime, #fandoms): se pide para la próxima vez.
    for (const x of Object.values(S.likes)) if (x.post) {
      needTree(x.post.tags);
      for (const t of leafTags(x.post.tags)) add(t.name, 2);
    }
    for (const f of favList()) add(f.name, 5);
    for (const t of Object.values(S.tagProfiles)) add(t.name, 5);
    if (srcMode() !== 'jr') for (const t of Object.values(S.rgTags)) add(t.name, 5);
    return Array.from(score.values()).sort((a, b) => b.w - a.w).slice(0, 15);
  }
  function discoverTags(mine, extra) {
    const known = new Set(mine.map((x) => tkey(x.name)));
    const watched = new Set(Object.keys(weekTime().tags || {}).map(tkey));
    const count = new Map();
    const posts = Object.values(S.likes).map((x) => x.post).concat((S.history || []).map((x) => x.post), extra || []);
    for (const p of posts) {
      if (!p || !p.tags) continue;
      for (const t of leafTags(p.tags)) {
        const k = tkey(t.name);
        if (known.has(k) || watched.has(k) || isFollowedTag(t.name) || isBlocked(t.name) || RS.isFormatTag(t.name)) continue;
        const x = count.get(k) || { name: t.name, w: 0 };
        x.w++;
        count.set(k, x);
      }
    }
    return Array.from(count.values()).sort((a, b) => b.w - a.w).slice(0, 12);
  }
  async function fetchExplore(f) {
    const ex = f.exp || (f.exp = { mine: exploreTags(), loaded: [] });
    const chip = f.chip;
    const st = { favorites: S.favorites, mix: S.mix, seenSet: S.seenSet, filter: pass };
    const opts = { type: 'GOOD', era: 'any', noRepeat: true, skip: f.ids, hideNsfw: S.settings.hideNsfw };
    const toSrc = (list) => list.map((x) => ({ name: x.name, kind: null, w: x.w }));
    const mine = chip === 'all' ? toSrc(ex.mine) : chip === 'new' ? null : [{ name: chip, kind: null, w: 1 }];
    const disc = chip === 'all' || chip === 'new' ? toSrc(discoverTags(ex.mine, ex.loaded)) : [];
    const [a, b] = await Promise.all([
      // Sin hashtags tuyos, sources: [] = lo «Bueno» de todo JoyReactor.
      mine ? RS.randomBatch(st, Object.assign({ n: 5, sources: mine }, opts)) : Promise.resolve([]),
      disc.length ? RS.randomBatch(st, Object.assign({ n: chip === 'new' ? 5 : 1, sources: disc }, opts)).catch(() => []) : Promise.resolve([])
    ]);
    const out = a.map((x) => ({ post: x.post, label: x.source ? 'Porque ves #' + x.source : null, icon: 'search' }));
    // Los de Descubrir, repartidos entre los tuyos.
    for (const x of b) out.splice(Math.floor(Math.random() * (out.length + 1)), 0, { post: x.post, discover: x.source, label: '✦ Nuevo para ti · #' + x.source, icon: 'search', color: 'var(--accent)' });
    ex.loaded = ex.loaded.concat(out.map((it) => it.post)).slice(-200);
    if (!out.length) {
      f.emptyStreak++;
      if (f.emptyStreak >= 4) {
        f.done = true;
        f.endText = 'No encontré más posts nuevos. Desliza hacia abajo arriba del todo para otra mezcla.';
      }
    } else f.emptyStreak = 0;
    return out;
  }
  // Las fichas: Para ti, tus 3 hashtags más mirados y Descubrir.
  function exploreChips(chip) {
    const list = [['all', 'Para ti']].concat(exploreTags().slice(0, 3).map((x) => [x.name, '#' + x.name]), [['new', '✦ Descubrir']]);
    if (!list.some(([id]) => id === chip)) list.splice(1, 0, [chip, '#' + chip]);
    return h('nav', { class: 'chips', 'aria-label': 'Qué ver' },
      list.map(([id, label]) =>
        h('button', {
          class: 'chip' + (id === chip ? ' on' : ''),
          'aria-pressed': String(id === chip),
          onclick: () => id !== chip && navReplace('#/search' + (id === 'all' ? '' : '?c=' + enc(id)))
        }, label)
      )
    );
  }
  function routeSearch(q) {
    const chip = (q && q.get('c')) || 'all';
    const key = 'explore:' + tkey(chip);
    const f = cached(key, () => {
      const feed = new Feed({
        key,
        kind: 'explore',
        source: 'explore',
        chip,
        // RedGifs: en Para ti se turnan tus hashtags más mirados (sin ninguno, lo popular); en una ficha, ese hashtag.
        rgPlan: () =>
          chip === 'new'
            ? null
            : { q: chip === 'all' ? (exploreTags().length ? { rotate: exploreTags().slice(0, 5).map((x) => rgTagFor(x.name)) } : { order: 'popular' }) : { tags: rgTagFor(chip), order: 'trending', random: true }, general: true },
        mode: 'grid',
        head: (f) => (f.mode === 'feed'
          ? [backBtn('/search'), h('h1', { text: 'Explorar' })]
          : [h('button', { type: 'button', class: 'search-pill', onclick: () => nav('#/find') }, icon('search', 20), h('span', { text: 'Buscar' }))]),
        extra: () => exploreChips(chip),
        empty: () => (chip === 'new'
          ? emptyBox('search', 'Todavía no hay nada para descubrir', 'Mira posts y dales me gusta: de ahí salen los hashtags nuevos para ti.')
          : emptyBox('search', 'No encontré posts', 'Desliza hacia abajo arriba del todo para intentar otra vez.'))
      });
      feed.root.classList.add('explore-feed');
      return feed;
    });
    showFeed(f);
    gridOnArrival(f);
  }

  // El buscador (la lupa de Explorar): recientes, cruzar hashtags, perfiles que visitaste y sugerencias.
  function routeFind() {
    let sb = null;
    const idle = () => {
      const parts = [crossLink(), recentSearches(() => fill(sb.results, idle())), visitedRow(), suggestedTags()].filter(Boolean);
      return parts.length ? h('div', {}, parts) : h('p', { class: 'foot-note', text: 'Aquí verás lo que buscaste. Escribe un hashtag, una categoría o el nombre de un usuario.' });
    };
    sb = searchBox('Buscar hashtag o @usuario', true, null, true, { onPick: recordSearch, idle });
    mount([
      h('header', { class: 'top has-back' }, backBtn('/search'), h('h1', { text: 'Buscar' })),
      sb.el,
      sb.results
    ]);
    // Al seguir un hashtag de «Te pueden gustar», sale de la lista.
    pageFollowHook = () => {
      if (!sb.input.value.trim()) fill(sb.results, idle());
    };
  }

  // ================================================================ Cruzar hashtags (1.8.1)
  //
  // Los posts que llevan varios hashtags a la vez (#/cross?t=A&t=B…), con la búsqueda de JoyReactor, que
  // cuenta hasta 1000. Se ven al azar, como un hashtag. Se llega desde Buscar («Cruzar hashtags») o desde
  // el menú de un hashtag («Cruzar con otro hashtag…»). Arriba, cada hashtag es una ficha (tocarla lo
  // quita) y «Añadir» abre el buscador.
  const CROSS_MAX = 5;
  const crossUrl = (tags) => '#/cross' + (tags.length ? '?' + tags.map((t) => 't=' + enc(t)).join('&') : '');
  const crossLink = () =>
    h('a', { class: 'cross-link', href: '#/cross' },
      icon('hash', 22),
      h('span', { class: 'grow' }, h('b', { text: 'Cruzar hashtags' }), h('small', { text: 'Los posts que llevan varios a la vez' })),
      icon('chevright', 18)
    );
  const crossRow = (name) =>
    sheetRow('search', 'Cruzar con otro hashtag…', 'Solo los posts que llevan los dos.', () => {
      closeSheet();
      nav(crossUrl([name]));
    });
  // Buscador para elegir otro hashtag: tocar uno lo suma (no abre el hashtag).
  function crossPicker(tags, autofocus) {
    return searchBox(tags.length ? 'Otro hashtag para cruzar' : 'Buscar un hashtag', autofocus, null, false, {
      pickOnly: true,
      onPick: (x) => {
        if (x.type !== 'tag' || !x.name) return;
        closeSheet();
        if (!tags.some((t) => tkey(t) === tkey(x.name))) navReplace(crossUrl(tags.concat(x.name)));
      }
    });
  }
  function crossChips(tags, onAdd) {
    return h('div', { class: 'wrap cross-chips' },
      tags.map((t) => h('button', { type: 'button', class: 'xchip cross', 'aria-label': 'Quitar #' + t, onclick: () => navReplace(crossUrl(tags.filter((x) => x !== t))) }, '#' + t, icon('x', 16))),
      tags.length < CROSS_MAX ? h('button', { type: 'button', class: 'xchip add', onclick: onAdd }, icon('plus', 16), 'Añadir') : null
    );
  }
  function openCrossAdd(tags) {
    const sb = crossPicker(tags, true);
    openSheet('Añadir un hashtag', h('div', { class: 'sheet-title', text: 'Cruzar también con…' }), sb.el, sb.results);
  }
  function routeCross(q) {
    const tags = [];
    for (const raw of q.getAll('t')) {
      const t = raw.trim().replace(/^#/, '');
      if (t && tags.length < CROSS_MAX && !tags.some((x) => tkey(x) === tkey(t))) tags.push(t);
    }
    if (tags.length < 2) {
      // Falta al menos uno: el buscador queda en la página.
      const sb = crossPicker(tags, true);
      mount([
        h('header', { class: 'top has-back' }, backBtn('/find'), h('h1', { text: 'Cruzar hashtags' })),
        tags.length ? crossChips(tags, () => sb.input.focus()) : null,
        h('p', { class: 'countline cross-note', text: tags.length ? 'Elige otro: verás solo los posts que llevan los dos.' : 'Elige dos o más hashtags: verás solo los posts que los llevan todos.' }),
        sb.el,
        sb.results
      ]);
      return;
    }
    const key = 'cross:' + tags.map(tkey).sort().join('|');
    const los = 'los ' + ['', '', 'dos', 'tres', 'cuatro', 'cinco'][tags.length];
    const countEl = h('p', { class: 'countline' });
    const showCount = (n) => fill(countEl, n >= 1000 ? '1000 o más posts llevan ' + los + ' (JoyReactor cuenta hasta 1000)' : n === 1 ? 'Un post lleva ' + los : fmt(n) + ' posts llevan ' + los);
    const f = cached(key, () => new Feed({
      key,
      kind: 'cross',
      cross: tags,
      mode: 'feed',
      back: true,
      onTotal: showCount,
      head: (f) => [backBtn('/find'), h('h1', { text: 'Cruzar hashtags' }), viewToggle(f)],
      extra: (f) => {
        if (f.crossOrder) showCount(f.total);
        return [crossChips(tags, () => openCrossAdd(tags)), countEl];
      },
      empty: () => emptyBox('hash', 'Ningún post los lleva todos', 'Quita alguno tocando su ficha.')
    }));
    showFeed(f);
  }

  // ================================================================ Aleatorio

  function mixSummary() {
    const srcs = RS.mixSources(S);
    if (!srcs.length) {
      return h('div', { class: 'notice' },
        h('strong', { text: 'Tu mezcla está vacía' }),
        h('span', { text: 'Por ahora te muestro posts al azar de todo JoyReactor. Elige qué categorías y hashtags entran y cuánto pesa cada uno.' }),
        h('div', { class: 'row-btns' }, h('a', { class: 'btn blue', href: Object.keys(S.favorites).length ? '#/mix' : '#/following' }, icon('sliders', 18), 'Personalizar'))
      );
    }
    // Tu mezcla en una línea fina: tocarla abre Personalizar.
    const total = srcs.reduce((a, s) => a + s.w, 0);
    const parts = srcs
      .map((s) => ({ name: s.name, kind: s.kind, pct: Math.round((s.w / total) * 100), color: mixColor(s.name) }))
      .sort((a, b) => b.pct - a.pct);
    return h('a', { class: 'mixline', href: '#/mix', 'aria-label': 'Tu mezcla: ' + parts.map((p) => RS.label(p.name, p.kind) + ' ' + p.pct + '%').join(', ') + '. Toca para personalizarla.' },
      h('div', { class: 'bar' }, parts.map((p) => h('span', { style: { width: p.pct + '%', background: p.color } }))),
      h('div', { class: 'mixline-row' },
        h('div', { class: 'legend' }, parts.map((p) => h('span', {}, h('i', { style: { background: p.color } }), RS.label(p.name, p.kind), ' ', h('em', { text: p.pct + '%' })))),
        icon('chevright', 18)
      )
    );
  }

  function routeRandom() {
    const f = cached('random', () =>
      new Feed({
        key: 'random',
        kind: 'random',
        head: (f) => [
          h('h1', { text: 'Aleatorio' }),
          h('button', { class: 'ib', 'aria-label': 'Barajar otra vez', title: 'Barajar otra vez', onclick: () => f.reset() }, icon('refresh', 22))
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
      { id: 'tags', href: '#/following', ic: 'hash', label: 'Hashtags', n: Object.keys(S.favorites).length + Object.values(S.rgTags).filter((t) => t.as === 'tag').length },
      { id: 'users', href: '#/following?tab=users', ic: 'user', label: 'Perfiles', n: Object.keys(S.following).length + Object.keys(S.tagProfiles).length + Object.keys(S.rgFollowing).length + Object.values(S.rgTags).filter((t) => t.as === 'account').length }
    ]);
  }

  // Una etiqueta de RedGifs que sigues (como hashtag o como cuenta), en las listas de Seguidos.
  function rgTagRow(x) {
    return h('div', { class: 'result' },
      h('a', { href: '#/rgtag/' + enc(x.name) },
        rgTagPic(x.name, 'htile'),
        h('span', { class: 'rtext' }, h('span', { class: 'n' }, x.name, ' ', h('span', { class: 'srcb rg', text: 'RG' })), h('span', { class: 'm', text: x.as === 'account' ? 'Etiqueta de RedGifs que sigues como cuenta' : 'Etiqueta de RedGifs' }))
      ),
      h('button', { class: 'small-btn follow on', 'aria-label': 'Dejar de seguir #' + x.name, onclick: () => followRgTag(x.name, null) }, 'Siguiendo'),
      rowMore('rgtag', x.name)
    );
  }
  function routeFollowing(q) {
    if (q.get('tab') === 'users') return routeFollowingUsers();
    const lists = h('div', { class: 'follow-list' });
    const tabsEl = h('div');
    const sb = searchBox('Buscar hashtag o categoría para seguir', false, () => drawLists());

    function drawLists() {
      fill(tabsEl, followTabs('tags'));
      const favs = favList();
      const srcs = RS.mixSources(S);
      const total = srcs.reduce((a, s) => a + s.w, 0) || 1;
      const mixText = (name) => {
        const s = srcs.find((x) => x.name === name);
        return s ? Math.round((s.w / total) * 100) + ' % del Aleatorio' : 'fuera del Aleatorio';
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
      // Como en Perfiles: la campanita y «Siguiendo» (tocarlo deja de seguir, con Deshacer). Cuánto pesa en
      // el Aleatorio queda escrito y se cambia en Aleatorio › Personalizar o en el ⋯ del hashtag.
      const unfollowBtn = (f) =>
        h('button', {
          class: 'small-btn follow on',
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
        }, 'Siguiendo');
      const row = (f) =>
        h('div', { class: 'result' },
          h('a', { href: '#/tag/' + enc(f.name) },
            tagPic(f.name, 'htile', f.kind === 'category' ? f.name.charAt(0).toUpperCase() : '#'),
            h('span', { class: 'rtext' },
              h('span', { class: 'n', text: f.name }),
              h('span', { class: 'm', text: (f.kind === 'category' ? 'Categoría' : 'Hashtag') + (S.settings.randomTab ? ' · ' + mixText(f.name) : '') })
            )
          ),
          bellBtn(f),
          unfollowBtn(f),
          rowMore('tag', f.name)
        );

      // Las etiquetas de RedGifs que sigues como hashtag (1.10.0).
      const rgTags = Object.values(S.rgTags).filter((t) => t.as === 'tag');
      fill(lists,
        favs.length || rgTags.length
          ? h('p', { class: 'countline', style: { paddingTop: '10px' }, text: 'Sigues ' + [favs.length ? (favs.length === 1 ? '1 hashtag' : favs.length + ' hashtags y categorías') : '', rgTags.length ? rgTags.length + ' de RedGifs' : ''].filter(Boolean).join(' · ') + '.' })
          : emptyBox('hash', 'Todavía no sigues ningún hashtag', 'Búscalo arriba y toca +, entra a un hashtag y toca Seguir, o mantén presionado un hashtag.'),
        favs.map(row),
        rgTags.map(rgTagRow)
      );
    }

    drawLists();
    mount([h('header', { class: 'top has-back' }, backBtn('/likes'), h('h1', { text: 'Seguidos' })), tabsEl, sb.el, sb.results, lists]);
    pageFollowHook = drawLists; // al seguir desde el buscador de arriba (menú «como hashtag o como cuenta»)
  }

  // Seguidos › Perfiles: los usuarios que sigues y los hashtags que sigues como cuenta, lo último primero.
  function routeFollowingUsers() {
    const listEl = h('div', { class: 'follow-list' });
    const tabsEl = h('div');
    // Un creador de RedGifs que sigues (1.10.0).
    const rgRow = (x) =>
      h('div', { class: 'result' },
        h('a', { href: '#/rguser/' + enc(x.name) },
          rgPic(x.name, x.pic, 'htile'),
          h('span', { class: 'rtext' }, h('span', { class: 'n' }, x.name, ' ', h('span', { class: 'srcb rg', text: 'RG' })), h('span', { class: 'm', text: 'Creador de RedGifs' }))
        ),
        h('button', {
          class: 'small-btn follow on',
          'aria-label': 'Dejar de seguir a ' + x.name,
          onclick: () => {
            setRgFollow(x.name, false);
            draw();
            toast('Dejaste de seguir a ' + x.name, 'Deshacer', () => {
              S.rgFollowing[rgKey(x.name)] = x;
              persist('rgFollowing', 0);
              invalidateHome();
              draw();
            });
          }
        }, 'Siguiendo'),
        rowMore('rguser', x.name)
      );
    const tagRow = (x) =>
      h('div', { class: 'result' },
        h('a', { href: '#/tag/' + enc(x.name) },
          tagPic(x.name, 'htile', '#', x.pic),
          h('span', { class: 'rtext' }, h('span', { class: 'n', text: '#' + x.name }), h('span', { class: 'm', text: 'Hashtag que sigues como cuenta' }))
        ),
        h('button', {
          class: 'ib bellb' + (x.notify ? ' on' : ''),
          'aria-pressed': String(!!x.notify),
          'aria-label': (x.notify ? 'Dejar de avisar de posts nuevos en #' : 'Avisarme de posts nuevos en #') + x.name,
          onclick: () => {
            setProfileNotify(x.name, !x.notify);
            draw();
          }
        }, icon(x.notify ? 'bell' : 'belloff', 21)),
        h('button', {
          class: 'small-btn follow on',
          'aria-label': 'Dejar de seguir #' + x.name,
          onclick: () => {
            setTagProfile(x.name, null, false);
            draw();
            toast('Dejaste de seguir #' + x.name, 'Deshacer', () => {
              S.tagProfiles[tkey(x.name)] = x;
              persist('tagProfiles', 0);
              invalidateHome();
              draw();
            });
          }
        }, 'Siguiendo'),
        rowMore('tag', x.name)
      );
    const draw = () => {
      fill(tabsEl, followTabs('users'));
      const list = Object.values(S.following).sort((a, b) => (b.addedAt || 0) - (a.addedAt || 0));
      const tagList = Object.values(S.tagProfiles);
      const rgList = Object.values(S.rgFollowing);
      const rgAccounts = Object.values(S.rgTags).filter((t) => t.as === 'account');
      const all = list
        .map((x) => ({ x, at: x.addedAt || 0 }))
        .concat(tagList.map((x) => ({ x, at: x.addedAt || 0, tag: true })), rgList.map((x) => ({ x, at: x.addedAt || 0, rg: true })), rgAccounts.map((x) => ({ x, at: x.addedAt || 0, rgtag: true })))
        .sort((a, b) => b.at - a.at);
      const people = list.length === 1 ? 'a 1 usuario' : 'a ' + list.length + ' usuarios';
      const tags = tagList.length === 1 ? '1 hashtag' : tagList.length + ' hashtags';
      const count = (!tagList.length
        ? 'Sigues ' + people
        : list.length
          ? 'Sigues ' + people + ' y ' + tags + ' como cuenta'
          : 'Sigues ' + tags + ' como cuenta') + (rgList.length + rgAccounts.length ? ' · ' + (rgList.length + rgAccounts.length) + ' de RedGifs.' : '.');
      fill(listEl,
        all.length
          ? h('p', { class: 'countline', style: { paddingTop: '10px' }, text: count })
          : emptyBox('users', 'Todavía no tienes perfiles', 'Toca Seguir al lado del nombre de quien publicó un post. Un hashtag también puede ser una cuenta: entra a él, toca Seguir y elige «Como cuenta».'),
        all.map(({ x, tag, rg, rgtag }) =>
          rgtag ? rgTagRow(x) : rg ? rgRow(x) : tag ? tagRow(x) : personRow(x.name, x.userId, 'Lo sigues desde ' + (ago(x.addedAt) || 'antes'), null,
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
            }),
            rowMore('user', x.name)
          )
        )
      );
    };
    const sb = searchBox('Buscar @usuario', false, null, true, { usersOnly: true, onFollow: () => draw() });
    draw();
    mount([h('header', { class: 'top has-back' }, backBtn('/likes'), h('h1', { text: 'Seguidos' })), tabsEl, sb.el, sb.results, listEl]);
    pageFollowHook = draw;
  }

  // ================================================================ Favoritos: me gusta e historial

  function favTabs(active) {
    return pageTabs('Favoritos', active, [
      { id: 'likes', href: '#/likes', ic: 'heart', label: 'Me gusta' },
      { id: 'history', href: '#/history', ic: 'clock', label: 'Historial' }
    ]);
  }

  // Dentro del Historial: los posts que miraste o los perfiles que visitaste.
  const likedItems = () => Object.values(S.likes).sort((a, b) => b.at - a.at).map((x) => ({ post: x.post }));
  function routeLikes(q) {
    const fid = q && q.get('folder');
    const folder = fid ? S.folders[fid] : null;
    if (fid && !folder) return navReplace('#/likes');
    const all = Object.values(S.likes).sort((a, b) => b.at - a.at);
    const pick = () => {
      const f = fid && S.folders[fid];
      const keep = f ? new Set(f.ids) : null;
      return likedItems().filter((x) => !keep || keep.has(x.post.id));
    };
    const items = pick();
    const sig = all.length + '|' + (all[0] ? all[0].at : 0) + (folder ? '|' + fid + ':' + folder.ids.length : '');

    const f = cached('likes:' + sig, () => new Feed({
      key: 'likes',
      kind: 'static',
      source: 'likes',
      items,
      reload: pick,
      memoryKey: 'likes' + (fid ? ':' + fid : ''),
      anchor: feedMemory.get('likes' + (fid ? ':' + fid : '')),
      mode: 'grid',
      head: (f) => (f.sel ? selectionHead(f, 'likes', fid ? S.folders[fid] : null) : [h('h1', { text: 'Tú' })]),
      extra: () => [meHeader('likes'), favTabs('likes'), folderStrip(fid), fid && S.folders[fid] ? folderBar(S.folders[fid]) : null],
      empty: () => (fid
        ? emptyBox('folder', 'Esta carpeta está vacía', 'En Todos, mantén presionada una miniatura, elige los posts y toca Mover.')
        : emptyBox('heart', 'Todavía no tienes me gusta', 'Toca el corazón en cualquier post.'))
    }));
    showFeed(f);
    gridOnArrival(f);
  }

  // Me gusta e Historial se abren siempre en miniaturas; tocar una abre ese post en grande. Si llegas
  // con «atrás» (p. ej. desde un hashtag), quedan como estaban.
  function gridOnArrival(f) {
    if (f.mode !== 'grid' && (!lastNavWasBack || lastNavFromTab)) f.setMode('grid', f.anchorId || f.topVisibleId());
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
    if (p.user && !RS.isRg(p)) {
      t.users[p.user] = (t.users[p.user] || 0) + ms;
      if (p.userId) t.ids[p.user] = p.userId;
    }
    for (const x of leafTags(p.tags)) t.tags[x.name] = (t.tags[x.name] || 0) + ms;
    pruneCounts(t.tags, 800);
    pruneCounts(t.users, 400);
    saveStats();
  }

  // Un hashtag se descarta si casi todo su tiempo viene de otro que tiene dentro (fandoms ← anime ←
  // Touhou Project): así quedan los específicos. pathsOf(nombre) = sus carpetas de arriba.
  function specificTags(cand, pathsOf) {
    const isAbove = (a, b) => (pathsOf(b) || []).some((x) => tkey(x) === tkey(a)); // ¿a contiene a b?
    return cand.filter(([name, ms]) => !cand.some(([other, ms2]) => other !== name && isAbove(name, other) && ms2 >= ms * 0.6));
  }
  const topOf = (obj, n) => Object.entries(obj || {}).sort((a, b) => b[1] - a[1]).slice(0, n);

  // Los 10 usuarios y hashtags con más tiempo.
  async function summarize(t, lenient) {
    const users = topOf(t.users, 10).map(([name, ms]) => ({ name, userId: (t.ids || {})[name] || 0, ms }));
    const cand = topOf(t.tags, 30);
    let paths = {};
    try {
      paths = await RS.fetchTagPaths(cand.map(([n]) => n));
    } catch (e) {
      if (!lenient) throw e; // sin conexión: el resumen final se calcula más tarde
    }
    const tags = specificTags(cand, (b) => paths[b])
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
        syncWeekNative();
        // Ya está el resumen: el aviso de Inicio y el puntito de ⚙ aparecen sin salir y volver a entrar.
        if (current && current.feed && /^(home|likes|history)/.test(current.feed.key)) current.feed.refresh();
      })
      .catch(() => {})
      .finally(() => (finishing = null));
    return finishing;
  }

  // ---- Resumen de los lunes: el lunes a las 9 Android avisa con una notificación (con lo que le pasa
  // syncWeekNative cada vez que usas la app); dentro de la app hay un aviso arriba de Inicio y un
  // puntito en ⚙ hasta que lo mires. Se mira como historias (#/recap) o como lista (#/week).
  const RECAP_DAYS = 21; // un resumen más viejo ya no se anuncia
  const recapUnseen = () => !!S.weekly.week && S.weekly.seen !== S.weekly.week && Date.now() - Number(S.weekly.week) < RECAP_DAYS * 86400000;
  function markRecapSeen(week) {
    if (!week || S.weekly.seen === week) return;
    S.weekly.seen = week;
    persist('weekly', 0);
    syncWeekNative();
    onNewsChanged();
  }
  /** Tiempo con la app abierta en la semana que empieza en `week` (lunes 0:00, en ms). */
  function weekUsage(week) {
    const days = stats().days;
    let ms = 0;
    for (let i = 0; i < 7; i++) {
      const d = days[dayKey(Number(week) + i * 86400000 + 12 * 3600000)];
      if (d) ms += d.ms;
    }
    return ms;
  }
  // Lo que necesita la notificación de una semana: tiempo total, usuario #1 y hashtag #1.
  function weekBrief(week, users, tags) {
    const u = users[0];
    const t = tags[0];
    return { week: String(week), total: weekUsage(week), user: u ? u.name : '', userMs: u ? u.ms : 0, tag: t ? t.name : '', tagMs: t ? t.ms : 0 };
  }
  // Una semana sin calcular todavía: el hashtag #1 sale del árbol que ya está guardado en el teléfono.
  function liveBrief(t) {
    const users = topOf(t.users, 1).map(([name, ms]) => ({ name, ms }));
    const tags = specificTags(topOf(t.tags, 30), (b) => (knownTree(b) || {}).p).map(([name, ms]) => ({ name, ms }));
    return weekBrief(t.key, users, tags);
  }
  function syncWeekNative() {
    if (!RS.android || typeof RS.android.syncWeek !== 'function') return;
    const t = stats().time;
    const w = S.weekly;
    try {
      RS.android.syncWeek(
        JSON.stringify({
          cur: t.key ? liveBrief(t) : null,
          pend: w.pending ? liveBrief(w.pending) : null,
          last: w.week ? weekBrief(w.week, w.users, w.tags) : null,
          seen: w.seen || ''
        })
      );
    } catch (e) {
      /* puente antiguo */
    }
  }
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) syncWeekNative();
  });

  // Aviso en Novedades (la campanita lo cuenta): Ver abre las historias; Ocultar lo saca de ahí (el puntito
  // de ⚙ sigue hasta que lo mires).
  function recapBanner() {
    const w = S.weekly;
    if (!recapUnseen() || w.later === w.week) return null;
    const u = w.users[0];
    const t = w.tags[0];
    const who = u && t ? 'Tu #1 fue @' + u.name + ' y tu hashtag, #' + t.name + '.' : u ? 'Tu #1 fue @' + u.name + '.' : t ? 'Tu hashtag #1 fue #' + t.name + '.' : '';
    return h('section', { class: 'notice recap-note' },
      h('strong', {}, icon('trophy', 19), 'Tu resumen de la semana está listo'),
      who ? h('span', { text: who }) : null,
      h('div', { class: 'row-btns' },
        h('a', { class: 'btn', href: '#/recap' }, 'Ver'),
        h('button', {
          class: 'btn quiet',
          onclick: () => {
            w.later = w.week;
            persist('weekly', 0);
            onNewsChanged();
            if (current && current.feed) current.feed.refresh();
          }
        }, 'Ocultar')
      )
    );
  }

  // Historias del resumen: se pasan tocando (a la derecha sigue, a la izquierda vuelve) o solas cada
  // STORY_MS. Al terminar queda la lista en Ajustes › Resumen de la semana.
  const STORY_MS = 6000;
  function routeRecap() {
    weekTime();
    const page = h('div', { class: 'recap' }, h('div', { class: 'status' }, icon('spinner', 20, 'spin'), 'Preparando tu resumen…'));
    mount(page);
    (async () => {
      if (S.weekly.pending) await finishWeek();
      const w = S.weekly;
      let sum = w.week ? { week: w.week, users: w.users, tags: w.tags, prev: w.prev } : null;
      if (w.pending) {
        // Sin conexión: un resumen provisional con lo que hay en el teléfono.
        const s2 = await summarize(w.pending, true);
        sum = { week: w.pending.key, users: s2.users, tags: s2.tags, prev: w.week ? { users: w.users.map((u) => u.name), tags: w.tags.map((x) => x.name) } : null };
      }
      if (!page.isConnected) return;
      if (!sum) {
        const next = new Date(weekStart(Date.now()) + 7 * 86400000).toLocaleDateString('es', { day: 'numeric', month: 'long' });
        fill(page,
          h('button', { class: 'vw-btn rc-x', 'aria-label': 'Cerrar', onclick: () => goBack('#/home') }, icon('x', 24)),
          emptyBox('trophy', 'Tu primer resumen estará listo el lunes ' + next, 'Se arma con el tiempo que miras los posts de cada usuario y de cada hashtag.')
        );
        return;
      }
      markRecapSeen(sum.week);
      playStories(page, sum);
    })().catch(() => fill(page, emptyBox('alert', 'No pude armar el resumen', 'Prueba otra vez en un rato.')));
  }

  function storySlides(sum) {
    const day = (t) => new Date(t).toLocaleDateString('es', { day: 'numeric', month: 'long' });
    const total = weekUsage(sum.week);
    const before = weekUsage(Number(sum.week) - 7 * 86400000);
    const diff = total - before;
    const k = (text) => h('span', { class: 'rc-k', text });
    const list = (rows) => h('ol', { class: 'rc-list' }, rows);
    const slides = [];
    slides.push([
      k('Tu semana'),
      h('span', { class: 'rc-big', text: fmtDur(total) }),
      h('span', { class: 'rc-sub', text: 'mirando JoyReactor' + (before && Math.abs(diff) >= 60000 ? ', ' + fmtDur(Math.abs(diff)) + (diff > 0 ? ' más' : ' menos') + ' que la semana anterior.' : '.') }),
      h('span', { class: 'rc-dim', text: 'Del ' + day(Number(sum.week)) + ' al ' + day(Number(sum.week) + 6 * 86400000) })
    ]);
    const u = sum.users[0];
    if (u) {
      slides.push([
        k('Tu usuario #1'),
        h('span', { class: 'rc-av' }, avatar({ user: u.name, userId: u.userId })),
        h('span', { class: 'rc-big', text: '@' + u.name }),
        h('span', { class: 'rc-sub', text: fmtDur(u.ms) + ' mirando sus posts' })
      ]);
      slides.push([
        k(sum.users.length === 1 ? 'Tu usuario' : 'Tus ' + sum.users.length + ' usuarios'),
        list(sum.users.map((x, i) => h('li', {}, h('b', { text: String(i + 1) }), h('span', { class: 'ellipsis', text: '@' + x.name }), h('span', { text: fmtDur(x.ms) }))))
      ]);
    }
    if (sum.tags.length) {
      slides.push([
        k(sum.tags.length === 1 ? 'Tu hashtag' : 'Tus ' + sum.tags.length + ' hashtags'),
        list(sum.tags.map((x, i) => h('li', {}, h('b', { text: String(i + 1) }), h('span', { class: 'ellipsis', text: '#' + x.name }), h('span', { text: fmtDur(x.ms) }))))
      ]);
    }
    // Quién subió o bajó respecto de la semana anterior (lo que más se movió primero).
    if (sum.prev) {
      const moves = [];
      const scan = (items, prev, mark) =>
        items.forEach((x, i) => {
          const j = prev.indexOf(x.name);
          if (j < 0) moves.push({ label: mark + x.name, d: 99, text: 'Nuevo' });
          else if (j !== i) moves.push({ label: mark + x.name, d: j - i, text: (j > i ? '+' : '−') + Math.abs(j - i) });
        });
      scan(sum.users, sum.prev.users || [], '@');
      scan(sum.tags, sum.prev.tags || [], '#');
      moves.sort((a, b) => Math.abs(b.d) - Math.abs(a.d));
      if (moves.length) {
        slides.push([
          k('Subieron y bajaron'),
          list(moves.slice(0, 7).map((m) => h('li', {}, h('b', { text: m.d === 99 ? '★' : m.d > 0 ? '▲' : '▼' }), h('span', { class: 'ellipsis', text: m.label }), h('span', { class: 'mv ' + (m.d === 99 ? 'new' : m.d > 0 ? 'up' : 'down'), text: m.text })))),
          h('span', { class: 'rc-dim', text: 'respecto de la semana anterior' })
        ]);
      }
    }
    return slides;
  }

  function playStories(page, sum) {
    const slides = storySlides(sum);
    let i = 0;
    let timer = null;
    const bars = h('div', { class: 'rc-bars' }, slides.map(() => h('span', {}, h('i'))));
    const body = h('div', { class: 'rc-body' });
    const done = () => {
      clearTimeout(timer);
      if (page.isConnected) navReplace('#/week');
    };
    const show = () => {
      clearTimeout(timer);
      Array.from(bars.children).forEach((b, j) => (b.className = j < i ? 'done' : j === i ? 'cur' : ''));
      fill(body, h('div', { class: 'rc-slide' }, slides[i]));
      timer = setTimeout(next, STORY_MS);
    };
    const next = () => {
      if (!page.isConnected) return clearTimeout(timer);
      if (i >= slides.length - 1) return done();
      i++;
      show();
    };
    page.addEventListener('click', (e) => {
      if (e.target.closest('button, a')) return;
      if (e.clientX < window.innerWidth * 0.3 && i > 0) {
        i--;
        show();
      } else next();
    });
    fill(page,
      bars,
      h('button', {
        class: 'vw-btn rc-x',
        'aria-label': 'Cerrar el resumen',
        onclick: () => {
          clearTimeout(timer);
          goBack('#/home');
        }
      }, icon('x', 24)),
      body,
      h('div', { class: 'rc-foot' }, h('span', { text: 'Toca para seguir' }), h('button', { class: 'link-btn', onclick: done }, 'Ver la lista'))
    );
    show();
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
    markRecapSeen(w.week);
    const day = (t) => new Date(t).toLocaleDateString('es', { day: 'numeric', month: 'long' });
    const nextMonday = weekStart(Date.now()) + 7 * 86400000;
    const label = (text) => h('h2', { class: 'sec section-label', style: { padding: '18px 16px 4px' }, text });
    const live = h('div', {}, h('div', { class: 'status' }, icon('spinner', 20, 'spin'), 'Calculando…'));
    const final = w.week
      ? [
          h('p', { class: 'countline', style: { padding: '14px 16px 0' }, text: 'Semana del ' + day(Number(w.week)) + ' al ' + day(Number(w.week) + 6 * 86400000) + '. Es el tiempo que miraste los posts de cada uno; se calcula una vez, al terminar la semana.' }),
          h('div', { style: { padding: '12px 16px 0' } }, h('a', { class: 'small-btn', href: '#/recap' }, icon('play', 16), 'Verlo como historias')),
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
      mode: 'grid',
      head: (f) => (f.sel ? selectionHead(f, 'history') : [h('h1', { text: 'Tú' })]),
      extra: () => [
        meHeader('history'),
        favTabs('history'),
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
    gridOnArrival(f);
  }

  // Perfiles que visitaste (los últimos 50): se abre desde Buscar.
  function routeVisited() {
    const body = h('div');
    const draw = () => {
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
    mount([h('header', { class: 'top has-back' }, backBtn('/find'), h('h1', { text: 'Perfiles visitados' })), body]);
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
    const items =(S.news.items || []).map((x) => ({ post: x.post, label: (x.kind === 'user' ? 'Nuevo de ' : 'Nuevo en ') + RS.label(x.tag, x.kind), icon: 'bell', color: 'var(--green)' }));

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
      // Lo que se vigila se vuelve a leer cada vez (pudiste tocar una campanita desde la última visita).
      extra: () => {
        const list = watchList();
        return [restoreBanner(), recapBanner()].concat(list.length
          ? h('p', { class: 'countline', style: { paddingTop: '12px' } },
              'Vigilando ' + list.join(', ') + '. Última revisión: ' + (S.news.lastCheck ? ago(S.news.lastCheck) : 'todavía no') + '. ',
              h('a', { href: '#/settings', text: S.settings.notify ? 'Avisos cada ' + S.settings.interval + ' min' : 'Avisos desactivados' })
            )
          : h('div', { class: 'notice' },
              h('strong', { text: 'Elige de qué quieres enterarte' }),
              h('span', { text: 'Toca la campanita en los hashtags o usuarios que sigues y te avisaré cuando salgan posts nuevos.' }),
              h('div', { class: 'row-btns' }, h('a', { class: 'btn blue', href: '#/following' }, icon('bell', 18), 'Ir a Seguidos'))
            ));
      },
      empty: () => emptyBox('bell', 'Sin novedades por ahora', watchList().length ? 'Cuando salgan posts nuevos en lo que vigilas aparecerán aquí.' : null)
    }));
    showFeed(f);
  }

  // ================================================================ Ajustes y respaldo

  // Lo que va en un respaldo: todo menos lo que la app vuelve a pedir sola (árbol de hashtags, páginas
  // con posts retirados, épocas del Aleatorio).
  const NO_BACKUP = new Set(['eraCache', 'tagTree', 'junkScan']);
  async function backupData() {
    flush();
    const data = await RS.load(RS.KEYS.filter((k) => !NO_BACKUP.has(k)));
    data._app = 'reactor-swipe';
    data._version = 1;
    data._exported = new Date().toISOString();
    return data;
  }

  // ---- Respaldo automático (app de Android). Al desinstalar, Android borra todo lo que la app guarda;
  // por eso, cada vez que la app pasa a segundo plano y cambió algo importante (o una vez al día), se
  // escribe un respaldo en Descargas › ReactorSwipe, que no se borra. Al reinstalar, se restaura desde
  // ahí (restoreBanner en Novedades, que cuenta la campanita, o Ajustes › Respaldo y versión › Restaurar).
  const BACKUP_EVERY = 24 * 3600000;
  const hasUserData = () =>
    Object.keys(S.likes).length + Object.keys(S.favorites).length + Object.keys(S.following).length + Object.keys(S.tagProfiles).length + Object.keys(S.dislikes).length > 0;
  function backupSig() {
    const likes = Object.values(S.likes);
    return [likes.length, likes.reduce((m, x) => Math.max(m, x.at || 0), 0), Object.keys(S.favorites).length, Object.keys(S.following).length, Object.keys(S.tagProfiles).length, Object.keys(S.dislikes).length, S.mix.exclude.length, Object.keys(S.pics).length, Object.values(S.pics).reduce((m, x) => Math.max(m, x.at || 0), 0), Object.values(S.folders).reduce((n, f) => n + f.ids.length + 1, 0), Object.keys(S.rgFollowing).length, Object.keys(S.rgTags).length, Object.keys(S.rgLinks).length, Object.keys(S.rgMix).length].join('|');
  }
  let backingUp = null;
  function autoBackup(force) {
    if (!RS.android || typeof RS.android.autoBackup !== 'function') return Promise.reject(new Error('Respaldo no disponible'));
    if (backingUp) return backingUp;
    // Una app recién instalada y vacía no escribe nada: así no tapa un respaldo de antes.
    if (!hasUserData()) return Promise.resolve(null);
    const sig = backupSig();
    if (!force && sig === S.backup.sig && Date.now() - S.backup.at < BACKUP_EVERY) return Promise.resolve(null);
    const before = { at: S.backup.at, sig: S.backup.sig };
    S.backup.at = Date.now();
    S.backup.sig = sig;
    backingUp = backupData()
      .then((data) => RS.native('autoBackup', JSON.stringify(data)))
      .catch((e) => {
        Object.assign(S.backup, before);
        throw e;
      })
      .finally(() => {
        backingUp = null;
        persist('backup', 0);
      });
    return backingUp;
  }
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) autoBackup(false).catch(() => {});
  });

  // Elegir un archivo de respaldo y restaurarlo (fresh = la app está vacía: no hace falta preguntar).
  function pickBackup(fresh) {
    const input = h('input', { type: 'file', accept: 'application/json,.json', class: 'visually-hidden', 'aria-label': 'Archivo de respaldo' });
    input.addEventListener('change', () => {
      const file = input.files && input.files[0];
      input.remove();
      if (file) importBackup(file, fresh).catch((e) => toast(errText(e)));
    });
    document.body.append(input);
    input.click();
  }

  // Novedades, con la app vacía (recién instalada o reinstalada): ofrece restaurar el respaldo (la
  // campanita lo cuenta, así se ve desde Inicio).
  function restoreBanner() {
    if (!RS.android || hasUserData() || S.backup.skip) return null;
    return h('section', { class: 'notice' },
      h('strong', { text: '¿Reinstalaste la app?' }),
      h('span', { text: 'Recupera tus me gusta, lo que sigues y tus perfiles desde el respaldo: está en Descargas › ReactorSwipe.' }),
      h('div', { class: 'row-btns' },
        h('button', { class: 'btn blue', onclick: () => pickBackup(true) }, icon('upload', 18), 'Restaurar'),
        h('button', {
          class: 'btn quiet',
          onclick: () => {
            S.backup.skip = true;
            persist('backup', 0);
            onNewsChanged();
            if (current && current.feed) current.feed.refresh();
          }
        }, 'Empezar de cero')
      )
    );
  }

  async function exportBackup() {
    const data = await backupData();
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

  async function importBackup(file, fresh) {
    let data = null;
    try {
      data = JSON.parse(await file.text());
    } catch (e) {
      data = null;
    }
    if (!data || data._app !== 'reactor-swipe') throw new Error('Ese archivo no es un respaldo de Reactor Swipe. Busca reactor-swipe-respaldo en Descargas › ReactorSwipe.');
    if (!fresh && hasUserData() && !confirm('Esto reemplaza tus me gusta, ocultos, lo que sigues, el historial y la mezcla actuales. ¿Continuar?')) return;
    const out = {};
    for (const k of RS.KEYS) if (!NO_BACKUP.has(k) && k in data) out[k] = data[k];
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

  // ---- Piezas de Ajustes (también las usa Herramientas de debug).
  const navLine = (ic, title, text, href, dot) =>
    h('a', { class: 'line navline', href },
      h('span', { class: 'navline-ic' + (dot ? ' has-dot' : '') }, icon(ic, 20)),
      h('div', { class: 'grow' }, h('span', { class: 'sname', text: title }), h('span', { class: 'smeta', text })),
      icon('chevright', 18)
    );
  const setGroup = (title, ...kids) => h('div', { class: 'setgroup' }, h('h2', { class: 'sec section-label', style: { padding: '18px 16px 6px' }, text: title }), ...kids);
  // Un interruptor; sus opciones (sub) solo se ven mientras está encendido.
  const switchLine = (title, text, on, onToggle, sub) => {
    const subEl = sub ? h('div', { class: 'subopts' }, sub) : null;
    if (subEl) subEl.hidden = !on;
    return [
      h('div', { class: 'line' },
        h('div', { class: 'grow' }, h('span', { class: 'sname', text: title }), text ? h('span', { class: 'smeta', text }) : null),
        switchBtn(on, title, (v) => {
          onToggle(v);
          if (subEl) subEl.hidden = !v;
        })
      ),
      subEl
    ];
  };
  const segField = (title, text, options, value, onPick) =>
    h('div', { class: 'field' }, h('span', { class: 't', text: title }), text ? h('span', { class: 'd', text }) : null, seg(options, value, onPick));

  // Ajustes (un botón de la barra de abajo), por uso: Tu actividad, Lo que no quieres ver, Avisos, Cómo se
  // ve, Funciones para el futuro, Herramientas de debug y Respaldo y versión. Lo que depende de un
  // interruptor (cada cuánto revisar, la sensibilidad) solo se ve encendido.
  function routeSettings() {
    const st = S.settings;
    const save = () => persist('settings', 0);
    const fileInput = h('input', { type: 'file', accept: 'application/json,.json', class: 'visually-hidden', 'aria-label': 'Archivo de respaldo' });
    fileInput.addEventListener('change', () => {
      const file = fileInput.files && fileInput.files[0];
      if (file) importBackup(file).catch((e) => toast(errText(e)));
      fileInput.value = '';
    });
    const watching = watchList();
    const group = setGroup;
    const nHidden = Object.keys(S.dislikes).length;
    const nBlocked = S.mix.exclude.length;

    mount([
      h('header', { class: 'top' }, h('h1', { text: 'Ajustes' })),
      group('Fuentes',
        segField('De dónde salen los posts', 'En Inicio, en Buscar y en cada hashtag. Cada post lleva un mini icono: JR (JoyReactor) o RG (RedGifs). Todo lo de RedGifs es NSFW: «Ocultar posts NSFW» lo esconde.', [['both', 'Las dos'], ['jr', 'JoyReactor'], ['rg', 'RedGifs']], srcMode(), (v) => {
          st.sources = v;
          save();
          dropFeeds();
        })
      ),
      group('Tu actividad',
        recapUnseen()
          ? navLine('trophy', 'Resumen de la semana', 'Ya está el de la semana pasada: toca para verlo.', '#/recap', true)
          : navLine('trophy', 'Resumen de la semana', 'Los 10 usuarios y hashtags que más tiempo miraste.', '#/week'),
        navLine('chart', 'Estadísticas', 'Cuánto y cómo usas la app (solo en este teléfono).', '#/stats'),
        segField('Historial: guardar hasta', 'Los posts que miras más de 10 segundos. Al llenarse se borran los más viejos.', [[50, '50'], [100, '100'], [200, '200'], [500, '500']], Number(st.historyMax) || 100, (v) => {
          st.historyMax = v;
          S.history = (S.history || []).slice(0, v);
          persist('history');
          save();
        })
      ),
      group('Lo que no quieres ver',
        navLine('ban', 'Hashtags bloqueados', (nBlocked ? (nBlocked === 1 ? '1 hashtag. ' : nBlocked + ' hashtags. ') : '') + 'Sus posts no salen en ningún feed ni en los avisos.', '#/blocked'),
        navLine('down', 'Posts ocultos', (nHidden ? (nHidden === 1 ? '1 post' : fmt(nHidden) + ' posts') + ' con «no me gusta». ' : 'Los posts con «no me gusta». ') + 'Aquí puedes recuperarlos.', '#/hidden'),
        switchLine('Ocultar posts NSFW', 'En todos los feeds y en los avisos.', st.hideNsfw, (on) => {
          st.hideNsfw = on;
          save();
          refreshFilter();
          for (const [k, f] of feeds) {
            f.destroy();
            feeds.delete(k);
          }
        })
      ),
      group('Avisos',
        switchLine('Avisarme con notificación', watching.length ? 'Vigilando: ' + watching.join(', ') : 'Toca la campanita en los hashtags o usuarios que sigues para elegir qué vigilar.', st.notify, (on) => {
          st.notify = on;
          save();
        }, [
          segField('Revisar cada', null, [[15, '15 min'], [30, '30 min'], [60, '1 hora']], Number(st.interval), (v) => {
            st.interval = v;
            save();
          }),
          segField('Avisar de', null, [['NEW', 'Todo lo nuevo'], ['GOOD', 'Solo los buenos']], st.notifyType, (v) => {
            st.notifyType = v;
            save();
          })
        ]),
        androidPermissionRows(),
        RS.android ? null : h('p', { class: 'smeta', style: { padding: '0 16px 14px' }, text: 'Android puede cerrar Firefox en segundo plano para ahorrar batería y entonces los avisos se retrasan. Si no te llegan: Ajustes de Android → Apps → Firefox → Batería → Sin restricciones.' })
      ),
      group('Cómo se ve',
        switchLine('Estrellas y rating', 'La reputación del autor (★) y el rating del post en JoyReactor (↑), en el feed y en pantalla completa.', st.showScores, (on) => {
          st.showScores = on;
          save();
          applyDisplay();
        }),
        switchLine('Adelantar arrastrando el dedo', 'En pantalla completa, mantén el dedo sobre un video o GIF y arrástralo: a la derecha adelanta, a la izquierda atrasa.', st.seekDrag, (on) => {
          st.seekDrag = on;
          save();
        }, segField('Sensibilidad', 'Cuánto avanza al cruzar la pantalla de lado a lado. En un video más corto, cruzarla lo recorre entero.', [[15, '15 s'], [30, '30 s'], [60, '1 min'], [120, '2 min']], Number(st.seekSpan) || 60, (v) => {
          st.seekSpan = v;
          save();
        }))
      ),
      group('Funciones para el futuro',
        switchLine('Aleatorio', 'Posts al azar de lo que sigues, con tu mezcla. Encendido, vuelve a la barra de abajo.', !!st.randomTab, (on) => {
          st.randomTab = on;
          save();
          syncTabs();
          for (const [k, f] of feeds) {
            if (current && current.feed === f) continue;
            f.destroy();
            feeds.delete(k);
          }
        })
      ),
      group('Herramientas de debug',
        navLine('sliders', 'Herramientas de debug', 'Tiempo para seleccionar, tamaño de las fotos de Seguidos, fecha de los posts y árbol de hashtags.', '#/debug')
      ),
      group('Respaldo y versión',
        h('div', { class: 'field' },
          h('span', { class: 'd', style: { marginTop: '0' }, text: 'Tus datos viven solo en este teléfono: si desinstalas la app, Android los borra.' + (RS.android ? ' Hay un respaldo automático en Descargas › ReactorSwipe (' + (S.backup.at ? 'el último, ' + ago(S.backup.at) : 'todavía no hay') + '); si reinstalas, toca Restaurar y elige ese archivo.' : '') }),
          h('div', { class: 'inline-add' },
            RS.android
              ? h('button', {
                  class: 'btn',
                  onclick: (e) => {
                    const b = e.currentTarget;
                    b.disabled = true;
                    autoBackup(true)
                      .then((r) => {
                        toast(r ? 'Respaldo guardado en Descargas › ReactorSwipe' : 'Todavía no hay nada que respaldar');
                        if (r) routeSettings();
                      })
                      .catch((err) => toast(errText(err)))
                      .finally(() => (b.disabled = false));
                  }
                }, icon('download', 18), 'Respaldar ahora')
              : h('button', { class: 'btn', onclick: exportBackup }, icon('download', 18), 'Exportar'),
            h('button', { class: 'btn ghost', onclick: () => fileInput.click() }, icon('upload', 18), RS.android ? 'Restaurar' : 'Importar'),
            fileInput
          )
        ),
        h('div', { class: 'line' },
          h('div', { class: 'grow' },
            h('span', { class: 'sname', text: 'Reactor Swipe ' + RS.version() }),
            h('span', { class: 'smeta', text: !RS.android ? 'Versión de navegador.' : S.update ? 'Ya salió la ' + S.update.version + '. Tócalo y después «Instalar».' : 'Toca Actualizar: si hay una versión nueva, se descarga y se instala.' })
          ),
          // Un solo botón: busca y, si hay versión nueva, la descarga y abre el instalador.
          h('button', {
            class: 'small-btn' + (S.update ? ' follow' : ''),
            onclick: (e) => {
              const b = e.currentTarget;
              if (S.update) return installUpdate(b);
              b.disabled = true;
              fill(b, icon('spinner', 16, 'spin'), 'Buscando…');
              lookForUpdate(true, b).finally(() => {
                if (installing) return;
                b.disabled = false;
                fill(b, icon('download', 16), 'Actualizar');
              });
            }
          }, icon('download', 16), S.update ? 'Actualizar a ' + S.update.version : 'Actualizar')
        )
      ),
      h('p', { class: 'about', text: 'Lee JoyReactor con su API pública; no publica nada ni guarda tus datos fuera del teléfono.' })
    ]);
  }

  // Ajustes › Hashtags bloqueados.
  function routeBlocked() {
    mount([h('header', { class: 'top has-back' }, backBtn('/settings'), h('h1', { text: 'Hashtags bloqueados' })), blockedField(null, false)]);
  }

  // Ajustes › Herramientas de debug: ajustes finos y herramientas para entender la app.
  function routeDebug() {
    const st = S.settings;
    const save = () => persist('settings', 0);
    mount([
      h('header', { class: 'top has-back' }, backBtn('/settings'), h('h1', { text: 'Herramientas de debug' })),
      setGroup('Gestos',
        segField('Tiempo para seleccionar varios', 'Cuánto hay que mantener presionada una miniatura de Me gusta o Historial para empezar a seleccionar.', [[300, '0,3 s'], [500, '0,5 s'], [1000, '1 s'], [2000, '2 s']], Number(st.selectHold) || 500, (v) => {
          st.selectHold = v;
          save();
        })
      ),
      setGroup('Seguidos',
        segField('Tamaño de las fotos', 'Lo grandes que se ven las fotos y los GIF de los perfiles y hashtags que sigues.', [[44, 'Chica'], [64, 'Mediana'], [84, 'Grande'], [110, 'Muy grande']], Number(st.rowPic) || 64, (v) => {
          st.rowPic = v;
          save();
          applyDisplay();
        })
      ),
      setGroup('Posts',
        switchLine('Fecha de los posts', 'Cuándo se publicó cada post («hace 3 h»).', st.showDates, (on) => {
          st.showDates = on;
          save();
          applyDisplay();
        })
      ),
      // Intro al abrir (1.10.1): elegir una duración la muestra; «Ver el intro» la repite.
      setGroup('Intro al abrir',
        segField('Duración', 'Cuánto tarda el mosaico de tus me gusta. Al elegir una, se ve.', [[800, '0,8 s'], [1500, '1,5 s'], [2500, '2,5 s'], [4000, '4 s']], Number(st.introMs) || INTRO_MS, (v) => {
          st.introMs = v;
          save();
          showIntro();
        }),
        h('button', { type: 'button', class: 'line navline', onclick: () => showIntro() },
          h('span', { class: 'navline-ic' }, icon('play', 20)),
          h('div', { class: 'grow' }, h('span', { class: 'sname', text: 'Ver el intro' }), h('span', { class: 'smeta', text: 'Sin reiniciar la app. Un toque lo salta.' }))
        )
      ),
      setGroup('Hashtags',
        navLine('hash', 'Árbol de hashtags', 'Herramienta temporal: qué hashtags hay dentro de cada uno, como carpetas.', '#/tree')
      )
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

  window.RSApp = {
    tabId: null,
    navigate(hash) {
      if (location.hash === hash) route();
      else location.hash = hash;
    },
    // Botón «atrás» de Android: 1) cierra el menú que sube desde abajo, 2) cierra la pantalla completa,
    // 3) vuelve a las miniaturas si abriste un post desde ahí, 4) vuelve a la página anterior, 5) desde
    // otra sección vuelve a Inicio, 6) desde Inicio sale de la app.
    handleBack() {
      if (introEnd) {
        introEnd();
        return 'handled';
      }
      if (closePicZoom()) return 'handled';
      if (cancelCropper()) return 'handled';
      if (closeSheet()) return 'handled';
      if (current && current.feed && endSelect(current.feed)) return 'handled';
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
      if (Date.now() - lastUpdateCheck > UPDATE_EVERY) lookForUpdate(false);
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

  // Aleatorio solo está en la barra si lo encendiste (Ajustes › Funciones para el futuro), y Ajustes lleva
  // un puntito mientras haya un resumen de la semana sin mirar.
  function syncTabs() {
    const r = document.querySelector('#tabs [data-tab="random"]');
    if (r) r.hidden = !S.settings.randomTab;
    const st = document.querySelector('#tabs [data-tab="settings"]');
    if (st) st.classList.toggle('has-dot', recapUnseen());
  }
  function initTabs() {
    document.querySelectorAll('#tabs [data-icon]').forEach((s) => s.replaceWith(icon(s.dataset.icon, 24)));
    syncTabs();
    document.querySelectorAll('#tabs a').forEach((a) =>
      a.addEventListener('click', (e) => {
        // Tú con un post en grande (Me gusta o Historial) o Buscar con uno de Explorar: vuelve a las miniaturas.
        const f = current && current.feed;
        if (f && f.mode === 'feed' && f.root.isConnected && ((a.dataset.tab === 'me' && (f.source === 'likes' || f.source === 'history')) || (a.dataset.tab === 'search' && f.source === 'explore'))) {
          e.preventDefault();
          f.setMode('grid', f.topVisibleId());
          return;
        }
        tabTapped = true;
        if (a.getAttribute('href') === location.hash || (a.dataset.tab === 'home' && /^#\/home/.test(location.hash))) {
          tabTapped = false;
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      })
    );
  }

  // ================================================================ Intro al abrir (1.9.0)
  //
  // Mosaico (lo eligió el usuario, opción C): al abrir la app de cero, miniaturas de tus últimos me gusta
  // pasan por detrás del logo y se abren hacia Inicio, que se va cargando por detrás. Dura INTRO_MS y un
  // toque lo salta. No sale al volver a la app desde segundo plano: boot corre una sola vez.
  // La duración se elige en Herramientas de debug (S.settings.introMs, 1.10.1): todas las animaciones se
  // estiran con --k (duración / INTRO_MS), y ahí mismo se puede ver otra vez sin reiniciar.
  const INTRO_MS = 1500;
  let introEnd = null; // cierra el intro que está a la vista («atrás» de Android)
  function showIntro() {
    if (introEnd) introEnd(true);
    const ms = Number(S.settings.introMs) || INTRO_MS;
    const k = ms / INTRO_MS;
    const posts = Object.values(S.likes)
      .sort((a, b) => b.at - a.at)
      .map((x) => x.post)
      .filter((p) => p && p.media && p.media[0] && p.media[0].kind !== 'embed');
    const tiles = [];
    for (let i = 0; i < 15; i++) {
      const m = posts.length ? posts[i % posts.length].media[0] : null;
      const src = m ? (m.kind === 'video' ? RS.posterUrl(m) : RS.imageUrl(m)) : '';
      tiles.push(h('i', { style: '--d:' + (i % 5) * 0.08 * k + 's' + (src ? ';background-image:url("' + src + '")' : '') }));
    }
    let done = false;
    const el = h('div', { id: 'intro', 'aria-hidden': 'true', style: '--k:' + k, onclick: () => end() },
      h('div', { class: 'in-wall' }, tiles),
      h('div', { class: 'in-logo' }, h('b', { text: 'Reactor' }), h('span', { text: 'Swipe' }))
    );
    const end = (now) => {
      if (done) return;
      done = true;
      if (introEnd === end) introEnd = null;
      if (now) return el.remove();
      el.classList.add('out');
      setTimeout(() => el.remove(), 350);
    };
    introEnd = end;
    document.body.append(el);
    setTimeout(end, ms);
  }

  async function boot() {
    try {
      history.scrollRestoration = 'manual';
    } catch (e) {
      /* no disponible */
    }
    Object.assign(S, await RS.load(RS.KEYS.filter((k) => k !== 'eraCache')));
    showIntro();
    S.seenSet = new Set(S.seen);
    startUsageClock();
    refreshFilter();
    needTree(S.mix.exclude);
    applyDisplay();
    refreshFavIndex();
    if (RS.android) {
      loadNativeNews();
      syncNative();
    }
    initTabs();
    initPullToRefresh();
    weekTime(); // si ya empezó otra semana, el resumen de la anterior se calcula al abrir la app
    finishWeek();
    syncWeekNative();
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
