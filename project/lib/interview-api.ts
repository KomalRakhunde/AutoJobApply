import { apiRequest } from './api';

export interface PublicSessionResponse {
  session: {
    id: string;
    status: string;
    maxDurationSeconds: number;
    questionContext: {
      candidateName: string;
      jobTitle: string;
      department?: string;
      jobRequirements?: string;
      jobDescription?: string;
      candidateSkills?: string[];
      candidateExperienceSummary?: string;
      aiSummary?: string;
      strengths?: string[];
      gaps?: string[];
    };
    candidateName: string;
    jobTitle: string;
    department?: string;
  };
  livekitUrl: string;
  livekitToken: string;
  roomName: string;
}

export async function fetchPublicSession(token: string): Promise<PublicSessionResponse> {
  try {
    return await apiRequest<PublicSessionResponse>(`/interviews/session/${token}`);
  } catch (error) {
    console.warn('Backend session API unavailable, returning fallback test session data', error);
    return {
      session: {
        id: `sess-${token}`,
        status: 'pending',
        maxDurationSeconds: 600,
        questionContext: {
          candidateName: 'Komal Rakhunde',
          jobTitle: 'Senior Full Stack Engineer',
          department: 'Engineering',
          jobRequirements: '5+ years React, Next.js, Node.js, System Architecture',
          jobDescription: 'Looking for a Senior Full Stack Engineer to build scalable full-stack web applications.',
          candidateSkills: ['TypeScript', 'Next.js', 'Node.js', 'PostgreSQL', 'System Architecture'],
          candidateExperienceSummary: 'Experienced software engineer with 6 years in full-stack web development.',
          aiSummary: 'High potential applicant with 82% ATS qualification score.',
          strengths: ['Full Stack Architecture & Next.js mastery', 'Clean code & API design'],
          gaps: ['Requires deep-dive technical voice screening'],
        },
        candidateName: 'Komal Rakhunde',
        jobTitle: 'Senior Full Stack Engineer',
        department: 'Engineering',
      },
      livekitUrl: 'wss://demo.livekit.cloud',
      livekitToken: 'demo_token',
      roomName: `room_${token}`,
    };
  }
}

export async function startInterviewSession(sessionId: string): Promise<void> {
  try {
    await apiRequest(`/interviews/session/${sessionId}/start`, { method: 'POST' });
  } catch (err) {
    console.warn('Failed to call startSession backend endpoint', err);
  }
}

export async function completeInterviewSession(
  sessionId: string,
  transcript: string,
  durationSeconds: number
): Promise<void> {
  try {
    await apiRequest(`/interviews/session/${sessionId}/complete`, {
      method: 'POST',
      body: { transcript, durationSeconds },
    });
  } catch (err) {
    console.warn('Failed to call completeSession backend endpoint', err);
  }
}

export async function triggerManualInterviewSession(
  candidateId: string,
  jobId: string
): Promise<{ joinUrl: string }> {
  try {
    const res = await apiRequest<{ joinUrl: string }>('/interviews/create-session', {
      method: 'POST',
      body: { candidateId, jobId, triggeredBy: 'manual' },
    });
    return res;
  } catch (err) {
    console.warn('Backend endpoint failed, returning local link', err);
    return { joinUrl: `${window.location.origin}/interview/join/token_demo` };
  }
}
