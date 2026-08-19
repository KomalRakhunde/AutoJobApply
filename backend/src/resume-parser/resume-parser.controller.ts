import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResumeParserService } from './resume-parser.service';
import { RESUME_UPLOAD_MULTER_OPTIONS } from '../auth/upload.util';

@Controller('resume-parser')
export class ResumeParserController {
  constructor(
    private readonly resumeParserService: ResumeParserService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', RESUME_UPLOAD_MULTER_OPTIONS))
  async uploadResume(
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    return this.resumeParserService.parseResume(file);
  }
}