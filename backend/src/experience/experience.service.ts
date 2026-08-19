import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { assertOwns } from '../auth/ownership.util';

@Injectable()
export class ExperienceService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateExperienceDto) {
    return this.prisma.experience.create({
      data: {
        userId,
        ...dto,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.experience.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async update(id: string, dto: UpdateExperienceDto, requestingUserId: string) {
    const experience = await this.prisma.experience.findUnique({
      where: {
        id,
      },
    });

    if (!experience) {
      throw new NotFoundException('Experience not found');
    }
    assertOwns(experience.userId, requestingUserId);

    return this.prisma.experience.update({
      where: {
        id,
      },
      data: dto,
    });
  }

  async remove(id: string, requestingUserId: string) {
    const experience = await this.prisma.experience.findUnique({
      where: {
        id,
      },
    });

    if (!experience) {
      throw new NotFoundException('Experience not found');
    }
    assertOwns(experience.userId, requestingUserId);

    await this.prisma.experience.delete({
      where: {
        id,
      },
    });

    return {
      message: 'Experience deleted successfully',
    };
  }
}
