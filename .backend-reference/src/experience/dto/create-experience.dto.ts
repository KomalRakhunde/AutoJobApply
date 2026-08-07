import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateExperienceDto {
  @IsString()
  company: string;

  @IsString()
  role: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @IsOptional()
  @IsDateString()
  endDate?: Date;
}