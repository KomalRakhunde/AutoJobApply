import { NextRequest, NextResponse } from 'next/server';

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

  // Extract or simulate verified Google profile
  const mockEmail = `google.user.${Date.now().toString(36)}@example.com`;
  const verifiedEmail = mockEmail.toLowerCase();
  const firstName = 'Google';
  const lastName = 'Candidate';

  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || new URL(request.url).origin;
    const backendRes = await fetch(`${backendUrl}/api/auth/oauth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: verifiedEmail,
        firstName,
        lastName,
        requestedRole,
        provider: 'google',
      }),
    });

    let verifiedRole = requestedRole;
    let jwtToken = `google-oauth-jwt-${Date.now()}`;
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
      consentUrl.searchParams.set('provider', 'google');
      consentUrl.searchParams.set('email', verifiedEmail);

      const response = NextResponse.redirect(consentUrl);
      response.cookies.set('applyai_token', jwtToken, {
        httpOnly: true,
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
      httpOnly: true,
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
    // Demo Mode: New user requiring consent redirection
    const consentUrl = new URL(`/onboarding/consent`, request.url);
    consentUrl.searchParams.set('role', requestedRole);
    consentUrl.searchParams.set('provider', 'google');
    consentUrl.searchParams.set('email', verifiedEmail);

    const response = NextResponse.redirect(consentUrl);
    response.cookies.set('applyai_token', `demo-google-token-${Date.now()}`, { path: '/', maxAge: 604800 });
    response.cookies.set('applyai_role', requestedRole, { path: '/', maxAge: 604800 });
    return response;
  }
}
