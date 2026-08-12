import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
export declare class JobsController {
    private readonly jobsService;
    constructor(jobsService: JobsService);
    create(dto: CreateJobDto): import(".prisma/client").Prisma.Prisma__JobClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        location: string | null;
        company: string;
        description: string | null;
        salary: string | null;
        applyUrl: string | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    findAll(req: any): Promise<any[]>;
    findAllPublicPool(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        location: string | null;
        company: string;
        description: string | null;
        salary: string | null;
        applyUrl: string | null;
    }[]>;
    getRecommended(req: any): Promise<import("./jobs.service").UserJobMatchResult[]>;
    syncPublicJobs(url?: string): Promise<any[]>;
    update(id: string, dto: UpdateJobDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        location: string | null;
        company: string;
        description: string | null;
        salary: string | null;
        applyUrl: string | null;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
