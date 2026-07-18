-- ============================================================================
-- Scrapwala — Phase 1 Database Schema
-- PostgreSQL (Supabase) Migration
-- 
-- Run this in Supabase SQL Editor to create all tables, indexes, and constraints.
-- No RLS policies needed for Phase 1 (all data is public read/write).
-- ============================================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. BOOKING STATUS ENUM
-- ============================================================================
DO $$ BEGIN
  CREATE TYPE booking_status AS ENUM (
    'pending',
    'confirmed',
    'scheduled',
    'completed',
    'cancelled'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============================================================================
-- 2. SCRAP CATEGORIES
-- ============================================================================
CREATE TABLE IF NOT EXISTS scrap_categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  icon_url    TEXT,
  image_url   TEXT,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_scrap_categories_slug ON scrap_categories(slug);
CREATE INDEX IF NOT EXISTS idx_scrap_categories_active ON scrap_categories(is_active) WHERE is_active = true;

-- ============================================================================
-- 3. SCRAP ITEMS
-- ============================================================================
CREATE TABLE IF NOT EXISTS scrap_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES scrap_categories(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url   TEXT,
  unit        TEXT NOT NULL DEFAULT 'kg',
  is_active   BOOLEAN NOT NULL DEFAULT true,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_scrap_items_category ON scrap_items(category_id);
CREATE INDEX IF NOT EXISTS idx_scrap_items_slug ON scrap_items(slug);
CREATE INDEX IF NOT EXISTS idx_scrap_items_active ON scrap_items(is_active) WHERE is_active = true;

-- ============================================================================
-- 4. SCRAP RATES
-- ============================================================================
CREATE TABLE IF NOT EXISTS scrap_rates (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scrap_item_id   UUID NOT NULL REFERENCES scrap_items(id) ON DELETE CASCADE,
  price_per_unit  DECIMAL(10,2) NOT NULL,
  city            TEXT NOT NULL DEFAULT 'Bangalore',
  effective_from  TIMESTAMPTZ NOT NULL DEFAULT now(),
  effective_to    TIMESTAMPTZ,
  is_current      BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by      UUID
);

CREATE INDEX IF NOT EXISTS idx_scrap_rates_item ON scrap_rates(scrap_item_id);
CREATE INDEX IF NOT EXISTS idx_scrap_rates_current ON scrap_rates(is_current) WHERE is_current = true;
CREATE INDEX IF NOT EXISTS idx_scrap_rates_city ON scrap_rates(city);

-- ============================================================================
-- 5. PICKUP SLOTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS pickup_slots (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  start_time            TIME NOT NULL,
  end_time              TIME NOT NULL,
  label                 TEXT NOT NULL,
  max_bookings_per_day  INTEGER NOT NULL DEFAULT 10,
  is_active             BOOLEAN NOT NULL DEFAULT true,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- 6. BOOKINGS (Guest Mode — customer info inline, no user FK)
-- ============================================================================
CREATE TABLE IF NOT EXISTS bookings (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_number      TEXT NOT NULL UNIQUE,
  customer_name       TEXT NOT NULL,
  customer_phone      TEXT NOT NULL,
  address_line_1      TEXT NOT NULL,
  address_line_2      TEXT,
  city                TEXT NOT NULL DEFAULT 'Bangalore',
  state               TEXT NOT NULL DEFAULT 'Karnataka',
  pincode             TEXT NOT NULL,
  latitude            DOUBLE PRECISION,
  longitude           DOUBLE PRECISION,
  slot_id             UUID NOT NULL REFERENCES pickup_slots(id),
  pickup_date         DATE NOT NULL,
  status              booking_status NOT NULL DEFAULT 'pending',
  estimated_value     DECIMAL(10,2),
  actual_value        DECIMAL(10,2),
  weight_total        DECIMAL(10,2),
  customer_notes      TEXT,
  cancellation_reason TEXT,
  scrap_photo_urls    TEXT,
  confirmed_at        TIMESTAMPTZ,
  completed_at        TIMESTAMPTZ,
  cancelled_at        TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at          TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_bookings_number ON bookings(booking_number);
CREATE INDEX IF NOT EXISTS idx_bookings_phone ON bookings(customer_phone);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_pickup_date ON bookings(pickup_date);
CREATE INDEX IF NOT EXISTS idx_bookings_slot ON bookings(slot_id);
CREATE INDEX IF NOT EXISTS idx_bookings_not_deleted ON bookings(deleted_at) WHERE deleted_at IS NULL;

-- ============================================================================
-- 7. BOOKING ITEMS
-- ============================================================================
CREATE TABLE IF NOT EXISTS booking_items (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id       UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  scrap_item_id    UUID NOT NULL REFERENCES scrap_items(id),
  estimated_weight DECIMAL(10,2) NOT NULL,
  actual_weight    DECIMAL(10,2),
  rate_applied     DECIMAL(10,2) NOT NULL,
  subtotal         DECIMAL(10,2) NOT NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_booking_items_booking ON booking_items(booking_id);
CREATE INDEX IF NOT EXISTS idx_booking_items_scrap_item ON booking_items(scrap_item_id);

-- ============================================================================
-- 8. BOOKING STATUS LOGS
-- ============================================================================
CREATE TABLE IF NOT EXISTS booking_status_logs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id      UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  previous_status booking_status,
  new_status      booking_status NOT NULL,
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_status_logs_booking ON booking_status_logs(booking_id);

-- ============================================================================
-- 9. BLOG POSTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS blog_posts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title           TEXT NOT NULL,
  slug            TEXT NOT NULL UNIQUE,
  excerpt         TEXT,
  content         TEXT NOT NULL,
  cover_image_url TEXT,
  author_name     TEXT NOT NULL DEFAULT 'Scrapwala Team',
  is_published    BOOLEAN NOT NULL DEFAULT false,
  published_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(is_published) WHERE is_published = true;

-- ============================================================================
-- 10. CONTACT SUBMISSIONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS contact_submissions (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  phone      TEXT,
  subject    TEXT NOT NULL,
  message    TEXT NOT NULL,
  is_read    BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- 11. AUTO-UPDATE updated_at TRIGGER
-- ============================================================================
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at column
DO $$ 
DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN 
    SELECT unnest(ARRAY[
      'scrap_categories', 'scrap_items', 'pickup_slots', 
      'bookings', 'blog_posts'
    ])
  LOOP
    EXECUTE format(
      'DROP TRIGGER IF EXISTS set_updated_at ON %I; 
       CREATE TRIGGER set_updated_at BEFORE UPDATE ON %I 
       FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();',
      tbl, tbl
    );
  END LOOP;
END $$;

-- ============================================================================
-- 12. BOOKING NUMBER AUTO-GENERATION FUNCTION
-- ============================================================================
CREATE OR REPLACE FUNCTION generate_booking_number()
RETURNS TRIGGER AS $$
DECLARE
  today_str TEXT;
  seq_num INTEGER;
BEGIN
  today_str := to_char(CURRENT_DATE, 'YYYYMMDD');
  
  SELECT COALESCE(MAX(
    CAST(SPLIT_PART(booking_number, '-', 3) AS INTEGER)
  ), 0) + 1
  INTO seq_num
  FROM bookings
  WHERE booking_number LIKE 'SW-' || today_str || '-%';
  
  NEW.booking_number := 'SW-' || today_str || '-' || LPAD(seq_num::TEXT, 3, '0');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER set_booking_number
  BEFORE INSERT ON bookings
  FOR EACH ROW
  WHEN (NEW.booking_number IS NULL OR NEW.booking_number = '')
  EXECUTE FUNCTION generate_booking_number();

-- ============================================================================
-- 13. INITIAL STATUS LOG TRIGGERS
-- ============================================================================
CREATE OR REPLACE FUNCTION set_booking_status_timestamps()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER booking_status_timestamps
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION set_booking_status_timestamps();

CREATE OR REPLACE FUNCTION log_booking_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO booking_status_logs (booking_id, previous_status, new_status, notes)
    VALUES (NEW.id, NULL, NEW.status, 'Booking created');
  ELSIF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO booking_status_logs (booking_id, previous_status, new_status)
    VALUES (NEW.id, OLD.status, NEW.status);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER booking_status_change
  AFTER INSERT OR UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION log_booking_status_change();

-- ============================================================================
-- DONE! Run seed.sql next to populate initial data.
-- ============================================================================
