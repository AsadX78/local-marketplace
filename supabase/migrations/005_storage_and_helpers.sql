-- ============================================
-- STORAGE BUCKETS (Run in Supabase SQL Editor)
-- ============================================

-- Listings images bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'listings',
  'listings',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Avatars bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Storage RLS policies

-- Anyone can view listings images (public bucket)
CREATE POLICY "listings_select_public" ON storage.objects
  FOR SELECT USING (bucket_id = 'listings');

-- Authenticated users can upload to listings (their own folder)
CREATE POLICY "listings_insert_auth" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'listings'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Users can delete their own listings images
CREATE POLICY "listings_delete_own" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'listings'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Anyone can view avatars (public bucket)
CREATE POLICY "avatars_select_public" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

-- Authenticated users can upload/update their own avatar
CREATE POLICY "avatars_upsert_own" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars'
    AND auth.role() = 'authenticated'
    AND name = ('avatars/' || auth.uid() || '.*')
  );

CREATE POLICY "avatars_update_own" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars'
    AND name LIKE ('avatars/' || auth.uid() || '%')
  );

-- ============================================
-- HELPER FUNCTION: increment views
-- ============================================
CREATE OR REPLACE FUNCTION public.increment_views(listing_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.listings
  SET views_count = views_count + 1
  WHERE id = listing_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
