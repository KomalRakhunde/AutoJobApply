import { ConfigService } from '@nestjs/config';
export interface JobSearchHit {
    id: string;
    title: string;
    company: string;
    location: string;
    salaryMin?: number;
    salaryMax?: number;
    skills: string[];
    matchScore?: number;
}
export declare class ElasticsearchSearchService {
    private configService;
    private readonly logger;
    private readonly nodeUrl;
    private readonly jobsIndexName;
    private readonly resumesIndexName;
    constructor(configService: ConfigService);
    indexJob(job: {
        id: string;
        title: string;
        company: string;
        location: string;
        description: string;
        skills?: string[];
    }): Promise<boolean>;
    searchJobs(query: string, filters?: {
        minSalaryLpa?: number;
        minExpYears?: number;
        remoteOnly?: boolean;
    }): Promise<JobSearchHit[]>;
    indexResume(resume: {
        id: string;
        userId: string;
        candidateName: string;
        parsedText: string;
        skills: string[];
    }): Promise<boolean>;
}
