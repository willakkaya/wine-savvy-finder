
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
      } catch (error) {
        console.log('SW registration failed: ', error);
      }
    });
  }
}

// Handle service worker updates
export function handleServiceWorkerUpdates(onUpdateFound: () => void) {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content is available, notify the user
              onUpdateFound();
            }
          });
        }
      });
    });
  }
}

// Force the service worker to update
export function updateServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      registration.update();
    });
  }
}
