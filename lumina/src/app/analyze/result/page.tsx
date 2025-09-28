'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  RefreshCw, 
  Star, 
  Eye, 
  Palette, 
  MessageCircle,
  TrendingUp,
  Target
} from 'lucide-react';

export default function AnalysisResultPage() {
  const router = useRouter();
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  useEffect(() => {
    // 로컬 스토리지에서 분석 결과 불러오기
    const savedResult = localStorage.getItem('analysisResult');
    console.log('로컬 스토리지에서 불러온 데이터:', savedResult);
    
    if (savedResult) {
      try {
        const result = JSON.parse(savedResult);
        setAnalysisResult(result);
        console.log('분석 결과 불러오기 성공:', result);
        console.log('전체 데이터 구조:', JSON.stringify(result, null, 2));
        console.log('eyeScore:', result.eyeScore);
        console.log('eyeFeedback:', result.eyeFeedback);
        console.log('expertTips:', result.expertTips);
        console.log('improvements:', result.improvements);
        console.log('details:', result.details);
      } catch (error) {
        console.error('분석 결과 파싱 오류:', error);
      }
    } else {
      console.log('로컬 스토리지에 분석 결과가 없습니다.');
    }
  }, []);


  const handleExpertMatching = () => {
    router.push('/experts');
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  // 분석 결과가 없으면 로딩 표시
  if (!analysisResult) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-semibold mb-2">분석 결과를 불러오는 중...</div>
          <div className="text-muted-foreground">잠시만 기다려주세요.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>뒤로가기</span>
          </Button>
          
          <div className="flex items-center space-x-2">
            <Star className="h-5 w-5 text-primary" />
            <span className="text-lg font-bold">분석 결과</span>
          </div>
          
          <div className="w-20"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Overall Score */}
          <Card className="mb-8">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl mb-4">전체 점수</CardTitle>
              <div className="flex items-center justify-center space-x-4">
                <div className="text-6xl font-bold text-primary">
                  {analysisResult.details?.detailedFeedback?.overallScore || analysisResult.score}
                </div>
                <div className="text-2xl text-muted-foreground">/ 100</div>
              </div>
              <Badge className={`mt-4 ${getScoreBadge(analysisResult.details?.detailedFeedback?.overallScore || analysisResult.score)}`}>
                {(analysisResult.details?.detailedFeedback?.overallScore || analysisResult.score) >= 80 ? '우수' : 
                 (analysisResult.details?.detailedFeedback?.overallScore || analysisResult.score) >= 60 ? '양호' : '개선 필요'}
              </Badge>
            </CardHeader>
          </Card>

          {/* 상세 분석 결과 */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="h-5 w-5" />
                  <span>아이 메이크업</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className={`text-3xl font-bold ${getScoreColor(analysisResult.details?.detailedFeedback?.eyeScore || 0)}`}>
                    {analysisResult.details?.detailedFeedback?.eyeScore || 0}
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">
                    {analysisResult.details?.detailedFeedback?.eyeFeedback || '분석 중...'}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Palette className="h-5 w-5" />
                  <span>베이스 메이크업</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className={`text-3xl font-bold ${getScoreColor(analysisResult.details?.detailedFeedback?.baseScore || 0)}`}>
                    {analysisResult.details?.detailedFeedback?.baseScore || 0}
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">
                    {analysisResult.details?.detailedFeedback?.baseFeedback || '분석 중...'}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageCircle className="h-5 w-5" />
                  <span>립 메이크업</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className={`text-3xl font-bold ${getScoreColor(analysisResult.details?.detailedFeedback?.lipScore || 0)}`}>
                    {analysisResult.details?.detailedFeedback?.lipScore || 0}
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">
                    {analysisResult.details?.detailedFeedback?.lipFeedback || '분석 중...'}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>


          {/* 개선사항 */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>개선사항</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(analysisResult.details?.detailedFeedback?.improvements || []).map((improvement: any, index: number) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-orange-600">!</span>
                    </div>
                    <div className="flex-1">
                      {typeof improvement === 'string' ? (
                        <span className="text-sm">{improvement}</span>
                      ) : (
                        <div>
                          <div className="text-sm font-medium">{improvement.suggestion}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {improvement.category} • 우선순위: {improvement.priority === 'high' ? '높음' : improvement.priority === 'medium' ? '보통' : '낮음'}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 전체 피드백 */}
          {analysisResult.details?.detailedFeedback?.overallFeedback && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>종합 피드백</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg border-l-4 border-primary">
                  <p className="text-sm leading-relaxed">{analysisResult.details?.detailedFeedback?.overallFeedback}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 분석 상세 정보 */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>분석 상세 정보</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="font-medium mb-2">분석 ID</div>
                  <div className="text-sm text-muted-foreground">{analysisResult.id}</div>
                </div>
                <div>
                  <div className="font-medium mb-2">분석 시간</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(analysisResult.details?.timestamp || Date.now()).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="font-medium mb-2">분석된 이미지 수</div>
                  <div className="text-sm text-muted-foreground">
                    {analysisResult.details?.analyses?.length || 1}개
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="outline"
              onClick={() => router.push('/')}
              className="px-8 py-3 hover:scale-110 active:scale-95 transition-all duration-200 hover:bg-secondary/80 hover:shadow-lg border-2 hover:border-primary/50"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              홈으로 돌아가기
            </Button>
            <Button
              onClick={handleExpertMatching}
              className="lumina-button px-8 py-3 text-lg font-semibold hover:scale-110 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-2xl hover:brightness-110"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              전문가 피드백 받기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
