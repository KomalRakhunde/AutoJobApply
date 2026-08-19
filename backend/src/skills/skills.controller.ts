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
import { SkillsService } from './skills.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { requireSelf, requestingUserId } from '../auth/ownership.util';

@Controller('skills')
@UseGuards(JwtAuthGuard)
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Post(':userId')
  create(
    @Param('userId') userId: string,
    @Body() dto: CreateSkillDto,
    @Req() req: any,
  ) {
    requireSelf(req, userId);
    return this.skillsService.create(userId, dto);
  }

  @Post(':userId/sync')
  syncSkills(
    @Param('userId') userId: string,
    @Body('skills') skills: string[],
    @Req() req: any,
  ) {
    requireSelf(req, userId);
    return this.skillsService.syncUserSkills(userId, Array.isArray(skills) ? skills : []);
  }

  @Get(':userId')
  findAll(@Param('userId') userId: string, @Req() req: any) {
    requireSelf(req, userId);
    return this.skillsService.findAll(userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateSkillDto,
    @Req() req: any,
  ) {
    return this.skillsService.update(id, dto, requestingUserId(req));
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.skillsService.remove(id, requestingUserId(req));
  }
}
