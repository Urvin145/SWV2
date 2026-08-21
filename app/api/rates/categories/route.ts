/**
 * Categories API Route Handler
 * GET /api/rates/categories â€” Fetch all active scrap categories
 */

import { NextResponse } from 'next/server';
import { createAdminClient } from '@/services/supabase/admin';

export async function GET() {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('scrap_categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Categories fetch error:', error);
      return NextResponse.json(
        { data: null, error: 'Failed to fetch categories', success: false },
        { status: 500 },
      );
    }

    return NextResponse.json({ data, error: null, success: true });
  } catch (err) {
    console.error('Categories API error:', err);
    return NextResponse.json(
      { data: null, error: 'Internal server error', success: false },
      { status: 500 },
    );
  }
}

