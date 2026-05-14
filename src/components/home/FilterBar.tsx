'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Sparkles, SlidersHorizontal } from 'lucide-react'

const CATEGORIES = [
  { id: 'all', label: 'Tất cả', icon: '✦' },
  { id: 'Spa', label: 'Spa', icon: '◈' },
  { id: 'Beauty', label: 'Beauty', icon: '◉' },
  { id: 'Dental', label: 'Dental', icon: '◇' },
]

const DISTRICTS = [
  'Tất cả', 
  'Quận 1', 'Quận 3', 'Quận 5', 'Quận 7', 'Quận 10', 'Bình Thạnh', 'Tân Bình', 'Thủ Đức',
  'Ba Đình', 'Hoàn Kiếm', 'Đống Đa', 'Cầu Giấy', 'Thanh Xuân',
  'Hải Châu', 'Sơn Trà', 'Ngũ Hành Sơn'
]

interface Props {
  activeCategory: string
  activeDistrict: string
  onCategory: (c: string) => void
  onDistrict: (d: string) => void
}

export function FilterBar({ activeCategory, activeDistrict, onCategory, onDistrict }: Props) {
  const [showDistrict, setShowDistrict] = useState(false)

  return (
    <div className="sticky top-[72px] z-40 bg-white/90 backdrop-blur-xl border-b border-[#D4AF37]/10 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between gap-6">
        {/* Category filters */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => onCategory(cat.id)}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-[11px] font-medium tracking-widest uppercase whitespace-nowrap transition-all duration-300 relative ${
                activeCategory === cat.id
                  ? 'text-[#D4AF37]'
                  : 'text-[#2F2F2F]/50 hover:text-[#D4AF37]'
              }`}>
              <span className="text-[#D4AF37] text-xs">{cat.icon}</span>
              {cat.label}
              {activeCategory === cat.id && (
                <motion.div layoutId="filter-underline" className="absolute bottom-0 left-3 right-3 h-[1.5px] bg-[#D4AF37]" />
              )}
            </button>
          ))}
        </div>

        {/* District filter */}
        <div className="relative flex-shrink-0">
          <button onClick={() => setShowDistrict(!showDistrict)}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-[11px] tracking-widest uppercase font-medium text-[#2F2F2F]/60 hover:text-[#D4AF37] transition-colors"
            style={{ border: '1px solid rgba(212,175,55,0.25)' }}>
            <MapPin size={12} className="text-[#D4AF37]" />
            {activeDistrict}
            <SlidersHorizontal size={12} />
          </button>
          {showDistrict && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="absolute right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-[#D4AF37]/10 p-2 min-w-[160px] z-50">
              {DISTRICTS.map(d => (
                <button key={d} onClick={() => { onDistrict(d); setShowDistrict(false) }}
                  className={`w-full text-left px-4 py-2 rounded-xl text-[11px] tracking-wide font-medium transition-all ${
                    activeDistrict === d ? 'bg-[#D4AF37]/10 text-[#D4AF37]' : 'text-[#2F2F2F]/60 hover:bg-[#F9F6F0]'
                  }`}>
                  {d}
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
