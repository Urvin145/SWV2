/**
 * Admin Rates Update API
 * PATCH /api/admin/rates/[id] — Update scrap item pricing
 *
 * Body: { price_per_unit: number }
 *
 * Marks the old rate as not current, inserts a new rate row.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/services/supabase/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: rateId } = await params;
    const supabase = await createClient();
    const body = await request.json();
    const { price_per_unit } = body as { price_per_unit: number };

    if (price_per_unit == null || price_per_unit < 0) {
      return NextResponse.json(
        { data: null, error: 'Valid price_per_unit is required', success: false },
        { status: 400 },
      );
    }

    // Get the existing rate to find the scrap_item_id
    const { data: existingRate, error: fetchErr } = await supabase
      .from('scrap_rates')
      .select('id, scrap_item_id, price_per_unit, city')
      .eq('id', rateId)
      .single();

    if (fetchErr || !existingRate) {
      console.error('[Admin Rates] Rate not found:', fetchErr);
      return NextResponse.json(
        { data: null, error: 'Rate not found', success: false },
        { status: 404 },
      );
    }

    // Mark old rate as not current
    await supabase
      .from('scrap_rates')
      .update({
        is_current: false,
        effective_to: new Date().toISOString(),
      })
      .eq('id', rateId);

    // Insert new rate
    const { data: newRate, error: insertErr } = await supabase
      .from('scrap_rates')
      .insert({
        scrap_item_id: existingRate.scrap_item_id,
        price_per_unit,
        city: existingRate.city,
        is_current: true,
        effective_from: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertErr) {
      console.error('[Admin Rates] Insert error:', insertErr);
      return NextResponse.json(
        { data: null, error: 'Failed to update rate', success: false },
        { status: 500 },
      );
    }

    console.log(
      `[Admin Rates] Updated item ${existingRate.scrap_item_id}: ₹${existingRate.price_per_unit} → ₹${price_per_unit}`,
    );
    return NextResponse.json({ data: newRate, error: null, success: true });
  } catch (err) {
    console.error('[Admin Rates] API error:', err);
    return NextResponse.json(
      { data: null, error: 'Internal server error', success: false },
      { status: 500 },
    );
  }
}
