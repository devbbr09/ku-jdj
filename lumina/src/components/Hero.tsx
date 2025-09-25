'use client';

import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight } from 'lucide-react';

interface HeroProps {
  onAnalyzeClick: () => void;
  onExpertsClick: () => void;
}

export default function Hero({ onAnalyzeClick, onExpertsClick }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-secondary/20 to-primary/10 py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Heading */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="lumina-text-gradient">
                나만의 메이크업
              </span>
              <br />
              <span className="text-foreground">
                AI 진단받기
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              AI가 분석하는 맞춤형 메이크업 피드백과 전문가와의 1:1 매칭으로
              <br className="hidden md:block" />
              완벽한 메이크업을 완성해보세요
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              onClick={onAnalyzeClick}
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-2xl hover:scale-110 active:scale-95 transition-all duration-200 hover:brightness-110"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              AI 진단 시작하기
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={onExpertsClick}
              className="px-8 py-4 text-lg font-semibold rounded-full border-2 hover:bg-primary/20 hover:scale-110 active:scale-95 transition-all duration-200 hover:shadow-lg hover:border-primary/50"
            >
              전문가 둘러보기
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full lumina-gradient flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">AI 맞춤 분석</h3>
              <p className="text-sm text-muted-foreground">
                개인별 얼굴 특징을 분석한 맞춤형 피드백
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full lumina-gradient flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">전문가 매칭</h3>
              <p className="text-sm text-muted-foreground">
                뷰티 전문가와의 1:1 맞춤 상담
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full lumina-gradient flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">트렌드 탐색</h3>
              <p className="text-sm text-muted-foreground">
                최신 메이크업 스타일과 전문가 포트폴리오
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Background Decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full lumina-gradient opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full lumina-gradient opacity-20 blur-3xl"></div>
      </div>
    </section>
  );
}
