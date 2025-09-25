import { NextRequest, NextResponse } from 'next/server';
import { analyzeFace, analyzeImageContent } from '@/lib/googleVision';
import { analysisService } from '@/lib/database';
import { generateMakeupAnalysis, generateOverallAnalysis } from '@/lib/gemini';

// AI 피드백 생성 함수 (임시 - 나중에 OpenAI로 대체)
function generateFeedback(faceAnalysis: any, imageContent: any, score: number): string {
  const feedbacks = [
    "매우 우수한 메이크업입니다!",
    "좋은 메이크업이지만 몇 가지 개선점이 있습니다.",
    "메이크업을 더 발전시킬 수 있는 부분들이 있습니다.",
    "기본적인 메이크업이 잘 되어있습니다."
  ];
  
  if (score >= 90) return feedbacks[0];
  if (score >= 70) return feedbacks[1];
  if (score >= 50) return feedbacks[2];
  return feedbacks[3];
}

// OpenAI를 사용한 고급 피드백 생성 함수
async function generateAdvancedFeedback(analyses: any[], score: number, mainImageUrl: string): Promise<any> {
  try {
    // Google API 키가 있는 경우 고급 피드백 생성
    if (process.env.GOOGLE_API_KEY) {
      console.log('Gemini를 사용한 고급 피드백 생성 시작');
      
      // Gemini가 점수를 계산하므로 기존 점수 계산 로직 제거
      
      // Vision AI 분석 결과 수집
      const visionAnalysis = {
        makeup: analyses.find(a => a.type === 'makeup'),
        bareFace: analyses.find(a => a.type === 'bareFace'),
        reference: analyses.find(a => a.type === 'reference')
      };

      // Gemini로 개별 분석 (점수 + 피드백)
      const [eyeAnalysis, baseAnalysis, lipAnalysis, overallAnalysis] = await Promise.all([
        generateMakeupAnalysis({ 
          imageUrl: mainImageUrl, 
          analysisType: 'eye',
          visionAnalysis: visionAnalysis.makeup
        }),
        generateMakeupAnalysis({ 
          imageUrl: mainImageUrl, 
          analysisType: 'base',
          visionAnalysis: visionAnalysis.makeup
        }),
        generateMakeupAnalysis({ 
          imageUrl: mainImageUrl, 
          analysisType: 'lip',
          visionAnalysis: visionAnalysis.makeup
        }),
        generateOverallAnalysis(mainImageUrl, visionAnalysis)
      ]);
      
      // Gemini에서 받은 점수와 피드백 사용
      const eyeScore = eyeAnalysis.score;
      const baseScore = baseAnalysis.score;
      const lipScore = lipAnalysis.score;
      const overallScore = overallAnalysis.score;
      
      // 전문가 팁은 Gemini에서 받은 개선사항 사용
      const expertTips = [
        ...eyeAnalysis.improvements || [],
        ...baseAnalysis.improvements || [],
        ...lipAnalysis.improvements || [],
        ...overallAnalysis.improvements || []
      ].slice(0, 3); // 최대 3개만 표시
      
      return {
        overallScore,
        eyeScore,
        baseScore,
        lipScore,
        eyeFeedback: eyeAnalysis.feedback,
        baseFeedback: baseAnalysis.feedback,
        lipFeedback: lipAnalysis.feedback,
        overallFeedback: overallAnalysis.feedback,
        expertTips,
        improvements: overallAnalysis.improvements || []
      };
    } else {
      // Google API 키가 없는 경우 기존 로직 사용
      console.log('Google API 키가 없어 기본 피드백 생성 사용');
      return generateComparativeFeedback(analyses, score);
    }
  } catch (error) {
      console.error('Gemini 피드백 생성 오류:', error);
    // 오류 발생 시 기존 로직으로 fallback
    return generateComparativeFeedback(analyses, score);
  }
}

