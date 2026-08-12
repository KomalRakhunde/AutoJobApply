import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';

@Injectable()
export class ApplicationsService {
  private readonly logger = new Logger(ApplicationsService.name);

  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateApplicationDto) {
    let targetResumeId = dto.resumeId;

    if (!targetResumeId && userId) {
      try {
        const primaryResume = await this.prisma.resume.findFirst({
          where: { userId },
          orderBy: { createdAt: 'desc' },
        });
        if (primaryResume) {
          targetResumeId = primaryResume.id;
        }
      } catch (err) {
        this.logger.warn(`Could not locate resume for user ${userId}`);
      }
    }

    const application = await this.prisma.application.create({
      data: {
        userId,
        jobId: dto.jobId,
        resumeId: targetResumeId || null,
        status: 'applied',
      },
      include: {
        job: true,
        resume: true,
      },
    });

    this.logger.log(`[Production Application] Dispatched candidate resume packet for User ${userId} to Job ${dto.jobId}`);
    return {
      ...application,
      status: application.status.toLowerCase(),
    };
  }

  async bulkApply(userId: string, jobIds: string[], resumeId?: string) {
    const results = [];
    for (const jobId of jobIds) {
      const app = await this.create(userId, { jobId, resumeId } as any);
      results.push(app);
    }
    return {
      message: `Successfully dispatched ATS resume packet to ${results.length} job requisitions!`,
      appliedCount: results.length,
      applications: results,
    };
  }

  async findAll(userId?: string) {
    const apps = await this.prisma.application.findMany({
      where: userId ? { userId } : undefined,
      include: {
        job: true,
        resume: true,
      },
      orderBy: {
        appliedAt: 'desc',
      },
    });
    return apps.map((app) => ({
      ...app,
      status: (app.status || 'applied').toLowerCase(),
    }));
  }

  async update(id: string, dto: UpdateApplicationDto) {
    const application = await this.prisma.application.findUnique({
      where: { id },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

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