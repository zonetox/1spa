'use client'
import toast from 'react-hot-toast';

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Edit2, Trash2, Check, X, Shield, Settings, Info } from 'lucide-react'
import { confirmAction } from '@/lib/confirm'

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPackage, setEditingPackage] = useState<any>(null)
  
  // Form State
  const [name, setName] = useState('')
  const [price, setPrice] = useState(0)
  const [trialDays, setTrialDays] = useState(0)
  const [durationDays, setDurationDays] = useState(365)
  const [maxBlogs, setMaxBlogs] = useState(3)
  const [features, setFeatures] = useState<string[]>([''])

  const supabase = createClient()

  const getAuthToken = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    return session?.access_token
  }

  useEffect(() => {
    fetchPackages()
  }, [])

  const fetchPackages = async () => {
    setLoading(true)
    try {
      const token = await getAuthToken()
      const response = await fetch('/api/admin/packages', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      if (data && !data.error) setPackages(data)
    } catch (err) {
      console.error('Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (pkg: any = null) => {
    if (pkg) {
      setEditingPackage(pkg)
      setName(pkg.name)
      setPrice(pkg.price)
      setTrialDays(pkg.trial_days)
      setDurationDays(pkg.duration_days)
      setMaxBlogs(pkg.limits?.max_blogs || 3)
      setFeatures(pkg.features || [''])
    } else {
      setEditingPackage(null)
      setName('')
      setPrice(0)
      setTrialDays(0)
      setDurationDays(365)
      setMaxBlogs(3)
      setFeatures([''])
    }
    setIsModalOpen(true)
  }

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...features]
    newFeatures[index] = value
    setFeatures(newFeatures)
  }

  const addFeatureRow = () => setFeatures([...features, ''])
  const removeFeatureRow = (index: number) => setFeatures(features.filter((_, i) => i !== index))

  const handleSave = async () => {
    const validFeatures = features.filter(f => f.trim() !== '')
    const payload = {
      name,
      price,
      trial_days: trialDays,
      duration_days: durationDays,
      limits: { max_blogs: maxBlogs },
      features: validFeatures
    }

    const token = await getAuthToken()
    const method = editingPackage ? 'PUT' : 'POST'
    const body = editingPackage ? { ...payload, id: editingPackage.id } : payload

    try {
      const response = await fetch('/api/admin/packages', {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      })
      
      const result = await response.json()
      if (result.error) throw new Error(result.error)
      
      setIsModalOpen(false)
      fetchPackages()
    } catch (err: any) {
      toast.error(`Lỗi: ${err.message}`)
    }
  }

  const handleDelete = async (id: string) => {
    const confirmed = await confirmAction('Bạn có chắc muốn xoá gói này không?')
    if (!confirmed) return
    
    const token = await getAuthToken()
    try {
      const response = await fetch(`/api/admin/packages?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const result = await response.json()
      if (result.error) throw new Error(result.error)
      fetchPackages()
    } catch (err: any) {
      toast.error(`Lỗi: ${err.message}`)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-[#2F2F2F]">Cấu Hình Gói Dịch Vụ (SaaS Plans)</h2>
          <p className="text-xs text-[#2F2F2F]/60 mt-1">Định hình các gói thành viên hội viên và thiết lập giới hạn tính năng (Blogs, Quota) tương ứng.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#D4AF37] text-white hover:bg-[#C59B27] transition rounded-lg text-xs font-semibold shadow-sm"
        >
          <Plus size={14} /> Thêm Gói Mới
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-[#2F2F2F]/60 text-xs font-mono animate-pulse">Đang tải danh sách gói cước...</div>
      ) : packages.length === 0 ? (
        <div className="p-12 text-center text-[#2F2F2F]/60 text-xs font-mono">Chưa cấu hình gói cước nào. Nhấn nút "Thêm Gói Mới" để bắt đầu.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map(pkg => (
            <div key={pkg.id} className="bg-white border border-[#D4AF37]/10 rounded-2xl p-6 space-y-5 flex flex-col justify-between shadow-sm">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <h3 className="font-bold text-lg text-[#2F2F2F] font-display">{pkg.name}</h3>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => handleOpenModal(pkg)} 
                      className="p-1.5 rounded hover:bg-[#FDFBF7] text-[#2F2F2F]/40 hover:text-[#D4AF37] transition"
                      title="Sửa"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button 
                      onClick={() => handleDelete(pkg.id)} 
                      className="p-1.5 rounded hover:bg-[#FDFBF7] text-[#2F2F2F]/40 hover:text-red-600 transition"
                      title="Xóa"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#D4AF37] font-mono">{pkg.price.toLocaleString('vi-VN')}đ</p>
                  <p className="text-[10px] text-[#2F2F2F]/40 mt-1 font-mono uppercase tracking-wider">
                    Chu kỳ: {pkg.duration_days} ngày | Trial: {pkg.trial_days} ngày
                  </p>
                </div>
                <div className="pt-4 border-t border-[#D4AF37]/5 space-y-2">
                  <p className="text-[10px] font-mono text-[#2F2F2F]/60 uppercase tracking-widest flex items-center gap-1">
                    <Settings size={11} /> Giới hạn tính năng:
                  </p>
                  <div className="text-xs text-[#2F2F2F]/80 bg-[#FDFBF7] px-3 py-2 rounded-lg font-mono">
                    Tối đa {pkg.limits?.max_blogs || 3} bài viết (Blogs)
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <p className="text-[10px] font-mono text-[#2F2F2F]/60 uppercase tracking-widest flex items-center gap-1">
                  <Info size={11} /> Đặc quyền đi kèm:
                </p>
                <ul className="space-y-1.5 pl-1">
                  {(pkg.features || []).map((f: string, i: number) => (
                    <li key={i} className="text-xs text-[#2F2F2F]/80 flex items-start gap-2 leading-relaxed">
                      <Check size={12} className="text-emerald-600 mt-0.5 shrink-0" /> 
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Save / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white border border-[#D4AF37]/10 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-[#D4AF37]/10 p-5 flex justify-between items-center z-10">
              <div>
                <h3 className="font-display font-bold text-lg text-[#2F2F2F]">
                  {editingPackage ? 'Cập Nhật Cấu Hình Gói' : 'Tạo Gói SaaS Mới'}
                </h3>
                <p className="text-xs text-[#2F2F2F]/40 font-mono mt-1">Cấu hình các chỉ số hạn mức của gói cước</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-[#2F2F2F]/40 hover:text-[#2F2F2F] rounded-lg hover:bg-[#FDFBF7] transition">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-5 space-y-6">
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs text-[#2F2F2F]/60">Tên gói cước</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    placeholder="VD: Premium Luxury" 
                    className="w-full bg-[#FDFBF7] border border-[#D4AF37]/10 rounded-lg px-3 py-2 text-sm text-[#2F2F2F] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-[#2F2F2F]/60">Giá thành (VNĐ)</label>
                    <input 
                      type="number" 
                      value={price} 
                      onChange={e => setPrice(Number(e.target.value))} 
                      className="w-full bg-[#FDFBF7] border border-[#D4AF37]/10 rounded-lg px-3 py-2 text-sm text-[#2F2F2F] focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-[#2F2F2F]/60">Dùng thử (Số ngày)</label>
                    <input 
                      type="number" 
                      value={trialDays} 
                      onChange={e => setTrialDays(Number(e.target.value))} 
                      className="w-full bg-[#FDFBF7] border border-[#D4AF37]/10 rounded-lg px-3 py-2 text-sm text-[#2F2F2F] focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-[#2F2F2F]/60">Thời hạn chu kỳ (Số ngày)</label>
                    <input 
                      type="number" 
                      value={durationDays} 
                      onChange={e => setDurationDays(Number(e.target.value))} 
                      className="w-full bg-[#FDFBF7] border border-[#D4AF37]/10 rounded-lg px-3 py-2 text-sm text-[#2F2F2F] focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-[#2F2F2F]/60">Hạn mức viết Blog (Quota)</label>
                    <input 
                      type="number" 
                      value={maxBlogs} 
                      onChange={e => setMaxBlogs(Number(e.target.value))} 
                      className="w-full bg-[#FDFBF7] border border-[#D4AF37]/10 rounded-lg px-3 py-2 text-sm text-[#2F2F2F] focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <label className="text-xs text-[#2F2F2F]/60 block">Đặc quyền đi kèm (Features)</label>
                  <div className="space-y-2">
                    {features.map((feature, index) => (
                      <div key={index} className="flex gap-2">
                        <input 
                          type="text" 
                          value={feature} 
                          onChange={e => handleFeatureChange(index, e.target.value)} 
                          className="flex-1 bg-[#FDFBF7] border border-[#D4AF37]/10 rounded-lg px-3 py-2 text-xs text-[#2F2F2F] focus:border-[#D4AF37] focus:outline-none"
                          placeholder="VD: Bản đồ tích hợp chỉ đường Google Maps" 
                        />
                        <button 
                          onClick={() => removeFeatureRow(index)} 
                          className="p-2 text-[#2F2F2F]/40 hover:text-red-600 hover:bg-[#FDFBF7] rounded-lg transition"
                        >
                          <Trash2 size={14}/>
                        </button>
                      </div>
                    ))}
                    <button 
                      onClick={addFeatureRow} 
                      className="text-xs text-[#D4AF37] hover:text-[#C59B27] font-semibold transition"
                    >
                      + Thêm dòng đặc quyền
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-3 justify-end border-t border-[#D4AF37]/10">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-lg text-sm font-medium bg-[#FDFBF7] text-[#2F2F2F]/60 hover:text-[#2F2F2F] hover:bg-[#FDFBF7]/80 transition border border-[#D4AF37]/10"
                >
                  Hủy bỏ
                </button>
                <button 
                  onClick={handleSave}
                  className="px-5 py-2.5 rounded-lg text-sm font-medium bg-[#D4AF37] text-white hover:bg-[#C59B27] transition"
                >
                  Lưu Cấu Hình
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
