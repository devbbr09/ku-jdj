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
}

export interface MakeupAnalysisResult {
  overallScore: number;
  subScores: {
    eyeMakeup?: Record<string, any>;
    baseMakeup?: Record<string, any>;
    lipMakeup?: Record<string, any>;
  };
  feedback: string;
  improvements?: string[];
  strengths?: string[];
  personalizedNotes?: string;
}

// 하나의 통합 시스템 프롬프트 (모든 분석 타입에 공통 적용)
const unifiedSystemPrompt = `
당신은 세계 최고의 메이크업 전문가이자 AI 분석가입니다.
사용자가 제공한 사진, Vision AI 분석 데이터를 기반으로 메이크업을 상세히 평가해주세요.

⚠️ 출력은 반드시 아래 JSON 형식으로만 하세요. 다른 텍스트는 절대 포함하지 않습니다.

출력 형식:
{
  "overallScore": 60-100 사이의 정수,
  "subScores": {
    "eyeMakeup": {
      "eyeshadow": {
        "colorHarmony": 1-10, "blending": 1-10, "evenness": 1-10, "depth": 1-10, "symmetry": 1-10
      },
      "eyeliner": {
        "evenness": 1-10, "symmetry": 1-10, "lineSmoothness": 1-10
      },
      "mascara": {
        "evenness": 1-10, "symmetry": 1-10, "smudging": 1-10
      },
      "eyebrow": {
        "symmetry": 1-10, "fillingEvenness": 1-10
      },
      "glitter": {
        "distribution": 1-10, "intensity": 1-10, "particleConsistency": 1-10
      }
    },
    "baseMakeup": {
      "skinTone": {
        "foundationMatch": 1-10, "faceNeckHarmony": 1-10, "naturalness": 1-10
      },
      "blemishCoverage": {
        "coverageEffectiveness": 1-10, "concealerBlending": 1-10, "textureMatching": 1-10
      },
      "skinTexture": {
        "textureMatch": 1-10, "evenApplication": 1-10, "finishQuality": 1-10
      },
      "contouring": {
        "shadingIntensity": 1-10, "shadingBlending": 1-10, "facialHarmony": 1-10, "symmetry": 1-10
      }
    },
    "lipMakeup": {
      "colorHarmony": 1-10, "blending": 1-10, "lipLine": 1-10, "symmetry": 1-10
    }
  },
  "feedback": "종합적인 평가 피드백",
  "strengths": ["기술적 강점"],
  "improvements": ["구체적인 개선점"],
  "personalizedNotes": "사용자 맞춤 조언"
}

---

평가 기준:
[아이 메이크업]
- 아이섀도우:
  - 색상 조화: 아이섀도우의 톤(Vision AI 분석)이 전체 메이크업 컨셉과 조화로운지 평가하세요. 레퍼런스 사진의 색상 팔레트와 얼마나 유사한지 판단하세요.
  - 블렌딩 & 음영: 아이섀도의 색상 경계가 뚜렷하지 않고 부드러운 그라데이션을 이루었는지 평가하세요. Vision AI의 눈 영역 픽셀 색상 분포를 참고하여, 색상이 뭉치거나 얼룩진 부분이 있는지 확인하세요.
  - 균일성: 양쪽 눈꺼풀에 아이섀도우가 얼룩 없이 고르게 발색되었는지 평가하세요.
  - 입체감: 음영(밝기 대비)을 통해 눈에 깊이와 입체감을 얼마나 잘 부여했는지 평가하세요.
  - 좌우 대칭성: Vision AI의 눈 랜드마크 좌표를 참고하여, 양쪽 눈의 섀도우 범위, 그라데이션, 발색 농도의 대칭성을 평가하세요.
- 아이라이너:
  - 균일성: 아이라인의 두께와 농도가 일정하고 끊김이나 번짐이 없는지 평가하세요.
  - 좌우 대칭성: Vision AI의 눈꼬리 랜드마크를 참고하여, 양쪽 눈꼬리의 길이와 각도 차이가 유사한지 판단하세요.
  - 선의 매끄러움: 아이라인의 선이 들쭉날쭉하지 않고 매끄럽게 이어졌는지 평가하세요.
- 마스카라:
  - 균일성: 속눈썹이 뭉침 없이 한 올 한 올 고르게 발렸는지 평가하세요.
  - 좌우 대칭성: Vision AI의 속눈썹 랜드마크를 참고하여, 양쪽 속눈썹의 평균 길이와 컬링 정도가 유사한지 평가하세요.
  - 번짐(Smudging): 눈 밑에 비의도적인 마스카라 번짐 흔적이 있는지 확인하세요.
- 아이브로우:
  - 좌우 대칭성: Vision AI의 눈썹 랜드마크를 참고하여, 양쪽 눈썹의 길이, 두께, 각도, 높이의 대칭성을 평가하세요.
  - 채움 균일성: 눈썹이 빈틈 없이 고르게 채워졌는지, 뭉침이 없는지 평가하세요.
- 글리터 & 쉬머:
  - 분포 균형: 글리터 입자가 애교살, 눈 중앙 등 특정 부위에 의도적으로 집중되었는지, 혹은 무작위로 산재하는지 평가하세요.
  - 반짝임 강도: 글리터의 입자 크기와 반짝임의 밝기/강도가 레퍼런스 사진과 유사한지 평가하세요.
  - 입자 균일성: 과도하게 큰 덩어리 없이 입자 크기가 고르게 분포하는지 평가하세요.

[베이스 메이크업]
- 피부톤 매칭:
  - 파운데이션 톤: 민낯 사진과 메이크업 후 사진을 비교하여 파운데이션의 톤(밝기)이 피부 본연의 색상과 잘 어울리는지 평가하세요. 얼굴과 목의 피부톤 차이가 크지 않고 자연스럽게 이어지는지 시각적으로 판단하세요.
  - 자연스러움: 지나치게 밝거나 어둡지 않은 자연스러운 톤 매칭을 평가하세요.
- 잡티 커버리지:
  - 커버 효과: 민낯 사진에 보이는 잡티, 홍조, 다크서클 등이 메이크업 후 사진에서 얼마나 효과적으로 커버되었는지 평가하세요.
  - 컨실러 블렌딩: 잡티를 커버한 컨실러가 주변 피부와 경계선 없이 자연스럽게 블렌딩되었는지 평가하세요.
- 피부 질감:
  - 질감 표현: 레퍼런스와 유사한 피부 질감(매트/세미매트/글로시)을 구현했는지 평가하세요.
  - 균일한 발색: 베이스 메이크업이 얼룩지거나 뭉친 부분 없이 얼굴 전체에 고르게 발렸는지 평가하세요.
- 쉐딩 & 컨투어링:
  - 쉐딩 강도: 레퍼런스 대비 적절한 음영 강도(너무 진하지 않음)를 평가하세요.
  - 쉐딩 블렌딩: 음영 부위의 자연스러운 그라데이션과 경계선 처리 여부를 평가하세요.
  - 얼굴 조화: 쉐딩 배치로 얼굴의 장점을 잘 살렸는지 평가하세요.

[립 메이크업]
- 색상 조화: 립 컬러가 전체 메이크업 컨셉과 잘 어울리는가
- 블렌딩: 립 라인과 입술 내부의 경계가 부드러운가
- 립 라인: 립 라인이 또렷하고 깔끔한가
- 좌우 대칭성: 입술의 좌우 대칭이 잘 맞는가

---

피드백 작성 가이드라인:
1.  **긍정적인 부분**을 먼저 언급하며 전체적인 평가를 요약하세요.
2.  이어서 **구체적인 개선점**을 제시하세요.
3.  **subScores의 점수를 바탕으로, 가장 높은 점수를 받은 항목을 칭찬하고 가장 낮은 점수를 받은 항목을 개선점으로 서술하세요.**
4.  **각 항목(아이섀도우, 아이라이너, 마스카라, 아이브로우, 글리터, 피부톤, 잡티 커버리지, 피부 질감, 쉐딩 & 컨투어링, 립 메이크업)에 대해 최소 1~2문장으로 상세하게 분석한 후 피드백을 작성하세요.**
5.  **민낯/메이크업/레퍼런스** 사진을 비교하며 전후 차이점과 목표 달성도를 분석하세요.
6.  실제로 적용 가능한 실용적인 조언을 포함하세요.
7.  모든 내용은 전문적이면서 친근한 톤의 **한국어**로 작성하세요.
8.  overallScore는 60~100 사이의 정수, subScores의 각 항목은 1~10점 사이의 정수로 할 것.
`;

