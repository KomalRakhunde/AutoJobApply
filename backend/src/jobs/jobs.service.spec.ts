import { Test, TestingModule } from '@nestjs/testing';
import { JobsService } from './jobs.service';
import { PrismaService } from '../prisma/prisma.service';
import { FirecrawlService } from '../automation/firecrawl.service';
import { FallbackScraperProvider } from '../automation/fallback-scraper.provider';
import { AdapterRegistryService } from '../automation/adapters/adapter-registry.service';

describe('JobsService - FallbackScraperProvider Integration', () => {
  let service: JobsService;
  let adapterRegistryService: jest.Mocked<Partial<AdapterRegistryService>>;
  let fallbackScraperProvider: jest.Mocked<Partial<FallbackScraperProvider>>;

  const mockPrisma = {
    job: {
      findMany: jest.fn().mockResolvedValue([]),
      findFirst: jest.fn().mockResolvedValue(null),
      create: jest.fn(),
      deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
    },
  };

  beforeEach(async () => {
    adapterRegistryService = {
      fetchJobsFromPrimary: jest.fn().mockResolvedValue([]),
    };

    fallbackScraperProvider = {
      providerName: 'FallbackScraperProvider',
      scrapeUrl: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: FirecrawlService, useValue: { scrapePublicJobs: jest.fn() } },
        { provide: FallbackScraperProvider, useValue: fallbackScraperProvider },
        { provide: AdapterRegistryService, useValue: adapterRegistryService },
      ],
    }).compile();

    service = module.get<JobsService>(JobsService);
  });

  it('should pass FallbackScraperProvider into AdapterRegistryService during syncPublicJobs', async () => {
    await service.syncPublicJobs();

    expect(adapterRegistryService.fetchJobsFromPrimary).toHaveBeenCalledWith(
      fallbackScraperProvider,
    );
  });
});
