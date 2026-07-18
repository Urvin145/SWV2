/**
 * Admin Categories API
 * POST /api/admin/categories — Create a new scrap category
 *
 * Body: { name, description?, icon_url? }
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/services/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { name, description, icon_url } = body as {
      name: string;
      description?: string;
      icon_url?: string;
    };

    if (!name || !name.trim()) {
      return NextResponse.json(
        { data: null, error: 'Category name is required', success: false },
        { status: 400 },
      );
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    // Check for duplicate slug
    const { data: existing } = await supabase
      .from('scrap_categories')
      .select('id')
      .eq('slug', slug)
      .single();

    if (existing) {
      return NextResponse.json(
        { data: null, error: `Category "${name}" already exists`, success: false },
        { status: 409 },
      );
    }

    // Get max sort_order
    const { data: maxRow } = await supabase
      .from('scrap_categories')
      .select('sort_order')
      .order('sort_order', { ascending: false })
      .limit(1)
      .single();

    const nextSort = (maxRow?.sort_order ?? 0) + 1;

    const { data: category, error: insertErr } = await supabase
      .from('scrap_categories')
      .insert({
        name: name.trim(),
        slug,
        description: description?.trim() || null,
        icon_url: icon_url?.trim() || null,
        sort_order: nextSort,
        is_active: true,
      })
      .select()
      .single();

    if (insertErr) {
      console.error('[Admin Categories] Insert error:', insertErr);
      return NextResponse.json(
        { data: null, error: 'Failed to create category', success: false },
        { status: 500 },
      );
    }

    console.log(`[Admin Categories] Created: ${name} (${slug})`);
    return NextResponse.json({ data: category, error: null, success: true });
  } catch (err) {
    console.error('[Admin Categories] API error:', err);
    return NextResponse.json(
      { data: null, error: 'Internal server error', success: false },
      { status: 500 },
    );
  }
}
