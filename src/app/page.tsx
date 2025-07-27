"use client";

import { useState, useEffect, useCallback } from "react";
import OneSignal from 'react-onesignal';
import { SplashScreen } from "@/components/splash-screen";
import { OfflineScreen } from "@/components/offline-screen";

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [iframeSrc, setIframeSrc] = useState<string | undefined>(undefined);

  useEffect(() => {
    OneSignal.init({ appId: '9e73b5b9-166a-4fa9-93db-05f23714e41b' });

    if (typeof navigator !== 'undefined') {
      setIsOffline(!navigator.onLine);
    }

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const splashTimer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);
    
    // Set the iframe source after a delay to avoid blocking the main thread
    const iframeTimer = setTimeout(() => {
      setIframeSrc("https://amironews.com/");
    }, 100);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearTimeout(splashTimer);
      clearTimeout(iframeTimer);
    };
  }, []);

  const handleIframeLoad = () => {
    // Only hide splash if we are online, otherwise the offline screen takes precedence.
    if (!isOffline) {
      setShowSplash(false);
    }
  };

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <main className="h-screen w-screen overflow-hidden bg-background pt-safe-top">
      {isOffline ? (
        <OfflineScreen />
      ) : (
        <>
          {iframeSrc && (
            <iframe
              src={iframeSrc}
              className="h-full w-full border-0"
              title="Amironews Viewer"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              onLoad={handleIframeLoad}
            />
          )}
        </>
      )}
    </main>
  );
}
