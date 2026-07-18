/**
 * Scrapwala Homepage
 * Main landing page composed of feature sections.
 * 
 * Sections:
 * 1. Hero — Headline, CTA, rates preview card
 * 2. How It Works — 3-step process
 * 3. Rates Preview — Top 8 scrap rates
 * 4. Trust Markers — Stats & testimonials
 * 5. CTA — Schedule first pickup
 */

import type { Metadata } from 'next';
import { HeroSection } from '@/features/home/components/HeroSection';
import { HowItWorksSection } from '@/features/home/components/HowItWorksSection';
import { RatesPreviewSection } from '@/features/home/components/RatesPreviewSection';
import { TrustMarkersSection } from '@/features/home/components/TrustMarkersSection';
import { CTASection } from '@/features/home/components/CTASection';

export const metadata: Metadata = {
  title: 'Scrapwala — Sell Your Scrap at the Best Rates | Doorstep Pickup',
  description:
    'Schedule a doorstep scrap pickup in minutes. We collect paper, plastic, metal, e-waste and more at the best market rates. Free pickup. Instant payment.',
  openGraph: {
    title: 'Scrapwala — Sell Your Scrap at the Best Rates',
    description:
      'Schedule a doorstep scrap pickup. Best market rates for paper, plastic, metal, e-waste.',
    type: 'website',
    locale: 'en_IN',
  },
};

/** Schema.org structured data for local business */
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Scrapwala',
  description: 'Doorstep scrap collection service with transparent pricing.',
  url: 'https://scrapwala.com',
  telephone: '+91-XXXXXXXXXX',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Bangalore',
    addressRegion: 'Karnataka',
    addressCountry: 'IN',
  },
  priceRange: '₹₹',
  areaServed: 'Bangalore',
  serviceType: 'Scrap Collection',
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <RatesPreviewSection />
        <TrustMarkersSection />
        <CTASection />
      </main>
    </>
  );
}
