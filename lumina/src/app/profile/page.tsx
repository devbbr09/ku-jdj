'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  History, 
  Heart, 
  MessageCircle, 
  Star,
  Calendar,
  TrendingUp,
  Settings,
  LogOut,
  Home
} from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('history');

  // Mock 데이터
  const analysisHistory = [
    {
      id: '1',
      date: '2024-09-20',
      score: 78,
      style: '데일리 메이크업',
      feedback: '아이 메이크업 개선이 필요합니다'
    },
    {
      id: '2', 
      date: '2024-09-15',
      score: 85,
      style: '로맨틱 메이크업',
      feedback: '전반적으로 우수한 메이크업입니다'
    },
    {
      id: '3',
      date: '2024-09-10',
      score: 72,
      style: '글램 메이크업',
      feedback: '베이스 메이크업 톤 조정이 필요합니다'
    }
  ];

  const favoriteStyles = [
    {
      id: '1',
      title: '시크 스모키룩',
      expert: '김민아',
      image: '/images/smoky-look.jpg',
      tags: ['쿨톤', '스모키', '진한']
    },
    {
      id: '2',
      title: '자연스러운 데일리룩',
      expert: '박서연',
      image: '/images/daily-look.jpg',
      tags: ['웜톤', '데일리', '자연스러운']
    },
    {
      id: '3',
      title: '로맨틱 핑크룩',
      expert: '이지은',
      image: '/images/pink-look.jpg',
      tags: ['핑크', '로맨틱', '데이트']
    }
  ];

  const matchingRequests = [
    {
      id: '1',
      expert: '김민아',
      status: 'pending',
      date: '2024-09-22',
      message: '스모키 메이크업 개선을 위한 상담을 요청드립니다'
    },
    {
      id: '2',
      expert: '박서연',
      status: 'accepted',
      date: '2024-09-20',
      message: '데일리 메이크업 상담이 승인되었습니다'
    },
    {
      id: '3',
      expert: '최유진',
      status: 'completed',
      date: '2024-09-18',
      message: '글램 메이크업 상담이 완료되었습니다'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600">대기중</Badge>;
      case 'accepted':
        return <Badge variant="default" className="bg-green-100 text-green-800">승인됨</Badge>;
      case 'completed':
        return <Badge variant="secondary">완료됨</Badge>;
      default:
        return <Badge variant="outline">알 수 없음</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5 text-primary" />
            <span className="text-lg font-bold">마이페이지</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => router.push('/')}
              className="flex items-center space-x-2"
            >
              <Home className="h-4 w-4" />
              <span>홈으로</span>
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Summary */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                  <span className="text-white font-bold text-xl">U</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold">사용자님</h2>
                  <p className="text-muted-foreground">LUMINA 멤버</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center space-x-1">
                      <History className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{analysisHistory.length}회 분석</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{favoriteStyles.length}개 즐겨찾기</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{matchingRequests.length}건 매칭</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="history" className="flex items-center space-x-2">
                <History className="h-4 w-4" />
                <span>분석 히스토리</span>
              </TabsTrigger>
              <TabsTrigger value="favorites" className="flex items-center space-x-2">
                <Heart className="h-4 w-4" />
                <span>즐겨찾기</span>
              </TabsTrigger>
              <TabsTrigger value="matching" className="flex items-center space-x-2">
                <MessageCircle className="h-4 w-4" />
                <span>매칭 현황</span>
              </TabsTrigger>
            </TabsList>

            {/* Analysis History */}
            <TabsContent value="history" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5" />
                    <span>분석 히스토리</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysisHistory.map((analysis) => (
                      <div key={analysis.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary">{analysis.score}</div>
                            <div className="text-xs text-muted-foreground">점</div>
                          </div>
                          <div>
                            <h3 className="font-semibold">{analysis.style}</h3>
                            <p className="text-sm text-muted-foreground">{analysis.feedback}</p>
                            <p className="text-xs text-muted-foreground mt-1">{analysis.date}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Star className="h-4 w-4 mr-2" />
                          재분석
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Favorites */}
            <TabsContent value="favorites" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Heart className="h-5 w-5" />
                    <span>즐겨찾는 스타일</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {favoriteStyles.map((style) => (
                      <Card key={style.id} className="group hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="aspect-[4/5] bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg mb-3 flex items-center justify-center">
                            <div className="text-center">
                              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-primary/20 flex items-center justify-center">
                                <span className="text-primary font-bold">💄</span>
                              </div>
                              <p className="text-sm text-muted-foreground">이미지 준비 중</p>
                            </div>
                          </div>
                          <h3 className="font-semibold mb-1">{style.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{style.expert}</p>
                          <div className="flex flex-wrap gap-1">
                            {style.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Matching Status */}
            <TabsContent value="matching" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageCircle className="h-5 w-5" />
                    <span>매칭 신청 현황</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {matchingRequests.map((request) => (
                      <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                            <span className="text-white font-bold">
                              {request.expert.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold">{request.expert} 전문가</h3>
                            <p className="text-sm text-muted-foreground">{request.message}</p>
                            <p className="text-xs text-muted-foreground mt-1">{request.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(request.status)}
                          {request.status === 'accepted' && (
                            <Button size="sm" className="lumina-button">
                              <MessageCircle className="h-4 w-4 mr-2" />
                              상담하기
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Quick Actions */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>빠른 액션</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <Button className="lumina-button h-auto p-4 flex flex-col items-center space-y-2">
                  <Star className="h-6 w-6" />
                  <span>새로운 AI 분석</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                  <MessageCircle className="h-6 w-6" />
                  <span>전문가 매칭</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                  <Calendar className="h-6 w-6" />
                  <span>상담 예약</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
