
import { getOfflineWines } from '@/utils/offlineUtils';

/**
 * Checks if offline wines are available and returns status
 */
export const checkOfflineAvailability = (): boolean => {
  const { wines } = getOfflineWines();
  return wines.length > 0;
};

/**
 * Updates the offline status based on network availability
 */
export const getOfflineStatus = (): { 
  networkError: boolean;
  offlineAvailable: boolean;
} => {
  const isOffline = !navigator.onLine;
  const offlineAvailable = isOffline ? checkOfflineAvailability() : false;
  
  return {
    networkError: isOffline,
    offlineAvailable
  };
};
