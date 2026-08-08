export declare class ResumeParserService {
    private getPdfParser;
    parseResume(file: Express.Multer.File): Promise<{
        resumeId: `${string}-${string}-${string}-${string}-${string}`;
        extractedText: string;
    }>;
}
