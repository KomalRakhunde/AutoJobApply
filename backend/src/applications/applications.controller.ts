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
import { requireSelf, requestingUserId } from '../auth/ownership.util';

@Controller('applications')
@UseGuards(JwtAuthGuard)
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Get()
  findAllRoot(@Req() req: any) {
    return this.applicationsService.findAll(requestingUserId(req));
  }

  @Get(':userId')
  findAll(@Param('userId') userId: string, @Req() req: any) {
    requireSelf(req, userId);
    return this.applicationsService.findAll(userId);
  }

  @Post()
  createRoot(@Req() req: any, @Body() dto: CreateApplicationDto) {
    return this.applicationsService.create(requestingUserId(req), dto);
  }

  @Post('bulk-apply')
  bulkApply(
    @Req() req: any,
    @Body('jobIds') jobIds: string[],
    @Body('resumeId') resumeId?: string,
  ) {
    return this.applicationsService.bulkApply(requestingUserId(req), jobIds || [], resumeId);
  }

  @Post(':userId')
  create(
    @Param('userId') userId: string,
    @Body() dto: CreateApplicationDto,
    @Req() req: any,
  ) {
    requireSelf(req, userId);
    return this.applicationsService.create(userId, dto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateApplicationDto,
    @Req() req: any,
  ) {
    return this.applicationsService.update(id, dto, requestingUserId(req));
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.applicationsService.remove(id, requestingUserId(req));
  }
}
