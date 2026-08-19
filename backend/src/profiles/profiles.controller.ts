import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { requireSelf } from '../auth/ownership.util';

@Controller('profiles')
@UseGuards(JwtAuthGuard)
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get(':userId')
  getProfile(@Param('userId') userId: string, @Req() req: any) {
    requireSelf(req, userId);
    return this.profilesService.getProfile(userId);
  }

  @Patch(':userId')
  updateProfile(
    @Param('userId') userId: string,
    @Body() dto: UpdateProfileDto,
    @Req() req: any,
  ) {
    requireSelf(req, userId);
    return this.profilesService.updateProfile(userId, dto);
  }
}
