-- ============================================================================
-- Scrapwala — Migration 009: Allow Order Status Updates and Completions
-- 
-- Run this in the Supabase SQL Editor:
-- Enables updating bookings (status changes like pending -> confirmed -> scheduled -> completed)
-- and booking_items (recording weights on completion) when using publishable/anon key.
-- ============================================================================

-- 1. Bookings: Allow status updates and completion updates
DROP POLICY IF EXISTS "anon_update_bookings_cancel" ON public.bookings;
DROP POLICY IF EXISTS "anon_update_bookings" ON public.bookings;

CREATE POLICY "anon_update_bookings"
  ON public.bookings FOR UPDATE
  TO anon, authenticated
  USING (deleted_at IS NULL)
  WITH CHECK (true);

-- 2. Booking Items: Allow updating weights and subtotals when recording weights
DROP POLICY IF EXISTS "anon_update_booking_items" ON public.booking_items;

CREATE POLICY "anon_update_booking_items"
  ON public.booking_items FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- 3. Scrap Rates & Items: Allow updating and inserting rates in admin panel
DROP POLICY IF EXISTS "anon_update_scrap_rates" ON public.scrap_rates;
DROP POLICY IF EXISTS "anon_insert_scrap_rates" ON public.scrap_rates;

CREATE POLICY "anon_update_scrap_rates"
  ON public.scrap_rates FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "anon_insert_scrap_rates"
  ON public.scrap_rates FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_scrap_items" ON public.scrap_items;
DROP POLICY IF EXISTS "anon_insert_scrap_items" ON public.scrap_items;

CREATE POLICY "anon_update_scrap_items"
  ON public.scrap_items FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "anon_insert_scrap_items"
  ON public.scrap_items FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

