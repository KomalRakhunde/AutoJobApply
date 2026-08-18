import { Injectable, Logger } from '@nestjs/common';
import { JobSourceAdapter } from './job-source-adapter.interface';
import { FirecrawlService, ScrapedJob } from '../firecrawl.service';
import { JobExtractorService } from '../job-extractor.service';
import { JobValidatorService } from '../job-validator.service';

import { IScraperProvider } from '../scraper-provider.interface';

@Injectable()
export class HnYcJobsAdapter implements JobSourceAdapter {
  private readonly logger = new Logger(HnYcJobsAdapter.name);

  readonly sourceName = 'Hacker News / YC Jobs';
  readonly permittedUrl = 'https://news.ycombinator.com/jobs';
  readonly isPrimary = true;

  constructor(
    private readonly jobExtractor: JobExtractorService,
    private readonly jobValidator: JobValidatorService,
  ) {}

  async fetchJobs(scraperProvider: IScraperProvider): Promise<ScrapedJob[]> {
    this.logger.log(`[Adapter: ${this.sourceName}] Starting extraction from: ${this.permittedUrl}`);

    try {
      const indexMarkdown = await scraperProvider.scrapeUrl(this.permittedUrl);
      const extractedJobs = await this.jobExtractor.extractJobsFromMarkdown(indexMarkdown, this.permittedUrl);
      const validJobs = this.jobValidator.validateJobs(extractedJobs);

      this.logger.log(`[Adapter: ${this.sourceName}] Successfully extracted & validated ${validJobs.length} real jobs.`);
      return validJobs;
    } catch (err: any) {
      this.logger.error(`[Adapter: ${this.sourceName}] Error scraping jobs: ${err?.message}`);
      return [];
    }
  }
}
