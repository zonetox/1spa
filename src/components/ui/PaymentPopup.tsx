'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, Copy, Sparkles, AlertCircle, ArrowRight, ShieldCheck, Landmark, Crown, Star, Shield } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface PaymentPopupProps {
  isOpen: boolean
  onClose: () => void
  onConfirm?: () => void
  planName?: string
  amount?: string
}

const FALLBACK_PACKAGES = [
  {
    id: 'standard',
    name: 'Gói Cơ Bản (Standard)',
    price: 199000,
    duration_days: 30,
    features: ['Landing Page chuẩn SEO cao cấp', 'Tiếp nhận 100 lịch đặt hẹn/tháng', 'Báo cáo thống kê hiệu năng cơ bản', 'Hỗ trợ kỹ thuật 24/7 qua Zalo']
  },
  {
    id: 'BeautyTemplate',
    name: 'Gói Chuyên Nghiệp (Royal Business)',
    price: 499000,
    duration_days: 90,
    features: ['Sở hữu trọn bộ Templates Hoàng Gia', 'Hệ thống quản trị và sửa trực tiếp', 'Tiếp nhận không giới hạn lịch đặt hẹn', 'Đặc quyền VIP CSKH ưu tiên riêng biệt']
  },
  {
    id: 'luxury',
    name: 'Gói Thượng Lưu (Luxury Elite)',
    price: 999000,
    duration_days: 365,
    features: ['Tối ưu SEO & Tên miền riêng thương hiệu', 'Tự động clone và đồng bộ 100+ trang', 'Đo đạc chuyển đổi Leads chuyên nghiệp', 'Đội ngũ kỹ thuật hỗ trợ thiết kế riêng']
  }
]

