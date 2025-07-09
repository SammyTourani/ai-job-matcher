import type { Metadata } from 'next';
import './globals.css';
import { APP_NAME, APP_DESCRIPTION } from '@/utils/constants';

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  keywords: ['job matching', 'AI', 'resume analysis', 'career', 'employment'],
  authors: [{ name: 'AI Job Matcher Team' }],
  creator: 'AI Job Matcher',
  publisher: 'AI Job Matcher',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('http://localhost:3000'),
  openGraph: {
    title: APP_NAME,
    description: APP_DESCRIPTION,
    url: 'http://localhost:3000',
    siteName: APP_NAME,
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    title: APP_NAME,
    description: APP_DESCRIPTION,
    card: 'summary_large_image',
    creator: '@aijobmatcher',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0ea5e9" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="h-full bg-gray-50">
        <div className="min-h-full">
          {children}
        </div>
      </body>
    </html>
  );
}