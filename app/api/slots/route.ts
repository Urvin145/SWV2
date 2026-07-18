/**
 * Slots API Route Handler
 * GET /api/slots?date=YYYY-MM-DD — Fetch available pickup slots for a date
 * Checks capacity (max_bookings_per_day) against existing bookings.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/services/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (!date) {
      return NextResponse.json(
        { data: null, error: 'date parameter is required (YYYY-MM-DD)', success: false },
        { status: 400 },
      );
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return NextResponse.json(
        { data: null, error: 'Invalid date format. Use YYYY-MM-DD', success: false },
        { status: 400 },
      );
    }

    // Fetch all active slots
    const { data: slots, error: slotsError } = await supabase
      .from('pickup_slots')
      .select('*')
      .eq('is_active', true)
      .order('start_time', { ascending: true });

    if (slotsError) {
      console.error('Slots fetch error:', slotsError);
      return NextResponse.json(
        { data: null, error: 'Failed to fetch slots', success: false },
        { status: 500 },
      );
    }

    // Count existing bookings for each slot on the given date
    const { data: bookingCounts, error: countError } = await supabase
      .from('bookings')
      .select('slot_id')
      .eq('pickup_date', date)
      .is('deleted_at', null)
      .not('status', 'eq', 'cancelled');

    if (countError) {
      console.error('Booking count error:', countError);
      return NextResponse.json(
        { data: null, error: 'Failed to check availability', success: false },
        { status: 500 },
      );
    }

    // Count bookings per slot
    const countMap = new Map<string, number>();
    bookingCounts?.forEach((b) => {
      countMap.set(b.slot_id, (countMap.get(b.slot_id) || 0) + 1);
    });

    // Add availability info to each slot
    const slotsWithAvailability = slots?.map((slot) => ({
      ...slot,
      booked_count: countMap.get(slot.id) || 0,
      remaining: slot.max_bookings_per_day - (countMap.get(slot.id) || 0),
      is_available: (countMap.get(slot.id) || 0) < slot.max_bookings_per_day,
    }));

    return NextResponse.json({ data: slotsWithAvailability, error: null, success: true });
  } catch (err) {
    console.error('Slots API error:', err);
    return NextResponse.json(
      { data: null, error: 'Internal server error', success: false },
      { status: 500 },
    );
  }
}
