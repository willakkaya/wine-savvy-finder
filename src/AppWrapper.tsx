
import App from './App';
import { QueryProvider } from './providers/QueryProvider';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';

export default function AppWrapper() {
  return (
    <QueryProvider>
      <App />
      <Toaster />
      <SonnerToaster />
    </QueryProvider>
  );
}
