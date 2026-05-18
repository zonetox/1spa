-- Cleanup data while keeping accounts and site settings
DELETE FROM public.bookings;
DELETE FROM public.reviews;
DELETE FROM public.blogs;
DELETE FROM public.analytics_events;
DELETE FROM public.landing_pages;
DELETE FROM public.business_profiles;
