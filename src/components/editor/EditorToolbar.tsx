'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Save, X, Eye, Sparkles, Loader2 } from 'lucide-react'

interface EditorToolbarProps {
  onSave: () => void
  onCancel: () => void
  isSaving: boolean
  hasChanges: boolean
}

export const EditorToolbar = ({ onSave, onCancel, isSaving, hasChanges }: EditorToolbarProps) => {
  return (
    <motion.div 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-full max-w-2xl px-6"
    >
      <div className="bg-zinc-950/80 backdrop-blur-3xl border border-white/10 rounded-2xl p-4 flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-luxury-gold/10 flex items-center justify-center text-luxury-gold">
            <Sparkles size={20} />
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Chế độ chỉnh sửa</p>
            <p className="text-xs font-bold text-white uppercase tracking-wider">Visual Editor Lite</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-[10px] font-mono uppercase tracking-widest text-zinc-400 hover:text-white transition-colors"
          >
            Hủy bỏ
          </button>
          
          <button 
            onClick={onSave}
            disabled={!hasChanges || isSaving}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg text-[10px] font-mono uppercase tracking-widest font-bold transition-all shadow-lg ${
              hasChanges 
                ? 'bg-luxury-gold text-black hover:bg-white shadow-luxury-gold/20' 
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
            }`}
          >
            {isSaving ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Save size={14} />
            )}
            <span>Lưu thay đổi</span>
          </button>
        </div>
      </div>
      
      <AnimatePresence>
        {hasChanges && !isSaving && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-luxury-gold px-4 py-1 rounded-full shadow-lg"
          >
            <p className="text-[8px] font-mono font-bold text-black uppercase tracking-tighter">Bạn có thay đổi chưa lưu *</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
