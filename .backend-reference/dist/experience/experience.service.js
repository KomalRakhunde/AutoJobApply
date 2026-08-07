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
exports.ExperienceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ExperienceService = class ExperienceService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, dto) {
        return this.prisma.experience.create({
            data: {
                userId,
                ...dto,
            },
        });
    }
    async findAll(userId) {
        return this.prisma.experience.findMany({
            where: {
                userId,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async update(id, dto) {
        const experience = await this.prisma.experience.findUnique({
            where: {
                id,
            },
        });
        if (!experience) {
            throw new common_1.NotFoundException('Experience not found');
        }
        return this.prisma.experience.update({
            where: {
                id,
            },
            data: dto,
        });
    }
    async remove(id) {
        const experience = await this.prisma.experience.findUnique({
            where: {
                id,
            },
        });
        if (!experience) {
            throw new common_1.NotFoundException('Experience not found');
        }
        await this.prisma.experience.delete({
            where: {
                id,
            },
        });
        return {
            message: 'Experience deleted successfully',
        };
    }
};
exports.ExperienceService = ExperienceService;
exports.ExperienceService = ExperienceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ExperienceService);
//# sourceMappingURL=experience.service.js.map