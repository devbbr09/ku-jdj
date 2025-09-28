'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Star, 
  Eye, 
  Palette, 
  MessageCircle,
  Target
} from 'lucide-react';

export default function AnalysisResultPage() {
  const router = useRouter();
  const [analysisResult, setAnalysisResult] = useState<{
    id?: string;
    score?: number;
    overallScore?: number;
    overallFeedback?: string;
    eyeMakeup?: {
      score: number;
      feedback: string;
      subScores?: {
        eyeshadowColorHarmony: number;
        eyeshadowBlending: number;
        eyelinerApplication: number;
        mascaraApplication: number;
      };
    };
    baseMakeup?: {
      score: number;
      feedback: string;
      subScores?: {
        skinToneMatching: number;
        foundationCoverage: number;
        concealerApplication: number;
        powderApplication: number;
      };
    };
    lipMakeup?: {
      score: number;
      feedback: string;
      subScores?: {
        lipColorHarmony: number;
        lipApplication: number;
        lipDefinition: number;
      };
    };
    improvements?: string[];
    timestamp?: number;
    imageCount?: number;
    images?: {
      makeup?: string;
      reference?: string;
    };
  } | null>(null);

  useEffect(() => {
    // 로컬 스토리지에서 분석 결과 불러오기
    const savedResult = localStorage.getItem('analysisResult');
    console.log('로컬 스토리지에서 불러온 데이터:', savedResult);
    
    if (savedResult) {
      try {
        const result = JSON.parse(savedResult);
        console.log('분석 결과 불러오기 성공:', result);
        console.log('전체 데이터 구조:', JSON.stringify(result, null, 2));
        
        // API 응답 구조에 맞게 데이터 변환
        const detailedFeedback = result.details?.detailedFeedback;
        const analyses = result.details?.analyses || [];
        
        // 이미지 URL들 추출
        const makeupImage = analyses.find((a: { type: string; imageUrl?: string }) => a.type === 'makeup')?.imageUrl;
        const referenceImage = analyses.find((a: { type: string; imageUrl?: string }) => a.type === 'reference')?.imageUrl;
        
        const transformedResult = {
          id: result.id,
          score: result.score,
          overallScore: detailedFeedback?.overallScore || result.score,
          overallFeedback: detailedFeedback?.overallFeedback || result.feedback,
          eyeMakeup: {
            score: detailedFeedback?.eyeScore || 0,
            feedback: detailedFeedback?.eyeFeedback || '분석 중...'
          },
          baseMakeup: {
            score: detailedFeedback?.baseScore || 0,
            feedback: detailedFeedback?.baseFeedback || '분석 중...'
          },
          lipMakeup: {
            score: detailedFeedback?.lipScore || 0,
            feedback: detailedFeedback?.lipFeedback || '분석 중...'
          },
          improvements: detailedFeedback?.improvements || [],
          timestamp: new Date(result.details?.timestamp || Date.now()).getTime(),
          imageCount: analyses.length,
          images: {
            makeup: makeupImage,
            reference: referenceImage
          }
        };
        
        setAnalysisResult(transformedResult);
        console.log('변환된 분석 결과:', transformedResult);
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
          {/* Image Cards */}
          {(analysisResult.images?.makeup || analysisResult.images?.reference) && (
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {analysisResult.images?.makeup && (
                <div className="aspect-square relative overflow-hidden rounded-lg">
                  <Image
                    src={analysisResult.images.makeup}
                    alt="메이크업 사진"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              
              {analysisResult.images?.reference && (
                <div className="aspect-square relative overflow-hidden rounded-lg">
                  <Image
                    src={analysisResult.images.reference}
                    alt="레퍼런스 사진"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          )}

          {/* Overall Score */}
          <Card className="mb-8">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl mb-4">전체 점수</CardTitle>
              <div className="flex items-center justify-center space-x-4">
                <div className="text-6xl font-bold text-primary">
                  {analysisResult.overallScore || analysisResult.score || 0}
                </div>
                <div className="text-2xl text-muted-foreground">/ 100</div>
              </div>
              <Badge className={`mt-4 ${getScoreBadge(analysisResult.overallScore || analysisResult.score || 0)}`}>
                {(analysisResult.overallScore || analysisResult.score || 0) >= 80 ? '우수' : 
                 (analysisResult.overallScore || analysisResult.score || 0) >= 60 ? '양호' : '개선 필요'}
              </Badge>
              
              {/* 종합 피드백을 전체 점수 바로 하단에 표시 */}
              {analysisResult.overallFeedback && (
                <div className="mt-6 p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg border-l-4 border-primary">
                  <p className="text-sm leading-relaxed text-center">{analysisResult.overallFeedback}</p>
                </div>
              )}
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
                  <div className={`text-3xl font-bold ${getScoreColor(analysisResult.eyeMakeup?.score || 0)}`}>
                    {analysisResult.eyeMakeup?.score || 0}
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">
                    {analysisResult.eyeMakeup?.feedback || '분석 중...'}
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
                  <div className={`text-3xl font-bold ${getScoreColor(analysisResult.baseMakeup?.score || 0)}`}>
                    {analysisResult.baseMakeup?.score || 0}
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">
                    {analysisResult.baseMakeup?.feedback || '분석 중...'}
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
                  <div className={`text-3xl font-bold ${getScoreColor(analysisResult.lipMakeup?.score || 0)}`}>
                    {analysisResult.lipMakeup?.score || 0}
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">
                    {analysisResult.lipMakeup?.feedback || '분석 중...'}
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
                {(analysisResult.improvements || []).map((improvement: string | {suggestion?: string; text?: string}, index: number) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-orange-600">!</span>
                    </div>
                    <div className="flex-1">
                      {typeof improvement === 'string' ? (
                        <span className="text-sm">{improvement}</span>
                      ) : (
                        <span className="text-sm">{improvement.suggestion || improvement.text || JSON.stringify(improvement)}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>


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
                  <div className="text-sm text-muted-foreground">{analysisResult.id || 'N/A'}</div>
                </div>
                <div>
                  <div className="font-medium mb-2">분석 시간</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(analysisResult.timestamp || Date.now()).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="font-medium mb-2">분석된 이미지 수</div>
                  <div className="text-sm text-muted-foreground">
                    {analysisResult.imageCount || 1}개
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
