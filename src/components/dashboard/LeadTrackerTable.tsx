import React from 'react';
import { format } from 'date-fns'; 

interface Lead {
  id: string;
  customer_name: string;
  customer_phone: string;
  service_requested: string;
  booking_time: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  created_at: string;
}

const LeadTrackerTable = ({ leads }: { leads: Lead[] }) => {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Confirmed': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-[#FFFFFF] rounded-[2rem] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-[#D4AF37]/20 overflow-hidden">
      <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-[#F9F6F0]">
        <h3 className="font-display text-2xl text-[#2F2F2F]">Theo dõi khách đặt lịch (Leads)</h3>
        <span className="flex items-center gap-2 text-[10px] font-bold text-[#D4AF37] tracking-widest uppercase">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          Cập nhật thời gian thực
        </span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50/50 text-[10px] uppercase tracking-widest text-zinc-500 font-mono">
              <th className="px-6 py-4 font-semibold">Khách hàng</th>
              <th className="px-6 py-4 font-semibold">Dịch vụ quan tâm</th>
              <th className="px-6 py-4 font-semibold">Thời gian hẹn</th>
              <th className="px-6 py-4 font-semibold text-center">Trạng thái</th>
              <th className="px-6 py-4 font-semibold text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 text-sm">
            {leads.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-zinc-400 font-mono text-xs uppercase tracking-widest">
                  Chưa có lịch hẹn nào
                </td>
              </tr>
            ) : leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-[#F9F6F0]/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="font-medium text-[#2F2F2F]">{lead.customer_name}</div>
                  <div className="text-[10px] text-zinc-400 font-mono mt-1">{lead.customer_phone}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-zinc-600 italic font-serif">"{lead.service_requested}"</span>
                </td>
                <td className="px-6 py-4 text-zinc-500 text-xs">
                  {format(new Date(lead.booking_time), 'HH:mm - dd/MM/yyyy')}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-widest ${getStatusStyle(lead.status)}`}>
                    {lead.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-[#D4AF37] hover:text-[#B8860B] text-[10px] font-bold uppercase tracking-widest transition-all group-hover:scale-105">
                    Xử lý ngay →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadTrackerTable;
