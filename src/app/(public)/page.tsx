'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { HeroSection } from '@/components/home/HeroSection'
import { FilterBar } from '@/components/home/FilterBar'
import { FeaturedSection } from '@/components/home/FeaturedSection'
import { BlogRibbon } from '@/components/home/BlogRibbon'
import { Footer } from '@/components/home/Footer'

export default function Home() {
  const [all, setAll] = useState<any[]>([])
  const [filtered, setFiltered] = useState<any[]>([])
  const [category, setCategory] = useState('all')
  const [district, setDistrict] = useState('Tất cả')
  const supabase = createClient()

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('active_landing_pages').select('*')
      if (data && data.length > 0) {
        const mapped = data.map((item: any) => {
          let cat = item.category || 'Spa';
          if (cat === 'Clinic' || cat === 'clinic') cat = 'Beauty';
          if (cat === 'Dental' || cat === 'dental') cat = 'Dental Clinic';
          return {
            slug: item.business_slug,
            business_name: item.business_name,
            category: cat,
            location_district: `${item.district || ''}, ${item.city || 'TP.HCM'}`.replace(/^, /, ''),
            is_verified: item.is_verified,
            cover_image: item.content_json?.hero_section?.hero_slides?.[0] || item.content_json?.hero_section?.slides?.[0]?.image_url || 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?q=80&w=800',
            services: (item.content_json?.services_menu || []).slice(0, 3).map((s: any) => ({
              name: s.name || s.service_name || 'Dịch vụ cao cấp',
              price: s.price || 'Liên hệ'
            })),
          }
        })
        setAll(mapped)
        setFiltered(mapped)
      } else {
        // Fallback mock
        const mock = [
          { slug: 'vien-tham-my-hoang-gia-luxury-q1', business_name: 'Viện Thẩm Mỹ Hoàng Gia Luxury', category: 'Spa', location_district: 'Quận 1, TP.HCM', is_verified: true, cover_image: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?q=80&w=800', services: [{ name: 'Nâng Cơ Ultherapy', price: '25tr' }, { name: 'Trị Nám Picosure', price: '15tr' }, { name: 'Filler/Botox', price: '8tr' }] },
          { slug: 'nha-khoa-prestige-dental-q3', business_name: 'Nha Khoa Prestige Dental', category: 'Dental', location_district: 'Quận 3, TP.HCM', is_verified: true, cover_image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=800', services: [{ name: 'Răng Sứ Cercon', price: '12tr' }, { name: 'Invisalign', price: '80tr' }, { name: 'Implant', price: '25tr' }] },
          { slug: 'aurora-beauty-clinic-binhcanh', business_name: 'Aurora Beauty Clinic', category: 'Clinic', location_district: 'Bình Chánh, TP.HCM', is_verified: false, cover_image: 'https://images.unsplash.com/photo-1519415387722-a1c3bbef716c?q=80&w=800', services: [{ name: 'Trị Mụn', price: '3.5tr' }, { name: 'Laser CO2', price: '18tr' }, { name: 'Thermage', price: '22tr' }] },
        ]
        setAll(mock)
        setFiltered(mock)
      }
    }
    fetch()
  }, [])

  useEffect(() => {
    let result = all
    if (category !== 'all') result = result.filter(b => b.category === category)
    if (district !== 'Tất cả') result = result.filter(b => b.location_district?.includes(district))
    setFiltered(result)
  }, [category, district, all])

  return (
    <main className="min-h-screen" style={{ background: '#F9F6F0' }}>
      <HeroSection />
      <FilterBar
        activeCategory={category}
        activeDistrict={district}
        onCategory={setCategory}
        onDistrict={setDistrict}
      />
      <FeaturedSection businesses={filtered} />
      <BlogRibbon />
      <Footer />
    </main>
  )
}
