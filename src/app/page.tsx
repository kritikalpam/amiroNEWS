
'use client';

import { useState, useEffect, useRef } from 'react';
import { WifiOff } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

const AMIRONEWS_URL = 'https://amironews.com/';

function AppContent() {
  // useSearchParams is a client-side hook, so this is a client component.
  useSearchParams();
  const [isOnline, setIsOnline] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const refreshIframe = () => {
    if (iframeRef.current) {
      // Setting the src to itself reloads the iframe
      iframeRef.current.src = AMIRONEWS_URL;
    }
  };
  
  useEffect(() => {
    // Initial check
    if (typeof navigator !== 'undefined') {
      setIsOnline(navigator.onLine);
    }

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshIframe();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    let inactivityTimer: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        refreshIframe();
      }, 15 * 60 * 1000); // 15 minutes
    };

    const activityEvents: (keyof WindowEventMap)[] = [
      'mousemove', 'mousedown', 'keypress', 'touchmove', 'scroll'
    ];

    activityEvents.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    resetTimer(); // Start the timer initially

    return () => {
      clearTimeout(inactivityTimer);
      activityEvents.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, []);


  return (
    <div className="flex flex-col h-full bg-background text-foreground font-body">
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
            sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts allow-top-navigation-by-user-activation"
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
        <div className="w-32 h-32">
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="50" fill="#405a9a"/>
            <circle cx="50" cy="50" r="38" fill="#ffffff"/>
            <circle cx="50" cy="50" r="12" fill="#d93142"/>
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
    <div className="bg-gray-800 min-h-dvh flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-[420px] h-[840px] bg-black border-4 border-gray-600 rounded-[60px] shadow-2xl overflow-hidden relative">
        <div className="h-full w-full bg-white rounded-[56px] overflow-hidden pt-safe-top">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-8 bg-black rounded-b-2xl z-10"></div>
          <div className="h-full w-full bg-white rounded-[40px] overflow-hidden pt-8">
            {showSplash ? <SplashScreen /> : <AppContent />}
          </div>
        </div>
      </div>
    </div>
  )
}
