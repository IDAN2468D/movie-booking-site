const CACHE_NAME = 'moviebook-liquid-time-v1';
const PRECACHE_ASSETS = [
  '/',
  '/offline',
  '/noise.png' // Volumetric film grain
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Only cache GET requests
  if (event.request.method !== 'GET') return;

  // Custom strategy for media/audio files (Acoustic maps & trailers)
  if (event.request.url.match(/\.(mp4|webm|mp3|wav)$/)) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) return response;
        return fetch(event.request).then((networkResponse) => {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return networkResponse;
        });
      })
    );
    return;
  }

  // Network first, falling back to cache
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});

// Listen for messages from the OfflineSyncCylinder component
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'PRECACHE_MEDIA') {
    const urls = event.data.urls;
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        return Promise.all(urls.map(url => cache.add(url).catch(err => console.error('Failed to cache', url, err))));
      })
    );
    event.source.postMessage({ type: 'SYNC_COMPLETE' });
  }
});
