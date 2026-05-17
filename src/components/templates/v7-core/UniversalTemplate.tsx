'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { EditableText } from '@/components/shared/EditableText';

// Style imports
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

export interface LandingPageData {
  hero_section?: {
    hero_title?: string;
    hero_subtitle?: string;
    hero_slides?: string[];
  };
  about_us?: {
    section_title?: string;
    intro_text?: string;
    experience_years?: number | string;
    about_image_1?: string;
    about_image_2?: string;
  };
  services_menu?: any[];
  expert_team?: any[];
  gallery?: any[];
  social_trust?: {
    rating_count?: number;
    testimonials?: any[];
  };
  contact_info?: {
    address_full?: string;
    hotline?: string;
    email?: string;
    operating_hours?: string;
    social_links?: { platform: string; url: string }[];
    map_embed_url?: string;
  };
  reservation_section?: {
    title?: string;
    subtitle?: string;
    badge?: string;
  };
  services_section?: {
    title?: string;
    subtitle?: string;
  };
  theme_color?: string;
}

interface UniversalTemplateProps {
  data: LandingPageData;
  isEditing?: boolean;
  onUpdate?: (path: string, value: any) => void;
  businessInfo?: {
    name?: string;
    logo_url?: string;
    address_full?: string;
    hotline?: string;
    email_owner?: string;
    map_embed_url?: string;
  };
  defaults?: {
    heroTitle?: string;
    heroSubtitle?: string;
    aboutTitle?: string;
    aboutText?: string;
    themeColor?: string;
  };
  onImagePick?: (path: string, currentUrl: string) => void;
  // Editor-specific optional props for section management
  hiddenSections?: string[];
  sectionOrder?: string[];
  activeSection?: string | null;
  onSectionClick?: (section: string) => void;
}

/**
 * ============================================================
 * THE ULTIMATE MONOLITHIC "ROYAL BRIGHT" ARCHITECTURE V8
 * Rebuilt 100% From Scratch Following UI Style Guide.
 * Zero Patchwork. Pure Integrated High-End Engineering.
 * ============================================================
 */
