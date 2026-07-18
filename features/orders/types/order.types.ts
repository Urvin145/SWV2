/**
 * Order Types
 * TypeScript type definitions for the orders feature.
 * Re-exports booking types that are shared between features.
 */

export type { Booking, BookingItem, BookingStatusLog } from '@/features/booking/types/booking.types';

/** Order lookup mode */
export type OrderLookupMode = 'phone' | 'booking_number';

/** Order lookup form values */
export interface OrderLookupValues {
  mode: OrderLookupMode;
  value: string;
}

/** Booking with items and status logs — full order detail view */
export interface OrderDetail {
  booking: import('@/features/booking/types/booking.types').Booking;
  items: Array<
    import('@/features/booking/types/booking.types').BookingItem & {
      scrap_item_name: string;
      scrap_item_unit: string;
      scrap_item_image_url: string | null;
    }
  >;
  statusLogs: import('@/features/booking/types/booking.types').BookingStatusLog[];
  slot: import('@/features/booking/types/booking.types').PickupSlot | null;
}
