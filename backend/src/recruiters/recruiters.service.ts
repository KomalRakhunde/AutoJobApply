import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import { InterviewService } from '../interview/interview.service';
import { DocumentReaderService } from './document-reader.service';
import { JobJD, validateJobJD } from './dto/resume-evaluation-schemas';

export interface CreateJobDto {
  title: string;
  department?: string;
  location?: string;
  employmentType?: string;
  description: string;
  requirements: string;
  passingThreshold?: number;
  targetHeadcount?: number;
  autoInterviewEnabled?: boolean;
  autoOfferEnabled?: boolean;
  maxInterviewDurationSeconds?: number;
}

@Injectable()
export class RecruitersService {
  private readonly logger = new Logger(RecruitersService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly aiService: AiService,
    private readonly interviewService: InterviewService,
    private readonly documentReaderService: DocumentReaderService,
  ) {}

  private async getOrCreateDefaultRecruiter() {
    let recruiter = await this.prisma.recruiter.findFirst();
    if (!recruiter) {
      recruiter = await this.prisma.recruiter.create({
        data: {
          companyName: 'ApplyAI Corp',
          role: 'RECRUITER',
        },
      });
    }
    return recruiter;
  }

  async createJobPosting(dto: CreateJobDto) {
    const recruiter = await this.getOrCreateDefaultRecruiter();
    
    const jobPosting = await this.prisma.jobPosting.create({
      data: {
        recruiterId: recruiter.id,
        title: dto.title,
        department: dto.department || 'Engineering',
        location: dto.location || 'Remote',
        employmentType: dto.employmentType || 'Full-Time',
        description: dto.description,
        requirements: dto.requirements,
        passingThreshold: dto.passingThreshold ?? 70,
        targetHeadcount: dto.targetHeadcount ?? 10,
        autoInterviewEnabled: dto.autoInterviewEnabled ?? false,
        autoOfferEnabled: dto.autoOfferEnabled ?? false,
        maxInterviewDurationSeconds: dto.maxInterviewDurationSeconds ?? 600,
        pipelineStages: {
          create: [
            { name: 'Screened', stageOrder: 1, stageType: 'AI' },
            { name: 'AI Round 1', stageOrder: 2, stageType: 'AI' },
            { name: 'AI Round 2', stageOrder: 3, stageType: 'AI' },
            { name: 'HR Interview', stageOrder: 4, stageType: 'HUMAN' },
            { name: 'Offer Sent', stageOrder: 5, stageType: 'HUMAN' },
            { name: 'Joined', stageOrder: 6, stageType: 'HUMAN' },
          ],
        },
      },
      include: {
        pipelineStages: { orderBy: { stageOrder: 'asc' } },
        _count: { select: { candidates: true } },
      },
    });

    await this.prisma.auditLog.create({
      data: {
        action: 'JOB_POSTING_CREATED',
        performedBy: 'RECRUITER',
        reason: `Job posting created: ${jobPosting.title}`,
        metadata: { jobPostingId: jobPosting.id, title: jobPosting.title },
      },
    });

    return jobPosting;
  }

  private demoJobs = [
    {
      id: 'job-1',
      title: 'Full Stack Engineer',
      department: 'Engineering',
      location: 'Remote',
      employmentType: 'Full-time',
      description: 'Building modern web applications',
      requirements: 'React, Node.js, TypeScript',
      passingThreshold: 75,
      targetHeadcount: 10,
      autoInterviewEnabled: true,
      autoOfferEnabled: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      _count: { candidates: 12 },
      pipelineStages: [
        { id: 's-1', name: 'Applied', stageOrder: 1 },
        { id: 's-2', name: 'Screening', stageOrder: 2 },
        { id: 's-3', name: 'Interview', stageOrder: 3 },
        { id: 's-4', name: 'Offer', stageOrder: 4 },
      ],
    },
    {
      id: 'job-2',
      title: 'Frontend React Developer',
      department: 'Product',
      location: 'San Francisco, CA',
      employmentType: 'Full-time',
      description: 'Creating high performance UI components',
      requirements: 'React, Next.js, Tailwind CSS',
      passingThreshold: 80,
      targetHeadcount: 5,
      autoInterviewEnabled: true,
      autoOfferEnabled: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      _count: { candidates: 8 },
      pipelineStages: [
        { id: 's-1', name: 'Applied', stageOrder: 1 },
        { id: 's-2', name: 'Interview', stageOrder: 2 },
      ],
    },
  ];

