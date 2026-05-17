-- =========================================================
-- Supabase Cloud Database Schema (Extracted dynamically)
-- Date: 2026-05-17T11:36:38.532Z
-- =========================================================

-- CUSTOM ENUMS/TYPES
CREATE TYPE booking_status AS ENUM ('Pending', 'Confirmed', 'Completed', 'Cancelled');
CREATE TYPE business_category AS ENUM ('Spa', 'Dental', 'Clinic', 'Beauty');
CREATE TYPE page_status AS ENUM ('Draft', 'Published');
CREATE TYPE user_role AS ENUM ('Admin', 'Business');

-- TABLE: analytics_events
CREATE TABLE public.analytics_events (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    business_id uuid,
    event_type text,
    page_slug text,
    created_at timestamp with time zone DEFAULT now(),
    referrer text,
    CONSTRAINT analytics_events_business_id_fkey FOREIGN KEY (business_id) REFERENCES public.business_profiles(id),
    CONSTRAINT analytics_events_pkey PRIMARY KEY (id),
    CONSTRAINT 2200_18073_1_not_null CHECK (id IS NOT NULL)
);

-- TABLE: blogs
CREATE TABLE public.blogs (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    business_id uuid NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    image_url text,
    status text DEFAULT 'Published'::text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT blogs_business_id_fkey FOREIGN KEY (business_id) REFERENCES public.business_profiles(id),
    CONSTRAINT blogs_pkey PRIMARY KEY (id),
    CONSTRAINT 2200_17949_1_not_null CHECK (id IS NOT NULL),
    CONSTRAINT 2200_17949_2_not_null CHECK (business_id IS NOT NULL),
    CONSTRAINT 2200_17949_3_not_null CHECK (title IS NOT NULL),
    CONSTRAINT 2200_17949_4_not_null CHECK (content IS NOT NULL),
    CONSTRAINT blogs_status_check CHECK ((status = ANY (ARRAY['Draft'::text, 'Published'::text])))
);

-- TABLE: bookings
CREATE TABLE public.bookings (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    business_id uuid NOT NULL,
    customer_info jsonb NOT NULL,
    status text NOT NULL DEFAULT 'Pending'::text,
    source_url text,
    created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT bookings_business_id_fkey FOREIGN KEY (business_id) REFERENCES public.business_profiles(id),
    CONSTRAINT bookings_pkey PRIMARY KEY (id),
    CONSTRAINT 2200_17816_1_not_null CHECK (id IS NOT NULL),
    CONSTRAINT 2200_17816_2_not_null CHECK (business_id IS NOT NULL),
    CONSTRAINT 2200_17816_3_not_null CHECK (customer_info IS NOT NULL),
    CONSTRAINT 2200_17816_4_not_null CHECK (status IS NOT NULL),
    CONSTRAINT 2200_17816_6_not_null CHECK (created_at IS NOT NULL),
    CONSTRAINT bookings_status_check CHECK ((status = ANY (ARRAY['Pending'::text, 'Confirmed'::text, 'Completed'::text, 'Cancelled'::text])))
);

-- TABLE: business_locations
CREATE TABLE public.business_locations (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    business_id uuid NOT NULL,
    city text NOT NULL DEFAULT 'TP.HCM'::text,
    district text NOT NULL,
    address_full text NOT NULL,
    lat double precision,
    lng double precision,
    CONSTRAINT business_locations_business_id_fkey FOREIGN KEY (business_id) REFERENCES public.business_profiles(id),
    CONSTRAINT business_locations_pkey PRIMARY KEY (id),
    CONSTRAINT 2200_17780_1_not_null CHECK (id IS NOT NULL),
    CONSTRAINT 2200_17780_2_not_null CHECK (business_id IS NOT NULL),
    CONSTRAINT 2200_17780_3_not_null CHECK (city IS NOT NULL),
    CONSTRAINT 2200_17780_4_not_null CHECK (district IS NOT NULL),
    CONSTRAINT 2200_17780_5_not_null CHECK (address_full IS NOT NULL)
);

