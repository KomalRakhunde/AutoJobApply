import { Module } from '@nestjs/common';
import { RecruitersController } from './recruiters.controller';
import { RecruitersService } from './recruiters.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AiModule } from '../ai/ai.module';
import { InterviewModule } from '../interview/interview.module';

@Module({
  imports: [PrismaModule, AiModule, InterviewModule],
  controllers: [RecruitersController],
  providers: [RecruitersService],
  exports: [RecruitersService],
})
export class RecruitersModule {}
