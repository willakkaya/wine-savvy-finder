
import React, { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import MobileNavBar from './MobileNavBar';
import { useAnalytics } from '@/hooks/use-analytics';
import { useIsMobile } from '@/hooks/use-mobile';
import { isNativePlatform } from '@/utils/versionUtils';

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
    if (title) {
      document.title = `${title} | WineCheck`;
    } else {
      document.title = "WineCheck"; // Ensure there's always a title
    }
  }, [title]);
  
  // Initialize analytics (the hook handles page view tracking)
  useAnalytics();
  
  // Add safe area classes based on platform
  const safeAreaClasses = isNative ? 
    'pt-safe-top pb-safe-bottom pl-safe-left pr-safe-right' : '';
  
  // Add safe area bottom padding for mobile devices
  const mainClasses = [
    'flex-grow',
    padding ? `px-4 py-4 ${isMobile ? 'pb-24' : 'md:py-8'}` : '',
    safeAreaClasses,
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className="flex flex-col min-h-screen font-sans">
      <Header />
      <main className={mainClasses}>
        {children}
      </main>
      <Footer />
      {isMobile && <MobileNavBar />}
    </div>
  );
};
