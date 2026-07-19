-- ============================================================================
-- Scrapwala — Migration: Add estimated weight range columns to bookings
-- 
-- Adds 3 columns to store the user-selected approximate scrap weight range:
--   estimated_price_range    TEXT     (display label, e.g. "5 – 15 kg")
--   estimated_weight_min     DECIMAL  (range lower bound in kg)
--   estimated_weight_max     DECIMAL  (range upper bound in kg)
-- ============================================================================

ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS estimated_price_range  TEXT,
  ADD COLUMN IF NOT EXISTS estimated_weight_min   DECIMAL(10,2),
  ADD COLUMN IF NOT EXISTS estimated_weight_max   DECIMAL(10,2);
