"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { OfflineScreen } from "@/components/offline-screen";
import { ArrowDown, WifiOff } from "lucide-react";

const PULL_THRESHOLD = 70;

export default function Home() {
  const [isOffline, setIsOffline] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [iframeKey, setIframeKey] = useState(Date.now());

  const touchStartRef = useRef<number | null>(null);
  const [pulling, setPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleRefresh = useCallback(() => {
    if (!navigator.onLine) {
       // If offline, just end the loading indicator
       setIsLoading(false);
       return;
    }
    setIsLoading(true);
    setIframeKey(Date.now()); // Re-render iframe by changing key
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      console.log("Status: Online");
      setIsOffline(false);
      handleRefresh();
    };
    
    const handleOffline = () => {
      console.log("Status: Offline");
      setIsOffline(true);
    };

    if (typeof window !== "undefined") {
      const isOnline = navigator.onLine;
      setIsOffline(!isOnline);
      if(isOnline) {
        setIsLoading(true);
      }
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [handleRefresh]);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLElement>) => {
    const iframeWindow = iframeRef.current?.contentWindow;
    if ( (isOffline || (iframeWindow && iframeWindow.scrollY === 0)) && !isLoading) {
      touchStartRef.current = e.touches[0].clientY;
      setPulling(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLElement>) => {
    if (!pulling || touchStartRef.current === null) return;
    const distance = e.touches[0].clientY - touchStartRef.current;
    if (distance > 0) {
      if(iframeRef.current?.contentWindow?.scrollY === 0) {
          e.preventDefault(); 
      }
      setPullDistance(Math.min(distance, PULL_THRESHOLD * 1.5));
    }
  };

  const handleTouchEnd = () => {
    if (pullDistance > PULL_THRESHOLD) {
      handleRefresh();
    }
    touchStartRef.current = null;
    setPulling(false);
    setPullDistance(0);
  };
  
  return (
    <main
      className="h-screen w-screen overflow-hidden bg-background"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: 'pan-y' }}
    >
      <div
        className="pull-to-refresh-indicator absolute top-0 left-0 right-0 z-10 flex flex-col items-center justify-center text-center text-muted-foreground transition-all duration-200"
        style={{
          opacity: isLoading ? 1 : Math.min(pullDistance / PULL_THRESHOLD, 1),
          transform: `translateY(${isLoading ? '0px' : Math.min(pullDistance, PULL_THRESHOLD)}px) translateY(-100%)`,
          paddingTop: `env(safe-area-inset-top)`
        }}
      >
        <div className="flex items-center justify-center p-4">
          {isLoading ? (
            <svg
              className="h-6 w-6 animate-spin-slow"
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#A93232"
                strokeWidth="10"
                strokeDasharray="282.74"
                strokeDashoffset="141.37"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#2C417A"
                strokeWidth="10"
                strokeDasharray="282.74"
                strokeDashoffset="-141.37"
              />
            </svg>
          ) : (
            <ArrowDown className={`h-6 w-6 transition-transform ${pullDistance > PULL_THRESHOLD ? 'rotate-180' : ''}`} />
          )}
        </div>
      </div>
      
      {isOffline ? (
        <OfflineScreen />
      ) : (
        <iframe
          key={iframeKey}
          ref={iframeRef}
          src="https://amironews.com"
          className="h-full w-full border-0"
          title="Amironews Viewer"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          onLoad={handleIframeLoad}
          style={{
            opacity: isLoading ? 0.5 : 1,
            transition: 'opacity 0.3s',
            paddingTop: 'env(safe-area-inset-top)',
          }}
        />
      )}
    </main>
  );
}