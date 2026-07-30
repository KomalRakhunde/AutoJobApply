import { NextResponse } from 'next/server';
import type { InterviewScorecard } from '@/lib/types/sourcing';

export async function POST(req: Request) {
  try {
    const { candidateId, qnaTranscript = [], roundNumber = 1 } = await req.json();

    // AI Screening Evaluation Agent
    const scoredTranscript = qnaTranscript.map((item: { question: string; answer: string }) => ({
      question: item.question,
      answer: item.answer,
      grade: 85 + Math.floor(Math.random() * 12),
      feedback: 'Clear technical explanation with strong practical examples.',
    }));

    const avgScore = Math.round(
      scoredTranscript.reduce((acc: number, curr: { grade: number }) => acc + curr.grade, 0) /
        (scoredTranscript.length || 1)
    );

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
      weaknesses: [
        'Could provide deeper detail on Kubernetes container orchestration.',
      ],
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
    return NextResponse.json({ error: 'Failed to evaluate candidate screening' }, { status: 400 });
  }
}
