
import React, { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import { useAnalytics } from '@/hooks/use-analytics';
import { useIsMobile } from '@/hooks/use-mobile';

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
  
  // Set document title if provided
  useEffect(() => {
    if (title) {
      document.title = `${title} | WineCheck`;
    }
  }, [title]);
  
  // Initialize analytics (the hook handles page view tracking)
  useAnalytics();
  
  return (
    <div className="flex flex-col min-h-screen font-sans">
      <Header />
      <main className={`flex-grow ${padding ? 'px-4 py-4 md:py-8' : ''} ${className}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
};
