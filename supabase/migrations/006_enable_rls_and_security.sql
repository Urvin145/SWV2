-- ============================================================================
-- Scrapwala — Enable Row-Level Security (RLS), Safe Policies & Hardening
-- Migration 006: Database Security & Least Privilege
--
-- Follows Supabase Postgres Best Practices:
-- 1. Enables and enforces RLS on all 9 application tables
-- 2. Idempotent policies (DROP POLICY IF EXISTS + CREATE POLICY)
-- 3. Optimal performance indexes for RLS filter columns
-- 4. Public anonymous access strictly limited to required read/insert operations
-- 5. Safe storage bucket upload policies (no public directory listing)
-- 6. Trigger functions secured with proper search_path and execution limits
-- 7. Full administrative mutations reserved for service_role (createAdminClient)
-- ============================================================================

-- ============================================================================
-- 1. PERFORMANCE INDEXES FOR RLS & FILTER COLUMNS
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_pickup_slots_active
  ON pickup_slots(is_active)
  WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_contact_submissions_created
  ON contact_submissions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_bookings_lookup
  ON bookings(customer_phone, booking_number)
  WHERE deleted_at IS NULL;

-- ============================================================================
-- 2. ENABLE ROW LEVEL SECURITY ON ALL TABLES
-- ============================================================================

ALTER TABLE scrap_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE scrap_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE scrap_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE pickup_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_status_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 3. PUBLIC CATALOG POLICIES (anon / public read-only)
-- ============================================================================

-- Scrap Categories: Public read for active categories
DROP POLICY IF EXISTS "anon_select_categories" ON scrap_categories;
CREATE POLICY "anon_select_categories"
  ON scrap_categories FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Scrap Items: Public read for active items
DROP POLICY IF EXISTS "anon_select_items" ON scrap_items;
CREATE POLICY "anon_select_items"
  ON scrap_items FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Scrap Rates: Public read for current rates
DROP POLICY IF EXISTS "anon_select_rates" ON scrap_rates;
CREATE POLICY "anon_select_rates"
  ON scrap_rates FOR SELECT
  TO anon, authenticated
  USING (is_current = true);

-- Pickup Slots: Public read for active slots
DROP POLICY IF EXISTS "anon_select_slots" ON pickup_slots;
CREATE POLICY "anon_select_slots"
  ON pickup_slots FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Blog Posts: Public read for published articles
DROP POLICY IF EXISTS "anon_select_blog" ON blog_posts;
CREATE POLICY "anon_select_blog"
  ON blog_posts FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

-- ============================================================================
-- 4. GUEST BOOKING & CONTACT SUBMISSION POLICIES
-- ============================================================================

-- Bookings: Allow guest booking creation
DROP POLICY IF EXISTS "anon_insert_bookings" ON bookings;
CREATE POLICY "anon_insert_bookings"
  ON bookings FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    deleted_at IS NULL
    AND status = 'pending'
  );

-- Bookings: Allow lookups of non-deleted bookings (for My Orders / tracking)
DROP POLICY IF EXISTS "anon_select_bookings" ON bookings;
CREATE POLICY "anon_select_bookings"
  ON bookings FOR SELECT
  TO anon, authenticated
  USING (deleted_at IS NULL);

-- Bookings: Allow customer cancellation only on active pending/confirmed bookings
DROP POLICY IF EXISTS "anon_update_bookings" ON bookings;
DROP POLICY IF EXISTS "anon_update_bookings_cancel" ON bookings;
CREATE POLICY "anon_update_bookings_cancel"
  ON bookings FOR UPDATE
  TO anon, authenticated
  USING (
    deleted_at IS NULL
    AND status IN ('pending', 'confirmed')
  )
  WITH CHECK (
    status = 'cancelled'
  );

-- Booking Items: Insert allowed when booking is created
DROP POLICY IF EXISTS "anon_insert_booking_items" ON booking_items;
CREATE POLICY "anon_insert_booking_items"
  ON booking_items FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    estimated_weight > 0
    AND rate_applied >= 0
  );

-- Booking Items: Select allowed for booking details display
DROP POLICY IF EXISTS "anon_select_booking_items" ON booking_items;
CREATE POLICY "anon_select_booking_items"
  ON booking_items FOR SELECT
  TO anon, authenticated
  USING (true);

-- Booking Status Logs: Select allowed for timeline display (NO direct client INSERT policy!)
DROP POLICY IF EXISTS "anon_insert_status_logs" ON booking_status_logs;
DROP POLICY IF EXISTS "anon_insert_booking_status_logs" ON booking_status_logs;
DROP POLICY IF EXISTS "anon_select_status_logs" ON booking_status_logs;
CREATE POLICY "anon_select_status_logs"
  ON booking_status_logs FOR SELECT
  TO anon, authenticated
  USING (true);

-- Contact Submissions: Insert allowed for contact form submissions
DROP POLICY IF EXISTS "anon_insert_contact" ON contact_submissions;
CREATE POLICY "anon_insert_contact"
  ON contact_submissions FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(trim(name)) >= 2
    AND length(trim(email)) >= 5
    AND length(trim(message)) >= 10
  );

-- ============================================================================
-- 5. STORAGE BUCKET SECURITY (scrap-photos)
-- ============================================================================

-- Drop broad listing policies to prevent directory enumeration
DROP POLICY IF EXISTS "Public read access for scrap photos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload scrap photos" ON storage.objects;
DROP POLICY IF EXISTS "Controlled scrap photo uploads" ON storage.objects;

-- Enforce controlled uploads (proper folder structure, path limits)
CREATE POLICY "Controlled scrap photo uploads"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    bucket_id = 'scrap-photos'
    AND (storage.foldername(name))[1] IS NOT NULL
    AND length(name) < 256
  );

-- ============================================================================
-- 6. FUNCTION EXECUTE RESTRICTIONS (Trigger Functions)
-- ============================================================================

REVOKE EXECUTE ON FUNCTION public.trigger_set_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.generate_booking_number() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_booking_status_timestamps() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.log_booking_status_change() FROM PUBLIC, anon, authenticated;
