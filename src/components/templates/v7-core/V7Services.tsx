'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface ServiceItem {
  name: string;
  desc: string;
  img: string;
  price?: string;
  tagline?: string;
}

interface V7ServicesProps {
  title: string;
  subtitle: string;
  services: ServiceItem[];
  themeColor?: string;
}

export const V7Services: React.FC<V7ServicesProps> = ({ 
  title, 
  subtitle, 
  services = [], 
  themeColor = '#D4AF37' 
}) => {
  return (
    <section id="services" className="editorial-spacing bg-white relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] mb-3 block" style={{ color: themeColor }}>Dịch Vụ Nổi Bật</span>
            <h2 className="text-3xl md:text-5xl font-sans font-bold tracking-tight text-[#1A1A1A] mb-5">{title}</h2>
            <div className="w-12 h-[2px] mx-auto mb-6" style={{ backgroundColor: themeColor }} />
            <p className="text-gray-500 font-normal text-sm max-w-xl mx-auto leading-relaxed">{subtitle}</p>
          </motion.div>
        </div>

        {/* Clean Editorial Grid with Seamless Integration */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => {
            return (
              <motion.a
                key={index}
                href="#booking"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="group flex flex-col rounded-2xl bg-white border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-500 cursor-pointer overflow-hidden"
              >
                {/* Card Top Image - Perfect Contain/Blend */}
                <div className="aspect-[4/3] w-full overflow-hidden relative bg-white">
                  <Image width={800} height={800} src={service.img}   
                    alt={service.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                   />
                  {service.tagline && (
                    <div className="absolute top-4 left-4 z-20 px-3 py-1 rounded-full bg-black/60 text-[9px] font-bold tracking-[0.1em] text-white uppercase">
                      {service.tagline}
                    </div>
                  )}
                </div>

                {/* Editorial Content Details */}
                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="text-xl md:text-2xl font-sans font-bold text-[#1A1A1A] mb-3 leading-tight group-hover:text-black transition-colors"
                      style={{ transitionProperty: 'color' }}>
                    {service.name}
                  </h3>
                  
                  <p className="text-gray-500 text-sm font-normal leading-relaxed mb-8 line-clamp-3">
                    {service.desc}
                  </p>

                  {/* Bottom CTA Bar */}
                  <div className="mt-auto pt-5 border-t border-gray-50 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">Chi phí</p>
                      <span className="text-lg font-sans font-bold text-[#1A1A1A]" style={{ color: themeColor }}>
                        {service.price || 'Liên hệ'}
                      </span>
                    </div>
                    
                    <div className="relative w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300"
                         style={{ borderColor: `${themeColor}40`, color: themeColor }}>
                      <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                           style={{ background: themeColor }} />
                      <svg className="w-3.5 h-3.5 relative z-10 transition-colors group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
};
