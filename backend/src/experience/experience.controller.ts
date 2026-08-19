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
import { ExperienceService } from './experience.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { requireSelf, requestingUserId } from '../auth/ownership.util';

@Controller('experience')
@UseGuards(JwtAuthGuard)
export class ExperienceController {
  constructor(private readonly experienceService: ExperienceService) {}

  @Post(':userId')
  create(
    @Param('userId') userId: string,
    @Body() dto: CreateExperienceDto,
    @Req() req: any,
  ) {
    requireSelf(req, userId);
    return this.experienceService.create(userId, dto);
  }

  @Get(':userId')
  findAll(@Param('userId') userId: string, @Req() req: any) {
    requireSelf(req, userId);
    return this.experienceService.findAll(userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateExperienceDto,
    @Req() req: any,
  ) {
    return this.experienceService.update(id, dto, requestingUserId(req));
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.experienceService.remove(id, requestingUserId(req));
  }
}
