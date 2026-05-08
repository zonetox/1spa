import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder_key')

export async function POST(req: Request) {
  try {
    const { 
        business_id, 
        business_name, 
        business_email, 
        customer_name, 
        customer_phone, 
        service_requested,
        source_url
    } = await req.json()

    if (!business_id || !customer_name || !customer_phone) {
      return NextResponse.json({ error: 'Missing required booking fields.' }, { status: 400 })
    }

    // 1. Insert into public.bookings Table for Live Admin Tracking
    const { data: booking, error: dbError } = await supabaseAdmin
      .from('bookings')
      .insert({
        business_id,
        customer_info: {
          name: customer_name,
          phone: customer_phone,
          service: service_requested || 'General Consultation'
        },
        status: 'new',
        source_url: source_url || ''
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database booking insertion error:', dbError)
    }

    // 2. Trigger Emails via Resend (Wrapped in try/catch to avoid blocking DB flow if Resend Key is invalid)
    if (process.env.RESEND_API_KEY) {
      try {
        if (business_email) {
          await resend.emails.send({
            from: 'Beauty Directory <notifications@beauty.com>',
            to: business_email,
            subject: `[Lịch hẹn mới] - Khách hàng ${customer_name}`,
            html: `
              <div style="font-family: sans-serif; padding: 20px; border: 1px solid #D4AF37; border-radius: 10px;">
                <h2 style="color: #D4AF37;">Bạn có lịch hẹn mới từ hệ thống!</h2>
                <p><strong>Khách hàng:</strong> ${customer_name}</p>
                <p><strong>Số điện thoại:</strong> ${customer_phone}</p>
                <p><strong>Dịch vụ quan tâm:</strong> ${service_requested}</p>
                <hr />
                <p style="font-size: 12px; color: #666;">Vui lòng liên hệ khách hàng sớm nhất có thể.</p>
              </div>
            `
          })
        }

        const adminEmail = process.env.ADMIN_EMAIL || 'admin@beautyhub.pro'
        await resend.emails.send({
          from: 'Beauty Directory <admin@beauty.com>',
          to: adminEmail,
          subject: `[Admin Log] Booking mới tại ${business_name || 'Business'}`,
          html: `
            <p>Có một lượt booking mới tại doanh nghiệp: <strong>${business_name || 'Business'}</strong> (ID: ${business_id})</p>
            <p>Chi tiết khách hàng: ${customer_name} - ${customer_phone}</p>
          `
        })
      } catch (emailErr) {
        console.error('Email notification trigger warning:', emailErr)
      }
    }

    return NextResponse.json({ success: true, booking })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
