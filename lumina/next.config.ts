import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 이미지 최적화
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // 성능 최적화
  experimental: {
    optimizeCss: true,
  },
  
  // 압축 설정
  compress: true,
  
  // 빌드 최적화
  swcMinify: true,
};

export default nextConfig;