// 비교 분석 기반 상세 피드백 생성 함수
function generateComparativeFeedback(analyses: any[], score: number): any {
  const bareFace = analyses.find(a => a.type === 'bareFace');
  const makeup = analyses.find(a => a.type === 'makeup');
  const reference = analyses.find(a => a.type === 'reference');
  
  // 각 영역별 점수 계산
  const eyeScore = calculateEyeScore(makeup, bareFace, reference);
  const baseScore = calculateBaseScore(makeup, bareFace, reference);
  const lipScore = calculateLipScore(makeup, bareFace, reference);
  
  // 각 영역별 피드백 생성
  const eyeFeedback = generateEyeFeedback(makeup, bareFace, reference);
  const baseFeedback = generateBaseFeedback(makeup, bareFace, reference);
  const lipFeedback = generateLipFeedback(makeup, bareFace, reference);
  
  // 전문가 팁 생성
  const expertTips = generateExpertTips(makeup, bareFace, reference);
  
  // 개선사항 생성
  const improvements = generateImprovements(eyeScore, baseScore, lipScore);
  
  return {
    overallScore: score,
    eyeScore,
    baseScore,
    lipScore,
    eyeFeedback,
    baseFeedback,
    lipFeedback,
    expertTips,
    improvements
  };
}

// 아이 메이크업 점수 계산
function calculateEyeScore(makeup: any, bareFace: any, reference: any): number {
  let score = 60; // 기본 점수 (60~100 범위)
  
  if (makeup?.imageContent?.labels) {
    const eyeLabels = makeup.imageContent.labels.filter((label: any) => 
      label.description.toLowerCase().includes('eyebrow') ||
      label.description.toLowerCase().includes('eyelash') ||
      label.description.toLowerCase().includes('eye shadow') ||
      label.description.toLowerCase().includes('eye') ||
      label.description.toLowerCase().includes('face')
    );
    
    if (eyeLabels.length > 0) {
      const avgScore = eyeLabels.reduce((sum: number, label: any) => sum + (label.score || 0), 0) / eyeLabels.length;
      score += Math.min(avgScore * 20, 20); // 최대 20점 보너스
    }
    
    // 얼굴 감지 보너스
    if (makeup?.faceAnalysis?.faceDetected) {
      score += 5;
    }
    
    // 얼굴 신뢰도 보너스
    if (makeup?.faceAnalysis?.faceAttributes?.confidence) {
      score += Math.min(makeup.faceAnalysis.faceAttributes.confidence * 5, 5);
    }
    
    // 얼굴 표정 분석 (기쁨, 놀람 등)
    if (makeup?.faceAnalysis?.faceAttributes) {
      const joy = makeup.faceAnalysis.faceAttributes.joy || 0;
      const surprise = makeup.faceAnalysis.faceAttributes.surprise || 0;
      score += (joy + surprise) * 3; // 표정 분석 보너스
    }
  }
  
  // 랜덤 요소 추가 (실제 분석 결과 기반)
  const randomFactor = Math.random() * 8 - 4; // -4 ~ +4
  score += randomFactor;
  
  // 60~100 범위로 제한
  return Math.min(Math.max(Math.round(score), 60), 100);
}

// 베이스 메이크업 점수 계산
function calculateBaseScore(makeup: any, bareFace: any, reference: any): number {
  let score = 60; // 기본 점수 (60~100 범위)
  
  if (makeup?.imageContent?.labels) {
    const baseLabels = makeup.imageContent.labels.filter((label: any) => 
      label.description.toLowerCase().includes('cosmetic') ||
      label.description.toLowerCase().includes('makeup') ||
      label.description.toLowerCase().includes('face') ||
      label.description.toLowerCase().includes('person')
    );
    
    if (baseLabels.length > 0) {
      const avgScore = baseLabels.reduce((sum: number, label: any) => sum + (label.score || 0), 0) / baseLabels.length;
      score += Math.min(avgScore * 15, 15); // 최대 15점 보너스
    }
    
    // 얼굴 감지 보너스
    if (makeup?.faceAnalysis?.faceDetected) {
      score += 5;
    }
    
    // 얼굴 신뢰도 보너스
    if (makeup?.faceAnalysis?.faceAttributes?.confidence) {
      score += Math.min(makeup.faceAnalysis.faceAttributes.confidence * 5, 5);
    }
  }
  
  // 랜덤 요소 추가
  const randomFactor = Math.random() * 6 - 3; // -3 ~ +3
  score += randomFactor;
  
  // 60~100 범위로 제한
  return Math.min(Math.max(Math.round(score), 60), 100);
}

