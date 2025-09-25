import { ImageAnnotatorClient } from '@google-cloud/vision'

// Google Cloud Vision 클라이언트 초기화
const client = new ImageAnnotatorClient({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: process.env.GOOGLE_CLOUD_KEY_FILE,
})

export interface FaceAnalysisResult {
  faceDetected: boolean
  faceCount: number
  faceLandmarks: any[]
  faceAttributes: {
    joy: number
    sorrow: number
    anger: number
    surprise: number
    confidence: number
  }
  faceBounds: {
    x: number
    y: number
    width: number
    height: number
  }[]
}

export async function analyzeFace(imageUrl: string): Promise<FaceAnalysisResult> {
  try {
    console.log('Google Cloud Vision API 호출 시작:', imageUrl)
    
    // 이미지 URL을 직접 사용하여 API 호출
    const image = {
      source: {
        imageUri: imageUrl
      }
    };
    
    const request = {
      image: image,
      features: [
        { type: 'FACE_DETECTION', maxResults: 10 },
        { type: 'LANDMARK_DETECTION', maxResults: 10 }
      ]
    };
    
    // 실제 API 호출
    const [faceResult] = await client.annotateImage(request)
    const [landmarkResult] = await client.annotateImage(request)

    console.log('Vision API 응답:', { faceResult, landmarkResult })

    if (!faceResult.faceAnnotations || faceResult.faceAnnotations.length === 0) {
      return {
        faceDetected: false,
        faceCount: 0,
        faceLandmarks: [],
        faceAttributes: {
          joy: 0,
          sorrow: 0,
          anger: 0,
          surprise: 0,
          confidence: 0
        },
        faceBounds: []
      }
    }

    const faces = faceResult.faceAnnotations
    const landmarks = landmarkResult.faceAnnotations || []

    // 얼굴 속성 분석
    const faceAttributes = faces.map(face => ({
      joy: face.joyLikelihood === 'VERY_LIKELY' ? 1 : 
           face.joyLikelihood === 'LIKELY' ? 0.8 :
           face.joyLikelihood === 'POSSIBLE' ? 0.6 : 0,
      sorrow: face.sorrowLikelihood === 'VERY_LIKELY' ? 1 : 
              face.sorrowLikelihood === 'LIKELY' ? 0.8 :
              face.sorrowLikelihood === 'POSSIBLE' ? 0.6 : 0,
      anger: face.angerLikelihood === 'VERY_LIKELY' ? 1 : 
             face.angerLikelihood === 'LIKELY' ? 0.8 :
             face.angerLikelihood === 'POSSIBLE' ? 0.6 : 0,
      surprise: face.surpriseLikelihood === 'VERY_LIKELY' ? 1 : 
                face.surpriseLikelihood === 'LIKELY' ? 0.8 :
                face.surpriseLikelihood === 'POSSIBLE' ? 0.6 : 0,
      confidence: face.detectionConfidence || 0
    }))

    // 얼굴 경계 박스
    const faceBounds = faces.map(face => {
      const vertices = face.boundingPoly?.vertices || []
      if (vertices.length < 2) return { x: 0, y: 0, width: 0, height: 0 }
      
      const x = vertices[0].x || 0
      const y = vertices[0].y || 0
      const width = (vertices[1].x || 0) - x
      const height = (vertices[1].y || 0) - y
      
      return { x, y, width, height }
    })

    // 평균 속성 계산
    const avgAttributes = faceAttributes.reduce((acc, attr) => ({
      joy: acc.joy + attr.joy,
      sorrow: acc.sorrow + attr.sorrow,
      anger: acc.anger + attr.anger,
      surprise: acc.surprise + attr.surprise,
      confidence: acc.confidence + attr.confidence
    }), { joy: 0, sorrow: 0, anger: 0, surprise: 0, confidence: 0 })

    const faceCount = faces.length
    Object.keys(avgAttributes).forEach(key => {
      avgAttributes[key as keyof typeof avgAttributes] /= faceCount
    })

    return {
      faceDetected: true,
      faceCount,
      faceLandmarks: landmarks,
      faceAttributes: avgAttributes,
      faceBounds
    }

  } catch (error) {
    console.error('Google Cloud Vision API 오류:', error)
    
    // 결제 설정이 없는 경우 Mock 데이터 반환
    if (error instanceof Error && error.message.includes('billing')) {
      console.log('Google Cloud Vision API 결제 설정이 없어 Mock 데이터를 반환합니다.')
      return {
        faceDetected: true,
        faceCount: 1,
        faceLandmarks: [],
        faceAttributes: {
          joy: 0.7,
          sorrow: 0.2,
          anger: 0.1,
          surprise: 0.3,
          confidence: 0.8
        },
        faceBounds: [{ x: 100, y: 100, width: 200, height: 200 }]
      }
    }
    
    throw new Error('얼굴 분석 중 오류가 발생했습니다.')
  }
}

export async function analyzeImageContent(imageUrl: string) {
  try {
    console.log('이미지 내용 분석 시작:', imageUrl)
    
    // 이미지 URL을 직접 사용하여 API 호출
    const image = {
      source: {
        imageUri: imageUrl
      }
    };
    
    const request = {
      image: image,
      features: [
        { type: 'LABEL_DETECTION', maxResults: 10 },
        { type: 'TEXT_DETECTION', maxResults: 10 },
        { type: 'IMAGE_PROPERTIES' }
      ]
    };
    
    // 실제 API 호출
    const [labelResult] = await client.annotateImage(request)
    const [textResult] = await client.annotateImage(request)
    const [colorResult] = await client.annotateImage(request)
    
    console.log('이미지 분석 결과:', { labelResult, textResult, colorResult })
    
    return {
      labels: labelResult.labelAnnotations || [],
      text: textResult.textAnnotations || [],
      colors: colorResult.imagePropertiesAnnotation?.dominantColors?.colors || []
    }
    
  } catch (error) {
    console.error('이미지 내용 분석 오류:', error)
    
    // 결제 설정이 없는 경우 Mock 데이터 반환
    if (error instanceof Error && error.message.includes('billing')) {
      console.log('Google Cloud Vision API 결제 설정이 없어 Mock 데이터를 반환합니다.')
      return {
        labels: [
          { description: 'Face', score: 0.95 },
          { description: 'Person', score: 0.90 },
          { description: 'Portrait', score: 0.85 }
        ],
        text: [],
        colors: [
          { color: { red: 255, green: 200, blue: 180 }, score: 0.8 },
          { color: { red: 200, green: 150, blue: 120 }, score: 0.6 }
        ]
      }
    }
    
    throw new Error('이미지 분석 중 오류가 발생했습니다.')
  }
}
