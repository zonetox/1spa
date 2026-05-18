'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, Share2, ChevronRight } from 'lucide-react';

interface V7ContactProps {
  address: string;
  phone: string;
  email: string;
  operatingHours?: string;
  socialLinks?: { platform: string; url: string }[];
  mapEmbedUrl?: string;
  themeColor?: string;
}

export const V7Contact: React.FC<V7ContactProps> = ({ 
  address, 
  phone, 
  email, 
  operatingHours,
  socialLinks = [],
  mapEmbedUrl,
  themeColor = '#D4AF37' 
}) => {
  const finalMapUrl = mapEmbedUrl || `https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <section id="contact" className="relative bg-white py-24 overflow-hidden border-t border-gray-50">
      <div className="container mx-auto px-6 relative z-10">
        
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* 1. Left Info Content */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="w-full lg:w-[45%] flex flex-col justify-center"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-[1.5px] w-8" style={{ backgroundColor: themeColor }} />
              <span className="text-[11px] uppercase tracking-[0.3em] font-bold" style={{ color: themeColor }}>
                Contact Information
              </span>
            </div>

            <h2 className="text-3xl md:text-5xl font-sans font-bold text-[#1A1A1A] mb-6 leading-tight tracking-tight">
              Liên hệ <span className="font-light text-gray-400">&</span> Giờ mở cửa
            </h2>
            
            <p className="text-gray-500 text-sm md:text-base leading-relaxed font-normal mb-12 max-w-md">
              Hãy để chúng tôi chăm sóc và mang đến trải nghiệm đẳng cấp nhất dành riêng cho bạn. Liên hệ đặt lịch tư vấn miễn phí ngay hôm nay.
            </p>

            {/* Info Stack with Luxury Glass Cards (Login-popup style) */}
            <div className="grid gap-6 mb-12">
              
              {/* Address Card - Login Popup White Glass Design */}
              <div className="group relative bg-white/95 backdrop-blur-xl border rounded-2xl p-7 transition-all hover:-translate-y-1 duration-300 shadow-sm overflow-hidden" style={{ borderColor: `${themeColor}30` }}>
                <div className="absolute right-[-20px] bottom-[-20px] opacity-[0.05] group-hover:opacity-[0.15] transition-opacity duration-700">
                  <MapPin size={100} color={themeColor} />
                </div>
                <div className="flex items-start gap-5 relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-[#F9F6F0] border flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm" style={{ borderColor: `${themeColor}20` }}>
                    <MapPin size={22} style={{ color: themeColor }} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-1 font-mono" style={{ color: themeColor }}>Địa chỉ của chúng tôi</p>
                    <h4 className="text-base font-medium text-[#2A2A2A] group-hover:text-[#1A1A1A] transition-colors leading-relaxed">{address}</h4>
                  </div>
                </div>
              </div>

              {/* Two col inner grid for phone & hours */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Phone Card */}
                <div className="group bg-white/95 backdrop-blur-xl border rounded-2xl p-6 transition-all hover:-translate-y-1 duration-300 shadow-sm" style={{ borderColor: `${themeColor}30` }}>
                  <div className="w-11 h-11 rounded-xl bg-[#F9F6F0] border flex items-center justify-center mb-5 shadow-sm" style={{ borderColor: `${themeColor}20` }}>
                    <Phone size={18} style={{ color: themeColor }} />
                  </div>
                  <p className="text-[10px] font-bold font-mono uppercase tracking-widest mb-1" style={{ color: themeColor }}>Hotline & Zalo</p>
                  <h4 className="text-xl font-display font-bold text-[#1A1A1A] tracking-wide">{phone}</h4>
                  <p className="text-[11px] text-gray-500 mt-2 font-light italic">Hỗ trợ tư vấn 24/7</p>
                </div>

                {/* Hours Card */}
                <div className="group bg-white/95 backdrop-blur-xl border rounded-2xl p-6 transition-all hover:-translate-y-1 duration-300 shadow-sm" style={{ borderColor: `${themeColor}30` }}>
                  <div className="w-11 h-11 rounded-xl bg-[#F9F6F0] border flex items-center justify-center mb-5 shadow-sm" style={{ borderColor: `${themeColor}20` }}>
                    <Clock size={18} style={{ color: themeColor }} />
                  </div>
                  <p className="text-[10px] font-bold font-mono uppercase tracking-widest mb-1" style={{ color: themeColor }}>Thời gian mở cửa</p>
                  <div className="text-[13px] leading-relaxed font-medium text-[#333] whitespace-pre-line pt-0.5">
                    {operatingHours || '09:00 - 21:00 Tất cả các ngày'}
                  </div>
                </div>

              </div>
            </div>

            {/* Social Connections */}
            <div className="flex items-center gap-4 py-5 border-t" style={{ borderTopColor: `${themeColor}20` }}>
              <Share2 size={14} style={{ color: themeColor }} />
              <span className="text-[10px] font-bold font-mono text-gray-500 uppercase tracking-widest mr-2">Mạng xã hội:</span>
              <div className="flex gap-3">
                {socialLinks.length > 0 ? socialLinks.map((s, i) => (
                  <a 
                    key={i} 
                    href={s.url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="px-4 py-2 rounded-full bg-white border text-[11px] font-bold uppercase tracking-wider text-[#2A2A2A] hover:bg-[#1A1A1A] hover:text-white hover:border-[#1A1A1A] transition-all shadow-sm"
                    style={{ borderColor: `${themeColor}30` }}
                  >
                    {s.platform}
                  </a>
                )) : (
                   <span className="text-xs italic text-gray-400">Facebook • Zalo</span>
                )}
              </div>
            </div>
          </motion.div>

          {/* 2. Right Side Map with Bright Frame */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true }}
            className="w-full lg:w-[55%] relative"
          >
            <div className="relative w-full h-[450px] lg:h-full min-h-[500px] rounded-[2.5rem] overflow-hidden border-[10px] border-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] group bg-white">
              
              <iframe 
                src={finalMapUrl}
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                className="transition-all duration-1000"
                referrerPolicy="no-referrer-when-downgrade"
              />

              {/* Bright Floating Overlay */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-lg rounded-2xl p-6 z-20 flex items-center justify-between border shadow-[0_15px_35px_rgba(0,0,0,0.12)] opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500" style={{ borderColor: `${themeColor}30` }}>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] font-bold font-mono mb-1.5" style={{ color: themeColor }}>Mở rộng ứng dụng</p>
                  <p className="text-sm font-semibold text-[#1A1A1A] truncate max-w-[200px] md:max-w-none">Chỉ đường trên Bản đồ</p>
                </div>
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`} 
                  target="_blank"
                  rel="noreferrer"
                  className="w-12 h-12 rounded-full text-white flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300"
                  style={{ backgroundColor: themeColor }}
                >
                  <ChevronRight size={22} />
                </a>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Bright Copyright Footer */}
        <div className="mt-24 pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderTopColor: `${themeColor}20` }}>
          <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">
            © {new Date().getFullYear()} {email ? email.split('@')[1] : 'Domain'}. Bảo lưu mọi quyền.
          </p>
          <p className="text-[10px] text-gray-400 font-bold tracking-[0.3em] uppercase flex items-center gap-2">
            Powered By <span className="font-serif italic font-black tracking-normal" style={{ color: themeColor }}>1Beauty.Asia</span>
          </p>
        </div>

      </div>
    </section>
  );
};

