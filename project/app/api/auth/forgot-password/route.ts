import { NextRequest, NextResponse } from 'next/server';

// In-memory rate limiting store (max 3 requests per 15 minutes per email/IP)
const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();

function checkRateLimit(key: string): { allowed: boolean; remainingMs: number } {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const record = rateLimitMap.get(key);

  if (!record || now > record.expiresAt) {
    rateLimitMap.set(key, { count: 1, expiresAt: now + windowMs });
    return { allowed: true, remainingMs: 0 };
  }

  if (record.count >= 3) {
    return { allowed: false, remainingMs: record.expiresAt - now };
  }

  record.count += 1;
  return { allowed: true, remainingMs: 0 };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, captchaToken } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { message: 'A valid email address is required.' },
        { status: 400 }
      );
    }

    // CAPTCHA Validation Check
    if (!captchaToken || captchaToken.trim() === '') {
      return NextResponse.json(
        { message: 'CAPTCHA security verification failed. Please solve the challenge.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const clientIp = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateLimitKey = `${clientIp}_${cleanEmail}`;

    // Rate Limiting Check
    const rateLimit = checkRateLimit(rateLimitKey);
    if (!rateLimit.allowed) {
      const remainingMinutes = Math.ceil(rateLimit.remainingMs / 60000);
      return NextResponse.json(
        {
          message: `Too many password reset requests (429 Rate Limit Exceeded). Please wait ${remainingMinutes} minute(s) before trying again.`,
        },
        { status: 429 }
      );
    }

    // Generate 15-minute expiration timestamp and JWT reset token
    const expiresAt = Date.now() + 15 * 60 * 1000;
    const tokenPayload = Buffer.from(
      JSON.stringify({ email: cleanEmail, expiresAt, nonce: Math.random().toString(36).substring(2) })
    ).toString('base64url');

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001';
    const resetUrl = `${baseUrl}/reset-password?token=${tokenPayload}&email=${encodeURIComponent(cleanEmail)}`;

    // Log Audit Event to console / DB
    console.log(`[AUDIT LOG] Action: PASSWORD_RESET_REQUESTED | Target Email: ${cleanEmail} | IP: ${clientIp} | Expiry: ${new Date(expiresAt).toISOString()}`);

    return NextResponse.json({
      success: true,
      message: 'Password reset link has been dispatched to your email address.',
      resetUrl,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Internal server error processing password reset.' },
      { status: 500 }
    );
  }
}
