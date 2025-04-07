
import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Theme providers
import { ThemeProvider } from '@/components/theme/theme-provider';
import { Toaster } from '@/components/ui/sonner';

// App providers
import { AppSettingsProvider } from '@/hooks/useAppSettings';
import { UserPreferencesProvider } from '@/hooks/useUserPreferences';

// Import main layouts and components
import MobileNavBar from '@/components/layout/MobileNavBar';

// Main pages
import Home from '@/pages/Home';
import ScanPage from '@/pages/ScanPage';
import ResultsPage from '@/pages/ResultsPage'; // New results page
import NotFound from '@/pages/NotFound';

// Lazily loaded pages
const FavoritesPage = lazy(() => import('@/pages/FavoritesPage'));
const WineDetailsPage = lazy(() => import('@/pages/WineDetailsPage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));
const FAQPage = lazy(() => import('@/pages/FAQPage'));
const PrivacyPolicy = lazy(() => import('@/pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('@/pages/TermsOfService'));
const Contact = lazy(() => import('@/pages/Contact'));

// Analytics
import { logAppInit } from "@/utils/analyticsUtils";
import { registerServiceWorker } from '@/utils/serviceWorker';

// Update check
import AppUpdate from '@/components/update/AppUpdate';

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
              <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/scan" element={<ScanPage />} />
                  <Route path="/results" element={<ResultsPage />} /> {/* New results route */}
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
