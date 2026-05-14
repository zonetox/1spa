'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Mail, Lock, Building, ArrowRight, ShieldCheck, AlertCircle, MessageCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { slugify } from '@/lib/utils'
import { LotusIcon } from '@/components/ui/LotusIcon'

export default function SignupPage() {
  const [formData, setFormData] = useState({
    businessName: '',
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    const supabase = createClient()

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: { data: { business_name: formData.businessName } }
      })

      if (authError) throw authError

      if (authData.user) {
        const { error: accError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            email: formData.email,
            role: 'Business',
            subscription_status: 'trial',
            expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          })
        if (accError) {
          console.error('Account creation error:', accError)
          throw new Error('Lỗi tạo tài khoản: ' + accError.message)
        }

        const slug = slugify(formData.businessName) + '-' + Math.random().toString(36).substring(2, 5)
        const { data: profile, error: profError } = await supabase
          .from('business_profiles')
          .insert({
            account_id: authData.user.id,
            business_name: formData.businessName,
            slug,
            category: 'Spa',
            location_city: 'Hồ Chí Minh',
            location_district: 'Quận 1'
          }).select().single()

        if (profError) {
          console.error('Business profile creation error:', profError)
          throw new Error('Lỗi tạo hồ sơ doanh nghiệp: ' + profError.message)
        }

        const { error: lpError } = await supabase.from('landing_pages').insert({
          business_id: profile.id,
          template_id: 'BeautyTemplate',
          status: 'Published',
          content_json: {
            hero_section: { hero_title: `Chào mừng tới ${formData.businessName}`, hero_subtitle: 'Nâng tầm vẻ đẹp thượng lưu' },
            about_us: { intro_text: 'Chúng tôi mang đến dịch vụ tốt nhất cho bạn.' },
            services_menu: [],
            contact_info: { hotline: '', zalo_link: '' },
            operating_hours: {}
          }
        })
        if (lpError) {
          console.error('Landing page creation error:', lpError)
          throw new Error('Lỗi tạo trang Landing Page: ' + lpError.message)
        }

        // Wait a bit to show the loading animation before redirecting
        setTimeout(() => {
          window.location.href = '/onboarding'
        }, 1500)
      }
    } catch (error: any) {
      setErrorMsg(error.message || 'Đã có lỗi xảy ra trong quá trình đăng ký.')
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden" style={{ background: '#F9F6F0' }}>
      
      {/* Loading Overlay */}
      <AnimatePresence>
        {loading && !errorMsg && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F9F6F0]/90 backdrop-blur-md"
          >
            <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2 }}>
              <img 
                src="/logo-mark.png" 
                alt="Loading..." 
                className="w-16 h-16 object-contain" 
              />
            </motion.div>
            <p className="mt-6 text-[#D4AF37] font-bold tracking-[0.3em] uppercase text-[11px]">Đang thiết lập không gian...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Decorative Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-10 left-10 w-96 h-96 rounded-full blur-[100px] opacity-40 animate-pulse-gold" style={{ background: '#D4AF37' }} />
        <div className="absolute bottom-10 right-10 w-[500px] h-[500px] rounded-full blur-[120px] opacity-60" style={{ background: '#FFFFFF' }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-5xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 shadow-[0_20px_60px_rgba(0,0,0,0.05)] rounded-[2.5rem] overflow-hidden"
             style={{ 
               background: 'rgba(255,255,255,0.6)', 
               backdropFilter: 'blur(16px)', 
               border: '1px solid rgba(255,255,255,0.8)' 
             }}>
             
          {/* Left Side: Info */}
          <div className="p-8 md:p-10 flex flex-col justify-between text-white relative overflow-hidden shadow-inner" style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)' }}>
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1560750588-73207b1ef5b8?q=80&w=800')] opacity-10 mix-blend-overlay object-cover" />
            <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent" />
            
            <div className="relative z-10 space-y-6">
              <Link href="/">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }} className="flex items-center">
                  <img 
                    src="/logo.png" 
                    alt="1BEAUTY.ASIA" 
                    className="h-8 w-auto object-contain brightness-0 invert" 
                  />
                </motion.div>
              </Link>

              <h2 className="text-2xl md:text-3xl font-bold leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                Khởi đầu<br/>sự nghiệp<br/>đẳng cấp.
              </h2>

              <div className="space-y-3 pt-2">
                {[
                  '30 ngày dùng thử miễn phí',
                  'Giao diện Royal Luxury độc quyền',
                  'Hệ thống quản lý Booking thông minh',
                  'Hỗ trợ SEO khu vực tối ưu'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md shadow-sm">
                      <ShieldCheck size={10} className="text-white" />
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-white/90">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative z-10 pt-8">
              <div className="w-8 h-px bg-white/30 mb-2" />
              <p className="text-[9px] font-bold uppercase tracking-[0.3em] opacity-80">Gia nhập cộng đồng tinh hoa</p>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="p-6 md:p-8 space-y-4 flex flex-col justify-center">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-[#2F2F2F]" style={{ fontFamily: "'Playfair Display', serif" }}>Đăng ký doanh nghiệp</h1>
              <p className="text-xs text-[#2F2F2F]/50 font-medium leading-relaxed">Bắt đầu hành trình chinh phục khách hàng thượng lưu.</p>
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
              <AnimatePresence>
                {errorMsg && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-[#722F37]/5 border border-[#722F37]/20 text-[#722F37]">
                    <AlertCircle size={16} />
                    <p className="text-xs font-medium leading-relaxed">{errorMsg}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-3">
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#2F2F2F]/40 group-focus-within:text-[#D4AF37] transition-colors">
                    <Building size={16} />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Tên doanh nghiệp"
                    value={formData.businessName}
                    onChange={e => setFormData({...formData, businessName: e.target.value})}
                    className="w-full bg-white/50 border border-white/60 rounded-2xl py-3 pl-12 pr-4 text-[#2F2F2F] placeholder:text-[#2F2F2F]/40 outline-none focus:border-[#D4AF37] focus:bg-white transition-all font-medium text-xs shadow-sm"
                    required
                  />
                </div>

                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#2F2F2F]/40 group-focus-within:text-[#D4AF37] transition-colors">
                    <Mail size={16} />
                  </div>
                  <input 
                    type="email" 
                    placeholder="Email công việc"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-white/50 border border-white/60 rounded-2xl py-3 pl-12 pr-4 text-[#2F2F2F] placeholder:text-[#2F2F2F]/40 outline-none focus:border-[#D4AF37] focus:bg-white transition-all font-medium text-xs shadow-sm"
                    required
                  />
                </div>

                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#2F2F2F]/40 group-focus-within:text-[#D4AF37] transition-colors">
                    <Lock size={16} />
                  </div>
                  <input 
                    type="password" 
                    placeholder="Mật khẩu"
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                    className="w-full bg-white/50 border border-white/60 rounded-2xl py-3 pl-12 pr-4 text-[#2F2F2F] placeholder:text-[#2F2F2F]/40 outline-none focus:border-[#D4AF37] focus:bg-white transition-all font-medium text-xs shadow-sm"
                    required
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="relative overflow-hidden w-full py-3 rounded-full text-white font-bold uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 group disabled:opacity-50 transition-all shadow-[0_8px_20px_rgba(212,175,55,0.25)] hover:shadow-[0_12px_25px_rgba(212,175,55,0.35)]"
                style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #F5E0A3 50%, #B8860B 100%)' }}
              >
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                <span>Tạo tài khoản & Bắt đầu Trial</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="pt-4 text-center space-y-3">
              <p className="text-[10px] font-bold text-[#2F2F2F]/50 uppercase tracking-widest">
                Đã có tài khoản? <Link href="/login" className="text-[#D4AF37] hover:underline ml-1">Đăng nhập</Link>
              </p>
              
              {/* Zalo Support CTA */}
              <div className="pt-4 border-t border-[#D4AF37]/10 flex justify-center">
                <a href="https://zalo.me/0918731411" target="_blank" rel="noreferrer" 
                   className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-[#D4AF37] hover:text-[#B8860B] transition-colors">
                  <MessageCircle size={12} /> Hỗ trợ qua Zalo
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-bold text-[#2F2F2F]/40 uppercase tracking-[0.3em] hover:text-[#D4AF37] transition-colors">
            ← Trở về trang chủ
          </Link>
        </div>
      </motion.div>
    </main>
  )
}
