export declare class ResumeParserService {
    parseResume(file: Express.Multer.File): Promise<{
        success: boolean;
        filename: string;
        pages: any;
        text: any;
    }>;
}
