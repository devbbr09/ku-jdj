'use client';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MakeupStyle } from '@/types';
import { X, Play, Star, MapPin, Clock, MessageCircle } from 'lucide-react';

interface MakeupDetailModalProps {
  style: MakeupStyle | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function MakeupDetailModal({ style, isOpen, onClose }: MakeupDetailModalProps) {
  if (!style) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <DialogTitle className="sr-only">{style.title}</DialogTitle>
        <div className="relative">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-10 bg-background/80 backdrop-blur-sm"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>

          {/* Hero Image */}
          <div className="relative h-64 md:h-80 overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full lumina-gradient flex items-center justify-center">
                  <Play className="h-10 w-10 text-white" />
                </div>
                <p className="text-muted-foreground">이미지 준비 중</p>
              </div>
            </div>
            
            {/* YouTube Link Overlay */}
            {style.youtubeUrl && (
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 py-4"
                  onClick={() => window.open(style.youtubeUrl, '_blank')}
                >
                  <Play className="mr-2 h-5 w-5" />
                  튜토리얼 보기
                </Button>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Title and Description */}
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                {style.title}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {style.description}
              </p>
            </div>

            {/* Tags */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">스타일 태그</h3>
              <div className="flex flex-wrap gap-2">
                {style.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 rounded-full bg-primary/10 text-primary font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Expert Information */}
            <div className="mb-6">
              <h3 className="font-semibold mb-4">전문가 정보</h3>
              <div className="bg-secondary/50 rounded-lg p-4">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {style.expert.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-semibold text-lg">{style.expert.name}</h4>
                      <span className="text-sm text-muted-foreground">
                        {style.expert.title}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {style.expert.description}
                    </p>
                    
                    {/* Expert Stats */}
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{style.expert.rating}</span>
                        <span className="text-muted-foreground">
                          ({style.expert.reviewCount}개 리뷰)
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {style.expert.experienceYears}년 경력
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Expert Tags */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">전문 분야</h3>
              <div className="flex flex-wrap gap-2">
                {style.expert.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 rounded-full bg-accent/10 text-accent font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                className="bg-primary text-primary-foreground hover:bg-primary/90 flex-1 py-3"
                onClick={() => {
                  // TODO: Implement expert matching
                  console.log('전문가 매칭 신청:', style.expert.name);
                }}
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                전문가와 매칭하기
              </Button>
              
              {style.expert.isOfflineAvailable && (
                <Button 
                  variant="outline" 
                  className="flex-1 py-3"
                  onClick={() => {
                    // TODO: Implement offline booking
                    console.log('오프라인 예약:', style.expert.name);
                  }}
                >
                  <MapPin className="mr-2 h-5 w-5" />
                  오프라인 예약
                </Button>
              )}
            </div>

            {/* Price Info */}
            <div className="mt-4 p-4 bg-primary/5 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-medium">서비스 가격</span>
                <span className="text-lg font-bold text-primary">
                  {style.expert.priceRange}
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
