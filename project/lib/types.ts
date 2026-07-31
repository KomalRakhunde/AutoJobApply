export type UserRole = 'student' | 'recruiter' | 'admin' | 'super_admin';

export interface User {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  role?: UserRole;
}

export interface RegisterResponse {
  message: string;
  user: Pick<User, 'id' | 'email' | 'firstName' | 'lastName' | 'role'>;
}

export interface LoginResponse {
  message: string;
  accessToken: string;
  user: Pick<User, 'id' | 'email' | 'role'>;
}

export interface Profile {
  id: string;
  userId: string;
  phone?: string | null;
  location?: string | null;
  preferredLocation?: string | null;
  expectedSalary?: string | null;
  noticePeriod?: string | null;
  linkedinUrl?: string | null;
  portfolioUrl?: string | null;
  githubUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type UpdateProfileDto = Partial<
  Pick<
    Profile,
    | 'phone'
    | 'location'
    | 'preferredLocation'
    | 'expectedSalary'
    | 'noticePeriod'
    | 'linkedinUrl'
    | 'portfolioUrl'
    | 'githubUrl'
  >
>;

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
}

/* ---------- Resume parser ---------- */

export interface UploadResumeResponse {
  resumeId: string;
  extractedText: string;
}

/* ---------- AI endpoints ---------- */

export interface AtsScoreResponse {
  score: number;
  breakdown: {
    keywordMatch: number;
    formatting: number;
    completeness: number;
  };
  matchedKeywords: string[];
  missingKeywords: string[];
}

export interface ResumeAnalysisResponse {
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  redFlags: string[];
  summary?: string;
  improvements?: string[];
}

export type CoverLetterStyle = 'professional' | 'friendly' | 'startup' | 'corporate';

export interface CoverLetterResponse {
  coverLetter: string;
}

export interface InterviewQuestionsResponse {
  technical: string[];
  hr: string[];
  coding: string[];
  behavioral: string[];
}

/* ---------- Jobs ---------- */

export interface Job {
  id: string;
  title: string;
  company: string;
  location?: string | null;
  description?: string | null;
  salary?: string | null;
  applyUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateJobDto {
  title: string;
  company: string;
  location?: string;
  description?: string;
  salary?: string;
  applyUrl?: string;
}

export type UpdateJobDto = Partial<CreateJobDto>;

/* ---------- Applications ---------- */

export type ApplicationStatus =
  | 'applied'
  | 'interview'
  | 'assessment'
  | 'rejected'
  | 'offer'
  | 'joined';

export interface Application {
  id: string;
  userId: string;
  jobId: string;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
  job?: Job;
}

export interface CreateApplicationDto {
  jobId: string;
}

export interface UpdateApplicationDto {
  status: ApplicationStatus;
}

/* ---------- Cover letters (saved) ---------- */

export interface SavedCoverLetter {
  id: string;
  userId: string;
  content: string;
  jobId?: string | null;
  style?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCoverLetterDto {
  content: string;
  jobId?: string;
  style?: string;
}

/* ---------- Auto-Apply ---------- */

export interface AutoApplyConfig {
  enabled: boolean;
  minSalary: string;
  experienceYears: string;
  workMode: 'remote' | 'hybrid' | 'onsite' | 'any';
  requiredSkills: string[];
  excludedCompanies: string[];
  maxDailyApplications: number;
  connectedPortals: {
    name: string;
    connected: boolean;
    lastSynced?: string;
  }[];
}

export interface AutoApplyLog {
  id: string;
  jobTitle: string;
  company: string;
  portal: string;
  timestamp: string;
  status: 'submitted' | 'matched' | 'skipped';
  matchScore: number;
}

/* ---------- Email Sync ---------- */

export type EmailCategory = 'interview' | 'rejection' | 'offer' | 'assessment' | 'general';

export interface SyncedEmail {
  id: string;
  fromName: string;
  fromEmail: string;
  subject: string;
  date: string;
  snippet: string;
  category: EmailCategory;
  parsedCompany?: string;
  parsedRole?: string;
  parsedDate?: string;
}

/* ---------- Career Coach ---------- */

export interface CareerCoachResponse {
  missingSkills: { skill: string; demandLevel: 'High' | 'Medium' | 'Critical'; courseRecommendation: string }[];
  recommendedCourses: { title: string; provider: string; url: string; duration: string }[];
  salaryInsight: { min: string; max: string; median: string; currency: string };
  careerMilestones: { step: number; title: string; timeline: string; focus: string }[];
  resumeImprovements: string[];
}

/* ---------- Pricing Tiers ---------- */

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  billingPeriod: 'month' | 'year';
  description: string;
  features: string[];
  popular?: boolean;
  ctaText: string;
}
