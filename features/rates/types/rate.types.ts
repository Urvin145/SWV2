/**
 * Rate Types
 * TypeScript type definitions for the scrap rates feature.
 */

/** Scrap category from the database */
export interface ScrapCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon_url: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/** Individual scrap item within a category */
export interface ScrapItem {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  unit: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

/** Current rate for a scrap item */
export interface ScrapRate {
  id: string;
  scrap_item_id: string;
  price_per_unit: number;
  city: string;
  effective_from: string;
  effective_to: string | null;
  is_current: boolean;
  created_at: string;
  updated_by: string | null;
}

/** Joined view: scrap item with its current rate and category */
export interface ScrapItemWithRate {
  item: ScrapItem;
  rate: ScrapRate;
  category: ScrapCategory;
}
