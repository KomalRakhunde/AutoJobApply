import { Test, TestingModule } from '@nestjs/testing';
import { JobsService } from './jobs.service';
import { PrismaService } from '../prisma/prisma.service';
import { FirecrawlService } from '../automation/firecrawl.service';
import { AdapterRegistryService } from '../automation/adapters/adapter-registry.service';

describe('JobsService', () => {
  let service: JobsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobsService,
        { provide: PrismaService, useValue: {} },
        { provide: FirecrawlService, useValue: { scrapePublicJobs: jest.fn() } },
        { provide: AdapterRegistryService, useValue: { fetchJobsFromPrimary: jest.fn() } },
      ],
    }).compile();

    service = module.get<JobsService>(JobsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
