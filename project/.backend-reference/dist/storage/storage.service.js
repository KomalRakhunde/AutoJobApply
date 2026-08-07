"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AwsS3StorageService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AwsS3StorageService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let AwsS3StorageService = AwsS3StorageService_1 = class AwsS3StorageService {
    configService;
    logger = new common_1.Logger(AwsS3StorageService_1.name);
    bucketName;
    region;
    constructor(configService) {
        this.configService = configService;
        this.bucketName = this.configService.get('AWS_S3_BUCKET', 'applyai-resumes-bucket');
        this.region = this.configService.get('AWS_REGION', 'us-east-1');
    }
    async uploadFile(fileBuffer, fileName, mimeType, folder = 'resumes') {
        const key = `${folder}/${Date.now()}-${fileName}`;
        this.logger.log(`[AWS S3] Uploading asset ${key} to bucket ${this.bucketName} (${mimeType})`);
        const s3Url = `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}`;
        return {
            url: s3Url,
            key: key,
        };
    }
    async getPresignedUploadUrl(fileName, mimeType, folder = 'resumes') {
        const key = `${folder}/${Date.now()}-${fileName}`;
        const uploadUrl = `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAEXAMPLE&X-Amz-Date=20260801T000000Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=example_signature`;
        return {
            uploadUrl,
            key,
        };
    }
    async deleteFile(key) {
        this.logger.log(`[AWS S3] Deleting asset ${key} from bucket ${this.bucketName}`);
        return true;
    }
};
exports.AwsS3StorageService = AwsS3StorageService;
exports.AwsS3StorageService = AwsS3StorageService = AwsS3StorageService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AwsS3StorageService);
//# sourceMappingURL=storage.service.js.map