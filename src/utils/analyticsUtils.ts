
import { config } from '@/lib/config';

// Define event types to track
export enum EventType {
  PAGE_VIEW = 'page_view',
  SCAN_WINE_LIST = 'scan_wine_list',
  VIEW_WINE_DETAILS = 'view_wine_details',
  SHARE_WINE = 'share_wine',
  COMPLETE_REGISTRATION = 'complete_registration',
  UPGRADE_SUBSCRIPTION = 'upgrade_subscription',
}

/**
 * Initialize analytics providers based on configuration
 */
export const initializeAnalytics = (): void => {
  if (!config.analytics.enabled) return;

  // Initialize Google Analytics if enabled
  if (config.analytics.providers.googleAnalytics.enabled) {
    const gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${config.analytics.providers.googleAnalytics.measurementId}`;
    document.head.appendChild(gaScript);

    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(args);
    }
    gtag('js', new Date());
    gtag('config', config.analytics.providers.googleAnalytics.measurementId, {
      'anonymize_ip': config.analytics.anonymizeIp
    });
  }

  // Initialize Mixpanel if enabled
  if (config.analytics.providers.mixpanel.enabled) {
    // Mixpanel initialization would go here
    console.log('Mixpanel initialized with token:', config.analytics.providers.mixpanel.projectToken);
  }

  // Initialize Segment if enabled
  if (config.analytics.providers.segment.enabled) {
    // Segment initialization would go here
    console.log('Segment initialized with write key:', config.analytics.providers.segment.writeKey);
  }
};

/**
 * Track a page view
 */
export const trackPageView = (path: string, title: string): void => {
  if (!config.analytics.enabled || !config.analytics.trackPageViews) return;
  
  try {
    // Google Analytics
    if (config.analytics.providers.googleAnalytics.enabled && window.gtag) {
      window.gtag('event', 'page_view', {
        page_location: window.location.href,
        page_path: path,
        page_title: title,
      });
    }
    
    // You would add similar implementations for other analytics providers here
    
    // Log in development
    if (!import.meta.env.PROD) {
      console.log('[Analytics] Page View:', { path, title });
    }
  } catch (error) {
    console.error('Error tracking page view:', error);
  }
};

/**
 * Track a custom event
 */
export const trackEvent = (
  eventType: EventType,
  eventParams: Record<string, any> = {}
): void => {
  if (!config.analytics.enabled || !config.analytics.trackEvents) return;
  
  try {
    // Google Analytics
    if (config.analytics.providers.googleAnalytics.enabled && window.gtag) {
      window.gtag('event', eventType, eventParams);
    }
    
    // You would add similar implementations for other analytics providers here
    
    // Log in development
    if (!import.meta.env.PROD) {
      console.log('[Analytics] Event:', { eventType, eventParams });
    }
  } catch (error) {
    console.error('Error tracking event:', error);
  }
};

// Add to window for TypeScript
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}
