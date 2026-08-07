import { Module } from '@nestjs/common';
import { ResumeParserController } from './resume-parser.controller';
import { ResumeParserService } from './resume-parser.service';

@Module({
  controllers: [ResumeParserController],
  providers: [ResumeParserService],
})
export class ResumeParserModule {}