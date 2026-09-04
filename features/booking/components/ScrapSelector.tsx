/**
 * Step 1: ScrapSelector
 * Visual-first scrap selection with real photography and category filtering.
 * Each item card includes:
 * - Real item photo
 * - Category badge & selection checkmark
 * - Item name & live rate (₹/unit)
 * - Interactive multi-select with instant toggle
 */

'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, IndianRupee } from 'lucide-react';
import { useRates } from '@/features/rates/hooks/useRates';
import { useCategories } from '@/features/rates/hooks/useCategories';
import { useBookingStore, type SelectedScrapItem, WEIGHT_RANGES } from '@/features/booking/store/bookingStore';
import { ITEM_VISUAL_MAP, CATEGORY_BADGE_STYLES } from '@/constants/scrapItemMedia';
import { formatCurrency, cn } from '@/lib/utils';

export function ScrapSelector() {
  const [activeCategory, setActiveCategory] = useState('all');
  const { data: rates = [], isLoading: ratesLoading } = useRates(activeCategory);
  const { data: categories = [], isLoading: catsLoading } = useCategories();
  const { selectedItems, addItem, removeItem, weightRange, setWeightRange, nextStep } = useBookingStore();

  const allCats = useMemo(() => [{ slug: 'all', name: 'All Categories' }, ...categories], [categories]);

  const isSelected = (id: string) => selectedItems.some((i) => i.scrap_item_id === id);

  const handleToggle = (rate: typeof rates[0]) => {
    if (isSelected(rate.id)) {
      removeItem(rate.id);
    } else {
      const visual = ITEM_VISUAL_MAP[rate.slug];
      const item: SelectedScrapItem = {
        scrap_item_id: rate.id,
        name: rate.name,
        slug: rate.slug,
        categoryName: rate.category.name,
        unit: rate.unit,
        estimated_weight: 1,
        rate_applied: rate.rates[0]?.price_per_unit ?? 0,
        emoji: visual?.emoji ?? '📦',
      };
      addItem(item);
    }
  };

  const canProceed = selectedItems.length > 0 && weightRange !== null;

  return (
    <div>
      {/* Category tabs */}
      <div className="scrollbar-hide -mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
        {catsLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-9 w-24 shrink-0 animate-pulse rounded-full bg-surface-container" />
            ))
          : allCats.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setActiveCategory(cat.slug)}
                className={cn(
                  'flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all',
                  activeCategory === cat.slug
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container hover:text-on-surface border border-outline-variant/20',
                )}
              >
                {cat.name}
              </button>
            ))}
      </div>

      {/* Items Grid with Real Photography */}
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4 sm:gap-4">
        {ratesLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-56 animate-pulse rounded-2xl bg-surface-container-low border border-outline-variant/15 p-4" />
            ))
          : rates.map((rate) => {
              const selected = isSelected(rate.id);
              const price = rate.rates[0]?.price_per_unit ?? 0;
              const visual = ITEM_VISUAL_MAP[rate.slug] || {
                emoji: '📦',
                image: '',
                alt: rate.name,
                badgeLabel: rate.category.name.toUpperCase(),
              };

              const badgeClass =
                CATEGORY_BADGE_STYLES[rate.category.slug] ||
                'bg-surface-container text-on-surface-variant border-outline-variant/30';

              return (
                <motion.button
                  key={rate.id}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => handleToggle(rate)}
                  className={cn(
                    'group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border-2 p-3 sm:p-4 text-left transition-all duration-200',
                    selected
                      ? 'border-primary bg-primary/5 ring-2 ring-primary/20 shadow-md'
                      : 'border-outline-variant/20 bg-surface-container-lowest hover:border-primary/40 hover:shadow-md',
                  )}
                >
                  {/* Top Bar: Category Badge + Selection Checkmark */}
                  <div className="mb-2.5 flex items-center justify-between gap-1 w-full">
                    <span
                      className={cn(
                        'rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider',
                        badgeClass,
                      )}
                    >
                      {visual.badgeLabel || rate.category.name}
                    </span>

                    {/* Circular Checkbox */}
                    <div
                      className={cn(
                        'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all',
                        selected
                          ? 'border-primary bg-primary text-on-primary scale-105'
                          : 'border-outline-variant/40 bg-surface-container-low text-transparent group-hover:border-primary/50',
                      )}
                    >
                      {selected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                    </div>
                  </div>

                  {/* Middle: Clean Cut-out Image */}
                  <div className="relative mb-3 h-28 w-full overflow-hidden rounded-xl bg-surface-container-low/40">
                    {visual.image ? (
                      <Image
                        src={visual.image}
                        alt={visual.alt}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-108"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-3xl">
                        {visual.emoji}
                      </div>
                    )}
                  </div>

                  {/* Bottom: Item Name & Price */}
                  <div className="w-full">
                    <p className="font-heading text-sm sm:text-base font-bold text-on-surface truncate group-hover:text-primary transition-colors">
                      {rate.name}
                    </p>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="font-heading text-base sm:text-lg font-black text-primary">
                        {formatCurrency(price)}
                      </span>
                      <span className="text-[11px] font-semibold text-on-surface-variant">
                        / {rate.unit}
                      </span>
                    </div>
                  </div>
                </motion.button>
              );
            })}
      </div>

      {/* Selected items summary chips */}
      <AnimatePresence>
        {selectedItems.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-6 overflow-hidden"
          >
            <p className="mb-2 text-xs font-medium text-on-surface-variant">Selected items:</p>
            <div className="flex flex-wrap gap-2">
              {selectedItems.map((item) => (
                <span
                  key={item.scrap_item_id}
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary"
                >
                  <span>{item.emoji}</span>
                  <span className="font-semibold">{item.name}</span>
                  <button
                    type="button"
                    onClick={() => removeItem(item.scrap_item_id)}
                    className="ml-0.5 rounded-full p-0.5 hover:bg-primary/20 transition text-sm leading-none"
                    aria-label={`Remove ${item.name}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Approx Price Range Picker */}
      <AnimatePresence>
        {selectedItems.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-6 overflow-hidden"
          >
            <div className="rounded-2xl border border-outline-variant/15 bg-surface-container-lowest p-5 sm:p-6 shadow-sm">
              <div className="mb-3 flex items-center gap-2">
                <IndianRupee className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-bold text-on-surface">
                  Approximate Weight of Your Scrap
                </h3>
              </div>
              <p className="mb-4 text-xs text-on-surface-variant">
                Select an estimated weight range. This helps us dispatch the right pickup mini-tempo vehicle.
              </p>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {WEIGHT_RANGES.map((range) => {
                  const isActive = weightRange?.label === range.label;
                  return (
                    <button
                      key={range.label}
                      type="button"
                      onClick={() => setWeightRange(isActive ? null : { ...range })}
                      className={cn(
                        'rounded-xl border-2 px-3 py-3 text-xs sm:text-sm font-semibold transition-all text-center',
                        isActive
                          ? 'border-primary bg-primary/10 text-primary shadow-sm'
                          : 'border-outline-variant/20 bg-surface-container text-on-surface-variant hover:border-primary/30 hover:text-on-surface',
                      )}
                    >
                      {range.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom bar: selected count + next */}
      <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-outline-variant/15 bg-surface-container-lowest p-5 sm:flex-row sm:items-center sm:justify-between shadow-sm">
        <div>
          <p className="text-sm text-on-surface-variant">
            <strong className="text-on-surface text-base">{selectedItems.length}</strong> item{selectedItems.length !== 1 ? 's' : ''} selected
          </p>
          {weightRange && (
            <p className="text-sm font-bold text-primary">
              Estimated Load: {weightRange.label}
            </p>
          )}
        </div>
        <button
          onClick={nextStep}
          disabled={!canProceed}
          className={cn(
            'flex items-center justify-center gap-2 rounded-xl px-8 py-3.5 text-sm font-semibold transition-all shadow-md',
            canProceed
              ? 'bg-primary text-on-primary shadow-primary/25 hover:bg-primary-container hover:shadow-lg'
              : 'cursor-not-allowed bg-surface-container text-on-surface-variant shadow-none',
          )}
        >
          Next: Schedule Slot
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
