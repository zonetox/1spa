-- =========================================================================
-- 20260517000001_db_code_mismatch_fixes.sql
-- Hardening Supabase Database schema to match 1SPA codebase precisely.
-- Resolves all crashes & silent fails documented in the audit report.
-- =========================================================================

-- 1. Notifications Table Alignment
-- Rename recipient_id to profile_id, add sender_id & link columns
ALTER TABLE public.notifications RENAME COLUMN recipient_id TO profile_id;
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS sender_id uuid REFERENCES public.profiles(id);
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS link text;

-- 2. Bookings Status Constraint Update
-- First migrate existing booking status values to remain valid under new constraint
UPDATE public.bookings SET status = 'Pending' WHERE status = 'new';
UPDATE public.bookings SET status = 'Confirmed' WHERE status = 'contacted';
UPDATE public.bookings SET status = 'Completed' WHERE status = 'done';

-- Drop old check constraint and recreate with codebase-aligned status values
ALTER TABLE public.bookings DROP CONSTRAINT IF EXISTS bookings_status_check;
ALTER TABLE public.bookings ADD CONSTRAINT bookings_status_check 
  CHECK (status = ANY (ARRAY['Pending'::text, 'Confirmed'::text, 'Completed'::text, 'Cancelled'::text]));
ALTER TABLE public.bookings ALTER COLUMN status SET DEFAULT 'Pending'::text;

-- 3. Profiles Subscription Status Constraint Update
-- Allow 'pending_verification' status in check constraint
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_subscription_status_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_subscription_status_check 
  CHECK (subscription_status = ANY (ARRAY['trial'::text, 'active'::text, 'blocked'::text, 'pending_verification'::text]));

-- 4. Packages Table: Add Limits Column
ALTER TABLE public.packages ADD COLUMN IF NOT EXISTS limits jsonb DEFAULT '{"max_blogs": 3}'::jsonb;

-- 5. Analytics Events Table: Add Referrer Column
ALTER TABLE public.analytics_events ADD COLUMN IF NOT EXISTS referrer text;

-- 6. Profiles Table: Add Avatar URL Column
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url text;
