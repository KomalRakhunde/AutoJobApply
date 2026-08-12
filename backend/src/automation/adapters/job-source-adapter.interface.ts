import { ScrapedJob } from '../firecrawl.service';

export interface JobSourceAdapter {
  readonly sourceName: string;
  readonly permittedUrl: string;
  readonly isPrimary: boolean;

  fetchJobs(firecrawlService: any): Promise<ScrapedJob[]>;
}
