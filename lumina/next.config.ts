import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 이미지 최적화
  images: {
    domains: [
      'localhost',
      'supabase.co',
      '*.supabase.co',
      '*.supabase.in',
      '*.supabase.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.in',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.com',
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },
  
  // 압축 설정
  compress: true,
};

export default nextConfig;
