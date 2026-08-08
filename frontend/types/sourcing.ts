/* ============================================================================
   APPLYAI SOURCING & AUTONOMOUS HIRING AGENT — DATA MODELS & TYPES
   ============================================================================ */

export type RoundType = 'AI_CHAT_SCREENING' | 'AI_VOICE_TECHNICAL' | 'HUMAN_HR_INTERVIEW';
export type CandidatePipelineStatus =
  | 'SOURCED'
  | 'OUTREACH_SENT'
  | 'SCREENING_IN_PROGRESS'
  | 'SCREENING_PASSED'
  | 'SCREENING_FAILED'
  | 'INTERVIEW_SCHEDULED'
  | 'HIRED';

export interface PipelineRoundConfig {
  roundNumber: number;
  name: string;
  type: RoundType;
  isAiHandled: boolean;
  minPassingScore: number;
}

export interface JobRequisition {
  id: string;
  recruiterId: string;
  title: string;
  requiredSkills: string[];
  experienceLevel: 'Entry' | 'Mid' | 'Senior' | 'Lead' | 'Executive';
  targetLocation: string;
  targetOpenings: number;
  description: string;
  rounds: PipelineRoundConfig[];
  createdAt: string;
  status: 'OPEN' | 'PAUSED' | 'FILLED';
}

export interface SourcedCandidate {
  id: string;
  requisitionId: string;
  name: string;
  email: string;
  phone?: string;
  currentRole: string;
  company: string;
  location: string;
  linkedinUrl?: string;
  matchScore: number; // 0 - 100%
  skills: string[];
  status: CandidatePipelineStatus;
  outreachChannel?: 'EMAIL' | 'WHATSAPP';
  scorecard?: InterviewScorecard;
  scheduledSlot?: ScheduledInterviewSlot;
}

export interface InterviewScorecard {
  candidateId: string;
  roundNumber: number;
  overallScore: number; // 0 - 100
  communicationRating: 'Excellent' | 'Good' | 'Average' | 'Needs Improvement';
  strengths: string[];
  weaknesses: string[];
  qnaTranscript: { question: string; answer: string; grade: number; feedback: string }[];
  finalRecommendation: 'PASS' | 'FAIL';
  evaluatedAt: string;
}

export interface ScheduledInterviewSlot {
  candidateId: string;
  scheduledTime: string;
  interviewerName: string;
  meetLink: string;
  confirmed: boolean;
}

export interface OutreachPayload {
  candidateId: string;
  channel: 'EMAIL' | 'WHATSAPP';
  personalizedMessage: string;
}
