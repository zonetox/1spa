'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { EditableText } from '@/components/shared/EditableText'
import { EditableField, ImageEditOverlay, ArrayActionButtons } from '@/components/shared/EditorOverlay'
import { Phone, MessageCircle, MapPin, Clock, Star, Calendar, MessageSquare, X, Menu, Plus, Trash2, ChevronRight } from 'lucide-react'

interface RoyalClassicProps {
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

const FALLBACK_SERVICES = [
  {
    service_name: 'Trẻ hóa da Ultherapy',
    description: 'Nâng cơ, xóa nhăn không xâm lấn với công nghệ sóng siêu âm hội tụ đỉnh cao từ Hoa Kỳ.',
    price: '25.000.000đ',
    image_url: 'https://images.unsplash.com/photo-1570172619644-defd00bb34da?auto=format&fit=crop&q=80'
  },
  {
    service_name: 'Massage Đá Nóng Tây Tạng',
    description: 'Trị liệu phục hồi năng lượng sâu sắc kết hợp đá núi lửa bazan tự nhiên và tinh dầu thảo mộc Tây Tạng quý hiếm.',
    price: '1.800.000đ',
    image_url: 'https://images.unsplash.com/photo-1544161515-4af6b1d46af0?auto=format&fit=crop&q=80'
  },
  {
    service_name: 'Cấy Tinh Chất Collagen Tươi',
    description: 'Phục hồi tế bào da, làm sáng và săn chắc da tức thì bằng công nghệ điện di tinh chất collagen đại dương.',
    price: '3.500.000đ',
    image_url: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80'
  },
  {
    service_name: 'Ủ Trắng Thảo Mộc Hoàng Cung',
    description: 'Nuôi dưỡng làn da trắng hồng bật tone tự nhiên với thảo mộc bí truyền kết hợp ánh sáng hồng ngoại sinh học.',
    price: '4.500.000đ',
    image_url: 'https://images.unsplash.com/photo-1519689680058-324335c77ebe?auto=format&fit=crop&q=80'
  },
  {
    service_name: 'Thải Độc Da Bằng Vàng 24K',
    description: 'Liệu trình đắp mặt nạ lá vàng 24K nguyên chất, kích thích tái tạo collagen, thanh lọc độc tố sâu bên trong.',
    price: '5.000.000đ',
    image_url: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80'
  },
  {
    service_name: 'Giảm Mỡ Tạo Dáng Slim Lipo',
    description: 'Sử dụng công nghệ sóng siêu âm hội tụ phá hủy mỡ thừa cục bộ, tạo form dáng S-line chuẩn quyến rũ.',
    price: '15.000.000đ',
    image_url: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&q=80'
  }
]

const FALLBACK_HOURS = {
  "monday": "08:00 - 20:00",
  "tuesday": "08:00 - 20:00",
  "wednesday": "08:00 - 20:00",
  "thursday": "08:00 - 20:00",
  "friday": "08:00 - 20:00",
  "saturday": "08:00 - 18:00",
  "sunday": "Nghỉ"
}

const FALLBACK_TEAM = [
  { 
    name: 'Dr. Elizabeth Muller', 
    role: 'Giám đốc chuyên môn', 
    img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80',
    desc: 'Chuyên gia đầu ngành với hơn 15 năm kinh nghiệm trong lĩnh vực trị liệu thẩm mỹ cao cấp.'
  },
  { 
    name: 'Master Hoàng Anh', 
    role: 'Bậc thầy trị liệu da liễu', 
    img: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80',
    desc: 'Nổi tiếng với kỹ thuật trẻ hóa da độc quyền và sự tận tâm trong từng liệu trình.'
  }
]

export default function RoyalClassic({ data, isEditing = false, onUpdate = () => {}, onImagePick, businessInfo = {}, hiddenSections = [], activeSection, onSectionClick }: RoyalClassicProps) {
  const {
    hero_section = {},
    about_us = {},
    services_menu = [],
    contact_info = {},
    operating_hours = {},
    social_trust = {},
    theme_color = '#D4AF37', // Default gold
    team = []
  } = data

  const activeServices = services_menu && services_menu.length > 0 ? services_menu : FALLBACK_SERVICES;
  const activeTeam = team && team.length > 0 ? team : FALLBACK_TEAM
  const activeHours = Object.keys(operating_hours).length > 0 ? operating_hours : FALLBACK_HOURS;

  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [serviceRequested, setServiceRequested] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const [isScrolled, setIsScrolled] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [selectedService, setSelectedService] = useState('')
  const [viewingService, setViewingService] = useState<any | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [sliderPosition, setSliderPosition] = useState(50)

  const openBookingWithService = (serviceName: string) => {
    setSelectedService(serviceName)
    setServiceRequested(serviceName)
    setIsBookingModalOpen(true)
  }

  const defaultSlides = [
    {
      image_url: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80',
      title: hero_section.hero_title || 'Nâng Tầm Nhan Sắc - Kiến Tạo Tương Lai',
      subtitle: hero_section.hero_subtitle || 'Trải nghiệm dịch vụ làm đẹp đẳng cấp 5 sao với công nghệ độc quyền.'
    },
    {
      image_url: 'https://images.unsplash.com/photo-1570172619644-defd00bb34da?auto=format&fit=crop&q=80',
      title: 'Tái Sinh Làn Da - Lưu Giữ Thanh Xuân',
      subtitle: 'Nâng cơ xóa nhăn Ultherapy đỉnh cao, phục hồi tế bào da tươi trẻ rạng ngời từ sâu bên trong.'
    },
    {
      image_url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80',
      title: 'Kiến Tạo Nụ Cười - Khởi Đầu Thịnh Vượng',
      subtitle: 'Mặt dán sứ Veneer siêu mỏng tinh tế, mang lại nụ cười rạng rỡ và sự tự tin trọn vẹn.'
    }
  ]

  const activeSlides = hero_section.slides && hero_section.slides.length > 0 ? hero_section.slides : defaultSlides;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeSlides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [activeSlides.length])

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!customerName || !customerPhone) {
      alert('Vui lòng điền họ tên và số điện thoại!')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_id: businessInfo.id || '10000000-0000-0000-0000-000000000001',
          business_name: businessInfo.name || 'Cơ sở thành viên',
          business_email: contact_info.email || 'partner@beautyhub.pro',
          customer_name: customerName,
          customer_phone: customerPhone,
          service_requested: serviceRequested || 'Tư vấn dịch vụ',
          source_url: businessInfo.slug || ''
        })
      })

      if (res.ok) {
        setSuccess(true)
        setCustomerName('')
        setCustomerPhone('')
        setServiceRequested('')
      } else {
        alert('Có lỗi xảy ra, vui lòng thử lại sau.')
      }
    } catch (err) {
      console.error('Booking submission error:', err)
      alert('Có lỗi kết nối, vui lòng thử lại sau.')
    } finally {
      setSubmitting(false)
    }
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  }

  return (
    <div className="bg-[#fff1c4] text-[#2F2F2F] font-sans selection:bg-[var(--primary)]/20 selection:text-[#2F2F2F] overflow-x-hidden pt-0">
      <style jsx global>{`
        :root {
          --primary: ${theme_color};
          --primary-hover: ${theme_color}CC;
        }
        .text-primary { color: var(--primary); }
        .bg-primary { background-color: var(--primary); }
        .border-primary { border-color: var(--primary); }
      `}</style>
      
      {/* LUXURY FLOATING HEADER */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 py-4 px-6 md:px-12 flex items-center justify-between ${isScrolled ? 'bg-[#fff1c4]/95 border-b border-[#D4AF37]/15 backdrop-blur-md shadow-sm' : 'bg-transparent border-b border-transparent backdrop-blur-none'}`}>
        <div className="flex items-center gap-4">
          {businessInfo.logo_url ? (
            <img 
              src={businessInfo.logo_url} 
              alt={businessInfo.name || "Logo"} 
              className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-[#D4AF37]/50 object-cover shadow-xl transition-all hover:scale-105"
            />
          ) : (
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-[var(--primary)] via-[#F5E0A3] to-[#B8860B] flex items-center justify-center text-[#121212] font-serif font-bold text-xl shadow-xl border-2 border-[var(--primary)]/50">
              {(businessInfo.name || 'S').charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-10 text-[10px] font-mono uppercase tracking-[0.3em] text-[#2F2F2F]/80 font-bold">
          <a href="#about-us" className="hover:text-[var(--primary)] transition-all relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-[var(--primary)] hover:after:w-full after:transition-all">Về chúng tôi</a>
          <a href="#services" className="hover:text-[var(--primary)] transition-all relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-[var(--primary)] hover:after:w-full after:transition-all">Dịch vụ</a>
          <a href="#contact" className="hover:text-[var(--primary)] transition-all relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-[var(--primary)] hover:after:w-full after:transition-all">Liên hệ</a>
        </nav>

        <div className="flex items-center gap-3">
          <a 
            href="/"
            className="hidden sm:inline-block px-5 py-2.5 rounded-full border border-[var(--primary)]/40 text-[#2F2F2F] font-bold tracking-widest uppercase text-[9px] transition-all duration-300 hover:bg-[var(--primary)]/10 bg-white/50 backdrop-blur-sm shadow-sm"
          >
            Trang chủ
          </a>
          <button 
            onClick={() => openBookingWithService('')}
            className="px-6 py-2.5 rounded-full text-[#121212] font-bold tracking-[0.2em] uppercase text-[9px] transition-all duration-500 shadow-[0_4px_20px_rgba(212,175,55,0.2)] hover:shadow-[0_6px_25px_rgba(212,175,55,0.4)] hover:-translate-y-0.5 active:translate-y-0 bg-gradient-to-r from-[var(--primary)] via-[#F5E0A3] to-[#B8860B]"
          >
            Đặt Lịch
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-full border border-[#D4AF37]/30 bg-white/50 text-[#2F2F2F] hover:bg-[#D4AF37]/10 transition-all"
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {/* MOBILE MENU PANEL */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[#fff1c4]/98 backdrop-blur-lg flex flex-col items-center justify-center gap-8 md:hidden"
          >
            <nav className="flex flex-col items-center gap-8 text-[14px] font-mono uppercase tracking-[0.3em] text-[#2F2F2F] font-bold">
              <a 
                href="#about-us" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-[#D4AF37] transition-all"
              >
                Về chúng tôi
              </a>
              <a 
                href="#services" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-[#D4AF37] transition-all"
              >
                Dịch vụ
              </a>
              <a 
                href="#contact" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-[#D4AF37] transition-all"
              >
                Liên hệ
              </a>
              <a 
                href="/" 
                className="hover:text-[#D4AF37] transition-all"
              >
                Trang chủ chính
              </a>
            </nav>
            <button 
              onClick={() => { setIsMobileMenuOpen(false); openBookingWithService(''); }}
              className="px-8 py-3.5 rounded-full text-[#121212] font-bold tracking-[0.2em] uppercase text-[10px] bg-gradient-to-r from-[#D4AF37] via-[#F5E0A3] to-[#B8860B] shadow-lg"
            >
              Đặt Lịch Hẹn VIP
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. HERO SECTION WITH 3-SLIDE CAROUSEL - LEFT-ALIGNED ASYMMETRIC STYLE */}
      <section className="relative h-screen flex items-center overflow-hidden bg-[#fff1c4]">
        {/* Background Slides */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 0.85, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${activeSlides[currentSlide]?.image_url}')` }}
            />
          </AnimatePresence>
          {/* Image change button in edit mode */}
          {isEditing && onImagePick && (
            <button
              onClick={() => onImagePick(`hero_section.hero_slides[${currentSlide}]`, activeSlides[currentSlide]?.image_url || '')}
              className="absolute top-4 right-4 z-30 bg-black/60 backdrop-blur-md border border-[#D4AF37]/50 text-white px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest hover:bg-[#D4AF37]/80 transition-colors flex items-center gap-1"
            >
              🖼 Đổi ảnh nền
            </button>
          )}
          {/* Asymmetric Elegant Gradient Overlay: left-heavy for text readability, bottom fades gracefully */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#fff1c4]/90 via-[#fff1c4]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#fff1c4]/70 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 flex items-center h-full pt-32 md:pt-40">
          <div className="max-w-2xl text-left">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -30, opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-6"
              >
                {/* Brand Label with Gold Line like the Homepage */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-10 h-px bg-[#D4AF37]" />
                  <span className="text-[11px] font-bold tracking-[0.4em] uppercase text-[#D4AF37] font-mono">
                    {businessInfo.name || "Viện Thẩm Mỹ Hoàng Gia"}
                  </span>
                </div>

                {/* Massive Playfair Heading */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl leading-[1.1] font-bold text-[#2F2F2F]" style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '0.01em' }}>
                  <EditableField
                    value={hero_section.hero_title || activeSlides[currentSlide]?.title || 'Nâng Tầm Nhan Sắc'}
                    onChange={(val) => onUpdate('hero_section.hero_title', val)}
                    isEditing={isEditing}
                    placeholder="Tiêu đề chính..."
                  />
                </h1>

                {/* Subtitle / Slogan */}
                <p className="text-sm md:text-lg font-medium tracking-wide text-[#2F2F2F]/70 max-w-xl leading-relaxed" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  <EditableField
                    value={hero_section.hero_subtitle || activeSlides[currentSlide]?.subtitle || ''}
                    onChange={(val) => onUpdate('hero_section.hero_subtitle', val)}
                    isEditing={isEditing}
                    multiline
                    placeholder="Slogan / mô tả ngắn..."
                  />
                </p>

                {/* Side-by-Side Premium Booking/Zalo Buttons */}
                <div className="flex flex-col sm:flex-row gap-5 items-start pt-6">
                  <button 
                    onClick={() => openBookingWithService('')}
                    className="px-8 py-3.5 rounded-full text-[#121212] font-bold tracking-[0.2em] uppercase text-xs transition-all duration-500 shadow-[0_8px_25px_rgba(212,175,55,0.2)] hover:shadow-[0_12px_35px_rgba(212,175,55,0.3)] hover:-translate-y-1 relative overflow-hidden group bg-gradient-to-r from-[#D4AF37] via-[#F5E0A3] to-[#B8860B]"
                  >
                    <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                    <span className="relative flex items-center gap-2"><Calendar size={14} /> Đặt lịch hẹn</span>
                  </button>
                  
                  <a 
                    href={contact_info.zalo_link || "https://zalo.me/0918731411"} 
                    className="px-8 py-3.5 rounded-full text-[#2F2F2F] font-bold tracking-[0.2em] uppercase text-xs transition-all duration-300 border border-[#D4AF37]/50 hover:bg-[#D4AF37]/10 flex items-center gap-2 backdrop-blur-sm bg-white/30"
                  >
                    <MessageSquare size={14} />
                    Tư vấn Zalo
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Slide Indicators - Left-aligned */}
            <div className="flex gap-2.5 mt-16">
              {activeSlides.map((_: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`transition-all duration-500 rounded-full ${idx === currentSlide ? 'w-8 h-1.5 bg-[#D4AF37]' : 'w-1.5 h-1.5 bg-[#D4AF37]/30 hover:bg-[#D4AF37]/60'}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Decorative Gold Elements */}
        <div className="absolute top-28 right-12 w-48 h-48 border-r border-t border-[#D4AF37]/25 rounded-tr-[3rem] hidden lg:block" />
        <div className="absolute bottom-28 right-12 w-32 h-32 border-r border-b border-[#D4AF37]/15 rounded-br-[2rem] hidden lg:block" />
      </section>

      {/* 2. ABOUT US */}
      {!hiddenSections.includes('about_us') && (
      <section id="about-us" className="py-32 md:py-40 px-4 bg-[#fff1c4]" onClick={() => onSectionClick?.('about_us')}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.span variants={itemVariants} className="text-[#D4AF37] tracking-[0.4em] uppercase text-xs mb-6 block font-bold">
              Về Chúng Tôi
            </motion.span>
            <motion.h2 variants={itemVariants} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-10 font-bold text-[#2F2F2F] leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              <EditableField
                value={about_us.section_title || 'Kiến tạo vẻ đẹp từ sự tận tâm'}
                onChange={(val) => onUpdate('about_us.section_title', val)}
                isEditing={isEditing}
                placeholder="Tiêu đề section Về chúng tôi..."
              />
            </motion.h2>
            <motion.div variants={itemVariants} className="w-24 h-[1px] bg-[#D4AF37] mx-auto mb-10" />
            <motion.p variants={itemVariants} className="text-lg md:text-xl leading-relaxed text-[#2F2F2F]/70 max-w-3xl mx-auto font-medium">
              <EditableField
                value={about_us.intro_text || 'Với hơn 10 năm hình thành, chúng tôi tự hào là đơn vị dẫn đầu ứng dụng giải pháp làm đẹp không xâm lấn.'}
                onChange={(val) => onUpdate('about_us.intro_text', val)}
                isEditing={isEditing}
                multiline
                placeholder="Mô tả về chúng tôi..."
              />
            </motion.p>
          </motion.div>
        </div>
      </section>
      )}

      {/* 3. SERVICES MENU */}
      {!hiddenSections.includes('services_menu') && (
      <section id="services" className="py-32 md:py-40 px-4 bg-white border-y border-[#D4AF37]/10" onClick={() => onSectionClick?.('services_menu')}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-6 font-bold text-[#2F2F2F]" style={{ fontFamily: "'Playfair Display', serif" }}>
              <EditableField
                value={data.services_section_title || 'Dịch vụ đặc sắc'}
                onChange={(val) => onUpdate('services_section_title', val)}
                isEditing={isEditing}
                placeholder="Tiêu đề section Dịch vụ..."
              />
            </h2>
            <p className="text-[#D4AF37] tracking-[0.3em] uppercase text-xs font-bold">
              <EditableField
                value={data.services_section_subtitle || 'Trải nghiệm thượng lưu'}
                onChange={(val) => onUpdate('services_section_subtitle', val)}
                isEditing={isEditing}
                placeholder="Phụ đề..."
              />
            </p>

            {isEditing && (
              <ArrayActionButtons
                onAdd={() => handleAddItem('services_menu', activeServices, FALLBACK_SERVICES[0])}
                label="Dịch vụ"
                className="justify-center mt-4"
              />
            )}
          </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {activeServices.map((service: any, index: number) => {
              const fallback = FALLBACK_SERVICES[index % FALLBACK_SERVICES.length]
              const sName = service.service_name || fallback.service_name
              const sDesc = service.description || fallback.description
              const sPrice = service.price || fallback.price
              const sImg = service.image_url || fallback.image_url

              return (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: (index % 3) * 0.1, duration: 0.8 }}
                  viewport={{ once: true, margin: "-50px" }}
                  onClick={() => {
                    if (!isEditing) {
                      setViewingService({ name: sName, desc: sDesc, price: sPrice, img: sImg })
                    }
                  }}
                  className={`group relative h-[480px] rounded-[2.5rem] overflow-hidden shadow-lg hover:shadow-[0_25px_60px_rgba(212,175,55,0.12)] transition-all duration-[0.8s] border border-[#D4AF37]/15 hover:border-[#D4AF37]/35 flex flex-col justify-end p-8 ${!isEditing ? 'cursor-pointer' : ''}`}
                >
                  {/* Background Image with Slow Smooth Zoom, Color Filtering & Glossy Mirror Sheen */}
                  <div className="absolute inset-0 z-0 overflow-hidden bg-[#fff1c4]">
                    <img 
                      src={sImg} 
                      alt={sName}
                      className="w-full h-[65%] object-cover filter grayscale-[40%] sepia-[30%] brightness-[0.9] contrast-[1.05] transition-all duration-[1.8s] ease-out group-hover:scale-105 group-hover:grayscale-0 group-hover:sepia-0 group-hover:brightness-100"
                    />
                    {/* Double Gradient Overlays: A warm champagne-gold gradient melting into #fff1c4 at the bottom + a soft golden overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#fff1c4] via-[#fff1c4]/90 to-[#fff1c4]/0 transition-all duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#D4AF37]/5 via-transparent to-[#D4AF37]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-[1s]" />
                    
                    {/* Glossy Golden Mirror Reflection Beam ("gương sáng") */}
                    <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-[#fff1c4]/45 to-transparent -skew-x-12 transition-all duration-[1.2s] ease-in-out group-hover:left-[200%]" />
                  </div>

                  {/* Top-Left/Right Badges */}
                  <div className="absolute top-6 left-6 z-10 flex gap-2">
                    <span className="bg-[#D4AF37] text-[#2F2F2F] font-mono text-[9px] font-bold tracking-widest px-3 py-1 rounded-full uppercase shadow-md">
                      VIP 5★
                    </span>
                    <span className="bg-[#fff1c4]/80 backdrop-blur-md text-[#2F2F2F] font-mono text-[9px] font-bold tracking-widest px-3 py-1 rounded-full uppercase border border-[#D4AF37]/20 shadow-sm">
                      Độc quyền
                    </span>
                  </div>

                  {/* Overlaid Content Area */}
                  <div className="relative z-10 space-y-4">
                    {/* Subtitle / Treatment Time */}
                    <p className="text-[#9c7a1c] text-[10px] font-bold tracking-[0.3em] uppercase flex items-center gap-1.5">
                      <Clock size={11} className="text-[#9c7a1c] shrink-0" />
                      <span>Liệu Trình Chuyên Sâu • 45-60 Phút</span>
                    </p>

                    <div className="space-y-2">
                      <h3 className="text-xl xs:text-2xl sm:text-3xl font-bold text-[#2F2F2F] tracking-wide group-hover:text-[#9c7a1c] transition-colors leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                        <EditableText
                          value={sName}
                          isEditing={isEditing}
                          onChange={(val) => onUpdate(`services_menu[${index}].service_name`, val)}
                        />
                      </h3>
                      <p className="text-xs text-[#2F2F2F]/75 leading-relaxed font-light line-clamp-2">
                        <EditableText
                          value={sDesc}
                          isEditing={isEditing}
                          onChange={(val) => onUpdate(`services_menu[${index}].description`, val)}
                          multiline
                        />
                      </p>
                    </div>

                    {/* Bottom Action bar */}
                    <div className="flex justify-between items-center pt-4 border-t border-[#D4AF37]/20 mt-2">
                      <div className="flex flex-col">
                        <span className="text-[9px] text-[#2F2F2F]/50 uppercase tracking-widest font-mono">Chi Phí</span>
                        <span className="text-2xl font-bold text-[#9c7a1c] tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>
                          <EditableText
                            value={sPrice}
                            isEditing={isEditing}
                            onChange={(val) => onUpdate(`services_menu[${index}].price`, val)}
                          />
                        </span>
                      </div>
                      
                      <button 
                        onClick={(e) => {
                          e.stopPropagation()
                          openBookingWithService(sName)
                        }}
                        className="px-5 py-2.5 bg-gradient-to-r from-[var(--primary)] to-[#F5E0A3] text-[#2F2F2F] rounded-full text-[10px] font-bold uppercase tracking-widest hover:brightness-105 active:scale-95 transition-all shadow-md group-hover:shadow-[var(--primary)]/10"
                      >
                        Đặt lịch ngay
                      </button>
                    </div>

                    {isEditing && (
                      <div className="absolute top-2 left-2 z-20">
                        <ArrayActionButtons
                          onRemove={() => handleRemoveItem('services_menu', activeServices, index)}
                        />
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Add Service button in edit mode */}
          {isEditing && (
            <div className="text-center mt-12">
              <ArrayActionButtons
                onAdd={() => handleAddItem('services_menu', activeServices, FALLBACK_SERVICES[0])}
                label="Dịch vụ"
                className="justify-center"
              />
            </div>
          )}
        </div>
      </section>
      )}

      {/* INTERACTIVE BEFORE & AFTER SLIDER */}
      <section className="py-32 md:py-40 px-4 bg-white border-b border-[#D4AF37]/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            
            {/* Left Column: Text & Premium Stats */}
            <div className="lg:w-1/2 space-y-8">
              <span className="text-[#D4AF37] tracking-[0.4em] uppercase text-xs font-bold block">Độc quyền tại 1SPA</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-[#2F2F2F]" style={{ fontFamily: "'Playfair Display', serif" }}>
                Tuyệt tác <br/> Tái tạo nhan sắc
              </h2>
              <div className="w-16 h-[1px] bg-[#D4AF37]" />
              <p className="text-base text-[#2F2F2F]/70 leading-relaxed font-medium">
                Sử dụng công nghệ bọc vàng 24K Thụy Sĩ nguyên chất và tinh chất tế bào gốc quý hiếm, liệu trình độc quyền của chúng tôi giúp hồi sinh làn da lão hóa, trả lại sự tươi trẻ rạng ngời chỉ sau 60 phút trị liệu chuyên sâu.
              </p>
              
              <div className="grid grid-cols-2 gap-8 pt-4">
                <div className="border-l-2 border-[#D4AF37] pl-4 space-y-1">
                  <h4 className="text-3xl font-bold text-[#D4AF37]" style={{ fontFamily: "'Playfair Display', serif" }}>-5 Tuổi</h4>
                  <p className="text-[10px] uppercase tracking-wider text-[#2F2F2F]/50 font-mono font-bold">Lão hóa da</p>
                </div>
                <div className="border-l-2 border-[#D4AF37] pl-4 space-y-1">
                  <h4 className="text-3xl font-bold text-[#D4AF37]" style={{ fontFamily: "'Playfair Display', serif" }}>99%</h4>
                  <p className="text-[10px] uppercase tracking-wider text-[#2F2F2F]/50 font-mono font-bold">Thượng khách hài lòng</p>
                </div>
              </div>
            </div>

            {/* Right Column: Premium Before/After Slider */}
            <div className="lg:w-1/2 w-full flex justify-center">
              <div className="relative w-full max-w-[500px] aspect-[4/5] rounded-[2.5rem] overflow-hidden border-4 border-[#D4AF37]/30 shadow-[0_20px_50px_rgba(212,175,55,0.15)] select-none group/slider">
                
                {/* AFTER IMAGE (Background) */}
                <img 
                  src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80" 
                  alt="After" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute bottom-6 right-6 z-10 bg-[#D4AF37] text-[#121212] font-mono text-[9px] font-bold tracking-widest px-4 py-1.5 rounded-full uppercase shadow-md">
                  Sau điều trị
                </div>

                {/* BEFORE IMAGE (Foreground, Clipped) */}
                <div 
                  className="absolute inset-0 overflow-hidden"
                  style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
                >
                  <img 
                    src="https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80" 
                    alt="Before" 
                    className="absolute inset-0 w-full h-full object-cover filter brightness-[0.8] saturate-[0.8] contrast-[0.95]"
                    style={{ width: '100%', height: '100%' }}
                  />
                  <div className="absolute bottom-6 left-6 z-10 bg-[#2F2F2F]/80 backdrop-blur-md text-white border border-white/20 font-mono text-[9px] font-bold tracking-widest px-4 py-1.5 rounded-full uppercase shadow-md">
                    Trước điều trị
                  </div>
                </div>

                {/* SLIDER CONTROLLER HANDLE */}
                <div 
                  className="absolute top-0 bottom-0 z-20 w-[2px] bg-[#D4AF37] cursor-ew-resize"
                  style={{ left: `${sliderPosition}%` }}
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full border-2 border-[#D4AF37] bg-white shadow-xl flex items-center justify-center transition-transform group-hover/slider:scale-110 active:scale-95">
                    <div className="flex gap-1 items-center justify-center text-[#D4AF37]">
                      <span className="text-xs font-bold">◀</span>
                      <span className="text-xs font-bold">▶</span>
                    </div>
                  </div>
                </div>

                {/* INVISIBLE RANGE INPUT FOR MOBILE DRAG */}
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

      {/* 4. SOCIAL PROOF */}
      <section className="py-32 md:py-40 px-4 bg-[#fff1c4] overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/3 space-y-8">
              <span className="text-[#D4AF37] tracking-[0.4em] uppercase text-xs font-bold">Feedback</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-[#2F2F2F]" style={{ fontFamily: "'Playfair Display', serif" }}>Cảm nhận từ <br/> khách hàng</h2>
              <div className="flex items-center gap-2">
                {[1,2,3,4,5].map(s => <Star key={s} size={20} className="fill-[#D4AF37] text-[#D4AF37]" />)}
              </div>
              <p className="text-[#2F2F2F]/60 font-medium leading-relaxed">
                Hơn <span className="text-[#D4AF37] font-bold">{social_trust.rating_count || 128}</span> đánh giá 5 sao từ những khách hàng khắt khe nhất. Sự hài lòng của bạn là vinh dự của chúng tôi.
              </p>
            </div>
            
            <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-8 relative w-full">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-[100px]" />
              
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white p-10 rounded-3xl border border-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_rgba(212,175,55,0.15)] relative z-10 transition-all duration-500 h-fit"
              >
                <div className="text-4xl text-[#D4AF37] opacity-40 font-serif absolute top-6 left-6">"</div>
                <p className="italic text-[#2F2F2F]/70 leading-relaxed mb-8 relative z-10 mt-4 text-base font-medium">
                  "Dịch vụ tại đây thật sự đẳng cấp. Không gian sang trọng và tay nghề bác sĩ rất cao. Tôi hoàn toàn hài lòng với kết quả đạt được."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] font-bold">MA</div>
                  <p className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-[0.2em]">- Chị Minh Anh</p>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white p-10 rounded-3xl border border-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_rgba(212,175,55,0.15)] relative z-10 md:translate-y-16 transition-all duration-500 h-fit"
              >
                <div className="text-4xl text-[#D4AF37] opacity-40 font-serif absolute top-6 left-6">"</div>
                <p className="italic text-[#2F2F2F]/70 leading-relaxed mb-8 relative z-10 mt-4 text-base font-medium">
                  "Sự tỉ mỉ và chuyên nghiệp là điều tôi ấn tượng nhất. Cảm ơn đội ngũ đã chăm sóc sắc đẹp của tôi vô cùng chu đáo."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] font-bold">HN</div>
                  <p className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-[0.2em]">- Anh Hoàng Nam</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. THE MASTER TEAM */}
      <section id="team" className="py-32 md:py-40 px-4 bg-[#fff1c4]">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="text-[#D4AF37] tracking-[0.4em] uppercase text-xs font-bold block">Đội ngũ chuyên gia</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#2F2F2F]" style={{ fontFamily: "'Playfair Display', serif" }}>
              Những Bàn Tay <span className="italic text-[#D4AF37]">Tài Hoa</span>
            </h2>
            <div className="w-16 h-[1px] bg-[#D4AF37] mx-auto" />
            <p className="text-sm text-[#2F2F2F]/60 font-medium max-w-lg mx-auto">
              Nơi hội tụ những chuyên gia thẩm mỹ hàng đầu, tận tâm kiến tạo vẻ đẹp hoàn mỹ cho từng vị thượng khách.
            </p>

            {isEditing && (
              <ArrayActionButtons
                onAdd={() => handleAddItem('team', activeTeam, FALLBACK_TEAM[0])}
                label="Chuyên gia"
                className="justify-center mt-6"
              />
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {activeTeam.map((member: any, index: number) => (
              <motion.div 
                key={index}
                whileHover={{ y: -10 }}
                className="group relative bg-white p-8 rounded-[2.5rem] border border-[#D4AF37]/10 flex flex-col md:flex-row gap-8 items-center shadow-lg hover:shadow-[0_20px_50px_rgba(212,175,55,0.1)] transition-all duration-500"
              >
                {isEditing && (
                  <div className="absolute top-4 right-4 z-20">
                    <ArrayActionButtons
                      onRemove={() => handleRemoveItem('team', activeTeam, index)}
                    />
                  </div>
                )}
                
                <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-[#D4AF37]/20 shrink-0 relative">
                  <img src={member.img} alt={member.name} className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110" />
                </div>
                
                <div className="space-y-3 text-center md:text-left">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-[#2F2F2F]" style={{ fontFamily: "'Playfair Display', serif" }}>
                      <EditableText value={member.name} isEditing={isEditing} onChange={(val) => onUpdate(`team[${index}].name`, val)} />
                    </h3>
                    <p className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-[0.2em]">
                      <EditableText value={member.role} isEditing={isEditing} onChange={(val) => onUpdate(`team[${index}].role`, val)} />
                    </p>
                  </div>
                  <p className="text-xs text-[#2F2F2F]/60 font-medium leading-relaxed">
                    <EditableText value={member.desc} isEditing={isEditing} onChange={(val) => onUpdate(`team[${index}].desc`, val)} multiline />
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. BLOG SECTION (Asymmetric Vogue Grid) */}
      <section className="py-32 md:py-40 px-4 bg-white border-y border-[#D4AF37]/10">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-[#D4AF37]/10 pb-8">
            <div className="space-y-4">
              <span className="text-[#D4AF37] tracking-[0.4em] uppercase text-xs font-bold block">Blog & Tạp chí</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#2F2F2F]" style={{ fontFamily: "'Playfair Display', serif" }}>Góc Chia Sẻ</h2>
            </div>
            <button className="text-[10px] font-bold text-[#2F2F2F]/50 uppercase tracking-[0.2em] hover:text-[#D4AF37] transition-colors border-b border-transparent hover:border-[#D4AF37] pb-1">Xem tất cả ấn phẩm</button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Featured Post - Large Left */}
            <motion.div whileHover={{ y: -5 }} className="lg:col-span-7 group cursor-pointer space-y-6">
              <div className="aspect-[4/3] overflow-hidden rounded-[2rem] shadow-sm">
                <img src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s]" alt="Blog" />
              </div>
              <div className="space-y-4 pr-8">
                <span className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest">Xu hướng làm đẹp</span>
                <h3 className="text-3xl font-bold text-[#2F2F2F] group-hover:text-[#D4AF37] transition-colors leading-snug" style={{ fontFamily: "'Playfair Display', serif" }}>Bí quyết duy trì làn da rạng rỡ không tì vết sau liệu trình</h3>
                <p className="text-base text-[#2F2F2F]/60 leading-relaxed font-medium">Khám phá các bước chăm sóc da tại nhà giúp kéo dài hiệu quả của các liệu trình spa chuyên sâu, mang lại vẻ đẹp bền vững...</p>
              </div>
            </motion.div>
            
            {/* Secondary Posts - Stacked Right */}
            <div className="lg:col-span-5 flex flex-col gap-8">
              <motion.div whileHover={{ x: 5 }} className="group cursor-pointer flex gap-6 items-center">
                <div className="w-40 h-40 shrink-0 overflow-hidden rounded-2xl shadow-sm">
                  <img src="https://images.unsplash.com/photo-1519415387722-a1c3bbef716c?auto=format&fit=crop&q=80" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]" alt="Blog" />
                </div>
                <div className="space-y-2">
                  <span className="text-[9px] text-[#D4AF37] font-bold uppercase tracking-widest">Công nghệ</span>
                  <h3 className="text-xl font-bold text-[#2F2F2F] group-hover:text-[#D4AF37] transition-colors leading-snug" style={{ fontFamily: "'Playfair Display', serif" }}>Đột phá công nghệ thẩm mỹ 2026</h3>
                  <p className="text-xs text-[#2F2F2F]/50 leading-relaxed font-medium line-clamp-2">Tìm hiểu về những cỗ máy làm đẹp không xâm lấn tiên tiến nhất đang làm mưa làm gió...</p>
                </div>
              </motion.div>

              <div className="w-full h-px bg-[#D4AF37]/10" />

              <motion.div whileHover={{ x: 5 }} className="group cursor-pointer flex gap-6 items-center">
                <div className="w-40 h-40 shrink-0 overflow-hidden rounded-2xl shadow-sm">
                  <img src="https://images.unsplash.com/photo-1570172619644-defd00bb34da?auto=format&fit=crop&q=80" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]" alt="Blog" />
                </div>
                <div className="space-y-2">
                  <span className="text-[9px] text-[#D4AF37] font-bold uppercase tracking-widest">Phong cách sống</span>
                  <h3 className="text-xl font-bold text-[#2F2F2F] group-hover:text-[#D4AF37] transition-colors leading-snug" style={{ fontFamily: "'Playfair Display', serif" }}>Thực đơn dinh dưỡng chống lão hóa</h3>
                  <p className="text-xs text-[#2F2F2F]/50 leading-relaxed font-medium line-clamp-2">Vẻ đẹp thực sự bắt nguồn từ bên trong. Chuyên gia dinh dưỡng tiết lộ bí mật...</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CONTACT & FOOTER */}
      {/* 6. CONTACT & FOOTER - REDESIGNED LUXURY PANEL */}
      <footer className="bg-[#fff1c4] py-24 px-6 md:px-12 border-t border-[#D4AF37]/25">
        <div className="max-w-7xl mx-auto bg-white rounded-[2.5rem] border border-[#D4AF37]/15 p-10 md:p-16 shadow-[0_20px_50px_rgba(212,175,55,0.05)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* Brand Column */}
            <div className="lg:col-span-4 space-y-6">
              <span className="text-[9px] font-mono font-bold tracking-[0.4em] uppercase text-[#D4AF37] bg-[#D4AF37]/5 px-3 py-1 rounded-full inline-block">
                ★ Trải nghiệm thượng lưu ★
              </span>
              <div className="flex items-center gap-4">
                {businessInfo.logo_url ? (
                  <div className="p-0.5 rounded-full border border-[#D4AF37]/30 shadow-md">
                    <img 
                      src={businessInfo.logo_url} 
                      alt={businessInfo.name || "Logo"} 
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#D4AF37] via-[#F5E0A3] to-[#B8860B] flex items-center justify-center text-[#121212] font-serif font-bold text-2xl shadow-lg border-2 border-[#D4AF37]/50">
                    {(businessInfo.name || 'S').charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h3 className="font-serif font-bold text-[#2F2F2F] tracking-wide text-xl leading-snug" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {businessInfo.name || "Royal Spa"}
                  </h3>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#B8860B] font-bold block mt-0.5">
                    {businessInfo.category || "Spa"}
                  </span>
                </div>
              </div>
              <p className="text-xs text-[#2F2F2F]/65 leading-relaxed font-semibold">
                Kiến tạo vẻ đẹp hoàn mỹ từ sự tận tâm. Mang lại trải nghiệm thư giãn tinh túy và các liệu trình trị liệu đỉnh cao chuẩn quốc tế.
              </p>
            </div>

            {/* Contact Column */}
            <div className="lg:col-span-3 space-y-5">
              <div className="flex items-center gap-2 border-b border-[#D4AF37]/15 pb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                <h4 className="text-xs font-mono font-bold uppercase tracking-[0.3em] text-[#B8860B]">Liên hệ</h4>
              </div>
              <ul className="space-y-4 text-xs text-[#2F2F2F]/75 leading-relaxed font-semibold">
                <li className="flex items-start gap-3">
                  <MapPin size={14} className="text-[#D4AF37] shrink-0 mt-0.5" />
                  <span>{contact_info.address_full || 'Số 1, Lê Duẩn, Quận 1, TP. Hồ Chí Minh'}</span>
                </li>
                <li className="space-y-1">
                  <span className="text-[9px] text-[#2F2F2F]/40 uppercase tracking-widest block">Hotline tư vấn VIP</span>
                  <a 
                    href={`tel:${contact_info.hotline || '19008888'}`} 
                    className="flex items-center gap-2 text-[#B8860B] hover:text-[#D4AF37] transition-colors text-base font-serif font-bold tracking-wider"
                  >
                    <Phone size={14} />
                    {contact_info.hotline || '1900 8888'}
                  </a>
                </li>
              </ul>
            </div>

            {/* Hours Column */}
            <div className="lg:col-span-2 space-y-5">
              <div className="flex items-center gap-2 border-b border-[#D4AF37]/15 pb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                <h4 className="text-xs font-mono font-bold uppercase tracking-[0.3em] text-[#B8860B]">Giờ mở cửa</h4>
              </div>
              <ul className="space-y-3 text-[11px] text-[#2F2F2F]/70 font-semibold">
                <li className="flex justify-between border-b border-[#D4AF37]/5 pb-1">
                  <span>Thứ 2 - 6:</span>
                  <span className="text-[#2F2F2F] font-bold">08:00 - 20:00</span>
                </li>
                <li className="flex justify-between border-b border-[#D4AF37]/5 pb-1">
                  <span>Thứ 7:</span>
                  <span className="text-[#2F2F2F] font-bold">08:00 - 18:00</span>
                </li>
                <li className="flex justify-between">
                  <span>Chủ nhật:</span>
                  <span className="text-red-500 font-bold bg-red-50 px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider">Nghỉ</span>
                </li>
              </ul>
            </div>

            {/* Map Column */}
            <div className="lg:col-span-3 space-y-4">
              <div className="flex items-center gap-2 border-b border-[#D4AF37]/15 pb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                <h4 className="text-xs font-mono font-bold uppercase tracking-[0.3em] text-[#B8860B]">Bản đồ vị trí</h4>
              </div>
              <div className="w-full h-40 rounded-2xl overflow-hidden border-2 border-[#D4AF37]/20 bg-[#fff1c4] shadow-md hover:scale-[1.02] transition-transform duration-500">
                <iframe 
                  src={contact_info.map_embed_url || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.460232421714!2d106.6989445148008!3d10.776019492321876!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f40a3b49e59%3A0xa1bd14e483a602db!2sDinh%20%C4%90%E1%BB%99c%20L%E1%BA%ADp!5e0!3m2!1svi!2s!4v1628151240188!5m2!1svi!2s"} 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0, filter: 'sepia(20%) contrast(105%) saturate(90%)' }} 
                  allowFullScreen={false} 
                  loading="lazy"
                ></iframe>
              </div>
            </div>

          </div>

          {/* Copyright Section */}
          <div className="border-t border-[#D4AF37]/15 mt-16 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-bold tracking-widest text-[#2F2F2F]/40 uppercase">
            <div>
              © 2026 {businessInfo.name || 'Premium Directory'}. All rights reserved.
            </div>
            <div className="text-[#B8860B]/70 tracking-[0.3em] flex items-center gap-1.5">
              <span>Powered by</span>
              <a href="/" className="hover:text-[#D4AF37] transition-colors">1Beauty.Asia</a>
            </div>
          </div>

        </div>
      </footer>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-10 right-10 flex flex-col gap-4 z-50">
        <a 
          href={contact_info.zalo_link || "https://zalo.me/0918731411"} 
          className="w-14 h-14 bg-[#0068FF] text-white rounded-full flex items-center justify-center shadow-[0_10px_20px_rgba(0,104,255,0.3)] hover:scale-110 transition-transform"
          title="Chat Zalo"
        >
          <MessageCircle size={24} />
        </a>
        <button 
          onClick={() => openBookingWithService('')}
          className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-[0_10px_20px_rgba(212,175,55,0.3)] hover:scale-110 transition-transform"
          style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #F5E0A3 50%, #B8860B 100%)' }}
          title="Đặt lịch hẹn VIP"
        >
          <Calendar size={24} />
        </button>
      </div>

      {/* LUXURIOUS SERVICE DETAIL POPUP MODAL */}
      <AnimatePresence>
        {viewingService && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#2F2F2F]/60 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative w-full max-w-3xl bg-[#fff1c4] border-2 border-[#D4AF37]/40 p-6 md:p-8 rounded-[2rem] shadow-[0_20px_50px_rgba(212,175,55,0.15)] flex flex-col md:flex-row gap-6 max-h-[85vh] overflow-y-auto no-scrollbar md:overflow-hidden"
            >
              {/* Close Button */}
              <button 
                onClick={() => setViewingService(null)}
                className="absolute top-5 right-5 z-20 text-[#2F2F2F]/60 hover:text-[#2F2F2F] transition-colors p-1.5 bg-white/50 backdrop-blur-md rounded-full border border-[#D4AF37]/20"
              >
                <X size={18} />
              </button>

              {/* Service Image */}
              <div className="w-full md:w-1/2 h-48 md:h-auto rounded-2xl overflow-hidden border border-[#D4AF37]/20 relative shrink-0">
                <img 
                  src={viewingService.img} 
                  alt={viewingService.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <span className="absolute bottom-4 left-4 bg-[#D4AF37] text-[#121212] font-mono text-[9px] font-bold tracking-widest px-3 py-1 rounded-full uppercase shadow-md">
                  VIP DỊCH VỤ 5★
                </span>
              </div>

              {/* Service Details */}
              <div className="w-full md:w-1/2 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-[#D4AF37] tracking-[0.3em] uppercase">Giới thiệu dịch vụ</span>
                    <h3 className="text-3xl font-bold text-[#2F2F2F]" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {viewingService.name}
                    </h3>
                  </div>

                  <p className="text-sm text-[#2F2F2F]/70 leading-relaxed font-medium">
                    {viewingService.desc}
                  </p>

                  <div className="pt-4 border-t border-[#D4AF37]/15 flex flex-wrap gap-4 text-[10px] font-bold uppercase tracking-widest text-[#2F2F2F]/60">
                    <span className="flex items-center gap-1.5 bg-white/40 px-3 py-1.5 rounded-full border border-[#D4AF37]/10"><Clock size={12} className="text-[#D4AF37]" /> 45-60 phút</span>
                    <span className="flex items-center gap-1.5 bg-white/40 px-3 py-1.5 rounded-full border border-[#D4AF37]/10"><Star size={12} className="text-[#D4AF37] fill-[#D4AF37]" /> Độc quyền VIP</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-[#D4AF37]/15 flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-bold text-[#2F2F2F]/40 uppercase tracking-widest block">Chi phí dịch vụ</span>
                    <span className="text-2xl font-bold text-[#D4AF37]" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {viewingService.price}
                    </span>
                  </div>
                  <button 
                    onClick={() => {
                      openBookingWithService(viewingService.name);
                      setViewingService(null);
                    }}
                    className="px-6 py-3 rounded-full text-[#121212] font-bold tracking-[0.2em] uppercase text-[10px] transition-all duration-500 shadow-[0_4px_15px_rgba(212,175,55,0.2)] hover:shadow-[0_6px_20px_rgba(212,175,55,0.4)] hover:-translate-y-0.5 active:translate-y-0 bg-gradient-to-r from-[#D4AF37] via-[#F5E0A3] to-[#B8860B]"
                  >
                    ĐẶT LỊCH NGAY
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* GLASSMORPHISM BOOKING MODAL POPUP */}
      <AnimatePresence>
        {isBookingModalOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#2F2F2F]/40 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative w-full max-w-lg bg-[#fff1c4]/98 border-2 border-[#D4AF37]/40 p-8 md:p-10 rounded-[2rem] shadow-[0_20px_50px_rgba(212,175,55,0.12)] backdrop-blur-xl"
            >
              {/* Close Button */}
              <button 
                onClick={() => setIsBookingModalOpen(false)}
                className="absolute top-6 right-6 text-[#2F2F2F]/40 hover:text-[#2F2F2F] transition-colors"
              >
                <X size={20} />
              </button>

              <div className="text-center mb-8">
                <span className="text-[10px] text-[#B8860B] font-bold uppercase tracking-[0.3em] font-mono">Đăng ký trải nghiệm</span>
                <h3 className="text-3xl text-[#2F2F2F] font-bold mt-2" style={{ fontFamily: "'Playfair Display', serif" }}>Đặt Lịch Tư Vấn</h3>
              </div>

              {success ? (
                <div className="text-center py-8 space-y-6 animate-fade-in">
                  <div className="w-16 h-16 bg-[#D4AF37]/20 text-[#B8860B] rounded-full flex items-center justify-center mx-auto text-3xl font-bold shadow-[0_0_20px_rgba(212,175,55,0.15)] border border-[#D4AF37]/40">
                    ✓
                  </div>
                  <h4 className="text-xl text-[#B8860B] font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Đăng ký thành công!</h4>
                  <p className="text-xs text-[#2F2F2F]/70 leading-relaxed font-medium">
                    Chuyên viên tư vấn VIP của chúng tôi sẽ liên hệ lại với quý khách trong vòng 30 phút.
                  </p>
                  <button 
                    onClick={() => { setSuccess(false); setIsBookingModalOpen(false); }}
                    className="px-6 py-2.5 rounded-full text-[#121212] font-mono uppercase font-bold text-[10px] bg-[#D4AF37]"
                  >
                    Đóng cửa sổ
                  </button>
                </div>
              ) : (
                <form onSubmit={handleBooking} className="space-y-5">
                  <div className="space-y-1">
                    <label className="text-[9px] text-[#B8860B] font-bold uppercase tracking-widest font-mono">Họ tên khách hàng</label>
                    <input 
                      type="text" 
                      placeholder="Họ và tên của quý khách *" 
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-white border border-[#D4AF37]/30 rounded-xl py-3.5 px-4 text-[#2F2F2F] outline-none focus:border-[#B8860B] focus:bg-white transition-colors placeholder:text-[#2F2F2F]/40 text-xs font-semibold" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] text-[#B8860B] font-bold uppercase tracking-widest font-mono">Số điện thoại</label>
                    <input 
                      type="tel" 
                      placeholder="Số điện thoại liên hệ *" 
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full bg-white border border-[#D4AF37]/30 rounded-xl py-3.5 px-4 text-[#2F2F2F] outline-none focus:border-[#B8860B] focus:bg-white transition-colors placeholder:text-[#2F2F2F]/40 text-xs font-semibold" 
                    />
                  </div>
                   <div className="space-y-1">
                    <label className="text-[9px] text-[#B8860B] font-bold uppercase tracking-widest font-mono">Dịch vụ quan tâm</label>
                    <select
                      value={serviceRequested}
                      onChange={(e) => setServiceRequested(e.target.value)}
                      className="w-full bg-white border border-[#D4AF37]/30 rounded-xl py-3.5 px-4 text-[#2F2F2F] outline-none focus:border-[#B8860B] focus:bg-white transition-colors text-xs font-semibold cursor-pointer h-12"
                    >
                      <option value="">-- Chọn dịch vụ quý khách quan tâm --</option>
                      {activeServices.map((service: any, i: number) => {
                        const fallback = FALLBACK_SERVICES[i % FALLBACK_SERVICES.length]
                        const sName = service.service_name || fallback.service_name
                        return (
                          <option key={i} value={sName}>
                            {sName}
                          </option>
                        )
                      })}
                      <option value="Tư vấn tổng quan">Tư vấn tổng quan &amp; Khám miễn phí</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] text-[#B8860B] font-bold uppercase tracking-widest font-mono">Yêu cầu đặc biệt (Không bắt buộc)</label>
                    <textarea 
                      placeholder="Ví dụ: Giờ hẹn mong muốn, tình trạng hiện tại..." 
                      className="w-full bg-white border border-[#D4AF37]/30 rounded-xl py-3 px-4 text-[#2F2F2F] outline-none focus:border-[#B8860B] focus:bg-white transition-colors h-16 placeholder:text-[#2F2F2F]/40 text-xs font-semibold resize-none" 
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="w-full py-4 rounded-xl text-[#121212] font-bold uppercase tracking-[0.2em] text-[10px] transition-all shadow-[0_8px_20px_rgba(212,175,55,0.2)] hover:shadow-[0_12px_30px_rgba(212,175,55,0.3)] disabled:opacity-50 mt-4 bg-gradient-to-r from-[#D4AF37] via-[#F5E0A3] to-[#B8860B]"
                  >
                    {submitting ? 'Đang gửi yêu cầu...' : 'Gửi Đăng Ký VIP'}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}
