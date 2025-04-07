
// Service Worker for WineCheck PWA
// Version: 1.0.3

const CACHE_NAME = 'winecheck-cache-v1.0.3';
const OFFLINE_PAGE = '/';
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
const API_CACHE_URLS = /\/(api)\//i;
const ANALYTICS_URLS = /(google-analytics\.com|gtag|analytics)/i;
const WINE_API_URLS = /(wine-searcher\.com|ocr|vision)/i;

// Cache version header for invalidation
const CACHE_VERSION_HEADER = 'x-cache-version';

// Install event - cache essential files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[Service Worker] Skip waiting to activate immediately');
        return self.skipWaiting(); // Force service worker activation
      })
      .catch(err => {
        console.error('[Service Worker] Failed to cache static assets:', err);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Clearing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[Service Worker] Now ready to handle fetches');
      return self.clients.claim(); // Take control of clients right away
    }).catch(err => {
      console.error('[Service Worker] Cache cleanup failed:', err);
    })
  );
});

// Listen for the skip waiting message
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[Service Worker] Received skip waiting message');
    self.skipWaiting();
  }
});

// Create an analytics queue where we'll store analytics requests while offline
let analyticsQueue = [];

// Attempt to load previously queued analytics from IndexedDB
const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('winecheck-analytics', 1);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('analytics')) {
        db.createObjectStore('analytics', { autoIncrement: true });
      }
    };
    
    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
    
    request.onerror = (event) => {
      console.error('[Service Worker] IndexedDB error:', event.target.error);
      reject(event.target.error);
    };
  });
};

// Load queued analytics from IndexedDB
const loadQueuedAnalytics = async () => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('analytics', 'readonly');
      const store = transaction.objectStore('analytics');
      const request = store.getAll();
      
      request.onsuccess = (event) => {
        analyticsQueue = event.target.result || [];
        console.log(`[Service Worker] Loaded ${analyticsQueue.length} queued analytics requests`);
        resolve();
      };
      
      request.onerror = (event) => {
        console.error('[Service Worker] Failed to load analytics queue:', event.target.error);
        reject(event.target.error);
      };
    });
  } catch (error) {
    console.error('[Service Worker] Error loading analytics queue:', error);
  }
};

// Save queued analytics to IndexedDB
const saveQueuedAnalytics = async () => {
  if (analyticsQueue.length === 0) return;
  
  try {
    const db = await openDB();
    const transaction = db.transaction('analytics', 'readwrite');
    const store = transaction.objectStore('analytics');
    
    // Clear existing items
    store.clear();
    
    // Add all current queue items
    analyticsQueue.forEach(item => {
      store.add(item);
    });
    
    transaction.oncomplete = () => {
      console.log(`[Service Worker] Saved ${analyticsQueue.length} analytics requests to IndexedDB`);
    };
    
    transaction.onerror = (event) => {
      console.error('[Service Worker] Failed to save analytics queue:', event.target.error);
    };
  } catch (error) {
    console.error('[Service Worker] Error saving analytics queue:', error);
  }
};

// Process analytics queue when online
const processAnalyticsQueue = async () => {
  if (analyticsQueue.length === 0 || !navigator.onLine) return;
  
  console.log(`[Service Worker] Processing ${analyticsQueue.length} queued analytics requests`);
  
  const failedRequests = [];
  
  for (const request of analyticsQueue) {
    try {
      const response = await fetch(request.url, {
        method: request.method,
        headers: request.headers,
        body: request.body,
        mode: 'no-cors' // Use no-cors to prevent CORS issues
      });
      
      if (!response.ok && response.type !== 'opaque') {
        console.warn(`[Service Worker] Failed to send queued analytics:`, response);
        failedRequests.push(request);
      }
    } catch (error) {
      console.error('[Service Worker] Error sending queued analytics:', error);
      failedRequests.push(request);
    }
  }
  
  // Update the queue with failed requests
  analyticsQueue = failedRequests;
  
  // Save the updated queue
  await saveQueuedAnalytics();
};

// Load analytics queue when the service worker starts
loadQueuedAnalytics();

// Process analytics queue periodically
setInterval(() => {
  if (navigator.onLine) {
    processAnalyticsQueue();
  }
}, 60000); // Try every minute

