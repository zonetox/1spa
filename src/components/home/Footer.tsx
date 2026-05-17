'use client'
import Image from 'next/image';
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Phone, MessageSquare, Share2, Music2, ArrowUpRight } from 'lucide-react'
import { LotusIcon } from '@/components/ui/LotusIcon'

const SEO_LINKS = {
  'Top Spa': ['Spa Quận 1 TP.HCM', 'Spa Quận 3 TP.HCM', 'Spa Quận 7 TP.HCM', 'Spa Hà Nội', 'Spa Đà Nẵng'],
  'Nha Khoa': ['Nha Khoa Quận 1', 'Nha Khoa Hoàn Kiếm', 'Niềng Răng Invisalign', 'Bọc Răng Sứ Cao Cấp', 'Trồng Răng Implant'],
  'Thẩm Mỹ': ['Viện Thẩm Mỹ Quốc Tế', 'Clinic Điều Trị Da', 'Trị Nám Chuyên Sâu', 'Nâng Cơ Ultherapy', 'Laser Tái Tạo Da'],
}

export function Footer() {
  return (
    <footer style={{ background: '#F9F6F0' }} className="border-t border-[#D4AF37]/10">
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-12">

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-20 border-b border-[#D4AF37]/10">

          {/* Col 1: Brand */}
          <div className="space-y-8 lg:col-span-1">
            <div>
              <div className="flex items-center mb-4">
                <Image width={800} height={800} src="/logo.png"   
                  alt="1BEAUTY.ASIA" 
                  className="h-10 w-auto object-contain"
                 />
              </div>
              <p className="text-[#2F2F2F]/50 text-sm leading-relaxed font-medium">
                Hệ sinh thái danh bạ làm đẹp tinh hoa hàng đầu Việt Nam.
              </p>
            </div>
            <div className="flex gap-3">
              {[Share2, Music2, Phone, MessageSquare].map((Icon, i) => (
                <motion.div key={i} whileHover={{ y: -3 }}
                  className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 group"
                  style={{ border: '1px solid rgba(212,175,55,0.3)' }}>
                  <Icon size={16} className="text-[#2F2F2F]/40 group-hover:text-[#D4AF37] transition-colors" />
                </motion.div>
              ))}
            </div>
            {/* Partner CTA */}
            <div className="space-y-3">
              <Link href="/signup"
                className="relative overflow-hidden flex items-center justify-center gap-2 w-full py-3 rounded-full text-[11px] font-bold tracking-[0.3em] uppercase text-white group"
                style={{ background: '#D4AF37' }}>
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                Đăng Ký Doanh Nghiệp
              </Link>
              <Link href="/guide" className="flex items-center justify-center gap-1 text-[10px] tracking-widest uppercase text-[#D4AF37]/70 hover:text-[#D4AF37] transition-colors font-medium">
                Hướng dẫn sử dụng <ArrowUpRight size={10} />
              </Link>
            </div>
          </div>

          {/* Cols 2-4: SEO Links */}
          {Object.entries(SEO_LINKS).map(([title, links]) => (
            <div key={title} className="space-y-8">
              <span className="text-[10px] font-bold tracking-[0.5em] uppercase text-[#2F2F2F]/30 block pb-3 border-b border-[#D4AF37]/15">
                {title}
              </span>
              <nav className="flex flex-col gap-4">
                {links.map(link => (
                  <Link key={link} href={`/directory?q=${link}`}
                    className="text-[12px] font-medium text-[#2F2F2F]/55 hover:text-[#D4AF37] transition-colors tracking-wide leading-relaxed">
                    {link}
                  </Link>
                ))}
              </nav>
            </div>
          ))}

          {/* Col 5: Mẫu Giao Diện (Templates) */}
          <div className="space-y-8">
            <span className="text-[10px] font-bold tracking-[0.5em] uppercase text-[#2F2F2F]/30 block pb-3 border-b border-[#D4AF37]/15">
              Mẫu Thiết Kế
            </span>
            <nav className="flex flex-col gap-4">
              {[
                { name: 'Modern Medical', url: '/p/medical-01' },
                { name: 'Dental Care', url: '/p/dental-01' },
                { name: 'Haute Couture Beauty', url: '/p/beauty-01' },
                { name: 'Luxury Spa Zen', url: '/p/spa-01' },
                { name: 'Royal Classic', url: '/p/beauty-01' },
                { name: 'Exclusive Flash Campaign', url: '/p/campaign-01' }
              ].map(t => (
                <Link key={t.name} href={t.url}
                  className="text-[12px] font-medium text-[#2F2F2F]/55 hover:text-[#D4AF37] transition-colors tracking-wide leading-relaxed">
                  {t.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-10">
          <div className="flex items-center gap-6">
            <p className="text-[10px] font-medium tracking-[0.3em] uppercase text-[#2F2F2F]/30">
              © 2026 1Beauty.Asia
            </p>
            <div className="w-1 h-1 rounded-full bg-[#D4AF37]/40" />
            <p className="text-[10px] font-medium tracking-[0.3em] uppercase text-[#D4AF37]/50">
              Premium Directory
            </p>
          </div>
          <div className="flex gap-8">
            {['Điều khoản', 'Bảo mật', 'Hợp tác'].map(item => (
              <Link key={item} href="#" className="text-[10px] tracking-widest uppercase text-[#2F2F2F]/30 hover:text-[#D4AF37] transition-colors font-medium">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
