export interface ApplicationRecord {
  id: string;
  jobId: string;
  candidateName: string;
  candidateEmail: string;
  phone?: string;
  skills: string[];
  experienceSummary?: string;
  atsScore: number;
  requiredScore: number;
  isQualified: boolean;
  applicationStatus: string; // APPLIED, SCREENING, SHORTLISTED, INTERVIEW_INVITED, REJECTED, OFFER_SENT, HIRED
  emailStatus: 'PENDING' | 'SENT' | 'DELIVERED' | 'FAILED' | 'BOUNCED';
  emailMessageId?: string;
  emailSentAt?: string;
  emailDeliveredAt?: string;
  emailFailedAt?: string;
  emailError?: string;
  nextStepType?: string;
  nextStepDescription?: string;
  nextStepLink?: string;
  rawResumeText?: string;
  uploadedAt: string;
}

export interface OutreachLogRecord {
  id: string;
  candidateId: string;
  emailType: string; // SHORTLISTED, INTERVIEW_INVITATION, ASSESSMENT_INVITATION, REJECTION, OFFER
  recipientEmail: string;
  status: 'PENDING' | 'SENT' | 'DELIVERED' | 'FAILED' | 'BOUNCED';
  emailMessageId?: string;
  subject?: string;
  body?: string;
  sentAt?: string;
  deliveredAt?: string;
  failedAt?: string;
  error?: string;
  createdAt: string;
}
