
/**
 * Configuration settings for the WineCheck app
 * Different values can be set based on the environment
 */

// Check if we're in production mode
const isProd = import.meta.env.PROD;

export const config = {
  // App metadata
  appName: 'WineCheck',
  company: {
    name: 'WineCheck Inc.',
    foundedYear: 2023,
    address: '123 Vineyard Lane, San Francisco, CA 94105',
    email: 'hello@winecheck.com',
    phone: '+1 (415) 555-5555',
  },
  
  // Feature flags
  features: {
    enableSharing: true,
    enableDebugMode: !isProd,
    enableRealWineApi: true, // Set to true to use the real API
    useCellarTrackerApi: true, // Set to true to use CellarTracker API
    enablePremiumFeatures: false, // Unlock premium features with subscription
    enableOfflineMode: true, // Enable offline caching and functionality
  },
  
  // Performance settings
  performance: {
    imageQuality: isProd ? 0.9 : 0.9, // Higher quality even in prod for Apple-like experience
    cacheResults: true,
    preloadImages: true, // Apple-like optimization
    useTouchEvents: true, // Better touch handling
    prefetchWineData: true, // Prefetch related wine data when viewing details
  },
  
  // Analytics (would connect to real analytics in production)
  analytics: {
    enabled: isProd,
    trackPageViews: isProd,
    trackEvents: isProd,
    trackConversions: isProd,
    anonymizeIp: true,
    consentRequired: true, // GDPR compliance
    providers: {
      googleAnalytics: {
        enabled: isProd,
        measurementId: 'G-XXXXXXXXXX', // Replace with real ID in production
      },
      mixpanel: {
        enabled: isProd,
        projectToken: 'XXXXXXXXXXXXXXXXXXXXXXXX', // Replace with real token in production
      },
      segment: {
        enabled: isProd,
        writeKey: 'XXXXXXXXXXXXXXXXXXXXXXXX', // Replace with real key in production
      }
    }
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
    fontScaling: 1.0, // Default font scaling
  },
  
  // Social media and sharing
  social: {
    twitter: 'https://twitter.com/winecheck',
    facebook: 'https://facebook.com/winecheck',
    instagram: 'https://instagram.com/winecheck',
    pinterest: 'https://pinterest.com/winecheck',
  },
  
  // Legal and compliance
  legal: {
    privacyPolicyUrl: '/privacy',
    termsOfServiceUrl: '/terms',
    cookiePolicyUrl: '/cookie-policy',
    gdprCompliant: true,
    ccpaCompliant: true,
    minimumAge: 21, // Legal drinking age in US
  },
  
  // Customer support
  support: {
    email: 'support@winecheck.com',
    phone: '+1 (415) 555-5555',
    hours: 'Monday-Friday, 9am-6pm PST',
    liveChatEnabled: isProd,
    faqUrl: '/faq',
    contactUrl: '/contact',
  }
};
