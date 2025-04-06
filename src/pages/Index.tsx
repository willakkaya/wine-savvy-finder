
import React, { useEffect, useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { useIsMobile } from '@/hooks/use-mobile';
import Home from './Home';
import PreferencesDialog from '@/components/preferences/PreferencesDialog';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import AppUpdate from '@/components/update/AppUpdate';
import { isInstalledPWA } from '@/utils/serviceWorker';

const Index = () => {
  const { hasSetPreferences } = useUserPreferences();
  const isMobile = useIsMobile();
  const [isPWA, setIsPWA] = useState<boolean | null>(null);
  
  // Check PWA status
  useEffect(() => {
    try {
      setIsPWA(isInstalledPWA());
    } catch (e) {
      console.error("Failed to check PWA status:", e);
      setIsPWA(false);
    }
  }, []);
  
  // Preload critical resources
  useEffect(() => {
    // Preload the wine background image for faster hero section display
    try {
      const preloadLink = document.createElement('link');
      preloadLink.rel = 'preload';
      preloadLink.as = 'image';
      preloadLink.href = '/wine-background.jpg';
      document.head.appendChild(preloadLink);
      
      return () => {
        if (document.head.contains(preloadLink)) {
          document.head.removeChild(preloadLink);
        }
      };
    } catch (e) {
      console.error("Failed to preload resources:", e);
    }
    
    // The SEO meta tags are now handled in main.tsx for better reliability
  }, []);
  
  return (
    <PageContainer className={isMobile ? 'px-2 py-2' : ''} padding={false}>
      {!hasSetPreferences && <PreferencesDialog showWelcome={true} />}
      <AppUpdate />
      <Home />
    </PageContainer>
  );
};

export default Index;
