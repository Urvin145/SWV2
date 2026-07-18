/**
 * Admin Booking Status Update API
 * PATCH /api/admin/bookings/[id]/status
 *
 * Body: { status: 'confirmed' | 'scheduled' | 'cancelled', notes?: string }
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/services/supabase/server';

const VALID_TRANSITIONS: Record<string, string[]> = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['scheduled', 'cancelled'],
  scheduled: ['completed', 'cancelled'],
};

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: bookingId } = await params;
    const supabase = await createClient();
    const body = await request.json();
    const { status, notes } = body as { status: string; notes?: string };

    if (!status) {
      return NextResponse.json(
        { data: null, error: 'Status is required', success: false },
        { status: 400 },
      );
    }

    // Get current booking
    const { data: booking, error: bErr } = await supabase
      .from('bookings')
      .select('id, status')
      .eq('id', bookingId)
      .is('deleted_at', null)
      .single();

    if (bErr || !booking) {
      return NextResponse.json(
        { data: null, error: 'Booking not found', success: false },
        { status: 404 },
      );
    }

    // Validate transition
    const allowed = VALID_TRANSITIONS[booking.status];
    if (!allowed || !allowed.includes(status)) {
      return NextResponse.json(
        {
          data: null,
          error: `Cannot transition from '${booking.status}' to '${status}'`,
          success: false,
        },
        { status: 400 },
      );
    }

    // Build update payload
    const updatePayload: Record<string, unknown> = { status };
    if (status === 'confirmed') updatePayload.confirmed_at = new Date().toISOString();
    if (status === 'cancelled') {
      updatePayload.cancelled_at = new Date().toISOString();
      if (notes) updatePayload.cancellation_reason = notes;
    }

    const { data: updated, error: updateErr } = await supabase
      .from('bookings')
      .update(updatePayload)
      .eq('id', bookingId)
      .select()
      .single();

    if (updateErr) {
      console.error('[Admin Status] Update error:', updateErr);
      return NextResponse.json(
        { data: null, error: 'Failed to update status', success: false },
        { status: 500 },
      );
    }

    console.log(`[Admin Status] Booking ${bookingId}: ${booking.status} → ${status}`);
    return NextResponse.json({ data: updated, error: null, success: true });
  } catch (err) {
    console.error('[Admin Status] API error:', err);
    return NextResponse.json(
      { data: null, error: 'Internal server error', success: false },
      { status: 500 },
    );
  }
}
