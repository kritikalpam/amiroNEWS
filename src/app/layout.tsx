import type {Metadata} from 'next';
import './globals.css';
import Script from 'next/script';
import { PT_Sans } from 'next/font/google'

const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-pt-sans',
});

export const metadata: Metadata = {
  title: 'Amironews Viewer',
  description: 'A simple news webview app for amironews.com',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
                if (isDarkMode) {
                  document.documentElement.classList.add("dark");
                } else {
                  document.documentElement.classList.remove("dark");
                }
              })();
            `,
          }}
        />
        <Script
          src="https://cdn.onesignal.com/sdks/OneSignalSDK.js"
          strategy="afterInteractive"
        />
      </head>
      <body className={`${ptSans.variable} font-body antialiased`}>{children}</body>
    </html>
  );
}
