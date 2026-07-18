/**
 * useCreateBooking Hook
 * TanStack Query mutation for creating a new booking.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBooking, type CreateBookingPayload, type BookingResult } from '@/features/booking/services/bookingService';

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation<BookingResult, Error, CreateBookingPayload>({
    mutationFn: createBooking,
    onSuccess: () => {
      // Invalidate slots cache (capacity may have changed)
      queryClient.invalidateQueries({ queryKey: ['slots'] });
    },
  });
}
