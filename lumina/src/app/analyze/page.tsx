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

  const handleAnalyze = () => {
    // TODO: AI 분석 로직 구현
    console.log('AI 분석 시작:', { bareFaceImage, makeupImage, referenceImage });
    router.push('/analyze/result');
  };

  const isAllImagesUploaded = bareFaceImage && makeupImage && referenceImage;

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
              className="px-8 py-3"
            >
              취소
            </Button>
            <Button
              onClick={handleAnalyze}
              disabled={!isAllImagesUploaded}
              className="lumina-button px-8 py-3 text-lg font-semibold"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              AI 분석 시작하기
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
    </div>
  );
}
