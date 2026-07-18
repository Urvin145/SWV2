/**
 * CategoryFilter Component
 * Horizontal scrollable category chips for filtering scrap rates.
 * Includes "All" default option.
 */

'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/** Category to emoji mapping for filter chips */
const chipEmoji: Record<string, string> = {
  all: '📋',
  paper: '📰',
  plastic: '♻️',
  metal: '⚙️',
  'e-waste': '💻',
  glass: '🪟',
  others: '📦',
};

interface CategoryFilterProps {
  categories: { slug: string; name: string }[];
  activeCategory: string;
  onCategoryChange: (slug: string) => void;
  isLoading?: boolean;
}

export function CategoryFilter({
  categories,
  activeCategory,
  onCategoryChange,
  isLoading,
}: CategoryFilterProps) {
  const allCategories = [{ slug: 'all', name: 'All Categories' }, ...categories];

  return (
    <div className="scrollbar-hide -mx-4 flex gap-2.5 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
      {isLoading
        ? Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="h-10 w-24 shrink-0 animate-pulse rounded-full bg-surface-container"
            />
          ))
        : allCategories.map((cat) => {
            const isActive = activeCategory === cat.slug;
            return (
              <motion.button
                key={cat.slug}
                whileTap={{ scale: 0.95 }}
                onClick={() => onCategoryChange(cat.slug)}
                className={cn(
                  'relative flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-all',
                  isActive
                    ? 'bg-primary text-on-primary shadow-md shadow-primary/20'
                    : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container hover:text-on-surface',
                )}
              >
                <span className="text-base">{chipEmoji[cat.slug] ?? '📦'}</span>
                <span className="whitespace-nowrap">{cat.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeCategory"
                    className="absolute inset-0 rounded-full bg-primary"
                    style={{ zIndex: -1 }}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
    </div>
  );
}
