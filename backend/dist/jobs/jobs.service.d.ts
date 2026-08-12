import { PrismaService } from '../prisma/prisma.service';
import { FirecrawlService } from '../automation/firecrawl.service';
import { AdapterRegistryService } from '../automation/adapters/adapter-registry.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
export interface UserJobMatchResult {
    job: any;
    matchScore: number;
    matchLevel: string;
    matchedSkills: string[];
    missingSkills: string[];
    reasons: string[];
    rejectionReasons: string[];
}
export declare class JobsService {
    private prisma;
    private firecrawlService;
    private adapterRegistryService;
    private readonly logger;
    constructor(prisma: PrismaService, firecrawlService: FirecrawlService, adapterRegistryService: AdapterRegistryService);
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
    findAll(userId?: string): Promise<any[]>;
    syncPublicJobs(targetUrl?: string): Promise<any[]>;
    getRecommendedJobsForStudent(userId?: string): Promise<UserJobMatchResult[]>;
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
