'use server';

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase with Service Role Key for secure admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseServiceKey) {
  throw new Error('CẤU HÌNH LỖI: Thiếu SUPABASE_SERVICE_ROLE_KEY trên Server.');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

function slugify(text: string) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

export async function completeSignupProfile(userId: string, email: string, businessName: string) {
  try {
    // 1. Create Profile
    const { error: accError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        email: email,
        role: 'Business',
        subscription_status: 'trial',
        expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      });
      
    if (accError) throw new Error('Lỗi tạo tài khoản: ' + accError.message);

    // 2. Create Business Profile
    const slug = slugify(businessName) + '-' + Math.random().toString(36).substring(2, 5);
    const { data: profile, error: profError } = await supabase
      .from('business_profiles')
      .insert({
        account_id: userId,
        business_name: businessName,
        slug,
        category: 'Spa',
        location_city: 'Hồ Chí Minh',
        location_district: 'Quận 1'
      })
      .select()
      .single();

    if (profError) {
      await supabase.from('profiles').delete().eq('id', userId);
      throw new Error('Lỗi tạo hồ sơ doanh nghiệp: ' + profError.message);
    }

    // 3. Create Landing Page
    const { error: lpError } = await supabase.from('landing_pages').insert({
      business_id: profile.id,
      template_id: 'UniversalTemplate',
      status: 'Published',
      content_json: {
        hero_section: { hero_title: `Chào mừng tới ${businessName}`, hero_subtitle: 'Nâng tầm vẻ đẹp thượng lưu' },
        about_us: { intro_text: 'Chúng tôi mang đến dịch vụ tốt nhất cho bạn.' },
        services_menu: [],
        contact_info: { hotline: '', zalo_link: '' },
        operating_hours: {}
      }
    });

    if (lpError) {
      await supabase.from('business_profiles').delete().eq('account_id', userId);
      await supabase.from('profiles').delete().eq('id', userId);
      throw new Error('Lỗi tạo trang Landing Page: ' + lpError.message);
    }

    return { success: true };
  } catch (error: any) {
    console.error('Signup completion error:', error);
    // Rollback Auth User to prevent Zombie Auth User
    try {
      await supabase.auth.admin.deleteUser(userId);
    } catch (deleteError) {
      console.error('Failed to delete auth user during rollback:', deleteError);
    }
    return { success: false, error: error.message };
  }
}
