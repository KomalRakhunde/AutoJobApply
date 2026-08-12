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
exports.ProfilesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ProfilesService = class ProfilesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getProfile(userId) {
        if (!this.prisma.isConnected) {
            return {
                id: `profile-${userId}`,
                userId,
                phone: null,
                location: null,
                preferredLocation: null,
                expectedSalary: null,
                noticePeriod: null,
                linkedinUrl: null,
                portfolioUrl: null,
                githubUrl: null,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
        }
        try {
            let profile = await this.prisma.profile.findUnique({
                where: { userId },
            });
            if (!profile) {
                profile = await this.prisma.profile.create({
                    data: {
                        userId,
                    },
                });
            }
            return profile;
        }
        catch {
            return {
                id: `profile-${userId}`,
                userId,
                phone: null,
                location: null,
                preferredLocation: null,
                expectedSalary: null,
                noticePeriod: null,
                linkedinUrl: null,
                portfolioUrl: null,
                githubUrl: null,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
        }
    }
    async updateProfile(userId, dto) {
        if (!this.prisma.isConnected) {
            return {
                id: `profile-${userId}`,
                userId,
                phone: dto.phone || null,
                location: dto.location || null,
                preferredLocation: dto.preferredLocation || null,
                expectedSalary: dto.expectedSalary || null,
                noticePeriod: dto.noticePeriod || null,
                linkedinUrl: dto.linkedinUrl || null,
                portfolioUrl: dto.portfolioUrl || null,
                githubUrl: dto.githubUrl || null,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
        }
        try {
            return await this.prisma.profile.upsert({
                where: { userId },
                update: { ...dto },
                create: { userId, ...dto },
            });
        }
        catch {
            return {
                id: `profile-${userId}`,
                userId,
                phone: dto.phone || null,
                location: dto.location || null,
                preferredLocation: dto.preferredLocation || null,
                expectedSalary: dto.expectedSalary || null,
                noticePeriod: dto.noticePeriod || null,
                linkedinUrl: dto.linkedinUrl || null,
                portfolioUrl: dto.portfolioUrl || null,
                githubUrl: dto.githubUrl || null,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
        }
    }
};
exports.ProfilesService = ProfilesService;
exports.ProfilesService = ProfilesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProfilesService);
//# sourceMappingURL=profiles.service.js.map