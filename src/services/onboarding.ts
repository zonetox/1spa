'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function completeOnboarding(formData: FormData) {
  // Check if Supabase is configured
  const isConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://YOUR_PROJECT_ID.supabase.co';

  if (!isConfigured) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    redirect('/dashboard');
    return;
  }

  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
    return
  }

  const business_name = (formData.get('business_name') || formData.get('name')) as string
  const major = (formData.get('major') || formData.get('category')) as string
  const specialization = (formData.get('specialization') || '') as string
  const bio = (formData.get('bio') || '') as string

  // 1. Update Profile (Identity)
  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      full_name: business_name
    })
    .eq('id', user.id)

  if (profileError) throw new Error(profileError.message)

  // 2. Update Business Profile & Landing Page
  const { data: business } = await supabase
    .from('business_profiles')
    .select('id')
    .eq('account_id', user.id)
    .maybeSingle()

  const INDUSTRY_PILLARS = ['Spa', 'Beauty', 'Dental'] as const
  type Category = typeof INDUSTRY_PILLARS[number]
  const safeCategory: Category = INDUSTRY_PILLARS.includes(major as Category) ? major as Category : 'Spa'

  if (business) {
    // Update category and name
    await supabase
      .from('business_profiles')
      .update({ 
        category: safeCategory,
        business_name: business_name 
      })
      .eq('id', business.id)

    // Update Landing Page Bio in content_json
    const { data: lp } = await supabase
      .from('landing_pages')
      .select('id, content_json')
      .eq('business_id', business.id)
      .maybeSingle()

    if (lp) {
      const content = (lp.content_json as any) || {}
      if (!content.about_us) content.about_us = {}
      content.about_us.intro_text = bio
      content.about_us.specialization = specialization

      await supabase
        .from('landing_pages')
        .update({ content_json: content })
        .eq('id', lp.id)
    }
  } else {
    // Handle new business profile creation if needed (fallback to remote logic style)
    const slug = business_name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .slice(0, 60) + '-' + Date.now().toString(36)

    await supabase
      .from('business_profiles')
      .insert({
        account_id: user.id,
        business_name,
        slug,
        category: safeCategory,
        is_verified: false,
      })
  }

  redirect('/dashboard')
}
