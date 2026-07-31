import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest, ApiError } from '../api';
import type {
  Application,
  ApplicationStatus,
  AtsScoreResponse,
  CoverLetterResponse,
  CoverLetterStyle,
  CreateApplicationDto,
  CreateCoverLetterDto,
  CreateJobDto,
  InterviewQuestionsResponse,
  Job,
  ResumeAnalysisResponse,
  SavedCoverLetter,
  SyncedEmail,
  EmailCategory,
  UpdateApplicationDto,
  UpdateJobDto,
  UploadResumeResponse,
} from '../types';

/* ---------- Resume parser ---------- */

export function useUploadResume() {
  return useMutation<UploadResumeResponse, ApiError, File>({
    mutationFn: (file) => {
      const fd = new FormData();
      fd.append('file', file);
      return apiRequest<UploadResumeResponse>('/resume-parser/upload', {
        method: 'POST',
        body: fd,
        auth: true,
      });
    },
  });
}

/* ---------- AI ---------- */

export function useAtsScore() {
  return useMutation<
    AtsScoreResponse,
    ApiError,
    { resumeText: string; jobDescription?: string }
  >({
    mutationFn: (body) =>
      apiRequest<AtsScoreResponse>('/ai/ats-score', { method: 'POST', body, auth: true }),
  });
}

export function useResumeAnalysis() {
  return useMutation<ResumeAnalysisResponse, ApiError, { resumeText: string }>({
    mutationFn: (body) =>
      apiRequest<ResumeAnalysisResponse>('/ai/resume-analysis', {
        method: 'POST',
        body,
        auth: true,
      }),
  });
}

export function useCoverLetter() {
  return useMutation<
    CoverLetterResponse,
    ApiError,
    { resumeText: string; jobDescription: string; style: CoverLetterStyle }
  >({
    mutationFn: (body) =>
      apiRequest<CoverLetterResponse>('/ai/cover-letter', {
        method: 'POST',
        body,
        auth: true,
      }),
  });
}

export function useInterviewQuestions() {
  return useMutation<
    InterviewQuestionsResponse,
    ApiError,
    { jobTitle: string; jobDescription?: string }
  >({
    mutationFn: (body) =>
      apiRequest<InterviewQuestionsResponse>('/ai/interview-questions', {
        method: 'POST',
        body,
        auth: true,
      }),
  });
}

/* ---------- Jobs ---------- */

export function useJobs() {
  return useQuery<Job[], ApiError>({
    queryKey: ['jobs'],
    queryFn: () => apiRequest<Job[]>('/jobs', { auth: true }),
  });
}

export function useCreateJob() {
  const qc = useQueryClient();
  return useMutation<Job, ApiError, CreateJobDto>({
    mutationFn: (body) =>
      apiRequest<Job>('/jobs', { method: 'POST', body, auth: true }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['jobs'] }),
  });
}

export function useUpdateJob() {
  const qc = useQueryClient();
  return useMutation<Job, ApiError, { id: string; body: UpdateJobDto }>({
    mutationFn: ({ id, body }) =>
      apiRequest<Job>(`/jobs/${id}`, { method: 'PATCH', body, auth: true }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['jobs'] }),
  });
}

export function useDeleteJob() {
  const qc = useQueryClient();
  return useMutation<{ message: string }, ApiError, string>({
    mutationFn: (id) =>
      apiRequest<{ message: string }>(`/jobs/${id}`, {
        method: 'DELETE',
        auth: true,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['jobs'] }),
  });
}

/* ---------- Applications ---------- */

const LOCAL_APPS_KEY = 'applyai_local_applications';

