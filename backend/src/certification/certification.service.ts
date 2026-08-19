import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCertificationDto } from './dto/create-certification.dto';
import { UpdateCertificationDto } from './dto/update-certification.dto';
import { assertOwns } from '../auth/ownership.util';

@Injectable()
export class CertificationService {
  constructor(private prisma: PrismaService) {}

  create(userId: string, dto: CreateCertificationDto) {
    return this.prisma.certification.create({
      data: { userId, ...dto },
    });
  }

  findAll(userId: string) {
    return this.prisma.certification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, dto: UpdateCertificationDto, requestingUserId: string) {
    const certification = await this.prisma.certification.findUnique({
      where: { id },
    });

    if (!certification) {
      throw new NotFoundException('Certification not found');
    }
    assertOwns(certification.userId, requestingUserId);

    return this.prisma.certification.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string, requestingUserId: string) {
    const certification = await this.prisma.certification.findUnique({
      where: { id },
    });

    if (!certification) {
      throw new NotFoundException('Certification not found');
    }
    assertOwns(certification.userId, requestingUserId);

    await this.prisma.certification.delete({
      where: { id },
    });

    return {
      message: 'Certification deleted successfully',
    };
  }
}
