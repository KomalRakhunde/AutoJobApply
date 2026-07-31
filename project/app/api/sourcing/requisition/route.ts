import { NextResponse } from 'next/server';
import { z } from 'zod';
import type { JobRequisition } from '@/lib/types/sourcing';

const RequisitionPayloadSchema = z.object({
  title: z.string({ required_error: 'Job Title is required' }),
  requiredSkills: z.array(z.string()).optional().default([]),
  experienceLevel: z.string().optional().default('Mid'),
  targetLocation: z.string().optional().default('Remote'),
  targetOpenings: z.number().optional().default(1),
  description: z.string().optional().default(''),
  recruiterId: z.string().optional().default('recruiter-1'),
  rounds: z.array(z.any()).optional(),
});

let requisitionsStore: JobRequisition[] = [];

export async function GET() {
  return NextResponse.json({ requisitions: requisitionsStore });
}

export async function POST(req: Request) {
  try {
    const rawBody = await req.json().catch(() => ({}));
    const parseResult = RequisitionPayloadSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const body = parseResult.data;

    const newReq: JobRequisition = {
      id: `req-${Date.now()}`,
      recruiterId: body.recruiterId,
      title: body.title,
      requiredSkills: body.requiredSkills,
      experienceLevel: (body.experienceLevel as 'Entry' | 'Mid' | 'Senior' | 'Lead' | 'Executive') || 'Mid',
      targetLocation: body.targetLocation,
      targetOpenings: body.targetOpenings,
      description: body.description,
      rounds: body.rounds || [
        { roundNumber: 1, name: 'AI Chat Screening', type: 'AI_CHAT_SCREENING', isAiHandled: true, minPassingScore: 75 },
        { roundNumber: 2, name: 'Final HR Interview', type: 'HUMAN_HR_INTERVIEW', isAiHandled: false, minPassingScore: 70 },
      ],
      createdAt: new Date().toISOString(),
      status: 'OPEN',
    };

    requisitionsStore.unshift(newReq);
    return NextResponse.json({ success: true, requisition: newReq }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error while creating job requisition' },
      { status: 500 }
    );
  }
}
