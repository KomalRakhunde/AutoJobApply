import { NextResponse } from 'next/server';
import { generateGroqText } from '@/services/ai/groq';

export async function POST(req: Request) {
  try {
    const { resumeText, jobDescription, style = 'professional' } = await req.json();

    if (!jobDescription || typeof jobDescription !== 'string') {
      return NextResponse.json(
        { message: 'Job description is required to generate a cover letter.' },
        { status: 400 }
      );
    }

    const systemPrompt = `You are an expert Executive Career Coach and Resume Writer.
Draft a highly persuasive, tailored cover letter based on the candidate's resume text and target job description.
Style tone: ${style} (e.g. professional, creative, modern, confident).
Return ONLY the cover letter text formatted nicely with line breaks. Do not wrap in JSON or add introductory conversational text.`;

    const userPrompt = `
CANDIDATE RESUME:
${(resumeText || 'Highlight general software engineering & technology skills').slice(0, 6000)}

JOB DESCRIPTION:
${jobDescription.slice(0, 4000)}
`;

    const letter = await generateGroqText(systemPrompt, userPrompt);
    return NextResponse.json({ coverLetter: letter });
  } catch (error: any) {
    console.error('Cover Letter Error:', error);
    return NextResponse.json(
      { message: error?.message || 'Failed to generate cover letter with Groq LLM.' },
      { status: 500 }
    );
  }
}
