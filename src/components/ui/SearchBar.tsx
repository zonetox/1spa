'use client'

import React, { useState } from 'react'
import { Search, MapPin, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface SearchBarProps {
  searchTerm?: string
  onSearchChange?: (val: string) => void
  location?: string
  onLocationChange?: (val: string) => void
  onSearch?: () => void
}

export const SearchBar = ({ 
  searchTerm, 
  onSearchChange,
  location,
  onLocationChange,
  onSearch 
}: SearchBarProps) => {
  const [isFocused, setIsFocused] = useState(false)
  
  // Local state fallback if not controlled
  const [localSearch, setLocalSearch] = useState('')
  const [localLocation, setLocalLocation] = useState('')

  const currentSearch = searchTerm !== undefined ? searchTerm : localSearch
  const currentLocation = location !== undefined ? location : localLocation

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSearchChange) onSearchChange(e.target.value)
    else setLocalSearch(e.target.value)
  }

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onLocationChange) onLocationChange(e.target.value)
    else setLocalLocation(e.target.value)
  }

  const handleActionClick = (e: React.MouseEvent) => {
    if (onSearch) {
      e.preventDefault()
      onSearch()
    }
  }

  const ButtonContent = () => (
    <button 
      onClick={handleActionClick}
      className="w-full px-8 py-4.5 rounded-2xl text-white font-bold text-[11px] tracking-[0.2em] uppercase transition-all duration-500 flex items-center justify-center gap-2 group shadow-[0_8px_20px_rgba(212,175,55,0.25)] hover:shadow-[0_12px_25px_rgba(212,175,55,0.35)]"
      style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #F5E0A3 50%, #B8860B 100%)' }}
    >
      <span>Tìm kiếm</span>
      <Sparkles size={16} className="group-hover:animate-pulse" />
    </button>
  )

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.8 }}
      className="relative w-full max-w-4xl mx-auto px-4"
    >
      <div className={`
        relative flex flex-col md:flex-row items-center gap-2 p-2 
        rounded-[1.5rem] transition-all duration-500
        ${isFocused ? 'border-[#D4AF37]/50 bg-white/90 shadow-[0_15px_40px_rgba(212,175,55,0.15)]' : 'border-[#D4AF37]/20 bg-white/70 shadow-lg'}
        backdrop-blur-md border
      `}>
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#2F2F2F]/40 group-focus-within:text-[#D4AF37]">
            <Search size={18} />
          </div>
          <input 
            type="text" 
            value={currentSearch}
            onChange={handleSearchChange}
            placeholder="Bạn đang tìm dịch vụ gì? (vd: Nặn mụn, Bọc răng sứ...)" 
            className="w-full bg-transparent border-none py-4 pl-12 pr-4 text-[#2F2F2F] placeholder:text-[#2F2F2F]/40 outline-none font-medium text-sm"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px h-8 bg-[#D4AF37]/20" />

        {/* Location Selector */}
        <div className="relative w-full md:w-64">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#2F2F2F]/40">
            <MapPin size={18} />
          </div>
          <select 
            value={currentLocation}
            onChange={handleLocationChange}
            className="w-full bg-transparent border-none py-4 pl-12 pr-4 text-[#2F2F2F] appearance-none outline-none font-medium text-sm cursor-pointer"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          >
            <option value="Tất cả">Khu vực (Tất cả)</option>
            <optgroup label="Hồ Chí Minh">
              <option value="Quận 1">Quận 1</option>
              <option value="Quận 3">Quận 3</option>
              <option value="Quận 5">Quận 5</option>
              <option value="Quận 7">Quận 7</option>
              <option value="Quận 10">Quận 10</option>
              <option value="Bình Thạnh">Bình Thạnh</option>
              <option value="Phú Nhận">Phú Nhuận</option>
              <option value="Gò Vấp">Gò Vấp</option>
              <option value="Tân Bình">Tân Bình</option>
              <option value="Bình Tân">Bình Tân</option>
              <option value="Thủ Đức">Thủ Đức</option>
            </optgroup>
            <optgroup label="Hà Nội">
              <option value="Ba Đình">Ba Đình</option>
              <option value="Hoàn Kiếm">Hoàn Kiếm</option>
              <option value="Hai Bà Trưng">Hai Bà Trưng</option>
              <option value="Đống Đa">Đống Đa</option>
              <option value="Cầu Giấy">Cầu Giấy</option>
              <option value="Thanh Xuân">Thanh Xuân</option>
              <option value="Tây Hồ">Tây Hồ</option>
              <option value="Long Biên">Long Biên</option>
              <option value="Nam Từ Liêm">Nam Từ Liêm</option>
              <option value="Bắc Từ Liêm">Bắc Từ Liêm</option>
            </optgroup>
            <optgroup label="Đà Nẵng">
              <option value="Hải Châu">Hải Châu</option>
              <option value="Thanh Khê">Thanh Khê</option>
              <option value="Sơn Trà">Sơn Trà</option>
              <option value="Ngũ Hành Sơn">Ngũ Hành Sơn</option>
              <option value="Liên Chiểu">Liên Chiểu</option>
              <option value="Cẩm Lệ">Cẩm Lệ</option>
            </optgroup>
          </select>
        </div>

        {/* Action Button */}
        {onSearch ? (
          <div className="w-full md:w-auto">
            <ButtonContent />
          </div>
        ) : (
          <Link href={`/directory?q=${encodeURIComponent(currentSearch)}`} className="w-full md:w-auto">
            <ButtonContent />
          </Link>
        )}
      </div>

      {/* Decorative Tags */}
      <div className="flex flex-wrap justify-center gap-5 mt-8">
        {['Spa Royal', 'Nha khoa uy tín', 'Khuyến mãi 50%', 'Gần bạn nhất'].map((tag) => (
          <span 
            key={tag} 
            onClick={() => {
               if(onSearchChange) onSearchChange(tag)
               else setLocalSearch(tag)
            }}
            className="text-[10px] font-bold text-[#2F2F2F]/40 uppercase tracking-[0.2em] hover:text-[#D4AF37] cursor-pointer transition-colors"
          >
            #{tag}
          </span>
        ))}
      </div>
    </motion.div>
  )
}
