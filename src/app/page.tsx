
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Script from 'next/script';
import React from 'react';

const MemoizedIframe = React.memo(function MemoizedIframe({ src, onLoad, iframeRef }: { src: string; onLoad: () => void; iframeRef: React.RefObject<HTMLIFrameElement> }) {
  return (
    <iframe
      key={src}
      ref={iframeRef}
      src={src}
      onLoad={onLoad}
      style={{
        flex: '1',
        width: '100%',
        border: 'none',
      }}
      title="Amiro News"
      sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-presentation allow-same-origin allow-scripts"
    />
  );
});
MemoizedIframe.displayName = 'MemoizedIframe';


export default function Home() {
  const [history, setHistory] = useState(['https://amironews.com/']);
  const [currentUrl, setCurrentUrl] = useState('https://amironews.com/');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [inputUrl, setInputUrl] = useState(currentUrl);

  const navigateTo = useCallback((url: string) => {
    // A simple check to avoid loops with about:blank
    if (url === 'about:blank') return;

    // Check if the new URL is already the last one in history
    setHistory(prevHistory => {
        if (url !== prevHistory[prevHistory.length - 1]) {
            const newHistory = [...prevHistory, url];
            setCurrentUrl(url);
            setInputUrl(url);
            return newHistory;
        }
        return prevHistory;
    });
  }, []);

  const handleBack = useCallback(() => {
    setHistory(prevHistory => {
        if (prevHistory.length > 1) {
            const newHistory = prevHistory.slice(0, -1);
            const prevUrl = newHistory[newHistory.length - 1];
            setCurrentUrl(prevUrl);
            setInputUrl(prevUrl);
            return newHistory;
        }
        return prevHistory;
    });
  }, []);

  const handleIframeLoad = useCallback(() => {
    try {
      const iframeLocation = iframeRef.current?.contentWindow?.location.href;
      if (iframeLocation && iframeLocation !== currentUrl) {
         navigateTo(iframeLocation);
      }
    } catch (error) {
        // This error is expected for cross-origin iframes.
        // We can't read the URL, so we rely on the user to navigate
        // and our back button to function. The button will appear
        // if we successfully navigated to a page we could read
        // or if a link click in a sandboxed iframe changed the src.
        console.error("Cross-origin security error:", error);
    }
  }, [currentUrl, navigateTo]);

  const initOneSignal = useCallback(() => {
    const OneSignal = window.OneSignal || [];
    OneSignal.push(function() {
      OneSignal.init({
        appId: '3508a1ed-ec7c-45dc-8b41-a0652886dad4',
        safari_web_id: 'web.onesignal.auto.123456-7890-4444-8888-abcdef123456',
        allowLocalhostAsSecureOrigin: true,
      });
    });
  }, []);

  return (
    <>
      <Script
        src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
        defer
        onLoad={initOneSignal}
      ></Script>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#fff' }}>
       {history.length > 1 && (
         <header style={{
            display: 'flex',
            alignItems: 'center',
            padding: '8px',
            backgroundColor: '#f1f1f1',
            borderBottom: '1px solid #ddd',
            flexShrink: 0,
          }}>
            <button
              onClick={handleBack}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '24px',
                padding: '0 12px',
                marginRight: '10px',
                color: '#000',
              }}
              aria-label="Go back"
            >
              &larr;
            </button>
            <div style={{
              flex: 1,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              color: '#333'
            }}>
              {currentUrl}
            </div>
          </header>
        )}
        <MemoizedIframe
            src={currentUrl}
            onLoad={handleIframeLoad}
            iframeRef={iframeRef}
        />
      </div>
    </>
  );
}

declare global {
  interface Window {
    OneSignal: any;
  }
}
