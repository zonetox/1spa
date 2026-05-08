'use client'

import React, { useState, useEffect } from 'react'
import { EditableText } from '@/components/shared/EditableText'
import { EditableField } from '@/components/shared/EditorOverlay'
import { 
  Gift, 
  Zap, 
  Percent, 
  Clock, 
  ArrowRight, 
  X, 
  Menu, 
  Phone, 
  MapPin, 
  Award, 
  ShieldCheck, 
  Sparkles, 
  ChevronRight, 
  CheckCircle,
  HelpCircle,
  TrendingDown
} from 'lucide-react'

// We will use framer-motion for perfect compatibility and animations
import { motion as motionFramer, AnimatePresence as AnimatePresenceFramer } from 'framer-motion'

interface SeasonalEventProps {
  data: any
  isEditing?: boolean
  onUpdate?: (path: string, value: any) => void
  onImagePick?: (path: string, currentUrl: string) => void
  businessInfo?: any
  hiddenSections?: string[]
  sectionOrder?: string[]
  activeSection?: string | null
  onSectionClick?: (key: string) => void
}

const CAMPAIGN_DEALS = [
  {
    name: 'Gói Trẻ Hóa Hoàng Kim Golden Radiance',
    tagline: 'Ủ Trắng Sáng & Tế Bào Gốc Ngọc Trai',
    originalPrice: '12.000.000đ',
    promoPrice: '5.990.000đ',
    discount: 'GIẢM 50%',
    badge: 'Được Đăng Ký Nhiều Nhất',
    desc: 'Liệu trình kết hợp giữa thải độc tố cacbon hoạt tính, đắp mặt nạ tinh thể vàng 24k và phun oxy tươi đưa dưỡng chất Thụy Sĩ vào sâu tế bào da để đem lại độ bóng mượt vượt trội.',
    img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80'
  },
  {
    name: 'Combo Kiến Tạo Thon Gọn Mặt V-Line',
    tagline: 'Ultherapy Deep Lifting & Contour Sculpting',
    originalPrice: '22.000.000đ',
    promoPrice: '10.990.000đ',
    discount: 'GIẢM 50%',
    badge: 'Đặc Quyền Giới Hạn',
    desc: 'Sử dụng công nghệ Ultherapy nâng cơ chuyên sâu tích hợp dòng điện siêu vi kích hoạt cơ trán và nọng cằm săn chắc tức thì, tạo đường viền quai hàm sắc nét thanh tú chỉ sau 1 buổi.',
    img: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80'
  },
  {
    name: 'Siêu Cấy Collagen Matrix Căng Bóng Da',
    tagline: 'Matrix Rejuvenation & Deep Moisture Injection',
    originalPrice: '15.000.000đ',
    promoPrice: '7.500.000đ',
    discount: 'GIẢM 50%',
    badge: 'Chỉ Còn 5 Suất',
    desc: 'Phương pháp cấy sợi collagen đa tầng thủy phân tươi kết hợp tinh chất HA ngậm nước giúp cấp ẩm sâu tức thì, xóa mờ các bọng mắt nhăn nheo và làm đầy rãnh cười sâu thẳm.',
    img: 'https://images.unsplash.com/photo-1604654894610-df4906b197ae?auto=format&fit=crop&q=80'
  }
]

const CAMPAIGN_VOUCHERS = [
  { code: 'GOLD50', desc: 'Giảm trực tiếp 50% Gói Trẻ Hóa Hoàng Kim', limit: 'Còn lại 8 suất' },
  { code: 'VLINE50', desc: 'Giảm 50% Thon Gọn Mặt V-Line Thụy Sĩ', limit: 'Còn lại 3 suất' },
  { code: 'COLLAGEN50', desc: 'Giảm 50% Siêu Cấy Collagen Matrix Căng Bóng', limit: 'Còn lại 5 suất' }
]

