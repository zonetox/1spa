import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder_key')

// Basic in-memory rate limiter
const rateLimitMap = new Map<string, number>()

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'unknown-ip'
    const now = Date.now()
    const lastRequestTime = rateLimitMap.get(ip)

    if (lastRequestTime && now - lastRequestTime < 60000) {
      return NextResponse.json({ error: 'Bạn thao tác quá nhanh. Vui lòng đợi 1 phút rồi thử lại.' }, { status: 429 })
    }
    rateLimitMap.set(ip, now)

    const { 
        business_id, 
        business_name, 
        business_email, 
        customer_name, 
        customer_phone, 
        service_requested,
        source_url
    } = await req.json()

    // 0. Defensive Check: Basic Rate Limiting (Prevent immediate double submissions)
    // In production, use Upstash or Redis. Here we do a basic required field & validation check.
    if (!business_id || !customer_name || !customer_phone) {
      return NextResponse.json({ error: 'Missing required booking fields.' }, { status: 400 })
    }

    // Sanitize source_url for analytics
    const cleanUrl = (source_url || '').replace(/\/$/, '')
    const pageSlug = cleanUrl.split('/').pop() || 'unknown'

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
        status: 'Pending',
        source_url: source_url || ''
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database booking insertion error:', dbError)
      return NextResponse.json({ error: 'Không thể lưu booking. Vui lòng thử lại.' }, { status: 500 })
    }

    // 1.5 Track Conversion Analytics
    await supabaseAdmin.from('analytics_events').insert({
      business_id,
      event_type: 'conversion',
      page_slug: pageSlug
    })



    // 2. Trigger Emails via Resend
    if (process.env.RESEND_API_KEY) {
      try {
        const fromDomain = process.env.RESEND_FROM_DOMAIN || 'notifications@1beauty.asia'
        const adminFromDomain = process.env.RESEND_ADMIN_FROM || 'admin@1beauty.asia'

        if (business_email) {
          await resend.emails.send({
            from: `Beauty Directory <${fromDomain}>`,
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
          from: `Beauty Directory <${adminFromDomain}>`,
          to: adminEmail,
          subject: `[Admin Log] Booking mới tại ${business_name || 'business'}`,
          html: `
            <p>Có một lượt booking mới tại doanh nghiệp: <strong>${business_name || 'business'}</strong> (ID: ${business_id})</p>
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
