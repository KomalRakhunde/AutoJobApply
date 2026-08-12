import { Test, TestingModule } from '@nestjs/testing';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { PrismaService } from '../prisma/prisma.service';
import { FirecrawlService } from '../automation/firecrawl.service';
import { AdapterRegistryService } from '../automation/adapters/adapter-registry.service';

describe('JobsController', () => {
  let controller: JobsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobsController],
      providers: [
        JobsService,
        { provide: PrismaService, useValue: {} },
        { provide: FirecrawlService, useValue: { scrapePublicJobs: jest.fn() } },
        { provide: AdapterRegistryService, useValue: { fetchJobsFromPrimary: jest.fn() } },
      ],
    }).compile();

    controller = module.get<JobsController>(JobsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
