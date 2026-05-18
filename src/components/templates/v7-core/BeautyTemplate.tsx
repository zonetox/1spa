'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { EditableText } from '@/components/shared/EditableText';
import { V7Booking } from './V7Booking';
import { LandingPageData } from './UniversalTemplate';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const BEAUTY_THEME  = '#C2185B';
const BEAUTY_GOLD   = '#D4AF37';
const BEAUTY_DARK   = '#1A0A12';
const BEAUTY_BG     = '#FFF8FB';

interface BeautyTemplateProps {
  data: LandingPageData;
  isEditing?: boolean;
  onUpdate?: (path: string, value: any) => void;
  businessInfo?: {
    id?: string;
    name?: string;
    logo_url?: string;
    hotline?: string;
    email_owner?: string;
  };
  defaults?: {
    heroTitle?: string;
    heroSubtitle?: string;
    aboutTitle?: string;
    aboutText?: string;
    themeColor?: string;
  };
  onImagePick?: (path: string, currentUrl: string) => void;
}

export function BeautyTemplate({
  data,
  isEditing = false,
  onUpdate = () => {},
  onImagePick,
  businessInfo = {},
  defaults = {},
}: BeautyTemplateProps) {
  const theme = defaults.themeColor || BEAUTY_THEME;

  const {
    hero_section = {},
    about_us = {},
    services_menu = [],
    expert_team = [],
    gallery = [],
    social_trust = {},
    contact_info = {},
  } = data;

  const brandName = businessInfo.name || 'BEAUTY';
  const brandLogo = businessInfo.logo_url;
  const phone     = businessInfo.hotline || '1900xxxx';

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const heroSlides = hero_section.hero_slides?.filter(Boolean).length
    ? hero_section.hero_slides!
    : [
        'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?q=80&w=1600',
        'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=1600',
        'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=1600',
      ];

  return (
    <div
      className="min-h-screen font-sans antialiased overflow-x-hidden"
      style={{ background: BEAUTY_BG, color: BEAUTY_DARK, '--theme-color': theme } as React.CSSProperties}
    >
      {/* ── HEADER ── */}
      <header
        className={`fixed top-0 left-0 w-full z-[1000] transition-all duration-500 ${scrolled ? 'py-3 shadow-lg' : 'py-5'}`}
        style={{
          background: scrolled ? 'rgba(26,10,18,0.96)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? `1px solid ${theme}50` : 'none',
        }}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          {brandLogo ? (
            <Image src={brandLogo} alt={brandName} width={160} height={48} className="h-10 w-auto object-contain" />
          ) : (
            <span className="font-serif text-2xl font-bold tracking-[0.12em] text-white">{brandName}</span>
          )}

          <nav className="hidden lg:flex items-center gap-8">
            {['Về chúng tôi', 'Công nghệ', 'Chuyên gia', 'Gallery', 'Đặt lịch'].map((label, i) => (
              <a
                key={i}
                href={`#${['about', 'services', 'artists', 'gallery', 'booking'][i]}`}
                className="text-[11px] uppercase tracking-[0.2em] font-bold relative group py-1 transition-colors text-white/70 hover:text-white"
              >
                {label}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] group-hover:w-full transition-all duration-300" style={{ backgroundColor: theme }} />
              </a>
            ))}
          </nav>

          <a
            href="#booking"
            className="px-6 py-2.5 rounded-full text-[11px] uppercase tracking-[0.2em] font-bold text-white transition-all hover:opacity-80"
            style={{ background: `linear-gradient(135deg, ${theme}, ${BEAUTY_GOLD})` }}
          >
            Tư vấn miễn phí
          </a>
        </div>
      </header>

      {/* ── HERO: Bold, High-contrast ── */}
      <section className="relative h-screen w-full flex items-center overflow-hidden bg-black">
        <Swiper
          modules={[Autoplay, EffectFade, Pagination]}
          effect="fade"
          speed={1800}
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          className="absolute inset-0 w-full h-full"
        >
          {heroSlides.map((slide, i) => (
            <SwiperSlide key={i}>
              <div className="absolute inset-0 z-10" style={{ background: `linear-gradient(135deg, ${BEAUTY_DARK}CC 0%, ${BEAUTY_DARK}88 60%, transparent 100%)` }} />
              <motion.div initial={{ scale: 1.06 }} animate={{ scale: 1 }} transition={{ duration: 10, ease: 'linear' }} className="w-full h-full">
                <Image src={slide} alt="Beauty" fill className="object-cover opacity-70" />
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Left-aligned hero content — editorial style */}
        <div className="container mx-auto px-6 relative z-20 max-w-5xl">
          <motion.div initial={{ opacity: 0, x: -60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1.2, ease: 'easeOut' }}>
            <span className="inline-block px-4 py-1.5 mb-6 text-[10px] uppercase tracking-[0.4em] font-bold rounded-full border" style={{ color: BEAUTY_GOLD, borderColor: `${BEAUTY_GOLD}50` }}>
              Thẩm Mỹ Đẳng Cấp
            </span>
            <h1 className="font-serif text-6xl md:text-8xl font-bold text-white mb-6 leading-[1.05]">
              <EditableText
                value={hero_section.hero_title || defaults.heroTitle || 'Đánh Thức\nVẻ Đẹp Tiềm Ẩn'}
                isEditing={isEditing}
                onChange={(v) => onUpdate('hero_section.hero_title', v)}
                className="font-serif font-bold"
              />
            </h1>
            <p className="text-white/70 text-lg md:text-xl mb-10 max-w-xl leading-relaxed">
              <EditableText
                value={hero_section.hero_subtitle || defaults.heroSubtitle || 'Công nghệ tiên tiến · Kết quả vượt kỳ vọng · Đội ngũ chuyên gia hàng đầu'}
                isEditing={isEditing}
                onChange={(v) => onUpdate('hero_section.hero_subtitle', v)}
                className="font-sans"
              />
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#booking"
                className="px-10 py-4 rounded-full text-xs uppercase tracking-[0.25em] font-bold text-white transition-all hover:-translate-y-1 hover:shadow-2xl"
                style={{ background: `linear-gradient(135deg, ${theme}, ${BEAUTY_GOLD})` }}
              >
                Đăng ký tư vấn miễn phí
              </a>
              <a href="#services" className="px-10 py-4 rounded-full text-xs uppercase tracking-[0.25em] font-bold text-white border border-white/30 hover:bg-white/10 transition-all">
                Xem công nghệ
              </a>
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-0 w-full h-28 bg-gradient-to-t from-[#FFF8FB] to-transparent z-20" />
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="py-28" style={{ background: BEAUTY_BG }}>
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9 }}>
              <span className="text-[11px] uppercase tracking-[0.4em] font-bold block mb-5" style={{ color: theme }}>Sứ Mệnh · Đột Phá · Kết Quả</span>
              <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6 leading-tight" style={{ color: BEAUTY_DARK }}>
                <EditableText
                  value={about_us.section_title || defaults.aboutTitle || 'Chúng Tôi Tôn Vinh Vẻ Đẹp Của Bạn'}
                  isEditing={isEditing}
                  onChange={(v) => onUpdate('about_us.section_title', v)}
                  className="font-serif font-bold"
                />
              </h2>
              <div className="w-16 h-[3px] rounded-full mb-8" style={{ background: `linear-gradient(90deg, ${theme}, ${BEAUTY_GOLD})` }} />
              <div className="text-base leading-loose mb-10 border-l-4 pl-6" style={{ borderColor: theme, color: '#6B3A52' }}>
                <EditableText
                  value={about_us.intro_text || defaults.aboutText || 'Với công nghệ thẩm mỹ tiên tiến và đội ngũ chuyên gia được đào tạo bài bản, chúng tôi mang đến kết quả vượt mong đợi cho từng khách hàng.'}
                  isEditing={isEditing}
                  onChange={(v) => onUpdate('about_us.intro_text', v)}
                  multiline className="font-sans"
                />
              </div>
              <div className="grid grid-cols-3 gap-6 mb-10">
                {[
                  { num: about_us.experience_years || '8+', label: 'Năm kinh nghiệm' },
                  { num: social_trust.rating_count || '500+', label: 'Khách hàng' },
                  { num: '99%', label: 'Hài lòng' },
                ].map((item, i) => (
                  <div key={i} className="text-center p-4 rounded-2xl" style={{ background: `${theme}0D` }}>
                    <div className="font-serif text-3xl font-bold" style={{ color: theme }}>{item.num}</div>
                    <div className="text-[11px] uppercase tracking-[0.1em] mt-1" style={{ color: '#9A4A6E' }}>{item.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.2 }} className="relative h-[520px]">
              <div className="absolute top-0 right-0 w-[75%] h-[80%] rounded-2xl overflow-hidden shadow-2xl" onClick={() => isEditing && onImagePick?.('about_us.about_image_1', about_us.about_image_1 ?? '')}>
                <Image src={about_us.about_image_1 || 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?q=80&w=800'} alt="Beauty" fill className="object-cover hover:scale-105 transition-transform duration-[2s] cursor-pointer" />
              </div>
              <div className="absolute bottom-0 left-0 w-[52%] h-[52%] rounded-2xl overflow-hidden shadow-xl border-8" style={{ borderColor: BEAUTY_BG }} onClick={() => isEditing && onImagePick?.('about_us.about_image_2', about_us.about_image_2 ?? '')}>
                <Image src={about_us.about_image_2 || 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?q=80&w=800'} alt="Beauty detail" fill className="object-cover hover:scale-105 transition-transform duration-[2s] cursor-pointer" />
              </div>
              {/* Decorative badge */}
              <div className="absolute -bottom-4 -right-4 px-5 py-3 rounded-2xl shadow-xl z-10" style={{ background: `linear-gradient(135deg, ${theme}, ${BEAUTY_GOLD})` }}>
                <p className="text-white text-[9px] uppercase tracking-[0.25em] font-bold">Công nghệ</p>
                <p className="text-white font-serif text-lg font-bold">Hàng đầu</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── SERVICES (Công nghệ & Phương pháp) ── */}
      <section id="services" className="py-28" style={{ background: BEAUTY_DARK }}>
        <div className="container mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-20">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <span className="text-[11px] uppercase tracking-[0.4em] font-bold block mb-4" style={{ color: BEAUTY_GOLD }}>Dịch Vụ Chuyên Sâu</span>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-5">Công Nghệ &amp; Phương Pháp</h2>
              <div className="w-12 h-px mx-auto" style={{ background: `linear-gradient(90deg, ${theme}, ${BEAUTY_GOLD})` }} />
            </motion.div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services_menu.map((svc, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.08, duration: 0.7 }}
                className="group relative rounded-2xl overflow-hidden cursor-pointer"
              >
                <div className="aspect-[3/2] relative overflow-hidden">
                  <Image src={svc.img || 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=800'} alt={svc.name} fill className="object-cover group-hover:scale-110 transition-transform duration-[1.5s]" />
                  <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${BEAUTY_DARK}EE 0%, transparent 60%)` }} />
                  {svc.tagline && (
                    <span className="absolute top-4 right-4 text-[9px] uppercase tracking-[0.2em] px-3 py-1 rounded-full font-bold" style={{ background: `${BEAUTY_GOLD}`, color: BEAUTY_DARK }}>{svc.tagline}</span>
                  )}
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-serif text-lg font-bold text-white mb-2">{svc.name}</h3>
                  <p className="text-white/60 text-sm line-clamp-2 mb-4">{svc.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold" style={{ color: BEAUTY_GOLD }}>{svc.price || 'Liên hệ'}</span>
                    <a href="#booking" className="text-[10px] uppercase tracking-[0.2em] font-bold px-4 py-1.5 rounded-full border border-white/20 text-white hover:bg-white/10 transition-all">Đặt lịch</a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ARTISTS (Experts) ── */}
      {expert_team.length > 0 && (
        <section id="artists" className="py-28" style={{ background: BEAUTY_BG }}>
          <div className="container mx-auto px-6">
            <div className="text-center mb-20">
              <span className="text-[11px] uppercase tracking-[0.4em] font-bold block mb-4" style={{ color: theme }}>Đội Ngũ Chuyên Gia</span>
              <h2 className="font-serif text-4xl md:text-5xl font-bold" style={{ color: BEAUTY_DARK }}>Beauty Artist</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {expert_team.map((m, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="group rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-700"
                  style={{ background: `${theme}08` }}
                >
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <Image src={m.img || 'https://i.imgur.com/oIeQ21A.png'} alt={m.name} fill className="object-cover group-hover:scale-110 transition-transform duration-[1.2s]" />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `${theme}30` }} />
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="font-serif text-xl font-bold mb-1" style={{ color: BEAUTY_DARK }}>{m.name}</h3>
                    <p className="text-[11px] uppercase tracking-[0.25em] font-bold mb-3" style={{ color: theme }}>Chuyên gia thẩm mỹ</p>
                    <p className="text-sm italic leading-relaxed" style={{ color: '#9A4A6E' }}>{m.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── GALLERY ── */}
      {gallery.length > 0 && (
        <section id="gallery" className="py-24" style={{ background: '#F5EFF4' }}>
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <span className="text-[11px] uppercase tracking-[0.4em] font-bold block mb-4" style={{ color: theme }}>Kết Quả Thực Tế</span>
              <h2 className="font-serif text-4xl font-bold" style={{ color: BEAUTY_DARK }}>Before &amp; After Gallery</h2>
            </div>
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
              {gallery.map((g: any, i: number) => (
                <motion.div key={i} whileHover={{ y: -4 }} className="break-inside-avoid relative group overflow-hidden rounded-2xl shadow-md">
                  <Image src={g.url || g.img} alt={g.caption || ''} width={600} height={400} className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-[1.2s]" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center" style={{ background: `${theme}80` }}>
                    <span className="text-white text-[10px] uppercase tracking-[0.25em] font-bold border border-white/40 px-4 py-2 rounded-full">Xem ảnh</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── BOOKING ── */}
      <V7Booking
        title={data.reservation_section?.title || 'Đăng Ký Tư Vấn Miễn Phí'}
        subtitle={data.reservation_section?.subtitle || 'Chuyên gia của chúng tôi sẵn sàng tư vấn giải pháp làm đẹp phù hợp nhất cho bạn.'}
        badge={data.reservation_section?.badge || 'Miễn phí tư vấn'}
        bgImage={about_us.about_image_1}
        themeColor={theme}
        businessId={businessInfo.id}
        businessName={brandName}
        businessEmail={businessInfo.email_owner || contact_info.email}
      />

      {/* ── FOOTER ── */}
      <footer id="contact" className="py-16 border-t" style={{ background: BEAUTY_DARK, borderColor: `${theme}30` }}>
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-12 mb-12 border-b" style={{ borderColor: `${theme}20` }}>
            <div>
              {brandLogo
                ? <Image src={brandLogo} alt={brandName} width={140} height={44} className="h-10 w-auto mb-5 object-contain" />
                : <h3 className="font-serif text-2xl font-bold mb-5 text-white">{brandName}</h3>}
              <p className="text-sm leading-relaxed text-white/50">Nơi công nghệ làm đẹp gặp gỡ nghệ thuật chăm sóc da chuyên sâu.</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] mb-4 font-bold" style={{ color: BEAUTY_GOLD }}>Địa chỉ</p>
              <p className="text-sm font-medium mb-6 text-white">{contact_info.address_full || brandName}</p>
              <p className="text-[10px] uppercase tracking-[0.3em] mb-2 font-bold" style={{ color: BEAUTY_GOLD }}>Hotline</p>
              <a href={`tel:${phone}`} className="text-xl font-bold font-serif" style={{ color: theme }}>{phone}</a>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] mb-4 font-bold" style={{ color: BEAUTY_GOLD }}>Giờ làm việc</p>
              <div className="space-y-2 text-sm text-white/70">
                <div className="flex justify-between"><span>Thứ 2 – Thứ 7</span><span className="font-bold text-white">08:00 – 20:00</span></div>
                <div className="flex justify-between"><span>Chủ Nhật</span><span className="font-bold text-white">09:00 – 17:00</span></div>
              </div>
            </div>
          </div>
          <p className="text-center text-[11px] text-white/30">© {new Date().getFullYear()} {brandName}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
