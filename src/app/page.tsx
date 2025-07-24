"use client";

import { useState, useEffect, useRef } from "react";
import { SplashScreen } from "@/components/splash-screen";
import { app } from "@/lib/firebase"; // Import Firebase

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Set initial online status
    if (typeof navigator !== 'undefined') {
      setIsOffline(!navigator.onLine);
    }

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // OneSignal Initialization
    window.OneSignal = window.OneSignal || [];
    window.OneSignal.push(function () {
      window.OneSignal.init({
        appId: "3508a1ed-ec7c-45dc-8b41-a0652886dad4",
      });

      // Redirect notification clicks to the iframe
      window.OneSignal.on('notificationClick', function(event) {
        if (event.notification.launchURL) {
          event.preventDefault();
          if (iframeRef.current) {
            iframeRef.current.src = event.notification.launchURL;
          }
        }
      });
    });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  return (
    <main className="h-screen w-screen overflow-hidden bg-background pt-safe-top">
      {isOffline && (
        <div className="offline-banner">
          <div className="offline-banner-text">
            OFFLINE MODE OFFLINE MODE OFFLINE MODE OFFLINE MODE OFFLINE MODE
          </div>
        </div>
      )}
      {isLoading && <SplashScreen />}
      <iframe
        ref={iframeRef}
        src="https://amironews.com/"
        className="h-full w-full animate-in fade-in-0 zoom-in-75 duration-500 border-0"
        title="Amironews Viewer"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        onLoad={handleIframeLoad}
        style={{ visibility: isLoading ? 'hidden' : 'visible' }}
      />
    </main>
  );
}
