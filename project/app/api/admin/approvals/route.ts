import { NextResponse } from 'next/server';

export async function GET() {
  // Directly query database/backend API for pending approvals
  return NextResponse.json({
    approvals: [],
  });
}
