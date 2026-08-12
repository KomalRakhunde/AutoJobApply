import { z } from 'zod';

export interface SendShortlistEmailParams {
  candidateName: string;
  candidateEmail: string;
  jobTitle: string;
  companyName?: string;
  nextStepType?: string;
  nextStepDescription?: string;
  nextStepLink?: string;
  date?: string;
  time?: string;
  customSubject?: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  provider: 'RESEND' | 'SMTP_FALLBACK' | 'SIMULATED';
  details?: any;
}

/**
 * Validates candidate email syntax
 */
export function validateEmail(email?: string): { valid: boolean; reason?: string } {
  if (!email || !email.trim()) {
    return { valid: false, reason: 'Candidate email not found' };
  }

  const trimmed = email.trim();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(trimmed)) {
    return { valid: false, reason: 'Invalid candidate email format' };
  }

  return { valid: true };
}

/**
 * Server-Side Resend Email Dispatch Service
 * Primary Email Provider: Resend (api.resend.com)
 * NEVER expose RESEND_API_KEY to the client-side frontend
 */
export async function sendShortlistEmail(params: SendShortlistEmailParams): Promise<SendEmailResult> {
  const emailValidation = validateEmail(params.candidateEmail);
  if (!emailValidation.valid) {
    return {
      success: false,
      error: emailValidation.reason || 'Invalid email address',
      provider: 'RESEND',
    };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.EMAIL_FROM || 'Recruitment Team <onboarding@resend.dev>';
  const appUrl = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const companyName = params.companyName || 'ApplyAI Corp';
  const jobTitle = params.jobTitle || 'Senior Software Engineer';
  const candidateName = params.candidateName || 'Candidate';
  const nextStepType = params.nextStepType || 'AI Technical Voice Screening';
  const nextStepDescription =
    params.nextStepDescription ||
    `Autonomous 15-minute AI Technical Screening Interview for the ${jobTitle} position.`;
  const nextStepLink = params.nextStepLink || `${appUrl}/interview-prep`;
  const date = params.date || 'Next Tuesday';
  const time = params.time || '10:00 AM EST';

  const subject =
    params.customSubject ||
    `Congratulations! You have been shortlisted for ${jobTitle} at ${companyName}`;

  const htmlContent = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 620px; margin: 0 auto; padding: 32px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; color: #1e293b;">
      <div style="border-bottom: 2px solid #4f46e5; padding-bottom: 16px; margin-bottom: 24px;">
        <h1 style="color: #4f46e5; margin: 0; font-size: 24px; font-weight: 800;">${companyName}</h1>
        <p style="color: #64748b; font-size: 13px; margin-top: 4px;">Talent Acquisition & Recruitment Team</p>
      </div>

      <div style="font-size: 15px; line-height: 1.6; color: #334155;">
        <p style="font-size: 16px; font-weight: 700; color: #0f172a;">Dear ${candidateName},</p>

        <p style="font-size: 16px; color: #10b981; font-weight: 700;">🎉 Congratulations!</p>

        <p>Your application has been <strong>shortlisted</strong> based on the requirements for the position of <strong>${jobTitle}</strong>.</p>

        <p>Your application has qualified for the next step of our recruitment process.</p>

        <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 12px; padding: 20px; margin: 24px 0;">
          <h3 style="margin: 0 0 12px 0; font-size: 15px; color: #4f46e5; font-weight: 700;">📋 Next Step Details:</h3>
          <p style="margin: 6px 0;"><strong>Step:</strong> ${nextStepType}</p>
          <p style="margin: 6px 0;"><strong>Description:</strong> ${nextStepDescription}</p>
          <p style="margin: 6px 0;"><strong>Date:</strong> ${date}</p>
          <p style="margin: 6px 0;"><strong>Time:</strong> ${time}</p>
        </div>

        <div style="margin: 32px 0; text-align: center;">
          <a href="${nextStepLink}" style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 15px; display: inline-block; box-shadow: 0 4px 12px rgba(79,70,229,0.35);">
            🚀 Launch Next-Step Assessment / Interview
          </a>
        </div>

        <p style="font-size: 13px; color: #64748b;">Direct Link: <a href="${nextStepLink}" style="color: #4f46e5;">${nextStepLink}</a></p>

        <p style="font-size: 13px; color: #64748b; margin-top: 16px;">Please complete the next step within the specified deadline.</p>

        <div style="border-top: 1px solid #f1f5f9; margin-top: 32px; padding-top: 20px; font-size: 14px; color: #475569;">
          <p style="margin: 0;">Best regards,<br/><strong>${companyName}</strong><br/>Recruitment Team</p>
        </div>
      </div>
    </div>
  `;

  // 1. Primary Resend API Dispatch if RESEND_API_KEY is configured
  if (apiKey && apiKey.trim() && !apiKey.includes('placeholder')) {
    try {
      console.log(`[Resend Service] Dispatching automated email to ${params.candidateEmail} via Resend API...`);
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [params.candidateEmail],
          subject: subject,
          html: htmlContent,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('[Resend Service Error]', data);
        return {
          success: false,
          error: data.message || data.name || `Resend API returned status ${response.status}`,
          provider: 'RESEND',
          details: data,
        };
      }

      console.log(`[Resend Service] Successfully sent email to ${params.candidateEmail}, messageId: ${data.id}`);
      return {
        success: true,
        messageId: data.id,
        provider: 'RESEND',
        details: data,
      };
    } catch (err: any) {
      console.error('[Resend Service Network Exception]', err);
      return {
        success: false,
        error: err?.message || 'Network exception while connecting to Resend API',
        provider: 'RESEND',
      };
    }
  }

  // 2. SMTP / Gmail Fallback if RESEND_API_KEY is placeholder or not configured
  const gmailUser = process.env.GMAIL_USER || process.env.SMTP_USER || process.env.EMAIL_USER;
  const gmailPass = process.env.GMAIL_PASS || process.env.SMTP_PASS || process.env.EMAIL_PASS;

  if (gmailUser && gmailPass && !gmailUser.includes('your_') && !gmailPass.includes('your_')) {
    try {
      console.log(`[Email Service Fallback] Dispatching email to ${params.candidateEmail} via SMTP...`);
      const nodemailer = await import('nodemailer');
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: Number(process.env.SMTP_PORT) || 587,
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: { user: gmailUser, pass: gmailPass },
      });

      const info = await transporter.sendMail({
        from: `"${companyName} Talent Acquisition" <${gmailUser}>`,
        to: params.candidateEmail,
        subject: subject,
        html: htmlContent,
      });

      return {
        success: true,
        messageId: info.messageId,
        provider: 'SMTP_FALLBACK',
        details: { message: `Email dispatched via SMTP to ${params.candidateEmail}` },
      };
    } catch (smtpErr: any) {
      console.warn('[SMTP Fallback Error]', smtpErr?.message);
    }
  }

  // 3. Return clear status message when RESEND_API_KEY is placeholder
  console.warn('[Resend Service] RESEND_API_KEY not configured or is placeholder in environment variables.');
  return {
    success: false,
    error: 'RESEND_API_KEY not configured in server environment variables. Please configure RESEND_API_KEY in .env.local',
    provider: 'RESEND',
  };
}
