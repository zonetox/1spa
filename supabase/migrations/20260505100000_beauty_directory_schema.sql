-- Beauty & Dental Directory (Premium Version) - INITIAL SCHEMA [CTO REFINED]
-- Source of Truth: docs/SYSTEM_SPECS.md & docs/PRD.md

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CUSTOM TYPES
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('Admin', 'Business');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE business_category AS ENUM ('Spa', 'Dental', 'Clinic');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE page_status AS ENUM ('Draft', 'Published');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE booking_status AS ENUM ('Pending', 'Confirmed', 'Completed', 'Cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. TABLES

-- Accounts Table (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.accounts (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    role user_role DEFAULT 'Business',
    subscription_plan TEXT DEFAULT 'Trial',
    expiry_date TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '30 days'),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Business Profiles
CREATE TABLE IF NOT EXISTS public.business_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID REFERENCES public.accounts(id) ON DELETE CASCADE,
    business_name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL, -- SEO Friendly URL
    category business_category NOT NULL,
    location_city TEXT NOT NULL,
    location_district TEXT NOT NULL,
    zalo_phone TEXT,
    hotline TEXT,
    social_links JSONB DEFAULT '{}',
    logo_url TEXT,
    rating_score FLOAT DEFAULT 5.0,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Landing Pages
CREATE TABLE IF NOT EXISTS public.landing_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES public.business_profiles(id) ON DELETE CASCADE,
    template_id TEXT NOT NULL,
    status page_status DEFAULT 'Draft',
    content_json JSONB NOT NULL DEFAULT '{}',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Bookings
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES public.business_profiles(id) ON DELETE CASCADE,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    service_requested TEXT,
    booking_time TIMESTAMP WITH TIME ZONE,
    status booking_status DEFAULT 'Pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. VIEWS & LOGIC

-- View for Active Landing Pages (Security check for expiry)
CREATE OR REPLACE VIEW public.active_landing_pages AS
SELECT 
    lp.*,
    bp.business_name,
    bp.slug as business_slug,
    acc.expiry_date
FROM public.landing_pages lp
JOIN public.business_profiles bp ON lp.business_id = bp.id
JOIN public.accounts acc ON bp.account_id = acc.id
WHERE lp.status = 'Published' 
AND acc.expiry_date > now();

-- Trigger to handle auto-unpublish on expiry (Backup logic)
CREATE OR REPLACE FUNCTION public.fn_handle_subscription_expiry()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.expiry_date < now() THEN
        UPDATE public.landing_pages
        SET status = 'Draft'
        WHERE business_id IN (
            SELECT id FROM public.business_profiles WHERE account_id = NEW.id
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_check_expiry ON public.accounts;
CREATE TRIGGER tr_check_expiry
AFTER UPDATE OF expiry_date ON public.accounts
FOR EACH ROW EXECUTE FUNCTION public.fn_handle_subscription_expiry();

-- Constraint: Only ONE Published page per Business
CREATE UNIQUE INDEX IF NOT EXISTS idx_single_published_page 
ON public.landing_pages (business_id) 
WHERE (status = 'Published');

-- 5. RLS POLICIES
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.landing_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Accounts are viewable by owners and admins" ON public.accounts
FOR SELECT USING (auth.uid() = id OR (SELECT role FROM public.accounts WHERE id = auth.uid()) = 'Admin');

CREATE POLICY "Public profiles are viewable by everyone" ON public.business_profiles
FOR SELECT USING (true);

CREATE POLICY "Owners can manage own profile" ON public.business_profiles
FOR ALL USING (auth.uid() = account_id);

CREATE POLICY "Published pages are public" ON public.landing_pages
FOR SELECT USING (status = 'Published');

CREATE POLICY "Owners can manage own pages" ON public.landing_pages
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.business_profiles 
        WHERE id = business_id AND account_id = auth.uid()
    )
);
