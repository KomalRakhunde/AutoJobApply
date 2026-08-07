import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
export declare class ApplicationsController {
    private readonly applicationsService;
    constructor(applicationsService: ApplicationsService);
    findAllRoot(req: any): Promise<{
        id: string;
        userId: string;
        jobId: string;
        status: string;
        createdAt: string;
        updatedAt: string;
        job: {
            id: string;
            title: string;
            company: string;
            location: string;
            salary: string;
            createdAt: string;
            updatedAt: string;
        };
    }[] | ({
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
    findAll(userId: string): Promise<{
        id: string;
        userId: string;
        jobId: string;
        status: string;
        createdAt: string;
        updatedAt: string;
        job: {
            id: string;
            title: string;
            company: string;
            location: string;
            salary: string;
            createdAt: string;
            updatedAt: string;
        };
    }[] | ({
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
    createRoot(req: any, dto: CreateApplicationDto): Promise<{
        id: string;
        updatedAt: Date;
        userId: string;
        jobId: string;
        resumeId: string | null;
        status: string;
        appliedAt: Date;
    } | {
        id: string;
        userId: string;
        jobId: string;
        status: any;
        createdAt: string;
        updatedAt: string;
        job: {
            id: string;
            title: string;
            company: string;
            location: string;
            salary: string;
            createdAt: string;
            updatedAt: string;
        };
    }>;
    create(userId: string, dto: CreateApplicationDto): Promise<{
        id: string;
        updatedAt: Date;
        userId: string;
        jobId: string;
        resumeId: string | null;
        status: string;
        appliedAt: Date;
    } | {
        id: string;
        userId: string;
        jobId: string;
        status: any;
        createdAt: string;
        updatedAt: string;
        job: {
            id: string;
            title: string;
            company: string;
            location: string;
            salary: string;
            createdAt: string;
            updatedAt: string;
        };
    }>;
    update(id: string, dto: UpdateApplicationDto): Promise<{
        id: string;
        updatedAt: Date;
        userId: string;
        jobId: string;
        resumeId: string | null;
        status: string;
        appliedAt: Date;
    } | {
        id: string;
        userId: string;
        jobId: string;
        status: string;
        createdAt: string;
        updatedAt: string;
        job: {
            id: string;
            title: string;
            company: string;
            location: string;
            salary: string;
            createdAt: string;
            updatedAt: string;
        };
    } | {
        id: string;
        userId: string;
        jobId: string;
        status: string;
        createdAt: string;
        updatedAt: string;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
