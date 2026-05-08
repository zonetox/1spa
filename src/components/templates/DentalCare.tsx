'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { EditableText } from '@/components/shared/EditableText'
import { EditableField, ArrayActionButtons } from '@/components/shared/EditorOverlay'
import { Phone, MessageCircle, MapPin, Clock, Star, Calendar, ShieldCheck, HeartPulse, Award, CheckCircle2, ChevronRight, X } from 'lucide-react'

interface DentalCareProps {
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
    service_name: 'Cấy Ghép Implant Thụy Sĩ',
    description: 'Phục hình răng mất vĩnh viễn bằng trụ Implant cao cấp, khôi phục 100% chức năng ăn nhai và thẩm mỹ như răng thật.',
    price: '28.000.000đ',
    image_url: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80'
  },
  {
    service_name: 'Răng Sứ Thẩm Mỹ Veneer',
    description: 'Mặt dán sứ siêu mỏng bảo tồn răng gốc tối đa, mang lại nụ cười rạng rỡ chuẩn tỉ lệ vàng.',
    price: '8.000.000đ',
    image_url: 'https://images.unsplash.com/photo-1579684389782-64d84b5e901a?auto=format&fit=crop&q=80'
  },
  {
    service_name: 'Niềng Răng Khay Trong Suốt Invisalign',
    description: 'Công nghệ chỉnh nha hiện đại từ Hoa Kỳ giúp sắp xếp răng đều đẹp một cách vô hình, hoàn toàn tự tin giao tiếp.',
    price: '80.000.000đ',
    image_url: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80'
  },
  {
    service_name: 'Tẩy Trắng Răng Công Nghệ Laser',
    description: 'Làm bật tone răng sáng bóng tức thì chỉ sau 45 phút, an toàn tuyệt đối và không gây ê buốt.',
    price: '2.500.000đ',
    image_url: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&q=80'
  }
]

const FALLBACK_HOURS = {
  "monday": "08:00 - 19:30",
  "tuesday": "08:00 - 19:30",
  "wednesday": "08:00 - 19:30",
  "thursday": "08:00 - 19:30",
  "friday": "08:00 - 19:30",
  "saturday": "08:00 - 17:00",
  "sunday": "08:00 - 12:00"
}

