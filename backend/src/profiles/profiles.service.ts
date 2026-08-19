import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfilesService {
  constructor(private prisma: PrismaService) {}

  private assertDatabaseAvailable() {
    if (!this.prisma.isConnected) {
      throw new ServiceUnavailableException(
        'The database is currently unavailable. Please try again in a moment.',
      );
    }
  }

  async getProfile(userId: string) {
    this.assertDatabaseAvailable();

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
      throw new ServiceUnavailableException(
        'Could not load your profile due to a database error. Please try again.',
      );
    }
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    this.assertDatabaseAvailable();

    try {
      return await this.prisma.profile.upsert({
        where: { userId },
        update: { ...dto },
        create: { userId, ...dto },
      });
    } catch {
      throw new ServiceUnavailableException(
        'Could not save your profile due to a database error. Please try again.',
      );
    }
  }
}
