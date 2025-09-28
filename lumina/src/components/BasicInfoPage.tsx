'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { BasicInfo } from '@/components/BasicInfoSelector';

// 드롭다운 및 체크박스 옵션 데이터
const faceShapeOptions = ['둥근형', '긴 얼굴형', '각진형(사각형)', '계란형', '하트형'];
const personalColorOptions = ['봄 웜', '여름 쿨', '가을 웜', '겨울 쿨'];
const eyeShapeOptions = ['무쌍', '속쌍', '겉쌍'];
const eyeSizeOptions = ['크다', '작다', '보통'];
const eyeDirectionOptions = ['올라감', '내려감', '중립'];
const eyeDepthOptions = ['돌출', '들어감', '보통'];
const preferredStyleOptions = ['데일리', '화사한', '시크한', '청순한', '섹시한', '트렌디한'];

export default function BasicInfoPage() {
  const router = useRouter();
  const [info, setInfo] = useState<BasicInfo>({
    faceShape: '',
    personalColor: '',
    eyeShape: '',
    eyeSize: '',
    eyeDirection: '',
    eyeDepth: '',
    preferredStyle: [],
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleStyleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setInfo(prev => ({
      ...prev,
      preferredStyle: checked
        ? [...prev.preferredStyle, value]
        : prev.preferredStyle.filter(style => style !== value),
    }));
  };

  const isFormValid =
    info.faceShape &&
    info.personalColor &&
    info.eyeShape &&
    info.eyeSize &&
    info.eyeDirection &&
    info.eyeDepth;

  const handleConfirm = () => {
    const query = new URLSearchParams(Object.entries(info).filter(([, value]) => value !== '')).toString();
    router.push(`/analyze?${query}`);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center py-12">
      <Header />
      <main className="w-full max-w-2xl px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="lumina-text-gradient">AI 진단을 위한</span>
            <br />
            <span className="text-foreground">기본 정보 입력</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
            더욱 정확하고 개인화된 피드백을 위해, 당신의 특징을 알려주세요.
          </p>
        </div>

        {/* Input Form */}
        <div className="bg-card p-6 md:p-8 rounded-lg shadow-lg">
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* 얼굴형 */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">얼굴형</label>
                <select
                  name="faceShape"
                  value={info.faceShape}
                  onChange={handleChange}
                  className="w-full p-2 border border-border rounded-md bg-background"
                >
                  <option value="">선택</option>
                  {faceShapeOptions.map(option => <option key={option} value={option}>{option}</option>)}
                </select>
              </div>

              {/* 퍼스널 컬러 */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">퍼스널 컬러</label>
                <select
                  name="personalColor"
                  value={info.personalColor}
                  onChange={handleChange}
                  className="w-full p-2 border border-border rounded-md bg-background"
                >
                  <option value="">선택</option>
                  {personalColorOptions.map(option => <option key={option} value={option}>{option}</option>)}
                </select>
              </div>
            </div>

            {/* 눈 특징 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">눈꺼풀</label>
                <select name="eyeShape" value={info.eyeShape} onChange={handleChange} className="w-full p-2 border border-border rounded-md bg-background">
                  <option value="">선택</option>
                  {eyeShapeOptions.map(option => <option key={option} value={option}>{option}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">눈 크기</label>
                <select name="eyeSize" value={info.eyeSize} onChange={handleChange} className="w-full p-2 border border-border rounded-md bg-background">
                  <option value="">선택</option>
                  {eyeSizeOptions.map(option => <option key={option} value={option}>{option}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">눈매 방향</label>
                <select name="eyeDirection" value={info.eyeDirection} onChange={handleChange} className="w-full p-2 border border-border rounded-md bg-background">
                  <option value="">선택</option>
                  {eyeDirectionOptions.map(option => <option key={option} value={option}>{option}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">눈 입체감</label>
                <select name="eyeDepth" value={info.eyeDepth} onChange={handleChange} className="w-full p-2 border border-border rounded-md bg-background">
                  <option value="">선택</option>
                  {eyeDepthOptions.map(option => <option key={option} value={option}>{option}</option>)}
                </select>
              </div>
            </div>

            {/* 선호 스타일 */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">선호하는 화장 스타일 (복수 선택 가능)</label>
              <div className="flex flex-wrap gap-2">
                {preferredStyleOptions.map(option => (
                  <label key={option} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      value={option}
                      checked={info.preferredStyle.includes(option)}
                      onChange={handleStyleChange}
                      className="form-checkbox h-4 w-4 text-primary rounded-md focus:ring-primary"
                    />
                    <span className="text-sm text-foreground">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-8 text-center">
          <Button
            onClick={handleConfirm}
            size="lg"
            className="w-full md:w-auto bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-4 text-lg font-semibold rounded-full shadow-lg transition-all duration-200 disabled:bg-gray-400"
            disabled={!isFormValid}
          >
            다음 단계로
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </main>
    </div>
  );
}