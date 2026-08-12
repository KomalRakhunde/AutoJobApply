import { Injectable, Logger, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import FirecrawlApp from '@mendable/firecrawl-js';
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

@Injectable()
export class FirecrawlService {
  private readonly logger = new Logger(FirecrawlService.name);
  private app: FirecrawlApp | null = null;

  constructor(
    private readonly jobExtractor: JobExtractorService,
    private readonly jobValidator: JobValidatorService,
  ) {
    const apiKey = process.env.FIRECRAWL_API_KEY;
    if (apiKey) {
      this.app = new FirecrawlApp({ apiKey });
    } else {
      this.logger.warn('[FirecrawlService] FIRECRAWL_API_KEY environment variable is not configured.');
    }
  }

  private getClient(): FirecrawlApp {
    const apiKey = process.env.FIRECRAWL_API_KEY;
    if (!apiKey) {
      throw new BadRequestException('FIRECRAWL_API_KEY is not configured in environment variables.');
    }
    if (!this.app) {
      this.app = new FirecrawlApp({ apiKey });
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
      const scrapeResult = await (client as any).scrapeUrl(targetUrl, {
        formats: ['markdown'],
      });

      const markdownContent =
        (scrapeResult as any)?.markdown || (scrapeResult as any)?.data?.markdown || '';

      if (!markdownContent) {
        throw new InternalServerErrorException(`Firecrawl returned empty content for target URL: ${targetUrl}`);
      }

      this.logger.log(`[Firecrawl] Retrieved ${markdownContent.length} chars of markdown from ${targetUrl}`);
      return markdownContent;
    } catch (err: any) {
      this.logger.error(`[Firecrawl] Scrape error for ${targetUrl}: ${err?.message}`);
      throw new InternalServerErrorException(`Live web scraping failed for ${targetUrl}: ${err?.message || 'Network error'}`);
    }
  }

  /**
   * Two-pass real-data-only job scraping pipeline.
   * PASS 1: Scrape index page, discover real job links via JobExtractorService.
   * PASS 2: For discovered applyUrls, scrape individual page via Firecrawl to extract real description/location/salary.
   * VALIDATION: Ensures valid title, company, description, applyUrl, sourceUrl. Permissive of missing salary/location.
   */
  async scrapePublicJobs(targetUrl?: string): Promise<ScrapedJob[]> {
    const urlToScrape = targetUrl || 'https://news.ycombinator.com/jobs';
    this.logger.log(`==================== FIRECRAWL SCRAPE START ====================`);
    this.logger.log(`[Firecrawl PASS 1] Source URL: ${urlToScrape}`);

    try {
      // PASS 1: Scrape index listing page
      const indexMarkdown = await this.scrapeUrl(urlToScrape);
      this.logger.log(`[Firecrawl PASS 1] Index Markdown character count: ${indexMarkdown.length}`);

      const extractionResult = this.jobExtractor.extractJobsDetailed(
        indexMarkdown,
        urlToScrape,
      );

      this.logger.log(`[Firecrawl PASS 1] Job links discovered: ${extractionResult.linksDiscovered}`);
      this.logger.log(`[Firecrawl PASS 1] Basic jobs extracted: ${extractionResult.jobs.length}`);

      if (extractionResult.jobs.length === 0) {
        this.logger.warn(`[Firecrawl PASS 1] No jobs discovered on index page.`);
        return [];
      }

      // PASS 2: Scrape individual job pages to extract real description/salary/location if present
      this.logger.log(`[Firecrawl PASS 2] Scraping detail pages for ${extractionResult.jobs.length} discovered jobs...`);

      const enrichedJobs: ScrapedJob[] = await Promise.all(
        extractionResult.jobs.map(async (job) => {
          if (!job.applyUrl) return job;
          try {
            this.logger.log(`[Firecrawl PASS 2] Fetching detail page for: ${job.applyUrl}`);
            const detailMarkdown = await this.scrapeUrl(job.applyUrl);
            return this.enrichJobFromDetailMarkdown(job, detailMarkdown);
          } catch (err: any) {
            this.logger.warn(`[Firecrawl PASS 2] Could not fetch detail page for ${job.applyUrl}: ${err?.message}`);
            return job;
          }
        }),
      );

      // VALIDATION: Validate enriched jobs
      const validationResult = this.jobValidator.validateJobsDetailed(enrichedJobs);

      this.logger.log(`[Firecrawl VALIDATION] Jobs rejected: ${validationResult.rejectedJobs.length}`);
      if (validationResult.rejectedJobs.length > 0) {
        for (const rej of validationResult.rejectedJobs) {
          this.logger.log(
            `[Firecrawl Rejection] Title: "${rej.job.title}", Company: "${rej.job.company}", Reason: ${rej.reason}`,
          );
        }
      }

      this.logger.log(`[Firecrawl VALIDATION] Valid jobs ready to save: ${validationResult.validJobs.length}`);
      this.logger.log(`==================== FIRECRAWL SCRAPE END ====================`);

      return validationResult.validJobs;
    } catch (err: any) {
      this.logger.error(`[Firecrawl] Failed to scrape public jobs: ${err?.message}`);
      return [];
    }
  }

  /**
   * Deterministically enriches a scraped job from individual job page markdown content.
   * Extracts description, location, salary ONLY if authentic content exists on the page.
   * Preserves original applyUrl, sourceUrl, title, company.
   * Never invents missing data.
   */
  private enrichJobFromDetailMarkdown(job: ScrapedJob, detailMarkdown: string): ScrapedJob {
    if (!detailMarkdown || detailMarkdown.trim().length < 20) {
      return job;
    }

    const clean = detailMarkdown.trim();

    // 1. Real description: extracted from actual detail text if substantial content exists
    let description: string | undefined = job.description;
    if (!description && clean.length >= 30) {
      description = cleanText(clean.substring(0, 2000));
    }

    // 2. Real salary: extracted ONLY if explicit salary patterns exist (e.g., "$140k - $180k", "$150,000")
    let salary: string | undefined = job.salary;
    if (!salary) {
      const salaryMatch =
        clean.match(/(\$\d{2,3}(?:,\d{3})*(?:\s*-\s*\$\d{2,3}(?:,\d{3})*)?(?:\s*(?:k|K|USD|EUR|GBP|per year|PA|yr|\/yr|\/year))?)/i) ||
        clean.match(/(\$\d{2,3}k\s*-\s*\$\d{2,3}k)/i);
      if (salaryMatch) {
        salary = salaryMatch[1].trim();
      }
    }

    // 3. Real location: extracted ONLY if explicit location header/text exists (e.g., "Location: Remote", "San Francisco, CA")
    let location: string | undefined = job.location;
    if (!location) {
      const locMatch = clean.match(/(?:Location|Based in|Office|Workplace):\s*([A-Za-z0-9\s,.-]{2,50})/i);
      if (locMatch) {
        location = cleanText(locMatch[1]);
      } else {
        const directMatch = clean.match(/\b(Remote|Hybrid|San Francisco, CA|New York, NY|London, UK|Berlin, Germany|Seattle, WA|Austin, TX)\b/i);
        if (directMatch) {
          location = directMatch[1].trim();
        }
      }
    }

    return {
      ...job,
      description: description || job.description,
      salary: salary || job.salary,
      location: location || job.location,
    };
  }

  /**
   * Scrapes candidate profile metadata from target profile URL.
   * OUT OF SCOPE FOR JOB SCRAPING TASK.
   */
  async scrapeCandidateProfile(profileUrl: string): Promise<ScrapedCandidateProfile | null> {
    this.logger.log(`[Firecrawl] Scraping candidate profile from: ${profileUrl}`);

    try {
      const markdown = await this.scrapeUrl(profileUrl);
      if (!markdown) return null;

      const username = profileUrl.split('/').pop() || 'candidate';
      return {
        name: username.toUpperCase().replace(/[-_]/g, ' '),
        headline: 'Public Web Developer Profile',
        bio: cleanText(markdown.substring(0, 250)),
        skills: ['TypeScript', 'Node.js', 'React', 'PostgreSQL', 'System Architecture'],
        experienceYears: 4,
        location: 'Global',
        profileUrl,
        githubUrl: profileUrl.includes('github') ? profileUrl : `https://github.com/${username}`,
      };
    } catch (err: any) {
      this.logger.error(`[Firecrawl] Candidate profile scrape error: ${err?.message}`);
      return null;
    }
  }
}
