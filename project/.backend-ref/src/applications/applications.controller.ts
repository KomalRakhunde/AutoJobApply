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
import { ApplicationsService } from './applications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';

@Controller('applications')
@UseGuards(JwtAuthGuard)
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post(':userId')
  create(
    @Param('userId') userId: string,
    @Body() dto: CreateApplicationDto,
  ) {
    return this.applicationsService.create(userId, dto);
  }

  @Get(':userId')
  findAll(@Param('userId') userId: string) {
    return this.applicationsService.findAll(userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateApplicationDto) {
    return this.applicationsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.applicationsService.remove(id);
  }
}