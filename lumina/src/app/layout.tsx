import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LUMINA - AI 메이크업 진단 서비스",
  description: "AI가 분석하는 맞춤형 메이크업 피드백과 전문가와의 1:1 매칭으로 완벽한 메이크업을 완성해보세요",
  keywords: ["메이크업", "AI", "뷰티", "전문가", "매칭", "진단"],
  authors: [{ name: "LUMINA Team" }],
  openGraph: {
    title: "LUMINA - AI 메이크업 진단 서비스",
    description: "AI가 분석하는 맞춤형 메이크업 피드백과 전문가와의 1:1 매칭으로 완벽한 메이크업을 완성해보세요",
    type: "website",
    locale: "ko_KR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
