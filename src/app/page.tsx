'use client';

import { useState, useEffect, useRef } from 'react';
import { WifiOff, Newspaper, Rocket } from 'lucide-react';
import Lottie from "lottie-react";
import { Capacitor } from '@capacitor/core';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const AMIRONEWS_URL = 'https://amironews.com/';

function IframeView({ src }: { src: string }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const refreshIframe = () => {
    if (iframeRef.current) {
      setTimeout(() => {
        if (iframeRef.current) {
          const url = new URL(src);
          url.searchParams.set('t', Date.now().toString());
          iframeRef.current.src = url.toString();
        }
      }, 100);
    }
  };

  useEffect(() => {
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

    const activityEvents: (keyof WindowEventMap)[] = ['mousemove', 'mousedown', 'keypress', 'touchmove', 'scroll'];
    activityEvents.forEach(event => window.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearTimeout(inactivityTimer);
      activityEvents.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [src]);

  return (
    <iframe
      ref={iframeRef}
      src={src}
      className="w-full h-full border-0"
      sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
    />
  );
}


function AppContent() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine);
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      }
    };
  }, []);

  return (
    <div className="flex flex-col h-full bg-background text-foreground font-body pt-safe-top">
      {!isOnline && (
        <div className="flex items-center justify-center gap-2 bg-destructive text-destructive-foreground p-2 text-sm flex-shrink-0">
          <WifiOff className="h-4 w-4" />
          You are offline. Showing cached content.
        </div>
      )}
      <main className="flex-1 bg-background overflow-auto">
        <IframeView src={AMIRONEWS_URL} />
      </main>
    </div>
  );
}

function SplashScreen() {
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    fetch('https://lottie.host/193149c9-6d60-4669-9233-14c1c990ed34/Dk3a9r54Gf.json')
      .then((response) => response.json())
      .then((data) => setAnimationData(data))
      .catch(() => setAnimationData(null));
  }, []);

  return (
    <div className="flex flex-col h-full w-full items-center justify-center bg-background relative pt-safe-top">
      <div className="flex-grow flex items-center justify-center">
        <div className="w-64">
          {animationData ? (
            <Lottie animationData={animationData} loop={true} />
          ) : (
            <div className="aspect-square w-full" />
          )}
        </div>
      </div>
      <div className="w-full bg-gray-200 h-1 absolute bottom-0">
        <div className="bg-primary h-1 animate-loading-bar"></div>
      </div>
    </div>
  );
}

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    let isNative = false;
    try {
      isNative = Capacitor.isNativePlatform();
    } catch (e) {
      // Running in a non-capacitor environment
    }
    
    if (isNative) {
      setShowSplash(true);
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 2000); 
      return () => clearTimeout(timer);
    } else {
      setShowSplash(false);
    }
  }, []);

  if (!isClient) {
    return <SplashScreen />;
  }
  
  return (
    <div className="h-dvh">
      {showSplash ? <SplashScreen /> : <AppContent />}
    </div>
  );
}
