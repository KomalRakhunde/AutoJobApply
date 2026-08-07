import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateCertificationDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  issuer?: string;

  @IsOptional()
  @IsDateString()
  issueDate?: Date;
}