/**
 * ScrapCard Component
 * Individual rate card showing a scrap item with its current price.
 * Features: emoji fallback, name, price/unit, category badge, hover animation.
 */

'use client';

import { motion } from 'framer-motion';
import { formatCurrency } from '@/lib/utils';

/** Category to emoji mapping */
const categoryEmoji: Record<string, string> = {
  paper: '📰',
  plastic: '♻️',
  metal: '⚙️',
  'e-waste': '💻',
  glass: '🪟',
  others: '📦',
};

/** Item-specific emoji overrides */
const itemEmoji: Record<string, string> = {
  newspaper: '📰',
  cardboard: '📦',
  'magazines-books': '📚',
  'office-paper': '📄',
  'pet-bottles': '🍶',
  'hdpe-containers': '🧴',
  'hard-plastic': '🪣',
  'plastic-mix': '♻️',
  iron: '⚙️',
  copper: '🔩',
  aluminium: '🥫',
  steel: '🔧',
  brass: '🔔',
  'laptops-computers': '💻',
  'mobile-phones': '📱',
  'wires-cables': '🔌',
  batteries: '🔋',
  'glass-bottles': '🍾',
  'window-glass': '🪟',
  'old-clothes': '👕',
  'tyres-rubber': '🛞',
};

interface ScrapCardProps {
  name: string;
  slug: string;
  pricePerUnit: number;
  unit: string;
  categoryName: string;
  categorySlug: string;
  description?: string | null;
}

export function ScrapCard({
  name,
  slug,
  pricePerUnit,
  unit,
  categoryName,
  categorySlug,
  description,
}: ScrapCardProps) {
  const emoji = itemEmoji[slug] ?? categoryEmoji[categorySlug] ?? '📦';

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className="group flex flex-col rounded-xl border border-outline-variant/15 bg-surface-container-lowest p-5 shadow-sm transition-colors hover:border-primary/25 hover:shadow-md"
    >
      {/* Top row: emoji + category badge */}
      <div className="mb-4 flex items-start justify-between">
        <span className="text-3xl">{emoji}</span>
        <span className="rounded-full bg-surface-container px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant">
          {categoryName}
        </span>
      </div>

      {/* Item name */}
      <h3 className="mb-1 text-base font-bold text-on-surface">{name}</h3>

      {/* Description */}
      {description && (
        <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-on-surface-variant">
          {description}
        </p>
      )}

      {/* Spacer to push price to bottom */}
      <div className="mt-auto" />

      {/* Price */}
      <div className="mt-3 flex items-baseline gap-1.5 border-t border-outline-variant/10 pt-3">
        <span className="text-xl font-bold text-primary">{formatCurrency(pricePerUnit)}</span>
        <span className="text-xs font-medium text-on-surface-variant">/ {unit}</span>
      </div>
    </motion.div>
  );
}

/**
 * ScrapCardSkeleton
 * Loading placeholder for ScrapCard.
 */
export function ScrapCardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-5">
      <div className="mb-4 flex items-start justify-between">
        <div className="h-8 w-8 rounded-lg bg-surface-container" />
        <div className="h-4 w-14 rounded-full bg-surface-container" />
      </div>
      <div className="mb-2 h-5 w-3/4 rounded bg-surface-container" />
      <div className="mb-1 h-3 w-full rounded bg-surface-container" />
      <div className="mb-3 h-3 w-2/3 rounded bg-surface-container" />
      <div className="mt-auto border-t border-outline-variant/10 pt-3">
        <div className="h-6 w-20 rounded bg-surface-container" />
      </div>
    </div>
  );
}
