'use client'

import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast';
import Image from 'next/image'
import { Check, Upload, ImageIcon, RefreshCw } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { confirmAction } from '@/lib/confirm'

export default function BrandingPage() {
  const [saved, setSaved] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [config, setConfig] = useState({
    appName: '1Beauty.Asia',
    tagline: 'Premium Beauty, Spa & Dental Directory',
    accentColor: '#D4AF37', // Gold
    logoUrl: '',
  })

  const supabase = createClient()

  // Load config from localStorage on component mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('1beauty_branding_config')
    if (savedConfig) {
      try {
        setConfig(JSON.parse(savedConfig))
      } catch (err) {
        console.error('Error parsing saved branding config:', err)
      }
    }
  }, [])

  // Handle Logo Upload to Supabase Storage ('public_images' bucket)
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `admin-branding-logo-${Date.now()}.${fileExt}`
      const filePath = `branding/${fileName}`

      // Upload file to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('public_images')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data } = supabase.storage.from('public_images').getPublicUrl(filePath)
      
      if (data?.publicUrl) {
        setConfig(prev => ({ ...prev, logoUrl: data.publicUrl }))
      }
    } catch (err: any) {
      toast('Upload logo thất bại: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  // Save branding config to localStorage
  const handleSave = () => {
    localStorage.setItem('1beauty_branding_config', JSON.stringify(config))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  // Reset to default branding config
  const handleReset = async () => {
    const confirmed = await confirmAction('Bạn có muốn đặt lại cấu hình nhận diện mặc định không?')
    if (confirmed) {
      const defaultConfig = {
        appName: '1Beauty.Asia',
        tagline: 'Premium Beauty, Spa & Dental Directory',
        accentColor: '#D4AF37',
        logoUrl: '',
      }
      setConfig(defaultConfig)
      localStorage.setItem('1beauty_branding_config', JSON.stringify(defaultConfig))
    }
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <header>
        <h2 className="text-2xl font-display font-bold text-[#2F2F2F]">Cấu Hình Nhận Diện Thương Hiệu (Branding)</h2>
        <p className="text-sm text-[#2F2F2F]/60 mt-1">
          Thay đổi tên ứng dụng, biểu tượng Logo và màu sắc chủ đạo của hệ thống danh bạ 1Beauty.Asia. Cấu hình được lưu trữ và đồng bộ hóa thực tế.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left Form Column */}
        <div className="lg:col-span-3 glass-card p-8 space-y-6 bg-white border-[#D4AF37]/10">
          {/* App Name */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono text-[#2F2F2F]/60 uppercase tracking-widest block">Tên Ứng Dụng (Application Name)</label>
            <input
              type="text"
              value={config.appName}
              onChange={(e) => setConfig({ ...config, appName: e.target.value })}
              className="w-full bg-[#FDFBF7] border border-[#D4AF37]/10 rounded-lg px-4 py-3 text-[#2F2F2F] font-display font-bold text-lg focus:border-[#D4AF37]/50 outline-none transition-colors"
            />
          </div>

          {/* Tagline */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono text-[#2F2F2F]/60 uppercase tracking-widest block">Slogan / Tagline</label>
            <input
              type="text"
              value={config.tagline}
              onChange={(e) => setConfig({ ...config, tagline: e.target.value })}
              className="w-full bg-[#FDFBF7] border border-[#D4AF37]/10 rounded-lg px-4 py-3 text-[#2F2F2F]/80 focus:border-[#D4AF37]/50 outline-none transition-colors text-sm"
            />
          </div>

          {/* Accent Color */}
          <div className="space-y-3">
            <label className="text-[10px] font-mono text-[#2F2F2F]/60 uppercase tracking-widest block">Màu Sắc Chủ Đạo (Accent Color)</label>
            <div className="flex items-center gap-4">
              <input
                type="color"
                value={config.accentColor}
                onChange={(e) => setConfig({ ...config, accentColor: e.target.value })}
                className="w-12 h-12 rounded-lg border border-[#D4AF37]/10 bg-transparent cursor-pointer"
              />
              <div className="space-y-1">
                <p className="text-sm font-mono text-[#2F2F2F]/80">{config.accentColor.toUpperCase()}</p>
                <p className="text-[10px] text-[#2F2F2F]/40">Dùng cho các nút bấm cao cấp, các huy hiệu danh mục và đường viền nổi bật.</p>
              </div>
            </div>
          </div>

          {/* Logo Upload & URL */}
          <div className="space-y-4">
            <label className="text-[10px] font-mono text-[#2F2F2F]/60 uppercase tracking-widest block">Biểu Tượng Logo</label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Local File Upload */}
              <div className="border border-dashed border-[#D4AF37]/10 hover:border-[#D4AF37]/50 rounded-xl p-4 flex flex-col items-center justify-center bg-[#FDFBF7] relative group transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  disabled={uploading}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <Upload size={20} className={`text-[#2F2F2F]/60 group-hover:text-[#D4AF37] transition-colors ${uploading ? 'animate-bounce' : ''}`} />
                <span className="text-[11px] font-medium text-[#2F2F2F]/80 mt-2">
                  {uploading ? 'Đang tải lên...' : 'Tải Logo từ máy tính'}
                </span>
                <span className="text-[9px] text-[#2F2F2F]/40 mt-1">Hỗ trợ PNG, SVG, JPG</span>
              </div>

              {/* Direct URL Input */}
              <div className="flex flex-col justify-center space-y-2">
                <span className="text-[10px] font-mono text-[#2F2F2F]/40">Hoặc nhập URL trực tiếp:</span>
                <input
                  type="url"
                  value={config.logoUrl}
                  onChange={(e) => setConfig({ ...config, logoUrl: e.target.value })}
                  placeholder="https://cdn.1beauty.asia/logo.svg"
                  className="w-full bg-[#FDFBF7] border border-[#D4AF37]/10 rounded-lg px-3 py-2.5 text-[#2F2F2F]/80 placeholder:text-[#2F2F2F]/20 focus:border-[#D4AF37]/50 outline-none transition-colors text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-[#D4AF37]/10 flex justify-between">
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-white border border-[#D4AF37]/10 text-[#2F2F2F]/80 hover:text-[#2F2F2F] hover:bg-[#FDFBF7] rounded-lg text-xs font-mono uppercase flex items-center gap-1.5 transition-all"
            >
              <RefreshCw size={12} />
              Đặt lại mặc định
            </button>
            <button
              onClick={handleSave}
              className="premium-button px-8 py-3 flex items-center gap-2"
            >
              {saved ? (
                <>
                  <Check size={16} />
                  <span>Đã lưu thành công</span>
                </>
              ) : (
                <span>Lưu thay đổi</span>
              )}
            </button>
          </div>
        </div>

        {/* Right Preview Column (Shows a real-time mockup of 1Beauty.Asia with custom branding applied!) */}
        <div className="lg:col-span-2 space-y-6">
          <p className="text-[10px] font-mono text-[#2F2F2F]/60 uppercase tracking-widest">Bản xem trước giao diện thực tế (Live Preview)</p>
          
          <div className="glass-card overflow-hidden bg-white border-[#D4AF37]/10">
            {/* Website Mockup Header */}
            <div className="bg-[#FDFBF7] border-b border-[#D4AF37]/10 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {config.logoUrl ? (
                  <Image src={config.logoUrl} alt="Logo" width={96} height={24} className="h-6 w-auto object-contain" />
                ) : (
                  <div className="w-5 h-5 rounded bg-[#D4AF37] flex items-center justify-center text-[10px] font-black text-white">
                    1S
                  </div>
                )}
                <span className="text-sm font-bold text-[#2F2F2F] font-display">{config.appName}</span>
              </div>
              <div className="flex gap-3">
                <div className="w-12 h-1 bg-[#D4AF37]/20 rounded" />
                <div className="w-12 h-1 bg-[#D4AF37]/20 rounded" />
              </div>
            </div>

            {/* Website Mockup Hero Section */}
            <div className="p-6 bg-[#FDFBF7] space-y-4">
              <div className="space-y-1.5 text-center">
                <span 
                  className="text-[9px] font-mono px-2 py-0.5 rounded uppercase tracking-wider"
                  style={{ backgroundColor: `${config.accentColor}20`, color: config.accentColor, border: `1px solid ${config.accentColor}30` }}
                >
                  Premium Directory
                </span>
                <h4 className="text-sm font-display font-bold text-[#2F2F2F] mt-2">Tìm kiếm Spa & Nha khoa tốt nhất</h4>
                <p className="text-[10px] text-[#2F2F2F]/60">{config.tagline}</p>
              </div>

              {/* Call to Action Button Preview */}
              <button 
                className="w-full py-2 rounded text-[10px] font-bold text-white uppercase tracking-wider transition-all"
                style={{ backgroundColor: config.accentColor }}
              >
                Khám phá ngay
              </button>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-[#D4AF37]/10">
            <p className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest">💡 Trải nghiệm thực tế</p>
            <p className="text-[11px] text-[#2F2F2F]/60 mt-1">
              Bạn có thể tải trực tiếp ảnh Logo từ máy tính lên. Hệ thống sẽ tự động lưu ảnh vào Storage Bucket của Supabase và tạo liên kết ảnh công khai tức thì để cập nhật trên toàn hệ thống.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
