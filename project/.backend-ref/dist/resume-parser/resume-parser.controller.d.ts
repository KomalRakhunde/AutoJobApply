import { ResumeParserService } from './resume-parser.service';
export declare class ResumeParserController {
    private readonly resumeParserService;
    constructor(resumeParserService: ResumeParserService);
    uploadResume(file: Express.Multer.File): Promise<{
        success: boolean;
        filename: string;
        pages: any;
        text: any;
    }>;
}
