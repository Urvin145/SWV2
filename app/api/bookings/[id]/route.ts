/**
 * Single Booking API Route Handler
 * GET /api/bookings/[id] — Get full booking details with items and status logs
 * PATCH /api/bookings/[id]/cancel — Cancel a booking (handled by separate route)
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/services/supabase/server';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Fetch booking with related data
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select(`
        *,
        slot:pickup_slots(id, label, start_time, end_time)
      `)
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (bookingError || !booking) {
      return NextResponse.json(
        { data: null, error: 'Booking not found', success: false },
        { status: 404 },
      );
    }

    // Fetch booking items with scrap item details
    const { data: items } = await supabase
      .from('booking_items')
      .select(`
        *,
        scrap_item:scrap_items(name, unit, image_url)
      `)
      .eq('booking_id', id);

    // Fetch status logs
    const { data: statusLogs } = await supabase
      .from('booking_status_logs')
      .select('*')
      .eq('booking_id', id)
      .order('created_at', { ascending: true });

    return NextResponse.json({
      data: {
        booking,
        items: items || [],
        statusLogs: statusLogs || [],
      },
      error: null,
      success: true,
    });
  } catch (err) {
    console.error('Booking detail error:', err);
    return NextResponse.json(
      { data: null, error: 'Internal server error', success: false },
      { status: 500 },
    );
  }
}
