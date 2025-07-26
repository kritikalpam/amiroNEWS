import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.amiro.news',
  appName: 'amiroNEWS',
  webDir: 'out',
  bundledWebRuntime: false,
  plugins: {
    OneSignal: {
      disableConsentRequirement: false,
      canRequestPopupForPushNotifications: true,
      launchURLsInApp: true,
    },
  },
};

export default config;
