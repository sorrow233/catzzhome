// Service Worker for Catzz Homepage - Optimized for Memory
const CACHE_NAME = 'catzzhome-v5-i18n-20251230';

// 只缓存关键资源（节省内存）
const urlsToCache = [
    '/',
    '/index.html',
    '/dist/output.css',
    '/src/main.js',
    '/src/components/HeroSection.js',
    '/src/lib/firebase.js',
    '/src/lib/I18n.js',
    '/src/config/HeroConfig.js',
    '/src/styles/animations.css'
    // ❌ 移除图片、字体等大文件缓存
];

// Install event - cache resources
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(urlsToCache))
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch event - Optimized strategy
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // 不缓存外部资源（Firebase, Google Fonts, 图片CDN等）
    if (url.origin !== self.location.origin) {
        return;
    }

    // 不缓存图片资源（节省内存）
    if (url.pathname.match(/\.(png|jpg|jpeg|gif|webp|svg|woff|woff2|ttf)$/i)) {
        return;
    }

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            const fetchPromise = fetch(event.request).then((networkResponse) => {
                // Check if valid response
                if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return networkResponse;
            }).catch(() => {
                // Network failure, already handled by returning cachedResponse if it exists
            });

            // Return cached response immediately if available, otherwise wait for network
            return cachedResponse || fetchPromise;
        })
    );
});
