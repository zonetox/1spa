'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface GalleryItem {
  title?: string;
  category?: string;
  img?: string;
  url?: string;
  caption?: string;
}

interface V7GalleryProps {
  title: string;
  subtitle: string;
  items: GalleryItem[];
  themeColor?: string;
}

export const V7Gallery: React.FC<V7GalleryProps> = ({ 
  title, 
  subtitle, 
  items = [], 
  themeColor = '#D4AF37' 
}) => {
  const validItems = items.filter(i => i.img || i.url);

  return (
    <section id="gallery" className="editorial-spacing bg-white">
      <div className="container mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[10px] uppercase font-sans tracking-[0.4em] font-bold mb-4 block" style={{ color: themeColor }}>Khoảnh Khắc</span>
            <h2 className="text-3xl md:text-5xl font-sans font-bold text-[#1A1A1A] tracking-tight mb-6">{title}</h2>
            <div className="w-12 h-[2px] mx-auto mb-6" style={{ backgroundColor: themeColor }} />
          </motion.div>
        </div>

        {/* High End Gallery Masonry */}
        <div className="columns-1 md:columns-3 gap-8 space-y-8">
          {validItems.map((item, index) => {
            const imgSrc = item.img || item.url;
            const imgAlt = item.title || item.caption || 'Gallery item';
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative group overflow-hidden rounded-3xl border break-inside-avoid shadow-sm hover:shadow-xl transition-all duration-500"
                style={{ borderColor: 'rgba(0,0,0,0.05)' }}
              >
                <div className="relative aspect-auto overflow-hidden">
                  <img 
                    src={imgSrc} 
                    alt={imgAlt} 
                    className="w-full h-auto object-cover scale-[1.02] group-hover:scale-110 transition-transform duration-[1.5s] ease-out" 
                  />
                  {/* Reveal Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-end p-8 backdrop-blur-[2px]">
                    <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500 text-center">
                      <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-white/80 mb-2 block">
                        {item.category || "Thực Tế"}
                      </span>
                      <h4 className="text-white text-lg font-sans font-bold tracking-tight leading-tight">{imgAlt}</h4>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