// 립 메이크업 점수 계산
function calculateLipScore(makeup: any, bareFace: any, reference: any): number {
  let score = 60; // 기본 점수 (60~100 범위)
  
  if (makeup?.imageContent?.labels) {
    const lipLabels = makeup.imageContent.labels.filter((label: any) => 
      label.description.toLowerCase().includes('lip') ||
      label.description.toLowerCase().includes('lipstick') ||
      label.description.toLowerCase().includes('mouth') ||
      label.description.toLowerCase().includes('face')
    );
    
    if (lipLabels.length > 0) {
      const avgScore = lipLabels.reduce((sum: number, label: any) => sum + (label.score || 0), 0) / lipLabels.length;
      score += Math.min(avgScore * 15, 15); // 최대 15점 보너스
    }
    
    // 얼굴 감지 보너스
    if (makeup?.faceAnalysis?.faceDetected) {
      score += 5;
    }
    
    // 얼굴 신뢰도 보너스
    if (makeup?.faceAnalysis?.faceAttributes?.confidence) {
      score += Math.min(makeup.faceAnalysis.faceAttributes.confidence * 5, 5);
    }
  }
  
  // 랜덤 요소 추가
  const randomFactor = Math.random() * 6 - 3; // -3 ~ +3
  score += randomFactor;
  
  // 60~100 범위로 제한
  return Math.min(Math.max(Math.round(score), 60), 100);
}

// 아이 메이크업 피드백 생성
function generateEyeFeedback(makeup: any, bareFace: any, reference: any): string {
  if (!makeup) return "메이크업 사진이 필요합니다.";
  
  const eyeLabels = makeup.imageContent?.labels?.filter((label: any) => 
    label.description.toLowerCase().includes('eyebrow') ||
    label.description.toLowerCase().includes('eyelash') ||
    label.description.toLowerCase().includes('eye') ||
    label.description.toLowerCase().includes('face')
  ) || [];
  
  // 얼굴 감지 여부
  const faceDetected = makeup.faceAnalysis?.faceDetected;
  const confidence = makeup.faceAnalysis?.faceAttributes?.confidence || 0;
  
  // 라벨 분석 결과
  const hasEyeLabels = eyeLabels.length > 0;
  const avgLabelScore = hasEyeLabels ? 
    eyeLabels.reduce((sum: number, label: any) => sum + (label.score || 0), 0) / eyeLabels.length : 0;
  
  // 동적 피드백 생성
  if (!faceDetected) {
    return "얼굴이 명확하게 보이지 않습니다. 더 선명한 사진으로 다시 촬영해주세요.";
  }
  
  if (confidence < 0.5) {
    return "얼굴 인식이 어려워 정확한 분석이 어렵습니다. 정면을 바라보는 사진을 사용해주세요.";
  }
  
  if (!hasEyeLabels) {
    return "아이 메이크업이 감지되지 않습니다. 아이섀도나 마스카라를 사용해보세요.";
  }
  
  // 실제 분석 결과를 기반으로 한 개인화된 피드백
  const detectedLabels = eyeLabels.map((label: any) => label.description).join(', ');
  const joyLevel = makeup.faceAnalysis?.faceAttributes?.joy || 0;
  const surpriseLevel = makeup.faceAnalysis?.faceAttributes?.surprise || 0;
  
  // 라벨 점수에 따른 피드백
  if (avgLabelScore > 0.8) {
    if (joyLevel > 0.7) {
      return `아이 메이크업이 매우 잘 되어있습니다! 밝은 표정과 함께 자연스러운 그라데이션이 돋보입니다. 감지된 요소: ${detectedLabels}`;
    } else {
      return `완벽한 아이 메이크업입니다! 블렌딩이 매우 자연스럽고 전문적입니다. 감지된 요소: ${detectedLabels}`;
    }
  } else if (avgLabelScore > 0.6) {
    if (confidence < 0.7) {
      return `아이 메이크업이 좋습니다. 하지만 얼굴 인식이 약간 어려워 정확한 분석이 제한적입니다. 더 선명한 사진으로 다시 촬영해보세요.`;
    } else {
      return `아이 메이크업이 양호합니다. 색상 전환을 더 부드럽게 하고 블렌딩을 개선해보세요. 감지된 요소: ${detectedLabels}`;
    }
  } else {
    if (eyeLabels.length === 0) {
      return `아이 메이크업이 감지되지 않습니다. 아이섀도, 마스카라, 아이브로우 제품을 사용해보세요.`;
    } else {
      return `아이 메이크업 개선이 필요합니다. 현재 감지된 요소: ${detectedLabels}. 웜톤 브라운 계열의 아이섀도를 사용하고 마스카라를 활용해보세요.`;
    }
  }
}

