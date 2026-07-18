/**
 * RateGrid Component
 * Responsive grid layout for ScrapCards.
 * Handles loading skeletons, empty state, and staggered animation.
 */

'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ScrapCard, ScrapCardSkeleton } from './ScrapCard';
import { EmptyState } from '@/components/common/EmptyState';
import type { RateItem } from '@/features/rates/services/rateService';

interface RateGridProps {
  items: RateItem[];
  isLoading: boolean;
  searchQuery?: string;
}

export function RateGrid({ items, isLoading, searchQuery }: RateGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <ScrapCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title="No items found"
        description={
          searchQuery
            ? `No scrap items match "${searchQuery}". Try a different search term.`
            : 'No items available in this category.'
        }
        action={{ label: 'Clear Filters', href: '/rates' }}
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-5">
      <AnimatePresence mode="popLayout">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, delay: index * 0.04 }}
          >
            <ScrapCard
              name={item.name}
              slug={item.slug}
              pricePerUnit={item.rates[0]?.price_per_unit ?? 0}
              unit={item.unit}
              categoryName={item.category.name}
              categorySlug={item.category.slug}
              description={item.description}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
