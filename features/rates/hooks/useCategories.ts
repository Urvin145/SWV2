/**
 * useCategories Hook
 * TanStack Query hook for fetching scrap categories.
 * Long stale time since categories rarely change.
 */

import { useQuery } from '@tanstack/react-query';
import { fetchCategories, type Category } from '@/features/rates/services/rateService';

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 15 * 60 * 1000, // 15 minutes — categories change rarely
    gcTime: 30 * 60 * 1000,
  });
}
