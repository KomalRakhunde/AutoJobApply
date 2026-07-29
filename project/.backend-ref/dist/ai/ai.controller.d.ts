import { AiService } from './ai.service';
export declare class AiController {
    private readonly aiService;
    constructor(aiService: AiService);
    atsScore(resume: string): Promise<string>;
    resumeAnalysis(resume: string): Promise<string>;
    coverLetter(resume: string, jobDescription: string): Promise<string>;
    interviewQuestions(jobRole: string): Promise<string>;
}
