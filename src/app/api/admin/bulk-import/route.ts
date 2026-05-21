import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { slugify } from '@/lib/utils'
import { CANONICAL_TEMPLATES, CATEGORY_COLORS } from '@/lib/constants'
import crypto from 'crypto'

// Khởi tạo Supabase Admin Client với Service Role Key để bỏ qua các ràng buộc bảo mật khi Import
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// ─── POST Handler ───

export async function POST(req: Request) {
  try {
    // 0. Security Check: Validate Secret Key
    const apiKey = req.headers.get('x-api-key')
    const secretKey = process.env.INGEST_SECRET_KEY

    if (!apiKey || apiKey !== secretKey) {
      console.error('Unauthorized Ingest Attempt: Invalid or missing API Key')
      return NextResponse.json({ error: 'Unauthorized: Missing or invalid x-api-key' }, { status: 401 })
    }

    const data = await req.json()
    if (!Array.isArray(data)) {
      return NextResponse.json({ error: 'Dữ liệu phải là một mảng JSON' }, { status: 400 })
    }

    const results = []
    const maxAIEnrich = parseInt(process.env.AI_ENRICH_MAX_PER_BATCH || '10', 10)
    let aiEnrichCount = 0

    for (const item of data) {
      // 1. Khai thác dữ liệu theo SCHEMA V6.0 (Đồng bộ 100%)
      const business_name = item.business_name || 'Không tên'
      const category = item.category || 'Spa'
      const email_owner = item.email_owner
      const zalo = item.zalo_phone || item.zalo || ''
      const hotline = item.hotline || zalo || ''
      const location_city = item.location_city || item.city || 'TP. Hồ Chí Minh'
      const location_district = item.location_district || item.district || ''
      const address = item.address_full || item.address || ''
      const lat = parseFloat(item.latitude || item.lat) || null
      const lng = parseFloat(item.longitude || item.lng) || null
      const logo_url = item.logo_url || ''

      if (!email_owner) {
        results.push({
          business_name,
          status: 'error',
          message: 'Thiếu email chủ sở hữu (email_owner)'
        })
        continue
      }

      // 2. Chuẩn hóa Phân loại & Template theo Mapping Rules tập trung (Strict V7)
      const inputCategoryRaw = (item.category || 'Spa')
      let categoryClean: 'Spa' | 'Beauty' | 'Dental' = 'Spa'
      
      if (['Beauty', 'Spa', 'Dental'].includes(inputCategoryRaw)) {
        categoryClean = inputCategoryRaw as 'Spa' | 'Beauty' | 'Dental'
      } else if (inputCategoryRaw === 'Medical' || inputCategoryRaw === 'Clinic' || inputCategoryRaw.includes('Nha Khoa')) {
        categoryClean = 'Dental' // Fallback strictly to Dental
      } else if (inputCategoryRaw.includes('Làm đẹp') || inputCategoryRaw.includes('Thẩm mỹ')) {
        categoryClean = 'Beauty'
      }

      const template_id = item.template_id || CANONICAL_TEMPLATES[categoryClean] || 'UniversalTemplate'
      const theme_color = item.theme_color || CATEGORY_COLORS[categoryClean] || '#E5D5C0'



      // 3. Tạo Slug
      let slug = item.slug || slugify(business_name)
      if (location_district && !slug.includes(slugify(location_district))) {
         slug = `${slug}-${slugify(location_district)}`
      }

      // 4. Kiểm tra content_json (Bắt buộc phải có từ Ingest)
      let content_json = item.content_json
      if (!content_json) {
        results.push({ business_name, status: 'error', message: 'Missing content_json' })
        continue
      }

      // 5. Upsert vào Database
      const { data: existingProfile } = await supabaseAdmin
        .from('business_profiles')
        .select('id')
        .eq('slug', slug)
        .maybeSingle()

      const social_links = {
        facebook: item.fb_link || '',
        tiktok: item.tiktok_link || '',
        zalo: zalo
      }

      let businessId: string

      if (existingProfile) {
        businessId = existingProfile.id
        await supabaseAdmin
          .from('business_profiles')
          .update({
            business_name,
            category: categoryClean,
            zalo_phone: zalo,
            hotline: hotline,
            location_city,
            location_district,
            logo_url,
            social_links
          })
          .eq('id', businessId)
      } else {
        // Tạo User Auth nếu cần
        const { data: existingUser } = await supabaseAdmin
          .from('profiles')
          .select('id')
          .eq('email', email_owner)
          .maybeSingle()

        let userId = existingUser?.id

        if (!userId) {
          const securePassword = crypto.randomBytes(16).toString('hex') + '!'
          const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email: email_owner,
            password: securePassword,
            email_confirm: true
          })
          if (authError) {
             results.push({ business_name, status: 'error', message: `Auth: ${authError.message}` })
             continue
          }
          userId = authUser.user.id

          // Explicitly set role to 'business' (lowercase) to match Supabase CHECK constraint
          await supabaseAdmin
            .from('profiles')
            .update({ role: 'business' })
            .eq('id', userId)
        }

        const { data: newProfile, error: insProfErr } = await supabaseAdmin
          .from('business_profiles')
          .insert({
            account_id: userId,
            business_name,
            slug,
            category: categoryClean,
            zalo_phone: zalo,
            hotline: hotline,
            location_city,
            location_district,
            logo_url,
            social_links
          })
          .select()
          .single()

        if (insProfErr) {
          results.push({ business_name, status: 'error', message: `Insert Profile: ${insProfErr.message}` })
          continue
        }
        businessId = newProfile.id
      }

      // Upsert into business_locations
      const { data: existingLoc } = await supabaseAdmin
        .from('business_locations')
        .select('id')
        .eq('business_id', businessId)
        .maybeSingle()

      if (existingLoc) {
        await supabaseAdmin.from('business_locations').update({
          city: location_city,
          district: location_district,
          address_full: address,
          lat: lat,
          lng: lng
        }).eq('id', existingLoc.id)
      } else {
        await supabaseAdmin.from('business_locations').insert({
          business_id: businessId,
          city: location_city,
          district: location_district,
          address_full: address,
          lat: lat,
          lng: lng
        })
      }

      // Upsert Landing Page
      const { data: lp } = await supabaseAdmin
        .from('landing_pages')
        .select('id')
        .eq('business_id', businessId)
        .maybeSingle()

      if (lp) {
        await supabaseAdmin
          .from('landing_pages')
          .update({
            content_json,
            template_id,
            status: 'Published',
            is_published: true,
            updated_at: new Date().toISOString()
          })
          .eq('id', lp.id)
      } else {
        await supabaseAdmin
          .from('landing_pages')
          .insert({
            business_id: businessId,
            content_json,
            template_id,
            status: 'Published',
            is_published: true
          })
      }

      results.push({ business_name, status: existingProfile ? 'updated' : 'created', slug })
    }

    return NextResponse.json({ success: true, results })
  } catch (err: any) {
    console.error('Bulk import error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
