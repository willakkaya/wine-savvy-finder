
import * as React from "react"

const MOBILE_BREAKPOINT = 768 // Matches md breakpoint in Tailwind

export function useIsMobile() {
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
