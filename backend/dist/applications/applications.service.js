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
var ApplicationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ApplicationsService = ApplicationsService_1 = class ApplicationsService {
    prisma;
    logger = new common_1.Logger(ApplicationsService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, dto) {
        let targetResumeId = dto.resumeId;
        if (!targetResumeId && userId) {
            try {
                const primaryResume = await this.prisma.resume.findFirst({
                    where: { userId },
                    orderBy: { createdAt: 'desc' },
                });
                if (primaryResume) {
                    targetResumeId = primaryResume.id;
                }
            }
            catch (err) {
                this.logger.warn(`Could not locate resume for user ${userId}`);
            }
        }
        const application = await this.prisma.application.create({
            data: {
                userId,
                jobId: dto.jobId,
                resumeId: targetResumeId || null,
                status: 'applied',
            },
            include: {
                job: true,
                resume: true,
            },
        });
        this.logger.log(`[Production Application] Dispatched candidate resume packet for User ${userId} to Job ${dto.jobId}`);
        return {
            ...application,
            status: application.status.toLowerCase(),
        };
    }
    async bulkApply(userId, jobIds, resumeId) {
        const results = [];
        for (const jobId of jobIds) {
            const app = await this.create(userId, { jobId, resumeId });
            results.push(app);
        }
        return {
            message: `Successfully dispatched ATS resume packet to ${results.length} job requisitions!`,
            appliedCount: results.length,
            applications: results,
        };
    }
    async findAll(userId) {
        const apps = await this.prisma.application.findMany({
            where: userId ? { userId } : undefined,
            include: {
                job: true,
                resume: true,
            },
            orderBy: {
                appliedAt: 'desc',
            },
        });
        return apps.map((app) => ({
            ...app,
            status: (app.status || 'applied').toLowerCase(),
        }));
    }
    async update(id, dto) {
        const application = await this.prisma.application.findUnique({
            where: { id },
        });
        if (!application) {
            throw new common_1.NotFoundException('Application not found');
        }
        return this.prisma.application.update({
            where: { id },
            data: dto,
        });
    }
    async remove(id) {
        await this.prisma.application.delete({
            where: { id },
        });
        return {
            message: 'Application deleted successfully',
        };
    }
};
exports.ApplicationsService = ApplicationsService;
exports.ApplicationsService = ApplicationsService = ApplicationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ApplicationsService);
//# sourceMappingURL=applications.service.js.map