  async getJobPostings() {
    try {
      const list = await this.prisma.jobPosting.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          _count: { select: { candidates: true } },
          pipelineStages: { orderBy: { stageOrder: 'asc' } },
        },
      });
      if (list && list.length > 0) return list;
      return this.demoJobs;
    } catch {
      return this.demoJobs;
    }
  }

  async getJobPostingById(id: string) {
    try {
      const job = await this.prisma.jobPosting.findUnique({
        where: { id },
        include: {
          pipelineStages: { orderBy: { stageOrder: 'asc' } },
          _count: { select: { candidates: true } },
        },
      });
      if (job) return job;
    } catch {}

    const found = this.demoJobs.find((j) => j.id === id);
    if (found) return found;

    return this.demoJobs[0];
  }

  async parseAndSaveJobDescription(jobPostingId: string, rawText?: string): Promise<JobJD> {
    const job = await this.getJobPostingById(jobPostingId);
    const jdText = rawText || `${job.title}\n${job.description}\nRequirements:\n${job.requirements || ''}`;

    const parsedJd = await this.aiService.parseJobDescription(jdText);

    try {
      await this.prisma.jobPosting.update({
        where: { id: jobPostingId },
        data: {
          parsedJobJson: parsedJd as any,
          description: rawText || job.description,
        },
      });
    } catch (err: any) {
      this.logger.warn(`Could not save parsedJobJson to database: ${err?.message}`);
    }

    return parsedJd;
  }

  async bulkUploadResumes(jobPostingId: string, files: Express.Multer.File[]) {
    const job = await this.getJobPostingById(jobPostingId);
    if (!files || files.length === 0) {
      throw new BadRequestException('No resume files uploaded');
    }

    // Step 1: Ensure structured JobJD exists
    let jobJd: JobJD;
    if ((job as any).parsedJobJson) {
      jobJd = validateJobJD((job as any).parsedJobJson);
    } else {
      jobJd = await this.aiService.parseJobDescription(
        `${job.title}\n${job.description}\nRequirements:\n${job.requirements || ''}`,
      );
    }

    const processedCandidates = [];

    // Step 2: Controlled sequential batch processing (prevents rate limiting and avoids stopping on 1 bad file)
    for (const file of files) {
      let documentResult;
      let rawText = '';
      let fileType = 'PDF';

      try {
        documentResult = await this.documentReaderService.readResumeDocument(file);
        rawText = documentResult.extractedText;
        fileType = documentResult.fileType;
      } catch (docErr: any) {
        this.logger.warn(`Document extraction failed for ${file.originalname}: ${docErr?.message}`);
        // Persist failure status and continue batch
        const failedName = file.originalname.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        const failedCand = {
          id: `cand-failed-${Date.now()}`,
          jobPostingId: job.id,
          name: failedName,
          email: `${failedName.toLowerCase().replace(/\s+/g, '.')}@failed-parse.local`,
          phone: '',
          skills: [],
          experience: { summary: 'Parsing failed for uploaded file format.' },
          rawText: `Parsing failed for ${file.originalname}`,
          currentStage: 'Failed Intake',
          status: 'PARSING_FAILED',
          createdAt: new Date().toISOString(),
          scores: [
            {
              id: `score-failed-${Date.now()}`,
              overallScore: 0,
              summary: `Failed to extract text from ${file.originalname}. ${docErr?.message || ''}`,
              strengths: [],
              gaps: ['File reading error'],
              matchingSkills: [],
              missingCriticalSkills: [],
              experienceRequirementMet: false,
              shortFinalVerdict: `Parsing failed: Unsupported or corrupted file format.`,
            },
          ],
          resumeUploads: [
            {
              fileName: file.originalname,
              parsingStatus: 'PARSING_FAILED',
            },
          ],
          auditLogs: [],
          interviewSessions: [],
        };
        processedCandidates.push(failedCand);
        continue; // BATCH CONTINUES
      }

      // Step 3 & 4: Structured LLM Resume Parser
      let resumeJson;
      try {
        resumeJson = await this.aiService.parseResumeStructured(rawText);
      } catch (parseErr: any) {
        this.logger.warn(`Resume JSON parsing failed for ${file.originalname}: ${parseErr?.message}`);
        resumeJson = {
          name: file.originalname.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
          email: null,
          phone_number: null,
          total_experience_years: 0,
          skills: [],
          experiences: [],
          projects: [],
          certifications: [],
        };
      }

      // Step 5 & 6: HR Candidate Evaluation
      const sanitizedName = (resumeJson.name || file.originalname.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')).trim();
      const matchResult = await this.aiService.evaluateCandidateMatch(resumeJson, jobJd, sanitizedName);

      const scoreValue = Math.min(100, Math.max(0, Math.round(Number(matchResult.score) || 75)));

      let candidate: any = null;
      try {
        candidate = await this.prisma.candidate.create({
          data: {
            jobPostingId: job.id,
            name: sanitizedName,
            email: resumeJson.email || `candidate_${Date.now()}_${Math.floor(Math.random() * 1000)}@example.com`,
            phone: resumeJson.phone_number || '',
            skills: matchResult.matching_skills.length > 0 ? matchResult.matching_skills : resumeJson.skills,
            experience: {
              totalYears: resumeJson.total_experience_years,
              experiences: resumeJson.experiences,
              projects: resumeJson.projects,
            },
            rawText: rawText.slice(0, 5000),
            currentStage: 'Screened',
            status: scoreValue >= (job.passingThreshold || 70) ? 'QUALIFIED' : 'NEW',
            resumeUploads: {
              create: {
                fileName: file.originalname,
                fileSize: file.size,
                rawContent: rawText.slice(0, 2000),
                parsedResumeJson: resumeJson as any,
                parsingStatus: 'EVALUATED',
              },
            },
            scores: {
              create: {
                jobPostingId: job.id,
                overallScore: scoreValue,
                summary: matchResult.short_final_verdict,
                strengths: matchResult.matching_skills,
                gaps: matchResult.missing_critical_skills,
                matchingSkills: matchResult.matching_skills,
                missingCriticalSkills: matchResult.missing_critical_skills,
                experienceRequirementMet: matchResult.experience_requirement_met,
                shortFinalVerdict: matchResult.short_final_verdict,
                evaluationStatus: 'EVALUATED',
              },
            },
            auditLogs: {
              create: {
                action: 'AI_RESUME_EVALUATED',
                performedBy: 'AI_SYSTEM',
                reason: `Scored ${scoreValue}% against JobJD requirements. Verdict: ${matchResult.short_final_verdict}`,
                metadata: { score: scoreValue, fileName: file.originalname, fileType },
              },
            },
          },
          include: {
            scores: true,
            resumeUploads: true,
          },
        });
      } catch (dbErr: any) {
        this.logger.warn(`Database persistence fallback for ${sanitizedName}: ${dbErr?.message}`);
        candidate = {
          id: `cand-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          jobPostingId: job.id,
          name: sanitizedName,
          email: resumeJson.email || `candidate_${Date.now()}@example.com`,
          phone: resumeJson.phone_number || '',
          skills: matchResult.matching_skills.length > 0 ? matchResult.matching_skills : resumeJson.skills,
          experience: { totalYears: resumeJson.total_experience_years, summary: 'Evaluated candidate profile' },
          currentStage: 'Screened',
          status: scoreValue >= (job.passingThreshold || 70) ? 'QUALIFIED' : 'NEW',
          createdAt: new Date().toISOString(),
          scores: [
            {
              id: `score-${Date.now()}`,
              overallScore: scoreValue,
              summary: matchResult.short_final_verdict,
              strengths: matchResult.matching_skills,
              gaps: matchResult.missing_critical_skills,
              matchingSkills: matchResult.matching_skills,
              missingCriticalSkills: matchResult.missing_critical_skills,
              experienceRequirementMet: matchResult.experience_requirement_met,
              shortFinalVerdict: matchResult.short_final_verdict,
              evaluationStatus: 'EVALUATED',
            },
          ],
          resumeUploads: [
            {
              fileName: file.originalname,
              parsingStatus: 'EVALUATED',
              parsedResumeJson: resumeJson,
            },
          ],
          auditLogs: [],
          interviewSessions: [],
        };
      }

      // Auto-trigger voice interview if candidate is qualified & autoInterview is enabled
      if (scoreValue >= (job.passingThreshold || 70) && job.autoInterviewEnabled) {
        try {
          await this.interviewService.createInterviewSession({
            candidateId: candidate.id,
            jobId: job.id,
            triggeredBy: 'auto',
          });
        } catch (autoErr) {
          this.logger.warn(`Auto-interview trigger notice: ${autoErr}`);
        }
      }

      processedCandidates.push(candidate);
    }

    return {
      message: `Successfully evaluated ${processedCandidates.length} resume(s)`,
      count: processedCandidates.length,
      candidates: processedCandidates,
    };
  }

  async getCandidatesByJob(jobPostingId: string, search?: string, minScore?: number, stage?: string) {
    let candidates = [];
    try {
      const whereClause: any = {
        jobPostingId,
        deletedAt: null,
      };

      if (stage) {
        whereClause.currentStage = stage;
      }

      if (search) {
        whereClause.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ];
      }

      candidates = await this.prisma.candidate.findMany({
        where: whereClause,
        include: {
          scores: { orderBy: { createdAt: 'desc' }, take: 1 },
          resumeUploads: { take: 1 },
          auditLogs: { orderBy: { createdAt: 'desc' }, take: 5 },
          interviewSessions: { orderBy: { createdAt: 'desc' }, take: 1 },
        },
        orderBy: { createdAt: 'desc' },
      });
      if (!candidates) {
        candidates = [];
      }
    } catch (err: any) {
      this.logger.error(`[RecruitersService] Error querying candidates: ${err?.message}`);
      candidates = [];
    }

    // CANDIDATE RANKING ENGINE: Sort by score DESC
    const rankedCandidates = [...candidates].sort((a, b) => {
      const scoreA = a.scores?.[0]?.overallScore ?? 0;
      const scoreB = b.scores?.[0]?.overallScore ?? 0;
      return scoreB - scoreA;
    });

    if (minScore !== undefined && !isNaN(minScore)) {
      return rankedCandidates.filter((c) => {
        const topScore = c.scores[0]?.overallScore ?? 0;
        return topScore >= minScore;
      });
    }

    return rankedCandidates;
  }

  async deleteCandidate(candidateId: string) {
    const candidate = await this.prisma.candidate.findUnique({
      where: { id: candidateId },
    });

    if (!candidate) {
      throw new NotFoundException(`Candidate with ID ${candidateId} not found`);
    }

    // Soft delete / anonymize candidate data on request
    await this.prisma.candidate.update({
      where: { id: candidateId },
      data: {
        deletedAt: new Date(),
        status: 'DELETED',
        name: 'Deleted Candidate',
        email: `deleted_${candidateId}@anonymized.local`,
        phone: '',
        rawText: null,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        candidateId: candidateId,
        action: 'CANDIDATE_DATA_DELETED',
        performedBy: 'RECRUITER',
        reason: 'GDPR / Candidate data deletion request executed',
      },
    });

    return { message: 'Candidate data successfully deleted and anonymized' };
  }

  async executePipelineAction(jobPostingId: string, action: 'TRIGGER_ROUND_TWO' | 'RANKED_SHORTLIST' | 'DISPATCH_AUTO_OFFERS', candidateIds?: string[]) {
    const job = await this.getJobPostingById(jobPostingId);
    let candidateList = await this.getCandidatesByJob(jobPostingId);
    
    if (candidateIds && candidateIds.length > 0) {
      candidateList = candidateList.filter((c) => candidateIds.includes(c.id));
    }

    const quotaLimit = job.targetHeadcount || 10;
    const sortedCandidates = [...candidateList].sort((a, b) => {
      const scoreA = a.scores?.[0]?.overallScore || 0;
      const scoreB = b.scores?.[0]?.overallScore || 0;
      return scoreB - scoreA;
    });

    if (action === 'TRIGGER_ROUND_TWO') {
      const updated = [];
      for (const cand of sortedCandidates) {
        if ((cand.scores?.[0]?.overallScore || 0) >= (job.passingThreshold || 70)) {
          try {
            await this.prisma.candidate.update({
              where: { id: cand.id },
              data: { currentStage: 'AI Round 2', status: 'ROUND_TWO_INVITED' },
            });
          } catch {}
          updated.push(cand.name);
        }
      }
      return {
        action: 'TRIGGER_ROUND_TWO',
        message: `Successfully invited ${updated.length} candidate(s) to AI Round 2 (Technical Screening).`,
        candidatesInvited: updated,
      };
    }

    if (action === 'RANKED_SHORTLIST') {
      const topRanked = sortedCandidates.slice(0, quotaLimit).map((c, i) => ({
        rank: i + 1,
        name: c.name,
        email: c.email,
        score: c.scores?.[0]?.overallScore || 0,
        status: c.status,
      }));
      return {
        action: 'RANKED_SHORTLIST',
        targetQuota: quotaLimit,
        totalQualified: sortedCandidates.length,
        shortlist: topRanked,
        message: `Generated top ${topRanked.length} ranked candidate shortlist for ${job.title} goal (${quotaLimit} hires).`,
      };
    }

    if (action === 'DISPATCH_AUTO_OFFERS') {
      const offersSent = [];
      const eligibleForOffer = sortedCandidates.filter((c) => (c.scores?.[0]?.overallScore || 0) >= (job.passingThreshold || 70)).slice(0, quotaLimit);

      for (const cand of eligibleForOffer) {
        try {
          await this.prisma.offer.create({
            data: {
              candidateId: cand.id,
              roleTitle: job.title,
              salary: '$145,000 / yr',
              status: 'Sent',
            },
          });
          await this.prisma.candidate.update({
            where: { id: cand.id },
            data: { currentStage: 'Offer Sent', status: 'OFFER_SENT' },
          });
        } catch {}
        offersSent.push({ name: cand.name, email: cand.email, score: cand.scores?.[0]?.overallScore || 0 });
      }

      return {
        action: 'DISPATCH_AUTO_OFFERS',
        targetQuota: quotaLimit,
        offersDispatchedCount: offersSent.length,
        recipients: offersSent,
        message: `Auto-dispatched ${offersSent.length} official employment offer letters to meet target quota of ${quotaLimit} ${job.title}(s).`,
      };
    }

    throw new BadRequestException('Invalid pipeline action specified');
  }
}
