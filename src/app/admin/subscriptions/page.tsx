'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Check, X, Shield, Clock, AlertTriangle, Search, Filter } from 'lucide-react'

export default function AdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterVerified, setFilterVerified] = useState('all') // all, verified, unverified

  const supabase = createClient()

  useEffect(() => {
    async function checkAdmin() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        window.location.href = '/login'
        return
      }
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
        
      if (profile?.role?.toLowerCase() !== 'admin') {
        window.location.href = '/dashboard'
        return
      }
      
      fetchSubscriptions()
    }
    checkAdmin()
  }, [])

  const fetchSubscriptions = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('subscriptions')
      .select(`
        id,
        status,
        verified,
        created_at,
        business_profiles (
          id,
          business_name
        ),
        packages (
          id,
          name,
          price
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching subscriptions:', error.message)
    } else {
      setSubscriptions(data || [])
    }
    setLoading(false)
  }

  const handleVerify = async (id: string) => {
    const { error } = await supabase
      .from('subscriptions')
      .update({ verified: true, status: 'Active' })
      .eq('id', id)

    if (!error) {
      alert('Đã xác nhận giao dịch thành công! Gói dịch vụ duy trì trạng thái Active an toàn.')
      fetchSubscriptions()
    } else {
      alert('Lỗi khi duyệt: ' + error.message)
    }
  }

  const handleReject = async (id: string) => {
    if (confirm('Bạn có chắc chắn muốn Từ chối và Đình chỉ gói này? Hệ thống sẽ gỡ bỏ quyền lợi lập tức!')) {
      const { error } = await supabase
        .from('subscriptions')
        .update({ verified: false, status: 'Pending' })
        .eq('id', id)

      if (!error) {
        alert('Đã từ chối giao dịch thành công. Gói dịch vụ đã chuyển sang trạng thái Pending (Vô hiệu hóa quyền lợi).')
        fetchSubscriptions()
      } else {
        alert('Lỗi khi đình chỉ: ' + error.message)
      }
    }
  }

  const filteredSubs = subscriptions.filter(s => {
    const bizName = (s.business_profiles?.business_name || '').toLowerCase()
    const pkgName = (s.packages?.name || '').toLowerCase()
    const matchesSearch = bizName.includes(searchQuery.toLowerCase()) || pkgName.includes(searchQuery.toLowerCase())

    if (filterVerified === 'verified') return matchesSearch && s.verified === true
    if (filterVerified === 'unverified') return matchesSearch && s.verified === false
    return matchesSearch
  })

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 text-zinc-100">
      <div>
        <h1 className="text-3xl font-display font-bold text-zinc-100 flex items-center gap-2">
          <Shield className="text-amber-500" size={28} /> Đối Soát Thanh Toán
        </h1>
        <p className="text-zinc-500 mt-2 text-xs uppercase tracking-widest font-mono">Duyệt & Đình chỉ thuê bao theo sao kê ngân hàng</p>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Tìm tên doanh nghiệp, gói cước..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2.5 w-full bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-amber-500/50"
          />
        </div>

        <div className="flex gap-2">
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'unverified', label: 'Chưa đối soát' },
            { id: 'verified', label: 'Đã đối soát' }
          ].map(btn => (
            <button
              key={btn.id}
              onClick={() => setFilterVerified(btn.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-mono uppercase tracking-wider transition ${
                filterVerified === btn.id 
                  ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' 
                  : 'bg-zinc-950 text-zinc-500 border border-transparent hover:text-zinc-300'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
        {loading ? (
          <div className="p-16 text-center text-zinc-500 font-mono text-xs uppercase animate-pulse">Đang tải danh sách đối soát...</div>
        ) : filteredSubs.length === 0 ? (
          <div className="p-16 text-center text-zinc-500 font-mono text-xs uppercase">Không tìm thấy giao dịch nào.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-950 text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                  <th className="py-5 px-6">Doanh Nghiệp</th>
                  <th className="py-5 px-6">Gói Đăng Ký</th>
                  <th className="py-5 px-6">Số Tiền</th>
                  <th className="py-5 px-6">Ngày Đăng Ký</th>
                  <th className="py-5 px-6">Trạng Thái Thao Tác</th>
                  <th className="py-5 px-6 text-right">Hành Động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/40 text-sm text-zinc-300">
                {filteredSubs.map(sub => (
                  <tr key={sub.id} className="hover:bg-zinc-850/20 transition">
                    <td className="py-5 px-6 font-bold text-zinc-200">
                      {sub.business_profiles?.business_name || 'N/A'}
                    </td>
                    <td className="py-5 px-6 font-mono text-xs font-semibold text-zinc-400">
                      {sub.packages?.name || 'N/A'}
                    </td>
                    <td className="py-5 px-6 font-bold text-amber-500 font-mono text-xs">
                      {sub.packages?.price?.toLocaleString('vi-VN')}đ
                    </td>
                    <td className="py-5 px-6 text-xs text-zinc-500 font-mono">
                      {new Date(sub.created_at).toLocaleString('vi-VN')}
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex flex-col gap-1">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider w-fit ${
                          sub.verified 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20 animate-pulse'
                        }`}>
                          {sub.verified ? 'Đã Đối Soát (OK)' : 'Chưa Đối Soát'}
                        </span>
                        <span className={`text-[10px] font-mono ${sub.status === 'Active' ? 'text-green-500' : 'text-zinc-500'}`}>
                          Quyền lợi: {sub.status === 'Active' ? 'Đã Kích Hoạt' : 'Vô Hiệu Hóa'}
                        </span>
                      </div>
                    </td>
                    <td className="py-5 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {!sub.verified ? (
                          <button
                            onClick={() => handleVerify(sub.id)}
                            className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-bold hover:bg-emerald-500 hover:text-white transition flex items-center gap-1"
                          >
                            <Check size={14} /> Xác Nhận
                          </button>
                        ) : (
                          <button
                            onClick={() => handleReject(sub.id)}
                            className="px-3 py-1.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-lg text-xs font-bold hover:bg-rose-500 hover:text-white transition flex items-center gap-1"
                          >
                            <X size={14} /> Đình Chỉ Gói
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
