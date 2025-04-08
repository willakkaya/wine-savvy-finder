
import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Theme providers
import { ThemeProvider } from '@/components/theme/theme-provider';
import { Toaster } from '@/components/ui/sonner';

// App providers
import { AppSettingsProvider } from '@/hooks/useAppSettings';
import { UserPreferencesProvider } from '@/hooks/useUserPreferences';

// Import main layouts and components
import MobileNavBar from '@/components/layout/MobileNavBar';
import LoadingFallback from '@/components/common/LoadingFallback';

// Analytics and performance
import { logAppInit } from "@/utils/analyticsUtils";
import { registerServiceWorker } from '@/utils/serviceWorker';

// Update check component
import AppUpdate from '@/components/update/AppUpdate';

// Eagerly loaded important pages
import Home from '@/pages/Home';

// Lazily loaded pages for better performance
const ScanPage = lazy(() => import('@/pages/ScanPage'));
const ResultsPage = lazy(() => import('@/pages/ResultsPage'));
const FavoritesPage = lazy(() => import('@/pages/FavoritesPage'));
const WineDetailsPage = lazy(() => import('@/pages/WineDetailsPage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));
const FAQPage = lazy(() => import('@/pages/FAQPage'));
const PrivacyPolicy = lazy(() => import('@/pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('@/pages/TermsOfService'));
const Contact = lazy(() => import('@/pages/Contact'));
const NotFound = lazy(() => import('@/pages/NotFound'));

function App() {
  // Initialize app
  useEffect(() => {
    logAppInit();
    registerServiceWorker();
  }, []);

  return (
    <ThemeProvider defaultTheme="light" storageKey="winecheck-theme">
      <AppSettingsProvider>
        <UserPreferencesProvider>
          <Router>
            <div className="app-container">
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/scan" element={<ScanPage />} />
                  <Route path="/results" element={<ResultsPage />} />
                  <Route path="/favorites" element={<FavoritesPage />} />
                  <Route path="/wine/:id" element={<WineDetailsPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/faq" element={<FAQPage />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/terms" element={<TermsOfService />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
              <MobileNavBar />
              <Toaster />
              <AppUpdate />
            </div>
          </Router>
        </UserPreferencesProvider>
      </AppSettingsProvider>
    </ThemeProvider>
  );
}

export default App;
