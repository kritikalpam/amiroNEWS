
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

  const refreshIframe = () => {
    if (iframeRef.current) {
      // Setting the src to itself reloads the iframe
      iframeRef.current.src = AMIRONEWS_URL;
    }
  };
  
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


export default function Home() {
  return (
    <div className="bg-gray-800 min-h-dvh flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-[420px] h-[840px] bg-black border-4 border-gray-600 rounded-[60px] shadow-2xl overflow-hidden relative p-4">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-8 bg-black rounded-b-2xl z-10"></div>
        <div className="h-full w-full bg-white rounded-[40px] overflow-hidden">
           <AppContent />
        </div>
      </div>
    </div>
  )
}
