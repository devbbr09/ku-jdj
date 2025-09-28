'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Expert } from '@/types';
import { Star, MapPin, Clock, MessageCircle, Heart } from 'lucide-react';

interface ExpertCardProps {
  expert: Expert;
  onMatch: (expert: Expert) => void;
  onFavorite: (expert: Expert) => void;
  isFavorite?: boolean;
}

export default function ExpertCard({ expert, onMatch, onFavorite, isFavorite = false }: ExpertCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {expert.name.charAt(0)}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-lg">{expert.name}</h3>
              <p className="text-sm text-muted-foreground">{expert.title}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onFavorite(expert)}
            className={`p-2 ${isFavorite ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'}`}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {expert.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {expert.tags.slice(0, 3).map((tag, index) => (
            <span 
              key={index}
              className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700 font-bold"
            >
              #{tag}
            </span>
          ))}
          {expert.tags.length > 3 && (
            <span className="px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground">
              +{expert.tags.length - 3}
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{expert.rating}</span>
            <span className="text-muted-foreground">
              ({expert.reviewCount}개 리뷰)
            </span>
          </div>
          <div className="flex items-center space-x-1 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{expert.experienceYears}년 경력</span>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-primary">{expert.priceRange}</span>
            <span className="text-sm text-muted-foreground ml-1">/회</span>
          </div>
          {expert.isOfflineAvailable && (
            <Badge variant="outline" className="text-xs">
              <MapPin className="h-3 w-3 mr-1" />
              오프라인 가능
            </Badge>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            onClick={() => onMatch(expert)}
            className="flex-1 lumina-button hover:scale-105 active:scale-95 transition-all duration-200 hover:shadow-lg hover:brightness-110"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            매칭 신청
          </Button>
          {expert.isOfflineAvailable && (
            <Button 
              variant="outline" 
              size="sm"
              className="hover:scale-105 active:scale-95 transition-all duration-200 hover:bg-primary/10 hover:border-primary/50 hover:shadow-md"
            >
              <MapPin className="h-4 w-4 mr-1" />
              오프라인
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
