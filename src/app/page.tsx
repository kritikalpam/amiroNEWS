'use client';

import { useState, useEffect, useRef } from 'react';
import { WifiOff } from 'lucide-react';
import Lottie from "lottie-react";
import { Capacitor } from '@capacitor/core';

const AMIRONEWS_URL = 'https://amironews.com/';

function AppContent() {
  const [isOnline, setIsOnline] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine);

      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  const refreshIframe = () => {
    if (iframeRef.current) {
       setTimeout(() => {
        if (iframeRef.current) {
          // To avoid caching issues, append a timestamp
          const url = new URL(AMIRONEWS_URL);
          url.searchParams.set('t', Date.now().toString());
          iframeRef.current.src = url.toString();
        }
      }, 100);
    }
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshIframe();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    let inactivityTimer: NodeJS.Timeout;
    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(refreshIframe, 15 * 60 * 1000); // 15 minutes
    };

    const activityEvents: (keyof WindowEventMap)[] = [
      'mousemove', 'mousedown', 'keypress', 'touchmove', 'scroll'
    ];
    activityEvents.forEach(event => window.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearTimeout(inactivityTimer);
      activityEvents.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, []);

  return (
    <div className="flex flex-col h-full bg-background text-foreground font-body pt-safe-top">
      {!isOnline && (
        <div className="flex items-center justify-center gap-2 bg-destructive text-destructive-foreground p-2 text-sm flex-shrink-0">
          <WifiOff className="h-4 w-4" />
          You are offline. Showing cached content.
        </div>
      )}
      <main className="flex-1 overflow-auto bg-muted/20">
        <div
          className="w-full h-full animate-in fade-in-0 duration-500"
        >
          <iframe
            ref={iframeRef}
            src={AMIRONEWS_URL}
            title="Amironews"
            className="w-full h-full border-0"
            sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
          />
        </div>
      </main>
    </div>
  );
}

function SplashScreen() {
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    fetch('https://lottie.host/193149c9-6d60-4669-9233-14c1c990ed34/Dk3a9r54Gf.json')
      .then((response) => response.json())
      .then((data) => setAnimationData(data))
      .catch(() => setAnimationData(null));
  }, []);

  return (
    <div className="flex flex-col h-full w-full items-center justify-center bg-background relative pt-safe-top">
      <div className="flex-grow flex items-center justify-center">
        <div className="w-64">
          {animationData ? (
            <Lottie animationData={animationData} loop={true} />
          ) : (
            <div className="aspect-square w-full" />
          )}
        </div>
      </div>
      <div className="w-full bg-gray-200 h-1 absolute bottom-0">
        <div className="bg-red-600 h-1 animate-loading-bar"></div>
      </div>
    </div>
  );
}

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Only show splash screen on native platforms, and hide it after a delay.
    // On web, don't show it at all.
    const isNative = Capacitor.isNativePlatform();
    if (isNative) {
      setShowSplash(true);
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 2000); 
      return () => clearTimeout(timer);
    } else {
      setShowSplash(false);
    }
  }, []);

  if (!isClient) {
    // Render a static splash screen on the server to avoid layout shift and hydration errors
    return <SplashScreen />;
  }
  
  return (
    <div className="h-dvh">
      {showSplash ? <SplashScreen /> : <AppContent />}
    </div>
  );
}
