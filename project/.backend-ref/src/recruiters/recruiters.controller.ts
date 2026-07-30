import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseInterceptors,
  UploadedFiles,
  ParseIntPipe,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { RecruitersService, CreateJobDto } from './recruiters.service';

@Controller('recruiters')
export class RecruitersController {
  constructor(private readonly recruitersService: RecruitersService) {}

  @Post('jobs')
  async createJobPosting(@Body() dto: CreateJobDto) {
    return this.recruitersService.createJobPosting(dto);
  }

  @Get('jobs')
  async getJobPostings() {
    return this.recruitersService.getJobPostings();
  }

  @Get('jobs/:id')
  async getJobPostingById(@Param('id') id: string) {
    return this.recruitersService.getJobPostingById(id);
  }

  @Post('jobs/:id/resumes/bulk-upload')
  @UseInterceptors(FilesInterceptor('files', 30))
  async bulkUploadResumes(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.recruitersService.bulkUploadResumes(id, files);
  }

  @Get('jobs/:id/candidates')
  async getCandidatesByJob(
    @Param('id') id: string,
    @Query('search') search?: string,
    @Query('minScore') minScore?: string,
    @Query('stage') stage?: string,
  ) {
    const parsedMinScore = minScore ? parseInt(minScore, 10) : undefined;
    return this.recruitersService.getCandidatesByJob(id, search, parsedMinScore, stage);
  }

  @Delete('candidates/:id')
  async deleteCandidate(@Param('id') id: string) {
    return this.recruitersService.deleteCandidate(id);
  }
}
