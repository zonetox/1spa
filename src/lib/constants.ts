/**
 * 1Beauty.Asia - SYSTEM CONSTANTS
 * Source of truth for template mappings and project-wide identifiers.
 */

export const INDUSTRY_PILLARS = ['Spa', 'Beauty', 'Dental'] as const;
export type IndustryPillar = typeof INDUSTRY_PILLARS[number];

export const CANONICAL_TEMPLATES: Record<IndustryPillar, string> = {
  Spa: 'UniversalTemplate',
  Beauty: 'UniversalTemplate',
  Dental: 'UniversalTemplate'
};

export const CATEGORY_COLORS: Record<IndustryPillar, string> = {
  Spa: '#E5D5C0',
  Beauty: '#D4AF37',
  Dental: '#0D9488'
};

export const CATEGORY_DEFAULTS: Record<IndustryPillar, any> = {
  Spa: {
    heroTitle: 'Trải Nghiệm Tĩnh Lặng Tuyệt Đối',
    heroSubtitle: 'Nơi khơi nguồn sức sống và tìm lại sự cân bằng cho tâm hồn',
    aboutTitle: 'Về Chúng Tôi',
    aboutText: 'Chúng tôi mang đến những liệu trình spa đẳng cấp, giúp bạn tái tạo năng lượng và chăm sóc sắc đẹp toàn diện.'
  },
  Beauty: {
    heroTitle: 'Đánh Thức Vẻ Đẹp Tiềm Ẩn',
    heroSubtitle: 'Dịch vụ làm đẹp đẳng cấp với công nghệ tiên tiến nhất',
    aboutTitle: 'Sứ Mệnh Của Chúng Tôi',
    aboutText: 'Tôn vinh vẻ đẹp tự nhiên của người phụ nữ Việt thông qua những giải pháp thẩm mỹ an toàn và chuyên nghiệp.'
  },
  Dental: {
    heroTitle: 'Kiến Tạo Nụ Cười Hoàn Mỹ',
    heroSubtitle: 'Chăm sóc răng miệng chuyên sâu với tiêu chuẩn quốc tế',
    aboutTitle: 'Tâm Đức Ngành Y',
    aboutText: 'Chúng tôi cam kết mang lại nụ cười rạng rỡ và sức khỏe răng miệng bền vững cho gia đình bạn bằng sự tận tâm.'
  }
};

export const BOOKING_STATUS = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  COMPLETED: 'Completed'
} as const;
