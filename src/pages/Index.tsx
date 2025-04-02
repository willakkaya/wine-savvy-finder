
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import PreferencesDialog from '@/components/preferences/PreferencesDialog';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { PageContainer } from '@/components/layout/PageContainer';
import { useIsMobile } from '@/hooks/use-mobile';

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
    
    return () => {
      document.head.removeChild(preloadLink);
    };
  }, []);
  
  return (
    <PageContainer className={isMobile ? 'px-2 py-2' : ''} padding={false}>
      <PreferencesDialog showWelcome={true} />
      <Navigate to="/" replace />
    </PageContainer>
  );
};

export default Index;
