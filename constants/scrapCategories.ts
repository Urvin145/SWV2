/**
 * Scrap Categories Metadata
 * Static metadata for scrap categories used across the application.
 * Actual data comes from Supabase, but these provide fallback icons and display names.
 */

export const SCRAP_CATEGORY_ICONS = {
  paper: '📰',
  plastic: '♻️',
  metal: '🔩',
  'e-waste': '💻',
  glass: '🪟',
  others: '📦',
} as const;

export type ScrapCategorySlug = keyof typeof SCRAP_CATEGORY_ICONS;
