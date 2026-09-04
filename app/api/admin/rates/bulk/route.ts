/**
 * Admin Rates Bulk Update API
 * POST /api/admin/rates/bulk
 *
 * Updates prices for multiple scrap items at once from an Excel / CSV upload.
 * Body: {
 *   updates: Array<{
 *     scrap_item_id: string;
 *     price_per_unit: number;
 *     city?: string;
 *   }>
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/services/supabase/admin';
import { createLogger } from '@/lib/logger';

const logger = createLogger('Admin Rates Bulk');

export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    const body = await request.json();
    const { updates } = body as {
      updates: Array<{
        scrap_item_id: string;
        price_per_unit: number;
        city?: string;
      }>;
    };

    if (!updates || !Array.isArray(updates) || updates.length === 0) {
      return NextResponse.json(
        { data: null, error: 'No valid rate updates provided', success: false },
        { status: 400 },
      );
    }

    let updatedCount = 0;
    const now = new Date().toISOString();
    const errors: string[] = [];

    for (const u of updates) {
      const price = Number(u.price_per_unit);
      if (isNaN(price) || price < 0) {
        errors.push(`Invalid price for item ${u.scrap_item_id}`);
        continue;
      }

      // 1. Try to update the existing current rate row in place
      const { data: updatedCurrent, error: updateCurrentErr } = await supabase
        .from('scrap_rates')
        .update({
          price_per_unit: price,
          effective_from: now,
          is_current: true,
        })
        .eq('scrap_item_id', u.scrap_item_id)
        .eq('is_current', true)
        .select('id');

      if (!updateCurrentErr && updatedCurrent && updatedCurrent.length > 0) {
        updatedCount++;
        continue;
      }

      // 2. If no current rate found, update the most recent rate for this item and reactivate it
      const { data: updatedAny, error: updateAnyErr } = await supabase
        .from('scrap_rates')
        .update({
          price_per_unit: price,
          effective_from: now,
          is_current: true,
        })
        .eq('scrap_item_id', u.scrap_item_id)
        .select('id');

      if (!updateAnyErr && updatedAny && updatedAny.length > 0) {
        updatedCount++;
        continue;
      }

      // 3. Fallback: if no rate record exists at all for this scrap item, attempt INSERT
      const { error: insertErr } = await supabase
        .from('scrap_rates')
        .insert({
          scrap_item_id: u.scrap_item_id,
          price_per_unit: price,
          city: u.city || 'Bangalore',
          is_current: true,
          effective_from: now,
        });

      if (!insertErr) {
        updatedCount++;
      } else {
        const errorDetail = insertErr.message || updateCurrentErr?.message || updateAnyErr?.message || 'Database update failed';
        logger.error(`Failed to update or insert rate for ${u.scrap_item_id}`, { error: errorDetail });
        errors.push(errorDetail);
      }
    }

    logger.info(`Bulk updated ${updatedCount} scrap rates. (Errors: ${errors.length})`);

    const hasSuccess = updatedCount > 0;
    const finalError = !hasSuccess && errors.length > 0 ? errors[0] : null;

    return NextResponse.json({
      data: { updatedCount, errors },
      error: finalError,
      success: hasSuccess,
    });
  } catch (err: any) {
    logger.error('Bulk update API error', { error: err?.message });
    return NextResponse.json(
      { data: null, error: err?.message || 'Internal server error', success: false },
      { status: 500 },
    );
  }
}
