'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function completeOnboarding(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
    return
  }

  const business_name = (formData.get('name') as string) || ''
  const category = (formData.get('major') as string) || 'Spa'
  const specialization = (formData.get('specialization') as string) || ''
  const bio = (formData.get('bio') as string) || ''

  // Tạo slug từ tên doanh nghiệp
  const slug = business_name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 60) + '-' + Date.now().toString(36)

  // Kiểm tra đã có business_profile chưa
  const { data: existing } = await supabase
    .from('business_profiles')
    .select('id')
    .eq('account_id', user.id)
    .maybeSingle()

  if (!existing) {
    const { error } = await supabase
      .from('business_profiles')
      .insert({
        account_id: user.id,
        business_name,
        slug,
        category,
        description: bio || specialization,
        is_verified: false,
      })

    if (error) throw new Error(error.message)
  }

  redirect('/dashboard')
}
