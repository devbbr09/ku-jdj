'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Brain, Eye, Palette, MessageCircle } from 'lucide-react';

interface LoadingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  duration: number;
}

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const steps: LoadingStep[] = [
    {
      id: 'upload',
      title: '이미지 업로드 중...',
      description: '업로드된 이미지를 처리하고 있습니다',
      icon: <Sparkles className="h-8 w-8" />,
      duration: 2000
    },
    {
      id: 'face-detection',
      title: '얼굴 특징 분석 중...',
      description: 'AI가 얼굴의 구조와 특징을 분석하고 있습니다',
      icon: <Brain className="h-8 w-8" />,
      duration: 3000
    },
    {
      id: 'makeup-analysis',
      title: '메이크업 포인트 도출 중...',
      description: '아이, 베이스, 립 메이크업을 분석하고 있습니다',
      icon: <Eye className="h-8 w-8" />,
      duration: 2500
    },
    {
      id: 'style-comparison',
      title: '스타일 비교 분석 중...',
      description: '레퍼런스와 현재 메이크업을 비교하고 있습니다',
      icon: <Palette className="h-8 w-8" />,
      duration: 2000
    },
    {
      id: 'feedback-generation',
      title: '맞춤형 피드백 생성 중...',
      description: '개인별 맞춤형 개선사항을 생성하고 있습니다',
      icon: <MessageCircle className="h-8 w-8" />,
      duration: 1500
    }
  ];

  useEffect(() => {
    const totalDuration = steps.reduce((sum, step) => sum + step.duration, 0);
    const stepDuration = 100; // Update progress every 100ms
    const totalSteps = totalDuration / stepDuration;

    let currentStepIndex = 0;
    let currentProgress = 0;
    let currentStepStartTime = 0;

    const interval = setInterval(() => {
      currentProgress += stepDuration;
      
      // Check if we should move to next step
      if (currentProgress >= currentStepStartTime + steps[currentStepIndex].duration) {
        currentStepIndex++;
        currentStepStartTime = currentProgress;
        
        if (currentStepIndex < steps.length) {
          setCurrentStep(currentStepIndex);
        }
      }

      // Update progress (0-100)
      const newProgress = Math.min((currentProgress / totalDuration) * 100, 100);
      setProgress(newProgress);

      // Complete when all steps are done
      if (currentProgress >= totalDuration) {
        clearInterval(interval);
        setTimeout(onComplete, 500);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center px-4">
        {/* Main Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full lumina-gradient flex items-center justify-center">
            {steps[currentStep]?.icon}
          </div>
        </div>

        {/* Current Step */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">
            {steps[currentStep]?.title}
          </h2>
          <p className="text-muted-foreground">
            {steps[currentStep]?.description}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full bg-muted rounded-full h-2 mb-4">
            <div 
              className="lumina-gradient h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>진행률</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Steps List */}
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div 
              key={step.id}
              className={`
                flex items-center space-x-3 p-3 rounded-lg transition-colors
                ${index < currentStep 
                  ? 'bg-green-50 text-green-700' 
                  : index === currentStep 
                  ? 'bg-primary/10 text-primary' 
                  : 'bg-muted/50 text-muted-foreground'
                }
              `}
            >
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center
                ${index < currentStep 
                  ? 'bg-green-500 text-white' 
                  : index === currentStep 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
                }
              `}>
                {index < currentStep ? (
                  <span className="text-sm">✓</span>
                ) : (
                  <span className="text-sm">{index + 1}</span>
                )}
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium">{step.title}</p>
                <p className="text-sm opacity-75">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Loading Animation */}
        <div className="mt-8">
          <div className="flex justify-center space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-primary rounded-full animate-pulse"
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '1s'
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
