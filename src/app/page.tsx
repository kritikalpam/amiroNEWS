
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
      <div className="flex h-screen bg-gray-100">
        <aside className="w-64 bg-white shadow-md">
          <div className="p-4">
            <h2 className="text-xl font-bold">Amiro News</h2>
          </div>
          <nav>
            <ul>
              <li className="p-4 hover:bg-gray-100 cursor-pointer">
                Home
              </li>
            </ul>
          </nav>
        </aside>
        <main className="flex-1">
          <iframe
            src="https://amironews.com/"
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
            }}
            title="Amiro News"
          />
        </main>
      </div>
    </>
  );
}

declare global {
  interface Window {
    OneSignal: any[];
  }
}
