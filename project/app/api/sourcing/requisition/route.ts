import { NextResponse } from 'next/server';
import type { JobRequisition, PipelineRoundConfig } from '@/lib/types/sourcing';

// In-memory store fallback for demo environment
let mockRequisitions: JobRequisition[] = [
  {
    id: 'req-1',
    recruiterId: 'recruiter-1',
    title: 'Senior Full Stack Engineer (AI Systems)',
    requiredSkills: ['React', 'Next.js', 'Node.js', 'TypeScript', 'Vector DBs'],
    experienceLevel: 'Senior',
    targetLocation: 'San Francisco, CA (Remote)',
    targetOpenings: 5,
    description: 'Looking for a Senior Full Stack Engineer to lead AI agent automation workflows.',
    rounds: [
      { roundNumber: 1, name: 'AI Chat Screening', type: 'AI_CHAT_SCREENING', isAiHandled: true, minPassingScore: 75 },
      { roundNumber: 2, name: 'Technical Voice/Code Round', type: 'AI_VOICE_TECHNICAL', isAiHandled: true, minPassingScore: 80 },
      { roundNumber: 3, name: 'Final HR Interview', type: 'HUMAN_HR_INTERVIEW', isAiHandled: false, minPassingScore: 70 },
    ],
    createdAt: new Date().toISOString(),
    status: 'OPEN',
  },
];

export async function GET() {
  return NextResponse.json({ requisitions: mockRequisitions });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newReq: JobRequisition = {
      id: `req-${Date.now()}`,
      recruiterId: body.recruiterId || 'recruiter-1',
      title: body.title,
      requiredSkills: body.requiredSkills || [],
      experienceLevel: body.experienceLevel || 'Mid',
      targetLocation: body.targetLocation || 'Remote',
      targetOpenings: body.targetOpenings || 1,
      description: body.description || '',
      rounds: body.rounds || [
        { roundNumber: 1, name: 'AI Chat Screening', type: 'AI_CHAT_SCREENING', isAiHandled: true, minPassingScore: 75 },
        { roundNumber: 2, name: 'Final HR Interview', type: 'HUMAN_HR_INTERVIEW', isAiHandled: false, minPassingScore: 70 },
      ],
      createdAt: new Date().toISOString(),
      status: 'OPEN',
    };

    mockRequisitions.unshift(newReq);
    return NextResponse.json({ success: true, requisition: newReq }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create job requisition' }, { status: 400 });
  }
}
