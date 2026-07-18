/**
 * Admin Stats API Route Handler
 * GET /api/admin/stats — Aggregate KPI data for the admin dashboard
 *
 * Returns:
 *  - total bookings count (by status)
 *  - estimated revenue from completed bookings
 *  - today's pickups count
 *  - category breakdown
 *  - recent bookings list (last 10)
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/services/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();

    // Fetch all bookings (non-deleted)
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('id, booking_number, customer_name, customer_phone, status, estimated_value, actual_value, weight_total, pickup_date, created_at, slot_id')
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (bookingsError) {
      console.error('[Admin Stats] Bookings query error:', bookingsError);
      return NextResponse.json(
        { data: null, error: 'Failed to fetch bookings', success: false },
        { status: 500 },
      );
    }

    const all = bookings ?? [];

    // --- KPI counters ---
    const totalBookings = all.length;
    const statusCounts: Record<string, number> = {
      pending: 0,
      confirmed: 0,
      scheduled: 0,
      completed: 0,
      cancelled: 0,
    };

    let totalRevenue = 0;
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    let todayPickups = 0;

    for (const b of all) {
      statusCounts[b.status] = (statusCounts[b.status] ?? 0) + 1;
      if (b.status === 'completed') {
        totalRevenue += parseFloat(b.actual_value ?? b.estimated_value ?? '0');
      }
      if (b.pickup_date === today) {
        todayPickups += 1;
      }
    }

    // --- Category breakdown (count of booking_items per category) ---
    const { data: catBreakdown, error: catError } = await supabase
      .from('booking_items')
      .select('scrap_item_id, scrap_items!inner(category_id, scrap_categories!inner(name, slug))');

    let categoryStats: Record<string, number> = {};
    if (!catError && catBreakdown) {
      for (const item of catBreakdown as any[]) {
        const catName = item.scrap_items?.scrap_categories?.name;
        if (catName) {
          categoryStats[catName] = (categoryStats[catName] ?? 0) + 1;
        }
      }
    }

    // --- Recent bookings (latest 10) ---
    const recent = all.slice(0, 10).map((b) => ({
      id: b.id,
      booking_number: b.booking_number,
      customer_name: b.customer_name,
      status: b.status,
      pickup_date: b.pickup_date,
      estimated_value: b.estimated_value,
      created_at: b.created_at,
    }));

    return NextResponse.json({
      data: {
        totalBookings,
        statusCounts,
        totalRevenue,
        todayPickups,
        categoryStats,
        recent,
      },
      error: null,
      success: true,
    });
  } catch (err) {
    console.error('[Admin Stats] API error:', err);
    return NextResponse.json(
      { data: null, error: 'Internal server error', success: false },
      { status: 500 },
    );
  }
}
