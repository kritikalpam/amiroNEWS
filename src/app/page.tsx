
'use client';

import Head from 'next/head';
import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('https://amironews.com/');
  const [inputValue, setInputValue] = useState('https://amironews.com/');

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

  const handleGo = () => {
    let newUrl = inputValue.trim();
    if (newUrl && !/^https?:\/\//i.test(newUrl)) {
      newUrl = 'https://' + newUrl;
    }
    if (newUrl) {
      setUrl(newUrl);
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
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <div style={{ display: 'flex', padding: '8px', backgroundColor: '#f0f0f0', borderBottom: '1px solid #ccc' }}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleGo();
              }
            }}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              marginRight: '8px',
            }}
            aria-label="Website URL"
          />
          <button
            onClick={handleGo}
            style={{
              padding: '8px 16px',
              border: 'none',
              backgroundColor: '#007bff',
              color: 'white',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Go
          </button>
        </div>
        <iframe
          src={url}
          style={{
            flex: '1',
            width: '100%',
            border: 'none',
          }}
          title="Amiro News"
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
