import { PrismaService } from '../prisma/prisma.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
export declare class JobsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateJobDto): import(".prisma/client").Prisma.Prisma__JobClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        company: string;
        location: string | null;
        description: string | null;
        salary: string | null;
        applyUrl: string | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        company: string;
        location: string | null;
        description: string | null;
        salary: string | null;
        applyUrl: string | null;
    }[]>;
    update(id: string, dto: UpdateJobDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        company: string;
        location: string | null;
        description: string | null;
        salary: string | null;
        applyUrl: string | null;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
