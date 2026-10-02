/* Reactor Swipe — botón flotante en joyreactor.com para abrir la app. */
(function () {
  'use strict';
  if (window.top !== window || document.getElementById('reactor-swipe-fab')) return;

  function hashForPage() {
    const m = location.pathname.match(/^\/tag\/([^/]+)/);
    return m ? '#/tag/' + m[1] : '#/home';
  }

  const host = document.createElement('div');
  host.id = 'reactor-swipe-fab';
  const root = host.attachShadow({ mode: 'closed' });
  const style = document.createElement('style');
  style.textContent = `
    button{position:fixed;right:16px;bottom:calc(84px + env(safe-area-inset-bottom));z-index:2147483646;
      height:52px;padding:0 18px 0 14px;border:0;border-radius:26px;background:#F5A524;color:#1A1206;
      font:800 15px/1 system-ui,sans-serif;display:flex;align-items:center;gap:8px;
      box-shadow:0 6px 20px rgba(0,0,0,.45);cursor:pointer}
    button:active{transform:scale(.96)}
    svg{width:22px;height:22px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}`;
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Abrir en Reactor Swipe');
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  const rect = document.createElementNS(NS, 'rect');
  for (const [k, v] of [['x', 5], ['y', 3], ['width', 14], ['height', 11], ['rx', 2]]) rect.setAttribute(k, v);
  const lines = document.createElementNS(NS, 'path');
  lines.setAttribute('d', 'M5 18h14M5 21h9');
  svg.append(rect, lines);
  const label = document.createElement('span');
  label.textContent = 'Swipe';
  btn.append(svg, label);
  btn.addEventListener('click', () => {
    browser.runtime.sendMessage({ type: 'open-app', hash: hashForPage() });
  });
  root.append(style, btn);
  document.documentElement.appendChild(host);
})();
