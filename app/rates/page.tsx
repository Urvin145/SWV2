/**
 * Scrap Rates Page
 * Browse all scrap rates with category filtering and search.
 * Server component wrapper with SEO metadata.
 */

import type { Metadata } from 'next';
import { PageHeader } from '@/components/common/PageHeader';
import { RatesPageClient } from '@/features/rates/components/RatesPageClient';

export const metadata: Metadata = {
  title: 'Scrap Rates — Best Prices for Paper, Plastic, Metal & E-Waste | Scrapwala',
  description:
    'Check the latest scrap rates in Bangalore for paper, plastic, metal, e-waste, glass and more. Transparent pricing updated regularly. Best market rates guaranteed.',
  openGraph: {
    title: 'Scrap Rates — Best Prices for All Categories',
    description:
      'Browse current scrap rates for paper, plastic, metal, e-waste and more. Transparent pricing.',
  },
};

export default function RatesPage() {
  return (
    <div>
      <PageHeader
        title="Scrap Rates"
        description="Check the latest rates for all scrap categories. Transparent pricing, updated regularly."
      />
      <RatesPageClient />
    </div>
  );
}
