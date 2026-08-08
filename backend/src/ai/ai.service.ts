import { Injectable } from '@nestjs/common';
import { OpenRouterService } from './openrouter.service';

@Injectable()
export class AiService {
  constructor(private readonly openRouter: OpenRouterService) {}

  async atsScore(resumeText: string, jobDescription?: string) {
    return this.openRouter.generate(`
You are an ATS Resume Analyzer.

Return ONLY valid JSON in this exact format:

{
  "score": 0,
  "breakdown": {
    "keywordMatch": 0,
    "formatting": 0,
    "completeness": 0
  },
  "matchedKeywords": [],
  "missingKeywords": []
}

Resume:
${resumeText}

Job Description:
${jobDescription ?? 'Not Provided'}
`);
  }

  async resumeAnalysis(resumeText: string) {
    return this.openRouter.generate(`
Analyze this resume.

Return ONLY valid JSON in this exact format:

{
  "overallScore": 0,
  "strengths": [],
  "weaknesses": [],
  "suggestions": [],
  "redFlags": []
}

Resume:
${resumeText}
`);
  }

  async coverLetter(resumeText: string, jobDescription: string) {
    return this.openRouter.generate(`
Write a professional cover letter.

Resume:
${resumeText}

Job Description:
${jobDescription}
`);
  }

  async interviewQuestions(jobTitle: string) {
    return this.openRouter.generate(`
Generate interview questions.

Return ONLY valid JSON:

{
  "technical": [],
  "hr": [],
  "coding": [],
  "behavioral": []
}

Job Role:
${jobTitle}
`);
  }

  async evaluateRecruiterCandidate(resumeText: string, jobDescription: string, requirements?: string) {
    return this.openRouter.generate(`
You are an expert AI Talent Acquisition Specialist and ATS Evaluator.
Analyze the following resume against the job description and requirements.

Return ONLY valid JSON with no markdown formatting, using this exact schema:

{
  "name": "Extracted Candidate Name or 'Unknown Candidate'",
  "email": "Extracted Email or 'unknown@example.com'",
  "phone": "Extracted Phone or ''",
  "skills": ["Skill 1", "Skill 2"],
  "experienceSummary": "Brief overview of key past experience",
  "overallScore": 85,
  "summary": "A concise 1-paragraph summary highlighting candidate's fit for this role, key qualifications, and suitability.",
  "strengths": ["Strength 1", "Strength 2"],
  "gaps": ["Gap or missing requirement 1"]
}

Job Description:
${jobDescription}

Job Requirements:
${requirements ?? 'Not specified'}

Resume Content:
${resumeText}
`);
  }
}