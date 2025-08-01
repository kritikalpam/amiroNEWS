import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.amiro.news',
  appName: 'amiroNEWS bita 2',
  webDir: 'out',
  bundledWebRuntime: false,
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
    Camera: {},
  },
};

export default config;
