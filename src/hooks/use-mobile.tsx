
import * as React from "react"

// Match Tailwind's breakpoints for consistency
const MOBILE_BREAKPOINT = 768 // md breakpoint
const TABLET_BREAKPOINT = 1024 // lg breakpoint

interface DeviceInfo {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  screenWidth: number | undefined
}

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Handle initial load - check if window exists (for SSR)
    if (typeof window !== "undefined") {
      // Set initial value
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
      
      // Create responsive handler with debouncing for better performance
      let timeoutId: ReturnType<typeof setTimeout>;
      const handleResize = () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
        }, 100); // Small debounce for performance
      }
      
      // Add event listener
      window.addEventListener("resize", handleResize)
      
      // Clean up
      return () => {
        window.removeEventListener("resize", handleResize)
        clearTimeout(timeoutId);
      }
    }
  }, [])

  // For SSR, default to non-mobile (undefined becomes false)
  return isMobile === undefined ? false : isMobile
}

/**
 * Enhanced hook that provides detailed device information
 */
export function useDeviceInfo(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = React.useState<DeviceInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    screenWidth: undefined
  })

  React.useEffect(() => {
    // Handle initial load - check if window exists (for SSR)
    if (typeof window !== "undefined") {
      const width = window.innerWidth
      
      // Calculate initial device information
      setDeviceInfo({
        isMobile: width < MOBILE_BREAKPOINT,
        isTablet: width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT,
        isDesktop: width >= TABLET_BREAKPOINT,
        screenWidth: width
      })
      
      // Create responsive handler with debouncing for better performance
      let timeoutId: ReturnType<typeof setTimeout>;
      const handleResize = () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          const newWidth = window.innerWidth
          setDeviceInfo({
            isMobile: newWidth < MOBILE_BREAKPOINT,
            isTablet: newWidth >= MOBILE_BREAKPOINT && newWidth < TABLET_BREAKPOINT,
            isDesktop: newWidth >= TABLET_BREAKPOINT,
            screenWidth: newWidth
          })
        }, 100); // Small debounce for performance
      }
      
      // Add event listener
      window.addEventListener("resize", handleResize)
      
      // Clean up
      return () => {
        window.removeEventListener("resize", handleResize)
        clearTimeout(timeoutId);
      }
    }
  }, [])

  return deviceInfo
}
