'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ExpertCard from '@/components/ExpertCard';
import { Expert } from '@/types';
import { 
  Search, 
  Filter, 
  Users,
  MessageCircle,
  ArrowLeft
} from 'lucide-react';

// Mock 전문가 데이터
const mockExperts: Expert[] = [
  {
    id: "1",
    name: "김민아",
    title: "아티스트",
    description: "진한 화장을 전문으로 메이크업을 하고 있는 김민아입니다. 8년간의 경험으로 완벽한 스모키룩을 완성해드립니다.",
    profileImage: "/images/expert1.jpg",
    portfolioImages: ["/images/portfolio1.jpg", "/images/portfolio2.jpg"],
    tags: ["쿨톤메이크업", "스모키", "진한", "오프라인예약가능"],
    experienceYears: 8,
    priceRange: "50,000원",
    isOfflineAvailable: true,
    rating: 4.9,
    reviewCount: 127
  },
  {
    id: "2",
    name: "박서연",
    title: "뷰티 유튜버",
    description: "자연스러운 메이크업의 전문가 박서연입니다. 5년간의 경험으로 완벽한 데일리룩을 완성해드립니다.",
    profileImage: "/images/expert2.jpg",
    portfolioImages: ["/images/portfolio3.jpg", "/images/portfolio4.jpg"],
    tags: ["웜톤메이크업", "데일리", "자연스러운", "온라인상담"],
    experienceYears: 5,
    priceRange: "30,000원",
    isOfflineAvailable: false,
    rating: 4.8,
    reviewCount: 89
  },
  {
    id: "3",
    name: "이지은",
    title: "메이크업 아티스트",
    description: "로맨틱 메이크업의 전문가 이지은입니다. 6년간의 경험으로 완벽한 핑크룩을 완성해드립니다.",
    profileImage: "/images/expert3.jpg",
    portfolioImages: ["/images/portfolio5.jpg", "/images/portfolio6.jpg"],
    tags: ["핑크메이크업", "로맨틱", "데이트", "오프라인예약가능"],
    experienceYears: 6,
    priceRange: "45,000원",
    isOfflineAvailable: true,
    rating: 4.7,
    reviewCount: 156
  },
  {
    id: "4",
    name: "최유진",
    title: "글램 전문가",
    description: "글램 메이크업의 전문가 최유진입니다. 7년간의 경험으로 완벽한 글램룩을 완성해드립니다.",
    profileImage: "/images/expert4.jpg",
    portfolioImages: ["/images/portfolio7.jpg", "/images/portfolio8.jpg"],
    tags: ["글램메이크업", "반짝이는", "파티", "오프라인예약가능"],
    experienceYears: 7,
    priceRange: "60,000원",
    isOfflineAvailable: true,
    rating: 4.9,
    reviewCount: 203
  },
  {
    id: "5",
    name: "정수진",
    title: "클린 전문가",
    description: "클린 메이크업의 전문가 정수진입니다. 4년간의 경험으로 완벽한 클린룩을 완성해드립니다.",
    profileImage: "/images/expert5.jpg",
    portfolioImages: ["/images/portfolio9.jpg", "/images/portfolio10.jpg"],
    tags: ["클린메이크업", "세련된", "비즈니스", "온라인상담"],
    experienceYears: 4,
    priceRange: "35,000원",
    isOfflineAvailable: false,
    rating: 4.6,
    reviewCount: 78
  },
  {
    id: "6",
    name: "한소영",
    title: "웜톤 전문가",
    description: "웜톤 메이크업의 전문가 한소영입니다. 5년간의 경험으로 완벽한 웜톤룩을 완성해드립니다.",
    profileImage: "/images/expert6.jpg",
    portfolioImages: ["/images/portfolio11.jpg", "/images/portfolio12.jpg"],
    tags: ["웜톤메이크업", "오렌지", "가을", "오프라인예약가능"],
    experienceYears: 5,
    priceRange: "40,000원",
    isOfflineAvailable: true,
    rating: 4.8,
    reviewCount: 134
  }
];

