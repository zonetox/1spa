'use client'
import toast from 'react-hot-toast';

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { 
  Database, 
  FileSpreadsheet, 
  UploadCloud, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  Play, 
  Copy, 
  Edit,
  Eye, 
  Globe, 
  UserCheck, 
  Sparkles,
  TrendingUp,
  ShieldCheck
} from 'lucide-react'

export default function AdminImportPage() {
  const supabase = createClient()
  
  // Metrics states
  const [metrics, setMetrics] = useState({
    totalBusinesses: 0,
    draftPages: 0,
    publishedPages: 0,
    trialAccounts: 0,
    premiumAccounts: 0
  })

  // Stepper states
  const [activeStep, setActiveStep] = useState(1)
  const [rawData, setRawData] = useState('')
  const [parsedItems, setParsedItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Progress states
  const [currentIndex, setCurrentIndex] = useState(0)
  const [importLogs, setImportLogs] = useState<string[]>([])
  const [finalReport, setFinalReport] = useState<any[]>([])

  // Quick Edit Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingPartnerIdx, setEditingPartnerIdx] = useState<number | null>(null)
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    category: 'Spa',
    district: '',
    zalo: ''
  })
  const [isSavingEdit, setIsSavingEdit] = useState(false)

  useEffect(() => {
    async function checkAdmin() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        window.location.href = '/login'
        return
      }
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
        
      if (profile?.role?.toLowerCase() !== 'admin') {
        window.location.href = '/dashboard'
        return
      }
      
      fetchMetrics()
    }
    checkAdmin()
  }, [])

  const fetchMetrics = async () => {
    try {
      const { count: total } = await supabase.from('business_profiles').select('*', { count: 'exact', head: true })
      const { count: drafts } = await supabase.from('landing_pages').select('*', { count: 'exact', head: true }).or('is_published.eq.false,status.eq.Draft')
      const { count: published } = await supabase.from('landing_pages').select('*', { count: 'exact', head: true }).or('is_published.eq.true,status.eq.Published')
      const { count: trials } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('subscription_status', 'trial')
      const { count: premiums } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('subscription_status', 'active')

      setMetrics({
        totalBusinesses: total || 0,
        draftPages: drafts || 0,
        publishedPages: published || 0,
        trialAccounts: trials || 0,
        premiumAccounts: premiums || 0
      })
    } catch (err) {
      console.error('Error fetching dashboard metrics:', err)
    }
  }

  // 1. Dynamic CSV Template Exporter (37 Headers matching CTO standard)
  const downloadCSVTemplate = () => {
    const headers = [
      'business_name', 'category', 'email_owner', 'zalo_phone', 'hotline', 'slug',
      'city', 'district', 'address_full', 'latitude', 'longitude', 'map_embed_url',
      'hero_title', 'hero_subtitle', 'hero_video_url', 'hero_slide_1', 'hero_slide_2', 'hero_slide_3',
      'about_intro', 'experience_years', 'about_video_url',
      'sv_1_name', 'sv_1_price', 'sv_1_desc', 'sv_1_img',
      'sv_2_name', 'sv_2_price', 'sv_2_desc', 'sv_2_img',
      'sv_3_name', 'sv_3_price', 'sv_3_desc', 'sv_3_img',
      'sv_4_name', 'sv_4_price', 'sv_4_desc', 'sv_4_img',
      'sv_5_name', 'sv_5_price', 'sv_5_desc', 'sv_5_img',
      'sv_6_name', 'sv_6_price', 'sv_6_desc', 'sv_6_img',
      'time_mon', 'time_tue', 'time_wed', 'time_thu', 'time_fri', 'time_sat', 'time_sun',
      'fb_link', 'tiktok_link'
    ]

    const sampleRow = [
      'Viện Thẩm Mỹ Hoàng Gia Luxury', 'Spa', 'owner@hoanggialuxury.vn', '0901234567', '1900 8888', 'vien-tham-my-hoang-gia-luxury-q1',
      'TP. Hồ Chí Minh', 'Quận 1', '123 Lê Lợi, Phường Bến Thành, Quận 1', '10.7769', '106.7009', 'https://www.google.com/maps/embed?...',
      'Nâng Tầm Nhan Sắc - Kiến Tạo Tương Lai', 'Trải nghiệm dịch vụ làm đẹp đẳng cấp 5 sao với công nghệ độc quyền từ Thụy Sĩ.', '', 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8', 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c', 'https://images.unsplash.com/photo-1600334129128-685c5582fd35',
      'Với hơn 10 năm hình thành và phát triển, chúng tôi tự hào là đơn vị dẫn đầu.', '10+', '',
      'Nâng Cơ Trẻ Hóa Ultherapy', '25.000.000đ', 'Sử dụng sóng siêu âm hội tụ vi điểm để nâng cơ.', 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9',
      'Trị Nám Công Nghệ Picosure', '15.000.000đ', 'Đánh bay nám mảng, nám sâu tận gốc.', 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c',
      '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
      '08:00 - 20:00', '08:00 - 20:00', '08:00 - 20:00', '08:00 - 20:00', '08:00 - 20:00', '08:00 - 21:00', '09:00 - 18:00',
      'fb.com/hoanggialuxury', 'tiktok.com/@hoanggialuxury'
    ]

    const csvContent = [headers.join(','), sampleRow.join(',')].join('\n')
    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "1Beauty_Bulk_Import_Template.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // 2. Client-side Flat CSV/Pasted text Parser to JSON Master Format
  const handleParseAndPreview = () => {
    setError(null)
    if (!rawData.trim()) {
      setError('Vui lòng dán dữ liệu hoặc upload file!')
      return
    }

    try {
      // Check if it's JSON or CSV
      if (rawData.trim().startsWith('[')) {
        const parsed = JSON.parse(rawData)
        setParsedItems(parsed)
        setActiveStep(2)
        return
      }

      // Parse CSV với cơ chế nhận diện chuỗi trong dấu ngoặc kép (tránh lỗi ngắt dấu phẩy ở địa chỉ, mô tả)
      const parseCSVLine = (text: string): string[] => {
        const result: string[] = []
        let insideQuote = false
        let currentVal = ''
        for (let i = 0; i < text.length; i++) {
          const char = text[i]
          if (char === '"') {
            insideQuote = !insideQuote
          } else if (char === ',' && !insideQuote) {
            result.push(currentVal.trim())
            currentVal = ''
          } else {
            currentVal += char
          }
        }
        result.push(currentVal.trim())
        return result
      }

      const lines = rawData.split('\n').map(line => line.trim()).filter(line => line.length > 0)
      if (lines.length < 2) {
        throw new Error('Dữ liệu CSV không đúng định dạng hoặc thiếu các dòng dữ liệu.')
      }

      const headers = parseCSVLine(lines[0]).map(h => h.replace(/"/g, '').trim())
      const items = []

      for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]).map(v => v.replace(/"/g, '').trim())
        const row: any = {}
        headers.forEach((h, idx) => {
          row[h] = values[idx] || ''
        })

        if (!row.business_name || !row.category || !row.email_owner) continue

        // Map into full-option JSON Master Schema
        const content_json = {
          hero_section: {
            hero_title: row.hero_title || `Chào mừng tới ${row.business_name}`,
            hero_subtitle: row.hero_subtitle || 'Dịch vụ đẳng cấp chuyên nghiệp',
            hero_video_url: row.hero_video_url || '',
            hero_slides: [row.hero_slide_1, row.hero_slide_2, row.hero_slide_3].filter(Boolean)
          },
          about_us: {
            intro_text: row.about_intro || `Chúng tôi tự hào là đơn vị hàng đầu lĩnh vực ${row.category}.`,
            experience_years: row.experience_years || '5+',
            video_intro_url: row.about_video_url || ''
          },
          services_menu: [
            { service_name: row.sv_1_name, price: row.sv_1_price, description: row.sv_1_desc, image_url: row.sv_1_img },
            { service_name: row.sv_2_name, price: row.sv_2_price, description: row.sv_2_desc, image_url: row.sv_2_img },
            { service_name: row.sv_3_name, price: row.sv_3_price, description: row.sv_3_desc, image_url: row.sv_3_img },
            { service_name: row.sv_4_name, price: row.sv_4_price, description: row.sv_4_desc, image_url: row.sv_4_img },
            { service_name: row.sv_5_name, price: row.sv_5_price, description: row.sv_5_desc, image_url: row.sv_5_img },
            { service_name: row.sv_6_name, price: row.sv_6_price, description: row.sv_6_desc, image_url: row.sv_6_img }
          ].filter(s => s.service_name),
          contact_info: {
            zalo_link: `https://zalo.me/${row.zalo_phone || ''}`,
            hotline: row.hotline || row.zalo_phone || '',
            email: row.email_owner,
            address_full: row.address_full,
            google_map_embed_code: row.map_embed_url || ''
          },
          operating_hours: {
            mon: row.time_mon || '08:00 - 20:00',
            tue: row.time_tue || '08:00 - 20:00',
            wed: row.time_wed || '08:00 - 20:00',
            thu: row.time_thu || '08:00 - 20:00',
            fri: row.time_fri || '08:00 - 20:00',
            sat: row.time_sat || '08:00 - 21:00',
            sun: row.time_sun || '09:00 - 18:00'
          },
          social_trust: {
            rating_count: Math.floor(Math.random() * 40) + 10,
            social_links: { facebook: row.fb_link || '', tiktok: row.tiktok_link || '' }
          }
        }

        items.push({
          business_name: row.business_name,
          category: row.category,
          email_owner: row.email_owner,
          zalo: row.zalo_phone || '',
          location_city: row.city || 'TP. Hồ Chí Minh',
          location_district: row.district || '',
          address: row.address_full || '',
          slug: row.slug || '',
          content_json
        })
      }

      if (items.length === 0) {
        throw new Error('Không tìm thấy dòng hợp lệ nào để Import.')
      }

      setParsedItems(items)
      setActiveStep(2)
    } catch (err: any) {
      setError(err.message || 'Lỗi xử lý file hoặc cú pháp dữ liệu.')
    }
  }

  // 3. Step-by-step Batch Import Executor with Progress bar
  const runIngestionProcess = async () => {
    setActiveStep(3)
    setLoading(true)
    setImportLogs([])
    setFinalReport([])

    const report: any[] = []

    for (let i = 0; i < parsedItems.length; i++) {
      const item = parsedItems[i]
      setCurrentIndex(i)
      const logMsg = `Đang nạp đối tác (${i + 1}/${parsedItems.length}): ${item.business_name}...`
      setImportLogs(prev => [...prev, logMsg])

      try {
        const response = await fetch('/api/admin/bulk-import', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify([item])
        })

        const result = await response.json()
        if (result.results && result.results[0]) {
          const res = result.results[0]
          report.push({
            name: item.business_name,
            email: item.email_owner,
            slug: res.slug,
            status: res.status,
            category: item.category || 'Spa',
            district: item.district || item.location_district || '',
            zalo: item.zalo_phone || '',
            message: res.message || '',
            isPublished: false,
            isHandedOver: false
          })
          setImportLogs(prev => [...prev, `✓ Đã nạp thành công: ${item.business_name} (Slug: ${res.slug})`])
        } else {
          throw new Error('API trả về kết quả trống')
        }
      } catch (err: any) {
        report.push({
          name: item.business_name,
          email: item.email_owner,
          slug: '',
          status: 'error',
          message: err.message || 'Lỗi nạp'
        })
        setImportLogs(prev => [...prev, `❌ Lỗi nạp ${item.business_name}: ${err.message || 'Lỗi kết nối'}`])
      }

      // Brief sleep for smooth progress animation
      await new Promise(resolve => setTimeout(resolve, 250))
    }

    setFinalReport(report)
    setLoading(false)
    fetchMetrics() // Update dashboard stats
  }

  const handleCopyLink = (slug: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/p/${slug}`)
    toast('Đã copy link Landing Page đối tác!')
  }

  const togglePagePublished = async (idx: number, slug: string, currentVal: boolean) => {
    try {
      const { data: business } = await supabase
        .from('business_profiles')
        .select('id')
        .eq('slug', slug)
        .single()

      if (business) {
        const { error } = await supabase
          .from('landing_pages')
          .update({ 
            is_published: !currentVal,
            status: !currentVal ? 'Published' : 'Draft'
          })
          .eq('business_id', business.id)

        if (error) throw error

        setFinalReport(prev => prev.map((item, i) => i === idx ? { ...item, isPublished: !currentVal } : item))
        fetchMetrics()
      }
    } catch (err: any) {
      toast('Lỗi cập nhật trạng thái: ' + err.message)
    }
  }

  const handleOpenEditModal = (idx: number, item: any) => {
    setEditingPartnerIdx(idx)
    setEditForm({
      name: item.name || '',
      email: item.email || '',
      category: item.category || 'Spa',
      district: item.district || '',
      zalo: item.zalo || ''
    })
    setIsEditModalOpen(true)
  }

  const handleSaveEdit = async () => {
    if (editingPartnerIdx === null) return
    setIsSavingEdit(true)
    try {
      const partner = finalReport[editingPartnerIdx]
      
      const { data: business, error: findErr } = await supabase
        .from('business_profiles')
        .select('id, account_id')
        .eq('slug', partner.slug)
        .single()

      if (findErr) throw findErr

      const { error: bpErr } = await supabase
        .from('business_profiles')
        .update({
          business_name: editForm.name,
          category: editForm.category,
          location_district: editForm.district,
          zalo_phone: editForm.zalo
        })
        .eq('id', business.id)

      if (bpErr) throw bpErr

      if (business.account_id) {
        const { error: profErr } = await supabase
          .from('profiles')
          .update({
            email: editForm.email
          })
          .eq('id', business.account_id)

        if (profErr) throw profErr
      }

      setFinalReport(prev => prev.map((item, i) => i === editingPartnerIdx ? {
        ...item,
        name: editForm.name,
        email: editForm.email,
        category: editForm.category,
        district: editForm.district,
        zalo: editForm.zalo
      } : item))

      toast.success('Đồng bộ dữ liệu cập nhật thành công lên hệ thống!')
      setIsEditModalOpen(false)
    } catch (err: any) {
      toast('Đồng bộ thất bại: ' + err.message)
    } finally {
      setIsSavingEdit(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#0d0d0f] text-zinc-300 pt-32 pb-24 px-6 relative overflow-hidden selection:bg-[#D4AF37]/20">
      
      {/* Decorative luxury glowing backgrounds */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-b from-[#D4AF37]/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-t from-zinc-900 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-12 relative z-10">
        
        {/* TOP TITLE HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#D4AF37] font-mono text-[10px] uppercase tracking-[0.4em]">
              <Database size={14} />
              <span>Hệ thống Quản trị Tối cao 1Beauty.Asia</span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl text-white italic">
              Import Center <span className="text-[#D4AF37]">Dashboard.</span>
            </h1>
          </div>
          <button 
            onClick={downloadCSVTemplate}
            className="bg-white/5 border border-[#D4AF37]/20 hover:border-[#D4AF37] text-white text-xs font-mono tracking-widest uppercase px-6 py-3.5 rounded-full flex items-center gap-2 transition-all hover:scale-105"
          >
            <Download size={14} className="text-[#D4AF37]" />
            Tải File Mẫu (.csv)
          </button>
        </div>

        {/* DASHBOARD STATS METRICS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-zinc-900/40 border border-white/5 p-6 rounded-3xl flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
              <Globe size={22} />
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Cơ sở đã nạp</p>
              <h4 className="text-2xl font-serif text-white mt-1">
                {metrics.totalBusinesses} <span className="text-xs text-zinc-500 font-sans font-normal">(Public: {metrics.publishedPages} | Nháp: {metrics.draftPages})</span>
              </h4>
            </div>
          </div>
          <div className="bg-zinc-900/40 border border-white/5 p-6 rounded-3xl flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-400">
              <TrendingUp size={22} />
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Gói dùng thử (Trial)</p>
              <h4 className="text-2xl font-serif text-white mt-1">{metrics.trialAccounts} cơ sở</h4>
            </div>
          </div>
          <div className="bg-zinc-900/40 border border-white/5 p-6 rounded-3xl flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-400">
              <ShieldCheck size={22} />
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Thành viên Premium</p>
              <h4 className="text-2xl font-serif text-white mt-1">{metrics.premiumAccounts} cơ sở</h4>
            </div>
          </div>
          <div className="bg-zinc-900/40 border border-white/5 p-6 rounded-3xl flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400">
              <UserCheck size={22} />
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Trạng thái bàn giao</p>
              <h4 className="text-2xl font-serif text-white mt-1">Sẵn sàng</h4>
            </div>
          </div>
        </div>

        {/* STEPPER WIZARD STEPS */}
        <div className="grid grid-cols-3 gap-4 border-b border-white/5 pb-8 max-w-xl">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full font-serif flex items-center justify-center text-xs ${activeStep >= s ? 'bg-[#D4AF37] text-black font-bold' : 'bg-white/5 text-zinc-500'}`}>
                {s}
              </div>
              <span className={`text-[10px] font-mono uppercase tracking-widest ${activeStep === s ? 'text-[#D4AF37]' : 'text-zinc-500'}`}>
                {s === 1 ? 'Chọn File' : s === 2 ? 'Xem trước' : 'Nạp dữ liệu'}
              </span>
            </div>
          ))}
        </div>

        {/* STEPPER PANELS */}
        <div className="bg-zinc-900/30 border border-white/5 rounded-3xl p-8 relative overflow-hidden">
          
          <AnimatePresence mode="wait">
            
            {/* STEP 1: LOAD SOURCE DATA */}
            {activeStep === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3 text-zinc-400">
                    <FileSpreadsheet size={20} className="text-[#D4AF37]" />
                    <span className="text-xs font-mono uppercase tracking-widest">Nạp dữ liệu từ Excel / CSV / JSON</span>
                  </div>
                  <button 
                    onClick={() => {
                      const csvText = [
                        'business_name,category,email_owner,zalo_phone,hotline,slug,city,district,address_full,latitude,longitude,map_embed_url,hero_title,hero_subtitle,hero_video_url,hero_slide_1,hero_slide_2,hero_slide_3,about_intro,experience_years,about_video_url,sv_1_name,sv_1_price,sv_1_desc,sv_1_img,sv_2_name,sv_2_price,sv_2_desc,sv_2_img,sv_3_name,sv_3_price,sv_3_desc,sv_3_img,sv_4_name,sv_4_price,sv_4_desc,sv_4_img,sv_5_name,sv_5_price,sv_5_desc,sv_5_img,sv_6_name,sv_6_price,sv_6_desc,sv_6_img,time_mon,time_tue,time_wed,time_thu,time_fri,time_sat,time_sun,fb_link,tiktok_link',
                        'Lavender Luxury Spa,Spa,lavender@beauty.com,0901234561,19001231,lavender-spa-luxury,TP. Hồ Chí Minh,Quận 1,15 Lê Lợi Quận 1,10.7769,106.7009,,Lavender - Viện Thẩm Mỹ Hoàng Gia Luxury,Trải nghiệm dịch vụ làm đẹp đẳng cấp 5 sao với công nghệ độc quyền từ Thụy Sĩ.,,https://images.unsplash.com/photo-1540555700478-4be289fbecef,https://images.unsplash.com/photo-1600334129128-685c5582fd35,https://images.unsplash.com/photo-1544161515-4af6b1d46af0,Với hơn 10 năm hình thành và phát triển chúng tôi tự hào là đơn vị dẫn đầu.,10+,,Tắm trắng phi thuyền,3.500.000đ,Tắm trắng phi thuyền nuôi dưỡng da sâu từ bên trong.,https://images.unsplash.com/photo-1540555700478-4be289fbecef,Trẻ hóa da Thermage FLX,15.000.000đ,Công nghệ xóa nhăn nâng cơ đỉnh cao hàng đầu thế giới.,https://images.unsplash.com/photo-1600334129128-685c5582fd35,Chăm sóc da chuyên sâu,1.500.000đ,Trải nghiệm chăm sóc da nuôi dưỡng chuyên sâu cùng tế bào gốc.,https://images.unsplash.com/photo-1544161515-4af6b1d46af0,Triệt lông Diode Laser,2.000.000đ,Triệt lông vĩnh viễn công nghệ ánh sáng thế hệ mới.,https://images.unsplash.com/photo-1519415510236-8559b1956a20,Massage Thụy Điển Luxury,1.200.000đ,Giảm căng thẳng mệt mỏi hiệu quả sau giờ làm việc.,https://images.unsplash.com/photo-1596178065887-1198b6148b2b,Hút chì thải độc tố da,800.000đ,Thải độc chì loại bỏ bụi bẩn tế bào chết bám sâu.,https://images.unsplash.com/photo-1540555700478-4be289fbecef,08:00 - 20:00,08:00 - 20:00,08:00 - 20:00,08:00 - 20:00,08:00 - 20:00,08:00 - 21:00,09:00 - 18:00,fb.com/lavenderspa,tiktok.com/@lavenderspa',
                        'Nha Khoa Kim Elite,Dental,kim@dental.com,0901234562,19001232,nha-khoa-kim-q3,TP. Hồ Chí Minh,Quận 3,45 Nguyễn Đình Chiểu Quận 3,10.7769,106.7009,,Nha Khoa Kim Elite - Kiến Tạo Nụ Cười Việt,Hệ thống nha khoa thẩm mỹ cao cấp chuyên sâu bọc răng sứ và trồng răng Implant.,,https://images.unsplash.com/photo-1629909613654-28e377c37b09,https://images.unsplash.com/photo-1588776814546-1ffcf47267a5,https://images.unsplash.com/photo-1598256989800-fe5f95da9787,Nha Khoa Kim Elite kiến tạo nụ cười rạng rỡ chuẩn tỷ lệ vàng bằng trang thiết bị nha khoa nhập khẩu.,8+,,Bọc răng sứ Cercon,6.000.000đ,Răng sứ nguyên khối nhập khẩu chính hãng Đức bền đẹp vĩnh viễn.,https://images.unsplash.com/photo-1629909613654-28e377c37b09,Trồng răng sứ Implant,18.000.000đ,Khôi phục chân răng mất bằng công nghệ Implant an toàn không đau.,https://images.unsplash.com/photo-1588776814546-1ffcf47267a5,Tẩy trắng răng Laser,2.500.000đ,Đánh bay xỉn màu ố vàng trả lại nụ cười rạng rỡ sau 45 phút.,https://images.unsplash.com/photo-1598256989800-fe5f95da9787,Niềng răng mắc cài pha lê,35.000.000đ,Chỉnh nha thẩm mỹ công nghệ pha lê vô hình hiện đại nhất.,https://images.unsplash.com/photo-1468495244123-6c6c332eeece,Nhổ răng khôn không đau,1.500.000đ,Nhổ răng bằng công nghệ sóng siêu âm Piezotome êm dịu.,https://images.unsplash.com/photo-1629909613654-28e377c37b09,Lấy cao răng siêu âm,300.000đ,Vệ sinh răng miệng sạch sẽ mảng bám ngăn ngừa hôi miệng.,https://images.unsplash.com/photo-1588776814546-1ffcf47267a5,08:30 - 20:00,08:30 - 20:00,08:30 - 20:00,08:30 - 20:00,08:30 - 20:00,08:30 - 17:00,08:30 - 17:00,fb.com/nhakhoakim,tiktok.com/@nhakhoakim'
                      ].join('\n')
                      setRawData(csvText)
                    }}
                    className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest hover:underline"
                  >
                    Nạp dữ liệu mẫu
                  </button>
                </div>

                <textarea 
                  value={rawData}
                  onChange={(e) => setRawData(e.target.value)}
                  placeholder="Dán các hàng sao chép từ file Excel của bạn hoặc kéo thả file CSV vào đây..."
                  className="w-full h-80 bg-[#060608] border border-white/5 rounded-2xl p-6 text-zinc-300 font-mono text-sm outline-none focus:border-[#D4AF37]/20 transition-all resize-none"
                />

                <div className="flex justify-end gap-4">
                  <button 
                    onClick={handleParseAndPreview}
                    disabled={!rawData.trim()}
                    className="bg-[#D4AF37] text-black font-bold uppercase tracking-widest text-xs px-10 py-4 rounded-full hover:bg-white transition-all disabled:opacity-40"
                  >
                    Xem trước & Kiểm tra
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: AUDIT & PREVIEW */}
            {activeStep === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-serif text-2xl text-white italic">Kiểm tra thông tin trước khi nạp</h3>
                  <button 
                    onClick={() => setActiveStep(1)}
                    className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest hover:text-white transition-colors"
                  >
                    Quay lại sửa dữ liệu
                  </button>
                </div>

                <div className="border border-white/5 rounded-2xl overflow-hidden max-h-80 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-white/5 text-[9px] font-mono text-zinc-500 uppercase tracking-widest sticky top-0">
                      <tr>
                        <th className="px-6 py-4">Doanh nghiệp</th>
                        <th className="px-6 py-4">Ngành hàng</th>
                        <th className="px-6 py-4">Email</th>
                        <th className="px-6 py-4">Khu vực</th>
                        <th className="px-6 py-4">Số dịch vụ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 bg-[#060608]/40">
                      {parsedItems.map((item, idx) => (
                        <tr key={idx} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 text-white font-medium">{item.business_name}</td>
                          <td className="px-6 py-4 font-mono text-[10px] text-[#D4AF37]">{item.category}</td>
                          <td className="px-6 py-4 text-zinc-400">{item.email_owner}</td>
                          <td className="px-6 py-4 font-mono text-zinc-400">{item.location_district || 'Chưa chọn'}</td>
                          <td className="px-6 py-4 font-mono text-[#D4AF37]">{item.content_json?.services_menu?.length || 0} / 6 dịch vụ</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-between items-center pt-4">
                  <span className="text-xs font-mono text-zinc-500">Sẵn sàng nạp {parsedItems.length} cơ sở đối tác. Mọi Landing Page mặc định được gán trạng thái Nháp (Draft).</span>
                  <button 
                    onClick={runIngestionProcess}
                    className="bg-[#D4AF37] text-black font-bold uppercase tracking-widest text-xs px-10 py-4 rounded-full hover:bg-white transition-all flex items-center gap-2"
                  >
                    <Play size={14} fill="black" /> Bắt đầu nạp công nghiệp
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: EXECUTION & PROGRESS */}
            {activeStep === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <div className="space-y-3">
                  <h3 className="font-serif text-2xl text-white italic">Tiến trình nạp cơ sở dữ liệu thời gian thực</h3>
                  
                  {/* Progress bar */}
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#D4AF37] to-amber-500 transition-all duration-300"
                      style={{ width: `${((currentIndex + 1) / parsedItems.length) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                    <span>Đang nạp: {parsedItems[currentIndex]?.business_name}</span>
                    <span>{currentIndex + 1} / {parsedItems.length} đối tác</span>
                  </div>
                </div>

                {/* Console Log Rows */}
                <div className="bg-[#060608] border border-white/5 rounded-2xl p-6 h-48 overflow-y-auto font-mono text-xs text-zinc-400 space-y-2">
                  {importLogs.map((log, idx) => (
                    <div key={idx} className={log.startsWith('❌') ? 'text-red-400' : log.startsWith('✓') ? 'text-green-400' : 'text-zinc-400'}>
                      {log}
                    </div>
                  ))}
                  {loading && <div className="text-[#D4AF37] flex items-center gap-2 mt-2"><Loader2 className="animate-spin" size={12} /> Đang xử lý đối tác tiếp theo...</div>}
                </div>

                {/* FINAL REPORT PANEL */}
                {!loading && finalReport.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-2.5 text-green-400">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex items-center gap-2.5 text-green-400">
                        <CheckCircle2 size={22} />
                        <h4 className="font-serif text-2xl italic text-white">Báo cáo nạp dữ liệu hoàn tất!</h4>
                      </div>
                      <button 
                        onClick={() => {
                          const headers = ['Doanh nghiep', 'Tai khoan (Email)', 'Mat khau', 'Duong dan', 'Trang thai', 'Ban giao']
                          const rows = finalReport.map(item => [
                            item.name,
                            item.email,
                            'Beauty123!',
                            `${window.location.origin}/p/${item.slug}`,
                            item.isPublished ? 'Live' : 'Draft',
                            item.isHandedOver ? 'Da ban giao' : 'Chua ban giao'
                          ])
                          const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
                            + [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(','))].join('\n')
                          const encodedUri = encodeURI(csvContent)
                          const link = document.createElement("a")
                          link.setAttribute("href", encodedUri)
                          link.setAttribute("download", `Bao_Cao_Ban_Giao_${new Date().toISOString().slice(0,10)}.csv`)
                          document.body.appendChild(link)
                          link.click()
                          document.body.removeChild(link)
                        }}
                        className="bg-white/5 border border-amber-500/20 hover:border-amber-500 text-white text-xs font-mono tracking-widest uppercase px-5 py-2.5 rounded-full flex items-center gap-1.5 transition-all"
                      >
                        <Download size={12} className="text-amber-400" />
                        Xuất báo cáo offline (.csv)
                      </button>
                    </div>
                    </div>

                    <div className="border border-white/5 rounded-2xl overflow-hidden bg-[#060608]/20">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-white/5 text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                          <tr>
                            <th className="px-6 py-4">Doanh nghiệp</th>
                            <th className="px-6 py-4">Tài khoản (Email)</th>
                            <th className="px-6 py-4">Mật khẩu</th>
                            <th className="px-6 py-4">Trạng thái</th>
                            <th className="px-6 py-4">Bàn giao</th>
                            <th className="px-6 py-4 text-right">Hành động</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {finalReport.map((res, idx) => (
                            <tr key={idx} className={`hover:bg-white/5 transition-colors ${!res.isPublished ? 'bg-amber-500/[0.03] border-l-2 border-l-amber-500/40' : ''}`}>
                              <td className="px-6 py-4 text-white font-medium">{res.name}</td>
                              <td className="px-6 py-4 font-mono text-zinc-400">{res.email}</td>
                              <td className="px-6 py-4 font-mono text-amber-400 font-bold">Beauty123!</td>
                              <td className="px-6 py-4">
                                <button
                                  onClick={() => togglePagePublished(idx, res.slug, res.isPublished)}
                                  className={`px-3 py-1 rounded-full text-[10px] font-mono uppercase font-bold tracking-widest ${res.isPublished ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'}`}
                                >
                                  {res.isPublished ? 'Live' : 'Nháp'}
                                </button>
                              </td>
                              <td className="px-6 py-4">
                                <input 
                                  type="checkbox"
                                  checked={res.isHandedOver}
                                  onChange={(e) => {
                                    const checked = e.target.checked
                                    setFinalReport(prev => prev.map((item, i) => i === idx ? { ...item, isHandedOver: checked } : item))
                                  }}
                                  className="accent-[#D4AF37] w-4 h-4 cursor-pointer" 
                                />
                              </td>
                              <td className="px-6 py-4 text-right space-x-3">
                                <button 
                                  onClick={() => handleOpenEditModal(idx, res)}
                                  className="text-zinc-500 hover:text-amber-500 transition-colors inline-flex items-center gap-1.5 mr-3"
                                  title="Chỉnh sửa thông tin đối tác"
                                >
                                  <Edit size={14} /> <span className="text-[10px] font-mono uppercase tracking-widest">Sửa</span>
                                </button>
                                <button 
                                  onClick={() => handleCopyLink(res.slug)}
                                  className="text-zinc-500 hover:text-[#D4AF37] transition-colors inline-flex items-center gap-1.5"
                                  title="Copy link bàn giao"
                                >
                                  <Copy size={14} /> <span className="text-[10px] font-mono uppercase tracking-widest">Copy Link</span>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="flex justify-end gap-4">
                      <button 
                        onClick={() => {
                          setActiveStep(1)
                          setRawData('')
                          setParsedItems([])
                          setFinalReport([])
                        }}
                        className="bg-white/5 hover:bg-white/10 text-white font-bold uppercase tracking-widest text-xs px-8 py-4 rounded-full transition-all"
                      >
                        Nạp lô dữ liệu mới
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-4 text-red-400"
          >
            <AlertCircle size={20} className="shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </motion.div>
        )}

        {/* Quick Edit Modal */}
        <AnimatePresence>
          {isEditModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-lg p-8 bg-[#0d0d0f] border border-white/10 rounded-[2rem] shadow-[0_0_50px_rgba(212,175,55,0.15)] relative"
              >
                <h3 className="font-display text-2xl text-white font-bold mb-1">Chỉnh sửa nhanh đối tác</h3>
                <p className="text-xs text-zinc-500 mb-6">Đồng bộ cập nhật trực tiếp lên cơ sở dữ liệu Supabase thực tế.</p>
                
                <div className="space-y-4">
                  {/* Business Name */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider font-bold">Tên doanh nghiệp</label>
                    <input 
                      type="text"
                      value={editForm.name}
                      onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full px-4 py-3 bg-[#060608]/50 border border-white/5 rounded-xl text-white focus:border-[#D4AF37]/50 focus:outline-none transition-colors text-sm"
                      placeholder="Tên Spa / Nha khoa..."
                    />
                  </div>

                  {/* Email Owner */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider font-bold">Email quản trị (Tài khoản đăng nhập)</label>
                    <input 
                      type="email"
                      value={editForm.email}
                      onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                      className="w-full px-4 py-3 bg-[#060608]/50 border border-white/5 rounded-xl text-white focus:border-[#D4AF37]/50 focus:outline-none transition-colors text-sm"
                      placeholder="partner@example.com"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Category */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider font-bold">Danh mục</label>
                      <select 
                        value={editForm.category}
                        onChange={e => setEditForm({ ...editForm, category: e.target.value })}
                        className="w-full px-4 py-3 bg-[#060608]/50 border border-white/5 rounded-xl text-white focus:border-[#D4AF37]/50 focus:outline-none transition-colors text-sm"
                      >
                        <option value="Spa">Spa</option>
                        <option value="Dental">Nha khoa (Dental)</option>
                        <option value="Clinic">Phòng khám (Clinic)</option>
                      </select>
                    </div>

                    {/* District */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider font-bold">Quận/Huyện</label>
                      <input 
                        type="text"
                        value={editForm.district}
                        onChange={e => setEditForm({ ...editForm, district: e.target.value })}
                        className="w-full px-4 py-3 bg-[#060608]/50 border border-white/5 rounded-xl text-white focus:border-[#D4AF37]/50 focus:outline-none transition-colors text-sm"
                        placeholder="Ví dụ: Quận 1"
                      />
                    </div>
                  </div>

                  {/* Zalo Phone */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider font-bold">Số điện thoại Zalo</label>
                    <input 
                      type="text"
                      value={editForm.zalo}
                      onChange={e => setEditForm({ ...editForm, zalo: e.target.value })}
                      className="w-full px-4 py-3 bg-[#060608]/50 border border-white/5 rounded-xl text-white focus:border-[#D4AF37]/50 focus:outline-none transition-colors text-sm"
                      placeholder="Ví dụ: 0901234567"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-8">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    disabled={isSavingEdit}
                    className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white font-bold text-[10px] font-mono uppercase tracking-wider rounded-xl transition-all disabled:opacity-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveEdit}
                    disabled={isSavingEdit}
                    className="px-6 py-2.5 bg-[#D4AF37] hover:brightness-110 text-[#2F2F2F] font-bold text-[10px] font-mono uppercase tracking-wider rounded-xl transition-all disabled:opacity-50 inline-flex items-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                  >
                    {isSavingEdit ? (
                      <>
                        <Loader2 size={12} className="animate-spin" /> Đang lưu...
                      </>
                    ) : (
                      'Đồng bộ lưu'
                    )}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </main>
  )
}
