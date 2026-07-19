/**
 * Step 1: ScrapSelector
 * Category tabs + item cards with checkboxes (select only, no weight input).
 * Plus an approx price range picker at the bottom.
 */

'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, IndianRupee } from 'lucide-react';
import { useRates } from '@/features/rates/hooks/useRates';
import { useCategories } from '@/features/rates/hooks/useCategories';
import { useBookingStore, type SelectedScrapItem, WEIGHT_RANGES } from '@/features/booking/store/bookingStore';
import { cn } from '@/lib/utils';

/** Item-specific emoji mapping */
const itemEmoji: Record<string, string> = {
  newspaper: '📰', cardboard: '📦', 'magazines-books': '📚', 'office-paper': '📄',
  'pet-bottles': '🍶', 'hdpe-containers': '🧴', 'hard-plastic': '🪣', 'plastic-mix': '♻️',
  iron: '⚙️', copper: '🔩', aluminium: '🥫', steel: '🔧', brass: '🔔',
  'laptops-computers': '💻', 'mobile-phones': '📱', 'wires-cables': '🔌', batteries: '🔋',
  'glass-bottles': '🍾', 'window-glass': '🪟', 'old-clothes': '👕', 'tyres-rubber': '🛞',
};

const categoryEmoji: Record<string, string> = {
  all: '📋', paper: '📰', plastic: '♻️', metal: '⚙️', 'e-waste': '💻', glass: '🪟', others: '📦',
};

export function ScrapSelector() {
  const [activeCategory, setActiveCategory] = useState('all');
  const { data: rates = [], isLoading: ratesLoading } = useRates(activeCategory);
  const { data: categories = [], isLoading: catsLoading } = useCategories();
  const { selectedItems, addItem, removeItem, weightRange, setWeightRange, nextStep } = useBookingStore();

  const allCats = useMemo(() => [{ slug: 'all', name: 'All' }, ...categories], [categories]);

  const isSelected = (id: string) => selectedItems.some((i) => i.scrap_item_id === id);

  const handleToggle = (rate: typeof rates[0]) => {
    if (isSelected(rate.id)) {
      removeItem(rate.id);
    } else {
      const item: SelectedScrapItem = {
        scrap_item_id: rate.id,
        name: rate.name,
        slug: rate.slug,
        categoryName: rate.category.name,
        unit: rate.unit,
        estimated_weight: 1,
        rate_applied: rate.rates[0]?.price_per_unit ?? 0,
        emoji: itemEmoji[rate.slug] ?? categoryEmoji[rate.category.slug] ?? '📦',
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
              <div key={i} className="h-9 w-20 shrink-0 animate-pulse rounded-full bg-surface-container" />
            ))
          : allCats.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setActiveCategory(cat.slug)}
                className={cn(
                  'flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-all',
                  activeCategory === cat.slug
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container',
                )}
              >
                <span>{categoryEmoji[cat.slug] ?? '📦'}</span>
                {cat.name}
              </button>
            ))}
      </div>

      {/* Items grid — select only, no weight input */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {ratesLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-xl bg-surface-container" />
            ))
          : rates.map((rate) => {
              const selected = isSelected(rate.id);
              const emoji = itemEmoji[rate.slug] ?? categoryEmoji[rate.category.slug] ?? '📦';
              const price = rate.rates[0]?.price_per_unit ?? 0;

              return (
                <motion.button
                  key={rate.id}
                  layout
                  type="button"
                  onClick={() => handleToggle(rate)}
                  className={cn(
                    'flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-all',
                    selected
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-outline-variant/15 bg-surface-container-lowest hover:border-outline-variant/30',
                  )}
                >
                  {/* Emoji */}
                  <span className="text-2xl">{emoji}</span>

                  {/* Item info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-on-surface">{rate.name}</p>
                    <p className="text-xs text-on-surface-variant">
                      ₹{price}/{rate.unit}
                    </p>
                  </div>

                  {/* Checkbox */}
                  <div
                    className={cn(
                      'flex h-7 w-7 shrink-0 items-center justify-center rounded-md border-2 transition-all',
                      selected
                        ? 'border-primary bg-primary text-on-primary'
                        : 'border-outline-variant text-transparent',
                    )}
                  >
                    {selected && <Check className="h-4 w-4" />}
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
                  {item.emoji} {item.name}
                  <button
                    type="button"
                    onClick={() => removeItem(item.scrap_item_id)}
                    className="ml-0.5 rounded-full p-0.5 hover:bg-primary/20 transition"
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
            <div className="rounded-xl border border-outline-variant/15 bg-surface-container-lowest p-5">
              <div className="mb-4 flex items-center gap-2">
                <IndianRupee className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold text-on-surface">
                  Approximate Weight of Your Scrap
                </h3>
              </div>
              <p className="mb-4 text-xs text-on-surface-variant">
                Select an estimated weight range. This helps us send the right pickup vehicle.
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
                        'rounded-xl border-2 px-3 py-3 text-sm font-medium transition-all text-center',
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
      <div className="mt-8 flex flex-col gap-4 rounded-xl border border-outline-variant/15 bg-surface-container-lowest p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-on-surface-variant">
            <strong className="text-on-surface">{selectedItems.length}</strong> item{selectedItems.length !== 1 ? 's' : ''} selected
          </p>
          {weightRange && (
            <p className="text-sm font-semibold text-primary">
              Approx: {weightRange.label}
            </p>
          )}
        </div>
        <button
          onClick={nextStep}
          disabled={!canProceed}
          className={cn(
            'flex items-center justify-center gap-2 rounded-xl px-8 py-3 text-sm font-semibold transition-all',
            canProceed
              ? 'bg-primary text-on-primary shadow-md shadow-primary/20 hover:bg-primary-container'
              : 'cursor-not-allowed bg-surface-container text-on-surface-variant',
          )}
        >
          Next: Schedule
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
