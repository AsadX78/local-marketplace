-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- Critical: prevents unauthorized data access
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.translations ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PROFILES
-- ============================================
-- Public profiles are viewable by everyone
CREATE POLICY "profiles_select_public" ON public.profiles
  FOR SELECT USING (true);

-- Users can update their own profile only
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Users can insert their own profile (handled by trigger, but allow)
CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================
-- CATEGORIES (read-only for users)
-- ============================================
CREATE POLICY "categories_select_all" ON public.categories
  FOR SELECT USING (true);

-- ============================================
-- LISTINGS
-- ============================================
-- Anyone can view approved listings
CREATE POLICY "listings_select_approved" ON public.listings
  FOR SELECT USING (status = 'approved');

-- Listing owner can view their own (any status)
CREATE POLICY "listings_select_own" ON public.listings
  FOR SELECT USING (auth.uid() = user_id);

-- Admin can view all listings
CREATE POLICY "listings_select_admin" ON public.listings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Users can create listings (status forced to pending by trigger)
CREATE POLICY "listings_insert_own" ON public.listings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own listings
CREATE POLICY "listings_update_own" ON public.listings
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Admin can update any listing (approve/reject)
CREATE POLICY "listings_update_admin" ON public.listings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Users can delete their own listings
CREATE POLICY "listings_delete_own" ON public.listings
  FOR DELETE USING (auth.uid() = user_id);

-- Admin can delete any listing
CREATE POLICY "listings_delete_admin" ON public.listings
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Force new listings to pending status (security trigger)
CREATE OR REPLACE FUNCTION public.force_pending_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Only admin can set non-pending status directly
  IF TG_OP = 'INSERT' AND NEW.status != 'pending' THEN
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true) THEN
      NEW.status := 'pending';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS listings_force_pending ON public.listings;
CREATE TRIGGER listings_force_pending
  BEFORE INSERT ON public.listings
  FOR EACH ROW EXECUTE FUNCTION public.force_pending_status();

-- ============================================
-- CONVERSATIONS
-- ============================================
-- Users can view conversations they're part of
CREATE POLICY "conversations_select_participant" ON public.conversations
  FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- Users can create conversations they're part of
CREATE POLICY "conversations_insert_participant" ON public.conversations
  FOR INSERT WITH CHECK (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- ============================================
-- MESSAGES
-- ============================================
-- Users can view messages in conversations they participate in
CREATE POLICY "messages_select_participant" ON public.messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = conversation_id
      AND (c.buyer_id = auth.uid() OR c.seller_id = auth.uid())
    )
  );

-- Users can insert messages in conversations they participate in
CREATE POLICY "messages_insert_participant" ON public.messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = conversation_id
      AND (c.buyer_id = auth.uid() OR c.seller_id = auth.uid())
    )
  );

-- Users can update (mark read) messages in their conversations
CREATE POLICY "messages_update_participant" ON public.messages
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = conversation_id
      AND (c.buyer_id = auth.uid() OR c.seller_id = auth.uid())
    )
  );

-- ============================================
-- TRANSACTIONS
-- ============================================
-- Users can view transactions they're part of
CREATE POLICY "transactions_select_participant" ON public.transactions
  FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- Users can create transactions they're part of (buyer only)
CREATE POLICY "transactions_insert_buyer" ON public.transactions
  FOR INSERT WITH CHECK (auth.uid() = buyer_id);

-- ============================================
-- REVIEWS
-- ============================================
-- Anyone can view reviews
CREATE POLICY "reviews_select_all" ON public.reviews
  FOR SELECT USING (true);

-- Users can create reviews they're the reviewer of
CREATE POLICY "reviews_insert_own" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- ============================================
-- REPORTS
-- ============================================
-- Users can view their own reports
CREATE POLICY "reports_select_own" ON public.reports
  FOR SELECT USING (auth.uid() = reporter_id);

-- Admin can view all reports
CREATE POLICY "reports_select_admin" ON public.reports
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Users can create reports
CREATE POLICY "reports_insert_own" ON public.reports
  FOR INSERT WITH CHECK (auth.uid() = reporter_id);

-- Admin can update reports
CREATE POLICY "reports_update_admin" ON public.reports
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- ============================================
-- TRANSLATIONS
-- ============================================
-- Anyone can view translations
CREATE POLICY "translations_select_all" ON public.translations
  FOR SELECT USING (true);

-- Only admin can modify translations
CREATE POLICY "translations_all_admin" ON public.translations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );
