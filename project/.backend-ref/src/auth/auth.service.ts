import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
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
  }) {

    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });


    if (existingUser) {
      throw new ConflictException(
        'Email already registered',
      );
    }


    const hashedPassword = await bcrypt.hash(
      data.password,
      10,
    );


    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
      },
    });


    return {
      message: 'Registration successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }



  async login(
    email: string,
    password: string,
  ) {

    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });


    if (!user) {
      throw new UnauthorizedException(
        'Invalid email or password',
      );
    }


    const passwordValid = await bcrypt.compare(
      password,
      user.password,
    );


    if (!passwordValid) {
      throw new UnauthorizedException(
        'Invalid email or password',
      );
    }


    const token = this.jwtService.sign({
      userId: user.id,
      email: user.email,
    });


    return {
      message: 'Login successful',
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }
}