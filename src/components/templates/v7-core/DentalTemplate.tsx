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

const DENTAL_TEAL   = '#0D9488';
const DENTAL_BLUE   = '#0277BD';
const DENTAL_BG     = '#F8FDFC';
const DENTAL_DARK   = '#0A2540';
const DENTAL_LIGHT  = '#E0F5F3';

interface DentalTemplateProps {
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

export function DentalTemplate({
  data,
  isEditing = false,
  onUpdate = () => {},
  onImagePick,
  businessInfo = {},
  defaults = {},
}: DentalTemplateProps) {
  const theme = defaults.themeColor || DENTAL_TEAL;

  const {
    hero_section = {},
    about_us = {},
    services_menu = [],
    expert_team = [],
    gallery = [],
    social_trust = {},
    contact_info = {},
  } = data;

  const brandName = businessInfo.name || 'NHA KHOA';
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
        'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1600',
        'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=1600',
        'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?q=80&w=1600',
      ];

  // Trust signals for dental
  const trustSignals = [
    { icon: '🏥', label: 'Phòng vô trùng chuẩn quốc tế' },
    { icon: '👨‍⚕️', label: 'Bác sĩ có chứng chỉ chuyên môn' },
    { icon: '🦷', label: 'Thiết bị nhập khẩu chính hãng' },
    { icon: '✅', label: 'An toàn – Không đau – Bền lâu' },
  ];

  return (
    <div
      className="min-h-screen font-sans antialiased overflow-x-hidden"
      style={{ background: DENTAL_BG, color: DENTAL_DARK, '--theme-color': theme } as React.CSSProperties}
    >
      {/* ── HEADER: Clean white clinical ── */}
      <header
        className={`fixed top-0 left-0 w-full z-[1000] transition-all duration-500 ${scrolled ? 'py-3 shadow-sm' : 'py-5'}`}
        style={{
          background: scrolled ? 'rgba(255,255,255,0.98)' : 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: `1px solid ${DENTAL_LIGHT}`,
        }}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          {brandLogo ? (
            <Image src={brandLogo} alt={brandName} width={160} height={48} className="h-10 w-auto object-contain" />
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-lg font-bold" style={{ backgroundColor: theme }}>🦷</div>
              <span className="font-bold text-lg tracking-tight" style={{ color: DENTAL_DARK }}>{brandName}</span>
            </div>
          )}

          <nav className="hidden lg:flex items-center gap-8">
            {['Về phòng khám', 'Dịch vụ', 'Bác sĩ', 'Thiết bị', 'Đặt khám'].map((label, i) => (
              <a
                key={i}
                href={`#${['about', 'services', 'doctors', 'gallery', 'booking'][i]}`}
                className="text-[11px] uppercase tracking-[0.15em] font-semibold relative group py-1 transition-colors"
                style={{ color: '#4A6B7A' }}
              >
                {label}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] group-hover:w-full transition-all duration-300" style={{ backgroundColor: theme }} />
              </a>
            ))}
          </nav>

          <a
            href="#booking"
            className="px-6 py-2.5 rounded-lg text-[11px] uppercase tracking-[0.15em] font-bold text-white transition-all hover:opacity-90 shadow-md"
            style={{ backgroundColor: theme }}
          >
            Đặt khám ngay
          </a>
        </div>
      </header>

