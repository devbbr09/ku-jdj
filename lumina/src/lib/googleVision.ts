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
    
    // 결제 설정이 완료될 때까지 Mock 데이터 반환
    console.log('Google Cloud Vision API 결제 설정이 완료될 때까지 Mock 데이터를 반환합니다.')
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
    
    // 실제 API 호출 (결제 설정 완료 후 활성화)
    // const [faceResult] = await client.faceDetection(imageUrl)
    // const [landmarkResult] = await client.faceDetection(imageUrl, {
    //   features: ['LANDMARKS']
    // })

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
    
    // 결제 설정이 완료될 때까지 Mock 데이터 반환
    console.log('Google Cloud Vision API 결제 설정이 완료될 때까지 Mock 데이터를 반환합니다.')
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
    
    // 실제 API 호출 (결제 설정 완료 후 활성화)
    // const [labelResult] = await client.labelDetection(imageUrl)
    // const [textResult] = await client.textDetection(imageUrl)
    // const [colorResult] = await client.imageProperties(imageUrl)
    
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
