'use client';

import { Card, CardContent } from '@/components/ui/card';
import { MakeupStyle } from '@/types';
import { Play, Star } from 'lucide-react';

interface MakeupStyleCardProps {
  style: MakeupStyle;
  onClick: (style: MakeupStyle) => void;
}

export default function MakeupStyleCard({ style, onClick }: MakeupStyleCardProps) {
  return (
    <Card 
      className="group cursor-pointer bg-card border border-border rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
      onClick={() => onClick(style)}
    >
      <div className="relative">
        {/* Image */}
        <div className="aspect-[4/5] overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full lumina-gradient flex items-center justify-center">
                <Play className="h-8 w-8 text-white" />
              </div>
              <p className="text-sm text-muted-foreground">이미지 준비 중</p>
            </div>
          </div>
        </div>

        {/* YouTube Link Overlay */}
        {style.youtubeUrl && (
          <div className="absolute top-4 right-4">
            <div className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center">
              <Play className="h-4 w-4 text-white" />
            </div>
          </div>
        )}

        {/* Expert Badge */}
        <div className="absolute top-4 left-4">
          <div className="px-2 py-1 rounded-full bg-background/90 backdrop-blur-sm">
            <span className="text-xs font-medium text-foreground">
              {style.expert.name}
            </span>
          </div>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Title */}
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">
          {style.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {style.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {style.tags.slice(0, 3).map((tag, index) => (
            <span 
              key={index}
              className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700 font-bold"
            >
              #{tag}
            </span>
          ))}
          {style.tags.length > 3 && (
            <span className="px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground">
              +{style.tags.length - 3}
            </span>
          )}
        </div>

        {/* Expert Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary to-accent"></div>
            <div>
              <p className="text-xs font-medium text-foreground">
                {style.expert.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {style.expert.title}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-medium">
              {style.expert.rating}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