      {/* ── HERO: Clean, white, trust-forward ── */}
      <section className="relative min-h-screen w-full flex items-center overflow-hidden" style={{ background: 'linear-gradient(135deg, #F8FDFC 0%, #E0F5F3 50%, #F8FDFC 100%)' }}>
        <Swiper
          modules={[Autoplay, EffectFade]}
          effect="fade"
          speed={2000}
          autoplay={{ delay: 7000, disableOnInteraction: false }}
          className="absolute inset-0 w-full h-full opacity-15"
        >
          {heroSlides.map((slide, i) => (
            <SwiperSlide key={i}>
              <Image src={slide} alt="Dental" fill className="object-cover" />
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="container mx-auto px-6 pt-28 pb-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: 'easeOut' }}>
              {/* Trust badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-[10px] font-bold uppercase tracking-[0.25em]" style={{ background: `${theme}15`, color: theme, border: `1px solid ${theme}30` }}>
                <span>✓</span> Tiêu chuẩn quốc tế
              </div>
              <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6 leading-[1.1]" style={{ color: DENTAL_DARK }}>
                <EditableText
                  value={hero_section.hero_title || defaults.heroTitle || 'Kiến Tạo Nụ Cười Hoàn Mỹ'}
                  isEditing={isEditing}
                  onChange={(v) => onUpdate('hero_section.hero_title', v)}
                  className="font-serif font-bold"
                />
              </h1>
              <p className="text-lg leading-relaxed mb-10" style={{ color: '#4A6B7A' }}>
                <EditableText
                  value={hero_section.hero_subtitle || defaults.heroSubtitle || 'Chăm sóc răng miệng chuyên sâu với thiết bị nhập khẩu – an toàn, không đau, kết quả bền vững.'}
                  isEditing={isEditing}
                  onChange={(v) => onUpdate('hero_section.hero_subtitle', v)}
                  className="font-sans"
                />
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#booking" className="px-8 py-4 rounded-lg text-sm font-bold text-white uppercase tracking-[0.15em] transition-all hover:-translate-y-1 hover:shadow-lg shadow-md" style={{ backgroundColor: theme }}>
                  Đặt khám ngay
                </a>
                <a href={`tel:${phone}`} className="px-8 py-4 rounded-lg text-sm font-bold uppercase tracking-[0.15em] transition-all border-2 hover:bg-teal-50" style={{ color: theme, borderColor: theme }}>
                  Gọi: {phone}
                </a>
              </div>
            </motion.div>

            {/* Hero image */}
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.3 }} className="relative h-[480px] hidden lg:block">
              <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl">
                <Image src={heroSlides[0]} alt="Dental clinic" fill className="object-cover" />
                <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${DENTAL_DARK}40, transparent)` }} />
              </div>
              {/* Trust card overlay */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-5 shadow-xl border" style={{ borderColor: DENTAL_LIGHT }}>
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold mb-1" style={{ color: theme }}>Đánh giá Google</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold font-serif" style={{ color: DENTAL_DARK }}>5.0</span>
                  <span className="text-yellow-400 text-lg">★★★★★</span>
                </div>
                <p className="text-xs mt-1" style={{ color: '#8A9BAA' }}>{social_trust.rating_count || 120}+ đánh giá</p>
              </div>
            </motion.div>
          </div>

          {/* Trust signals strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16"
          >
            {trustSignals.map((ts, i) => (
              <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-white shadow-sm border" style={{ borderColor: DENTAL_LIGHT }}>
                <span className="text-2xl">{ts.icon}</span>
                <span className="text-[12px] font-medium leading-snug" style={{ color: DENTAL_DARK }}>{ts.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="py-28 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.9 }} className="relative h-[500px]">
              <div className="absolute top-0 left-0 w-[75%] h-[80%] rounded-2xl overflow-hidden shadow-xl" onClick={() => isEditing && onImagePick?.('about_us.about_image_1', about_us.about_image_1 ?? '')}>
                <Image src={about_us.about_image_1 || 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=800'} alt="Clinic" fill className="object-cover hover:scale-105 transition-transform duration-[2s] cursor-pointer" />
              </div>
              <div className="absolute bottom-0 right-0 w-[52%] h-[52%] rounded-2xl overflow-hidden shadow-lg border-8 border-white" onClick={() => isEditing && onImagePick?.('about_us.about_image_2', about_us.about_image_2 ?? '')}>
                <Image src={about_us.about_image_2 || 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=800'} alt="Doctor" fill className="object-cover hover:scale-105 transition-transform duration-[2s] cursor-pointer" />
              </div>
              <div className="absolute -top-5 -right-4 px-5 py-4 rounded-2xl shadow-lg z-10 bg-white border" style={{ borderColor: DENTAL_LIGHT }}>
                <p className="text-[9px] uppercase tracking-[0.2em] font-bold mb-1" style={{ color: theme }}>Kinh nghiệm</p>
                <p className="font-serif text-3xl font-bold" style={{ color: DENTAL_DARK }}>{about_us.experience_years || '10'}+</p>
                <p className="text-[10px]" style={{ color: '#8A9BAA' }}>Năm phục vụ</p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.2 }}>
              <span className="text-[11px] uppercase tracking-[0.4em] font-bold block mb-5" style={{ color: theme }}>Uy Tín · Chuyên Môn · An Toàn</span>
              <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6 leading-tight" style={{ color: DENTAL_DARK }}>
                <EditableText
                  value={about_us.section_title || defaults.aboutTitle || 'Phòng Khám Nha Khoa Đẳng Cấp'}
                  isEditing={isEditing}
                  onChange={(v) => onUpdate('about_us.section_title', v)}
                  className="font-serif font-bold"
                />
              </h2>
              <div className="w-16 h-[3px] rounded-full mb-8" style={{ backgroundColor: theme }} />
              <div className="text-base leading-loose mb-10 border-l-4 pl-6" style={{ borderColor: `${theme}60`, color: '#3D5A6A' }}>
                <EditableText
                  value={about_us.intro_text || defaults.aboutText || 'Chúng tôi cam kết cung cấp dịch vụ nha khoa đạt tiêu chuẩn quốc tế, với đội ngũ bác sĩ chuyên môn cao và hệ thống thiết bị hiện đại nhất.'}
                  isEditing={isEditing}
                  onChange={(v) => onUpdate('about_us.intro_text', v)}
                  multiline className="font-sans"
                />
              </div>
              <div className="grid grid-cols-3 gap-5 mb-10">
                {[
                  { num: about_us.experience_years || '10+', label: 'Năm kinh nghiệm' },
                  { num: social_trust.rating_count || '1000+', label: 'Bệnh nhân' },
                  { num: '100%', label: 'Vô trùng' },
                ].map((item, i) => (
                  <div key={i} className="text-center p-4 rounded-xl border" style={{ borderColor: DENTAL_LIGHT }}>
                    <div className="font-serif text-2xl font-bold" style={{ color: theme }}>{item.num}</div>
                    <div className="text-[11px] uppercase tracking-[0.1em] mt-1" style={{ color: '#8A9BAA' }}>{item.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="services" className="py-28" style={{ background: DENTAL_BG }}>
        <div className="container mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-20">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <span className="text-[11px] uppercase tracking-[0.4em] font-bold block mb-4" style={{ color: theme }}>Dịch Vụ Nha Khoa</span>
              <h2 className="font-serif text-4xl md:text-5xl font-bold mb-5" style={{ color: DENTAL_DARK }}>Chứng Nhận &amp; Điều Trị</h2>
              <div className="w-12 h-[2px] mx-auto" style={{ backgroundColor: theme }} />
            </motion.div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services_menu.map((svc, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.08, duration: 0.7 }}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500 border" style={{ borderColor: DENTAL_LIGHT }}
              >
                <div className="aspect-[16/9] relative overflow-hidden">
                  <Image src={svc.img || 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?q=80&w=800'} alt={svc.name} fill className="object-cover group-hover:scale-105 transition-transform duration-[1.5s]" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `${theme}15` }} />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="font-bold text-base leading-snug flex-1" style={{ color: DENTAL_DARK }}>{svc.name}</h3>
                    <span className="text-green-500 text-xs font-bold uppercase tracking-wider whitespace-nowrap">✓ An toàn</span>
                  </div>
                  <p className="text-sm leading-relaxed mb-5 line-clamp-3" style={{ color: '#6A8A9A' }}>{svc.desc}</p>
                  <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: DENTAL_LIGHT }}>
                    <span className="font-bold text-lg" style={{ color: theme }}>{svc.price || 'Liên hệ'}</span>
                    <a href="#booking" className="px-4 py-2 rounded-lg text-[11px] uppercase tracking-[0.1em] font-bold text-white transition-all hover:opacity-80" style={{ backgroundColor: theme }}>Đặt khám</a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DOCTORS (Experts) ── */}
      {expert_team.length > 0 && (
        <section id="doctors" className="py-28 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-20">
              <span className="text-[11px] uppercase tracking-[0.4em] font-bold block mb-4" style={{ color: theme }}>Đội Ngũ Chuyên Môn</span>
              <h2 className="font-serif text-4xl md:text-5xl font-bold" style={{ color: DENTAL_DARK }}>Bác Sĩ &amp; Chuyên Gia</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {expert_team.map((m, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500 border" style={{ borderColor: DENTAL_LIGHT }}
                >
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <Image src={m.img || 'https://i.imgur.com/oIeQ21A.png'} alt={m.name} fill className="object-cover group-hover:scale-105 transition-transform duration-[1.2s]" />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `${theme}15` }} />
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-1" style={{ color: DENTAL_DARK }}>Bác sĩ {m.name}</h3>
                    <p className="text-[11px] uppercase tracking-[0.2em] font-bold mb-3" style={{ color: theme }}>{m.role || 'Chuyên khoa Nha'}</p>
                    <p className="text-sm italic leading-relaxed" style={{ color: '#6A8A9A' }}>{m.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── GALLERY (Thiết bị & cơ sở vật chất) ── */}
      {gallery.length > 0 && (
        <section id="gallery" className="py-24" style={{ background: DENTAL_LIGHT }}>
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <span className="text-[11px] uppercase tracking-[0.4em] font-bold block mb-4" style={{ color: theme }}>Cơ Sở Vật Chất</span>
              <h2 className="font-serif text-4xl font-bold" style={{ color: DENTAL_DARK }}>Thiết Bị &amp; Không Gian</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {gallery.map((g: any, i: number) => (
                <motion.div key={i} whileHover={{ y: -4 }} className="relative group overflow-hidden rounded-xl shadow-md">
                  <Image src={g.url || g.img} alt={g.caption || ''} width={600} height={400} className="w-full h-48 md:h-56 object-cover group-hover:scale-105 transition-transform duration-[1.2s]" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center" style={{ background: `${theme}70` }}>
                    <span className="text-white text-[10px] uppercase tracking-[0.2em] font-bold border border-white/40 px-4 py-2 rounded-lg">Xem thêm</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── PATIENT TESTIMONIALS ── */}
      {social_trust.testimonials && social_trust.testimonials.length > 0 && (
        <section className="py-28 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-20">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <span className="text-[11px] uppercase tracking-[0.4em] font-bold block mb-4" style={{ color: theme }}>Đánh Giá Bệnh Nhân</span>
                <h2 className="font-serif text-4xl md:text-5xl font-bold" style={{ color: DENTAL_DARK }}>Bệnh Nhân Nói Gì?</h2>
                <div className="w-12 h-[2px] mx-auto mt-6" style={{ backgroundColor: theme }} />
              </motion.div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {social_trust.testimonials.map((t: any, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.7 }}
                  className="bg-white rounded-2xl p-7 shadow-sm hover:shadow-md transition-all duration-500 border relative"
                  style={{ borderColor: DENTAL_LIGHT }}
                >
                  <span className="absolute top-5 right-6 font-serif text-7xl leading-none opacity-5" style={{ color: theme }}>"</span>
                  {/* Google-style stars */}
                  <div className="flex items-center gap-2 mb-5">
                    <div className="flex gap-0.5">
                      {[...Array(t.rating || 5)].map((_: any, s: number) => (
                        <span key={s} className="text-yellow-400 text-base">★</span>
                      ))}
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.1em] font-bold" style={{ color: theme }}>Đã xác minh</span>
                  </div>
                  <p className="text-sm leading-relaxed mb-6 relative z-10" style={{ color: '#3D5A6A' }}>"{t.comment || t.text || t.content}"</p>
                  <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: DENTAL_LIGHT }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: theme }}>
                      {(t.author || t.name || 'B')[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-sm" style={{ color: DENTAL_DARK }}>{t.author || t.name || 'Bệnh nhân'}</p>
                      <p className="text-[11px]" style={{ color: '#8A9BAA' }}>{t.date || 'Bệnh nhân đã điều trị'}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            {/* Google rating summary */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-14 flex justify-center">
              <div className="flex items-center gap-6 px-8 py-5 rounded-2xl bg-white shadow-md border" style={{ borderColor: DENTAL_LIGHT }}>
                <div className="text-center">
                  <span className="font-serif text-5xl font-bold block" style={{ color: DENTAL_DARK }}>5.0</span>
                  <div className="text-yellow-400 text-lg mt-1">★★★★★</div>
                </div>
                <div className="w-px h-12 bg-gray-200" />
                <div>
                  <p className="font-bold text-base" style={{ color: DENTAL_DARK }}>Google Reviews</p>
                  <p className="text-sm" style={{ color: '#8A9BAA' }}>{social_trust.rating_count || 1000}+ đánh giá từ bệnh nhân</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-[11px] font-bold" style={{ color: theme }}>✓ Đã xác minh bởi Google</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ── BOOKING ── */}
      <V7Booking
        title={data.reservation_section?.title || 'Đặt Lịch Khám Ngay Hôm Nay'}
        subtitle={data.reservation_section?.subtitle || 'Đội ngũ bác sĩ chuyên khoa sẵn sàng tư vấn và điều trị cho bạn. Đặt lịch ngay để được phục vụ tốt nhất.'}
        badge={data.reservation_section?.badge || 'Khám miễn phí'}
        bgImage={about_us.about_image_1}
        themeColor={theme}
        businessId={businessInfo.id}
        businessName={brandName}
        businessEmail={businessInfo.email_owner || contact_info.email}
      />

      {/* ── FOOTER ── */}
      <footer id="contact" className="py-16 border-t bg-white" style={{ borderColor: DENTAL_LIGHT }}>
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-12 mb-12 border-b" style={{ borderColor: DENTAL_LIGHT }}>
            <div>
              {brandLogo
                ? <Image src={brandLogo} alt={brandName} width={140} height={44} className="h-10 w-auto mb-5 object-contain" />
                : <div className="flex items-center gap-3 mb-5">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: theme }}>🦷</div>
                    <h3 className="font-bold text-lg" style={{ color: DENTAL_DARK }}>{brandName}</h3>
                  </div>}
              <p className="text-sm leading-relaxed" style={{ color: '#8A9BAA' }}>Phòng khám nha khoa đạt tiêu chuẩn quốc tế. Cam kết an toàn – không đau – kết quả bền lâu.</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] mb-4 font-bold" style={{ color: theme }}>Địa chỉ phòng khám</p>
              <p className="text-sm font-medium mb-6" style={{ color: DENTAL_DARK }}>{contact_info.address_full || brandName}</p>
              <p className="text-[10px] uppercase tracking-[0.3em] mb-2 font-bold" style={{ color: theme }}>Đặt hẹn</p>
              <a href={`tel:${phone}`} className="text-2xl font-bold font-serif" style={{ color: theme }}>{phone}</a>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] mb-4 font-bold" style={{ color: theme }}>Giờ khám bệnh</p>
              <div className="space-y-2 text-sm" style={{ color: DENTAL_DARK }}>
                <div className="flex justify-between"><span style={{ color: '#8A9BAA' }}>Thứ 2 – Thứ 6</span><span className="font-bold">08:30 – 20:00</span></div>
                <div className="flex justify-between"><span style={{ color: '#8A9BAA' }}>Thứ 7</span><span className="font-bold">08:30 – 17:30</span></div>
                <div className="flex justify-between"><span style={{ color: '#8A9BAA' }}>Chủ Nhật</span><span className="font-bold">09:00 – 16:00</span></div>
              </div>
            </div>
          </div>
          <p className="text-center text-[11px]" style={{ color: '#C4D5DC' }}>© {new Date().getFullYear()} {brandName}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
