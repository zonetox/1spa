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

const PLACEHOLDER_IMAGES = [
  'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1519415510236-8559b1956a20?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600334129128-685c5582fd35?q=80&w=1200&auto=format&fit=crop'
]

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

      // 4. Xử lý content_json (Ưu tiên cấu trúc chuẩn từ harvester)
      let content_json = item.content_json
      
      // Nếu không có content_json wrapper, map từ cấu trúc phẳng của harvester V7
      if (!content_json) {
        // Harvester V7 lưu services_menu trực tiếp tại item.services_menu
        const services_menu: any[] = []
        if (Array.isArray(item.services_menu)) {
          item.services_menu.forEach((s: any) => {
            services_menu.push({
              name: s.name || 'Dịch vụ',
              desc: s.desc || s.description || '',
              price: s.price || 'Liên hệ',
              img: s.img || s.image_url || PLACEHOLDER_IMAGES[0],
              tagline: s.tagline || '',
              duration: s.duration || '60 Phút'
            })
          })
        }
        
        // Harvester V7 lưu expert_team tại item.expert_team
        const expert_team: any[] = []
        if (Array.isArray(item.expert_team)) {
          item.expert_team.forEach((ex: any) => {
            expert_team.push({
              name: ex.name,
              role: ex.role || 'Chuyên gia',
              img: ex.img || ex.image_url || PLACEHOLDER_IMAGES[1],
              desc: ex.desc || ex.description || '',
              origin: ex.origin || ''
            })
          })
        }

        // Gallery tại item.gallery
        const gallery: any[] = Array.isArray(item.gallery) ? item.gallery : []

        // Testimonials tại item.social_trust.testimonials
        const testimonials: any[] = Array.isArray(item.social_trust?.testimonials)
          ? item.social_trust.testimonials
          : []

        // Social links tại item.contact_info.social_links
        const social_links_from_harvester = Array.isArray(item.contact_info?.social_links)
          ? item.contact_info.social_links
          : []

        content_json = {
          hero_section: item.hero_section || {
            hero_title: `Chào mừng tới ${business_name}`,
            hero_subtitle: 'Trải nghiệm dịch vụ đẳng cấp',
            hero_slides: PLACEHOLDER_IMAGES
          },
          about_us: item.about_us || {
            section_title: 'Về Chúng Tôi',
            intro_text: `Chào mừng bạn đến với ${business_name}.`,
            experience_years: '5+',
            about_image_1: PLACEHOLDER_IMAGES[0],
            about_image_2: PLACEHOLDER_IMAGES[1]
          },
          services_menu,
          expert_team,
          gallery,
          social_trust: {
            rating_count: item.rating_count || 50,
            testimonials
          },
          reservation_section: item.reservation_section || {
            title: `Đặt lịch tại ${business_name}`,
            subtitle: 'Liên hệ với chúng tôi để được tư vấn',
            badge: 'Tư vấn miễn phí'
          },
          contact_info: {
            zalo_link: `https://zalo.me/${zalo}`,
            hotline: hotline,
            email: email_owner,
            address_full: address,
            map_embed_url: item.map_embed_url || item.contact_info?.map_embed_url || '',
            operating_hours: item.contact_info?.operating_hours || '09:00 - 21:00',
            social_links: social_links_from_harvester.length > 0
              ? social_links_from_harvester
              : [
                  { platform: 'Facebook', url: item.fb_link || '#' },
                  { platform: 'Zalo', url: `https://zalo.me/${zalo}` }
                ]
          },
          theme_color: item.theme_color || (categoryClean === 'Dental' ? '#0D9488' : categoryClean === 'Beauty' ? '#D4AF37' : '#C9A050')
        }
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
            social_links,
            updated_at: new Date().toISOString()
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
