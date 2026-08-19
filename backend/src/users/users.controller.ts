import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { requireSelf } from '../auth/ownership.util';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async getUser(@Param('id') id: string, @Req() req: any) {
    requireSelf(req, id);
    return this.usersService.getUserById(id);
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body()
    body: {
      firstName?: string;
      lastName?: string;
    },
    @Req() req: any,
  ) {
    requireSelf(req, id);
    return this.usersService.updateUser(id, body);
  }
}
