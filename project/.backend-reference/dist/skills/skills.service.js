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
exports.SkillsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SkillsService = class SkillsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(userId, dto) {
        return this.prisma.skill.create({
            data: { userId, ...dto },
        });
    }
    findAll(userId) {
        return this.prisma.skill.findMany({
            where: { userId },
        });
    }
    async update(id, dto) {
        const skill = await this.prisma.skill.findUnique({ where: { id } });
        if (!skill)
            throw new common_1.NotFoundException('Skill not found');
        return this.prisma.skill.update({
            where: { id },
            data: dto,
        });
    }
    async remove(id) {
        await this.prisma.skill.delete({
            where: { id },
        });
        return {
            message: 'Skill deleted successfully',
        };
    }
};
exports.SkillsService = SkillsService;
exports.SkillsService = SkillsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SkillsService);
//# sourceMappingURL=skills.service.js.map