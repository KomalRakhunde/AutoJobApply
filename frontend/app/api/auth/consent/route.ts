import { NextRequest, NextResponse } from 'next/server';
import { generateValidJwt } from '@/utils/jwt';

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
    const userEmail = email || `${selectedRole}@applyai.com`;
    const now = new Date().toISOString();

    let token = request.cookies.get('applyai_token')?.value;
    let userId = `user-oauth-${Date.now()}`;

    // Call NestJS backend /auth/oauth to register or login user & get NestJS JWT
    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${backendUrl}/auth/oauth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          requestedRole: selectedRole,
          provider: 'google',
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.accessToken) {
          token = data.accessToken;
        }
        if (data.user?.id) {
          userId = data.user.id;
        }
      }
    } catch (e) {
      // Backend unreachable fallback
    }

    // Ensure token is a valid JWT format
    if (!token || !token.includes('.')) {
      token = generateValidJwt({
        userId,
        email: userEmail,
        role: selectedRole,
      });
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
      { status: 500 }
    );
  }
}
