'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, MapPin, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'

const SLIDES = [
  { bg: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?q=80&w=1920', label: 'Royal Spa & Wellness', title: 'Nâng Tầm\nNhan Sắc.', sub: 'Đẳng cấp thượng lưu trong từng liệu trình.' },
  { bg: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1920', label: 'Advanced Dental Aesthetics', title: 'Nụ Cười\nRạng Rỡ.', sub: 'Công nghệ nha khoa tiên phong hàng đầu.' },
  { bg: 'https://images.unsplash.com/photo-1519415387722-a1c3bbef716c?q=80&w=1920', label: 'Premium Beauty Clinic', title: 'Vẻ Đẹp\nVĩnh Cửu.', sub: 'Khoa học & nghệ thuật hoàn hảo hội tụ.' },
]

export function HeroSection() {
  const [current, setCurrent] = useState(0)
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('Tất cả')
  const [isLocOpen, setIsLocOpen] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const t = setInterval(() => setCurrent(p => (p + 1) % SLIDES.length), 7000)
    return () => clearInterval(t)
  }, [])

  const slide = SLIDES[current]

  const locations = [
    { value: 'Tất cả', label: 'Toàn quốc' },
    { value: 'Quận 1', label: 'Quận 1' },
    { value: 'Quận 3', label: 'Quận 3' },
    { value: 'Quận 7', label: 'Quận 7' },
    { value: 'Bình Thạnh', label: 'Bình Thạnh' },
    { value: 'Phú Nhuận', label: 'Phú Nhuận' }
  ]

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background Image with optimized brightness for logo contrast */}
      <AnimatePresence mode="wait">
        <motion.div key={current} initial={{ opacity: 0, scale: 1.06 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.8, ease: 'easeOut' }} className="absolute inset-0">
          <img src={slide.bg} alt="" className="w-full h-full object-cover brightness-[0.76] saturate-[1.05]" />
          {/* Subtle top-vignette to make white/gold navigation menus stand out perfectly */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent z-10 pointer-events-none" />
          {/* Gradient overlay - right side heavy, left light for text */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#F9F6F0]/90 via-[#F9F6F0]/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#F9F6F0]/70 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content - LEFT aligned, 1/3 screen */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-xl">
            {/* Label */}
            <motion.div key={`label-${current}`} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="flex items-center gap-3 mb-8">
              <span className="w-10 h-px bg-[#D4AF37]" />
              <span className="text-[11px] font-medium tracking-[0.5em] uppercase text-[#D4AF37]">{slide.label}</span>
            </motion.div>

            {/* Title with Gold Period Highlight */}
            <motion.h1 key={`title-${current}`} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.1 }}
              className="text-6xl md:text-8xl font-bold leading-tight text-[#2F2F2F] mb-6 whitespace-pre-line"
              style={{ fontFamily: "'Playfair Display', serif" }}>
              {slide.title.endsWith('.') ? (
                <>
                  {slide.title.slice(0, -1)}
                  <span className="text-[#D4AF37]">.</span>
                </>
              ) : (
                slide.title
              )}
            </motion.h1>

            <motion.p key={`sub-${current}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.3 }}
              className="text-[#2F2F2F]/65 font-medium text-lg mb-12 tracking-wide leading-relaxed">
              {slide.sub}
            </motion.p>

            {/* Premium Custom Search Bar with Glow Transitions */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="flex items-center p-1.5 rounded-full shadow-xl transition-all duration-500 relative"
              style={{ 
                background: 'rgba(255,255,255,0.75)', 
                backdropFilter: 'blur(25px)', 
                border: isFocused ? '1.5px solid rgba(212,175,55,0.85)' : '1px solid rgba(212,175,55,0.35)',
                boxShadow: isFocused ? '0 25px 50px rgba(212,175,55,0.18)' : '0 15px 35px rgba(0,0,0,0.06)'
              }}>
              <div className="flex items-center gap-3 flex-1 pl-6 pr-4 py-3">
                <Search size={18} className="text-[#D4AF37] flex-shrink-0" />
                <input 
                  value={query} 
                  onChange={e => setQuery(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onKeyDown={e => e.key === 'Enter' && router.push(`/directory?q=${encodeURIComponent(query)}&loc=${encodeURIComponent(location)}`)}
                  placeholder="Tìm dịch vụ, spa, nha khoa..."
                  className="flex-1 bg-transparent text-[#2F2F2F] placeholder-[#2F2F2F]/40 text-sm font-medium outline-none" 
                />
              </div>

              {/* Custom Elegant Dropdown Location Selector (Upward Opening) */}
              <div className="relative flex items-center border-l border-[#D4AF37]/20 px-6 h-10">
                <button 
                  onClick={() => setIsLocOpen(!isLocOpen)}
                  className="flex items-center gap-2 hover:opacity-80 transition-all focus:outline-none"
                >
                  <MapPin size={16} className="text-[#D4AF37] flex-shrink-0" />
                  <span className="text-[11px] text-[#2F2F2F]/70 font-bold tracking-widest uppercase">
                    {locations.find(l => l.value === location)?.label || 'Toàn quốc'}
                  </span>
                </button>

                <AnimatePresence>
                  {isLocOpen && (
                    <>
                      {/* Click outside overlay to close dropdown */}
                      <div className="fixed inset-0 z-40" onClick={() => setIsLocOpen(false)} />
                      <motion.div 
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className="absolute bottom-full mb-4 right-0 w-48 rounded-2xl overflow-hidden shadow-2xl border border-[#D4AF37]/35 z-50"
                        style={{ background: 'rgba(255, 255, 255, 0.96)', backdropFilter: 'blur(30px)' }}
                      >
                        <div className="py-1.5">
                          {locations.map((loc) => (
                            <button
                              key={loc.value}
                              onClick={() => {
                                setLocation(loc.value)
                                setIsLocOpen(false)
                              }}
                              className={`w-full text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider transition-all hover:bg-[#D4AF37]/10 ${
                                location === loc.value ? 'text-[#9c7a1c] bg-[#D4AF37]/8' : 'text-[#2F2F2F]/70 hover:text-[#2F2F2F]'
                              }`}
                            >
                              {loc.label}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Gold Gradient Premium Pill Button */}
              <button 
                onClick={() => router.push(`/directory?q=${encodeURIComponent(query)}&loc=${encodeURIComponent(location)}`)}
                className="relative overflow-hidden px-8 py-3.5 rounded-full font-bold text-[11px] tracking-[0.25em] uppercase text-[#2F2F2F] hover:brightness-105 active:scale-95 transition-all duration-300 shadow-md hover:shadow-[#D4AF37]/20"
                style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #F5E0A3 100%)' }}
              >
                Tìm Kiếm
              </button>
            </motion.div>

            {/* Interactive Tags */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="flex gap-4 mt-6 flex-wrap pl-2">
              {['Spa', 'Dental', 'Quận 1', 'Quận 3'].map(tag => (
                <span 
                  key={tag} 
                  onClick={() => {
                    if (tag.includes('Quận')) {
                      router.push(`/directory?loc=${encodeURIComponent(tag)}`)
                    } else {
                      router.push(`/directory?q=${encodeURIComponent(tag)}`)
                    }
                  }} 
                  className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[#2F2F2F]/50 hover:text-[#D4AF37] cursor-pointer transition-all duration-300"
                >
                  #{tag}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Slide dots */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {SLIDES.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            className={`rounded-full transition-all duration-500 ${i === current ? 'w-8 h-1.5 bg-[#D4AF37]' : 'w-1.5 h-1.5 bg-[#D4AF37]/30'}`} />
        ))}
      </div>

      {/* Scroll indicator */}
      <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 right-10 flex flex-col items-center gap-2 opacity-40 z-10">
        <span className="text-[9px] tracking-[0.4em] uppercase text-[#2F2F2F] rotate-90 origin-center">Scroll</span>
        <div className="w-px h-10 bg-[#D4AF37]" />
      </motion.div>
    </section>
  )
}
