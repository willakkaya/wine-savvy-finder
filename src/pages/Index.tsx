
import React, { useEffect } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { useIsMobile } from '@/hooks/use-mobile';
import Home from './Home';
import PreferencesDialog from '@/components/preferences/PreferencesDialog';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import AppUpdate from '@/components/update/AppUpdate';

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
    
    // Add Open Graph tags for better social sharing
    const ogTags = [
      { property: 'og:title', content: 'WineCheck - Find Value Wines on Restaurant Menus' },
      { property: 'og:description', content: 'Discover the best value wines on any restaurant wine list. Save money while enjoying exceptional wines.' },
      { property: 'og:image', content: window.location.origin + '/icon-512.png' },
      { property: 'og:url', content: window.location.href },
      { property: 'og:type', content: 'website' }
    ];
    
    ogTags.forEach(tag => {
      const metaTag = document.querySelector(`meta[property="${tag.property}"]`);
      if (metaTag) {
        metaTag.setAttribute('content', tag.content);
      } else {
        const newTag = document.createElement('meta');
        newTag.setAttribute('property', tag.property);
        newTag.setAttribute('content', tag.content);
        document.head.appendChild(newTag);
      }
    });
    
    return () => {
      document.head.removeChild(preloadLink);
      // We don't remove the SEO tags as they should remain
    };
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
