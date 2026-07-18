-- ============================================================================
-- Scrapwala — Storage Bucket Setup
-- Run in Supabase SQL Editor to create the scrap-photos storage bucket.
-- ============================================================================

-- Create the scrap-photos bucket for customer scrap photo uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'scrap-photos',
  'scrap-photos',
  true,  -- Public read access (photos displayed in booking details)
  5242880,  -- 5MB max file size
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic']::text[]
)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to scrap photos
CREATE POLICY "Public read access for scrap photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'scrap-photos');

-- Allow anyone to upload photos (guest mode — no auth in Phase 1)
CREATE POLICY "Anyone can upload scrap photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'scrap-photos');
