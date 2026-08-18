import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { IScraperProvider } from './scraper-provider.interface';
import { FirecrawlService } from './firecrawl.service';
import { CloudflareScraperService } from './cloudflare-scraper.service';

@Injectable()
export class FallbackScraperProvider implements IScraperProvider {
  readonly providerName = 'FallbackScraperProvider';
  private readonly logger = new Logger(FallbackScraperProvider.name);

  constructor(
    private readonly firecrawlService: FirecrawlService,
    private readonly cloudflareScraperService: CloudflareScraperService,
  ) {}

  async scrapeUrl(
    targetUrl: string,
    options?: { renderJs?: boolean },
  ): Promise<string> {
    this.logger.log(
      `[FallbackScraperProvider] Attempting primary provider (Firecrawl) for: ${targetUrl}`,
    );

    let content = '';
    let primaryFailed = false;

    try {
      content = await this.firecrawlService.scrapeUrl(targetUrl);
      if (
        content &&
        typeof content === 'string' &&
        content.trim().length >= 20
      ) {
        this.logger.log(
          `[FallbackScraperProvider] Primary provider (Firecrawl) succeeded for: ${targetUrl}`,
        );
        return content;
      }
      this.logger.warn(
        `[FallbackScraperProvider] Primary provider (Firecrawl) returned empty or unusable content for: ${targetUrl}`,
      );
      primaryFailed = true;
    } catch (err: any) {
      this.logger.warn(
        `[FallbackScraperProvider] Primary provider (Firecrawl) failed for ${targetUrl}: ${err?.message}`,
      );
      primaryFailed = true;
    }

    if (primaryFailed) {
      this.logger.log(
        `[FallbackScraperProvider] Invoking fallback provider (Cloudflare) for: ${targetUrl}`,
      );
      try {
        content = await this.cloudflareScraperService.scrapeUrl(
          targetUrl,
          options,
        );
        if (
          content &&
          typeof content === 'string' &&
          content.trim().length >= 20
        ) {
          this.logger.log(
            `[FallbackScraperProvider] Fallback provider (Cloudflare) succeeded for: ${targetUrl}`,
          );
          return content;
        }
        this.logger.warn(
          `[FallbackScraperProvider] Fallback provider (Cloudflare) returned empty or unusable content for: ${targetUrl}`,
        );
      } catch (err: any) {
        this.logger.error(
          `[FallbackScraperProvider] Fallback provider (Cloudflare) failed for ${targetUrl}: ${err?.message}`,
        );
      }
    }

    throw new InternalServerErrorException(
      `All web scraper providers (Firecrawl & Cloudflare) failed to retrieve valid content for ${targetUrl}`,
    );
  }
}
