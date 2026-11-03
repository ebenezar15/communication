/* Rostrum boot: load state, theme, nav, offline service worker. */
(function (root) {
  'use strict';
  var App = root.App;
  Store.load();
  Store.expireAudio();

  App.SCHEMES = [
    { id: 'velvet', name: 'Velvet', desc: 'Theatre gold and red', swatch: ['#140e0c', '#e8b04b', '#8e1b2a', '#f6efe6'] },
    { id: 'harbour', name: 'Harbour', desc: 'Deep navy, teal, coral', swatch: ['#0b1219', '#4cc3c9', '#e0684f', '#eef3f6'] },
    { id: 'greenroom', name: 'Greenroom', desc: 'Forest, brass, rust', swatch: ['#0d1410', '#c9b458', '#c0673b', '#f1f3ec'] },
    { id: 'dressing', name: 'Dressing Room', desc: 'Plum, rose, apricot', swatch: ['#160f17', '#e88aa8', '#f0a462', '#f8f0f3'] },
    { id: 'contrast', name: 'High Contrast', desc: 'Maximum legibility', swatch: ['#000000', '#ffd500', '#ff5c8a', '#ffffff'] }
  ];
  // When embedded (e.g. a claude.ai artifact) the host may set data-theme; "Match my device" keeps the host's choice.
  var hostTheme = document.documentElement.getAttribute('data-theme');
  App.applyTheme = function () {
    var p = Store.get().profile, root = document.documentElement;
    if (p.theme === 'auto') { if (hostTheme) root.setAttribute('data-theme', hostTheme); else root.removeAttribute('data-theme'); }
    else root.setAttribute('data-theme', p.theme);
    if (p.scheme && p.scheme !== 'velvet') root.setAttribute('data-scheme', p.scheme); else root.removeAttribute('data-scheme');
    var bg = getComputedStyle(root).getPropertyValue('--bg').trim();
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta && bg) meta.setAttribute('content', bg);
  };
  App.applyTheme();

  // On-device recognition support is probed only when the user asks (Settings / onboarding),
  // because some browser builds misbehave when the probe runs unprompted. The result is remembered.
  App.localSR = Store.get().profile.localSR || null;

  function onlineBadge() {
    var b = document.getElementById('net');
    if (!b) return;
    b.textContent = navigator.onLine ? '' : 'Offline — everything still works';
    b.hidden = navigator.onLine;
  }
  root.addEventListener('online', onlineBadge);
  root.addEventListener('offline', onlineBadge);
  onlineBadge();

  if ('serviceWorker' in navigator && location.protocol !== 'file:' && !root.ROSTRUM_SINGLE_FILE) {
    navigator.serviceWorker.register('sw.js').catch(function (e) { console.warn('SW registration failed', e); });
  }
  App.render();
})(window);
