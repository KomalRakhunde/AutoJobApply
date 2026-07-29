import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getUserById(id: string): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateUser(id: string, data: {
        firstName?: string;
        lastName?: string;
    }): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
