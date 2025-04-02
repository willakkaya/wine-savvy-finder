
import React from 'react';
import { Navigate } from 'react-router-dom';
import PreferencesDialog from '@/components/preferences/PreferencesDialog';
import { useUserPreferences } from '@/hooks/useUserPreferences';

const Index = () => {
  const { hasSetPreferences } = useUserPreferences();
  
  return (
    <>
      <PreferencesDialog showWelcome={true} />
      <Navigate to="/" replace />
    </>
  );
};

export default Index;
