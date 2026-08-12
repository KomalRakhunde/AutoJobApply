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

function cleanText(input: string): string {
  if (!input || typeof input !== 'string') return '';
  return input
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[`*#_~]/g, '')
    .replace(/^\|?\s*\d+\.\s*\|?\s*/g, '')
    .replace(/^\|?\s*/, '')
    .replace(/\s*\|?\s*$/, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanCompany(rawCompany: string): string {
  let company = cleanText(rawCompany);
  // Strip YC batch tags like (YC P25), (YC S20), (YC W25), (YC F24)
  company = company.replace(/\s*\([^)]*YC[^)]*\)/gi, '').trim();
  company = company.replace(/\s*\([^\)]*\)/g, '').trim();
  return company;
}

function cleanTitle(rawTitle: string, linkUrl?: string): string {
  let title = cleanText(rawTitle);
  // Strip YC batch tags if present in title
  title = title.replace(/\s*\([^)]*YC[^)]*\)/gi, '').trim();
  // Strip leading location noise (e.g. "in Berlin – ")
  title = title.replace(/^(?:in\s+[A-Za-z\s,]+[–-]\s*)/i, '');
  // Strip leading "a ", "an ", or "for "
  title = title.replace(/^(?:a|an|for)\s+/i, '');

  if ((!title || title.toLowerCase() === 'is hiring') && linkUrl) {
    const urlSegments = linkUrl.split('/').filter(Boolean);
    const lastSegment = urlSegments.pop() || '';
    if (lastSegment && !lastSegment.startsWith('http')) {
      title = lastSegment
        .replace(/[-_]/g, ' ')
        .replace(/^[a-zA-Z0-9]{6,8}\s+/, '')
        .replace(/\b\w/g, (c) => c.toUpperCase());
    }
  }
  return title.trim();
}

export interface ExtractionResult {
  jobs: ScrapedJob[];
  linksDiscovered: number;
}

@Injectable()
export class JobExtractorService {
  private readonly logger = new Logger(JobExtractorService.name);

  /**
   * Extract structured job data deterministically from Firecrawl Markdown.
   * Zero hallucination: extracts ONLY real links and text present on the page.
   */
  async extractJobsFromMarkdown(
    markdownContent: string,
    sourceUrl: string,
  ): Promise<ScrapedJob[]> {
    const result = this.extractJobsDetailed(markdownContent, sourceUrl);
    return result.jobs;
  }

  /**
   * Detailed extraction with link count reporting.
   */
  extractJobsDetailed(
    markdownContent: string,
    sourceUrl: string,
  ): ExtractionResult {
    if (!markdownContent || markdownContent.trim().length < 20) {
      this.logger.warn(
        `[JobExtractor] Content too short or empty for source: ${sourceUrl}`,
      );
      return { jobs: [], linksDiscovered: 0 };
    }

    this.logger.log(
      `[JobExtractor] Processing deterministic extraction for ${sourceUrl} (content length: ${markdownContent.length} chars)`,
    );

    const linkRegex = /\[([^\]]+)\]\(([^)\s]+)\)/g;
    let match: RegExpExecArray | null;
    let linksDiscovered = 0;

    const jobs: ScrapedJob[] = [];
    const seenKeys = new Set<string>();

    while ((match = linkRegex.exec(markdownContent)) !== null) {
      linksDiscovered++;

      const rawText = match[1];
      const rawUrl = match[2];

      const linkText = cleanText(rawText);
      let linkUrl = rawUrl.trim();

      if (!linkText || !linkUrl) continue;

      if (!linkUrl.startsWith('http://') && !linkUrl.startsWith('https://')) {
        try {
          linkUrl = new URL(linkUrl, sourceUrl).href;
        } catch {
          continue;
        }
      }

      const lowerText = linkText.toLowerCase();

      // Filter out standard page navigation, timestamps, and non-job links
      if (
        lowerText === 'ycombinator.com' ||
        lowerText.includes('days ago') ||
        lowerText.includes('hours ago') ||
        lowerText.includes('minutes ago') ||
        lowerText.includes('seconds ago') ||
        lowerText === 'comments' ||
        lowerText === 'hide' ||
        lowerText === 'past' ||
        lowerText === 'submit' ||
        lowerText === 'apply' ||
        lowerText === 'jobs' ||
        lowerText === 'hacker news' ||
        lowerText === 'more' ||
        lowerText === 'lists' ||
        lowerText === 'contact' ||
        lowerText.includes('guidelines') ||
        lowerText.includes('faq') ||
        lowerText.includes('api') ||
        lowerText.includes('security') ||
        lowerText.includes('legal') ||
        lowerText.includes('apply to yc')
      ) {
        continue;
      }

      let company = '';
      let title = '';

      // Pattern 1: "Company (Tag) Is Hiring Title" or "Company is hiring Title"
      const hiringMatch = linkText.match(
        /^(.+?)\s+(?:is hiring|Is Hiring|hiring|Hiring)\s*(.*)$/i,
      );
      if (hiringMatch) {
        company = cleanCompany(hiringMatch[1]);
        title = cleanTitle(hiringMatch[2], linkUrl);
      } else {
        // Pattern 2: "Company - Title" or "Company – Title" or "Company — Title"
        const dashMatch = linkText.match(/^(.+?)\s+[–—\-]\s+(.+)$/);
        if (dashMatch) {
          company = cleanCompany(dashMatch[1]);
          title = cleanTitle(dashMatch[2], linkUrl);
        } else {
          // Pattern 3: "Title at Company"
          const atMatch = linkText.match(/^(.+?)\s+(?:at|@)\s+(.+)$/i);
          if (atMatch) {
            title = cleanTitle(atMatch[1], linkUrl);
            company = cleanCompany(atMatch[2]);
          } else if (
            lowerText.includes('engineer') ||
            lowerText.includes('developer') ||
            lowerText.includes('lead') ||
            lowerText.includes('manager') ||
            lowerText.includes('architect') ||
            lowerText.includes('associate')
          ) {
            // Pattern 4: Direct job title with domain/path as company
            title = cleanTitle(linkText, linkUrl);
            try {
              const parsedUrl = new URL(linkUrl);
              if (parsedUrl.hostname.includes('ycombinator.com') && parsedUrl.pathname.includes('/companies/')) {
                const parts = parsedUrl.pathname.split('/companies/')[1].split('/');
                company = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
              } else {
                company = parsedUrl.hostname.replace(/^www\./, '').split('.')[0];
                company = company.charAt(0).toUpperCase() + company.slice(1);
              }
            } catch {
              company = '';
            }
          }
        }
      }

      if (title.length < 3 || company.length < 2) continue;

      const lowerCompany = company.toLowerCase();
      const lowerTitle = title.toLowerCase();

      if (BANNED_COMPANY_PLACEHOLDERS.has(lowerCompany)) continue;
      if (BANNED_TITLE_PLACEHOLDERS.has(lowerTitle)) continue;

      const dedupKey = `${lowerCompany}|${lowerTitle}|${linkUrl.toLowerCase()}`;
      if (seenKeys.has(dedupKey)) continue;
      seenKeys.add(dedupKey);

      jobs.push({
        title,
        company,
        location: undefined,
        description: undefined,
        salary: undefined,
        sourceUrl,
        applyUrl: linkUrl,
        domain: undefined,
        skillsRequired: [],
      });
    }

    this.logger.log(
      `[JobExtractor] Discovered ${linksDiscovered} links, successfully extracted ${jobs.length} real job(s) from ${sourceUrl}`,
    );

    return { jobs, linksDiscovered };
  }
}
