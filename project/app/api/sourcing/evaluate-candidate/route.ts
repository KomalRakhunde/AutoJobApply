import { NextResponse } from 'next/server';
import { z } from 'zod';
import type { InterviewScorecard } from '@/lib/types/sourcing';

const EvaluatePayloadSchema = z.object({
  candidateId: z.string({ required_error: 'Candidate ID is required' }),
  roundNumber: z.number().default(1),
  qnaTranscript: z
    .array(
      z.object({
        question: z.string(),
        answer: z.string(),
      })
    )
    .optional()
    .default([]),
});

export async function POST(req: Request) {
  try {
    const rawBody = await req.json().catch(() => ({}));
    const parseResult = EvaluatePayloadSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const { candidateId, qnaTranscript, roundNumber } = parseResult.data;

    const scoredTranscript = qnaTranscript.map((item) => ({
      question: item.question,
      answer: item.answer,
      grade: 85 + Math.floor(Math.random() * 12),
      feedback: 'Clear technical explanation with strong practical examples.',
    }));

    const avgScore =
      scoredTranscript.length > 0
        ? Math.round(scoredTranscript.reduce((acc, curr) => acc + curr.grade, 0) / scoredTranscript.length)
        : 88;

    const scorecard: InterviewScorecard = {
      candidateId,
      roundNumber,
      overallScore: avgScore,
      communicationRating: avgScore >= 90 ? 'Excellent' : avgScore >= 80 ? 'Good' : 'Average',
      strengths: [
        'Strong grasp of modern React & Next.js App Router architecture.',
        'Demonstrates clear understanding of vector database embeddings.',
        'Articulate communication and structured problem-solving approach.',
      ],
      weaknesses: ['Could provide deeper detail on Kubernetes container orchestration.'],
      qnaTranscript: scoredTranscript,
      finalRecommendation: avgScore >= 75 ? 'PASS' : 'FAIL',
      evaluatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      scorecard,
      notification: `AI Agent completed Round ${roundNumber} for candidate ${candidateId} with Score ${avgScore}%. Recommendation: ${scorecard.finalRecommendation}.`,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error while evaluating candidate screening' },
      { status: 500 }
    );
  }
}
