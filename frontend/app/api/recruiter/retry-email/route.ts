import { NextResponse } from 'next/server';
import { sendShortlistEmail, validateEmail } from '@/lib/email/resend-service';
import { ApplicationRecord, OutreachLogRecord } from '@/types/recruiter-email';


const globalStore = global as unknown as {
  applications: ApplicationRecord[];
  outreachLogs: OutreachLogRecord[];
};

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { candidateId, candidateEmail, candidateName, jobRole, companyName, nextStepLink } = body;

    if (!candidateId && !candidateEmail) {
      return NextResponse.json({ error: 'candidateId or candidateEmail is required' }, { status: 400 });
    }

    const appRecord = globalStore.applications?.find(
      (a) => a.id === candidateId || (candidateEmail && a.candidateEmail === candidateEmail)
    );

    const emailToUse = candidateEmail || appRecord?.candidateEmail;
    const nameToUse = candidateName || appRecord?.candidateName || 'Candidate';
    const roleToUse = jobRole || 'Senior Software Engineer';
    const companyToUse = companyName || 'ApplyAI Corp';
    const linkToUse = nextStepLink || appRecord?.nextStepLink || 'http://localhost:3000/interview-prep';

    // 1. Validate Candidate Email Syntax
    const emailValidation = validateEmail(emailToUse);
    if (!emailValidation.valid) {
      return NextResponse.json(
        {
          success: false,
          emailStatus: 'FAILED',
          error: emailValidation.reason || 'Invalid email format',
        },
        { status: 400 }
      );
    }

    // 2. Idempotency Protection: If email was already successfully delivered or sent, refuse duplicate email dispatch
    if (appRecord && (appRecord.emailStatus === 'SENT' || appRecord.emailStatus === 'DELIVERED')) {
      return NextResponse.json({
        success: true,
        skipped: true,
        emailStatus: appRecord.emailStatus,
        message: `Email already successfully ${appRecord.emailStatus.toLowerCase()} to ${emailToUse}. Duplicate email blocked.`,
      });
    }

    // 3. Perform Retry Dispatch via Resend Service
    console.log(`[Retry Email Service] Retrying email dispatch for candidate ${nameToUse} (${emailToUse})...`);
    const result = await sendShortlistEmail({
      candidateName: nameToUse,
      candidateEmail: emailToUse!,
      jobTitle: roleToUse,
      companyName: companyToUse,
      nextStepLink: linkToUse,
    });

    if (result.success) {
      if (appRecord) {
        appRecord.emailStatus = 'SENT';
        appRecord.emailMessageId = result.messageId;
        appRecord.emailSentAt = new Date().toISOString();
        appRecord.emailError = undefined;
      }

      if (globalStore.outreachLogs) {
        const existingLog = globalStore.outreachLogs.find(
          (l) => l.candidateId === (candidateId || appRecord?.id) && l.emailType === 'SHORTLISTED'
        );
        if (existingLog) {
          existingLog.status = 'SENT';
          existingLog.emailMessageId = result.messageId;
          existingLog.sentAt = new Date().toISOString();
          existingLog.error = undefined;
        } else {
          globalStore.outreachLogs.push({
            id: `log-${Date.now()}`,
            candidateId: candidateId || appRecord?.id || `cand-${Date.now()}`,
            emailType: 'SHORTLISTED',
            recipientEmail: emailToUse!,
            status: 'SENT',
            emailMessageId: result.messageId,
            sentAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
          });
        }
      }

      return NextResponse.json({
        success: true,
        emailStatus: 'SENT',
        messageId: result.messageId,
        message: `Email successfully retried and dispatched to ${emailToUse}!`,
      });
    } else {
      if (appRecord) {
        appRecord.emailStatus = 'FAILED';
        appRecord.emailFailedAt = new Date().toISOString();
        appRecord.emailError = result.error || 'Retry attempt failed';
      }

      return NextResponse.json(
        {
          success: false,
          emailStatus: 'FAILED',
          error: result.error || 'Failed to retry email dispatch via Resend provider',
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Error during email retry:', error);
    return NextResponse.json({ error: error?.message || 'Email retry operation failed' }, { status: 500 });
  }
}
