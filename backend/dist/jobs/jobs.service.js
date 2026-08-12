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
var JobsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const firecrawl_service_1 = require("../automation/firecrawl.service");
const adapter_registry_service_1 = require("../automation/adapters/adapter-registry.service");
function cleanText(input) {
    if (!input || typeof input !== 'string')
        return null;
    const cleaned = input
        .replace(/!\[.*?\]\(.*?\)/g, '')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/^\|?\s*\d+\.\s*\|?\s*/g, '')
        .replace(/^\|?\s*/, '')
        .replace(/\s*\|?\s*$/, '')
        .trim();
    return cleaned.length > 0 ? cleaned : null;
}
const SKILL_ALIASES = {
    js: 'JavaScript',
    javascript: 'JavaScript',
    ts: 'TypeScript',
    typescript: 'TypeScript',
    node: 'Node.js',
    nodejs: 'Node.js',
    'node.js': 'Node.js',
    react: 'React',
    reactjs: 'React',
    'react.js': 'React',
    next: 'Next.js',
    nextjs: 'Next.js',
    'next.js': 'Next.js',
    postgres: 'PostgreSQL',
    postgresql: 'PostgreSQL',
    python: 'Python',
    py: 'Python',
    java: 'Java',
    go: 'Go',
    golang: 'Go',
    rust: 'Rust',
    'c++': 'C++',
    cpp: 'C++',
    aws: 'AWS',
    amazon: 'AWS',
    docker: 'Docker',
    kubernetes: 'Kubernetes',
    k8s: 'Kubernetes',
    graphql: 'GraphQL',
    rest: 'REST API',
    tailwind: 'Tailwind CSS',
    tailwindcss: 'Tailwind CSS',
    vue: 'Vue.js',
    vuejs: 'Vue.js',
    angular: 'Angular',
    express: 'Express',
    expressjs: 'Express',
    nest: 'NestJS',
    nestjs: 'NestJS',
    mongodb: 'MongoDB',
    mongo: 'MongoDB',
    redis: 'Redis',
    sql: 'SQL',
    git: 'Git',
    'ci/cd': 'CI/CD',
    cicd: 'CI/CD',
    llm: 'LLMs',
    llms: 'LLMs',
    ai: 'AI',
    ml: 'Machine Learning',
};
function normalizeSkillName(raw) {
    if (!raw)
        return '';
    const lower = raw.trim().toLowerCase();
    return SKILL_ALIASES[lower] || raw.trim();
}
function hasSkillInText(text, aliasKey) {
    if (!text || !aliasKey)
        return false;
    const escaped = aliasKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(?:^|\\W)${escaped}(?:$|\\W)`, 'i');
    return regex.test(text);
}
let JobsService = JobsService_1 = class JobsService {
    prisma;
    firecrawlService;
    adapterRegistryService;
    logger = new common_1.Logger(JobsService_1.name);
    constructor(prisma, firecrawlService, adapterRegistryService) {
        this.prisma = prisma;
        this.firecrawlService = firecrawlService;
        this.adapterRegistryService = adapterRegistryService;
    }
    create(dto) {
        return this.prisma.job.create({ data: dto });
    }
    async findAllPublicPool() {
        let jobs = await this.prisma.job.findMany({
            orderBy: { createdAt: 'desc' },
        });
        if (jobs.length === 0) {
            this.logger.log('[Production Jobs] Database pool is empty. Triggering public sync...');
            jobs = await this.syncPublicJobs();
        }
        return jobs;
    }
    async findAll(userId) {
        if (userId) {
            const matched = await this.getRecommendedJobsForStudent(userId);
            return matched.map((m) => ({
                ...m.job,
                matchScore: m.matchScore,
                matchLevel: m.matchLevel,
                matchedSkills: m.matchedSkills,
                reasons: m.reasons,
            }));
        }
        return this.findAllPublicPool();
    }
    async syncPublicJobs(targetUrl) {
        let scrapedJobs = [];
        const sourceUrl = targetUrl || 'https://news.ycombinator.com/jobs';
        if (targetUrl) {
            this.logger.log(`[Production Jobs] Scrape triggered for target URL: ${targetUrl}`);
            scrapedJobs = await this.firecrawlService.scrapePublicJobs(targetUrl);
        }
        else {
            this.logger.log('[Production Jobs] Executing Primary Permitted Source Adapter for Full Stack Engineering');
            scrapedJobs = await this.adapterRegistryService.fetchJobsFromPrimary(this.firecrawlService);
        }
        await this.prisma.job.deleteMany({
            where: {
                company: { in: ['Naukri Partner Tech', 'Innovate Intelligence', 'CloudScale Global', 'Tesla', 'Visa', 'Boeing', 'NYT'] },
            },
        }).catch(() => { });
        if (scrapedJobs.length === 0) {
            this.logger.warn(`[Production Jobs] Zero real jobs extracted from ${sourceUrl}. Nothing will be inserted.`);
            return [];
        }
        const savedJobs = [];
        let newCount = 0;
        let updatedCount = 0;
        for (const j of scrapedJobs) {
            const title = cleanText(j.title);
            const company = cleanText(j.company);
            const applyUrl = j.applyUrl ? j.applyUrl.trim() : null;
            if (!title || title.length < 3 || !company || company.length < 2)
                continue;
            let existing = null;
            if (applyUrl) {
                existing = await this.prisma.job.findFirst({
                    where: { applyUrl },
                });
            }
            if (!existing) {
                existing = await this.prisma.job.findFirst({
                    where: { title, company },
                });
            }
            if (!existing) {
                const created = await this.prisma.job.create({
                    data: {
                        title,
                        company,
                        location: cleanText(j.location),
                        description: cleanText(j.description),
                        salary: cleanText(j.salary),
                        applyUrl,
                    },
                });
                savedJobs.push(created);
                newCount++;
            }
            else {
                const updateData = {};
                if (cleanText(j.location) && !existing.location)
                    updateData.location = cleanText(j.location);
                if (cleanText(j.description) && !existing.description)
                    updateData.description = cleanText(j.description);
                if (cleanText(j.salary) && !existing.salary)
                    updateData.salary = cleanText(j.salary);
                if (applyUrl && !existing.applyUrl)
                    updateData.applyUrl = applyUrl;
                if (Object.keys(updateData).length > 0) {
                    const updated = await this.prisma.job.update({
                        where: { id: existing.id },
                        data: updateData,
                    });
                    savedJobs.push(updated);
                    updatedCount++;
                }
                else {
                    savedJobs.push(existing);
                }
            }
        }
        this.logger.log(`[Production Jobs] Public sync complete for ${sourceUrl}. Total in pool: ${savedJobs.length} (New: ${newCount}, Updated: ${updatedCount})`);
        return savedJobs;
    }
    async getRecommendedJobsForStudent(userId) {
        if (!userId) {
            this.logger.warn('[JobsMatching] getRecommendedJobsForStudent called without valid userId.');
            return [];
        }
        const jobs = await this.prisma.job.findMany({
            orderBy: { createdAt: 'desc' },
        });
        if (jobs.length === 0) {
            return [];
        }
        const profile = await this.prisma.profile.findUnique({ where: { userId } });
        const userSkills = await this.prisma.skill.findMany({ where: { userId } });
        const userExperiences = await this.prisma.experience.findMany({ where: { userId } });
        const userResumes = await this.prisma.resume.findMany({
            where: { userId },
            include: { analyses: true },
        });
        const candidateSkillSet = new Set();
        for (const s of userSkills) {
            if (s.name)
                candidateSkillSet.add(normalizeSkillName(s.name));
        }
        for (const exp of userExperiences) {
            if (exp.role)
                candidateSkillSet.add(normalizeSkillName(exp.role));
            if (exp.description) {
                for (const aliasKey of Object.keys(SKILL_ALIASES)) {
                    if (hasSkillInText(exp.description, aliasKey)) {
                        candidateSkillSet.add(SKILL_ALIASES[aliasKey]);
                    }
                }
            }
        }
        for (const res of userResumes) {
            if (res.analyses && Array.isArray(res.analyses)) {
                for (const analysis of res.analyses) {
                    if (Array.isArray(analysis.strengths)) {
                        for (const item of analysis.strengths) {
                            if (typeof item === 'string')
                                candidateSkillSet.add(normalizeSkillName(item));
                        }
                    }
                }
            }
        }
        const candidateSkillsArray = Array.from(candidateSkillSet).filter(Boolean);
        let totalExperienceYears = 0;
        for (const exp of userExperiences) {
            if (exp.startDate) {
                const start = new Date(exp.startDate).getTime();
                const end = exp.endDate ? new Date(exp.endDate).getTime() : Date.now();
                const diffYears = (end - start) / (1000 * 60 * 60 * 24 * 365.25);
                if (diffYears > 0)
                    totalExperienceYears += diffYears;
            }
            else {
                totalExperienceYears += 1;
            }
        }
        const allowedSoftwareRoleKeywords = [
            'software engineer', 'software developer', 'full stack', 'fullstack',
            'frontend', 'backend', 'web developer', 'application engineer',
            'ai engineer', 'ml engineer', 'machine learning', 'data engineer',
            'devops engineer', 'cloud engineer', 'platform engineer',
            'member of technical staff', 'founding engineer', 'systems engineer',
        ];
        const excludedNonSoftwareRoleKeywords = [
            'technical support', 'support engineer', 'solutions engineer',
            'sales engineer', 'customer success', 'product educator',
            'account executive', 'demand gen', 'marketing manager',
            'recruiter', 'hr manager', 'chemical process engineer',
            'biotech engineer', 'civil engineer', 'mechanical engineer',
            'head of finance',
        ];
        const MATCH_THRESHOLD = 65;
        const matchedResults = [];
        for (const job of jobs) {
            const jobTitle = (job.title || '').toLowerCase();
            const jobDesc = (job.description || '').toLowerCase();
            const jobLoc = (job.location || '').toLowerCase();
            const combinedText = `${jobTitle} ${jobDesc} ${jobLoc}`;
            const isExcludedRole = excludedNonSoftwareRoleKeywords.some((kw) => jobTitle.includes(kw));
            if (isExcludedRole) {
                this.logger.debug(`[JobsMatching] Job "${job.title}" hard rejected (Excluded non-software/support role family)`);
                continue;
            }
            const isSeniorStaffOrLead = jobTitle.includes('staff') ||
                jobTitle.includes('principal') ||
                jobTitle.includes('head of engineering') ||
                jobTitle.includes('tech lead') ||
                jobDesc.includes('6+ years') ||
                jobDesc.includes('7+ years') ||
                jobDesc.includes('8+ years');
            if (isSeniorStaffOrLead && totalExperienceYears < 2.5) {
                this.logger.debug(`[JobsMatching] Job "${job.title}" hard rejected (Requires senior/staff experience 5+ yrs vs candidate ${Math.round(totalExperienceYears)} yrs)`);
                continue;
            }
            const jobRequiredSkills = new Set();
            for (const [aliasKey, normalizedName] of Object.entries(SKILL_ALIASES)) {
                if (hasSkillInText(combinedText, aliasKey)) {
                    jobRequiredSkills.add(normalizedName);
                }
            }
            const jobSkillsArray = Array.from(jobRequiredSkills);
            const matchedSkills = [];
            const missingSkills = [];
            for (const skill of jobSkillsArray) {
                if (candidateSkillsArray.includes(skill)) {
                    matchedSkills.push(skill);
                }
                else {
                    missingSkills.push(skill);
                }
            }
            let skillScore = 0;
            if (candidateSkillsArray.length === 0) {
                skillScore = 0;
            }
            else if (jobSkillsArray.length > 0) {
                skillScore = Math.min(100, Math.round((matchedSkills.length / jobSkillsArray.length) * 100));
            }
            else {
                skillScore = 0;
            }
            let roleScore = 50;
            const isAllowedRole = allowedSoftwareRoleKeywords.some((kw) => jobTitle.includes(kw));
            if (isAllowedRole) {
                roleScore = 95;
            }
            else {
                roleScore = 40;
            }
            let domainScore = 50;
            if (isAllowedRole) {
                domainScore = 95;
            }
            else {
                domainScore = 30;
            }
            let resumeScore = 0;
            if (userResumes.length > 0) {
                let resumeMatchesCount = 0;
                for (const skill of jobSkillsArray) {
                    if (candidateSkillsArray.includes(skill))
                        resumeMatchesCount++;
                }
                resumeScore = jobSkillsArray.length > 0
                    ? Math.min(100, Math.round((resumeMatchesCount / jobSkillsArray.length) * 100))
                    : 70;
            }
            else {
                resumeScore = 0;
            }
            let reqYears = 0;
            if (jobDesc.includes('5+ years') || jobDesc.includes('6+ years'))
                reqYears = 5;
            else if (jobDesc.includes('3+ years') || jobDesc.includes('4+ years'))
                reqYears = 3;
            else if (jobDesc.includes('1+ years') || jobDesc.includes('2+ years'))
                reqYears = 1;
            let experienceScore = 70;
            if (reqYears > 0) {
                if (totalExperienceYears >= reqYears)
                    experienceScore = 100;
                else if (totalExperienceYears === 0)
                    experienceScore = 15;
                else
                    experienceScore = Math.round((totalExperienceYears / reqYears) * 75);
            }
            let seniorityScore = 70;
            if (jobTitle.includes('senior') || jobTitle.includes('lead')) {
                seniorityScore = totalExperienceYears >= 3 ? 95 : 40;
            }
            else if (jobTitle.includes('junior') || jobTitle.includes('associate') || jobTitle.includes('intern')) {
                seniorityScore = 95;
            }
            let locationScore = 70;
            const prefLoc = (profile?.preferredLocation || profile?.location || '').toLowerCase();
            if (jobLoc.includes('remote') || (prefLoc && jobLoc.includes(prefLoc))) {
                locationScore = 100;
            }
            else if (prefLoc) {
                locationScore = 40;
            }
            let profileScore = 70;
            if (profile?.preferredLocation && jobLoc.includes(profile.preferredLocation.toLowerCase())) {
                profileScore = 95;
            }
            let analysisScore = 70;
            if (userResumes.length > 0 && userResumes[0].analyses?.length > 0) {
                const missingFromAnalysis = userResumes[0].analyses[0].missingSkills;
                if (Array.isArray(missingFromAnalysis)) {
                    const overlapsMissing = missingFromAnalysis.some((m) => typeof m === 'string' && combinedText.includes(m.toLowerCase()));
                    if (overlapsMissing)
                        analysisScore = 40;
                }
            }
            const eligibilityScore = (job.applyUrl && job.title && job.company) ? 100 : 0;
            const matchScore = Math.round(0.25 * skillScore +
                0.15 * roleScore +
                0.15 * domainScore +
                0.15 * resumeScore +
                0.10 * experienceScore +
                0.05 * seniorityScore +
                0.05 * locationScore +
                0.05 * profileScore +
                0.03 * analysisScore +
                0.02 * eligibilityScore);
            const reasons = [];
            const rejectionReasons = [];
            if (matchedSkills.length > 0) {
                reasons.push(`Matched technology stack: ${matchedSkills.join(', ')}`);
            }
            if (isAllowedRole) {
                reasons.push('Relevant Software Engineering target role');
            }
            if (experienceScore < 50) {
                rejectionReasons.push(`Required experience (${reqYears}+ yrs) exceeds candidate actual experience (${Math.round(totalExperienceYears)} yrs)`);
            }
            let matchLevel = 'Relevant';
            if (matchScore >= 85)
                matchLevel = 'Excellent Match';
            else if (matchScore >= 75)
                matchLevel = 'Strong Match';
            else if (matchScore >= 65)
                matchLevel = 'Relevant';
            if (matchScore >= MATCH_THRESHOLD) {
                matchedResults.push({
                    job,
                    matchScore,
                    matchLevel,
                    matchedSkills,
                    missingSkills,
                    reasons: reasons.length > 0 ? reasons : ['Matches technology and target role preferences'],
                    rejectionReasons,
                });
            }
            else {
                this.logger.debug(`[JobsMatching] Job "${job.title}" at "${job.company}" filtered out (Score: ${matchScore} below threshold ${MATCH_THRESHOLD})`);
            }
        }
        return matchedResults.sort((a, b) => b.matchScore - a.matchScore);
    }
    async update(id, dto) {
        const job = await this.prisma.job.findUnique({ where: { id } });
        if (!job)
            throw new common_1.NotFoundException('Job not found');
        return this.prisma.job.update({
            where: { id },
            data: dto,
        });
    }
    async remove(id) {
        await this.prisma.job.delete({
            where: { id },
        });
        return { message: 'Job deleted successfully' };
    }
};
exports.JobsService = JobsService;
exports.JobsService = JobsService = JobsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        firecrawl_service_1.FirecrawlService,
        adapter_registry_service_1.AdapterRegistryService])
], JobsService);
//# sourceMappingURL=jobs.service.js.map