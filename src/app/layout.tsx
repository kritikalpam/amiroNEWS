import type {Metadata} from 'next';
import './globals.css';
import Script from 'next/script';
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
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
      <body className={`${inter.variable} font-body antialiased`}>{children}</body>
    </html>
  );
}
