
import React from 'react';
import { Navigate } from 'react-router-dom';
import PreferencesDialog from '@/components/preferences/PreferencesDialog';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { PageContainer } from '@/components/layout/PageContainer';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const { hasSetPreferences } = useUserPreferences();
  const isMobile = useIsMobile();
  
  return (
    <PageContainer className={isMobile ? 'px-2 py-2' : ''} padding={false}>
      <PreferencesDialog showWelcome={true} />
      <Navigate to="/" replace />
    </PageContainer>
  );
};

export default Index;
