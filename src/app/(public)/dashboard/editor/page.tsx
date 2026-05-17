'use client'
import toast from 'react-hot-toast';

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Save, Eye, ChevronLeft, CreditCard, Globe, FileText,
  Monitor, Smartphone, Loader2, Check, AlertCircle, Settings, Plus
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { SectionManager } from '@/components/editor/SectionManager'
import { ImagePickerModal } from '@/components/editor/ImagePickerModal'
import { AddSectionModal } from '@/components/editor/AddSectionModal'
import { PaymentPopup } from '@/components/ui/PaymentPopup'

import { UniversalTemplate } from '@/components/templates/v7-core/UniversalTemplate'

// Derive section order from content_json keys (deterministic)
const DEFAULT_SECTION_ORDER = [
  'hero_section', 'about_us', 'services_menu', 'social_trust',
  'gallery', 'testimonials', 'video_intro', 'pricing_table',
  'team', 'faq', 'cta_banner', 'custom_text', 'contact_info', 'operating_hours'
]

const COLOR_PRESETS = [
  { name: 'Medical Cyan', color: '#00E5FF' },
  { name: 'Royal Gold', color: '#D4AF37' },
  { name: 'Spa Green', color: '#2D5A27' },
  { name: 'Beauty Pink', color: '#FFB6C1' },
  { name: 'Luxury Black', color: '#1A1A1A' },
  { name: 'Ocean Blue', color: '#0077B6' },
]

