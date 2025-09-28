import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 이미지 최적화 비활성화 (외부 이미지 로딩 문제 해결)
  images: {
    unoptimized: true,
  },
  
  // 압축 설정
  compress: true,
};

export default nextConfig;
