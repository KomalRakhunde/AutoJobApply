import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
import { assertOwns } from '../auth/ownership.util';

@Injectable()
export class EducationService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateEducationDto) {
    return this.prisma.education.create({
      data: {
        userId,
        ...dto,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.education.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async update(id: string, dto: UpdateEducationDto, requestingUserId: string) {
    const education = await this.prisma.education.findUnique({
      where: { id },
    });

    if (!education) {
      throw new NotFoundException('Education record not found');
    }
    assertOwns(education.userId, requestingUserId);

    return this.prisma.education.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string, requestingUserId: string) {
    const education = await this.prisma.education.findUnique({
      where: { id },
    });

    if (!education) {
      throw new NotFoundException('Education record not found');
    }
    assertOwns(education.userId, requestingUserId);

    await this.prisma.education.delete({
      where: { id },
    });

    return {
      message: 'Education deleted successfully',
    };
  }
}
