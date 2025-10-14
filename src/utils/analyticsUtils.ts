import { config } from '@/lib/config';
import { isRunningOffline } from './serviceWorker';

// Define event types to track
export enum EventType {
  PAGE_VIEW = 'page_view',
  SCAN_START = 'scan_start',
  SCAN_COMPLETE = 'scan_complete',
  SCAN_DELETE = 'scan_delete',
  WINE_VIEW = 'wine_view',
  WINE_FAVORITE = 'wine_favorite',
  WINE_UNFAVORITE = 'wine_unfavorite',
  USER_SIGNUP = 'user_signup',
  USER_LOGIN = 'user_login',
  USER_LOGOUT = 'user_logout',
  PREFERENCES_UPDATE = 'preferences_update',
  SHARE_WINE = 'share_wine',
  SCAN_WINE_LIST = 'scan_wine_list',
  VIEW_WINE_DETAILS = 'view_wine_details',
  COMPLETE_REGISTRATION = 'complete_registration',
  UPGRADE_SUBSCRIPTION = 'upgrade_subscription',
  APP_INSTALL = 'app_install',
  APP_UPDATE = 'app_update',
  OFFLINE_MODE_USED = 'offline_mode_used',
  ERROR_OCCURRED = 'error_occurred',
  APP_INIT = 'app_init'
}

// Queue to store analytics events when offline
const offlineEventsQueue: {
  eventType: string;
  eventParams: Record<string, any>;
  timestamp: number;
}[] = [];

// Try to load saved offline events from localStorage
try {
  const savedEvents = localStorage.getItem('offline_analytics_events');
  if (savedEvents) {
    const parsedEvents = JSON.parse(savedEvents);
    if (Array.isArray(parsedEvents)) {
      offlineEventsQueue.push(...parsedEvents);
    }
  }
} catch (error) {
  console.error('Error loading offline analytics events:', error);
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
      'anonymize_ip': config.analytics.anonymizeIp,
      'send_page_view': false // We'll handle page views manually
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

  // Listen for online events to send queued analytics
  window.addEventListener('online', sendQueuedEvents);
};

/**
 * Send any queued offline events when coming back online
 */
const sendQueuedEvents = () => {
  console.log(`Sending ${offlineEventsQueue.length} queued analytics events`);
  
  // Process all queued events
  while (offlineEventsQueue.length > 0) {
    const event = offlineEventsQueue.shift();
    if (event) {
      // Add flag indicating this was queued offline
      const params = {
        ...event.eventParams,
        queued_offline: true,
        queued_timestamp: event.timestamp,
        time_delta_ms: Date.now() - event.timestamp
      };
      
      // Send the event
      try {
        sendEventToProviders(event.eventType, params);
      } catch (error) {
        console.error('Error sending queued event:', error);
        // Put the event back in the queue if it fails
        offlineEventsQueue.push(event);
        break;
      }
    }
  }
  
  // Save any remaining events
  try {
    localStorage.setItem('offline_analytics_events', JSON.stringify(offlineEventsQueue));
  } catch (error) {
    console.error('Error saving offline analytics events:', error);
  }
};

/**
 * Track a page view
 */
export const trackPageView = (path: string, title: string): void => {
  if (!config.analytics.enabled || !config.analytics.trackPageViews) return;
  
  const params = {
    page_location: window.location.href,
    page_path: path,
    page_title: title,
    timestamp: Date.now()
  };
  
  // If offline, queue the event
  if (isRunningOffline()) {
    queueOfflineEvent('page_view', params);
    return;
  }
  
  try {
    sendEventToProviders('page_view', params);
    
    // Log in development
    if (!import.meta.env.PROD) {
      console.log('[Analytics] Page View:', { path, title });
    }
  } catch (error) {
    console.error('Error tracking page view:', error);
    queueOfflineEvent('page_view', params);
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
  
  const params = {
    ...eventParams,
    timestamp: Date.now()
  };
  
  // If offline, queue the event
  if (isRunningOffline()) {
    queueOfflineEvent(eventType.toString(), params);
    return;
  }
  
  try {
    sendEventToProviders(eventType.toString(), params);
    
    // Log in development
    if (!import.meta.env.PROD) {
      console.log('[Analytics] Event:', { eventType, eventParams });
    }
  } catch (error) {
    console.error('Error tracking event:', error);
    queueOfflineEvent(eventType.toString(), params);
  }
};

/**
 * Queue an event to be sent when the app comes back online
 */
const queueOfflineEvent = (eventType: string, eventParams: Record<string, any>) => {
  offlineEventsQueue.push({
    eventType,
    eventParams,
    timestamp: Date.now()
  });
  
  // Save the updated queue to localStorage
  try {
    localStorage.setItem('offline_analytics_events', JSON.stringify(offlineEventsQueue));
  } catch (error) {
    console.error('Error saving offline analytics events:', error);
  }
  
  // Log in development
  if (!import.meta.env.PROD) {
    console.log('[Analytics] Queued offline event:', { eventType, eventParams });
  }
};

/**
 * Send an event to all configured analytics providers
 */
const sendEventToProviders = (eventType: string, eventParams: Record<string, any>) => {
  // Google Analytics
  if (config.analytics.providers.googleAnalytics.enabled && window.gtag) {
    window.gtag('event', eventType, eventParams);
  }
  
  // You would add similar implementations for other analytics providers here
};

/**
 * Log app initialization event
 */
export const logAppInit = () => {
  trackEvent(EventType.APP_INIT, {
    timestamp: Date.now(),
    userAgent: navigator.userAgent,
    demoMode: localStorage.getItem('appSettings') ? JSON.parse(localStorage.getItem('appSettings')!).demoMode : false
  });
};

// Add to window for TypeScript
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}
