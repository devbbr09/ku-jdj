import { ImageAnnotatorClient } from '@google-cloud/vision';
import { protos } from '@google-cloud/vision';

// Google Cloud Vision 클라이언트 초기화
const client = new ImageAnnotatorClient({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
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

export interface LipMakeupAnalysis {
  lipLandmarks: protos.google.cloud.vision.v1.FaceAnnotation.ILandmark[] | null;
  lipColor?: DominantColor | null;
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

    // 베이스 및 립 메이크업 전용 데이터 추출
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
    const lipMakeupAnalysis: LipMakeupAnalysis = {
      lipLandmarks: lipLandmarks,
      lipColor: null,
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