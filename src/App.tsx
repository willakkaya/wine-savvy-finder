
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import React from "react";
import Home from "./pages/Home";
import ScanPage from "./pages/ScanPage";
import WineDetailsPage from "./pages/WineDetailsPage";
import FavoritesPage from "./pages/FavoritesPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Contact from "./pages/Contact";
import { AppSettingsProvider } from "./hooks/useAppSettings";

const App = () => {
  // Initialize QueryClient inside the component with refined settings
  const [queryClient] = React.useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: false,
        retry: 1, // Less aggressive retrying for smoother UX
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="wine-whisperer-theme">
        <AppSettingsProvider>
          <TooltipProvider>
            <div className="min-h-screen flex flex-col bg-background text-foreground antialiased">
              <Toaster />
              <Sonner 
                position="top-center"
                toastOptions={{
                  classNames: {
                    toast: "group font-sans rounded-xl border-border shadow-apple-md",
                    title: "text-sm font-medium",
                    description: "text-xs text-muted-foreground",
                  }
                }}
              />
              <BrowserRouter>
                <AnimatePresence mode="wait">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/scan" element={<ScanPage />} />
                    <Route path="/wine/:id" element={<WineDetailsPage />} />
                    <Route path="/favorites" element={<FavoritesPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="/terms" element={<TermsOfService />} />
                    <Route path="/contact" element={<Contact />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </AnimatePresence>
              </BrowserRouter>
            </div>
          </TooltipProvider>
        </AppSettingsProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
