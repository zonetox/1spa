'use client'

import React from 'react'
import toast from 'react-hot-toast';
import Image from 'next/image'
import { useFileUpload } from '@/hooks/useFileUpload'
import { createClient } from '@/lib/supabase/client'
import { Camera, Save, Loader2 } from 'lucide-react'

export function ProfileSettings({ profile, onUpdate }: { profile: any, onUpdate: (data: any) => void }) {
  const [isSaving, setIsSaving] = React.useState(false)
  const [form, setForm] = React.useState(profile)
  const { uploadFile, isUploading } = useFileUpload()
  const supabase = createClient()

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const url = await uploadFile(file, 'public_images', field === 'logo_url' ? 'logos' : 'avatars')
      if (url) {
        setForm({ ...form, [field]: url })
      }
    } catch (err: any) {
      toast(err.message)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    const { error } = await supabase
      .from('business_profiles')
      .update({
        business_name: form.business_name,
        slug: form.slug,
        category: form.category,
        location_city: form.location_city,
        location_district: form.location_district,
        zalo_phone: form.zalo_phone,
        hotline: form.hotline,
        logo_url: form.logo_url
      })
      .eq('id', profile.id)

    setIsSaving(false)
    if (!error) {
      toast.success('Cập nhật thành công!')
      onUpdate(form)
    } else {
      toast('Lỗi: ' + error.message)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-zinc-900 p-6 rounded-xl border border-zinc-800">
      <div className="flex items-center gap-6 pb-6 border-b border-zinc-800">
        <div className="relative group">
          <div className="w-24 h-24 rounded-lg bg-zinc-800 border border-zinc-700 overflow-hidden">
            {form.logo_url ? (
              <Image src={form.logo_url} alt="Logo" width={96} height={96} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs text-center p-2">No Logo</div>
            )}
          </div>
          <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
            <Camera size={20} className="text-white" />
            <input type="file" className="hidden" onChange={(e) => handleUpload(e, 'logo_url')} disabled={isUploading} />
          </label>
        </div>
        <div>
          <h3 className="text-lg font-bold text-zinc-100">{form.business_name || 'Tên doanh nghiệp'}</h3>
          <p className="text-xs text-zinc-500">Cập nhật logo và thông tin cơ bản của bạn</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Tên Thương Hiệu</label>
          <input 
            value={form.business_name} 
            onChange={e => setForm({...form, business_name: e.target.value})}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm text-zinc-100 focus:border-amber-500/50 outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Đường dẫn (Slug)</label>
          <input 
            value={form.slug} 
            onChange={e => setForm({...form, slug: e.target.value})}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm text-zinc-100 focus:border-amber-500/50 outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Lĩnh vực (Pillar)</label>
          <select 
            value={form.category} 
            onChange={e => setForm({...form, category: e.target.value})}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm text-zinc-100 focus:border-amber-500/50 outline-none"
          >
            <option value="Spa">Spa</option>
            <option value="Beauty">Beauty</option>
            <option value="Dental">Dental</option>
          </select>
        </div>
      </div>

      <button 
        type="submit" 
        disabled={isSaving || isUploading}
        className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
      >
        {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
        Lưu Thay Đổi
      </button>
    </form>
  )
}
