
import React, { useEffect } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { useIsMobile } from '@/hooks/use-mobile';
import Home from './Home';
import PreferencesDialog from '@/components/preferences/PreferencesDialog';
import { useUserPreferences } from '@/hooks/useUserPreferences';

const Index = () => {
  const { hasSetPreferences } = useUserPreferences();
  const isMobile = useIsMobile();
  
  // Preload critical resources
  useEffect(() => {
    // Preload the wine background image for faster hero section display
    const preloadLink = document.createElement('link');
    preloadLink.rel = 'preload';
    preloadLink.as = 'image';
    preloadLink.href = '/wine-background.jpg';
    document.head.appendChild(preloadLink);
    
    // Add meta description for SEO
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Find the best value wines on restaurant wine lists with WineCheck. Save money and discover exceptional wines with our AI-powered app.');
    }
    
    return () => {
      document.head.removeChild(preloadLink);
    };
  }, []);
  
  return (
    <PageContainer className={isMobile ? 'px-2 py-2' : ''} padding={false}>
      {!hasSetPreferences && <PreferencesDialog showWelcome={true} />}
      <Home />
    </PageContainer>
  );
};

export default Index;
