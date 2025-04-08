
import { createRoot } from 'react-dom/client'
import AppWrapper from './AppWrapper.tsx'
import './index.css'
import { logAppInfo } from './utils/versionUtils'
import { defineCustomElements } from '@ionic/pwa-elements/loader'
import { registerServiceWorker, setupPeriodicUpdateChecks } from './utils/serviceWorker'

// Function to update viewport height for mobile browsers
const updateVh = () => {
  const vh = window.innerHeight * 0.01
  document.documentElement.style.setProperty('--vh', `${vh}px`)
}

// Initialize application
const initApp = () => {
  try {
    console.log("Starting WineCheck initialization...")
    
    // Setup viewport height
    updateVh()
    window.addEventListener('resize', updateVh)
    window.addEventListener('orientationchange', updateVh)
    
    // Add iOS compatible meta tags
    const metaTags = [
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
      { name: 'apple-mobile-web-app-title', content: 'WineCheck' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover' },
      { name: 'theme-color', content: '#722F37' }
    ]
    
    metaTags.forEach(({ name, content }) => {
      let meta = document.querySelector(`meta[name="${name}"]`)
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute('name', name)
        meta.setAttribute('content', content)
        document.head.appendChild(meta)
      } else {
        meta.setAttribute('content', content)
      }
    })
    
    // Add device detection classes
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      document.body.classList.add('ios-device')
    }
    if (/Android/.test(navigator.userAgent)) {
      document.body.classList.add('android-device')
    }
    
    // Initialize services
    defineCustomElements(window)
    registerServiceWorker()
    setupPeriodicUpdateChecks()
    logAppInfo()
    
    // Render the app
    const container = document.getElementById("root")
    if (!container) {
      console.error("Root element not found!")
      document.body.innerHTML = '<div style="padding: 20px; color: #722F37; font-family: sans-serif;"><h1>WineCheck</h1><p>App container not found. Please refresh the page.</p></div>'
      return
    }
    
    console.log("Root container found, rendering app")
    container.style.opacity = '1'
    container.style.visibility = 'visible'
    
    const root = createRoot(container)
    root.render(<AppWrapper />)
    
    window.addEventListener('load', () => {
      document.body.classList.add('app-loaded')
      console.log("App fully loaded")
    })
  } catch (error) {
    console.error("Error initializing app:", error)
    document.body.innerHTML = '<div style="padding: 20px; color: #722F37; font-family: sans-serif;"><h1>WineCheck</h1><p>There was an error loading the application. Please try refreshing the page.</p></div>'
  }
}

// Initialize app
initApp()

// Add a safety fallback to ensure app is visible
window.addEventListener('load', () => {
  setTimeout(() => {
    const container = document.getElementById("root")
    if (container) {
      container.style.opacity = '1'
      container.style.visibility = 'visible'
    }
    
    // Add a forced render fallback after 1s if app is still not visible
    setTimeout(() => {
      if (document.body.querySelectorAll('.app-container').length === 0) {
        console.log("Forcing app reload due to render issues")
        window.location.reload()
      }
    }, 1000)
  }, 500)
})
