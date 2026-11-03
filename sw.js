/* Rostrum service worker: cache the whole app so it runs fully offline. Bump VERSION when files change. */
var VERSION = 'rostrum-v1';
var FILES = [
  './', 'index.html', 'manifest.webmanifest', 'css/app.css', 'icons/icon.svg', 'icons/icon-192.png', 'icons/icon-512.png',
  'js/content/curriculum.js', 'js/content/practice.js',
  'js/engine/analysis.js', 'js/engine/mentor.js', 'js/engine/forge.js', 'js/engine/srs.js',
  'js/store.js', 'js/audio.js', 'js/ui/core.js', 'js/ui/views-learn.js', 'js/ui/views-gym.js', 'js/ui/views-arena.js', 'js/ui/views-me.js', 'js/app.js'
];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(VERSION).then(function (c) { return c.addAll(FILES); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== VERSION; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
// Cache-first for app files; network fallback; offline navigation falls back to index.html.
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(function (hit) {
    return hit || fetch(e.request).then(function (res) {
      if (res.ok && new URL(e.request.url).origin === location.origin) {
        var copy = res.clone();
        caches.open(VERSION).then(function (c) { c.put(e.request, copy); });
      }
      return res;
    }).catch(function () {
      if (e.request.mode === 'navigate') return caches.match('index.html');
    });
  }));
});
