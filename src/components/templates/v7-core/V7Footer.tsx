'use client';

import React from 'react';

interface V7FooterProps {
  businessName: string;
  themeColor?: string;
}

export const V7Footer: React.FC<V7FooterProps> = ({ 
  businessName, 
  themeColor = '#D4AF37' 
}) => {
  return (
    <footer className="relative bg-white pt-24 pb-12 border-t border-gray-100">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-gray-100">
          
          {/* Brand Vision Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.4em]" style={{ color: themeColor }}>Trải nghiệm đẳng cấp</span>
              <h2 className="text-3xl font-sans font-bold tracking-tight text-[#1A1A1A]">{businessName}</h2>
            </div>
            <p className="text-gray-500 font-light text-sm leading-relaxed max-w-sm">
              Kiến tạo chuẩn mực mới cho vẻ đẹp đích thực. Mỗi không gian của chúng tôi là một ốc đảo chữa lành, nơi từng chi tiết nhỏ nhất đều được chăm chút với sự tôn trọng tuyệt đối dành cho bạn.
            </p>
            
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="relative overflow-hidden px-8 py-3 rounded-full text-white font-bold uppercase tracking-[0.2em] text-[10px] shadow-lg transition-all hover:scale-105 mt-4"
              style={{ background: themeColor }}
            >
              Về đầu trang
            </button>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8 lg:pl-12">
            <div className="space-y-4">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#1A1A1A] border-b pb-3" style={{ borderBottomColor: `${themeColor}20` }}>Khám Phá</h4>
              <ul className="space-y-3">
                {['Về chúng tôi', 'Dịch vụ', 'Liệu trình', 'Cơ sở vật chất'].map(i => (
                  <li key={i}><a href="#" className="text-xs text-gray-500 hover:translate-x-1 transition-all inline-block font-light group"><span className="group-hover:text-[#1A1A1A] transition-colors" style={{ transition: 'color' }}>{i}</span></a></li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#1A1A1A] border-b pb-3" style={{ borderBottomColor: `${themeColor}20` }}>Kết Nối</h4>
              <ul className="space-y-3">
                {['Đội ngũ chuyên gia', 'Tin tức', 'Ưu đãi tháng', 'Liên hệ'].map(i => (
                  <li key={i}><a href="#" className="text-xs text-gray-500 hover:translate-x-1 transition-all inline-block font-light group"><span>{i}</span></a></li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#1A1A1A] border-b pb-3" style={{ borderBottomColor: `${themeColor}20` }}>Chính Sách</h4>
              <ul className="space-y-3">
                {['Điều khoản dịch vụ', 'Bảo mật dữ liệu', 'Quy trình đặt lịch', 'Câu hỏi thường gặp'].map(i => (
                  <li key={i}><a href="#" className="text-xs text-gray-500 hover:translate-x-1 transition-all inline-block font-light group"><span>{i}</span></a></li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Massive Glass Copyright Bar (Mockup Style) */}
        <div className="mt-12 p-6 md:p-8 rounded-[2rem] shadow-xl flex flex-col md:flex-row items-center justify-between gap-6"
             style={{ 
               background: 'rgba(255,255,255,0.6)', 
               backdropFilter: 'blur(16px)', 
               border: '1px solid rgba(255,255,255,0.8)' 
             }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-black italic">1S</div>
            <p className="text-[10px] font-bold text-gray-400 tracking-[0.3em] uppercase">
              POWERED BY <span className="text-[#1A1A1A] tracking-normal font-serif italic">1Beauty.Asia Platform</span>
            </p>
          </div>
          
          <p className="text-[10px] text-gray-400 font-mono uppercase tracking-widest text-center md:text-right">
            © {new Date().getFullYear()} {businessName}. TẤT CẢ BẢN QUYỀN ĐƯỢC BẢO LƯU.
          </p>
        </div>
      </div>
    </footer>
  );
};
