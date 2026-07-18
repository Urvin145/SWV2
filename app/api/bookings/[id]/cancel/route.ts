/**
 * Cancel Booking API Route Handler
 * PATCH /api/bookings/[id]/cancel — Cancel a pending or confirmed booking
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/services/supabase/server';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const body = await request.json().catch(() => ({}));
    const reason = body?.reason || 'Cancelled by customer';

    // Fetch current booking to check status
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select('id, status')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (fetchError || !booking) {
      return NextResponse.json(
        { data: null, error: 'Booking not found', success: false },
        { status: 404 },
      );
    }

    // Only allow cancellation of pending or confirmed bookings
    if (!['pending', 'confirmed'].includes(booking.status)) {
      return NextResponse.json(
        {
          data: null,
          error: `Cannot cancel a booking with status "${booking.status}". Only pending or confirmed bookings can be cancelled.`,
          success: false,
        },
        { status: 400 },
      );
    }

    // Update booking status (trigger will auto-set cancelled_at and log the change)
    const { data: updated, error: updateError } = await supabase
      .from('bookings')
      .update({
        status: 'cancelled',
        cancellation_reason: reason,
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Cancel booking error:', updateError);
      return NextResponse.json(
        { data: null, error: 'Failed to cancel booking', success: false },
        { status: 500 },
      );
    }

    return NextResponse.json({ data: updated, error: null, success: true });
  } catch (err) {
    console.error('Cancel API error:', err);
    return NextResponse.json(
      { data: null, error: 'Internal server error', success: false },
      { status: 500 },
    );
  }
}
