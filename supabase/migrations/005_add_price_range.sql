-- ============================================================================
-- Scrapwala — Migration: Add estimated price range columns to bookings
-- 
-- Adds 3 columns to store the user-selected approximate price range:
--   estimated_price_range  TEXT     (display label, e.g. "₹500 – ₹1,000")
--   estimated_price_min    DECIMAL  (range lower bound)
--   estimated_price_max    DECIMAL  (range upper bound)
-- ============================================================================

ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS estimated_price_range TEXT,
  ADD COLUMN IF NOT EXISTS estimated_price_min   DECIMAL(10,2),
  ADD COLUMN IF NOT EXISTS estimated_price_max   DECIMAL(10,2);
