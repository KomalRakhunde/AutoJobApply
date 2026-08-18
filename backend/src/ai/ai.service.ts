import { Injectable, Logger } from '@nestjs/common';
import { OpenRouterService } from './openrouter.service';
import {
  JobJD,
  Resume,
  MatchResult,
  validateJobJD,
  validateResume,
  validateMatchResult,
} from '../recruiters/dto/resume-evaluation-schemas';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(private readonly openRouter: OpenRouterService) {}

  private cleanJsonString(raw: string): string {
    return raw
      .replace(/```(?:json)?/gi, '')
      .replace(/```/g, '')
      .trim();
  }

  // PHASE 2: Job Description Parser
  async parseJobDescription(rawJdText: string): Promise<JobJD> {
    const systemPrompt = `Expert Job Description Parser`;
    const userPrompt = `
You are an expert Job Description Parser. Extract structured JSON from the following Job Description text.

RULES:
- Extract ONLY information explicitly supported by the JD text.
- Never invent requirements.
- Distinguish mandatory "required_skills" from optional "preferred_skills".
- Extract minimum experience in years as a number ("minimum_experience"). If not mentioned, set to 0.
- Educational requirements must be an array of strings. If not mentioned, use [].
- Responsibilities must be an array of strings. If not mentioned, use [].
- Return ONLY valid JSON in this exact structure without markdown backticks:

{
  "role": "Title or Role Name",
  "required_skills": ["Skill 1", "Skill 2"],
  "preferred_skills": ["Skill A", "Skill B"],
  "minimum_experience": 2,
  "educational_requirements": ["Degree / Education"],
  "responsibilities": ["Responsibility 1", "Responsibility 2"]
}

JOB DESCRIPTION TEXT:
${rawJdText}
`;

    try {
      const rawRes = await this.openRouter.generate(userPrompt, systemPrompt);
      const cleaned = this.cleanJsonString(rawRes);
      const parsed = JSON.parse(cleaned);
      return validateJobJD(parsed);
    } catch (err: any) {
      this.logger.error(`Error parsing Job Description with AI: ${err?.message}`);
      return validateJobJD({
        role: 'Software Engineer',
        required_skills: [],
        preferred_skills: [],
        minimum_experience: 0,
        educational_requirements: [],
        responsibilities: [],
      });
    }
  }

  // PHASE 4: Structured Resume Parser
  async parseResumeStructured(resumeText: string): Promise<Resume> {
    const systemPrompt = `Expert Resume Parser`;
    const userPrompt = `
You are an Expert Resume Parser. Parse the following resume text into structured JSON.

RULES:
- Understand that section headings like "Work History", "Employment", "Professional Experience", "Career History", "Internships", and "Work Experience" map to "experiences".
- Calculate total experience years strictly from evidence present in the resume. Freshers are valid (total_experience_years = 0).
- Do NOT hallucinate skills, companies, degrees, certifications, or projects.
- Missing email -> null. Missing phone -> null. Missing name -> null.
- Empty lists default to [].
- Return ONLY valid JSON matching this exact structure without markdown code blocks:

{
  "name": "Candidate Full Name or null",
  "email": "candidate@email.com or null",
  "phone_number": "+123456789 or null",
  "total_experience_years": 3,
  "skills": ["Skill 1", "Skill 2"],
  "experiences": [
    {
      "company_name": "Company",
      "role": "Job Title",
      "duration": "Jan 2021 - Present",
      "description": "Key responsibilities",
      "skills_used": ["Skill A", "Skill B"]
    }
  ],
  "projects": [
    {
      "title": "Project Name",
      "description": "Project summary",
      "technologies": ["Tech 1", "Tech 2"]
    }
  ],
  "certifications": [
    {
      "name": "Cert Name",
      "issuer": "Issuer",
      "year": "2023"
    }
  ]
}

RESUME TEXT:
${resumeText}
`;

    try {
      const rawRes = await this.openRouter.generate(userPrompt, systemPrompt);
      const cleaned = this.cleanJsonString(rawRes);
      const parsed = JSON.parse(cleaned);
      return validateResume(parsed);
    } catch (err: any) {
      this.logger.error(`Error parsing structured resume with AI: ${err?.message}`);
      return validateResume({
        name: null,
        email: null,
        phone_number: null,
        total_experience_years: 0,
        skills: [],
        experiences: [],
        projects: [],
        certifications: [],
      });
    }
  }

  // PHASE 5: HR Candidate Evaluation
  async evaluateCandidateMatch(resumeJson: Resume, jobJd: JobJD, fallbackCandidateName: string = 'Candidate'): Promise<MatchResult> {
    const systemPrompt = `Expert HR Recruiter`;
    const userPrompt = `
You are an Expert HR Recruiter evaluating a candidate against a target Job Description.

EVALUATION RULES:
- Compare candidate skills against "required_skills" and "preferred_skills".
- Required skills carry significantly greater weight than preferred skills.
- Explicitly list all matching skills in "matching_skills" and missing required skills in "missing_critical_skills".
- Compare candidate's total experience (${resumeJson.total_experience_years} years) against job's minimum experience requirement (${jobJd.minimum_experience} years) -> set "experience_requirement_met" (boolean).
- Calculate "score" strictly between 0 and 100 as an integer based on authentic evaluation fit. Do NOT hardcode or return NaN.
- Provide a clear 1-2 sentence "short_final_verdict".
- Do NOT penalize or infer sensitive/protected personal characteristics.
- Return ONLY valid JSON in this exact structure without markdown blocks:

{
  "score": 85,
  "candidate_name": "${resumeJson.name || fallbackCandidateName}",
  "matching_skills": ["Skill 1", "Skill 2"],
  "missing_critical_skills": ["Missing Skill"],
  "experience_requirement_met": true,
  "short_final_verdict": "Strong match meeting required technical skills and experience requirements."
}

JOB SPECIFICATION:
${JSON.stringify(jobJd, null, 2)}

CANDIDATE STRUCTURED PROFILE:
${JSON.stringify(resumeJson, null, 2)}
`;

    try {
      const rawRes = await this.openRouter.generate(userPrompt, systemPrompt);
      const cleaned = this.cleanJsonString(rawRes);
      const parsed = JSON.parse(cleaned);
      return validateMatchResult(parsed, resumeJson.name || fallbackCandidateName);
    } catch (err: any) {
      this.logger.error(`Error evaluating candidate match with AI: ${err?.message}`);
      
      // Calculate realistic fallback match details
      const reqSkills = jobJd.required_skills || [];
      const candSkills = resumeJson.skills || [];
      const matching = candSkills.filter((s) =>
        reqSkills.some((r) => r.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(r.toLowerCase()))
      );
      const missing = reqSkills.filter((r) =>
        !candSkills.some((s) => s.toLowerCase().includes(r.toLowerCase()) || r.toLowerCase().includes(s.toLowerCase()))
      );
      const expMet = (resumeJson.total_experience_years || 0) >= (jobJd.minimum_experience || 0);

      const ratio = reqSkills.length > 0 ? matching.length / reqSkills.length : 0.8;
      const baseScore = Math.round(ratio * 70 + (expMet ? 25 : 5));

      return validateMatchResult({
        score: Math.min(100, Math.max(0, baseScore)),
        candidate_name: resumeJson.name || fallbackCandidateName,
        matching_skills: matching.length > 0 ? matching : candSkills.slice(0, 3),
        missing_critical_skills: missing,
        experience_requirement_met: expMet,
        short_final_verdict: expMet
          ? `Candidate demonstrates core matching skills for ${jobJd.role}.`
          : `Candidate meets some skills but requires verification of minimum experience requirements.`,
      }, fallbackCandidateName);
    }
  }

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