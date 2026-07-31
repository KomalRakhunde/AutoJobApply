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
        role?: string;
    }): Promise<{
        message: string;
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            role: string;
        };
    }>;
    login(email: string, password: string, selectedRole: string): Promise<{
        message: string;
        accessToken: string;
        user: {
            id: string;
            email: string;
            role: string;
        };
    }>;
    validateOAuthUser(data: {
        email: string;
        firstName?: string;
        lastName?: string;
        requestedRole?: string;
        provider: 'google' | 'linkedin';
    }): Promise<{
        message: string;
        accessToken: string;
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            role: string;
        };
    }>;
}
