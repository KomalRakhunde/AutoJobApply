import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AiService } from './ai.service';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('ats-score')
  atsScore(@Body('resume') resume: string) {
    return this.aiService.atsScore(resume);
  }

  @Post('resume-analysis')
  resumeAnalysis(@Body('resume') resume: string) {
    return this.aiService.resumeAnalysis(resume);
  }

  @Post('cover-letter')
  coverLetter(
    @Body('resume') resume: string,
    @Body('jobDescription') jobDescription: string,
  ) {
    return this.aiService.coverLetter(resume, jobDescription);
  }

  @Post('interview-questions')
  interviewQuestions(@Body('jobRole') jobRole: string) {
    return this.aiService.interviewQuestions(jobRole);
  }
}