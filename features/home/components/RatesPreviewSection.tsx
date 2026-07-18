/**
 * Rates Preview Section
 * Shows top 6-8 scrap rate cards on the homepage with a "View All" link.
 * Fetches from Supabase server-side for SEO, with staggered animations.
 */

'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/common/AnimatedSection';
import { ROUTES } from '@/constants/routes';
import { formatCurrency } from '@/lib/utils';

interface RatePreviewItem {
  name: string;
  unit: string;
  price: number;
  category: string;
  emoji: string;
}

/** Static preview data — will be connected to Supabase in Sprint 4 */
const previewRates: RatePreviewItem[] = [
  { name: 'Newspaper', unit: 'kg', price: 14, category: 'Paper', emoji: '📰' },
  { name: 'Cardboard', unit: 'kg', price: 8, category: 'Paper', emoji: '📦' },
  { name: 'Copper', unit: 'kg', price: 425, category: 'Metal', emoji: '🔩' },
  { name: 'Iron', unit: 'kg', price: 28, category: 'Metal', emoji: '⚙️' },
  { name: 'Aluminium', unit: 'kg', price: 105, category: 'Metal', emoji: '🥫' },
  { name: 'PET Bottles', unit: 'kg', price: 10, category: 'Plastic', emoji: '♻️' },
  { name: 'Laptops', unit: 'piece', price: 200, category: 'E-Waste', emoji: '💻' },
  { name: 'Brass', unit: 'kg', price: 305, category: 'Metal', emoji: '🔔' },
];

export function RatesPreviewSection() {
  return (
    <section className="bg-surface-container px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <div className="mb-14 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="mb-3 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
                Today&apos;s Rates
              </span>
              <h2 className="font-heading text-3xl font-bold text-on-surface sm:text-4xl">
                Scrap Rates
              </h2>
              <p className="mt-2 text-on-surface-variant">
                Transparent pricing, updated regularly
              </p>
            </div>
            <Link
              href={ROUTES.RATES}
              className="group flex items-center gap-2 font-semibold text-primary transition-colors hover:text-primary-container"
            >
              View All Rates
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </AnimatedSection>

        <StaggerContainer
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-5"
          staggerDelay={0.08}
        >
          {previewRates.map((item) => (
            <StaggerItem key={item.name}>
              <div className="group rounded-xl border border-outline-variant/15 bg-surface-container-lowest p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-md">
                {/* Emoji + Category */}
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-2xl">{item.emoji}</span>
                  <span className="rounded-full bg-surface-container px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-on-surface-variant">
                    {item.category}
                  </span>
                </div>

                {/* Item name */}
                <h3 className="mb-1 font-semibold text-on-surface">{item.name}</h3>

                {/* Price */}
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold text-primary">
                    {formatCurrency(item.price)}
                  </span>
                  <span className="text-xs text-on-surface-variant">/{item.unit}</span>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
