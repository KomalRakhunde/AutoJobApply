import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
export declare class ApplicationsController {
    private readonly applicationsService;
    constructor(applicationsService: ApplicationsService);
    findAllRoot(req: any): Promise<{
        status: string;
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
            location: string | null;
            company: string;
            description: string | null;
            salary: string | null;
            applyUrl: string | null;
        };
        id: string;
        updatedAt: Date;
        userId: string;
        resumeId: string | null;
        jobId: string;
        appliedAt: Date;
    }[]>;
    findAll(userId: string): Promise<{
        status: string;
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
            location: string | null;
            company: string;
            description: string | null;
            salary: string | null;
            applyUrl: string | null;
        };
        id: string;
        updatedAt: Date;
        userId: string;
        resumeId: string | null;
        jobId: string;
        appliedAt: Date;
    }[]>;
    createRoot(req: any, dto: CreateApplicationDto): Promise<{
        status: string;
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
            location: string | null;
            company: string;
            description: string | null;
            salary: string | null;
            applyUrl: string | null;
        };
        id: string;
        updatedAt: Date;
        userId: string;
        resumeId: string | null;
        jobId: string;
        appliedAt: Date;
    }>;
    bulkApply(req: any, jobIds: string[], resumeId?: string): Promise<{
        message: string;
        appliedCount: number;
        applications: any[];
    }>;
    create(userId: string, dto: CreateApplicationDto): Promise<{
        status: string;
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
            location: string | null;
            company: string;
            description: string | null;
            salary: string | null;
            applyUrl: string | null;
        };
        id: string;
        updatedAt: Date;
        userId: string;
        resumeId: string | null;
        jobId: string;
        appliedAt: Date;
    }>;
    update(id: string, dto: UpdateApplicationDto): Promise<{
        id: string;
        updatedAt: Date;
        userId: string;
        resumeId: string | null;
        jobId: string;
        status: string;
        appliedAt: Date;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
