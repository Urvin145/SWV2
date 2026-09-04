/**
 * ScrapCard Component
 * Ultra-rich, immersive rate card with full background photography.
 * Features:
 * - Full card background image with hover zoom
 * - Multi-layer dark vignette & gradient overlay for 100% crystal-clear readability
 * - Frosted glass category badge (Top Right)
 * - Bold white item typography with text shadow
 * - Vibrant glowing emerald price display (Bottom Left)
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
      className="group relative flex h-60 sm:h-64 w-full flex-col justify-between overflow-hidden rounded-2xl sm:rounded-3xl border border-white/15 bg-neutral-900 p-5 sm:p-6 shadow-md transition-all duration-300 hover:border-emerald-400/50 hover:shadow-2xl hover:shadow-emerald-950/40"
    >
      {/* 1. Full-bleed background image with smooth zoom */}
      {!imageError && visual.image ? (
        <Image
          src={visual.image}
          alt={visual.alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-emerald-950 via-neutral-900 to-neutral-950 text-6xl opacity-30">
          {visual.emoji}
        </div>
      )}

      {/* 2. Multi-layer gradient overlays for guaranteed 100% text readability */}
      {/* Top vignette for category badge */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/80 via-black/40 to-transparent z-10" />
      {/* Bottom heavy vignette for title and price */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/95 via-black/75 to-transparent z-10" />
      {/* General contrast tint */}
      <div className="pointer-events-none absolute inset-0 bg-black/20 z-10" />

      {/* 3. Top Row: Frosted Glass Category Badge */}
      <div className="relative z-20 flex items-center justify-end">
        <span className="inline-flex items-center rounded-full border border-white/20 bg-black/45 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300 backdrop-blur-md shadow-sm">
          {visual.badgeLabel || categoryName}
        </span>
      </div>

      {/* 4. Bottom Row: Item Name & Large Glowing Price */}
      <div className="relative z-20 flex flex-col gap-1.5">
        {/* Item name */}
        <h3 className="font-heading text-lg sm:text-xl font-extrabold tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-colors group-hover:text-emerald-300">
          {name}
        </h3>

        {/* Price & Unit */}
        <div className="flex items-baseline gap-1.5 pt-0.5">
          <span className="font-heading text-2xl sm:text-3xl font-black tracking-tight text-emerald-400 drop-shadow-[0_2px_8px_rgba(16,185,129,0.35)]">
            {formatCurrency(pricePerUnit)}
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-white/80 drop-shadow-sm">
            / {unit}
          </span>
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
    <div className="animate-pulse flex h-60 sm:h-64 w-full flex-col justify-between rounded-2xl sm:rounded-3xl border border-outline-variant/15 bg-surface-container-low p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-end">
        <div className="h-5 w-16 rounded-full bg-surface-container" />
      </div>

      <div className="space-y-2">
        <div className="h-6 w-3/4 rounded bg-surface-container" />
        <div className="h-8 w-28 rounded bg-surface-container" />
      </div>
    </div>
  );
}
