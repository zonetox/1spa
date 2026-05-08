'use client'

import React, { useState, useEffect } from 'react'
import { EditableText } from '@/components/shared/EditableText'
import { EditableField, ArrayActionButtons } from '@/components/shared/EditorOverlay'
import { 
  Phone, 
  MapPin, 
  Clock, 
  Star, 
  Calendar, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Menu, 
  Users, 
  Sparkles, 
  Award, 
  Heart,
  Eye,
  Camera
} from 'lucide-react'

// We will use framer-motion for perfect compatibility and animations
import { motion as motionFramer, AnimatePresence as AnimatePresenceFramer } from 'framer-motion'

interface HauteCoutureBeautyProps {
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

const SIGNATURE_SERVICES = [
  {
    name: 'Trang Điểm Haute Couture',
    tagline: 'Couture Editorial & Glamour Makeup',
    duration: '120 Phút • Tạo Tác Cao Cấp',
    desc: 'Kiến tạo phong cách trang điểm thời trang độc bản, được thiết kế riêng biệt để tôn vinh đường nét tự nhiên độc nhất của bạn. Sử dụng các dòng mỹ phẩm xa xỉ như Dior Backstage, Chanel Beauty, Tom Ford.',
    price: '3.500.000đ',
    img: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80'
  },
  {
    name: 'Điêu Khắc Mi Ngọc Trai',
    tagline: 'Pearl-Lustre Premium Eyelash Sculpting',
    duration: '90 Phút • Thủ Công Tinh Xảo',
    desc: 'Kỹ thuật nối mi thủ công siêu nhẹ, kết cấu sợi tơ lụa cao cấp uốn cong hoàn mỹ giúp đôi mắt toát lên vẻ quyến rũ kiêu kỳ tự nhiên mà không gây cảm giác nặng nề.',
    price: '1.800.000đ',
    img: 'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?auto=format&fit=crop&q=80'
  },
  {
    name: 'Kiến Tạo Móng Đắp Đá Xa Xỉ',
    tagline: 'Couture Hand-Painted Jewelry Nails',
    duration: '120 Phút • Nghệ Thuật Vẽ Tay',
    desc: 'Quy trình chăm sóc và đắp móng nghệ thuật thủ công, sử dụng các loại gel lành tính nhất từ Nhật Bản kết hợp vẽ tay họa tiết độc bản, đính đá Swarovski cao cấp lấp lánh.',
    price: '2.200.000đ',
    img: 'https://images.unsplash.com/photo-1604654894610-df4906b197ae?auto=format&fit=crop&q=80'
  },
  {
    name: 'Tạo Mẫu Tóc Haute Couture',
    tagline: 'Couture Sculpting & French Balayage',
    duration: '180 Phút • Biến Đổi Diện Mạo',
    desc: 'Dưới bàn tay điêu luyện của các Hair Stylist danh tiếng, mái tóc của bạn sẽ được thiết kế phom dáng thời thượng, kỹ thuật nhuộm Balayage chuẩn Pháp tạo hiệu ứng bắt sáng rực rỡ dưới nắng.',
    price: '4.500.000đ',
    img: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80'
  }
]

const BACKSTAGE_GALLERY = [
  {
    title: 'Couture Backstage Preparation',
    category: 'Editorial',
    img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80'
  },
  {
    title: 'Eyelash Pearl Detailing',
    category: 'Lashes',
    img: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80'
  },
  {
    title: 'Hand-painted Swarovski Art',
    category: 'Nails',
    img: 'https://images.unsplash.com/photo-1604654894610-df4906b197ae?auto=format&fit=crop&q=80'
  },
  {
    title: 'Couture Hair Sculpting',
    category: 'Styling',
    img: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80'
  },
  {
    title: 'The Golden Hour Glow',
    category: 'Glamour',
    img: 'https://images.unsplash.com/photo-1515688594390-b649af70d282?auto=format&fit=crop&q=80'
  },
  {
    title: 'French Balayage Finish',
    category: 'Hair',
    img: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&q=80'
  }
]

const BEAUTY_CURATORS = [
  {
    name: 'Master Leo Nguyen',
    role: 'Bậc Thầy Trang Điểm Haute Couture',
    origin: 'Paris / Milan',
    desc: 'Với hơn 12 năm kinh nghiệm làm việc tại các sàn diễn thời trang Paris Fashion Week, Leo là người đứng sau diện mạo lộng lẫy của nhiều siêu mẫu và ngôi sao quốc tế.',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80'
  },
  {
    name: 'Elena Vovk',
    role: 'Chuyên Gia Điêu Khắc Chân Mày & Mi',
    origin: 'Ukraine',
    desc: 'Elena là nhà vô địch cuộc thi Lash Artistry châu Âu năm 2022. Kỹ thuật tạo phom chân mày của cô mang đậm tính điêu khắc và hài hòa tự nhiên.',
    img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80'
  }
]

const BEAUTY_SLIDES = [
  'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1515688594390-b649af70d282?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80'
]

export default function HauteCoutureBeauty({ data, isEditing = false, onUpdate = () => {}, onImagePick, businessInfo = {}, hiddenSections = [], activeSection, onSectionClick }: HauteCoutureBeautyProps) {
  const {
    hero_section = {},
    about_us = {},
    services_menu = [],
    contact_info = {},
    operating_hours = {},
    social_trust = {},
    theme_color = '#E91E63', // Default Haute Couture pink
    expert_team = []
  } = data

  const activeServices = services_menu && services_menu.length > 0 ? services_menu : SIGNATURE_SERVICES
  const activeExperts = expert_team && expert_team.length > 0 ? expert_team : BEAUTY_CURATORS
  const activeHours = Object.keys(operating_hours).length > 0 ? operating_hours : { weekdays: '09:00 - 21:00', weekends: '08:00 - 22:00' }

  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [selectedService, setSelectedService] = useState('')
  const [viewingService, setViewingService] = useState<any | null>(null)
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0)

  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [serviceRequested, setServiceRequested] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % BEAUTY_SLIDES.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const openBookingWithService = (serviceName: string) => {
    setSelectedService(serviceName)
    setServiceRequested(serviceName)
    setIsBookingModalOpen(true)
  }

