/**
 * Admin Complete Pickup API
 * POST /api/admin/bookings/[id]/complete
 *
 * Records actual weights for each booking item, calculates final payout,
 * and transitions the booking status to 'completed'.
 *
 * Body: { items: [{ booking_item_id, actual_weight }] }
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/services/supabase/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: bookingId } = await params;
    const supabase = await createClient();
    const body = await request.json();
    const { items } = body as { items: { booking_item_id: string; actual_weight: number }[] };

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { data: null, error: 'Items array with actual weights is required', success: false },
        { status: 400 },
      );
    }

    // Verify booking exists and isn't already completed
    const { data: booking, error: bErr } = await supabase
      .from('bookings')
      .select('id, status')
      .eq('id', bookingId)
      .is('deleted_at', null)
      .single();

    if (bErr || !booking) {
      console.error('[Admin Complete] Booking not found:', bErr);
      return NextResponse.json(
        { data: null, error: 'Booking not found', success: false },
        { status: 404 },
      );
    }

    if (booking.status === 'completed') {
      return NextResponse.json(
        { data: null, error: 'Booking is already completed', success: false },
        { status: 400 },
      );
    }

    if (booking.status === 'cancelled') {
      return NextResponse.json(
        { data: null, error: 'Cannot complete a cancelled booking', success: false },
        { status: 400 },
      );
    }

    // Update each booking item with actual weight and recalculate subtotal
    let totalActualValue = 0;
    let totalWeight = 0;

    for (const item of items) {
      // Get the rate_applied for this item
      const { data: bItem } = await supabase
        .from('booking_items')
        .select('id, rate_applied')
        .eq('id', item.booking_item_id)
        .eq('booking_id', bookingId)
        .single();

      if (!bItem) continue;

      const actualWeight = item.actual_weight;
      const subtotal = actualWeight * parseFloat(bItem.rate_applied);
      totalActualValue += subtotal;
      totalWeight += actualWeight;

      await supabase
        .from('booking_items')
        .update({
          actual_weight: actualWeight,
          subtotal,
        })
        .eq('id', item.booking_item_id);
    }

    // Update the booking itself
    const { data: updated, error: updateErr } = await supabase
      .from('bookings')
      .update({
        status: 'completed',
        actual_value: totalActualValue,
        weight_total: totalWeight,
        completed_at: new Date().toISOString(),
      })
      .eq('id', bookingId)
      .select()
      .single();

    if (updateErr) {
      console.error('[Admin Complete] Update error:', updateErr);
      return NextResponse.json(
        { data: null, error: 'Failed to complete booking', success: false },
        { status: 500 },
      );
    }

    console.log(`[Admin Complete] Booking ${bookingId} completed. Value: ₹${totalActualValue}`);
    return NextResponse.json({ data: updated, error: null, success: true });
  } catch (err) {
    console.error('[Admin Complete] API error:', err);
    return NextResponse.json(
      { data: null, error: 'Internal server error', success: false },
      { status: 500 },
    );
  }
}
