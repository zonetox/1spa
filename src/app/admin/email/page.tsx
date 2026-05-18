import React from 'react'
import { Mail, CheckCircle2 } from 'lucide-react'

const EMAIL_TEMPLATES = [
  { id: 'booking_confirmed', name: 'Xác Nhận Đặt Lịch Hẹn', description: 'Gửi tự động cho khách hàng khi họ hoàn tất lịch hẹn tại Spa/Nha khoa.', active: true },
  { id: 'lead_notification', name: 'Thông Báo Lead Mới Cho Đối Tác', description: 'Gửi tự động cho chủ cơ sở khi có khách đặt lịch trên landing page của họ.', active: true },
  { id: 'subscription_expiry', name: 'Cảnh Báo Hết Hạn Gói Thành Viên', description: 'Gửi tự động cảnh báo gia hạn khi gói dùng thử hoặc gói dịch vụ sắp hết hạn.', active: true },
  { id: 'welcome_partner', name: 'Chào Mừng Đối Tác Mới', description: 'Gửi email hướng dẫn kích hoạt trang đích khi tài khoản đối tác được tạo mới.', active: true },
]

export default function EmailServicePage() {
  const isResendConnected = !!process.env.RESEND_API_KEY;

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-2xl font-display font-bold text-[#2F2F2F]">Cấu Hình Email Giao Dịch (Transactional Email)</h2>
        <p className="text-sm text-[#2F2F2F]/60 mt-1">
          Hệ thống email thông báo tự động được cung cấp bởi Resend API. Mọi email giao dịch đặt lịch và đối soát đều được ghi nhật ký đầy đủ.
        </p>
      </header>

      {/* Resend Connection Status */}
      <div className="glass-card p-5 flex items-center justify-between bg-white border-[#D4AF37]/10">
        <div className="flex items-center gap-3">
          <Mail size={18} className={isResendConnected ? "text-[#D4AF37]" : "text-rose-600"} />
          <div>
            <p className="text-sm font-medium text-[#2F2F2F]">Kết nối Resend API</p>
            <p className="text-[10px] font-mono text-[#2F2F2F]/60">
              {isResendConnected 
                ? 'RESEND_API_KEY đã được thiết lập thành công trong tệp môi trường .env.local'
                : 'CẢNH BÁO: Chưa thiết lập biến RESEND_API_KEY trong tệp .env.local'
              }
            </p>
          </div>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
          isResendConnected 
            ? 'bg-emerald-50 border border-emerald-200' 
            : 'bg-rose-50 border border-rose-200'
        }`}>
          <div className={`w-1.5 h-1.5 rounded-full ${
            isResendConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
          }`} />
          <span className={`text-[10px] font-mono uppercase ${
            isResendConnected ? 'text-emerald-600' : 'text-rose-600'
          }`}>
            {isResendConnected ? 'Đang hoạt động' : 'Chưa kết nối'}
          </span>
        </div>
      </div>

      {/* Email Templates */}
      <div className="glass-card overflow-hidden bg-white border-[#D4AF37]/10">
        <div className="px-6 py-4 border-b border-[#D4AF37]/10 bg-[#FDFBF7] flex justify-between items-center">
          <h3 className="text-sm font-semibold text-[#2F2F2F]">Các Tiến Trình Email Tự Động</h3>
          <span className="text-[9px] font-bold uppercase tracking-widest text-[#D4AF37] bg-[#D4AF37]/10 px-2.5 py-1 rounded-full border border-[#D4AF37]/20 animate-pulse">
            Tính Năng v5.0 (Coming Soon)
          </span>
        </div>
        <div className="divide-y divide-[#D4AF37]/10">
          {EMAIL_TEMPLATES.map((template) => (
            <div key={template.id} className="px-6 py-5 flex items-center justify-between hover:bg-[#FDFBF7] transition-colors">
              <div className="space-y-1">
                <p className="text-sm text-[#2F2F2F] font-medium">{template.name}</p>
                <p className="text-[11px] text-[#2F2F2F]/60">{template.description}</p>
              </div>
              <div className="flex items-center gap-4 ml-8">
                <span className={`flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-tighter ${
                  template.active ? 'text-emerald-600' : 'text-[#2F2F2F]/40'
                }`}>
                  <CheckCircle2 size={12} />
                  {template.active ? 'Đang hoạt động' : 'Tạm ngắt'}
                </span>
                <span className="text-[10px] text-[#2F2F2F]/40 font-mono uppercase tracking-widest">
                  v5.0 (Sắp có)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SQL Note for setup */}
      <div className="p-4 rounded-lg bg-white border border-[#D4AF37]/10 space-y-2">
        <p className="text-[10px] font-mono text-[#2F2F2F]/80 uppercase tracking-widest">📋 Ghi Chú Thiết Lập</p>
        <p className="text-xs text-[#2F2F2F]/60">
          Hãy đảm bảo khai báo biến <code className="text-[#D4AF37] bg-[#FDFBF7] px-1 py-0.5 rounded font-mono">RESEND_API_KEY=re_xxxx</code> và{' '}
          <code className="text-[#D4AF37] bg-[#FDFBF7] px-1 py-0.5 rounded font-mono">FROM_EMAIL=noreply@1beauty.asia</code> trong tệp{' '}
          <code className="text-[#D4AF37] bg-[#FDFBF7] px-1 py-0.5 rounded font-mono">.env.local</code> để kích hoạt tính năng gửi thông báo tự động.
        </p>
      </div>
    </div>
  )
}
