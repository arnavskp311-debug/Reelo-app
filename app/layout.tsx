import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'REELO — Your Social Universe.',
  description: 'Connect. Create. Discover. The original all-in-one social networking platform for creators, communities, and authentic human connection.',
  keywords: ['REELO', 'social network', 'creators', 'communities', 'editorial social', 'next-gen social media'],
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#F7F6F2',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-reelo-bg text-reelo-text selection:bg-reelo-accent selection:text-white antialiased">
        {children}
      </body>
    </html>
  );
}
