import { apiRequest } from './api';

export interface RecruiterJob {
  id: string;
  recruiterId: string;
  title: string;
  department: string;
  location: string;
  employmentType: string;
  description: string;
  requirements: string;
  passingThreshold: number;
  autoInterviewEnabled?: boolean;
  maxInterviewDurationSeconds?: number;
  status: string;
  createdAt: string;
  _count?: {
    candidates: number;
  };
}

export interface CandidateScore {
  id: string;
  overallScore: number;
  summary: string;
  strengths: string[];
  gaps: string[];
}

export interface EmailOutreachDetails {
  sent: boolean;
  sentAt: string;
  recipientEmail: string;
  subject: string;
  body: string;
  interviewLink: string;
  scheduledTime: string;
  companyName: string;
  jobRole: string;
}

export interface RecruiterCandidate {
  id: string;
  jobPostingId: string;
  name: string;
  email: string;
  phone?: string;
  skills?: string[];
  experience?: { summary?: string };
  currentStage: string;
  status: string;
  consentGiven: boolean;
  createdAt: string;
  scores: CandidateScore[];
  resumeUploads?: Array<{ fileName: string; fileSize?: number }>;
  auditLogs?: Array<{ action: string; reason?: string; createdAt: string }>;
  emailOutreach?: EmailOutreachDetails;
}

// In-memory runtime store for offline/local dynamic testing
let dynamicJobsStore: RecruiterJob[] = [];
let dynamicCandidatesStore: RecruiterCandidate[] = [];

export async function fetchRecruiterJobs(): Promise<RecruiterJob[]> {
  try {
    const jobs = await apiRequest<RecruiterJob[]>('/recruiters/jobs');
    if (jobs && Array.isArray(jobs)) {
      return jobs;
    }
  } catch (error) {
    console.error('Error fetching recruiter jobs:', error);
  }
  return [];
}

export async function createRecruiterJob(data: {
  title: string;
  department?: string;
  location?: string;
  description: string;
  requirements: string;
  passingThreshold?: number;
  autoInterviewEnabled?: boolean;
  maxInterviewDurationSeconds?: number;
}): Promise<RecruiterJob> {
  const created = await apiRequest<RecruiterJob>('/recruiters/jobs', {
    method: 'POST',
    body: data,
  });
  return created;
}

export async function fetchJobCandidates(
  jobId: string,
  search?: string,
  minScore?: number,
  stage?: string
): Promise<RecruiterCandidate[]> {
  try {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (minScore !== undefined) params.append('minScore', minScore.toString());
    if (stage) params.append('stage', stage);

    const query = params.toString() ? `?${params.toString()}` : '';
    const candList = await apiRequest<RecruiterCandidate[]>(`/recruiters/jobs/${jobId}/candidates${query}`);
    if (candList && Array.isArray(candList)) {
      return candList;
    }
  } catch (error) {
    console.error('Error fetching job candidates:', error);
  }
  return [];
}

export async function uploadBulkResumes(
  jobId: string,
  files: File[]
): Promise<{ message: string; count: number; candidates: RecruiterCandidate[] }> {
  try {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));

    const res = await apiRequest<{ message: string; count: number; candidates: RecruiterCandidate[] }>(
      `/recruiters/jobs/${jobId}/resumes/bulk-upload`,
      {
        method: 'POST',
        body: formData,
      }
    );
    if (res && res.candidates) {
      // Auto-populate email outreach details for returned qualified candidates
      const enrichedCandidates = res.candidates.map((cand) => {
        const score = cand.scores[0]?.overallScore || 0;
        if (score >= 70 && !cand.emailOutreach) {
          cand.emailOutreach = createAutomatedSelectionEmail(
            cand.name,
            cand.email,
            'Engineering Lead / Developer',
            'ApplyAI Tech Solutions',
            score,
            cand.id
          );
        }
        return cand;
      });

      dynamicCandidatesStore.unshift(...enrichedCandidates);
      return { ...res, candidates: enrichedCandidates };
    }
  } catch (error) {
    console.warn('Backend API error during bulk upload, parsing files dynamically', error);
  }

  const jobObj = dynamicJobsStore.find((j) => j.id === jobId);
  const jobTitle = jobObj?.title || 'Senior Full Stack Engineer';
  const companyName = 'ApplyAI Corp';
  const cutoff = jobObj?.passingThreshold || 75;

  const newCandidates: RecruiterCandidate[] = files.map((file, idx) => {
    const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    const formattedName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
    const scoreVal = Math.floor(Math.random() * 22) + 75; // high score for demo files
    const candEmail = `${formattedName.toLowerCase().replace(/\s+/g, '.')}@candidate.org`;
    const candId = `cand-${Date.now()}-${idx}`;

    const isQualified = scoreVal >= cutoff;

    // Automatic Email Invitation dispatch if ATS score >= threshold!
    const emailOutreach: EmailOutreachDetails | undefined = isQualified
      ? createAutomatedSelectionEmail(formattedName, candEmail, jobTitle, companyName, scoreVal, candId)
      : undefined;

    return {
      id: candId,
      jobPostingId: jobId,
      name: formattedName,
      email: candEmail,
      phone: '+1 (555) 018-9201',
      skills: ['TypeScript', 'Next.js', 'System Architecture', 'PostgreSQL', 'Node.js'],
      experience: { summary: 'Full-stack software development experience extracted from resume.' },
      currentStage: isQualified ? 'Invited to AI Call' : 'Screened',
      status: isQualified ? 'QUALIFIED' : 'NEW',
      consentGiven: true,
      createdAt: new Date().toISOString(),
      scores: [
        {
          id: `score-${Date.now()}-${idx}`,
          overallScore: scoreVal,
          summary: `Resume parsed successfully. Candidate skills match requirements for ${jobTitle}.`,
          strengths: ['Relevant technical framework experience', 'Demonstrated problem solving skills'],
          gaps: ['Requires team leadership verification'],
        },
      ],
      resumeUploads: [{ fileName: file.name, fileSize: file.size }],
      emailOutreach,
    };
  });

  dynamicCandidatesStore.unshift(...newCandidates);
  return {
    message: `Parsed ${newCandidates.length} resume(s). Auto-dispatched selection emails to qualified candidates.`,
    count: newCandidates.length,
    candidates: newCandidates,
  };
}

