import { ImageAnnotatorClient } from '@google-cloud/vision';
import { protos } from '@google-cloud/vision';

// Google Cloud Vision 클라이언트 초기화
const client = new ImageAnnotatorClient({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  credentials: {
    type: "service_account",
    project_id: process.env.GOOGLE_CLOUD_PROJECT_ID,
    private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    client_id: process.env.GOOGLE_CLIENT_ID,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: process.env.GOOGLE_CLIENT_X509_CERT_URL,
    universe_domain: "googleapis.com"
  },
  keyFilename: process.env.GOOGLE_CLOUD_KEY_FILE,
});

export interface FaceAttributes {
  joy: number;
  sorrow: number;
  anger: number;
  surprise: number;
  confidence: number;
}

// Vision API의 IColorInfo 형식에 맞게 DominantColor 인터페이스 수정
export interface DominantColor {
  color: {
    red: number;
    green: number;
    blue: number;
  };
  pixelFraction: number;
  score: number;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

// 립 메이크업 분석을 위한 새로운 인터페이스들 추가
export interface LipColorAnalysis {
  lipColor: {
    red: number;
    green: number;
    blue: number;
  };
  colorTone: 'warm' | 'cool' | 'neutral';
  brightness: number; // 0-1, 명도
  saturation: number; // 0-1, 채도
  skinToneHarmony: number; // 0-1, 피부톤과의 조화도
}

export interface LipApplicationAnalysis {
  colorEvenness: number; // 0-1, 발색 균일성
  edgeDefinition: number; // 0-1, 경계선 선명도
  gradientQuality: number; // 0-1, 그라데이션 자연스러움 (해당시)
  textureConsistency: number; // 0-1, 질감 일관성
}

export interface LipConditionAnalysis {
  lipCondition: 'excellent' | 'good' | 'fair' | 'poor';
  hydrationLevel: number; // 0-1, 수분감
  textureFinish: 'matte' | 'satin' | 'glossy' | 'velvet';
  crackingVisible: boolean; // 갈라짐 여부
  exfoliationNeeded: boolean; // 각질 정리 필요 여부
}

export interface LipMakeupAnalysis {
  lipLandmarks: protos.google.cloud.vision.v1.FaceAnnotation.ILandmark[] | null;
  lipColor?: DominantColor | null;
  // 새로운 립 분석 필드들 추가
  lipColorAnalysis?: LipColorAnalysis | null;
  lipApplicationAnalysis?: LipApplicationAnalysis | null;
  lipConditionAnalysis?: LipConditionAnalysis | null;
}

export interface SkinToneAnalysis {
  faceDominantColor: DominantColor | null;
  neckDominantColor: DominantColor | null;
  colorDifference: number | null;
}

export interface BlemishDetection {
  blemishLabels?: string[] | null;
  hasBlemishes: boolean;
}

export interface SkinTextureAnalysis {
  textureType?: 'matte' | 'satin' | 'dewy' | 'glossy' | 'unknown';
  textureUniformity?: number | null;
}

export interface ContourAnalysis {
  contourLabels?: string[] | null;
}

// 최종 VisionAnalysisResult 인터페이스를 모든 잠재적 반환 속성으로 업데이트
export interface VisionAnalysisResult {
  faceDetected: boolean;
  faceCount: number;
  faceLandmarks?: protos.google.cloud.vision.v1.FaceAnnotation.ILandmark[] | null;
  faceAttributes?: FaceAttributes;
  faceBounds?: BoundingBox[];
  labels?: protos.google.cloud.vision.v1.IEntityAnnotation[] | null;
  dominantColors?: DominantColor[] | null;
  text?: protos.google.cloud.vision.v1.IEntityAnnotation[] | null;
  
