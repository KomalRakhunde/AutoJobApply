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
}