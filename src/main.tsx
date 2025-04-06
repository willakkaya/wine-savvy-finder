
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { logAppInfo } from './utils/versionUtils'
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { registerServiceWorker, setupPeriodicUpdateChecks } from './utils/serviceWorker';

// Enhanced font preloading for premium typography
const preloadFonts = () => {
  try {
    // Preload premium fonts - using Playfair Display (serif) and Inter (sans-serif)
    // for a luxury wine app aesthetic that balances classic and modern
    const fontLinks = [
      {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'preload',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&display=swap',
        as: 'style',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&display=swap',
      },
    ];

    fontLinks.forEach(({ rel, href, as, crossOrigin }) => {
      const link = document.createElement('link');
      link.rel = rel;
      link.href = href;
      if (as) link.setAttribute('as', as);
      if (crossOrigin) link.setAttribute('crossorigin', crossOrigin);
      document.head.appendChild(link);
    });
  } catch (e) {
    console.error("Error preloading font:", e);
  }
};

// Add iOS compatibility meta tags programmatically
const addIOSMetaTags = () => {
  try {
    const metaTags = [
      {
        name: 'apple-mobile-web-app-capable',
        content: 'yes'
      },
      {
        name: 'apple-mobile-web-app-status-bar-style',
        content: 'black-translucent'
      },
      {
        name: 'apple-mobile-web-app-title',
        content: 'WineCheck'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'
      }
    ];
    
    metaTags.forEach(({ name, content }) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', name);
        meta.setAttribute('content', content);
        document.head.appendChild(meta);
      }
    });
  } catch (e) {
    console.error("Error adding iOS meta tag:", e);
  }
};

// Function to initialize the application
const initApp = () => {
  try {
    // Initialize premium fonts
    preloadFonts();
    
    // Add iOS compatible meta tags
    addIOSMetaTags();
    
    // Initialize Capacitor PWA elements for native features with smoother loading
    defineCustomElements(window);
    
    // Register service worker for offline capabilities
    registerServiceWorker();
    
    // Set up periodic update checks 
    setupPeriodicUpdateChecks();
    
    // Log application info on startup (useful for debugging)
    logAppInfo();
    
    // Create app with enhanced smooth animation
    const container = document.getElementById("root");
    if (!container) {
      console.error("Root element not found!");
      document.body.innerHTML = '<div style="padding: 20px; color: #722F37; font-family: sans-serif;"><h1>WineCheck</h1><p>App container not found. Please refresh the page.</p></div>';
      return;
    }
    
    console.log("Root container found, rendering app");
    
    const root = createRoot(container);
    root.render(<App />);
    
    setTimeout(() => {
      container.classList.remove('opacity-0');
      container.classList.add('transition-opacity', 'duration-700', 'ease-out', 'opacity-100');
    }, 50);
    
  } catch (e) {
    console.error("Error initializing app:", e);
    document.body.innerHTML = '<div style="padding: 20px; color: #722F37; font-family: sans-serif;"><h1>WineCheck</h1><p>There was an error loading the application. Please try refreshing the page.</p></div>';
  }
};

// Initialize app with performance optimizations
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

console.log("WineCheck main.tsx processed");