function getSectionOrder(data: any): string[] {
  if (!data) return []
  const keys = Object.keys(data)
  const ordered = DEFAULT_SECTION_ORDER.filter(k => keys.includes(k))
  const extra = keys.filter(k => !DEFAULT_SECTION_ORDER.includes(k))
  return [...ordered, ...extra]
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'
type ViewMode = 'edit' | 'preview'
type DeviceMode = 'desktop' | 'mobile'

export default function EditorPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('edit')
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop')
  const [profile, setProfile] = useState<any>(null)
  const [landingPage, setLandingPage] = useState<any>(null)
  const [draftData, setDraftData] = useState<any>(null)       // what we're editing
  const [publishedData, setPublishedData] = useState<any>(null) // what's currently live
  const [currentTemplate, setCurrentTemplate] = useState('UniversalTemplate')
  const [draftStatus, setDraftStatus] = useState<'Draft' | 'Published'>('Published')
  const [sectionOrder, setSectionOrder] = useState<string[]>([])
  const [hiddenSections, setHiddenSections] = useState<string[]>([])
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const [publishStatus, setPublishStatus] = useState<SaveStatus>('idle')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)
  const [imagePickerConfig, setImagePickerConfig] = useState<{
    isOpen: boolean; path: string; currentUrl: string
  }>({ isOpen: false, path: '', currentUrl: '' })

  const supabase = createClient()
  const router = useRouter()

  // ── Load Data ──────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: prof } = await supabase
        .from('business_profiles')
        .select('*')
        .eq('account_id', user.id)
        .single()

      if (!prof) return
      setProfile(prof)

      const { data: lp } = await supabase
        .from('landing_pages')
        .select('*')
        .eq('business_id', prof.id)
        .single()

      if (lp) {
        setLandingPage(lp)
        setCurrentTemplate(lp.template_id || 'UniversalTemplate')
        setPublishedData(lp.content_json || {})

        // Load draft_json if available, otherwise start from content_json
        const draft = lp.draft_json || lp.content_json || {}
        setDraftData(draft)
        setDraftStatus(lp.status || 'Published')
        setSectionOrder(getSectionOrder(draft))
      }
    }
    load()
  }, [])

  // ── Update Handler ─────────────────────────────────────────
  const handleUpdate = useCallback((path: string, value: any) => {
    setHasUnsavedChanges(true)
    setDraftData((prev: any) => {
      const next = JSON.parse(JSON.stringify(prev || {}))
      const keys = path.replace(/\]/g, '').split(/[.[]/).filter(Boolean)
      let cur = next
      for (let i = 0; i < keys.length - 1; i++) {
        const k = keys[i]
        const nk = keys[i + 1]
        if (cur[k] === undefined || cur[k] === null) {
          cur[k] = isNaN(Number(nk)) ? {} : []
        }
        cur = cur[k]
      }
      cur[keys[keys.length - 1]] = value
      return next
    })
  }, [])

  // ── Image Picker ───────────────────────────────────────────
  const openImagePicker = useCallback((path: string, currentUrl: string) => {
    setImagePickerConfig({ isOpen: true, path, currentUrl })
  }, [])

  const handleImageSelect = useCallback((url: string) => {
    handleUpdate(imagePickerConfig.path, url)
  }, [imagePickerConfig.path, handleUpdate])

  // ── Section Management ─────────────────────────────────────
  const handleMoveSection = useCallback((key: string, dir: 'up' | 'down') => {
    setSectionOrder(prev => {
      const idx = prev.indexOf(key)
      if (idx === -1) return prev
      const next = [...prev]
      const target = dir === 'up' ? idx - 1 : idx + 1
      if (target < 0 || target >= next.length) return prev;
      [next[idx], next[target]] = [next[target], next[idx]]
      return next
    })
    setHasUnsavedChanges(true)
  }, [])

  const handleToggleHide = useCallback((key: string) => {
    setHiddenSections(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    )
    setHasUnsavedChanges(true)
  }, [])

  const handleDeleteSection = useCallback((key: string) => {
    setSectionOrder(prev => prev.filter(k => k !== key))
    setDraftData((prev: any) => {
      const next = { ...prev }
      delete next[key]
      return next
    })
    setHasUnsavedChanges(true)
  }, [])

  const handleAddSection = useCallback((sectionType: string, defaultContent: any) => {
    setDraftData((prev: any) => ({
      ...prev,
      [sectionType]: defaultContent
    }))
    setSectionOrder(prev => {
      if (prev.includes(sectionType)) return prev
      // Insert before contact_info if it exists, otherwise at end
      const ciIdx = prev.indexOf('contact_info')
      if (ciIdx !== -1) {
        const next = [...prev]
        next.splice(ciIdx, 0, sectionType)
        return next
      }
      return [...prev, sectionType]
    })
    setHasUnsavedChanges(true)
    setActiveSection(sectionType)
  }, [])

  // ── Save Draft ─────────────────────────────────────────────
  const handleSaveDraft = async () => {
    if (!landingPage) return
    setSaveStatus('saving')
    try {
      const { error } = await supabase
        .from('landing_pages')
        .update({
          draft_json: draftData,
          template_id: currentTemplate,
          updated_at: new Date().toISOString()
          // NOTE: content_json NOT touched — live page unaffected
        })
        .eq('id', landingPage.id)

      if (error) throw error
      setHasUnsavedChanges(false)
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 3000)
    } catch (err: any) {
      setSaveStatus('error')
      console.error('Save draft error:', err.message)
      setTimeout(() => setSaveStatus('idle'), 4000)
    }
  }

  // ── Publish ────────────────────────────────────────────────
  const handlePublish = async () => {
    if (!landingPage) return
    if (!confirm('Xuất bản thay đổi? Trang công khai sẽ được cập nhật ngay.')) return
    setPublishStatus('saving')
    try {
      const { error } = await supabase
        .from('landing_pages')
        .update({
          content_json: draftData,   // push draft → live
          draft_json: draftData,
          template_id: currentTemplate,
          status: 'Published',
          is_published: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', landingPage.id)

      if (error) throw error
      setPublishedData(draftData)
      setDraftStatus('Published')
      setHasUnsavedChanges(false)
      setPublishStatus('saved')
      setTimeout(() => setPublishStatus('idle'), 3000)
    } catch (err: any) {
      setPublishStatus('error')
      setTimeout(() => setPublishStatus('idle'), 4000)
    }
  }

  // ── Loading ────────────────────────────────────────────────
  if (!draftData || !profile) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#F9F6F0] gap-4">
        <div className="w-8 h-8 border-2 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin" />
        <p className="text-xs font-bold text-[#2F2F2F]/40 uppercase tracking-widest">Đang tải Editor...</p>
      </div>
    )
  }

  const ActiveTemplate = UniversalTemplate

  // Build a data view respecting section order and hidden sections
  const orderedData = sectionOrder.reduce((acc: any, key: string) => {
    if (!hiddenSections.includes(key) && draftData[key] !== undefined) {
      acc[key] = draftData[key]
    }
    return acc
  }, {} as Record<string, any>)
  // Also include any keys not yet in sectionOrder
  Object.keys(draftData).forEach(key => {
    if (!(key in orderedData) && !hiddenSections.includes(key)) {
      orderedData[key] = draftData[key]
    }
  })

  const businessInfo = {
    id: profile?.id,
    name: profile?.business_name,
    category: profile?.category,
    district: profile?.location_district,
    city: profile?.location_city,
    zalo: profile?.zalo_phone,
    hotline: profile?.hotline,
    slug: profile?.slug,
    logo_url: profile?.logo_url
  }

  return (
    <div className="h-screen flex flex-col bg-[#F9F6F0] overflow-hidden" style={{ paddingTop: '80px' }}>

      {/* ── TOP BAR ──────────────────────────────────────── */}
      <header className="h-14 bg-white border-b border-[#D4AF37]/10 flex items-center justify-between px-4 shrink-0 shadow-sm z-50">
        {/* Left: Back + Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (hasUnsavedChanges && !confirm('Bạn có thay đổi chưa lưu. Thoát không?')) return
              router.push('/dashboard')
            }}
            className="p-2 rounded-full hover:bg-[#D4AF37]/10 text-[#2F2F2F]/40 hover:text-[#D4AF37] transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <div>
            <p className="text-sm font-bold text-[#2F2F2F] leading-none">{profile?.business_name}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`w-1.5 h-1.5 rounded-full ${draftStatus === 'Published' ? 'bg-emerald-500' : 'bg-amber-400'}`} />
              <p className="text-[9px] font-bold uppercase tracking-widest text-[#2F2F2F]/40">
                {hasUnsavedChanges ? '● Chưa lưu' : draftStatus === 'Published' ? 'Đang public' : 'Bản nháp'}
              </p>
            </div>
          </div>
        </div>

        {/* Center: Edit / Preview + Device toggle */}
        <div className="flex items-center gap-3">
          <div className="bg-[#F9F6F0] p-0.5 rounded-full flex border border-[#D4AF37]/15">
            <button
              onClick={() => setViewMode('edit')}
              className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${viewMode === 'edit' ? 'bg-[#D4AF37] text-white shadow-sm' : 'text-[#2F2F2F]/50 hover:text-[#2F2F2F]'}`}
            >
              Chỉnh sửa
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${viewMode === 'preview' ? 'bg-[#D4AF37] text-white shadow-sm' : 'text-[#2F2F2F]/50 hover:text-[#2F2F2F]'}`}
            >
              <Eye size={11} /> Xem trước
            </button>
          </div>

          {viewMode === 'preview' && (
            <div className="bg-[#F9F6F0] p-0.5 rounded-full flex border border-[#D4AF37]/15">
              <button
                onClick={() => setDeviceMode('desktop')}
                className={`px-3 py-1.5 rounded-full text-[10px] font-bold flex items-center gap-1 transition-all ${deviceMode === 'desktop' ? 'bg-white text-[#D4AF37] shadow-sm' : 'text-[#2F2F2F]/40'}`}
              >
                <Monitor size={11} /> Desktop
              </button>
              <button
                onClick={() => setDeviceMode('mobile')}
                className={`px-3 py-1.5 rounded-full text-[10px] font-bold flex items-center gap-1 transition-all ${deviceMode === 'mobile' ? 'bg-white text-[#D4AF37] shadow-sm' : 'text-[#2F2F2F]/40'}`}
              >
                <Smartphone size={11} /> Mobile
              </button>
            </div>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPaymentOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold text-[#D4AF37] border border-[#D4AF37]/30 rounded-full hover:bg-[#D4AF37]/5 transition-colors uppercase tracking-wider"
          >
            <CreditCard size={12} /> Premium
          </button>

          {/* Save Draft Button */}
          <button
            onClick={handleSaveDraft}
            disabled={saveStatus === 'saving' || !hasUnsavedChanges}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${
              saveStatus === 'saved'
                ? 'bg-emerald-500 text-white border-transparent'
                : saveStatus === 'error'
                ? 'bg-red-500 text-white border-transparent'
                : hasUnsavedChanges
                ? 'bg-[#2F2F2F] text-white border-transparent hover:bg-[#D4AF37]'
                : 'bg-[#F9F6F0] text-[#2F2F2F]/30 border-[#D4AF37]/10 cursor-not-allowed'
            }`}
          >
            {saveStatus === 'saving' ? <Loader2 size={12} className="animate-spin" /> :
             saveStatus === 'saved' ? <Check size={12} /> :
             saveStatus === 'error' ? <AlertCircle size={12} /> :
             <FileText size={12} />}
            {saveStatus === 'saved' ? 'Đã lưu!' : saveStatus === 'error' ? 'Lỗi!' : 'Lưu Nháp'}
          </button>

          {/* Publish Button */}
          <button
            onClick={handlePublish}
            disabled={publishStatus === 'saving'}
            className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all shadow-md ${
              publishStatus === 'saved'
                ? 'bg-emerald-600 text-white'
                : publishStatus === 'error'
                ? 'bg-red-600 text-white'
                : 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white hover:brightness-110 active:scale-95'
            }`}
          >
            {publishStatus === 'saving' ? <Loader2 size={12} className="animate-spin" /> :
             publishStatus === 'saved' ? <Check size={12} /> :
             <Globe size={12} />}
            {publishStatus === 'saved' ? 'Đã xuất bản!' : 'Xuất Bản'}
          </button>
        </div>
      </header>

      {/* ── MAIN BODY ────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* LEFT PANEL — Section Manager (only in edit mode) */}
        <AnimatePresence>
          {viewMode === 'edit' && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 220, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white border-r border-[#D4AF37]/10 flex flex-col overflow-hidden shrink-0"
            >
              {/* Template Picker */}
              <div className="px-4 pt-4 pb-3 border-b border-[#D4AF37]/10">
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#D4AF37] mb-2">Template</p>
                <div className="w-full bg-[#F9F6F0] border border-[#D4AF37]/20 rounded-lg px-3 py-2 text-xs font-bold text-[#2F2F2F]">
                  Universal V7 Core
                </div>
              </div>

              {/* Draft Status Warning */}
              {hasUnsavedChanges && (
                <div className="mx-3 mt-3 px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl">
                  <p className="text-[9px] font-bold text-amber-700 leading-snug">
                    ● Có thay đổi chưa lưu. Trang public KHÔNG bị ảnh hưởng cho đến khi bạn nhấn Xuất Bản.
                  </p>
                </div>
              )}

              {/* Theme Color Picker */}
              <div className="px-4 py-3 border-b border-[#D4AF37]/10">
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#D4AF37] mb-3">Màu sắc thương hiệu</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {COLOR_PRESETS.map((p) => (
                    <button
                      key={p.color}
                      onClick={() => handleUpdate('theme_color', p.color)}
                      className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${draftData.theme_color === p.color ? 'border-[#D4AF37] scale-110 shadow-sm' : 'border-transparent opacity-60'}`}
                      style={{ backgroundColor: p.color }}
                      title={p.name}
                    />
                  ))}
                  {/* Custom color input trigger */}
                  <div className="relative">
                    <input
                      type="color"
                      value={draftData.theme_color || '#00E5FF'}
                      onChange={(e) => handleUpdate('theme_color', e.target.value)}
                      className="w-6 h-6 rounded-full overflow-hidden border-2 border-transparent cursor-pointer opacity-60 hover:opacity-100 transition-opacity"
                    />
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-hidden mt-2">
                <SectionManager
                  sections={sectionOrder}
                  hiddenSections={hiddenSections}
                  onMoveUp={(key) => handleMoveSection(key, 'up')}
                  onMoveDown={(key) => handleMoveSection(key, 'down')}
                  onToggleHide={handleToggleHide}
                  onDelete={handleDeleteSection}
                  onAddSection={handleAddSection}
                  activeSection={activeSection}
                  onSelectSection={setActiveSection}
                />
              </div>

              {/* Live Page Link */}
              <div className="px-4 py-3 border-t border-[#D4AF37]/10">
                <a
                  href={`/p/${profile?.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[9px] font-bold text-[#D4AF37] hover:text-[#B8860B] transition-colors uppercase tracking-widest"
                >
                  <Globe size={11} />
                  Xem trang đang public
                </a>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* CENTER — Canvas */}
        <main className="flex-1 overflow-y-auto bg-[#EFEFEF] relative">
          {/* Preview mode banner */}
          {viewMode === 'preview' && (
            <div className="sticky top-0 z-20 bg-[#2F2F2F]/90 backdrop-blur-sm text-white text-center py-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">
                👁 CHẾ ĐỘ XEM TRƯỚC — Đây là bản Nháp (chưa public)
              </p>
            </div>
          )}

          {/* Device frame wrapper */}
          <div
            className={`transition-all duration-300 ${
              viewMode === 'preview' && deviceMode === 'mobile'
                ? 'max-w-[390px] mx-auto my-6 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-[#2F2F2F]/20'
                : viewMode === 'edit'
                ? 'w-full'
                : 'w-full'
            }`}
          >
            <ActiveTemplate
              data={draftData}
              isEditing={viewMode === 'edit'}
              onUpdate={handleUpdate}
              onImagePick={openImagePicker}
              businessInfo={businessInfo}
              hiddenSections={hiddenSections}
              sectionOrder={sectionOrder}
              activeSection={activeSection}
              onSectionClick={setActiveSection}
            />
          </div>
        </main>
      </div>

      {/* Image Picker Modal */}
      <ImagePickerModal
        isOpen={imagePickerConfig.isOpen}
        onClose={() => setImagePickerConfig(prev => ({ ...prev, isOpen: false }))}
        onSelect={handleImageSelect}
        currentUrl={imagePickerConfig.currentUrl}
      />

      {/* Payment Modal */}
      <PaymentPopup
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        onConfirm={() => {
          toast('Yêu cầu nâng cấp đã được gửi. Admin sẽ xác nhận trong 1-2 giờ.')
          setIsPaymentOpen(false)
        }}
        planName="GÓI CÔNG TY (PREMIUM)"
        amount="500.000 VNĐ / Tháng"
      />
    </div>
  )
}
