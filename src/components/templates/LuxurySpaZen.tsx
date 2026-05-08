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
  Compass, 
  Award, 
  Gift 
} from 'lucide-react'

// We will use framer-motion instead of react-motion for perfect compatibility
import { motion as motionFramer, AnimatePresence as AnimatePresenceFramer } from 'framer-motion'

interface LuxurySpaZenProps {
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

const SIGNATURE_JOURNEYS = [
  {
    name: 'Hành Trình Âm Thanh Tây Tạng',
    tagline: 'Sound Healing & Tibetan Therapy',
    duration: '90 Phút • Trị Liệu Chuyên Sâu',
    desc: 'Sự kết hợp tinh tế giữa sóng âm trầm ấm của chuông xoay Nepal và kỹ thuật bấm huyệt cổ truyền Tây Tạng, giúp khai thông luồng năng lượng tắc nghẽn, xua tan hoàn toàn căng thẳng mệt mỏi và đưa tâm trí vào trạng thái thiền sâu thanh tịnh.',
    price: '2.500.000đ',
    img: 'https://images.unsplash.com/photo-1544161515-4af6b1d46af0?auto=format&fit=crop&q=80'
  },
  {
    name: 'Liệu Pháp Thần Dược Vàng 24K',
    tagline: 'Imperial 24K Gold Skin Elixir',
    duration: '75 Phút • Đắp Mặt Nạ Hoàng Gia',
    desc: 'Liệu trình đắp mặt nạ lá vàng 24K nguyên chất kết hợp điện di tế bào gốc đại dương, kích thích sản sinh collagen tự nhiên vượt trội, xóa mờ nếp nhăn và mang lại làn da trắng hồng ngậm nước không tì vết.',
    price: '3.800.000đ',
    img: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80'
  },
  {
    name: 'Thanh Lọc Thảo Mộc Thụy Sĩ',
    tagline: 'Alpine Botanical Detoxification',
    duration: '60 Phút • Phục Hồi Sinh Khí',
    desc: 'Xông hơi thảo mộc kết hợp massage tinh dầu hữu cơ chiết xuất từ hoa cỏ vùng núi cao Thụy Sĩ, thúc đẩy quá trình đào thải độc tố sâu trong các thớ cơ, tái sinh năng lượng cơ thể tràn đầy tươi mới.',
    price: '1.900.000đ',
    img: 'https://images.unsplash.com/photo-1519689680058-324335c77ebe?auto=format&fit=crop&q=80'
  }
]

const THERAPISTS = [
  {
    name: 'Therapist Master Tenzin',
    role: 'Bậc Thầy Trị Liệu Âm Thanh & Luân Xa',
    origin: 'Nepal',
    desc: 'Với hơn 15 năm tu tập tại tu viện vùng Himalaya, Master Tenzin mang tới kỹ thuật chuông xoay Nepal trị liệu tâm thức độc bản.',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80'
  },
  {
    name: 'Dr. Evelyn Keller',
    role: 'Chuyên Gia Da Liễu Cao Cấp',
    origin: 'Thụy Sĩ',
    desc: 'Cựu cố vấn khoa học cho viện thẩm mỹ Zurich, Evelyn chịu trách nhiệm thiết kế các liệu trình trẻ hóa và phục hồi da chuyên sâu.',
    img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80'
  }
]

const HERO_SLIDES = [
  'https://images.unsplash.com/photo-1544161515-4af6b1d46af0?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519689680058-324335c77ebe?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80'
]

export default function LuxurySpaZen({ data, isEditing = false, onUpdate = () => {}, onImagePick, businessInfo = {}, hiddenSections = [], activeSection, onSectionClick }: LuxurySpaZenProps) {
  const {
    hero_section = {},
    about_us = {},
    services_menu = [],
    contact_info = {},
    operating_hours = {},
    social_trust = {},
    theme_color = '#C9A050', // Default luxury gold
    expert_team = []
  } = data

  const activeServices = services_menu && services_menu.length > 0 ? services_menu : SIGNATURE_JOURNEYS
  const activeExperts = expert_team && expert_team.length > 0 ? expert_team : THERAPISTS
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
      setCurrentHeroSlide((prev) => (prev + 1) % HERO_SLIDES.length)
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
    // Simulate API call for premium booking
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
    <div className="bg-[#F9F6F0] text-[#1F1F1F] font-sans selection:bg-[var(--primary)]/20 selection:text-[#1F1F1F] overflow-x-hidden pt-0" style={{ fontFamily: "'Montserrat', sans-serif" }}>
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
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 py-6 px-6 md:px-12 flex items-center justify-between ${isScrolled ? 'bg-[#F9F6F0]/95 border-b border-[#D4AF37]/20 backdrop-blur-md shadow-md' : 'bg-transparent border-b border-transparent backdrop-blur-none'}`}>
        <div className="flex items-center gap-4">
          {businessInfo.logo_url ? (
            <img 
              src={businessInfo.logo_url} 
              alt={businessInfo.name || "Logo"} 
              className="w-12 h-12 rounded-full border-2 border-[#D4AF37]/50 object-cover shadow-lg"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#D4AF37] via-[#F5E0A3] to-[#B8860B] flex items-center justify-center text-white font-serif font-bold text-xl shadow-lg border-2 border-[#D4AF37]/50">
              {(businessInfo.name || 'Z').charAt(0).toUpperCase()}
            </div>
          )}
          <span className={`hidden sm:inline-block text-xs font-mono font-bold tracking-[0.3em] uppercase ${isScrolled ? 'text-[#1F1F1F]' : 'text-white'}`}>
            {businessInfo.name || "AMARA WELLNESS"}
          </span>
        </div>

        <nav className={`hidden md:flex items-center gap-12 text-[10px] font-mono uppercase tracking-[0.4em] font-bold ${isScrolled ? 'text-[#1F1F1F]/70' : 'text-white/80'}`}>
          <a href="#about-us" className="hover:text-[#D4AF37] transition-all relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-[#D4AF37] hover:after:w-full after:transition-all">Triết Lý</a>
          <a href="#services" className="hover:text-[#D4AF37] transition-all relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-[#D4AF37] hover:after:w-full after:transition-all">Hành Trình</a>
          <a href="#sanctuary" className="hover:text-[#D4AF37] transition-all relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-[#D4AF37] hover:after:w-full after:transition-all">Thánh Đường</a>
          <a href="#contact" className="hover:text-[#D4AF37] transition-all relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-[#D4AF37] hover:after:w-full after:transition-all">Liên Hệ</a>
        </nav>

        <div className="flex items-center gap-3">
          <a 
            href="/"
            className={`hidden lg:inline-block px-5 py-2 rounded-full border text-[9px] font-bold tracking-widest uppercase transition-all backdrop-blur-sm ${isScrolled ? 'border-[#D4AF37]/40 text-[#1F1F1F] bg-white/50 hover:bg-[#D4AF37]/10' : 'border-white/30 text-white bg-white/5 hover:bg-white/15'}`}
          >
            Trang chủ
          </a>
          <button 
            onClick={() => openBookingWithService('')}
            className="px-6 py-2.5 rounded-full text-white bg-gradient-to-r from-[#D4AF37] via-[#F5E0A3] to-[#B8860B] font-bold tracking-[0.2em] uppercase text-[9px] transition-all shadow-[0_4px_15px_rgba(212,175,55,0.25)] hover:shadow-[0_6px_25px_rgba(212,175,55,0.4)] hover:-translate-y-0.5 active:translate-y-0"
          >
            Đặt Lịch VIP
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 rounded-full border transition-all ${isScrolled ? 'border-[#D4AF37]/30 bg-white/50 text-[#1F1F1F] hover:bg-[#D4AF37]/10' : 'border-white/20 bg-black/30 text-white hover:bg-white/10'}`}
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
            className="fixed inset-0 z-40 bg-[#F9F6F0]/98 backdrop-blur-lg flex flex-col items-center justify-center gap-8 md:hidden"
          >
            <nav className="flex flex-col items-center gap-8 text-[12px] font-mono uppercase tracking-[0.3em] text-[#1F1F1F] font-bold">
              <a href="#about-us" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#D4AF37] transition-all">Triết Lý</a>
              <a href="#services" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#D4AF37] transition-all">Hành Trình</a>
              <a href="#sanctuary" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#D4AF37] transition-all">Thánh Đường</a>
              <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#D4AF37] transition-all">Liên Hệ</a>
            </nav>
            <button 
              onClick={() => { setIsMobileMenuOpen(false); openBookingWithService(''); }}
              className="px-8 py-3.5 rounded-full text-white font-bold tracking-[0.2em] uppercase text-[10px] bg-gradient-to-r from-[#D4AF37] via-[#F5E0A3] to-[#B8860B] shadow-lg"
            >
              Đặt Lịch VIP Concierge
            </button>
          </motionFramer.div>
        )}
      </AnimatePresenceFramer>

      {/* 1. THE PRELUDE (Hero / Sensory Welcome) */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black text-white">
        <div className="absolute inset-0 z-0">
          <AnimatePresenceFramer mode="wait">
            <motionFramer.img 
              key={currentHeroSlide}
              src={HERO_SLIDES[currentHeroSlide]} 
              alt="Prelude background" 
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 0.45, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0 w-full h-full object-cover filter saturate-[0.8] brightness-[0.7]"
            />
          </AnimatePresenceFramer>
          {/* Warm Bottom fade */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#F9F6F0] via-black/10 to-transparent" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl space-y-8">
          <motionFramer.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-3 bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] px-6 py-2 rounded-full backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
              <span className="uppercase tracking-[0.3em] text-[9px] font-bold font-mono">The Art of Holistic Healing</span>
            </div>
            
            <h1 className="text-4xl md:text-7xl font-light leading-tight tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>
              <EditableField
                value={hero_section.hero_title || 'Thức Tỉnh Mọi Giác Quan'}
                onChange={(val) => onUpdate('hero_section.hero_title', val)}
                isEditing={isEditing}
                placeholder="Tiêu đề Hero..."
              />
            </h1>
            
            <p className="text-sm md:text-lg text-white/70 max-w-xl mx-auto font-light leading-relaxed">
              <EditableField
                value={hero_section.hero_subtitle || 'Hãy rũ bỏ mọi ồn ào đô thị và bước chân vào thánh đường thanh tịnh - nơi cơ thể được xoa dịu, tâm trí được thiền định và nhan sắc được tái sinh rạng rỡ.'}
                onChange={(val) => onUpdate('hero_section.hero_subtitle', val)}
                isEditing={isEditing}
                multiline
                placeholder="Mô tả / slogan..."
              />
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center pt-8">
              <button 
                onClick={() => openBookingWithService('')}
                className="px-8 py-3.5 rounded-full text-white font-bold tracking-[0.2em] uppercase text-[10px] bg-gradient-to-r from-[#D4AF37] via-[#F5E0A3] to-[#B8860B] shadow-xl hover:scale-105 transition-all relative overflow-hidden group"
              >
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                Khởi đầu Hành Trình
              </button>
              <a 
                href="#about-us"
                className="px-8 py-3.5 rounded-full border border-white/30 hover:border-white/60 text-white font-bold tracking-[0.2em] uppercase text-[10px] transition-all backdrop-blur-sm bg-white/5"
              >
                Khám Phá Triết Lý
              </a>
            </div>
          </motionFramer.div>
        </div>
      </section>

      {/* 2. THE SANCTUARY PHILOSOPHY (Triết lý chữa lành Thân - Tâm - Trí) */}
      <section id="about-us" className="py-32 md:py-48 px-6 bg-[#F9F6F0]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left: Asymmetric Vogue Imagery */}
          <div className="lg:col-span-5 relative">
            <div className="absolute -top-12 -left-12 w-64 h-64 border border-[#D4AF37]/30 rounded-tl-[4rem] hidden sm:block" />
            <img 
              src="https://images.unsplash.com/photo-1519689680058-324335c77ebe?auto=format&fit=crop&q=80" 
              alt="Philosophy image" 
              className="relative z-10 w-full rounded-[3rem] object-cover aspect-[4/5] shadow-2xl border border-[#D4AF37]/10"
            />
            <div className="absolute -bottom-10 -right-10 z-20 w-44 bg-white p-6 rounded-3xl shadow-xl border border-[#D4AF37]/15 text-center hidden md:block">
              <h4 className="text-3xl font-bold text-[#D4AF37]" style={{ fontFamily: "'Playfair Display', serif" }}>100%</h4>
              <p className="text-[9px] uppercase tracking-widest text-[#1F1F1F]/50 font-bold font-mono">Organic Botanicals</p>
            </div>
          </div>

          {/* Right: Immersive Storytelling */}
          <div className="lg:col-span-7 space-y-8 lg:pl-10">
            <span className="text-[#D4AF37] tracking-[0.4em] uppercase text-xs font-bold block">The Sanctuary Philosophy</span>
            <h2 className="text-3xl sm:text-5xl font-light text-[#1F1F1F] leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              <EditableField
                value={about_us.section_title || 'Nơi Tâm Hồn Đồng điệu cùng Thể xác'}
                onChange={(val) => onUpdate('about_us.section_title', val)}
                isEditing={isEditing}
                placeholder="Tiêu đề Về chúng tôi..."
              />
            </h2>
            <div className="w-20 h-[1px] bg-[#D4AF37]" />
            
            <p className="text-base text-[#1F1F1F]/70 leading-relaxed font-light">
              <EditableText
                value={about_us.intro_text || "Chúng tôi tin rằng vẻ đẹp thực sự không chỉ xuất phát từ những tác động bên ngoài, mà là kết quả của sự hòa hợp trọn vẹn giữa Thân - Tâm - Trí. Mỗi liệu trình tại spa của chúng tôi được thiết kế tỉ mỉ như một hành trình chữa lành toàn diện, kết hợp hài hòa giữa các bí pháp thảo mộc cổ truyền phương Đông và công nghệ khoa học phục hồi tiên tiến nhất thế giới."}
                isEditing={isEditing}
                onChange={(val) => onUpdate('about_us.intro_text', val)}
                multiline
              />
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] shrink-0">
                  <Compass size={16} />
                </div>
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#1F1F1F] mb-1">Cá Nhân Hóa Trị Liệu</h4>
                  <p className="text-xs text-[#1F1F1F]/60">Mỗi thượng khách được thăm khám và thiết lập phác đồ trị liệu da & cơ thể chuyên biệt.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] shrink-0">
                  <Award size={16} />
                </div>
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#1F1F1F] mb-1">Tiêu Chuẩn Quốc Tế 5★</h4>
                  <p className="text-xs text-[#1F1F1F]/60">Trải nghiệm dịch vụ nghỉ dưỡng cao cấp với phòng VIP biệt lập đầy đủ tiện nghi biệt lập.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. THE SIGNATURE JOURNEYS (Danh mục hành trình trị liệu) */}
      <section id="services" className="py-32 md:py-48 px-6 bg-white border-y border-[#D4AF37]/15">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-24 space-y-4">
            <span className="text-[#D4AF37] tracking-[0.4em] uppercase text-xs font-bold block">Signature Journeys</span>
            <h2 className="text-3xl sm:text-5xl font-light text-[#1F1F1F]" style={{ fontFamily: "'Playfair Display', serif" }}>
              Những Hành Trình <span className="italic text-[#D4AF37] font-serif">Trị Liệu Độc Bản</span>
            </h2>
            <div className="w-20 h-[1px] bg-[#D4AF37] mx-auto" />
            <p className="text-xs text-[#1F1F1F]/50 leading-relaxed max-w-xl mx-auto uppercase tracking-wider">
              Khám phá các gói trị liệu hoàng gia chuyên biệt, nuôi dưỡng trọn vẹn nhan sắc từ gốc rễ tế bào.
            </p>

            {isEditing && (
              <ArrayActionButtons
                onAdd={() => handleAddItem('services_menu', activeServices, SIGNATURE_JOURNEYS[0])}
                label="Dịch vụ"
                className="justify-center mt-4"
              />
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {activeServices.map((journey: any, i: number) => {
              const fallback = SIGNATURE_JOURNEYS[i % SIGNATURE_JOURNEYS.length]
              const sName = journey.service_name || journey.name || fallback.name
              const sTagline = journey.tagline || fallback.tagline
              const sDuration = journey.duration || fallback.duration
              const sDesc = journey.description || journey.desc || fallback.desc
              const sPrice = journey.price || fallback.price
              const sImg = journey.image_url || journey.img || fallback.img

              return (
                <motionFramer.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.8 }}
                  viewport={{ once: true, margin: "-50px" }}
                  onClick={() => {
                    if (!isEditing) {
                      setViewingService({ name: sName, tagline: sTagline, duration: sDuration, desc: sDesc, price: sPrice, img: sImg })
                    }
                  }}
                  className="group relative h-[520px] rounded-[3rem] overflow-hidden shadow-xl border border-[#D4AF37]/15 hover:border-[#D4AF37]/35 transition-all duration-[0.8s] flex flex-col justify-end p-8 cursor-pointer"
                >
                  {isEditing && (
                    <div className="absolute top-6 right-6 z-20">
                      <ArrayActionButtons
                        onRemove={() => handleRemoveItem('services_menu', activeServices, i)}
                      />
                    </div>
                  )}
                  {/* Background Image & Mirror Sheen */}
                  <div className="absolute inset-0 z-0 overflow-hidden bg-[#F9F6F0]">
                    <img 
                      src={sImg} 
                      alt={sName}
                      className="w-full h-[60%] object-cover filter brightness-[0.85] transition-all duration-[1.8s] ease-out group-hover:scale-105 group-hover:brightness-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#F9F6F0] via-[#F9F6F0]/95 to-[#F9F6F0]/0" />
                    
                    {/* Golden shine wave on hover */}
                    <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-[#F9F6F0]/40 to-transparent -skew-x-12 transition-all duration-[1.2s] ease-in-out group-hover:left-[200%]" />
                  </div>

                  {/* Badges */}
                  <div className="absolute top-6 left-6 z-10 flex gap-2">
                    <span className="bg-[#D4AF37] text-[#1F1F1F] font-mono text-[8px] font-bold tracking-widest px-3.5 py-1 rounded-full uppercase shadow-md">
                      LUXURY 5★
                    </span>
                  </div>

                  {/* Overlaid Content */}
                  <div className="relative z-10 space-y-4">
                    <p className="text-[#9c7a1c] text-[9px] font-bold tracking-[0.3em] uppercase flex items-center gap-1.5 font-mono">
                      <Clock size={11} />
                      <span>{sDuration}</span>
                    </p>

                    <div className="space-y-1.5">
                      <span className="text-[10px] text-[#2F2F2F]/50 uppercase tracking-widest font-mono block">{sTagline}</span>
                      <h3 className="text-xl sm:text-2xl font-bold text-[#1F1F1F] tracking-wide group-hover:text-[#9c7a1c] transition-colors leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                        <EditableText
                          value={sName}
                          isEditing={isEditing}
                          onChange={(val) => onUpdate(`services_menu[${i}].service_name`, val)}
                        />
                      </h3>
                      <p className="text-xs text-[#1F1F1F]/70 leading-relaxed font-light line-clamp-2">
                        {sDesc}
                      </p>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-[#D4AF37]/20 mt-2">
                      <div className="flex flex-col">
                        <span className="text-[9px] text-[#1F1F1F]/40 uppercase tracking-widest font-mono">Trọn Gói</span>
                        <span className="text-xl font-bold text-[#9c7a1c] tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>
                          <EditableText
                            value={sPrice}
                            isEditing={isEditing}
                            onChange={(val) => onUpdate(`services_menu[${i}].price`, val)}
                          />
                        </span>
                      </div>
                      
                      <button 
                        onClick={(e) => {
                          e.stopPropagation()
                          openBookingWithService(sName)
                        }}
                        className="px-5 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#F5E0A3] text-white hover:text-[#1F1F1F] rounded-full text-[9px] font-bold uppercase tracking-widest hover:brightness-105 active:scale-95 transition-all shadow-md"
                      >
                        Đặt lịch ngay
                      </button>
                    </div>
                  </div>
                </motionFramer.div>
              )
            })}
          </div>

        </div>
      </section>

      {/* 4. THE HEALING SANCTUARY (Không gian Thánh đường - Mosaic Gallery) */}
      <section id="sanctuary" className="py-32 md:py-48 px-6 bg-[#F9F6F0]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left: Text & Vision */}
          <div className="lg:col-span-4 space-y-6">
            <span className="text-[#D4AF37] tracking-[0.4em] uppercase text-xs font-bold block">The Healing Sanctuary</span>
            <h2 className="text-3xl sm:text-5xl font-light text-[#1F1F1F] leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              Thánh Đường <br/> <span className="italic text-[#D4AF37]">Yên Bình Biệt Lập</span>
            </h2>
            <div className="w-16 h-[1px] bg-[#D4AF37]" />
            <p className="text-base text-[#1F1F1F]/70 leading-relaxed font-light">
              Mỗi mét vuông tại spa của chúng tôi được thiết kế theo tỷ lệ vàng thiền định Đông Á, ngập tràn thanh âm tần số chữa lành tự nhiên và mùi hương mộc lan thanh thoát. Hệ thống phòng VIP riêng tư biệt lập có khu vực tắm hơi sương, jacuzzi và trà thất thảo mộc riêng để mang lại sự tĩnh lặng tuyệt hảo nhất cho Thượng khách.
            </p>
            <div className="pt-4">
              <button 
                onClick={() => openBookingWithService('Khám phá Thánh đường')}
                className="inline-flex items-center gap-2 border-b border-[#D4AF37] text-[#9c7a1c] font-bold text-xs uppercase tracking-widest pb-1.5 hover:text-[#1F1F1F] hover:border-[#1F1F1F] transition-all"
              >
                Đặt Lịch Khám Phá Thánh Đường <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Right: Asymmetric Mosaic Grid */}
          <div className="lg:col-span-8 grid grid-cols-12 gap-6 h-[500px]">
            <div className="col-span-7 h-full overflow-hidden rounded-[2.5rem] shadow-lg border border-[#D4AF37]/15">
              <img 
                src="https://images.unsplash.com/photo-1544161515-4af6b1d46af0?auto=format&fit=crop&q=80" 
                alt="Spa Sanctuary Room 1" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000 filter brightness-[0.9]"
              />
            </div>
            <div className="col-span-5 flex flex-col gap-6 h-full">
              <div className="h-1/2 overflow-hidden rounded-[2rem] shadow-lg border border-[#D4AF37]/15">
                <img 
                  src="https://images.unsplash.com/photo-1519689680058-324335c77ebe?auto=format&fit=crop&q=80" 
                  alt="Spa Sanctuary Room 2" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000 filter brightness-[0.9]"
                />
              </div>
              <div className="h-1/2 overflow-hidden rounded-[2rem] shadow-lg border border-[#D4AF37]/15">
                <img 
                  src="https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80" 
                  alt="Spa Sanctuary Room 3" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000 filter brightness-[0.9]"
                />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 5. BEFORE/AFTER TRANSMUTATION (Interactive Slider) */}
      <section className="py-32 md:py-48 px-6 bg-white border-y border-[#D4AF37]/15">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            
            {/* Left Description */}
            <div className="lg:w-1/2 space-y-8">
              <span className="text-[#D4AF37] tracking-[0.4em] uppercase text-xs font-bold block">Skin Transmutation</span>
              <h2 className="text-3xl sm:text-5xl font-light leading-tight text-[#1F1F1F]" style={{ fontFamily: "'Playfair Display', serif" }}>
                Sự Chuyển Hóa <br/> <span className="italic text-[#D4AF37]">Từ Sâu Bên Trong</span>
              </h2>
              <div className="w-16 h-[1px] bg-[#D4AF37]" />
              <p className="text-base text-[#1F1F1F]/70 leading-relaxed font-light">
                Chứng kiến sự phục sinh hoàn hảo của tế bào da nhờ liệu trình **Đắp Vàng Hoàng Gia 24K**. Từng nếp nhăn đuôi mắt xỉn màu và đốm nâu của lão hóa hoàn toàn biến mất, nhường chỗ cho làn da ngậm nước căng mịn và tràn đầy sinh khí thanh xuân.
              </p>
              
              <div className="grid grid-cols-2 gap-8 pt-4">
                <div className="border-l-2 border-[#D4AF37] pl-4 space-y-1">
                  <h4 className="text-3xl font-bold text-[#D4AF37]" style={{ fontFamily: "'Playfair Display', serif" }}>-5 Tuổi</h4>
                  <p className="text-[9px] uppercase tracking-wider text-[#1F1F1F]/50 font-mono font-bold">Lão hóa sinh học</p>
                </div>
                <div className="border-l-2 border-[#D4AF37] pl-4 space-y-1">
                  <h4 className="text-3xl font-bold text-[#D4AF37]" style={{ fontFamily: "'Playfair Display', serif" }}>10 Lần</h4>
                  <p className="text-[9px] uppercase tracking-wider text-[#1F1F1F]/50 font-mono font-bold">Kích thích Collagen</p>
                </div>
              </div>
            </div>

            {/* Right Interactive Slider bọc viền mạ vàng */}
            <div className="lg:w-1/2 w-full flex justify-center">
              <div className="relative w-full max-w-[480px] aspect-[4/5] rounded-[3rem] overflow-hidden border-4 border-[#D4AF37]/30 shadow-[0_25px_60px_rgba(212,175,55,0.18)] select-none group/slider">
                
                {/* AFTER IMAGE */}
                <img 
                  src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80" 
                  alt="After Treatment" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute bottom-6 right-6 z-10 bg-[#D4AF37] text-white font-mono text-[9px] font-bold tracking-widest px-4 py-1.5 rounded-full uppercase shadow-md">
                  Sau Trị Liệu
                </div>

                {/* BEFORE IMAGE (Clipped) */}
                <div 
                  className="absolute inset-0 overflow-hidden"
                  style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
                >
                  <img 
                    src="https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80" 
                    alt="Before Treatment" 
                    className="absolute inset-0 w-full h-full object-cover filter brightness-[0.8] saturate-[0.8]"
                    style={{ width: '100%', height: '100%' }}
                  />
                  <div className="absolute bottom-6 left-6 z-10 bg-[#1F1F1F]/80 backdrop-blur-md text-white border border-white/20 font-mono text-[9px] font-bold tracking-widest px-4 py-1.5 rounded-full uppercase shadow-md">
                    Trước Trị Liệu
                  </div>
                </div>

                {/* SLIDER HANDLE */}
                <div 
                  className="absolute top-0 bottom-0 z-20 w-[2px] bg-[#D4AF37] cursor-ew-resize"
                  style={{ left: `${sliderPosition}%` }}
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full border-2 border-[#D4AF37] bg-white shadow-xl flex items-center justify-center transition-transform group-hover/slider:scale-110 active:scale-95">
                    <div className="flex gap-1.5 items-center justify-center text-[#D4AF37]">
                      <span className="text-[10px] font-bold">◀</span>
                      <span className="text-[10px] font-bold">▶</span>
                    </div>
                  </div>
                </div>

                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={sliderPosition}
                  onChange={(e) => setSliderPosition(Number(e.target.value))}
                  className="absolute inset-0 z-30 opacity-0 cursor-ew-resize w-full h-full"
                />

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. THERAPEUTIC MASTERY (Đội ngũ bác sĩ & bậc thầy trị liệu) */}
      <section className="py-32 md:py-48 px-6 bg-[#F9F6F0]">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-24 space-y-4">
            <span className="text-[#D4AF37] tracking-[0.4em] uppercase text-xs font-bold block">Therapeutic Mastery</span>
            <h2 className="text-3xl sm:text-5xl font-light text-[#1F1F1F]" style={{ fontFamily: "'Playfair Display', serif" }}>
              Những Bậc Thầy <span className="italic text-[#D4AF37] font-serif">Chữa Lành</span>
            </h2>
            <div className="w-20 h-[1px] bg-[#D4AF37] mx-auto" />
            <p className="text-xs text-[#1F1F1F]/50 max-w-xl mx-auto uppercase tracking-wider leading-relaxed">
              Sở hữu đội ngũ trị liệu viên dày dặn kinh nghiệm, thấu hiểu tường tận huyệt đạo cơ thể và kỹ năng điêu luyện chuẩn y khoa quốc tế.
            </p>

            {isEditing && (
              <ArrayActionButtons
                onAdd={() => handleAddItem('expert_team', activeExperts, THERAPISTS[0])}
                label="Chuyên gia"
                className="justify-center mt-4"
              />
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {activeExperts.map((therapist: any, i: number) => (
              <motionFramer.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                viewport={{ once: true }}
                className="group bg-white rounded-[3rem] overflow-hidden border border-[#D4AF37]/15 shadow-xl hover:shadow-[0_25px_55px_rgba(212,175,55,0.1)] transition-all duration-500 p-8 flex flex-col md:flex-row gap-8 items-center relative"
              >
                {isEditing && (
                  <div className="absolute top-4 right-4 z-20">
                    <ArrayActionButtons
                      onRemove={() => handleRemoveItem('expert_team', activeExperts, i)}
                    />
                  </div>
                )}
                <div className="w-40 h-40 rounded-full overflow-hidden shrink-0 border-2 border-[#D4AF37]/30 shadow-lg">
                  <img 
                    src={therapist.img} 
                    alt={therapist.name} 
                    className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700"
                  />
                </div>
                <div className="space-y-3 text-center md:text-left">
                  <span className="text-[#D4AF37] font-mono text-[8px] font-bold tracking-widest px-3 py-1 rounded-full bg-[#D4AF37]/10 uppercase inline-block">
                    {therapist.origin}
                  </span>
                  <h3 className="text-2xl font-bold text-[#1F1F1F] leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {therapist.name}
                  </h3>
                  <p className="text-xs text-[#9c7a1c] font-bold font-mono tracking-wider uppercase">{therapist.role}</p>
                  <p className="text-xs text-[#1F1F1F]/60 leading-relaxed font-light">{therapist.desc}</p>
                </div>
              </motionFramer.div>
            ))}
          </div>

        </div>
      </section>

      {/* 7. LUXURY SKINCARE PARTNERSHIPS */}
      <section className="py-24 px-6 bg-white border-y border-[#D4AF37]/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#D4AF37] tracking-[0.4em] uppercase text-[9px] font-bold block mb-2 font-mono">Exclusive Partnerships</span>
            <p className="text-xs text-[#1F1F1F]/50 uppercase tracking-widest">Đồng hành độc quyền cùng các đại diện mỹ phẩm hoàng gia</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-12 md:gap-20 items-center opacity-70">
            <div className="text-xl md:text-3xl font-light text-[#D4AF37] tracking-[0.3em] font-serif uppercase">LA MER</div>
            <div className="text-xl md:text-3xl font-light text-[#D4AF37] tracking-[0.3em] font-serif uppercase">DIOR</div>
            <div className="text-xl md:text-3xl font-light text-[#D4AF37] tracking-[0.3em] font-serif uppercase">VALMONT</div>
            <div className="text-xl md:text-3xl font-light text-[#D4AF37] tracking-[0.3em] font-serif uppercase">CHANEL</div>
          </div>
        </div>
      </section>

      {/* 8. THE THƯỢNG KHÁCH JOURNALS (Hồi ký thượng khách / Quotes) */}
      <section className="py-32 md:py-48 px-6 bg-[#F9F6F0] overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            
            <div className="lg:w-1/3 space-y-8">
              <span className="text-[#D4AF37] tracking-[0.4em] uppercase text-xs font-bold block">Thượng Khách Journals</span>
              <h2 className="text-3xl sm:text-5xl font-light leading-tight text-[#1F1F1F]" style={{ fontFamily: "'Playfair Display', serif" }}>
                Lời Kể Từ <br/> <span className="italic text-[#D4AF37]">Thượng Khách</span>
              </h2>
              <div className="w-16 h-[1px] bg-[#D4AF37]" />
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map(s => <Star key={s} size={18} className="fill-[#D4AF37] text-[#D4AF37]" />)}
              </div>
              <p className="text-sm text-[#1F1F1F]/60 leading-relaxed font-light">
                Hơn 200 lượt đánh giá hoàn hảo từ giới doanh nhân, đại sứ và nghệ sĩ nổi tiếng đã chọn chúng tôi làm người bạn đồng hành cho hành trình chăm sóc nhan sắc và phục hồi sức khỏe tinh thần.
              </p>
            </div>

            <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-8 relative w-full">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-[100px]" />
              
              <motionFramer.div 
                whileHover={{ y: -5 }}
                className="bg-white p-10 rounded-[2.5rem] border border-white shadow-xl relative z-10 transition-all duration-500 h-fit"
              >
                <div className="text-5xl text-[#D4AF37] opacity-30 font-serif absolute top-6 left-6">“</div>
                <p className="italic text-[#1F1F1F]/70 leading-relaxed mb-8 relative z-10 mt-6 text-sm font-light">
                  "Không gian biệt lập yên tĩnh đến mức tôi có thể nghe thấy hơi thở của chính mình. Sự chu đáo tỉ mỉ từ khi đặt chân vào đến khi dùng trà thất thảo mộc sau liệu trình chuông Nepal trị liệu âm thanh giúp đầu óc tôi được rũ bỏ hết stress sau những ngày họp hành căng thẳng."
                </p>
                <div className="flex items-center gap-4 pt-4 border-t border-[#D4AF37]/10">
                  <div className="w-9 h-9 rounded-full bg-[#D4AF37]/15 flex items-center justify-center text-[#D4AF37] font-bold text-xs">MA</div>
                  <div>
                    <h5 className="text-xs font-bold text-[#1F1F1F] uppercase tracking-wider">- Chị Minh Anh</h5>
                    <p className="text-[9px] text-[#1F1F1F]/40 uppercase font-mono tracking-widest">Doanh nhân sáng lập VIP</p>
                  </div>
                </div>
              </motionFramer.div>

              <motionFramer.div 
                whileHover={{ y: -5 }}
                className="bg-white p-10 rounded-[2.5rem] border border-white shadow-xl relative z-10 md:translate-y-12 transition-all duration-500 h-fit"
              >
                <div className="text-5xl text-[#D4AF37] opacity-30 font-serif absolute top-6 left-6">“</div>
                <p className="italic text-[#1F1F1F]/70 leading-relaxed mb-8 relative z-10 mt-6 text-sm font-light">
                  "Tôi cực kỳ khắt khe về việc điều trị da mặt, nhưng liệu trình đắp lá vàng 24K tại đây hoàn toàn thuyết phục tôi. Da mặt tôi căng bóng ngậm nước ngay lập tức và các quầng thâm mệt mỏi ở đuôi mắt hoàn toàn được thuyên giảm kỳ diệu."
                </p>
                <div className="flex items-center gap-4 pt-4 border-t border-[#D4AF37]/10">
                  <div className="w-9 h-9 rounded-full bg-[#D4AF37]/15 flex items-center justify-center text-[#D4AF37] font-bold text-xs">NL</div>
                  <div>
                    <h5 className="text-xs font-bold text-[#1F1F1F] uppercase tracking-wider">- Anh Ngọc Lâm</h5>
                    <p className="text-[9px] text-[#1F1F1F]/40 uppercase font-mono tracking-widest">Giám đốc Nghệ thuật</p>
                  </div>
                </div>
              </motionFramer.div>
            </div>

          </div>
        </div>
      </section>

      {/* 9. THE CONCIERGE & MAP (Liên hệ & Bản đồ) */}
      <section id="contact" className="py-32 md:py-48 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#F9F6F0] rounded-[4rem] border border-[#D4AF37]/20 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
            
            {/* Left Column: Premium Contact Info */}
            <div className="lg:col-span-5 bg-[#1F1F1F] text-white p-12 md:p-20 flex flex-col justify-between space-y-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 border-b border-l border-[#D4AF37]/10 rounded-bl-[4rem] pointer-events-none" />
              
              <div className="space-y-6">
                <span className="text-[#D4AF37] tracking-[0.4em] uppercase text-xs font-bold block font-mono">Conciege VIP</span>
                <h2 className="text-3xl sm:text-4xl font-light leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Hân Hạnh <br/> <span className="italic text-[#D4AF37]">Chào Đón Thượng Khách</span>
                </h2>
                <div className="w-16 h-[1px] bg-[#D4AF37]" />
              </div>

              <div className="space-y-6 text-sm">
                <div className="flex gap-4 items-start">
                  <MapPin size={18} className="text-[#D4AF37] shrink-0 mt-0.5" />
                  <p className="text-white/70 font-light leading-relaxed">
                    {contact_info.address || "Biệt thự số 24, Thảo Điền, Quận 2, TP. Hồ Chí Minh"}
                  </p>
                </div>
                <div className="flex gap-4 items-start">
                  <Phone size={18} className="text-[#D4AF37] shrink-0 mt-0.5" />
                  <p className="text-white/70 font-light leading-relaxed">
                    {contact_info.hotline || "Hotline Đặt Lịch VIP: 0918.731.411"}
                  </p>
                </div>
                <div className="flex gap-4 items-start">
                  <Clock size={18} className="text-[#D4AF37] shrink-0 mt-0.5" />
                  <div className="text-white/70 font-light leading-relaxed space-y-1">
                    <p>Ngày thường: {activeHours.weekdays}</p>
                    <p>Cuối tuần: {activeHours.weekends}</p>
                  </div>
                </div>
              </div>

              <p className="text-[9px] font-mono tracking-[0.4em] text-[#D4AF37]/40 uppercase pt-8">
                Amara Wellness Sanctuary © 2026
              </p>
            </div>

            {/* Right Column: Premium Booking Form */}
            <div className="lg:col-span-7 p-12 md:p-20 space-y-8">
              <h3 className="text-2xl font-bold text-[#1F1F1F]" style={{ fontFamily: "'Playfair Display', serif" }}>
                Đặt Lịch Trị Liệu Cá Nhân Hóa
              </h3>
              <p className="text-xs text-[#1F1F1F]/60 font-light leading-relaxed max-w-xl">
                Quý khách vui lòng để lại thông tin liên hệ. Bộ phận Concierge VIP chăm sóc Thượng khách của chúng tôi sẽ liên hệ tư vấn và xác nhận giờ hẹn riêng biệt trong vòng 30 phút.
              </p>

              {success ? (
                <div className="space-y-4 p-8 border border-[#D4AF37]/30 bg-white rounded-3xl text-center">
                  <h4 className="text-2xl text-[#9c7a1c] font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Đăng ký thành công!</h4>
                  <p className="text-xs text-[#1F1F1F]/70 leading-relaxed font-light">
                    Mã đặt hẹn VIP của quý khách đã được lưu trên hệ thống. Nhân viên tư vấn cá nhân sẽ liên hệ chăm sóc quý khách ngay lập tức.
                  </p>
                  <button 
                    onClick={() => setSuccess(false)}
                    className="px-6 py-2 rounded-full text-white bg-[#D4AF37] text-[9px] font-bold uppercase tracking-widest font-mono"
                  >
                    Đăng Ký Mới
                  </button>
                </div>
              ) : (
                <form onSubmit={handleBooking} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-[9px] text-[#9c7a1c] font-bold uppercase tracking-widest font-mono">Họ tên Thượng khách</label>
                      <input 
                        type="text" 
                        placeholder="Họ và tên của quý khách *" 
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full bg-white border border-[#D4AF37]/30 rounded-2xl py-3.5 px-4 text-xs font-semibold outline-none focus:border-[#D4AF37] transition-all h-12" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-[#9c7a1c] font-bold uppercase tracking-widest font-mono">Số điện thoại VIP</label>
                      <input 
                        type="tel" 
                        placeholder="Số điện thoại liên hệ *" 
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full bg-white border border-[#D4AF37]/30 rounded-2xl py-3.5 px-4 text-xs font-semibold outline-none focus:border-[#D4AF37] transition-all h-12" 
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] text-[#9c7a1c] font-bold uppercase tracking-widest font-mono">Hành trình Trị liệu Quan tâm</label>
                    <select
                      value={serviceRequested}
                      onChange={(e) => setServiceRequested(e.target.value)}
                      className="w-full bg-white border border-[#D4AF37]/30 rounded-2xl py-3.5 px-4 text-xs font-semibold outline-none focus:border-[#D4AF37] transition-all cursor-pointer h-12"
                    >
                      <option value="">-- Chọn Hành Trình Bạn Muốn Trải Nghiệm --</option>
                      {activeServices.map((j: any, idx: number) => {
                        const fallback = SIGNATURE_JOURNEYS[idx % SIGNATURE_JOURNEYS.length]
                        const sName = j.service_name || j.name || fallback.name
                        return (
                          <option key={idx} value={sName}>
                            {sName}
                          </option>
                        )
                      })}
                      <option value="Trị Liệu Tổng Thể">Tư Vấn Thiết Kế Phác Đồ Cá Nhân Hóa (Miễn phí)</option>
                    </select>
                  </div>

                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="w-full py-4 rounded-2xl text-white font-bold uppercase tracking-[0.25em] text-[10px] transition-all shadow-[0_8px_20px_rgba(212,175,55,0.25)] hover:shadow-[0_12px_30px_rgba(212,175,55,0.35)] disabled:opacity-50 mt-4 bg-gradient-to-r from-[#D4AF37] via-[#F5E0A3] to-[#B8860B]"
                  >
                    {submitting ? 'Đang gửi yêu cầu...' : 'GỬI ĐĂNG KÝ HÀNH TRÌNH VIP'}
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* DETAIL MODAL POPUP */}
      <AnimatePresenceFramer>
        {viewingService && (
          <motionFramer.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
          >
            <motionFramer.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="relative w-full max-w-[650px] bg-[#F9F6F0] rounded-[3.5rem] overflow-hidden border-2 border-[#D4AF37]/30 shadow-2xl p-8 md:p-12 space-y-6"
            >
              <button 
                onClick={() => setViewingService(null)}
                className="absolute top-6 right-6 p-2 rounded-full border border-[#D4AF37]/30 hover:bg-[#D4AF37]/10 transition-all text-[#1F1F1F]"
              >
                <X size={18} />
              </button>
              
              <div className="h-48 rounded-[2rem] overflow-hidden border border-[#D4AF37]/15">
                <img src={viewingService.img} alt={viewingService.name} className="w-full h-full object-cover filter brightness-[0.9]" />
              </div>

              <div className="space-y-4">
                <p className="text-[#9c7a1c] text-[10px] font-bold tracking-[0.3em] uppercase font-mono">{viewingService.duration}</p>
                <h3 className="text-2xl md:text-3xl font-bold text-[#1F1F1F]" style={{ fontFamily: "'Playfair Display', serif" }}>{viewingService.name}</h3>
                <p className="text-xs text-[#1F1F1F]/70 leading-relaxed font-light">{viewingService.desc}</p>
              </div>

              <div className="flex justify-between items-center pt-6 border-t border-[#D4AF37]/20">
                <div className="flex flex-col">
                  <span className="text-[9px] text-[#1F1F1F]/40 uppercase tracking-widest font-mono">Tổng Chi Phí</span>
                  <span className="text-2xl font-bold text-[#9c7a1c]" style={{ fontFamily: "'Playfair Display', serif" }}>{viewingService.price}</span>
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={() => { setViewingService(null); openBookingWithService(viewingService.name); }}
                    className="px-6 py-3 rounded-full text-white bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[10px] font-bold uppercase tracking-widest shadow-md"
                  >
                    Đăng ký ngay
                  </button>
                </div>
              </div>
            </motionFramer.div>
          </motionFramer.div>
        )}
      </AnimatePresenceFramer>

      {/* GLOBAL BOOKING MODAL */}
      <AnimatePresenceFramer>
        {isBookingModalOpen && (
          <motionFramer.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
          >
            <motionFramer.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="relative w-full max-w-[500px] bg-[#F9F6F0] rounded-[3rem] overflow-hidden border-2 border-[#D4AF37]/30 shadow-2xl p-8 md:p-10 space-y-6"
            >
              <button 
                onClick={() => { setIsBookingModalOpen(false); setSuccess(false); }}
                className="absolute top-6 right-6 p-2 rounded-full border border-[#D4AF37]/30 hover:bg-[#D4AF37]/10 transition-all text-[#1F1F1F]"
              >
                <X size={18} />
              </button>

              <div className="text-center space-y-2">
                <span className="text-[#D4AF37] tracking-[0.4em] uppercase text-[9px] font-bold block font-mono">VIP Sanctuary Booking</span>
                <h3 className="text-2xl font-bold text-[#1F1F1F]" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {selectedService ? 'Đăng Ký Trải Nghiệm' : 'Yêu Cầu Tư Vấn VIP'}
                </h3>
                {selectedService && (
                  <p className="text-xs text-[#9c7a1c] font-bold font-mono tracking-wider uppercase">
                    {selectedService}
                  </p>
                )}
              </div>

              {success ? (
                <div className="space-y-4 p-8 border border-[#D4AF37]/30 bg-white rounded-3xl text-center">
                  <h4 className="text-xl text-[#9c7a1c] font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Đăng ký thành công!</h4>
                  <p className="text-xs text-[#1F1F1F]/70 leading-relaxed font-light">
                    Mã đặt hẹn VIP của quý khách đã được lưu trên hệ thống. Bộ phận Concierge sẽ liên hệ phục vụ quý khách ngay lập tức.
                  </p>
                  <button 
                    onClick={() => { setIsBookingModalOpen(false); setSuccess(false); }}
                    className="px-6 py-2 rounded-full text-white bg-[#D4AF37] text-[9px] font-bold uppercase tracking-widest font-mono"
                  >
                    Đóng cửa sổ
                  </button>
                </div>
              ) : (
                <form onSubmit={handleBooking} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[9px] text-[#9c7a1c] font-bold uppercase tracking-widest font-mono">Họ tên Thượng khách</label>
                    <input 
                      type="text" 
                      placeholder="Họ và tên của quý khách *" 
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-white border border-[#D4AF37]/30 rounded-2xl py-3 px-4 text-xs font-semibold outline-none focus:border-[#D4AF37] transition-all h-11" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] text-[#9c7a1c] font-bold uppercase tracking-widest font-mono">Số điện thoại VIP</label>
                    <input 
                      type="tel" 
                      placeholder="Số điện thoại liên hệ *" 
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full bg-white border border-[#D4AF37]/30 rounded-2xl py-3 px-4 text-xs font-semibold outline-none focus:border-[#D4AF37] transition-all h-11" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] text-[#9c7a1c] font-bold uppercase tracking-widest font-mono">Dịch vụ Trải nghiệm</label>
                    <select
                      value={serviceRequested}
                      onChange={(e) => setServiceRequested(e.target.value)}
                      className="w-full bg-white border border-[#D4AF37]/30 rounded-2xl py-3 px-4 text-xs font-semibold outline-none focus:border-[#D4AF37] transition-all cursor-pointer h-11"
                    >
                      <option value="">-- Chọn Hành Trình Bạn Muốn Trải Nghiệm --</option>
                      {activeServices.map((j: any, idx: number) => {
                        const fallback = SIGNATURE_JOURNEYS[idx % SIGNATURE_JOURNEYS.length]
                        const sName = j.service_name || j.name || fallback.name
                        return (
                          <option key={idx} value={sName}>
                            {sName}
                          </option>
                        )
                      })}
                      <option value="Trị Liệu Tổng Thể">Tư Vấn Thiết Kế Phác Đồ Cá Nhân Hóa (Miễn phí)</option>
                    </select>
                  </div>
                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="w-full py-3.5 rounded-2xl text-white font-bold uppercase tracking-[0.25em] text-[10px] transition-all shadow-[0_8px_20px_rgba(212,175,55,0.25)] hover:shadow-[0_12px_30px_rgba(212,175,55,0.35)] disabled:opacity-50 mt-4 bg-gradient-to-r from-[#D4AF37] via-[#F5E0A3] to-[#B8860B]"
                  >
                    {submitting ? 'Đang gửi yêu cầu...' : 'GỬI ĐĂNG KÝ HÀNH TRÌNH VIP'}
                  </button>
                </form>
              )}
            </motionFramer.div>
          </motionFramer.div>
        )}
      </AnimatePresenceFramer>

    </div>
  )
}
