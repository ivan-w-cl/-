/* Liverpool Student Map · versioned service worker (shell cache).
   From web-original/liverpool-life-map-en/sw.js, with the file list of this folder (the saved live page did not include sw.js). */
'use strict';
const CACHE = 'lsm-v20261105a';
const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './fonts-google.css',
  './pwa.css',
  './home-ui.css',
  './subject-dock.css',
  './contact-demo.css',
  './home-match.css',
  './life-map-embed.css',
  './room-photos.css',
  './booking-handoff.css',
  './panel-drag.css',
  './fancy-select.css',
  './share-cards.css',
  './home-tools.js',
  './home-ui.js',
  './contact-demo.js',
  './map-readability.js',
  './subject-dock.js',
  './home-match.js',
  './life-map-embed.js',
  './pwa.js',
  './vendor/qrcode.js',
  './room-photos.js',
  './group-pool.js',
  './booking-handoff.js',
  './panel-drag.js',
  './fancy-select.js',
  './share-cards.js',
  './pick-focus.js',
  './fun-quizzes.js',
  './mail-outbox.js',
  './fun-quizzes.css',
  './booking-tools.js',
  './quote-check.js',
  './home-insights.js',
  './home-insights.css',
  './commute.js',
  './cost-calc.js',
  './student-tools.css',
  './booking-tools.css',
  './demo-links.js',
  './icons/icon.svg',
  './icons/apple-touch-icon.png'
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

  if (url.pathname.includes('/local-snapshots/')) { event.respondWith(networkFirst(req)); return; }   // 周边数据快照：先拿最新的
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