  // 아이, 베이스, 립 메이크업 관련 데이터 필드 추가
  eyeMakeupLandmarks?: protos.google.cloud.vision.v1.FaceAnnotation.ILandmark[] | null;
  lipMakeupAnalysis?: LipMakeupAnalysis | null;
  skinToneAnalysis?: SkinToneAnalysis | null;
  blemishDetection?: BlemishDetection | null;
  skinTextureAnalysis?: SkinTextureAnalysis | null;
  contourAnalysis?: ContourAnalysis | null;
}

/**
 * RGB 색상의 명도를 계산합니다.
 */
function calculateBrightness(color: {red: number, green: number, blue: number}): number {
  return (color.red * 0.299 + color.green * 0.587 + color.blue * 0.114) / 255;
}

/**
 * RGB 색상의 채도를 계산합니다.
 */
function calculateSaturation(color: {red: number, green: number, blue: number}): number {
  const max = Math.max(color.red, color.green, color.blue);
  const min = Math.min(color.red, color.green, color.blue);
  return max === 0 ? 0 : (max - min) / max;
}

/**
 * RGB 색상의 톤(웜/쿨)을 판단합니다.
 */
function determineColorTone(color: {red: number, green: number, blue: number}): 'warm' | 'cool' | 'neutral' {
  const warmScore = color.red + color.red * 0.5 - color.blue * 0.3;
  const coolScore = color.blue + color.blue * 0.5 - color.red * 0.3;
  
  if (Math.abs(warmScore - coolScore) < 20) return 'neutral';
  return warmScore > coolScore ? 'warm' : 'cool';
}

/**
 * RGB 색상 간의 유클리드 거리를 계산합니다.
 */
function calculateColorDifference(color1: {red: number, green: number, blue: number}, 
                                color2: {red: number, green: number, blue: number}): number {
  return Math.sqrt(
    Math.pow(color1.red - color2.red, 2) +
    Math.pow(color1.green - color2.green, 2) +
    Math.pow(color1.blue - color2.blue, 2)
  );
}

/**
 * 립 컬러를 분석합니다.
 */
function analyzeLipColor(lipLandmarks: Array<{type: string; position: {x: number; y: number; z: number}}>, dominantColors: DominantColor[], faceColor: {red: number, green: number, blue: number}): LipColorAnalysis {
  // 입술 영역에서 가장 두드러진 색상을 립 컬러로 간주
  let lipColor = { red: 200, green: 100, blue: 120 }; // 기본 립 색상
  
  // 밝고 채도가 높은 색상을 립 컬러로 추정
  const potentialLipColors = dominantColors.filter(color => {
    const brightness = calculateBrightness(color.color);
    const saturation = calculateSaturation(color.color);
    return brightness > 0.3 && saturation > 0.2 && color.pixelFraction > 0.01;
  });

  if (potentialLipColors.length > 0) {
    // 가장 채도가 높은 색상을 립 컬러로 선택
    const mostSaturatedColor = potentialLipColors.reduce((prev, current) => {
      return calculateSaturation(current.color) > calculateSaturation(prev.color) ? current : prev;
    });
    lipColor = mostSaturatedColor.color;
  }

  const colorTone = determineColorTone(lipColor);
  const brightness = calculateBrightness(lipColor);
  const saturation = calculateSaturation(lipColor);
  
  // 피부톤과의 조화도 계산
  const faceColorTone = determineColorTone(faceColor);
  const skinToneHarmony = colorTone === faceColorTone ? 0.8 : (colorTone === 'neutral' || faceColorTone === 'neutral') ? 0.6 : 0.4;

  return {
    lipColor,
    colorTone,
    brightness,
    saturation,
    skinToneHarmony
  };
}

/**
 * 립 적용 상태를 분석합니다.
 */
function analyzeLipApplication(lipLandmarks: Array<{type: string; position: {x: number; y: number; z: number}}>, dominantColors: DominantColor[]): LipApplicationAnalysis {
  // 입술 관련 색상들의 균일성 분석
  const lipColors = dominantColors.filter(color => {
    const saturation = calculateSaturation(color.color);
    return saturation > 0.2 && color.pixelFraction > 0.005;
  });

  // 색상 균일성 계산
  let colorEvenness = 0.7; // 기본값
  if (lipColors.length > 0) {
    const colorVariance = lipColors.reduce((acc, color, i, arr) => {
      if (i === 0) return 0;
      return acc + calculateColorDifference(color.color, arr[0].color);
    }, 0) / Math.max(1, lipColors.length - 1);
    
    colorEvenness = Math.max(0.1, 1 - colorVariance / 255);
  }

  // 경계선 선명도 (색상 대비로 추정)
  const edgeDefinition = Math.min(1.0, lipColors.length * 0.2);
  
  // 그라데이션 품질 (색상 분포로 추정)
  const gradientQuality = lipColors.length > 1 ? 0.8 : 0.6;
  
  // 질감 일관성
  const textureConsistency = colorEvenness;

  return {
    colorEvenness,
    edgeDefinition,
    gradientQuality,
    textureConsistency
  };
}

/**
 * 입술 컨디션을 분석합니다.
 */
function analyzeLipCondition(dominantColors: DominantColor[], labels: Array<{description: string; score: number}>): LipConditionAnalysis {
  // 라벨에서 질감 관련 정보 추출
  const glossyLabels = ['glossy', 'shiny', 'wet', 'gloss'];
  const matteLabels = ['matte', 'dry', 'powder'];
  const crackedLabels = ['cracked', 'dry', 'flaky'];
  
  let textureFinish: 'matte' | 'satin' | 'glossy' | 'velvet' = 'satin';
  let hydrationLevel = 0.6; // 기본값
  let crackingVisible = false;
  let exfoliationNeeded = false;

  for (const label of labels || []) {
    const description = label.description?.toLowerCase() || '';
    
    if (glossyLabels.some(keyword => description.includes(keyword))) {
      textureFinish = 'glossy';
      hydrationLevel = 0.8;
    } else if (matteLabels.some(keyword => description.includes(keyword))) {
      textureFinish = 'matte';
      hydrationLevel = 0.4;
    }
    
    if (crackedLabels.some(keyword => description.includes(keyword))) {
      crackingVisible = true;
      exfoliationNeeded = true;
      hydrationLevel = Math.min(hydrationLevel, 0.3);
    }
  }

  // 전체적인 입술 컨디션 평가
  let lipCondition: 'excellent' | 'good' | 'fair' | 'poor' = 'good';
  if (crackingVisible || hydrationLevel < 0.4) {
    lipCondition = 'poor';
  } else if (hydrationLevel < 0.6) {
    lipCondition = 'fair';
  } else if (hydrationLevel > 0.8) {
    lipCondition = 'excellent';
  }

  return {
    lipCondition,
    hydrationLevel,
    textureFinish,
    crackingVisible,
    exfoliationNeeded
  };
}

/**
 * 이미지 URL을 분석하여 얼굴, 라벨, 색상 데이터를 추출합니다.
 * @param imageUrl 분석할 이미지의 URL
 * @returns VisionAnalysisResult 객체
 */
export async function analyzeImage(imageUrl: string): Promise<VisionAnalysisResult> {
  try {
    console.log('Google Cloud Vision API 호출 시작:', imageUrl);

    const image = { source: { imageUri: imageUrl } };

    const request = {
      image: image,
      features: [
        { type: 'FACE_DETECTION', maxResults: 10 },
        { type: 'LANDMARK_DETECTION', maxResults: 10 },
        { type: 'LABEL_DETECTION', maxResults: 10 },
        { type: 'TEXT_DETECTION', maxResults: 10 },
        { type: 'IMAGE_PROPERTIES' },
      ],
    };

    const [result] = await client.annotateImage(request);

    const faceAnnotations = result.faceAnnotations || [];
    const faceCount = faceAnnotations.length;

    if (faceCount === 0) {
      console.log('얼굴이 감지되지 않았습니다.');
      return {
        faceDetected: false,
        faceCount: 0,
        faceLandmarks: null,
        faceAttributes: undefined,
        faceBounds: [],
        labels: result.labelAnnotations || [],
        dominantColors: result.imagePropertiesAnnotation?.dominantColors?.colors as DominantColor[] || [],
        text: result.textAnnotations || [],
        eyeMakeupLandmarks: null,
        lipMakeupAnalysis: null,
        skinToneAnalysis: null,
        blemishDetection: null,
        skinTextureAnalysis: null,
        contourAnalysis: null,
      };
    }

    let targetFace = faceAnnotations[0];
    let maxArea = 0;

    faceAnnotations.forEach((face) => {
      const vertices = face.boundingPoly?.vertices || [];
      if (vertices.length >= 2) {
        const width = (vertices[1].x || 0) - (vertices[0].x || 0);
        const height = (vertices[2]?.y || 0) - (vertices[0]?.y || 0);
        const area = width * height;
        if (area > maxArea) {
          maxArea = area;
          targetFace = face;
        }
      }
    });

    const faceAttributes: FaceAttributes = {
      joy: targetFace.joyLikelihood === 'VERY_LIKELY' ? 1 : targetFace.joyLikelihood === 'LIKELY' ? 0.8 : targetFace.joyLikelihood === 'POSSIBLE' ? 0.6 : 0,
      sorrow: targetFace.sorrowLikelihood === 'VERY_LIKELY' ? 1 : targetFace.sorrowLikelihood === 'LIKELY' ? 0.8 : targetFace.sorrowLikelihood === 'POSSIBLE' ? 0.6 : 0,
      anger: targetFace.angerLikelihood === 'VERY_LIKELY' ? 1 : targetFace.angerLikelihood === 'LIKELY' ? 0.8 : targetFace.angerLikelihood === 'POSSIBLE' ? 0.6 : 0,
      surprise: targetFace.surpriseLikelihood === 'VERY_LIKELY' ? 1 : targetFace.surpriseLikelihood === 'LIKELY' ? 0.8 : targetFace.surpriseLikelihood === 'POSSIBLE' ? 0.6 : 0,
      confidence: targetFace.detectionConfidence || 0,
    };

    let faceBounds: BoundingBox[] = [];
    const vertices = targetFace.boundingPoly?.vertices;

    if (vertices && vertices.length >= 3) {
      faceBounds = [
        {
          x: vertices[0].x || 0,
          y: vertices[0].y || 0,
          width: (vertices[1].x || 0) - (vertices[0].x || 0),
          height: (vertices[2].y || 0) - (vertices[0].y || 0),
        },
      ];
    }
    
    const rawLandmarks = targetFace.landmarks || [];
    const labels = result.labelAnnotations || [];
    const dominantColors = result.imagePropertiesAnnotation?.dominantColors?.colors as DominantColor[] || [];
    const text = result.textAnnotations || [];

    // 아이/립 메이크업 랜드마크 필터링 로직
    const eyeMakeupLandmarks = rawLandmarks.filter(landmark => {
      const typeString = landmark.type?.toString() || '';
      return typeString.includes('EYE') || typeString.includes('BROW') || typeString.includes('PUPIL');
    });
    const lipLandmarks = rawLandmarks.filter(landmark => {
      const typeString = landmark.type?.toString() || '';
      return typeString.includes('LIP') || typeString.includes('MOUTH');
    });

    // 베이스 메이크업 전용 데이터 추출
    const skinToneAnalysis: SkinToneAnalysis = {
      faceDominantColor: dominantColors[0] || null,
      neckDominantColor: null,
      colorDifference: null,
    };
    const blemishDetection: BlemishDetection = {
      blemishLabels: labels.filter(l => ['acne', 'pimple', 'blemish'].some(kw => l.description?.toLowerCase().includes(kw))).map(l => l.description as string) || [],
      hasBlemishes: false,
    };
    const skinTextureAnalysis: SkinTextureAnalysis = {
      textureType: 'unknown',
      textureUniformity: null,
    };
    const contourAnalysis: ContourAnalysis = {
      contourLabels: labels.filter(l => ['contour', 'shading', 'makeup'].some(kw => l.description?.toLowerCase().includes(kw))).map(l => l.description as string) || [],
    };
    
    // 립 메이크업 전용 분석 수행 - 새로운 분석 기능 추가
    const faceColor = skinToneAnalysis.faceDominantColor?.color || { red: 200, green: 150, blue: 120 };
    const lipColorAnalysis = analyzeLipColor(lipLandmarks as Array<{type: string; position: {x: number; y: number; z: number}}>, dominantColors, faceColor);
    const lipApplicationAnalysis = analyzeLipApplication(lipLandmarks as Array<{type: string; position: {x: number; y: number; z: number}}>, dominantColors);
    const lipConditionAnalysis = analyzeLipCondition(dominantColors, labels as Array<{description: string; score: number}>);
    
    const lipMakeupAnalysis: LipMakeupAnalysis = {
      lipLandmarks: lipLandmarks,
      lipColor: null,
      lipColorAnalysis,
      lipApplicationAnalysis,
      lipConditionAnalysis,
    };
    
    console.log('Vision API 응답 파싱 완료');

    return {
      faceDetected: true,
      faceCount: 1,
      faceLandmarks: rawLandmarks, // 모든 랜드마크는 그대로 반환
      faceAttributes,
      faceBounds,
      labels,
      dominantColors,
      text,
      eyeMakeupLandmarks,
      lipMakeupAnalysis,
      skinToneAnalysis,
      blemishDetection,
      skinTextureAnalysis,
      contourAnalysis,
    };
  } catch (error) {
    console.error('Google Cloud Vision API 오류:', error);

    if (error instanceof Error && error.message.includes('billing')) {
      throw new Error('API 결제가 활성화되지 않았습니다.');
    } else if (error instanceof Error) {
      throw new Error('이미지 분석 중 알 수 없는 오류가 발생했습니다. ' + error.message);
    } else {
      throw new Error('알 수 없는 오류가 발생했습니다.');
    }
  }
}