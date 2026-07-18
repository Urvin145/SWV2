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
import { createClient } from '@/services/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
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

    // Search by booking number or phone
    if (search) {
      query = query.or(`booking_number.ilike.%${search}%,customer_phone.ilike.%${search}%,customer_name.ilike.%${search}%`);
    }

    // Date range
    if (from) query = query.gte('pickup_date', from);
    if (to) query = query.lte('pickup_date', to);

    const { data, error, count } = await query;

    if (error) {
      console.error('[Admin Bookings] Query error:', error);
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
    console.error('[Admin Bookings] API error:', err);
    return NextResponse.json(
      { data: null, error: 'Internal server error', success: false },
      { status: 500 },
    );
  }
}
