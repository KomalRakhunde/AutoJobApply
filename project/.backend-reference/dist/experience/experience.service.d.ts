import { PrismaService } from '../prisma/prisma.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
export declare class ExperienceService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, dto: CreateExperienceDto): Promise<{
        id: string;
        role: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        company: string;
        description: string | null;
        startDate: Date | null;
        endDate: Date | null;
    }>;
    findAll(userId: string): Promise<{
        id: string;
        role: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        company: string;
        description: string | null;
        startDate: Date | null;
        endDate: Date | null;
    }[]>;
    update(id: string, dto: UpdateExperienceDto): Promise<{
        id: string;
        role: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        company: string;
        description: string | null;
        startDate: Date | null;
        endDate: Date | null;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
