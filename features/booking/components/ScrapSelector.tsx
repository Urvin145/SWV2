/**
 * Step 1: ScrapSelector
 * Category tabs + item cards with checkboxes and weight input.
 * Allows user to select scrap items and estimate weights.
 */

'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useRates } from '@/features/rates/hooks/useRates';
import { useCategories } from '@/features/rates/hooks/useCategories';
import { useBookingStore, type SelectedScrapItem } from '@/features/booking/store/bookingStore';
import { formatCurrency } from '@/lib/utils';
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
  const { selectedItems, addItem, removeItem, updateItemWeight, estimatedValue, nextStep } = useBookingStore();

  const allCats = useMemo(() => [{ slug: 'all', name: 'All' }, ...categories], [categories]);

  const isSelected = (id: string) => selectedItems.some((i) => i.scrap_item_id === id);
  const getItem = (id: string) => selectedItems.find((i) => i.scrap_item_id === id);

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

      {/* Items grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {ratesLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-xl bg-surface-container" />
            ))
          : rates.map((rate) => {
              const selected = isSelected(rate.id);
              const item = getItem(rate.id);
              const emoji = itemEmoji[rate.slug] ?? categoryEmoji[rate.category.slug] ?? '📦';
              const price = rate.rates[0]?.price_per_unit ?? 0;

              return (
                <motion.div
                  key={rate.id}
                  layout
                  className={cn(
                    'rounded-xl border-2 p-4 transition-all',
                    selected
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-outline-variant/15 bg-surface-container-lowest hover:border-outline-variant/30',
                  )}
                >
                  <div className="flex items-center justify-between">
                    {/* Item info */}
                    <button
                      onClick={() => handleToggle(rate)}
                      className="flex flex-1 items-center gap-3 text-left"
                    >
                      <span className="text-2xl">{emoji}</span>
                      <div>
                        <p className="font-semibold text-on-surface">{rate.name}</p>
                        <p className="text-sm text-primary font-medium">
                          {formatCurrency(price)}/{rate.unit}
                        </p>
                      </div>
                    </button>

                    {/* Checkbox / add button */}
                    <div
                      onClick={() => handleToggle(rate)}
                      className={cn(
                        'flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border-2 transition-all',
                        selected
                          ? 'border-primary bg-primary text-on-primary'
                          : 'border-outline-variant text-transparent hover:border-primary/50',
                      )}
                    >
                      {selected && <span className="text-xs font-bold">✓</span>}
                    </div>
                  </div>

                  {/* Weight control (shown when selected) */}
                  <AnimatePresence>
                    {selected && item && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-3 flex items-center justify-between border-t border-outline-variant/15 pt-3">
                          <span className="text-xs text-on-surface-variant">Est. weight</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateItemWeight(rate.id, Math.max(0.5, item.estimated_weight - 0.5))}
                              className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <input
                              type="number"
                              min="0.5"
                              step="0.5"
                              value={item.estimated_weight}
                              onChange={(e) => updateItemWeight(rate.id, Math.max(0.5, parseFloat(e.target.value) || 0.5))}
                              className="w-16 rounded-lg border border-outline-variant/20 bg-surface-container-lowest px-2 py-1.5 text-center text-sm font-medium text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
                            />
                            <button
                              onClick={() => updateItemWeight(rate.id, item.estimated_weight + 0.5)}
                              className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                            <span className="text-xs text-on-surface-variant">{rate.unit}</span>
                          </div>
                          <span className="min-w-[60px] text-right text-sm font-bold text-primary">
                            {formatCurrency(item.estimated_weight * item.rate_applied)}
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
      </div>

      {/* Bottom bar: selected count + estimated value + next */}
      <div className="mt-8 flex flex-col gap-4 rounded-xl border border-outline-variant/15 bg-surface-container-lowest p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-on-surface-variant">
            <strong className="text-on-surface">{selectedItems.length}</strong> item{selectedItems.length !== 1 ? 's' : ''} selected
          </p>
          {estimatedValue > 0 && (
            <p className="text-lg font-bold text-primary">
              Estimated: {formatCurrency(estimatedValue)}
            </p>
          )}
        </div>
        <button
          onClick={nextStep}
          disabled={selectedItems.length === 0}
          className={cn(
            'flex items-center justify-center gap-2 rounded-xl px-8 py-3 text-sm font-semibold transition-all',
            selectedItems.length > 0
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
