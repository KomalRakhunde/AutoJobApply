import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { InterviewService } from './interview.service';

@Controller('interviews')
export class InterviewController {
  constructor(private readonly interviewService: InterviewService) {}

  @Post('create-session')
  async createSession(
    @Body() body: { candidateId: string; jobId: string; triggeredBy?: 'manual' | 'auto' },
  ) {
    return this.interviewService.createInterviewSession(body);
  }

  @Get('session/:token')
  async getPublicSession(@Param('token') token: string) {
    return this.interviewService.getSessionByPublicToken(token);
  }

  @Post('session/:id/start')
  async startSession(@Param('id') id: string) {
    return this.interviewService.updateSessionStatus(id, 'in-progress');
  }

  @Post('session/:id/complete')
  async completeSession(
    @Param('id') id: string,
    @Body() body: { transcript: string; durationSeconds: number; recordingUrl?: string },
  ) {
    return this.interviewService.completeInterviewSession(
      id,
      body.transcript,
      body.durationSeconds,
      body.recordingUrl,
    );
  }
}
