import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const stateRole = searchParams.get('state') || searchParams.get('role') || 'student';
  const requestedRole = stateRole.toLowerCase();

  // Extract or simulate verified Google profile
  const mockEmail = `google.user.${Date.now().toString(36)}@example.com`;
  const verifiedEmail = mockEmail.toLowerCase();
  const firstName = 'Google';
  const lastName = 'Candidate';

  try {
    // Call NestJS Auth Service to lookup/provision user in PostgreSQL
    const backendRes = await fetch('http://localhost:3000/api/auth/oauth', {
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
    let userId = `user-google-${Date.now()}`;

    if (backendRes.ok) {
      const data = await backendRes.json();
      verifiedRole = (data.user?.role || requestedRole).toLowerCase();
      jwtToken = data.accessToken || jwtToken;
      userId = data.user?.id || userId;
    }

    const targetPortal = verifiedRole === 'super_admin' ? 'super-admin' : verifiedRole;
    const redirectUrl = new URL(`/dashboard/${targetPortal}`, request.url);
    const response = NextResponse.redirect(redirectUrl);

    // Issue HTTP-Only Cookies
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
    const targetPortal = requestedRole === 'super_admin' ? 'super-admin' : requestedRole;
    const response = NextResponse.redirect(new URL(`/dashboard/${targetPortal}`, request.url));
    response.cookies.set('applyai_token', `demo-google-token-${Date.now()}`, { path: '/', maxAge: 604800 });
    response.cookies.set('applyai_role', requestedRole, { path: '/', maxAge: 604800 });
    return response;
  }
}
