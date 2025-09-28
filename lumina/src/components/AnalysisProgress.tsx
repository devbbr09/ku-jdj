'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Eye, Palette, Target, Brain, CheckCircle, Loader2 } from 'lucide-react';

interface AnalysisStep {
  step: number;
  message: string;
  progress: number;
  icon: React.ReactNode;
  description: string;
}

interface AnalysisProgressProps {
  isVisible: boolean;
}

export default function AnalysisProgress({ isVisible }: AnalysisProgressProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const analysisSteps: AnalysisStep[] = [
    { 
      step: 1, 
      message: "업로드된 이미지를 확인하고 있습니다", 
      progress: 10,
      icon: <Sparkles className="h-5 w-5" />,
      description: "이미지 품질과 해상도를 검토합니다"
    },
    { 
      step: 2, 
      message: "민낯 사진을 분석하고 있습니다", 
      progress: 20,
      icon: <Eye className="h-5 w-5" />,
      description: "얼굴 구조와 피부 톤을 분석합니다"
    },
    { 
      step: 3, 
      message: "메이크업 사진을 분석하고 있습니다", 
      progress: 35,
      icon: <Palette className="h-5 w-5" />,
      description: "메이크업 기법과 색감을 평가합니다"
    },
    { 
      step: 4, 
      message: "참고 이미지와 대조하고 있습니다", 
      progress: 50,
      icon: <Target className="h-5 w-5" />,
      description: "목표 스타일과 현재 메이크업을 비교합니다"
    },
    { 
      step: 5, 
      message: "아이 메이크업을 평가하고 있습니다", 
      progress: 65,
      icon: <Brain className="h-5 w-5" />,
      description: "아이섀도와 마스카라를 상세 분석합니다"
    },
    { 
      step: 6, 
      message: "베이스 메이크업을 평가하고 있습니다", 
      progress: 75,
      icon: <Brain className="h-5 w-5" />,
      description: "파운데이션과 컨실러를 검토합니다"
    },
    { 
      step: 7, 
      message: "립 메이크업을 평가하고 있습니다", 
      progress: 85,
      icon: <Brain className="h-5 w-5" />,
      description: "립스틱과 립라이너를 분석합니다"
    },
    { 
      step: 8, 
      message: "분석 결과를 정리하고 있습니다", 
      progress: 100,
      icon: <Sparkles className="h-5 w-5" />,
      description: "맞춤형 피드백을 생성합니다"
    }
  ];

  useEffect(() => {
    if (!isVisible) {
      setCurrentStep(0);
      setProgress(0);
      return;
    }

    let stepIndex = 0;
    let timeoutId: NodeJS.Timeout;

    const runSteps = () => {
      if (stepIndex >= analysisSteps.length) {
        console.log('All steps completed');
        return;
      }

      const step = analysisSteps[stepIndex];
      console.log(`Running step ${stepIndex + 1}: ${step.message}`);
      
      // 현재 단계로 설정
      setCurrentStep(stepIndex);
      setProgress(step.progress);
      
      // 3초~4초 사이 랜덤 대기 후 다음 단계로
      const delay = 3000 + Math.random() * 1000;
      console.log(`Waiting ${delay}ms before next step`);
      
      timeoutId = setTimeout(() => {
        stepIndex++;
        runSteps();
      }, delay);
    };

    // 첫 번째 단계 시작
    runSteps();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4">
        <div className="p-8" style={{ backgroundColor: '#FFFFF0' }}>
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: '#FADADD' }}>
              {currentStep < analysisSteps.length ? (
                <Loader2 className="h-8 w-8 text-white animate-spin" />
              ) : (
                <CheckCircle className="h-8 w-8 text-white" />
              )}
            </div>
            <h2 className="text-xl font-bold mb-2" style={{ color: '#8B4B6B' }}>
              {currentStep < analysisSteps.length ? 'AI 분석중...' : '분석 완료!'}
            </h2>
            <p className="text-sm" style={{ color: '#A67B8B' }}>
              {currentStep < analysisSteps.length 
                ? analysisSteps[currentStep]?.message 
                : '모든 분석이 완료되었습니다'
              }
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="w-full rounded-full h-3 mb-4" style={{ backgroundColor: '#E8D5D8' }}>
              <div 
                className="h-3 rounded-full transition-all duration-500 ease-out"
                style={{ 
                  width: `${progress}%`,
                  backgroundColor: '#FADADD'
                }}
              />
            </div>
            <div className="flex justify-between text-sm" style={{ color: '#8B4B6B' }}>
              <span>진행률</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>

          {/* Current Step Display */}
          <div className="mb-6">
            <div className="rounded-xl p-6 text-center" style={{ backgroundColor: '#FADADD', border: '1px solid #E8D5D8' }}>
              <div className="flex items-center justify-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#8B4B6B' }}>
                  {currentStep < analysisSteps.length ? (
                    <Loader2 className="h-5 w-5 text-white animate-spin" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-white" />
                  )}
                </div>
                <div className="text-left">
                  <h3 className="font-semibold" style={{ color: '#8B4B6B' }}>
                    {currentStep < analysisSteps.length 
                      ? `단계 ${currentStep + 1}/8` 
                      : '분석 완료!'
                    }
                  </h3>
                  <p className="text-sm" style={{ color: '#A67B8B' }}>
                    {currentStep < analysisSteps.length 
                      ? analysisSteps[currentStep]?.message 
                      : '모든 분석이 완료되었습니다'
                    }
                  </p>
                  {currentStep < analysisSteps.length && (
                    <p className="text-xs mt-1" style={{ color: '#8B4B6B' }}>
                      {analysisSteps[currentStep]?.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Completed Steps Summary */}
          {currentStep > 0 && (
            <div className="mb-4">
              <div className="flex items-center justify-center space-x-2 text-sm" style={{ color: '#8B4B6B' }}>
                <CheckCircle className="h-4 w-4" />
                <span>{currentStep}개 단계 완료</span>
              </div>
            </div>
          )}

          {/* Steps Overview */}
          <div className="grid grid-cols-4 gap-2">
            {analysisSteps.map((step, index) => (
              <div 
                key={step.step}
                className="flex flex-col items-center p-2 rounded-lg transition-all duration-300"
                style={{
                  backgroundColor: index < currentStep 
                    ? '#E8D5D8' 
                    : index === currentStep 
                    ? '#FADADD' 
                    : '#F5F5F5',
                  color: index < currentStep 
                    ? '#8B4B6B' 
                    : index === currentStep 
                    ? '#8B4B6B' 
                    : '#A67B8B'
                }}
              >
                <div 
                  className="w-6 h-6 rounded-full flex items-center justify-center mb-1 transition-all duration-300"
                  style={{
                    backgroundColor: index < currentStep 
                      ? '#8B4B6B' 
                      : index === currentStep 
                      ? '#8B4B6B' 
                      : '#D4C4C8',
                    color: 'white'
                  }}
                >
                  {index < currentStep ? (
                    <CheckCircle className="h-3 w-3" />
                  ) : index === currentStep ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <span className="text-xs font-medium">{step.step}</span>
                  )}
                </div>
                <span className="text-xs text-center leading-tight">
                  {step.step}
                </span>
              </div>
            ))}
          </div>

          {/* Loading Animation */}
          <div className="mt-6 text-center">
            <div className="flex justify-center space-x-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{
                    backgroundColor: '#FADADD',
                    animationDelay: `${i * 0.2}s`,
                    animationDuration: '1s'
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
