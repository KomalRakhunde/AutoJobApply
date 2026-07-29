import { Injectable } from '@nestjs/common';
import { OpenRouterService } from './openrouter.service';

@Injectable()
export class AiService {
  constructor(private readonly openRouter: OpenRouterService) {}

  async atsScore(resume: string) {
    return this.openRouter.generate(`
Give an ATS score (0-100) for this resume.
Return only JSON.

Resume:
${resume}
`);
  }

  async resumeAnalysis(resume: string) {
    return this.openRouter.generate(`
Analyze this resume.

Return:
1. ATS Score
2. Strengths
3. Weaknesses
4. Missing Skills
5. Suggestions

Resume:
${resume}
`);
  }

  async coverLetter(resume: string, jobDescription: string) {
    return this.openRouter.generate(`
Write a professional cover letter.

Resume:
${resume}

Job Description:
${jobDescription}
`);
  }

  async interviewQuestions(jobRole: string) {
    return this.openRouter.generate(`
Generate 15 technical interview questions with answers for ${jobRole}.
`);
  }
}