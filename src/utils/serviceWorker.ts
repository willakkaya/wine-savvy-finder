/**
 * Service worker registration and management
 */

// Registration function for service worker
export function registerServiceWorker() {
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register('/service-worker.js', {
          scope: '/'
        });
        console.log('SW registered: ', registration.scope);
        
        // Immediately check for updates if the app has been loaded from cache
        if (navigator.onLine && performance.navigation.type === 1) {
          registration.update();
        }
      } catch (error) {
        console.log('SW registration failed: ', error);
      }
    });
  }
}

// Handle service worker updates
export function handleServiceWorkerUpdates(onUpdateFound: () => void) {
  if (!('serviceWorker' in navigator)) return;
  
  // Watch for updates to the service worker
  navigator.serviceWorker.ready.then(registration => {
    // Check for existing waiting service worker
    if (registration.waiting) {
      onUpdateFound();
      return;
    }
    
    // Watch for new service worker installation
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (!newWorker) return;
      
      newWorker.addEventListener('statechange', () => {
        // When the service worker becomes "installed", it means an update is ready
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          console.log('New version available and ready to use');
          onUpdateFound();
        }
      });
    });
  });
  
  // Listen for controller change events (triggered after skipWaiting)
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return;
    refreshing = true;
    console.log('Service worker controller changed, refreshing page');
    window.location.reload();
  });
}

// Force the service worker to update
export function updateServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  
  navigator.serviceWorker.ready.then(registration => {
    if (registration.waiting) {
      // Send a message to the waiting service worker to skip waiting
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    } else {
      // Otherwise, just check for a new version
      registration.update();
    }
  });
}

// Check if the application is using service workers
export function isUsingServiceWorker(): boolean {
  return !!navigator.serviceWorker?.controller;
}

// Check if the application is currently running in offline mode
export function isRunningOffline(): boolean {
  return !navigator.onLine;
}
