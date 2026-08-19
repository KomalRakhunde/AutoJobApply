import { Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AutoApplyService } from './auto-apply.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { requestingUserId } from '../auth/ownership.util';

@Controller('auto-apply')
@UseGuards(JwtAuthGuard)
export class AutoApplyController {
  constructor(private readonly autoApplyService: AutoApplyService) {}

  @Post(':applicationId/execute')
  executeApplication(@Param('applicationId') applicationId: string, @Req() req: any) {
    return this.autoApplyService.executeApplication(applicationId, requestingUserId(req));
  }
}
