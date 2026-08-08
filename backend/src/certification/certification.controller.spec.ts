import { Test, TestingModule } from '@nestjs/testing';
import { CertificationController } from './certification.controller';
import { CertificationService } from './certification.service';
import { PrismaService } from '../prisma/prisma.service';

describe('CertificationController', () => {
  let controller: CertificationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CertificationController],
      providers: [
        CertificationService,
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    controller = module.get<CertificationController>(CertificationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
