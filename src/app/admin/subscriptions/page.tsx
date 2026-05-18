'use client'
import toast from 'react-hot-toast';

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Check, X, Shield, Clock, AlertTriangle, Search, Filter } from 'lucide-react'
import { confirmAction } from '@/lib/confirm'

export default function AdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterVerified, setFilterVerified] = useState('all') // all, verified, unverified

  const supabase = createClient()

  useEffect(() => {
    fetchSubscriptions()
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
          business_name,
          account_id
        ),
        packages (
          id,
          name,
          price,
          duration_days
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
    const sub = subscriptions.find(s => s.id === id)
    if (!sub) {
      toast.error('Không tìm thấy thông tin đăng ký!')
      return
    }

    const { error } = await supabase
      .from('subscriptions')
      .update({ verified: true, status: 'active' })
      .eq('id', id)

    if (!error) {
      if (sub.business_profiles?.account_id) {
        const durationDays = sub.packages?.duration_days || 365
        const expiryDate = new Date()
        expiryDate.setDate(expiryDate.getDate() + durationDays)

        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            subscription_status: 'active',
            expiry_date: expiryDate.toISOString()
          })
          .eq('id', sub.business_profiles.account_id)

        if (profileError) {
          console.error('Error updating profiles subscription:', profileError.message)
          toast.error('Duyệt giao dịch thành công nhưng cập nhật tài khoản thất bại: ' + profileError.message)
          return
        }
      }

      toast.success('Đã xác nhận giao dịch thành công! Gói dịch vụ duy trì trạng thái active an toàn.')
      fetchSubscriptions()
    } else {
      toast.error('Lỗi khi duyệt: ' + error.message)
    }
  }

  const handleReject = async (id: string) => {
    const confirmed = await confirmAction('Bạn có chắc chắn muốn Từ chối và Đình chỉ gói này? Hệ thống sẽ gỡ bỏ quyền lợi lập tức!')
    if (confirmed) {
      const sub = subscriptions.find(s => s.id === id)
      const { error } = await supabase
        .from('subscriptions')
        .update({ verified: false, status: 'pending' })
        .eq('id', id)

      if (!error) {
        if (sub?.business_profiles?.account_id) {
          const { error: profileError } = await supabase
            .from('profiles')
            .update({
              subscription_status: 'blocked'
            })
            .eq('id', sub.business_profiles.account_id)

          if (profileError) {
            console.error('Error blocking profile:', profileError.message)
          }
        }

        toast.success('Đã từ chối giao dịch thành công. Gói dịch vụ đã chuyển sang trạng thái pending (Vô hiệu hóa quyền lợi).')
        fetchSubscriptions()
      } else {
        toast.error('Lỗi khi đình chỉ: ' + error.message)
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
    <div className="p-8 max-w-6xl mx-auto space-y-8 text-[#2F2F2F]">
      <div>
        <h1 className="text-3xl font-display font-bold text-[#2F2F2F] flex items-center gap-2">
          <Shield className="text-[#D4AF37]" size={28} /> Đối Soát Thanh Toán
        </h1>
        <p className="text-[#2F2F2F]/60 mt-2 text-xs uppercase tracking-widest font-mono">Duyệt & Đình chỉ thuê bao theo sao kê ngân hàng</p>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white border border-[#D4AF37]/10 p-6 rounded-2xl shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-3 h-4 w-4 text-[#2F2F2F]/40" />
          <input
            type="text"
            placeholder="Tìm tên doanh nghiệp, gói cước..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2.5 w-full bg-[#FDFBF7] border border-[#D4AF37]/10 rounded-xl text-sm text-[#2F2F2F] placeholder-[#2F2F2F]/40 focus:outline-none focus:border-[#D4AF37]"
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
                  ? 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20' 
                  : 'bg-[#FDFBF7] text-[#2F2F2F]/60 border border-[#D4AF37]/10 hover:text-[#2F2F2F] hover:border-[#D4AF37]/30'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-[#D4AF37]/10 rounded-3xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-16 text-center text-[#2F2F2F]/60 font-mono text-xs uppercase animate-pulse">Đang tải danh sách đối soát...</div>
        ) : filteredSubs.length === 0 ? (
          <div className="p-16 text-center text-[#2F2F2F]/60 font-mono text-xs uppercase">Không tìm thấy giao dịch nào.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#D4AF37]/10 bg-[#FDFBF7] text-[10px] font-mono text-[#2F2F2F]/60 uppercase tracking-wider">
                  <th className="py-5 px-6">Doanh Nghiệp</th>
                  <th className="py-5 px-6">Gói Đăng Ký</th>
                  <th className="py-5 px-6">Số Tiền</th>
                  <th className="py-5 px-6">Ngày Đăng Ký</th>
                  <th className="py-5 px-6">Trạng Thái Thao Tác</th>
                  <th className="py-5 px-6 text-right">Hành Động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D4AF37]/5 text-sm text-[#2F2F2F]/80">
                {filteredSubs.map(sub => (
                  <tr key={sub.id} className="hover:bg-[#FDFBF7]/50 transition">
                    <td className="py-5 px-6 font-bold text-[#2F2F2F]">
                      {sub.business_profiles?.business_name || 'N/A'}
                    </td>
                    <td className="py-5 px-6 font-mono text-xs font-semibold text-[#2F2F2F]/60">
                      {sub.packages?.name || 'N/A'}
                    </td>
                    <td className="py-5 px-6 font-bold text-[#D4AF37] font-mono text-xs">
                      {sub.packages?.price?.toLocaleString('vi-VN')}đ
                    </td>
                    <td className="py-5 px-6 text-xs text-[#2F2F2F]/40 font-mono">
                      {new Date(sub.created_at).toLocaleString('vi-VN')}
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex flex-col gap-1">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider w-fit ${
                          sub.verified 
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' 
                            : 'bg-rose-50 text-rose-600 border border-rose-200 animate-pulse'
                        }`}>
                          {sub.verified ? 'Đã Đối Soát (OK)' : 'Chưa Đối Soát'}
                        </span>
                        <span className={`text-[10px] font-mono ${sub.status === 'Active' ? 'text-green-600' : 'text-[#2F2F2F]/40'}`}>
                          Quyền lợi: {sub.status === 'Active' ? 'Đã Kích Hoạt' : 'Vô Hiệu Hóa'}
                        </span>
                      </div>
                    </td>
                    <td className="py-5 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {!sub.verified ? (
                          <button
                            onClick={() => handleVerify(sub.id)}
                            className="px-3 py-1.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-lg text-xs font-bold hover:bg-emerald-600 hover:text-white transition flex items-center gap-1"
                          >
                            <Check size={14} /> Xác Nhận
                          </button>
                        ) : (
                          <button
                            onClick={() => handleReject(sub.id)}
                            className="px-3 py-1.5 bg-rose-50 text-rose-600 border border-rose-200 rounded-lg text-xs font-bold hover:bg-rose-600 hover:text-white transition flex items-center gap-1"
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
