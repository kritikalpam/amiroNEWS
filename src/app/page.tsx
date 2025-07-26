"use client";

import { useState, useEffect, useRef } from "react";
import { SplashScreen } from "@/components/splash-screen";
import { app } from "@/lib/firebase"; // Import Firebase

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // Set initial online status
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

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearTimeout(splashTimer);
    };
  }, []);

  const handleIframeLoad = () => {
    // We can still keep this to hide splash if iframe loads faster than timeout
    // but the primary mechanism is now the timer.
    setShowSplash(false);
  };

  return (
    <main className="h-screen w-screen overflow-hidden bg-background pt-safe-top">
      {showSplash && <div className="loading-line"></div>}
      {isOffline && (
        <div className="offline-banner">
          <div className="offline-banner-text">
            OFFLINE MODE OFFLINE MODE OFFLINE MODE OFFLINE MODE OFFLINE MODE
          </div>
        </div>
      )}
      {showSplash && <SplashScreen />}
      <iframe
        src="https://amironews.com/"
        className="h-full w-full border-0 transition-opacity duration-500"
        title="Amironews Viewer"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        onLoad={handleIframeLoad}
        style={{ opacity: showSplash ? 0 : 1 }}
      />
    </main>
  );
}
