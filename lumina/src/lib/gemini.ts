import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

export interface MakeupAnalysisPrompt {
  imageUrl: string;
  analysisType: 'eye' | 'base' | 'lip' | 'overall';
  previousAnalysis?: any;
  visionAnalysis?: any;
}

export interface MakeupAnalysisResult {
  score: number;
  feedback: string;
  improvements?: string[];
}

export async function generateMakeupAnalysis(prompt: MakeupAnalysisPrompt): Promise<MakeupAnalysisResult> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const systemPrompt = `당신은 전문 메이크업 아티스트입니다. 
    사용자의 메이크업 사진을 분석하여 반드시 점수와 피드백을 제공해주세요.
    
    ⚠️ 중요: 반드시 60-100점 사이의 정확한 점수를 제공해야 합니다. 점수를 제공하지 않으면 안됩니다.
    
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
    3. 실제로 적용 가능한 조언 제공
    4. 한국어로 자연스럽게 작성
    5. 전문적이지만 친근한 톤 사용`;

    const visionContext = prompt.visionAnalysis ? 
      `\n\nVision AI 분석 결과:\n${JSON.stringify(prompt.visionAnalysis, null, 2)}` : '';

    const userPrompt = `이 ${prompt.analysisType} 메이크업을 분석해주세요. 
    
    ⚠️ 필수 요구사항:
    1. 반드시 60-100점 사이의 정확한 점수를 제공해야 합니다
    2. 점수를 제공하지 않으면 안됩니다
    3. 유효한 JSON 형태로만 응답하세요
    4. 다른 설명이나 텍스트는 포함하지 마세요
    
    {
      "score": [60-100 사이의 실제 점수],
      "feedback": "구체적인 피드백 내용",
      "improvements": ["개선점1", "개선점2"]
    }${visionContext}`;

    const result = await model.generateContent([
      systemPrompt,
      {
        inlineData: {
          data: await fetchImageAsBase64(prompt.imageUrl),
          mimeType: "image/jpeg"
        }
      },
      userPrompt
    ]);

    const response = await result.response;
    const text = response.text();
    
    try {
      // ```json 형태의 응답에서 JSON 부분만 추출
      let jsonText = text;
      if (text.includes('```json')) {
        const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
          jsonText = jsonMatch[1];
        }
      }
      
      // JSON 파싱 시도
      const parsed = JSON.parse(jsonText);
      console.log('Gemini 응답 파싱 성공:', parsed);
      
      // 점수가 없으면 에러 발생
      if (!parsed.score || parsed.score < 60 || parsed.score > 100) {
        throw new Error('Gemini가 유효한 점수를 제공하지 않았습니다.');
      }
      
      return {
        score: parsed.score,
        feedback: parsed.feedback || "분석 결과를 생성할 수 없습니다.",
        improvements: parsed.improvements || []
      };
    } catch (parseError) {
      console.error('JSON 파싱 오류:', parseError);
      console.error('원본 텍스트:', text);
      
      // JSON 파싱 실패 시 텍스트에서 점수 추출 시도
      const scoreMatch = text.match(/"score":\s*(\d+)/);
      const feedbackMatch = text.match(/"feedback":\s*"([^"]+)"/);
      
      if (scoreMatch) {
        const extractedScore = parseInt(scoreMatch[1]);
        if (extractedScore >= 60 && extractedScore <= 100) {
          return {
            score: extractedScore,
            feedback: feedbackMatch ? feedbackMatch[1] : text || "분석 결과를 생성할 수 없습니다.",
            improvements: []
          };
        }
      }
      
      // 모든 파싱 실패 시 에러 발생
      throw new Error('Gemini가 유효한 점수를 제공하지 않았습니다. 원본 응답: ' + text);
    }
  } catch (error) {
    console.error('Gemini API 오류:', error);
    throw new Error('AI 피드백 생성에 실패했습니다.');
  }
}

// 기존 함수 호환성을 위한 래퍼
export async function generateMakeupFeedback(prompt: MakeupAnalysisPrompt): Promise<string> {
  const result = await generateMakeupAnalysis(prompt);
  return result.feedback;
}

