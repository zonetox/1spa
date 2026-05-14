export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      active_landing_pages: {
        Row: {
          id: string | null
          business_id: string | null
          template_id: string | null
          content_json: Json | null
          is_published: boolean | null
          page_status: string | null
          business_name: string | null
          business_slug: string | null
          category: string | null
          zalo_phone: string | null
          hotline: string | null
          logo_url: string | null
          is_verified: boolean | null
          subscription_status: string | null
          expiry_date: string | null
        }
        Insert: {
          id?: string | null
          business_id?: string | null
          template_id?: string | null
          content_json?: Json | null
          is_published?: boolean | null
          page_status?: string | null
          business_name?: string | null
          business_slug?: string | null
          category?: string | null
          zalo_phone?: string | null
          hotline?: string | null
          logo_url?: string | null
          is_verified?: boolean | null
          subscription_status?: string | null
          expiry_date?: string | null
        }
        Update: {
          id?: string | null
          business_id?: string | null
          template_id?: string | null
          content_json?: Json | null
          is_published?: boolean | null
          page_status?: string | null
          business_name?: string | null
          business_slug?: string | null
          category?: string | null
          zalo_phone?: string | null
          hotline?: string | null
          logo_url?: string | null
          is_verified?: boolean | null
          subscription_status?: string | null
          expiry_date?: string | null
        }
      }
      analytics_events: {
        Row: {
          id: string
          business_id: string | null
          event_type: string | null
          page_slug: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          business_id?: string | null
          event_type?: string | null
          page_slug?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          business_id?: string | null
          event_type?: string | null
          page_slug?: string | null
          created_at?: string | null
        }
      }
      blogs: {
        Row: {
          id: string
          business_id: string
          title: string
          content: string
          image_url: string | null
          status: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          business_id: string
          title: string
          content: string
          image_url?: string | null
          status?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          business_id?: string
          title?: string
          content?: string
          image_url?: string | null
          status?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      bookings: {
        Row: {
          id: string
          business_id: string
          customer_info: Json
          status: string
          source_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          business_id: string
          customer_info: Json
          status?: string
          source_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          customer_info?: Json
          status?: string
          source_url?: string | null
          created_at?: string
        }
      }
      business_locations: {
        Row: {
          id: string
          business_id: string
          city: string
          district: string
          address_full: string
          lat: number | null
          lng: number | null
        }
        Insert: {
          id?: string
          business_id: string
          city?: string
          district: string
          address_full: string
          lat?: number | null
          lng?: number | null
        }
        Update: {
          id?: string
          business_id?: string
          city?: string
          district?: string
          address_full?: string
          lat?: number | null
          lng?: number | null
        }
      }
      business_profiles: {
        Row: {
          id: string
          account_id: string
          business_name: string
          slug: string
          category: string
          zalo_phone: string | null
          hotline: string | null
          logo_url: string | null
          is_verified: boolean
          created_at: string
          location_city: string | null
          location_district: string | null
          rating_score: number | null
          social_links: Json | null
        }
        Insert: {
          id?: string
          account_id: string
          business_name: string
          slug: string
          category: string
          zalo_phone?: string | null
          hotline?: string | null
          logo_url?: string | null
          is_verified?: boolean
          created_at?: string
          location_city?: string | null
          location_district?: string | null
          rating_score?: number | null
          social_links?: Json | null
        }
        Update: {
          id?: string
          account_id?: string
          business_name?: string
          slug?: string
          category?: string
          zalo_phone?: string | null
          hotline?: string | null
          logo_url?: string | null
          is_verified?: boolean
          created_at?: string
          location_city?: string | null
          location_district?: string | null
          rating_score?: number | null
          social_links?: Json | null
        }
      }
      landing_pages: {
        Row: {
          id: string
          business_id: string
          template_id: string
          content_json: Json
          is_published: boolean
          updated_at: string
          status: string | null
          draft_json: Json | null
        }
        Insert: {
          id?: string
          business_id: string
          template_id?: string
          content_json?: Json
          is_published?: boolean
          updated_at?: string
          status?: string | null
          draft_json?: Json | null
        }
        Update: {
          id?: string
          business_id?: string
          template_id?: string
          content_json?: Json
          is_published?: boolean
          updated_at?: string
          status?: string | null
          draft_json?: Json | null
        }
      }
      notifications: {
        Row: {
          id: string
          recipient_id: string | null
          type: string | null
          title: string | null
          message: string | null
          is_read: boolean | null
          created_at: string | null
        }
        Insert: {
          id?: string
          recipient_id?: string | null
          type?: string | null
          title?: string | null
          message?: string | null
          is_read?: boolean | null
          created_at?: string | null
        }
        Update: {
          id?: string
          recipient_id?: string | null
          type?: string | null
          title?: string | null
          message?: string | null
          is_read?: boolean | null
          created_at?: string | null
        }
      }
      packages: {
        Row: {
          id: string
          name: string
          price: number
          trial_days: number | null
          duration_days: number | null
          features: Json | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          price: number
          trial_days?: number | null
          duration_days?: number | null
          features?: Json | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          price?: number
          trial_days?: number | null
          duration_days?: number | null
          features?: Json | null
          created_at?: string | null
        }
      }
      profiles: {
        Row: {
          id: string
          role: string
          full_name: string | null
          email: string
          subscription_status: string
          expiry_date: string
          created_at: string
        }
        Insert: {
          id: string
          role?: string
          full_name?: string | null
          email: string
          subscription_status?: string
          expiry_date?: string
          created_at?: string
        }
        Update: {
          id?: string
          role?: string
          full_name?: string | null
          email?: string
          subscription_status?: string
          expiry_date?: string
          created_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          business_id: string
          author_name: string
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          business_id: string
          author_name: string
          rating: number
          comment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          author_name?: string
          rating?: number
          comment?: string | null
          created_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          business_id: string
          package_id: string
          status: string | null
          start_date: string | null
          end_date: string | null
          created_at: string | null
          verified: boolean | null
        }
        Insert: {
          id?: string
          business_id: string
          package_id: string
          status?: string | null
          start_date?: string | null
          end_date?: string | null
          created_at?: string | null
          verified?: boolean | null
        }
        Update: {
          id?: string
          business_id?: string
          package_id?: string
          status?: string | null
          start_date?: string | null
          end_date?: string | null
          created_at?: string | null
          verified?: boolean | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      booking_status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled'
      business_category: 'Spa' | 'Dental' | 'Clinic' | 'Beauty'
      page_status: 'Draft' | 'Published'
      user_role: 'Admin' | 'Business'
    }
  }
}
