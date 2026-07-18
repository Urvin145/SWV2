/**
 * RatesPageClient Component
 * Client-side rates explorer with category filtering and search.
 * Fetches data from Supabase via TanStack Query hooks.
 */

'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRates } from '@/features/rates/hooks/useRates';
import { useCategories } from '@/features/rates/hooks/useCategories';
import { CategoryFilter } from './CategoryFilter';
import { SearchBar } from './SearchBar';
import { RateGrid } from './RateGrid';
import { AnimatedSection } from '@/components/common/AnimatedSection';

export function RatesPageClient() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: rates = [], isLoading: ratesLoading } = useRates(activeCategory);
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();

  // Client-side search filtering
  const filteredRates = useMemo(() => {
    if (!searchQuery) return rates;
    const q = searchQuery.toLowerCase();
    return rates.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q) ||
        item.category.name.toLowerCase().includes(q),
    );
  }, [rates, searchQuery]);

  const handleCategoryChange = useCallback((slug: string) => {
    setActiveCategory(slug);
    setSearchQuery('');
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Filters Row */}
      <AnimatedSection>
        <div className="mb-8 space-y-5">
          {/* Category Chips */}
          <CategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
            isLoading={categoriesLoading}
          />

          {/* Search Bar */}
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search by item name, description, or category..."
            className="max-w-md"
          />
        </div>
      </AnimatedSection>

      {/* Results count */}
      {!ratesLoading && (
        <AnimatedSection delay={0.1}>
          <p className="mb-6 text-sm text-on-surface-variant">
            Showing <strong className="text-on-surface">{filteredRates.length}</strong>{' '}
            {filteredRates.length === 1 ? 'item' : 'items'}
            {activeCategory !== 'all' && (
              <>
                {' '}
                in{' '}
                <strong className="text-on-surface">
                  {categories.find((c) => c.slug === activeCategory)?.name}
                </strong>
              </>
            )}
            {searchQuery && (
              <>
                {' '}
                matching &ldquo;<strong className="text-on-surface">{searchQuery}</strong>&rdquo;
              </>
            )}
          </p>
        </AnimatedSection>
      )}

      {/* Rate Cards Grid */}
      <RateGrid items={filteredRates} isLoading={ratesLoading} searchQuery={searchQuery} />

      {/* Bottom info */}
      <AnimatedSection delay={0.3}>
        <div className="mt-12 rounded-xl border border-outline-variant/15 bg-surface-container-low p-6 text-center">
          <p className="text-sm text-on-surface-variant">
            💡 Rates are based on current Bangalore market prices and are updated regularly.
            Actual payment depends on quality and quantity of scrap collected.
          </p>
        </div>
      </AnimatedSection>
    </div>
  );
}
