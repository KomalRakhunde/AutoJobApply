import { Injectable, Logger } from '@nestjs/common';
import { JobSourceAdapter } from './job-source-adapter.interface';
import { HnYcJobsAdapter } from './hn-yc-jobs.adapter';
import { RemoteOkJobsAdapter } from './remoteok-jobs.adapter';
import { SimplifyJobsAdapter } from './simplify-jobs.adapter';
import { FirecrawlService, ScrapedJob } from '../firecrawl.service';

@Injectable()
export class AdapterRegistryService {
  private readonly logger = new Logger(AdapterRegistryService.name);
  private readonly adapters: Map<string, JobSourceAdapter> = new Map();

  constructor(
    private readonly hnYcJobsAdapter: HnYcJobsAdapter,
    private readonly remoteOkJobsAdapter: RemoteOkJobsAdapter,
    private readonly simplifyJobsAdapter: SimplifyJobsAdapter,
  ) {
    this.registerAdapter(this.hnYcJobsAdapter);
    this.registerAdapter(this.remoteOkJobsAdapter);
    this.registerAdapter(this.simplifyJobsAdapter);
    this.logger.log(`Initialized Adapter Registry with ${this.adapters.size} job source adapters.`);
  }

  registerAdapter(adapter: JobSourceAdapter) {
    this.adapters.set(adapter.sourceName, adapter);
    this.logger.log(`Registered job source adapter: ${adapter.sourceName} (Primary: ${adapter.isPrimary})`);
  }

  getPrimaryAdapter(): JobSourceAdapter {
    for (const adapter of this.adapters.values()) {
      if (adapter.isPrimary) return adapter;
    }
    return this.hnYcJobsAdapter;
  }

  getAllAdapters(): JobSourceAdapter[] {
    return Array.from(this.adapters.values());
  }

  async fetchJobsFromPrimary(firecrawlService: FirecrawlService): Promise<ScrapedJob[]> {
    const primary = this.getPrimaryAdapter();
    this.logger.log(`[Adapter Registry] Running Primary Permitted Source Adapter: ${primary.sourceName}`);
    return primary.fetchJobs(firecrawlService);
  }

  async fetchJobsFromSource(sourceName: string, firecrawlService: FirecrawlService): Promise<ScrapedJob[]> {
    const adapter = this.adapters.get(sourceName);
    if (!adapter) {
      this.logger.warn(`Adapter '${sourceName}' not found. Falling back to Primary Adapter.`);
      return this.fetchJobsFromPrimary(firecrawlService);
    }
    return adapter.fetchJobs(firecrawlService);
  }
}