// Fetch event - Cache-first for static assets, Network-first for API requests
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests to avoid CORS issues
  if (!event.request.url.startsWith(self.location.origin) && 
      !ANALYTICS_URLS.test(event.request.url) &&
      !WINE_API_URLS.test(event.request.url)) {
    return;
  }
  
  // Handle analytics requests specially
  if (ANALYTICS_URLS.test(event.request.url)) {
    event.respondWith(
      fetch(event.request.clone())
        .catch((error) => {
          console.log('[Service Worker] Queueing failed analytics request:', error);
          // Queue the request for later
          const requestClone = {
            url: event.request.url,
            method: event.request.method,
            headers: Array.from(event.request.headers.entries()),
            body: event.request.method !== 'GET' ? event.request.clone().text() : undefined,
            timestamp: Date.now()
          };
          
          analyticsQueue.push(requestClone);
          saveQueuedAnalytics();
          
          // Return an empty response to prevent errors
          return new Response('', { status: 200 });
        })
    );
    return;
  }
  
  // Skip API requests and only use cache for GET requests
  if (event.request.url.includes('/api/') || event.request.method !== 'GET') {
    return;
  }

  // Handle wine API requests - cache successful responses
  if (WINE_API_URLS.test(event.request.url)) {
    event.respondWith(
      fetch(event.request.clone())
        .then(response => {
          // Only cache successful responses
          if (response.ok) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
          }
          return response;
        })
        .catch(err => {
          console.log('[Service Worker] Trying cached wine API response');
          return caches.match(event.request);
        })
    );
    return;
  }
  
  // Skip other API requests and only use cache for GET requests
  if ((event.request.url.includes('/api/') && !API_CACHE_URLS.test(event.request.url)) 
      || event.request.method !== 'GET') {
    return;
  }

  // For static assets like JS, CSS, and images, use cache-first strategy
  if (DYNAMIC_ASSETS.test(event.request.url)) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          // Return from cache and update cache in background
          const fetchPromise = fetch(event.request).then((networkResponse) => {
            if (!networkResponse || networkResponse.status !== 200) {
              return networkResponse;
            }
            
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
            return networkResponse;
          }).catch((error) => {
            console.error('[Service Worker] Failed to fetch:', error);
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
        }).catch(() => {
          // If fetch fails, return a fallback if it's an image
          if (event.request.url.match(/\.(jpg|jpeg|png|gif|svg|webp)$/)) {
            return caches.match('/placeholder.svg');
          }
          
          // Otherwise, just fail
          return new Response('Network error occurred', {
            status: 503,
            headers: { 'Content-Type': 'text/plain' }
          });
        });
      })
    );
  } else if (API_CACHE_URLS.test(event.request.url)) {
    // For API requests that should be cached, use network-first with cache fallback
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Only cache successful responses
          if (response.ok) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // If network fails, try to return from cache
          console.log('[Service Worker] Returning cached API response for:', event.request.url);
          return caches.match(event.request);
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
              return caches.match(OFFLINE_PAGE);
            }
            
            return new Response('Network error occurred', {
              status: 503,
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
    badge: '/favicon.ico',
    vibrate: [100, 50, 100]
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  // Focus on or open a window
  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then(clientList => {
        // If we have an existing window, focus it
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            return client.focus();
          }
        }
        // Otherwise, open a new window
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
  );
});

// Background fetch handling for large files
if ('backgroundFetch' in self) {
  self.addEventListener('backgroundfetchsuccess', (event) => {
    const bgFetch = event.registration;
    event.waitUntil(
      (async () => {
        const records = await bgFetch.matchAll();
        const promises = records.map(async (record) => {
          const response = await record.responseReady;
          const cache = await caches.open(CACHE_NAME);
          await cache.put(record.request, response);
        });
        await Promise.all(promises);
        
        // Show a notification
        if ('showNotification' in self.registration) {
          await self.registration.showNotification('Download complete', {
            body: `${bgFetch.id} has finished downloading.`,
            icon: '/icon-192.png'
          });
        }
      })()
    );
  });
  
  self.addEventListener('backgroundfetchfail', (event) => {
    const bgFetch = event.registration;
    if ('showNotification' in self.registration) {
      self.registration.showNotification('Download failed', {
        body: `${bgFetch.id} download failed.`,
        icon: '/icon-192.png'
      });
    }
  });
}

// Listen for online status to process the analytics queue
self.addEventListener('online', () => {
  console.log('[Service Worker] App is online, processing analytics queue');
  processAnalyticsQueue();
});

console.log('[Service Worker] Service worker script loaded');
