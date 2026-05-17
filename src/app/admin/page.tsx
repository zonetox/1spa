'use client'
import toast from 'react-hot-toast';

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { 
  Users, 
  FileText, 
  Activity, 
  CheckCircle, 
  Clock, 
  UserCheck, 
  Search, 
  ChevronRight, 
  ExternalLink,
  MessageSquare
} from 'lucide-react'

export default function AdminOverviewPage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalPartners: 0,
    publishedLandings: 0,
    totalLeads: 0,
    activeSubscribers: 0,
    avgConversionRate: 0
  })
  const [bookings, setBookings] = useState<any[]>([])
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

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
      
      fetchDashboardData()
    }
    
    checkAdmin()
  }, [])

  async function fetchDashboardData() {
    setLoading(true)
    try {
      // 1. Fetch metrics from DB
      const { count: partnersCount } = await supabase
        .from('business_profiles')
        .select('*', { count: 'exact', head: true })

      const { count: landingsCount } = await supabase
        .from('landing_pages')
        .select('*', { count: 'exact', head: true })
        .or('is_published.eq.true,status.eq.Published')

      const { count: bookingsCount } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })

      const { count: activeCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('subscription_status', 'Active')

      // 1.5 Fetch Analytics for Conversion Rate
      const { data: viewsData } = await supabase
        .from('analytics_events')
        .select('event_type')
        .eq('event_type', 'view')
      
      const viewsCount = viewsData?.length || 1 // Avoid division by zero
      const conversionRate = ((bookingsCount || 0) / viewsCount) * 100

      setStats({
        totalPartners: partnersCount || 0,
        publishedLandings: landingsCount || 0,
        totalLeads: bookingsCount || 0,
        activeSubscribers: activeCount || 0,
        avgConversionRate: parseFloat(conversionRate.toFixed(2))
      })

      // 2. Fetch booking leads joined with business_profiles
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          id,
          status,
          source_url,
          created_at,
          customer_info,
          business_id,
          business_profiles (
            business_name,
            slug,
            category
          )
        `)
        .order('created_at', { ascending: false })

      if (bookingsError) {
        console.error('Error fetching bookings:', bookingsError.message)
      } else {
        setBookings(bookingsData || [])
      }
    } catch (err: any) {
      console.error('Failed to load dashboard:', err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleUpdateStatus(id: string, newStatus: string) {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', id)

      if (error) {
        toast('Cập nhật trạng thái lỗi: ' + error.message)
      } else {
        // Optimistic UI update
        setBookings(prev => 
          prev.map(b => b.id === id ? { ...b, status: newStatus } : b)
        )
        // Refresh metrics in background
        fetchDashboardData()
      }
    } catch (err: any) {
      console.error(err.message)
    }
  }

  // Filter & Search Logic
  const filteredBookings = bookings.filter(b => {
    const info = b.customer_info || {}
    const name = (info.name || '').toLowerCase()
    const phone = (info.phone || '').toLowerCase()
    const service = (info.service || '').toLowerCase()
    const businessName = (b.business_profiles?.business_name || '').toLowerCase()
    
    const matchesSearch = 
      name.includes(searchQuery.toLowerCase()) || 
      phone.includes(searchQuery.toLowerCase()) || 
      service.includes(searchQuery.toLowerCase()) ||
      businessName.includes(searchQuery.toLowerCase())

    const matchesStatus = filterStatus === 'all' || b.status === filterStatus

    return matchesSearch && matchesStatus
  })

  const STATS_CARDS = [
    { label: 'Tổng Đối Tác', value: stats.totalPartners, delta: 'Doanh nghiệp spa & nha khoa', icon: Users, color: 'text-amber-500' },
    { label: 'Landing Page Hoạt Động', value: stats.publishedLandings, delta: 'Đã xuất bản online', icon: FileText, color: 'text-emerald-500' },
    { label: 'Khách Đăng Ký (Leads)', value: stats.totalLeads, delta: 'Gửi từ landing pages', icon: Activity, color: 'text-blue-500' },
    { label: 'Gói VIP Active', value: stats.activeSubscribers, delta: 'Thuê bao trả phí', icon: UserCheck, color: 'text-violet-500' },
    { label: 'Tỷ Lệ Chuyển Đổi', value: `${stats.avgConversionRate}%`, delta: 'Bookings / Lượt xem', icon: Activity, color: 'text-rose-500' }
  ]

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-zinc-100">SaaS Command Center</h2>
          <p className="text-xs text-zinc-500 mt-1">Hệ thống quản trị real-time đối tác và khách hàng của 1Beauty.Asia.</p>
        </div>
        <button 
          onClick={fetchDashboardData}
          className="px-4 py-2 text-xs font-mono bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-850 transition"
        >
          Làm mới dữ liệu
        </button>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS_CARDS.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="p-6 bg-zinc-900 border border-zinc-800/60 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">{stat.label}</span>
                <Icon size={16} className={stat.color} />
              </div>
              <div>
                <p className="text-3xl font-display font-bold text-zinc-100">
                  {loading ? '...' : stat.value}
                </p>
                <p className="text-[10px] text-zinc-500 mt-1">{stat.delta}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Leads Management Panel */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <MessageSquare size={16} className="text-amber-500" />
            <h3 className="text-sm font-semibold text-zinc-200">Quản Lý Danh Sách Booking Leads</h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-500" />
              <input
                type="text"
                placeholder="Tìm khách hàng, dịch vụ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-1.5 w-60 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-amber-500/50"
              />
            </div>

            {/* Filter Buttons */}
            {['all', 'Pending', 'Confirmed', 'Completed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  filterStatus === status 
                    ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' 
                    : 'bg-zinc-950 text-zinc-400 border border-transparent hover:text-zinc-200'
                }`}
              >
                {status === 'all' && 'Tất Cả'}
                {status === 'Pending' && 'Mới'}
                {status === 'Confirmed' && 'Đã Liên Hệ'}
                {status === 'Completed' && 'Hoàn Tất'}
              </button>
            ))}
          </div>
        </div>

        {/* Leads Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-zinc-500 text-xs font-mono">Đang tải danh sách leads...</div>
          ) : filteredBookings.length === 0 ? (
            <div className="p-12 text-center text-zinc-500 text-xs font-mono">Không tìm thấy booking lead nào phù hợp.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-950 text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Khách Hàng</th>
                  <th className="py-4 px-6">Dịch Vụ Đăng Ký</th>
                  <th className="py-4 px-6">Doanh Nghiệp Nhận</th>
                  <th className="py-4 px-6">Trạng Thái</th>
                  <th className="py-4 px-6">Nguồn Landing Page</th>
                  <th className="py-4 px-6 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50 text-xs text-zinc-300">
                {filteredBookings.map((b) => {
                  const info = b.customer_info || {}
                  const bp = b.business_profiles || {}
                  return (
                    <tr key={b.id} className="hover:bg-zinc-850/30 transition">
                      <td className="py-4 px-6">
                        <div className="font-semibold text-zinc-100">{info.name || 'N/A'}</div>
                        <div className="text-[10px] text-zinc-500 font-mono mt-0.5">{info.phone || 'N/A'}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div>{info.service || 'N/A'}</div>
                        <div className="text-[10px] text-zinc-500 font-mono flex items-center gap-1 mt-0.5">
                          <Clock size={10} />
                          {info.datetime || 'N/A'}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-semibold text-zinc-200">{bp.business_name}</span>
                        <span className="ml-1.5 px-1.5 py-0.5 rounded text-[9px] bg-zinc-800 text-zinc-400 font-mono uppercase">
                          {bp.category}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-medium ${
                          b.status === 'Pending' ? 'bg-amber-500/10 text-amber-500' :
                          b.status === 'Confirmed' ? 'bg-blue-500/10 text-blue-500' :
                          'bg-emerald-500/10 text-emerald-500'
                        }`}>
                          {b.status === 'Pending' && 'Mới'}
                          {b.status === 'Confirmed' && 'Đã liên hệ'}
                          {b.status === 'Completed' && 'Đã hoàn tất'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <a 
                          href={b.source_url} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-zinc-500 hover:text-zinc-300 flex items-center gap-1 font-mono text-[10px] transition"
                        >
                          {b.source_url || '/'}
                          <ExternalLink size={10} />
                        </a>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {b.status === 'Pending' && (
                            <button
                              onClick={() => handleUpdateStatus(b.id, 'Confirmed')}
                              className="px-2.5 py-1 text-[10px] bg-blue-600/10 text-blue-400 border border-blue-500/20 rounded hover:bg-blue-600 hover:text-white transition"
                            >
                              Đã Liên Hệ
                            </button>
                          )}
                          {b.status !== 'Completed' && (
                            <button
                              onClick={() => handleUpdateStatus(b.id, 'Completed')}
                              className="px-2.5 py-1 text-[10px] bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 rounded hover:bg-emerald-600 hover:text-white transition"
                            >
                              Hoàn Tất
                            </button>
                          )}
                          {b.status === 'Completed' && (
                            <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-1">
                              <CheckCircle size={12} className="text-emerald-500" /> Done
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
