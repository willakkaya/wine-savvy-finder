
import { CapacitorConfig } from '@capacitor/cli';
import { APP_VERSION } from './src/utils/versionUtils';

const config: CapacitorConfig = {
  appId: 'app.winecheck.mobile',
  appName: 'WineCheck',
  webDir: 'dist',
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      launchAutoHide: false,
      backgroundColor: "#722F37",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      spinnerColor: "#FFFFFF",
      splashFullScreen: true,
      splashImmersive: true,
    },
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: false,
    backgroundColor: "#722F37",
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
    androidScheme: "https"
  }
};

export default config;
