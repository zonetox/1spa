'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { CheckCircle, Star, MapPin, ArrowRight } from 'lucide-react'

interface Business {
  slug: string
  business_name: string
  category: string
  location_district?: string
  cover_image?: string
  services?: { name: string; price: string }[]
  is_verified?: boolean
}

function BusinessCard({ b, idx }: { b: Business; idx: number }) {
  const services = b.services?.slice(0, 3) || []
  return (
    <Link href={`/p/${b.slug}`} className="block">
      <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1, duration: 0.7 }}
        className="group relative bg-white rounded-3xl overflow-hidden cursor-pointer h-full"
        style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.08), 0 2px 12px rgba(212,175,55,0.06)' }}
        whileHover={{ y: -6, boxShadow: '0 20px 60px rgba(0,0,0,0.12), 0 4px 20px rgba(212,175,55,0.15)' }}>
        {/* Image */}
        <div className="relative h-64 overflow-hidden">
          <img src={b.cover_image || 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?q=80&w=800'} alt={b.business_name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          {/* Category badge */}
          <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase text-white"
            style={{ background: 'rgba(212,175,55,0.9)', backdropFilter: 'blur(8px)' }}>
            {b.category}
          </span>
          {/* Verified */}
          {b.is_verified && (
            <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 rounded-full"
              style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)' }}>
              <CheckCircle size={12} className="text-emerald-500" style={{ filter: 'drop-shadow(0 0 4px rgba(16,185,129,0.5))' }} />
              <span className="text-[9px] font-bold text-emerald-600 tracking-wider">VERIFIED</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-[#2F2F2F] font-bold text-lg leading-tight mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                {b.business_name}
              </h3>
              {b.location_district && (
                <div className="flex items-center gap-1.5 text-[#2F2F2F]/50">
                  <MapPin size={11} />
                  <span className="text-[11px]">{b.location_district}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Star size={13} fill="#D4AF37" className="text-[#D4AF37]" />
              <span className="text-[12px] font-bold text-[#D4AF37]">5.0</span>
            </div>
          </div>

          {/* Services preview */}
          {services.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {services.map(s => (
                <span key={s.name} className="px-3 py-1 rounded-full text-[10px] tracking-wide text-[#D4AF37] font-medium"
                  style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)' }}>
                  {s.name}
                </span>
              ))}
            </div>
          )}

          <div className="flex justify-center mt-2">
            <div
              className="relative overflow-hidden inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full text-[11px] font-bold tracking-[0.25em] uppercase text-white group/btn transition-all duration-300 shadow-md"
              style={{ background: '#D4AF37' }}>
              <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
              Xem chi tiết <ArrowRight size={13} />
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}

export function FeaturedSection({ businesses }: { businesses: Business[] }) {
  return (
    <section className="py-32" style={{ background: '#F9F6F0' }}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <span className="w-12 h-px bg-[#D4AF37]" />
              <span className="text-[11px] tracking-[0.5em] uppercase text-[#D4AF37] font-medium">The Showcase</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-[#2F2F2F] leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              Tinh Hoa<br /><span className="text-[#D4AF37]">Tuyển Chọn.</span>
            </h2>
          </div>
          <p className="max-w-xs text-[#2F2F2F]/50 text-sm leading-relaxed font-medium">
            Những địa điểm làm đẹp hàng đầu, được đội ngũ chuyên gia xác thực chất lượng và dịch vụ.
          </p>
        </motion.div>

        {/* Grid */}
        {businesses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {businesses.map((b, i) => <BusinessCard key={b.slug} b={b} idx={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl overflow-hidden animate-pulse" style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.06)' }}>
                <div className="h-64 bg-[#F9F6F0]" />
                <div className="p-6 space-y-3">
                  <div className="h-5 bg-[#F9F6F0] rounded-full w-3/4" />
                  <div className="h-4 bg-[#F9F6F0] rounded-full w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center mt-16">
          <Link href="/directory"
            className="relative overflow-hidden inline-flex items-center gap-3 px-8 py-3.5 rounded-full text-[11px] font-bold tracking-[0.25em] uppercase text-white group shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            style={{ background: '#D4AF37' }}>
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
            Xem toàn bộ danh bạ <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  )
}
