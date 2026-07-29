import { PrismaService } from '../prisma/prisma.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
export declare class ApplicationsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, dto: CreateApplicationDto): import(".prisma/client").Prisma.Prisma__ApplicationClient<{
        id: string;
        updatedAt: Date;
        userId: string;
        jobId: string;
        resumeId: string | null;
        status: string;
        appliedAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    findAll(userId: string): import(".prisma/client").Prisma.PrismaPromise<({
        resume: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            title: string;
            fileUrl: string | null;
            atsScore: string | null;
        };
        job: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            company: string;
            location: string | null;
            description: string | null;
            salary: string | null;
            applyUrl: string | null;
        };
    } & {
        id: string;
        updatedAt: Date;
        userId: string;
        jobId: string;
        resumeId: string | null;
        status: string;
        appliedAt: Date;
    })[]>;
    update(id: string, dto: UpdateApplicationDto): Promise<{
        id: string;
        updatedAt: Date;
        userId: string;
        jobId: string;
        resumeId: string | null;
        status: string;
        appliedAt: Date;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
