
'use client';

import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const [history, setHistory] = useState(['https://amironews.com/']);
  const [currentUrl, setCurrentUrl] = useState('https://amironews.com/');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [inputUrl, setInputUrl] = useState(currentUrl);

  const navigateTo = (url: string) => {
    if (url !== currentUrl) {
      const newHistory = [...history, url];
      setHistory(newHistory);
      setCurrentUrl(url);
      setInputUrl(url);
    }
  };

  const handleBack = () => {
    if (history.length > 1) {
      const newHistory = history.slice(0, -1);
      const prevUrl = newHistory[newHistory.length - 1];
      setHistory(newHistory);
      setCurrentUrl(prevUrl);
      setInputUrl(prevUrl);
    }
  };

  const handleIframeLoad = () => {
    try {
      const iframeLocation = iframeRef.current?.contentWindow?.location.href;
      // Check if it's a genuine navigation and not just a reload of the same URL
      if (iframeLocation && iframeLocation !== currentUrl && iframeLocation !== 'about:blank') {
         // To prevent an infinite loop, only update if the new location isn't already the last one in history
         if(iframeLocation !== history[history.length - 1]) {
            navigateTo(iframeLocation);
         }
      }
    } catch (error) {
        // Cross-origin error. We can't get the URL, but the user initiated this.
        // The back button is already visible, so the user can still go back.
        console.error("Cross-origin security error on load:", error);
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
            disabled={history.length <= 1}
            style={{
              background: 'none',
              border: 'none',
              cursor: history.length <= 1 ? 'not-allowed' : 'pointer',
              fontSize: '24px',
              padding: '0 12px',
              marginRight: '10px',
              color: history.length <= 1 ? '#ccc' : '#000',
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
        <iframe
          key={currentUrl} // Re-mounts iframe on URL change
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
