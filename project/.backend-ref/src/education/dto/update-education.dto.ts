import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateEducationDto {
  @IsOptional()
  @IsString()
  degree?: string;

  @IsOptional()
  @IsString()
  field?: string;

  @IsOptional()
  @IsString()
  institute?: string;

  @IsOptional()
  @IsInt()
  startYear?: number;

  @IsOptional()
  @IsInt()
  endYear?: number;
}