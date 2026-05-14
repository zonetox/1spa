export type BusinessCategory = 'Spa' | 'Beauty' | 'Dental';

export interface LandingPageData {
  hero_section?: {
    hero_title?: string;
    hero_subtitle?: string;
    hero_slides?: string[];
  };
  about_us?: {
    section_title?: string;
    intro_text?: string;
    experience_years?: number | string;
    about_image_1?: string;
    about_image_2?: string;
  };
  services_menu?: ServiceItem[];
  expert_team?: TeamMember[];
  gallery?: GalleryItem[];
  social_trust?: {
    rating_count?: number;
    testimonials?: Testimonial[];
  };
  contact_info?: ContactInfo;
  services_section?: SectionHeader;
  team_section?: SectionHeader;
  gallery_section?: SectionHeader;
  testimonials_section?: SectionHeader;
  reservation_section?: ReservationSection;
  theme_color?: string;
}

export interface ServiceItem {
  name: string;
  desc: string;
  price: string;
  img: string;
  tagline?: string;
}

export interface TeamMember {
  name: string;
  role: string;
  img: string;
}

export interface GalleryItem {
  url: string;
  caption?: string;
}

export interface Testimonial {
  name: string;
  role: string;
  text: string;
  avatar?: string;
  rating?: number;
}

export interface ContactInfo {
  address_full?: string;
  hotline?: string;
  email?: string;
  operating_hours?: string;
  social_links?: { platform: string; url: string }[];
  map_embed_url?: string;
}

export interface SectionHeader {
  title: string;
  subtitle?: string;
}

export interface ReservationSection {
  title: string;
  subtitle?: string;
  badge?: string;
}
