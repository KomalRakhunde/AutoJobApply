import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AutoApplyService } from './auto-apply.service';
import { PrismaService } from '../prisma/prisma.service';
import { AutoApplyStatus } from './auto-apply.enum';

describe('AutoApplyService', () => {
  let service: AutoApplyService;
  let prisma: any;

  const mockPrisma = {
    application: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AutoApplyService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<AutoApplyService>(AutoApplyService);
    prisma = module.get(PrismaService);
    jest.clearAllMocks();
  });

  it('should throw NotFoundException if application does not exist', async () => {
    mockPrisma.application.findUnique.mockResolvedValue(null);
    await expect(service.executeApplication('app-123')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw BadRequestException and update status to FAILED if applyUrl is missing', async () => {
    mockPrisma.application.findUnique.mockResolvedValue({
      id: 'app-123',
      job: { title: 'Engineer', company: 'Acme', applyUrl: null },
    });
    mockPrisma.application.update.mockResolvedValue({
      id: 'app-123',
      status: AutoApplyStatus.FAILED,
    });

    await expect(service.executeApplication('app-123')).rejects.toThrow(
      BadRequestException,
    );
    expect(mockPrisma.application.update).toHaveBeenCalledWith({
      where: { id: 'app-123' },
      data: { status: AutoApplyStatus.FAILED },
    });
  });

  it('should throw BadRequestException and update status to FAILED if applyUrl is not HTTP/HTTPS', async () => {
    mockPrisma.application.findUnique.mockResolvedValue({
      id: 'app-123',
      job: { title: 'Engineer', company: 'Acme', applyUrl: 'ftp://invalid-url.com' },
    });
    mockPrisma.application.update.mockResolvedValue({
      id: 'app-123',
      status: AutoApplyStatus.FAILED,
    });

    await expect(service.executeApplication('app-123')).rejects.toThrow(
      BadRequestException,
    );
    expect(mockPrisma.application.update).toHaveBeenCalledWith({
      where: { id: 'app-123' },
      data: { status: AutoApplyStatus.FAILED },
    });
  });

  it('should transition to PROCESSING then MANUAL_REQUIRED, and NOT SUBMITTED', async () => {
    const mockApp = {
      id: 'app-999',
      userId: 'user-1',
      jobId: 'job-1',
      resumeId: 'res-1',
      job: {
        title: 'Full Stack Engineer',
        company: 'TechCorp',
        applyUrl: 'https://careers.techcorp.com/apply/123',
      },
      resume: { fileUrl: 'https://storage.com/resume.pdf' },
    };

    mockPrisma.application.findUnique.mockResolvedValue(mockApp);
    mockPrisma.application.update
      .mockResolvedValueOnce({ ...mockApp, status: AutoApplyStatus.PROCESSING })
      .mockResolvedValueOnce({ ...mockApp, status: AutoApplyStatus.MANUAL_REQUIRED });

    const result = await service.executeApplication('app-999');

    expect(mockPrisma.application.update).toHaveBeenNthCalledWith(1, {
      where: { id: 'app-999' },
      data: { status: AutoApplyStatus.PROCESSING },
    });

    expect(mockPrisma.application.update).toHaveBeenNthCalledWith(2, {
      where: { id: 'app-999' },
      data: { status: AutoApplyStatus.MANUAL_REQUIRED },
    });

    expect(result.status).toBe(AutoApplyStatus.MANUAL_REQUIRED);
    expect(result.status).not.toBe(AutoApplyStatus.SUBMITTED);
    expect(result.submittedExternal).toBe(false);
  });
});
