import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface MakeupAnalysisPrompt {
  imageUrl: string;
  analysisType: 'eye' | 'base' | 'lip' | 'overall';
  previousAnalysis?: any;
}

export async function generateMakeupFeedback(prompt: MakeupAnalysisPrompt): Promise<string> {
  try {
    const systemPrompt = `당신은 전문 메이크업 아티스트입니다. 
    사용자의 메이크업 사진을 분석하여 구체적이고 개인화된 피드백을 제공해주세요.
    
    피드백 작성 가이드라인:
    1. 구체적인 개선점과 칭찬을 균형있게 제공
    2. 실제로 적용 가능한 조언 제공
    3. 한국어로 자연스럽게 작성
    4. 2-3문장으로 간결하게 작성
    5. 전문적이지만 친근한 톤 사용`;

    const userPrompt = `이 ${prompt.analysisType} 메이크업을 분석해주세요. 
    구체적인 개선점과 잘된 부분을 균형있게 피드백해주세요.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: userPrompt
            },
            {
              type: "image_url",
              image_url: {
                url: prompt.imageUrl
              }
            }
          ]
        }
      ],
      max_tokens: 200,
      temperature: 0.7
    });

    return response.choices[0].message.content || "분석 결과를 생성할 수 없습니다.";
  } catch (error) {
    console.error('OpenAI API 오류:', error);
    throw new Error('AI 피드백 생성에 실패했습니다.');
  }
}

export async function generateOverallFeedback(imageUrl: string, scores: any): Promise<string> {
  try {
    const systemPrompt = `당신은 전문 메이크업 아티스트입니다. 
    사용자의 전체 메이크업을 종합적으로 분석하여 개인화된 피드백을 제공해주세요.
    
    현재 점수:
    - 아이 메이크업: ${scores.eyeScore}점
    - 베이스 메이크업: ${scores.baseScore}점  
    - 립 메이크업: ${scores.lipScore}점
    - 전체 점수: ${scores.overallScore}점
    
    피드백 작성 가이드라인:
    1. 점수에 따른 구체적인 개선점 제시
    2. 잘된 부분과 개선이 필요한 부분 균형있게 언급
    3. 실제로 적용 가능한 조언 제공
    4. 한국어로 자연스럽게 작성
    5. 3-4문장으로 종합적인 피드백 제공`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "이 메이크업의 전체적인 분석과 개선점을 알려주세요."
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl
              }
            }
          ]
        }
      ],
      max_tokens: 300,
      temperature: 0.7
    });

    return response.choices[0].message.content || "종합 분석 결과를 생성할 수 없습니다.";
  } catch (error) {
    console.error('OpenAI API 오류:', error);
    throw new Error('종합 피드백 생성에 실패했습니다.');
  }
}
