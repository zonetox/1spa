'use client'
import toast from 'react-hot-toast';

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { EditorToolbar } from '@/components/editor/EditorToolbar'
import { UniversalTemplate } from '@/components/templates/v7-core/UniversalTemplate'
import { ImagePickerModal } from '@/components/editor/ImagePickerModal'
import { CATEGORY_DEFAULTS, CATEGORY_COLORS } from '@/lib/constants'

import { LandingPageData, BusinessCategory } from '@/types/landing-page'

interface WrapperProps {
  business: any
  isEditMode: boolean
}

export default function LandingPageWrapper({ business, isEditMode }: WrapperProps) {
  const [data, setData] = useState<LandingPageData>(business.content_json || {})
  const [hasChanges, setHasChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  // Image Picker State
  const [isPickerOpen, setIsPickerOpen] = useState(false)
  const [activeImagePath, setActiveImagePath] = useState('')
  const [activeImageUrl, setActiveImageUrl] = useState('')

  const supabase = createClient()

  useEffect(() => {
    setMounted(true)
    
    // Track View Analytics
    const trackView = async () => {
      if (!isEditMode && business.business_id) {
        await supabase.from('analytics_events').insert({
          business_id: business.business_id,
          event_type: 'view',
          page_slug: business.business_slug,
          referrer: typeof document !== 'undefined' ? document.referrer : null
        })
      }
    }
    trackView()
  }, [])

  if (!mounted) {
    return <div className="min-h-screen bg-background" />
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
      toast.success('Đã lưu thay đổi thành công!')
    } catch (error: any) {
      toast('Lỗi khi lưu: ' + error.message)
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
    },
    onImagePick: (path: string, currentUrl: string) => {
      setActiveImagePath(path)
      setActiveImageUrl(currentUrl)
      setIsPickerOpen(true)
    }
  }

  const slug = business.business_slug || ''

  const demoTemplates = [
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
    }
  ]

  const activeDemo = demoTemplates.find(t => t.slug === slug)

  const renderTemplate = () => {
    // 1. Data Validation Check
    const hasEnoughData = (
      data.hero_section?.hero_title ||
      data.about_us?.intro_text ||
      (data.services_menu && data.services_menu.length > 0)
    )

    if (!hasEnoughData && !isEditMode) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
          <div className="text-center space-y-4 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto text-2xl">
              🚧
            </div>
            <h2 className="text-xl font-bold text-gray-800">Landing Page Đang Xây Dựng</h2>
            <p className="text-gray-500 max-w-sm mx-auto">
              {business.business_name} đang trong quá trình hoàn thiện nội dung. 
              Vui lòng quay lại sau!
            </p>
          </div>
        </div>
      )
    }

    // 2. Render Engine (V7 Smart Universal Core)
    const categoryRaw = (business.category || 'Spa') as any
    const pillar = (['Spa', 'Beauty', 'Dental'].includes(categoryRaw) ? categoryRaw : 'Spa') as 'Spa' | 'Beauty' | 'Dental'
    
    // Inject industry-specific defaults if not present in content_json
    const industryDefaults = CATEGORY_DEFAULTS[pillar] || CATEGORY_DEFAULTS.Spa
    const industryTheme = CATEGORY_COLORS[pillar] || CATEGORY_COLORS.Spa

    return (
      <UniversalTemplate 
        {...props} 
        defaults={{
          ...industryDefaults,
          themeColor: industryTheme
        }} 
      />
    )
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

      <ImagePickerModal 
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        currentUrl={activeImageUrl}
        onSelect={(url) => {
          handleUpdate(activeImagePath, url)
          setIsPickerOpen(false)
        }}
      />
    </>
  )
}
