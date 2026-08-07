export declare class OutreachService {
    private readonly logger;
    constructor();
    sendInterviewOutreach(options: {
        candidateName: string;
        candidateEmail: string;
        candidatePhone?: string;
        jobTitle: string;
        joinUrl: string;
        maxDurationMinutes: number;
        companyName?: string;
    }): Promise<{
        emailSent: boolean;
        whatsappSent: boolean;
        errors: string[];
    }>;
}
