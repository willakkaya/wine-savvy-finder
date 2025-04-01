
/**
 * Configuration settings for the Wine Whisperer app
 * Different values can be set based on the environment
 */

// Check if we're in production mode
const isProd = import.meta.env.PROD;

export const config = {
  // App metadata
  appName: 'Wine Whisperer',
  
  // Feature flags
  features: {
    enableSharing: true,
    enableDebugMode: !isProd,
    enableRealWineApi: true, // Set to true to use the real API
    useCellarTrackerApi: true, // Set to true to use CellarTracker API
  },
  
  // Performance settings
  performance: {
    imageQuality: isProd ? 0.8 : 0.9, // Higher quality even in prod for Apple-like experience
    cacheResults: true,
    preloadImages: true, // Apple-like optimization
    useTouchEvents: true, // Better touch handling
  },
  
  // Analytics (would connect to real analytics in production)
  analytics: {
    enabled: isProd,
    trackPageViews: isProd,
    trackEvents: isProd,
  },
  
  // UI/UX settings
  ui: {
    animationsEnabled: true,
    glassmorphismEnabled: true,
    useRichTransitions: true,
    useHighQualityRendering: true, // Apple-like premium rendering
    useSmoothScrolling: true, // Apple-like smooth scroll
    reducedMotion: false, // Respect user preferences
    useHighContrastMode: false, // Accessibility setting
  }
};
