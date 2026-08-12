import { Module } from '@nestjs/common';
import { RecruitersController } from './recruiters.controller';
import { RecruitersService } from './recruiters.service';
import { CandidateSourcingService } from './sourcing.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AiModule } from '../ai/ai.module';
import { InterviewModule } from '../interview/interview.module';
import { AutomationModule } from '../automation/automation.module';

@Module({
  imports: [PrismaModule, AiModule, InterviewModule, AutomationModule],
  controllers: [RecruitersController],
  providers: [RecruitersService, CandidateSourcingService],
  exports: [RecruitersService, CandidateSourcingService],
})
export class RecruitersModule {}
