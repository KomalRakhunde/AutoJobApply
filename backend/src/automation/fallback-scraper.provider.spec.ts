import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { FallbackScraperProvider } from './fallback-scraper.provider';
import { FirecrawlService } from './firecrawl.service';
import { CloudflareScraperService } from './cloudflare-scraper.service';

describe('FallbackScraperProvider', () => {
  let provider: FallbackScraperProvider;
  let firecrawlService: jest.Mocked<Partial<FirecrawlService>>;
  let cloudflareScraperService: jest.Mocked<Partial<CloudflareScraperService>>;

  beforeEach(async () => {
    firecrawlService = {
      scrapeUrl: jest.fn(),
    };
    cloudflareScraperService = {
      scrapeUrl: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FallbackScraperProvider,
        { provide: FirecrawlService, useValue: firecrawlService },
        { provide: CloudflareScraperService, useValue: cloudflareScraperService },
      ],
    }).compile();

    provider = module.get<FallbackScraperProvider>(FallbackScraperProvider);
  });

  it('should return Firecrawl content and NOT call Cloudflare when Firecrawl succeeds', async () => {
    const validMarkdown = '# Valid Job Listing Content with sufficient length for extraction';
    (firecrawlService.scrapeUrl as jest.Mock).mockResolvedValue(validMarkdown);

    const result = await provider.scrapeUrl('https://example.com/jobs');

    expect(result).toBe(validMarkdown);
    expect(firecrawlService.scrapeUrl).toHaveBeenCalledWith('https://example.com/jobs');
    expect(cloudflareScraperService.scrapeUrl).not.toHaveBeenCalled();
  });

  it('should fallback to Cloudflare when Firecrawl throws an error', async () => {
    (firecrawlService.scrapeUrl as jest.Mock).mockRejectedValue(
      new Error('Firecrawl API rate limit exceeded'),
    );
    const cloudflareContent = '# Fallback Job Content from Cloudflare Worker';
    (cloudflareScraperService.scrapeUrl as jest.Mock).mockResolvedValue(cloudflareContent);

    const result = await provider.scrapeUrl('https://example.com/jobs');

    expect(result).toBe(cloudflareContent);
    expect(firecrawlService.scrapeUrl).toHaveBeenCalledWith('https://example.com/jobs');
    expect(cloudflareScraperService.scrapeUrl).toHaveBeenCalledWith(
      'https://example.com/jobs',
      undefined,
    );
  });

  it('should fallback to Cloudflare when Firecrawl returns empty or unusable content', async () => {
    (firecrawlService.scrapeUrl as jest.Mock).mockResolvedValue('');
    const cloudflareContent = '# Cloudflare Rendered Content for Job Board';
    (cloudflareScraperService.scrapeUrl as jest.Mock).mockResolvedValue(cloudflareContent);

    const result = await provider.scrapeUrl('https://example.com/jobs');

    expect(result).toBe(cloudflareContent);
    expect(cloudflareScraperService.scrapeUrl).toHaveBeenCalled();
  });

  it('should throw InternalServerErrorException when both providers fail', async () => {
    (firecrawlService.scrapeUrl as jest.Mock).mockRejectedValue(new Error('Firecrawl error'));
    (cloudflareScraperService.scrapeUrl as jest.Mock).mockRejectedValue(new Error('Cloudflare error'));

    await expect(provider.scrapeUrl('https://example.com/jobs')).rejects.toThrow(
      InternalServerErrorException,
    );
  });

  it('should never return fabricated or mock job content on failure', async () => {
    (firecrawlService.scrapeUrl as jest.Mock).mockResolvedValue('');
    (cloudflareScraperService.scrapeUrl as jest.Mock).mockResolvedValue('');

    await expect(provider.scrapeUrl('https://example.com/jobs')).rejects.toThrow();
  });
});
