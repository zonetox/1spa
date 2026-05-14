'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

interface Testimonial {
  name: string;
  role: string;
  content: string;
  rating: number;
}

interface V7TestimonialsProps {
  title: string;
  testimonials: Testimonial[];
  themeColor?: string;
}

export const V7Testimonials: React.FC<V7TestimonialsProps> = ({ 
  title, 
  testimonials = [], 
  themeColor = '#D4AF37' 
}) => {
  return (
    <section className="editorial-spacing bg-white border-y border-gray-100">
      <div className="container mx-auto px-6">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-sans font-bold tracking-tight text-[#1A1A1A]">{title}</h2>
          <div className="w-12 h-[2px] mx-auto mt-6" style={{ backgroundColor: themeColor }} />
        </div>

        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 6000 }}
          pagination={{ clickable: true }}
          loop={true}
          spaceBetween={30}
          breakpoints={{
            640: { slidesPerView: 1 },
            1024: { slidesPerView: 2 },
          }}
          className="pb-16"
        >
          {testimonials.map((t, index) => (
            <SwiperSlide key={index}>
              <div className="bg-[#F9F9F9] p-10 md:p-14 rounded-2xl relative">
                {/* Quote Icon */}
                <div className="absolute top-8 right-10 text-gray-200">
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="currentColor">
                    <path d="M10 25h5v5h-5v-5zm0-10h5v5h-5v-5zm15 10h5v5h-5v-5zm0-10h5v5h-5v-5zM5 10v20h15V10H5zm25 0v20h15V10H30z" opacity="0.1" />
                  </svg>
                </div>

                <div className="flex mb-6 text-yellow-400">
                  {[...Array(t.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <p className="text-lg md:text-xl text-gray-700 font-light leading-relaxed mb-8 italic">
                  "{t.content}"
                </p>

                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: themeColor }}>
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{t.name}</h4>
                    <p className="text-xs text-gray-500 uppercase tracking-widest">{t.role}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

      </div>
    </section>
  );
};
