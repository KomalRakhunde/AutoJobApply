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
exports.RecruitersController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const recruiters_service_1 = require("./recruiters.service");
let RecruitersController = class RecruitersController {
    recruitersService;
    constructor(recruitersService) {
        this.recruitersService = recruitersService;
    }
    async createJobPosting(dto) {
        return this.recruitersService.createJobPosting(dto);
    }
    async getJobPostings() {
        return this.recruitersService.getJobPostings();
    }
    async getJobPostingById(id) {
        return this.recruitersService.getJobPostingById(id);
    }
    async bulkUploadResumes(id, files) {
        return this.recruitersService.bulkUploadResumes(id, files);
    }
    async getCandidatesByJob(id, search, minScore, stage) {
        const parsedMinScore = minScore ? parseInt(minScore, 10) : undefined;
        return this.recruitersService.getCandidatesByJob(id, search, parsedMinScore, stage);
    }
    async deleteCandidate(id) {
        return this.recruitersService.deleteCandidate(id);
    }
};
exports.RecruitersController = RecruitersController;
__decorate([
    (0, common_1.Post)('jobs'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RecruitersController.prototype, "createJobPosting", null);
__decorate([
    (0, common_1.Get)('jobs'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RecruitersController.prototype, "getJobPostings", null);
__decorate([
    (0, common_1.Get)('jobs/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RecruitersController.prototype, "getJobPostingById", null);
__decorate([
    (0, common_1.Post)('jobs/:id/resumes/bulk-upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 30)),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], RecruitersController.prototype, "bulkUploadResumes", null);
__decorate([
    (0, common_1.Get)('jobs/:id/candidates'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('search')),
    __param(2, (0, common_1.Query)('minScore')),
    __param(3, (0, common_1.Query)('stage')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], RecruitersController.prototype, "getCandidatesByJob", null);
__decorate([
    (0, common_1.Delete)('candidates/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RecruitersController.prototype, "deleteCandidate", null);
exports.RecruitersController = RecruitersController = __decorate([
    (0, common_1.Controller)('recruiters'),
    __metadata("design:paramtypes", [recruiters_service_1.RecruitersService])
], RecruitersController);
//# sourceMappingURL=recruiters.controller.js.map