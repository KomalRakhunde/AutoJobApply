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
        autoInterviewEnabled: boolean;
        maxInterviewDurationSeconds: number;
    }>;
    getJobPostings(): Promise<({
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
        autoInterviewEnabled: boolean;
        maxInterviewDurationSeconds: number;
    })[]>;
    getJobPostingById(id: string): Promise<{
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
        autoInterviewEnabled: boolean;
        maxInterviewDurationSeconds: number;
    }>;
    bulkUploadResumes(jobPostingId: string, files: Express.Multer.File[]): Promise<{
        message: string;
        count: number;
        candidates: any[];
    }>;
    getCandidatesByJob(jobPostingId: string, search?: string, minScore?: number, stage?: string): Promise<({
        resumeUploads: {
            id: string;
            fileUrl: string | null;
            candidateId: string;
            fileName: string;
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
            createdAt: Date;
            updatedAt: Date;
            status: string;
            candidateId: string;
            triggeredBy: string;
            jobPostingId: string;
            roomName: string;
            joinToken: string;
            questionContext: import("@prisma/client/runtime/client").JsonValue | null;
            transcript: string | null;
            recordingUrl: string | null;
            durationSeconds: number | null;
            maxDurationSeconds: number;
            startedAt: Date | null;
            endedAt: Date | null;
        }[];
    } & {
        experience: import("@prisma/client/runtime/client").JsonValue | null;
        id: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        skills: import("@prisma/client/runtime/client").JsonValue | null;
        name: string;
        status: string;
        phone: string | null;
        jobPostingId: string;
        rawText: string | null;
        currentStage: string;
        consentGiven: boolean;
        stageUpdatedAt: Date;
        deletedAt: Date | null;
    })[]>;
    deleteCandidate(candidateId: string): Promise<{
        message: string;
    }>;
}
