-- 1. Cập nhật View active_landing_pages để đầy đủ thông tin hiển thị (Fix: Missing Columns)
DROP VIEW IF EXISTS public.active_landing_pages CASCADE;
CREATE OR REPLACE VIEW public.active_landing_pages AS
SELECT 
    lp.*,
    bp.business_name,
    bp.slug as business_slug,
    bp.category,
    bp.location_city,
    bp.location_district,
    bp.zalo_phone,
    bp.hotline,
    bp.logo_url,
    bp.is_verified,
    acc.expiry_date,
    acc.subscription_plan,
    acc.id as account_id
FROM public.landing_pages lp
JOIN public.business_profiles bp ON lp.business_id = bp.id
JOIN public.accounts acc ON bp.account_id = acc.id
WHERE lp.status = 'Published' 
AND acc.expiry_date > now();

-- 2. Cấp quyền INSERT cho User mới (Fix: RLS Permission Denied)
DROP POLICY IF EXISTS "Users can insert their own account" ON public.accounts;
CREATE POLICY "Users can insert their own account" ON public.accounts 
FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own business profile" ON public.business_profiles;
CREATE POLICY "Users can insert their own business profile" ON public.business_profiles 
FOR INSERT WITH CHECK (auth.uid() = account_id);

DROP POLICY IF EXISTS "Users can insert their own landing pages" ON public.landing_pages;
CREATE POLICY "Users can insert their own landing pages" ON public.landing_pages 
FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.business_profiles 
        WHERE id = business_id AND auth.uid() = account_id
    )
);

-- 3. Cấp quyền UPDATE cho Landing Pages (Cho Visual Editor)
DROP POLICY IF EXISTS "Owners can update own pages" ON public.landing_pages;
CREATE POLICY "Owners can update own pages" ON public.landing_pages 
FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM public.business_profiles 
        WHERE id = business_id AND account_id = auth.uid()
    )
);
