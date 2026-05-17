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
    accentColor: '#f59e0b', // amber-500
    logoUrl: '',
  })

  const supabase = createClient()
  const [isAdminVerified, setIsAdminVerified] = useState(false)

  // Load config from localStorage on component mount
  useEffect(() => {
    async function checkAdmin() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        window.location.href = '/login'
        return
      }
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
        
      if (profile?.role?.toLowerCase() !== 'admin') {
        window.location.href = '/dashboard'
        return
      }
      
      setIsAdminVerified(true)
    }
    checkAdmin()

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
        accentColor: '#f59e0b',
        logoUrl: '',
      }
      setConfig(defaultConfig)
      localStorage.setItem('1beauty_branding_config', JSON.stringify(defaultConfig))
    }
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <header>
        <h2 className="text-2xl font-display font-bold">Cấu Hình Nhận Diện Thương Hiệu (Branding)</h2>
        <p className="text-sm text-zinc-500 mt-1">
          Thay đổi tên ứng dụng, biểu tượng Logo và màu sắc chủ đạo của hệ thống danh bạ 1Beauty.Asia. Cấu hình được lưu trữ và đồng bộ hóa thực tế.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left Form Column */}
        <div className="lg:col-span-3 glass-card p-8 space-y-6">
          {/* App Name */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Tên Ứng Dụng (Application Name)</label>
            <input
              type="text"
              value={config.appName}
              onChange={(e) => setConfig({ ...config, appName: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-900 rounded-lg px-4 py-3 text-zinc-100 font-display font-bold text-lg focus:border-amber-500/50 outline-none transition-colors"
            />
          </div>

          {/* Tagline */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Slogan / Tagline</label>
            <input
              type="text"
              value={config.tagline}
              onChange={(e) => setConfig({ ...config, tagline: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-900 rounded-lg px-4 py-3 text-zinc-300 focus:border-amber-500/50 outline-none transition-colors text-sm"
            />
          </div>

          {/* Accent Color */}
          <div className="space-y-3">
            <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Màu Sắc Chủ Đạo (Accent Color)</label>
            <div className="flex items-center gap-4">
              <input
                type="color"
                value={config.accentColor}
                onChange={(e) => setConfig({ ...config, accentColor: e.target.value })}
                className="w-12 h-12 rounded-lg border border-zinc-800 bg-transparent cursor-pointer"
              />
              <div className="space-y-1">
                <p className="text-sm font-mono text-zinc-300">{config.accentColor.toUpperCase()}</p>
                <p className="text-[10px] text-zinc-600">Dùng cho các nút bấm cao cấp, các huy hiệu danh mục và đường viền nổi bật.</p>
              </div>
            </div>
          </div>

          {/* Logo Upload & URL */}
          <div className="space-y-4">
            <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Biểu Tượng Logo</label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Local File Upload */}
              <div className="border border-dashed border-zinc-800 hover:border-amber-500/50 rounded-xl p-4 flex flex-col items-center justify-center bg-zinc-950/40 relative group transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  disabled={uploading}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <Upload size={20} className={`text-zinc-500 group-hover:text-amber-500 transition-colors ${uploading ? 'animate-bounce' : ''}`} />
                <span className="text-[11px] font-medium text-zinc-400 mt-2">
                  {uploading ? 'Đang tải lên...' : 'Tải Logo từ máy tính'}
                </span>
                <span className="text-[9px] text-zinc-600 mt-1">Hỗ trợ PNG, SVG, JPG</span>
              </div>

              {/* Direct URL Input */}
              <div className="flex flex-col justify-center space-y-2">
                <span className="text-[10px] font-mono text-zinc-600">Hoặc nhập URL trực tiếp:</span>
                <input
                  type="url"
                  value={config.logoUrl}
                  onChange={(e) => setConfig({ ...config, logoUrl: e.target.value })}
                  placeholder="https://cdn.1beauty.asia/logo.svg"
                  className="w-full bg-zinc-950 border border-zinc-900 rounded-lg px-3 py-2.5 text-zinc-400 placeholder:text-zinc-700 focus:border-amber-500/50 outline-none transition-colors text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-zinc-900 flex justify-between">
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg text-xs font-mono uppercase flex items-center gap-1.5 transition-all"
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
          <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Bản xem trước giao diện thực tế (Live Preview)</p>
          
          <div className="glass-card overflow-hidden">
            {/* Website Mockup Header */}
            <div className="bg-zinc-950 border-b border-zinc-900 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {config.logoUrl ? (
                  <Image src={config.logoUrl} alt="Logo" width={96} height={24} className="h-6 w-auto object-contain" />
                ) : (
                  <div className="w-5 h-5 rounded bg-amber-500 flex items-center justify-center text-[10px] font-black text-black">
                    1S
                  </div>
                )}
                <span className="text-sm font-bold text-zinc-100 font-display">{config.appName}</span>
              </div>
              <div className="flex gap-3">
                <div className="w-12 h-1 bg-zinc-800 rounded" />
                <div className="w-12 h-1 bg-zinc-800 rounded" />
              </div>
            </div>

            {/* Website Mockup Hero Section */}
            <div className="p-6 bg-zinc-950 space-y-4">
              <div className="space-y-1.5 text-center">
                <span 
                  className="text-[9px] font-mono px-2 py-0.5 rounded uppercase tracking-wider"
                  style={{ backgroundColor: `${config.accentColor}20`, color: config.accentColor, border: `1px solid ${config.accentColor}30` }}
                >
                  Premium Directory
                </span>
                <h4 className="text-sm font-display font-bold text-zinc-100 mt-2">Tìm kiếm Spa & Nha khoa tốt nhất</h4>
                <p className="text-[10px] text-zinc-500">{config.tagline}</p>
              </div>

              {/* Call to Action Button Preview */}
              <button 
                className="w-full py-2 rounded text-[10px] font-bold text-black uppercase tracking-wider transition-all"
                style={{ backgroundColor: config.accentColor }}
              >
                Khám phá ngay
              </button>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-800">
            <p className="text-[10px] font-mono text-amber-500 uppercase tracking-widest">💡 Trải nghiệm thực tế</p>
            <p className="text-[11px] text-zinc-500 mt-1">
              Bạn có thể tải trực tiếp ảnh Logo từ máy tính lên. Hệ thống sẽ tự động lưu ảnh vào Storage Bucket của Supabase và tạo liên kết ảnh công khai tức thì để cập nhật trên toàn hệ thống.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
