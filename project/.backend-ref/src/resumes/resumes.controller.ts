import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';

@Controller('resumes')
@UseGuards(JwtAuthGuard)
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @Post(':userId')
  create(@Param('userId') userId: string, @Body() dto: CreateResumeDto) {
    return this.resumesService.create(userId, dto);
  }

  @Get(':userId')
  findAll(@Param('userId') userId: string) {
    return this.resumesService.findAll(userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateResumeDto) {
    return this.resumesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.resumesService.remove(id);
  }
}