export default function DentalCare({ data, isEditing = false, onUpdate = () => {}, onImagePick, businessInfo = {}, hiddenSections = [], activeSection, onSectionClick }: DentalCareProps) {
  const {
    hero_section = {},
    about_us = {},
    services_menu = [],
    contact_info = {},
    operating_hours = {},
    social_trust = {},
    theme_color = '#0D9488', // Default dental teal
    expert_team = []
  } = data

  const activeServices = services_menu && services_menu.length > 0 ? services_menu : FALLBACK_SERVICES;
  const activeExperts = expert_team && expert_team.length > 0 ? expert_team : [
    { name: 'Dr. Minh Nguyen', role: 'Giám Đốc Chuyên Môn', img: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=200' },
    { name: 'Dr. Sarah Tran', role: 'Chuyên Gia Chỉnh Nha', img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=200' }
  ];
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
  const [beforeAfterOffset, setBeforeAfterOffset] = useState(50)

  const openBookingWithService = (serviceName: string) => {
    setSelectedService(serviceName)
    setServiceRequested(serviceName)
    setIsBookingModalOpen(true)
  }

  const defaultSlides = [
    {
      image_url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80',
      title: hero_section.hero_title || 'Nụ Cười Tỏa Sáng - Kiến Tạo Tự Tin',
      subtitle: hero_section.hero_subtitle || 'Hệ thống Nha khoa chuẩn quốc tế với công nghệ điều trị không đau hàng đầu.'
    },
    {
      image_url: 'https://images.unsplash.com/photo-1579684389782-64d84b5e901a?auto=format&fit=crop&q=80',
      title: 'Kiến Tạo Nụ Cười Veneer Quý Phái',
      subtitle: 'Sứ Veneer siêu mỏng mài tối thiểu, bảo tồn tối đa răng thật mang lại nét duyên rạng ngời.'
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
    }, 6000)
    return () => clearInterval(interval)
  }, [activeSlides.length])

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!customerName || !customerPhone) {
      alert('Vui lòng nhập đầy đủ thông tin!')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_id: businessInfo.id || '10000000-0000-0000-0000-000000000001',
          business_name: businessInfo.name || 'Phòng Khám Nha Khoa',
          business_email: contact_info.email || 'dental@1beauty.asia',
          customer_name: customerName,
          customer_phone: customerPhone,
          service_requested: serviceRequested || 'Khám răng tổng quát',
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
      alert('Lỗi kết nối mạng, vui lòng thử lại sau.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleBeforeAfterMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const boundingBox = e.currentTarget.getBoundingClientRect()
    let clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const offset = ((clientX - boundingBox.left) / boundingBox.width) * 100
    setBeforeAfterOffset(Math.max(0, Math.min(100, offset)))
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
    <div className="bg-[#f0f9ff] text-slate-800 font-sans selection:bg-cyan-500/20 selection:text-[#115e59] overflow-x-hidden pt-0">
      <style jsx global>{`
        :root {
          --primary: ${theme_color};
          --primary-hover: ${theme_color}CC;
        }
        .text-primary { color: var(--primary); }
        .bg-primary { background-color: var(--primary); }
        .border-primary { border-color: var(--primary); }
      `}</style>
      
      {/* CLINICAL LUXURY FLOATING HEADER */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 py-4 px-6 md:px-12 flex items-center justify-between ${isScrolled ? 'bg-white/95 border-b border-cyan-100 backdrop-blur-md shadow-md' : 'bg-transparent border-b border-transparent backdrop-blur-none'}`}>
        <div className="flex items-center gap-4">
          {businessInfo.logo_url ? (
            <img 
              src={businessInfo.logo_url} 
              alt={businessInfo.name || "Nha Khoa"} 
              className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-cyan-500 object-cover shadow-lg transition-all hover:scale-105"
            />
          ) : (
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-cyan-600 to-teal-400 flex items-center justify-center text-white font-bold text-xl shadow-lg border-2 border-cyan-200">
              {(businessInfo.name || 'D').charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="text-sm md:text-base font-bold text-slate-800 tracking-wide leading-none">{businessInfo.name || "Nha Khoa Quốc Tế"}</h1>
            <span className="text-[10px] text-cyan-600 uppercase tracking-widest font-bold mt-1 block">Dental Care</span>
          </div>
        </div>

        <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-8 text-[11px] font-mono uppercase tracking-[0.2em] text-slate-600 font-bold">
          <a href="#about-us" className="hover:text-cyan-600 transition-colors">Về chúng tôi</a>
          <a href="#services" className="hover:text-cyan-600 transition-colors">Dịch vụ</a>
          <a href="#before-after" className="hover:text-cyan-600 transition-colors">Kết quả</a>
          <a href="#contact" className="hover:text-cyan-600 transition-colors">Liên hệ</a>
        </nav>

        <div className="flex items-center gap-3">
          <a 
            href="/"
            className="px-4 py-2 rounded-full border border-cyan-200 text-slate-600 font-semibold tracking-wider text-[10px] transition-all bg-white/80 hover:bg-cyan-50"
          >
            Trang chủ
          </a>
          <button 
            onClick={() => openBookingWithService('')}
            className="px-5 py-2 rounded-full text-white font-bold tracking-[0.1em] uppercase text-[10px] transition-all bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-700 hover:to-teal-600 shadow-md hover:-translate-y-0.5 active:translate-y-0"
          >
            Đặt Khám
          </button>
        </div>
      </header>

      {/* 1. CLINICAL HERO SECTION */}
      <section className="relative h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 0.9, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 1.2 }}
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${activeSlides[currentSlide]?.image_url}')` }}
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/95 via-cyan-950/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#f0f9ff]/90 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 flex items-center h-full pt-24">
          <div className="max-w-2xl text-left text-white">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ y: 25, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -25, opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <div className="inline-flex items-center gap-2 bg-cyan-500/20 border border-cyan-400/40 px-3 py-1 rounded-full">
                  <ShieldCheck size={14} className="text-cyan-300" />
                  <span className="text-[10px] font-bold tracking-widest uppercase text-cyan-200">
                    Nha khoa Công nghệ không đau Thụy Sĩ
                  </span>
                </div>

                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
                  <EditableField
                    value={activeSlides[currentSlide]?.title || 'Nụ Cười Tỏa Sáng - Kiến Tạo Tự Tin'}
                    onChange={(val) => onUpdate('hero_section.hero_title', val)}
                    isEditing={isEditing}
                    placeholder="Tiêu đề Hero..."
                  />
                </h1>

                <p className="text-sm md:text-lg font-medium text-slate-200 max-w-lg leading-relaxed">
                  <EditableField
                    value={activeSlides[currentSlide]?.subtitle || 'Hệ thống Nha khoa chuẩn quốc tế với công nghệ điều trị không đau hàng đầu.'}
                    onChange={(val) => onUpdate('hero_section.hero_subtitle', val)}
                    isEditing={isEditing}
                    multiline
                    placeholder="Mô tả / slogan..."
                  />
                </p>

                <div className="flex flex-col sm:flex-row gap-4 items-start pt-4">
                  <button 
                    onClick={() => openBookingWithService('')}
                    className="px-6 py-3.5 rounded-full text-white font-bold tracking-widest uppercase text-xs transition-all bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-600 hover:to-teal-500 shadow-lg shadow-cyan-950/40 hover:-translate-y-1"
                  >
                    Đăng ký tư vấn miễn phí
                  </button>
                  
                  <a 
                    href={contact_info.zalo_link || "https://zalo.me/0918731411"} 
                    className="px-6 py-3.5 rounded-full text-white font-bold tracking-widest uppercase text-xs transition-all border border-white/40 hover:bg-white/10 backdrop-blur-sm"
                  >
                    Tư vấn Zalo ngay
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex gap-2.5 mt-12">
              {activeSlides.map((_: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`transition-all duration-400 h-1.5 rounded-full ${idx === currentSlide ? 'w-8 bg-cyan-400' : 'w-1.5 bg-white/40'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. CORE ADVANTAGES (Nha khoa Chuẩn 5 Sao) */}
      <section className="py-24 px-4 bg-white relative z-10 border-b border-cyan-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-cyan-600 font-bold uppercase text-xs tracking-widest block mb-2">Thương Hiệu Đẳng Cấp</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 leading-tight">Yếu Tố Kiến Tạo Niềm Tin</h2>
            <div className="w-16 h-1 bg-cyan-500 mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-cyan-50/50 border border-cyan-100 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="w-14 h-14 bg-cyan-500 text-white rounded-2xl flex items-center justify-center shadow-md mb-6">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Vô Trùng Tuyệt Đối</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Hệ thống phòng điều trị vô trùng trung tâm cực nghiêm ngặt chuẩn Bộ Y Tế, loại bỏ hoàn toàn nguy cơ lây nhiễm chéo.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-cyan-50/50 border border-cyan-100 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="w-14 h-14 bg-cyan-500 text-white rounded-2xl flex items-center justify-center shadow-md mb-6">
                <HeartPulse size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Công Nghệ Không Đau</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Áp dụng thiết bị bôi tê, gây tê sóng tần và sóng siêu âm nhập khẩu Mỹ, mang lại trải nghiệm điều trị thư giãn, hoàn toàn không đau buốt.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-cyan-50/50 border border-cyan-100 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="w-14 h-14 bg-cyan-500 text-white rounded-2xl flex items-center justify-center shadow-md mb-6">
                <Award size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Trụ Sứ Chính Hãng</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Toàn bộ răng sứ, implant được nhập khẩu chính gốc Thụy Sĩ, Đức, Mỹ có thẻ bảo hành check mã QR chính hãng trọn đời.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE SERVICES MENU */}
      <section id="services" className="py-24 px-4 bg-[#f0f9ff]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-cyan-600 font-bold uppercase text-xs tracking-widest block mb-2">Điều Trị Chuyên Sâu</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800">
              <EditableField
                value={data.services_section_title || 'Dịch Vụ Nha Khoa Toàn Diện'}
                onChange={(val) => onUpdate('services_section_title', val)}
                isEditing={isEditing}
                placeholder="Tiêu đề section Dịch vụ..."
              />
            </h2>
            
            {isEditing && (
              <ArrayActionButtons
                onAdd={() => handleAddItem('services_menu', activeServices, FALLBACK_SERVICES[0])}
                label="Dịch vụ"
                className="justify-center mt-4"
              />
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {activeServices.map((service: any, index: number) => {
              const fallback = FALLBACK_SERVICES[index % FALLBACK_SERVICES.length]
              const sName = service.service_name || fallback.service_name
              const sDesc = service.description || fallback.description
              const sPrice = service.price || fallback.price
              const sImg = service.image_url || fallback.image_url

              return (
                <div 
                  key={index}
                  onClick={() => {
                    if (!isEditing) {
                      setViewingService({ name: sName, desc: sDesc, price: sPrice, img: sImg })
                    }
                  }}
                  >
                  {isEditing && (
                    <div className="absolute top-4 right-4 z-20">
                      <ArrayActionButtons
                        onRemove={() => handleRemoveItem('services_menu', activeServices, index)}
                      />
                    </div>
                  )}
                  <div className="w-full sm:w-40 h-40 rounded-2xl overflow-hidden shrink-0 relative">
                    <img src={sImg} alt={sName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <span className="absolute top-2 left-2 bg-teal-500 text-white text-[8px] font-bold tracking-widest px-2 py-0.5 rounded-full uppercase">VIP</span>
                  </div>

                  <div className="flex flex-col justify-between flex-grow space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-800 group-hover:text-cyan-600 transition-colors">
                        <EditableText value={sName} isEditing={isEditing} onChange={(val) => onUpdate(`services_menu[${index}].service_name`, val)} />
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed mt-2 line-clamp-2">
                        <EditableText value={sDesc} isEditing={isEditing} onChange={(val) => onUpdate(`services_menu[${index}].description`, val)} multiline />
                      </p>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-cyan-50">
                      <div>
                        <span className="text-[8px] uppercase tracking-widest text-slate-400 block font-mono">Chi phí trọn gói</span>
                        <span className="text-lg font-bold text-cyan-600">
                          <EditableText value={sPrice} isEditing={isEditing} onChange={(val) => onUpdate(`services_menu[${index}].price`, val)} />
                        </span>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation()
                          openBookingWithService(sName)
                        }}
                        className="p-2.5 bg-cyan-50 text-cyan-600 rounded-full hover:bg-cyan-600 hover:text-white transition-all"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 4. CLINICAL BEFORE & AFTER INTERACTIVE SLIDER */}
      <section id="before-after" className="py-24 px-4 bg-white border-y border-cyan-50">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-cyan-600 font-bold uppercase text-xs tracking-widest block mb-2">Hiệu Quả Thực Tế</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">Minh Chứng Từ Khách Hàng</h2>
          <p className="text-sm text-slate-500 mb-12 max-w-md mx-auto">Giữ chuột hoặc vuốt để so sánh nụ cười rạng rỡ thay đổi 180 độ sau dịch vụ làm răng sứ cao cấp tại cơ sở.</p>

          <div 
            className="relative w-full aspect-[16/10] max-h-[500px] rounded-3xl overflow-hidden select-none cursor-ew-resize border-4 border-cyan-100 shadow-2xl mx-auto"
            onMouseMove={handleBeforeAfterMove}
            onTouchMove={handleBeforeAfterMove}
          >
            {/* Before (Background) */}
            <img 
              src="https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80" 
              alt="Before" 
              className="absolute inset-0 w-full h-full object-cover pointer-events-none filter grayscale sepia-[15%]" 
            />
            <div className="absolute top-4 left-4 bg-slate-900/60 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full font-bold">TRƯỚC ĐIỀU TRỊ</div>

            {/* After (Foreground) */}
            <div 
              className="absolute inset-y-0 left-0 right-0 overflow-hidden"
              style={{ width: `${beforeAfterOffset}%` }}
            >
              <img 
                src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80" 
                alt="After" 
                className="absolute inset-0 w-full h-full object-cover pointer-events-none" 
                style={{ width: '100%', maxWidth: 'none' }}
              />
              <div className="absolute top-4 right-4 bg-cyan-600 text-white text-xs px-3 py-1.5 rounded-full font-bold whitespace-nowrap">NỤ CƯỜI HOÀN MỸ</div>
            </div>

            {/* Divider Line & Handle */}
            <div 
              className="absolute inset-y-0 w-1 bg-white cursor-ew-resize"
              style={{ left: `${beforeAfterOffset}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center shadow-lg border-2 border-white text-sm font-bold font-mono">
                ↔
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TEAM OF DOCTORS */}
      <section className="py-24 px-4 bg-[#f0f9ff]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-cyan-600 font-bold uppercase text-xs tracking-widest block mb-2">Đại Diện Chuyên Môn</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800">Bác Sĩ Cấp Cao Tu Nghiệp Châu Âu</h2>
            <div className="w-16 h-1 bg-cyan-500 mx-auto mt-4" />

            {isEditing && (
              <ArrayActionButtons
                onAdd={() => handleAddItem('expert_team', activeExperts, { name: 'Dr. New Expert', role: 'Role', img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b1f8?q=80&w=300' })}
                label="Chuyên gia"
                className="justify-center mt-4"
              />
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeExperts.map((expert: any, index: number) => (
              <div key={index} className="bg-white p-6 rounded-3xl border border-cyan-100/50 shadow-sm text-center group hover:shadow-xl transition-all relative">
                {isEditing && (
                  <div className="absolute top-4 right-4 z-20">
                    <ArrayActionButtons
                      onRemove={() => handleRemoveItem('expert_team', activeExperts, index)}
                    />
                  </div>
                )}
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-cyan-50 mx-auto mb-6">
                  <img src={expert.img} className="w-full h-full object-cover" alt={expert.name} />
                </div>
                <h4 className="text-xl font-bold text-slate-800">{expert.name}</h4>
                <p className="text-xs text-cyan-600 uppercase tracking-widest font-bold mt-1">{expert.role}</p>
                <p className="text-xs text-slate-500 leading-relaxed mt-4">{expert.desc || 'Chuyên gia với nhiều năm kinh nghiệm trong lĩnh vực nha khoa thẩm mỹ.'}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CONTACT & FOOTER */}
      <footer id="contact" className="bg-slate-900 text-white py-20 px-6 md:px-12 border-t border-cyan-50/10">
        <div className="max-w-7xl mx-auto bg-slate-800 rounded-[2.5rem] border border-cyan-500/10 p-10 md:p-16 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            <div className="lg:col-span-4 space-y-6">
              <span className="text-[9px] font-mono font-bold tracking-[0.4em] uppercase text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full inline-block">
                ★ CHẤT LƯỢNG Y KHOA ĐẲNG CẤP ★
              </span>
              <div className="flex items-center gap-4">
                {businessInfo.logo_url ? (
                  <div className="p-0.5 rounded-full border border-cyan-400 shadow-md">
                    <img 
                      src={businessInfo.logo_url} 
                      alt={businessInfo.name || "Nha Khoa"} 
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-600 to-teal-400 flex items-center justify-center text-white font-serif font-bold text-2xl shadow-lg border-2 border-cyan-300">
                    {(businessInfo.name || 'D').charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-white tracking-wide text-xl leading-none">
                    {businessInfo.name || "Nha Khoa Quốc Tế"}
                  </h3>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-cyan-400 font-bold block mt-1">
                    {businessInfo.category || "Nha Khoa"}
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Hệ thống phòng khám nha khoa cao cấp luôn hướng đến giá trị Y Đức cốt lõi, áp dụng kỹ thuật tân tiến mang đến nụ cười hoàn mỹ, hạnh phúc đích thực cho bạn.
              </p>
            </div>

            <div className="lg:col-span-5 space-y-5">
              <div className="flex items-center gap-2 border-b border-slate-700 pb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <h4 className="text-xs font-mono font-bold uppercase tracking-[0.3em] text-cyan-400">Liên hệ & Đặt lịch</h4>
              </div>
              
              {/* Internal Quick Booking Form on Footer */}
              <form onSubmit={handleBooking} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="Họ và tên của bạn" 
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-slate-700/50 border border-slate-600/50 p-3.5 rounded-xl text-white outline-none focus:border-cyan-400 text-xs font-medium"
                    required
                  />
                  <input 
                    type="tel" 
                    placeholder="Số điện thoại" 
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-slate-700/50 border border-slate-600/50 p-3.5 rounded-xl text-white outline-none focus:border-cyan-400 text-xs font-medium"
                    required
                  />
                </div>
                <select 
                  value={serviceRequested}
                  onChange={(e) => setServiceRequested(e.target.value)}
                  className="w-full bg-slate-700/50 border border-slate-600/50 p-3.5 rounded-xl text-white outline-none focus:border-cyan-400 text-xs font-medium"
                >
                  <option value="">Chọn dịch vụ bạn muốn khám</option>
                  {activeServices.map((s: any, idx: number) => (
                    <option key={idx} value={s.service_name || s}>{s.service_name || s}</option>
                  ))}
                  <option value="Khám & tư vấn tổng quát">Khám & tư vấn tổng quát</option>
                </select>

                <button 
                  type="submit" 
                  disabled={submitting}
                  className="w-full py-4 rounded-xl text-slate-900 font-bold uppercase tracking-[0.1em] text-xs transition-all duration-300 bg-gradient-to-r from-cyan-400 to-teal-300 hover:brightness-115 disabled:opacity-50"
                >
                  {submitting ? 'ĐANG GỬI THÔNG TIN...' : 'ĐĂNG KÝ KHÁM MIỄN PHÍ NGAY'}
                </button>

                {success && (
                  <p className="text-xs text-teal-400 font-bold text-center mt-2 animate-bounce">✓ Đăng ký thành công! Đội ngũ tư vấn sẽ gọi điện hỗ trợ bạn trong vòng 5 phút.</p>
                )}
              </form>
            </div>

            <div className="lg:col-span-3 space-y-5 text-xs text-slate-300">
              <div className="flex items-center gap-2 border-b border-slate-700 pb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <h4 className="text-xs font-mono font-bold uppercase tracking-[0.3em] text-cyan-400">Địa chỉ & Giờ khám</h4>
              </div>
              <div className="space-y-4">
                <p className="flex items-start gap-2.5">
                  <MapPin size={14} className="text-cyan-400 shrink-0 mt-0.5" />
                  <span>{contact_info.address_full || 'Số 100 Nguyễn Thị Minh Khai, Quận 3, TP. Hồ Chí Minh'}</span>
                </p>
                <p className="flex items-center gap-2.5">
                  <Phone size={14} className="text-cyan-400 shrink-0" />
                  <a href={`tel:${contact_info.hotline || '19008888'}`} className="text-base font-bold text-cyan-300">{contact_info.hotline || '1900 8888'}</a>
                </p>
                <div className="space-y-1.5 border-t border-slate-700 pt-3 text-[10px]">
                  <p className="flex justify-between"><span>Thứ 2 - 6:</span><span className="font-bold text-white">08:00 - 19:30</span></p>
                  <p className="flex justify-between"><span>Thứ 7:</span><span className="font-bold text-white">08:00 - 17:00</span></p>
                  <p className="flex justify-between"><span>Chủ nhật:</span><span className="font-bold text-white">08:00 - 12:00</span></p>
                </div>
              </div>
            </div>

          </div>

          <div className="border-t border-slate-700 mt-16 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] tracking-widest text-slate-500 uppercase font-bold">
            <div>
              © 2026 {businessInfo.name || 'Premium Dental'}. All rights reserved.
            </div>
            <div className="text-cyan-400/50 tracking-[0.3em] flex items-center gap-1.5">
              <span>Powered by</span>
              <a href="/" className="hover:text-cyan-300 transition-colors">1Beauty.Asia</a>
            </div>
          </div>

        </div>
      </footer>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-10 right-10 flex flex-col gap-4 z-50">
        <a 
          href={contact_info.zalo_link || "https://zalo.me/0918731411"} 
          className="w-14 h-14 bg-[#0068FF] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          title="Chat Zalo"
        >
          <MessageCircle size={24} />
        </a>
        <button 
          onClick={() => openBookingWithService('')}
          className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform bg-gradient-to-r from-cyan-500 to-teal-400"
          title="Đặt lịch khám"
        >
          <Calendar size={24} />
        </button>
      </div>

      {/* DETAILED POPUP MODAL */}
      <AnimatePresence>
        {viewingService && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl bg-[#f0f9ff] border-2 border-cyan-200 p-6 md:p-8 rounded-[2rem] shadow-2xl flex flex-col md:flex-row gap-6 max-h-[85vh] overflow-y-auto md:overflow-hidden"
            >
              <button 
                onClick={() => setViewingService(null)}
                className="absolute top-5 right-5 z-20 text-slate-600 hover:text-slate-800 transition-colors p-1.5 bg-white/60 backdrop-blur-md rounded-full border border-cyan-100"
              >
                <X size={18} />
              </button>

              <div className="w-full md:w-1/2 h-48 md:h-auto rounded-2xl overflow-hidden border border-cyan-100 relative shrink-0">
                <img src={viewingService.img} alt={viewingService.name} className="w-full h-full object-cover" />
                <span className="absolute bottom-4 left-4 bg-cyan-600 text-white text-[9px] font-bold tracking-widest px-3 py-1 rounded-full uppercase shadow-md">
                  CHẤT LƯỢNG 5★
                </span>
              </div>

              <div className="w-full md:w-1/2 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-bold text-cyan-600 tracking-[0.2em] uppercase">Chi tiết dịch vụ</span>
                    <h3 className="text-2xl font-bold text-slate-800 mt-1">{viewingService.name}</h3>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed font-medium">
                    {viewingService.desc}
                  </p>

                  <div className="pt-4 border-t border-cyan-100 flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    <span className="flex items-center gap-1.5 bg-white/60 px-3 py-1.5 rounded-full border border-cyan-100"><Clock size={12} className="text-cyan-500" /> Trọn gói 1 liệu trình</span>
                    <span className="flex items-center gap-1.5 bg-white/60 px-3 py-1.5 rounded-full border border-cyan-100"><ShieldCheck size={12} className="text-cyan-500" /> Vô trùng tuyệt đối</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-cyan-100 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Chi phí niêm yết</span>
                    <span className="text-xl font-bold text-cyan-600">{viewingService.price}</span>
                  </div>
                  <button 
                    onClick={() => {
                      openBookingWithService(viewingService.name);
                      setViewingService(null);
                    }}
                    className="px-5 py-2.5 rounded-full text-white font-bold tracking-widest uppercase text-[10px] transition-all bg-gradient-to-r from-cyan-600 to-teal-500 hover:brightness-110"
                  >
                    ĐẶT LỊCH KHÁM NGAY
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* QUICK BOOKING DIALOG MODAL */}
      <AnimatePresence>
        {isBookingModalOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white border-2 border-cyan-200 p-8 rounded-[2rem] shadow-2xl"
            >
              <button 
                onClick={() => setIsBookingModalOpen(false)}
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="text-center mb-6">
                <span className="text-[10px] text-cyan-600 font-bold uppercase tracking-[0.2em]">Đặt lịch trực tuyến</span>
                <h3 className="text-2xl text-slate-800 font-bold mt-2">Đăng Ký Đặt Khám</h3>
              </div>

              {success ? (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 bg-cyan-100 text-cyan-600 rounded-full flex items-center justify-center mx-auto text-3xl font-bold border border-cyan-200">
                    ✓
                  </div>
                  <h4 className="text-xl font-bold text-slate-800">Đăng Ký Thành Công!</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Đội ngũ nhân viên y tế sẽ gọi điện xác nhận khung giờ khám lý tưởng nhất cho bạn trong vòng 5 phút nữa. Xin chân thành cảm ơn!
                  </p>
                  <button 
                    onClick={() => {
                      setIsBookingModalOpen(false)
                      setSuccess(false)
                    }}
                    className="w-full py-3 bg-cyan-500 text-white font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-cyan-600 transition-all mt-4"
                  >
                    Đóng cửa sổ
                  </button>
                </div>
              ) : (
                <form onSubmit={handleBooking} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Họ và tên khách hàng</label>
                    <input 
                      type="text" 
                      placeholder="Nhập tên của bạn" 
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-slate-800 outline-none focus:border-cyan-500 text-xs font-semibold"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Số điện thoại liên hệ</label>
                    <input 
                      type="tel" 
                      placeholder="Nhập số điện thoại" 
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-slate-800 outline-none focus:border-cyan-500 text-xs font-semibold"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Dịch vụ yêu cầu</label>
                    <select 
                      value={serviceRequested}
                      onChange={(e) => setServiceRequested(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-slate-800 outline-none focus:border-cyan-500 text-xs font-semibold"
                    >
                      <option value="">Khám và tư vấn chung</option>
                      {activeServices.map((s: any, idx: number) => (
                        <option key={idx} value={s.service_name || s}>{s.service_name || s}</option>
                      ))}
                    </select>
                  </div>

                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="w-full py-4 rounded-xl text-white font-bold uppercase tracking-widest text-xs transition-all duration-300 bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-700 hover:to-teal-600 shadow-md shadow-cyan-100 disabled:opacity-50 mt-4"
                  >
                    {submitting ? 'ĐANG ĐĂNG KÝ...' : 'XÁC NHẬN ĐẶT LỊCH NGAY'}
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
