import { NextResponse } from 'next/server';
import { generateGroqJSON } from '@/services/ai/groq';

export async function POST(req: Request) {
  try {
    const { jobTitle, jobDescription, difficulty = 'Intermediate', questionCount = 5 } = await req.json();

    if (!jobTitle || typeof jobTitle !== 'string') {
      return NextResponse.json(
        { message: 'Job title is required to generate interview questions.' },
        { status: 400 }
      );
    }

    const systemPrompt = `You are an expert Technical Hiring Manager and Interview Panelist.
Generate realistic, high-quality interview questions for the specified target role and difficulty level.
Return a JSON object with this exact structure:
{
  "questions": [
    {
      "id": "q-1",
      "category": "Technical" | "Behavioral" | "System Design" | "Problem Solving",
      "question": "The question text",
      "difficulty": "Easy" | "Intermediate" | "Hard",
      "sampleAnswer": "Ideal high-scoring response model",
      "keyTalkingPoints": ["Point 1", "Point 2", "Point 3"]
    }
  ]
}`;

    const userPrompt = `
TARGET ROLE: ${jobTitle}
DIFFICULTY: ${difficulty}
QUESTION COUNT: ${questionCount}
JOB DESCRIPTION (OPTIONAL): ${jobDescription || 'N/A'}
`;

    const result = await generateGroqJSON(systemPrompt, userPrompt);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Interview Questions Error:', error);
    return NextResponse.json(
      { message: error?.message || 'Failed to generate interview questions with Groq LLM.' },
      { status: 500 }
    );
  }
}
