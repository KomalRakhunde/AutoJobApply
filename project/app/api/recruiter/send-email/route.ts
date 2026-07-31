import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { z } from 'zod';

const SendEmailSchema = z.object({
  candidateName: z.string().optional().default('Candidate'),
  candidateEmail: z.string().optional(),
  recipientEmail: z.string().optional(),
  jobRole: z.string().optional().default('Senior Software Engineer'),
  companyName: z.string().optional().default('ApplyAI Corp'),
  score: z.number().optional().default(88),
  interviewLink: z.string().optional().default('http://localhost:3001/interview-prep'),
  scheduledTime: z.string().optional().default('Next Tuesday at 10:00 AM'),
  subject: z.string().optional(),
  emailType: z.string().optional().default('SELECTION_INTERVIEW'),
  salary: z.string().optional().default('145,000'),
  currency: z.string().optional().default('USD ($)'),
  joiningDate: z.string().optional().default('August 15, 2026'),
  signingBonus: z.string().optional().default('10,000'),
  customNotes: z.string().optional(),
});

function isPlaceholder(val?: string) {
  if (!val) return true;
  const lower = val.trim().toLowerCase();
  return (
    lower.includes('your_') ||
    lower.includes('your-') ||
    lower.includes('example') ||
    lower.includes('placeholder') ||
    lower.includes('<') ||
    lower === 'your_gmail_address@gmail.com' ||
    lower === 'your_16_digit_app_password'
  );
}

function getEnvCredentials() {
  let gmailUser = process.env.GMAIL_USER || process.env.SMTP_USER || process.env.EMAIL_USER || process.env.EMAIL;
  let gmailPass = process.env.GMAIL_PASS || process.env.SMTP_PASS || process.env.EMAIL_PASS || process.env.PASS;
  let smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  let smtpPort = Number(process.env.SMTP_PORT) || 587;

  if (isPlaceholder(gmailUser)) gmailUser = undefined;
  if (isPlaceholder(gmailPass)) gmailPass = undefined;

  // Fallback: Check project/.env and .backend-ref/.env directly from disk
  const envFilesToTry = [
    path.join(process.cwd(), '.env'),
    path.join(process.cwd(), '.backend-ref', '.env'),
  ];

  for (const envPath of envFilesToTry) {
    if ((!gmailUser || !gmailPass) && fs.existsSync(envPath)) {
      try {
        const envContent = fs.readFileSync(envPath, 'utf-8');
        const lines = envContent.split('\n');
        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('#') || !trimmed.includes('=')) continue;
          const [key, ...valParts] = trimmed.split('=');
          const value = valParts.join('=').trim().replace(/^["']|["']$/g, '');
          if ((key === 'GMAIL_USER' || key === 'SMTP_USER' || key === 'EMAIL_USER' || key === 'EMAIL') && (!gmailUser || isPlaceholder(gmailUser))) {
            gmailUser = value;
          }
          if ((key === 'GMAIL_PASS' || key === 'SMTP_PASS' || key === 'EMAIL_PASS' || key === 'PASS') && (!gmailPass || isPlaceholder(gmailPass))) {
            gmailPass = value;
          }
          if (key === 'SMTP_HOST') smtpHost = value;
          if (key === 'SMTP_PORT') smtpPort = Number(value) || 587;
        }
      } catch (e) {
        console.warn(`Could not read ${envPath}:`, e);
      }
    }
  }

  if (isPlaceholder(gmailUser)) gmailUser = undefined;
  if (isPlaceholder(gmailPass)) gmailPass = undefined;

  return { gmailUser, gmailPass, smtpHost, smtpPort };
}

