import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AiService } from './ai.service';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('ats-score')
  atsScore(
    @Body('resumeText') resumeText: string,
    @Body('jobDescription') jobDescription?: string,
  ) {
    return this.aiService.atsScore(resumeText, jobDescription);
  }

  @Post('resume-analysis')
  resumeAnalysis(@Body('resumeText') resumeText: string) {
    return this.aiService.resumeAnalysis(resumeText);
  }

  @Post('cover-letter')
  coverLetter(
    @Body('resumeText') resumeText: string,
    @Body('jobDescription') jobDescription: string,
  ) {
    return this.aiService.coverLetter(resumeText, jobDescription);
  }

  @Post('interview-questions')
  interviewQuestions(@Body('jobTitle') jobTitle: string) {
    return this.aiService.interviewQuestions(jobTitle);
  }
}