import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AutoApplyController } from './auto-apply.controller';
import { AutoApplyService } from './auto-apply.service';

@Module({
  imports: [PrismaModule],
  controllers: [AutoApplyController],
  providers: [AutoApplyService],
  exports: [AutoApplyService],
})
export class AutoApplyModule {}
