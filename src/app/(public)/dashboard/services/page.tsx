'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Edit2, Trash2, Check, X, UploadCloud, Link as LinkIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function BusinessServicesPage() {
  const [services, setServices] = useState<any[]>([])
  const [landingPage, setLandingPage] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  
  // Form State
  const [serviceName, setServiceName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [inputType, setInputType] = useState<'url' | 'upload'>('url')

  const supabase = createClient()

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      window.location.href = '/login'
      return
    }

    const { data: prof } = await supabase.from('business_profiles').select('*').eq('account_id', user.id).single()
    if (prof) {
      const { data: lp } = await supabase.from('landing_pages').select('*').eq('business_id', prof.id).single()
      if (lp) {
        setLandingPage(lp)
        const servicesMenu = lp.content_json?.services_menu || []
        setServices(servicesMenu)
      }
    }
    setLoading(false)
  }

  const handleOpenModal = (index: number | null = null) => {
    if (index !== null) {
      const srv = services[index]
      setEditingIndex(index)
      setServiceName(srv.service_name || '')
      setDescription(srv.description || '')
      setPrice(srv.price || '')
      setImageUrl(srv.image_url || '')
    } else {
      setEditingIndex(null)
      setServiceName('')
      setDescription('')
      setPrice('')
      setImageUrl('')
    }
    setIsModalOpen(true)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    const file = e.target.files[0]
    setUploadingImage(true)
    
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `services/${fileName}`

    const { error: uploadError } = await supabase.storage.from('public_images').upload(filePath, file)
    
    if (uploadError) {
      alert('Lỗi upload: ' + uploadError.message)
    } else {
      const { data } = supabase.storage.from('public_images').getPublicUrl(filePath)
      setImageUrl(data.publicUrl)
    }
    setUploadingImage(false)
  }

  const handleSave = async () => {
    if (!landingPage) return

    const newService = {
      service_name: serviceName,
      description,
      price,
      image_url: imageUrl || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80'
    }

    let updatedServices = [...services]
    if (editingIndex !== null) {
      updatedServices[editingIndex] = newService
    } else {
      updatedServices.push(newService)
    }

    const updatedContentJson = {
      ...landingPage.content_json,
      services_menu: updatedServices
    }

    const { error } = await supabase.from('landing_pages').update({ content_json: updatedContentJson }).eq('id', landingPage.id)

    if (!error) {
      setServices(updatedServices)
      setLandingPage({ ...landingPage, content_json: updatedContentJson })
      setIsModalOpen(false)
    } else {
      alert('Lỗi lưu dịch vụ')
    }
  }

  const handleDelete = async (index: number) => {
    if (confirm('Bạn có chắc muốn xoá dịch vụ này không?')) {
      const updatedServices = services.filter((_, i) => i !== index)
      const updatedContentJson = {
        ...landingPage.content_json,
        services_menu: updatedServices
      }
      const { error } = await supabase.from('landing_pages').update({ content_json: updatedContentJson }).eq('id', landingPage.id)
      if (!error) {
        setServices(updatedServices)
        setLandingPage({ ...landingPage, content_json: updatedContentJson })
      }
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-[#F9F6F0] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-[#F9F6F0] pt-24 pb-12 px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <div className="flex items-center justify-between">
          <div>
            <Link href="/dashboard" className="text-zinc-500 hover:text-[#D4AF37] text-sm font-mono mb-2 inline-block">← Trở về Dashboard</Link>
            <h1 className="text-3xl font-display text-[#2F2F2F]">Quản lý Dịch vụ / Sản phẩm</h1>
            <p className="text-zinc-500 mt-2">Dữ liệu ở đây sẽ được hiển thị trực tiếp lên Landing Page của bạn.</p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#D4AF37] via-[#F5E0A3] to-[#B8860B] text-[#2F2F2F] rounded-xl text-sm font-bold shadow-md hover:brightness-110 transition-all"
          >
            <Plus size={16} /> Thêm Dịch Vụ
          </button>
        </div>

        <div className="bg-white rounded-[2rem] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-[#D4AF37]/20 p-8">
          {services.length === 0 ? (
            <div className="text-center py-16 text-zinc-400 font-mono text-sm uppercase tracking-widest">
              Bạn chưa có dịch vụ nào. Hãy thêm ngay!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.map((srv, index) => (
                <div key={index} className="flex gap-4 border border-zinc-100 rounded-2xl p-4 hover:shadow-lg transition-shadow group">
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-zinc-100">
                    <Image src={srv.image_url} alt={srv.service_name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className="font-bold text-[#2F2F2F] text-lg leading-tight">{srv.service_name}</h3>
                    <p className="text-[#D4AF37] font-bold">{srv.price}</p>
                    <p className="text-xs text-zinc-500 line-clamp-2">{srv.description}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button onClick={() => handleOpenModal(index)} className="p-2 text-zinc-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 size={16}/></button>
                    <button onClick={() => handleDelete(index)} className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16}/></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-[#2F2F2F]/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-[2rem] p-8 max-w-md w-full max-h-[90vh] overflow-y-auto border border-[#D4AF37]/20 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-display text-[#2F2F2F]">{editingIndex !== null ? 'Sửa Dịch Vụ' : 'Thêm Dịch Vụ Mới'}</h2>
                <button onClick={() => setIsModalOpen(false)}><X size={24} className="text-zinc-400 hover:text-[#2F2F2F]"/></button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-[#2F2F2F] mb-1">Tên dịch vụ/sản phẩm</label>
                  <input type="text" value={serviceName} onChange={e => setServiceName(e.target.value)} className="w-full p-3 rounded-xl border border-zinc-200 focus:border-[#D4AF37] outline-none" placeholder="VD: Gội đầu dưỡng sinh" />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-[#2F2F2F] mb-1">Giá hiển thị</label>
                  <input type="text" value={price} onChange={e => setPrice(e.target.value)} className="w-full p-3 rounded-xl border border-zinc-200 focus:border-[#D4AF37] outline-none" placeholder="VD: 150.000đ hoặc Liên hệ" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#2F2F2F] mb-1">Mô tả ngắn</label>
                  <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full p-3 rounded-xl border border-zinc-200 focus:border-[#D4AF37] outline-none h-24 resize-none" placeholder="Mô tả công dụng, lợi ích..." />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#2F2F2F] mb-2">Hình ảnh</label>
                  <div className="flex bg-zinc-100 rounded-lg p-1 mb-3">
                    <button 
                      onClick={() => setInputType('url')}
                      className={`flex-1 py-2 text-xs font-bold rounded-md flex items-center justify-center gap-2 ${inputType === 'url' ? 'bg-white shadow-sm text-[#D4AF37]' : 'text-zinc-500 hover:text-zinc-700'}`}
                    >
                      <LinkIcon size={14} /> Dùng Link (URL)
                    </button>
                    <button 
                      onClick={() => setInputType('upload')}
                      className={`flex-1 py-2 text-xs font-bold rounded-md flex items-center justify-center gap-2 ${inputType === 'upload' ? 'bg-white shadow-sm text-[#D4AF37]' : 'text-zinc-500 hover:text-zinc-700'}`}
                    >
                      <UploadCloud size={14} /> Tải ảnh lên
                    </button>
                  </div>

                  {inputType === 'url' ? (
                    <input 
                      type="text" 
                      value={imageUrl} 
                      onChange={e => setImageUrl(e.target.value)} 
                      className="w-full p-3 rounded-xl border border-zinc-200 focus:border-[#D4AF37] outline-none text-xs" 
                      placeholder="https://example.com/image.jpg" 
                    />
                  ) : (
                    <div className="border-2 border-dashed border-zinc-200 rounded-xl p-6 text-center hover:border-[#D4AF37] transition-colors relative cursor-pointer bg-zinc-50">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileUpload} 
                        disabled={uploadingImage}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      {uploadingImage ? (
                        <div className="flex flex-col items-center">
                          <div className="w-6 h-6 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mb-2" />
                          <span className="text-xs text-zinc-500 font-mono">Đang tải lên...</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <UploadCloud size={24} className="text-zinc-400 mb-2" />
                          <span className="text-xs text-zinc-500 font-mono">Bấm để tải ảnh từ máy tính</span>
                        </div>
                      )}
                    </div>
                  )}
                  {imageUrl && (
                    <div className="mt-4 relative aspect-[16/9] rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200">
                      <Image src={imageUrl} alt="Preview" fill className="object-cover" />
                    </div>
                  )}
                </div>

                <div className="pt-6">
                  <button onClick={handleSave} className="w-full py-3 bg-[#D4AF37] text-white rounded-xl font-bold uppercase tracking-widest hover:bg-[#B8860B] transition-colors">
                    {editingIndex !== null ? 'Cập Nhật Dịch Vụ' : 'Lưu Dịch Vụ'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
