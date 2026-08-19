import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  ConflictException,
  ServiceUnavailableException,
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

  private assertDatabaseAvailable() {
    if (!this.prisma.isConnected) {
      throw new ServiceUnavailableException(
        'The database is currently unavailable. Please try again in a moment.',
      );
    }
  }

  async register(data: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    role?: string;
  }) {
    if (!data.email || !data.email.trim()) {
      throw new BadRequestException('Email address is required.');
    }
    if (!data.password) {
      throw new BadRequestException('Password is required.');
    }

    const normalizedEmail = data.email.trim().toLowerCase();

    // Password Strength Server-side Enforcement (Requires min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    if (!passwordRegex.test(data.password)) {
      throw new BadRequestException(
        'Password must be at least 8 characters long and include uppercase, lowercase, a digit, and a special character.',
      );
    }

    const assignedRole = (data.role || 'student').toLowerCase();

    this.assertDatabaseAvailable();

    try {
      const existingUser = await this.prisma.user.findUnique({
        where: {
          email: normalizedEmail,
        },
      });

      if (existingUser) {
        throw new ConflictException(
          'An account with this email address already exists. Please sign in or use a different email.',
        );
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);

      const user = await this.prisma.user.create({
        data: {
          email: normalizedEmail,
          password: hashedPassword,
          firstName: data.firstName,
          lastName: data.lastName,
          role: assignedRole,
        },
      });

      const token = this.jwtService.sign({
        sub: user.id,
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      return {
        message: 'Registration successful',
        accessToken: token,
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
        throw new ConflictException(
          'An account with this email address already exists. Please sign in or use a different email.',
        );
      }
      if (
        err instanceof BadRequestException ||
        err instanceof ConflictException ||
        err instanceof ServiceUnavailableException
      ) {
        throw err;
      }
      throw new ServiceUnavailableException(
        'Registration failed due to a database error. Please try again.',
      );
    }
  }

  async login(email: string, password: string, selectedRole: string) {
    if (!selectedRole) {
      throw new BadRequestException(
        'Selected role is required to authenticate.',
      );
    }

    this.assertDatabaseAvailable();

    let user: any = null;
    try {
      user = await this.prisma.user.findUnique({
        where: { email },
      });
    } catch {
      throw new ServiceUnavailableException(
        'Login failed due to a database error. Please try again.',
      );
    }

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
    provider: 'google' | 'linkedin' | 'microsoft';
    providerId?: string;
    picture?: string;
  }) {
    if (!data.email || !data.email.trim()) {
      throw new BadRequestException('Email address is required for OAuth validation.');
    }
    const normalizedEmail = data.email.trim().toLowerCase();
    const requestedRole = (data.requestedRole || 'student').toLowerCase();

    this.assertDatabaseAvailable();

    let user: any = null;
    let isNewUser = false;
    try {
      user = await this.prisma.user.findUnique({
        where: { email: normalizedEmail },
      });

      if (!user) {
        isNewUser = true;
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
      } else {
        // Optionally update missing profile names if provided from OAuth
        if ((!user.firstName && data.firstName) || (!user.lastName && data.lastName)) {
          user = await this.prisma.user.update({
            where: { id: user.id },
            data: {
              firstName: user.firstName || data.firstName,
              lastName: user.lastName || data.lastName,
            },
          });
        }
      }
    } catch (err: any) {
      throw new ServiceUnavailableException(
        'OAuth authentication failed due to a database error. Please try again.',
      );
    }

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
        isNewUser,
        acceptedTermsAt: user.createdAt || new Date().toISOString(),
      },
    };
  }
}
