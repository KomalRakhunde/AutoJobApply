import { IsOptional, IsString } from 'class-validator';

export class CreateResumeDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  fileUrl?: string;

  @IsOptional()
  @IsString()
  atsScore?: string;
}