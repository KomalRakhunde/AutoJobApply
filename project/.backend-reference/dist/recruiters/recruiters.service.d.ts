import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import { InterviewService } from '../interview/interview.service';
export interface CreateJobDto {
    title: string;
    department?: string;
    location?: string;
    employmentType?: string;
    description: string;
    requirements: string;
    passingThreshold?: number;
    autoInterviewEnabled?: boolean;
    maxInterviewDurationSeconds?: number;
}
export declare class RecruitersService {
    private readonly prisma;
    private readonly aiService;
    private readonly interviewService;
    constructor(prisma: PrismaService, aiService: AiService, interviewService: InterviewService);
    private getOrCreateDefaultRecruiter;
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
    private demoJobs;
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
    bulkUploadResumes(jobPostingId: string, files: Express.Multer.File[]): Promise<{
        message: string;
        count: number;
        candidates: any[];
    }>;
    private demoCandidates;
    getCandidatesByJob(jobPostingId: string, search?: string, minScore?: number, stage?: string): Promise<any[]>;
    deleteCandidate(candidateId: string): Promise<{
        message: string;
    }>;
}
