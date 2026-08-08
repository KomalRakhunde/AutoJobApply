import { PartialType } from '@nestjs/mapped-types';
import { CreateResumeParserDto } from './create-resume-parser.dto';

export class UpdateResumeParserDto extends PartialType(CreateResumeParserDto) {}
