import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { candidateId, candidateName, candidateEmail, candidatePhone, channel, jobTitle } = await req.json();

    const inviteLink = `https://applyai.com/screening/${candidateId}`;
    const message = channel === 'WHATSAPP'
      ? `Hi ${candidateName}, your profile matched our ${jobTitle} opening at ApplyAI! Let's start your 10-minute AI screening: ${inviteLink}`
      : `Dear ${candidateName},\n\nWe were impressed by your background and experience. Your profile matched our opening for ${jobTitle} at ApplyAI.\n\nPlease click the link below to begin your initial 10-minute AI screening round:\n${inviteLink}\n\nBest regards,\nApplyAI Autonomous Hiring Agent`;

    // Simulated Resend (Email) or Twilio (WhatsApp) API Dispatch Log
    const outreachLog = {
      candidateId,
      candidateName,
      channel: channel || 'EMAIL',
      message,
      inviteLink,
      sentAt: new Date().toISOString(),
      status: 'DELIVERED',
    };

    return NextResponse.json({
      success: true,
      channel: channel || 'EMAIL',
      outreachLog,
      message: `Outreach invite sent via ${channel || 'EMAIL'} to ${candidateName}.`,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send outreach trigger' }, { status: 400 });
  }
}
