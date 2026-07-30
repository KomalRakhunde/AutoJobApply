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
import { ApplicationsService } from './applications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';

@Controller('applications')
@UseGuards(JwtAuthGuard)
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Get()
  findAllRoot(@Req() req: any) {
    const userId = req.user?.userId;
    return this.applicationsService.findAll(userId);
  }

  @Get(':userId')
  findAll(@Param('userId') userId: string) {
    return this.applicationsService.findAll(userId);
  }

  @Post()
  createRoot(@Req() req: any, @Body() dto: CreateApplicationDto) {
    const userId = req.user?.userId || 'user-1';
    return this.applicationsService.create(userId, dto);
  }

  @Post(':userId')
  create(
    @Param('userId') userId: string,
    @Body() dto: CreateApplicationDto,
  ) {
    return this.applicationsService.create(userId, dto);
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