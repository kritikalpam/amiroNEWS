import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.amiro.news',
  appName: 'amiroNEWS',
  webDir: 'out',
  bundledWebRuntime: false,
  plugins: {
    OneSignal: {
      // Prevents the default behavior of opening URLs in an external browser
      // when a notification is clicked.
      disableConsentRequirement: false,
      canRequestPopupForPushNotifications: true,
      launchURLsInApp: true,
    },
  },
};

export default config;
