import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { IScraperProvider } from './scraper-provider.interface';

@Injectable()
export class CloudflareScraperService implements IScraperProvider {
  readonly providerName = 'CloudflareScraper';
  private readonly logger = new Logger(CloudflareScraperService.name);

  async scrapeUrl(
    targetUrl: string,
    options?: { renderJs?: boolean },
  ): Promise<string> {
    const workerUrl = process.env.CLOUDFLARE_WORKER_URL;
    const authToken = process.env.CLOUDFLARE_AUTH_TOKEN;
    const timeoutMs = parseInt(
      process.env.CLOUDFLARE_TIMEOUT_MS || '15000',
      10,
    );
    const enableBrowserRendering =
      options?.renderJs ??
      (process.env.CLOUDFLARE_ENABLE_BROWSER_RENDERING === 'true');

    if (!workerUrl || !workerUrl.trim()) {
      this.logger.error(
        '[CloudflareScraper] CLOUDFLARE_WORKER_URL is not configured.',
      );
      throw new BadRequestException(
        'CLOUDFLARE_WORKER_URL is not configured in environment variables.',
      );
    }

    this.logger.log(
      `[CloudflareScraper] Scraping content for URL: ${targetUrl} (RenderJS: ${enableBrowserRendering})`,
    );

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (authToken && authToken.trim()) {
        headers['Authorization'] = `Bearer ${authToken.trim()}`;
      }

      const response = await fetch(workerUrl.trim(), {
        method: 'POST',
        headers,
        body: JSON.stringify({
          url: targetUrl,
          renderJs: enableBrowserRendering,
        }),
        signal: controller.signal,
      });

      clearTimeout(timer);

      if (!response.ok) {
        this.logger.error(
          `[CloudflareScraper] Worker returned HTTP ${response.status} for URL: ${targetUrl}`,
        );
        throw new InternalServerErrorException(
          `Cloudflare scraping worker returned HTTP status ${response.status}`,
        );
      }

      const data = await response.json().catch(() => null);
      const content =
        typeof data === 'string'
          ? data
          : data?.content || data?.markdown || data?.html || '';

      if (!content || typeof content !== 'string' || !content.trim()) {
        this.logger.warn(
          `[CloudflareScraper] Received empty content response for URL: ${targetUrl}`,
        );
        return '';
      }

      this.logger.log(
        `[CloudflareScraper] Successfully retrieved ${content.length} chars from ${targetUrl}`,
      );
      return content;
    } catch (err: any) {
      clearTimeout(timer);
      if (err.name === 'AbortError') {
        this.logger.error(
          `[CloudflareScraper] Request timed out after ${timeoutMs}ms for ${targetUrl}`,
        );
        throw new InternalServerErrorException(
          `Cloudflare scraping request timed out after ${timeoutMs}ms`,
        );
      }
      if (
        err instanceof BadRequestException ||
        err instanceof InternalServerErrorException
      ) {
        throw err;
      }
      this.logger.error(
        `[CloudflareScraper] Scraping error for ${targetUrl}: ${err?.message}`,
      );
      throw new InternalServerErrorException(
        `Cloudflare web scraping failed for target URL: ${err?.message}`,
      );
    }
  }
}
