"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecruitersModule = void 0;
const common_1 = require("@nestjs/common");
const recruiters_controller_1 = require("./recruiters.controller");
const recruiters_service_1 = require("./recruiters.service");
const sourcing_service_1 = require("./sourcing.service");
const prisma_module_1 = require("../prisma/prisma.module");
const ai_module_1 = require("../ai/ai.module");
const interview_module_1 = require("../interview/interview.module");
const automation_module_1 = require("../automation/automation.module");
let RecruitersModule = class RecruitersModule {
};
exports.RecruitersModule = RecruitersModule;
exports.RecruitersModule = RecruitersModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, ai_module_1.AiModule, interview_module_1.InterviewModule, automation_module_1.AutomationModule],
        controllers: [recruiters_controller_1.RecruitersController],
        providers: [recruiters_service_1.RecruitersService, sourcing_service_1.CandidateSourcingService],
        exports: [recruiters_service_1.RecruitersService, sourcing_service_1.CandidateSourcingService],
    })
], RecruitersModule);
//# sourceMappingURL=recruiters.module.js.map