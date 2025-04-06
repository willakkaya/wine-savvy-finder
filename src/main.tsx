
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { logAppInfo } from './utils/versionUtils'
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { registerServiceWorker, setupPeriodicUpdateChecks } from './utils/serviceWorker';

// Initialize the application
const initApp = () => {
  try {
    // Add iOS compatible meta tags
    const metaTags = [
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
      { name: 'apple-mobile-web-app-title', content: 'WineCheck' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' }
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
    
    // Initialize Capacitor PWA elements
    defineCustomElements(window);
    
    // Register service worker
    registerServiceWorker();
    
    // Set up periodic update checks 
    setupPeriodicUpdateChecks();
    
    // Log application info
    logAppInfo();
    
    // Create app
    const container = document.getElementById("root");
    if (!container) {
      console.error("Root element not found!");
      document.body.innerHTML = '<div style="padding: 20px; color: #722F37; font-family: sans-serif;"><h1>WineCheck</h1><p>App container not found. Please refresh the page.</p></div>';
      return;
    }
    
    console.log("Root container found, rendering app");
    
    const root = createRoot(container);
    root.render(<App />);
    
    // Add a slight delay to ensure smooth transition
    setTimeout(() => {
      if (container) {
        container.style.opacity = '1';
      }
    }, 10);
    
  } catch (e) {
    console.error("Error initializing app:", e);
    document.body.innerHTML = '<div style="padding: 20px; color: #722F37; font-family: sans-serif;"><h1>WineCheck</h1><p>There was an error loading the application. Please try refreshing the page.</p></div>';
  }
};

// Initialize app immediately
initApp();
