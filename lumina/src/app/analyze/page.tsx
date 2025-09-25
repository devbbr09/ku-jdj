'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProgressTracker from '@/components/ProgressTracker';
import ImageUpload from '@/components/ImageUpload';
import { ArrowLeft, Sparkles, Camera, Target, Upload } from 'lucide-react';

export default function AnalyzePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [bareFaceImage, setBareFaceImage] = useState<File | null>(null);
  const [makeupImage, setMakeupImage] = useState<File | null>(null);
  const [referenceImage, setReferenceImage] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const steps = [
    {
      id: 'bare-face',
      title: '민낯 사진',
      description: '화장하지 않은 본인의 얼굴 사진을 업로드해주세요',
      completed: !!bareFaceImage
    },
    {
      id: 'makeup',
      title: '메이크업 사진',
      description: '메이크업을 한 후의 사진을 업로드해주세요',
      completed: !!makeupImage
    },
    {
      id: 'reference',
      title: '레퍼런스 사진',
      description: '목표로 하는 메이크업 스타일의 사진을 업로드해주세요',
      completed: !!referenceImage
    }
  ];

  const handleAnalyze = async () => {
    if (!bareFaceImage) {
      alert('민낯 사진을 먼저 업로드해주세요.');
      return;
    }

    console.log('AI 분석 시작 - 로딩 상태 설정');
    setIsAnalyzing(true);
    console.log('isAnalyzing 상태:', true);

    try {
      // 모든 이미지 업로드
      const uploadPromises = [];
      
      if (bareFaceImage) {
        const formData1 = new FormData();
        formData1.append('file', bareFaceImage);
        uploadPromises.push(
          fetch('/api/upload', { method: 'POST', body: formData1 })
            .then(res => res.json())
            .then(data => ({ type: 'bareFace', url: data.url }))
        );
      }
      
      if (makeupImage) {
        const formData2 = new FormData();
        formData2.append('file', makeupImage);
        uploadPromises.push(
          fetch('/api/upload', { method: 'POST', body: formData2 })
            .then(res => res.json())
            .then(data => ({ type: 'makeup', url: data.url }))
        );
      }
      
      if (referenceImage) {
        const formData3 = new FormData();
        formData3.append('file', referenceImage);
        uploadPromises.push(
          fetch('/api/upload', { method: 'POST', body: formData3 })
            .then(res => res.json())
            .then(data => ({ type: 'reference', url: data.url }))
        );
      }

      const uploadResults = await Promise.all(uploadPromises);
      console.log('모든 이미지 업로드 성공:', uploadResults);
      
      // 민낯 사진을 메인 분석 이미지로 사용
      const mainImageUrl = uploadResults.find(r => r.type === 'bareFace')?.url;

      // AI 분석 (민낯 사진으로 분석)
      const analysisResponse = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: mainImageUrl,
          userId: 'anonymous',
          styleId: null,
          additionalImages: {
            makeup: uploadResults.find(r => r.type === 'makeup')?.url,
            reference: uploadResults.find(r => r.type === 'reference')?.url
          }
        }),
      });

      if (analysisResponse.ok) {
        const result = await analysisResponse.json();
        console.log('AI 분석 완료:', result);
        
        // 분석 결과를 로컬 스토리지에 저장
        localStorage.setItem('analysisResult', JSON.stringify(result.analysis));
        
        // 결과 페이지로 이동
        router.push('/analyze/result');
      } else {
        const error = await analysisResponse.json();
        console.error('AI 분석 실패:', error);
        alert('AI 분석에 실패했습니다: ' + error.error);
      }
    } catch (error) {
      console.error('AI 분석 오류:', error);
      alert('AI 분석 중 오류가 발생했습니다.');
    } finally {
      console.log('AI 분석 완료 - 로딩 상태 해제');
      setIsAnalyzing(false);
      console.log('isAnalyzing 상태:', false);
    }
  };

  const isAllImagesUploaded = bareFaceImage && makeupImage && referenceImage;

  // 로딩 상태일 때 로딩 화면 표시
  console.log('렌더링 시 isAnalyzing 상태:', isAnalyzing);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center space-x-2 hover:bg-secondary/50 hover:scale-105 active:scale-95 transition-all duration-150"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>뒤로가기</span>
          </Button>
          
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-lg font-bold">AI 진단</span>
          </div>
          
          <div className="w-20" /> {/* Spacer */}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Progress Tracker */}
        <div className="mb-12">
          <ProgressTracker steps={steps} currentStep={currentStep} />
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              AI 메이크업 진단
            </h1>
            <p className="text-lg text-muted-foreground">
              사진을 업로드하고 AI가 맞춤형 피드백을 제공해드립니다
            </p>
          </div>

          {/* Image Upload Sections */}
          <div className="space-y-8">
            {/* Bare Face Image */}
            <Card className={currentStep === 0 ? 'ring-2 ring-primary' : ''}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Camera className="h-5 w-5" />
                  <span>1단계: 민낯 사진</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUpload
                  title="민낯 사진"
                  description="화장하지 않은 본인의 얼굴이 선명하게 보이는 사진을 업로드해주세요. 좋은 조명에서 정면을 바라보는 사진이 가장 정확한 분석이 가능합니다."
                  onImageSelect={setBareFaceImage}
                  selectedImage={bareFaceImage}
                  required
                />
              </CardContent>
            </Card>

            {/* Makeup Image */}
            <Card className={currentStep === 1 ? 'ring-2 ring-primary' : ''}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="h-5 w-5" />
                  <span>2단계: 메이크업 사진</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUpload
                  title="메이크업 사진"
                  description="메이크업을 완성한 후의 사진을 업로드해주세요. 민낯 사진과 동일한 각도와 조명에서 촬영하면 더 정확한 분석이 가능합니다."
                  onImageSelect={setMakeupImage}
                  selectedImage={makeupImage}
                  required
                />
              </CardContent>
            </Card>

            {/* Reference Image */}
            <Card className={currentStep === 2 ? 'ring-2 ring-primary' : ''}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>3단계: 레퍼런스 사진</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUpload
                  title="레퍼런스 사진"
                  description="목표로 하는 메이크업 스타일의 사진을 업로드해주세요. 유명인, 인플루언서, 또는 원하는 스타일의 메이크업 사진이면 됩니다."
                  onImageSelect={setReferenceImage}
                  selectedImage={referenceImage}
                  required
                />
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="px-8 py-3 hover:scale-105 active:scale-95 transition-all duration-150 hover:bg-secondary/50"
            >
              취소
            </Button>
            <Button
              onClick={handleAnalyze}
              disabled={!isAllImagesUploaded || isAnalyzing}
              className="lumina-button px-8 py-3 text-lg font-semibold hover:scale-110 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-2xl hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:brightness-100"
            >
              {isAnalyzing ? (
                <>
                  <Sparkles className="mr-2 h-5 w-5 animate-spin" />
                  AI 분석중...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  AI 분석 시작하기
                </>
              )}
            </Button>
          </div>

          {/* Tips */}
          <div className="mt-12 bg-secondary/50 rounded-lg p-6">
            <h3 className="font-semibold mb-4">📸 좋은 사진을 위한 팁</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• 자연광이 있는 곳에서 촬영하세요</li>
              <li>• 얼굴이 화면의 70% 이상을 차지하도록 촬영하세요</li>
              <li>• 정면을 바라보고 촬영하세요</li>
              <li>• 선명하고 흔들리지 않는 사진을 사용하세요</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Analysis Modal */}
      {isAnalyzing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4">
            <div className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-pink-400 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                <Sparkles className="h-8 w-8 text-white animate-spin" />
              </div>
              <h2 className="text-xl font-bold mb-2 text-gray-800">AI 분석중...</h2>
              <p className="text-gray-600 text-sm mb-4">잠시만 기다려주세요</p>
              <div className="flex justify-center space-x-1">
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
