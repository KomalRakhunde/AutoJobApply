"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const openrouter_service_1 = require("./openrouter.service");
let AiService = class AiService {
    openRouter;
    constructor(openRouter) {
        this.openRouter = openRouter;
    }
    async atsScore(resumeText, jobDescription) {
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
    async resumeAnalysis(resumeText) {
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
    async coverLetter(resumeText, jobDescription) {
        return this.openRouter.generate(`
Write a professional cover letter.

Resume:
${resumeText}

Job Description:
${jobDescription}
`);
    }
    async interviewQuestions(jobTitle) {
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
    async evaluateRecruiterCandidate(resumeText, jobDescription, requirements) {
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
};
exports.AiService = AiService;
exports.AiService = AiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [openrouter_service_1.OpenRouterService])
], AiService);
//# sourceMappingURL=ai.service.js.map