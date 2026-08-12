import { NextResponse } from 'next/server';
import { ApplicationRecord, OutreachLogRecord } from '@/types/recruiter-email';


const globalStore = global as unknown as {
  applications: ApplicationRecord[];
  outreachLogs: OutreachLogRecord[];
};

export async function POST(req: Request) {
  try {
    const payload = await req.json().catch(() => null);
    if (!payload || !payload.type || !payload.data) {
      return NextResponse.json({ message: 'Ignored empty or invalid payload' }, { status: 400 });
    }

    const { type, data } = payload;
    const emailId = data.email_id || data.id;
    const recipientEmail = Array.isArray(data.to) ? data.to[0] : data.to;

    console.log(`[Resend Webhook Event] Type: ${type}, EmailId: ${emailId}, Recipient: ${recipientEmail}`);

    const logRecord = globalStore.outreachLogs?.find(
      (l) => (emailId && l.emailMessageId === emailId) || (recipientEmail && l.recipientEmail === recipientEmail)
    );

    const appRecord = globalStore.applications?.find(
      (a) => (emailId && a.emailMessageId === emailId) || (recipientEmail && a.candidateEmail === recipientEmail)
    );

    let newStatus: 'SENT' | 'DELIVERED' | 'FAILED' | 'BOUNCED' = 'SENT';

    if (type === 'email.delivered') {
      newStatus = 'DELIVERED';
      if (appRecord) {
        appRecord.emailStatus = 'DELIVERED';
        appRecord.emailDeliveredAt = new Date().toISOString();
      }
      if (logRecord) {
        logRecord.status = 'DELIVERED';
        logRecord.deliveredAt = new Date().toISOString();
      }
    } else if (type === 'email.bounced') {
      newStatus = 'BOUNCED';
      if (appRecord) {
        appRecord.emailStatus = 'BOUNCED';
        appRecord.emailError = 'Email address bounced (recipient server rejected message)';
      }
      if (logRecord) {
        logRecord.status = 'BOUNCED';
        logRecord.error = 'Bounced';
      }
    } else if (type === 'email.failed') {
      newStatus = 'FAILED';
      if (appRecord) {
        appRecord.emailStatus = 'FAILED';
        appRecord.emailFailedAt = new Date().toISOString();
        appRecord.emailError = data.error || 'Resend delivery failed';
      }
      if (logRecord) {
        logRecord.status = 'FAILED';
        logRecord.failedAt = new Date().toISOString();
        logRecord.error = data.error || 'Delivery failed';
      }
    }

    return NextResponse.json({
      success: true,
      eventProcessed: type,
      emailId,
      status: newStatus,
    });
  } catch (error: any) {
    console.error('Error handling Resend webhook:', error);
    return NextResponse.json({ error: error?.message || 'Webhook processing failed' }, { status: 500 });
  }
}
