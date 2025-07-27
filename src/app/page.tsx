"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ArrowDown, RefreshCw } from "lucide-react";
import { OfflineScreen } from "@/components/offline-screen";

const PULL_THRESHOLD = 70;
const CACHE_KEY = "amironews-offline-cache";
const CACHE_TIMESTAMP_KEY = "amironews-cache-timestamp";
const CACHE_EXPIRATION_MS = 15 * 60 * 1000; // 15 minutes

export default function Home() {
  const [isOffline, setIsOffline] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const touchStartRef = useRef<number | null>(null);
  const [pulling, setPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);

  const fetchAndCacheContent = useCallback(async () => {
    if (navigator.onLine) {
      try {
        console.log("Starting to fetch and cache content...");
        const response = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent("https://amironews.com")}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const html = await response.text();
        localStorage.setItem(CACHE_KEY, html);
        localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
        console.log("Content cached successfully.");
        return html;
      } catch (error) {
        console.error("Failed to fetch and cache content:", error);
        return null;
      }
    }
    return null;
  }, []);

  const loadContent = useCallback(() => {
    if (navigator.onLine) {
      if (iframeRef.current) {
        iframeRef.current.src = "https://amironews.com";
      }

      const cachedTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
      const isCacheExpired = !cachedTimestamp || (Date.now() - parseInt(cachedTimestamp, 10) > CACHE_EXPIRATION_MS);

      if (isCacheExpired) {
        // Fetch and cache in the background without blocking
        fetchAndCacheContent();
      }
    } else {
      const cachedContent = localStorage.getItem(CACHE_KEY);
      if (iframeRef.current) {
        if (cachedContent) {
          iframeRef.current.srcdoc = cachedContent;
        } else {
          // If there's no cached content, load a dedicated offline page.
          // This assumes you have an offline.html in your public folder.
          iframeRef.current.src = "/offline.html"; 
        }
      }
      setIsOffline(true);
    }
  }, [fetchAndCacheContent]);
  
  const handleRefresh = useCallback(async () => {
    if (navigator.onLine) {
      if (iframeRef.current) {
        // To force a reload of the iframe, we can change its src.
        // Appending a timestamp is a common trick.
        iframeRef.current.src = `https://amironews.com?t=${Date.now()}`;
      }
      // Also trigger a background cache update
      fetchAndCacheContent();
    } else {
      loadContent();
    }
  }, [loadContent, fetchAndCacheContent]);

  useEffect(() => {
    const onlineHandler = () => {
      setIsOffline(false);
      handleRefresh();
    };
    const offlineHandler = () => {
      setIsOffline(true);
      loadContent();
    };
    
    window.addEventListener('online', onlineHandler);
    window.addEventListener('offline', offlineHandler);

    if(typeof window !== 'undefined'){
      setIsOffline(!navigator.onLine);
    }
    
    loadContent();

    return () => {
      window.removeEventListener('online', onlineHandler);
      window.removeEventListener('offline', offlineHandler);
    };
  }, []);

  const handleTouchStart = (e: React.TouchEvent<HTMLElement>) => {
    // Only track pulls if the iframe content is scrolled to the top
    if (iframeRef.current?.contentWindow?.scrollY === 0) {
      touchStartRef.current = e.touches[0].clientY;
      setPulling(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLElement>) => {
    if (!pulling || touchStartRef.current === null) return;

    const distance = e.touches[0].clientY - touchStartRef.current;
    if (distance > 0) {
      // Prevent the browser's default pull-to-refresh action
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
      style={{ touchAction: 'pan-y' }} // Allow vertical scrolling
    >
      {isOffline && !localStorage.getItem(CACHE_KEY) && <OfflineScreen />}
      
      {/* Pull to refresh indicator */}
      <div
        className="pull-to-refresh-indicator absolute top-0 left-0 right-0 z-10 flex flex-col items-center justify-center text-center text-muted-foreground transition-all duration-200"
        style={{
          opacity: Math.min(pullDistance / PULL_THRESHOLD, 1),
          // Move the indicator down as the user pulls
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
          className="h-full w-full border-0"
          title="Amironews Viewer"
          // Sandbox for security
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          style={{
            // Handle iOS safe areas
            paddingTop: 'env(safe-area-inset-top)',
            visibility: isOffline && !localStorage.getItem(CACHE_KEY) ? 'hidden' : 'visible'
          }}
        />
    </main>
  );
}
