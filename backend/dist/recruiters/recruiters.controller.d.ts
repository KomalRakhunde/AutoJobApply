import { RecruitersService, CreateJobDto } from './recruiters.service';
export declare class RecruitersController {
    private readonly recruitersService;
    constructor(recruitersService: RecruitersService);
    createJobPosting(dto: CreateJobDto): Promise<{
        pipelineStages: {
            id: string;
            createdAt: Date;
            name: string;
            stageOrder: number;
            stageType: string;
            jobPostingId: string;
        }[];
        _count: {
            candidates: number;
        };
    } & {
        id: string;
        title: string;
        department: string | null;
        location: string | null;
        employmentType: string | null;
        description: string;
        requirements: string;
        passingThreshold: number;
        autoInterviewEnabled: boolean;
        maxInterviewDurationSeconds: number;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        recruiterId: string;
    }>;
    getJobPostings(): Promise<({
        pipelineStages: {
            id: string;
            createdAt: Date;
            name: string;
            stageOrder: number;
            stageType: string;
            jobPostingId: string;
        }[];
        _count: {
            candidates: number;
        };
    } & {
        id: string;
        title: string;
        department: string | null;
        location: string | null;
        employmentType: string | null;
        description: string;
        requirements: string;
        passingThreshold: number;
        autoInterviewEnabled: boolean;
        maxInterviewDurationSeconds: number;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        recruiterId: string;
    })[] | {
        id: string;
        title: string;
        department: string;
        location: string;
        employmentType: string;
        description: string;
        requirements: string;
        passingThreshold: number;
        autoInterviewEnabled: boolean;
        createdAt: string;
        updatedAt: string;
        _count: {
            candidates: number;
        };
        pipelineStages: {
            id: string;
            name: string;
            stageOrder: number;
        }[];
    }[]>;
    getJobPostingById(id: string): Promise<{
        id: string;
        title: string;
        department: string;
        location: string;
        employmentType: string;
        description: string;
        requirements: string;
        passingThreshold: number;
        autoInterviewEnabled: boolean;
        createdAt: string;
        updatedAt: string;
        _count: {
            candidates: number;
        };
        pipelineStages: {
            id: string;
            name: string;
            stageOrder: number;
        }[];
    } | ({
        pipelineStages: {
            id: string;
            createdAt: Date;
            name: string;
            stageOrder: number;
            stageType: string;
            jobPostingId: string;
        }[];
        _count: {
            candidates: number;
        };
    } & {
        id: string;
        title: string;
        department: string | null;
        location: string | null;
        employmentType: string | null;
        description: string;
        requirements: string;
        passingThreshold: number;
        autoInterviewEnabled: boolean;
        maxInterviewDurationSeconds: number;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        recruiterId: string;
    })>;
    bulkUploadResumes(id: string, files: Express.Multer.File[]): Promise<{
        message: string;
        count: number;
        candidates: any[];
    }>;
    getCandidatesByJob(id: string, search?: string, minScore?: string, stage?: string): Promise<any[]>;
    deleteCandidate(id: string): Promise<{
        message: string;
    }>;
}
