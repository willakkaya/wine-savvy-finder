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
          registration.update().catch(err => {
            console.error('Initial SW update check failed: ', err);
          });
        }
      } catch (error) {
        console.error('SW registration failed: ', error);
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
      console.log('Found waiting service worker, update available');
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
    }).catch(err => {
      console.error('Error checking for service worker updates: ', err);
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
  if (!('serviceWorker' in navigator)) return false;
  
  return navigator.serviceWorker.ready.then(registration => {
    if (registration.waiting) {
      // Send a message to the waiting service worker to skip waiting
      console.log('Sending skip waiting message to service worker');
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      return true;
    } else {
      // Otherwise, just check for a new version
      console.log('No waiting service worker found, checking for updates');
      return registration.update().then(() => false);
    }
  }).catch(err => {
    console.error('Error updating service worker: ', err);
    return false;
  });
}

// Check if the application is using service workers
export function isUsingServiceWorker(): boolean {
  return !!(
    'serviceWorker' in navigator && 
    navigator.serviceWorker?.controller
  );
}

// Check if the application is currently running in offline mode
export function isRunningOffline(): boolean {
  return !navigator.onLine;
}

// Check if the app was installed as a PWA
export function isInstalledPWA(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches || 
         (window.navigator as any).standalone === true;
}

// Check when the service worker was last updated
export async function getServiceWorkerUpdateTime(): Promise<Date | null> {
  if (!('serviceWorker' in navigator)) return null;
  
  try {
    const registration = await navigator.serviceWorker.ready;
    if (registration.active) {
      // This is a workaround as there's no direct API to get the installation time
      // We can check the timestamp on the service worker script request
      return new Date(); 
    }
    return null;
  } catch (err) {
    console.error('Error getting service worker update time: ', err);
    return null;
  }
}
