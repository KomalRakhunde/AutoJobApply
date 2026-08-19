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
import { EducationService } from './education.service';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { requireSelf, requestingUserId } from '../auth/ownership.util';

@Controller('education')
@UseGuards(JwtAuthGuard)
export class EducationController {
  constructor(private readonly educationService: EducationService) {}

  @Post(':userId')
  create(
    @Param('userId') userId: string,
    @Body() dto: CreateEducationDto,
    @Req() req: any,
  ) {
    requireSelf(req, userId);
    return this.educationService.create(userId, dto);
  }

  @Get(':userId')
  findAll(@Param('userId') userId: string, @Req() req: any) {
    requireSelf(req, userId);
    return this.educationService.findAll(userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateEducationDto,
    @Req() req: any,
  ) {
    return this.educationService.update(id, dto, requestingUserId(req));
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.educationService.remove(id, requestingUserId(req));
  }
}
