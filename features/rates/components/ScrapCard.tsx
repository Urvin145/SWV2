/**
 * ScrapCard Component
 * High-legibility, visual-first rate card showing scrap item with real photography.
 * Matches user's optimized card layout:
 * - Top: 3D emoji + Category Pill badge
 * - Middle: Bold Title + Clear Description
 * - Bottom Split: Large Green Price (/unit) on Left + Real Photo Cutout on Right
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { ITEM_VISUAL_MAP, CATEGORY_BADGE_STYLES } from '@/constants/scrapItemMedia';
import { ROUTES } from '@/constants/routes';

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
        {/* Top row: 3D Emoji + Category badge */}
        <div className="mb-3 flex items-center justify-between">
          <span className="text-2xl sm:text-3xl filter drop-shadow-sm transition-transform duration-300 group-hover:scale-110">
            {visual.emoji}
          </span>
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

        {/* Description */}
        {description && (
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-on-surface-variant">
            {description}
          </p>
        )}
      </div>

      {/* Bottom split: Large Price on Left + Photo Cutout on Right */}
      <div className="mt-4 flex items-end justify-between gap-3 pt-3 border-t border-outline-variant/10">
        {/* Price display on left */}
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-primary">
              {formatCurrency(pricePerUnit)}
            </span>
            <span className="text-xs font-semibold text-on-surface-variant">/ {unit}</span>
          </div>

          {/* Quick Book Button */}
          <Link
            href={`${ROUTES.BOOK}?item=${slug}`}
            className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:text-primary-container transition-colors"
          >
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Plus className="h-3 w-3" />
            </span>
            <span>Add to Pickup</span>
          </Link>
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
            <div className="flex h-full w-full items-center justify-center text-3xl bg-surface-container-low">
              {visual.emoji}
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
        <div className="mb-4 flex items-center justify-between">
          <div className="h-8 w-8 rounded-full bg-surface-container" />
          <div className="h-5 w-16 rounded-full bg-surface-container" />
        </div>
        <div className="mb-2 h-5 w-3/4 rounded bg-surface-container" />
        <div className="mb-1 h-3 w-full rounded bg-surface-container" />
        <div className="h-3 w-2/3 rounded bg-surface-container" />
      </div>

      <div className="mt-4 flex items-end justify-between border-t border-outline-variant/10 pt-3">
        <div>
          <div className="h-7 w-20 rounded bg-surface-container" />
          <div className="mt-2 h-4 w-16 rounded bg-surface-container" />
        </div>
        <div className="h-20 w-24 sm:h-24 sm:w-28 rounded-xl bg-surface-container" />
      </div>
    </div>
  );
}
