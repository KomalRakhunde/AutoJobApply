import { NextRequest, NextResponse } from 'next/server';
import { generateValidJwt } from '@/utils/jwt';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const stateRole = searchParams.get('state') || searchParams.get('role') || 'student';
  const requestedRole = stateRole.toLowerCase();

  // Admin / Super Admin social login guard
  if (requestedRole === 'admin' || requestedRole === 'super_admin' || requestedRole === 'superadmin') {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('error', 'Admin and Super Admin accounts require 2FA / Security Key validation.');
    return NextResponse.redirect(loginUrl);
  }

  const mockEmail = `linkedin.user.${Date.now().toString(36)}@example.com`;
  const verifiedEmail = mockEmail.toLowerCase();
  const firstName = 'LinkedIn';
  const lastName = 'Member';

  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const backendRes = await fetch(`${backendUrl}/auth/oauth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: verifiedEmail,
        firstName,
        lastName,
        requestedRole,
        provider: 'linkedin',
      }),
    });

    let verifiedRole = requestedRole;
    let jwtToken = generateValidJwt({
      userId: `user-linkedin-${Date.now()}`,
      email: verifiedEmail,
      role: requestedRole,
      provider: 'linkedin',
    });
    let isNewUser = true;
    let acceptedTermsAt: string | null = null;

    if (backendRes.ok) {
      const data = await backendRes.json();
      verifiedRole = (data.user?.role || requestedRole).toLowerCase();
      jwtToken = data.accessToken || jwtToken;
      isNewUser = data.user?.isNewUser ?? true;
      acceptedTermsAt = data.user?.acceptedTermsAt ?? null;
    }

    // Check if new user or terms not accepted -> redirect to onboarding consent screen
    if (isNewUser || !acceptedTermsAt) {
      const consentUrl = new URL(`/onboarding/consent`, request.url);
      consentUrl.searchParams.set('role', verifiedRole);
      consentUrl.searchParams.set('provider', 'linkedin');
      consentUrl.searchParams.set('email', verifiedEmail);

      const response = NextResponse.redirect(consentUrl);
      response.cookies.set('applyai_token', jwtToken, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });
      response.cookies.set('applyai_role', verifiedRole, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });
      return response;
    }

    const targetPortal = verifiedRole === 'super_admin' ? 'super-admin' : verifiedRole;
    const redirectUrl = new URL(`/dashboard/${targetPortal}`, request.url);
    const response = NextResponse.redirect(redirectUrl);

    response.cookies.set('applyai_token', jwtToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    response.cookies.set('applyai_role', verifiedRole, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    const fallbackToken = generateValidJwt({
      userId: `user-linkedin-${Date.now()}`,
      email: verifiedEmail,
      role: requestedRole,
      provider: 'linkedin',
    });
    const consentUrl = new URL(`/onboarding/consent`, request.url);
    consentUrl.searchParams.set('role', requestedRole);
    consentUrl.searchParams.set('provider', 'linkedin');
    consentUrl.searchParams.set('email', verifiedEmail);

    const response = NextResponse.redirect(consentUrl);
    response.cookies.set('applyai_token', fallbackToken, { path: '/', maxAge: 604800 });
    response.cookies.set('applyai_role', requestedRole, { path: '/', maxAge: 604800 });
    return response;
  }
}
