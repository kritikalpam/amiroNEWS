"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import OneSignal from 'react-onesignal';
import { SplashScreen } from "@/components/splash-screen";
import { OfflineBanner } from "@/components/offline-banner";
import { RefreshCw, ArrowDown } from "lucide-react";

const PULL_THRESHOLD = 70; // 70px

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [iframeSrc, setIframeSrc] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const touchStartRef = useRef<number | null>(null);
  const [pulling, setPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);

  const handleRefresh = useCallback(() => {
    if (isOffline) return;
    setIsLoading(true);
    setIframeSrc(prevSrc => {
      const url = new URL(prevSrc?.split("?")[0] || "https://amironews.com/");
      url.searchParams.set("t", new Date().getTime().toString());
      return url.toString();
    });
  }, [isOffline]);

  useEffect(() => {
    OneSignal.init({ appId: '9e73b5b9-166a-4fa9-93db-05f23714e41b' });

    if (typeof navigator !== 'undefined') {
      setIsOffline(!navigator.onLine);
    }

    const handleOnline = () => {
      setIsOffline(false);
      handleRefresh();
    };
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const splashTimer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);
    
    const iframeTimer = setTimeout(() => {
      setIframeSrc("https://amironews.com/");
    }, 100);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearTimeout(splashTimer);
      clearTimeout(iframeTimer);
    };
  }, [handleRefresh]);
  
  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLElement>) => {
    if (window.scrollY === 0 && !isLoading) {
      touchStartRef.current = e.touches[0].clientY;
      setPulling(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLElement>) => {
    if (!pulling || touchStartRef.current === null) return;
    const distance = e.touches[0].clientY - touchStartRef.current;
    if (distance > 0) {
      e.preventDefault();
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

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <main 
      className="h-screen w-screen overflow-hidden bg-background pt-safe-top"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: 'pan-y' }}
    >
      {isOffline && <OfflineBanner />}
      <>
        <div
          className="pull-to-refresh-indicator absolute top-0 left-0 right-0 z-10 flex flex-col items-center justify-center text-center text-muted-foreground transition-all duration-200"
          style={{ 
            opacity: isLoading ? 1 : pullDistance / PULL_THRESHOLD,
            transform: `translateY(${isLoading ? PULL_THRESHOLD / 2 : Math.min(pullDistance, PULL_THRESHOLD)}px)`,
            paddingTop: `env(safe-area-inset-top)`
          }}
        >
          <div className="flex items-center gap-2 rounded-full bg-card p-2 shadow-md">
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin-slow" />
            ) : (
              <ArrowDown className={`h-4 w-4 transition-transform ${pullDistance > PULL_THRESHOLD ? 'rotate-180' : ''}`} />
            )}
          </div>
          {!isLoading && (
            <span className="mt-1 text-xs font-semibold">
              {pullDistance > PULL_THRESHOLD ? 'Release to refresh' : 'Pull to refresh'}
            </span>
          )}
        </div>

        {iframeSrc && (
          <iframe
            src={iframeSrc}
            className="h-full w-full border-0"
            title="Amironews Viewer"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            onLoad={handleIframeLoad}
            style={{ opacity: isLoading ? 0.5 : 1, transition: 'opacity 0.3s', paddingTop: isOffline ? '2rem' : '0' }}
          />
        )}
      </>
    </main>
  );
}
