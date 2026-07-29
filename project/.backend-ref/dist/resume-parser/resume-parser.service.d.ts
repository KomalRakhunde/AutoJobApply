export declare class ResumeParserService {
    parseResume(file: Express.Multer.File): Promise<{
        resumeId: `${string}-${string}-${string}-${string}-${string}`;
        extractedText: any;
    }>;
}
