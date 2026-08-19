-- ============================================
-- FIX: Lock down profiles table
-- OLD: profiles_select_public allowed USING (true)
--   → anon key could read ALL columns including is_admin, phone
-- NEW: Only authenticated users can read profiles
--   → Public profile data served by /api/* routes with column filtering
-- ============================================

-- Drop the overly permissive public read policy
DROP POLICY IF EXISTS profiles_select_public ON public.profiles;

-- Authenticated users can read profiles (for chat, seller pages, etc.)
-- Server API routes handle public profile display with column filtering
CREATE POLICY "profiles_select_authenticated" ON public.profiles
  FOR SELECT USING (auth.role() = 'authenticated');

-- Keep existing own-profile policies
-- profiles_update_own, profiles_insert_own unchanged

-- ============================================
-- Also lock down transactions, conversations, messages
-- to be stricter (authenticated only, not public anon)
-- ============================================

-- Conversations: already restricted to participants (good)
-- Messages: already restricted to participants (good)
-- Transactions: already restricted to participants (good)
-- Reviews: allow public read (safe — no sensitive data)
-- Reports: already restricted to owner + admin (good)
