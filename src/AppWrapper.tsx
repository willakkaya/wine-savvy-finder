
import React, { Suspense } from 'react';
import App from './App';
import { QueryProvider } from './providers/QueryProvider';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';

export default function AppWrapper() {
  return (
    <QueryProvider>
      <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
        <App />
      </Suspense>
      <Toaster />
      <SonnerToaster />
    </QueryProvider>
  );
}
