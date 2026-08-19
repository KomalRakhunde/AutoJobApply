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
import { CertificationService } from './certification.service';
import { CreateCertificationDto } from './dto/create-certification.dto';
import { UpdateCertificationDto } from './dto/update-certification.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { requireSelf, requestingUserId } from '../auth/ownership.util';

@Controller('certification')
@UseGuards(JwtAuthGuard)
export class CertificationController {
  constructor(private readonly certificationService: CertificationService) {}

  @Post(':userId')
  create(
    @Param('userId') userId: string,
    @Body() dto: CreateCertificationDto,
    @Req() req: any,
  ) {
    requireSelf(req, userId);
    return this.certificationService.create(userId, dto);
  }

  @Get(':userId')
  findAll(@Param('userId') userId: string, @Req() req: any) {
    requireSelf(req, userId);
    return this.certificationService.findAll(userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCertificationDto,
    @Req() req: any,
  ) {
    return this.certificationService.update(id, dto, requestingUserId(req));
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.certificationService.remove(id, requestingUserId(req));
  }
}
