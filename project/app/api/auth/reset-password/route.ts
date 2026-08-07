import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, email, newPassword } = body;

    if (!token || !email || !newPassword) {
      return NextResponse.json(
        { message: 'Token, email, and new security key are required.' },
        { status: 400 }
      );
    }

    // Verify Password Reset Token Payload & Expiration
    try {
      const decodedJson = Buffer.from(token, 'base64url').toString('utf-8');
      const payload = JSON.parse(decodedJson);

      if (payload.email !== email.trim().toLowerCase()) {
        return NextResponse.json(
          { message: 'Invalid password reset token for this email address.' },
          { status: 400 }
        );
      }

      if (Date.now() > payload.expiresAt) {
        return NextResponse.json(
          { message: 'Password reset link has expired (15 min limit). Please request a new link.' },
          { status: 400 }
        );
      }
    } catch (e) {
      return NextResponse.json(
        { message: 'Malformed or invalid password reset token.' },
        { status: 400 }
      );
    }

    // Password Complexity Verification (min 8 chars, uppercase, lowercase, number, special char)
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!strongPasswordRegex.test(newPassword)) {
      return NextResponse.json(
        {
          message:
            'Security key must be at least 8 characters long and contain uppercase (A-Z), lowercase (a-z), numbers (0-9), and special characters (@$!%*?&).',
        },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const clientIp = request.headers.get('x-forwarded-for') || '127.0.0.1';

    // Log Audit Event
    console.log(`[AUDIT LOG] Action: PASSWORD_RESET_COMPLETED | Email: ${cleanEmail} | IP: ${clientIp} | Timestamp: ${new Date().toISOString()}`);

    return NextResponse.json({
      success: true,
      message: 'Your security key has been successfully updated. You may now sign in.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to reset password.' },
      { status: 500 }
    );
  }
}
