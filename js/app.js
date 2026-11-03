/* Rostrum boot: load state, theme, nav, offline service worker. */
(function (root) {
  'use strict';
  var App = root.App;
  Store.load();
  Store.expireAudio();

  App.applyTheme = function () {
    var t = Store.get().profile.theme;
    if (t === 'auto') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', t);
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

  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    navigator.serviceWorker.register('sw.js').catch(function (e) { console.warn('SW registration failed', e); });
  }
  App.render();
})(window);
