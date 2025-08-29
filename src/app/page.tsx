
'use client';

import { useCallback } from 'react';
import Script from 'next/script';
import React from 'react';

export default function Home() {

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
        <iframe
          src="https://amironews.com/"
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
    OneSignal: any;
  }
}