export default function SeasonalEvent({ data, isEditing = false, onUpdate = () => {}, onImagePick, businessInfo = {}, hiddenSections = [], activeSection, onSectionClick }: SeasonalEventProps) {
  const {
    hero_section = {},
    services_menu = [],
    contact_info = {},
    operating_hours = {},
    theme_color = '#E0A96D' // Default campaign gold
  } = data

  const activeDeals = services_menu && services_menu.length > 0 ? services_menu : CAMPAIGN_DEALS
  const activeHours = Object.keys(operating_hours).length > 0 ? operating_hours : { weekdays: '08:00 - 20:00', weekends: '08:00 - 18:00' }

  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [selectedOffer, setSelectedOffer] = useState('')
  const [claimedVoucher, setClaimedVoucher] = useState<string | null>(null)
  
  // Real-time Countdown Timer (24 hours recurring)
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 32, seconds: 45 })

  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [serviceRequested, setServiceRequested] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        } else {
          return { hours: 23, minutes: 59, seconds: 59 } // reset
        }
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const openBookingWithOffer = (offerName: string) => {
    setSelectedOffer(offerName)
    setServiceRequested(offerName)
    setIsBookingModalOpen(true)
  }

  const handleVoucherClaim = (code: string) => {
    setClaimedVoucher(code)
    setSelectedOffer(`Sử dụng Voucher: ${code}`)
    setServiceRequested(`Sử dụng Voucher: ${code}`)
    setTimeout(() => {
      setIsBookingModalOpen(true)
    }, 800)
  }

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setSuccess(true)
    }, 1500)
  }

  // Helper for adding new item to an array
  const handleAddItem = (path: string, currentArray: any[], defaultItem: any) => {
    const next = [...currentArray, defaultItem]
    onUpdate(path, next)
  }

  // Helper for removing item from an array
  const handleRemoveItem = (path: string, currentArray: any[], index: number) => {
    const next = currentArray.filter((_, i) => i !== index)
    onUpdate(path, next)
  }

  return (
    <div className="bg-[#12040D] text-[#F8F1F5] font-sans selection:bg-[var(--primary)]/30 selection:text-white overflow-x-hidden pt-0" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <style jsx global>{`
        :root {
          --primary: ${theme_color};
          --primary-hover: ${theme_color}CC;
        }
        .text-primary { color: var(--primary); }
        .bg-primary { background-color: var(--primary); }
        .border-primary { border-color: var(--primary); }
      `}</style>
      
      {/* EXCLUSIVE FLASH NAVBAR */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 py-6 px-6 md:px-12 flex items-center justify-between ${isScrolled ? 'bg-[#12040D]/95 border-b border-[#E0A96D]/20 backdrop-blur-md shadow-lg' : 'bg-transparent border-b border-transparent backdrop-blur-none'}`}>
        <div className="flex items-center gap-4">
          {businessInfo.logo_url ? (
            <img 
              src={businessInfo.logo_url} 
              alt={businessInfo.name || "Logo"} 
              className="w-12 h-12 rounded-full border-2 border-[#E0A96D]/50 object-cover shadow-lg"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E0A96D] via-[#4A0D25] to-[#12040D] flex items-center justify-center text-[#E0A96D] font-serif font-bold text-xl shadow-lg border-2 border-[#E0A96D]/50">
              {(businessInfo.name || 'P').charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex flex-col text-left">
            <span className="text-xs font-mono font-bold tracking-[0.3em] uppercase text-[#E0A96D]">
              {businessInfo.name || "AURORA CENTRE"}
            </span>
            <span className="text-[7px] font-mono tracking-[0.1em] text-white/40 uppercase">Mega Campaign Page</span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-10 text-[10px] font-mono uppercase tracking-[0.3em] font-bold text-white/80">
          <a href="#vouchers" className="hover:text-[#E0A96D] transition-all">Săn Voucher</a>
          <a href="#deals" className="hover:text-[#E0A96D] transition-all">Mega Deals</a>
          <a href="#rules" className="hover:text-[#E0A96D] transition-all">Thể Lệ</a>
          <a href="#contact" className="hover:text-[#E0A96D] transition-all">Địa Chỉ</a>
        </nav>

        <div className="flex items-center gap-3">
          <a 
            href="/"
            className="hidden lg:inline-block px-5 py-2 rounded-full border border-white/10 text-white/80 font-bold tracking-widest uppercase text-[9px] transition-all hover:bg-white/5 bg-white/5"
          >
            Trang chủ
          </a>
          <button 
            onClick={() => openBookingWithOffer('')}
            className="px-6 py-2.5 rounded-full text-black bg-gradient-to-r from-[#E0A96D] via-[#F5D6B3] to-[#C59B6D] font-bold tracking-[0.2em] uppercase text-[9px] transition-all shadow-[0_4px_15px_rgba(224,169,109,0.3)] hover:shadow-[0_6px_25px_rgba(224,169,109,0.5)] hover:-translate-y-0.5 active:translate-y-0"
          >
            ĐĂNG KÝ SĂN DEAL
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-full border border-white/20 bg-black/30 text-white hover:bg-[#E0A96D]/10 transition-all"
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {/* MOBILE MENU PANEL */}
      <AnimatePresenceFramer>
        {isMobileMenuOpen && (
          <motionFramer.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[#12040D]/98 backdrop-blur-lg flex flex-col items-center justify-center gap-8 md:hidden"
          >
            <nav className="flex flex-col items-center gap-8 text-[12px] font-mono uppercase tracking-[0.3em] text-white font-bold">
              <a href="#vouchers" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#E0A96D] transition-all">Săn Voucher</a>
              <a href="#deals" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#E0A96D] transition-all">Mega Deals</a>
              <a href="#rules" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#E0A96D] transition-all">Thể Lệ</a>
              <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#E0A96D] transition-all">Địa Chỉ</a>
            </nav>
            <button 
              onClick={() => { setIsMobileMenuOpen(false); openBookingWithOffer(''); }}
              className="px-8 py-3.5 rounded-full text-black font-bold tracking-[0.2em] uppercase text-[10px] bg-gradient-to-r from-[#E0A96D] via-[#F5D6B3] to-[#C59B6D] shadow-lg"
            >
              ĐĂNG KÝ SĂN DEAL VIP
            </button>
          </motionFramer.div>
        )}
      </AnimatePresenceFramer>

      {/* 1. EXCLUSIVE HERO WITH COUNTDOWN TIMER */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black text-white px-4">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200" 
            alt="Mega Luxury Private Campaign" 
            className="absolute inset-0 w-full h-full object-cover filter saturate-[0.8] brightness-[0.3] scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#12040D] via-[#12040D]/30 to-transparent" />
        </div>

        <div className="relative z-10 text-center max-w-4xl space-y-12 pt-20">
          <motionFramer.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-3 bg-[#E0A96D]/15 border border-[#E0A96D]/40 text-[#E0A96D] px-6 py-2.5 rounded-full backdrop-blur-md">
              <Zap size={14} className="animate-pulse text-[#E0A96D]" />
              <span className="uppercase tracking-[0.3em] text-[9px] font-bold font-mono">Đại Tiệc Săn Deal Giới Hạn Toàn Hệ Thống</span>
            </div>
            
            <h1 className="text-4xl md:text-8xl font-light leading-none tracking-wide text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
              <EditableField
                value={hero_section.hero_title || 'Chiến Dịch Hoàng Kim Đồng Giá Giảm 50%'}
                onChange={(val) => onUpdate('hero_section.hero_title', val)}
                isEditing={isEditing}
                placeholder="Tiêu đề chiến dịch..."
              />
            </h1>
            
            <p className="text-xs md:text-base text-white/70 max-w-xl mx-auto font-light leading-relaxed">
              <EditableField
                value={hero_section.hero_subtitle || 'Chiến dịch kích cầu nhan sắc đặc quyền lớn nhất năm. Đăng ký trực tuyến ngay hôm nay để nhận Voucher đặc quyền giảm giá 50% cho tất cả các gói dịch vụ thẩm mỹ cao cấp.'}
                onChange={(val) => onUpdate('hero_section.hero_subtitle', val)}
                isEditing={isEditing}
                multiline
                placeholder="Mô tả chiến dịch..."
              />
            </p>
          </motionFramer.div>

          {/* LUXURY LUXURY COUNTDOWN TIMER PANEL */}
          <motionFramer.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="bg-black/75 border border-[#E0A96D]/30 p-8 rounded-3xl max-w-lg mx-auto backdrop-blur-md shadow-[0_15px_50px_rgba(224,169,109,0.1)] space-y-4"
          >
            <span className="text-[9px] font-mono tracking-[0.4em] text-[#E0A96D] uppercase block font-bold">Thời Gian Ưu Đãi Còn Lại</span>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-1">
                <span className="text-4xl md:text-5xl font-light font-mono text-white block">{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="text-[8px] font-mono tracking-widest text-white/40 uppercase block">Giờ (Hrs)</span>
              </div>
              <div className="space-y-1 border-x border-white/10">
                <span className="text-4xl md:text-5xl font-light font-mono text-white block">{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className="text-[8px] font-mono tracking-widest text-white/40 uppercase block">Phút (Mins)</span>
              </div>
              <div className="space-y-1">
                <span className="text-4xl md:text-5xl font-light font-mono text-[#E0A96D] block animate-pulse">{String(timeLeft.seconds).padStart(2, '0')}</span>
                <span className="text-[8px] font-mono tracking-widest text-white/40 uppercase block">Giây (Secs)</span>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 text-[9px] font-mono tracking-wide text-[#E0A96D] uppercase flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E0A96D] animate-ping" />
              Chỉ dành cho 100 khách hàng đăng ký sớm nhất
            </div>
          </motionFramer.div>

          <div className="flex flex-col sm:flex-row gap-5 justify-center pt-4">
            <a 
              href="#vouchers"
              className="px-8 py-3.5 rounded-full text-black font-bold tracking-[0.2em] uppercase text-[10px] bg-gradient-to-r from-[#E0A96D] via-[#F5D6B3] to-[#C59B6D] shadow-xl hover:scale-105 transition-all text-center"
            >
              GIẬT VOUCHER 50% NGAY
            </a>
            <a 
              href="#deals"
              className="px-8 py-3.5 rounded-full border border-white/20 hover:border-white/50 text-white font-bold tracking-[0.2em] uppercase text-[10px] transition-all backdrop-blur-sm bg-white/5 text-center"
            >
              XEM MENU ĐỒNG GIÁ
            </a>
          </div>
        </div>
      </section>

      {/* 2. CHOOSE & CLAIM VOUCHER BOXES (Micro-Interaction) */}
      <section id="vouchers" className="py-24 md:py-32 px-6 bg-[#12040D] relative text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(224,169,109,0.04),transparent_50%)]" />
        
        <div className="max-w-7xl mx-auto space-y-16 relative z-10">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="text-[10px] font-mono tracking-[0.4em] uppercase text-[#E0A96D] font-bold block">Quà Tặng Giờ Vàng</span>
            <h2 className="text-3xl md:text-5xl font-light tracking-wide text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
              Nhận Thẻ Đặc Quyền <span className="italic text-[#E0A96D]">Voucher 50%</span>
            </h2>
            <div className="h-[1px] w-20 bg-[#E0A96D]/50 mx-auto" />
            <p className="text-white/50 text-xs md:text-sm font-light">
              Nhấp chọn tấm thẻ ưu đãi dưới đây để kích hoạt Voucher giảm giá tương ứng. Trợ lý chiến dịch sẽ liên hệ chuyển giao vé điện tử trực tiếp qua Zalo/SĐT.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {CAMPAIGN_VOUCHERS.map((v, idx) => {
              const isClaimed = claimedVoucher === v.code
              return (
                <div 
                  key={idx}
                  onClick={() => handleVoucherClaim(v.code)}
                  className={`relative p-8 rounded-3xl border transition-all duration-500 cursor-pointer text-center space-y-6 select-none group overflow-hidden ${isClaimed ? 'bg-[#E0A96D] border-[#E0A96D] text-black scale-105 shadow-[0_10px_35px_rgba(224,169,109,0.3)]' : 'bg-black border-white/10 hover:border-[#E0A96D]/40 text-white hover:-translate-y-1.5'}`}
                >
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Percent size={120} />
                  </div>

                  <div className="space-y-1">
                    <span className={`text-[8px] font-mono tracking-widest uppercase block ${isClaimed ? 'text-black/50' : 'text-[#E0A96D]'}`}>{v.limit}</span>
                    <h3 className="text-2xl font-light font-mono tracking-widest">{v.code}</h3>
                  </div>

                  <div className="h-[1px] w-12 bg-white/10 mx-auto" />

                  <p className={`text-xs font-light leading-relaxed px-4 ${isClaimed ? 'text-black' : 'text-white/60'}`}>{v.desc}</p>

                  <button className={`w-full py-3 rounded-xl text-[9px] font-mono tracking-[0.2em] font-bold uppercase transition-all ${isClaimed ? 'bg-black text-[#E0A96D] border border-black' : 'bg-white/5 hover:bg-[#E0A96D] hover:text-black border border-white/10'}`}>
                    {isClaimed ? 'VOUCHER ĐÃ KÍCH HOẠT ✓' : 'KÍCH HOẠT THẺ ƯU ĐÃI'}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 3. MEGA DEALS TIERS (Promo List with Original vs Sale Prices) */}
      <section id="deals" className="py-24 md:py-36 px-6 bg-black relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(224,169,109,0.04),transparent_50%)]" />
        
        <div className="max-w-6xl mx-auto space-y-16 relative z-10">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="text-[10px] font-mono tracking-[0.4em] uppercase text-[#E0A96D] font-bold block">Danh Sách Ưu Đãi Hoàng Kim</span>
            <h2 className="text-3xl md:text-5xl font-light tracking-wide text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
              Bảng Giá <span className="italic text-[#E0A96D]">Đồng Giá Săn Deal 50%</span>
            </h2>
            <div className="h-[1px] w-20 bg-[#E0A96D]/50 mx-auto" />
            <p className="text-white/50 text-xs md:text-sm font-light">
              Tuyệt phẩm trị liệu sắc đẹp cao cấp nhất được giảm giá một nửa trong suốt thời gian diễn ra chiến dịch đặc quyền này.
            </p>

            {isEditing && (
              <ArrayActionButtons
                onAdd={() => handleAddItem('services_menu', activeDeals, CAMPAIGN_DEALS[0])}
                label="Deal"
                className="justify-center mt-4"
              />
            )}
          </div>

          <div className="space-y-6 max-w-4xl mx-auto">
            {activeDeals.map((deal: any, index: number) => (
              <div 
                key={index}
                className="group relative flex flex-col md:flex-row gap-8 items-center p-6 rounded-3xl border border-white/5 bg-[#12040D] hover:border-[#E0A96D]/30 transition-all duration-500 overflow-hidden relative"
              >
                {isEditing && (
                  <div className="absolute top-4 right-4 z-20">
                    <ArrayActionButtons
                      onRemove={() => handleRemoveItem('services_menu', activeDeals, index)}
                    />
                  </div>
                )}
                <div className="w-full md:w-44 h-44 rounded-2xl overflow-hidden flex-shrink-0 relative">
                  <img 
                    src={deal.img} 
                    alt={deal.name} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 bg-[#E0A96D] text-black font-bold font-mono text-[8px] tracking-widest px-2.5 py-1 rounded-full uppercase">
                    {deal.discount || 'GIẢM 50%'}
                  </div>
                </div>

                <div className="flex-grow space-y-4 text-center md:text-left">
                  <div className="space-y-1">
                    <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-2">
                      <h3 className="text-lg md:text-xl font-light text-white" style={{ fontFamily: "'Playfair Display', serif" }}>{deal.name}</h3>
                      <span className="text-[9px] font-mono tracking-widest text-[#E0A96D] bg-[#E0A96D]/10 px-3 py-1 rounded-full uppercase border border-[#E0A96D]/20">{deal.badge || 'MEGA CAMPAIGN'}</span>
                    </div>
                    <span className="text-[9px] font-mono tracking-widest text-white/40 uppercase block">{deal.tagline} • {deal.duration || '90 Phút'}</span>
                  </div>
                  
                  <p className="text-xs text-white/50 font-light leading-relaxed line-clamp-2">{deal.desc}</p>
                  
                  <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-mono text-white/30 line-through">{deal.originalPrice || '15.000.000đ'}</span>
                      <TrendingDown size={14} className="text-[#E0A96D]" />
                      <span className="text-xl md:text-2xl font-light text-[#E0A96D]" style={{ fontFamily: "'Playfair Display', serif" }}>{deal.promoPrice || deal.price}</span>
                    </div>

                    <button 
                      onClick={() => openBookingWithOffer(deal.name)}
                      className="px-6 py-2 rounded-xl text-black bg-gradient-to-r from-[#E0A96D] via-[#F5D6B3] to-[#C59B6D] font-bold tracking-widest uppercase text-[9px] transition-all hover:scale-[1.02]"
                    >
                      MUA DEAL NGAY
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CAMPAIGN RULES & ELIGIBILITY */}
      <section id="rules" className="py-24 md:py-32 px-6 bg-[#12040D] relative">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <span className="text-[10px] font-mono tracking-[0.4em] uppercase text-[#E0A96D] font-bold block">Điều Kiện Chương Trình</span>
            <h2 className="text-3xl md:text-5xl font-light tracking-wide text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
              Thể Lệ <span className="italic text-[#E0A96D]">Săn Deal Đặc Quyền</span>
            </h2>
            <div className="h-[1px] w-20 bg-[#E0A96D]/50 mx-auto" />
          </div>

          <div className="p-8 md:p-12 rounded-3xl border border-white/5 bg-black space-y-6">
            {[
              { id: '01', title: 'Đối Tượng Áp Dụng', desc: 'Chương trình ưu đãi giảm 50% áp dụng duy nhất cho các khách hàng đăng ký đặt lịch hẹn tư vấn và chốt liệu trình trực tuyến tại trang Campaign này.' },
              { id: '02', title: 'Quy Định Voucher', desc: 'Mỗi khách hàng được kích hoạt tối đa 1 mã Voucher và không áp dụng đồng thời với các chương trình khuyến mãi khác tại cửa hàng.' },
              { id: '03', title: 'Thời Gian Giới Hạn', desc: 'Ưu đãi chỉ có hiệu lực cho đến khi đồng hồ đếm ngược kết thúc hoặc khi đủ số lượng 100 khách hàng kích hoạt thành công.' }
            ].map((rule, idx) => (
              <div key={idx} className="flex gap-6 items-start">
                <span className="text-xl font-mono text-[#E0A96D] font-bold bg-[#E0A96D]/10 px-3 py-1.5 rounded-xl border border-[#E0A96D]/20">{rule.id}</span>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white tracking-wide">{rule.title}</h4>
                  <p className="text-xs text-white/50 font-light leading-relaxed">{rule.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CAMPAIGN REGISTRATION & RESERVATION */}
      <section id="contact" className="py-24 md:py-36 px-6 bg-black relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="space-y-8 text-left">
            <div className="space-y-4">
              <span className="text-[10px] font-mono tracking-[0.4em] uppercase text-[#E0A96D] font-bold block">Đăng Ký Độc Quyền</span>
              <h2 className="text-3xl md:text-5xl font-light tracking-wide text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                Giữ Suất Săn Deal <br/> <span className="italic text-[#E0A96D]">Trước Khi Kết Thúc</span>
              </h2>
            </div>
            <p className="text-[#8E9AAF] text-xs md:text-sm font-light leading-relaxed">
              Tránh tình trạng quá tải suất điều trị trong chiến dịch, xin quý khách hàng vui lòng hoàn thành mẫu đăng ký nhanh dưới đây. Đội ngũ trợ lý sẽ khóa suất hẹn và giữ giá ưu đãi 50% cho bạn ngay lập tức.
            </p>

            <div className="space-y-4 text-xs md:text-sm font-mono tracking-wider uppercase text-white/70">
              <div className="flex items-center gap-4">
                <MapPin size={16} className="text-[#E0A96D]" />
                <span>Địa chỉ áp dụng: {contact_info.address_full || "Toàn hệ thống chi nhánh cửa hàng"}</span>
              </div>
              <div className="flex items-center gap-4">
                <Phone size={16} className="text-[#E0A96D]" />
                <span>Đường dây nóng: {contact_info.hotline || "1900 6666"}</span>
              </div>
              <div className="flex items-center gap-4">
                <Clock size={16} className="text-[#E0A96D]" />
                <span>Khung giờ áp dụng: {activeHours.weekdays} (Hằng ngày)</span>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-12 rounded-3xl border border-[#E0A96D]/30 bg-[#12040D] relative overflow-hidden shadow-[0_15px_50px_rgba(224,169,109,0.1)]">
            <div className="absolute inset-0 bg-gradient-to-br from-[#12040D] via-black to-[#4A0D25]/20" />
            
            <div className="relative z-10 space-y-6">
              <h3 className="text-xl md:text-2xl font-light text-center text-[#E0A96D] tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>Xác Nhận Đăng Ký Trực Tuyến</h3>
              
              {success ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#E0A96D]/20 flex items-center justify-center mx-auto border border-[#E0A96D]/50 text-[#E0A96D] text-2xl">✓</div>
                  <h4 className="text-lg font-light">Đăng Ký Chốt Suất Thành Công</h4>
                  <p className="text-xs text-white/50 max-w-xs mx-auto font-light leading-relaxed">Voucher ưu đãi 50% của bạn đã được lưu giữ trên hệ thống. Trợ lý chiến dịch sẽ liên hệ chốt lịch hẹn cho bạn qua Zalo/SĐT trong vòng ít phút.</p>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-5">
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono uppercase tracking-widest text-white/50 block">Họ và Tên Quý Khách</label>
                    <input 
                      type="text" 
                      required 
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Nguyễn Hoàng Vy" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#E0A96D]/50 transition-all font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-mono uppercase tracking-widest text-white/50 block">Số Điện Thoại Nhận Mã Vé</label>
                    <input 
                      type="tel" 
                      required 
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="0912 345 678" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#E0A96D]/50 transition-all font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-mono uppercase tracking-widest text-white/50 block">Gói Săn Deal Đã Chọn</label>
                    <select 
                      value={serviceRequested}
                      onChange={(e) => setServiceRequested(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3.5 text-xs text-white focus:outline-none focus:border-[#E0A96D]/50 transition-all font-mono"
                    >
                      <option value="">-- Đăng ký nhận Voucher đồng giá chung --</option>
                      {activeDeals.map((s: any, idx: number) => (
                        <option key={idx} value={s.name}>{s.name} ({s.promoPrice || s.price})</option>
                      ))}
                    </select>
                  </div>

                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="w-full py-4 rounded-xl text-black bg-gradient-to-r from-[#E0A96D] via-[#F5D6B3] to-[#C59B6D] font-bold tracking-[0.2em] uppercase text-[10px] transition-all shadow-lg hover:scale-[1.01] flex items-center justify-center gap-2"
                  >
                    {submitting ? 'ĐANG KHÓA SUẤT...' : 'KÍCH HOẠT SUẤT CAMPAIGN'}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-white/5 bg-[#0A0207] text-center text-xs text-white/30 font-mono tracking-widest uppercase relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span>© {new Date().getFullYear()} {businessInfo.name || "AURORA CENTRE"}. ALL RIGHTS RESERVED.</span>
          <span className="text-[9px] text-[#E0A96D]/30">DESIGNED FOR HIGH-CONVERSION CAMPAIGN EXCELLENCE</span>
        </div>
      </footer>

      {/* EXCLUSIVE BOOKING MODAL */}
      <AnimatePresenceFramer>
        {isBookingModalOpen && (
          <motionFramer.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          >
            <motionFramer.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-lg p-8 md:p-12 rounded-3xl border border-[#E0A96D]/30 bg-[#12040D] overflow-hidden"
            >
              <button 
                onClick={() => setIsBookingModalOpen(false)}
                className="absolute top-6 right-6 text-white/40 hover:text-white p-2 rounded-full border border-white/10 hover:bg-white/5 transition-all"
              >
                <X size={16} />
              </button>

              <div className="space-y-6">
                <h3 className="text-2xl font-light text-[#E0A96D] tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {selectedOffer ? `Chốt Deal: ${selectedOffer}` : 'Đăng Ký Đặt Suất Chiến Dịch'}
                </h3>
                <p className="text-white/50 text-xs font-light">Mời quý khách điền thông tin bên dưới để khóa giá Voucher 50% và giữ chỗ đặt lịch sớm nhất.</p>

                {success ? (
                  <div className="text-center py-8 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-[#E0A96D]/20 flex items-center justify-center mx-auto border border-[#E0A96D]/50 text-[#E0A96D] text-2xl">✓</div>
                    <h4 className="text-lg font-light">Giữ Suất Thành Công</h4>
                    <p className="text-xs text-white/50 max-w-xs mx-auto leading-relaxed">Mã ưu đãi đặc quyền đã được ghi nhận. Trợ lý chiến dịch sẽ liên lạc ngay lập tức.</p>
                  </div>
                ) : (
                  <form onSubmit={handleBookingSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[8px] font-mono uppercase tracking-widest text-white/50 block">Họ và Tên Quý Khách</label>
                      <input 
                        type="text" 
                        required 
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Nguyễn Hoàng Vy" 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#E0A96D]/50 transition-all font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] font-mono uppercase tracking-widest text-white/50 block">Số Điện Thoại Nhận Vé</label>
                      <input 
                        type="tel" 
                        required 
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="0912 345 678" 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#E0A96D]/50 transition-all font-mono"
                      />
                    </div>
                    <button 
                      type="submit" 
                      className="w-full py-4 rounded-xl text-black bg-gradient-to-r from-[#E0A96D] via-[#F5D6B3] to-[#C59B6D] font-bold tracking-[0.2em] uppercase text-[10px] shadow-lg"
                    >
                      KÍCH HOẠT VOUCHER CHƯƠNG TRÌNH
                    </button>
                  </form>
                )}
              </div>
            </motionFramer.div>
          </motionFramer.div>
        )}
      </AnimatePresenceFramer>

    </div>
  )
}
