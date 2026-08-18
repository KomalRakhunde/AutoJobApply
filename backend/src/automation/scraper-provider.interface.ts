export interface IScraperProvider {
  readonly providerName: string;
  scrapeUrl(
    targetUrl: string,
    options?: { renderJs?: boolean },
  ): Promise<string>;
}