  const handleBooking = async (e: React.FormEvent) => {
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
    <div className="bg-[#0A0A0A] text-[#F5FAF6] font-sans selection:bg-[var(--primary)]/20 selection:text-[#FFFFFF] overflow-x-hidden pt-0" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <style jsx global>{`
        :root {
          --primary: ${theme_color};
          --primary-hover: ${theme_color}CC;
        }
        .text-primary { color: var(--primary); }
        .bg-primary { background-color: var(--primary); }
        .border-primary { border-color: var(--primary); }
      `}</style>
      
      {/* 5-STAR FLOATING GLASSMOPHISM HEADER */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 py-6 px-6 md:px-12 flex items-center justify-between ${isScrolled ? 'bg-[#0A0A0A]/95 border-b border-[#E0A96D]/20 backdrop-blur-md shadow-md' : 'bg-transparent border-b border-transparent backdrop-blur-none'}`}>
        <div className="flex items-center gap-4">
          {businessInfo.logo_url ? (
            <img 
              src={businessInfo.logo_url} 
              alt={businessInfo.name || "Logo"} 
              className="w-12 h-12 rounded-full border-2 border-[#E0A96D]/50 object-cover shadow-lg"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E0A96D] via-[#FFE2C2] to-[#B8860B] flex items-center justify-center text-black font-serif font-bold text-xl shadow-lg border-2 border-[#E0A96D]/50">
              {(businessInfo.name || 'B').charAt(0).toUpperCase()}
            </div>
          )}
          <span className="hidden sm:inline-block text-xs font-mono font-bold tracking-[0.3em] uppercase text-white">
            {businessInfo.name || "GLAMOUR STUDIO"}
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-12 text-[10px] font-mono uppercase tracking-[0.4em] font-bold text-white/80">
          <a href="#philosophy" className="hover:text-[#E0A96D] transition-all relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-[#E0A96D] hover:after:w-full after:transition-all">Triết Lý</a>
          <a href="#services" className="hover:text-[#E0A96D] transition-all relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-[#E0A96D] hover:after:w-full after:transition-all">Danh Mục</a>
          <a href="#backstage" className="hover:text-[#E0A96D] transition-all relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-[#E0A96D] hover:after:w-full after:transition-all">Backstage</a>
          <a href="#contact" className="hover:text-[#E0A96D] transition-all relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-[#E0A96D] hover:after:w-full after:transition-all">Liên Hệ</a>
        </nav>

        <div className="flex items-center gap-3">
          <a 
            href="/"
            className="hidden lg:inline-block px-5 py-2 rounded-full border border-white/20 text-white font-bold tracking-widest uppercase text-[9px] transition-all hover:bg-[#E0A96D]/10 bg-white/5"
          >
            Trang chủ
          </a>
          <button 
            onClick={() => openBookingWithService('')}
            className="px-6 py-2.5 rounded-full text-black bg-gradient-to-r from-[#E0A96D] via-[#FFE2C2] to-[#B8860B] font-bold tracking-[0.2em] uppercase text-[9px] transition-all shadow-[0_4px_15px_rgba(224,169,109,0.25)] hover:shadow-[0_6px_25px_rgba(224,169,109,0.4)] hover:-translate-y-0.5 active:translate-y-0"
          >
            ĐẶT LỊCH VIP
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
            className="fixed inset-0 z-40 bg-[#0A0A0A]/98 backdrop-blur-lg flex flex-col items-center justify-center gap-8 md:hidden"
          >
            <nav className="flex flex-col items-center gap-8 text-[12px] font-mono uppercase tracking-[0.3em] text-white font-bold">
              <a href="#philosophy" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#E0A96D] transition-all">Triết Lý</a>
              <a href="#services" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#E0A96D] transition-all">Danh Mục</a>
              <a href="#backstage" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#E0A96D] transition-all">Backstage</a>
              <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#E0A96D] transition-all">Liên Hệ</a>
            </nav>
            <button 
              onClick={() => { setIsMobileMenuOpen(false); openBookingWithService(''); }}
              className="px-8 py-3.5 rounded-full text-black font-bold tracking-[0.2em] uppercase text-[10px] bg-gradient-to-r from-[#E0A96D] via-[#FFE2C2] to-[#B8860B] shadow-lg"
            >
              ĐẶT LỊCH VIP CONCIERGE
            </button>
          </motionFramer.div>
        )}
      </AnimatePresenceFramer>

      {/* 1. THE OVERTURE (Hero / Sensory Welcome) */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black text-white">
        <div className="absolute inset-0 z-0">
          <AnimatePresenceFramer mode="wait">
            <motionFramer.img 
              key={currentHeroSlide}
              src={BEAUTY_SLIDES[currentHeroSlide]} 
              alt="Couture Prelude" 
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 0.45, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0 w-full h-full object-cover filter saturate-[0.8] brightness-[0.7]"
            />
          </AnimatePresenceFramer>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-black/10 to-transparent" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl space-y-8">
          <motionFramer.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-3 bg-[#E0A96D]/15 border border-[#E0A96D]/40 text-[#E0A96D] px-6 py-2 rounded-full backdrop-blur-md">
              <Sparkles size={12} className="animate-pulse text-[#E0A96D]" />
              <span className="uppercase tracking-[0.3em] text-[9px] font-bold font-mono">Haute Couture Beauty & Glamour Studio</span>
            </div>
            
            <h1 className="text-4xl md:text-7xl font-light leading-tight tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>
              <EditableField
                value={hero_section.hero_title || 'Sắc Đẹp Độc Bản Kiêu Kỳ & Tỏa Sáng'}
                onChange={(val) => onUpdate('hero_section.hero_title', val)}
                isEditing={isEditing}
                placeholder="Tiêu đề Hero..."
              />
            </h1>
            
            <p className="text-sm md:text-lg text-white/70 max-w-xl mx-auto font-light leading-relaxed">
              <EditableField
                value={hero_section.hero_subtitle || 'Vẻ đẹp không có thước đo chuẩn mực. Chúng tôi không định nghĩa nhan sắc, chúng tôi kiến tạo phong cách để tôn vinh bản sắc độc nhất kiêu sa của riêng bạn.'}
                onChange={(val) => onUpdate('hero_section.hero_subtitle', val)}
                isEditing={isEditing}
                multiline
                placeholder="Mô tả / slogan..."
              />
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center pt-8">
              <button 
                onClick={() => openBookingWithService('')}
                className="px-8 py-3.5 rounded-full text-black font-bold tracking-[0.2em] uppercase text-[10px] bg-gradient-to-r from-[#E0A96D] via-[#FFE2C2] to-[#B8860B] shadow-xl hover:scale-105 transition-all relative overflow-hidden group"
              >
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                Kiến Tạo Diện Mạo
              </button>
              <a 
                href="#philosophy"
                className="px-8 py-3.5 rounded-full border border-white/20 hover:border-white/50 text-white font-bold tracking-[0.2em] uppercase text-[10px] transition-all backdrop-blur-sm bg-white/5"
              >
                Khám Phá Triết Lý
              </a>
            </div>
          </motionFramer.div>
        </div>
      </section>

      {/* 2. THE MUSE PHILOSOPHY */}
      <section id="philosophy" className="relative py-24 md:py-36 px-6 md:px-20 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <span className="text-[10px] font-mono tracking-[0.4em] uppercase text-[#E0A96D] font-bold block">Tuyên Ngôn Độc Bản</span>
              <h2 className="text-3xl md:text-5xl font-light tracking-wide text-white leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                Nơi Sắc Đẹp Là <br/> <span className="italic text-[#E0A96D]">Tác Phẩm Nghệ Thuật</span>
              </h2>
            </div>
            
            <div className="h-[1px] w-20 bg-[#E0A96D]/50" />
            
            <p className="text-white/60 text-sm md:text-base font-light leading-relaxed">
              Chúng tôi tin rằng cái đẹp thực sự không nằm ở những khuôn mẫu rập khuôn hay sự gượng ép từ các tiêu chuẩn lâm sàng khô cứng. Mỗi phụ nữ là một nàng thơ bí ẩn đầy mê hoặc.
            </p>
            <p className="text-white/60 text-sm md:text-base font-light leading-relaxed">
              Hành trình tại Glamour Studio là cuộc đối thoại nghệ thuật tinh tế giữa bạn và các nghệ sĩ hàng đầu, nơi chúng tôi lắng nghe bản ngã bên trong để tạo tác nên một diện mạo kiêu sa lộng lẫy nhất mà vẫn giữ trọn nét độc nhất vô nhị vốn có.
            </p>

            <div className="pt-6">
              <div className="flex items-center gap-6">
                <div className="border border-[#E0A96D]/30 p-4 rounded-full">
                  <Award size={24} className="text-[#E0A96D]" />
                </div>
                <div>
                  <h4 className="text-sm font-mono tracking-wider uppercase text-white font-bold">Tiêu Chuẩn Backstage</h4>
                  <p className="text-xs text-white/50">Mỹ phẩm tuyển lựa cao cấp chuẩn sàn diễn thời trang quốc tế</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-12 gap-4 items-center">
            <div className="col-span-7 space-y-4">
              <div className="overflow-hidden rounded-2xl border border-[#E0A96D]/10 aspect-[3/4] relative group">
                <img 
                  src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80" 
                  alt="Backstage Artistry" 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
              </div>
            </div>
            <div className="col-span-5 space-y-4 pt-12">
              <div className="overflow-hidden rounded-2xl border border-[#E0A96D]/10 aspect-[1/1] relative group">
                <img 
                  src="https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80" 
                  alt="Eyelash detailing" 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
              </div>
              <div className="p-8 rounded-2xl border border-[#E0A96D]/20 bg-gradient-to-br from-[#111] to-[#050505] text-center space-y-2">
                <span className="text-2xl font-light text-[#E0A96D]" style={{ fontFamily: "'Playfair Display', serif" }}>100%</span>
                <p className="text-[9px] font-mono tracking-widest text-white/50 uppercase">Độc bản & Thủ công</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. THE GLAMOUR CATALOG */}
      <section id="services" className="py-24 md:py-36 px-6 md:px-12 bg-black relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(224,169,109,0.05),transparent_50%)]" />
        
        <div className="max-w-7xl mx-auto space-y-16 relative z-10">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="text-[10px] font-mono tracking-[0.4em] uppercase text-[#E0A96D] font-bold block">Danh Mục Sắc Đẹp</span>
            <h2 className="text-3xl md:text-5xl font-light tracking-wide text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
              Nghệ Thuật <span className="italic text-[#E0A96D]">Tạo Tác Nhan Sắc</span>
            </h2>
            <div className="h-[1px] w-20 bg-[#E0A96D]/50 mx-auto" />
            <p className="text-white/50 text-xs md:text-sm font-light">
              Mỗi tác phẩm của chúng tôi đều là thành quả của sự am hiểu sâu sắc, bàn tay khéo léo và mỹ phẩm thượng hạng được thiết kế riêng cho phong thái kiêu sa của bạn.
            </p>

            {isEditing && (
              <ArrayActionButtons
                onAdd={() => handleAddItem('services_menu', activeServices, SIGNATURE_SERVICES[0])}
                label="Dịch vụ"
                className="justify-center mt-4"
              />
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {activeServices.map((service: any, index: number) => (
              <div 
                key={index}
                className="group relative rounded-2xl border border-white/10 bg-[#0A0A0A] overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:border-[#E0A96D]/30 hover:shadow-[0_10px_30px_rgba(224,169,109,0.15)] flex flex-col h-full"
              >
                {isEditing && (
                  <div className="absolute top-4 right-4 z-20">
                    <ArrayActionButtons
                      onRemove={() => handleRemoveItem('services_menu', activeServices, index)}
                    />
                  </div>
                )}
                <div className="aspect-[4/3] w-full overflow-hidden relative">
                  <img 
                    src={service.img} 
                    alt={service.name} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent opacity-65" />
                  <div className="absolute top-4 right-4 bg-[#0A0A0A]/80 backdrop-blur-md border border-[#E0A96D]/30 px-3 py-1 rounded-full text-[9px] font-mono tracking-widest text-[#E0A96D] uppercase">
                    {service.price}
                  </div>
                </div>

                <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-[9px] font-mono tracking-widest text-[#E0A96D] uppercase block">{service.tagline}</span>
                    <h3 className="text-lg font-light tracking-wide text-white" style={{ fontFamily: "'Playfair Display', serif" }}>{service.name}</h3>
                    <p className="text-xs text-white/50 font-light leading-relaxed line-clamp-3">{service.desc}</p>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-white/60">
                    <span>{service.duration}</span>
                    <button 
                      onClick={() => openBookingWithService(service.name)}
                      className="text-[#E0A96D] font-bold tracking-widest flex items-center gap-1 group-hover:translate-x-1 transition-all"
                    >
                      ĐẶT CHỖ <ChevronRight size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. THE BACKSTAGE GALLERY */}
      <section id="backstage" className="py-24 md:py-36 px-6 md:px-12 bg-[#0A0A0A] relative">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="text-[10px] font-mono tracking-[0.4em] uppercase text-[#E0A96D] font-bold block">Glamour Backstage</span>
            <h2 className="text-3xl md:text-5xl font-light tracking-wide text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
              Khoảnh Khắc <span className="italic text-[#E0A96D]">Tỏa Sáng</span>
            </h2>
            <div className="h-[1px] w-20 bg-[#E0A96D]/50 mx-auto" />
            <p className="text-white/50 text-xs md:text-sm font-light">
              Chiêm ngưỡng những tuyệt tác nghệ thuật đọng lại sau cánh gà chuẩn haute couture của thượng khách.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BACKSTAGE_GALLERY.map((item, index) => (
              <div 
                key={index}
                className="group relative overflow-hidden rounded-2xl border border-white/5 aspect-[4/3] cursor-pointer"
              >
                <img 
                  src={item.img} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 filter saturate-50 group-hover:saturate-100 brightness-75 group-hover:brightness-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-85 transition-all duration-500" />
                <div className="absolute bottom-6 left-6 right-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 space-y-1 text-left">
                  <span className="text-[8px] font-mono tracking-[0.3em] uppercase text-[#E0A96D] block font-bold">{item.category}</span>
                  <h4 className="text-base font-light tracking-wide text-white" style={{ fontFamily: "'Playfair Display', serif" }}>{item.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. THE MAGIC TOUCH (Interactive Before/After Slider) */}
      <section className="py-24 md:py-36 px-6 bg-black relative">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <div className="space-y-4">
            <span className="text-[10px] font-mono tracking-[0.4em] uppercase text-[#E0A96D] font-bold block">Phép Màu Tạo Tác</span>
            <h2 className="text-3xl md:text-5xl font-light tracking-wide text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
              Sự <span className="italic text-[#E0A96D]">Chuyển Hóa</span> Kỳ Diệu
            </h2>
            <div className="h-[1px] w-20 bg-[#E0A96D]/50 mx-auto" />
            <p className="text-white/50 text-xs md:text-sm font-light max-w-xl mx-auto">
              Kéo thanh trượt để chứng kiến màn lột xác diện mạo ngoạn mục được thực hiện thủ công tỉ mỉ dưới đôi bàn tay vàng của nghệ sĩ.
            </p>
          </div>

          <div className="relative aspect-[16/10] w-full max-w-3xl mx-auto overflow-hidden rounded-3xl border-4 border-[#E0A96D]/30 shadow-[0_15px_50px_rgba(224,169,109,0.15)] select-none">
            {/* Before (Right Side / Full image) */}
            <img 
              src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80" 
              alt="Before Transformation" 
              className="absolute inset-0 w-full h-full object-cover filter saturate-[0.6] brightness-[0.7]"
            />
            <div className="absolute bottom-6 right-6 z-20 bg-black/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 text-[10px] font-mono tracking-widest text-white uppercase">
              Chưa Trang Điểm (Before)
            </div>

            {/* After (Left Side / Clipped Image) */}
            <div 
              className="absolute inset-0 z-10 w-full h-full overflow-hidden"
              style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
            >
              <img 
                src="https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80" 
                alt="After Glamour" 
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute bottom-6 left-6 bg-[#0A0A0A]/85 backdrop-blur-md px-4 py-1.5 rounded-full border border-[#E0A96D]/40 text-[10px] font-mono tracking-widest text-[#E0A96D] uppercase">
                Tỏa Sáng Kiêu Kỳ (After)
              </div>
            </div>

            {/* Slider line & handle */}
            <div 
              className="absolute top-0 bottom-0 z-20 w-1 bg-[#E0A96D] cursor-ew-resize"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black border-2 border-[#E0A96D] text-[#E0A96D] shadow-2xl flex items-center justify-center cursor-ew-resize hover:scale-110 active:scale-95 transition-transform">
                <ChevronLeft size={16} />
                <ChevronRight size={16} />
              </div>
            </div>

            {/* Hidden Input for dragging */}
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={sliderPosition} 
              onChange={(e) => setSliderPosition(Number(e.target.value))}
              className="absolute inset-0 z-30 w-full h-full opacity-0 cursor-ew-resize"
            />
          </div>
        </div>
      </section>

      {/* 6. THE BEAUTY CURATORS */}
      <section className="py-24 md:py-36 px-6 md:px-12 bg-[#0A0A0A] relative">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="text-[10px] font-mono tracking-[0.4em] uppercase text-[#E0A96D] font-bold block">Nghệ Sĩ Tạo Tác</span>
            <h2 className="text-3xl md:text-5xl font-light tracking-wide text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
              Hội Đồng <span className="italic text-[#E0A96D]">Chuyên Gia & Stylist</span>
            </h2>
            <div className="h-[1px] w-20 bg-[#E0A96D]/50 mx-auto" />
            <p className="text-white/50 text-xs md:text-sm font-light">
              Nơi hội tụ những bàn tay tài hoa của các nhà tạo mẫu quốc tế danh tiếng, mang tư duy nghệ thuật khác biệt để tạo tác nên kiệt tác nhan sắc của riêng bạn.
            </p>

            {isEditing && (
              <ArrayActionButtons
                onAdd={() => handleAddItem('expert_team', activeExperts, BEAUTY_CURATORS[0])}
                label="Chuyên gia"
                className="justify-center mt-4"
              />
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {activeExperts.map((curator: any, index: number) => (
              <div 
                key={index}
                className="group relative flex flex-col md:flex-row gap-8 items-center p-8 rounded-3xl border border-white/5 bg-black overflow-hidden hover:border-[#E0A96D]/30 transition-all duration-500 relative"
              >
                {isEditing && (
                  <div className="absolute top-4 right-4 z-20">
                    <ArrayActionButtons
                      onRemove={() => handleRemoveItem('expert_team', activeExperts, index)}
                    />
                  </div>
                )}
                <div className="w-48 h-48 rounded-full overflow-hidden border-2 border-[#E0A96D]/20 flex-shrink-0 relative">
                  <img 
                    src={curator.img} 
                    alt={curator.name} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 filter grayscale group-hover:grayscale-0"
                  />
                </div>

                <div className="space-y-4 text-center md:text-left">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono tracking-[0.2em] uppercase text-[#E0A96D] block font-bold">{curator.role} • {curator.origin}</span>
                    <h3 className="text-xl font-light text-white" style={{ fontFamily: "'Playfair Display', serif" }}>{curator.name}</h3>
                  </div>
                  <p className="text-xs text-white/50 font-light leading-relaxed">{curator.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. THE MUSE JOURNALS */}
      <section className="py-24 md:py-36 px-6 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(224,169,109,0.03),transparent_50%)]" />
        
        <div className="max-w-5xl mx-auto space-y-16 relative z-10 text-center">
          <div className="space-y-4">
            <span className="text-[10px] font-mono tracking-[0.4em] uppercase text-[#E0A96D] font-bold block">Hồi Ký Nàng Thơ</span>
            <h2 className="text-3xl md:text-5xl font-light tracking-wide text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
              Cảm Xúc từ <span className="italic text-[#E0A96D]">Nàng Thơ</span>
            </h2>
            <div className="h-[1px] w-20 bg-[#E0A96D]/50 mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl border border-white/5 bg-[#0A0A0A] hover:border-[#E0A96D]/20 transition-all space-y-6 text-left">
              <div className="flex gap-1 text-[#E0A96D]">
                <Star size={12} fill="#E0A96D" /><Star size={12} fill="#E0A96D" /><Star size={12} fill="#E0A96D" /><Star size={12} fill="#E0A96D" /><Star size={12} fill="#E0A96D" />
              </div>
              <p className="text-xs text-white/60 font-light leading-relaxed italic">
                "Tôi chưa bao giờ thấy mi nối tinh tế đến vậy. Từng sợi mi mượt mà, siêu nhẹ, uốn cong hoàn mỹ giúp đôi mắt tôi trở nên sâu thẳm kiêu sa mà không hề bị nặng nề."
              </p>
              <div className="pt-4 border-t border-white/5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80" alt="Reviewer" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Minh Thư</h4>
                  <p className="text-[8px] font-mono text-[#E0A96D] uppercase">Người mẫu ảnh tự do</p>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-3xl border border-[#E0A96D]/30 bg-[#0A0A0A] shadow-[0_10px_30px_rgba(224,169,109,0.05)] hover:border-[#E0A96D]/50 transition-all space-y-6 text-left relative">
              <div className="absolute top-4 right-4 text-[#E0A96D]/20 text-6xl font-serif">“</div>
              <div className="flex gap-1 text-[#E0A96D]">
                <Star size={12} fill="#E0A96D" /><Star size={12} fill="#E0A96D" /><Star size={12} fill="#E0A96D" /><Star size={12} fill="#E0A96D" /><Star size={12} fill="#E0A96D" />
              </div>
              <p className="text-xs text-white/70 font-light leading-relaxed italic">
                "Cảm giác bước chân vào Glamour Studio như bước vào một hậu trường đẳng cấp tại Paris. Leo đã trang điểm cho tôi một phong cách độc bản, mọi đường nét thanh lịch lộng lẫy và cực kỳ sang trọng."
              </p>
              <div className="pt-4 border-t border-[#E0A96D]/20 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80" alt="Reviewer" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Thảo Linh</h4>
                  <p className="text-[8px] font-mono text-[#E0A96D] uppercase">KOLs & Fashion Influencer</p>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-3xl border border-white/5 bg-[#0A0A0A] hover:border-[#E0A96D]/20 transition-all space-y-6 text-left">
              <div className="flex gap-1 text-[#E0A96D]">
                <Star size={12} fill="#E0A96D" /><Star size={12} fill="#E0A96D" /><Star size={12} fill="#E0A96D" /><Star size={12} fill="#E0A96D" /><Star size={12} fill="#E0A96D" />
              </div>
              <p className="text-xs text-white/60 font-light leading-relaxed italic">
                "Bộ móng tay Swarovski vẽ tay tinh xảo từ Glamour giúp tôi thu hút mọi ánh nhìn tại buổi dạ tiệc. Từng nét vẽ thanh tú, đá đính chắc chắn lấp lánh như viên kim cương thực thụ."
              </p>
              <div className="pt-4 border-t border-white/5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80" alt="Reviewer" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Khánh Vy</h4>
                  <p className="text-[8px] font-mono text-[#E0A96D] uppercase">Nữ Doanh Nhân</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. BACKSTAGE RESERVATION */}
      <section id="contact" className="py-24 md:py-36 px-6 bg-[#0A0A0A] relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="space-y-8 text-left">
            <div className="space-y-4">
              <span className="text-[10px] font-mono tracking-[0.4em] uppercase text-[#E0A96D] font-bold block">Liên Hệ & Đặt Lịch</span>
              <h2 className="text-3xl md:text-5xl font-light tracking-wide text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                Khởi Đầu Hành Trình <br/> <span className="italic text-[#E0A96D]">Tỏa Sáng</span>
              </h2>
            </div>
            <p className="text-white/50 text-xs md:text-sm font-light leading-relaxed">
              Hãy đặt trước lịch VIP để nhận được sự tư vấn chuyên sâu cùng các chuyên gia hàng đầu và sở hữu tấm vé độc bản sau hậu trường Backstage của chúng tôi.
            </p>

            <div className="space-y-4 text-xs md:text-sm font-mono tracking-wider uppercase text-white/70">
              <div className="flex items-center gap-4">
                <MapPin size={16} className="text-[#E0A96D]" />
                <span>{businessInfo.district ? `${businessInfo.district}, ${businessInfo.city}` : "Quận 1, Thành Phố Hồ Chí Minh"}</span>
              </div>
              <div className="flex items-center gap-4">
                <Phone size={16} className="text-[#E0A96D]" />
                <span>Hotline: {businessInfo.hotline || "1900 8888"}</span>
              </div>
              <div className="flex items-center gap-4">
                <Clock size={16} className="text-[#E0A96D]" />
                <span>Giờ mở cửa: {activeHours.weekdays} (T2-T6) • {activeHours.weekends} (T7-CN)</span>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-12 rounded-3xl border border-[#E0A96D]/30 bg-black relative overflow-hidden shadow-[0_15px_50px_rgba(224,169,109,0.1)]">
            <div className="absolute inset-0 bg-gradient-to-br from-[#111] via-black to-[#050505]" />
            
            <div className="relative z-10 space-y-6">
              <h3 className="text-xl md:text-2xl font-light text-center text-[#E0A96D] tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>Đăng Ký Khóa Lịch VIP Backstage</h3>
              
              {success ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#E0A96D]/20 flex items-center justify-center mx-auto border border-[#E0A96D]/50 text-[#E0A96D] text-2xl">✓</div>
                  <h4 className="text-lg font-light">Đăng Ký Thành Công</h4>
                  <p className="text-xs text-white/50 max-w-xs mx-auto font-light leading-relaxed">Mật thư xác nhận đặt lịch VIP sẽ được chuyển tới quý khách trong vòng 15 phút. Cảm ơn Nàng Thơ!</p>
                </div>
              ) : (
                <form onSubmit={handleBooking} className="space-y-5">
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono uppercase tracking-widest text-white/50 block">Họ và Tên Nàng Thơ</label>
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
                    <label className="text-[9px] font-mono uppercase tracking-widest text-white/50 block">Số Điện Thoại</label>
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
                    <label className="text-[9px] font-mono uppercase tracking-widest text-white/50 block">Chọn Tạo Tác Sắc Đẹp</label>
                    <select 
                      value={serviceRequested}
                      onChange={(e) => setServiceRequested(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3.5 text-xs text-white focus:outline-none focus:border-[#E0A96D]/50 transition-all font-mono"
                    >
                      <option value="">-- Đặt chỗ Backstage tự do --</option>
                      {activeServices.map((s: any, idx: number) => (
                        <option key={idx} value={s.name}>{s.name} ({s.price})</option>
                      ))}
                    </select>
                  </div>

                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="w-full py-4 rounded-xl text-black bg-gradient-to-r from-[#E0A96D] via-[#FFE2C2] to-[#B8860B] font-bold tracking-[0.2em] uppercase text-[10px] transition-all shadow-lg hover:scale-[1.01] flex items-center justify-center gap-2"
                  >
                    {submitting ? 'ĐANG KHOÁ LỊCH...' : 'GỬI ĐĂNG KÝ BACKSTAGE'}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-white/5 bg-[#050505] text-center text-xs text-white/30 font-mono tracking-widest uppercase relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span>© {new Date().getFullYear()} {businessInfo.name || "GLAMOUR STUDIO"}. ALL RIGHTS RESERVED.</span>
          <span className="text-[9px] text-white/20">DESIGNED FOR UNCOMPROMISING LUXURY</span>
        </div>
      </footer>

      {/* PREMIUM BOOKING MODAL */}
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
              className="relative w-full max-w-lg p-8 md:p-12 rounded-3xl border border-[#E0A96D]/30 bg-[#0A0A0A] overflow-hidden"
            >
              <button 
                onClick={() => setIsBookingModalOpen(false)}
                className="absolute top-6 right-6 text-white/40 hover:text-white p-2 rounded-full border border-white/10 hover:bg-white/5 transition-all"
              >
                <X size={16} />
              </button>

              <div className="space-y-6">
                <h3 className="text-2xl font-light text-[#E0A96D] tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {selectedService ? `Đặt Lịch: ${selectedService}` : 'Đặt Lịch VIP Concierge'}
                </h3>
                <p className="text-white/50 text-xs font-light">Mời nàng thơ hoàn thiện mật thư dưới đây, trợ lý sẽ liên hệ khóa lịch chỉ trong ít phút.</p>

                {success ? (
                  <div className="text-center py-8 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-[#E0A96D]/20 flex items-center justify-center mx-auto border border-[#E0A96D]/50 text-[#E0A96D] text-2xl">✓</div>
                    <h4 className="text-lg font-light">Đặt lịch thành công</h4>
                    <p className="text-xs text-white/50 max-w-xs mx-auto leading-relaxed">Hẹn gặp lại nàng thơ tại thánh đường lộng lẫy Glamour.</p>
                  </div>
                ) : (
                  <form onSubmit={handleBooking} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[8px] font-mono uppercase tracking-widest text-white/50 block">Họ và Tên Nàng Thơ</label>
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
                      <label className="text-[8px] font-mono uppercase tracking-widest text-white/50 block">Số Điện Thoại</label>
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
                      className="w-full py-4 rounded-xl text-black bg-gradient-to-r from-[#E0A96D] via-[#FFE2C2] to-[#B8860B] font-bold tracking-[0.2em] uppercase text-[10px] shadow-lg"
                    >
                      XÁC NHẬN ĐĂNG KÝ BACKSTAGE
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
