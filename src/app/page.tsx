"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ArrowDown } from "lucide-react";
import { OfflineScreen } from "@/components/offline-screen";

const PULL_THRESHOLD = 70;
const CACHE_KEY = "amironews-offline-cache";
const CACHE_TIMESTAMP_KEY = "amironews-cache-timestamp";
const CACHE_EXPIRATION_MS = 15 * 60 * 1000; // 15 minutes

export default function Home() {
  const [isOffline, setIsOffline] = useState(false);
  const [iframeKey, setIframeKey] = useState(Date.now());
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const touchStartRef = useRef<number | null>(null);
  const [pulling, setPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);

  const fetchAndCacheContent = useCallback(async () => {
    if (navigator.onLine) {
      try {
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

  const loadContent = useCallback(async () => {
    if (navigator.onLine) {
      const cachedTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
      const isCacheExpired = !cachedTimestamp || (Date.now() - parseInt(cachedTimestamp, 10) > CACHE_EXPIRATION_MS);

      if (isCacheExpired) {
        await fetchAndCacheContent();
      }
      
      if (iframeRef.current) {
        iframeRef.current.src = "https://amironews.com";
      }

    } else {
      const cachedContent = localStorage.getItem(CACHE_KEY);
      if (iframeRef.current) {
        if (cachedContent) {
          iframeRef.current.srcdoc = cachedContent;
        } else {
          iframeRef.current.src = "/offline.html";
        }
      }
      setIsOffline(true);
    }
  }, [fetchAndCacheContent]);

  const handleRefresh = useCallback(async () => {
    await loadContent();
  }, [loadContent]);

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
             <svg className="animate-spin h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
             </svg>
           )}
        </div>
      </div>
      
       <iframe
          key={iframeKey}
          ref={iframeRef}
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