// 베이스 메이크업 피드백 생성
function generateBaseFeedback(makeup: any, bareFace: any, reference: any): string {
  if (!makeup) return "메이크업 사진이 필요합니다.";
  
  const baseLabels = makeup.imageContent?.labels?.filter((label: any) => 
    label.description.toLowerCase().includes('cosmetic') ||
    label.description.toLowerCase().includes('makeup') ||
    label.description.toLowerCase().includes('face') ||
    label.description.toLowerCase().includes('person')
  ) || [];
  
  // 얼굴 감지 여부
  const faceDetected = makeup.faceAnalysis?.faceDetected;
  const confidence = makeup.faceAnalysis?.faceAttributes?.confidence || 0;
  
  // 라벨 분석 결과
  const hasBaseLabels = baseLabels.length > 0;
  const avgLabelScore = hasBaseLabels ? 
    baseLabels.reduce((sum: number, label: any) => sum + (label.score || 0), 0) / baseLabels.length : 0;
  
  // 동적 피드백 생성
  if (!faceDetected) {
    return "얼굴이 명확하게 보이지 않습니다. 더 선명한 사진으로 다시 촬영해주세요.";
  }
  
  if (confidence < 0.5) {
    return "얼굴 인식이 어려워 정확한 분석이 어렵습니다. 정면을 바라보는 사진을 사용해주세요.";
  }
  
  if (!hasBaseLabels) {
    return "베이스 메이크업이 감지되지 않습니다. 파운데이션과 컨실러를 사용해보세요.";
  }
  
  // 라벨 점수에 따른 피드백
  if (avgLabelScore > 0.8) {
    const compliments = [
      "베이스 메이크업이 매우 잘 되어있습니다! 피부 톤이 자연스럽게 매칭되었습니다.",
      "완벽한 베이스 메이크업입니다! 피부 질감이 매우 자연스럽습니다.",
      "베이스 메이크업이 훌륭합니다! 컨실러와 파운데이션의 조화가 완벽합니다."
    ];
    return compliments[Math.floor(Math.random() * compliments.length)];
  } else if (avgLabelScore > 0.6) {
    const suggestions = [
      "베이스 메이크업이 좋습니다. 피부 톤에 맞는 파운데이션을 선택하세요.",
      "베이스 메이크업이 양호합니다. 컨실러 블렌딩을 더 자연스럽게 해보세요.",
      "베이스 메이크업이 괜찮습니다. 프라이머 사용으로 지속력을 높여보세요."
    ];
    return suggestions[Math.floor(Math.random() * suggestions.length)];
  } else {
    const improvements = [
      "베이스 메이크업 개선이 필요합니다. 파운데이션과 컨실러를 활용해보세요.",
      "베이스 메이크업을 더 발전시킬 수 있습니다. 피부 톤에 맞는 색상을 선택하세요.",
      "베이스 메이크업이 부족합니다. 프라이머를 먼저 발라 지속력을 높여보세요."
    ];
    return improvements[Math.floor(Math.random() * improvements.length)];
  }
}

