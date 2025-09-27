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

export interface VisionAnalysisResult {
  faceDetected: boolean;
  faceCount: number;
  faceLandmarks?: protos.google.cloud.vision.v1.FaceAnnotation.ILandmark[] | null;
  faceAttributes?: FaceAttributes;
  faceBounds?: BoundingBox[];
  labels?: protos.google.cloud.vision.v1.IEntityAnnotation[] | null;
  dominantColors?: DominantColor[] | null;
  text?: protos.google.cloud.vision.v1.IEntityAnnotation[] | null;
}

/**
 * 이미지 URL을 분석하여 얼굴, 라벨, 색상 데이터를 추출합니다.
 * @param imageUrl 분석할 이미지의 URL
 * @returns VisionAnalysisResult 객체
 */
export async function analyzeImage(imageUrl: string): Promise<VisionAnalysisResult> {
  try {
    console.log('Google Cloud Vision API 호출 시작:', imageUrl);

    const image = {
      source: {
        imageUri: imageUrl,
      },
    };

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

    // 얼굴이 감지되지 않았을 때 처리
    if (faceCount === 0) {
      console.log('얼굴이 감지되지 않았습니다.');
      return {
        faceDetected: false,
        faceCount: 0,
        faceLandmarks: [],
        faceAttributes: undefined,
        faceBounds: [],
        labels: result.labelAnnotations || [],
        dominantColors: result.imagePropertiesAnnotation?.dominantColors?.colors as DominantColor[] || [],
        text: result.textAnnotations || [],
      };
    }

    // 분석할 단일 얼굴 선택 (가장 큰 얼굴)
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

    // 선택된 단일 얼굴에 대한 데이터 추출 및 가공
    
    // (A) 얼굴 감정 속성 추출
    const faceAttributes: FaceAttributes = {
      joy: targetFace.joyLikelihood === 'VERY_LIKELY' ? 1 : targetFace.joyLikelihood === 'LIKELY' ? 0.8 : targetFace.joyLikelihood === 'POSSIBLE' ? 0.6 : 0,
      sorrow: targetFace.sorrowLikelihood === 'VERY_LIKELY' ? 1 : targetFace.sorrowLikelihood === 'LIKELY' ? 0.8 : targetFace.sorrowLikelihood === 'POSSIBLE' ? 0.6 : 0,
      anger: targetFace.angerLikelihood === 'VERY_LIKELY' ? 1 : targetFace.angerLikelihood === 'LIKELY' ? 0.8 : targetFace.angerLikelihood === 'POSSIBLE' ? 0.6 : 0,
      surprise: targetFace.surpriseLikelihood === 'VERY_LIKELY' ? 1 : targetFace.surpriseLikelihood === 'LIKELY' ? 0.8 : targetFace.surpriseLikelihood === 'POSSIBLE' ? 0.6 : 0,
      confidence: targetFace.detectionConfidence || 0,
    };

    // (B) 얼굴 경계 박스 계산 (x, y, width, height)
    const faceBounds: BoundingBox[] = [
      {
        x: targetFace.boundingPoly?.vertices[0]?.x || 0,
        y: targetFace.boundingPoly?.vertices[0]?.y || 0,
        width: (targetFace.boundingPoly?.vertices[1]?.x || 0) - (targetFace.boundingPoly?.vertices[0]?.x || 0),
        height: (targetFace.boundingPoly?.vertices[2]?.y || 0) - (targetFace.boundingPoly?.vertices[0]?.y || 0),
      },
    ];

    // (C) 눈과 눈썹 관련 랜드마크만 필터링
    const rawLandmarks = targetFace.landmarks || [];
    const eyeAndBrowLandmarks = rawLandmarks.filter(landmark => {
      // landmark.type이 Enum이므로 toString()을 사용하여 includes() 호출
      const typeString = landmark.type?.toString() || '';
      return typeString.includes('EYE') || typeString.includes('BROW') || typeString.includes('PUPIL');
    });

    // (D) 기타 이미지 속성
    const labels = result.labelAnnotations || [];
    // `as DominantColor[]`를 사용해 타입 강제 변환 (안정성 확보)
    const dominantColors = result.imagePropertiesAnnotation?.dominantColors?.colors as DominantColor[] || [];
    const text = result.textAnnotations || [];

    console.log('Vision API 응답 파싱 완료');

    return {
      faceDetected: true,
      faceCount: 1, // 가장 중요한 얼굴 하나만 반환
      faceLandmarks: eyeAndBrowLandmarks, // 정제된 랜드마크
      faceAttributes,
      faceBounds,
      labels,
      dominantColors,
      text,
    };
  } catch (error) {
    console.error('Google Cloud Vision API 오류:', error);

    // 에러 타입 확인 로직 강화
    if (error instanceof Error && error.message.includes('billing')) {
      throw new Error('API 결제가 활성화되지 않았습니다.');
    } else if (error instanceof Error) {
      throw new Error('이미지 분석 중 알 수 없는 오류가 발생했습니다. ' + error.message);
    } else {
      throw new Error('알 수 없는 오류가 발생했습니다.');
    }
  }
}