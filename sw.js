const CACHE_NAME = 'firefox-startpage-v2.0.0';
const OFFLINE_URL = './test.html';

// Resources to cache
const CACHE_URLS = [
    './test.html',
    './manifest.json',
    // External resources that we want to cache
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js',
    'https://www.gstatic.com/firebasejs/8.10.1/firebase-auth.js',
    'https://www.gstatic.com/firebasejs/8.10.1/firebase-database.js'
];

// Install event - cache resources
self.addEventListener('install', event => {
    console.log('Service Worker installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Service Worker caching app shell');
                return cache.addAll(CACHE_URLS);
            })
            .then(() => {
                return self.skipWaiting();
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('Service Worker activating...');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            return self.clients.claim();
        })
    );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;

    // Handle navigation requests
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request)
                .catch(() => {
                    return caches.open(CACHE_NAME)
                        .then(cache => {
                            return cache.match(OFFLINE_URL);
                        });
                })
        );
        return;
    }

    // Handle other requests with cache-first strategy
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }

                return fetch(event.request).then(response => {
                    // Don't cache non-successful responses
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    // Clone the response
                    const responseToCache = response.clone();

                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                        });

                    return response;
                });
            })
            .catch(() => {
                // Return a fallback for failed requests
                if (event.request.destination === 'image') {
                    return new Response(`
                        <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
                            <rect width="100" height="100" fill="#f0f0f0"/>
                            <text x="50" y="50" text-anchor="middle" dy=".3em" fill="#999">No Image</text>
                        </svg>
                    `, {
                        headers: { 'Content-Type': 'image/svg+xml' }
                    });
                }
            })
    );
});

// Background sync for data updates
self.addEventListener('sync', event => {
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

async function doBackgroundSync() {
    try {
        // Sync weather data
        const weatherAPI = 'https://api.openweathermap.org/data/2.5/weather?q=Berlin&units=metric&lang=de&appid=9de243494c0b295cca9337e1e96b00e2';
        const weatherResponse = await fetch(weatherAPI);
        if (weatherResponse.ok) {
            const weatherData = await weatherResponse.json();
            // Store in cache for offline use
            const cache = await caches.open(CACHE_NAME);
            cache.put('cached-weather', new Response(JSON.stringify(weatherData)));
        }
    } catch (error) {
        console.log('Background sync failed:', error);
    }
}

// Push notifications
self.addEventListener('push', event => {
    const options = {
        body: event.data ? event.data.text() : 'New update available!',
        icon: './manifest.json',
        badge: './manifest.json',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Open App',
                icon: './images/checkmark.png'
            },
            {
                action: 'close',
                title: 'Close',
                icon: './images/xmark.png'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification('Firefox Startpage', options)
    );
});

// Notification click event
self.addEventListener('notificationclick', event => {
    event.notification.close();

    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('./test.html')
        );
    }
});

// Message handling for communication with main thread
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// Periodic background sync (if supported)
self.addEventListener('periodicsync', event => {
    if (event.tag === 'weather-sync') {
        event.waitUntil(doBackgroundSync());
    }
});