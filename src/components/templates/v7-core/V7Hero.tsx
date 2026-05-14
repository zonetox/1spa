'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/shared/EditableText';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

interface V7HeroProps {
  title: string;
  subtitle: string;
  slides: string[];
  themeColor?: string;
  isEditing?: boolean;
  onUpdate?: (path: string, value: any) => void;
  onImagePick?: (path: string, currentUrl: string) => void;
}

export const V7Hero: React.FC<V7HeroProps> = ({ 
  title, 
  subtitle, 
  slides = [], 
  themeColor = '#D4AF37',
  isEditing = false,
  onUpdate = () => {},
  onImagePick
}) => {
  const handleImageClick = (index: number) => {
    if (isEditing && onImagePick) {
      onImagePick(`hero_section.hero_slides[${index}]`, slides[index]);
    }
  };

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#F9F6F0]">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        autoplay={isEditing ? false : { delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop={true}
        className="h-full w-full"
      >
        {slides.length > 0 ? (
          slides.map((slide, index) => (
            <SwiperSlide key={index} className="h-full w-full">
              <div className={`relative h-full w-full ${isEditing ? 'cursor-pointer group/hero' : ''}`} onClick={() => handleImageClick(index)}>
                <img 
                  src={slide} 
                  alt={`${title} slide ${index + 1}`}
                  className="v7-img-hero brightness-[1.0] transition-all duration-500"
                />
                {/* Soft Light Vignette instead of total blackness */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-transparent opacity-50 pointer-events-none" />
                
                {isEditing && (
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover/hero:opacity-100 transition-opacity border-4 border-dashed border-white/30 z-10">
                    <span className="bg-white/90 text-black font-bold px-4 py-2 rounded-full text-xs uppercase tracking-widest shadow-xl">Thay đổi banner {index + 1}</span>
                  </div>
                )}
              </div>
            </SwiperSlide>
          ))
        ) : (
          <SwiperSlide>
            <div className="h-full w-full bg-[#E5D5C0]" />
          </SwiperSlide>
        )}
      </Swiper>

      {/* Floating Premium White Glass Content Core (Matches Login Aesthetics) */}
      <div className="absolute inset-0 z-10 flex items-center justify-center text-center px-6 pointer-events-none">
        <div className="max-w-3xl w-full pointer-events-auto">
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="p-8 md:p-16 rounded-[3rem] shadow-[0_30px_70px_rgba(0,0,0,0.12)] relative overflow-hidden flex flex-col items-center justify-center"
            style={{ 
              background: 'rgba(255,255,255,0.75)', 
              backdropFilter: 'blur(24px)', 
              border: '1.5px solid rgba(255,255,255,0.9)' 
            }}
          >
            {/* Subtle inner glow */}
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-[60px] opacity-40 pointer-events-none" style={{ background: themeColor }} />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full blur-[60px] opacity-40 pointer-events-none" style={{ background: '#F5E0A3' }} />

            <div className="relative z-10 w-full">
              <motion.span 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                className="text-[10px] font-bold tracking-[0.4em] uppercase mb-4 block"
                style={{ color: themeColor }}
              >
                TRẢI NGHIỆM THƯỢNG LƯU
              </motion.span>

              <h1 className="text-3xl md:text-6xl font-sans font-black text-[#1A1A1A] mb-6 tracking-tight leading-tight">
                <EditableText
                  value={title}
                  isEditing={isEditing}
                  onChange={(val) => onUpdate('hero_section.hero_title', val)}
                  className="text-center"
                />
              </h1>

              <div className="w-12 h-[3px] mx-auto mb-8 rounded-full" style={{ backgroundColor: themeColor }} />

              <p className="text-gray-600 text-sm md:text-base font-normal max-w-xl mx-auto mb-10 leading-relaxed">
                <EditableText
                  value={subtitle}
                  isEditing={isEditing}
                  onChange={(val) => onUpdate('hero_section.hero_subtitle', val)}
                  className="text-center w-full"
                  multiline
                />
              </p>

              <motion.a
                href="#booking"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="relative overflow-hidden px-12 py-4 rounded-full text-white font-bold uppercase tracking-[0.3em] text-[11px] flex items-center justify-center gap-3 mx-auto shadow-[0_10px_25px_rgba(212,175,55,0.3)] transition-all"
                style={{ 
                  background: `linear-gradient(135deg, ${themeColor} 0%, #F5E0A3 50%, #B8860B 100%)`,
                  maxWidth: '280px'
                }}
              >
                <span className="absolute inset-0 -translate-x-full hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                Khám phá ngay
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Refined Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-[#1A1A1A]/40 animate-bounce flex flex-col items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>
        <span className="text-[8px] uppercase tracking-[0.3em] font-bold">Kéo xuống</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
};
