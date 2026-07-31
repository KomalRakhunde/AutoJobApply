import { NextResponse } from 'next/server';
import { z } from 'zod';
import type { SourcedCandidate } from '@/lib/types/sourcing';

const SourcePayloadSchema = z.object({
  requisitionId: z.string().optional(),
  requiredSkills: z.array(z.string()).optional(),
});

const talentDatabase: Omit<SourcedCandidate, 'id' | 'requisitionId' | 'matchScore' | 'status'>[] = [
  {
    name: 'Alex Rivera',
    email: 'alex.rivera@example.com',
    phone: '+1 (555) 234-5678',
    currentRole: 'Senior Staff Engineer',
    company: 'Stripe',
    location: 'San Francisco, CA',
    linkedinUrl: 'https://linkedin.com/in/alexrivera',
    skills: ['React', 'Next.js', 'Node.js', 'TypeScript', 'Vector DBs', 'System Design'],
  },
  {
    name: 'Elena Rostova',
    email: 'elena.rostova@example.com',
    phone: '+1 (555) 876-5432',
    currentRole: 'Full Stack Architect',
    company: 'Vercel',
    location: 'New York, NY (Remote)',
    linkedinUrl: 'https://linkedin.com/in/elenarostova',
    skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Prisma'],
  },
  {
    name: 'Michael Chang',
    email: 'michael.chang@example.com',
    phone: '+1 (555) 345-6789',
    currentRole: 'Lead Software Engineer',
    company: 'Linear',
    location: 'Austin, TX',
    linkedinUrl: 'https://linkedin.com/in/michaelchang',
    skills: ['React', 'Node.js', 'TypeScript', 'GraphQL', 'Docker'],
  },
  {
    name: 'Sofia Patel',
    email: 'sofia.patel@example.com',
    phone: '+1 (555) 987-6543',
    currentRole: 'Senior Frontend Developer',
    company: 'Supabase',
    location: 'Remote',
    linkedinUrl: 'https://linkedin.com/in/sofiapatel',
    skills: ['React', 'Next.js', 'Tailwind CSS', 'Redux', 'TypeScript'],
  },
  {
    name: 'David Kim',
    email: 'david.kim@example.com',
    phone: '+1 (555) 456-7890',
    currentRole: 'AI Application Engineer',
    company: 'OpenAI Ecosystem',
    location: 'San Francisco, CA',
    linkedinUrl: 'https://linkedin.com/in/davidkim',
    skills: ['Python', 'TypeScript', 'LangChain', 'Vector DBs', 'React'],
  },
];

function calculateAiMatchScore(candidateSkills: string[], requiredSkills: string[]): number {
  if (!requiredSkills || requiredSkills.length === 0) return 85;
  const matches = candidateSkills.filter((s) =>
    requiredSkills.some((req) => req.toLowerCase() === s.toLowerCase())
  ).length;
  const baseRatio = matches / requiredSkills.length;
  const score = Math.round(70 + baseRatio * 28 + Math.random() * 2);
  return Math.min(score, 98);
}

export async function POST(req: Request) {
  try {
    const rawBody = await req.json().catch(() => ({}));
    const parseResult = SourcePayloadSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Invalid payload structure', details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const { requisitionId, requiredSkills = [] } = parseResult.data;

    const sourcedCandidates: SourcedCandidate[] = talentDatabase.map((candidate, idx) => {
      const matchScore = calculateAiMatchScore(candidate.skills, requiredSkills);
      return {
        ...candidate,
        id: `cand-${requisitionId || 'req'}-${idx + 1}`,
        requisitionId: requisitionId || 'req-1',
        matchScore,
        status: 'SOURCED',
      };
    });

    sourcedCandidates.sort((a, b) => b.matchScore - a.matchScore);

    return NextResponse.json({
      success: true,
      totalSourced: sourcedCandidates.length,
      candidates: sourcedCandidates,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error while sourcing candidates' },
      { status: 500 }
    );
  }
}
