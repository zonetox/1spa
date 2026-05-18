'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Database, 
  CreditCard, 
  Users, 
  Package, 
  FileText, 
  Palette, 
  LogOut,
  Sparkles
} from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Tổng Quan & Leads', icon: LayoutDashboard, exact: true },
  { href: '/admin/users', label: 'Đối Tác & Trang Đích', icon: Users },
  { href: '/admin/subscriptions', label: 'Đối Soát Thanh Toán', icon: CreditCard },
  { href: '/admin/packages', label: 'Gói Thành Viên', icon: Package },
  { href: '/admin/import', label: 'Nhập Dữ Liệu Hàng Loạt', icon: Database },
  { href: '/admin/blogs', label: 'Quản Lý Bài Viết', icon: FileText },
  { href: '/admin/branding', label: 'Nhận Diện Thương Hiệu', icon: Palette },
]

function NavLink({ href, label, icon: Icon, exact }: { href: string; label: string; icon: any; exact?: boolean }) {
  const pathname = usePathname()
  const isActive = exact ? pathname === href : pathname.startsWith(href)

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all group ${
        isActive
          ? 'bg-[#D4AF37]/10 text-[#9c7a1c] border border-[#D4AF37]/20 font-medium'
          : 'text-[#2F2F2F]/70 hover:text-[#D4AF37] hover:bg-[#D4AF37]/5 border border-transparent'
      }`}
    >
      <Icon 
        size={15} 
        className={`flex-shrink-0 ${isActive ? 'text-[#9c7a1c]' : 'text-[#2F2F2F]/40 group-hover:text-[#D4AF37]'} transition-colors`} 
      />
      <span className="truncate">{label}</span>
      {isActive && <div className="ml-auto w-1 h-1 rounded-full bg-[#D4AF37]" />}
    </Link>
  )
}

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F9F6F0] text-[#2F2F2F] flex">
      {/* Sidebar */}
      <aside className="w-60 border-r border-[#D4AF37]/20 flex flex-col fixed top-0 left-0 h-full z-40 bg-white">
        {/* Logo */}
        <div className="p-5 border-b border-[#D4AF37]/10">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#D4AF37] flex items-center justify-center">
              <Sparkles size={14} className="text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-[#2F2F2F] font-display tracking-wide">1Beauty.Asia Admin</h1>
              <p className="text-[9px] font-mono text-[#2F2F2F]/40 uppercase tracking-[0.2em]">Quản Trị Hệ Thống</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          <p className="text-[9px] font-mono text-[#2F2F2F]/30 uppercase tracking-[0.2em] px-4 py-2">Menu Chính</p>
          {navItems.map(item => (
            <NavLink key={item.href} {...item} />
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-[#D4AF37]/10 space-y-2">
          <div className="px-4 py-2">
            <p className="text-[10px] text-[#2F2F2F]/40 font-mono">Đăng nhập với vai trò</p>
            <p className="text-xs text-[#9c7a1c] font-medium">Super Admin</p>
          </div>
          <a
            href="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-[#2F2F2F]/60 hover:text-[#D4AF37] hover:bg-[#D4AF37]/5 border border-transparent transition-all"
          >
            <LogOut size={15} />
            Về trang chủ
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-60 min-h-screen bg-[#F9F6F0]">
        <div className="p-8 max-w-screen-xl">
          {children}
        </div>
      </main>
    </div>
  )
}
