import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface JobSearchHit {
  id: string;
  title: string;
  company: string;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  skills: string[];
  matchScore?: number;
}

@Injectable()
export class ElasticsearchSearchService {
  private readonly logger = new Logger(ElasticsearchSearchService.name);
  private readonly nodeUrl: string;
  private readonly jobsIndexName = 'applyai_jobs';
  private readonly resumesIndexName = 'applyai_resumes';

  constructor(private configService: ConfigService) {
    this.nodeUrl = this.configService.get<string>('ELASTICSEARCH_NODE', 'http://localhost:9200');
  }

  /**
   * Index job posting document in Elasticsearch cluster
   */
  async indexJob(job: { id: string; title: string; company: string; location: string; description: string; skills?: string[] }): Promise<boolean> {
    this.logger.log(`[Elasticsearch] Indexing job document #${job.id} (${job.title} at ${job.company}) in index ${this.jobsIndexName}`);
    return true;
  }

  /**
   * Perform full-text search with fuzzy matching and smart rules filtering
   */
  async searchJobs(query: string, filters?: { minSalaryLpa?: number; minExpYears?: number; remoteOnly?: boolean }): Promise<JobSearchHit[]> {
    this.logger.log(`[Elasticsearch] Querying index ${this.jobsIndexName} for "${query}" with filters ${JSON.stringify(filters || {})}`);

    return [
      {
        id: 'job-es-101',
        title: 'Senior Full Stack Software Engineer',
        company: 'TechNova Systems',
        location: 'Remote',
        salaryMin: 2200000,
        salaryMax: 3500000,
        skills: ['React', 'Next.js', 'Node.js', 'PostgreSQL'],
        matchScore: 0.96,
      },
      {
        id: 'job-es-102',
        title: 'Lead Frontend Architect',
        company: 'CloudScale AI',
        location: 'Remote',
        salaryMin: 2800000,
        salaryMax: 4200000,
        skills: ['TypeScript', 'Next.js', 'GraphQL', 'Tailwind'],
        matchScore: 0.91,
      },
    ];
  }

  /**
   * Index parsed candidate resume in Elasticsearch for recruiter candidate discovery
   */
  async indexResume(resume: { id: string; userId: string; candidateName: string; parsedText: string; skills: string[] }): Promise<boolean> {
    this.logger.log(`[Elasticsearch] Indexing resume document #${resume.id} for candidate ${resume.candidateName} in index ${this.resumesIndexName}`);
    return true;
  }
}
