'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { EditorToolbar } from '@/components/editor/EditorToolbar'
import RoyalClassic from '@/components/templates/RoyalClassic'
import ModernMedical from '@/components/templates/ModernMedical'
import SeasonalEvent from '@/components/templates/SeasonalEvent'
import DentalCare from '@/components/templates/DentalCare'
import LuxurySpaZen from '@/components/templates/LuxurySpaZen'
import HauteCoutureBeauty from '@/components/templates/HauteCoutureBeauty'

interface WrapperProps {
  business: any
  isEditMode: boolean
}

export default function LandingPageWrapper({ business, isEditMode }: WrapperProps) {
  const [data, setData] = useState(business.content_json || {})
  const [hasChanges, setHasChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [mounted, setMounted] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="min-h-screen bg-[#F9F6F0]" />
  }

  const handleUpdate = (path: string, value: any) => {
    setHasChanges(true)
    setData((prev: any) => {
      const newData = JSON.parse(JSON.stringify(prev || {}))
      const keys = path.replace(/\]/g, '').split(/[.\[]/).filter(Boolean)
      let current = newData
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i]
        const nextKey = keys[i + 1]
        if (current[key] === undefined || current[key] === null) {
          current[key] = isNaN(Number(nextKey)) ? {} : []
        }
        current = current[key]
      }
      current[keys[keys.length - 1]] = value
      return newData
    })
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const { error } = await supabase
        .from('landing_pages')
        .update({ content_json: data })
        .eq('id', business.landing_page_id || business.id)

      if (error) throw error
      setHasChanges(false)
      alert('Đã lưu thay đổi thành công!')
    } catch (error: any) {
      alert('Lỗi khi lưu: ' + error.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    if (hasChanges && !confirm('Bạn có chắc muốn hủy các thay đổi chưa lưu?')) return
    setData(business.content_json)
    setHasChanges(false)
    if (isEditMode) window.location.href = window.location.pathname
  }

  const props = {
    data: data,
    isEditing: isEditMode,
    onUpdate: handleUpdate,
    businessInfo: {
      id: business.business_id || business.id,
      name: business.business_name,
      category: business.category,
      district: business.district || business.location_district,
      city: business.city || business.location_city,
      zalo: business.zalo_phone || business.zalo,
      hotline: business.hotline,
      slug: business.business_slug,
      logo_url: business.logo_url
    }
  }

  const slug = business.business_slug || ''

  const demoTemplates = [
    {
      slug: 'medical-01',
      name: 'Modern Medical',
      field: 'Phòng Khám Thẩm Mỹ / Clinic',
      url: '/p/medical-01'
    },
    {
      slug: 'dental-01',
      name: 'Dental Care',
      field: 'Nha Khoa Thẩm Mỹ',
      url: '/p/dental-01'
    },
    {
      slug: 'beauty-01',
      name: 'Haute Couture Beauty',
      field: 'Beauty Salon & Studio Sắc Đẹp',
      url: '/p/beauty-01'
    },
    {
      slug: 'spa-01',
      name: 'Luxury Spa Zen',
      field: 'Spa & Trị Liệu Chữa Lành 5 Sao',
      url: '/p/spa-01'
    },
    {
      slug: 'royal-01',
      name: 'Royal Classic',
      field: 'Thẩm Mỹ Viện Cổ Điển',
      url: '/p/royal-01'
    },
    {
      slug: 'campaign-01',
      name: 'Exclusive Flash Campaign',
      field: 'Chiến Dịch Săn Deal & Khuyến Mãi',
      url: '/p/campaign-01'
    }
  ]

  const activeDemo = demoTemplates.find(t => t.slug === slug)

  const renderTemplate = () => {
    // Explicit 6-business mapping for consistent demo pages
    if (slug === 'medical-01') {
      return <ModernMedical {...props} />
    }
    if (slug === 'dental-01') {
      return <DentalCare {...props} />
    }
    if (slug === 'beauty-01') {
      return <HauteCoutureBeauty {...props} />
    }
    if (slug === 'spa-01') {
      return <LuxurySpaZen {...props} />
    }
    if (slug === 'royal-01') {
      return <RoyalClassic {...props} />
    }
    if (slug === 'campaign-01') {
      return <SeasonalEvent {...props} />
    }

    // Default fallbacks based on template_id or category
    const templateId = business.template_id
    const category = business.category?.toLowerCase() || ''
    
    if (templateId === 'haute_couture_beauty_01' || category === 'beauty') {
      return <HauteCoutureBeauty {...props} />
    }

    switch (templateId) {
      case 'modern_medical_01':
        return <ModernMedical {...props} />
      case 'seasonal_event_01':
        return <SeasonalEvent {...props} />
      case 'dental_care_01':
        return <DentalCare {...props} />
      case 'royal_classic_01':
        return <RoyalClassic {...props} />
      case 'luxury_spa_zen_01':
      default:
        return <LuxurySpaZen {...props} />
    }
  }

  return (
    <>
      {isEditMode && (
        <EditorToolbar 
          onSave={handleSave} 
          onCancel={handleCancel} 
          isSaving={isSaving} 
          hasChanges={hasChanges} 
        />
      )}
      {renderTemplate()}

      {/* FLOATING TEMPLATE SELECTOR & INFO BADGE FOR ALL DEMO PAGES */}
      {activeDemo && (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col sm:flex-row items-center gap-4 bg-[#0A0A0A]/95 border border-[#E0A96D]/30 p-4 rounded-2xl backdrop-blur-md shadow-[0_15px_50px_rgba(0,0,0,0.6)] text-white select-none max-w-lg transition-all duration-300 hover:border-[#E0A96D]/60">
          <div className="text-left space-y-1 pr-4 border-b sm:border-b-0 sm:border-r border-white/10 pb-2 sm:pb-0">
            <span className="text-[8px] font-mono tracking-[0.3em] uppercase text-[#E0A96D] font-bold block">Đang Hiển Thị</span>
            <h4 className="text-xs font-bold tracking-wide text-white">{activeDemo.name}</h4>
            <p className="text-[8px] text-white/50 font-mono tracking-wider uppercase">{activeDemo.field}</p>
          </div>
          
          <div className="flex flex-col gap-1">
            <span className="text-[8px] font-mono tracking-[0.2em] uppercase text-white/40 block w-full text-center sm:text-left mb-1">MẪU DEMO KHÁC:</span>
            <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start">
              {demoTemplates.map((t, idx) => {
                const isActive = t.slug === slug
                return (
                  <a
                    key={idx}
                    href={t.url}
                    className={`px-2.5 py-1.5 rounded-lg text-[9px] font-mono font-bold tracking-wider uppercase transition-all ${isActive ? 'bg-[#E0A96D] text-black shadow-md shadow-[#E0A96D]/20 scale-105 pointer-events-none' : 'bg-white/5 border border-white/10 hover:bg-white/15 text-white/80'}`}
                    title={`${t.name} - ${t.field}`}
                  >
                    {t.name.split(' ').map(w => w[0]).join('')}
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* TOP FLOATING CORNER INFO BADGE FOR CONSISTENT RECOGNITION */}
      {activeDemo && (
        <div className="fixed top-24 left-6 z-[9999] pointer-events-none hidden lg:block">
          <div className="bg-black/80 border border-[#E0A96D]/40 text-white px-4 py-2 rounded-xl backdrop-blur-md shadow-lg flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#E0A96D] animate-ping" />
            <span className="text-[9px] font-mono tracking-widest uppercase text-[#E0A96D]">
              Mẫu: <strong className="text-white">{activeDemo.name}</strong> • Lĩnh vực: <strong className="text-white">{activeDemo.field}</strong>
            </span>
          </div>
        </div>
      )}
    </>
  )
}
