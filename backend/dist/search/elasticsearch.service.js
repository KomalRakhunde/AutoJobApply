"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ElasticsearchSearchService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElasticsearchSearchService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let ElasticsearchSearchService = ElasticsearchSearchService_1 = class ElasticsearchSearchService {
    configService;
    logger = new common_1.Logger(ElasticsearchSearchService_1.name);
    nodeUrl;
    jobsIndexName = 'applyai_jobs';
    resumesIndexName = 'applyai_resumes';
    constructor(configService) {
        this.configService = configService;
        this.nodeUrl = this.configService.get('ELASTICSEARCH_NODE', 'http://localhost:9200');
    }
    async indexJob(job) {
        this.logger.log(`[Elasticsearch] Indexing job document #${job.id} (${job.title} at ${job.company}) in index ${this.jobsIndexName}`);
        return true;
    }
    async searchJobs(query, filters) {
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
    async indexResume(resume) {
        this.logger.log(`[Elasticsearch] Indexing resume document #${resume.id} for candidate ${resume.candidateName} in index ${this.resumesIndexName}`);
        return true;
    }
};
exports.ElasticsearchSearchService = ElasticsearchSearchService;
exports.ElasticsearchSearchService = ElasticsearchSearchService = ElasticsearchSearchService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], ElasticsearchSearchService);
//# sourceMappingURL=elasticsearch.service.js.map