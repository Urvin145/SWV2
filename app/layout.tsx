/**
 * Root Layout
 * The top-level layout for the entire Scrapwala application.
 * Configures fonts (Inter + Public Sans from Stitch design), global metadata,
 * and wraps the app with necessary providers.
 */

import type { Metadata, Viewport } from 'next';
import { Inter, Public_Sans, Geist } from 'next/font/google';
import { Providers } from '@/components/providers/Providers';
import { LayoutWrapper } from '@/components/layout/LayoutWrapper';
import { APP_CONFIG } from '@/constants/config';
import './globals.css';
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


/* ================================================================
   Font Configuration — matches Stitch design system
   - Inter: Headlines + Body text
   - Public Sans: Labels + UI elements
   ================================================================ */
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const publicSans = Public_Sans({
  subsets: ['latin'],
  variable: '--font-public-sans',
  display: 'swap',
});

/* ================================================================
   Global Metadata — SEO baseline for all pages
   ================================================================ */
export const metadata: Metadata = {
  metadataBase: new URL(APP_CONFIG.url),
  title: {
    default: `${APP_CONFIG.name} — ${APP_CONFIG.tagline}`,
    template: `%s | ${APP_CONFIG.name}`,
  },
  description: APP_CONFIG.description,
  keywords: [
    'scrap pickup',
    'scrap collection',
    'doorstep scrap',
    'sell scrap online',
    'raddi wala',
    'kabadiwala',
    'scrap rates',
    'recycle scrap',
    'newspaper scrap',
    'plastic scrap',
    'metal scrap',
    'e-waste',
    'Bangalore scrap pickup',
  ],
  authors: [{ name: APP_CONFIG.name }],
  creator: APP_CONFIG.name,
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: APP_CONFIG.url,
    siteName: APP_CONFIG.name,
    title: `${APP_CONFIG.name} — ${APP_CONFIG.tagline}`,
    description: APP_CONFIG.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${APP_CONFIG.name} — ${APP_CONFIG.tagline}`,
    description: APP_CONFIG.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: '#0F8A5F',
  width: 'device-width',
  initialScale: 1,
};

/* ================================================================
   Root Layout Component
   ================================================================ */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(inter.variable, publicSans.variable, "font-sans", geist.variable)}>
      <body className="flex min-h-screen flex-col bg-background text-foreground antialiased">
        <Providers>
          <LayoutWrapper>{children}</LayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