// 립 메이크업 피드백 생성
function generateLipFeedback(makeup: any, bareFace: any, reference: any): string {
  if (!makeup) return "메이크업 사진이 필요합니다.";
  
  const lipLabels = makeup.imageContent?.labels?.filter((label: any) => 
    label.description.toLowerCase().includes('lip') ||
    label.description.toLowerCase().includes('lipstick') ||
    label.description.toLowerCase().includes('mouth') ||
    label.description.toLowerCase().includes('face')
  ) || [];
  
  // 얼굴 감지 여부
  const faceDetected = makeup.faceAnalysis?.faceDetected;
  const confidence = makeup.faceAnalysis?.faceAttributes?.confidence || 0;
  
  // 라벨 분석 결과
  const hasLipLabels = lipLabels.length > 0;
  const avgLabelScore = hasLipLabels ? 
    lipLabels.reduce((sum: number, label: any) => sum + (label.score || 0), 0) / lipLabels.length : 0;
  
  // 동적 피드백 생성
  if (!faceDetected) {
    return "얼굴이 명확하게 보이지 않습니다. 더 선명한 사진으로 다시 촬영해주세요.";
  }
  
  if (confidence < 0.5) {
    return "얼굴 인식이 어려워 정확한 분석이 어렵습니다. 정면을 바라보는 사진을 사용해주세요.";
  }
  
  if (!hasLipLabels) {
    return "립 메이크업이 감지되지 않습니다. 립스틱과 립라이너를 사용해보세요.";
  }
  
  // 라벨 점수에 따른 피드백
  if (avgLabelScore > 0.8) {
    const compliments = [
      "립 메이크업이 매우 잘 되어있습니다! 입술 라인이 또렷하고 색상이 선명합니다.",
      "완벽한 립 메이크업입니다! 립스틱과 립라이너의 조화가 완벽합니다.",
      "립 메이크업이 훌륭합니다! 입술 모양이 매우 아름답게 연출되었습니다."
    ];
    return compliments[Math.floor(Math.random() * compliments.length)];
  } else if (avgLabelScore > 0.6) {
    const suggestions = [
      "립 메이크업이 좋습니다. 립라이너를 사용하면 더욱 또렷한 입술 라인을 연출할 수 있습니다.",
      "립 메이크업이 양호합니다. 립스틱 발색을 더 진하게 해보세요.",
      "립 메이크업이 괜찮습니다. 립 글로스를 사용해 입술에 윤기를 더해보세요."
    ];
    return suggestions[Math.floor(Math.random() * suggestions.length)];
  } else {
    const improvements = [
      "립 메이크업 개선이 필요합니다. 립스틱과 립라이너를 활용해보세요.",
      "립 메이크업을 더 발전시킬 수 있습니다. 입술 각질을 먼저 제거해보세요.",
      "립 메이크업이 부족합니다. 립 프라이머를 사용해 지속력을 높여보세요."
    ];
    return improvements[Math.floor(Math.random() * improvements.length)];
  }
}

// 전문가 팁 생성
function generateExpertTips(makeup: any, bareFace: any, reference: any): string[] {
  const tips = [
    "메이크업 전 충분한 보습은 필수! 프라이머 사용으로 지속력을 높여보세요.",
    "브러시 대신 뷰티블렌더를 사용하면 더 자연스러운 베이스 연출이 가능합니다.",
    "아이섀도 발색을 높이려면 아이섀도 베이스를 먼저 발라주세요.",
    "립 메이크업 전 입술 각질을 제거하면 더 오래 지속됩니다.",
    "파운데이션은 얼굴 중심부터 발라 바깥쪽으로 블렌딩하세요.",
    "마스카라는 뿌리부터 끝까지 Z자 모양으로 발라주세요.",
    "아이섀도는 밝은 색부터 어두운 색 순서로 발라주세요.",
    "컨실러는 파운데이션보다 한 톤 밝은 색을 선택하세요.",
    "립스틱은 립라이너로 테두리를 먼저 그려주세요.",
    "메이크업 완성 후 스프레이로 고정하면 더 오래 지속됩니다."
  ];
  
  // 랜덤하게 3개 선택
  const shuffled = tips.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3);
}

