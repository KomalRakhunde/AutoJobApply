import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateJobDto) {
    return this.jobsService.create(dto);
  }

  /**
   * GET /jobs: Returns candidate matched jobs if user is authenticated, or public job pool if unauthenticated.
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Req() req: any) {
    const userId = req.user?.userId || req.user?.id || req.user?.sub;
    return this.jobsService.findAll(userId);
  }

  /**
   * GET /jobs/pool: Returns public raw job pool without candidate filtering.
   */
  @Get('pool')
  findAllPublicPool() {
    return this.jobsService.findAllPublicPool();
  }

  /**
   * GET /jobs/recommended: Explicit candidate recommendations endpoint.
   */
  @Get('recommended')
  @UseGuards(JwtAuthGuard)
  getRecommended(@Req() req: any) {
    const userId = req.user?.userId || req.user?.id || req.user?.sub;
    return this.jobsService.getRecommendedJobsForStudent(userId);
  }

  /**
   * POST /jobs/sync-public: Scrapes, validates, and stores public jobs into PostgreSQL pool.
   */
  @Post('sync-public')
  syncPublicJobs(@Body('url') url?: string) {
    return this.jobsService.syncPublicJobs(url);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() dto: UpdateJobDto) {
    return this.jobsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.jobsService.remove(id);
  }
}