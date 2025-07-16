
'use client';

import { useState, useEffect, useRef } from 'react';
import { WifiOff } from 'lucide-react';

const AMIRONEWS_URL = 'https://amironews.com/';

function AppContent() {
  const [isOnline, setIsOnline] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const refreshIframe = () => {
    if (iframeRef.current) {
      // Check if src is different to avoid unnecessary reloads
      if (iframeRef.current.src !== AMIRONEWS_URL) {
        iframeRef.current.src = AMIRONEWS_URL;
      } else {
        iframeRef.current.contentWindow?.location.reload();
      }
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
    <div className="flex flex-col h-full w-full items-center justify-center bg-background relative pt-safe-top">
      <div className="flex-grow flex items-center justify-center">
        <div className="w-32 h-32">
          <svg viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M48.7513 103.5V52.3731H28.4239V42.545H61.6443V103.5H48.7513Z" fill="hsl(var(--foreground))"/>
            <path d="M66.4533 103.5V42.545H80.5283L100.122 75.9868V42.545H110.5V103.5H96.4251L76.8309 70.0632V103.5H66.4533Z" fill="hsl(var(--foreground))"/>
            <rect x="1" y="1" width="126" height="126" rx="24" stroke="hsl(var(--foreground))" strokeWidth="2"/>
          </svg>
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
    <div className="h-full">
      {showSplash ? <SplashScreen /> : <AppContent />}
    </div>
  )
}