// 개선사항 생성
function generateImprovements(eyeScore: number, baseScore: number, lipScore: number): any[] {
  const improvements = [];
  
  if (eyeScore < 80) {
    improvements.push({
      category: "아이 메이크업",
      priority: "high",
      suggestion: "아이섀도 블렌딩 개선"
    });
  }
  
  if (baseScore < 75) {
    improvements.push({
      category: "베이스 메이크업",
      priority: "medium",
      suggestion: "파운데이션 톤 조정"
    });
  }
  
  if (lipScore < 85) {
    improvements.push({
      category: "립 메이크업",
      priority: "low",
      suggestion: "립라이너 활용"
    });
  }
  
  return improvements;
}

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, userId, styleId, additionalImages } = await request.json();
    
    console.log('AI 분석 시작:', { imageUrl, userId, styleId, additionalImages });

    // 모든 이미지 분석
    const analyses = [];
    
    // 1. 민낯 사진 분석
    const bareFaceAnalysis = await analyzeFace(imageUrl);
    const bareFaceContent = await analyzeImageContent(imageUrl);
    analyses.push({ type: 'bareFace', faceAnalysis: bareFaceAnalysis, imageContent: bareFaceContent });
    console.log('민낯 사진 분석 완료');

    // 2. 메이크업 사진 분석 (있는 경우)
    if (additionalImages?.makeup) {
      const makeupAnalysis = await analyzeFace(additionalImages.makeup);
      const makeupContent = await analyzeImageContent(additionalImages.makeup);
      analyses.push({ type: 'makeup', faceAnalysis: makeupAnalysis, imageContent: makeupContent });
      console.log('메이크업 사진 분석 완료');
    }

    // 3. 레퍼런스 사진 분석 (있는 경우)
    if (additionalImages?.reference) {
      const referenceAnalysis = await analyzeFace(additionalImages.reference);
      const referenceContent = await analyzeImageContent(additionalImages.reference);
      analyses.push({ type: 'reference', faceAnalysis: referenceAnalysis, imageContent: referenceContent });
      console.log('레퍼런스 사진 분석 완료');
    }

    console.log('모든 이미지 분석 완료:', analyses.length, '개');

    // 고급 피드백 생성 (OpenAI 사용 가능 시)
    const detailedFeedback = await generateAdvancedFeedback(analyses, 0, imageUrl);
    
    // 세부 점수들의 평균으로 전체 점수 계산
    const scores = [detailedFeedback.eyeScore, detailedFeedback.baseScore, detailedFeedback.lipScore];
    const validScores = scores.filter(score => score > 0);
    const overallScore = validScores.length > 0 
      ? Math.round(validScores.reduce((sum, score) => sum + score, 0) / validScores.length)
      : 50; // 기본 점수
    
    console.log('세부 점수들:', { eyeScore: detailedFeedback.eyeScore, baseScore: detailedFeedback.baseScore, lipScore: detailedFeedback.lipScore });
    console.log('계산된 전체 점수:', overallScore);

    // 상세 피드백에 전체 점수 업데이트
    detailedFeedback.overallScore = overallScore;
    console.log('생성된 상세 피드백:', detailedFeedback);

    // 분석 결과를 데이터베이스에 저장
    const analysis = await analysisService.createAnalysis({
      userId: userId || 'anonymous',
      styleId: styleId || undefined,
      imageUrl,
      score: overallScore,
      feedback: detailedFeedback.eyeFeedback, // 대표 피드백
      details: {
        analyses, // 모든 이미지 분석 결과
        detailedFeedback, // 상세 피드백 정보
        timestamp: new Date().toISOString()
      }
    });

    console.log('분석 결과 저장 완료:', analysis.id);

    return NextResponse.json({
      success: true,
      analysis: {
        id: analysis.id,
        score: overallScore,
        feedback: detailedFeedback.eyeFeedback,
        details: {
          analyses, // 모든 이미지 분석 결과
          detailedFeedback, // 상세 피드백 정보
          timestamp: new Date().toISOString()
        }
      }
    });

  } catch (error) {
    console.error('AI 분석 오류:', error);
    return NextResponse.json(
      { error: 'AI 분석 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
