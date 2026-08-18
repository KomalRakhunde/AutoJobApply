import { ScrapedJob } from '../firecrawl.service';
import { IScraperProvider } from '../scraper-provider.interface';

export interface JobSourceAdapter {
  readonly sourceName: string;
  readonly permittedUrl: string;
  readonly isPrimary: boolean;

  fetchJobs(scraperProvider: IScraperProvider): Promise<ScrapedJob[]>;
}
