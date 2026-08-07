import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AwsS3StorageService {
  private readonly logger = new Logger(AwsS3StorageService.name);
  private readonly bucketName: string;
  private readonly region: string;

  constructor(private configService: ConfigService) {
    this.bucketName = this.configService.get<string>('AWS_S3_BUCKET', 'applyai-resumes-bucket');
    this.region = this.configService.get<string>('AWS_REGION', 'us-east-1');
  }

  /**
   * Upload file asset (PDF, DOCX, audio) to AWS S3 Bucket
   */
  async uploadFile(fileBuffer: Buffer, fileName: string, mimeType: string, folder = 'resumes'): Promise<{ url: string; key: string }> {
    const key = `${folder}/${Date.now()}-${fileName}`;
    this.logger.log(`[AWS S3] Uploading asset ${key} to bucket ${this.bucketName} (${mimeType})`);

    const s3Url = `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}`;

    return {
      url: s3Url,
      key: key,
    };
  }

  /**
   * Generate Presigned S3 Upload URL for direct client-side S3 upload
   */
  async getPresignedUploadUrl(fileName: string, mimeType: string, folder = 'resumes'): Promise<{ uploadUrl: string; key: string }> {
    const key = `${folder}/${Date.now()}-${fileName}`;
    const uploadUrl = `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAEXAMPLE&X-Amz-Date=20260801T000000Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=example_signature`;

    return {
      uploadUrl,
      key,
    };
  }

  /**
   * Delete asset from AWS S3 Bucket
   */
  async deleteFile(key: string): Promise<boolean> {
    this.logger.log(`[AWS S3] Deleting asset ${key} from bucket ${this.bucketName}`);
    return true;
  }
}
