import { NextResponse } from 'next/server';
import { generateGroqJSON } from '@/services/ai/groq';

export async function POST(req: Request) {
  try {
    const { resumeText, jobDescription } = await req.json();

    if (!resumeText || typeof resumeText !== 'string' || resumeText.trim().length === 0) {
      return NextResponse.json(
        { message: 'Resume text is required for ATS scoring.' },
        { status: 400 }
      );
    }

    const systemPrompt = `You are an expert AI Resume Evaluator and ATS (Applicant Tracking System) Scanner.
FIRST, determine if the provided text is actually a professional resume/CV (containing work experience, education, technical or soft skills, projects, contact info, etc.).
If the text is NOT a resume (e.g. random non-resume document, essay, recipe, code file, blank text, or junk text):
- Set "score" to a very low number between 0 and 10.
- List "missingKeywords" with essential resume components ("Work Experience", "Education", "Technical Skills", "Contact Details").
- In "suggestions", explicitly state: "CRITICAL: The uploaded file is NOT a valid professional resume. Please upload a PDF resume containing your work experience and skills."

If the text IS a resume, analyze it thoroughly against the job description (or technical industry standards).
Return a JSON object with this exact structure:
{
  "isResume": boolean,
  "score": number (0-100),
  "breakdown": {
    "keywordMatch": number (0-100),
    "skillsRelevance": number (0-100),
    "experienceImpact": number (0-100),
    "formattingStructure": number (0-100)
  },
  "matchedKeywords": string[],
  "missingKeywords": string[],
  "suggestions": string[]
}`;

    const userPrompt = `
DOCUMENT TEXT TO EVALUATE:
${resumeText.slice(0, 8000)}

TARGET JOB DESCRIPTION:
${(jobDescription || 'Target software development & technical industry standards').slice(0, 4000)}
`;

    const result = await generateGroqJSON(systemPrompt, userPrompt);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('ATS Score Error:', error);
    return NextResponse.json(
      { message: error?.message || 'Failed to process ATS score with Groq LLM.' },
      { status: 500 }
    );
  }
}
