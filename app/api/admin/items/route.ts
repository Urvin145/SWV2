/**
 * Admin Items API
 * POST /api/admin/items — Create a new scrap item with an initial rate
 *
 * Body: { category_id, name, description?, unit?, price_per_unit }
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/services/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { category_id, name, description, unit, price_per_unit } = body as {
      category_id: string;
      name: string;
      description?: string;
      unit?: string;
      price_per_unit: number;
    };

    if (!name?.trim()) {
      return NextResponse.json(
        { data: null, error: 'Item name is required', success: false },
        { status: 400 },
      );
    }

    if (!category_id) {
      return NextResponse.json(
        { data: null, error: 'Category is required', success: false },
        { status: 400 },
      );
    }

    if (price_per_unit == null || price_per_unit < 0) {
      return NextResponse.json(
        { data: null, error: 'Valid price is required', success: false },
        { status: 400 },
      );
    }

    // Verify category exists
    const { data: cat } = await supabase
      .from('scrap_categories')
      .select('id')
      .eq('id', category_id)
      .single();

    if (!cat) {
      return NextResponse.json(
        { data: null, error: 'Category not found', success: false },
        { status: 404 },
      );
    }

    // Generate slug
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    // Check duplicate slug
    const { data: existing } = await supabase
      .from('scrap_items')
      .select('id')
      .eq('slug', slug)
      .single();

    if (existing) {
      return NextResponse.json(
        { data: null, error: `Item "${name}" already exists`, success: false },
        { status: 409 },
      );
    }

    // Get max sort_order for this category
    const { data: maxRow } = await supabase
      .from('scrap_items')
      .select('sort_order')
      .eq('category_id', category_id)
      .order('sort_order', { ascending: false })
      .limit(1)
      .single();

    const nextSort = (maxRow?.sort_order ?? 0) + 1;

    // Insert scrap item
    const { data: item, error: itemErr } = await supabase
      .from('scrap_items')
      .insert({
        category_id,
        name: name.trim(),
        slug,
        description: description?.trim() || null,
        unit: unit?.trim() || 'kg',
        sort_order: nextSort,
        is_active: true,
      })
      .select()
      .single();

    if (itemErr) {
      console.error('[Admin Items] Insert error:', itemErr);
      return NextResponse.json(
        { data: null, error: 'Failed to create item', success: false },
        { status: 500 },
      );
    }

    // Insert initial rate
    const { error: rateErr } = await supabase
      .from('scrap_rates')
      .insert({
        scrap_item_id: item.id,
        price_per_unit,
        city: 'Bangalore',
        is_current: true,
        effective_from: new Date().toISOString(),
      });

    if (rateErr) {
      console.error('[Admin Items] Rate insert error:', rateErr);
      // Item was created but rate failed — log but still return success
    }

    console.log(`[Admin Items] Created: ${name} (${slug}) at ₹${price_per_unit}`);
    return NextResponse.json({ data: item, error: null, success: true });
  } catch (err) {
    console.error('[Admin Items] API error:', err);
    return NextResponse.json(
      { data: null, error: 'Internal server error', success: false },
      { status: 500 },
    );
  }
}
