const CACHE_NAME = 'police-radio-cache-v1';
const urlsToCache = [
  '/boukanet/',
  '/boukanet/index.html',
  '/boukanet/style.css',
  '/boukanet/script.js',
  '/boukanet/manifest.json',
  'https://fofodaman-debug.github.io/boukanet/police-siren.mp3',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});