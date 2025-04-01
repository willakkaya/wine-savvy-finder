
import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView, trackEvent, EventType, initializeAnalytics } from '@/utils/analyticsUtils';

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
    trackEvent(eventType, eventParams);
  }, []);
  
  return { logEvent, EventType };
};
