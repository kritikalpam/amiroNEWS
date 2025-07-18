import type {Metadata, Viewport} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from '@/components/theme-provider';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Amironews Reader',
  description: 'A simple reader for your favorite websites.',
  icons: {
    icon: '/icon.png',
  },
};

export const viewport: Viewport = {
  viewportFit: 'cover',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Literata:opsz,wght@7..72,400;7..72,700&display=swap" rel="stylesheet" />
        <Script src="https://cdn.onesignal.com/sdks/OneSignalSDK.js" async="" />
      </head>
      <body className="font-body antialiased h-full">
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <Toaster />
        <Script id="onesignal-init">
          {`
            window.OneSignal = window.OneSignal || [];
            OneSignal.push(function() {
              OneSignal.init({
                appId: "3508a1ed-ec7c-45dc-8b41-a0652886dad4",
                notifyButton: {
                  enable: false,
                },
                welcomeNotification: {
                  disable: true
                },
                notificationClickHandlerMatch: 'origin',
                notificationClickHandlerAction: 'focus',
                allowLocalhostAsSecureOrigin: true,
                serviceWorkerParam: { scope: '/push/onesignal/' },
                serviceWorkerPath: 'push/onesignal/OneSignalSDKWorker.js',
                serviceWorkerUpdaterPath: 'push/onesignal/OneSignalSDKUpdaterWorker.js',
              });
            });
          `}
        </Script>
      </body>
    </html>
  );
}
