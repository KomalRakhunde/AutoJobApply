import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CloudflareScraperService } from './cloudflare-scraper.service';

describe('CloudflareScraperService', () => {
  let service: CloudflareScraperService;
  const originalEnv = process.env;

  beforeEach(async () => {
    jest.resetModules();
    process.env = { ...originalEnv };

    const module: TestingModule = await Test.createTestingModule({
      providers: [CloudflareScraperService],
    }).compile();

    service = module.get<CloudflareScraperService>(CloudflareScraperService);
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.restoreAllMocks();
  });

  it('should throw BadRequestException if CLOUDFLARE_WORKER_URL is missing', async () => {
    delete process.env.CLOUDFLARE_WORKER_URL;
    await expect(service.scrapeUrl('https://example.com')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should return page content on successful Cloudflare worker response', async () => {
    process.env.CLOUDFLARE_WORKER_URL = 'https://worker.test.dev';
    process.env.CLOUDFLARE_AUTH_TOKEN = 'secret-token-123';

    const mockResponse = {
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({ markdown: '# Job Listings Page Content' }),
    };
    jest.spyOn(global, 'fetch').mockResolvedValue(mockResponse as any);

    const content = await service.scrapeUrl('https://example.com/jobs');
    expect(content).toBe('# Job Listings Page Content');
    expect(global.fetch).toHaveBeenCalledWith(
      'https://worker.test.dev',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer secret-token-123',
        }),
      }),
    );
  });

  it('should throw InternalServerErrorException on non-2xx HTTP status from worker', async () => {
    process.env.CLOUDFLARE_WORKER_URL = 'https://worker.test.dev';

    const mockResponse = {
      ok: false,
      status: 500,
      text: jest.fn().mockResolvedValue('Internal Worker Error'),
    };
    jest.spyOn(global, 'fetch').mockResolvedValue(mockResponse as any);

    await expect(service.scrapeUrl('https://example.com')).rejects.toThrow(
      InternalServerErrorException,
    );
  });

  it('should return empty string if worker returns empty content', async () => {
    process.env.CLOUDFLARE_WORKER_URL = 'https://worker.test.dev';

    const mockResponse = {
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({ markdown: '' }),
    };
    jest.spyOn(global, 'fetch').mockResolvedValue(mockResponse as any);

    const content = await service.scrapeUrl('https://example.com');
    expect(content).toBe('');
  });

  it('should throw InternalServerErrorException on request timeout', async () => {
    process.env.CLOUDFLARE_WORKER_URL = 'https://worker.test.dev';
    process.env.CLOUDFLARE_TIMEOUT_MS = '50';

    jest.spyOn(global, 'fetch').mockImplementation(() => {
      const error: any = new Error('The operation was aborted');
      error.name = 'AbortError';
      return Promise.reject(error);
    });

    await expect(service.scrapeUrl('https://example.com')).rejects.toThrow(
      InternalServerErrorException,
    );
  });

  it('should never log secrets or credentials in error traces', async () => {
    process.env.CLOUDFLARE_WORKER_URL = 'https://worker.test.dev';
    process.env.CLOUDFLARE_AUTH_TOKEN = 'SUPER_SECRET_KEY_999';

    const loggerSpy = jest
      .spyOn((service as any).logger, 'error')
      .mockImplementation();

    jest.spyOn(global, 'fetch').mockRejectedValue(new Error('Connection failure'));

    await expect(service.scrapeUrl('https://example.com')).rejects.toThrow();

    for (const call of loggerSpy.mock.calls) {
      const logMessage = call.join(' ');
      expect(logMessage).not.toContain('SUPER_SECRET_KEY_999');
    }
  });
});
