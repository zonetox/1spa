'use client'
import toast from 'react-hot-toast';

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { 
  Search, 
  ShieldCheck, 
  Lock, 
  Unlock, 
  ExternalLink,
  RefreshCw,
  Building2,
  BadgeCheck,
  Clock,
  Edit,
  X,
  Users as UsersIcon
} from 'lucide-react'

type BusinessRow = {
  id: string
  business_name: string
  slug: string
  category: string
  hotline: string
  zalo_phone: string
  is_verified: boolean
  rating_score: number
  created_at: string
  location_city: string
  location_district: string
  account_id: string
  profiles: {
    email: string
    subscription_status: string
    expiry_date: string
  } | null
  landing_pages: { is_published: boolean; status: string }[]
  bookings: { count: number }[]
}

export default function UsersAuditPage() {
  const [businesses, setBusinesses] = useState<BusinessRow[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'verified' | 'unverified' | 'trial' | 'active' | 'blocked'>('all')
  const supabase = createClient()

  const [editingBusiness, setEditingBusiness] = useState<BusinessRow | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => { 
    fetchData() 
  }, [])

  async function fetchData() {
    setLoading(true)
    const { data, error } = await supabase
      .from('business_profiles')
      .select(`
        id, account_id, business_name, slug, category, hotline, zalo_phone, 
        is_verified, rating_score, created_at, location_city, location_district,
        profiles!inner(email, subscription_status, expiry_date, role),
        landing_pages (is_published, status),
        bookings(count)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching businesses:', error.message)
    } else {
      setBusinesses((data || []) as any)
    }
    setLoading(false)
  }

  async function toggleVerified(id: string, current: boolean) {
    const { error } = await supabase
      .from('business_profiles')
      .update({ is_verified: !current })
      .eq('id', id)
    if (!error) {
      setBusinesses(prev => prev.map(b => b.id === id ? { ...b, is_verified: !current } : b))
    } else {
      toast('Lỗi cập nhật: ' + error.message)
    }
  }

  async function togglePublished(businessId: string, currentPublished: boolean) {
    const { error } = await supabase
      .from('landing_pages')
      .update({ is_published: !currentPublished, status: !currentPublished ? 'Published' : 'Draft' })
      .eq('business_id', businessId)
    if (!error) {
      setBusinesses(prev => prev.map(b =>
        b.id === businessId
          ? { ...b, landing_pages: [{ is_published: !currentPublished, status: !currentPublished ? 'Published' : 'Draft' }] }
          : b
      ))
    } else {
      toast('Lỗi cập nhật trang đích: ' + error.message)
    }
  }

  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault()
    if (!editingBusiness) return
    setSaving(true)

    try {
      // Update business_profiles
      const { error: bpErr } = await supabase
        .from('business_profiles')
        .update({
          business_name: editingBusiness.business_name,
          category: editingBusiness.category,
          hotline: editingBusiness.hotline,
          zalo_phone: editingBusiness.zalo_phone,
          location_city: editingBusiness.location_city,
          location_district: editingBusiness.location_district,
        })
        .eq('id', editingBusiness.id)
      
      if (bpErr) throw bpErr

      // Update profiles
      if (editingBusiness.profiles) {
        const { error: pErr } = await supabase
          .from('profiles')
          .update({
            subscription_status: editingBusiness.profiles.subscription_status,
            expiry_date: editingBusiness.profiles.expiry_date,
            role: (editingBusiness.profiles as any).role
          })
          .eq('id', editingBusiness.account_id)
        
        if (pErr) throw pErr
      }

      // Update local state
      setBusinesses(prev => prev.map(b => b.id === editingBusiness.id ? editingBusiness : b))
      setEditingBusiness(null)
    } catch (err: any) {
      toast('Lỗi cập nhật thông tin: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  const filtered = businesses.filter(b => {
    const q = search.toLowerCase()
    const matchSearch = b.business_name.toLowerCase().includes(q) ||
      b.profiles?.email?.toLowerCase().includes(q) ||
      b.category.toLowerCase().includes(q) ||
      b.slug.toLowerCase().includes(q)

    if (filter === 'verified') return matchSearch && b.is_verified
    if (filter === 'unverified') return matchSearch && !b.is_verified
    if (filter === 'trial') return matchSearch && b.profiles?.subscription_status?.toLowerCase() === 'trial'
    if (filter === 'active') return matchSearch && b.profiles?.subscription_status?.toLowerCase() === 'active'
    if (filter === 'blocked') return matchSearch && b.profiles?.subscription_status?.toLowerCase() === 'blocked'
    return matchSearch
  })

  const expiryDaysLeft = (expiry: string | undefined) => {
    if (!expiry) return null
    const diff = new Date(expiry).getTime() - Date.now()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-zinc-100">Quản Lý Đối Tác & Khách Hàng</h2>
          <p className="text-xs text-zinc-500 mt-1">Kiểm soát toàn diện thông tin, trang đích, gói cước và hiệu suất leads của các đối tác.</p>
        </div>
        <button onClick={fetchData} className="flex items-center gap-2 px-4 py-2 text-xs font-mono bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-300 hover:text-white transition">
          <RefreshCw size={12} /> Làm mới
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Tìm tên doanh nghiệp, email, slug..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 w-full bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-amber-500/50"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(['all', 'verified', 'unverified', 'trial', 'active', 'blocked'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition ${filter === f
                ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                : 'bg-zinc-900 text-zinc-500 border border-zinc-800 hover:text-zinc-200'
              }`}
            >
              {f === 'all' ? 'Tất cả' : f === 'verified' ? 'Xác minh' : f === 'unverified' ? 'Chưa xác minh' : f === 'trial' ? 'Dùng thử' : f === 'active' ? 'Hoạt động' : 'Đã khóa'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-zinc-500 text-xs font-mono animate-pulse">Đang tải danh sách đối tác...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-zinc-500 text-xs font-mono">Không tìm thấy đối tác nào phù hợp.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-950 text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                  <th className="py-4 px-5">Doanh Nghiệp</th>
                  <th className="py-4 px-5">Danh Mục</th>
                  <th className="py-4 px-5">Email & Gói</th>
                  <th className="py-4 px-5">Hết Hạn</th>
                  <th className="py-4 px-5">Hiệu Suất (Leads)</th>
                  <th className="py-4 px-5">Trang Đích</th>
                  <th className="py-4 px-5 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50 text-xs text-zinc-300">
                {filtered.map(b => {
                  const lp = b.landing_pages?.[0]
                  const isPublished = lp?.is_published === true
                  const days = expiryDaysLeft(b.profiles?.expiry_date ?? undefined)
                  const isExpiringSoon = days !== null && days <= 3 && days >= 0
                  const isExpired = days !== null && days < 0
                  const leadsCount = b.bookings?.[0]?.count || 0

                  return (
                    <tr key={b.id} className={`hover:bg-zinc-800/30 transition ${b.profiles?.subscription_status === 'blocked' ? 'opacity-50' : ''}`}>
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-amber-500">
                            <Building2 size={14} />
                          </div>
                          <div>
                            <div className="font-semibold text-zinc-100 flex items-center gap-1">
                              {b.business_name}
                              {b.is_verified && <BadgeCheck size={13} className="text-amber-400" />}
                            </div>
                            <div className="text-[10px] text-zinc-500 font-mono">/p/{b.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-800 text-zinc-400 uppercase">{b.category}</span>
                        <div className="text-[10px] text-zinc-600 mt-0.5">{[b.location_district, b.location_city].filter(Boolean).join(', ') || '—'}</div>
                      </td>
                      <td className="py-4 px-5">
                        <div className="text-zinc-300">{b.profiles?.email || '—'}</div>
                        <div className={`text-[10px] font-mono mt-0.5 ${b.profiles?.subscription_status?.toLowerCase() === 'active' ? 'text-emerald-400' : b.profiles?.subscription_status?.toLowerCase() === 'trial' ? 'text-amber-400' : 'text-red-400'}`}>
                          {b.profiles?.subscription_status?.toLowerCase() === 'active' ? 'Hoạt động' : b.profiles?.subscription_status?.toLowerCase() === 'trial' ? 'Dùng thử' : b.profiles?.subscription_status?.toLowerCase() === 'blocked' ? 'Đã khóa' : b.profiles?.subscription_status || '—'}
                        </div>
                      </td>
                      <td className="py-4 px-5">
                        {days !== null ? (
                          <div className={`flex items-center gap-1 text-[10px] font-mono ${isExpired ? 'text-red-400' : isExpiringSoon ? 'text-amber-400 animate-pulse' : 'text-zinc-400'}`}>
                            <Clock size={11} />
                            {isExpired ? `Hết hạn ${Math.abs(days)} ngày` : `Còn ${days} ngày`}
                          </div>
                        ) : '—'}
                      </td>
                      <td className="py-4 px-5">
                         <div className="flex items-center gap-1.5 font-medium text-emerald-400">
                           <UsersIcon size={14} />
                           {leadsCount} Bookings
                         </div>
                      </td>
                      <td className="py-4 px-5">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-medium ${isPublished ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-zinc-800 text-zinc-500 border border-zinc-700'}`}>
                          {isPublished ? 'Public' : 'Private'}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setEditingBusiness(b)}
                            title="Sửa thông tin"
                            className="p-1.5 rounded border border-zinc-700 text-zinc-500 hover:text-amber-400 hover:border-amber-500/50 transition"
                          >
                            <Edit size={13} />
                          </button>
                          <button
                            onClick={() => togglePublished(b.id, isPublished)}
                            title={isPublished ? 'Gỡ xuống (Private)' : 'Xuất bản (Public)'}
                            className={`p-1.5 rounded border transition ${isPublished
                              ? 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white'
                              : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white'
                            }`}
                          >
                            {isPublished ? <Lock size={13} /> : <Unlock size={13} />}
                          </button>
                          <button
                            onClick={() => toggleVerified(b.id, b.is_verified)}
                            title={b.is_verified ? 'Bỏ xác minh' : 'Cấp tích xanh'}
                            className={`p-1.5 rounded border transition ${b.is_verified
                              ? 'bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500 hover:text-white'
                              : 'bg-zinc-800 border-zinc-700 text-zinc-500 hover:bg-amber-500 hover:text-white hover:border-transparent'
                            }`}
                          >
                            <ShieldCheck size={13} />
                          </button>
                          <a
                            href={`/p/${b.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded border border-zinc-700 text-zinc-500 hover:text-zinc-200 hover:border-zinc-500 transition"
                          >
                            <ExternalLink size={13} />
                          </a>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-[10px] text-zinc-600 font-mono">
        Tổng cộng: {filtered.length} doanh nghiệp
      </p>

      {/* Edit Modal */}
      {editingBusiness && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 p-5 flex justify-between items-center z-10">
              <div>
                <h3 className="font-display font-bold text-lg text-zinc-100">Chỉnh Sửa Toàn Diện</h3>
                <p className="text-xs text-zinc-500 font-mono mt-1">ID: {editingBusiness.id}</p>
              </div>
              <button onClick={() => setEditingBusiness(null)} className="p-2 text-zinc-500 hover:text-white rounded-lg hover:bg-zinc-900 transition">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSaveEdit} className="p-5 space-y-6">
              {/* Business Info */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-amber-500 uppercase tracking-wider font-mono">Thông Tin Cơ Sở</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-zinc-400">Tên doanh nghiệp</label>
                    <input 
                      required
                      type="text" 
                      value={editingBusiness.business_name}
                      onChange={e => setEditingBusiness({...editingBusiness, business_name: e.target.value})}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-zinc-400">Danh mục (Category)</label>
                    <select 
                      value={editingBusiness.category}
                      onChange={e => setEditingBusiness({...editingBusiness, category: e.target.value})}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:border-amber-500 focus:outline-none"
                    >
                      <option value="Spa">Spa</option>
                      <option value="Beauty">Làm Đẹp (Beauty)</option>
                      <option value="Dental">Nha Khoa (Dental)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-zinc-400">Hotline</label>
                    <input 
                      type="text" 
                      value={editingBusiness.hotline || ''}
                      onChange={e => setEditingBusiness({...editingBusiness, hotline: e.target.value})}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-zinc-400">Zalo Phone</label>
                    <input 
                      type="text" 
                      value={editingBusiness.zalo_phone || ''}
                      onChange={e => setEditingBusiness({...editingBusiness, zalo_phone: e.target.value})}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-zinc-400">Quận/Huyện</label>
                    <input 
                      type="text" 
                      value={editingBusiness.location_district || ''}
                      onChange={e => setEditingBusiness({...editingBusiness, location_district: e.target.value})}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-zinc-400">Tỉnh/Thành</label>
                    <input 
                      type="text" 
                      value={editingBusiness.location_city || ''}
                      onChange={e => setEditingBusiness({...editingBusiness, location_city: e.target.value})}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Account / Subscription Info */}
              {editingBusiness.profiles && (
                <div className="space-y-4 pt-4 border-t border-zinc-800">
                  <h4 className="text-sm font-semibold text-amber-500 uppercase tracking-wider font-mono">Quản Lý Gói & Quyền Hạn</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs text-zinc-400">Quyền hạn (Role)</label>
                      <select 
                        value={(editingBusiness.profiles as any).role?.toLowerCase()}
                        onChange={e => setEditingBusiness({
                          ...editingBusiness, 
                          profiles: { ...editingBusiness.profiles!, role: e.target.value } as any
                        })}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:border-amber-500 focus:outline-none"
                      >
                        <option value="business">Business (Doanh nghiệp)</option>
                        <option value="admin">Admin (Quản trị viên)</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-zinc-400">Trạng Thái Gói</label>
                      <select 
                        value={editingBusiness.profiles.subscription_status?.toLowerCase()}
                        onChange={e => setEditingBusiness({
                          ...editingBusiness, 
                          profiles: { ...editingBusiness.profiles!, subscription_status: e.target.value }
                        })}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:border-amber-500 focus:outline-none"
                      >
                        <option value="trial">Dùng thử (Trial)</option>
                        <option value="active">Kích hoạt (Active)</option>
                        <option value="blocked">Đã khóa (Blocked)</option>
                      </select>
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-xs text-zinc-400">Ngày Hết Hạn</label>
                      <input 
                        type="datetime-local" 
                        value={editingBusiness.profiles.expiry_date ? new Date(editingBusiness.profiles.expiry_date).toISOString().slice(0, 16) : ''}
                        onChange={e => setEditingBusiness({
                          ...editingBusiness, 
                          profiles: { ...editingBusiness.profiles!, expiry_date: new Date(e.target.value).toISOString() }
                        })}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-6 flex gap-3 justify-end">
                <button 
                  type="button" 
                  onClick={() => setEditingBusiness(null)}
                  className="px-5 py-2.5 rounded-lg text-sm font-medium bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
                >
                  Hủy bỏ
                </button>
                <button 
                  type="submit" 
                  disabled={saving}
                  className="px-5 py-2.5 rounded-lg text-sm font-medium bg-amber-500 text-black hover:bg-amber-400 transition disabled:opacity-50"
                >
                  {saving ? 'Đang lưu...' : 'Lưu Thay Đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
