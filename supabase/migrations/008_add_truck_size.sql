-- ============================================================================
-- Scrapwala — Migration: Add truck_size column to bookings
-- 
-- Adds column to store the user-selected vehicle / truck size option:
--   truck_size    TEXT     (e.g. "Two-Wheeler / Bike (0 – 10 kg)", "Mini Truck (10 – 100 kg)")
-- ============================================================================

ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS truck_size TEXT;
