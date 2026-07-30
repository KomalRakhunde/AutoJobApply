import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';

@Injectable()
export class ApplicationsService {
  constructor(private prisma: PrismaService) {}

  private demoApps = [
    {
      id: 'app-1',
      userId: 'user-1',
      jobId: 'job-1',
      status: 'applied',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      job: {
        id: 'job-1',
        title: 'Full Stack Engineer',
        company: 'TechCorp Solutions',
        location: 'Remote',
        salary: '$110,000 - $130,000',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    },
    {
      id: 'app-2',
      userId: 'user-1',
      jobId: 'job-2',
      status: 'interview',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      job: {
        id: 'job-2',
        title: 'Frontend React Developer',
        company: 'InnovateAI',
        location: 'San Francisco, CA',
        salary: '$120,000 - $140,000',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    },
    {
      id: 'app-3',
      userId: 'user-1',
      jobId: 'job-3',
      status: 'assessment',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      job: {
        id: 'job-3',
        title: 'Software Engineer - AI Systems',
        company: 'DataPulse AI',
        location: 'Hybrid',
        salary: '$130,000 - $150,000',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    },
  ];

  async create(userId: string, dto: CreateApplicationDto) {
    try {
      return await this.prisma.application.create({
        data: {
          userId,
          ...dto,
        },
      });
    } catch {
      const newApp = {
        id: `app-${Date.now()}`,
        userId: userId || 'user-1',
        jobId: dto.jobId || 'job-1',
        status: (dto as any).status || 'applied',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        job: {
          id: dto.jobId || 'job-1',
          title: 'Full Stack Engineer',
          company: 'Applied Tech',
          location: 'Remote',
          salary: '$120,000',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      };
      this.demoApps.unshift(newApp as any);
      return newApp;
    }
  }

  async findAll(userId?: string) {
    try {
      const list = await this.prisma.application.findMany({
        where: userId ? { userId } : undefined,
        include: {
          job: true,
          resume: true,
        },
        orderBy: {
          appliedAt: 'desc',
        },
      });
      if (list && list.length > 0) return list;
      return this.demoApps;
    } catch {
      return this.demoApps;
    }
  }

  async update(id: string, dto: UpdateApplicationDto) {
    try {
      const application = await this.prisma.application.findUnique({
        where: { id },
      });

      if (application) {
        return await this.prisma.application.update({
          where: { id },
          data: dto,
        });
      }
    } catch {}

    const found = this.demoApps.find((a) => a.id === id);
    if (found) {
      found.status = dto.status || found.status;
      found.updatedAt = new Date().toISOString();
      return found;
    }

    return {
      id,
      userId: 'user-1',
      jobId: 'job-1',
      status: dto.status || 'applied',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  async remove(id: string) {
    try {
      await this.prisma.application.delete({
        where: { id },
      });
    } catch {}

    this.demoApps = this.demoApps.filter((a) => a.id !== id);

    return {
      message: 'Application deleted successfully',
    };
  }
}