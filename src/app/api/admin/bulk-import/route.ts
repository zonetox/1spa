import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { slugify } from '@/lib/utils'

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
    const data = await req.json()
    if (!Array.isArray(data)) {
      return NextResponse.json({ error: 'Dữ liệu phải là một mảng JSON' }, { status: 400 })
    }

    const results = []

    for (const item of data) {
      // 1. Khai thác dữ liệu linh hoạt (Hỗ trợ cả khóa dán phẳng lẫn lồng)
      const business_name = item.business_name || 'Không tên'
      const category = item.category || 'Spa'
      const email_owner = item.email_owner
      const zalo = item.zalo_phone || item.zalo || ''
      const hotline = item.hotline || zalo || ''
      const location_city = item.city || item.location_city || 'TP. Hồ Chí Minh'
      const location_district = item.district || item.location_district || ''
      const address = item.address_full || item.address || ''
      const lat = parseFloat(item.latitude || item.lat) || null
      const lng = parseFloat(item.longitude || item.lng) || null

      if (!email_owner) {
        results.push({
          business_name,
          status: 'error',
          message: 'Thiếu email chủ sở hữu (email_owner)'
        })
        continue
      }

      // 2. Chuẩn hóa Phân loại (Category Check Constraint Compliance)
      let categoryClean: 'Spa' | 'Dental' | 'Clinic' | 'Beauty' = 'Spa'
      const catLower = category.toLowerCase()
      if (catLower.includes('dental') || catLower.includes('nha khoa') || catLower.includes('răng')) {
        categoryClean = 'Dental'
      } else if (catLower.includes('beauty') || catLower.includes('thẩm mỹ') || catLower.includes('làm đẹp')) {
        categoryClean = 'Beauty'
      } else if (catLower.includes('clinic') || catLower.includes('phòng khám') || catLower.includes('y tế')) {
        categoryClean = 'Clinic'
      } else {
        categoryClean = 'Spa'
      }

      // Chuẩn hóa Template ID tương ứng (Ưu tiên từ JSON, nếu không có thì gán mặc định theo Category)
      let template_id = item.template_id || ''
      if (!template_id) {
        if (categoryClean === 'Dental') template_id = 'DentalCare'
        else if (categoryClean === 'Clinic') template_id = 'ModernMedical'
        else if (categoryClean === 'Beauty') template_id = 'HauteCoutureBeauty'
        else template_id = 'LuxurySpaZen'
      }

      // 3. Tạo Slug chuyên nghiệp & bảo mật độc nhất
      let slug = item.slug || slugify(business_name)
      if (location_district) {
        const distSlug = slugify(location_district)
        if (!slug.includes(distSlug)) {
          slug = `${slug}-${distSlug}`
        }
      } else if (zalo) {
        const lastThreeDigits = zalo.slice(-3)
        if (!slug.includes(lastThreeDigits)) {
          slug = `${slug}-${lastThreeDigits}`
        }
      }

      // 4. Khởi tạo cấu trúc Content JSON lồng nhau siêu chuẩn cho Landing Page
      const services_menu = []
      for (let i = 1; i <= 6; i++) {
        const sName = item[`sv_${i}_name`]
        if (sName) {
          services_menu.push({
            service_name: sName,
            price: item[`sv_${i}_price`] || 'Liên hệ',
            description: item[`sv_${i}_desc`] || '',
            image_url: item[`sv_${i}_img`] || PLACEHOLDER_IMAGES[i % 3]
          })
        }
      }

      // Nếu không có dịch vụ nào, thử lấy từ services menu có sẵn hoặc đặt mặc định
      if (services_menu.length === 0 && Array.isArray(item.services)) {
        item.services.forEach((s: any, idx: number) => {
          services_menu.push({
            service_name: s.name || s.service_name,
            price: s.price || 'Liên hệ',
            description: s.desc || s.description || '',
            image_url: s.image || s.image_url || PLACEHOLDER_IMAGES[idx % 3]
          })
        })
      }

      const expert_team = []
      if (item.expert_1_name) {
        expert_team.push({
          name: item.expert_1_name,
          role: item.expert_1_role || 'Chuyên gia',
          img: item.expert_1_img || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400',
          origin: item.expert_1_origin || 'Vietnam',
          desc: item.expert_1_desc || ''
        })
      }

      const hero_slides = [
        item.hero_slide_1,
        item.hero_slide_2,
        item.hero_slide_3
      ].filter(Boolean)

      if (hero_slides.length === 0 && Array.isArray(item.images)) {
        hero_slides.push(...item.images)
      }
      if (hero_slides.length === 0) {
        hero_slides.push(...PLACEHOLDER_IMAGES)
      }

      const content_json = item.content_json || {
        hero_section: {
          hero_title: item.hero_title || `Chào mừng tới ${business_name}`,
          hero_subtitle: item.hero_subtitle || 'Trải nghiệm dịch vụ làm đẹp đẳng cấp 5 sao',
          hero_video_url: item.hero_video_url || '',
          hero_slides: hero_slides
        },
        about_us: {
          section_title: item.about_title || 'Nơi Tâm Hồn Đồng điệu cùng Thể xác',
          intro_text: item.about_intro || `Chúng tôi là đơn vị hàng đầu trong lĩnh vực ${categoryClean} tại ${location_district || 'TP.HCM'}.`,
          experience_years: item.experience_years || '5+',
          video_intro_url: item.about_video_url || ''
        },
        services_menu: services_menu,
        expert_team: expert_team,
        theme_color: item.theme_color || (categoryClean === 'Dental' ? '#0F4C81' : '#C9A050'),
        contact_info: {
          zalo_link: `https://zalo.me/${zalo}`,
          hotline: hotline,
          email: email_owner,
          address_full: address,
          google_map_embed_code: item.map_embed_url || ''
        },
        operating_hours: {
          weekdays: item.time_mon || '08:00 - 20:00',
          weekends: item.time_sat || '08:00 - 22:00'
        },
        social_trust: {
          rating_count: Math.floor(Math.random() * 50) + 10,
          social_links: {
            facebook: item.fb_link || '',
            tiktok: item.tiktok_link || ''
          }
        }
      }

      // Kiểm tra xem business profile đã tồn tại theo slug chưa
      const { data: existingProfile, error: checkError } = await supabaseAdmin
        .from('business_profiles')
        .select('id, account_id')
        .eq('slug', slug)
        .maybeSingle()

      if (checkError) {
        results.push({ business_name, status: 'error', message: `Kiểm tra slug: ${checkError.message}` })
        continue
      }

      if (existingProfile) {
        // ==========================================
        // TRƯỜNG HỢP UPSERT: Cập nhật thông tin cũ
        // ==========================================
        const businessId = existingProfile.id

        // 1. Cập nhật Business Profile
        const { error: updateProfErr } = await supabaseAdmin
          .from('business_profiles')
          .update({
            business_name,
            category: categoryClean,
            zalo_phone: zalo,
            hotline: hotline
          })
          .eq('id', businessId)

        if (updateProfErr) {
          results.push({ business_name, status: 'error', message: `Update Profile: ${updateProfErr.message}` })
          continue
        }

        // 2. Cập nhật Business Location (Bao gồm lat/lng cực kỳ chính xác)
        const { data: locData } = await supabaseAdmin
          .from('business_locations')
          .select('id')
          .eq('business_id', businessId)
          .maybeSingle()

        if (locData) {
          await supabaseAdmin
            .from('business_locations')
            .update({
              city: location_city,
              district: location_district,
              address_full: address,
              lat: lat,
              lng: lng
            })
            .eq('id', locData.id)
        } else {
          await supabaseAdmin
            .from('business_locations')
            .insert({
              business_id: businessId,
              city: location_city,
              district: location_district,
              address_full: address,
              lat: lat,
              lng: lng
            })
        }

        // 3. Cập nhật Landing Page (Đồng bộ kép cả status và is_published)
        const { data: lpData } = await supabaseAdmin
          .from('landing_pages')
          .select('id')
          .eq('business_id', businessId)
          .maybeSingle()

        if (lpData) {
          await supabaseAdmin
            .from('landing_pages')
            .update({
              content_json,
              template_id,
              status: 'Published',
              is_published: true,
              updated_at: new Date().toISOString()
            })
            .eq('id', lpData.id)
        } else {
          await supabaseAdmin
            .from('landing_pages')
            .insert({
              business_id: businessId,
              template_id,
              content_json,
              status: 'Published',
              is_published: true
            })
        }

        results.push({ business_name, status: 'updated', slug })

      } else {
        // ==========================================
        // TRƯỜNG HỢP INSERT: Tạo mới hoàn toàn
        // ==========================================
        let userId: string

        // Kiểm tra xem User đã tồn tại trong public.profiles chưa
        const { data: existingUserProfile } = await supabaseAdmin
          .from('profiles')
          .select('id')
          .eq('email', email_owner)
          .maybeSingle()

        if (existingUserProfile) {
          userId = existingUserProfile.id
        } else {
          // Tạo Account trong Supabase Auth (Mật khẩu mặc định: Beauty123!)
          const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email: email_owner,
            password: 'Beauty123!',
            email_confirm: true
          })

          if (authError) {
            results.push({ business_name, status: 'error', message: `Tạo Auth: ${authError.message}` })
            continue
          }

          userId = authUser.user.id

          // Tạo record trong public.profiles
          const { error: accError } = await supabaseAdmin
            .from('profiles')
            .upsert({
              id: userId,
              email: email_owner,
              role: 'business',
              subscription_status: 'trial',
              expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            })

          if (accError) {
            results.push({ business_name, status: 'error', message: `Tạo Profile: ${accError.message}` })
            continue
          }
        }

        // Tạo Business Profile mới
        const { data: newProfile, error: profError } = await supabaseAdmin
          .from('business_profiles')
          .insert({
            account_id: userId,
            business_name,
            slug,
            category: categoryClean,
            zalo_phone: zalo,
            hotline: hotline,
            is_verified: true
          })
          .select('id')
          .single()

        if (profError) {
          results.push({ business_name, status: 'error', message: `Thêm Profile: ${profError.message}` })
          continue
        }

        const businessId = newProfile.id

        // Thêm Business Location mới (Kèm lat/lng chính xác)
        await supabaseAdmin
          .from('business_locations')
          .insert({
            business_id: businessId,
            city: location_city,
            district: location_district,
            address_full: address,
            lat: lat,
            lng: lng
          })

        // Thêm Landing Page mới (Mặc định xuất bản khi Import thành công)
        const { error: lpError } = await supabaseAdmin
          .from('landing_pages')
          .insert({
            business_id: businessId,
            template_id,
            content_json,
            status: 'Published',
            is_published: true
          })

        if (lpError) {
          results.push({ business_name, status: 'error', message: `Thêm LandingPage: ${lpError.message}` })
        } else {
          results.push({ business_name, status: 'created', slug })
        }
      }
    }

    return NextResponse.json({ results })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
