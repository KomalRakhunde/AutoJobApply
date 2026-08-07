import { ConfigService } from '@nestjs/config';
export declare class AwsS3StorageService {
    private configService;
    private readonly logger;
    private readonly bucketName;
    private readonly region;
    constructor(configService: ConfigService);
    uploadFile(fileBuffer: Buffer, fileName: string, mimeType: string, folder?: string): Promise<{
        url: string;
        key: string;
    }>;
    getPresignedUploadUrl(fileName: string, mimeType: string, folder?: string): Promise<{
        uploadUrl: string;
        key: string;
    }>;
    deleteFile(key: string): Promise<boolean>;
}
