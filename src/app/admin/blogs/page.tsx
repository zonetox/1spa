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
  const [isAdminVerified, setIsAdminVerified] = useState(true)
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
  
  if (!isAdminVerified) return null

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-zinc-100">Quản Lý Blog Doanh Nghiệp</h2>
        <p className="text-xs text-zinc-500 mt-1">Đăng bài viết chuẩn SEO cho các đối tác. Hệ thống kiểm soát hạn mức theo gói thành viên.</p>
      </div>

      {/* Business Selector */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
        <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-2">Chọn Doanh Nghiệp</label>
        <div className="relative">
          <select
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-amber-500/50 appearance-none cursor-pointer"
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
          <ChevronDown size={16} className="absolute right-4 top-3.5 text-zinc-500 pointer-events-none" />
        </div>
      </div>

      {/* Blog Management Panel */}
      {selectedBiz && !loading && (
        <div className="space-y-4">
          {/* Quota Header */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-zinc-100">{selectedBiz.business_name}</h3>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-[11px] text-zinc-500">Quota bài viết:</span>
                <div className="flex items-center gap-2">
                  <div className="w-40 h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${isQuotaFull ? 'bg-red-500' : 'bg-amber-500'}`}
                      style={{ width: `${Math.min((blogs.length / maxBlogs) * 100, 100)}%` }}
                    />
                  </div>
                  <span className={`text-xs font-mono font-bold ${isQuotaFull ? 'text-red-400' : 'text-zinc-300'}`}>
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
                  ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                  : 'bg-amber-500 text-black hover:bg-amber-400'
              }`}
            >
              <Plus size={16} />
              {showForm ? 'Đóng soạn thảo' : 'Viết Bài Mới'}
            </button>
          </div>

          {/* Quota Full Warning */}
          {isQuotaFull && !showForm && (
            <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <p>Doanh nghiệp này đã sử dụng hết {maxBlogs} bài viết trong gói. Cần nâng cấp gói để đăng thêm bài.</p>
            </div>
          )}

          {/* Blog Form */}
          {showForm && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
              <h4 className="font-semibold text-zinc-100 border-b border-zinc-800 pb-4">Trình Soạn Thảo Blog</h4>
              <div>
                <label className="text-[11px] text-zinc-500 font-mono uppercase tracking-wider block mb-1.5">Tiêu đề bài viết</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="VD: 5 Liệu Trình Chăm Sóc Da Cấp Ẩm Mùa Hè..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-amber-500/50"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] text-zinc-500 font-mono uppercase tracking-wider block mb-1.5">Ảnh đại diện (URL)</label>
                  <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden focus-within:border-amber-500/50">
                    <div className="px-3 py-3 text-zinc-600 border-r border-zinc-800">
                      <ImageIcon size={16} />
                    </div>
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={e => setImageUrl(e.target.value)}
                      placeholder="https://example.com/thumbnail.jpg"
                      className="flex-1 px-4 py-3 text-sm text-zinc-300 bg-transparent placeholder-zinc-700 outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] text-zinc-500 font-mono uppercase tracking-wider block mb-1.5">Danh mục</label>
                  <div className="flex gap-2">
                    <select
                      value={selectedCategory}
                      onChange={e => setSelectedCategory(e.target.value)}
                      className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-zinc-300 focus:outline-none focus:border-amber-500/50"
                    >
                      <option value="">-- Chọn danh mục --</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                    <button 
                      onClick={() => setShowCategoryForm(!showCategoryForm)}
                      className="p-3 bg-zinc-800 text-zinc-400 rounded-lg hover:text-amber-500 transition"
                      title="Thêm danh mục mới"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {showCategoryForm && (
                <div className="flex gap-2 p-3 bg-zinc-950 rounded-lg border border-amber-500/20">
                  <input
                    type="text"
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    placeholder="Tên danh mục mới..."
                    className="flex-1 bg-transparent text-sm text-zinc-200 outline-none"
                  />
                  <button onClick={addCategory} className="px-4 py-1.5 bg-amber-500 text-black text-[10px] font-bold uppercase rounded-md">Lưu</button>
                </div>
              )}

              <div>
                <label className="text-[11px] text-zinc-500 font-mono uppercase tracking-wider block mb-1.5">Mô tả ngắn (Excerpt)</label>
                <textarea
                  value={excerpt}
                  onChange={e => setExcerpt(e.target.value)}
                  placeholder="Tóm tắt ngắn gọn nội dung bài viết..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-sm text-zinc-300 placeholder-zinc-700 focus:outline-none focus:border-amber-500/50 resize-none h-20"
                />
              </div>
              <div>
                <label className="text-[11px] text-zinc-500 font-mono uppercase tracking-wider block mb-1.5">Nội dung chi tiết</label>
                <textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="Viết nội dung chuẩn SEO tại đây. Hãy đảm bảo bài viết có ít nhất 300 từ..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-zinc-300 placeholder-zinc-700 focus:outline-none focus:border-amber-500/50 resize-none h-40"
                />
                <p className="text-[10px] text-zinc-600 mt-1">{content.split(/\s+/).filter(Boolean).length} từ</p>
              </div>
              <div className="flex gap-3 pt-2 border-t border-zinc-800">
                <button
                  onClick={saveBlog}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-amber-500 text-black rounded-lg font-semibold text-sm hover:bg-amber-400 transition disabled:opacity-50"
                >
                  {saving ? <RefreshCw size={14} className="animate-spin" /> : <Check size={14} />}
                  Đăng Bài Ngay
                </button>
                <button onClick={() => setShowForm(false)} className="px-6 py-2.5 bg-zinc-800 text-zinc-300 rounded-lg text-sm hover:bg-zinc-700 transition">
                  Hủy
                </button>
              </div>
            </div>
          )}

          {/* Blogs List */}
          {blogs.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 text-sm font-mono bg-zinc-900 border border-zinc-800 rounded-xl">
              Chưa có bài viết nào. Nhấn "Viết Bài Mới" để bắt đầu.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {blogs.map(blog => (
                <div key={blog.id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                  {blog.image_url && (
                    <div className="h-36 bg-zinc-800 overflow-hidden relative">
                      <Image src={blog.image_url} alt={blog.title} fill className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="p-4">
                    <h4 className="font-semibold text-zinc-100 line-clamp-2 mb-2">{blog.title}</h4>
                    <p className="text-zinc-500 text-xs line-clamp-3 mb-4">{blog.content}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-zinc-600 font-mono">
                        {new Date(blog.created_at).toLocaleDateString('vi-VN')}
                      </span>
                      <button onClick={() => deleteBlog(blog.id)} className="text-red-400 hover:text-red-300 transition">
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
        <div className="text-center py-8 text-zinc-500 text-xs font-mono animate-pulse">Đang tải dữ liệu...</div>
      )}
    </div>
  )
}
