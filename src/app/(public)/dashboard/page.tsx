'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { 
  BarChart3, 
  Calendar, 
  Clock, 
  Edit3, 
  ExternalLink, 
  Settings, 
  ShieldCheck,
  Users,
  ChevronRight,
  TrendingUp,
  Palette,
  X,
  Check
} from 'lucide-react'
import LeadTrackerTable from '@/components/dashboard/LeadTrackerTable'

export const LOCATION_DATA: Record<string, string[]> = {
  'Hồ Chí Minh': ['Quận 1', 'Quận 3', 'Quận 5', 'Quận 7', 'Quận 10', 'Bình Thạnh', 'Phú Nhuận', 'Gò Vấp', 'Tân Bình', 'Bình Tân', 'Thủ Đức'],
  'Hà Nội': ['Ba Đình', 'Hoàn Kiếm', 'Hai Bà Trưng', 'Đống Đa', 'Cầu Giấy', 'Thanh Xuân', 'Tây Hồ', 'Long Biên', 'Nam Từ Liêm', 'Bắc Từ Liêm'],
  'Đà Nẵng': ['Hải Châu', 'Thanh Khê', 'Sơn Trà', 'Ngũ Hành Sơn', 'Liên Chiểu', 'Cẩm Lệ']
}

export default function BusinessDashboard() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [landingPage, setLandingPage] = useState<any>(null)
  const [leads, setLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [packages, setPackages] = useState<any[]>([])
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false)
  
  // Quota states
  const [usedBlogs, setUsedBlogs] = useState(0)
  const [maxBlogs, setMaxBlogs] = useState(0)
  const [isChangingTemplate, setIsChangingTemplate] = useState(false)
  const [selectedPkg, setSelectedPkg] = useState<any>(null)

  // Account Settings States
  const [activeTab, setActiveTab] = useState<'overview' | 'settings'>('overview')
  const [isSavingSettings, setIsSavingSettings] = useState(false)
  const [isUploadingLogo, setIsUploadingLogo] = useState(false)
  const [settingsForm, setSettingsForm] = useState({
    business_name: '',
    slug: '',
    category: 'Spa',
    location_city: '',
    location_district: '',
    zalo_phone: '',
    hotline: '',
    logo_url: ''
  })

  // Personal Profile & Security States
  const [fullName, setFullName] = useState('')
  const [personalAvatar, setPersonalAvatar] = useState('')
  const [isSavingPersonal, setIsSavingPersonal] = useState(false)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [isChangingEmail, setIsChangingEmail] = useState(false)
  const [newEmailInput, setNewEmailInput] = useState('')
  const [isSavingEmail, setIsSavingEmail] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    newPassword: '',
    confirmPassword: ''
  })
  const [isSavingPassword, setIsSavingPassword] = useState(false)

  const supabase = createClient()

  // Sync settings form when profile changes
  useEffect(() => {
    if (profile) {
      setSettingsForm({
        business_name: profile.business_name || '',
        slug: profile.slug || '',
        category: profile.category || 'Spa',
        location_city: profile.location_city || '',
        location_district: profile.location_district || '',
        zalo_phone: profile.zalo_phone || '',
        hotline: profile.hotline || '',
        logo_url: profile.logo_url || ''
      })
    }
  }, [profile])

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      alert('Kích thước ảnh phải nhỏ hơn 2MB!')
      return
    }

    setIsUploadingLogo(true)
    try {
      const fileExt = file.name.split('.').pop()
      const filePath = `logos/${Date.now()}.${fileExt}`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('public_images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        })

      if (uploadError) {
        throw uploadError
      }

      const { data: { publicUrl } } = supabase.storage
        .from('public_images')
        .getPublicUrl(filePath)

      setSettingsForm(prev => ({ ...prev, logo_url: publicUrl }))
      alert('Tải ảnh logo lên thành công!')
    } catch (err: any) {
      console.error('Error uploading logo:', err)
      alert('Tải ảnh thất bại: ' + (err.message || err))
    } finally {
      setIsUploadingLogo(false)
    }
  }

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return
    setIsSavingSettings(true)

    const { error } = await supabase
      .from('business_profiles')
      .update({
        business_name: settingsForm.business_name,
        slug: settingsForm.slug,
        category: settingsForm.category,
        location_city: settingsForm.location_city,
        location_district: settingsForm.location_district,
        zalo_phone: settingsForm.zalo_phone,
        hotline: settingsForm.hotline,
        logo_url: settingsForm.logo_url
      })
      .eq('id', profile.id)

    setIsSavingSettings(false)
    if (!error) {
      alert('Cập nhật thông tin tài khoản thành công!')
      setProfile({ ...profile, ...settingsForm })
    } else {
      alert('Cập nhật thất bại: ' + error.message)
    }
  }

  const handlePersonalSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSavingPersonal(true)
    try {
      const { error } = await supabase.auth.updateUser({
        data: { 
          full_name: fullName,
          avatar_url: personalAvatar
        }
      })
      if (error) throw error
      alert('Cập nhật hồ sơ cá nhân thành công!')
    } catch (err: any) {
      alert('Cập nhật thất bại: ' + (err.message || err))
    } finally {
      setIsSavingPersonal(false)
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      alert('Kích thước ảnh đại diện phải nhỏ hơn 2MB!')
      return
    }

    setIsUploadingAvatar(true)
    try {
      const fileExt = file.name.split('.').pop()
      const filePath = `avatars/${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('public_images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('public_images')
        .getPublicUrl(filePath)

      setPersonalAvatar(publicUrl)
      
      // Auto save to auth metadata
      await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      })

      alert('Tải ảnh đại diện cá nhân thành công!')
    } catch (err: any) {
      console.error('Error uploading avatar:', err)
      alert('Tải ảnh thất bại: ' + (err.message || err))
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('Mật khẩu xác nhận không khớp!')
      return
    }
    if (passwordForm.newPassword.length < 6) {
      alert('Mật khẩu mới phải từ 6 ký tự trở lên!')
      return
    }

    setIsSavingPassword(true)
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword
      })
      if (error) throw error
      alert('Thay đổi mật khẩu thành công!')
      setPasswordForm({ newPassword: '', confirmPassword: '' })
    } catch (err: any) {
      alert('Đổi mật khẩu thất bại: ' + (err.message || err))
    } finally {
      setIsSavingPassword(false)
    }
  }

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newEmailInput || newEmailInput === user?.email) {
      setIsChangingEmail(false)
      return
    }
    setIsSavingEmail(true)
    try {
      const { error } = await supabase.auth.updateUser({ email: newEmailInput })
      if (error) throw error
      alert('Một email xác nhận đã được gửi đến địa chỉ email mới. Vui lòng kiểm tra và xác nhận để hoàn tất thay đổi!')
      setIsChangingEmail(false)
    } catch (err: any) {
      alert('Đổi email thất bại: ' + (err.message || err))
    } finally {
      setIsSavingEmail(false)
    }
  }

  useEffect(() => {
    let activeChannel: any = null

    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        window.location.href = '/login'
        return
      }
      setUser(user)
      if (user) {
        setFullName(user.user_metadata?.full_name || '')
        setPersonalAvatar(user.user_metadata?.avatar_url || '')
        setNewEmailInput(user.email || '')
        
        const { data: acc } = await supabase.from('accounts').select('role').eq('id', user.id).maybeSingle()
        if (acc?.role === 'Admin') {
          setIsAdmin(true)
        }
      }

      // Fetch Account & Profile
      const { data: prof } = await supabase.from('business_profiles').select('*').eq('account_id', user.id).single()
      
      if (prof) {
        setProfile(prof)
        // Fetch Landing Page
        const { data: lp } = await supabase.from('landing_pages').select('*').eq('business_id', prof.id).single()
        setLandingPage(lp)

        // Fetch Packages
        const { data: pkgs } = await supabase.from('packages').select('*').order('price', { ascending: true })
        if (pkgs) setPackages(pkgs)

        // Fetch Subscription Limits
        const { data: subData } = await supabase
          .from('subscriptions')
          .select('package_id, packages(limits)')
          .eq('business_id', prof.id)
          .eq('status', 'Active')
          .single()
        
        let packageLimitBlogs = 0
        if (subData && (subData.packages as any)?.limits?.max_blogs) {
          packageLimitBlogs = (subData.packages as any).limits.max_blogs
        } else {
          // fallback
          const { data: fallbackSub } = await supabase.from('subscriptions').select('packages(limits)').eq('business_id', prof.id).order('created_at', { ascending: false }).limit(1).single()
          if (fallbackSub && (fallbackSub.packages as any)?.limits?.max_blogs) {
            packageLimitBlogs = (fallbackSub.packages as any).limits.max_blogs
          } else {
            packageLimitBlogs = 3 // default trial seed
          }
        }
        setMaxBlogs(packageLimitBlogs)

        // Fetch used blogs count
        const { count } = await supabase.from('blogs').select('*', { count: 'exact', head: true }).eq('business_id', prof.id)
        setUsedBlogs(count || 0)

        // Fetch Leads
        const { data: bookingsData } = await supabase
          .from('bookings')
          .select('*')
          .eq('business_id', prof.id)
          .order('created_at', { ascending: false })
        
        if (bookingsData) {
          setLeads(bookingsData)
        }

        // Subscribe to Realtime Bookings
        activeChannel = supabase.channel('realtime_bookings')
          .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'bookings',
            filter: `business_id=eq.${prof.id}`
          }, (payload) => {
            setLeads((currentLeads) => [payload.new, ...currentLeads])
          })
          .subscribe()
      }
      
      setLoading(false)
    }

    loadData()

    return () => {
      if (activeChannel) {
        supabase.removeChannel(activeChannel)
      }
    }
  }, [])

  const handleTemplateChange = async (templateId: string) => {
    if (!landingPage) return;
    
    // Update DB
    const { error } = await supabase
      .from('landing_pages')
      .update({ template_id: templateId })
      .eq('id', landingPage.id)
      
    if (!error) {
      setLandingPage({ ...landingPage, template_id: templateId })
      setIsChangingTemplate(false)
    } else {
      console.error("Failed to update template", error)
    }
  }

  const handleSubscribe = (pkg: any) => {
    setSelectedPkg(pkg)
  }

  const handleConfirmPayment = async () => {
    if (!profile || !selectedPkg) return
    
    const { error } = await supabase.from('subscriptions').insert([{
      business_id: profile.id,
      package_id: selectedPkg.id,
      status: 'Active',
      verified: false
    }])

    if (!error) {
      alert('Chuyển khoản thành công! Gói dịch vụ đã được kích hoạt lập tức để bạn sử dụng. Admin sẽ đối chiếu và xác minh trong vòng 24h.')
      setIsUpgradeModalOpen(false)
      setSelectedPkg(null)
      
      // Cập nhật lại Quota ngay trên màn hình chính
      const { data: subData } = await supabase
        .from('subscriptions')
        .select('package_id, packages(limits)')
        .eq('business_id', profile.id)
        .eq('status', 'Active')
        .single()
      
      let packageLimitBlogs = 0
      if (subData && (subData.packages as any)?.limits?.max_blogs) {
        packageLimitBlogs = (subData.packages as any).limits.max_blogs
      } else {
        packageLimitBlogs = 3
      }
      setMaxBlogs(packageLimitBlogs)
    } else {
      alert('Có lỗi xảy ra khi kích hoạt gói: ' + error.message)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-[#F9F6F0] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <main className="min-h-screen bg-[#F9F6F0] pt-32 pb-24 px-6 md:px-12 text-[#2F2F2F]">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-[#D4AF37] font-mono text-[10px] uppercase tracking-[0.4em]"
            >
              <ShieldCheck size={14} />
              <span>Cổng quản trị doanh nghiệp</span>
            </motion.div>
            <h1 className="font-display text-4xl md:text-6xl text-[#2F2F2F] italic">
              Xin chào, <span className="text-[#D4AF37]">{profile?.business_name || 'Quý khách'}</span>
            </h1>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {isAdmin && (
              <Link href="/admin">
                <button className="flex items-center justify-center gap-2 px-6 py-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs font-mono uppercase tracking-widest text-amber-600 hover:bg-amber-500 hover:text-white transition-all shadow-sm w-full sm:w-auto font-bold">
                  <ShieldCheck size={14} />
                  Quản trị Hệ thống
                </button>
              </Link>
            )}
            
            {profile?.slug && (
              <Link href={`/p/${profile.slug}`} target="_blank">
                <button className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-[#D4AF37]/20 rounded-xl text-xs font-mono uppercase tracking-widest text-[#2F2F2F] hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all shadow-sm w-full sm:w-auto">
                  <ExternalLink size={14} />
                  Xem trang cá nhân
                </button>
              </Link>
            )}
            
            <Link href={`/p/${profile?.slug || 'undefined'}?edit=true`}>
              <button className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-[#D4AF37] via-[#F5E0A3] to-[#B8860B] text-[#2F2F2F] rounded-xl text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-[0_10px_30px_rgba(212,175,55,0.3)] w-full sm:w-auto border border-white/40">
                <Edit3 size={14} />
                Chỉnh sửa trang
              </button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard icon={<Users />} label="Lượt truy cập" value="1,284" trend="+12%" />
          <StatCard icon={<Calendar />} label="Booking mới" value={leads.length.toString()} trend="+5%" />
          <StatCard icon={<TrendingUp />} label="Doanh thu dự kiến" value="45.5M" trend="+8%" />
          <StatCard 
            icon={<Clock />} 
            label="Trial còn lại" 
            value="24 ngày" 
            subValue="Hết hạn: 29/05/2026"
            isWarning
          />
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#D4AF37]/20 gap-8">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`pb-4 text-xs font-bold font-mono uppercase tracking-widest border-b-2 transition-all ${activeTab === 'overview' ? 'border-[#D4AF37] text-[#D4AF37]' : 'border-transparent text-zinc-400 hover:text-zinc-600'}`}
          >
            Tổng Quan
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`pb-4 text-xs font-bold font-mono uppercase tracking-widest border-b-2 transition-all ${activeTab === 'settings' ? 'border-[#D4AF37] text-[#D4AF37]' : 'border-transparent text-zinc-400 hover:text-zinc-600'}`}
          >
            Cài Đặt Tài Khoản
          </button>
        </div>

        {activeTab === 'overview' ? (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            
            {/* Left Column: Landing Page & Lead Tracker */}
            <div className="xl:col-span-2 space-y-8">
              
              {/* Quota Progress */}
              <div className="bg-white p-6 rounded-[2rem] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-[#D4AF37]/20 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-1">Tiến độ bài viết (SEO)</h3>
                  <p className="text-3xl font-display font-bold text-[#2F2F2F] mt-2">
                    {usedBlogs} <span className="text-zinc-400 text-xl font-normal">/ {maxBlogs} bài</span>
                  </p>
                </div>
                <div className="mt-4">
                  <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${usedBlogs >= maxBlogs ? 'bg-red-500' : 'bg-gradient-to-r from-[#D4AF37] to-[#F5E0A3]'}`}
                      style={{ width: `${Math.min((usedBlogs / (maxBlogs || 1)) * 100, 100)}%` }}
                    />
                  </div>
                  {usedBlogs >= maxBlogs && (
                    <button 
                      onClick={() => setIsUpgradeModalOpen(true)}
                      className="text-xs text-red-500 mt-2 font-semibold underline hover:text-red-700 transition-colors block text-left"
                    >
                      Đã hết dung lượng. Vui lòng nâng cấp ngay!
                    </button>
                  )}
                </div>
              </div>

              {/* Landing Page Preview */}
              <div className="bg-white border border-[#D4AF37]/20 rounded-[2rem] p-8 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-bl-full -z-10 blur-3xl"></div>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <h3 className="font-display text-2xl text-[#2F2F2F]">Landing Page hiện tại</h3>
                  <span className="px-4 py-1.5 bg-green-50 text-green-600 text-[10px] font-bold font-mono uppercase tracking-widest rounded-full border border-green-200">
                    Đang hoạt động
                  </span>
                </div>
                
                <div className="relative aspect-[21/9] rounded-2xl overflow-hidden group border border-zinc-100 shadow-inner">
                   <img 
                    src={landing_page_preview_url(landingPage?.template_id)} 
                    alt="Template Preview" 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                   />
                   <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                      <Link href={`/p/${landingPage?.business_slug}?edit=true`} className="px-8 py-3 bg-white text-[#2F2F2F] font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-[#F9F6F0] transition-colors shadow-xl">
                        Mở Visual Editor
                      </Link>
                   </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-zinc-100">
                   <div className="space-y-1">
                      <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest flex items-center gap-2">
                        <Palette size={12} className="text-[#D4AF37]" /> 
                        Template: <span className="font-bold text-[#2F2F2F]">{formatTemplateName(landingPage?.template_id)}</span>
                      </p>
                      <p className="text-[10px] text-zinc-400">
                        Cập nhật lần cuối: {landingPage?.updated_at ? new Date(landingPage.updated_at).toLocaleDateString('vi-VN') : 'Mới đây'}
                      </p>
                   </div>
                   
                   {/* Template Selector */}
                   <div className="relative">
                      {isChangingTemplate ? (
                        <div className="flex items-center gap-2 bg-zinc-50 p-1 rounded-lg border border-zinc-200">
                          {['royal_classic_01', 'modern_medical_01', 'seasonal_event_01'].map(id => (
                            <button 
                              key={id}
                              onClick={() => handleTemplateChange(id)}
                              className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest rounded-md transition-colors ${landingPage?.template_id === id ? 'bg-[#D4AF37] text-white font-bold' : 'hover:bg-zinc-200 text-zinc-600'}`}
                            >
                              {id.split('_')[0]}
                            </button>
                          ))}
                          <button 
                            onClick={() => setIsChangingTemplate(false)}
                            className="px-2 py-1.5 text-zinc-400 hover:text-red-500"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => setIsChangingTemplate(true)}
                          className="text-[#D4AF37] text-xs font-mono font-bold uppercase tracking-widest hover:text-[#B8860B] transition-colors flex items-center gap-2"
                        >
                          Đổi giao diện <ChevronRight size={14} />
                        </button>
                      )}
                   </div>
                </div>
              </div>

              {/* Lead Tracker Table */}
              <LeadTrackerTable leads={leads} />

            </div>

            {/* Right Column: Notifications & Upgrades */}
            <div className="space-y-8">
              <div className="bg-white border border-[#D4AF37]/20 rounded-[2rem] p-8 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)]">
                <h3 className="font-display text-2xl text-[#2F2F2F] mb-6">Thông báo mới</h3>
                <div className="space-y-6">
                  <NotificationItem 
                    title="Có khách đặt lịch mới" 
                    desc="Chị Minh Anh vừa đặt lịch qua Landing Page" 
                    time="15 phút trước" 
                    isNew
                  />
                  <NotificationItem 
                    title="Gợi ý tối ưu trang" 
                    desc="Thêm hình ảnh thực tế dịch vụ để tăng 30% tỷ lệ chuyển đổi." 
                    time="2 giờ trước" 
                  />
                  <NotificationItem 
                    title="Báo cáo tuần hoàn tất" 
                    desc="Lượt truy cập trang đích tăng 12% so với tuần trước." 
                    time="Hôm qua" 
                  />
                </div>
                <button className="w-full mt-8 py-3 bg-[#F9F6F0] rounded-xl text-[10px] font-bold font-mono uppercase tracking-widest text-zinc-600 hover:text-[#D4AF37] transition-colors flex items-center justify-center gap-2">
                  Xem tất cả <ChevronRight size={12} />
                </button>
              </div>

              {/* Upgrade Banner */}
              <div className="relative bg-gradient-to-br from-[#2F2F2F] to-[#1A1A1A] rounded-[2rem] p-8 space-y-6 overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/20 rounded-bl-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-tr-full blur-xl"></div>
                
                <div className="relative z-10">
                  <ShieldCheck className="text-[#D4AF37] mb-4" size={24} />
                  <h3 className="text-white font-display text-2xl leading-snug mb-2">Gia hạn Premium</h3>
                  <p className="text-zinc-400 text-sm mb-6">Nhận ngay ưu đãi 20% phí duy trì và kích hoạt bộ công cụ CRM nâng cao.</p>
                  <button 
                    onClick={() => setIsUpgradeModalOpen(true)}
                    className="w-full py-3.5 bg-gradient-to-r from-[#D4AF37] via-[#F5E0A3] to-[#B8860B] text-[#2F2F2F] font-bold text-xs font-mono uppercase tracking-widest rounded-xl hover:brightness-110 transition-all shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                  >
                    Nâng cấp gói ngay
                  </button>
                </div>
              </div>
            </div>

          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Personal Profile & Security (1/3 width) */}
            <div className="space-y-8">
              {/* Personal Info Box */}
              <div className="bg-white border border-[#D4AF37]/20 rounded-[2rem] p-8 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] space-y-6">
                <h3 className="text-xs font-mono font-bold tracking-widest text-[#D4AF37] uppercase pb-2 border-b border-zinc-100 flex items-center gap-2">
                  <span>Hồ sơ cá nhân</span>
                </h3>

                <form onSubmit={handlePersonalSave} className="space-y-6">
                  {/* Avatar Uploader */}
                  <div className="flex flex-col items-center space-y-3">
                    <div className="relative w-24 h-24 rounded-full border-2 border-[#D4AF37]/40 overflow-hidden group shadow-md bg-[#D4AF37]/5 flex items-center justify-center">
                      {personalAvatar ? (
                        <img src={personalAvatar} alt="Personal Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-2xl font-bold text-[#D4AF37]">{fullName ? fullName[0].toUpperCase() : (user?.email ? user.email[0].toUpperCase() : 'U')}</span>
                      )}
                      <div 
                        onClick={() => document.getElementById('personal-avatar-upload')?.click()}
                        className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <span className="text-white text-[10px] font-bold font-mono uppercase tracking-wider text-center px-2">Đổi ảnh</span>
                      </div>
                    </div>
                    <input 
                      type="file" 
                      id="personal-avatar-upload" 
                      accept="image/*" 
                      onChange={handleAvatarUpload}
                      disabled={isUploadingAvatar}
                      className="hidden" 
                    />
                    <p className="text-[10px] text-zinc-400 font-mono">Dung lượng tối đa: 2MB</p>
                  </div>

                  {/* Email (Editable with double-confirm) */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Email tài khoản</label>
                      <button
                        type="button"
                        onClick={() => {
                          setIsChangingEmail(!isChangingEmail)
                          setNewEmailInput(user?.email || '')
                        }}
                        className="text-xs font-mono font-bold uppercase tracking-wider text-[#D4AF37] hover:underline"
                      >
                        {isChangingEmail ? 'Hủy' : 'Thay đổi'}
                      </button>
                    </div>
                    <div className="relative flex gap-2">
                      <input 
                        type="email" 
                        disabled={!isChangingEmail || isSavingEmail}
                        value={isChangingEmail ? newEmailInput : (user?.email || '')} 
                        onChange={e => setNewEmailInput(e.target.value)}
                        className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none transition-colors ${
                          isChangingEmail 
                            ? 'border-[#D4AF37] bg-white text-zinc-800' 
                            : 'border-zinc-100 bg-zinc-50 text-zinc-400 cursor-not-allowed'
                        }`}
                      />
                      {isChangingEmail && (
                        <button
                          type="button"
                          onClick={handleEmailChange}
                          disabled={isSavingEmail || newEmailInput === user?.email}
                          className="px-4 bg-[#D4AF37] text-[#2F2F2F] hover:brightness-110 font-bold text-xs font-mono uppercase tracking-widest rounded-xl transition-all disabled:opacity-50"
                        >
                          {isSavingEmail ? 'Lưu...' : 'Lưu'}
                        </button>
                      )}
                      {!isChangingEmail && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-300">🔒</span>}
                    </div>
                  </div>

                  {/* Full Name */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Họ và tên</label>
                    <input 
                      type="text" 
                      required
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder="Ví dụ: Lê Minh Đức"
                      className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:border-[#D4AF37] focus:outline-none transition-colors text-sm"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={isSavingPersonal}
                    className="w-full py-3.5 bg-[#2F2F2F] text-[#D4AF37] hover:bg-black text-xs font-mono font-bold uppercase tracking-widest rounded-xl transition-all disabled:opacity-50"
                  >
                    {isSavingPersonal ? 'Đang lưu...' : 'Lưu hồ sơ cá nhân'}
                  </button>
                </form>
              </div>

              {/* Password Change Box */}
              <div className="bg-white border border-[#D4AF37]/20 rounded-[2rem] p-8 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] space-y-6">
                <h3 className="text-xs font-mono font-bold tracking-widest text-[#D4AF37] uppercase pb-2 border-b border-zinc-100">
                  Thay đổi mật khẩu
                </h3>

                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Mật khẩu mới</label>
                    <input 
                      type="password" 
                      required
                      value={passwordForm.newPassword}
                      onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      placeholder="Tối thiểu 6 ký tự"
                      className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:border-[#D4AF37] focus:outline-none transition-colors text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Xác nhận mật khẩu</label>
                    <input 
                      type="password" 
                      required
                      value={passwordForm.confirmPassword}
                      onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      placeholder="Nhập lại mật khẩu mới"
                      className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:border-[#D4AF37] focus:outline-none transition-colors text-sm"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={isSavingPassword}
                    className="w-full py-3.5 bg-[#2F2F2F] text-[#D4AF37] hover:bg-black text-xs font-mono font-bold uppercase tracking-widest rounded-xl transition-all disabled:opacity-50"
                  >
                    {isSavingPassword ? 'Đang lưu...' : 'Cập nhật mật khẩu'}
                  </button>
                </form>
              </div>
            </div>

            {/* Right Column: Business & Spa Brand Identity (2/3 width) */}
            <div className="lg:col-span-2 bg-white border border-[#D4AF37]/20 rounded-[2rem] p-8 md:p-12 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)]">
              <h2 className="font-display text-3xl text-[#2F2F2F] mb-2">Cài đặt thương hiệu Doanh nghiệp</h2>
              <p className="text-sm text-zinc-500 mb-8">Cập nhật thông tin nhận diện thương hiệu, liên hệ và địa chỉ của Spa/Thẩm mỹ viện của bạn.</p>

              <form onSubmit={handleSaveSettings} className="space-y-8">
                {/* Brand Section */}
                <div className="space-y-6">
                  <h3 className="text-xs font-mono font-bold tracking-widest text-[#D4AF37] uppercase pb-2 border-b border-zinc-100">1. Nhận diện thương hiệu</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Tên thương hiệu</label>
                      <input 
                        type="text" 
                        required
                        value={settingsForm.business_name}
                        onChange={e => setSettingsForm({ ...settingsForm, business_name: e.target.value })}
                        className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:border-[#D4AF37] focus:outline-none transition-colors text-sm"
                        placeholder="Ví dụ: Royal Beauty Spa"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Đường dẫn độc quyền (Slug)</label>
                      <div className="flex rounded-xl overflow-hidden border border-zinc-200 focus-within:border-[#D4AF37] transition-colors">
                        <span className="bg-zinc-50 px-3 py-3 text-xs text-zinc-500 font-mono flex items-center border-r border-zinc-100">1beauty.asia/p/</span>
                        <input 
                          type="text" 
                          required
                          value={settingsForm.slug}
                          onChange={e => setSettingsForm({ ...settingsForm, slug: e.target.value })}
                          className="w-full px-4 py-3 focus:outline-none text-sm"
                          placeholder="royal-beauty"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Danh mục kinh doanh</label>
                      <select 
                        value={settingsForm.category}
                        onChange={e => setSettingsForm({ ...settingsForm, category: e.target.value })}
                        className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:border-[#D4AF37] focus:outline-none bg-white transition-colors text-sm"
                      >
                        <option value="Spa">Spa</option>
                        <option value="Beauty">Beauty</option>
                        <option value="Dental Clinic">Dental Clinic</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Logo thương hiệu</label>
                      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                        <div className="flex-1 flex gap-2">
                          <input 
                            type="text" 
                            value={settingsForm.logo_url}
                            onChange={e => setSettingsForm({ ...settingsForm, logo_url: e.target.value })}
                            className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:border-[#D4AF37] focus:outline-none transition-colors text-sm"
                            placeholder="Nhập URL ảnh hoặc tải lên..."
                          />
                          <input 
                            type="file" 
                            id="logo-file-upload" 
                            accept="image/*" 
                            onChange={handleLogoUpload}
                            disabled={isUploadingLogo}
                            className="hidden" 
                          />
                          <button 
                            type="button"
                            disabled={isUploadingLogo}
                            onClick={() => document.getElementById('logo-file-upload')?.click()}
                            className="px-4 py-3 bg-[#F9F6F0] border border-zinc-200 rounded-xl text-xs font-bold font-mono text-zinc-600 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all whitespace-nowrap shrink-0 disabled:opacity-50"
                          >
                            {isUploadingLogo ? 'Đang tải...' : 'Tải Lên Ảnh'}
                          </button>
                        </div>
                        {settingsForm.logo_url && (
                          <div className="w-12 h-12 rounded-full border border-zinc-200 overflow-hidden shrink-0 shadow-inner mx-auto sm:mx-0">
                            <img src={settingsForm.logo_url} alt="Logo Preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location & Contact Section */}
                <div className="space-y-6 pt-4">
                  <h3 className="text-xs font-mono font-bold tracking-widest text-[#D4AF37] uppercase pb-2 border-b border-zinc-100">2. Thông tin liên hệ & Vị trí</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Thành phố</label>
                      <select 
                        required
                        value={settingsForm.location_city || 'Hồ Chí Minh'}
                        onChange={e => {
                          const city = e.target.value;
                          const defaultDistrict = LOCATION_DATA[city]?.[0] || '';
                          setSettingsForm({ ...settingsForm, location_city: city, location_district: defaultDistrict });
                        }}
                        className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:border-[#D4AF37] focus:outline-none bg-white transition-colors text-sm"
                      >
                        {Object.keys(LOCATION_DATA).map(city => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Quận/Huyện</label>
                      <select 
                        required
                        value={settingsForm.location_district || LOCATION_DATA[settingsForm.location_city || 'Hồ Chí Minh']?.[0] || ''}
                        onChange={e => setSettingsForm({ ...settingsForm, location_district: e.target.value })}
                        className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:border-[#D4AF37] focus:outline-none bg-white transition-colors text-sm"
                      >
                        {(LOCATION_DATA[settingsForm.location_city || 'Hồ Chí Minh'] || []).map(dist => (
                          <option key={dist} value={dist}>{dist}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Số điện thoại Zalo</label>
                      <input 
                        type="text" 
                        value={settingsForm.zalo_phone}
                        onChange={e => setSettingsForm({ ...settingsForm, zalo_phone: e.target.value })}
                        className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:border-[#D4AF37] focus:outline-none transition-colors text-sm"
                        placeholder="Ví dụ: 0918xxxxxx"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Hotline đặt lịch</label>
                      <input 
                        type="text" 
                        value={settingsForm.hotline}
                        onChange={e => setSettingsForm({ ...settingsForm, hotline: e.target.value })}
                        className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:border-[#D4AF37] focus:outline-none transition-colors text-sm"
                        placeholder="Ví dụ: 1900xxxx"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <button 
                    type="submit"
                    disabled={isSavingSettings}
                    className="px-8 py-4 bg-gradient-to-r from-[#D4AF37] via-[#F5E0A3] to-[#B8860B] text-[#2F2F2F] font-bold text-xs font-mono uppercase tracking-widest rounded-xl hover:brightness-110 disabled:opacity-50 transition-all shadow-[0_10px_30px_rgba(212,175,55,0.3)] border border-white/20"
                  >
                    {isSavingSettings ? 'Đang lưu...' : 'Lưu Thay Đổi Cài Đặt'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>

      {/* Upgrade Modal */}
      {isUpgradeModalOpen && (
        <div className="fixed inset-0 z-[9999] bg-[#2F2F2F]/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-display text-[#2F2F2F]">{selectedPkg ? 'Thanh Toán Chuyển Khoản' : 'Nâng Cấp Dịch Vụ'}</h2>
                <p className="text-zinc-500 mt-2">
                  {selectedPkg 
                    ? `Hoàn tất thanh toán gói ${selectedPkg?.name || ''} bằng cách quét mã QR bên dưới.` 
                    : 'Mở khoá toàn bộ tiềm năng doanh nghiệp của bạn với 1Beauty.Asia'}
                </p>
              </div>
              <button 
                onClick={() => {
                  setIsUpgradeModalOpen(false)
                  setSelectedPkg(null)
                }} 
                className="bg-zinc-100 p-2 rounded-full hover:bg-zinc-200"
              >
                <X size={24} className="text-zinc-600"/>
              </button>
            </div>
            
            {selectedPkg ? (
              <div className="space-y-8 max-w-xl mx-auto text-center">
                <div className="bg-[#F9F6F0] border border-[#D4AF37]/30 rounded-3xl p-6">
                  <span className="text-[#D4AF37] text-xs font-mono font-bold tracking-[0.2em] uppercase">Gói Đã Chọn</span>
                  <h3 className="text-2xl font-bold mt-2 text-[#2F2F2F]">{selectedPkg?.name || ''}</h3>
                  <div className="text-3xl font-display font-bold text-[#D4AF37] mt-2">{(selectedPkg?.price || 0).toLocaleString('vi-VN')}đ</div>
                </div>

                <div className="flex flex-col items-center space-y-4">
                  <p className="text-sm text-zinc-500 max-w-md">Sử dụng ứng dụng Ngân hàng (mọi ngân hàng) quét mã QR bên dưới để thanh toán nhanh:</p>
                  
                  {/* VietQR Code */}
                  <div className="p-4 bg-white border border-[#D4AF37]/30 rounded-3xl shadow-lg relative overflow-hidden">
                    <img 
                      src="/qr_code.jpg"
                      alt="VietQR Techcombank 1Beauty.Asia"
                      className="w-56 h-auto object-contain bg-white p-1 rounded-2xl"
                    />
                  </div>

                  <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-center w-full max-w-md">
                    <p className="text-xs text-amber-800 font-semibold leading-relaxed">
                      Vui lòng mở ứng dụng ngân hàng và quét mã QR trên để thanh toán nhanh chóng và chính xác.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => setSelectedPkg(null)} 
                    className="flex-1 py-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl font-bold uppercase tracking-widest text-xs transition-colors"
                  >
                    Quay Lại
                  </button>
                  <button 
                    onClick={handleConfirmPayment} 
                    className="flex-1 py-4 bg-gradient-to-r from-[#D4AF37] via-[#F5E0A3] to-[#B8860B] text-[#2F2F2F] hover:brightness-110 rounded-xl font-bold uppercase tracking-widest text-xs transition-all shadow-[0_10px_30px_rgba(212,175,55,0.3)] border border-white/20"
                  >
                    Tôi đã chuyển khoản thành công
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(packages || []).map(pkg => (
                  <div key={pkg.id} className="border border-[#D4AF37]/30 rounded-3xl p-6 relative flex flex-col hover:shadow-xl transition-all">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4AF37]/10 rounded-bl-full -z-10" />
                    
                    <h3 className="text-xl font-bold text-[#2F2F2F] mb-2">{pkg?.name || ''}</h3>
                    <div className="mb-6">
                      <span className="text-3xl font-display font-bold text-[#D4AF37]">{(pkg?.price || 0).toLocaleString('vi-VN')}đ</span>
                      <span className="text-zinc-500 text-sm">/{pkg?.duration_days || 365} ngày</span>
                    </div>
                    
                    <ul className="space-y-3 mb-8 flex-1">
                      {(Array.isArray(pkg?.features) ? pkg.features : []).map((f: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-zinc-600">
                          <Check size={16} className="text-[#D4AF37] mt-0.5 shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>

                    <button 
                      onClick={() => handleSubscribe(pkg)}
                      className="w-full py-3 bg-[#2F2F2F] text-[#D4AF37] rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-black transition-colors"
                    >
                      Đăng Ký Ngay
                    </button>
                    {(pkg?.trial_days || 0) > 0 && (
                      <p className="text-center text-[10px] text-zinc-400 mt-3 font-mono uppercase tracking-widest">
                        Tặng {pkg.trial_days} ngày dùng thử
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  )
}

function StatCard({ icon, label, value, trend, subValue, isWarning = false }: any) {
  return (
    <div className="bg-white border border-[#D4AF37]/20 rounded-[2rem] p-8 space-y-4 hover:shadow-[0_10px_40px_-15px_rgba(212,175,55,0.15)] transition-all duration-300 relative overflow-hidden group">
      {isWarning && <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/5 rounded-bl-full blur-xl" />}
      
      <div className="flex items-center justify-between relative z-10">
        <div className={`p-3 rounded-2xl transition-colors ${isWarning ? 'bg-red-50 text-red-500' : 'bg-[#F9F6F0] text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-white'}`}>
          {React.cloneElement(icon, { size: 20 })}
        </div>
        {trend && (
          <span className="text-[10px] font-bold font-mono text-green-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">{trend}</span>
        )}
      </div>
      <div className="space-y-1 relative z-10">
        <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest">{label}</p>
        <div className="flex items-baseline gap-2">
          <p className={`text-4xl font-display font-medium ${isWarning ? 'text-red-600' : 'text-[#2F2F2F]'}`}>{value}</p>
        </div>
        {subValue && <p className="text-[10px] text-zinc-400 font-mono uppercase tracking-widest">{subValue}</p>}
      </div>
    </div>
  )
}

function NotificationItem({ title, desc, time, isNew = false }: any) {
  return (
    <div className="flex gap-4 group cursor-pointer p-2 -mx-2 rounded-xl hover:bg-[#F9F6F0] transition-colors">
      <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${isNew ? 'bg-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.8)]' : 'bg-zinc-200'}`} />
      <div className="space-y-1.5">
        <p className={`text-sm font-semibold ${isNew ? 'text-[#2F2F2F]' : 'text-zinc-500'} group-hover:text-[#D4AF37] transition-colors`}>{title}</p>
        <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2">{desc}</p>
        <p className="text-[10px] text-zinc-400 font-mono uppercase">{time}</p>
      </div>
    </div>
  )
}

function formatTemplateName(template_id: string) {
  if (!template_id) return 'Royal Classic'
  return template_id.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

function landing_page_preview_url(template_id: string) {
  switch (template_id) {
    case 'modern_medical_01': return 'https://images.unsplash.com/photo-1519415387722-a1c3bbef716c?auto=format&fit=crop&q=80'
    case 'seasonal_event_01': return 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&q=80'
    default: return 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80'
  }
}
