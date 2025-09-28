'use client';

import { useState } from 'react';
import { X, User, Star, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AnonymousBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 mb-6 relative">
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
      >
        <X className="h-4 w-4" />
      </button>
      
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-blue-600" />
          </div>
        </div>
        
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">
            🎉 익명으로 체험 중이시군요!
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            지금은 모든 기능을 무료로 체험할 수 있습니다. 
            로그인하시면 분석 결과를 저장하고 즐겨찾기를 관리할 수 있어요!
          </p>
          
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <Star className="h-3 w-3" />
              <span>분석 히스토리 저장</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart className="h-3 w-3" />
              <span>즐겨찾기 관리</span>
            </div>
          </div>
          
          <div className="mt-3">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => alert('로그인 기능은 아직 지원되지 않아요.')}
            >
              로그인하기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
