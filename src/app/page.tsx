'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Newspaper, Rocket, RefreshCw, WifiOff } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

const SITES = [
  {
    id: 'amironews',
    name: 'Amironews',
    url: 'https://amironews.com/',
    icon: <Newspaper className="h-5 w-5" />,
  },
  {
    id: 'studio',
    name: 'Firebase Studio',
    url: 'https://studio.firebase.google.com/studio-6936726665',
    icon: <Rocket className="h-5 w-5" />,
  },
];

export default function Home() {
  // useSearchParams is a client-side hook, so this is a client component.
  useSearchParams();
  const [activeSite, setActiveSite] = useState(SITES[0]);
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
      iframeRef.current.src = activeSite.url;
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
  }, [activeSite.url]);


  return (
    <div className="flex flex-col h-dvh bg-background text-foreground font-body pt-safe">
      {!isOnline && (
        <div className="flex items-center justify-center gap-2 bg-destructive text-destructive-foreground p-2 text-sm">
          <WifiOff className="h-4 w-4" />
          You are offline. Showing cached content.
        </div>
      )}
      <main className="flex-1 overflow-auto bg-muted/20">
        <div
          key={activeSite.id}
          className="w-full h-full animate-in fade-in-0 duration-500"
        >
          <iframe
            ref={iframeRef}
            src={activeSite.url}
            title={activeSite.name}
            className="w-full h-full border-0"
            sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts allow-top-navigation-by-user-activation"
          />
        </div>
      </main>
    </div>
  );
}
