'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Mail, Lock, ArrowRight, Sparkles, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { LotusIcon } from '@/components/ui/LotusIcon'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    const supabase = createClient()

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error
      
      if (data.user) {
        const { data: acc } = await supabase
          .from('accounts')
          .select('role')
          .eq('id', data.user.id)
          .maybeSingle()
          
        if (acc?.role === 'Admin') {
          window.location.href = '/admin'
        } else {
          window.location.href = '/dashboard'
        }
      }
    } catch (error: any) {
      setErrorMsg(error.message || 'Email hoặc mật khẩu không chính xác.')
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden" style={{ background: '#F9F6F0' }}>
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[100px] animate-pulse-gold opacity-40" style={{ background: '#D4AF37' }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-[100px] opacity-60" style={{ background: '#FFFFFF' }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="p-6 md:p-8 space-y-5 rounded-[2.5rem] shadow-2xl relative overflow-hidden"
             style={{ 
               background: 'rgba(255,255,255,0.6)', 
               backdropFilter: 'blur(16px)', 
               border: '1px solid rgba(255,255,255,0.8)' 
             }}>
             
          <div className="text-center space-y-3">
            <Link href="/" className="inline-block">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5 }}
                className="flex items-center justify-center"
              >
                <img 
                  src="/logo.png" 
                  alt="1BEAUTY.ASIA" 
                  className="h-9 w-auto object-contain" 
                />
              </motion.div>
            </Link>
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-[0.4em] mb-1">Cổng quản trị</span>
              <h1 className="text-2xl font-bold text-[#2F2F2F]" style={{ fontFamily: "'Playfair Display', serif" }}>Chào mừng trở lại</h1>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
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
                  <Mail size={16} />
                </div>
                <input 
                  type="email" 
                  placeholder="Email doanh nghiệp"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/50 border border-white/60 rounded-2xl py-3 pl-12 pr-4 text-[#2F2F2F] placeholder:text-[#2F2F2F]/40 outline-none focus:border-[#D4AF37] focus:bg-white transition-all font-medium text-xs shadow-sm"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] font-bold tracking-widest uppercase text-[#2F2F2F]/50">
              <label className="flex items-center gap-2 cursor-pointer hover:text-[#D4AF37] transition-colors">
                <input type="checkbox" className="rounded border-white/60 bg-white/50 accent-[#D4AF37] w-3 h-3" />
                Ghi nhớ
              </label>
              <Link href="/reset-password" title="Quên mật khẩu" className="hover:text-[#D4AF37] transition-colors">Quên mật khẩu?</Link>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="relative overflow-hidden w-full py-3 rounded-full text-white font-bold uppercase tracking-[0.3em] text-[10px] flex items-center justify-center gap-3 group disabled:opacity-50 transition-all shadow-[0_8px_20px_rgba(212,175,55,0.25)] hover:shadow-[0_12px_25px_rgba(212,175,55,0.35)]"
              style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #F5E0A3 50%, #B8860B 100%)' }}
            >
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Đăng nhập</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="pt-5 border-t border-[#D4AF37]/10 text-center space-y-3">
            <p className="text-[10px] text-[#2F2F2F]/50 font-bold uppercase tracking-widest">Chưa có tài khoản?</p>
            <Link href="/signup" className="block">
              <button className="w-full py-3 rounded-full border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#D4AF37]/5 transition-all">
                Đăng ký dùng thử 30 ngày
              </button>
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-bold text-[#2F2F2F]/40 uppercase tracking-[0.3em] hover:text-[#D4AF37] transition-colors">
            Trở về trang chủ
          </Link>
        </div>
      </motion.div>

      {/* Decorative Sparkles */}
      <div className="absolute top-10 right-10 opacity-40"><Sparkles size={40} className="text-[#D4AF37]" /></div>
      <div className="absolute bottom-10 left-10 opacity-30"><Sparkles size={60} className="text-[#D4AF37]" /></div>
    </main>
  )
}
