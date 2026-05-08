'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BusinessCard } from '@/components/ui/BusinessCard'
import { SearchBar } from '@/components/ui/SearchBar'
import { createClient } from '@/lib/supabase/client'
import { Filter, MapPin, Grid, List } from 'lucide-react'
import { useSearchParams } from 'next/navigation'

function DirectoryPageContent() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const initialLoc = searchParams.get('loc') || 'Tất cả'

  // Smartly auto-switch active category tab if search query matches category names
  const detectedCategory = initialQuery.toLowerCase().includes('spa') 
    ? 'Spa' 
    : (initialQuery.toLowerCase().includes('dental') || initialQuery.toLowerCase().includes('nha khoa')
      ? 'Dental Clinic' 
      : (initialQuery.toLowerCase().includes('beauty') || initialQuery.toLowerCase().includes('thẩm mỹ')
        ? 'Beauty'
        : 'Tất cả'))

  const [allBusinesses, setAllBusinesses] = useState<any[]>([])
  const [filteredBusinesses, setFilteredBusinesses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState(detectedCategory)
  const [district, setDistrict] = useState(initialLoc)
  const [searchTerm, setSearchTerm] = useState(
    initialQuery.toLowerCase().trim() === 'spa' || 
    initialQuery.toLowerCase().trim() === 'dental' || 
    initialQuery.toLowerCase().trim() === 'nha khoa' ||
    initialQuery.toLowerCase().trim() === 'beauty'
      ? '' 
      : initialQuery
  )
  
  // Layout toggle state
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const supabase = createClient()

  useEffect(() => {
    const fetchBusinesses = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('active_landing_pages')
        .select('*')
      
      if (!error && data) {
        const formatted = data.map((item, idx) => ({
          slug: item.business_slug,
          business_name: item.business_name,
          category: (item.category === 'Spa' || item.category === 'spa') ? 'Spa' : ((item.category === 'Dental' || item.category === 'dental') ? 'Dental Clinic' : 'Beauty'),
          location_district: `${item.district || 'Quận 1'}, ${item.city || 'TP.HCM'}`,
          rating_score: 4.8 + (idx % 3) * 0.1,
          cover_image: item.content_json?.hero_section?.hero_slides?.[0] || item.content_json?.hero_section?.slides?.[0]?.image_url || 'https://images.unsplash.com/photo-1544161515-4af6b1d46af0?auto=format&fit=crop&q=80',
          logo_url: item.logo_url || 'https://images.unsplash.com/photo-1519415387722-a1c3bbef716c?auto=format&fit=crop&q=40',
          isFeatured: false
        }))
        setAllBusinesses(formatted)
        setFilteredBusinesses(formatted)
      }
      setLoading(false)
    }

    fetchBusinesses()
  }, [])

  // Apply filters and search
  const applyFilters = () => {
    let filtered = allBusinesses
    
    if (category !== 'Tất cả') {
      filtered = filtered.filter(b => b.category === category)
    }
    
    if (district !== 'Tất cả' && district !== '') {
      filtered = filtered.filter(b => b.location_district.includes(district))
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(b => 
        b.business_name.toLowerCase().includes(term) || 
        b.category.toLowerCase().includes(term) ||
        b.location_district.toLowerCase().includes(term)
      )
    }
    
    setFilteredBusinesses(filtered)
  }

  // Effect to re-run filters when category, district, or data changes
  useEffect(() => {
    applyFilters()
  }, [category, district, allBusinesses])

  // Run on first load if initialQuery or initialLoc exists
  useEffect(() => {
    if ((initialQuery || initialLoc !== 'Tất cả') && allBusinesses.length > 0) {
      applyFilters()
    }
  }, [allBusinesses, initialQuery, initialLoc])

  const handleSearch = () => {
    applyFilters()
  }

  return (
    <main className="min-h-screen pt-32 pb-24" style={{ background: '#F9F6F0' }}>
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        {/* Header Section */}
        <div className="space-y-6 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold text-[#2F2F2F]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Danh Bạ <span className="text-[#D4AF37]">Tinh Hoa.</span>
          </motion.h1>
          <p className="text-[#2F2F2F]/50 font-bold text-[11px] uppercase tracking-widest">
            Khám phá {filteredBusinesses.length} địa điểm làm đẹp được chứng thực.
          </p>
        </div>

        {/* Filter & Search Bar - Fixed sticky layout to prevent overlap */}
        <div className="sticky top-[72px] z-40 bg-[#F9F6F0]/95 backdrop-blur-xl pt-6 pb-6 shadow-sm border-b border-[#D4AF37]/10 -mx-6 px-6 mb-8">
           <div className="max-w-7xl mx-auto space-y-6">
             <SearchBar 
               searchTerm={searchTerm}
               onSearchChange={setSearchTerm}
               location={district}
               onLocationChange={setDistrict}
               onSearch={handleSearch}
             />
             
             <div className="flex flex-wrap items-center justify-between gap-6 py-4 border-y border-[#D4AF37]/10 bg-white/60 rounded-2xl px-6">
                <div className="flex items-center gap-8 overflow-x-auto no-scrollbar py-2">
                  {['Tất cả', 'Spa', 'Beauty', 'Dental Clinic'].map(cat => (
                    <button 
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`text-[11px] font-bold uppercase tracking-[0.2em] whitespace-nowrap transition-colors ${category === cat ? 'text-[#D4AF37]' : 'text-[#2F2F2F]/40 hover:text-[#D4AF37]'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-[#2F2F2F]/50 uppercase tracking-widest border border-[#D4AF37]/20 bg-white px-4 py-2 rounded-full">
                    <MapPin size={12} />
                    <span>Khu vực: {district === '' ? 'Tất cả' : district}</span>
                  </div>
                  
                  {/* Layout Toggles */}
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-lg transition-colors shadow-sm border ${viewMode === 'grid' ? 'text-[#D4AF37] border-[#D4AF37]/30 bg-white' : 'text-[#2F2F2F]/40 border-transparent bg-transparent hover:text-[#D4AF37]'}`}
                    >
                      <Grid size={16}/>
                    </button>
                    <button 
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-lg transition-colors shadow-sm border ${viewMode === 'list' ? 'text-[#D4AF37] border-[#D4AF37]/30 bg-white' : 'text-[#2F2F2F]/40 border-transparent bg-transparent hover:text-[#D4AF37]'}`}
                    >
                      <List size={16}/>
                    </button>
                  </div>
                </div>
             </div>
           </div>
        </div>

        {/* Business Grid / List */}
        {loading ? (
          <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "flex flex-col gap-6"}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className={`rounded-[2rem] bg-white/60 border border-[#D4AF37]/10 animate-pulse shadow-sm ${viewMode === 'grid' ? 'h-[400px]' : 'h-[200px]'}`} />
            ))}
          </div>
        ) : (
          <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "flex flex-col gap-8"}>
            {filteredBusinesses.map((business) => (
              <div key={business.slug} className={viewMode === 'list' ? 'flex flex-col md:flex-row gap-6 bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all p-4 border border-[#D4AF37]/10' : ''}>
                {viewMode === 'list' ? (
                  <>
                    <div className="w-full md:w-72 h-48 rounded-xl overflow-hidden shrink-0 relative">
                      <img src={business.cover_image} alt={business.business_name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col justify-center py-4 px-2 space-y-4 w-full">
                       <span className="text-[10px] font-bold tracking-[0.2em] text-[#D4AF37] uppercase">{business.category}</span>
                       <h3 className="text-3xl font-bold text-[#2F2F2F]" style={{ fontFamily: "'Playfair Display', serif" }}>{business.business_name}</h3>
                       <div className="flex items-center gap-2 text-sm font-medium text-[#2F2F2F]/50">
                         <MapPin size={16} />
                         {business.location_district}
                       </div>
                       <a href={`/p/${business.slug}`} className="mt-4 px-6 py-2 border border-[#D4AF37] text-[#D4AF37] rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#D4AF37] hover:text-white transition-colors w-fit">
                         Xem chi tiết
                       </a>
                    </div>
                  </>
                ) : (
                  <BusinessCard {...business} />
                )}
              </div>
            ))}
          </div>
        )}

        {filteredBusinesses.length === 0 && !loading && (
          <div className="text-center py-24 space-y-6">
            <p className="text-[#2F2F2F]/50 text-xl font-medium" style={{ fontFamily: "'Playfair Display', serif" }}>Không tìm thấy doanh nghiệp phù hợp với tiêu chí của bạn.</p>
            <button 
              onClick={() => {
                setCategory('Tất cả')
                setDistrict('Tất cả')
                setSearchTerm('')
                setFilteredBusinesses(allBusinesses)
              }}
              className="text-white text-[11px] font-bold uppercase tracking-widest px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all"
              style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #F5E0A3 50%, #B8860B 100%)' }}
            >
              Xóa tất cả bộ lọc
            </button>
          </div>
        )}
      </div>
    </main>
  )
}

export default function DirectoryPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#F9F6F0]"><p className="text-[#D4AF37] font-bold uppercase tracking-widest animate-pulse">Đang tải danh bạ...</p></div>}>
      <DirectoryPageContent />
    </React.Suspense>
  )
}