export const PaymentPopup = ({ isOpen, onClose, onConfirm }: PaymentPopupProps) => {
  const supabase = createClient()
  const [packages, setPackages] = useState<any[]>([])
  const [profile, setProfile] = useState<any>(null)
  const [selectedPkg, setSelectedPkg] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      loadData()
    } else {
      setSelectedPkg(null)
    }
  }, [isOpen])

  // Tự động chọn gói khuyên dùng (Royal Business) ngay khi tải xong gói dịch vụ
  useEffect(() => {
    const activePackages = packages.length > 0 ? packages : FALLBACK_PACKAGES
    if (activePackages.length > 0 && !selectedPkg) {
      setSelectedPkg(activePackages[1] || activePackages[0])
    }
  }, [packages])

  const loadData = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: prof } = await supabase.from('business_profiles').select('*').eq('account_id', user.id).single()
        if (prof) setProfile(prof)
      }
      const { data: pkgs } = await supabase.from('packages').select('*').order('price', { ascending: true })
      if (pkgs && pkgs.length > 0) {
        setPackages(pkgs)
      } else {
        setPackages(FALLBACK_PACKAGES)
      }
    } catch (err) {
      console.error('Error loading payment data:', err)
      setPackages(FALLBACK_PACKAGES)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const handleConfirmPayment = async () => {
    if (!profile || !selectedPkg) {
      alert('Vui lòng chọn một gói dịch vụ trước khi xác nhận chuyển khoản.')
      return
    }
    setSubmitting(true)
    
    try {
      // Lưu thông tin đăng ký gói
      const { error } = await supabase.from('subscriptions').insert([{
        business_id: profile.id,
        package_id: selectedPkg.id,
        status: 'Active',
        verified: false
      }])

      // Cập nhật trạng thái subscription của người dùng trong Profiles sang 'active'
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase
          .from('profiles')
          .update({ subscription_status: 'active' })
          .eq('id', user.id)
      }

      if (!error) {
        alert('Kích hoạt gói dịch vụ thành công! Hệ thống đã ghi nhận quyền sở hữu Premium của bạn. Admin sẽ đối chiếu giao dịch trong vòng 24 giờ.')
        if (onConfirm) onConfirm()
        onClose()
      } else {
        // Fallback kích hoạt trực tiếp nếu bảng subscriptions có cấu trúc khác biệt
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { error: profileUpdateErr } = await supabase
            .from('profiles')
            .update({ subscription_status: 'active' })
            .eq('id', user.id)
          if (!profileUpdateErr) {
            alert('Kích hoạt thành công đặc quyền hội viên Premium!')
            if (onConfirm) onConfirm()
            onClose()
            return
          }
        }
        throw error
      }
    } catch (err: any) {
      console.error('Payment Error:', err)
      alert('Có lỗi xảy ra: ' + (err.message || err))
    } finally {
      setSubmitting(false)
    }
  }

  const activePackages = packages.length > 0 ? packages : FALLBACK_PACKAGES

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-0 overflow-hidden">
          {/* Backdrop tối sang trọng */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#0f0f0f]/95 backdrop-blur-md"
          />

          {/* Giao diện 1 màn hình rộng toàn diện */}
          <motion.div
            initial={{ scale: 0.98, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.98, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 30, stiffness: 200 }}
            className="relative bg-white w-full h-full md:h-[92vh] md:max-w-7xl md:rounded-[3rem] overflow-hidden shadow-[0_35px_80px_rgba(0,0,0,0.5)] border border-[#D4AF37]/30 z-10 flex flex-col"
          >
            {/* Header Thượng Lưu */}
            <div className="bg-gradient-to-r from-[#1C1C1C] via-[#2F2F2F] to-[#121212] py-6 px-10 flex justify-between items-center text-white border-b border-[#D4AF37]/25 relative shrink-0">
              <div className="absolute top-0 right-0 w-48 h-full bg-[#D4AF37]/5 rounded-bl-full pointer-events-none" />
              <div className="space-y-1 relative z-10">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-[#D4AF37] animate-pulse" />
                  <span className="text-[10px] font-mono font-bold tracking-[0.3em] uppercase text-[#D4AF37]">1Beauty.Asia PREMIUM CLUB</span>
                </div>
                <h3 className="font-serif text-2xl font-bold text-white tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Kích Hoạt Đặc Quyền Hội Viên Thượng Lưu
                </h3>
              </div>
              <button 
                onClick={onClose} 
                className="bg-white/5 p-3 rounded-full hover:bg-white/15 transition-all border border-white/10 hover:border-[#D4AF37]/50 active:scale-95"
              >
                <X size={20} className="text-zinc-300 hover:text-white transition-colors" />
              </button>
            </div>

            {/* Nội dung chính chia 2 cột Side-by-Side phóng khoáng */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10 lg:p-12 bg-[#FAF8F5]">
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center space-y-4 py-24">
                  <div className="w-12 h-12 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs text-[#D4AF37] font-mono font-bold uppercase tracking-[0.25em]">Đang tải cổng thanh toán Hoàng Gia...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch h-full">
                  
                  {/* CỘT TRÁI (7 Cột): CHỌN GÓI DỊCH VỤ */}
                  <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      <div className="border-l-4 border-[#D4AF37] pl-4">
                        <h4 className="text-xl font-bold text-[#2F2F2F]" style={{ fontFamily: "'Playfair Display', serif" }}>
                          Bước 1: Chọn Phương Án Đồng Hành
                        </h4>
                        <p className="text-xs text-zinc-500 mt-1 font-medium">
                          Bấm chọn gói phù hợp. Thông tin chuyển khoản và mã QR bên phải sẽ tự động cập nhật ngay lập tức.
                        </p>
                      </div>

                      {/* Danh sách các gói Premium */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                        {activePackages.map((pkg) => {
                          const isSelected = selectedPkg?.id === pkg.id
                          return (
                            <div 
                              key={pkg.id} 
                              onClick={() => setSelectedPkg(pkg)}
                              className={`cursor-pointer rounded-[2rem] p-6 relative flex flex-col justify-between transition-all duration-500 border ${
                                isSelected 
                                  ? 'bg-white border-[#D4AF37] shadow-[0_15px_40px_rgba(212,175,55,0.12)] scale-[1.02]' 
                                  : 'bg-white/80 hover:bg-white border-zinc-200/60 hover:border-[#D4AF37]/40 shadow-sm'
                              } group`}
                            >
                              {/* Icon vương miện cho gói được chọn */}
                              {isSelected && (
                                <span className="absolute top-4 right-4 text-[#D4AF37]">
                                  <Crown size={18} className="fill-[#D4AF37]/10 animate-bounce" />
                                </span>
                              )}

                              <div className="space-y-3">
                                <span className={`text-[9px] font-mono font-bold tracking-widest uppercase px-2.5 py-0.5 rounded-full ${
                                  isSelected ? 'bg-[#D4AF37]/10 text-[#D4AF37]' : 'bg-zinc-100 text-zinc-400'
                                }`}>
                                  {pkg.duration_days === 365 ? 'TIẾT KIỆM 50%' : 'POPULAR'}
                                </span>
                                <h5 className="text-sm font-bold text-[#2F2F2F] group-hover:text-[#D4AF37] transition-colors">
                                  {pkg.name}
                                </h5>
                                <div className="flex items-baseline gap-1 py-1 border-b border-zinc-100">
                                  <span className="text-xl font-bold text-[#D4AF37]">
                                    {pkg.price.toLocaleString('vi-VN')}đ
                                  </span>
                                  <span className="text-zinc-400 text-[10px] font-mono">/{pkg.duration_days} ngày</span>
                                </div>
                              </div>

                              <ul className="space-y-2 mt-4 text-[11px] text-zinc-500 flex-1">
                                {(pkg.features || []).slice(0, 3).map((f: string, i: number) => (
                                  <li key={i} className="flex items-start gap-1.5">
                                    <Check size={10} className="text-[#D4AF37] shrink-0 mt-0.5" />
                                    <span className="leading-tight font-semibold line-clamp-2">{f}</span>
                                  </li>
                                ))}
                              </ul>
                              
                              <div className="mt-5">
                                <button className={`w-full py-2.5 rounded-xl font-bold uppercase tracking-widest text-[9px] transition-all ${
                                  isSelected 
                                    ? 'bg-gradient-to-r from-[#2F2F2F] to-[#121212] text-[#D4AF37] border border-[#D4AF37]/20 shadow-md' 
                                    : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-500'
                                }`}>
                                  {isSelected ? 'Gói Đang Chọn' : 'Chọn Gói Này'}
                                </button>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Lợi ích đặc quyền hội viên */}
                    <div className="bg-[#1C1C1C] text-white rounded-[2rem] p-6 border border-[#D4AF37]/20 relative overflow-hidden shrink-0 shadow-lg">
                      <div className="absolute top-0 right-0 w-32 h-full bg-[#D4AF37]/5 rounded-bl-full pointer-events-none" />
                      <div className="flex items-center gap-2 mb-3">
                        <Star size={16} className="text-[#D4AF37] fill-[#D4AF37]" />
                        <h5 className="text-xs font-mono font-bold tracking-wider text-[#D4AF37] uppercase">CAM KẾT ĐẶC QUYỀN VIP CLUB</h5>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[11px] text-zinc-300">
                        <div className="flex items-start gap-2">
                          <ShieldCheck size={16} className="text-[#D4AF37] shrink-0" />
                          <span>Hỗ trợ đồng bộ hàng loạt lên đến 100+ Landing Page cho các cơ sở.</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Crown size={16} className="text-[#D4AF37] shrink-0" />
                          <span>Mở khóa toàn bộ kho giao diện Thượng Lưu, chỉnh sửa trực tiếp không giới hạn.</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Shield size={16} className="text-[#D4AF37] shrink-0" />
                          <span>Đảm bảo bảo mật tối cao thông tin và sao lưu tự động hàng ngày.</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CỘT PHẢI (5 Cột): THÔNG TIN THANH TOÁN & QUÉT MÃ QR */}
                  <div className="lg:col-span-5 bg-white border border-zinc-200/60 rounded-[2.5rem] p-6 md:p-8 flex flex-col justify-between shadow-md relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4AF37]/5 rounded-bl-full pointer-events-none" />
                    
                    <div className="space-y-5">
                      <div className="border-l-4 border-[#D4AF37] pl-4">
                        <h4 className="text-lg font-bold text-[#2F2F2F]">
                          Bước 2: Quét Mã & Thanh Toán
                        </h4>
                        <p className="text-[11px] text-zinc-500 font-medium">
                          Mở ứng dụng ngân hàng quét mã VietQR bên dưới để thực hiện giao dịch tức thì.
                        </p>
                      </div>

                      {selectedPkg ? (
                        <div className="space-y-4">
                          {/* Techcombank VietQR */}
                          <div className="flex flex-col items-center justify-center p-4 bg-[#FAF8F5] border border-[#D4AF37]/15 rounded-3xl shadow-inner relative group">
                            <div className="absolute inset-0 border border-[#D4AF37]/0 group-hover:border-[#D4AF37]/20 rounded-3xl transition-all pointer-events-none" />
                            <img 
                              src="/qr_code.jpg"
                              alt="VietQR Techcombank"
                              className="w-56 h-auto object-contain bg-white p-2 rounded-2xl shadow-sm"
                            />
                            <span className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase mt-3">TECHCOMBANK • 1BEAUTY.ASIA</span>
                          </div>

                          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-center">
                            <p className="text-xs text-amber-800 font-semibold leading-relaxed">
                              Vui lòng mở ứng dụng ngân hàng và quét mã QR trên để hoàn tất thanh toán đặc quyền Premium hội viên 1Beauty.Asia.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="py-12 flex flex-col items-center justify-center text-center space-y-2">
                          <AlertCircle size={32} className="text-zinc-300 animate-bounce" />
                          <p className="text-xs text-zinc-400 font-bold">Vui lòng chọn một gói ở cột bên trái để hiển thị mã quét QR tương ứng.</p>
                        </div>
                      )}
                    </div>

                    {/* Nút bấm Kích Hoạt Tức Thì */}
                    <div className="space-y-3 pt-4 border-t border-zinc-100 shrink-0">
                      <button 
                        onClick={handleConfirmPayment}
                        disabled={submitting}
                        className="w-full py-4 bg-gradient-to-r from-[#2F2F2F] to-[#121212] text-[#D4AF37] border border-[#D4AF37]/35 hover:border-[#D4AF37] hover:brightness-110 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
                      >
                        {submitting ? 'Đang kích hoạt đặc quyền...' : 'Tôi Đã Chuyển Khoản Thành Công'}
                        <ArrowRight size={14} />
                      </button>
                      <p className="text-[10px] text-zinc-400 font-medium leading-normal text-center">
                        Gói Premium sẽ được kích hoạt tức thì cho tài khoản của bạn. Đội ngũ đối chiếu của 1Beauty.Asia sẽ hoàn tất xác minh giao dịch trong vòng 24 giờ.
                      </p>
                    </div>
                  </div>

                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
