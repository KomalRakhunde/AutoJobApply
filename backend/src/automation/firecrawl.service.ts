import { Injectable, Logger, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { Firecrawl } from '@mendable/firecrawl-js';
import { JobExtractorService } from './job-extractor.service';
import { JobValidatorService } from './job-validator.service';

export interface ScrapedJob {
  title: string;
  company: string;
  location?: string;
  description?: string;
  salary?: string;
  sourceUrl?: string;
  applyUrl?: string;
  domain?: string;
  skillsRequired?: string[];
}

export interface ScrapedCandidateProfile {
  name: string;
  headline?: string;
  bio?: string;
  skills?: string[];
  experienceYears?: number;
  location?: string;
  profileUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
}

function cleanText(input: string): string {
  if (!input) return '';
  return input
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^\|?\s*\d+\.\s*\|?\s*/g, '')
    .replace(/^\|?\s*/, '')
    .replace(/\s*\|?\s*$/, '')
    .trim();
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

@Injectable()
export class FirecrawlService {
  readonly providerName = 'Firecrawl';
  private readonly logger = new Logger(FirecrawlService.name);
  private app: Firecrawl | null = null;

  constructor(
    private readonly jobExtractor: JobExtractorService,
    private readonly jobValidator: JobValidatorService,
  ) {
    const apiKey = process.env.FIRECRAWL_API_KEY;
    if (apiKey) {
      this.app = new Firecrawl({ apiKey });
    } else {
      this.logger.warn('[FirecrawlService] FIRECRAWL_API_KEY environment variable is not configured.');
    }
  }

  private getClient(): Firecrawl {
    const apiKey = process.env.FIRECRAWL_API_KEY;
    if (!apiKey) {
      throw new BadRequestException('FIRECRAWL_API_KEY is not configured in environment variables.');
    }
    if (!this.app) {
      this.app = new Firecrawl({ apiKey });
    }
    return this.app;
  }

  /**
   * Scrapes raw page content from target URL using Firecrawl API.
   */
  async scrapeUrl(targetUrl: string): Promise<string> {
    const client = this.getClient();
    this.logger.log(`[Firecrawl] Scraping raw markdown from URL: ${targetUrl}`);

    try {
      const scrapeResult = await client.scrapeUrl(targetUrl, {
        formats: ['markdown'],
      });

      const markdownContent =
        scrapeResult?.markdown || (scrapeResult as any)?.data?.markdown || '';

      if (!markdownContent) {
        throw new InternalServerErrorException(`Firecrawl returned empty content for target URL: ${targetUrl}`);
      }

      this.logger.log(`[Firecrawl] Retrieved ${markdownContent.length} chars of markdown from ${targetUrl}`);
      return markdownContent;
    } catch (err: any) {
      const errMsg = err?.message || 'Network error';
      if (errMsg.includes('Rate limit exceeded')) {
        this.logger.warn(`[Firecrawl] Rate limit reached for ${targetUrl}.`);
      } else {
        this.logger.error(`[Firecrawl] Scrape error for ${targetUrl}: ${errMsg}`);
      }
      throw new InternalServerErrorException(`Live web scraping failed for ${targetUrl}: ${errMsg}`);
    }
  }

  /**
   * Performs live web search using process.env.FIRECRAWL_API_KEY via Firecrawl API.
   * Strips away any fallback arrays and returns exclusively live discovered URLs.
   */
  async searchWeb(query: string, limit = 5): Promise<string[]> {
    const apiKey = process.env.FIRECRAWL_API_KEY || process.env['FIRECRAWL_API_KEY'];
    if (!apiKey) {
      this.logger.error('[Firecrawl] FIRECRAWL_API_KEY environment variable is not configured.');
      throw new BadRequestException('FIRECRAWL_API_KEY is not configured in environment variables.');
    }

    this.logger.log(`[Firecrawl] Performing live asynchronous search with FIRECRAWL_API_KEY for: "${query}"`);

    try {
      const client = this.getClient();
      if (typeof (client as any).search === 'function') {
        const searchRes = await (client as any).search(query, { limit });
        if (searchRes && searchRes.data && Array.isArray(searchRes.data)) {
          const urls = searchRes.data.map((item: any) => item.url || item.link).filter(Boolean);
          this.logger.log(`[Firecrawl SDK Search] Retrieved ${urls.length} live URLs`);
          return urls;
        }
      }

      const response = await fetch('https://api.firecrawl.dev/v1/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ query, limit }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data?.data && Array.isArray(data.data)) {
          const urls = data.data.map((item: any) => item.url).filter(Boolean);
          this.logger.log(`[Firecrawl Live API] Discovered ${urls.length} live URLs`);
          return urls;
        }
      } else {
        const errText = await response.text();
        this.logger.error(`[Firecrawl Live Search API Error] Status ${response.status}: ${errText}`);
      }
    } catch (err: any) {
      this.logger.error(`[Firecrawl Live Search Exception] ${err?.message}`);
    }

    return [];
  }

  /**
   * Two-pass real-data-only job scraping pipeline.
   * PASS 1: Scrape index page, discover real job links via JobExtractorService.
   * PASS 2: For discovered applyUrls, scrape individual page via Firecrawl to extract real description/location/salary.
   * VALIDATION: Ensures valid title, company, description, applyUrl, sourceUrl. Permissive of missing salary/location.
   */
  async scrapePublicJobs(targetUrl?: string): Promise<ScrapedJob[]> {
    const urlToScrape = targetUrl || 'https://news.ycombinator.com/jobs';

    this.logger.log(`========================================`);
    this.logger.log(`[Firecrawl PASS 1] Scraping index page URL: ${urlToScrape}`);
    this.logger.log(`========================================`);

    let indexMarkdown = '';
    try {
      indexMarkdown = await this.scrapeUrl(urlToScrape);
    } catch (err: any) {
      this.logger.error(`[Firecrawl] Failed to scrape public jobs index: ${err?.message}`);
      return [];
    }

    if (!indexMarkdown) {
      this.logger.warn(`[Firecrawl] Empty markdown from ${urlToScrape}`);
      return [];
    }

    // PASS 1: Extract basic job listings present on index page
    const extractionResult = this.jobExtractor.extractJobsDetailed(indexMarkdown, urlToScrape);
    this.logger.log(`[Firecrawl PASS 1] Job links discovered: ${extractionResult.linksDiscovered}`);
    this.logger.log(`[Firecrawl PASS 1] Basic jobs extracted: ${extractionResult.jobs.length}`);

    if (extractionResult.jobs.length === 0) {
      this.logger.warn(`[Firecrawl PASS 1] Zero job links extracted from markdown.`);
      return [];
    }

    // PASS 2: Rate-limited detail page scraping (max 5 detail pages per sync to respect plan limits)
    const MAX_DETAIL_SCRAPES = 5;
    this.logger.log(`========================================`);
    this.logger.log(`[Firecrawl PASS 2] Scraping detail pages (max ${MAX_DETAIL_SCRAPES} per sync)...`);
    this.logger.log(`========================================`);

    const enrichedJobs: ScrapedJob[] = [];
    let detailScrapeCount = 0;

    for (const job of extractionResult.jobs) {
      let isEnriched = false;

      if (
        detailScrapeCount < MAX_DETAIL_SCRAPES &&
        job.applyUrl &&
        job.applyUrl !== urlToScrape &&
        job.applyUrl.startsWith('http')
      ) {
        try {
          await delay(1200); // 1.2s delay between detail scrape requests
          this.logger.log(`[Firecrawl PASS 2] Fetching detail page (${detailScrapeCount + 1}/${MAX_DETAIL_SCRAPES}): ${job.applyUrl}`);
          const detailMarkdown = await this.scrapeUrl(job.applyUrl);
          if (detailMarkdown) {
            detailScrapeCount++;
            enrichedJobs.push({
              title: job.title,
              company: job.company,
              applyUrl: job.applyUrl,
              sourceUrl: urlToScrape,
              description: cleanText(detailMarkdown.substring(0, 1500)),
              location: job.location || undefined,
              salary: job.salary || undefined,
            });
            isEnriched = true;
          }
        } catch (err: any) {
          this.logger.warn(`[Firecrawl PASS 2] Detail page fetch skipped for ${job.applyUrl}: ${err?.message}`);
        }
      }

      if (!isEnriched) {
        // Retain basic authentic record without inventing missing fields
        enrichedJobs.push({
          ...job,
          sourceUrl: urlToScrape,
        });
      }
    }

    // VALIDATION: Filter enriched jobs with zero-hallucination validation rules
    const validationResult = this.jobValidator.validateJobsDetailed(enrichedJobs);
    this.logger.log(`========================================`);
    this.logger.log(`[Firecrawl VALIDATION] Valid jobs: ${validationResult.validJobs.length}, Rejected: ${validationResult.rejectedJobs.length}`);
    this.logger.log(`========================================`);

    for (const rej of validationResult.rejectedJobs) {
      this.logger.warn(`[Firecrawl VALIDATION] Rejected "${rej.job.title}" at "${rej.job.company}", Reason: ${rej.reason}`);
    }

    return validationResult.validJobs;
  }

  /**
   * Scrapes real candidate profile details from public portfolio or LinkedIn markdown using Firecrawl.
   */
  async scrapeCandidateProfile(profileUrl: string): Promise<ScrapedCandidateProfile | null> {
    this.logger.log(`[Firecrawl] Scraping candidate profile from: ${profileUrl}`);

    try {
      const markdown = await this.scrapeUrl(profileUrl);
      if (!markdown) return null;

      const username = profileUrl.split('/').pop() || 'candidate';
      return {
        name: cleanText(username.replace(/[-_]/g, ' ')),
        profileUrl,
        bio: cleanText(markdown.substring(0, 300)),
      };
    } catch (err: any) {
      this.logger.error(`[Firecrawl] Candidate profile scrape error: ${err?.message}`);
      return null;
    }
  }
}
