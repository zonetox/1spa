'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Mail, ArrowLeft, Send, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      })
      if (error) throw error
      setSent(true)
    } catch (error: any) {
      alert(error.message || 'Đã có lỗi xảy ra.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-luxury-gold/5 rounded-full blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass-card p-10 md:p-12 space-y-8 bg-zinc-900/20 backdrop-blur-3xl border border-white/5 rounded-[2rem]">
          <div className="text-center space-y-4">
             <h2 className="font-display text-2xl text-white italic">Khôi phục <span className="text-luxury-gold">Mật khẩu.</span></h2>
             <p className="text-xs text-zinc-500">Nhập email doanh nghiệp của bạn để nhận liên kết đặt lại mật khẩu.</p>
          </div>

          {!sent ? (
            <form onSubmit={handleReset} className="space-y-6">
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-luxury-gold transition-colors">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  placeholder="Email của bạn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-luxury-gold/50 transition-all font-sans"
                  required
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-luxury-gold text-black font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-3 hover:bg-white transition-all duration-500 group disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Gửi liên kết</span>
                    <Send size={18} />
                  </>
                )}
              </button>
            </form>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-6"
            >
              <div className="w-16 h-16 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto text-green-500">
                <Send size={30} />
              </div>
              <p className="text-sm text-zinc-300">Chúng tôi đã gửi một liên kết khôi phục tới <b>{email}</b>. Vui lòng kiểm tra hòm thư của bạn.</p>
              <button 
                onClick={() => setSent(false)}
                className="text-[10px] font-mono text-luxury-gold uppercase tracking-widest hover:underline"
              >
                Thử lại với email khác
              </button>
            </motion.div>
          )}

          <div className="pt-6 border-t border-white/5 text-center">
            <Link href="/login" className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest hover:text-white flex items-center justify-center gap-2">
              <ArrowLeft size={12} /> Trở về Đăng nhập
            </Link>
          </div>
        </div>
      </motion.div>

      <div className="absolute top-10 right-10 opacity-10"><Sparkles size={40} className="text-luxury-gold" /></div>
    </main>
  )
}