export function UniversalTemplate({ 
  data, 
  isEditing = false, 
  onUpdate = () => {},
  onImagePick,
  businessInfo = {},
  defaults = {}
}: UniversalTemplateProps) {
  
  // Destructure Data safely with fallbacks
  const {
    hero_section = {},
    about_us = {},
    services_menu = [],
    expert_team = [],
    gallery = [],
    social_trust = {},
    contact_info = {},
    theme_color = defaults.themeColor || '#D4AF37'
  } = data;

  const brandName = businessInfo.name || 'LUXURY BRAND';
  const brandLogo = businessInfo.logo_url;
  const contactAddress = businessInfo.address_full || 'Đang cập nhật';
  const contactPhone = businessInfo.hotline || '1900xxxx';

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div
        className="min-h-screen bg-white text-[#2F2F2F] font-sans selection:bg-[#D4AF37]/20 antialiased w-full overflow-x-hidden"
        style={{ '--theme-color': theme_color } as React.CSSProperties}
      >
        {/* 1. STICKY ROYAL HEADER */}
        <header 
          className={`fixed top-0 left-0 w-full z-[1000] transition-all duration-500 ${
            scrolled ? 'bg-white/98 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-6'
          }`}
          style={scrolled ? { borderBottom: `2px solid ${theme_color}` } : {}}
        >
          <div className="container mx-auto px-6 flex justify-between items-center">
            {/* Brand Identity */}
            <div className="flex items-center gap-4 cursor-pointer">
              {brandLogo ? (
                <Image width={800} height={800} src={brandLogo}   alt={brandName} className="h-10 md:h-12 w-auto object-contain transition-all drop-shadow-sm"  />
              ) : (
                <span className="text-xl md:text-2xl font-playfair font-bold tracking-widest text-[#1A1A1A]">
                  {brandName.toUpperCase()}
                </span>
              )}
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {['Về chúng tôi', 'Dịch vụ', 'Chuyên gia', 'Thư viện', 'Liên hệ'].map((item, idx) => (
                <a 
                  key={idx} 
                  href={`#${['about', 'services', 'team', 'gallery', 'contact'][idx]}`}
                  className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A] relative group py-2 transition-colors"
                >
                  {item}
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] transition-all duration-300 group-hover:w-full" style={{ backgroundColor: theme_color }} />
                </a>
              ))}
            </nav>

            {/* Call to Action Button */}
            <a 
              href="#booking"
              className="relative inline-flex items-center justify-center px-6 py-2.5 text-[11px] font-bold tracking-[0.2em] uppercase text-white rounded-full overflow-hidden transition-transform duration-300 hover:scale-105 btn-shine-effect shadow-lg shadow-black/10"
              style={{ backgroundColor: theme_color }}
            >
              Đặt lịch hẹn
            </a>
          </div>
        </header>

        {/* 2. DIGITAL LUXURY GALLERY HERO */}
        <section className="relative h-[90vh] md:h-screen w-full flex items-center overflow-hidden bg-white">
          <Swiper
            modules={[Autoplay, EffectFade, Pagination]}
            effect="fade"
            speed={2000}
            autoplay={{ delay: 7000, disableOnInteraction: false }}
            pagination={{ 
              clickable: true,
              renderBullet: (index, className) => `<span class="${className} !bg-white !opacity-50 hover:!opacity-100 transition-all duration-300"></span>`
            }}
            className="absolute inset-0 w-full h-full"
          >
            {(hero_section.hero_slides?.length ? hero_section.hero_slides : [
              'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&q=80',
              'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&q=80'
            ]).map((slide, i) => (
              <SwiperSlide key={i} className="w-full h-full relative">
                {/* VIBRANT THEME COLOR OVERLAY - NO BLACK */}
                <div className="absolute inset-0 z-10" style={{ background: `linear-gradient(to bottom, ${theme_color}30, ${theme_color}70)` }} />
                <motion.div 
                  initial={{ scale: 1.1 }} 
                  animate={{ scale: 1 }} 
                  transition={{ duration: 12, ease: "linear" }}
                  className="w-full h-full"
                >
                  <Image width={800} height={800} src={slide}   alt="Slide" className="w-full h-full object-cover brightness-100"  />
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="container mx-auto px-6 relative z-20 text-center max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            >
              <span className="inline-block px-5 py-1.5 mb-8 rounded-full border border-white/30 backdrop-blur-md text-[10px] font-bold uppercase tracking-[0.3em] text-white" style={{ background: `${theme_color}20` }}>
                The Royal Concept
              </span>
              <h1 className="text-4xl md:text-7xl font-playfair font-bold text-white mb-6 leading-[1.2] text-royal-shadow">
                <EditableText
                  value={hero_section.hero_title || defaults.heroTitle || "Khát Vọng Tuyệt Mỹ"}
                  isEditing={isEditing}
                  onChange={(val) => onUpdate('hero_section.hero_title', val)}
                  className="text-center font-playfair font-bold"
                />
              </h1>
              <p className="text-base md:text-xl font-normal text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed tracking-wide">
                <EditableText
                  value={hero_section.hero_subtitle || defaults.heroSubtitle || "Khám phá không gian làm đẹp tối thượng bậc nhất."}
                  isEditing={isEditing}
                  onChange={(val) => onUpdate('hero_section.hero_subtitle', val)}
                  className="text-center font-sans font-normal"
                />
              </p>
              
              <div className="flex flex-col sm:flex-row gap-5 items-center justify-center">
                <a 
                  href="#services"
                  className="relative w-full sm:w-auto px-10 py-4 text-xs font-bold uppercase tracking-[0.2em] text-black bg-white rounded-full shadow-2xl hover:shadow-white/20 transition-all duration-500 overflow-hidden btn-shine-effect hover:-translate-y-1.5"
                >
                  Trải nghiệm ngay
                </a>
                <a 
                  href={`tel:${contactPhone}`}
                  className="w-full sm:w-auto px-10 py-4 text-xs font-bold uppercase tracking-[0.2em] text-white border-2 border-white/40 backdrop-blur-md rounded-full hover:bg-white/10 transition-all duration-300"
                >
                  Hotline: {contactPhone}
                </a>
              </div>
            </motion.div>
          </div>

          {/* Subtle gradient blending overlay at bottom to avoid hard crop */}
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent z-20" />
        </section>

        {/* 3. VOGUE ASYMMETRIC ABOUT SECTION */}
        <section id="about" className="py-28 relative bg-white overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
              
              {/* Left side: Vogue overlapping image grid */}
              <div className="lg:col-span-6 relative h-[500px] md:h-[620px]">
                <motion.div 
                  initial={{ opacity: 0, x: -60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="absolute top-0 left-0 w-[80%] h-[85%] overflow-hidden rounded-2xl shadow-[0_40px_60px_-15px_rgba(0,0,0,0.15)] border-8 border-white z-10"
                >
                  <img 
                    src={about_us.about_image_1 || "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80"} 
                    className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-[2s]" 
                    alt="Visual branding"
                    onClick={() => isEditing && onImagePick && onImagePick('about_us.about_image_1', about_us.about_image_1 ?? '')}
                  />
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 80 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="absolute bottom-0 right-0 w-[58%] h-[60%] overflow-hidden rounded-2xl shadow-[0_30px_50px_-10px_rgba(0,0,0,0.2)] border-[12px] border-white z-20"
                >
                  <img 
                    src={about_us.about_image_2 || "https://images.unsplash.com/photo-1544161515-4af6b1d46af0?auto=format&fit=crop&q=80"} 
                    className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-[2s]" 
                    alt="Detail visual"
                    onClick={() => isEditing && onImagePick && onImagePick('about_us.about_image_2', about_us.about_image_2 ?? '')}
                  />
                </motion.div>

                {/* Premium experience stamp */}
                <div 
                  className="absolute -top-8 -right-4 z-30 w-36 h-36 rounded-full flex flex-col items-center justify-center text-white shadow-2xl"
                  style={{ backgroundColor: theme_color }}
                >
                  <span className="text-4xl font-playfair font-bold leading-none">{about_us.experience_years || '15'}</span>
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] mt-2 text-center">Năm Uy Tín</span>
                </div>
              </div>

              {/* Right side content */}
              <div className="lg:col-span-6">
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  <span className="text-[12px] font-bold uppercase tracking-[0.4em] mb-5 block" style={{ color: theme_color }}>Di Sản & Sứ Mệnh</span>
                  <h2 className="text-4xl md:text-5xl font-playfair font-bold text-[#1A1A1A] mb-8 leading-tight">
                    <EditableText
                      value={about_us.section_title || defaults.aboutTitle || "Tâm Đức Gìn Giữ Nhan Sắc Việt"}
                      isEditing={isEditing}
                      onChange={(val) => onUpdate('about_us.section_title', val)}
                      className="font-playfair font-bold text-[#1A1A1A]"
                    />
                  </h2>
                  <div className="w-20 h-[4px] mb-10 rounded-full" style={{ backgroundColor: theme_color }} />
                  
                  <div className="text-[#4A4A4A] text-base md:text-lg leading-relaxed font-normal italic mb-12 border-l-4 pl-6" style={{ borderColor: theme_color }}>
                    "<EditableText
                      value={about_us.intro_text || defaults.aboutText || "Cam kết tôn vinh những giá trị cao quý của người phụ nữ hiện đại bằng sự tận tâm trọn vẹn nhất."}
                      isEditing={isEditing}
                      onChange={(val) => onUpdate('about_us.intro_text', val)}
                      multiline
                      className="font-sans"
                    />"
                  </div>

                  <a href="#booking" className="group inline-flex items-center gap-5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A] transition-all hover:opacity-80">
                    Đọc câu chuyện của chúng tôi
                    <div className="w-12 h-[2px] transition-all duration-500 group-hover:w-20" style={{ backgroundColor: theme_color }} />
                  </a>
                </motion.div>
              </div>

            </div>
          </div>
        </section>

        {/* 4. PREMIUM SERVICES GRID - DEEP DEPTH */}
        <section id="services" className="py-28 bg-[#FDFBF7] relative overflow-hidden border-y border-[#EFE9DD]/30">
          <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-white to-transparent" />
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-20">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
                <span className="text-[11px] font-bold uppercase tracking-[0.4em] block mb-4" style={{ color: theme_color }}>Dịch Vụ Đặc Quyền</span>
                <h2 className="text-3xl md:text-5xl font-playfair font-bold text-[#1A1A1A] mb-6 tracking-tight">Tinh Hoa Trị Liệu</h2>
                <div className="w-16 h-[3px] mx-auto rounded-full" style={{ backgroundColor: theme_color }} />
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
              {services_menu.map((svc, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.6 }}
                  className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_35px_70px_-15px_rgba(0,0,0,0.12)] transition-all duration-700 transform hover:-translate-y-4"
                >
                  {/* Card Top Graphic */}
                  <div className="aspect-[4/3] w-full overflow-hidden relative bg-white border-b border-gray-50">
                    <Image width={800} height={800} src={svc.img || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80"}   
                      alt={svc.name} 
                      className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                     />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none" style={{ backgroundColor: `${theme_color}15` }} />
                    {svc.tagline && (
                      <div className="absolute top-5 left-5 bg-white/95 backdrop-blur text-[9px] font-bold px-3.5 py-1.5 rounded-full uppercase tracking-[0.1em] text-[#1A1A1A] shadow-lg">
                        {svc.tagline}
                      </div>
                    )}
                  </div>

                  {/* Card Text Body */}
                  <div className="p-8 flex flex-col flex-grow">
                    <h3 className="text-xl md:text-2xl font-playfair font-bold text-[#1A1A1A] mb-4 leading-tight transition-colors group-hover:text-black">
                      {svc.name}
                    </h3>
                    <p className="text-[#666666] text-sm leading-relaxed font-normal mb-8 line-clamp-3">
                      {svc.desc}
                    </p>

                    <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between">
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-1 block">Giá từ</span>
                        <span className="text-2xl font-sans font-bold text-[#1A1A1A]" style={{ color: theme_color }}>
                          {svc.price || "Liên hệ"}
                        </span>
                      </div>
                      <a href="#booking" className="w-11 h-11 rounded-full border flex items-center justify-center text-[#1A1A1A] transition-all duration-300 overflow-hidden relative group/btn"
                         style={{ borderColor: `${theme_color}40` }}
                      >
                        <div className="absolute inset-0 scale-0 group-hover/btn:scale-100 transition-transform duration-300 rounded-full" style={{ backgroundColor: theme_color }} />
                        <svg className="w-4 h-4 relative z-10 group-hover/btn:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. EXPERT TEAM - CLEAN MINIMAL */}
        <section id="team" className="py-28 bg-white">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6 border-b border-gray-100 pb-10">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.4em] block mb-4" style={{ color: theme_color }}>Đội Ngũ Hội Tụ</span>
                <h2 className="text-4xl md:text-5xl font-playfair font-bold text-[#1A1A1A] tracking-tight">Những Bàn Tay Vàng</h2>
              </div>
              <p className="text-gray-500 max-w-sm font-sans text-sm md:text-right leading-relaxed">
                Mỗi bác sĩ, chuyên gia của chúng tôi đều trải qua quá trình đào tạo khắt khe để mang lại sự hoàn hảo tuyệt đối cho khách hàng.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
              {expert_team.map((member, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 40 }} 
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="group text-center"
                >
                  <div className="relative w-64 h-64 mx-auto mb-8">
                    {/* Elegant ring wrapper on hover */}
                    <div 
                      className="absolute -inset-3 border border-transparent rounded-full transition-all duration-700 opacity-0 group-hover:opacity-100 group-hover:rotate-45"
                      style={{ borderColor: `${theme_color}60` }}
                    />
                    <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-xl ring-1 ring-black/[0.03]">
                      <Image width={800} height={800} src={member.img || "https://i.imgur.com/oIeQ21A.png"}   
                        alt={member.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                       />
                    </div>
                  </div>
                  <h3 className="text-2xl font-playfair font-bold text-[#1A1A1A] mb-2 tracking-tight">{member.name}</h3>
                  <p className="text-[11px] font-bold uppercase tracking-[0.3em] mb-4" style={{ color: theme_color }}>{member.role}</p>
                  <p className="text-[#666666] font-normal text-sm leading-relaxed italic max-w-xs mx-auto px-4">"{member.desc}"</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. VOGUE GALLERY MASONRY */}
        {gallery.length > 0 && (
          <section id="gallery" className="py-24 bg-[#F9F9F9]">
            <div className="container mx-auto px-6">
              <div className="text-center mb-16">
                <span className="text-[11px] font-bold uppercase tracking-[0.4em] block mb-4" style={{ color: theme_color }}>Khoảnh Khắc Thực Tế</span>
                <h2 className="text-3xl md:text-5xl font-playfair font-bold text-[#1A1A1A] tracking-tight mb-6">Gallery Triển Lãm</h2>
                <div className="w-16 h-[3px] mx-auto rounded-full" style={{ backgroundColor: theme_color }} />
              </div>

              <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                {gallery.map((g: any, i: number) => (
                  <motion.div 
                    key={i} 
                    whileHover={{ y: -5 }}
                    className="break-inside-avoid relative group overflow-hidden rounded-2xl shadow-md cursor-pointer"
                  >
                    <Image width={800} height={800} src={g.url || g.img}   alt={g.caption || "Gallery"} className="w-full h-auto object-cover transition-transform duration-[1.2s] group-hover:scale-105"  />
                    <div className="absolute inset-0 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center" style={{ backgroundColor: `${theme_color}90` }}>
                       <span className="text-white text-[10px] font-bold uppercase tracking-[0.3em] border border-white/30 px-5 py-2 rounded-full hover:bg-white hover:text-black transition-colors">
                         Phóng to
                       </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 7. ULTIMATE CONSOLIDATED CTA (BOOKING) */}
        <section id="booking" className="py-28 relative bg-white overflow-hidden">
          {/* Light texture elements background */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          
          <div className="container mx-auto px-6 relative z-10">
            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }} 
              whileInView={{ opacity: 1, scale: 1 }} 
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto bg-white rounded-[2rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border border-gray-100 p-12 md:p-24 text-center relative overflow-hidden"
            >
              {/* Thick top border design cue */}
              <div className="absolute top-0 left-0 w-full h-[8px]" style={{ backgroundColor: theme_color }} />
              
              <span className="inline-block px-6 py-2 mb-10 bg-gray-50 border border-gray-200 rounded-full text-[11px] font-bold uppercase tracking-[0.3em] text-[#1A1A1A]">
                {data.reservation_section?.badge || "Đặc quyền VIP"}
              </span>

              <h2 className="text-3xl md:text-6xl font-playfair font-bold text-[#1A1A1A] mb-10 leading-tight tracking-tight">
                {data.reservation_section?.title || "Chạm Đến Vẻ Đẹp Đẳng Cấp"}
              </h2>

              <p className="text-[#555555] text-base md:text-xl font-normal max-w-2xl mx-auto mb-16 leading-relaxed">
                {data.reservation_section?.subtitle || "Hành trình tái tạo năng lượng và đánh thức vẻ đẹp nguyên bản đang chờ đón bạn."}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 max-w-md mx-auto">
                <a 
                  href={`tel:${contactPhone}`}
                  className="w-full flex items-center justify-center gap-3 px-8 py-5 text-white font-bold text-sm uppercase tracking-[0.2em] rounded-full shadow-2xl transition-all hover:-translate-y-1 btn-shine-effect relative overflow-hidden"
                  style={{ backgroundColor: '#1A1A1A' }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                  Đặt lịch tư vấn
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 8. THE FINAL ROYAL FOOTER */}
        <footer id="contact" className="bg-white pt-24 pb-12 border-t border-gray-100">
          <div className="container mx-auto px-6">
            
            {/* Footer Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 pb-20">
              
              {/* Col 1: Brand Statement */}
              <div className="lg:col-span-4">
                <div className="mb-8">
                  {brandLogo ? (
                    <Image width={800} height={800} src={brandLogo}   alt={brandName} className="h-12 w-auto object-contain mb-6 grayscale hover:grayscale-0 transition-all"  />
                  ) : (
                    <h3 className="text-3xl font-playfair font-bold text-[#1A1A1A] tracking-wider mb-6 uppercase">{brandName}</h3>
                  )}
                  <p className="text-gray-500 text-sm font-normal leading-relaxed max-w-sm">
                    Biểu tượng của nghệ thuật làm đẹp đỉnh cao, nơi nuôi dưỡng nhan sắc và tái tạo năng lượng bền vững từ tâm.
                  </p>
                </div>
                
                {/* Minimalist Socials */}
                <div className="flex gap-5">
                  {['Faceb', 'Insta', 'Zalo'].map((icon, i) => (
                    <a 
                      key={i} 
                      href="#" 
                      className="group relative w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center transition-all hover:border-transparent"
                    >
                       <div className="absolute inset-0 scale-0 rounded-full group-hover:scale-100 transition-all duration-300" style={{ backgroundColor: theme_color }} />
                       <span className="text-[10px] font-bold uppercase text-[#1A1A1A] relative z-10 group-hover:text-white transition-colors">{icon.charAt(0)}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Col 2: Direct Navigation / Info */}
              <div className="lg:col-span-4 flex flex-col gap-10">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-4 block">Địa Chỉ Showroom</span>
                  <p className="text-[#1A1A1A] text-base font-bold tracking-tight leading-snug max-w-xs">{contactAddress}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-4 block">Hotline Đặc Quyền</span>
                  <a href={`tel:${contactPhone}`} className="text-2xl font-sans font-black transition-all" style={{ color: theme_color }}>
                    {contactPhone}
                  </a>
                </div>
              </div>

              {/* Col 3: Opening Hours stylized card */}
              <div className="lg:col-span-4 bg-[#FDFBF7] p-8 md:p-10 rounded-3xl shadow-sm border border-[#EFE9DD]/50">
                <span className="inline-block px-4 py-1 mb-8 border border-gray-200 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]">
                  Giờ Mở Cửa
                </span>
                <div className="space-y-4">
                  {contact_info.operating_hours ? (
                    contact_info.operating_hours.split('\n').map((line: string, i: number) => (
                      <div key={i} className="flex justify-between items-center border-b border-gray-200/40 pb-3 text-sm last:border-0">
                        <span className="text-gray-600">{line}</span>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="flex justify-between items-center border-b border-gray-200/40 pb-3 text-sm">
                        <span className="text-gray-600 font-medium">Thứ 2 - Thứ 7</span>
                        <span className="font-bold text-[#1A1A1A]">08:00 - 20:00</span>
                      </div>
                      <div className="flex justify-between items-center pb-1 text-sm">
                        <span className="text-gray-600 font-medium">Chủ Nhật</span>
                        <span className="font-bold text-[#1A1A1A]">09:00 - 18:00</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Legal strip */}
            <div className="pt-10 border-t border-gray-50 flex flex-col md:flex-row items-center justify-between gap-4 text-center">
              <p className="text-gray-400 text-[11px] font-normal tracking-wide">
                © Copyright {new Date().getFullYear()} {brandName}. All Rights Reserved.
              </p>
              <div className="flex gap-6 text-[11px] font-bold uppercase tracking-widest text-gray-400">
                <a href="#" className="hover:text-[#1A1A1A] transition-colors">Privacy</a>
                <a href="#" className="hover:text-[#1A1A1A] transition-colors">Terms</a>
              </div>
            </div>

          </div>
        </footer>

      </div>
    </>
  );
}
