import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(data: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    role?: string;
  }) {
    // Password Strength Server-side Enforcement (Requires min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    if (!passwordRegex.test(data.password)) {
      throw new BadRequestException(
        'Password must be at least 8 characters long and include uppercase, lowercase, a digit, and a special character.',
      );
    }

    try {
      const existingUser = await this.prisma.user.findUnique({
        where: {
          email: data.email,
        },
      });

      if (existingUser) {
        throw new BadRequestException(
          'An account with this email address already exists. Please sign in or use a different email.',
        );
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);
      const assignedRole = (data.role || 'student').toLowerCase();

      const user = await this.prisma.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          firstName: data.firstName,
          lastName: data.lastName,
          role: assignedRole,
        },
      });

      return {
        message: 'Registration successful',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      };
    } catch (err: any) {
      if (err?.code === 'P2002' || err?.message?.includes('P2002')) {
        throw new BadRequestException(
          'An account with this email address already exists. Please sign in or use a different email.',
        );
      }
      throw err;
    }
  }

  async login(email: string, password: string, selectedRole: string) {
    if (!selectedRole) {
      throw new BadRequestException(
        'Selected role is required to authenticate.',
      );
    }

    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Role-Lock Enforcement
    const normalizedUserRole = (user.role || 'student').toLowerCase();
    const normalizedSelectedRole = selectedRole.toLowerCase();

    if (normalizedUserRole !== normalizedSelectedRole) {
      throw new UnauthorizedException(
        'Invalid credentials or incorrect role selected for this account.',
      );
    }

    // Explicit JWT payload locking down role
    const token = this.jwtService.sign({
      sub: user.id,
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      message: 'Login successful',
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  async validateOAuthUser(data: {
    email: string;
    firstName?: string;
    lastName?: string;
    requestedRole?: string;
    provider: 'google' | 'linkedin';
  }) {
    const normalizedEmail = data.email.trim().toLowerCase();
    const requestedRole = (data.requestedRole || 'student').toLowerCase();

    let user = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      // IF NEW USER: Provision account with requested selected role
      const randomPassword = await bcrypt.hash(Math.random().toString(36), 10);
      user = await this.prisma.user.create({
        data: {
          email: normalizedEmail,
          password: randomPassword,
          firstName: data.firstName || 'OAuth',
          lastName: data.lastName || 'User',
          role: requestedRole,
        },
      });
    }

    // IF EXISTING USER: Preserve DB assigned role (do NOT allow role escalation via frontend!)
    const verifiedRole = (user.role || requestedRole).toLowerCase();

    const token = this.jwtService.sign({
      sub: user.id,
      userId: user.id,
      email: user.email,
      role: verifiedRole,
      provider: data.provider,
    });

    return {
      message: 'OAuth authentication successful',
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: verifiedRole,
      },
    };
  }
}