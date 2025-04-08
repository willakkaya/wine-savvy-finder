
/**
 * Utility functions for device detection and handling
 */

/**
 * Check if the current device is mobile
 */
export const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return window.innerWidth < 768 || 
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Check if the current device is iOS
 */
export const isIOS = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

/**
 * Check if the current device is Android
 */
export const isAndroid = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return /Android/.test(navigator.userAgent);
}

/**
 * Check if user prefers reduced motion
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Setup viewport height calculation for mobile browsers
 * Fixes the 100vh issue on mobile browsers
 */
export const setupViewportHeight = (): void => {
  const updateVh = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };
  
  // Run once on initialization
  updateVh();
  
  // Update on resize and orientation change
  window.addEventListener('resize', updateVh);
  window.addEventListener('orientationchange', updateVh);
}

/**
 * Apply device-specific CSS classes to the document body
 */
export const applyDeviceClasses = (): void => {
  if (isIOS()) {
    document.body.classList.add('ios-device');
  }
  
  if (isAndroid()) {
    document.body.classList.add('android-device');
  }
  
  if (isMobile()) {
    document.body.classList.add('mobile-device');
  } else {
    document.body.classList.add('desktop-device');
  }
  
  if (prefersReducedMotion()) {
    document.body.classList.add('reduced-motion');
  }
}

/**
 * Initialize all device-related settings
 */
export const initDeviceSettings = (): void => {
  setupViewportHeight();
  applyDeviceClasses();
}