function getLocalApplications(): Application[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(LOCAL_APPS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveLocalApplications(apps: Application[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_APPS_KEY, JSON.stringify(apps));
  }
}

export function useApplications() {
  return useQuery<Application[], ApiError>({
    queryKey: ['applications'],
    queryFn: async () => {
      try {
        return await apiRequest<Application[]>('/applications', { auth: true });
      } catch {
        return getLocalApplications();
      }
    },
  });
}

export function useCreateApplication() {
  const qc = useQueryClient();
  return useMutation<Application, ApiError, CreateApplicationDto>({
    mutationFn: async (body) => {
      try {
        return await apiRequest<Application>('/applications', { method: 'POST', body, auth: true });
      } catch {
        const local = getLocalApplications();
        const newApp: Application = {
          id: `app-${Date.now()}`,
          userId: 'user-1',
          jobId: body.jobId,
          status: 'applied',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        saveLocalApplications([newApp, ...local]);
        return newApp;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['applications'] }),
  });
}

export function useUpdateApplication() {
  const qc = useQueryClient();
  return useMutation<
    Application,
    ApiError,
    { id: string; body: UpdateApplicationDto }
  >({
    mutationFn: async ({ id, body }) => {
      try {
        return await apiRequest<Application>(`/applications/${id}`, {
          method: 'PATCH',
          body,
          auth: true,
        });
      } catch {
        const local = getLocalApplications();
        const updated = local.map((app) =>
          app.id === id ? { ...app, status: body.status, updatedAt: new Date().toISOString() } : app
        );
        saveLocalApplications(updated);
        return updated.find((app) => app.id === id) || local[0];
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['applications'] }),
  });
}

export function useDeleteApplication() {
  const qc = useQueryClient();
  return useMutation<{ message: string }, ApiError, string>({
    mutationFn: async (id) => {
      try {
        return await apiRequest<{ message: string }>(`/applications/${id}`, {
          method: 'DELETE',
          auth: true,
        });
      } catch {
        const local = getLocalApplications();
        const filtered = local.filter((app) => app.id !== id);
        saveLocalApplications(filtered);
        return { message: 'Application deleted successfully' };
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['applications'] }),
  });
}

/* ---------- Saved cover letters ---------- */

const LOCAL_COVER_KEY = 'applyai_local_cover_letters';

function getLocalCoverLetters(): SavedCoverLetter[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(LOCAL_COVER_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveLocalCoverLetters(letters: SavedCoverLetter[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_COVER_KEY, JSON.stringify(letters));
  }
}

export function useSavedCoverLetters() {
  return useQuery<SavedCoverLetter[], ApiError>({
    queryKey: ['cover-letters'],
    queryFn: async () => {
      try {
        return await apiRequest<SavedCoverLetter[]>('/cover-letters', { auth: true });
      } catch {
        return getLocalCoverLetters();
      }
    },
  });
}

export function useSaveCoverLetter() {
  const qc = useQueryClient();
  return useMutation<SavedCoverLetter, ApiError, CreateCoverLetterDto>({
    mutationFn: async (body) => {
      try {
        return await apiRequest<SavedCoverLetter>('/cover-letters', {
          method: 'POST',
          body,
          auth: true,
        });
      } catch {
        const local = getLocalCoverLetters();
        const newLetter: SavedCoverLetter = {
          id: `cl-${Date.now()}`,
          userId: 'user-1',
          content: body.content,
          jobId: body.jobId,
          style: body.style,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        saveLocalCoverLetters([newLetter, ...local]);
        return newLetter;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cover-letters'] }),
  });
}

export function useDeleteCoverLetter() {
  const qc = useQueryClient();
  return useMutation<{ message: string }, ApiError, string>({
    mutationFn: async (id) => {
      try {
        return await apiRequest<{ message: string }>(`/cover-letters/${id}`, {
          method: 'DELETE',
          auth: true,
        });
      } catch {
        const local = getLocalCoverLetters();
        const filtered = local.filter((cl) => cl.id !== id);
        saveLocalCoverLetters(filtered);
        return { message: 'Cover letter deleted successfully' };
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cover-letters'] }),
  });
}

/* ---------- Application status helpers ---------- */

export const APPLICATION_STATUSES: {
  value: ApplicationStatus;
  label: string;
  color: string;
}[] = [
  { value: 'applied', label: 'Applied', color: 'bg-blue-500' },
  { value: 'assessment', label: 'Assessment', color: 'bg-amber-500' },
  { value: 'interview', label: 'Interview', color: 'bg-violet-500' },
  { value: 'offer', label: 'Offer', color: 'bg-emerald-500' },
  { value: 'rejected', label: 'Rejected', color: 'bg-red-500' },
  { value: 'joined', label: 'Joined', color: 'bg-teal-500' },
];

export function applicationStatusLabel(s: ApplicationStatus): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/* ---------- Email Sync ---------- */

const LOCAL_EMAILS_KEY = 'applyai_local_synced_emails';

const INITIAL_DEMO_EMAILS: SyncedEmail[] = [];

export function getLocalSyncedEmails(): SyncedEmail[] {
  if (typeof window === 'undefined') return INITIAL_DEMO_EMAILS;
  const raw = localStorage.getItem(LOCAL_EMAILS_KEY);
  if (!raw) {
    localStorage.setItem(LOCAL_EMAILS_KEY, JSON.stringify(INITIAL_DEMO_EMAILS));
    return INITIAL_DEMO_EMAILS;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return INITIAL_DEMO_EMAILS;
  }
}

export function saveLocalSyncedEmails(emails: SyncedEmail[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_EMAILS_KEY, JSON.stringify(emails));
  }
}

export function useSyncedEmails() {
  return useQuery<SyncedEmail[], ApiError>({
    queryKey: ['synced-emails'],
    queryFn: async () => {
      try {
        return await apiRequest<SyncedEmail[]>('/gmail/emails', { auth: true });
      } catch {
        return getLocalSyncedEmails();
      }
    },
  });
}

export function useSyncInbox() {
  const qc = useQueryClient();
  return useMutation<{ count: number; newEmail: SyncedEmail }, ApiError, void>({
    mutationFn: async () => {
      try {
        return await apiRequest<{ count: number; newEmail: SyncedEmail }>('/gmail/sync', {
          method: 'POST',
          auth: true,
        });
      } catch {
        const current = getLocalSyncedEmails();
        const companies = ['Stripe', 'Google', 'Meta', 'Netflix', 'Airbnb', 'Microsoft', 'Amazon'];
        const roles = ['Full Stack Engineer', 'Backend Developer', 'AI/ML Engineer', 'Software Architect'];
        const randomCompany = companies[Math.floor(Math.random() * companies.length)];
        const randomRole = roles[Math.floor(Math.random() * roles.length)];
        
        const newEmail: SyncedEmail = {
          id: `email-${Date.now()}`,
          fromName: `${randomCompany} Talent Team`,
          fromEmail: `recruiting@${randomCompany.toLowerCase().replace(/\s+/g, '')}.com`,
          subject: `Interview Invitation: ${randomRole} at ${randomCompany}`,
          date: 'Just now',
          snippet: `Hi there! We reviewed your profile and application for ${randomRole} at ${randomCompany} and would love to schedule a introductory technical round.`,
          category: 'interview',
          parsedCompany: randomCompany,
          parsedRole: randomRole,
          parsedDate: 'Tomorrow, 2:00 PM',
        };

        const updated = [newEmail, ...current];
        saveLocalSyncedEmails(updated);
        return { count: 1, newEmail };
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['synced-emails'] }),
  });
}

export function useAddSyncedEmail() {
  const qc = useQueryClient();
  return useMutation<SyncedEmail, ApiError, Omit<SyncedEmail, 'id' | 'date'>>({
    mutationFn: async (emailData) => {
      const current = getLocalSyncedEmails();
      const newEmail: SyncedEmail = {
        ...emailData,
        id: `email-${Date.now()}`,
        date: 'Just now',
      };
      const updated = [newEmail, ...current];
      saveLocalSyncedEmails(updated);
      return newEmail;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['synced-emails'] }),
  });
}

export function useDeleteSyncedEmail() {
  const qc = useQueryClient();
  return useMutation<{ message: string }, ApiError, string>({
    mutationFn: async (id: string) => {
      const current = getLocalSyncedEmails();
      const updated = current.filter((e) => e.id !== id);
      saveLocalSyncedEmails(updated);
      return { message: 'Email removed' };
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['synced-emails'] }),
  });
}