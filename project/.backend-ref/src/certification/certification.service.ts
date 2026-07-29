import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCertificationDto } from './dto/create-certification.dto';
import { UpdateCertificationDto } from './dto/update-certification.dto';

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

  async update(id: string, dto: UpdateCertificationDto) {
    const certification = await this.prisma.certification.findUnique({
      where: { id },
    });

    if (!certification) {
      throw new NotFoundException('Certification not found');
    }

    return this.prisma.certification.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    const certification = await this.prisma.certification.findUnique({
      where: { id },
    });

    if (!certification) {
      throw new NotFoundException('Certification not found');
    }

    await this.prisma.certification.delete({
      where: { id },
    });

    return {
      message: 'Certification deleted successfully',
    };
  }
}