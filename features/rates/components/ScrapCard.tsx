/**
 * ScrapCard Component
 * Ultra-clean, visual-first rate card showing:
 * - Category Badge (Top Right)
 * - Item Name (Bold)
 * - Large Price / Unit (Bottom Left)
 * - Real Photo Cutout (Bottom Right)
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { formatCurrency } from '@/lib/utils';
import { ITEM_VISUAL_MAP, CATEGORY_BADGE_STYLES } from '@/constants/scrapItemMedia';

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
}: ScrapCardProps) {
  const [imageError, setImageError] = useState(false);

  // Retrieve media metadata from visual map
  const visual = ITEM_VISUAL_MAP[slug] || {
    emoji: '📦',
    image: '',
    alt: name,
    badgeLabel: categoryName.toUpperCase(),
  };

  const badgeClass =
    CATEGORY_BADGE_STYLES[categorySlug] ||
    'bg-surface-container text-on-surface-variant border-outline-variant/30';

  return (
    <motion.div
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl sm:rounded-3xl border border-outline-variant/20 bg-surface-container-lowest p-5 sm:p-6 shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-xl"
    >
      <div>
        {/* Top row: Category badge */}
        <div className="mb-3 flex items-center justify-end">
          <span
            className={`rounded-full border px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider ${badgeClass}`}
          >
            {visual.badgeLabel || categoryName}
          </span>
        </div>

        {/* Item name */}
        <h3 className="text-base sm:text-lg font-bold text-on-surface transition-colors group-hover:text-primary">
          {name}
        </h3>
      </div>

      {/* Bottom split: Large Price on Left + Photo Cutout on Right */}
      <div className="mt-6 flex items-end justify-between gap-3 pt-3 border-t border-outline-variant/10">
        {/* Price display on left */}
        <div className="flex items-baseline gap-1">
          <span className="text-2xl sm:text-3xl font-black tracking-tight text-primary">
            {formatCurrency(pricePerUnit)}
          </span>
          <span className="text-xs font-semibold text-on-surface-variant">/ {unit}</span>
        </div>

        {/* Real photo cutout on right */}
        <div className="relative h-20 w-24 sm:h-24 sm:w-28 flex-shrink-0 overflow-hidden rounded-xl bg-surface-container-low/40">
          {!imageError && visual.image ? (
            <Image
              src={visual.image}
              alt={visual.alt}
              fill
              sizes="(max-width: 640px) 96px, 112px"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs font-bold text-on-surface-variant bg-surface-container-low">
              {name}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/**
 * ScrapCardSkeleton
 * High-fidelity loading placeholder for ScrapCard.
 */
export function ScrapCardSkeleton() {
  return (
    <div className="animate-pulse flex h-full flex-col justify-between rounded-2xl sm:rounded-3xl border border-outline-variant/15 bg-surface-container-lowest p-5 sm:p-6 shadow-sm">
      <div>
        <div className="mb-3 flex items-center justify-end">
          <div className="h-5 w-16 rounded-full bg-surface-container" />
        </div>
        <div className="h-6 w-3/4 rounded bg-surface-container" />
      </div>

      <div className="mt-6 flex items-end justify-between border-t border-outline-variant/10 pt-3">
        <div className="h-8 w-24 rounded bg-surface-container" />
        <div className="h-20 w-24 sm:h-24 sm:w-28 rounded-xl bg-surface-container" />
      </div>
    </div>
  );
}
