import { Injectable, Logger } from '@nestjs/common';
import { JobSourceAdapter } from './job-source-adapter.interface';
import { FirecrawlService, ScrapedJob } from '../firecrawl.service';
import { JobExtractorService } from '../job-extractor.service';
import { JobValidatorService } from '../job-validator.service';

import { IScraperProvider } from '../scraper-provider.interface';

@Injectable()
export class RemoteOkJobsAdapter implements JobSourceAdapter {
  private readonly logger = new Logger(RemoteOkJobsAdapter.name);

  readonly sourceName = 'RemoteOK Software Jobs';
  readonly permittedUrl = 'https://remoteok.com/remote-dev-jobs';
  readonly isPrimary = false;

  constructor(
    private readonly jobExtractor: JobExtractorService,
    private readonly jobValidator: JobValidatorService,
  ) {}

  async fetchJobs(scraperProvider: IScraperProvider): Promise<ScrapedJob[]> {
    this.logger.log(`[Adapter: ${this.sourceName}] Fetching secondary job postings from permitted URL: ${this.permittedUrl}`);
    try {
      const markdown = await scraperProvider.scrapeUrl(this.permittedUrl, { renderJs: true });
      const extracted = await this.jobExtractor.extractJobsFromMarkdown(markdown, this.permittedUrl);
      const valid = this.jobValidator.validateJobs(extracted);
      return valid.map((job) => ({
        ...job,
        domain: job.domain || 'Remote Software Development',
      }));
    } catch (err: any) {
      this.logger.error(`[Adapter: ${this.sourceName}] Error scraping jobs: ${err?.message}`);
      return [];
    }
  }
}
