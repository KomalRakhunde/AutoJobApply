import { RecruitersService, CreateJobDto } from './recruiters.service';
import { CandidateSourcingService } from './sourcing.service';
export declare class RecruitersController {
    private readonly recruitersService;
    private readonly sourcingService;
    constructor(recruitersService: RecruitersService, sourcingService: CandidateSourcingService);
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
    sourceCandidatesForJob(id: string): Promise<{
        message: string;
        jobPostingId: string;
        sourcedCount: number;
        topShortlistedCount: number;
        candidates: any[];
    }>;
    bulkUploadResumes(id: string, files: Express.Multer.File[]): Promise<{
        message: string;
        count: number;
        candidates: any[];
    }>;
    getCandidatesByJob(id: string, search?: string, minScore?: string, stage?: string): Promise<any[]>;
    deleteCandidate(id: string): Promise<{
        message: string;
    }>;
    executePipelineAction(id: string, action: 'TRIGGER_ROUND_TWO' | 'RANKED_SHORTLIST' | 'DISPATCH_AUTO_OFFERS', candidateIds?: string[]): Promise<{
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
