/**
 * ScrapCard Component
 * Bright, luminous, light-themed visual rate card with full photography.
 * Features:
 * - Bright, natural full-card photography with smooth hover zoom
 * - Frosted white glassmorphism bottom panel for 100% crystal-clear readability
 * - High-contrast ink typography and rich emerald price display
 * - Floating frosted glass category pill badge (Top Right)
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { formatCurrency } from '@/lib/utils';
import { ITEM_VISUAL_MAP } from '@/constants/scrapItemMedia';

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
}: ScrapCardProps) {
  const [imageError, setImageError] = useState(false);

  // Retrieve media metadata from visual map
  const visual = ITEM_VISUAL_MAP[slug] || {
    emoji: '📦',
    image: '',
    alt: name,
    badgeLabel: categoryName.toUpperCase(),
  };

  return (
    <motion.div
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      className="group relative flex h-64 sm:h-72 w-full flex-col justify-between overflow-hidden rounded-2xl sm:rounded-3xl border border-outline-variant/25 bg-surface-container-lowest p-3 sm:p-3.5 shadow-sm transition-all duration-300 hover:border-primary/50 hover:shadow-xl"
    >
      {/* 1. Full-bleed bright photo with smooth hover zoom */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl sm:rounded-3xl bg-surface-container-low">
        {!imageError && visual.image ? (
          <Image
            src={visual.image}
            alt={visual.alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-emerald-50 text-5xl">
            {visual.emoji}
          </div>
        )}

        {/* Subtle light ambient overlay for visual depth */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-black/5" />
      </div>

      {/* 2. Top Row: Frosted Glass Category Pill Badge */}
      <div className="relative z-10 flex items-center justify-end">
        <span className="inline-flex items-center rounded-full border border-white/80 bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-800 shadow-md backdrop-blur-md">
          {visual.badgeLabel || categoryName}
        </span>
      </div>

      {/* 3. Bottom Glassmorphic Card Panel (Luminous Light Theme & Crisp Readability) */}
      <div className="relative z-10 rounded-xl sm:rounded-2xl border border-white/80 bg-white/95 p-3.5 sm:p-4 shadow-lg shadow-black/5 backdrop-blur-md transition-all duration-300 group-hover:bg-white">
        {/* Item Name */}
        <h3 className="font-heading text-base sm:text-lg font-bold tracking-tight text-gray-900 transition-colors group-hover:text-primary">
          {name}
        </h3>

        {/* Price & Unit */}
        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="font-heading text-2xl sm:text-3xl font-black tracking-tight text-primary">
            {formatCurrency(pricePerUnit)}
          </span>
          <span className="text-xs font-semibold text-gray-500">
            / {unit}
          </span>
        </div>
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
    <div className="animate-pulse flex h-64 sm:h-72 w-full flex-col justify-between rounded-2xl sm:rounded-3xl border border-outline-variant/20 bg-surface-container-low p-3 sm:p-3.5 shadow-sm">
      <div className="flex items-center justify-end">
        <div className="h-6 w-16 rounded-full bg-surface-container" />
      </div>

      <div className="rounded-xl bg-surface-container-lowest p-4 space-y-2">
        <div className="h-5 w-3/4 rounded bg-surface-container" />
        <div className="h-7 w-24 rounded bg-surface-container" />
      </div>
    </div>
  );
}
