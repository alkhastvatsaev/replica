// Service Worker — Network First (toujours la version fraîche)
const CACHE_NAME = 'cartier-pwa-v5';

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(cacheNames.map(cache => caches.delete(cache)))
    )
  );
  self.clients.claim();
});

// Network First : toujours chercher sur le réseau, cache en fallback seulement
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
