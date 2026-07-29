import { OpenRouterService } from './openrouter.service';
export declare class AiService {
    private readonly openRouter;
    constructor(openRouter: OpenRouterService);
    atsScore(resume: string): Promise<string>;
    resumeAnalysis(resume: string): Promise<string>;
    coverLetter(resume: string, jobDescription: string): Promise<string>;
    interviewQuestions(jobRole: string): Promise<string>;
}
