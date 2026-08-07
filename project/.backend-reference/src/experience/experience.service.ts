import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';

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

  async update(id: string, dto: UpdateExperienceDto) {
    const experience = await this.prisma.experience.findUnique({
      where: {
        id,
      },
    });

    if (!experience) {
      throw new NotFoundException('Experience not found');
    }

    return this.prisma.experience.update({
      where: {
        id,
      },
      data: dto,
    });
  }

  async remove(id: string) {
    const experience = await this.prisma.experience.findUnique({
      where: {
        id,
      },
    });

    if (!experience) {
      throw new NotFoundException('Experience not found');
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
}