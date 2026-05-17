import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        // Supabase Storage CDN
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        // Supabase Storage CDN (alternative)
        protocol: 'https',
        hostname: '*.supabase.in',
      },
      {
        // Imgur for team/gallery images
        protocol: 'https',
        hostname: 'i.imgur.com',
      },
      {
        // NhakhoaKim and similar business logos
        protocol: 'https',
        hostname: 'nhakhoakim.com',
      },
      {
        // Google user avatars
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        // Facebook CDN (business profile photos)
        protocol: 'https',
        hostname: '*.fbcdn.net',
      },
      {
        // Vercel gradients and assets
        protocol: 'https',
        hostname: 'grainy-gradients.vercel.app',
      },
      {
        // Vercel subdomains
        protocol: 'https',
        hostname: '*.vercel.app',
      },
    ],
  },
};

export default nextConfig;
