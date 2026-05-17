'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface V7BookingProps {
  title: string;
  subtitle: string;
  badge?: string;
  bgImage?: string;
  themeColor?: string;
  businessId?: string;
  businessName?: string;
  businessEmail?: string;
}

export const V7Booking: React.FC<V7BookingProps> = ({ 
  title, 
  subtitle, 
  badge = 'Ưu đãi đặc biệt',
  bgImage, 
  themeColor = '#D4AF37',
  businessId,
  businessName,
  businessEmail
}) => {
  return (
    <section id="booking" className="relative py-24 md:py-32 overflow-hidden">
      {/* Background with Parallax effect simulation */}
      <div className="absolute inset-0 z-0">
        <Image width={800} height={800} src={bgImage || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80'}   
          alt="Booking background" 
          className="w-full h-full object-cover brightness-[1.0] saturate-[1.1]"
         />
        {/* High-class ambient fog layer */}
        <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative rounded-3xl shadow-2xl p-10 md:p-16 text-center overflow-hidden bg-white"
          >
            <div className="relative z-10 flex flex-col items-center">
              <span className="inline-block px-5 py-1.5 rounded-full bg-gray-50 text-[#1A1A1A] text-[10px] font-bold uppercase tracking-[0.2em] mb-6 border border-gray-100">
                {badge || 'ĐẶC QUYỀN THÁNG NÀY'}
              </span>
              
              <h2 className="text-3xl md:text-5xl font-sans font-bold text-[#1A1A1A] mb-5 leading-tight tracking-tight">
                {title}
              </h2>
              
              <p className="text-gray-500 text-sm md:text-base font-normal mb-10 max-w-lg leading-relaxed">
                {subtitle}
              </p>
              
              <form 
                className="w-full max-w-md flex flex-col gap-4 mt-6 text-left"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const fd = new FormData(e.currentTarget);
                  const data = {
                    customer_name: fd.get('name'),
                    customer_phone: fd.get('phone'),
                    service_requested: fd.get('service'),
                    business_id: businessId || null,
                    business_name: businessName || null,
                    business_email: businessEmail || null,
                    source_url: typeof window !== 'undefined' ? window.location.href : '',
                  };
                  try {
                    const res = await fetch('/api/bookings', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(data)
                    });
                    if (res.ok) {
                      toast.success('Đặt lịch thành công! Chúng tôi sẽ liên hệ bạn sớm nhất.');
                      (e.target as HTMLFormElement).reset();
                    } else {
                      toast.error('Có lỗi xảy ra, vui lòng thử lại.');
                    }
                  } catch (err) {
                    toast.error('Lỗi mạng. Vui lòng thử lại.');
                  }
                }}
              >
                <input 
                  required 
                  name="name" 
                  placeholder="Họ và tên của bạn" 
                  className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:border-[#1A1A1A] transition-colors"
                />
                <input 
                  required 
                  name="phone" 
                  type="tel" 
                  placeholder="Số điện thoại liên hệ" 
                  className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:border-[#1A1A1A] transition-colors"
                />
                <input 
                  name="service" 
                  placeholder="Dịch vụ quan tâm (không bắt buộc)" 
                  className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:border-[#1A1A1A] transition-colors"
                />
                <button 
                  type="submit"
                  className="relative overflow-hidden w-full py-4 rounded-xl text-white font-bold uppercase tracking-[0.3em] text-[11px] flex items-center justify-center gap-3 group shadow-lg transition-all hover:scale-[1.02]"
                  style={{ background: themeColor }}
                >
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                  Đặt lịch trải nghiệm ngay
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
