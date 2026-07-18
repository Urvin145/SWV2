/**
 * OrdersPageClient Component
 * Client-side orders page with lookup form and results list.
 */

'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { OrderLookup } from './OrderLookup';
import { OrderCard } from './OrderCard';
import { useOrders } from '@/features/orders/hooks/useOrders';
import { EmptyState } from '@/components/common/EmptyState';
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/common/AnimatedSection';

export function OrdersPageClient() {
  const [searchParams, setSearchParams] = useState<{ phone?: string; number?: string } | null>(null);
  const { data: orders = [], isLoading, isError, error } = useOrders(searchParams);

  const hasSearched = searchParams !== null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <AnimatedSection>
        <OrderLookup onSearch={setSearchParams} isLoading={isLoading} />
      </AnimatedSection>

      {/* Results */}
      <div className="mt-8">
        {isLoading && (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-28 animate-pulse rounded-xl bg-surface-container" />
            ))}
          </div>
        )}

        {isError && (
          <div className="rounded-xl border border-error/20 bg-error-container/30 p-4 text-center text-sm text-error">
            {error?.message || 'Failed to fetch orders. Please try again.'}
          </div>
        )}

        {hasSearched && !isLoading && !isError && orders.length === 0 && (
          <EmptyState
            title="No orders found"
            description="We couldn't find any bookings matching your search. Check your phone number or booking number and try again."
          />
        )}

        {orders.length > 0 && (
          <StaggerContainer className="space-y-4" staggerDelay={0.08}>
            <AnimatePresence>
              {orders.map((order) => (
                <StaggerItem key={order.id}>
                  <OrderCard order={order} />
                </StaggerItem>
              ))}
            </AnimatePresence>
          </StaggerContainer>
        )}
      </div>
    </div>
  );
}
