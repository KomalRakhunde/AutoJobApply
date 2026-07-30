import { OpenRouterService } from './openrouter.service';
export declare class AiService {
    private readonly openRouter;
    constructor(openRouter: OpenRouterService);
    atsScore(resumeText: string, jobDescription?: string): Promise<string>;
    resumeAnalysis(resumeText: string): Promise<string>;
    coverLetter(resumeText: string, jobDescription: string): Promise<string>;
    interviewQuestions(jobTitle: string): Promise<string>;
    evaluateRecruiterCandidate(resumeText: string, jobDescription: string, requirements?: string): Promise<string>;
}
