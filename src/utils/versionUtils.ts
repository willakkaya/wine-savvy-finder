
/**
 * Utilities for handling app versioning
 */

// App version - this would be updated with each release
export const APP_VERSION = '1.0.2';

// Build timestamp - generated at build time for debugging
export const BUILD_TIMESTAMP = new Date().toISOString();

// App store version codes
export const APP_STORE_VERSION = '1.0.2';
export const PLAY_STORE_VERSION_CODE = 3; // Increment with each store submission

/**
 * Get user agent info for support and debugging
 */
export interface UserAgentInfo {
  version: string;
  buildTime: string;
  platform: string;
  isMobile: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  userAgent: string;
  screenSize: string;
}

export const getUserAgentInfo = (): UserAgentInfo => {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isAndroid = /Android/.test(navigator.userAgent);
  const isMobile = isIOS || isAndroid || window.innerWidth < 768;
  
  return {
    version: APP_VERSION,
    buildTime: BUILD_TIMESTAMP,
    platform: isIOS ? 'iOS' : isAndroid ? 'Android' : 'Web',
    isMobile,
    isIOS,
    isAndroid,
    userAgent: navigator.userAgent,
    screenSize: `${window.innerWidth}x${window.innerHeight}`,
  };
};

/**
 * Log info about the current application session
 * This is useful for debugging production issues
 */
export const logAppInfo = (): void => {
  // Log in all environments but with different levels
  if (import.meta.env.PROD) {
    console.info('WineCheck', getUserAgentInfo());
  } else {
    console.log('WineCheck', getUserAgentInfo());
  }
};

/**
 * Check if we're running on a native platform
 */
export const isNativePlatform = (): boolean => {
  const uaInfo = getUserAgentInfo();
  return uaInfo.isIOS || uaInfo.isAndroid;
};

/**
 * Format app version for display
 */
export const getFormattedVersion = (): string => {
  return `v${APP_VERSION} (${PLAY_STORE_VERSION_CODE})`;
};
