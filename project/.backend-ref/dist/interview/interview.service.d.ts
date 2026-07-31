import { PrismaService } from '../prisma/prisma.service';
import { OutreachService } from './outreach.service';
export declare class InterviewService {
    private readonly prisma;
    private readonly outreachService;
    private readonly logger;
    constructor(prisma: PrismaService, outreachService: OutreachService);
    private generateLiveKitToken;
    createInterviewSession(params: {
        candidateId: string;
        jobId: string;
        triggeredBy?: 'manual' | 'auto';
    }): Promise<{
        session: {
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
        };
        joinUrl: string;
        outreachResult: any;
    }>;
    getSessionByPublicToken(token: string): Promise<{
        session: {
            id: string;
            status: string;
            maxDurationSeconds: number;
            questionContext: {
                candidateName: string;
                jobTitle: string;
                department: string;
                candidateSkills: string | number | true | import("@prisma/client/runtime/client").JsonObject | import("@prisma/client/runtime/client").JsonArray;
            };
            candidateName: string;
            jobTitle: string;
            department: string;
        };
        livekitUrl: string;
        livekitToken: string;
        roomName: string;
    } | {
        session: {
            id: string;
            status: string;
            maxDurationSeconds: number;
            questionContext: import("@prisma/client/runtime/client").JsonValue;
            candidateName: string;
            jobTitle: string;
            department: string;
        };
        livekitUrl: string;
        livekitToken: string;
        roomName: string;
    }>;
    updateSessionStatus(id: string, status: string): Promise<{
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
    } | {
        id: string;
        status: string;
        startedAt: Date;
    }>;
    completeInterviewSession(id: string, transcript: string, durationSeconds: number, recordingUrl?: string): Promise<{
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
    } | {
        id: string;
        status: string;
        transcript: string;
        durationSeconds: number;
        endedAt: Date;
    }>;
}
