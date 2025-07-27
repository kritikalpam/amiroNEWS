import type {Metadata} from 'next';
import './globals.css';
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
      </head>
      <body className={`${inter.variable} font-body antialiased`}>{children}</body>
    </html>
  );
}
