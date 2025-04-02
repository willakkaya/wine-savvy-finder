
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
  screenWidth: number | undefined
}

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
        cachedIsMobile = window.innerWidth < MOBILE_BREAKPOINT;
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
            const newIsMobile = window.innerWidth < MOBILE_BREAKPOINT;
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
      screenWidth: undefined
    }
  );

  React.useEffect(() => {
    // Handle initial load - check if window exists (for SSR)
    if (typeof window !== "undefined") {
      // Only recalculate if we don't have a cached value
      if (!cachedDeviceInfo) {
        const width = window.innerWidth;
        cachedDeviceInfo = {
          isMobile: width < MOBILE_BREAKPOINT,
          isTablet: width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT,
          isDesktop: width >= TABLET_BREAKPOINT,
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
            const newDeviceInfo = {
              isMobile: newWidth < MOBILE_BREAKPOINT,
              isTablet: newWidth >= MOBILE_BREAKPOINT && newWidth < TABLET_BREAKPOINT,
              isDesktop: newWidth >= TABLET_BREAKPOINT,
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
