import { Injectable, Logger } from '@nestjs/common';
import { ScrapedJob } from './firecrawl.service';

const BANNED_COMPANY_PLACEHOLDERS = new Set([
  'hiring partner',
  'unknown company',
  'unknown',
  'n/a',
  'tbd',
  'placeholder',
  'example company',
  'sample company',
  'generic company',
  'various',
  'confidential',
  'company name',
  'direct listing',
  'tesla',
  'visa',
  'boeing',
  'nyt',
]);

const BANNED_TITLE_PLACEHOLDERS = new Set([
  'job title',
  'title',
  'unknown title',
  'n/a',
  'tbd',
  'placeholder',
  'sample job',
  'example job',
  'is hiring',
]);

export interface ValidationResult {
  validJobs: ScrapedJob[];
  rejectedJobs: { job: ScrapedJob; reason: string }[];
}

@Injectable()
export class JobValidatorService {
  private readonly logger = new Logger(JobValidatorService.name);

  /**
   * Validates a single scraped job item.
   * Required fields: authentic title, company, description, applyUrl, sourceUrl.
   * Optional fields: salary and location (missing salary/location MUST NOT cause rejection).
   */
  validateJob(job: ScrapedJob): { valid: boolean; reason?: string } {
    if (!job || typeof job !== 'object') {
      return { valid: false, reason: 'Invalid or empty job object' };
    }

    const title = (job.title || '').trim();
    const company = (job.company || '').trim();
    const description = (job.description || '').trim();
    const applyUrl = (job.applyUrl || '').trim();
    const sourceUrl = (job.sourceUrl || '').trim();

    if (!title || title.length < 3) {
      return { valid: false, reason: `Invalid or missing title ("${title}")` };
    }

    if (BANNED_TITLE_PLACEHOLDERS.has(title.toLowerCase())) {
      return { valid: false, reason: `Title is a placeholder ("${title}")` };
    }

    if (!company || company.length < 2) {
      return { valid: false, reason: `Invalid or missing company ("${company}")` };
    }

    if (BANNED_COMPANY_PLACEHOLDERS.has(company.toLowerCase())) {
      return { valid: false, reason: `Company is a placeholder ("${company}")` };
    }

    if (!description || description.length < 15) {
      return { valid: false, reason: `Description missing or too short for title "${title}"` };
    }

    if (!applyUrl || (!applyUrl.startsWith('http://') && !applyUrl.startsWith('https://'))) {
      return { valid: false, reason: `Invalid or missing applyUrl ("${applyUrl}")` };
    }

    if (!sourceUrl || (!sourceUrl.startsWith('http://') && !sourceUrl.startsWith('https://'))) {
      return { valid: false, reason: `Invalid or missing sourceUrl ("${sourceUrl}")` };
    }

    return { valid: true };
  }

  /**
   * Filters an array of extracted jobs, returning valid real listings and rejection metadata.
   */
  validateJobsDetailed(jobs: ScrapedJob[]): ValidationResult {
    if (!Array.isArray(jobs)) {
      return { validJobs: [], rejectedJobs: [] };
    }

    const validJobs: ScrapedJob[] = [];
    const rejectedJobs: { job: ScrapedJob; reason: string }[] = [];
    const seenKeys = new Set<string>();

    for (const job of jobs) {
      const check = this.validateJob(job);
      if (!check.valid) {
        const reason = check.reason || 'Failed validation';
        this.logger.warn(`[JobValidator] Rejected job "${job?.title || 'Unknown'}" at "${job?.company || 'Unknown'}": ${reason}`);
        rejectedJobs.push({ job, reason });
        continue;
      }

      // Check duplicate job
      const dedupKey = `${job.company.toLowerCase()}|${job.title.toLowerCase()}|${job.applyUrl.toLowerCase()}`;
      if (seenKeys.has(dedupKey)) {
        const reason = 'Duplicate job listing';
        this.logger.warn(`[JobValidator] Rejected job "${job.title}" at "${job.company}": ${reason}`);
        rejectedJobs.push({ job, reason });
        continue;
      }

      seenKeys.add(dedupKey);
      validJobs.push(job);
    }

    this.logger.log(
      `[JobValidator] Validated ${validJobs.length} out of ${jobs.length} extracted jobs. (Rejected: ${rejectedJobs.length})`,
    );

    return { validJobs, rejectedJobs };
  }

  /**
   * Filters an array of extracted jobs, returning only valid real listings.
   */
  validateJobs(jobs: ScrapedJob[]): ScrapedJob[] {
    return this.validateJobsDetailed(jobs).validJobs;
  }
}
