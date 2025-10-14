
import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView, trackEvent, initializeAnalytics } from '@/utils/analyticsUtils';

// Re-export EventType for components to use
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

/**
 * Hook to manage analytics throughout the app
 */
export const useAnalytics = () => {
  const location = useLocation();
  
  // Initialize analytics when the app loads
  useEffect(() => {
    initializeAnalytics();
  }, []);
  
  // Track page views when the route changes
  useEffect(() => {
    // Get page title
    const title = document.title;
    // Track page view
    trackPageView(location.pathname, title);
  }, [location]);
  
  // Wrapper around trackEvent to use in components
  const logEvent = useCallback((eventType: EventType, eventParams: Record<string, any> = {}) => {
    trackEvent(eventType as any, eventParams);
  }, []);
  
  return { logEvent, EventType };
};
