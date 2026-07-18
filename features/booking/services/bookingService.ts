/**
 * Booking Service
 * Supabase operations for creating bookings and fetching slots.
 */

import { createClient } from '@/services/supabase/client';
import type { SelectedScrapItem, ScheduleData, CustomerData } from '@/features/booking/store/bookingStore';

export interface SlotWithAvailability {
  id: string;
  start_time: string;
  end_time: string;
  label: string;
  max_bookings_per_day: number;
  is_active: boolean;
  booked_count: number;
  remaining: number;
  is_available: boolean;
}

export interface CreateBookingPayload {
  customer: CustomerData;
  schedule: ScheduleData;
  items: SelectedScrapItem[];
}

export interface BookingResult {
  id: string;
  booking_number: string;
  status: string;
  estimated_value: number;
  created_at: string;
}

/**
 * Fetch available pickup slots for a specific date.
 */
export async function fetchSlots(date: string): Promise<SlotWithAvailability[]> {
  const response = await fetch(`/api/slots?date=${date}`);
  const json = await response.json();

  if (!json.success) {
    throw new Error(json.error || 'Failed to fetch slots');
  }

  return json.data;
}

/**
 * Create a new booking via the API.
 */
export async function createBooking(payload: CreateBookingPayload): Promise<BookingResult> {
  const body = {
    customer_name: payload.customer.customer_name,
    customer_phone: payload.customer.customer_phone,
    address_line_1: payload.customer.address_line_1,
    address_line_2: payload.customer.address_line_2 || undefined,
    city: payload.customer.city,
    state: payload.customer.state,
    pincode: payload.customer.pincode,
    slot_id: payload.schedule.slot_id,
    pickup_date: payload.schedule.pickup_date,
    customer_notes: payload.customer.customer_notes || undefined,
    items: payload.items.map((item) => ({
      scrap_item_id: item.scrap_item_id,
      estimated_weight: item.estimated_weight,
      rate_applied: item.rate_applied,
    })),
  };

  const response = await fetch('/api/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const json = await response.json();

  if (!json.success) {
    throw new Error(json.error || 'Failed to create booking');
  }

  return json.data;
}

/**
 * Upload a scrap photo to Supabase Storage.
 */
export async function uploadScrapPhoto(file: File): Promise<string> {
  const supabase = createClient();
  const ext = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { data, error } = await supabase.storage
    .from('scrap-photos')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    throw new Error('Failed to upload photo');
  }

  const { data: urlData } = supabase.storage.from('scrap-photos').getPublicUrl(data.path);

  return urlData.publicUrl;
}
