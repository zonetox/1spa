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
          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium'
          : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 border border-transparent'
      }`}
    >
      <Icon 
        size={15} 
        className={`flex-shrink-0 ${isActive ? 'text-amber-400' : 'text-zinc-500 group-hover:text-zinc-300'} transition-colors`} 
      />
      <span className="truncate">{label}</span>
      {isActive && <div className="ml-auto w-1 h-1 rounded-full bg-amber-400" />}
    </Link>
  )
}

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex">
      {/* Sidebar */}
      <aside className="w-60 border-r border-zinc-800/60 flex flex-col fixed top-0 left-0 h-full z-40 bg-zinc-950">
        {/* Logo */}
        <div className="p-5 border-b border-zinc-800/60">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center">
              <Sparkles size={14} className="text-black" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-zinc-100 font-display tracking-wide">1Beauty.Asia Admin</h1>
              <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-[0.2em]">Quản Trị Hệ Thống</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-[0.2em] px-4 py-2">Menu Chính</p>
          {navItems.map(item => (
            <NavLink key={item.href} {...item} />
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-zinc-800/60 space-y-2">
          <div className="px-4 py-2">
            <p className="text-[10px] text-zinc-600 font-mono">Đăng nhập với vai trò</p>
            <p className="text-xs text-amber-500 font-medium">Super Admin</p>
          </div>
          <a
            href="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800/40 border border-transparent transition-all"
          >
            <LogOut size={15} />
            Về trang chủ
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-60 min-h-screen">
        <div className="p-8 max-w-screen-xl">
          {children}
        </div>
      </main>
    </div>
  )
}
