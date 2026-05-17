-- Migration: Update active_landing_pages view to include missing audit fields
-- Date: 2026-05-17

DROP VIEW IF EXISTS public.active_landing_pages CASCADE;

CREATE OR REPLACE VIEW public.active_landing_pages AS
SELECT 
    lp.id,
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
    (lp.content_json->'contact_info'->>'address_full') AS address_full,
    p.subscription_status,
    p.expiry_date
FROM public.landing_pages lp
JOIN public.business_profiles bp ON lp.business_id = bp.id
JOIN public.profiles p ON bp.account_id = p.id
WHERE lp.is_published = true;
