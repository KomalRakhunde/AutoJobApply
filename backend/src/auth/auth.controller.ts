import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body()
    body: {
      email: string;
      password: string;
      firstName?: string;
      lastName?: string;
      role?: string;
    },
  ) {
    return this.authService.register(body);
  }

  @Post('login')
  async login(
    @Body()
    body: {
      email: string;
      password: string;
      selectedRole: string;
    },
  ) {
    return this.authService.login(body.email, body.password, body.selectedRole);
  }

  @Post('oauth')
  async oauth(
    @Body()
    body: {
      email: string;
      firstName?: string;
      lastName?: string;
      requestedRole?: string;
      provider: 'google' | 'linkedin';
    },
  ) {
    return this.authService.validateOAuthUser(body);
  }
}