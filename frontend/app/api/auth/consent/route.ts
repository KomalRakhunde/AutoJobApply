import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { role, termsAccepted, provider, email } = body;

    if (!termsAccepted) {
      return NextResponse.json(
        { message: 'Terms of Service must be accepted to continue.' },
        { status: 400 },
      );
    }

    const selectedRole = (role || 'student').toLowerCase();
    const selectedProvider = ['google', 'linkedin', 'microsoft'].includes(provider) ? provider : 'google';

    // The user must already hold a real backend-issued session from the OAuth
    // callback - consent alone must never be able to mint or upgrade a session.
    const existingToken = request.cookies.get('applyai_token')?.value;
    if (!existingToken || !existingToken.includes('.')) {
      return NextResponse.json(
        { message: 'No active session found. Please sign in again.' },
        { status: 401 },
      );
    }

    if (!email) {
      return NextResponse.json(
        { message: 'Missing account email for consent confirmation.' },
        { status: 400 },
      );
    }

    const userEmail = String(email).toLowerCase();
    const now = new Date().toISOString();

    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const res = await fetch(`${backendUrl}/auth/oauth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: userEmail,
        requestedRole: selectedRole,
        provider: selectedProvider,
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      return NextResponse.json(
        { message: errData?.message || 'Could not confirm your account. Please try again.' },
        { status: 502 },
      );
    }

    const data = await res.json();
    const token = data.accessToken;
    const userId = data.user?.id;

    if (!token || !userId) {
      return NextResponse.json(
        { message: 'Server did not return a valid session. Please try again.' },
        { status: 502 },
      );
    }

    const response = NextResponse.json({
      success: true,
      message: 'Terms & conditions accepted successfully.',
      role: selectedRole,
      acceptedTermsAt: now,
      token,
      user: {
        id: userId,
        email: userEmail,
        role: selectedRole,
      },
    });

    response.cookies.set('applyai_token', token, {
      httpOnly: false,
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
      { status: 500 },
    );
  }
}
