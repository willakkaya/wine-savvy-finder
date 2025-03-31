
/**
 * Utilities for handling app versioning
 */

// App version - this would be updated with each release
export const APP_VERSION = '1.0.0';

// Build timestamp - helpful for debugging and support
export const BUILD_TIMESTAMP = new Date().toISOString();

/**
 * Get user agent info for support and debugging
 */
export interface UserAgentInfo {
  version: string;
  buildTime: string;
  platform: string;
  isMobile: boolean;
  userAgent: string;
  screenSize: string;
}

export const getUserAgentInfo = (): UserAgentInfo => {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);
  const isMobile = isIOS || isAndroid || window.innerWidth < 768;
  
  return {
    version: APP_VERSION,
    buildTime: BUILD_TIMESTAMP,
    platform: isIOS ? 'iOS' : isAndroid ? 'Android' : 'Web',
    isMobile,
    userAgent: navigator.userAgent,
    screenSize: `${window.innerWidth}x${window.innerHeight}`,
  };
};

/**
 * Log info about the current application session
 * This is useful for debugging production issues
 */
export const logAppInfo = (): void => {
  if (!import.meta.env.PROD) {
    console.log('Wine Whisperer', getUserAgentInfo());
  }
};
