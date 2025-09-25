import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'LUMINA - AI 메이크업 진단 서비스',
    template: '%s | LUMINA'
  },
  description: 'AI가 분석하는 맞춤형 메이크업 피드백과 전문가와의 1:1 매칭으로 완벽한 메이크업을 완성해보세요',
  keywords: ['메이크업', 'AI', '뷰티', '전문가', '매칭', '진단', 'LUMINA'],
  authors: [{ name: 'LUMINA Team' }],
  creator: 'LUMINA',
  publisher: 'LUMINA',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://lumina.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://lumina.vercel.app',
    title: 'LUMINA - AI 메이크업 진단 서비스',
    description: 'AI가 분석하는 맞춤형 메이크업 피드백과 전문가와의 1:1 매칭으로 완벽한 메이크업을 완성해보세요',
    siteName: 'LUMINA',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'LUMINA - AI 메이크업 진단 서비스',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LUMINA - AI 메이크업 진단 서비스',
    description: 'AI가 분석하는 맞춤형 메이크업 피드백과 전문가와의 1:1 매칭으로 완벽한 메이크업을 완성해보세요',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};
