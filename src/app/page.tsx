"use client";

import { useState, useEffect, useRef } from "react";
import { SplashScreen } from "@/components/splash-screen";
import { app } from "@/lib/firebase"; // Import Firebase

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
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

    // Use requestIdleCallback to load iframe without blocking main thread
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(loadIframe);
    } else {
      setTimeout(loadIframe, 1);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadIframe = () => {
    if (iframeRef.current && !iframeRef.current.src) {
        iframeRef.current.src = "https://amironews.com/";
    }
  }

  const handleIframeLoad = () => {
    setShowSplash(false);
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
      {showSplash && <SplashScreen />}
      <iframe
        ref={iframeRef}
        className="h-full w-full border-0 transition-opacity duration-500"
        title="Amironews Viewer"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        onLoad={handleIframeLoad}
        style={{ opacity: showSplash ? 0 : 1 }}
      />
    </main>
  );
}
