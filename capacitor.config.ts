
import { CapacitorConfig } from '@capacitor/cli';
import { APP_VERSION } from './src/utils/versionUtils';

const config: CapacitorConfig = {
  appId: 'app.winecheck.mobile',
  appName: 'WineCheck',
  webDir: 'dist',
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      backgroundColor: "#722F37",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      spinnerColor: "#FFFFFF",
      splashFullScreen: true,
      splashImmersive: true,
      launchShowDuration: 3000,  // Show splash for at least 3 seconds
      launchAutoHide: false,     // Don't auto-hide, we'll hide it when app is ready
    },
    CapacitorHttp: {
      enabled: true
    },
    Keyboard: {
      resize: "body",
      style: "dark",
      resizeOnFullScreen: true
    },
    StatusBar: {
      style: "dark",
      backgroundColor: "#722F37",
      overlaysWebView: false,
      animation: "slide"
    }
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true, // Enable for development, set to false for production
    backgroundColor: "#722F37",
    initialFocus: true,   // Make sure webview gets focus immediately
    buildOptions: {
      keystorePath: "winecheck.keystore",
      keystoreAlias: "winecheck",
      minSdkVersion: 22, // Android 5.1 and above
      targetSdkVersion: 33, // Android 13
    }
  },
  ios: {
    contentInset: "always",
    cordovaSwiftVersion: "5.0",
    minVersion: "13.0", // iOS 13 minimum
    backgroundColor: "#722F37",
    preferredContentMode: "mobile",
    scheme: "winecheck",
    limitsNavigationsToAppBoundDomains: true
  },
  server: {
    hostname: "app.winecheck.mobile",
    androidScheme: "https",
    iosScheme: "https",
    allowNavigation: ["*.winecheck.mobile", "*.amazonaws.com"]
  }
};

export default config;
