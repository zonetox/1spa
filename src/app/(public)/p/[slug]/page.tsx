import React from 'react'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import LandingPageWrapper from '@/components/templates/LandingPageWrapper'

interface PageProps {
  params: {
    slug: string
  }
  searchParams: {
    edit?: string
  }
}

const VIRTUAL_DEMOS: Record<string, any> = {
  'medical-01': {
    id: 'demo-medical-id',
    business_id: 'demo-medical-biz-id',
    business_name: 'Platinum Advanced Clinic',
    category: 'Clinic',
    business_slug: 'medical-01',
    template_id: 'modern_medical_01',
    logo_url: null,
    hotline: '1900 8888',
    zalo_phone: '0912 345 678',
    location_district: 'Quận 1',
    location_city: 'TP. Hồ Chí Minh',
    address_full: '123 Đồng Khởi, Bến Nghé, Quận 1, TP. Hồ Chí Minh'
  },
  'dental-01': {
    id: 'demo-dental-id',
    business_id: 'demo-dental-biz-id',
    business_name: 'Prestige Aesthetic Dentistry',
    category: 'Dentistry',
    business_slug: 'dental-01',
    template_id: 'dental_care_01',
    logo_url: null,
    hotline: '1900 9999',
    zalo_phone: '0912 999 999',
    location_district: 'Quận 3',
    location_city: 'TP. Hồ Chí Minh',
    address_full: '456 Lê Quý Đôn, Võ Thị Sáu, Quận 3, TP. Hồ Chí Minh'
  },
  'beauty-01': {
    id: 'demo-beauty-id',
    business_id: 'demo-beauty-biz-id',
    business_name: 'Haute Couture Beauty Studio',
    category: 'Beauty',
    business_slug: 'beauty-01',
    template_id: 'haute_couture_beauty_01',
    logo_url: null,
    hotline: '1900 7777',
    zalo_phone: '0912 777 777',
    location_district: 'Quận 1',
    location_city: 'TP. Hồ Chí Minh',
    address_full: '789 Nguyễn Huệ, Bến Nghé, Quận 1, TP. Hồ Chí Minh'
  },
  'spa-01': {
    id: 'demo-spa-id',
    business_id: 'demo-spa-biz-id',
    business_name: 'Luxury Spa Zen & Wellness',
    category: 'Spa',
    business_slug: 'spa-01',
    template_id: 'luxury_spa_zen_01',
    logo_url: null,
    hotline: '1900 6666',
    zalo_phone: '0912 666 666',
    location_district: 'Quận 1',
    location_city: 'TP. Hồ Chí Minh',
    address_full: '99 Phùng Khắc Khoan, Đa Kao, Quận 1, TP. Hồ Chí Minh'
  },
  'royal-01': {
    id: 'demo-royal-id',
    business_id: 'demo-royal-biz-id',
    business_name: 'Royal Classic Aesthetic',
    category: 'Aesthetic',
    business_slug: 'royal-01',
    template_id: 'royal_classic_01',
    logo_url: null,
    hotline: '1900 5555',
    zalo_phone: '0912 555 555',
    location_district: 'Quận 3',
    location_city: 'TP. Hồ Chí Minh',
    address_full: '222 Điện Biên Phủ, Võ Thị Sáu, Quận 3, TP. Hồ Chí Minh'
  },
  'campaign-01': {
    id: 'demo-campaign-id',
    business_id: 'demo-campaign-biz-id',
    business_name: 'Aurora Mega Promo Centre',
    category: 'Campaign',
    business_slug: 'campaign-01',
    template_id: 'seasonal_event_01',
    logo_url: null,
    hotline: '1900 4444',
    zalo_phone: '0912 444 444',
    location_district: 'Bình Chánh',
    location_city: 'TP. Hồ Chí Minh',
    address_full: '88 Đường Số 9, Khu Dân Cư Trung Sơn, Bình Chánh, TP. Hồ Chí Minh'
  }
}

export default async function BusinessLandingPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const resolvedSearchParams = await searchParams
  const isEditMode = resolvedSearchParams.edit === 'true'
  const supabase = await createClient()

  // High-performance virtual intercept for clean demo URLs
  if (VIRTUAL_DEMOS[slug]) {
    return (
      <div className="min-h-screen bg-background">
        <LandingPageWrapper business={VIRTUAL_DEMOS[slug]} isEditMode={false} />
      </div>
    )
  }

  // Fetch data from active_landing_pages view for actual database records
  const { data: business, error } = await supabase
    .from('active_landing_pages')
    .select('*')
    .eq('business_slug', slug)
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching business:', error)
  }
  
  if (!business) {
    return notFound()
  }

  // If editing, verify user owns this business (Security check)
  if (isEditMode) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || user.id !== business.account_id) {
       // Silently disable edit mode if not owner
       return <LandingPageWrapper business={business} isEditMode={false} />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <LandingPageWrapper business={business} isEditMode={isEditMode} />
    </div>
  )
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  if (VIRTUAL_DEMOS[slug]) {
    const business = VIRTUAL_DEMOS[slug]
    return {
      title: `${business.business_name} | Mẫu Demo Thiết Kế ${business.category}`,
      description: `Khám phá mẫu demo thiết kế ${business.category} đẳng cấp tại ${business.business_name}.`,
    }
  }

  const { data: business } = await supabase
    .from('active_landing_pages')
    .select('business_name, category, district, city')
    .eq('business_slug', slug)
    .single()

  if (!business) return { title: 'Not Found - Beauty Hub' }

  return {
    title: `${business.business_name} | ${business.category} Đẳng Cấp tại ${business.district}, ${business.city}`,
    description: `Khám phá các dịch vụ ${business.category} cao cấp và ưu đãi đặc quyền tại ${business.business_name} (${business.district}, ${business.city}). Đặt lịch hẹn nhận tư vấn miễn phí ngay hôm nay!`,
  }
}