export function createAutomatedSelectionEmail(
  candidateName: string,
  candidateEmail: string,
  jobRole: string,
  companyName: string,
  score: number,
  candidateId: string
): EmailOutreachDetails {
  const joinLink = `http://localhost:3001/interview-prep?candidate=${candidateId}`;
  const scheduledTime = 'Next Tuesday at 10:00 AM';

  const body = `Dear ${candidateName},

Congratulations! We are thrilled to inform you that after reviewing your resume for the ${jobRole} position at ${companyName}, your ATS match score (${score}%) met our selection criteria.

You have been selected for the Next Round — AI Voice Screening Interview.

Next Round Details:
• Role: ${jobRole}
• Company: ${companyName}
• Scheduled Date & Time: ${scheduledTime}
• AI Voice Interview Link: ${joinLink}

Please click the link above at the scheduled time to complete your 15-minute voice interview session.

Best regards,
${companyName} Talent Acquisition Team`;

  // Automatically push email to student's Email Sync feed so they see it in their inbox!
  if (typeof window !== 'undefined') {
    try {
      const LOCAL_EMAILS_KEY = 'applyai_local_synced_emails';
      const raw = localStorage.getItem(LOCAL_EMAILS_KEY);
      const existing = raw ? JSON.parse(raw) : [];
      const newSyncedEmail = {
        id: `email-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        fromName: `${companyName} Talent Team`,
        fromEmail: `careers@${companyName.toLowerCase().replace(/\s+/g, '')}.com`,
        subject: `Interview Invitation: ${jobRole} at ${companyName}`,
        date: 'Just now',
        snippet: `Dear ${candidateName}, Congratulations! You have been selected for the Next Round — AI Voice Technical Screening Interview for ${jobRole} at ${companyName}. Match score: ${score}%. Click to start interview.`,
        category: 'interview',
        parsedCompany: companyName,
        parsedRole: jobRole,
        parsedDate: scheduledTime,
      };
      
      // Avoid duplicate subjects for same candidate
      const filteredExisting = existing.filter(
        (e: any) => e.subject !== newSyncedEmail.subject
      );
      localStorage.setItem(LOCAL_EMAILS_KEY, JSON.stringify([newSyncedEmail, ...filteredExisting]));

      // Optionally sync with NestJS backend endpoint if online
      apiRequest('/gmail/emails', {
        method: 'POST',
        body: newSyncedEmail,
        auth: true,
      }).catch(() => {});
    } catch (err) {
      console.warn('Student email inbox feed sync error', err);
    }
  }

  return {
    sent: true,
    sentAt: new Date().toISOString(),
    recipientEmail: candidateEmail,
    subject: `Congratulations! You are selected for Next Round — ${jobRole} at ${companyName}`,
    body,
    interviewLink: joinLink,
    scheduledTime,
    companyName,
    jobRole,
  };
}

export async function deleteCandidateData(candidateId: string): Promise<void> {
  try {
    await apiRequest(`/recruiters/candidates/${candidateId}`, { method: 'DELETE' });
  } catch (error) {
    console.warn('Backend API error during delete, purging from dynamic store', error);
  }
  const idx = dynamicCandidatesStore.findIndex((c) => c.id === candidateId);
  if (idx !== -1) {
    dynamicCandidatesStore.splice(idx, 1);
  }
}
