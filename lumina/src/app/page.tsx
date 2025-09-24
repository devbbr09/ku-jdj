'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import MakeupStyleCard from '@/components/MakeupStyleCard';
import MakeupDetailModal from '@/components/MakeupDetailModal';
import { makeupStyles } from '@/lib/data/makeupStyles';
import { MakeupStyle } from '@/types';

export default function Home() {
  const [selectedStyle, setSelectedStyle] = useState<MakeupStyle | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAnalyzeClick = () => {
    // TODO: Navigate to AI analysis page
    console.log('AI 분석 페이지로 이동');
  };

  const handleStyleClick = (style: MakeupStyle) => {
    setSelectedStyle(style);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStyle(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onAnalyzeClick={handleAnalyzeClick} />
      
      <main>
        <Hero onAnalyzeClick={handleAnalyzeClick} />
        
        {/* Trends Section */}
        <section id="trends" className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                요즘 트렌드를 둘러보세요
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                전문가들이 추천하는 최신 메이크업 스타일을 확인하고
                <br />
                나만의 스타일을 찾아보세요
              </p>
            </div>

            {/* Makeup Styles Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {makeupStyles.map((style) => (
                <MakeupStyleCard
                  key={style.id}
                  style={style}
                  onClick={handleStyleClick}
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Modal */}
      <MakeupDetailModal
        style={selectedStyle}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
