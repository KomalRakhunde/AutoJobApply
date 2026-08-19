import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { assertOwns } from '../auth/ownership.util';

@Injectable()
export class SkillsService {
  constructor(private prisma: PrismaService) {}

  create(userId: string, dto: CreateSkillDto) {
    return this.prisma.skill.create({
      data: { userId, ...dto },
    });
  }

  findAll(userId: string) {
    return this.prisma.skill.findMany({
      where: { userId },
    });
  }

  async syncUserSkills(userId: string, skills: string[]) {
    await this.prisma.skill.deleteMany({ where: { userId } }).catch(() => {});
    const created = [];
    for (const name of skills) {
      if (name && name.trim()) {
        const item = await this.prisma.skill.create({
          data: {
            userId,
            name: name.trim(),
          },
        });
        created.push(item);
      }
    }
    return created;
  }

  async update(id: string, dto: UpdateSkillDto, requestingUserId: string) {
    const skill = await this.prisma.skill.findUnique({ where: { id } });

    if (!skill) throw new NotFoundException('Skill not found');
    assertOwns(skill.userId, requestingUserId);

    return this.prisma.skill.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string, requestingUserId: string) {
    const skill = await this.prisma.skill.findUnique({ where: { id } });

    if (!skill) throw new NotFoundException('Skill not found');
    assertOwns(skill.userId, requestingUserId);

    await this.prisma.skill.delete({
      where: { id },
    });

    return {
      message: 'Skill deleted successfully',
    };
  }
}
