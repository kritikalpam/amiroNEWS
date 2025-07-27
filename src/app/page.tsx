"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { OfflineScreen } from "@/components/offline-screen";
import { ArrowDown, WifiOff } from "lucide-react";

const PULL_THRESHOLD = 70; // 70px
const CACHE_KEY = "amironews-offline-cache";
const CORS_PROXY_URL = "https://api.allorigins.win/raw?url=";

interface CachedContent {
  html: string;
  timestamp: number;
}

async function fetchAndCacheWebsite(url: string) {
  try {
    const response = await fetch(`${CORS_PROXY_URL}${encodeURIComponent(url)}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch website content: ${response.statusText}`);
    }
    const html = await response.text();
    const cache: CachedContent = { html, timestamp: Date.now() };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    console.log("Website content cached successfully.");
    return html;
  } catch (error) {
    console.error("Failed to cache website:", error);
    return null;
  }
}

export default function Home() {
  const [isOffline, setIsOffline] = useState(false);
  const [iframeSrc, setIframeSrc] = useState<string | undefined>(undefined);
  const [iframeSrcDoc, setIframeSrcDoc] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true); // Start loading initially
  const [showOfflineIndicator, setShowOfflineIndicator] = useState(false);

  const touchStartRef = useRef<number | null>(null);
  const [pulling, setPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const loadOfflineContent = useCallback(async () => {
    setIsLoading(true);
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (cachedData) {
      const { html } = JSON.parse(cachedData) as CachedContent;
      setIframeSrc(undefined);
      setIframeSrcDoc(html);
      setShowOfflineIndicator(true);
    } else {
      // If no cache, we are truly offline with no backup
      setIframeSrc(undefined);
      setIframeSrcDoc(undefined); 
    }
    setIsLoading(false);
  }, []);

  const loadOnlineContent = useCallback(() => {
    setIsLoading(true);
    setShowOfflineIndicator(false);
    setIframeSrcDoc(undefined); 
    // Use timestamp to break browser cache and ensure fresh load
    setIframeSrc(`https://amironews.com/?t=${new Date().getTime()}`);
    // Start caching in the background without waiting for it
    fetchAndCacheWebsite("https://amironews.com/");
  }, []);


  useEffect(() => {
    const handleOnline = () => {
      console.log("Status: Online");
      setIsOffline(false);
      loadOnlineContent();
    };
    
    const handleOffline = () => {
      console.log("Status: Offline");
      setIsOffline(true);
      loadOfflineContent();
    };

    // Initial check
    if (typeof window !== "undefined") {
      setIsOffline(!navigator.onLine);
      if (navigator.onLine) {
        handleOnline();
      } else {
        handleOffline();
      }
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [loadOnlineContent, loadOfflineContent]);

  const handleRefresh = useCallback(() => {
    if (navigator.onLine) {
      loadOnlineContent();
    } else {
      // In offline mode, a refresh doesn't do much, but we can signal it's done.
      setIsLoading(false);
    }
  }, [loadOnlineContent]);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLElement>) => {
    // Allow pull-to-refresh only if the iframe is scrolled to the top
    const iframeWindow = iframeRef.current?.contentWindow;
    if (iframeWindow && iframeWindow.scrollY === 0 && !isLoading) {
      touchStartRef.current = e.touches[0].clientY;
      setPulling(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLElement>) => {
    if (!pulling || touchStartRef.current === null) return;
    const distance = e.touches[0].clientY - touchStartRef.current;
    if (distance > 0) { // Only on pull down
      e.preventDefault(); 
      setPullDistance(Math.min(distance, PULL_THRESHOLD * 1.5));
    }
  };

  const handleTouchEnd = () => {
    if (pullDistance > PULL_THRESHOLD) {
      setIsLoading(true);
      handleRefresh();
    }
    touchStartRef.current = null;
    setPulling(false);
    setPullDistance(0);
  };

  if (isOffline && !iframeSrcDoc) {
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
       {showOfflineIndicator && (
        <div className="flex items-center justify-center gap-2 bg-muted p-2 text-center text-sm text-muted-foreground">
          <WifiOff className="h-4 w-4" />
          You are in offline mode. Some content may be unavailable.
        </div>
      )}
      <div
        className="pull-to-refresh-indicator absolute top-0 left-0 right-0 z-10 flex flex-col items-center justify-center text-center text-muted-foreground transition-all duration-200"
        style={{
          opacity: isLoading ? 1 : pullDistance / PULL_THRESHOLD,
          transform: `translateY(${isLoading ? PULL_THRESHOLD / 2 : Math.min(pullDistance, PULL_THRESHOLD)}px)`,
          paddingTop: `env(safe-area-inset-top)`
        }}
      >
        <div className="flex items-center justify-center p-2">
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
     
      <iframe
        ref={iframeRef}
        src={iframeSrc}
        srcDoc={iframeSrcDoc}
        className="h-full w-full border-0"
        title="Amironews Viewer"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        onLoad={handleIframeLoad}
        style={{
          opacity: isLoading && !iframeSrcDoc ? 0.5 : 1, // only dim if it's a fresh online load
          transition: 'opacity 0.3s, padding-top 0.3s',
          height: showOfflineIndicator ? 'calc(100% - 2.5rem)' : '100%',
          paddingTop: 'env(safe-area-inset-top)',
        }}
      />
    </main>
  );
}
