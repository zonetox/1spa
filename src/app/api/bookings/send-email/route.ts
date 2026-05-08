import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const { 
      customer_name, 
      customer_phone, 
      service_requested, 
      business_name, 
      business_email, 
      admin_email 
    } = await req.json()

    // 1. Gửi Email cho Doanh nghiệp
    await resend.emails.send({
      from: 'Beauty Hub <notifications@beautyhub.vn>',
      to: business_email,
      subject: `[Booking Mới] - ${customer_name} vừa đặt lịch hẹn`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #D4AF37;">Bạn có một lượt đặt lịch mới!</h2>
          <p>Chào <b>${business_name}</b>,</p>
          <p>Dưới đây là thông tin chi tiết từ khách hàng:</p>
          <ul style="list-style: none; padding: 0;">
            <li><b>Khách hàng:</b> ${customer_name}</li>
            <li><b>Số điện thoại:</b> ${customer_phone}</li>
            <li><b>Dịch vụ:</b> ${service_requested}</li>
            <li><b>Thời gian gửi:</b> ${new Date().toLocaleString('vi-VN')}</li>
          </ul>
          <p>Vui lòng liên hệ với khách hàng sớm nhất có thể.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;"/>
          <p style="font-size: 12px; color: #999;">Đây là email tự động từ hệ thống Beauty Hub.</p>
        </div>
      `
    })

    // 2. Gửi Email cho Admin (Nếu có cấu hình)
    if (admin_email) {
      await resend.emails.send({
        from: 'Beauty Hub System <system@beautyhub.vn>',
        to: admin_email,
        subject: `[ADMIN-MONITOR] Booking mới tại ${business_name}`,
        html: `<p>Hệ thống ghi nhận lượt đặt lịch mới tại <b>${business_name}</b>.</p><p>Khách hàng: ${customer_name} (${customer_phone})</p>`
      })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
