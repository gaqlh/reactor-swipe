/* Reactor Swipe — proceso de fondo.
 * - Revisa cada X minutos tus favoritos con la campanita y avisa con una notificación.
 * - Abre la app (desde el menú de extensiones, el botón flotante o la notificación).
 * - Añade el Referer de joyreactor.com a las peticiones de la app (sin eso los GIF/videos no cargan). */
'use strict';

const ALARM = 'rs-check-news';
const NOTIF = 'rs-news';
const APP_URL = browser.runtime.getURL('app.html');
const OWN_ORIGIN = browser.runtime.getURL('');

// ---------------------------------------------------------------- Referer para imágenes, videos y API

browser.webRequest.onBeforeSendHeaders.addListener(
  (d) => {
    const from = d.documentUrl || d.originUrl || '';
    if (!from.startsWith(OWN_ORIGIN)) return {};
    const headers = d.requestHeaders.filter((x) => x.name.toLowerCase() !== 'referer');
    headers.push({ name: 'Referer', value: 'https://joyreactor.com/' });
    return { requestHeaders: headers };
  },
  { urls: ['https://*.joyreactor.com/pics/*', 'https://api.joyreactor.com/*'] },
  ['blocking', 'requestHeaders']
);

// ---------------------------------------------------------------- Revisión periódica

async function schedule() {
  const { settings } = await RS.load(['settings']);
  await browser.alarms.clear(ALARM);
  if (settings.notify) {
    browser.alarms.create(ALARM, { delayInMinutes: 1, periodInMinutes: Math.max(5, Number(settings.interval) || 15) });
  }
}

let running = null;
function check(manual) {
  if (!running) running = runCheck(manual).finally(() => (running = null));
  return running;
}

async function runCheck(manual) {
  const res = await RS.checkNews();
  if (res.total && !manual) await notify(res);
  return res;
}

async function notify(res) {
  const { settings, favorites } = await RS.load(['settings', 'favorites']);
  if (!settings.notify) return;
  const parts = Object.entries(res.per)
    .sort((a, b) => b[1] - a[1])
    .map(([name, n]) => RS.label(name, favorites[name] && favorites[name].kind) + ' (' + n + ')');
  await browser.notifications.clear(NOTIF);
  await browser.notifications.create(NOTIF, {
    type: 'basic',
    iconUrl: browser.runtime.getURL('icons/icon-96.png'),
    title: res.total === 1 ? '1 post nuevo en tus favoritos' : res.total + ' posts nuevos en tus favoritos',
    message: parts.join(' · ')
  });
}

async function markRead() {
  const { news } = await RS.load(['news']);
  news.unread = 0;
  await RS.save({ news });
}

async function updateBadge() {
  if (!browser.browserAction.setBadgeText) return;
  try {
    const { news } = await RS.load(['news']);
    await browser.browserAction.setBadgeText({ text: news.unread ? String(Math.min(news.unread, 99)) : '' });
    await browser.browserAction.setBadgeBackgroundColor({ color: '#F5A524' });
  } catch (e) {
    /* Firefox para Android no muestra insignias: no pasa nada */
  }
}

// ---------------------------------------------------------------- Abrir la app

async function openApp(hash) {
  try {
    for (const v of browser.extension.getViews({ type: 'tab' })) {
      if (v.location.href.startsWith(APP_URL) && v.RSApp && v.RSApp.tabId != null) {
        if (hash) v.RSApp.navigate(hash);
        await browser.tabs.update(v.RSApp.tabId, { active: true });
        return;
      }
    }
  } catch (e) {
    /* si no se puede reutilizar la pestaña, abro otra */
  }
  await browser.tabs.create({ url: APP_URL + (hash || '#/home') });
}

// ---------------------------------------------------------------- Eventos

browser.runtime.onInstalled.addListener(schedule);
browser.runtime.onStartup.addListener(schedule);
schedule();
updateBadge();

browser.alarms.onAlarm.addListener((a) => {
  if (a.name === ALARM) check(false).catch((e) => console.warn('Reactor Swipe: no se pudo revisar', e));
});

browser.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== 'local') return;
  if (changes.settings) {
    const o = changes.settings.oldValue || {};
    const n = changes.settings.newValue || {};
    if (o.notify !== n.notify || o.interval !== n.interval) schedule();
  }
  if (changes.news) updateBadge();
});

// Firefox descargó una versión nueva: la aplico en cuanto no estés mirando la app.
browser.runtime.onUpdateAvailable.addListener(() => {
  const tryReload = () => {
    let busy = false;
    try {
      busy = browser.extension.getViews({ type: 'tab' }).some((v) => !v.document.hidden);
    } catch (e) {
      busy = false;
    }
    if (busy) setTimeout(tryReload, 60000);
    else browser.runtime.reload();
  };
  tryReload();
});

browser.notifications.onClicked.addListener((id) => {
  browser.notifications.clear(id);
  openApp('#/news');
});

browser.browserAction.onClicked.addListener(() => openApp(''));

browser.runtime.onMessage.addListener((msg) => {
  if (!msg || typeof msg !== 'object') return undefined;
  if (msg.type === 'open-app') return openApp(typeof msg.hash === 'string' ? msg.hash : '');
  if (msg.type === 'check-now') return check(true);
  if (msg.type === 'news-read') return markRead();
  return undefined;
});
