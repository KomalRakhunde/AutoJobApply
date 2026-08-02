import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { role, termsAccepted, dataPermission, email } = body;

    if (!termsAccepted) {
      return NextResponse.json(
        { message: 'Terms of Service must be accepted to continue.' },
        { status: 400 }
      );
    }

    const selectedRole = (role || 'student').toLowerCase();
    const now = new Date().toISOString();

    // Call NestJS backend or update database
    try {
      await fetch('http://localhost:3000/api/auth/consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          role: selectedRole,
          acceptedTermsAt: now,
          isNewUser: false,
        }),
      });
    } catch (e) {
      // Demo backend fallback
    }

    const token = request.cookies.get('applyai_token')?.value || `auth-token-${Date.now()}`;

    const response = NextResponse.json({
      success: true,
      message: 'Terms & conditions accepted successfully.',
      role: selectedRole,
      acceptedTermsAt: now,
    });

    response.cookies.set('applyai_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    response.cookies.set('applyai_role', selectedRole, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to submit consent.' },
      { status: 500 }
    );
  }
}
