import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';

@Injectable()
export class ApplicationsService {
  constructor(private prisma: PrismaService) {}

  create(userId: string, dto: CreateApplicationDto) {
    return this.prisma.application.create({
      data: {
        userId,
        ...dto,
      },
    });
  }

  findAll(userId: string) {
    return this.prisma.application.findMany({
      where: { userId },
      include: {
        job: true,
        resume: true,
      },
      orderBy: {
        appliedAt: 'desc',
      },
    });
  }

  async update(id: string, dto: UpdateApplicationDto) {
    const application = await this.prisma.application.findUnique({
      where: { id },
    });

    if (!application) throw new NotFoundException('Application not found');

    return this.prisma.application.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.prisma.application.delete({
      where: { id },
    });

    return {
      message: 'Application deleted successfully',
    };
  }
}