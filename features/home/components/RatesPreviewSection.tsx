/**
 * Rates Preview Section
 * Shows top 8 scrap rate cards on the homepage with high-legibility visual-first cards.
 * Features: 3D emoji, category pill, bold title, big price, and cut-out photography.
 */

'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/common/AnimatedSection';
import { ROUTES } from '@/constants/routes';
import { ScrapCard } from '@/features/rates/components/ScrapCard';

interface RatePreviewItem {
  name: string;
  slug: string;
  unit: string;
  price: number;
  categoryName: string;
  categorySlug: string;
  description: string;
}

const previewRates: RatePreviewItem[] = [
  {
    name: 'Newspaper',
    slug: 'newspaper',
    unit: 'kg',
    price: 14,
    categoryName: 'Paper',
    categorySlug: 'paper',
    description: 'Old newspapers and dailies',
  },
  {
    name: 'Cardboard',
    slug: 'cardboard',
    unit: 'kg',
    price: 8,
    categoryName: 'Paper',
    categorySlug: 'paper',
    description: 'Cardboard boxes and corrugated sheets',
  },
  {
    name: 'Copper',
    slug: 'copper',
    unit: 'kg',
    price: 425,
    categoryName: 'Metal',
    categorySlug: 'metal',
    description: 'Copper wire, pipes, and fittings',
  },
  {
    name: 'Iron',
    slug: 'iron',
    unit: 'kg',
    price: 28,
    categoryName: 'Metal',
    categorySlug: 'metal',
    description: 'Iron rods, pipes, sheets, and utensils',
  },
  {
    name: 'Aluminium',
    slug: 'aluminium',
    unit: 'kg',
    price: 105,
    categoryName: 'Metal',
    categorySlug: 'metal',
    description: 'Aluminium cans, foil, and utensils',
  },
  {
    name: 'PET Bottles',
    slug: 'pet-bottles',
    unit: 'kg',
    price: 10,
    categoryName: 'Plastic',
    categorySlug: 'plastic',
    description: 'Mineral water and soft drink bottles',
  },
  {
    name: 'Laptops & Computers',
    slug: 'laptops-computers',
    unit: 'piece',
    price: 200,
    categoryName: 'E-Waste',
    categorySlug: 'e-waste',
    description: 'Old laptops, desktops, and monitors',
  },
  {
    name: 'Brass',
    slug: 'brass',
    unit: 'kg',
    price: 305,
    categoryName: 'Metal',
    categorySlug: 'metal',
    description: 'Brass taps, fittings, and decorative items',
  },
];

export function RatesPreviewSection() {
  return (
    <section className="bg-surface-container px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <div className="mb-14 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Today&apos;s Verified Rates</span>
              </div>
              <h2 className="font-heading text-3xl font-extrabold text-on-surface sm:text-4xl">
                Bangalore Scrap Rates
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

        <StaggerContainer
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6"
          staggerDelay={0.06}
        >
          {previewRates.map((item) => (
            <StaggerItem key={item.slug}>
              <ScrapCard
                name={item.name}
                slug={item.slug}
                pricePerUnit={item.price}
                unit={item.unit}
                categoryName={item.categoryName}
                categorySlug={item.categorySlug}
                description={item.description}
              />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
