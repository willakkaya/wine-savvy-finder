
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { logAppInfo } from './utils/versionUtils'
import { defineCustomElements } from '@ionic/pwa-elements/loader';

// Add font preloading
const preloadFonts = () => {
  // Preload main fonts to avoid FOIT (Flash of Invisible Text)
  const fontLinks = [
    {
      rel: 'preload',
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Playfair+Display:wght@400;500;600&display=swap',
      as: 'style',
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Playfair+Display:wght@400;500;600&display=swap',
    },
  ];

  fontLinks.forEach(({ rel, href, as }) => {
    const link = document.createElement('link');
    link.rel = rel;
    link.href = href;
    if (as) link.setAttribute('as', as);
    document.head.appendChild(link);
  });
};

// Initialize fonts
preloadFonts();

// Initialize Capacitor PWA elements for native features with smoother loading
defineCustomElements(window);

// Log application info on startup (useful for debugging)
logAppInfo();

// Create app with smooth animation
const container = document.getElementById("root");
if (container) {
  // Add initial loading transition
  container.classList.add('opacity-0');
  
  const root = createRoot(container);
  root.render(<App />);
  
  // Fade in the app
  setTimeout(() => {
    container.classList.remove('opacity-0');
    container.classList.add('transition-opacity', 'duration-500', 'opacity-100');
  }, 100);
}
