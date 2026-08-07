import { AiService } from './ai.service';
export declare class AiController {
    private readonly aiService;
    constructor(aiService: AiService);
    atsScore(resumeText: string, jobDescription?: string): Promise<string>;
    resumeAnalysis(resumeText: string): Promise<string>;
    coverLetter(resumeText: string, jobDescription: string): Promise<string>;
    interviewQuestions(jobTitle: string): Promise<string>;
}
