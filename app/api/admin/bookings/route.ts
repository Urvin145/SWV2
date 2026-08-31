/**
 * Admin Bookings List API
 * GET /api/admin/bookings — List bookings with filtering
 *
 * Query params:
 *   ?status=pending,confirmed  (comma-separated)
 *   ?search=booking_number_or_phone
 *   ?from=2026-01-01&to=2026-12-31
 *   ?limit=50&offset=0
 */

import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/services/supabase/admin';
import { createLogger } from '@/lib/logger';
import { sanitizeFilterValue } from '@/lib/utils';

const logger = createLogger('Admin Bookings');

export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    const { searchParams } = new URL(request.url);

    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const limit = parseInt(searchParams.get('limit') ?? '50', 10);
    const offset = parseInt(searchParams.get('offset') ?? '0', 10);

    let query = supabase
      .from('bookings')
      .select(`
        *,
        slot:pickup_slots(id, label, start_time, end_time),
        items:booking_items(
          id,
          estimated_weight,
          actual_weight,
          rate_applied,
          subtotal,
          scrap_item:scrap_items(id, name, slug, unit, category:scrap_categories(name, slug))
        )
      `, { count: 'exact' })
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Status filter
    if (status) {
      const statuses = status.split(',').map((s) => s.trim());
      query = query.in('status', statuses);
    }

    // Search by booking number or phone (sanitized to prevent filter injection)
    if (search) {
      const sanitized = sanitizeFilterValue(search);
      if (sanitized) {
        query = query.or(`booking_number.ilike.%${sanitized}%,customer_phone.ilike.%${sanitized}%,customer_name.ilike.%${sanitized}%`);
      }
    }

    // Date range
    if (from) query = query.gte('pickup_date', from);
    if (to) query = query.lte('pickup_date', to);

    const { data, error, count } = await query;

    if (error) {
      logger.error('Query error', error);
      return NextResponse.json(
        { data: null, error: 'Failed to fetch bookings', success: false },
        { status: 500 },
      );
    }

    return NextResponse.json({
      data,
      total: count,
      error: null,
      success: true,
    });
  } catch (err) {
    logger.error('API error', err);
    return NextResponse.json(
      { data: null, error: 'Internal server error', success: false },
      { status: 500 },
    );
  }
}
