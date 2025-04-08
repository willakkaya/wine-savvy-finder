
import { isMobile, prefersReducedMotion } from '@/utils/deviceUtils';

/**
 * Configuration settings for the WineCheck app
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
    enableRealWineApi: true,
    useCellarTrackerApi: true,
    enablePremiumFeatures: false,
    enableOfflineMode: true,
  },
  
  // Performance settings
  performance: {
    imageQuality: 0.9,
    cacheResults: true,
    preloadImages: true,
    useTouchEvents: true,
    prefetchWineData: isProd,
  },
  
  // Analytics
  analytics: {
    enabled: isProd,
    trackPageViews: isProd,
    trackEvents: isProd,
    trackConversions: isProd,
    anonymizeIp: true,
    consentRequired: true,
    providers: {
      googleAnalytics: {
        enabled: isProd,
        measurementId: 'G-XXXXXXXXXX', // Replace with real ID in production
      },
      mixpanel: {
        enabled: false, // Disabled until we have a real token
        projectToken: '',
      },
      segment: {
        enabled: false, // Disabled until we have a real key
        writeKey: '',
      }
    }
  },
  
  // UI/UX settings
  ui: {
    animationsEnabled: true,
    glassmorphismEnabled: true, 
    useRichTransitions: true,
    useHighQualityRendering: !isMobile(), // Reduce rendering quality on mobile
    useSmoothScrolling: true,
    reducedMotion: prefersReducedMotion(),
    useHighContrastMode: false,
    fontScaling: 1.0,
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
    minimumAge: 21,
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
