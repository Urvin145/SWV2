/**
 * Scrapwala Homepage
 * Main landing page composed of feature sections.
 * 
 * Sections:
 * 1. Hero — Headline, Pincode availability bar, dual CTA, rates preview card
 * 2. How It Works — 3-step modern pickup process
 * 3. The Scrapwala Advantage — Traditional Kabadiwala vs Scrapwala comparison matrix
 * 4. Rates Preview — Top live scrap rates with category tags
 * 5. Environmental Impact — Real-time ESG metrics (Trees, Water, Energy, Landfill saved)
 * 6. B2B & Enterprise Solutions — IT offices, Society RWAs & Warehouses
 * 7. Trust Markers — Verified customer stats & testimonials
 * 8. Homepage FAQ — Instant friction reduction with accordion Q&A
 * 9. CTA Banner — Final high-converting pickup scheduling trigger
 */

import type { Metadata } from 'next';
import { HeroSection } from '@/features/home/components/HeroSection';
import { HowItWorksSection } from '@/features/home/components/HowItWorksSection';
import { ComparisonSection } from '@/features/home/components/ComparisonSection';
import { RatesPreviewSection } from '@/features/home/components/RatesPreviewSection';
import { EnvironmentalImpactSection } from '@/features/home/components/EnvironmentalImpactSection';
import { B2BSolutionsSection } from '@/features/home/components/B2BSolutionsSection';
import { TrustMarkersSection } from '@/features/home/components/TrustMarkersSection';
import { HomeFAQSection } from '@/features/home/components/HomeFAQSection';
import { CTASection } from '@/features/home/components/CTASection';

export const metadata: Metadata = {
  title: 'Scrapwala — Sell Your Scrap at the Best Rates | Doorstep Pickup in Bangalore',
  description:
    'Schedule a free doorstep scrap pickup in Bangalore. Best market rates for paper, plastic, metal, appliances & e-waste. ISO digital scales, instant UPI payment & 100% green recycling.',
  openGraph: {
    title: 'Scrapwala — Sell Your Scrap at the Best Rates | Doorstep Pickup',
    description:
      'Schedule a doorstep scrap pickup in Bangalore. Best market rates for paper, plastic, metal, appliances & e-waste.',
    type: 'website',
    locale: 'en_IN',
  },
};

/** Schema.org structured data for local business & FAQ */
const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Scrapwala',
  description: 'Doorstep scrap collection service with transparent pricing and instant digital payment in Bangalore.',
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
  serviceType: 'Scrap Collection and Recycling',
};

const homeFaqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How does the digital weighing process work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Our uniformed pickup executive carries a certified, ISO-marked digital scale. Every item is weighed right in front of you on your doorstep with full visibility.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is the doorstep pickup service completely free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, 100% free! There are zero pickup charges, zero convenience fees, and zero hidden deductions. In fact, we pay YOU the exact market rate for your scrap on the spot.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I receive payment for my scrap?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Payment is made immediately after weighing via instant UPI transfer (Google Pay, PhonePe, Paytm) or cash.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is there any minimum quantity or weight requirement?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No minimum quantity! Whether you have a single bundle of newspapers or a full garage cleanout, our team will pick it up.',
      },
    },
  ],
};

export default function HomePage() {
  return (
    <>
      {/* SECURITY: Safe usage — jsonLd objects are static, developer-controlled definitions. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeFaqJsonLd) }}
      />
      <main>
        {/* 1. Hero with Pincode lookup */}
        <HeroSection />

        {/* 2. 3-Step Process */}
        <HowItWorksSection />

        {/* 3. Traditional Kabadiwala vs Scrapwala Comparison */}
        <ComparisonSection />

        {/* 4. Live Rates Preview */}
        <RatesPreviewSection />

        {/* 5. Real-time Environmental Impact & ESG */}
        <EnvironmentalImpactSection />

        {/* 6. B2B, Tech Parks & Apartment Society Bulk Solutions */}
        <B2BSolutionsSection />

        {/* 7. Trust Markers & Testimonials */}
        <TrustMarkersSection />

        {/* 8. Frequently Asked Questions */}
        <HomeFAQSection />

        {/* 9. Final CTA */}
        <CTASection />
      </main>
    </>
  );
}