export async function generateOverallAnalysis(imageUrl: string, visionAnalysis: any): Promise<MakeupAnalysisResult> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const systemPrompt = `당신은 전문 메이크업 아티스트입니다. 
    사용자의 전체 메이크업을 종합적으로 분석하여 반드시 점수와 피드백을 제공해주세요.
    
    ⚠️ 중요: 반드시 60-100점 사이의 정확한 점수를 제공해야 합니다. 점수를 제공하지 않으면 안됩니다.
    
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
    2. 점수에 따른 구체적인 개선점 제시
    3. 잘된 부분과 개선이 필요한 부분 균형있게 언급
    4. 실제로 적용 가능한 조언 제공
    5. 한국어로 자연스럽게 작성
    6. 3-4문장으로 종합적인 피드백 제공`;

    const visionContext = visionAnalysis ? 
      `\n\nVision AI 분석 결과:\n${JSON.stringify(visionAnalysis, null, 2)}` : '';

    const userPrompt = `이 메이크업의 전체적인 분석과 개선점을 알려주세요.
    
    ⚠️ 필수 요구사항:
    1. 반드시 60-100점 사이의 정확한 점수를 제공해야 합니다
    2. 점수를 제공하지 않으면 안됩니다
    3. 유효한 JSON 형태로만 응답하세요
    4. 다른 설명이나 텍스트는 포함하지 마세요
    
    {
      "score": [60-100 사이의 실제 점수],
      "feedback": "종합적인 피드백 내용",
      "improvements": ["전체 개선점1", "전체 개선점2"]
    }${visionContext}`;

    const result = await model.generateContent([
      systemPrompt,
      {
        inlineData: {
          data: await fetchImageAsBase64(imageUrl),
          mimeType: "image/jpeg"
        }
      },
      userPrompt
    ]);

    const response = await result.response;
    const text = response.text();
    
    try {
      // ```json 형태의 응답에서 JSON 부분만 추출
      let jsonText = text;
      if (text.includes('```json')) {
        const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
          jsonText = jsonMatch[1];
        }
      }
      
      // JSON 파싱 시도
      const parsed = JSON.parse(jsonText);
      console.log('Gemini 전체 분석 응답 파싱 성공:', parsed);
      
      // 점수가 없으면 에러 발생
      if (!parsed.score || parsed.score < 60 || parsed.score > 100) {
        throw new Error('Gemini가 유효한 점수를 제공하지 않았습니다.');
      }
      
      return {
        score: parsed.score,
        feedback: parsed.feedback || "종합 분석 결과를 생성할 수 없습니다.",
        improvements: parsed.improvements || []
      };
    } catch (parseError) {
      console.error('JSON 파싱 오류:', parseError);
      console.error('원본 텍스트:', text);
      
      // JSON 파싱 실패 시 텍스트에서 점수 추출 시도
      const scoreMatch = text.match(/"score":\s*(\d+)/);
      const feedbackMatch = text.match(/"feedback":\s*"([^"]+)"/);
      
      if (scoreMatch) {
        const extractedScore = parseInt(scoreMatch[1]);
        if (extractedScore >= 60 && extractedScore <= 100) {
          return {
            score: extractedScore,
            feedback: feedbackMatch ? feedbackMatch[1] : text || "종합 분석 결과를 생성할 수 없습니다.",
            improvements: []
          };
        }
      }
      
      // 모든 파싱 실패 시 에러 발생
      throw new Error('Gemini가 유효한 점수를 제공하지 않았습니다. 원본 응답: ' + text);
    }
  } catch (error) {
    console.error('Gemini API 오류:', error);
    throw new Error('종합 피드백 생성에 실패했습니다.');
  }
}

// 기존 함수 호환성을 위한 래퍼
export async function generateOverallFeedback(imageUrl: string, scores: any): Promise<string> {
  const result = await generateOverallAnalysis(imageUrl, null);
  return result.feedback;
}

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
