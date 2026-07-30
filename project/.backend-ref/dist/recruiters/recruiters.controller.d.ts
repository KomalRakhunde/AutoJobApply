import { RecruitersService, CreateJobDto } from './recruiters.service';
export declare class RecruitersController {
    private readonly recruitersService;
    constructor(recruitersService: RecruitersService);
    createJobPosting(dto: CreateJobDto): Promise<{
        pipelineStages: {
            id: string;
            createdAt: Date;
            jobPostingId: string;
            name: string;
            stageOrder: number;
            stageType: string;
        }[];
        _count: {
            candidates: number;
        };
    } & {
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        recruiterId: string;
        title: string;
        department: string | null;
        location: string | null;
        employmentType: string | null;
        description: string;
        requirements: string;
        passingThreshold: number;
        autoInterviewEnabled: boolean;
        maxInterviewDurationSeconds: number;
    }>;
    getJobPostings(): Promise<({
        pipelineStages: {
            id: string;
            createdAt: Date;
            jobPostingId: string;
            name: string;
            stageOrder: number;
            stageType: string;
        }[];
        _count: {
            candidates: number;
        };
    } & {
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        recruiterId: string;
        title: string;
        department: string | null;
        location: string | null;
        employmentType: string | null;
        description: string;
        requirements: string;
        passingThreshold: number;
        autoInterviewEnabled: boolean;
        maxInterviewDurationSeconds: number;
    })[]>;
    getJobPostingById(id: string): Promise<{
        pipelineStages: {
            id: string;
            createdAt: Date;
            jobPostingId: string;
            name: string;
            stageOrder: number;
            stageType: string;
        }[];
        _count: {
            candidates: number;
        };
    } & {
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        recruiterId: string;
        title: string;
        department: string | null;
        location: string | null;
        employmentType: string | null;
        description: string;
        requirements: string;
        passingThreshold: number;
        autoInterviewEnabled: boolean;
        maxInterviewDurationSeconds: number;
    }>;
    bulkUploadResumes(id: string, files: Express.Multer.File[]): Promise<{
        message: string;
        count: number;
        candidates: any[];
    }>;
    getCandidatesByJob(id: string, search?: string, minScore?: string, stage?: string): Promise<({
        resumeUploads: {
            id: string;
            candidateId: string;
            fileName: string;
            fileUrl: string | null;
            fileSize: number | null;
            rawContent: string | null;
            uploadedAt: Date;
        }[];
        scores: {
            id: string;
            createdAt: Date;
            candidateId: string;
            jobPostingId: string;
            overallScore: number;
            summary: string;
            strengths: import("@prisma/client/runtime/client").JsonValue | null;
            gaps: import("@prisma/client/runtime/client").JsonValue | null;
            matchDetails: import("@prisma/client/runtime/client").JsonValue | null;
        }[];
        auditLogs: {
            id: string;
            createdAt: Date;
            candidateId: string | null;
            action: string;
            performedBy: string;
            reason: string | null;
            metadata: import("@prisma/client/runtime/client").JsonValue | null;
        }[];
        interviewSessions: {
            id: string;
            roomName: string;
            joinToken: string;
            status: string;
            questionContext: import("@prisma/client/runtime/client").JsonValue | null;
            transcript: string | null;
            recordingUrl: string | null;
            durationSeconds: number | null;
            maxDurationSeconds: number;
            triggeredBy: string;
            startedAt: Date | null;
            endedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            candidateId: string;
            jobPostingId: string;
        }[];
    } & {
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        jobPostingId: string;
        name: string;
        email: string;
        phone: string | null;
        skills: import("@prisma/client/runtime/client").JsonValue | null;
        experience: import("@prisma/client/runtime/client").JsonValue | null;
        rawText: string | null;
        currentStage: string;
        consentGiven: boolean;
        stageUpdatedAt: Date;
        deletedAt: Date | null;
    })[]>;
    deleteCandidate(id: string): Promise<{
        message: string;
    }>;
}
