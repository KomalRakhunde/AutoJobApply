import { IsOptional, IsString } from 'class-validator';

export class CreateApplicationDto {
  @IsString()
  jobId: string;

  @IsOptional()
  @IsString()
  resumeId?: string;

  @IsOptional()
  @IsString()
  status?: string;
}