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

// ─── Fallback khi chưa có Unsplash API key ───
const PLACEHOLDER_IMAGES: Record<string, string[]> = {
  Spa: [
    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1519415510236-8559b1956a20?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600334129128-685c5582fd35?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1544161515-4af6b1d46af0?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=1200&auto=format&fit=crop'
  ],
  Beauty: [
    'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?q=80&w=1200&auto=format&fit=crop'
  ],
  Dental: [
    'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1571772996211-2f02c9727629?q=80&w=1200&auto=format&fit=crop'
  ]
}

// ─── Từ khóa tìm ảnh Unsplash theo ngành ───
const IMAGE_KEYWORDS: Record<string, string[]> = {
  Spa:    ['spa treatment', 'massage therapy', 'wellness zen', 'aromatherapy relaxation'],
  Beauty: ['beauty salon professional', 'skincare aesthetic', 'makeup artist studio', 'cosmetic clinic'],
  Dental: ['dental clinic modern', 'dentist professional', 'smile teeth white', 'orthodontics']
}

// ─── Fetch ảnh từ Unsplash API (6 ảnh theo ngành) ───
async function fetchUnsplashImages(category: string): Promise<string[]> {
  const key = process.env.UNSPLASH_ACCESS_KEY
  if (!key) return PLACEHOLDER_IMAGES[category] || PLACEHOLDER_IMAGES.Spa

  try {
    const keywords = IMAGE_KEYWORDS[category] || IMAGE_KEYWORDS.Spa
    const query = keywords[Math.floor(Math.random() * keywords.length)]

    const res = await fetch(
      `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&count=6&orientation=landscape`,
      { headers: { Authorization: `Client-ID ${key}` }, next: { revalidate: 0 } }
    )

    if (!res.ok) return PLACEHOLDER_IMAGES[category] || PLACEHOLDER_IMAGES.Spa

    const photos = await res.json()
    if (!Array.isArray(photos) || photos.length === 0) {
      return PLACEHOLDER_IMAGES[category] || PLACEHOLDER_IMAGES.Spa
    }

    return photos.map((p: any) => `${p.urls.regular}&w=1200&q=80`)
  } catch {
    return PLACEHOLDER_IMAGES[category] || PLACEHOLDER_IMAGES.Spa
  }
}

// ─── Tone prompt theo từng lĩnh vực ───
const TONE_PROMPT: Record<string, string> = {
  Spa: `TONE: Thư giãn, thơ mộng, chữa lành. Ưu tiên từ ngữ: "tĩnh lặng", "tái tạo", "liệu trình", "trải nghiệm", "cân bằng". CTA: "Đặt lịch thư giãn". Chuyên gia gọi là "Chuyên viên trị liệu".`,
  Beauty: `TONE: Năng động, thời thượng, tự tin. Ưu tiên từ ngữ: "công nghệ", "đột phá", "kết quả rõ rệt", "biến đổi", "xu hướng". CTA: "Đăng ký tư vấn miễn phí". Chuyên gia gọi là "Chuyên gia thẩm mỹ".`,
  Dental: `TONE: Chuyên nghiệp, tin cậy, khoa học. Ưu tiên từ ngữ: "tiêu chuẩn quốc tế", "vô trùng", "bác sĩ", "kết quả lâu dài", "an toàn". CTA: "Đặt khám ngay". Chuyên gia gọi là "Bác sĩ" kèm bằng cấp.`
}

