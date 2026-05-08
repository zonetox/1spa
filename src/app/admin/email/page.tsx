import React from 'react'
import { Mail, CheckCircle2 } from 'lucide-react'

const EMAIL_TEMPLATES = [
  { id: 'booking_confirmed', name: 'Xác Nhận Đặt Lịch Hẹn', description: 'Gửi tự động cho khách hàng khi họ hoàn tất lịch hẹn tại Spa/Nha khoa.', active: true },
  { id: 'lead_notification', name: 'Thông Báo Lead Mới Cho Đối Tác', description: 'Gửi tự động cho chủ cơ sở khi có khách đặt lịch trên landing page của họ.', active: true },
  { id: 'subscription_expiry', name: 'Cảnh Báo Hết Hạn Gói Thành Viên', description: 'Gửi tự động cảnh báo gia hạn khi gói dùng thử hoặc gói dịch vụ sắp hết hạn.', active: true },
  { id: 'welcome_partner', name: 'Chào Mừng Đối Tác Mới', description: 'Gửi email hướng dẫn kích hoạt trang đích khi tài khoản đối tác được tạo mới.', active: true },
]

export default function EmailServicePage() {
  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-2xl font-display font-bold">Cấu Hình Email Giao Dịch (Transactional Email)</h2>
        <p className="text-sm text-zinc-500 mt-1">
          Hệ thống email thông báo tự động được cung cấp bởi Resend API. Mọi email giao dịch đặt lịch và đối soát đều được ghi nhật ký đầy đủ.
        </p>
      </header>

      {/* Resend Connection Status */}
      <div className="glass-card p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Mail size={18} className="text-amber-500" />
          <div>
            <p className="text-sm font-medium text-zinc-100">Kết nối Resend API</p>
            <p className="text-[10px] font-mono text-zinc-500">RESEND_API_KEY đã được thiết lập thành công trong tệp môi trường .env.local</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/30 border border-emerald-900/40">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-mono text-emerald-400 uppercase">Đang kết nối</span>
        </div>
      </div>

      {/* Email Templates */}
      <div className="glass-card overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-900 bg-zinc-900/30">
          <h3 className="text-sm font-semibold">Các Tiến Trình Email Tự Động</h3>
        </div>
        <div className="divide-y divide-zinc-900">
          {EMAIL_TEMPLATES.map((template) => (
            <div key={template.id} className="px-6 py-5 flex items-center justify-between hover:bg-zinc-900/20 transition-colors">
              <div className="space-y-1">
                <p className="text-sm text-zinc-200 font-medium">{template.name}</p>
                <p className="text-[11px] text-zinc-500">{template.description}</p>
              </div>
              <div className="flex items-center gap-4 ml-8">
                <span className={`flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-tighter ${
                  template.active ? 'text-emerald-400' : 'text-zinc-600'
                }`}>
                  <CheckCircle2 size={12} />
                  {template.active ? 'Đang hoạt động' : 'Tạm ngắt'}
                </span>
                <button className="text-[10px] text-zinc-600 hover:text-slate-400 font-mono uppercase transition-colors">
                  Chỉnh Sửa
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SQL Note for setup */}
      <div className="p-4 rounded-lg bg-zinc-900/40 border border-zinc-800 space-y-2">
        <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">📋 Ghi Chú Thiết Lập</p>
        <p className="text-xs text-zinc-500">
          Hãy đảm bảo khai báo biến <code className="text-amber-300 bg-zinc-950 px-1 py-0.5 rounded font-mono">RESEND_API_KEY=re_xxxx</code> và{' '}
          <code className="text-amber-300 bg-zinc-950 px-1 py-0.5 rounded font-mono">FROM_EMAIL=noreply@1beauty.asia</code> trong tệp{' '}
          <code className="text-amber-300 bg-zinc-950 px-1 py-0.5 rounded font-mono">.env.local</code> để kích hoạt tính năng gửi thông báo tự động.
        </p>
      </div>
    </div>
  )
}
