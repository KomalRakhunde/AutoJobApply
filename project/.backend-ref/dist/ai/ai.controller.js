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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const ai_service_1 = require("./ai.service");
let AiController = class AiController {
    aiService;
    constructor(aiService) {
        this.aiService = aiService;
    }
    atsScore(resume) {
        return this.aiService.atsScore(resume);
    }
    resumeAnalysis(resume) {
        return this.aiService.resumeAnalysis(resume);
    }
    coverLetter(resume, jobDescription) {
        return this.aiService.coverLetter(resume, jobDescription);
    }
    interviewQuestions(jobRole) {
        return this.aiService.interviewQuestions(jobRole);
    }
};
exports.AiController = AiController;
__decorate([
    (0, common_1.Post)('ats-score'),
    __param(0, (0, common_1.Body)('resume')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AiController.prototype, "atsScore", null);
__decorate([
    (0, common_1.Post)('resume-analysis'),
    __param(0, (0, common_1.Body)('resume')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AiController.prototype, "resumeAnalysis", null);
__decorate([
    (0, common_1.Post)('cover-letter'),
    __param(0, (0, common_1.Body)('resume')),
    __param(1, (0, common_1.Body)('jobDescription')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AiController.prototype, "coverLetter", null);
__decorate([
    (0, common_1.Post)('interview-questions'),
    __param(0, (0, common_1.Body)('jobRole')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AiController.prototype, "interviewQuestions", null);
exports.AiController = AiController = __decorate([
    (0, common_1.Controller)('ai'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [ai_service_1.AiService])
], AiController);
//# sourceMappingURL=ai.controller.js.map