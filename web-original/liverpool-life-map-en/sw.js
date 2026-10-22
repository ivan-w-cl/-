/* Liverpool Student Map · versioned service worker (shell cache). */
'use strict';
const CACHE = 'lsm-v20261020c';
const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './fonts.css?v=20261020c',
  './pwa.css?v=20261020c',
  './home-ui.css?v=20261020c',
  './subject-dock.css?v=20261020c',
  './consult-chat.css?v=20261020c',
  './home-match.css?v=20261020c',
  './life-map-embed.css?v=20261020c',
  './life-c-map.css?v=20261020c',
  './home-match-quiz.css?v=20261020c',
  './home-tools.js?v=20261020c',
  './home-ui.js?v=20261020c',
  './consult-chat.js?v=20261020c',
  './map-readability.js?v=20261020c',
  './subject-dock.js?v=20261020c',
  './home-match.js?v=20261020c',
  './life-map-embed.js?v=20261020c',
  './pwa.js?v=20261020c',
  './life-c-model.js?v=20261020c',
  './life-c-art.js?v=20261020c',
  './life-c-map.js?v=20261020c',
  './panel-drag.js?v=20261020c',
  './vendor/qrcode.min.js?v=20261020c',
  './icons/icon.svg',
  './icons/apple-touch-icon.png',
  './fonts/Nunito-latin-65.woff2',
  './fonts/Nunito-latin-ext-65.woff2'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(SHELL.map(u => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting()).catch(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE && k.startsWith('lsm-')).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
      .then(() => notifyClients({ type: 'LSM_CACHE_CHANGED' }))
  );
});

self.addEventListener('message', event => {
  const data = event.data || {};
  if (data.type === 'LSM_ACTIVATE_UPDATE') { self.skipWaiting(); return; }
  if (data.type === 'LSM_CACHE_STATUS' && event.ports && event.ports[0]) {
    caches.open(CACHE).then(cache => cache.keys()).then(keys => {
      event.ports[0].postMessage({ type: 'LSM_CACHE_STATUS', ready: keys.length > 0, savedAt: Date.now(), cache: CACHE, count: keys.length });
    }).catch(() => {
      event.ports[0].postMessage({ type: 'LSM_CACHE_STATUS', ready: false, savedAt: null, cache: CACHE, count: 0 });
    });
  }
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.includes('/api/') || url.pathname.includes('/admin')) return;

  const isHTML = req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html') || /\/(index\.html)?$/.test(url.pathname);
  if (isHTML) { event.respondWith(networkFirst(req)); return; }
  event.respondWith(cacheFirst(req));
});

async function matchReq(req) {
  return (await caches.match(req)) || (await caches.match(req, { ignoreSearch: true }));
}

async function networkFirst(req) {
  try {
    const fresh = await fetch(req);
    if (fresh && fresh.ok) { const cache = await caches.open(CACHE); cache.put(req, fresh.clone()); }
    return fresh;
  } catch (_) {
    return (await matchReq(req)) || (await caches.match('./index.html')) || Response.error();
  }
}

async function cacheFirst(req) {
  const cached = await matchReq(req);
  if (cached) return cached;
  try {
    const fresh = await fetch(req);
    if (fresh && fresh.ok) { const cache = await caches.open(CACHE); cache.put(req, fresh.clone()); }
    return fresh;
  } catch (_) { return Response.error(); }
}

function notifyClients(msg) {
  return self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => list.forEach(c => c.postMessage(msg)));
}
