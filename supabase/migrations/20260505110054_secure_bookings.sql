-- Security Policies for Bookings
-- Ensure Row Level Security is enabled
ALTER TABLE IF EXISTS public.bookings ENABLE ROW LEVEL SECURITY;

-- 1. Anyone can create a booking (to allow customers to book)
CREATE POLICY "Anyone can create a booking" ON public.bookings
FOR INSERT WITH CHECK (true);

-- 2. Business Owners can see bookings for their businesses
CREATE POLICY "Owners can see bookings for their business" ON public.bookings
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.business_profiles 
        WHERE id = business_id AND account_id = auth.uid()
    )
);

-- 3. Admins can see and manage all bookings
CREATE POLICY "Admins can manage all bookings" ON public.bookings
FOR ALL USING (
    (SELECT role FROM public.accounts WHERE id = auth.uid()) = 'Admin'
);
