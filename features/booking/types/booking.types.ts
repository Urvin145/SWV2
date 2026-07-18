/**
 * Booking Types
 * TypeScript type definitions for the booking feature.
 */

import type { BookingStatus } from '@/types/common.types';

/** Pickup time slot from the database */
export interface PickupSlot {
  id: string;
  start_time: string;
  end_time: string;
  label: string;
  max_bookings_per_day: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/** Booking record from the database */
export interface Booking {
  id: string;
  booking_number: string;
  customer_name: string;
  customer_phone: string;
  address_line_1: string;
  address_line_2: string | null;
  city: string;
  state: string;
  pincode: string;
  latitude: number | null;
  longitude: number | null;
  slot_id: string;
  pickup_date: string;
  status: BookingStatus;
  estimated_value: number | null;
  actual_value: number | null;
  weight_total: number | null;
  customer_notes: string | null;
  cancellation_reason: string | null;
  scrap_photo_urls: string | null;
  confirmed_at: string | null;
  completed_at: string | null;
  cancelled_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

/** Individual item within a booking */
export interface BookingItem {
  id: string;
  booking_id: string;
  scrap_item_id: string;
  estimated_weight: number;
  actual_weight: number | null;
  rate_applied: number;
  subtotal: number;
  created_at: string;
}

/** Booking status change log entry */
export interface BookingStatusLog {
  id: string;
  booking_id: string;
  previous_status: BookingStatus | null;
  new_status: BookingStatus;
  notes: string | null;
  created_at: string;
}

/** Booking wizard step state */
export interface BookingWizardState {
  /** Current step (1-4) */
  currentStep: number;
  /** Selected scrap items with estimated weights */
  selectedItems: Array<{
    scrapItemId: string;
    estimatedWeight: number;
    rateApplied: number;
  }>;
  /** Selected pickup date */
  pickupDate: string | null;
  /** Selected slot ID */
  slotId: string | null;
  /** Customer details */
  customerName: string;
  customerPhone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  customerNotes: string;
  /** Photo URLs after upload */
  scrapPhotoUrls: string[];
}

/** Create booking request payload */
export interface CreateBookingPayload {
  customer_name: string;
  customer_phone: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  pincode: string;
  slot_id: string;
  pickup_date: string;
  customer_notes?: string;
  scrap_photo_urls?: string;
  items: Array<{
    scrap_item_id: string;
    estimated_weight: number;
    rate_applied: number;
  }>;
}
