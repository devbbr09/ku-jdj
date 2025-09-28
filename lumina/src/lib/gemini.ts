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
  userPrompt: string,
  images: Part[]
): Promise<any> {

  const result = await model.generateContent([
    ...images, 
    userPrompt
  ]);
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
      "colorHarmony": {
        "skinToneMatch": 1-10, "overallMakeupHarmony": 1-10, "brightnessBalance": 1-10, "contrastAppropriate": 1-10
      },
      "application": {
        "colorEvenness": 1-10, "edgeDefinition": 1-10, "gradientQuality": 1-10, "textureConsistency": 1-10
      },
      "lipCondition": {
        "hydrationLevel": 1-10, "textureFinish": 1-10, "exfoliationQuality": 1-10, "overallCondition": 1-10
      }
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
다음 이미지를 분석하여 아이메이크업 상태를 평가하세요.
각 화장품별로 아래 기준을 적용하세요.

1. 아이섀도우 (Eyeshadow)
- 색상 조화: 아이섀도우의 톤(Vision AI 분석)이 전체 메이크업 컨셉과 조화로운지 평가하세요. 레퍼런스 사진의 색상 팔레트와 얼마나 유사한지 판단하세요.
  Data: Vision API dominantColors, 피부 평균 색상, 헤어 컬러, HSL/HSV 값
  Evaluation:
    - 아이섀도 주요 색상이 피부·헤어 톤 대비 과도하게 튀지 않는지 확인
    - 사용자의 퍼스널 컬러(쿨톤/웜톤)와 조화되는지 평가
    - 레퍼런스 메이크업 팔레트와 유사도 비교
    - 전체 메이크업 컨셉과 조화로운지 판단

- 블렌딩 & 음영: 아이섀도의 색상 경계가 뚜렷하지 않고 부드러운 그라데이션을 이루었는지 평가하세요.
  Data: 눈 영역 픽셀 색상 분포, gradient 연속성
  Evaluation:
    - 색상 변화가 점진적인지, 경계가 부드럽게 연결되는지 평가
    - 국소적 채도/명도 급변(다크 패치)이 있는지 감지
    - 색상이 뭉치거나 얼룩진 부분이 없는지 확인

- 균일성: 양쪽 눈꺼풀에 아이섀도우가 얼룩 없이 고르게 발색되었는지 평가하세요.
  Data: 좌/우 눈꺼풀 색상 분산(variance), 밝기 표준편차
  Evaluation:
    - 얼룩이나 뭉침 패턴이 없는지 확인
    - 표준편차가 일정 수준 이하인지 판단

- 입체감: 음영(밝기 대비)을 통해 눈에 깊이와 입체감을 얼마나 잘 부여했는지 평가하세요.
  Data: 명도 대비(contrast), 눈 bounding box 위 20~40% 영역(쌍꺼풀), 중앙 40~60% 영역(눈두덩), 아래 60~80% 영역(언더라인) 평균 밝기
  Evaluation:
    - 상하 인접 영역 대비가 레퍼런스와 유사한지 확인
    - 대비가 크면 입체감, 부족하면 평면적

- 좌우 대칭성: Vision AI의 눈 랜드마크 좌표를 참고하여, 양쪽 눈의 섀도우 범위, 그라데이션, 발색 농도의 대칭성을 평가하세요.
  Data: 좌/우 눈 색상, 명도, 채도 평균
  Evaluation:
    - 발색 농도 ±10% 이내 확인
    - 그라데이션 범위 및 눈매 연출 방향 유사 여부 평가

2. 아이라이너 (Eyeliner)
- 균일성: 아이라인의 두께와 농도가 일정하고 끊김이나 번짐이 없는지 평가하세요.
  Data: 라인 픽셀 색상, 두께 분포
  Evaluation:
    - 라인 전체 두께 일정 여부 (표준편차 ≤ 1~2px)
    - 끊김(gap)이나 뭉침(clumping) 여부
    - 색상/명도 변화가 급격하지 않은지 점검

- 좌우 대칭성: Vision AI의 눈꼬리 랜드마크를 참고하여, 양쪽 눈꼬리의 길이와 각도 차이가 유사한지 판단하세요.
  Data: 좌/우 라인 bounding box, 각도, 길이
  Evaluation:
    - 꼬리 끝 위치, 라인 각도 ±5° 이내
    - 좌우 길이·두께 ±10% 수준 유사

- 선의 매끄러움: 아이라인의 선이 들쭉날쭉하지 않고 매끄럽게 이어졌는지 평가하세요.
  Data: 라인 edge sharpness, gradient profile
  Evaluation:
    - 픽셀 수준에서 라인 흐림 없음
    - 번짐(bleeding) 없음

3. 마스카라 (Mascara)
- 균일성: 속눈썹이 뭉침 없이 한 올 한 올 고르게 발렸는지 평가하세요.
  Data: 속눈썹 영역 픽셀 밝기/색상 분포
  Evaluation:
    - 전체 속눈썹 고르게 도포 여부
    - 뭉침(clumping) 또는 덩어리 없음

- 좌우 대칭성: Vision AI의 속눈썹 랜드마크를 참고하여, 양쪽 속눈썹의 평균 길이와 컬링 정도가 유사한지 평가하세요.
  Data: 좌/우 속눈썹 bounding box, 컬링 각도, 볼륨 분포
  Evaluation:
    - 컬링 각도 ±5° 이내
    - 볼륨/두께 분포 ±10% 수준 유사

- 번짐(Smudging): 눈 밑에 비의도적인 마스카라 번짐 흔적이 있는지 확인하세요.
  Data: 눈 밑 영역 픽셀 색상/명도
  Evaluation:
    - 비의도적인 마스카라 흔적 감지

4. 아이브로우 (Eyebrow)
- 좌우 대칭성: Vision AI의 눈썹 랜드마크를 참고하여, 양쪽 눈썹의 길이, 두께, 각도, 높이의 대칭성을 평가하세요.
  Data: 눈썹 bounding box, 산 위치, 꼬리 위치, 각도
  Evaluation:
    - 두께, 길이, 각도 ±10% 수준 유사
    - 눈썹 산·꼬리 위치 좌우 균형

- 채움 균일성: 눈썹이 빈틈 없이 고르게 채워졌는지, 뭉침이 없는지 평가하세요.
  Data: 눈썹 영역 픽셀 색상, 명도, 채도
  Evaluation:
    - 색상 일정 여부
    - 빈틈, 얼룩, 색상 급변 여부

5. 글리터 & 쉬머 (Glitter & Shimmer)
- 분포 균형: 글리터 입자가 애교살, 눈 중앙 등 특정 부위에 의도적으로 집중되었는지, 혹은 무작위로 산재하는지 평가하세요.
  Data: 고명도·고채도 픽셀 클러스터링, centroid 위치
  Evaluation:
    - 특정 영역 집중 여부
    - 랜덤 산재 여부

- 반짝임 강도: 글리터의 입자 크기와 반짝임의 밝기/강도가 레퍼런스 사진과 유사한지 평가하세요.
  Data: 픽셀 명도/채도, gradient 분석
  Evaluation:
    - 반짝임 강도 레퍼런스와 비교
    - 과도한 뭉침 없음

- 입자 균일성: 과도하게 큰 덩어리 없이 입자 크기가 고르게 분포하는지 평가하세요.
  Data: 글리터 입자 크기 분포, 클러스터 분석
  Evaluation:
    - 입자 크기 균일성 확인

[베이스 메이크업]
다음 이미지를 분석하여 베이스 메이크업 상태를 평가하세요.
아래 기준을 적용해서 평가하세요.

1. 피부톤 매칭:
  - 파운데이션 톤: 민낯 사진과 메이크업 후 사진을 비교하여 파운데이션의 톤(밝기)이 피부 본연의 색상과 잘 어울리는지 평가하세요. 얼굴과 목의 피부톤 차이가 크지 않고 자연스럽게 이어지는지 시각적으로 판단하세요.
  - 자연스러움: 지나치게 밝거나 어둡지 않은 자연스러운 톤 매칭을 평가하세요.
   Data: Vision API dominantColors, 얼굴/목 영역 색상, HSL/HSV 값
- Evaluation:
  - 얼굴과 목 피부톤 차이가 적고 자연스럽게 이어지는지 확인
  - 지나치게 밝거나 어둡지 않은 톤인지 평가
  - 레퍼런스 메이크업과 톤 조화 여부 비교

2. 잡티 커버리지:
  - 커버 효과: 민낯 사진에 보이는 잡티, 홍조, 다크서클 등이 메이크업 후 사진에서 얼마나 효과적으로 커버되었는지 평가하세요.
  - 컨실러 블렌딩: 잡티를 커버한 컨실러가 주변 피부와 경계선 없이 자연스럽게 블렌딩되었는지 평가하세요.
   Data: 민낯 대비 메이크업 후 사진 pixel difference, 영역별 채도/명도 변화
- Evaluation:
  - 잡티, 홍조, 다크서클 커버율 계산
  - 컨실러 경계가 자연스럽게 블렌딩되었는지 확인
  - 얼룩/뭉침 없이 고르게 커버되었는지 판단

3. 피부 질감:
  - 질감 표현: 레퍼런스와 유사한 피부 질감(매트/세미매트/글로시)을 구현했는지 평가하세요.
  - 균일한 발색: 베이스 메이크업이 얼룩지거나 뭉친 부분 없이 얼굴 전체에 고르게 발렸는지 평가하세요.
  - Data: 얼굴 전체 pixel texture, contrast, glossiness/matte indicators
- Evaluation:
  - 질감이 매트, 세미매트, 글로시 등 레퍼런스와 유사한지 판단
  - 얼굴 전체 발색이 균일하며 얼룩/뭉침이 없는지 확인

4. 쉐딩 & 컨투어링:
  - 쉐딩 강도: 레퍼런스 대비 적절한 음영 강도(너무 진하지 않음)를 평가하세요.
  - 쉐딩 블렌딩: 음영 부위의 자연스러운 그라데이션과 경계선 처리 여부를 평가하세요.
  - 얼굴 조화: 쉐딩 배치로 얼굴의 장점을 잘 살렸는지 평가하세요.
  - Data: 얼굴 영역 brightness/contrast map, bounding box별 명도 분석
- Evaluation:
  - 쉐딩 강도가 레퍼런스와 비교해 적절한지 판단
  - 음영 부위의 블렌딩과 경계선 자연스러움 확인
  - 쉐딩 배치가 얼굴 장점을 잘 살렸는지 평가

[립 메이크업]
다음 이미지를 분석하여 립 메이크업 상태를 평가하세요.
아래 기준을 적용해서 평가하세요.

1. 립 컬러와 조화:
  - 피부톤 매칭: 립 컬러의 웜톤/쿨톤이 사용자의 피부톤과 조화롭게 어울리는지 확인하세요. Vision AI의 립 컬러 분석 결과를 참고하여 skinToneHarmony 점수를 활용하세요.
  - 전체 메이크업 조화: 립 컬러가 아이 메이크업, 블러셔 등 다른 메이크업 요소와 잘 어우러지는지 확인하세요. 전체적인 메이크업의 컨셉(예: 내추럴, 볼드, 청순)을 해치지 않고 잘 어울리는지 평가하세요.
  - 명도 균형: 립 컬러의 밝기가 얼굴에 생기를 더하거나, 오히려 칙칙하게 만들지는 않는지 확인하세요. Vision AI의 brightness 분석을 참고하세요.
  - 대비 적절성: 민낯 사진 속 입술 톤과 화장 후 사진 속 립 컬러를 비교해 지나치게 대비되지는 않는지 확인하세요.
- Data: Vision API dominantColors (립 영역), skinToneHarmony score, brightness
- Evaluation:
  - 립 컬러 톤이 피부톤과 조화로운지 확인
  - 아이 메이크업, 블러셔 등 다른 요소와 조화 여부 평가
  - 립 컬러 밝기가 얼굴 생기와 대비되는지 판단

2. 발색과 적용:
  - 색상 균일성: 입술 전체에 립 컬러가 고르게 발색되었는지 확인하세요. Vision AI의 colorEvenness 분석을 참고하세요.
  - 경계선 선명도: 입술의 외곽과 안쪽의 색상 농도가 부자연스럽게 경계를 만들지는 않는지 확인하세요. Vision AI의 edgeDefinition 분석을 참고하세요.
  - 그라데이션 품질: 그라데이션 립의 경우, 농도 조절이 부드럽고 자연스럽게 연출되었는지 확인하세요. Vision AI의 gradientQuality 분석을 참고하세요.
  - 질감 일관성: 립 제품이 입술 주름이나 각질에 뭉치거나 얼룩덜룩하게 발리지 않았는지 확인하세요. Vision AI의 textureConsistency 분석을 참고하세요.
- Data: colorEvenness, edgeDefinition, gradientQuality, textureConsistency
- Evaluation:
  - 색상 균일성과 경계선 자연스러움 확인
  - 그라데이션 립 농도 조절 부드러움 평가
  - 제품 질감이 입술 주름/각질에 뭉치지 않았는지 판단

3. 입술 컨디션과 지속력:
  - 수분감: 립 메이크업 후에도 입술이 건조해 보이거나 갈라지지 않는 등 컨디션이 좋아 보이는지 확인하세요. Vision AI의 hydrationLevel과 crackingVisible 분석을 참고하세요.
  - 질감 표현: 립 제품의 제형(매트, 글로시 등)에 따른 질감이 입술에서 잘 표현되었는지 확인하세요. Vision AI의 textureFinish 분석을 참고하세요.
  - 각질 관리: 립 메이크업 전, 각질이 효과적으로 정리되었는지 확인하세요. Vision AI의 exfoliationNeeded 분석을 참고하세요.
  - 전반적 컨디션: Vision AI의 lipCondition 분석을 참고하여 입술 전반적인 건강 상태를 평가하세요.
- Data: hydrationLevel, crackingVisible, textureFinish, exfoliationNeeded, lipCondition
- Evaluation:
  - 입술 수분감 유지 여부 확인
  - 질감 표현(매트/글로시 등) 적절성 평가
  - 각질 상태가 정리되어 있는지 확인
  - 전체적인 입술 건강 및 메이크업 지속력 판단

---

피드백 작성 가이드라인:
1.  **긍정적인 부분**을 먼저 언급하며 전체적인 평가를 요약하세요.
2.  이어서 **구체적인 개선점**을 제시하세요.
3.  **subScores의 점수를 바탕으로, 가장 높은 점수를 받은 항목을 칭찬하고 가장 낮은 점수를 받은 항목을 개선점으로 서술하세요.**
4.  **각 항목(아이섀도우, 아이라이너, 마스카라, 아이브로우, 글리터, 피부톤, 잡티 커버리지, 피부 질감, 쉐딩 & 컨투어링, 립 메이크업)에 대해 최소 1~2문장으로 상세하게 분석한 후 피드백을 작성하세요.**
5.  **민낯/메이크업/레퍼런스** 사진을 비교하며 전후 차이점과 목표 달성도를 분석하세요.
6.  피드백을 작성할 때, 아이 메이크업은 아이 메이크업과 관련된 항목(아이셰도우, 아이라이너, 마스카라, 아이브로우, 글리터 & 쉬머)만, 베이스 메이크업은 베이스 메이크업에 관련된 항목(피부톤 매칭, 잡티 커버리지, 피부 질감, 쉐딩 & 컨투어링)만, 립 메이크업은 립 메이크업에 관련된 항목(립 컬러와 조화, 발색과 적용, 입술 컨디션과 지속력)만 고려하여 피드백을 작성하세요.
7.  실제로 적용 가능한 실용적인 조언을 포함하세요.
8.  모든 내용은 전문적이면서 친근한 톤의 **한국어**로 작성하세요.
9.  overallScore는 60~100 사이의 정수, subScores의 각 항목은 1~10점 사이의 정수로 할 것.
10.  **Vision AI 분석 결과를 적극 참고**하여 더 정확하고 객관적인 평가를 수행하세요.
11. 아이 메이크업과 베이스 메이크업, 립 메이크업의 피드백 양은 최소 3줄 이상 작성하고, 서로 비슷한 양을 맞춰서 작성하세요.
`;

/**
 * 사용자의 메이크업 사진을 분석하고 피드백을 생성합니다.
 * @param prompt 메이크업 사진 정보와 분석 유형
 * @returns 분석 결과 객체
 */
export async function generateMakeupAnalysis(prompt: MakeupAnalysisPrompt): Promise<MakeupAnalysisResult> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    
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

    const basicInfoContext = '';

    const visionContext = visionAnalysis ? 
      `\n\nVision AI 분석 결과:\n${JSON.stringify(visionAnalysis, null, 2)}` : '';

    // 분석 타입별 특화된 프롬프트 생성
    const analysisTypePrompts = {
      eye: "아이 메이크업(아이섀도, 아이라이너, 마스카라, 아이브로우)에 집중하여 분석해주세요.",
      base: "베이스 메이크업(파운데이션, 컨실러, 컨투어링, 피부톤 매칭)에 집중하여 분석해주세요.",
      lip: "립 메이크업(립스틱, 립라이너, 립글로스)에 집중하여 분석해주세요.",
      overall: "전체적인 메이크업의 조화와 완성도를 종합적으로 분석해주세요."
    };

    const userPrompt = `
      ${unifiedSystemPrompt}

      ${imageDescriptions}
      ${basicInfoContext}
      ${visionContext}

      위 정보를 바탕으로 '${prompt.analysisType}' 메이크업에 대한 상세 분석 결과를 JSON 형식으로 제공하세요.
      
      ${analysisTypePrompts[prompt.analysisType]}
      
      이 분석에서는 ${prompt.analysisType} 메이크업의 기술적 완성도, 색상 조화, 대칭성, 블렌딩 등을 중점적으로 평가해주세요.
      
      점수 평가 기준:
      - eye: 아이섀도 블렌딩(30%), 아이라이너 정확성(25%), 마스카라 균일성(25%), 아이브로우 대칭성(20%)
      - base: 피부톤 매칭(40%), 잡티 커버리지(30%), 컨투어링 자연스러움(30%)
      - lip: 립 컬러 조화(40%), 립 라인 정확성(30%), 블렌딩 완성도(30%)
      - overall: 전체 조화(40%), 기술적 완성도(30%), 레퍼런스 유사도(30%)
    `;
    
    console.log(`🔍 Gemini 분석 시작 - 타입: ${prompt.analysisType}`);
    
    const parsed = await callGeminiApi(model, userPrompt, images);
    
    console.log(`📊 Gemini 분석 결과 - 타입: ${prompt.analysisType}, 점수: ${parsed.overallScore}`);
    console.log(`📝 Gemini 원본 응답 - 타입: ${prompt.analysisType}:`, JSON.stringify(parsed, null, 2));
    
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