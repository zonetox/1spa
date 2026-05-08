'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Clock, Gift, Percent, ArrowRight, Sparkles } from 'lucide-react'

// Mock Data cho Offers
const OFFERS = [
  {
    id: 1,
    business_name: 'Viện Thẩm Mỹ Hoàng Gia Luxury',
    title: 'Trẻ hóa da Ultherapy - Tặng kèm 1 liệu trình cấy HA căng bóng',
    description: 'Ưu đãi độc quyền dành riêng cho khách hàng VIP. Nâng cơ xóa nhăn công nghệ Mỹ kết hợp cấy tinh chất HA Thụy Sĩ.',
    badge: 'HOT',
    badgeType: 'hot', // hot, discount, gift
    expires_in: '3 ngày',
    image: 'https://images.unsplash.com/photo-1570172619644-defd00bb34da?auto=format&fit=crop&q=80',
    slug: 'vien-tham-my-hoang-gia-luxury-q1'
  },
  {
    id: 2,
    business_name: 'Nha Khoa Prestige Dental',
    title: 'Giảm 50% Gói Bọc Răng Sứ Veneer Cao Cấp',
    description: 'Kiến tạo nụ cười hoàn mỹ với mặt dán sứ siêu mỏng không mài nhỏ răng. Bảo hành trọn đời.',
    badge: 'GIẢM 50%',
    badgeType: 'discount',
    expires_in: '5 ngày',
    image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80',
    slug: 'nha-khoa-prestige-dental-q3'
  },
  {
    id: 3,
    business_name: 'Aurora Beauty Clinic',
    title: 'Tặng Máy Rửa Mặt Foreo Khi Mua Gói Tắm Trắng',
    description: 'Trắng bật 3 tone ngay lần đầu tiên. Tặng kèm thiết bị chăm sóc da cá nhân cao cấp từ Thụy Điển.',
    badge: 'QUÀ TẶNG',
    badgeType: 'gift',
    expires_in: '7 ngày',
    image: 'https://images.unsplash.com/photo-1544161515-4af6b1d46af0?auto=format&fit=crop&q=80',
    slug: 'aurora-beauty-clinic-q7'
  },
  {
    id: 4,
    business_name: 'Zen Spa Retreat',
    title: 'Massage Trị Liệu Đá Nóng Chuyên Sâu Cổ Vai Gáy',
    description: 'Combo thư giãn giảm căng thẳng thần kinh hiệu quả bằng thảo mộc tự nhiên.',
    badge: 'GIẢM 30%',
    badgeType: 'discount',
    expires_in: '2 tuần',
    image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&q=80',
    slug: 'zen-spa-retreat'
  },
  {
    id: 5,
    business_name: 'Elite Dental Clinic',
    title: 'Trồng Răng Implant Trả Góp 0% Lãi Suất',
    description: 'Khôi phục răng mất an toàn, bền vững với trụ Implant chính hãng Châu Âu.',
    badge: 'TRẢ GÓP',
    badgeType: 'hot',
    expires_in: 'Trong tháng',
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80',
    slug: 'elite-dental'
  },
  {
    id: 6,
    business_name: 'Viện Thẩm Mỹ Hoàng Gia Luxury',
    title: 'Giảm Mỡ Bụng TruSculpt iD - Giảm Ngay 5cm',
    description: 'Hủy mỡ nhiệt phân, không phẫu thuật, không nghỉ dưỡng. Cam kết hiệu quả bằng văn bản.',
    badge: 'GIẢM 10 TRIỆU',
    badgeType: 'discount',
    expires_in: '1 ngày',
    image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80',
    slug: 'vien-tham-my-hoang-gia-luxury-q1'
  }
]

export default function OffersPage() {
  return (
    <main className="min-h-screen pt-32 pb-24" style={{ background: '#F9F6F0' }}>
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        
        {/* Header Section */}
        <div className="space-y-6 text-center max-w-3xl mx-auto">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#D4AF37] tracking-[0.4em] uppercase text-xs font-bold block"
          >
            Exclusive Privileges
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-[#2F2F2F] leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Đặc Quyền <span className="text-[#D4AF37]">Ưu Đãi.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[#2F2F2F]/60 text-lg leading-relaxed font-medium"
          >
            Cập nhật những chương trình tri ân và khuyến mãi độc quyền từ các đối tác làm đẹp thượng lưu hàng đầu. Số lượng có hạn.
          </motion.p>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {OFFERS.map((offer, idx) => (
            <motion.div 
              key={offer.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx, duration: 0.8 }}
              className="group bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-[0_20px_50px_rgba(212,175,55,0.15)] transition-all duration-500 border border-transparent hover:border-[#D4AF37]/20 flex flex-col h-full"
            >
              {/* Image & Badge */}
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={offer.image} 
                  alt={offer.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80" />
                
                {/* Badge */}
                <div className={`absolute top-4 left-4 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg flex items-center gap-1.5 backdrop-blur-md ${
                  offer.badgeType === 'hot' ? 'bg-red-500/90 text-white border border-red-400' :
                  offer.badgeType === 'discount' ? 'bg-[#D4AF37]/90 text-white border border-[#D4AF37]' :
                  'bg-[#2F2F2F]/90 text-white border border-[#2F2F2F]'
                }`}>
                  {offer.badgeType === 'gift' ? <Gift size={12} /> : offer.badgeType === 'discount' ? <Percent size={12} /> : <Sparkles size={12} />}
                  {offer.badge}
                </div>

                {/* Expiry */}
                <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white/90 text-xs font-bold tracking-widest uppercase bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                  <Clock size={12} className="text-[#D4AF37]" />
                  Còn {offer.expires_in}
                </div>
              </div>

              {/* Content */}
              <div className="p-8 flex-grow flex flex-col justify-between">
                <div>
                  <a href={`/p/${offer.slug}`} className="text-[10px] font-bold tracking-[0.2em] text-[#D4AF37] uppercase mb-3 block hover:underline">
                    {offer.business_name}
                  </a>
                  <h3 className="text-2xl font-bold text-[#2F2F2F] leading-snug mb-4 group-hover:text-[#D4AF37] transition-colors" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {offer.title}
                  </h3>
                  <p className="text-sm text-[#2F2F2F]/60 leading-relaxed font-medium mb-8">
                    {offer.description}
                  </p>
                </div>
                
                <a href={`/p/${offer.slug}`} className="block w-full">
                  <button 
                    className="w-full py-4 rounded-xl text-white font-bold uppercase tracking-[0.2em] text-[10px] transition-all duration-500 shadow-[0_8px_20px_rgba(212,175,55,0.2)] group-hover:shadow-[0_12px_30px_rgba(212,175,55,0.35)] flex items-center justify-center gap-2"
                    style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #F5E0A3 50%, #B8860B 100%)' }}
                  >
                    Nhận mã ngay
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </a>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </main>
  )
}
