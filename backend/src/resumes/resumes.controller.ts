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
import { ResumesService } from './resumes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { requireSelf, requestingUserId } from '../auth/ownership.util';

@Controller('resumes')
@UseGuards(JwtAuthGuard)
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @Post(':userId')
  create(
    @Param('userId') userId: string,
    @Body() dto: CreateResumeDto,
    @Req() req: any,
  ) {
    requireSelf(req, userId);
    return this.resumesService.create(userId, dto);
  }

  @Get(':userId')
  findAll(@Param('userId') userId: string, @Req() req: any) {
    requireSelf(req, userId);
    return this.resumesService.findAll(userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateResumeDto,
    @Req() req: any,
  ) {
    return this.resumesService.update(id, dto, requestingUserId(req));
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.resumesService.remove(id, requestingUserId(req));
  }
}
