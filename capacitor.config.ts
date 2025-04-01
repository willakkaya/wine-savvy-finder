
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.0c2ede1092234273abfc3f8e5843a9ae',
  appName: 'wine-savvy-finder',
  webDir: 'dist',
  server: {
    url: 'https://0c2ede10-9223-4273-abfc-3f8e5843a9ae.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  // Enable browser dev tools in the mobile app (remove in production)
  android: {
    allowMixedContent: true
  },
  ios: {
    limitsNavigationsToAppBoundDomains: false
  }
};

export default config;
