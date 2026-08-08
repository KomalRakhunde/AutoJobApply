import { NextResponse } from 'next/server';
import { generateGroqJSON } from '@/services/ai/groq';

export async function POST(req: Request) {
  try {
    const { targetRole, currentSkills = [], timeframeMonths = 6 } = await req.json();

    if (!targetRole || typeof targetRole !== 'string') {
      return NextResponse.json(
        { message: 'Target role is required to generate a career roadmap.' },
        { status: 400 }
      );
    }

    const systemPrompt = `You are an elite Career Mentor and Engineering Lead.
Create a structured, step-by-step learning and career progression roadmap for achieving the target role.
Return a JSON object with this exact structure:
{
  "targetRole": string,
  "estimatedTimeframe": string,
  "summary": string,
  "phases": [
    {
      "phaseNumber": number,
      "title": string,
      "duration": string,
      "description": string,
      "keySkillsToLearn": string[],
      "recommendedProjects": string[],
      "certificationsOrMilestones": string[]
    }
  ],
  "recommendedResources": string[]
}`;

    const userPrompt = `
TARGET ROLE: ${targetRole}
CURRENT SKILLS: ${Array.isArray(currentSkills) ? currentSkills.join(', ') : currentSkills}
TIMEFRAME (MONTHS): ${timeframeMonths}
`;

    const result = await generateGroqJSON(systemPrompt, userPrompt);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Career Roadmap Error:', error);
    return NextResponse.json(
      { message: error?.message || 'Failed to generate career roadmap with Groq LLM.' },
      { status: 500 }
    );
  }
}
