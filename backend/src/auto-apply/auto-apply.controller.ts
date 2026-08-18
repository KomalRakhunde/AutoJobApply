import { Controller, Param, Post, UseGuards } from '@nestjs/common';
import { AutoApplyService } from './auto-apply.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('auto-apply')
@UseGuards(JwtAuthGuard)
export class AutoApplyController {
  constructor(private readonly autoApplyService: AutoApplyService) {}

  @Post(':applicationId/execute')
  executeApplication(@Param('applicationId') applicationId: string) {
    return this.autoApplyService.executeApplication(applicationId);
  }
}
