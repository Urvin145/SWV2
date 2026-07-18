/**
 * Rates API Route Handler
 * GET /api/rates — Fetch all current scrap rates
 * GET /api/rates?category=slug — Filter by category
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/services/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get('category');

    // Build query: join items → rates → categories
    let query = supabase
      .from('scrap_items')
      .select(`
        *,
        category:scrap_categories!inner(id, name, slug, icon_url, image_url),
        rates:scrap_rates!inner(id, price_per_unit, city, effective_from, is_current)
      `)
      .eq('is_active', true)
      .eq('rates.is_current', true)
      .order('sort_order', { ascending: true });

    // Filter by category if provided
    if (categorySlug) {
      query = query.eq('category.slug', categorySlug);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Rates fetch error:', error);
      return NextResponse.json(
        { data: null, error: 'Failed to fetch rates', success: false },
        { status: 500 },
      );
    }

    return NextResponse.json({ data, error: null, success: true });
  } catch (err) {
    console.error('Rates API error:', err);
    return NextResponse.json(
      { data: null, error: 'Internal server error', success: false },
      { status: 500 },
    );
  }
}
