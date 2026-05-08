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
  ShieldCheck, 
  Activity, 
  Award, 
  Heart,
  Eye,
  CheckCircle2,
  Lock,
  Stethoscope
} from 'lucide-react'

// We will use framer-motion for perfect compatibility and animations
import { motion as motionFramer, AnimatePresence as AnimatePresenceFramer } from 'framer-motion'

interface ModernMedicalProps {
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

const CLINICAL_SERVICES = [
  {
    name: 'Tái Cấu Trúc Khối Cơ Mặt Ultherapy',
    tagline: 'Ultherapy Deep Lifting & Contour Sculpting',
    duration: '90 Phút • Không Xâm Lấn',
    desc: 'Sử dụng sóng siêu âm hội tụ vi điểm hội tụ cường độ cao tác động trực tiếp vào lớp cơ nông SMAS, giúp nâng đỡ cơ mặt bị chảy xệ, kiến tạo đường viền hàm thon gọn thanh tú và loại bỏ nếp nhăn chảy xệ.',
    price: '18.500.000đ',
    img: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80'
  },
  {
    name: 'Liệu Pháp Tế Bào Gốc Thủy Tinh Thụy Sĩ',
    tagline: 'Glass-Skin Stem Cell Micro-infusion',
    duration: '60 Phút • Công Nghệ Không Kim',
    desc: 'Đưa phức hợp dưỡng chất tế bào gốc tươi và HA cô đặc Thụy Sĩ vào sâu lớp trung bì bằng công nghệ phun áp lực Oxy cao tần không đầu kim, hồi sinh làn da căng bóng ngọc trai hoàn mỹ.',
    price: '12.000.000đ',
    img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80'
  },
  {
    name: 'Điêu Khắc Sợi Collagen Trẻ Hóa Da',
    tagline: 'Collagen Matrix Direct Skin Tightening',
    duration: '120 Phút • Kích Thích Tự Thân',
    desc: 'Phương pháp cấy sợi collagen đa chiều dưới da giúp xây dựng lại mạng lưới nâng đỡ tế bào bị đứt gãy, thúc đẩy tăng sinh elastin tự nhiên để làm săn chắc da tức thì và xóa mờ nếp nhăn trán và bọng mắt.',
    price: '24.000.000đ',
    img: 'https://images.unsplash.com/photo-1604654894610-df4906b197ae?auto=format&fit=crop&q=80'
  },
  {
    name: 'Thanh Lọc Thải Độc Tế Bào HydroFacial',
    tagline: 'Advanced Hydro-Detoxification & Deep Glow',
    duration: '75 Phút • Công Nghệ Đức',
    desc: 'Quy trình 3 bước làm sạch sâu, hút độc tố chì mụn và bã nhờn bằng dòng nước xoắn ốc kết hợp truyền tinh chất khoáng tươi làm dịu phục hồi, mang lại sự tinh khiết hoàn hảo cho tế bào da.',
    price: '4.500.000đ',
    img: 'https://images.unsplash.com/photo-1515688594390-b649af70d282?auto=format&fit=crop&q=80'
  }
]

const CLINICAL_GALLERY = [
  {
    title: 'Consultation Suite 5-Star',
    category: 'Consulting',
    img: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=600'
  },
  {
    title: 'Precision Micro-infusion Lab',
    category: 'Laboratory',
    img: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=600'
  },
  {
    title: 'Advanced Diagnostic System',
    category: 'Diagnostics',
    img: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=600'
  },
  {
    title: 'Private Treatment Sanctum',
    category: 'Sanctuary',
    img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=600'
  }
]

const CLINICAL_EXPERTS = [
  {
    name: 'Prof. Dr. Elizabeth Mueller',
    role: 'Bác Sĩ Trưởng Khoa Thẩm Mỹ Thần Kinh',
    origin: 'Munich University Hospital, Đức',
    desc: 'Hơn 20 năm nghiên cứu và trực tiếp điều trị thẩm mỹ không xâm lấn tại châu Âu. Giáo sư Elizabeth Mueller là chuyên gia đầu ngành trong lĩnh vực tái cấu trúc khối cơ mặt và tế bào tự thân trẻ hóa.',
    img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80'
  },
  {
    name: 'Dr. Minh An Nguyen',
    role: 'Chuyên Gia Thẩm Mỹ Nội Khoa Cấp Cao',
    origin: 'Đại Học Y Dược TP.HCM',
    desc: 'Bác sĩ nội trú xuất sắc với hơn 10 năm kinh nghiệm điều trị da liễu lâm sàng và phẫu thuật thẩm mỹ không phẫu thuật. Được chứng nhận chuyên môn cao cấp từ Allergan Hoa Kỳ.',
    img: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80'
  }
]

const MEDICAL_SLIDES = [
  'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1200',
  'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1200',
  'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=1200'
]

export default function ModernMedical({ data, isEditing = false, onUpdate = () => {}, onImagePick, businessInfo = {}, hiddenSections = [], activeSection, onSectionClick }: ModernMedicalProps) {
  const {
    hero_section = {},
    about_us = {},
    services_menu = [],
    contact_info = {},
    operating_hours = {},
    social_trust = {},
    theme_color = '#00E5FF', // Default medical cyan
    expert_team = []
  } = data

  const activeServices = services_menu && services_menu.length > 0 ? services_menu : CLINICAL_SERVICES
  const activeExperts = expert_team && expert_team.length > 0 ? expert_team : CLINICAL_EXPERTS
  const activeHours = Object.keys(operating_hours).length > 0 ? operating_hours : { weekdays: '08:00 - 20:00', weekends: '08:00 - 18:00' }

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
      setCurrentHeroSlide((prev) => (prev + 1) % MEDICAL_SLIDES.length)
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
    <div className="bg-[#0A1128] text-[#F4F7F6] font-sans selection:bg-[var(--primary)]/20 selection:text-white overflow-x-hidden pt-0" style={{ fontFamily: "'Montserrat', sans-serif" }}>
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
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 py-6 px-6 md:px-12 flex items-center justify-between ${isScrolled ? 'bg-[#0A1128]/95 border-b border-[#00E5FF]/20 backdrop-blur-md shadow-md' : 'bg-transparent border-b border-transparent backdrop-blur-none'}`}>
        <div className="flex items-center gap-4">
          {businessInfo.logo_url ? (
            <img 
              src={businessInfo.logo_url} 
              alt={businessInfo.name || "Logo"} 
              className="w-12 h-12 rounded-full border-2 border-[#00E5FF]/50 object-cover shadow-lg"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--primary)] via-[#E0F7FA] to-[#006064] flex items-center justify-center text-black font-serif font-bold text-xl shadow-lg border-2 border-[var(--primary)]/50">
              {(businessInfo.name || 'M').charAt(0).toUpperCase()}
            </div>
          )}
          <span className="hidden sm:inline-block text-xs font-mono font-bold tracking-[0.3em] uppercase text-white">
            {businessInfo.name || "CLINIC CENTRE"}
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-12 text-[10px] font-mono uppercase tracking-[0.4em] font-bold text-white/80">
          <a href="#about" className="hover:text-[var(--primary)] transition-all relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-[var(--primary)] hover:after:w-full after:transition-all">Triết Lý</a>
          <a href="#services" className="hover:text-[var(--primary)] transition-all relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-[var(--primary)] hover:after:w-full after:transition-all">Khoa Học</a>
          <a href="#experts" className="hover:text-[var(--primary)] transition-all relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-[var(--primary)] hover:after:w-full after:transition-all">Chuyên Gia</a>
          <a href="#contact" className="hover:text-[var(--primary)] transition-all relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-[var(--primary)] hover:after:w-full after:transition-all">Liên Hệ</a>
        </nav>

        <div className="flex items-center gap-3">
          <a 
            href="/"
            className="hidden lg:inline-block px-5 py-2 rounded-full border border-white/20 text-white font-bold tracking-widest uppercase text-[9px] transition-all hover:bg-[var(--primary)]/10 bg-white/5"
          >
            Trang chủ
          </a>
          <button 
            onClick={() => openBookingWithService('')}
            className="px-6 py-2.5 rounded-full text-black bg-gradient-to-r from-[var(--primary)] via-[#E0F7FA] to-[#0097A7] font-bold tracking-[0.2em] uppercase text-[9px] transition-all shadow-[0_4px_15px_rgba(0,229,255,0.25)] hover:shadow-[0_6px_25px_rgba(0,229,255,0.4)] hover:-translate-y-0.5 active:translate-y-0"
          >
            ĐẶT LỊCH VIP
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-full border border-white/20 bg-black/30 text-white hover:bg-[#00E5FF]/10 transition-all"
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
            className="fixed inset-0 z-40 bg-[#0A1128]/98 backdrop-blur-lg flex flex-col items-center justify-center gap-8 md:hidden"
          >
            <nav className="flex flex-col items-center gap-8 text-[12px] font-mono uppercase tracking-[0.3em] text-white font-bold">
              <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#00E5FF] transition-all">Triết Lý</a>
              <a href="#services" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#00E5FF] transition-all">Khoa Học</a>
              <a href="#experts" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#00E5FF] transition-all">Chuyên Gia</a>
              <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#00E5FF] transition-all">Liên Hệ</a>
            </nav>
            <button 
              onClick={() => { setIsMobileMenuOpen(false); openBookingWithService(''); }}
              className="px-8 py-3.5 rounded-full text-black font-bold tracking-[0.2em] uppercase text-[10px] bg-gradient-to-r from-[#00E5FF] via-[#E0F7FA] to-[#0097A7] shadow-lg"
            >
              ĐẶT LỊCH VIP CONCIERGE
            </button>
          </motionFramer.div>
        )}
      </AnimatePresenceFramer>

      {/* 1. MEDICAL HERO WITH KEN BURNS EFFECT */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black text-white">
        <div className="absolute inset-0 z-0">
          <AnimatePresenceFramer mode="wait">
            <motionFramer.img 
              key={currentHeroSlide}
              src={MEDICAL_SLIDES[currentHeroSlide]} 
              alt="Advanced Clinical Prelude" 
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 0.35, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0 w-full h-full object-cover filter saturate-[0.8] brightness-[0.7]"
            />
          </AnimatePresenceFramer>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1128] via-black/10 to-transparent" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl space-y-8">
          <motionFramer.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-3 bg-[#00E5FF]/15 border border-[#00E5FF]/40 text-[#00E5FF] px-6 py-2 rounded-full backdrop-blur-md">
              <ShieldCheck size={12} className="animate-pulse text-[#00E5FF]" />
              <span className="uppercase tracking-[0.3em] text-[9px] font-bold font-mono">Cơ sở y khoa đạt chuẩn quốc tế</span>
            </div>
            
            <h1 className="text-4xl md:text-7xl font-light leading-tight tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>
              <EditableField
                value={hero_section.hero_title || 'Khoa Học Thẩm Mỹ Tiên Phong Thế Hệ Mới'}
                onChange={(val) => onUpdate('hero_section.hero_title', val)}
                isEditing={isEditing}
                placeholder="Tiêu đề Hero..."
              />
            </h1>
            
            <p className="text-sm md:text-lg text-white/70 max-w-xl mx-auto font-light leading-relaxed">
              <EditableField
                value={hero_section.hero_subtitle || 'Chúng tôi cung cấp lộ trình điều trị cá nhân hóa, kết hợp giữa kiến thức chuyên khoa lâm sàng sâu rộng và trang thiết bị y tế tân tiến hàng đầu Thụy Sĩ & Hoa Kỳ.'}
                onChange={(val) => onUpdate('hero_section.hero_subtitle', val)}
                isEditing={isEditing}
                multiline
                placeholder="Slogan / mô tả ngắn..."
              />
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center pt-8">
              <button 
                onClick={() => openBookingWithService('')}
                className="px-8 py-3.5 rounded-full text-black font-bold tracking-[0.2em] uppercase text-[10px] bg-gradient-to-r from-[#00E5FF] via-[#E0F7FA] to-[#0097A7] shadow-xl hover:scale-105 transition-all relative overflow-hidden group"
              >
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                Khóa Lịch Chuyên Khoa
              </button>
              <a 
                href="#about"
                className="px-8 py-3.5 rounded-full border border-white/20 hover:border-white/50 text-white font-bold tracking-[0.2em] uppercase text-[10px] transition-all backdrop-blur-sm bg-white/5"
              >
                Xem Triết Lý Khoa Học
              </a>
            </div>
          </motionFramer.div>
        </div>
      </section>

      {/* 2. CORE SCIENTIFIC VALUES */}
      <section id="about" className="relative py-24 md:py-36 px-6 md:px-20 bg-[#0A1128]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <span className="text-[10px] font-mono tracking-[0.4em] uppercase text-[#00E5FF] font-bold block">Tuyên Ngôn Khoa Học</span>
              <h2 className="text-3xl md:text-5xl font-light tracking-wide text-white leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                <EditableField
                  value={about_us.section_title || 'Nâng Tầm Nhan Sắc Bằng Y Học Lâm Sàng'}
                  onChange={(val) => onUpdate('about_us.section_title', val)}
                  isEditing={isEditing}
                  placeholder="Tiêu đề section Về chúng tôi..."
                />
              </h2>
            </div>
            
            <div className="h-[1px] w-20 bg-[#00E5FF]/50" />
            
            <p className="text-[#8E9AAF] text-sm md:text-base font-light leading-relaxed">
              <EditableField
                value={about_us.intro_text || 'Vẻ đẹp kiêu sa thực sự bền vững phải dựa trên một nền tảng khoa học vững chắc.'}
                onChange={(val) => onUpdate('about_us.intro_text', val)}
                isEditing={isEditing}
                multiline
                placeholder="Mô tả về chúng tôi..."
              />
            </p>

            <div className="pt-6">
              <div className="flex items-center gap-6">
                <div className="border border-[#00E5FF]/30 p-4 rounded-full bg-[#00E5FF]/5">
                  <Activity size={24} className="text-[#00E5FF]" />
                </div>
                <div>
                  <h4 className="text-sm font-mono tracking-wider uppercase text-white font-bold">Tiêu Chuẩn FDA & CE</h4>
                  <p className="text-xs text-[#8E9AAF]">Cam kết sử dụng công nghệ thẩm mỹ đã qua kiểm định lâm sàng khắt khe</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-12 gap-4 items-center">
            <div className="col-span-7 space-y-4">
              <div className="overflow-hidden rounded-2xl border border-[#00E5FF]/10 aspect-[3/4] relative group">
                <img 
                  src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=600" 
                  alt="Clinical Research" 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
              </div>
            </div>
            <div className="col-span-5 space-y-4 pt-12">
              <div className="overflow-hidden rounded-2xl border border-[#00E5FF]/10 aspect-[1/1] relative group">
                <img 
                  src="https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=600" 
                  alt="Clinical Biotech" 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
              </div>
              <div className="p-8 rounded-2xl border border-[#00E5FF]/20 bg-gradient-to-br from-[#101F42] to-[#050A1A] text-center space-y-2">
                <span className="text-2xl font-light text-[#00E5FF]" style={{ fontFamily: "'Playfair Display', serif" }}>{about_us.experience_years || '15+'}</span>
                <p className="text-[9px] font-mono tracking-widest text-[#8E9AAF] uppercase">Năm Nghiên Cứu Lâm Sàng</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. CORE SCIENTIFIC SERVICES GRID */}
      <section id="services" className="py-24 md:py-36 px-6 md:px-12 bg-black relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(0,229,255,0.05),transparent_50%)]" />
        
        <div className="max-w-7xl mx-auto space-y-16 relative z-10">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="text-[10px] font-mono tracking-[0.4em] uppercase text-[#00E5FF] font-bold block">Danh Mục Chuyên Khoa</span>
            <h2 className="text-3xl md:text-5xl font-light tracking-wide text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
              <EditableField
                value={data.services_section_title || 'Giải Pháp Y Khoa Tiên Tiến'}
                onChange={(val) => onUpdate('services_section_title', val)}
                isEditing={isEditing}
                placeholder="Tiêu đề section Dịch vụ..."
              />
            </h2>
            <div className="h-[1px] w-20 bg-[#00E5FF]/50 mx-auto" />
            <p className="text-[#8E9AAF] text-xs md:text-sm font-light">
              Mỗi phác đồ điều trị đều được xây dựng nghiêm ngặt theo tiêu chuẩn của Bộ Y Tế, kết hợp tinh chất tế bào gốc cao cấp để đem lại kết quả hoàn mỹ tuyệt đối.
            </p>
            
            {isEditing && (
              <ArrayActionButtons
                onAdd={() => handleAddItem('services_menu', activeServices, CLINICAL_SERVICES[0])}
                label="Dịch vụ"
                className="justify-center mt-4"
              />
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {activeServices.map((service: any, index: number) => (
              <div 
                key={index}
                className="group relative rounded-2xl border border-white/10 bg-[#0A1128] overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:border-[#00E5FF]/30 hover:shadow-[0_10px_30px_rgba(0,229,255,0.1)] flex flex-col h-full"
              >
                <div className="aspect-[4/3] w-full overflow-hidden relative">
                  <img 
                    src={service.img} 
                    alt={service.name} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A1128] to-transparent opacity-65" />
                  <div className="absolute top-4 right-4 bg-[#0A1128]/80 backdrop-blur-md border border-[#00E5FF]/30 px-3 py-1 rounded-full text-[9px] font-mono tracking-widest text-[#00E5FF] uppercase">
                    {service.price}
                  </div>
                </div>

                <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-[9px] font-mono tracking-widest text-[#00E5FF] uppercase block">{service.tagline}</span>
                    <h3 className="text-lg font-light tracking-wide text-white" style={{ fontFamily: "'Playfair Display', serif" }}>{service.name}</h3>
                    <p className="text-xs text-[#8E9AAF] font-light leading-relaxed line-clamp-3">{service.desc}</p>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-[#8E9AAF]">
                    <span>{service.duration}</span>
                    <button 
                      onClick={() => openBookingWithService(service.name)}
                      className="text-[var(--primary)] font-bold tracking-widest flex items-center gap-1 group-hover:translate-x-1 transition-all"
                    >
                      ĐẶT LỊCH CHUYÊN KHOA <ChevronRight size={12} />
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
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. THE BEFORE/AFTER SCIENTIFIC TRANSMUTATION */}
      <section className="py-24 md:py-36 px-6 bg-black relative">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <div className="space-y-4">
            <span className="text-[10px] font-mono tracking-[0.4em] uppercase text-[#00E5FF] font-bold block">Chứng Minh Lâm Sàng</span>
            <h2 className="text-3xl md:text-5xl font-light tracking-wide text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
              Hiệu Quả <span className="italic text-[#00E5FF]">Thực Tế</span> Đã Được Kiểm Chứng
            </h2>
            <div className="h-[1px] w-20 bg-[#00E5FF]/50 mx-auto" />
            <p className="text-[#8E9AAF] text-xs md:text-sm font-light max-w-xl mx-auto">
              Kéo thanh trượt để chứng kiến màn hồi sinh làn da chảy xệ và rãnh nhăn sâu ngoạn mục, được thực hiện thành công nhờ phác đồ Ultherapy kết hợp tế bào gốc tự thân.
            </p>
          </div>

          <div className="relative aspect-[16/10] w-full max-w-3xl mx-auto overflow-hidden rounded-3xl border-4 border-[#00E5FF]/30 shadow-[0_15px_50px_rgba(0,229,255,0.15)] select-none">
            {/* Before (Right Side / Full image) */}
            <img 
              src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80" 
              alt="Before Treatment" 
              className="absolute inset-0 w-full h-full object-cover filter saturate-[0.6] brightness-[0.7]"
            />
            <div className="absolute bottom-6 right-6 z-20 bg-black/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 text-[10px] font-mono tracking-widest text-white uppercase">
              Trước Trị Liệu (Before)
            </div>

            {/* After (Left Side / Clipped Image) */}
            <div 
              className="absolute inset-0 z-10 w-full h-full overflow-hidden"
              style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
            >
              <img 
                src="https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80" 
                alt="After Rejuvenation" 
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute bottom-6 left-6 bg-[#0A1128]/85 backdrop-blur-md px-4 py-1.5 rounded-full border border-[#00E5FF]/40 text-[10px] font-mono tracking-widest text-[#00E5FF] uppercase">
                Trẻ Hóa Ngoạn Mục (After)
              </div>
            </div>

            {/* Slider line & handle */}
            <div 
              className="absolute top-0 bottom-0 z-20 w-1 bg-[#00E5FF] cursor-ew-resize"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black border-2 border-[#00E5FF] text-[#00E5FF] shadow-2xl flex items-center justify-center cursor-ew-resize hover:scale-110 active:scale-95 transition-transform">
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

      {/* 5. THE CLINICAL EXPERTS / SURGEONS */}
      <section id="experts" className="py-24 md:py-36 px-6 md:px-12 bg-[#0A1128] relative">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="text-[10px] font-mono tracking-[0.4em] uppercase text-[#00E5FF] font-bold block">Đội Ngũ Chuyên Khoa</span>
            <h2 className="text-3xl md:text-5xl font-light tracking-wide text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
              Hội Đồng <span className="italic text-[#00E5FF]">Y Khoa & Giáo Sư Đầu Ngành</span>
            </h2>
            <div className="h-[1px] w-20 bg-[#00E5FF]/50 mx-auto" />
            <p className="text-[#8E9AAF] text-xs md:text-sm font-light">
              Nơi hội tụ những bộ óc xuất sắc nhất, các giáo sư và tiến sĩ y khoa tu nghiệp chuyên sâu tại Munich (Đức), Basel (Thụy Sĩ) và Harvard (Mỹ).
            </p>

            {isEditing && (
              <ArrayActionButtons
                onAdd={() => handleAddItem('expert_team', activeExperts, CLINICAL_EXPERTS[0])}
                label="Chuyên gia"
                className="justify-center mt-4"
              />
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {activeExperts.map((curator: any, index: number) => (
              <div 
                key={index}
                className="group relative flex flex-col md:flex-row gap-8 items-center p-8 rounded-3xl border border-white/5 bg-black overflow-hidden hover:border-[var(--primary)]/30 transition-all duration-500"
              >
                {isEditing && (
                  <div className="absolute top-4 right-4 z-20">
                    <ArrayActionButtons
                      onRemove={() => handleRemoveItem('expert_team', activeExperts, index)}
                    />
                  </div>
                )}
                <div className="w-48 h-48 rounded-full overflow-hidden border-2 border-[var(--primary)]/20 flex-shrink-0 relative">
                  <img 
                    src={curator.img} 
                    alt={curator.name} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                </div>

                <div className="space-y-4 text-center md:text-left">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono tracking-[0.2em] uppercase text-[#00E5FF] block font-bold">{curator.role} • {curator.origin}</span>
                    <h3 className="text-xl font-light text-white" style={{ fontFamily: "'Playfair Display', serif" }}>{curator.name}</h3>
                  </div>
                  <p className="text-xs text-[#8E9AAF] font-light leading-relaxed">{curator.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. ADVANCED CLINIC LAB GALLERY */}
      <section className="py-24 md:py-36 px-6 md:px-12 bg-black relative">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="text-[10px] font-mono tracking-[0.4em] uppercase text-[#00E5FF] font-bold block">Sanctum Lab</span>
            <h2 className="text-3xl md:text-5xl font-light tracking-wide text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
              Không Gian <span className="italic text-[#00E5FF]">Phòng Lab & Chẩn Đoán</span>
            </h2>
            <div className="h-[1px] w-20 bg-[#00E5FF]/50 mx-auto" />
            <p className="text-[#8E9AAF] text-xs md:text-sm font-light">
              Môi trường tiệt trùng tuyệt đối đạt chứng nhận khắt khe của hệ thống phòng Lab thế giới.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CLINICAL_GALLERY.map((item, index) => (
              <div 
                key={index}
                className="group relative overflow-hidden rounded-2xl border border-white/5 aspect-[4/3] cursor-pointer"
              >
                <img 
                  src={item.img} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 filter brightness-75 group-hover:brightness-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-85 transition-all duration-500" />
                <div className="absolute bottom-6 left-6 right-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 space-y-1 text-left">
                  <span className="text-[8px] font-mono tracking-[0.3em] uppercase text-[#00E5FF] block font-bold">{item.category}</span>
                  <h4 className="text-base font-light tracking-wide text-white" style={{ fontFamily: "'Playfair Display', serif" }}>{item.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. MEDICAL RESERVATION (Clinical VIP Form) */}
      <section id="contact" className="py-24 md:py-36 px-6 bg-[#0A1128] relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="space-y-8 text-left">
            <div className="space-y-4">
              <span className="text-[10px] font-mono tracking-[0.4em] uppercase text-[#00E5FF] font-bold block">Liên Hệ Chuyên Khoa</span>
              <h2 className="text-3xl md:text-5xl font-light tracking-wide text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                Khởi Đầu Hành Trình <br/> <span className="italic text-[#00E5FF]">Hồi Sinh Nhan Sắc</span>
              </h2>
            </div>
            <p className="text-[#8E9AAF] text-xs md:text-sm font-light leading-relaxed">
              Mời quý khách hoàn thành form đặt lịch thăm khám và tư vấn trực tiếp cùng Hội đồng Giáo sư Thẩm mỹ để thiết lập phác đồ trẻ hóa độc bản.
            </p>

            <div className="space-y-4 text-xs md:text-sm font-mono tracking-wider uppercase text-white/70">
              <div className="flex items-center gap-4">
                <MapPin size={16} className="text-[#00E5FF]" />
                <span>{contact_info.address_full || "123 Đồng Khởi, Bến Nghé, Quận 1, TP. Hồ Chí Minh"}</span>
              </div>
              <div className="flex items-center gap-4">
                <Phone size={16} className="text-[#00E5FF]" />
                <span>Hotline: {contact_info.hotline || "1900 8888"}</span>
              </div>
              <div className="flex items-center gap-4">
                <Clock size={16} className="text-[#00E5FF]" />
                <span>Giờ làm việc: {activeHours.weekdays} (T2-T6) • {activeHours.weekends} (T7-CN)</span>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-12 rounded-3xl border border-[#00E5FF]/30 bg-black relative overflow-hidden shadow-[0_15px_50px_rgba(0,229,255,0.1)]">
            <div className="absolute inset-0 bg-gradient-to-br from-[#101F42] via-black to-[#050A1A]" />
            
            <div className="relative z-10 space-y-6">
              <h3 className="text-xl md:text-2xl font-light text-center text-[#00E5FF] tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>Đăng Ký Tư Vấn Cấp Cao</h3>
              
              {success ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#00E5FF]/20 flex items-center justify-center mx-auto border border-[#00E5FF]/50 text-[#00E5FF] text-2xl">✓</div>
                  <h4 className="text-lg font-light">Đăng Ký Thành Công</h4>
                  <p className="text-xs text-white/50 max-w-xs mx-auto font-light leading-relaxed">Yêu cầu phác đồ cá nhân đã được chuyển tới Hội đồng Y khoa. Trợ lý chuyên khoa sẽ liên hệ xác nhận trong vòng 15 phút.</p>
                </div>
              ) : (
                <form onSubmit={handleBooking} className="space-y-5">
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono uppercase tracking-widest text-white/50 block">Họ và Tên Quý Khách</label>
                    <input 
                      type="text" 
                      required 
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Nguyễn Hoàng Vy" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#00E5FF]/50 transition-all font-mono"
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
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#00E5FF]/50 transition-all font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-mono uppercase tracking-widest text-white/50 block">Chọn Phác Đồ Trị Liệu</label>
                    <select 
                      value={serviceRequested}
                      onChange={(e) => setServiceRequested(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3.5 text-xs text-white focus:outline-none focus:border-[#00E5FF]/50 transition-all font-mono"
                    >
                      <option value="">-- Đăng ký thăm khám tổng quát --</option>
                      {activeServices.map((s: any, idx: number) => (
                        <option key={idx} value={s.name}>{s.name} ({s.price})</option>
                      ))}
                    </select>
                  </div>

                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="w-full py-4 rounded-xl text-black bg-gradient-to-r from-[#00E5FF] via-[#E0F7FA] to-[#0097A7] font-bold tracking-[0.2em] uppercase text-[10px] transition-all shadow-lg hover:scale-[1.01] flex items-center justify-center gap-2"
                  >
                    {submitting ? 'ĐANG KHOÁ LỊCH...' : 'GỬI ĐĂNG KÝ PHÁC ĐỒ'}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-white/5 bg-[#050A1A] text-center text-xs text-white/30 font-mono tracking-widest uppercase relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span>© {new Date().getFullYear()} {businessInfo.name || "CLINIC CENTRE"}. ALL RIGHTS RESERVED.</span>
          <span className="text-[9px] text-[#00E5FF]/30">DESIGNED FOR HIGH-FIDELITY CLINICAL EXCELLENCE</span>
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
              className="relative w-full max-w-lg p-8 md:p-12 rounded-3xl border border-[#00E5FF]/30 bg-[#0A1128] overflow-hidden"
            >
              <button 
                onClick={() => setIsBookingModalOpen(false)}
                className="absolute top-6 right-6 text-white/40 hover:text-white p-2 rounded-full border border-white/10 hover:bg-white/5 transition-all"
              >
                <X size={16} />
              </button>

              <div className="space-y-6">
                <h3 className="text-2xl font-light text-[#00E5FF] tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {selectedService ? `Đặt Lịch: ${selectedService}` : 'Đặt Lịch Khám Cấp Cao'}
                </h3>
                <p className="text-white/50 text-xs font-light">Mời quý khách điền thông tin liên lạc dưới đây, trợ lý y khoa sẽ gọi điện xác nhận lịch hẹn chỉ trong ít phút.</p>

                {success ? (
                  <div className="text-center py-8 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-[#00E5FF]/20 flex items-center justify-center mx-auto border border-[#00E5FF]/50 text-[#00E5FF] text-2xl">✓</div>
                    <h4 className="text-lg font-light">Đặt lịch thành công</h4>
                    <p className="text-xs text-white/50 max-w-xs mx-auto leading-relaxed">Trợ lý y khoa sẽ liên hệ trực tiếp với bạn ngay lập tức.</p>
                  </div>
                ) : (
                  <form onSubmit={handleBooking} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[8px] font-mono uppercase tracking-widest text-white/50 block">Họ và Tên Quý Khách</label>
                      <input 
                        type="text" 
                        required 
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Nguyễn Hoàng Vy" 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#00E5FF]/50 transition-all font-mono"
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
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#00E5FF]/50 transition-all font-mono"
                      />
                    </div>
                    <button 
                      type="submit" 
                      className="w-full py-4 rounded-xl text-black bg-gradient-to-r from-[#00E5FF] via-[#E0F7FA] to-[#0097A7] font-bold tracking-[0.2em] uppercase text-[10px] shadow-lg"
                    >
                      XÁC NHẬN ĐĂNG KÝ PHÁC ĐỒ
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
