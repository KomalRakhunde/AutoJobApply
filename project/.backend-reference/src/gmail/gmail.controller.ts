import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GmailService, SyncedEmail } from './gmail.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('gmail')
@UseGuards(JwtAuthGuard)
export class GmailController {
  constructor(private readonly gmailService: GmailService) {}

  @Get('emails')
  getEmails() {
    return this.gmailService.getEmails();
  }

  @Post('sync')
  syncInbox() {
    return this.gmailService.syncInbox();
  }

  @Post('emails')
  addEmail(@Body() dto: Omit<SyncedEmail, 'id' | 'date'>) {
    return this.gmailService.addEmail(dto);
  }

  @Delete('emails/:id')
  deleteEmail(@Param('id') id: string) {
    return this.gmailService.deleteEmail(id);
  }
}
