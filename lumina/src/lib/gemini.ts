import { GoogleGenerativeAI, Part } from '@google/generative-ai';
import { analyzeImage, VisionAnalysisResult } from './googleVision';

// 환경 변수 검증
const apiKey = process.env.GOOGLE_API_KEY;
if (!apiKey) {
    throw new Error("환경 변수 GOOGLE_API_KEY가 정의되지 않았습니다.");
}
const genAI = new GoogleGenerativeAI(apiKey);

// 이미지를 Base64로 변환하는 헬퍼 함수
async function fetchImageAsBase64(imageUrl: string): Promise<string> {
  try {
    const response = await fetch(imageUrl);
    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    return base64;
  } catch (error) {
    console.error('이미지 변환 오류:', error);
    throw new Error('이미지를 처리할 수 없습니다.');
  }
}

// API 호출 및 JSON 파싱을 담당하는 공통 함수
async function callGeminiApi(
  model: any,
  systemPrompt: string,
  userPrompt: string,
  images: Part[]
): Promise<any> {
  const result = await model.generateContent([...images, userPrompt]);
  const response = await result.response;
  const text = await response.text();

  try {
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
    const jsonText = jsonMatch ? jsonMatch[1] : text;
    const parsed = JSON.parse(jsonText);

    if (!parsed.score || parsed.score < 60 || parsed.score > 100) {
      throw new Error('Gemini가 유효한 점수를 제공하지 않았습니다.');
    }
    
    return parsed;
  } catch (parseError) {
    console.error('JSON 파싱 오류:', parseError);
    console.error('원본 텍스트:', text);
    throw new Error('AI 피드백 생성에 실패했습니다. 유효한 JSON 형식이 아닙니다.');
  }
}

export interface MakeupAnalysisPrompt {
  barefaceImageUrl?: string; // 민낯 사진 (필수)
  makeupImageUrl: string; // 메이크업 후 사진 (필수)
  referenceImageUrl?: string; // 레퍼런스 사진 (필수)
  analysisType: 'eye' | 'base' | 'lip' | 'overall';
}

export interface MakeupAnalysisResult {
  score: number;
  feedback: string;
  improvements?: string[];
  strengths?: string[];
}

/**
 * 사용자의 메이크업 사진을 분석하고 피드백을 생성합니다.
 * @param prompt 메이크업 사진 정보와 분석 유형
 * @returns 분석 결과 객체
 */
export async function generateMakeupAnalysis(prompt: MakeupAnalysisPrompt): Promise<MakeupAnalysisResult> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // 세 가지 이미지 모두 필수 입력
    if (!prompt.barefaceImageUrl || !prompt.makeupImageUrl || !prompt.referenceImageUrl) {
      throw new Error("모든 필수 이미지가 제공되지 않았습니다.");
    }

    // Vision AI 호출하여 메타데이터 추출
    let visionAnalysis: VisionAnalysisResult | undefined;
    visionAnalysis = await analyzeImage(prompt.makeupImageUrl);
    
    // 이미지 Part 객체와 설명을 동적으로 생성
    const images: Part[] = [];
    let imageDescriptions = '';

    images.push({
      inlineData: {
        data: await fetchImageAsBase64(prompt.barefaceImageUrl),
        mimeType: "image/jpeg"
      }
    });
    imageDescriptions += '\n- 첫 번째 사진은 사용자의 민낯 사진입니다.';

    images.push({
      inlineData: {
        data: await fetchImageAsBase64(prompt.makeupImageUrl),
        mimeType: "image/jpeg"
      }
    });
    imageDescriptions += `\n- 두 번째 사진은 사용자의 메이크업 후 사진입니다. 이 사진을 중심으로 분석해주세요.`;

    images.push({
      inlineData: {
        data: await fetchImageAsBase64(prompt.referenceImageUrl),
        mimeType: "image/jpeg"
      }
    });
    imageDescriptions += `\n- 세 번째 사진은 사용자가 참고한 레퍼런스 사진입니다. 메이크업 후 사진과 비교하여 분석해주세요.`;
    
    const systemPrompt = `당신은 전문 메이크업 아티스트입니다. 
    사용자가 제공한 사진들을 분석하여 반드시 점수와 구체적인 피드백을 제공해주세요.
    점수는 60-100점 사이의 정확한 점수를 제공해야 합니다. 점수를 제공하지 않으면 안됩니다.
    
    점수 기준 (60-100점 범위):
    - 90-100점: 전문가 수준의 완벽한 메이크업 (거의 완벽, 미세한 조정만 필요)
    - 80-89점: 매우 우수한 메이크업 (약간의 개선점 있음, 전체적으로 훌륭함)
    - 70-79점: 좋은 메이크업 (몇 가지 개선점 있음, 기본기는 갖춤)
    - 60-69점: 기본적인 메이크업 (개선 여지 있음, 더 발전 가능)
    
    점수 평가 기준:
    - 기술적 완성도 (블렌딩, 정확성)
    - 색상 선택과 조화
    - 얼굴형에 맞는 메이크업
    - 전체적인 균형과 조화
    - 세부적인 완성도
    
    피드백 작성 가이드라인:
    1. 긍정적인 부분을 먼저 언급
    2. 구체적인 개선점 제시
    3. 민낯과 메이크업 전후 비교, 그리고 레퍼런스와의 차이점 분석을 포함
    4. 실제로 적용 가능한 조언 제공
    5. 한국어로 자연스럽게 작성하며, 전문적이지만 친근한 톤 사용

    ⚠️ 필수 요구사항:
    1. 반드시 60-100점 사이의 정확한 점수를 제공해야 합니다
    2. 점수를 제공하지 않으면 안됩니다
    3. 유효한 JSON 형태로만 응답하세요
    4. 다른 설명이나 텍스트는 포함하지 마세요`;

    const visionContext = visionAnalysis ? 
      `\n\nVision AI 분석 결과:\n${JSON.stringify(visionAnalysis, null, 2)}` : '';

    const userPrompt = `이 ${prompt.analysisType} 메이크업을 분석해주세요. 
    
    분석할 사진 정보:${imageDescriptions}
    {
      "score": [60-100 사이의 실제 점수],
      "feedback": "구체적인 피드백 내용",
      "improvements": ["개선점1", "개선점2"]
    }${visionContext}`;

    const parsed = await callGeminiApi(model, systemPrompt, userPrompt, images);
    
    return {
      score: parsed.score,
      feedback: parsed.feedback || "분석 결과를 생성할 수 없습니다.",
      improvements: parsed.improvements || [],
      strengths: parsed.strengths || []
    };
  } catch (error) {
    console.error('Gemini API 오류:', error);
    throw new Error('AI 피드백 생성에 실패했습니다.');
  }
}