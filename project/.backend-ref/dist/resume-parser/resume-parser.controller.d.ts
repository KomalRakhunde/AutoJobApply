import { ResumeParserService } from './resume-parser.service';
export declare class ResumeParserController {
    private readonly resumeParserService;
    constructor(resumeParserService: ResumeParserService);
    uploadResume(file: Express.Multer.File): Promise<{
        resumeId: `${string}-${string}-${string}-${string}-${string}`;
        extractedText: any;
    }>;
}