// ─── AI Content Enrichment via DeepSeek API ───
async function enrichWithAI(
  business_name: string,
  category: 'Spa' | 'Beauty' | 'Dental',
  rawData: any
): Promise<Record<string, any>> {
  const apiKey = process.env.DEEPSEEK_API_KEY
  if (!apiKey) return {}

  try {
    const rawServices = (rawData.services_menu || []).slice(0, 3).map((s: any) => s.name || '').filter(Boolean)
    const rawDesc = rawData.about_us?.intro_text || rawData.hero_section?.hero_subtitle || ''

    const systemPrompt = `Bạn là một AI Copywriter đỉnh cao chuyên về lĩnh vực ${category} tại Việt Nam, có khả năng viết lách mượt mà và tinh tế như Claude 3.5 Sonnet.
Nhiệm vụ của bạn là tạo ra nội dung marketing hấp dẫn, giàu cảm xúc nhưng vẫn tự nhiên, không dùng các từ ngữ sáo rỗng hay văn mẫu.

Quy tắc viết theo ngành:
${TONE_PROMPT[category]}

Yêu cầu kỹ thuật:
- Trả về kết quả dưới dạng JSON thuần túy.
- Đảm bảo JSON hợp lệ.`

    const userPrompt = `Hãy viết nội dung cho doanh nghiệp sau:
- Tên: ${business_name}
- Lĩnh vực: ${category}
- Dịch vụ chính: ${rawServices.join(', ') || 'Chưa có'}
- Mô tả thô: ${rawDesc || 'Chưa có'}

Hãy điền vào cấu trúc JSON sau (viết bằng tiếng Việt, tự nhiên, cuốn hút):
{
  "hero_title": "(5-8 từ, giật tít tinh tế, hứa hẹn giá trị, đúng tone ngành)",
  "hero_subtitle": "(1 câu mô tả giá trị cốt lõi, chạm đến mong muốn của khách hàng, tối đa 15 từ)",
  "about_intro": "(2-3 câu giới thiệu chuyên sâu, kể câu chuyện ngắn hoặc nêu bật triết lý phục vụ, đúng tone ngành)",
  "reservation_title": "(Lời kêu gọi hành động CTA tinh tế, không vồ vập, phù hợp tone)",
  "seo_description": "(tối đa 155 ký tự cho meta description, hấp dẫn để tăng click)"
}`

    const res = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' }
      })
    })

    if (!res.ok) {
      console.error('DeepSeek API error:', await res.text())
      return {}
    }

    const json = await res.json()
    const text = (json.choices?.[0]?.message?.content || '').trim()
    return JSON.parse(text)
  } catch (error) {
    console.error('enrichWithAI error:', error)
    return {}
  }
}

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

      // 4. Fetch ảnh theo ngành + AI enrich content
      const freshImages = await fetchUnsplashImages(categoryClean)

      let aiEnriched: Record<string, any> = {}
      if (aiEnrichCount < maxAIEnrich) {
        aiEnriched = await enrichWithAI(business_name, categoryClean, item)
        if (Object.keys(aiEnriched).length > 0) aiEnrichCount++
      }

      // 5. Xử lý content_json (Ưu tiên cấu trúc chuẩn từ harvester)
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
          hero_section: {
            hero_title: aiEnriched.hero_title || item.hero_section?.hero_title || `Chào mừng tới ${business_name}`,
            hero_subtitle: aiEnriched.hero_subtitle || item.hero_section?.hero_subtitle || 'Trải nghiệm dịch vụ đẳng cấp',
            hero_video_url: item.hero_section?.hero_video_url || '',
            hero_slides: (
              item.hero_section?.hero_slides?.filter(Boolean).length
                ? item.hero_section.hero_slides
                : freshImages.slice(0, 3)
            )
          },
          about_us: {
            section_title: 'Về Chúng Tôi',
            intro_text: aiEnriched.about_intro || item.about_us?.intro_text || `Chào mừng bạn đến với ${business_name}.`,
            experience_years: item.about_us?.experience_years || '5+',
            video_intro_url: item.about_us?.video_intro_url || '',
            about_image_1: item.about_us?.about_image_1 || freshImages[3] || freshImages[0],
            about_image_2: item.about_us?.about_image_2 || freshImages[4] || freshImages[1]
          },
          services_menu,
          expert_team,
          gallery,
          social_trust: {
            rating_count: item.rating_count || 50,
            testimonials
          },
          reservation_section: {
            title: aiEnriched.reservation_title || item.reservation_section?.title || `Đặt lịch tại ${business_name}`,
            subtitle: item.reservation_section?.subtitle || 'Liên hệ với chúng tôi để được tư vấn',
            badge: 'Tư vấn miễn phí'
          },
          seo_description: aiEnriched.seo_description || '',
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
