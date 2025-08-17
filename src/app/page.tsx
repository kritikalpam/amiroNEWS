
'use client';

import Head from 'next/head';
import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('https://amironews.com/');

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
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
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
