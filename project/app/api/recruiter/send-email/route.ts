import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

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
    const body = await req.json();
    const {
      candidateName,
      candidateEmail,
      recipientEmail,
      jobRole = 'Senior Software Engineer',
      companyName = 'ApplyAI Corp',
      score = 88,
      interviewLink = 'http://localhost:3001/interview-prep',
      scheduledTime = 'Next Tuesday at 10:00 AM',
      subject,
    } = body;

    const targetEmail = recipientEmail || candidateEmail;

    if (!targetEmail) {
      return NextResponse.json({ error: 'Target recipient email is required' }, { status: 400 });
    }

    const { gmailUser, gmailPass, smtpHost, smtpPort } = getEnvCredentials();

    const emailSubject = subject || `Congratulations! You are selected for Next Round — ${jobRole} at ${companyName}`;

    const htmlBody = `
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
