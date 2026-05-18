'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Sparkles, Shield } from 'lucide-react'

import { completeOnboarding } from '@/services/onboarding'

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showMockWarning, setShowMockWarning] = useState(false)
  const [formData, setFormData] = useState({
    business_name: '',
    major: 'Spa',
    specialization: '',
    bio: ''
  })

  const nextStep = () => setStep(s => s + 1)
  const prevStep = () => setStep(s => s - 1)

  async function handleSubmit() {
    setIsSubmitting(true)
    const isMock = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('YOUR_PROJECT_ID');
    if (isMock) setShowMockWarning(true)

    const finalData = new FormData()
    Object.entries(formData).forEach(([k, v]) => finalData.append(k, v))

    try {
      await completeOnboarding(finalData)
    } catch (err) {
      console.error(err)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F9F6F0] text-[#2F2F2F] flex items-center justify-center p-6 selection:bg-[#D4AF37]/20 overflow-hidden relative">
      {/* Sovereign Ambient Background */}
      <div className="absolute inset-0 z-0">
         <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[140px] animate-pulse" />
         <div className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '3s' }} />
      </div>
      
      <div className="relative z-10 max-w-xl w-full">
        <AnimatePresence mode="wait">
          <motion.div 
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
            className="bg-white/90 backdrop-blur-xl p-12 md:p-16 space-y-12 border border-[#D4AF37]/20 rounded-[2rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)]"
          >
            {/* Ritual Step Indicator */}
            <div className="flex justify-center gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="relative h-1 w-12 bg-[#EFE9DD] rounded-full overflow-hidden">
                  {step >= i && (
                    <motion.div 
                      layoutId="step-bar"
                      className="absolute inset-0 bg-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.5)]"
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Step 1: Identity */}
            {step === 1 && (
              <div className="space-y-10">
                <div className="space-y-3 text-center">
                  <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-[#2F2F2F]">The First Mark.</h1>
                  <p className="text-[#2F2F2F]/60 text-[10px] font-mono uppercase tracking-[0.4em] italic leading-relaxed">
                    "Hành trình làm đẹp bắt đầu từ một cái tên. <br/> Tài khoản được bảo mật với giao thức OTP/Magic Link."
                  </p>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-mono text-[#2F2F2F]/40 uppercase tracking-[0.3em] ml-1">Tên Doanh Nghiệp / Thương Hiệu</label>
                  <input 
                    value={formData.business_name}
                    onChange={e => setFormData({...formData, business_name: e.target.value})}
                    type="text" 
                    placeholder="e.g. Royal Spa"
                    className="w-full bg-[#FDFBF7] border border-[#D4AF37]/20 rounded-2xl px-8 py-5 text-xl text-[#2F2F2F] focus:border-[#D4AF37] focus:bg-white outline-none transition-all placeholder:text-[#2F2F2F]/20 font-serif"
                  />
                </div>
                <button onClick={nextStep} disabled={!formData.business_name} className="premium-button w-full py-6 flex items-center justify-center gap-4 group">
                  <span className="text-sm tracking-widest">TIẾP TỤC ĐẾN LĨNH VỰC</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}

            {/* Step 2: The Domain of Impact */}
            {step === 2 && (
              <div className="space-y-10">
                <div className="space-y-3 text-center">
                  <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-[#2F2F2F]">The Domain.</h1>
                  <p className="text-[#2F2F2F]/60 text-[10px] font-mono uppercase tracking-[0.4em] italic leading-relaxed">
                    "Define the territory where your <br/> professional excellence resonates."
                  </p>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-[#2F2F2F]/40 uppercase tracking-[0.3em] ml-1">Lĩnh vực hoạt động</label>
                    <div className="relative group">
                      <select 
                        value={formData.major}
                        onChange={e => setFormData({...formData, major: e.target.value})}
                        className="w-full bg-[#FDFBF7] border border-[#D4AF37]/20 rounded-2xl px-8 py-5 text-lg text-[#2F2F2F] outline-none appearance-none cursor-pointer focus:border-[#D4AF37] focus:bg-white transition-all font-serif"
                      >
                        <option value="Spa">Spa</option>
                        <option value="Beauty">Beauty</option>
                        <option value="Dental">Dental</option>
                      </select>
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-[#2F2F2F]/40 group-hover:text-[#D4AF37] transition-colors">
                        <ArrowRight size={16} className="rotate-90" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-[#2F2F2F]/40 uppercase tracking-[0.3em] ml-1">Chuyên ngành / Thế mạnh</label>
                    <input 
                      value={formData.specialization}
                      onChange={e => setFormData({...formData, specialization: e.target.value})}
                      type="text" 
                      placeholder="e.g. Trị liệu chuyên sâu"
                      className="w-full bg-[#FDFBF7] border border-[#D4AF37]/20 rounded-2xl px-8 py-5 text-lg text-[#2F2F2F] focus:border-[#D4AF37] focus:bg-white outline-none transition-all placeholder:text-[#2F2F2F]/20 font-serif"
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                   <button onClick={prevStep} className="w-1/3 py-6 border border-[#EFE9DD] rounded-2xl text-[10px] font-mono text-[#2F2F2F]/60 uppercase tracking-widest hover:bg-[#FDFBF7] transition-colors">Quay lại</button>
                   <button onClick={nextStep} disabled={!formData.specialization} className="premium-button flex-1 py-6 flex items-center justify-center gap-4 group">
                      <span className="text-sm tracking-widest">TIẾP TỤC</span>
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                   </button>
                </div>
              </div>
            )}

            {/* Step 3: The Ritual of Purpose */}
            {step === 3 && (
              <div className="space-y-10">
                <div className="space-y-3 text-center">
                  <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-[#2F2F2F]">The Legacy.</h1>
                  <p className="text-[#2F2F2F]/60 text-[10px] font-mono uppercase tracking-[0.4em] italic leading-relaxed">
                    "Seal your professional purpose <br/> within the immutable repository."
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-[#2F2F2F]/40 uppercase tracking-[0.3em] ml-1">Mô tả ngắn về doanh nghiệp</label>
                  <textarea 
                    value={formData.bio}
                    onChange={e => setFormData({...formData, bio: e.target.value})}
                    placeholder="Describe your execution logic and the legacy you wish to build..."
                    rows={6}
                    className="w-full bg-[#FDFBF7] border border-[#D4AF37]/20 rounded-2xl px-8 py-5 text-sm text-[#2F2F2F] focus:border-[#D4AF37] focus:bg-white outline-none transition-all resize-none placeholder:text-[#2F2F2F]/20 font-serif leading-relaxed"
                  />
                </div>
                
                <div className="space-y-6">
                   <div className="flex gap-4">
                      <button onClick={prevStep} className="w-1/3 py-6 border border-[#EFE9DD] rounded-2xl text-[10px] font-mono text-[#2F2F2F]/60 uppercase tracking-widest hover:bg-[#FDFBF7] transition-colors">Quay lại</button>
                      <button 
                        onClick={handleSubmit} 
                        disabled={isSubmitting || formData.bio.length < 20} 
                        className="premium-button flex-1 py-6 flex items-center justify-center gap-4 group relative overflow-hidden"
                      >
                         <AnimatePresence>
                           {isSubmitting && (
                             <motion.div 
                               initial={{ opacity: 0 }}
                               animate={{ opacity: 1 }}
                               className="absolute inset-0 bg-white/10 animate-pulse" 
                             />
                           )}
                         </AnimatePresence>
                         <Sparkles size={18} className={isSubmitting ? 'animate-spin' : ''} />
                         <span className="text-sm tracking-widest">{isSubmitting ? 'ĐANG KHỞI TẠO...' : 'XÁC NHẬN ĐĂNG KÝ'}</span>
                      </button>
                   </div>
                   
                   {showMockWarning && (
                     <motion.p 
                       initial={{ opacity: 0 }} 
                       animate={{ opacity: 1 }} 
                       className="text-[10px] font-mono text-[#D4AF37] text-center uppercase tracking-[0.3em] animate-pulse"
                     >
                        Đang khởi tạo tài khoản đối tác...
                     </motion.p>
                   )}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
