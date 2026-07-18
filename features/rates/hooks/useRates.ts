/**
 * useRates Hook
 * TanStack Query hook for fetching scrap rates with category filtering.
 * 5-minute stale time for caching.
 */

import { useQuery } from '@tanstack/react-query';
import { fetchRates, type RateItem } from '@/features/rates/services/rateService';

export function useRates(categorySlug?: string) {
  return useQuery<RateItem[]>({
    queryKey: ['rates', categorySlug ?? 'all'],
    queryFn: () => fetchRates(categorySlug),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes garbage collection
  });
}
