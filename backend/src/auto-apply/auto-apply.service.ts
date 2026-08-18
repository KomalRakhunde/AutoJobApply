import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AutoApplyStatus } from './auto-apply.enum';

export interface ApplicationExecutionContext {
  applicationId: string;
  userId: string;
  jobId: string;
  jobTitle: string;
  company: string;
  applyUrl: string;
  resumeId: string | null;
  resumeUrl: string | null;
  status: string;
  message: string;
  submittedExternal: boolean;
}

@Injectable()
export class AutoApplyService {
  private readonly logger = new Logger(AutoApplyService.name);

  constructor(private readonly prisma: PrismaService) {}

  async executeApplication(applicationId: string): Promise<ApplicationExecutionContext> {
    this.logger.log(`[AutoApply] Starting application execution for ID: ${applicationId}`);

    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        job: true,
        resume: true,
        user: true,
      },
    });

    if (!application) {
      throw new NotFoundException(`Application with ID ${applicationId} not found`);
    }

    const applyUrl = application.job?.applyUrl;

    if (!applyUrl || typeof applyUrl !== 'string' || !applyUrl.trim()) {
      this.logger.warn(`[AutoApply] Target URL missing for Application ID: ${applicationId}`);
      await this.prisma.application.update({
        where: { id: applicationId },
        data: { status: AutoApplyStatus.FAILED },
      });
      throw new BadRequestException(
        `Job requisition "${application.job?.title || 'Unknown'}" lacks a valid applyUrl`,
      );
    }

    const trimmedUrl = applyUrl.trim();
    const isValidHttpUrl =
      trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://');

    if (!isValidHttpUrl) {
      this.logger.warn(
        `[AutoApply] Invalid URL scheme for Application ID: ${applicationId} (${trimmedUrl})`,
      );
      await this.prisma.application.update({
        where: { id: applicationId },
        data: { status: AutoApplyStatus.FAILED },
      });
      throw new BadRequestException(
        `Target URL "${trimmedUrl}" is not a valid HTTP or HTTPS address`,
      );
    }

    // Update status to PROCESSING
    await this.prisma.application.update({
      where: { id: applicationId },
      data: { status: AutoApplyStatus.PROCESSING },
    });

    this.logger.log(`[AutoApply] Starting application execution`);
    this.logger.log(`[AutoApply] Target URL: ${trimmedUrl}`);
    this.logger.log(`[AutoApply] Application status changed to PROCESSING`);

    // Automation foundation boundary - manual automation / site specific adapter required
    this.logger.warn(
      `[AutoApply] Manual automation implementation required / unsupported site`,
    );

    // Update status to MANUAL_REQUIRED so status remains accurate and is NOT falsely marked SUBMITTED
    const updatedApp = await this.prisma.application.update({
      where: { id: applicationId },
      data: { status: AutoApplyStatus.MANUAL_REQUIRED },
    });

    return {
      applicationId: updatedApp.id,
      userId: updatedApp.userId,
      jobId: updatedApp.jobId,
      jobTitle: application.job.title,
      company: application.job.company,
      applyUrl: trimmedUrl,
      resumeId: updatedApp.resumeId,
      resumeUrl: application.resume?.fileUrl || null,
      status: updatedApp.status,
      message:
        'Application validated and prepared in execution context. Manual automation implementation required / unsupported site. External submission NOT performed.',
      submittedExternal: false,
    };
  }
}