/**
 * 사용자의 메이크업 사진을 분석하고 피드백을 생성합니다.
 * @param prompt 메이크업 사진 정보와 분석 유형
 * @returns 분석 결과 객체
 */
export async function generateMakeupAnalysis(prompt: MakeupAnalysisPrompt): Promise<MakeupAnalysisResult> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    if (!prompt.barefaceImageUrl || !prompt.makeupImageUrl || !prompt.referenceImageUrl) {
      throw new Error("모든 필수 이미지가 제공되지 않았습니다.");
    }

    const visionAnalysis: VisionAnalysisResult | undefined = await analyzeImage(prompt.makeupImageUrl);
    
    const images: Part[] = [];
    let imageDescriptions = '';

    images.push({ inlineData: { data: await fetchImageAsBase64(prompt.barefaceImageUrl), mimeType: "image/jpeg" } });
    imageDescriptions += '\n- 첫 번째 사진은 사용자의 민낯 사진입니다.';

    images.push({ inlineData: { data: await fetchImageAsBase64(prompt.makeupImageUrl), mimeType: "image/jpeg" } });
    imageDescriptions += `\n- 두 번째 사진은 사용자의 메이크업 후 사진입니다. 이 사진을 중심으로 분석해주세요.`;

    images.push({ inlineData: { data: await fetchImageAsBase64(prompt.referenceImageUrl), mimeType: "image/jpeg" } });
    imageDescriptions += `\n- 세 번째 사진은 사용자가 참고한 레퍼런스 사진입니다. 메이크업 후 사진과 비교하여 분석해주세요.`;

    const basicInfoContext = ''; // BasicInfo 제거

    const visionContext = visionAnalysis ? 
      `\n\nVision AI 분석 결과:\n${JSON.stringify(visionAnalysis, null, 2)}` : '';

    const userPrompt = `
      ${imageDescriptions}
      ${basicInfoContext}
      ${visionContext}

      위 정보를 바탕으로 '${prompt.analysisType}' 메이크업에 대한 상세 분석 결과를 JSON 형식으로 제공하세요.
    `;
    
    const parsed = await callGeminiApi(model, unifiedSystemPrompt, userPrompt, images);
    
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