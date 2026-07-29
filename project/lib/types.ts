export interface User {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
}

export interface RegisterResponse {
  message: string;
  user: Pick<User, 'id' | 'email' | 'firstName' | 'lastName'>;
}

export interface LoginResponse {
  message: string;
  accessToken: string;
  user: Pick<User, 'id' | 'email'>;
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