-- TABLE: business_profiles
CREATE TABLE public.business_profiles (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    account_id uuid NOT NULL,
    business_name text NOT NULL,
    slug text NOT NULL,
    category text NOT NULL,
    zalo_phone text,
    hotline text,
    logo_url text,
    is_verified boolean NOT NULL DEFAULT false,
    created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    location_city text DEFAULT ''::text,
    location_district text DEFAULT ''::text,
    rating_score double precision DEFAULT 5.0,
    social_links jsonb DEFAULT '{}'::jsonb,
    CONSTRAINT business_profiles_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.profiles(id),
    CONSTRAINT business_profiles_pkey PRIMARY KEY (id),
    CONSTRAINT business_profiles_slug_key UNIQUE (slug),
    CONSTRAINT 2200_17759_10_not_null CHECK (created_at IS NOT NULL),
    CONSTRAINT 2200_17759_1_not_null CHECK (id IS NOT NULL),
    CONSTRAINT 2200_17759_2_not_null CHECK (account_id IS NOT NULL),
    CONSTRAINT 2200_17759_3_not_null CHECK (business_name IS NOT NULL),
    CONSTRAINT 2200_17759_4_not_null CHECK (slug IS NOT NULL),
    CONSTRAINT 2200_17759_5_not_null CHECK (category IS NOT NULL),
    CONSTRAINT 2200_17759_9_not_null CHECK (is_verified IS NOT NULL),
    CONSTRAINT business_profiles_category_check CHECK ((category = ANY (ARRAY['Spa'::text, 'Beauty'::text, 'Dental'::text, 'Clinic'::text, 'Dental Clinic'::text])))
);

-- TABLE: landing_pages
CREATE TABLE public.landing_pages (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    business_id uuid NOT NULL,
    template_id text NOT NULL DEFAULT 'royal'::text,
    content_json jsonb NOT NULL DEFAULT '{}'::jsonb,
    is_published boolean NOT NULL DEFAULT false,
    updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    status text DEFAULT 'Draft'::text,
    draft_json jsonb,
    CONSTRAINT landing_pages_business_id_fkey FOREIGN KEY (business_id) REFERENCES public.business_profiles(id),
    CONSTRAINT landing_pages_pkey PRIMARY KEY (id),
    CONSTRAINT 2200_17796_1_not_null CHECK (id IS NOT NULL),
    CONSTRAINT 2200_17796_2_not_null CHECK (business_id IS NOT NULL),
    CONSTRAINT 2200_17796_3_not_null CHECK (template_id IS NOT NULL),
    CONSTRAINT 2200_17796_4_not_null CHECK (content_json IS NOT NULL),
    CONSTRAINT 2200_17796_5_not_null CHECK (is_published IS NOT NULL),
    CONSTRAINT 2200_17796_6_not_null CHECK (updated_at IS NOT NULL)
);

-- TABLE: notifications
CREATE TABLE public.notifications (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    profile_id uuid,
    type text,
    title text,
    message text,
    is_read boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    sender_id uuid,
    link text,
    CONSTRAINT notifications_pkey PRIMARY KEY (id),
    CONSTRAINT notifications_recipient_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id),
    CONSTRAINT notifications_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.profiles(id),
    CONSTRAINT 2200_18087_1_not_null CHECK (id IS NOT NULL)
);

-- TABLE: packages
CREATE TABLE public.packages (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    name text NOT NULL,
    price numeric NOT NULL,
    trial_days integer DEFAULT 0,
    duration_days integer DEFAULT 365,
    features jsonb DEFAULT '[]'::jsonb,
    created_at timestamp with time zone DEFAULT now(),
    limits jsonb DEFAULT '{"max_blogs": 3}'::jsonb,
    CONSTRAINT packages_pkey PRIMARY KEY (id),
    CONSTRAINT 2200_17902_1_not_null CHECK (id IS NOT NULL),
    CONSTRAINT 2200_17902_2_not_null CHECK (name IS NOT NULL),
    CONSTRAINT 2200_17902_3_not_null CHECK (price IS NOT NULL)
);

-- TABLE: profiles
CREATE TABLE public.profiles (
    id uuid NOT NULL,
    role text NOT NULL DEFAULT 'business'::text,
    full_name text,
    email text NOT NULL,
    subscription_status text NOT NULL DEFAULT 'trial'::text,
    expiry_date timestamp with time zone NOT NULL DEFAULT (now() + '30 days'::interval),
    created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    avatar_url text,
    CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES public.null(null),
    CONSTRAINT profiles_pkey PRIMARY KEY (id),
    CONSTRAINT 2200_17737_1_not_null CHECK (id IS NOT NULL),
    CONSTRAINT 2200_17737_2_not_null CHECK (role IS NOT NULL),
    CONSTRAINT 2200_17737_4_not_null CHECK (email IS NOT NULL),
    CONSTRAINT 2200_17737_5_not_null CHECK (subscription_status IS NOT NULL),
    CONSTRAINT 2200_17737_6_not_null CHECK (expiry_date IS NOT NULL),
    CONSTRAINT 2200_17737_7_not_null CHECK (created_at IS NOT NULL),
    CONSTRAINT profiles_role_check CHECK ((role = ANY (ARRAY['admin'::text, 'business'::text, 'user'::text]))),
    CONSTRAINT profiles_subscription_status_check CHECK ((subscription_status = ANY (ARRAY['trial'::text, 'active'::text, 'blocked'::text, 'pending_verification'::text])))
);

