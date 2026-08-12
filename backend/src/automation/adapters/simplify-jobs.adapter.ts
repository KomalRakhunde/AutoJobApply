import { Injectable, Logger } from '@nestjs/common';
import { JobSourceAdapter } from './job-source-adapter.interface';
import { FirecrawlService, ScrapedJob } from '../firecrawl.service';
import { JobExtractorService } from '../job-extractor.service';
import { JobValidatorService } from '../job-validator.service';

@Injectable()
export class SimplifyJobsAdapter implements JobSourceAdapter {
  private readonly logger = new Logger(SimplifyJobsAdapter.name);

  readonly sourceName = 'Simplify Jobs Public Feed';
  readonly permittedUrl = 'https://simplify.jobs/jobs';
  readonly isPrimary = false;

  constructor(
    private readonly jobExtractor: JobExtractorService,
    private readonly jobValidator: JobValidatorService,
  ) {}

  async fetchJobs(firecrawlService: FirecrawlService): Promise<ScrapedJob[]> {
    this.logger.log(`[Adapter: ${this.sourceName}] Scraping public tech jobs from URL: ${this.permittedUrl}`);
    try {
      const markdown = await firecrawlService.scrapeUrl(this.permittedUrl);
      const extracted = await this.jobExtractor.extractJobsFromMarkdown(markdown, this.permittedUrl);
      const valid = this.jobValidator.validateJobs(extracted);
      return valid.map((job) => ({
        ...job,
        domain: job.domain || 'Full-Stack Software Engineering',
      }));
    } catch (err: any) {
      this.logger.error(`[Adapter: ${this.sourceName}] Error scraping jobs: ${err?.message}`);
      return [];
    }
  }
}
