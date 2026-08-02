"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const prisma_module_1 = require("./prisma/prisma.module");
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const resumes_module_1 = require("./resumes/resumes.module");
const jobs_module_1 = require("./jobs/jobs.module");
const ai_module_1 = require("./ai/ai.module");
const applications_module_1 = require("./applications/applications.module");
const automation_module_1 = require("./automation/automation.module");
const gmail_module_1 = require("./gmail/gmail.module");
const notifications_module_1 = require("./notifications/notifications.module");
const profiles_module_1 = require("./profiles/profiles.module");
const skills_module_1 = require("./skills/skills.module");
const cover_letters_module_1 = require("./cover-letters/cover-letters.module");
const interview_module_1 = require("./interview/interview.module");
const dashboard_module_1 = require("./dashboard/dashboard.module");
const subscriptions_module_1 = require("./subscriptions/subscriptions.module");
const recruiters_module_1 = require("./recruiters/recruiters.module");
const admin_module_1 = require("./admin/admin.module");
const payments_module_1 = require("./payments/payments.module");
const education_module_1 = require("./education/education.module");
const experience_module_1 = require("./experience/experience.module");
const certification_module_1 = require("./certification/certification.module");
const resume_parser_module_1 = require("./resume-parser/resume-parser.module");
const storage_module_1 = require("./storage/storage.module");
const search_module_1 = require("./search/search.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            resumes_module_1.ResumesModule,
            jobs_module_1.JobsModule,
            ai_module_1.AiModule,
            applications_module_1.ApplicationsModule,
            automation_module_1.AutomationModule,
            gmail_module_1.GmailModule,
            notifications_module_1.NotificationsModule,
            profiles_module_1.ProfilesModule,
            skills_module_1.SkillsModule,
            cover_letters_module_1.CoverLettersModule,
            interview_module_1.InterviewModule,
            dashboard_module_1.DashboardModule,
            subscriptions_module_1.SubscriptionsModule,
            recruiters_module_1.RecruitersModule,
            admin_module_1.AdminModule,
            payments_module_1.PaymentsModule,
            education_module_1.EducationModule,
            experience_module_1.ExperienceModule,
            certification_module_1.CertificationModule,
            resume_parser_module_1.ResumeParserModule,
            storage_module_1.StorageModule,
            search_module_1.SearchModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map