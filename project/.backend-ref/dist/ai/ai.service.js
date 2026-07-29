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
    async atsScore(resume) {
        return this.openRouter.generate(`
Give an ATS score (0-100) for this resume.
Return only JSON.

Resume:
${resume}
`);
    }
    async resumeAnalysis(resume) {
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
    async coverLetter(resume, jobDescription) {
        return this.openRouter.generate(`
Write a professional cover letter.

Resume:
${resume}

Job Description:
${jobDescription}
`);
    }
    async interviewQuestions(jobRole) {
        return this.openRouter.generate(`
Generate 15 technical interview questions with answers for ${jobRole}.
`);
    }
};
exports.AiService = AiService;
exports.AiService = AiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [openrouter_service_1.OpenRouterService])
], AiService);
//# sourceMappingURL=ai.service.js.map