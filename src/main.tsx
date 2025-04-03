
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { logAppInfo } from './utils/versionUtils'
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { registerServiceWorker } from './utils/serviceWorker';

// Enhanced font preloading for premium typography
const preloadFonts = () => {
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
};

// Initialize premium fonts
preloadFonts();

// Initialize Capacitor PWA elements for native features with smoother loading
defineCustomElements(window);

// Register service worker for offline capabilities
registerServiceWorker();

// Log application info on startup (useful for debugging)
logAppInfo();

// Create app with enhanced smooth animation
const container = document.getElementById("root");
if (container) {
  // Add initial loading transition with premium feel
  container.classList.add('opacity-0');
  
  const root = createRoot(container);
  root.render(<App />);
  
  // Enhanced fade-in animation for a more premium experience
  setTimeout(() => {
    container.classList.remove('opacity-0');
    container.classList.add('transition-all', 'duration-700', 'ease-out', 'opacity-100');
  }, 50);
}
