
'use client';

import Head from 'next/head';

export default function Home() {
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
      <iframe
        src="https://amironews.com/"
        style={{
          width: '100vw',
          height: '100vh',
          border: 'none',
        }}
        title="Amiro News"
      />
    </>
  );
}

declare global {
  interface Window {
    OneSignal: any[];
  }
}
