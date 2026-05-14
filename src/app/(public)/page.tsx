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
          const rawCat = (item.category || 'Spa') as keyof typeof CANONICAL_TEMPLATES;
          return {
            slug: item.business_slug,
            business_name: item.business_name,
            category: item.category || 'Spa',
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
        setAll([])
        setFiltered([])
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
