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

// Spa palette: beige gold, sage, nude
const SPA_THEME = '#C9A050';
const SPA_BG    = '#FAF7F2';
const SPA_DARK  = '#3D3228';

interface SpaTemplateProps {
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

export function SpaTemplate({
  data,
  isEditing = false,
  onUpdate = () => {},
  onImagePick,
  businessInfo = {},
  defaults = {},
}: SpaTemplateProps) {
  const theme = defaults.themeColor || SPA_THEME;

  const {
    hero_section = {},
    about_us = {},
    services_menu = [],
    expert_team = [],
    gallery = [],
    social_trust = {},
    contact_info = {},
  } = data;

  const brandName  = businessInfo.name || 'SPA';
  const brandLogo  = businessInfo.logo_url;
  const phone      = businessInfo.hotline || '1900xxxx';

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const heroSlides = hero_section.hero_slides?.filter(Boolean).length
    ? hero_section.hero_slides!
    : [
        'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1519415510236-8559b1956a20?q=80&w=1600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1600334129128-685c5582fd35?q=80&w=1600&auto=format&fit=crop',
      ];

  return (
    <div
      className="min-h-screen font-sans antialiased overflow-x-hidden"
      style={{ background: SPA_BG, color: SPA_DARK, '--theme-color': theme } as React.CSSProperties}
    >
      {/* ── HEADER ── */}
      <header
        className={`fixed top-0 left-0 w-full z-[1000] transition-all duration-500 ${
          scrolled ? 'py-3 shadow-md' : 'py-6'
        }`}
        style={{
          background: scrolled ? 'rgba(250,247,242,0.97)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? `1px solid ${theme}40` : 'none',
        }}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          {brandLogo ? (
            <Image src={brandLogo} alt={brandName} width={160} height={48} className="h-10 w-auto object-contain" />
          ) : (
            <span className="font-serif text-xl font-bold tracking-[0.15em]" style={{ color: SPA_DARK }}>
              {brandName}
            </span>
          )}

          <nav className="hidden lg:flex items-center gap-8">
            {['Về chúng tôi', 'Liệu trình', 'Chuyên viên', 'Không gian', 'Đặt lịch'].map((label, i) => (
              <a
                key={i}
                href={`#${['about', 'rituals', 'therapists', 'gallery', 'booking'][i]}`}
                className="text-[11px] uppercase tracking-[0.2em] font-medium relative group py-1 transition-colors"
                style={{ color: SPA_DARK }}
              >
                {label}
                <span
                  className="absolute bottom-0 left-0 w-0 h-px group-hover:w-full transition-all duration-300"
                  style={{ backgroundColor: theme }}
                />
              </a>
            ))}
          </nav>

          <a
            href="#booking"
            className="px-6 py-2.5 rounded-full text-[11px] uppercase tracking-[0.2em] font-bold text-white transition-all hover:opacity-80"
            style={{ backgroundColor: theme }}
          >
            Đặt lịch thư giãn
          </a>
        </div>
      </header>

      {/* ── HERO: Fullscreen ambient ── */}
      <section className="relative h-screen w-full flex items-center overflow-hidden">
        <Swiper
          modules={[Autoplay, EffectFade, Pagination]}
          effect="fade"
          speed={2500}
          autoplay={{ delay: 8000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          className="absolute inset-0 w-full h-full"
        >
          {heroSlides.map((slide, i) => (
            <SwiperSlide key={i}>
              <div
                className="absolute inset-0 z-10"
                style={{ background: `linear-gradient(to bottom, ${SPA_DARK}55 0%, ${SPA_DARK}80 100%)` }}
              />
              <motion.div
                initial={{ scale: 1.08 }}
                animate={{ scale: 1 }}
                transition={{ duration: 14, ease: 'linear' }}
                className="w-full h-full"
              >
                <Image src={slide} alt="Spa" fill className="object-cover" />
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="container mx-auto px-6 relative z-20 text-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
          >
            <span
              className="inline-block px-5 py-1.5 mb-8 rounded-full text-[10px] uppercase tracking-[0.35em] font-medium text-white border border-white/25"
              style={{ background: `${theme}25` }}
            >
              ✦ Tĩnh Lặng · Tái Tạo · Chữa Lành ✦
            </span>
            <h1 className="font-serif text-5xl md:text-7xl font-bold text-white mb-6 leading-[1.15]">
              <EditableText
                value={hero_section.hero_title || defaults.heroTitle || 'Tìm Lại Sự Cân Bằng'}
                isEditing={isEditing}
                onChange={(v) => onUpdate('hero_section.hero_title', v)}
                className="text-center font-serif font-bold"
              />
            </h1>
            <p className="text-white/80 text-lg md:text-xl mb-12 leading-relaxed font-light italic">
              <EditableText
                value={hero_section.hero_subtitle || defaults.heroSubtitle || 'Nơi tâm hồn được nghỉ ngơi và sắc đẹp được nuôi dưỡng'}
                isEditing={isEditing}
                onChange={(v) => onUpdate('hero_section.hero_subtitle', v)}
                className="text-center"
              />
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#rituals"
                className="px-10 py-4 rounded-full text-xs uppercase tracking-[0.25em] font-bold text-white transition-all hover:-translate-y-1 hover:shadow-lg"
                style={{ backgroundColor: theme }}
              >
                Khám phá liệu trình
              </a>
              <a
                href={`tel:${phone}`}
                className="px-10 py-4 rounded-full text-xs uppercase tracking-[0.25em] font-bold text-white border border-white/40 hover:bg-white/10 transition-all"
              >
                {phone}
              </a>
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-[#FAF7F2] to-transparent z-20" />
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="py-28" style={{ background: SPA_BG }}>
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            {/* Images */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
              className="relative h-[520px]"
            >
              <div
                className="absolute top-0 left-0 w-[75%] h-[80%] rounded-2xl overflow-hidden shadow-2xl"
                onClick={() => isEditing && onImagePick?.('about_us.about_image_1', about_us.about_image_1 ?? '')}
              >
                <Image
                  src={about_us.about_image_1 || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800'}
                  alt="Spa interior"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-[2s] cursor-pointer"
                />
              </div>
              <div
                className="absolute bottom-0 right-0 w-[58%] h-[58%] rounded-2xl overflow-hidden shadow-xl border-8"
                style={{ borderColor: SPA_BG }}
                onClick={() => isEditing && onImagePick?.('about_us.about_image_2', about_us.about_image_2 ?? '')}
              >
                <Image
                  src={about_us.about_image_2 || 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?q=80&w=800'}
                  alt="Spa treatment"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-[2s] cursor-pointer"
                />
              </div>
              {/* Experience badge */}
              <div
                className="absolute -top-6 right-4 w-32 h-32 rounded-full flex flex-col items-center justify-center text-white shadow-xl z-10"
                style={{ backgroundColor: theme }}
              >
                <span className="font-serif text-3xl font-bold leading-none">{about_us.experience_years || '10'}+</span>
                <span className="text-[9px] uppercase tracking-[0.2em] mt-1 text-center">Năm chữa lành</span>
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.2 }}
            >
              <span className="text-[11px] uppercase tracking-[0.4em] font-bold block mb-5" style={{ color: theme }}>
                Triết lý · Di sản · Tâm hồn
              </span>
              <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6 leading-tight" style={{ color: SPA_DARK }}>
                <EditableText
                  value={about_us.section_title || defaults.aboutTitle || 'Nghệ Thuật Tái Tạo Năng Lượng'}
                  isEditing={isEditing}
                  onChange={(v) => onUpdate('about_us.section_title', v)}
                  className="font-serif font-bold"
                />
              </h2>
              <div className="w-16 h-[3px] rounded-full mb-8" style={{ backgroundColor: theme }} />
              <div className="text-base leading-loose mb-10 italic border-l-4 pl-6" style={{ borderColor: `${theme}60`, color: '#6B5B4E' }}>
                <EditableText
                  value={about_us.intro_text || defaults.aboutText || 'Chúng tôi tin rằng sự tĩnh lặng là nền tảng của mọi vẻ đẹp bền vững. Mỗi liệu trình được thiết kế để dẫn đường bạn về với bản thân.'}
                  isEditing={isEditing}
                  onChange={(v) => onUpdate('about_us.intro_text', v)}
                  multiline
                  className="font-sans"
                />
              </div>
              {/* Trust signals */}
              <div className="grid grid-cols-3 gap-6 mb-10">
                {[
                  { num: '5★', label: 'Chất lượng' },
                  { num: '100%', label: 'Thiên nhiên' },
                  { num: social_trust.rating_count || 200, label: 'Khách tin tưởng' },
                ].map((item, i) => (
                  <div key={i} className="text-center">
                    <div className="font-serif text-2xl font-bold" style={{ color: theme }}>{item.num}</div>
                    <div className="text-[11px] uppercase tracking-[0.15em] mt-1" style={{ color: '#9A8B7E' }}>{item.label}</div>
                  </div>
                ))}
              </div>
              <a href="#booking" className="group inline-flex items-center gap-4 text-[11px] uppercase tracking-[0.25em] font-bold transition-opacity hover:opacity-70" style={{ color: SPA_DARK }}>
                Đặt lịch thư giãn
                <div className="w-10 h-px group-hover:w-16 transition-all duration-400" style={{ backgroundColor: theme }} />
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── RITUALS (Services) ── */}
      <section id="rituals" className="py-28" style={{ background: '#F3EDE4' }}>
        <div className="container mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-20">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <span className="text-[11px] uppercase tracking-[0.4em] font-bold block mb-4" style={{ color: theme }}>
                Liệu Trình Đặc Quyền
              </span>
              <h2 className="font-serif text-4xl md:text-5xl font-bold mb-5" style={{ color: SPA_DARK }}>
                Ritual &amp; Chữa Lành
              </h2>
              <div className="w-12 h-px mx-auto" style={{ backgroundColor: theme }} />
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services_menu.map((svc, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08, duration: 0.7 }}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-700 hover:-translate-y-3"
              >
                <div className="aspect-[3/2] relative overflow-hidden">
                  <Image
                    src={svc.img || 'https://images.unsplash.com/photo-1544161515-4af6b1d46af0?q=80&w=800'}
                    alt={svc.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-[1.5s]"
                  />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `${theme}20` }} />
                  {svc.tagline && (
                    <span className="absolute top-4 left-4 bg-white/90 text-[9px] uppercase tracking-[0.15em] px-3 py-1 rounded-full font-bold" style={{ color: theme }}>
                      {svc.tagline}
                    </span>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-xl font-bold mb-3" style={{ color: SPA_DARK }}>{svc.name}</h3>
                  <p className="text-sm leading-relaxed mb-5 line-clamp-3" style={{ color: '#8A7B72' }}>{svc.desc}</p>
                  <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: '#EDE7DF' }}>
                    <span className="font-bold text-lg" style={{ color: theme }}>{svc.price || 'Liên hệ'}</span>
                    <a
                      href="#booking"
                      className="px-4 py-2 rounded-full text-[10px] uppercase tracking-[0.15em] font-bold text-white transition-all hover:opacity-80"
                      style={{ backgroundColor: theme }}
                    >
                      Đặt lịch
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THERAPISTS (Expert Team) ── */}
      {expert_team.length > 0 && (
        <section id="therapists" className="py-28" style={{ background: SPA_BG }}>
          <div className="container mx-auto px-6">
            <div className="text-center mb-20">
              <span className="text-[11px] uppercase tracking-[0.4em] font-bold block mb-4" style={{ color: theme }}>Đội Ngũ Trị Liệu</span>
              <h2 className="font-serif text-4xl md:text-5xl font-bold" style={{ color: SPA_DARK }}>Chuyên Viên Chữa Lành</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
              {expert_team.map((m, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6 }} className="text-center group">
                  <div className="relative w-52 h-52 mx-auto mb-6">
                    <div className="absolute -inset-2 rounded-full border border-transparent group-hover:border-[var(--theme-color)] opacity-0 group-hover:opacity-60 transition-all duration-700" />
                    <div className="w-full h-full rounded-full overflow-hidden shadow-lg">
                      <Image src={m.img || 'https://i.imgur.com/oIeQ21A.png'} alt={m.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                    </div>
                  </div>
                  <h3 className="font-serif text-xl font-bold mb-1" style={{ color: SPA_DARK }}>{m.name}</h3>
                  <p className="text-[11px] uppercase tracking-[0.25em] mb-3 font-medium" style={{ color: theme }}>Chuyên viên trị liệu</p>
                  <p className="text-sm italic leading-relaxed" style={{ color: '#8A7B72' }}>{m.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── GALLERY ── */}
      {gallery.length > 0 && (
        <section id="gallery" className="py-24" style={{ background: '#EDE7DF' }}>
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <span className="text-[11px] uppercase tracking-[0.4em] font-bold block mb-4" style={{ color: theme }}>Không Gian Tĩnh Lặng</span>
              <h2 className="font-serif text-4xl font-bold" style={{ color: SPA_DARK }}>Thư Viện Hình Ảnh</h2>
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

      {/* ── TESTIMONIALS ── */}
      {social_trust.testimonials && social_trust.testimonials.length > 0 && (
        <section className="py-28" style={{ background: '#F3EDE4' }}>
          <div className="container mx-auto px-6">
            <div className="text-center mb-20">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <span className="text-[11px] uppercase tracking-[0.4em] font-bold block mb-4" style={{ color: theme }}>Cảm Nhận Khách Hàng</span>
                <h2 className="font-serif text-4xl md:text-5xl font-bold" style={{ color: SPA_DARK }}>Họ Nói Gì Về Chúng Tôi</h2>
                <div className="w-12 h-px mx-auto mt-6" style={{ backgroundColor: theme }} />
              </motion.div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {social_trust.testimonials.map((t: any, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.7 }}
                  className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-500 relative"
                >
                  {/* Quote mark */}
                  <span className="absolute top-6 right-8 font-serif text-7xl leading-none opacity-10" style={{ color: theme }}>"</span>
                  {/* Stars */}
                  <div className="flex gap-1 mb-5">
                    {[...Array(t.rating || 5)].map((_: any, s: number) => (
                      <span key={s} className="text-yellow-400 text-lg">★</span>
                    ))}
                  </div>
                  <p className="text-base leading-relaxed italic mb-6 relative z-10" style={{ color: '#6B5B4E' }}>"{t.comment || t.text || t.content}"</p>
                  <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: '#EDE7DF' }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: theme }}>
                      {(t.author || t.name || 'K')[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-sm" style={{ color: SPA_DARK }}>{t.author || t.name || 'Khách hàng'}</p>
                      <p className="text-[11px] uppercase tracking-[0.1em]" style={{ color: '#9A8B7E' }}>{t.date || 'Khách hàng thân thiết'}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            {/* Overall rating */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-16 text-center"
            >
              <div className="inline-flex items-center gap-4 px-8 py-4 rounded-2xl" style={{ background: `${theme}15`, border: `1px solid ${theme}30` }}>
                <span className="font-serif text-4xl font-bold" style={{ color: theme }}>5.0</span>
                <div className="text-left">
                  <div className="text-yellow-400 text-xl">★★★★★</div>
                  <p className="text-[11px] uppercase tracking-[0.2em] font-bold" style={{ color: SPA_DARK }}>{social_trust.rating_count || 200}+ đánh giá từ khách hàng</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ── BOOKING ── */}
      <V7Booking
        title={data.reservation_section?.title || 'Đặt Lịch Thư Giãn'}
        subtitle={data.reservation_section?.subtitle || 'Hành trình tái tạo tâm hồn đang chờ đón bạn. Liên hệ với chúng tôi ngay hôm nay.'}
        badge={data.reservation_section?.badge || 'Tư vấn miễn phí'}
        bgImage={about_us.about_image_1}
        themeColor={theme}
        businessId={businessInfo.id}
        businessName={brandName}
        businessEmail={businessInfo.email_owner || contact_info.email}
      />

      {/* ── FOOTER ── */}
      <footer id="contact" className="py-16 border-t" style={{ background: SPA_BG, borderColor: `${theme}30` }}>
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-12 mb-12 border-b" style={{ borderColor: `${theme}20` }}>
            <div>
              {brandLogo
                ? <Image src={brandLogo} alt={brandName} width={140} height={44} className="h-10 w-auto mb-5 object-contain" />
                : <h3 className="font-serif text-2xl font-bold mb-5" style={{ color: SPA_DARK }}>{brandName}</h3>}
              <p className="text-sm leading-relaxed" style={{ color: '#9A8B7E' }}>
                Nơi tâm hồn tìm thấy sự tĩnh lặng và vẻ đẹp được chữa lành từ bên trong.
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] mb-4 font-bold" style={{ color: theme }}>Địa chỉ</p>
              <p className="text-sm font-medium mb-6" style={{ color: SPA_DARK }}>{contact_info.address_full || businessInfo.name || 'Đang cập nhật'}</p>
              <p className="text-[10px] uppercase tracking-[0.3em] mb-2 font-bold" style={{ color: theme }}>Hotline</p>
              <a href={`tel:${phone}`} className="text-xl font-bold font-serif" style={{ color: theme }}>{phone}</a>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] mb-4 font-bold" style={{ color: theme }}>Giờ phục vụ</p>
              <div className="space-y-2 text-sm" style={{ color: SPA_DARK }}>
                <div className="flex justify-between"><span>Thứ 2 – Thứ 7</span><span className="font-bold">09:00 – 21:00</span></div>
                <div className="flex justify-between"><span>Chủ Nhật</span><span className="font-bold">10:00 – 18:00</span></div>
              </div>
            </div>
          </div>
          <p className="text-center text-[11px]" style={{ color: '#C4B5A8' }}>
            © {new Date().getFullYear()} {brandName}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
