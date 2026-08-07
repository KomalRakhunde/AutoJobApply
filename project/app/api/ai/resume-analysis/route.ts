import { NextResponse } from 'next/server';
import { generateGroqJSON } from '@/services/ai/groq';

export async function POST(req: Request) {
  try {
    const { resumeText } = await req.json();

    if (!resumeText || typeof resumeText !== 'string' || resumeText.trim().length === 0) {
      return NextResponse.json(
        { message: 'Resume text is required for analysis.' },
        { status: 400 }
      );
    }

    const systemPrompt = `You are an elite Senior Executive Recruiter & Career Coach.
Analyze the candidate's resume text and provide actionable, high-value structural and strategic feedback.
Return a JSON object with this exact structure:
{
  "summary": "Overall summary of the candidate's profile and resume impression",
  "strengths": ["Strength point 1", "Strength point 2", ...],
  "weaknesses": ["Weakness point 1", "Weakness point 2", ...],
  "actionableSteps": ["Action step 1", "Action step 2", ...],
  "recommendedKeywords": ["Keyword 1", "Keyword 2", ...]
}`;

    const userPrompt = `
RESUME TEXT:
${resumeText.slice(0, 8000)}
`;

    const result = await generateGroqJSON(systemPrompt, userPrompt);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Resume Analysis Error:', error);
    return NextResponse.json(
      { message: error?.message || 'Failed to analyze resume with Groq LLM.' },
      { status: 500 }
    );
  }
}
