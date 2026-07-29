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

export function useApplications() {
  return useQuery<Application[], ApiError>({
    queryKey: ['applications'],
    queryFn: () => apiRequest<Application[]>('/applications', { auth: true }),
  });
}

export function useCreateApplication() {
  const qc = useQueryClient();
  return useMutation<Application, ApiError, CreateApplicationDto>({
    mutationFn: (body) =>
      apiRequest<Application>('/applications', { method: 'POST', body, auth: true }),
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
    mutationFn: ({ id, body }) =>
      apiRequest<Application>(`/applications/${id}`, {
        method: 'PATCH',
        body,
        auth: true,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['applications'] }),
  });
}

export function useDeleteApplication() {
  const qc = useQueryClient();
  return useMutation<{ message: string }, ApiError, string>({
    mutationFn: (id) =>
      apiRequest<{ message: string }>(`/applications/${id}`, {
        method: 'DELETE',
        auth: true,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['applications'] }),
  });
}

/* ---------- Saved cover letters ---------- */

export function useSavedCoverLetters() {
  return useQuery<SavedCoverLetter[], ApiError>({
    queryKey: ['cover-letters'],
    queryFn: () =>
      apiRequest<SavedCoverLetter[]>('/cover-letters', { auth: true }),
  });
}

export function useSaveCoverLetter() {
  const qc = useQueryClient();
  return useMutation<SavedCoverLetter, ApiError, CreateCoverLetterDto>({
    mutationFn: (body) =>
      apiRequest<SavedCoverLetter>('/cover-letters', {
        method: 'POST',
        body,
        auth: true,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cover-letters'] }),
  });
}

export function useDeleteCoverLetter() {
  const qc = useQueryClient();
  return useMutation<{ message: string }, ApiError, string>({
    mutationFn: (id) =>
      apiRequest<{ message: string }>(`/cover-letters/${id}`, {
        method: 'DELETE',
        auth: true,
      }),
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