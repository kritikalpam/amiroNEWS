
'use client';

import { useState, useEffect, useRef } from 'react';
import { WifiOff } from 'lucide-react';
import Image from 'next/image';

const AMIRONEWS_URL = 'https://amironews.com/';

function AppContent() {
  const [isOnline, setIsOnline] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const refreshIframe = () => {
    if (iframeRef.current) {
      // By resetting the src, we force the iframe to reload its content.
      // This avoids the cross-origin security error.
      const currentSrc = iframeRef.current.src;
      iframeRef.current.src = '';
      iframeRef.current.src = currentSrc || AMIRONEWS_URL;
    }
  };
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine);
    }

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

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
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearTimeout(inactivityTimer);
      activityEvents.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, []);


  return (
    <div className="flex flex-col h-full bg-background text-foreground font-body">
      {!isOnline && (
        <div className="flex items-center justify-center gap-2 bg-destructive text-destructive-foreground p-2 text-sm flex-shrink-0 pt-safe-top">
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
  return (
    <div className="flex flex-col h-full w-full items-center justify-center bg-background relative">
      <div className="flex-grow flex items-center justify-center">
        <div className="w-64">
          <Image
            src="https://firebasestorage.googleapis.com/v0/b/amironews-22002.appspot.com/o/amironews-light.png?alt=media&token=7c50a963-4417-4861-91a6-91d18721453e"
            alt="Amironews Logo"
            width={512}
            height={128}
            className="block dark:hidden"
            priority
          />
          <Image
            src="https://firebasestorage.googleapis.com/v0/b/amironews-22002.appspot.com/o/amironews-dark.png?alt=media&token=744573f3-1823-4556-9a5d-b4b391786191"
            alt="Amironews Logo"
            width={512}
            height={128}
            className="hidden dark:block"
            priority
          />
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000); // Show splash for 2 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-full pt-safe-top">
      {showSplash ? <SplashScreen /> : <AppContent />}
    </div>
  )
}
