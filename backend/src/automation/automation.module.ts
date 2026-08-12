import { Module } from '@nestjs/common';
import { FirecrawlService } from './firecrawl.service';
import { JobExtractorService } from './job-extractor.service';
import { JobValidatorService } from './job-validator.service';
import { HnYcJobsAdapter } from './adapters/hn-yc-jobs.adapter';
import { RemoteOkJobsAdapter } from './adapters/remoteok-jobs.adapter';
import { SimplifyJobsAdapter } from './adapters/simplify-jobs.adapter';
import { AdapterRegistryService } from './adapters/adapter-registry.service';

@Module({
  providers: [
    JobExtractorService,
    JobValidatorService,
    FirecrawlService,
    HnYcJobsAdapter,
    RemoteOkJobsAdapter,
    SimplifyJobsAdapter,
    AdapterRegistryService,
  ],
  exports: [
    JobExtractorService,
    JobValidatorService,
    FirecrawlService,
    HnYcJobsAdapter,
    RemoteOkJobsAdapter,
    SimplifyJobsAdapter,
    AdapterRegistryService,
  ],
})
export class AutomationModule {}
