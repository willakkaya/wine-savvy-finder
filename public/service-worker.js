
// Service Worker for WineCheck PWA
// Version: 1.0.1

const CACHE_NAME = 'winecheck-cache-v1.0.1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/wine-background.jpg',
  '/favicon.ico',
  '/icon-192.png',
  '/icon-512.png',
  '/apple-touch-icon.png'
];

// Assets that should be cached when they're requested
const DYNAMIC_ASSETS = /\.(js|css|woff2|jpg|png|svg|webp)$/;

// Install event - cache essential files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting()) // Force service worker activation
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Clearing old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Now ready to handle fetches');
      return self.clients.claim(); // Take control of clients right away
    })
  );
});

// Fetch event - Cache-first for static assets, Network-first for API requests
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // Skip API requests and only use cache for GET requests
  if (event.request.url.includes('/api/') || event.request.method !== 'GET') {
    return;
  }

  // For static assets like JS, CSS, and images, use cache-first strategy
  if (DYNAMIC_ASSETS.test(event.request.url)) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          // Return from cache and update cache in background
          const fetchPromise = fetch(event.request).then((networkResponse) => {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
            return networkResponse;
          }).catch((error) => {
            console.error('Failed to fetch:', error);
          });
          
          // Return the cached response immediately
          return cachedResponse;
        }
        
        // If not in cache, fetch from network and cache
        return fetch(event.request).then((response) => {
          if (!response || response.status !== 200) {
            return response;
          }
          
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          
          return response;
        });
      })
    );
  } else {
    // For HTML and other documents, use network-first strategy
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache a copy of the response
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return response;
        })
        .catch(() => {
          // If network fails, try to return from cache
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            
            // If this is a navigation request, return the offline page
            if (event.request.mode === 'navigate') {
              return caches.match('/');
            }
            
            return new Response('Network error occurred', {
              status: 408,
              headers: { 'Content-Type': 'text/plain' }
            });
          });
        })
    );
  }
});

// Handle push notifications
self.addEventListener('push', (event) => {
  const title = 'WineCheck';
  const options = {
    body: event.data ? event.data.text() : 'New update from WineCheck',
    icon: '/icon-192.png',
    badge: '/favicon.ico'
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});
