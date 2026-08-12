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
    targetHeadcount?: number;
    autoInterviewEnabled?: boolean;
    autoOfferEnabled?: boolean;
    maxInterviewDurationSeconds?: number;
}
export declare class RecruitersService {
    private readonly prisma;
    private readonly aiService;
    private readonly interviewService;
    constructor(prisma: PrismaService, aiService: AiService, interviewService: InterviewService);
    private getOrCreateDefaultRecruiter;
    createJobPosting(dto: CreateJobDto): Promise<{
        _count: {
            candidates: number;
        };
        pipelineStages: {
            id: string;
            createdAt: Date;
            name: string;
            jobPostingId: string;
            stageOrder: number;
            stageType: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        location: string | null;
        description: string;
        status: string;
        recruiterId: string;
        department: string | null;
        employmentType: string | null;
        requirements: string;
        passingThreshold: number;
        targetHeadcount: number;
        autoInterviewEnabled: boolean;
        autoOfferEnabled: boolean;
        maxInterviewDurationSeconds: number;
    }>;
    private demoJobs;
    getJobPostings(): Promise<{
        id: string;
        title: string;
        department: string;
        location: string;
        employmentType: string;
        description: string;
        requirements: string;
        passingThreshold: number;
        targetHeadcount: number;
        autoInterviewEnabled: boolean;
        autoOfferEnabled: boolean;
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
    }[] | ({
        _count: {
            candidates: number;
        };
        pipelineStages: {
            id: string;
            createdAt: Date;
            name: string;
            jobPostingId: string;
            stageOrder: number;
            stageType: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        location: string | null;
        description: string;
        status: string;
        recruiterId: string;
        department: string | null;
        employmentType: string | null;
        requirements: string;
        passingThreshold: number;
        targetHeadcount: number;
        autoInterviewEnabled: boolean;
        autoOfferEnabled: boolean;
        maxInterviewDurationSeconds: number;
    })[]>;
    getJobPostingById(id: string): Promise<{
        id: string;
        title: string;
        department: string;
        location: string;
        employmentType: string;
        description: string;
        requirements: string;
        passingThreshold: number;
        targetHeadcount: number;
        autoInterviewEnabled: boolean;
        autoOfferEnabled: boolean;
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
        _count: {
            candidates: number;
        };
        pipelineStages: {
            id: string;
            createdAt: Date;
            name: string;
            jobPostingId: string;
            stageOrder: number;
            stageType: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        location: string | null;
        description: string;
        status: string;
        recruiterId: string;
        department: string | null;
        employmentType: string | null;
        requirements: string;
        passingThreshold: number;
        targetHeadcount: number;
        autoInterviewEnabled: boolean;
        autoOfferEnabled: boolean;
        maxInterviewDurationSeconds: number;
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
    executePipelineAction(jobPostingId: string, action: 'TRIGGER_ROUND_TWO' | 'RANKED_SHORTLIST' | 'DISPATCH_AUTO_OFFERS', candidateIds?: string[]): Promise<{
        action: string;
        message: string;
        candidatesInvited: any[];
        targetQuota?: undefined;
        totalQualified?: undefined;
        shortlist?: undefined;
        offersDispatchedCount?: undefined;
        recipients?: undefined;
    } | {
        action: string;
        targetQuota: number;
        totalQualified: number;
        shortlist: {
            rank: number;
            name: any;
            email: any;
            score: any;
            status: any;
        }[];
        message: string;
        candidatesInvited?: undefined;
        offersDispatchedCount?: undefined;
        recipients?: undefined;
    } | {
        action: string;
        targetQuota: number;
        offersDispatchedCount: number;
        recipients: any[];
        message: string;
        candidatesInvited?: undefined;
        totalQualified?: undefined;
        shortlist?: undefined;
    }>;
}
