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

      // Mark any existing active rates for this item as expired
      const { error: expireErr } = await supabase
        .from('scrap_rates')
        .update({
          is_current: false,
          effective_to: now,
        })
        .eq('scrap_item_id', u.scrap_item_id)
        .eq('is_current', true);

      if (expireErr) {
        logger.warn(`Failed to expire old rate for ${u.scrap_item_id}`, { error: expireErr.message });
      }

      // Insert new current rate
      const { error: insertErr } = await supabase
        .from('scrap_rates')
        .insert({
          scrap_item_id: u.scrap_item_id,
          price_per_unit: price,
          city: u.city || 'Bangalore',
          is_current: true,
          effective_from: now,
        });

      if (insertErr) {
        logger.error(`Failed to insert new rate for ${u.scrap_item_id}`, { error: insertErr.message });
        errors.push(`Failed to update item ${u.scrap_item_id}`);
      } else {
        updatedCount++;
      }
    }

    logger.info(`Bulk updated ${updatedCount} scrap rates. (Errors: ${errors.length})`);

    return NextResponse.json({
      data: { updatedCount, errors },
      error: errors.length > 0 && updatedCount === 0 ? 'Failed to apply any updates' : null,
      success: updatedCount > 0 || errors.length === 0,
    });
  } catch (err: any) {
    logger.error('Bulk update API error', err);
    return NextResponse.json(
      { data: null, error: err?.message || 'Internal server error', success: false },
      { status: 500 },
    );
  }
}
