"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ArrowDown } from "lucide-react";
import { OfflineScreen } from "@/components/offline-screen";

const PULL_THRESHOLD = 70;

export default function Home() {
  const [isOffline, setIsOffline] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const touchStartRef = useRef<number | null>(null);
  const [pulling, setPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);

  const handleRefresh = useCallback(() => {
    if (navigator.onLine) {
      if (iframeRef.current) {
        // To force a reload of the iframe, we can change its src.
        // Appending a timestamp is a common trick.
        iframeRef.current.src = `https://amironews.com?t=${Date.now()}`;
      }
    }
  }, []);

  useEffect(() => {
    const onlineHandler = () => {
      setIsOffline(false);
      handleRefresh(); // Try to refresh content when coming online
    };
    const offlineHandler = () => {
      setIsOffline(true);
    };
    
    window.addEventListener('online', onlineHandler);
    window.addEventListener('offline', offlineHandler);

    if(typeof window !== 'undefined'){
      setIsOffline(!navigator.onLine);
    }
    
    if (navigator.onLine && iframeRef.current) {
        iframeRef.current.src = "https://amironews.com";
    }

    return () => {
      window.removeEventListener('online', onlineHandler);
      window.removeEventListener('offline', offlineHandler);
    };
  }, [handleRefresh]);

  const handleTouchStart = (e: React.TouchEvent<HTMLElement>) => {
    if (iframeRef.current?.contentWindow?.scrollY === 0) {
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
  
  if (isOffline) {
    return <OfflineScreen />;
  }
  
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
          opacity: Math.min(pullDistance / PULL_THRESHOLD, 1),
          transform: `translateY(${Math.min(pullDistance, PULL_THRESHOLD)}px) translateY(-100%)`,
          paddingTop: `env(safe-area-inset-top)`
        }}
      >
         <div className="flex items-center justify-center p-4">
           {!pulling || pullDistance < PULL_THRESHOLD ? (
             <ArrowDown className={`h-6 w-6 transition-transform ${pullDistance > PULL_THRESHOLD ? 'rotate-180' : ''}`} />
           ) : (
            <svg
              className="animate-spin h-6 w-6 text-primary"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <defs>
                <linearGradient id="spinner-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(220, 38, 38, 1)" />
                  <stop offset="100%" stopColor="rgba(37, 99, 235, 1)" />
                </linearGradient>
              </defs>
              <path
                stroke="url(#spinner-gradient)"
                strokeLinecap="round"
                strokeWidth="4"
                d="M12 2 a10 10 0 0 1 10 10"
              />
            </svg>
           )}
        </div>
      </div>
      
       <iframe
          ref={iframeRef}
          src="https://amironews.com"
          className="h-full w-full border-0"
          title="Amironews Viewer"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          style={{
            paddingTop: 'env(safe-area-inset-top)',
          }}
        />
    </main>
  );
}
