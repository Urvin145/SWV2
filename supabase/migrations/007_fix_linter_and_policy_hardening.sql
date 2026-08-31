-- ============================================================================
-- Scrapwala — Migration 007: Permanent Fix for Supabase Security Linter Warnings
--
-- Addresses all 13 Supabase Linter warnings:
-- 1. rls_policy_always_true (booking_status_logs, bookings)
-- 2. public_bucket_allows_listing (scrap-photos storage bucket)
-- 3. anon_security_definer_function_executable & authenticated_security_definer_function_executable
--    (generate_booking_number, log_booking_status_change, set_booking_status_timestamps, trigger_set_updated_at, rls_auto_enable)
-- ============================================================================

-- ============================================================================
-- 1. FIX RLS PERMISSIVE POLICIES (rls_policy_always_true)
-- ============================================================================

-- A. booking_status_logs: Drop any direct INSERT policy for anon/authenticated.
-- Status logs are exclusively written by internal DB triggers (log_booking_status_change),
-- not directly by client API calls.
DROP POLICY IF EXISTS "anon_insert_status_logs" ON public.booking_status_logs;
DROP POLICY IF EXISTS "anon_insert_booking_status_logs" ON public.booking_status_logs;

-- Ensure SELECT is allowed for viewing order timeline, but no direct client inserts
DROP POLICY IF EXISTS "anon_select_status_logs" ON public.booking_status_logs;
CREATE POLICY "anon_select_status_logs"
  ON public.booking_status_logs FOR SELECT
  TO anon, authenticated
  USING (true);

-- B. bookings: Drop broad/permissive UPDATE policies
DROP POLICY IF EXISTS "anon_update_bookings" ON public.bookings;
DROP POLICY IF EXISTS "anon_update_bookings_cancel" ON public.bookings;

-- Only allow cancellation of active pending/confirmed bookings
CREATE POLICY "anon_update_bookings_cancel"
  ON public.bookings FOR UPDATE
  TO anon, authenticated
  USING (
    deleted_at IS NULL
    AND status IN ('pending', 'confirmed')
  )
  WITH CHECK (
    status = 'cancelled'
  );

-- ============================================================================
-- 2. FIX STORAGE BUCKET DIRECTORY LISTING (public_bucket_allows_listing)
-- ============================================================================

-- For public buckets (public = true), objects are directly accessible by URL.
-- Having a broad SELECT policy on storage.objects allows clients to list/enumerate all files.
-- Dropping this policy prevents bucket scraping while preserving public asset downloads.
DROP POLICY IF EXISTS "Public read access for scrap photos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload scrap photos" ON storage.objects;
DROP POLICY IF EXISTS "Controlled scrap photo uploads" ON storage.objects;

-- Recreate strict upload policy with path validation
CREATE POLICY "Controlled scrap photo uploads"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    bucket_id = 'scrap-photos'
    AND (storage.foldername(name))[1] IS NOT NULL
    AND length(name) < 256
  );

-- ============================================================================
-- 3. FIX SECURITY DEFINER FUNCTIONS EXECUTE PERMISSIONS
-- (anon_security_definer_function_executable & authenticated_security_definer_function_executable)
-- ============================================================================

-- A. trigger_set_updated_at
CREATE OR REPLACE FUNCTION public.trigger_set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.trigger_set_updated_at() FROM PUBLIC, anon, authenticated;

-- B. generate_booking_number
CREATE OR REPLACE FUNCTION public.generate_booking_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  today_str TEXT;
  seq_num INTEGER;
BEGIN
  today_str := to_char(CURRENT_DATE, 'YYYYMMDD');
  
  SELECT COALESCE(MAX(
    CAST(SPLIT_PART(booking_number, '-', 3) AS INTEGER)
  ), 0) + 1
  INTO seq_num
  FROM public.bookings
  WHERE booking_number LIKE 'SW-' || today_str || '-%';
  
  NEW.booking_number := 'SW-' || today_str || '-' || LPAD(seq_num::TEXT, 3, '0');
  
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.generate_booking_number() FROM PUBLIC, anon, authenticated;

-- C. set_booking_status_timestamps
CREATE OR REPLACE FUNCTION public.set_booking_status_timestamps()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status THEN
    IF NEW.status = 'confirmed' THEN
      NEW.confirmed_at = now();
    ELSIF NEW.status = 'completed' THEN
      NEW.completed_at = now();
    ELSIF NEW.status = 'cancelled' THEN
      NEW.cancelled_at = now();
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.set_booking_status_timestamps() FROM PUBLIC, anon, authenticated;

-- D. log_booking_status_change
CREATE OR REPLACE FUNCTION public.log_booking_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.booking_status_logs (booking_id, previous_status, new_status, notes)
    VALUES (NEW.id, NULL, NEW.status, 'Booking created');
  ELSIF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.booking_status_logs (booking_id, previous_status, new_status)
    VALUES (NEW.id, OLD.status, NEW.status);
  END IF;
  
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.log_booking_status_change() FROM PUBLIC, anon, authenticated;

-- E. rls_auto_enable (if present in public schema)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public' AND p.proname = 'rls_auto_enable'
  ) THEN
    EXECUTE 'REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM PUBLIC, anon, authenticated;';
  END IF;
END $$;

-- ============================================================================
-- 4. VERIFY RLS IS ACTIVE ON ALL TABLES
-- ============================================================================

ALTER TABLE public.scrap_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scrap_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scrap_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pickup_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_status_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
