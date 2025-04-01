
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
    imageQuality: isProd ? 0.7 : 0.9, // Lower quality in prod for better performance
    cacheResults: true,
  },
  
  // Analytics (would connect to real analytics in production)
  analytics: {
    enabled: isProd,
    trackPageViews: isProd,
    trackEvents: isProd,
  }
};
