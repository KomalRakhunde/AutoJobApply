import { NextResponse } from 'next/server';
import { z } from 'zod';

const OutreachPayloadSchema = z.object({
  candidateId: z.string({ required_error: 'Candidate ID is required' }),
  candidateName: z.string({ required_error: 'Candidate Name is required' }),
  candidateEmail: z.string().email().optional(),
  candidatePhone: z.string().optional(),
  channel: z.enum(['EMAIL', 'WHATSAPP']).default('EMAIL'),
  jobTitle: z.string().default('Senior Software Engineer'),
});

export async function POST(req: Request) {
  try {
    const rawBody = await req.json().catch(() => ({}));
    const parseResult = OutreachPayloadSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const { candidateId, candidateName, candidateEmail, candidatePhone, channel, jobTitle } = parseResult.data;

    const inviteLink = `https://applyai.com/screening/${candidateId}`;
    const message =
      channel === 'WHATSAPP'
        ? `Hi ${candidateName}, your profile matched our ${jobTitle} opening at ApplyAI! Let's start your 10-minute AI screening: ${inviteLink}`
        : `Dear ${candidateName},\n\nWe were impressed by your background and experience. Your profile matched our opening for ${jobTitle} at ApplyAI.\n\nPlease click the link below to begin your initial 10-minute AI screening round:\n${inviteLink}\n\nBest regards,\nApplyAI Autonomous Hiring Agent`;

    const outreachLog = {
      candidateId,
      candidateName,
      channel,
      message,
      inviteLink,
      sentAt: new Date().toISOString(),
      status: 'DELIVERED',
    };

    return NextResponse.json({
      success: true,
      channel,
      outreachLog,
      message: `Outreach invite sent via ${channel} to ${candidateName}.`,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error while processing outreach trigger' },
      { status: 500 }
    );
  }
}
