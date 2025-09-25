'use client';

import { useState } from 'react';
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
  Lightbulb,
  Target
} from 'lucide-react';

export default function AnalysisResultPage() {
  const router = useRouter();
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Mock 분석 결과 데이터
  const analysisResult = {
    overallScore: 78,
    eyeScore: 85,
    baseScore: 72,
    lipScore: 80,
    eyeFeedback: "아이섀도 발색이 약하고 블렌딩이 부족합니다. 웜톤 브라운 계열의 아이섀도를 사용하여 그라데이션을 더 자연스럽게 연출해보세요.",
    baseFeedback: "파운데이션 톤이 피부보다 약간 밝은 편입니다. 현재보다 한 톤 어두운 파운데이션을 선택하시면 더 자연스러운 피부 표현이 가능합니다.",
    lipFeedback: "현재 립 컬러가 매우 잘 어울리네요! 립라이너를 사용하면 더욱 또렷한 입술 라인을 연출할 수 있습니다.",
    expertTips: [
      "메이크업 전 충분한 보습은 필수! 프라이머 사용으로 지속력을 높여보세요.",
      "브러시 대신 뷰티블렌더를 사용하면 더 자연스러운 베이스 연출이 가능합니다.",
      "아이섀도 발색을 높이려면 아이섀도 베이스를 먼저 발라주세요."
    ],
    improvements: [
      {
        category: "아이 메이크업",
        priority: "high",
        suggestion: "아이섀도 블렌딩 개선"
      },
      {
        category: "베이스 메이크업", 
        priority: "medium",
        suggestion: "파운데이션 톤 조정"
      },
      {
        category: "립 메이크업",
        priority: "low", 
        suggestion: "립라이너 활용"
      }
    ]
  };

  const handleReanalyze = () => {
    setIsAnalyzing(true);
    // TODO: 재분석 로직
    setTimeout(() => {
      setIsAnalyzing(false);
      router.push('/analyze');
    }, 2000);
  };

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
          
          <Button
            variant="outline"
            onClick={handleReanalyze}
            disabled={isAnalyzing}
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`h-4 w-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>재분석</span>
          </Button>
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
                  {analysisResult.overallScore}
                </div>
                <div className="text-2xl text-muted-foreground">/ 100</div>
              </div>
              <Badge className={`mt-4 ${getScoreBadge(analysisResult.overallScore)}`}>
                {analysisResult.overallScore >= 80 ? '우수' : 
                 analysisResult.overallScore >= 60 ? '양호' : '개선 필요'}
              </Badge>
            </CardHeader>
          </Card>

          {/* Detailed Scores */}
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
                  <div className={`text-3xl font-bold ${getScoreColor(analysisResult.eyeScore)}`}>
                    {analysisResult.eyeScore}
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">
                    {analysisResult.eyeFeedback}
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
                  <div className={`text-3xl font-bold ${getScoreColor(analysisResult.baseScore)}`}>
                    {analysisResult.baseScore}
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">
                    {analysisResult.baseFeedback}
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
                  <div className={`text-3xl font-bold ${getScoreColor(analysisResult.lipScore)}`}>
                    {analysisResult.lipScore}
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">
                    {analysisResult.lipFeedback}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Expert Tips */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lightbulb className="h-5 w-5" />
                <span>전문가 팁</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {analysisResult.expertTips.map((tip, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">{index + 1}</span>
                    </div>
                    <span className="text-sm">{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Improvements */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>개선사항</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysisResult.improvements.map((improvement, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <div className="font-medium">{improvement.category}</div>
                      <div className="text-sm text-muted-foreground">{improvement.suggestion}</div>
                    </div>
                    <Badge 
                      variant={improvement.priority === 'high' ? 'destructive' : 
                              improvement.priority === 'medium' ? 'default' : 'secondary'}
                    >
                      {improvement.priority === 'high' ? '높음' : 
                       improvement.priority === 'medium' ? '보통' : '낮음'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="outline"
              onClick={() => router.push('/')}
              className="px-8 py-3"
            >
              홈으로 돌아가기
            </Button>
            <Button
              onClick={handleExpertMatching}
              className="lumina-button px-8 py-3 text-lg font-semibold"
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
