import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CertificationController } from './certification.controller';
import { CertificationService } from './certification.service';

@Module({
  imports: [PrismaModule],
  controllers: [CertificationController],
  providers: [CertificationService],
})
export class CertificationModule {}