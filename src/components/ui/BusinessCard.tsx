'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Star } from 'lucide-react'

interface BusinessCardProps {
  slug: string
  business_name: string
  category: string
  location_district: string
  rating_score: number
  cover_image?: string
  logo_url?: string
  isFeatured?: boolean
}

export const BusinessCard: React.FC<BusinessCardProps> = ({ 
  slug, 
  business_name, 
  category, 
  location_district, 
  rating_score,
  cover_image = 'https://images.unsplash.com/photo-1519415387722-a1c3bbef716c?auto=format&fit=crop&q=80', // Fallback
  logo_url,
  isFeatured = false
}) => {
  return (
    <Link href={`/p/${slug}`}>
      <motion.div 
        className={`group relative overflow-hidden rounded-2xl bg-zinc-950 border border-white/5 transition-all duration-500 hover:border-luxury-gold/30 ${isFeatured ? 'h-[500px]' : 'h-[400px]'}`}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        {/* Cover Image */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img 
            src={cover_image} 
            alt={business_name}
            className="w-full h-full object-cover opacity-50 group-hover:opacity-70 group-hover:scale-105 transition-all duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        </div>

        {/* Category Badge */}
        <div className="absolute top-4 left-4 z-20">
          <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-luxury-gold uppercase tracking-widest">
            {category}
          </span>
        </div>

        {/* Rating Badge */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-1 px-2 py-1 bg-luxury-gold/20 backdrop-blur-md border border-luxury-gold/30 rounded-lg">
          <Star size={10} className="fill-luxury-gold text-luxury-gold" />
          <span className="text-[10px] font-bold text-luxury-gold">{rating_score.toFixed(1)}</span>
        </div>

        {/* Content */}
        <div className="absolute inset-0 z-10 p-6 flex flex-col justify-end space-y-4">
          <div className="flex items-center gap-4">
            {logo_url && (
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-luxury-gold/50 bg-black">
                <img src={logo_url} alt={business_name} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex-1">
              <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-[0.2em] mb-1">
                {location_district}
              </p>
              <h3 className="font-display text-2xl md:text-3xl text-white leading-tight group-hover:text-luxury-gold transition-colors duration-300">
                {business_name}
              </h3>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Xem chi tiết</span>
            <div className="w-8 h-8 rounded-full border border-luxury-gold/30 flex items-center justify-center text-luxury-gold">
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 11L11 1M11 1H1M11 1V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}
