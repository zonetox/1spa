'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Layers, Users, TrendingUp, Sparkles, Menu, X } from 'lucide-react'
import { LotusIcon } from '@/components/ui/LotusIcon'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'

export const Navbar = () => {
  const pathname = usePathname()
  
  if (pathname && pathname.startsWith('/p/')) {
    return null
  }

  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [account, setAccount] = useState<any>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
 
  const supabase = createClient()
 
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
 
  useEffect(() => {
    const fetchUserAndProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        const { data: acc } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle()
        setAccount(acc)
        const { data: prof } = await supabase.from('business_profiles').select('*').eq('account_id', user.id).maybeSingle()
        if (prof) setProfile(prof)
      }
    }
    fetchUserAndProfile()
 
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user || null
      setUser(currentUser)
      if (currentUser) {
        const { data: acc } = await supabase.from('profiles').select('*').eq('id', currentUser.id).maybeSingle()
        setAccount(acc)
        const { data: prof } = await supabase.from('business_profiles').select('*').eq('account_id', currentUser.id).maybeSingle()
        if (prof) setProfile(prof)
      } else {
        setAccount(null)
        setProfile(null)
      }
    })
 
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const navItems = [
    { label: 'Khám phá', href: '/' },
    { label: 'Danh bạ', href: '/directory' },
    { label: 'Ưu đãi', href: '/offers' },
    { label: 'Cảm hứng', href: '/blog' },
  ]

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-[#F9F6F0]/90 backdrop-blur-xl border-b border-[#D4AF37]/30 shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between relative">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="flex items-center"
            >
              <Image 
                width={150} height={50}
                src="/logo.png" 
                alt="1BEAUTY.ASIA" 
                className={`h-9 w-auto object-contain transition-all duration-500 ${
                  (scrolled || (pathname !== '/' && !pathname.startsWith('/p/'))) ? 'brightness-[0.2]' : 'brightness-0 invert'
                }`}
              />
            </motion.div>
          </Link>

          {/* Central Nav – Desktop */}
          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-1">
            {navItems.map((item) => {
              const active = pathname === item.href
              return (
                <Link key={item.href} href={item.href} className="relative px-5 py-2 group">
                  <span className={`text-[11px] font-medium tracking-widest uppercase transition-colors duration-300 ${
                    active
                      ? 'text-[#D4AF37]'
                      : (scrolled || (pathname !== '/' && !pathname.startsWith('/p/')))
                        ? 'text-[#2F2F2F] hover:text-[#D4AF37]'
                        : 'text-white/80 hover:text-white'
                  }`}>
                    {item.label}
                  </span>
                  {active && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-3 right-3 h-[1.5px] bg-[#D4AF37]"
                    />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className={`text-[11px] tracking-widest uppercase font-medium transition-colors duration-300 ${
                    (scrolled || (pathname !== '/' && !pathname.startsWith('/p/'))) ? 'text-[#2F2F2F]/60 hover:text-[#D4AF37]' : 'text-white/60 hover:text-white'
                  }`}
                >
                  Dashboard
                </Link>
                <div className="relative">
                  {/* Avatar Button */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="w-10 h-10 rounded-full border-2 border-[#D4AF37]/40 overflow-hidden shadow-md cursor-pointer flex items-center justify-center bg-[#D4AF37]/10 transition-all hover:border-[#D4AF37]"
                  >
                    {profile?.logo_url ? (
                      <Image width={100} height={100} src={profile.logo_url} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs font-mono font-bold text-[#D4AF37]">
                        {(profile?.business_name || user?.email || 'A').charAt(0).toUpperCase()}
                      </span>
                    )}
                  </motion.div>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {dropdownOpen && (
                      <>
                        {/* Invisible Backdrop to close dropdown on outer click */}
                        <div 
                          className="fixed inset-0 z-40" 
                          onClick={() => setDropdownOpen(false)} 
                        />
                        
                        <motion.div
                          initial={{ opacity: 0, y: 15, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 15, scale: 0.95 }}
                          transition={{ duration: 0.2, ease: 'easeOut' }}
                          className="absolute right-0 mt-3 w-80 bg-white/95 backdrop-blur-xl border border-[#D4AF37]/20 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.1)] p-6 z-50 space-y-4 text-left"
                        >
                          {/* Profile Header */}
                          <div className="space-y-3 pb-3 border-b border-[#D4AF37]/10">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full border border-[#D4AF37]/30 overflow-hidden flex items-center justify-center bg-[#D4AF37]/5">
                                {profile?.logo_url ? (
                                  <Image width={100} height={100} src={profile.logo_url} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                  <span className="text-xs font-mono font-bold text-[#D4AF37]">
                                    {(profile?.business_name || user?.email || 'A').charAt(0).toUpperCase()}
                                  </span>
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <h4 className="text-[10px] font-bold font-mono tracking-widest text-[#D4AF37] uppercase">Hồ sơ tài khoản</h4>
                                <p className="text-[10px] text-zinc-500 font-mono tracking-wider truncate" title={user?.email}>{user?.email}</p>
                              </div>
                            </div>
                            
                            {/* Role / Plan Badge */}
                            <div className="flex flex-wrap gap-2 pt-1">
                              <span className="px-3 py-1 rounded-full text-[9px] font-bold font-mono uppercase tracking-widest bg-[#2F2F2F] text-[#D4AF37] border border-[#D4AF37]/20 shadow-sm">
                                Quyền: {account?.role === 'admin' ? 'Admin / Quản trị viên' : 'Business / Doanh nghiệp'}
                              </span>
                              {profile?.category && (
                                <span className="px-3 py-1 rounded-full text-[9px] font-bold font-mono uppercase tracking-widest bg-[#F9F6F0] text-[#2F2F2F] border border-zinc-200">
                                  {profile.category}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Business Info if exists */}
                          {profile && (
                            <div className="bg-[#F9F6F0] border border-[#D4AF37]/10 p-3.5 rounded-xl space-y-1">
                              <span className="text-[9px] font-mono font-bold tracking-widest text-zinc-400 uppercase">Cơ sở sở hữu</span>
                              <p className="text-xs font-display italic font-semibold text-[#2F2F2F]">{profile.business_name}</p>
                              {profile.location_city && (
                                <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">
                                  {profile.location_district ? `${profile.location_district}, ` : ''}{profile.location_city}
                                </p>
                              )}
                            </div>
                          )}

                          {/* Quick Links */}
                          <div className="flex flex-col gap-1 pt-1">
                            {account?.role === 'admin' && (
                              <Link 
                                href="/admin" 
                                onClick={() => setDropdownOpen(false)}
                                className="px-3 py-2 text-[10px] font-bold font-mono uppercase tracking-widest text-amber-600 hover:text-amber-500 hover:bg-amber-500/5 rounded-lg transition-all flex items-center justify-between border border-amber-500/20 bg-amber-500/[0.02]"
                              >
                                <span>Bàn điều khiển SaaS (Admin)</span>
                                <span className="text-amber-500">→</span>
                              </Link>
                            )}
                            <Link 
                              href="/dashboard" 
                              onClick={() => setDropdownOpen(false)}
                              className="px-3 py-2 text-[10px] font-bold font-mono uppercase tracking-widest text-zinc-600 hover:text-[#D4AF37] hover:bg-[#F9F6F0]/50 rounded-lg transition-all flex items-center justify-between"
                            >
                              <span>Cổng quản trị (Dashboard)</span>
                              <span className="text-zinc-300">→</span>
                            </Link>
                            {profile?.slug && (
                              <Link 
                                href={`/p/${profile.slug}?edit=true`} 
                                onClick={() => setDropdownOpen(false)}
                                className="px-3 py-2 text-[10px] font-bold font-mono uppercase tracking-widest text-zinc-600 hover:text-[#D4AF37] hover:bg-[#F9F6F0]/50 rounded-lg transition-all flex items-center justify-between"
                              >
                                <span>Chỉnh sửa trang</span>
                                <span className="text-zinc-300">→</span>
                              </Link>
                            )}
                          </div>

                          {/* Sign Out Action */}
                          <button 
                            onClick={async () => {
                              setDropdownOpen(false)
                              await supabase.auth.signOut()
                              window.location.href = '/'
                            }}
                            className="w-full pt-3 border-t border-[#D4AF37]/10 text-center text-[10px] font-bold font-mono uppercase tracking-[0.2em] text-[#722F37] hover:text-red-600 transition-colors cursor-pointer"
                          >
                            Đăng xuất tài khoản
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`text-[11px] tracking-widest uppercase font-medium transition-colors duration-300 ${
                    (scrolled || (pathname !== '/' && !pathname.startsWith('/p/'))) ? 'text-[#2F2F2F]/60 hover:text-[#D4AF37]' : 'text-white/60 hover:text-white'
                  }`}
                >
                  Dành cho doanh nghiệp
                </Link>
                <Link href="/login">
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="relative px-6 py-2.5 rounded-full text-[11px] font-semibold tracking-widest uppercase overflow-hidden group"
                    style={{ border: '1.5px solid #D4AF37', color: '#D4AF37' }}
                  >
                    {/* Gold shine effect */}
                    <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent" />
                    Đăng nhập
                  </motion.button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen
              ? <X size={22} className={(scrolled || (pathname !== '/' && !pathname.startsWith('/p/'))) ? 'text-[#2F2F2F]' : 'text-white'} />
              : <Menu size={22} className={(scrolled || (pathname !== '/' && !pathname.startsWith('/p/'))) ? 'text-[#2F2F2F]' : 'text-white'} />
            }
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-[72px] left-0 right-0 z-40 bg-white/98 backdrop-blur-xl border-b border-[#D4AF37]/20 shadow-lg md:hidden"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`text-sm font-medium tracking-widest uppercase py-2 border-b border-[#D4AF37]/10 ${pathname === item.href ? 'text-[#D4AF37]' : 'text-[#2F2F2F]'}`}
                >
                  {item.label}
                </Link>
              ))}
              {user ? (
                <div className="flex flex-col gap-4 pt-2">
                  <Link 
                    href="/dashboard" 
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 py-2 border-b border-[#D4AF37]/10"
                  >
                    <div className="w-8 h-8 rounded-full border border-[#D4AF37]/40 overflow-hidden flex items-center justify-center bg-[#D4AF37]/10">
                      {profile?.logo_url ? (
                        <Image width={100} height={100} src={profile.logo_url} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[10px] font-mono font-bold text-[#D4AF37]">
                          {(profile?.business_name || user?.email || 'A').charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <span className="text-sm font-medium text-[#2F2F2F] uppercase tracking-wider">
                      {profile?.business_name || 'Dashboard'}
                    </span>
                  </Link>
                  <button 
                    onClick={async () => {
                      setMobileOpen(false)
                      await supabase.auth.signOut()
                      window.location.href = '/'
                    }}
                    className="w-full py-3 rounded-full border-[1.5px] border-red-200 text-red-500 text-sm font-semibold tracking-widest uppercase"
                  >
                    Đăng xuất
                  </button>
                </div>
              ) : (
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  <button className="w-full mt-2 py-3 rounded-full border-[1.5px] border-[#D4AF37] text-[#D4AF37] text-sm font-semibold tracking-widest uppercase">
                    Đăng nhập
                  </button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