export async function POST(req: Request) {
  try {
    const rawBody = await req.json().catch(() => ({}));
    const parseResult = SendEmailSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Invalid payload structure', details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const {
      candidateName,
      candidateEmail,
      recipientEmail,
      jobRole,
      companyName,
      score,
      interviewLink,
      scheduledTime,
      subject,
      emailType,
      salary,
      currency,
      joiningDate,
      signingBonus,
      customNotes,
    } = parseResult.data;

    const targetEmail = recipientEmail || candidateEmail;

    if (!targetEmail) {
      return NextResponse.json({ error: 'Target recipient email is required' }, { status: 400 });
    }

    const { gmailUser, gmailPass, smtpHost, smtpPort } = getEnvCredentials();

    let emailSubject = subject;
    let htmlBody = '';

    if (emailType === 'OFFER_LETTER' || subject?.toLowerCase().includes('offer')) {
      emailSubject = subject || `${candidateName} Offer Letter — ${jobRole} at ${companyName}`;

      htmlBody = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 650px; margin: 0 auto; padding: 32px; border: 1px solid #cbd5e1; border-radius: 16px; background-color: #ffffff; color: #1e293b;">
          <div style="border-bottom: 2px solid #4f46e5; padding-bottom: 16px; margin-bottom: 24px; text-align: justify;">
            <h1 style="color: #4f46e5; margin: 0; font-size: 24px; font-weight: 800;">${companyName}</h1>
            <p style="color: #64748b; font-size: 13px; margin-top: 4px;">https://www.lexonit.com • Official Offer Letter</p>
          </div>

          <div style="font-size: 14px; line-height: 1.6; color: #334155;">
            <p style="font-weight: bold; margin-bottom: 16px;">Date: June 22, 2026</p>
            <p style="font-size: 16px; font-weight: 800; color: #0f172a; margin-bottom: 16px;">Subject: ${candidateName} Offer Letter</p>

            <p>Dear <strong>${candidateName}</strong>,</p>
            <p>Welcome to <strong>${companyName}</strong>! We are delighted to offer you the position of <strong>${jobRole}</strong> at Lexon IT. Your skills and experience align perfectly with our vision, and we are thrilled to have you join our team.</p>

            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 20px 0;">
              <h4 style="margin: 0 0 10px 0; font-size: 15px; color: #4f46e5; font-weight: bold;">Employment Details:</h4>
              <p style="margin: 4px 0;"><strong>Position:</strong> ${jobRole}</p>
              <p style="margin: 4px 0;"><strong>Joining Date:</strong> June 22, 2026</p>
              <p style="margin: 4px 0;"><strong>Work Location:</strong> Remote</p>
              <p style="margin: 4px 0;"><strong>Stipend:</strong> 3 Months Internship; Post 3 months based on performance stipend will be provided.</p>
              <p style="margin: 4px 0;"><strong>Eligibility:</strong> AI Full Stack Development</p>
              <p style="margin: 4px 0;"><strong>Reporting Supervisor:</strong> Komal Rakhunde</p>
            </div>

            <h4 style="font-size: 14px; color: #0f172a; margin-top: 20px; font-weight: bold;">Key Responsibilities:</h4>
            <ul style="margin: 8px 0; padding-left: 20px; color: #475569;">
              <li>Develop and maintain backend applications.</li>
              <li>Debug and fix backend performance issues.</li>
              <li>Collaborate with designers and backend developers.</li>
              <li>Write clean and efficient code.</li>
              <li>Test applications for reliability and usability.</li>
              <li>Learn and apply new technologies as required.</li>
              <li>Document code and project processes.</li>
            </ul>

            <h4 style="font-size: 14px; color: #0f172a; margin-top: 24px; font-weight: bold;">Lexon IT Intern Policy & Guidelines:</h4>
            <ol style="font-size: 13px; color: #475569; margin: 8px 0; padding-left: 20px; line-height: 1.6;">
              <li><strong>Internship Duration:</strong> The internship period is specified in this offer letter and should be adhered to.</li>
              <li><strong>Working Hours:</strong> Interns are expected to work during agreed-upon hours. Notify supervisor in advance for absences.</li>
              <li><strong>Stipend:</strong> Paid as per terms outlined, processed at the end of each month subject to attendance and performance.</li>
              <li><strong>Attendance and Leave:</strong> Maximum of 6 days of leave during internship period. Pre-approval required.</li>
              <li><strong>Code of Conduct:</strong> Adhere to professional standards of behavior and company values.</li>
              <li><strong>Confidentiality:</strong> Maintain strict confidentiality regarding company information and proprietary tools.</li>
              <li><strong>Ownership of Work:</strong> All work completed remains the property of Lexon IT.</li>
              <li><strong>Use of Company Equipment:</strong> Equipment/software provided should be used responsibly.</li>
              <li><strong>Performance and Feedback:</strong> Regular feedback sessions will be conducted.</li>
              <li><strong>Termination of Internship:</strong> 15 days notice required by either party.</li>
              <li><strong>Certificate of Completion:</strong> Awarded upon successful finishing of internship responsibilities.</li>
              <li><strong>General Guidelines:</strong> Maintain a positive and proactive attitude.</li>
            </ol>

            <div style="margin-top: 32px; padding: 20px; border: 1px dashed #cbd5e1; border-radius: 12px; background-color: #fafafa;">
              <p style="font-weight: bold; margin-top: 0; color: #0f172a;">Acknowledgment and Acceptance:</p>
              <p style="font-size: 13px;">I, <strong>${candidateName}</strong>, accept the offer as a <strong>${jobRole}</strong> with <strong>${companyName}</strong> under the terms and conditions stated above.</p>
              <div style="margin-top: 24px; font-size: 13px; color: #64748b;">
                <p>Signature: _________________________ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Date: _____________________________</p>
              </div>
            </div>

            <p style="margin-top: 24px;">Warm regards,<br/><strong>HR Team, Lexon IT Solutions Pvt Ltd</strong></p>
          </div>
        </div>
      `;
    } else {
      emailSubject = subject || `Congratulations! You are selected for Next Round — ${jobRole} at ${companyName}`;

      htmlBody = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 620px; margin: 0 auto; padding: 28px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
          <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #f1f5f9;">
            <h2 style="color: #4f46e5; margin: 0; font-size: 24px; font-weight: 800;">🎉 Congratulations, ${candidateName}!</h2>
            <p style="color: #64748b; font-size: 15px; margin-top: 6px;">You have been selected for the Next Round — AI Voice Screening</p>
          </div>

          <div style="padding: 24px 0; color: #334155; font-size: 15px; line-height: 1.6;">
            <p>Dear <strong>${candidateName}</strong>,</p>
            <p>We reviewed your resume and application for the position of <strong>${jobRole}</strong> at <strong>${companyName}</strong>.</p>
            <p>Based on your outstanding ATS qualification match score (<strong>${score}%</strong>), you have been officially selected for an autonomous <strong>AI Voice Technical Screening Interview</strong>.</p>

            <div style="margin: 32px 0; text-align: center;">
              <a href="${interviewLink}" style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 14px rgba(79,70,229,0.4);">
                🚀 Start AI Voice Technical Interview
              </a>
            </div>

            <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 12px; padding: 20px; margin: 24px 0; font-size: 14px;">
              <p style="margin: 0 0 10px 0; font-weight: bold; color: #1e293b; font-size: 15px;">📋 Interview Session Overview:</p>
              <p style="margin: 6px 0;"><strong>Position:</strong> ${jobRole}</p>
              <p style="margin: 6px 0;"><strong>Company:</strong> ${companyName}</p>
              <p style="margin: 6px 0;"><strong>Scheduled Session:</strong> ${scheduledTime}</p>
              <p style="margin: 6px 0;"><strong>Direct Portal Link:</strong> <a href="${interviewLink}" style="color: #4f46e5; text-decoration: underline;">${interviewLink}</a></p>
            </div>

            <p style="font-size: 13px; color: #64748b;">Please ensure your microphone and audio are working properly before launching the session.</p>
          </div>

          <div style="border-top: 1px solid #f1f5f9; padding-top: 20px; text-align: center; color: #94a3b8; font-size: 13px;">
            <p style="margin: 0;">Sent automatically by <strong>${companyName} Talent Acquisition Platform</strong></p>
          </div>
        </div>
      `;
    }

    // 1. Real SMTP / Gmail Dispatch
    if (gmailUser && gmailPass) {
      try {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpPort === 465,
          auth: {
            user: gmailUser,
            pass: gmailPass,
          },
        });

        const info = await transporter.sendMail({
          from: `"${companyName} Talent Acquisition" <${gmailUser}>`,
          to: targetEmail,
          subject: emailSubject,
          html: htmlBody,
        });

        return NextResponse.json({
          success: true,
          emailSent: true,
          mode: 'REAL_SMTP',
          recipient: targetEmail,
          messageId: info.messageId,
          message: `Real selection email successfully dispatched via Gmail SMTP to ${targetEmail}!`,
        });
      } catch (smtpError: any) {
        console.warn('Real SMTP dispatch failed (invalid credentials or network error). Falling back to Ethereal Email Preview:', smtpError?.message || smtpError);
      }
    }

    // 2. Ethereal Email Preview (Fallback when credentials are not configured or invalid)
    const testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const info = await transporter.sendMail({
      from: `"${companyName} Talent Acquisition" <careers@applyai.com>`,
      to: targetEmail,
      subject: emailSubject,
      html: htmlBody,
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);

    return NextResponse.json({
      success: true,
      emailSent: true,
      mode: 'ETHEREAL_PREVIEW',
      recipient: targetEmail,
      messageId: info.messageId,
      previewUrl: previewUrl || undefined,
      message: `Selection Email sent in preview mode! Real credentials not detected or invalid in .env. View preview link below.`,
    });
  } catch (error: any) {
    console.error('Error sending selection email:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to dispatch selection email' },
      { status: 500 }
    );
  }
}