-- TABLE: reviews
CREATE TABLE public.reviews (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    business_id uuid NOT NULL,
    author_name text NOT NULL,
    rating integer NOT NULL,
    comment text,
    created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT reviews_business_id_fkey FOREIGN KEY (business_id) REFERENCES public.business_profiles(id),
    CONSTRAINT reviews_pkey PRIMARY KEY (id),
    CONSTRAINT 2200_17835_1_not_null CHECK (id IS NOT NULL),
    CONSTRAINT 2200_17835_2_not_null CHECK (business_id IS NOT NULL),
    CONSTRAINT 2200_17835_3_not_null CHECK (author_name IS NOT NULL),
    CONSTRAINT 2200_17835_4_not_null CHECK (rating IS NOT NULL),
    CONSTRAINT 2200_17835_6_not_null CHECK (created_at IS NOT NULL),
    CONSTRAINT reviews_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);

-- TABLE: subscriptions
CREATE TABLE public.subscriptions (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    business_id uuid NOT NULL,
    package_id uuid NOT NULL,
    status text DEFAULT 'Pending'::text,
    start_date timestamp with time zone DEFAULT now(),
    end_date timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    verified boolean DEFAULT false,
    CONSTRAINT subscriptions_business_id_fkey FOREIGN KEY (business_id) REFERENCES public.business_profiles(id),
    CONSTRAINT subscriptions_package_id_fkey FOREIGN KEY (package_id) REFERENCES public.packages(id),
    CONSTRAINT subscriptions_pkey PRIMARY KEY (id),
    CONSTRAINT 2200_17918_1_not_null CHECK (id IS NOT NULL),
    CONSTRAINT 2200_17918_2_not_null CHECK (business_id IS NOT NULL),
    CONSTRAINT 2200_17918_3_not_null CHECK (package_id IS NOT NULL),
    CONSTRAINT subscriptions_status_check CHECK ((status = ANY (ARRAY['Pending'::text, 'Trial'::text, 'Active'::text, 'Expired'::text, 'Cancelled'::text])))
);

-- VIEW: active_landing_pages
CREATE OR REPLACE VIEW public.active_landing_pages AS
SELECT lp.id,
    lp.id AS landing_page_id,
    lp.business_id,
    lp.template_id,
    lp.content_json,
    lp.is_published,
    lp.status AS page_status,
    bp.created_at,
    bp.account_id,
    bp.business_name,
    bp.slug AS business_slug,
    bp.category,
    bp.zalo_phone,
    bp.hotline,
    bp.logo_url,
    bp.is_verified,
    bp.rating_score,
    bp.location_city,
    bp.location_district,
    ((lp.content_json -> 'contact_info'::text) ->> 'address_full'::text) AS address_full,
    p.subscription_status,
    p.expiry_date
   FROM ((landing_pages lp
     JOIN business_profiles bp ON ((lp.business_id = bp.id)))
     JOIN profiles p ON ((bp.account_id = p.id)))
  WHERE (lp.is_published = true);;

-- INDEXES
CREATE UNIQUE INDEX analytics_events_pkey ON public.analytics_events USING btree (id);
CREATE UNIQUE INDEX blogs_pkey ON public.blogs USING btree (id);
CREATE UNIQUE INDEX bookings_pkey ON public.bookings USING btree (id);
CREATE UNIQUE INDEX business_locations_pkey ON public.business_locations USING btree (id);
CREATE UNIQUE INDEX business_profiles_pkey ON public.business_profiles USING btree (id);
CREATE UNIQUE INDEX business_profiles_slug_key ON public.business_profiles USING btree (slug);
CREATE INDEX idx_bookings_business_id ON public.bookings USING btree (business_id);
CREATE INDEX idx_business_locations_city_district ON public.business_locations USING btree (city, district);
CREATE INDEX idx_business_profiles_category ON public.business_profiles USING btree (category);
CREATE INDEX idx_business_profiles_slug ON public.business_profiles USING btree (slug);
CREATE INDEX idx_landing_pages_business_id ON public.landing_pages USING btree (business_id);
CREATE UNIQUE INDEX landing_pages_pkey ON public.landing_pages USING btree (id);
CREATE UNIQUE INDEX notifications_pkey ON public.notifications USING btree (id);
CREATE UNIQUE INDEX packages_pkey ON public.packages USING btree (id);
CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);
CREATE UNIQUE INDEX reviews_pkey ON public.reviews USING btree (id);
CREATE UNIQUE INDEX subscriptions_pkey ON public.subscriptions USING btree (id);

