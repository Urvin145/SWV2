/**
 * Rates Service
 * Supabase query functions for fetching scrap rates and categories.
 * Queries API endpoints with direct Supabase fallback.
 * Used by TanStack Query hooks for data fetching and caching across pages.
 */

import { createClient } from '@/services/supabase/client';

export interface RateItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  unit: string;
  sort_order: number;
  category: {
    id: string;
    name: string;
    slug: string;
    icon_url: string | null;
    image_url: string | null;
  };
  rates: {
    id: string;
    price_per_unit: number;
    city: string;
    effective_from: string;
    is_current: boolean;
  }[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon_url: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
}

/**
 * Fetch all active scrap items with their current rates and categories.
 * Optionally filter by category slug.
 */
export async function fetchRates(categorySlug?: string): Promise<RateItem[]> {
  try {
    const isBrowser = typeof window !== 'undefined';
    const baseUrl = isBrowser ? '' : (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000');
    const url =
      categorySlug && categorySlug !== 'all'
        ? `${baseUrl}/api/rates?category=${encodeURIComponent(categorySlug)}`
        : `${baseUrl}/api/rates`;

    const res = await fetch(url, { cache: 'no-store' });
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        return json.data as RateItem[];
      }
    }
  } catch (err) {
    console.warn('API rates fetch failed, falling back to direct database client:', err);
  }

  const supabase = createClient();

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

  if (categorySlug && categorySlug !== 'all') {
    query = query.eq('category.slug', categorySlug);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Failed to fetch rates from database:', error);
    throw new Error('Failed to fetch rates');
  }

  return (data as unknown as RateItem[]) ?? [];
}

/**
 * Fetch all active scrap categories.
 */
export async function fetchCategories(): Promise<Category[]> {
  try {
    const isBrowser = typeof window !== 'undefined';
    const baseUrl = isBrowser ? '' : (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000');
    const res = await fetch(`${baseUrl}/api/rates/categories`, { cache: 'no-store' });
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        return json.data as Category[];
      }
    }
  } catch (err) {
    console.warn('API categories fetch failed, falling back to direct database client:', err);
  }

  const supabase = createClient();

  const { data, error } = await supabase
    .from('scrap_categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Failed to fetch categories from database:', error);
    throw new Error('Failed to fetch categories');
  }

  return (data as Category[]) ?? [];
}
