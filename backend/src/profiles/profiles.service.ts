import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfilesService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    if (!this.prisma.isConnected) {
      return {
        id: `profile-${userId}`,
        userId,
        phone: null,
        location: null,
        preferredLocation: null,
        expectedSalary: null,
        noticePeriod: null,
        linkedinUrl: null,
        portfolioUrl: null,
        githubUrl: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    try {
      let profile = await this.prisma.profile.findUnique({
        where: { userId },
      });

      if (!profile) {
        profile = await this.prisma.profile.create({
          data: {
            userId,
          },
        });
      }
      return profile;
    } catch {
      return {
        id: `profile-${userId}`,
        userId,
        phone: null,
        location: null,
        preferredLocation: null,
        expectedSalary: null,
        noticePeriod: null,
        linkedinUrl: null,
        portfolioUrl: null,
        githubUrl: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    if (!this.prisma.isConnected) {
      return {
        id: `profile-${userId}`,
        userId,
        phone: dto.phone || null,
        location: dto.location || null,
        preferredLocation: dto.preferredLocation || null,
        expectedSalary: dto.expectedSalary || null,
        noticePeriod: dto.noticePeriod || null,
        linkedinUrl: dto.linkedinUrl || null,
        portfolioUrl: dto.portfolioUrl || null,
        githubUrl: dto.githubUrl || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    try {
      return await this.prisma.profile.upsert({
        where: { userId },
        update: { ...dto },
        create: { userId, ...dto },
      });
    } catch {
      return {
        id: `profile-${userId}`,
        userId,
        phone: dto.phone || null,
        location: dto.location || null,
        preferredLocation: dto.preferredLocation || null,
        expectedSalary: dto.expectedSalary || null,
        noticePeriod: dto.noticePeriod || null,
        linkedinUrl: dto.linkedinUrl || null,
        portfolioUrl: dto.portfolioUrl || null,
        githubUrl: dto.githubUrl || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
  }
}