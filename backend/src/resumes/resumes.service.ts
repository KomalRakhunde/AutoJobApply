import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { assertOwns } from '../auth/ownership.util';

@Injectable()
export class ResumesService {
  constructor(private prisma: PrismaService) {}

  create(userId: string, dto: CreateResumeDto) {
    return this.prisma.resume.create({
      data: {
        userId,
        ...dto,
      },
    });
  }

  findAll(userId: string) {
    return this.prisma.resume.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, dto: UpdateResumeDto, requestingUserId: string) {
    const resume = await this.prisma.resume.findUnique({
      where: { id },
    });

    if (!resume) {
      throw new NotFoundException('Resume not found');
    }
    assertOwns(resume.userId, requestingUserId);

    return this.prisma.resume.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string, requestingUserId: string) {
    const resume = await this.prisma.resume.findUnique({
      where: { id },
    });

    if (!resume) {
      throw new NotFoundException('Resume not found');
    }
    assertOwns(resume.userId, requestingUserId);

    await this.prisma.resume.delete({
      where: { id },
    });

    return {
      message: 'Resume deleted successfully',
    };
  }
}
