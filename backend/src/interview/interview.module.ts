import { Module } from '@nestjs/common';
import { InterviewController } from './interview.controller';
import { InterviewService } from './interview.service';
import { OutreachService } from './outreach.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [PrismaModule, AiModule],
  controllers: [InterviewController],
  providers: [InterviewService, OutreachService],
  exports: [InterviewService, OutreachService],
})
export class InterviewModule {}
