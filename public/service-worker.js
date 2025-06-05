const CACHE_NAME = 'sennin-tube-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/video.html',
  '/style.css',
  '/main.js',
  '/video.js',
  '/manifest.json',
  '/icons/icon-192.png',  // ← 任意で追加（存在すれば）
  '/icons/icon-512.png'   // ← 任意で追加（存在すれば）
];

// インストール時にキャッシュ
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(urlsToCache);
    })
  );
});

// アクティベート時に古いキャッシュを削除
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[ServiceWorker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
  return self.clients.claim();
});

// リクエスト取得時のキャッシュ制御
self.addEventListener('fetch', event => {
  // POSTやAPIは除外（YouTube APIはキャッシュ不可）
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(response => {
      // キャッシュにあれば返す、なければネットワークから取得
      return response || fetch(event.request).catch(() =>
        // オフライン時に代替ページを返す（任意）
        caches.match('/index.html')
      );
    })
  );
});
