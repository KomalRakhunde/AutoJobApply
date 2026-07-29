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
import { EducationService } from './education.service';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('education')
@UseGuards(JwtAuthGuard)
export class EducationController {
  constructor(private readonly educationService: EducationService) {}

  @Post(':userId')
  create(
    @Param('userId') userId: string,
    @Body() dto: CreateEducationDto,
  ) {
    return this.educationService.create(userId, dto);
  }

  @Get(':userId')
  findAll(@Param('userId') userId: string) {
    return this.educationService.findAll(userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateEducationDto,
  ) {
    return this.educationService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.educationService.remove(id);
  }
}