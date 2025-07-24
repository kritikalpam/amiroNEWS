"use client";

import { useState, useEffect } from "react";
import { SplashScreen } from "@/components/splash-screen";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate a 2-3 second splash screen as requested
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <main className="h-screen w-screen overflow-hidden bg-background">
      <iframe
        src="https://amironews.com/"
        className="h-full w-full animate-in fade-in-0 duration-500 border-0"
        title="Amironews Viewer"
      />
    </main>
  );
}
