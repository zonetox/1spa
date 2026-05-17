'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/shared/EditableText';

interface V7AboutProps {
  title: string;
  text: string;
  years?: string | number;
  image1: string;
  image2: string;
  themeColor?: string;
  isEditing?: boolean;
  onUpdate?: (path: string, value: any) => void;
  onImagePick?: (path: string, currentUrl: string) => void;
}

export const V7About: React.FC<V7AboutProps> = ({ 
  title, 
  text, 
  years = 10, 
  image1, 
  image2, 
  themeColor = '#D4AF37',
  isEditing = false,
  onUpdate = () => {},
  onImagePick
}) => {
  return (
    <section id="about" className="editorial-spacing bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Images Side */}
          <div className="relative">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className={`relative z-10 w-4/5 group/img ${isEditing ? 'cursor-pointer' : ''}`}
              onClick={() => isEditing && onImagePick && onImagePick('about_us.about_image_1', image1)}
            >
              <Image width={800} height={800} src={image1}   alt={title} className="v7-img-about rounded-sm shadow-2xl group-hover/img:brightness-75 transition-all"  />
              {isEditing && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 bg-black/30 transition-opacity">
                  <span className="bg-white text-black text-[10px] font-bold px-3 py-1.5 rounded-full uppercase">Đổi ảnh 1</span>
                </div>
              )}
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className={`absolute -bottom-12 -right-4 z-20 w-3/5 group/img2 ${isEditing ? 'cursor-pointer' : ''}`}
              onClick={() => isEditing && onImagePick && onImagePick('about_us.about_image_2', image2)}
            >
              <Image width={800} height={800} src={image2}   alt="Interior" className="v7-img-about rounded-sm shadow-2xl border-8 border-background group-hover/img2:brightness-75 transition-all"  />
              {isEditing && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img2:opacity-100 bg-black/30 transition-opacity">
                  <span className="bg-white text-black text-[10px] font-bold px-3 py-1.5 rounded-full uppercase">Đổi ảnh 2</span>
                </div>
              )}
            </motion.div>

            {/* Years Badge */}
            <div 
              className="absolute -top-6 -left-6 z-30 w-32 h-32 rounded-full flex flex-col items-center justify-center text-white shadow-xl"
              style={{ backgroundColor: themeColor }}
            >
              <span className="text-3xl font-bold">
                <EditableText
                  value={String(years)}
                  isEditing={isEditing}
                  onChange={(val) => onUpdate('about_us.experience_years', val)}
                  className="text-white border-white/30 text-center w-16"
                />+
              </span>
              <span className="text-[10px] uppercase tracking-tighter">Năm kinh nghiệm</span>
            </div>
          </div>

          {/* Text Side */}
          <div className="lg:pl-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-sm font-medium tracking-[0.3em] uppercase mb-4 block" style={{ color: themeColor }}>
                Câu chuyện thương hiệu
              </span>
              <h2 className="text-3xl md:text-5xl font-sans font-bold tracking-tight text-[#1A1A1A] mb-8">
                <EditableText
                  value={title}
                  isEditing={isEditing}
                  onChange={(val) => onUpdate('about_us.section_title', val)}
                />
              </h2>
              <div className="w-20 h-1 mb-8" style={{ backgroundColor: themeColor }} />
              <div className="text-gray-600 text-lg leading-relaxed mb-10 font-light italic">
                "<EditableText
                  value={text}
                  isEditing={isEditing}
                  onChange={(val) => onUpdate('about_us.intro_text', val)}
                  multiline
                />"
              </div>
              <button 
                className="group flex items-center space-x-3 text-sm font-bold uppercase tracking-widest transition-all duration-300"
                style={{ color: themeColor }}
              >
                <span>Xem chi tiết</span>
                <div className="w-8 h-[1px] transition-all duration-300 group-hover:w-12" style={{ backgroundColor: themeColor }} />
              </button>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};
