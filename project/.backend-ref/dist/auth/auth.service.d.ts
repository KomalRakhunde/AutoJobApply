import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(data: {
        email: string;
        password: string;
        firstName?: string;
        lastName?: string;
    }): Promise<{
        message: string;
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
    }>;
    login(email: string, password: string): Promise<{
        message: string;
        accessToken: string;
        user: {
            id: string;
            email: string;
        };
    }>;
}