export default function ExpertsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<string>('all');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [favorites, setFavorites] = useState<string[]>([]);

  // 필터링된 전문가 목록
  const filteredExperts = useMemo(() => {
    return mockExperts.filter(expert => {
      // 검색어 필터
      const matchesSearch = expert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           expert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           expert.description.toLowerCase().includes(searchTerm.toLowerCase());

      // 태그 필터
      const matchesTags = selectedTags.length === 0 || 
                            selectedTags.some(tag => expert.tags.includes(tag));

      // 가격 필터
      const matchesPrice = priceRange === 'all' || 
                          (priceRange === 'low' && parseInt(expert.priceRange.replace(/[^0-9]/g, '')) < 40000) ||
                          (priceRange === 'medium' && parseInt(expert.priceRange.replace(/[^0-9]/g, '')) >= 40000 && parseInt(expert.priceRange.replace(/[^0-9]/g, '')) < 60000) ||
                          (priceRange === 'high' && parseInt(expert.priceRange.replace(/[^0-9]/g, '')) >= 60000);

      // 평점 필터
      const matchesRating = ratingFilter === 'all' || 
                           (ratingFilter === 'high' && expert.rating >= 4.8) ||
                           (ratingFilter === 'medium' && expert.rating >= 4.5 && expert.rating < 4.8) ||
                           (ratingFilter === 'low' && expert.rating < 4.5);

      return matchesSearch && matchesTags && matchesPrice && matchesRating;
    });
  }, [searchTerm, selectedTags, priceRange, ratingFilter]);

  const availableTags = Array.from(new Set(mockExperts.flatMap(expert => expert.tags)));

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleFavorite = (expert: Expert) => {
    setFavorites(prev => 
      prev.includes(expert.id)
        ? prev.filter(id => id !== expert.id)
        : [...prev, expert.id]
    );
  };

  const handleMatch = (expert: Expert) => {
    // TODO: 매칭 신청 로직
    console.log('전문가 매칭 신청:', expert.name);
    alert(`${expert.name} 전문가와의 매칭을 신청했습니다!`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>뒤로가기</span>
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-primary" />
            <span className="text-lg font-bold">전문가 매칭</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              {filteredExperts.length}명의 전문가
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Search and Filters */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="h-5 w-5" />
                <span>검색 및 필터</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="전문가 이름, 분야로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Tags Filter */}
              <div>
                <h3 className="font-semibold mb-3">전문 분야</h3>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map(tag => (
                    <Badge
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      className="cursor-pointer font-bold"
                      onClick={() => handleTagToggle(tag)}
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Price and Rating Filters */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-3">가격대</h3>
                  <div className="flex gap-2">
                    {[
                      { value: 'all', label: '전체' },
                      { value: 'low', label: '4만원 미만' },
                      { value: 'medium', label: '4-6만원' },
                      { value: 'high', label: '6만원 이상' }
                    ].map(option => (
                      <Button
                        key={option.value}
                        variant={priceRange === option.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPriceRange(option.value)}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">평점</h3>
                  <div className="flex gap-2">
                    {[
                      { value: 'all', label: '전체' },
                      { value: 'high', label: '4.8점 이상' },
                      { value: 'medium', label: '4.5-4.8점' },
                      { value: 'low', label: '4.5점 미만' }
                    ].map(option => (
                      <Button
                        key={option.value}
                        variant={ratingFilter === option.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setRatingFilter(option.value)}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Experts Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExperts.map(expert => (
              <ExpertCard
                key={expert.id}
                expert={expert}
                onMatch={handleMatch}
                onFavorite={handleFavorite}
                isFavorite={favorites.includes(expert.id)}
              />
            ))}
          </div>

          {/* No Results */}
          {filteredExperts.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">검색 결과가 없습니다</h3>
                <p className="text-muted-foreground mb-4">
                  다른 검색어나 필터를 시도해보세요
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedTags([]);
                    setPriceRange('all');
                    setRatingFilter('all');
                  }}
                >
                  필터 초기화
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Coming Soon Notice */}
          <Card className="mt-8 bg-primary/5 border-primary/20">
            <CardContent className="text-center py-8">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-lg font-semibold mb-2">전문가 매칭 서비스 준비 중</h3>
              <p className="text-muted-foreground mb-4">
                곧 전문가와의 1:1 매칭 서비스를 제공할 예정입니다
              </p>
              <Badge variant="outline" className="text-primary">
                Coming Soon
              </Badge>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
