import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResumeParserService } from './resume-parser.service';

@Controller('resume-parser')
export class ResumeParserController {
  constructor(
    private readonly resumeParserService: ResumeParserService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadResume(
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.resumeParserService.parseResume(file);
  }
}