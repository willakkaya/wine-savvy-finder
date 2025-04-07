
import React, { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import MobileNavBar from './MobileNavBar';
import { useAnalytics } from '@/hooks/use-analytics';
import { useIsMobile } from '@/hooks/use-mobile';
import { isNativePlatform } from '@/utils/versionUtils';
import { Toaster } from '@/components/ui/toaster';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  padding?: boolean;
}

export const PageContainer: React.FC<PageContainerProps> = ({ 
  children,
  className = "",
  title,
  padding = true,
}) => {
  const isMobile = useIsMobile();
  const isNative = isNativePlatform();
  
  // Set document title if provided
  useEffect(() => {
    try {
      if (title) {
        document.title = `${title} | WineCheck`;
      } else {
        document.title = "WineCheck"; // Ensure there's always a title
      }
    } catch (e) {
      console.error("Error setting document title:", e);
    }
  }, [title]);
  
  // Initialize analytics (the hook handles page view tracking)
  try {
    useAnalytics();
  } catch (e) {
    console.error("Error initializing analytics:", e);
  }

  // Add content visibility class to ensure content is shown
  useEffect(() => {
    const timer = setTimeout(() => {
      const mainElement = document.querySelector('main');
      if (mainElement) {
        mainElement.classList.add('content-visible');
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Add safe area classes based on platform
  const safeAreaClasses = isNative ? 
    'pt-safe-top pb-safe-bottom pl-safe-left pr-safe-right' : '';
  
  // Adjust bottom padding when mobile navigation is present
  const mainClasses = [
    'flex-grow page-transition',
    padding ? `px-4 py-4 ${isMobile ? 'pb-24' : 'md:py-8'}` : '',
    safeAreaClasses,
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className={mainClasses}>
        {children}
      </main>
      <Footer />
      <MobileNavBar />
      <Toaster />
    </div>
  );
};
