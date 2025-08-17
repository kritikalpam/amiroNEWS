
'use client';

import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const [history, setHistory] = useState(['https://amironews.com/']);
  const [currentUrl, setCurrentUrl] = useState('https://amironews.com/');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleBack = () => {
    if (history.length > 1) {
      const newHistory = history.slice(0, -1);
      setHistory(newHistory);
      setCurrentUrl(newHistory[newHistory.length - 1]);
    }
  };

  const handleIframeLoad = () => {
    try {
      const iframeLocation = iframeRef.current?.contentWindow?.location.href;
      if (iframeLocation && iframeLocation !== currentUrl) {
        // A navigation happened inside the iframe
        // This could be an external link
        if (iframeLocation !== history[history.length - 1]) {
            const newHistory = [...history, iframeLocation];
            setHistory(newHistory);
            setCurrentUrl(iframeLocation);
        }
      }
    } catch (error) {
        // A cross-origin error likely means we've navigated to an external site.
        // We can't get the URL directly, so we rely on what we have.
        // This is a limitation, but the back button will still work.
        console.error("Cross-origin security error:", error);
    }
  };

  const initOneSignal = () => {
    if (typeof window !== 'undefined' && window.OneSignal) {
      window.OneSignal.push(() => {
        window.OneSignal.init({
          appId: 'YOUR_ONESIGNAL_APP_ID', // Replace with your App ID
          safari_web_id: 'web.onesignal.auto.123456-7890-4444-8888-abcdef123456',
          allowLocalhostAsSecureOrigin: true,
        });
      });
    }
  };

  return (
    <>
      <Head>
        <script
          src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
          defer
          onLoad={initOneSignal}
        ></script>
      </Head>
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
                marginRight: '10px'
              }}
              aria-label="Go back"
            >
              &larr;
            </button>
            <div style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {currentUrl}
            </div>
          </header>
        )}
        <iframe
          key={currentUrl}
          ref={iframeRef}
          src={currentUrl}
          onLoad={handleIframeLoad}
          style={{
            flex: '1',
            width: '100%',
            border: 'none',
          }}
          title="Amiro News"
          sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-presentation allow-same-origin allow-scripts"
        />
      </div>
    </>
  );
}

declare global {
  interface Window {
    OneSignal: any[];
  }
}
