import { GoogleGenerativeAI, Part } from '@google/generative-ai';
import { analyzeImage, VisionAnalysisResult } from './googleVision';
import { BasicInfo } from '@/components/BasicInfoSelector'; 

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
  const result = await model.generateContent({
  contents: [
    { role: "system", parts: [{ text: systemPrompt }] },
    { role: "user", parts: [...images, { text: userPrompt }] }
  ]
});
  const response = await result.response;
  const text = await response.text();

  try {
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
    const jsonText = jsonMatch ? jsonMatch[1] : text;
    const parsed = JSON.parse(jsonText);

  if (parsed.overallScore === undefined || parsed.overallScore < 60 || parsed.overallScore > 100) {
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
  barefaceImageUrl: string;
  makeupImageUrl: string;
  referenceImageUrl: string;
  analysisType: 'eye' | 'base' | 'lip' | 'overall';
  basicInfo?: BasicInfo;
}

export interface MakeupAnalysisResult {
  overallScore: number;
  subScores?: Record<string, any>;
  feedback: string;
  improvements?: string[];
  strengths?: string[];
  personalizedNotes?: string;
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
    const visionAnalysis: VisionAnalysisResult | undefined = await analyzeImage(prompt.makeupImageUrl);
    
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

    const basicInfoContext = prompt.basicInfo ? 
      `\n\n사용자 기본 정보 (참고용):\n` +
      `- 얼굴형: ${prompt.basicInfo.faceShape}\n` +
      `- 퍼스널 컬러: ${prompt.basicInfo.personalColor}\n` +
      `- 눈 특징 (눈꺼풀): ${prompt.basicInfo.eyeShape}\n` +
      `- 눈 특징 (크기): ${prompt.basicInfo.eyeSize}\n` +
      `- 눈 특징 (방향): ${prompt.basicInfo.eyeDirection}\n` +
      `- 눈 특징 (입체감): ${prompt.basicInfo.eyeDepth}\n` +
      `- 선호 스타일: ${(prompt.basicInfo.preferredStyle || []).join(', ')}\n`
      : '';
    
const systemPrompt = `
당신은 세계 최고의 메이크업 전문가이자 AI 분석가입니다.
사용자가 제공한 세 장의 사진(민낯, 메이크업 후, 레퍼런스)과 Vision AI 분석 데이터를 기반으로,
아이 메이크업을 매우 상세하고 기술적으로 평가해주세요.

⚠️ 출력은 반드시 아래 JSON 형식으로만 하세요. 다른 텍스트는 절대 포함하지 않습니다.

출력 형식:
{
  "overallScore": 60-100 사이의 정수,
  "subScores": {
    "eyeshadow": {
      "colorHarmony": 1-10,
      "blending": 1-10,
      "evenness": 1-10,
      "depth": 1-10,
      "symmetry": 1-10
    },
    "eyeliner": {
      "evenness": 1-10,
      "symmetry": 1-10,
      "lineSmoothness": 1-10
    },
    "mascara": {
      "evenness": 1-10,
      "symmetry": 1-10,
      "smudging": 1-10
    },
    "eyebrow": {
      "symmetry": 1-10,
      "fillingEvenness": 1-10
    },
    "glitter": {
      "distribution": 1-10,
      "intensity": 1-10,
      "particleConsistency": 1-10
    }
  },
  "feedback": "종합적인 평가 피드백",
  "strengths": ["기술적 강점"],
  "improvements": ["구체적인 개선점"],
  "personalizedNotes": ["사용자 기본 정보 및 선호 스타일을 반영한 맞춤 조언"]
}

---

아이 메이크업 평가 기준:

점수화 기준:
- 1~3점: 개선이 크게 필요함
- 4~6점: 보통, 평균적
- 7~8점: 좋음, 우수함
- 9~10점: 완벽함, 전문가 수준

세부 항목별 기준:

[아이섀도우]
- 색상 조화: 피부톤, 퍼스널 컬러, 헤어 컬러와의 조화
- 블렌딩 & 음영: 경계가 부드럽고 자연스러운가, 다크 패치/뭉침 없는가
- 균일성: 좌우 눈꺼풀 발색이 일정한가
- 입체감: 음영을 통한 깊이와 입체감 표현
- 좌우 대칭성: 범위, 그라데이션, 발색 농도의 대칭성

[아이라이너]
- 균일성: 두께·농도 일정, 번짐/끊김 없음
- 좌우 대칭성: 꼬리 길이·각도·높이 유사
- 선의 매끄러움: 들쭉날쭉하지 않고 매끄러움

[마스카라]
- 균일성: 속눈썹 뭉침 없이 고르게 발림
- 좌우 대칭성: 길이와 컬링 정도 유사
- 번짐(Smudging): 눈 위/아래 번짐 여부

[아이브로우]
- 좌우 대칭성: 길이·두께·각도·높이 유사
- 채움 균일성: 빈틈 없이 일정, 뭉침 없음

[글리터 & 쉬머]
- 분포 균형: 특정 부위에 의도적 집중 여부
- 반짝임 강도: 크기·강도가 레퍼런스와 유사
- 입자 균일성: 덩어리 없이 고른 분포

---

피드백 작성 가이드라인:
1. 긍정적인 부분을 먼저 언급
2. 구체적인 개선점을 제시
3. 민낯/메이크업/레퍼런스 비교 포함
4. 실제 적용 가능한 조언 포함
5. 모든 설명은 전문적이면서 친근한 한국어로 작성
6. 반드시 JSON 구조만 출력

⚠️ 추가 요구사항:
- 반드시 60~100 사이의 정수 점수를 overallScore에 넣으세요
- feedback, strengths, improvements, personalizedNotes는 모두 한국어로 작성하세요
- personalizedNotes에는 사용자 basicInfo와 preferredStyle을 반영하세요 ;
`;
    const visionContext = visionAnalysis ? 
      `\n\nVision AI 분석 결과:\n${JSON.stringify(visionAnalysis, null, 2)}` : '';

    const userPrompt = `이 ${prompt.analysisType} 메이크업을 분석해주세요. 
    ${imageDescriptions}
    ${basicInfoContext}
    ${visionContext}
    {
      "overallScore": 60-100 사이의 실제 점수,
      "subScores": {
        "eyeshadow": {
          "colorHarmony": 1-10,
          "blending": 1-10,
          "evenness": 1-10,
          "depth": 1-10,
          "symmetry": 1-10
        },
        "eyeliner": {
          "evenness": 1-10,
          "symmetry": 1-10,
          "lineSmoothness": 1-10
        },
        "mascara": {
          "evenness": 1-10,
          "symmetry": 1-10,
          "smudging": 1-10
        },
        "eyebrow": {
          "symmetry": 1-10,
          "fillingEvenness": 1-10
        },
        "glitter": {
          "distribution": 1-10,
          "intensity": 1-10,
          "particleConsistency": 1-10
        }
      },
      "feedback": "종합적인 평가 피드백",
      "strengths": ["기술적 강점"],
      "improvements": ["구체적인 개선점"],
      "personalizedNotes": ["사용자 기본 정보 및 선호 스타일을 반영한 맞춤 조언"]
    }`;
    
    const parsed = await callGeminiApi(model, systemPrompt, userPrompt, images);
    
    return {
      overallScore: parsed.overallScore,
      subScores: parsed.subScores || {},
      feedback: parsed.feedback || "분석 결과를 생성할 수 없습니다.",
      improvements: parsed.improvements || [],
      strengths: parsed.strengths || [],
      personalizedNotes: parsed.personalizedNotes || "사용자 맞춤형 조언을 생성할 수 없습니다."
    };
  } catch (error) {
    console.error('Gemini API 오류:', error);
    throw new Error('AI 피드백 생성에 실패했습니다.');
  }
}