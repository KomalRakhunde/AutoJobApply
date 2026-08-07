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
exports.ApplicationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ApplicationsService = class ApplicationsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    demoApps = [
        {
            id: 'app-1',
            userId: 'user-1',
            jobId: 'job-1',
            status: 'applied',
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date().toISOString(),
            job: {
                id: 'job-1',
                title: 'Full Stack Engineer',
                company: 'TechCorp Solutions',
                location: 'Remote',
                salary: '$110,000 - $130,000',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
        },
        {
            id: 'app-2',
            userId: 'user-1',
            jobId: 'job-2',
            status: 'interview',
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date().toISOString(),
            job: {
                id: 'job-2',
                title: 'Frontend React Developer',
                company: 'InnovateAI',
                location: 'San Francisco, CA',
                salary: '$120,000 - $140,000',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
        },
        {
            id: 'app-3',
            userId: 'user-1',
            jobId: 'job-3',
            status: 'assessment',
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date().toISOString(),
            job: {
                id: 'job-3',
                title: 'Software Engineer - AI Systems',
                company: 'DataPulse AI',
                location: 'Hybrid',
                salary: '$130,000 - $150,000',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
        },
    ];
    async create(userId, dto) {
        try {
            return await this.prisma.application.create({
                data: {
                    userId,
                    ...dto,
                },
            });
        }
        catch {
            const newApp = {
                id: `app-${Date.now()}`,
                userId: userId || 'user-1',
                jobId: dto.jobId || 'job-1',
                status: dto.status || 'applied',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                job: {
                    id: dto.jobId || 'job-1',
                    title: 'Full Stack Engineer',
                    company: 'Applied Tech',
                    location: 'Remote',
                    salary: '$120,000',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                },
            };
            this.demoApps.unshift(newApp);
            return newApp;
        }
    }
    async findAll(userId) {
        try {
            const list = await this.prisma.application.findMany({
                where: userId ? { userId } : undefined,
                include: {
                    job: true,
                    resume: true,
                },
                orderBy: {
                    appliedAt: 'desc',
                },
            });
            if (list && list.length > 0)
                return list;
            return this.demoApps;
        }
        catch {
            return this.demoApps;
        }
    }
    async update(id, dto) {
        try {
            const application = await this.prisma.application.findUnique({
                where: { id },
            });
            if (application) {
                return await this.prisma.application.update({
                    where: { id },
                    data: dto,
                });
            }
        }
        catch { }
        const found = this.demoApps.find((a) => a.id === id);
        if (found) {
            found.status = dto.status || found.status;
            found.updatedAt = new Date().toISOString();
            return found;
        }
        return {
            id,
            userId: 'user-1',
            jobId: 'job-1',
            status: dto.status || 'applied',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
    }
    async remove(id) {
        try {
            await this.prisma.application.delete({
                where: { id },
            });
        }
        catch { }
        this.demoApps = this.demoApps.filter((a) => a.id !== id);
        return {
            message: 'Application deleted successfully',
        };
    }
};
exports.ApplicationsService = ApplicationsService;
exports.ApplicationsService = ApplicationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ApplicationsService);
//# sourceMappingURL=applications.service.js.map