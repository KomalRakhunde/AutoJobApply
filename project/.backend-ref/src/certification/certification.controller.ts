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
import { CertificationService } from './certification.service';
import { CreateCertificationDto } from './dto/create-certification.dto';
import { UpdateCertificationDto } from './dto/update-certification.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('certification')
@UseGuards(JwtAuthGuard)
export class CertificationController {
  constructor(private readonly certificationService: CertificationService) {}

  @Post(':userId')
  create(@Param('userId') userId: string, @Body() dto: CreateCertificationDto) {
    return this.certificationService.create(userId, dto);
  }

  @Get(':userId')
  findAll(@Param('userId') userId: string) {
    return this.certificationService.findAll(userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCertificationDto) {
    return this.certificationService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.certificationService.remove(id);
  }
}