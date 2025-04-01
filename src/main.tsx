
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { logAppInfo } from './utils/versionUtils'
import { defineCustomElements } from '@ionic/pwa-elements/loader';

// Initialize Capacitor PWA elements for native features
defineCustomElements(window);

// Log application info on startup (useful for debugging)
logAppInfo();

createRoot(document.getElementById("root")!).render(<App />);
