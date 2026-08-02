import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AwsS3StorageService } from './storage.service';

@Module({
  imports: [ConfigModule],
  providers: [AwsS3StorageService],
  exports: [AwsS3StorageService],
})
export class StorageModule {}
