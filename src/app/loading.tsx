'use client'

import React from 'react'
import { motion } from 'framer-motion'

export default function RootLoading() {
  return (
    <div className="min-h-screen z-50 flex flex-col items-center justify-center relative overflow-hidden" style={{ background: '#F9F6F0' }}>
      
      {/* Decorative Gold Blobs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full blur-[120px] opacity-20" style={{ background: '#D4AF37' }} />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-[140px] opacity-30" style={{ background: '#FFFFFF' }} />

      <div className="relative flex flex-col items-center z-10">
        
        {/* Glowing luxury outer spinner */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
            className="absolute inset-0 rounded-full border-[3px] border-[#D4AF37]/10 border-t-[#D4AF37]"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
            className="absolute w-16 h-16 rounded-full border-[2px] border-dashed border-[#D4AF37]/20 border-b-[#D4AF37]/60"
          />
          
          {/* Logo Mark placeholder inside */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center shadow-lg shadow-[#D4AF37]/20">
            <span className="text-[10px] font-bold text-white tracking-tighter">1S</span>
          </div>
        </div>

        <motion.p 
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="mt-8 text-[#D4AF37] font-bold tracking-[0.4em] uppercase text-[10px]"
        >
          Đang kết nối không gian...
        </motion.p>
        
        <p className="mt-2 text-[#2F2F2F]/40 text-[9px] uppercase tracking-widest font-medium">1Beauty.Asia Luxury Platform</p>
      </div>
    </div>
  )
}
