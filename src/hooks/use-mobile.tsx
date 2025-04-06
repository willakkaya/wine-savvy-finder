
import * as React from "react"

// Match Tailwind's breakpoints for consistency
const MOBILE_BREAKPOINT = 768 // md breakpoint
const TABLET_BREAKPOINT = 1024 // lg breakpoint

// Cache the current device state across component renders
let cachedIsMobile: boolean | undefined = undefined;
let cachedDeviceInfo: DeviceInfo | undefined = undefined;

interface DeviceInfo {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  isNative: boolean
  isIOS: boolean
  isAndroid: boolean
  screenWidth: number | undefined
}

/**
 * Enhanced iOS and Capacitor detection
 */
const detectNativeEnvironment = (): {isNative: boolean, isIOS: boolean, isAndroid: boolean} => {
  // Check for Capacitor runtime
  const isCapacitor = typeof (window as any).Capacitor !== 'undefined' && (window as any).Capacitor.isNative;
  
  // Device detection
  const isIOS = isCapacitor ? 
    (window as any).Capacitor.getPlatform() === 'ios' :
    /iPad|iPhone|iPod/.test(navigator.userAgent) || 
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    
  const isAndroid = isCapacitor ? 
    (window as any).Capacitor.getPlatform() === 'android' :
    /Android/.test(navigator.userAgent);
    
  const isNative = isCapacitor || isIOS || isAndroid;
  
  return { isNative, isIOS, isAndroid };
};

/**
 * Optimized hook that provides mobile detection with caching
 * for better performance across components
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = React.useState<boolean>(
    cachedIsMobile !== undefined ? cachedIsMobile : false
  );

  React.useEffect(() => {
    // Handle initial load - check if window exists (for SSR)
    if (typeof window !== "undefined") {
      // Only recalculate if we don't have a cached value
      if (cachedIsMobile === undefined) {
        const { isNative } = detectNativeEnvironment();
        cachedIsMobile = isNative || window.innerWidth < MOBILE_BREAKPOINT;
        setIsMobile(cachedIsMobile);
      }
      
      // Create responsive handler with efficient debouncing
      let timeoutId: ReturnType<typeof setTimeout>;
      let lastWidth = window.innerWidth;
      
      const handleResize = () => {
        // Only process if width actually changed (ignores height-only changes)
        if (window.innerWidth !== lastWidth) {
          lastWidth = window.innerWidth;
          clearTimeout(timeoutId);
          
          timeoutId = setTimeout(() => {
            const { isNative } = detectNativeEnvironment();
            const newIsMobile = isNative || window.innerWidth < MOBILE_BREAKPOINT;
            if (newIsMobile !== cachedIsMobile) {
              cachedIsMobile = newIsMobile;
              setIsMobile(newIsMobile);
            }
          }, 100); // Small debounce for performance
        }
      }
      
      // Add event listener
      window.addEventListener("resize", handleResize);
      
      // Clean up
      return () => {
        window.removeEventListener("resize", handleResize);
        clearTimeout(timeoutId);
      }
    }
  }, []);

  return isMobile;
}

/**
 * Enhanced hook that provides detailed device information
 * with caching for better performance
 */
export function useDeviceInfo(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = React.useState<DeviceInfo>(
    cachedDeviceInfo || {
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      isNative: false,
      isIOS: false,
      isAndroid: false,
      screenWidth: undefined
    }
  );

  React.useEffect(() => {
    // Handle initial load - check if window exists (for SSR)
    if (typeof window !== "undefined") {
      // Only recalculate if we don't have a cached value
      if (!cachedDeviceInfo) {
        const width = window.innerWidth;
        const { isNative, isIOS, isAndroid } = detectNativeEnvironment();
        
        cachedDeviceInfo = {
          isMobile: isNative || width < MOBILE_BREAKPOINT,
          isTablet: !isNative && width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT,
          isDesktop: !isNative && width >= TABLET_BREAKPOINT,
          isNative,
          isIOS,
          isAndroid,
          screenWidth: width
        };
        setDeviceInfo(cachedDeviceInfo);
      }
      
      // Create responsive handler with efficient debouncing
      let timeoutId: ReturnType<typeof setTimeout>;
      let lastWidth = window.innerWidth;
      
      const handleResize = () => {
        // Only process if width actually changed (ignores height-only changes)
        if (window.innerWidth !== lastWidth) {
          lastWidth = window.innerWidth;
          clearTimeout(timeoutId);
          
          timeoutId = setTimeout(() => {
            const newWidth = window.innerWidth;
            const { isNative, isIOS, isAndroid } = detectNativeEnvironment();
            
            const newDeviceInfo = {
              isMobile: isNative || newWidth < MOBILE_BREAKPOINT,
              isTablet: !isNative && newWidth >= MOBILE_BREAKPOINT && newWidth < TABLET_BREAKPOINT,
              isDesktop: !isNative && newWidth >= TABLET_BREAKPOINT,
              isNative,
              isIOS,
              isAndroid,
              screenWidth: newWidth
            };
            
            // Only update if values changed
            if (JSON.stringify(newDeviceInfo) !== JSON.stringify(cachedDeviceInfo)) {
              cachedDeviceInfo = newDeviceInfo;
              setDeviceInfo(newDeviceInfo);
            }
          }, 100); // Small debounce for performance
        }
      }
      
      // Add event listener
      window.addEventListener("resize", handleResize);
      
      // Clean up
      return () => {
        window.removeEventListener("resize", handleResize);
        clearTimeout(timeoutId);
      }
    }
  }, []);

  return deviceInfo;
}
