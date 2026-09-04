/**
 * Rates Preview Section
 * Shows top scrap rate cards dynamically fetched from Supabase database.
 * Updates in real-time when rates are changed in admin or DB.
 */

'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/common/AnimatedSection';
import { ROUTES } from '@/constants/routes';
import { ScrapCard, ScrapCardSkeleton } from '@/features/rates/components/ScrapCard';
import { useRates } from '@/features/rates/hooks/useRates';

export function RatesPreviewSection() {
  const { data: dbRates = [], isLoading } = useRates('all');

  // Display top 8 items from the database
  const previewItems = dbRates.slice(0, 8);

  return (
    <section className="bg-surface-container px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <div className="mb-14 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Live Bangalore Rates</span>
              </div>
              <h2 className="font-heading text-3xl font-extrabold text-on-surface sm:text-4xl">
                Current Scrap Rates
              </h2>
              <p className="mt-2 text-base text-on-surface-variant">
                Live market prices with 100% digital weighing scale guarantee
              </p>
            </div>
            <Link
              href={ROUTES.RATES}
              className="group inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-surface-container-lowest px-5 py-2.5 text-sm font-bold text-primary shadow-sm transition-all hover:bg-primary hover:text-on-primary"
            >
              <span>View All 21+ Scrap Rates</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </AnimatedSection>

        {/* Dynamic Rates Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ScrapCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <StaggerContainer
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6"
            staggerDelay={0.06}
          >
            {previewItems.map((item) => (
              <StaggerItem key={item.id}>
                <ScrapCard
                  name={item.name}
                  slug={item.slug}
                  pricePerUnit={item.rates[0]?.price_per_unit ?? 0}
                  unit={item.unit}
                  categoryName={item.category.name}
                  categorySlug={item.category.slug}
                  description={item.description}
                />
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </div>
    </section>
  );
}
