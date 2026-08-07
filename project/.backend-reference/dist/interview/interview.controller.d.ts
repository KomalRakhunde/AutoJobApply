import { InterviewService } from './interview.service';
export declare class InterviewController {
    private readonly interviewService;
    constructor(interviewService: InterviewService);
    createSession(body: {
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
    getPublicSession(token: string): Promise<{
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
    startSession(id: string): Promise<{
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
    completeSession(id: string, body: {
        transcript: string;
        durationSeconds: number;
        recordingUrl?: string;
    }): Promise<{
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
