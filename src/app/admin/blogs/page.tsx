'use client'
import toast from 'react-hot-toast';
import { confirmAction } from '@/lib/confirm';
import Image from 'next/image'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { 
  FileText, Plus, Check, Trash2, Image as ImageIcon, 
  RefreshCw, ChevronDown, AlertCircle 
} from 'lucide-react'

type Business = { id: string; business_name: string }
type Category = { id: string; name: string; slug: string }
type Blog = {
  id: string
  title: string
  content: string
  image_url: string | null
  category_id: string | null
  status: string
  created_at: string
}

export default function AdminBlogsPage() {
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [selectedBiz, setSelectedBiz] = useState<Business | null>(null)
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [maxBlogs, setMaxBlogs] = useState(3)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [newCategory, setNewCategory] = useState('')
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [showForm, setShowForm] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    // Fetch businesses
    supabase
      .from('business_profiles')
      .select('id, business_name')
      .order('business_name')
      .then(({ data }) => {
        setBusinesses(data || [])
      })

    // Fetch categories
    supabase
      .from('blog_categories')
      .select('*')
      .order('name')
      .then(({ data }) => {
        setCategories(data || [])
        setLoading(false)
      })
  }, [])

  const getAuthToken = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    return session?.access_token
  }

  async function selectBusiness(biz: Business) {
    setSelectedBiz(biz)
    setShowForm(false)
    setLoading(true)

    try {
      const token = await getAuthToken()
      const response = await fetch(`/api/admin/blogs?businessId=${biz.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const blogData = await response.json()
      if (blogData && !blogData.error) setBlogs(blogData)
    } catch (err) {
      console.error('Fetch blogs error:', err)
    }

    // Fetch subscription quota for this business
    const { data: subData } = await supabase
      .from('subscriptions')
      .select('packages(limits)')
      .eq('business_id', biz.id)
      .in('status', ['Active', 'Pending'])
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (subData?.packages) {
      const limits = (subData.packages as any).limits
      setMaxBlogs(limits?.max_blogs ?? 3)
    } else {
      const { data: pkg } = await supabase.from('packages').select('limits').limit(1).single()
      setMaxBlogs(pkg?.limits?.max_blogs ?? 3)
    }
    setLoading(false)
  }

  async function saveBlog() {
    if (!selectedBiz) return
    if (!title.trim() || !content.trim()) {
      toast('Vui lòng nhập tiêu đề và nội dung bài viết.')
      return
    }
    if (blogs.length >= maxBlogs) {
      toast(`Doanh nghiệp đã đạt giới hạn ${maxBlogs} bài viết của gói hiện tại!`)
      return
    }

    setSaving(true)
    const slug = title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '') + '-' + Math.random().toString(36).substring(2, 5)

    const payload = {
      business_id: selectedBiz.id,
      title: title.trim(),
      slug,
      content: content.trim(),
      excerpt: excerpt.trim() || content.substring(0, 150) + '...',
      image_url: imageUrl.trim() || null,
      category_id: selectedCategory || null,
      status: 'Published'
    }

    const token = await getAuthToken()
    try {
      const response = await fetch('/api/admin/blogs', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })
      const result = await response.json()
      if (result.error) throw new Error(result.error)
      
      setBlogs(prev => [result, ...prev])
      setTitle('')
      setContent('')
      setImageUrl('')
      setExcerpt('')
      setSelectedCategory('')
      setShowForm(false)
    } catch (err: any) {
      toast.error(`Lỗi: ${err.message}`)
    }
    setSaving(false)
  }

  async function addCategory() {
    if (!newCategory.trim()) return
    const slug = newCategory.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '')
    
    const { data, error } = await supabase.from('blog_categories').insert([{
      name: newCategory.trim(),
      slug
    }]).select().single()

    if (error) {
      toast('Lỗi thêm danh mục: ' + error.message)
    } else {
      setCategories(prev => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)))
      setNewCategory('')
      setShowCategoryForm(false)
    }
  }

  async function deleteBlog(id: string) {
    if (!(await confirmAction('Xoá bài viết này?'))) return
    const token = await getAuthToken()
    try {
      const response = await fetch(`/api/admin/blogs?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const result = await response.json()
      if (result.error) throw new Error(result.error)
      setBlogs(prev => prev.filter(b => b.id !== id))
    } catch (err: any) {
      toast.error(`Lỗi: ${err.message}`)
    }
  }

  const isQuotaFull = blogs.length >= maxBlogs
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-[#2F2F2F]">Quản Lý Blog Doanh Nghiệp</h2>
        <p className="text-xs text-[#2F2F2F]/60 mt-1">Đăng bài viết chuẩn SEO cho các đối tác. Hệ thống kiểm soát hạn mức theo gói thành viên.</p>
      </div>

      {/* Business Selector */}
      <div className="bg-white border border-[#D4AF37]/10 rounded-xl p-4">
        <label className="text-[10px] font-mono text-[#2F2F2F]/60 uppercase tracking-widest block mb-2">Chọn Doanh Nghiệp</label>
        <div className="relative">
          <select
            className="w-full bg-[#FDFBF7] border border-[#D4AF37]/10 rounded-lg px-4 py-3 text-sm text-[#2F2F2F] focus:outline-none focus:border-[#D4AF37]/50 appearance-none cursor-pointer"
            onChange={e => {
              const biz = businesses.find(b => b.id === e.target.value)
              if (biz) selectBusiness(biz)
            }}
            defaultValue=""
          >
            <option value="" disabled>-- Chọn doanh nghiệp để quản lý bài viết --</option>
            {businesses.map(b => (
              <option key={b.id} value={b.id}>{b.business_name}</option>
            ))}
          </select>
          <ChevronDown size={16} className="absolute right-4 top-3.5 text-[#2F2F2F]/40 pointer-events-none" />
        </div>
      </div>

      {/* Blog Management Panel */}
      {selectedBiz && !loading && (
        <div className="space-y-4">
          {/* Quota Header */}
          <div className="bg-white border border-[#D4AF37]/10 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-[#2F2F2F]">{selectedBiz.business_name}</h3>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-[11px] text-[#2F2F2F]/60">Quota bài viết:</span>
                <div className="flex items-center gap-2">
                  <div className="w-40 h-2 bg-[#D4AF37]/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${isQuotaFull ? 'bg-red-500' : 'bg-[#D4AF37]'}`}
                      style={{ width: `${Math.min((blogs.length / maxBlogs) * 100, 100)}%` }}
                    />
                  </div>
                  <span className={`text-xs font-mono font-bold ${isQuotaFull ? 'text-red-600' : 'text-[#2F2F2F]/80'}`}>
                    {blogs.length} / {maxBlogs} bài
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              disabled={isQuotaFull && !showForm}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition ${
                isQuotaFull && !showForm
                  ? 'bg-[#D4AF37]/20 text-[#2F2F2F]/40 cursor-not-allowed'
                  : 'bg-[#D4AF37] text-white hover:bg-[#D4AF37]/80'
              }`}
            >
              <Plus size={16} />
              {showForm ? 'Đóng soạn thảo' : 'Viết Bài Mới'}
            </button>
          </div>

          {/* Quota Full Warning */}
          {isQuotaFull && !showForm && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <p>Doanh nghiệp này đã sử dụng hết {maxBlogs} bài viết trong gói. Cần nâng cấp gói để đăng thêm bài.</p>
            </div>
          )}

          {/* Blog Form */}
          {showForm && (
            <div className="bg-white border border-[#D4AF37]/10 rounded-xl p-6 space-y-4">
              <h4 className="font-semibold text-[#2F2F2F] border-b border-[#D4AF37]/10 pb-4">Trình Soạn Thảo Blog</h4>
              <div>
                <label className="text-[11px] text-[#2F2F2F]/60 font-mono uppercase tracking-wider block mb-1.5">Tiêu đề bài viết</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="VD: 5 Liệu Trình Chăm Sóc Da Cấp Ẩm Mùa Hè..."
                  className="w-full bg-[#FDFBF7] border border-[#D4AF37]/10 rounded-lg px-4 py-3 text-sm text-[#2F2F2F] placeholder-[#2F2F2F]/20 focus:outline-none focus:border-[#D4AF37]/50"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] text-[#2F2F2F]/60 font-mono uppercase tracking-wider block mb-1.5">Ảnh đại diện (URL)</label>
                  <div className="flex items-center bg-[#FDFBF7] border border-[#D4AF37]/10 rounded-lg overflow-hidden focus-within:border-[#D4AF37]/50">
                    <div className="px-3 py-3 text-[#2F2F2F]/40 border-r border-[#D4AF37]/10">
                      <ImageIcon size={16} />
                    </div>
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={e => setImageUrl(e.target.value)}
                      placeholder="https://example.com/thumbnail.jpg"
                      className="flex-1 px-4 py-3 text-sm text-[#2F2F2F]/80 bg-transparent placeholder-[#2F2F2F]/20 outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] text-[#2F2F2F]/60 font-mono uppercase tracking-wider block mb-1.5">Danh mục</label>
                  <div className="flex gap-2">
                    <select
                      value={selectedCategory}
                      onChange={e => setSelectedCategory(e.target.value)}
                      className="flex-1 bg-[#FDFBF7] border border-[#D4AF37]/10 rounded-lg px-4 py-3 text-sm text-[#2F2F2F]/80 focus:outline-none focus:border-[#D4AF37]/50"
                    >
                      <option value="">-- Chọn danh mục --</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                    <button 
                      onClick={() => setShowCategoryForm(!showCategoryForm)}
                      className="p-3 bg-[#D4AF37]/10 text-[#2F2F2F]/60 rounded-lg hover:text-[#D4AF37] transition"
                      title="Thêm danh mục mới"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {showCategoryForm && (
                <div className="flex gap-2 p-3 bg-[#FDFBF7] rounded-lg border border-[#D4AF37]/20">
                  <input
                    type="text"
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    placeholder="Tên danh mục mới..."
                    className="flex-1 bg-transparent text-sm text-[#2F2F2F] outline-none"
                  />
                  <button onClick={addCategory} className="px-4 py-1.5 bg-[#D4AF37] text-white text-[10px] font-bold uppercase rounded-md">Lưu</button>
                </div>
              )}

              <div>
                <label className="text-[11px] text-[#2F2F2F]/60 font-mono uppercase tracking-wider block mb-1.5">Mô tả ngắn (Excerpt)</label>
                <textarea
                  value={excerpt}
                  onChange={e => setExcerpt(e.target.value)}
                  placeholder="Tóm tắt ngắn gọn nội dung bài viết..."
                  className="w-full bg-[#FDFBF7] border border-[#D4AF37]/10 rounded-lg px-4 py-2 text-sm text-[#2F2F2F]/80 placeholder-[#2F2F2F]/20 focus:outline-none focus:border-[#D4AF37]/50 resize-none h-20"
                />
              </div>
              <div>
                <label className="text-[11px] text-[#2F2F2F]/60 font-mono uppercase tracking-wider block mb-1.5">Nội dung chi tiết</label>
                <textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="Viết nội dung chuẩn SEO tại đây. Hãy đảm bảo bài viết có ít nhất 300 từ..."
                  className="w-full bg-[#FDFBF7] border border-[#D4AF37]/10 rounded-lg px-4 py-3 text-sm text-[#2F2F2F]/80 placeholder-[#2F2F2F]/20 focus:outline-none focus:border-[#D4AF37]/50 resize-none h-40"
                />
                <p className="text-[10px] text-[#2F2F2F]/40 mt-1">{content.split(/\s+/).filter(Boolean).length} từ</p>
              </div>
              <div className="flex gap-3 pt-2 border-t border-[#D4AF37]/10">
                <button
                  onClick={saveBlog}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#D4AF37] text-white rounded-lg font-semibold text-sm hover:bg-[#D4AF37]/80 transition disabled:opacity-50"
                >
                  {saving ? <RefreshCw size={14} className="animate-spin" /> : <Check size={14} />}
                  Đăng Bài Ngay
                </button>
                <button onClick={() => setShowForm(false)} className="px-6 py-2.5 bg-[#D4AF37]/10 text-[#2F2F2F]/80 rounded-lg text-sm hover:bg-[#D4AF37]/20 transition">
                  Hủy
                </button>
              </div>
            </div>
          )}

          {/* Blogs List */}
          {blogs.length === 0 ? (
            <div className="text-center py-12 text-[#2F2F2F]/60 text-sm font-mono bg-white border border-[#D4AF37]/10 rounded-xl">
              Chưa có bài viết nào. Nhấn "Viết Bài Mới" để bắt đầu.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {blogs.map(blog => (
                <div key={blog.id} className="bg-white border border-[#D4AF37]/10 rounded-xl overflow-hidden">
                  {blog.image_url && (
                    <div className="h-36 bg-[#FDFBF7] overflow-hidden relative">
                      <Image src={blog.image_url} alt={blog.title} fill className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="p-4">
                    <h4 className="font-semibold text-[#2F2F2F] line-clamp-2 mb-2">{blog.title}</h4>
                    <p className="text-[#2F2F2F]/60 text-xs line-clamp-3 mb-4">{blog.content}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-[#2F2F2F]/40 font-mono">
                        {new Date(blog.created_at).toLocaleDateString('vi-VN')}
                      </span>
                      <button onClick={() => deleteBlog(blog.id)} className="text-red-600 hover:text-red-500 transition">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {loading && selectedBiz && (
        <div className="text-center py-8 text-[#2F2F2F]/60 text-xs font-mono animate-pulse">Đang tải dữ liệu...</div>
      )}
    </div>
  )
}
