import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ElasticsearchSearchService } from './elasticsearch.service';

@Module({
  imports: [ConfigModule],
  providers: [ElasticsearchSearchService],
  exports: [ElasticsearchSearchService],
})
export class SearchModule {}
