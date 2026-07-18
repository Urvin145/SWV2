/**
 * useSlots Hook
 * TanStack Query hook for fetching available pickup slots for a date.
 */

import { useQuery } from '@tanstack/react-query';
import { fetchSlots, type SlotWithAvailability } from '@/features/booking/services/bookingService';

export function useSlots(date: string | null) {
  return useQuery<SlotWithAvailability[]>({
    queryKey: ['slots', date],
    queryFn: () => fetchSlots(date!),
    enabled: !!date,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}
