// public/service-worker.js

const CACHE_NAME = 'sennin-tube-v1';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/video.html',
  '/style.css',
  '/main.js',
  '/video.js',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// インストール時にキャッシュ
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] キャッシュ開始');
      return cache.addAll(URLS_TO_CACHE);
    })
  );
});

// リクエストをキャッシュから返す
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((res) => {
      return res || fetch(event.request);
    })
  );
});

// 古いキャッシュを削除
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((name) => {
          if (!cacheWhitelist.includes(name)) {
            console.log('[ServiceWorker] 古いキャッシュ削除:', name);
            return caches.delete(name);
          }
        })
      )
    )
  );
});
