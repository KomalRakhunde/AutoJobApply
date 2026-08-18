import { NextRequest, NextResponse } from 'next/server';
import { generateValidJwt } from '@/utils/jwt';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const errorParam = searchParams.get('error');
  const stateRole = searchParams.get('state') || searchParams.get('role') || 'student';
  const requestedRole = stateRole.toLowerCase();

  // Admin / Super Admin social login guard
  if (requestedRole === 'admin' || requestedRole === 'super_admin' || requestedRole === 'superadmin') {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('error', 'Admin and Super Admin accounts require 2FA / Security Key validation.');
    return NextResponse.redirect(loginUrl);
  }

  if (errorParam || !code) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set(
      'error',
      `Google authentication was canceled or failed (${errorParam || 'No authorization code received'}).`,
    );
    return NextResponse.redirect(loginUrl);
  }

  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const origin = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || new URL(request.url).origin;
  const redirectUri = `${origin}/api/auth/callback/google`;

  if (!googleClientId || !googleClientSecret || googleClientId === 'your_google_client_id') {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set(
      'error',
      'Google OAuth credentials are not properly configured in environment variables (.env).',
    );
    return NextResponse.redirect(loginUrl);
  }

  try {
    // 1. Exchange authorization code for Google access token
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: googleClientId,
        client_secret: googleClientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || !tokenData.access_token) {
      console.error('Google OAuth token exchange error:', tokenData);
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set(
        'error',
        `Google OAuth token exchange failed: ${tokenData.error_description || tokenData.error || 'Invalid grant'}`,
      );
      return NextResponse.redirect(loginUrl);
    }

    // 2. Fetch user profile from Google UserInfo endpoint
    const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const userData = await userRes.json();
    if (!userRes.ok || !userData.email) {
      console.error('Google UserInfo error:', userData);
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('error', 'Failed to retrieve Google user profile data.');
      return NextResponse.redirect(loginUrl);
    }

    const verifiedEmail = userData.email.toLowerCase();
    const firstName = userData.given_name || userData.name || 'Google';
    const lastName = userData.family_name || 'User';
    const picture = userData.picture || undefined;

    // 3. Register or authenticate user in NestJS backend
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const backendRes = await fetch(`${backendUrl}/auth/oauth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: verifiedEmail,
        firstName,
        lastName,
        requestedRole,
        provider: 'google',
        providerId: userData.sub,
        picture,
      }),
    });

    let verifiedRole = requestedRole;
    let jwtToken = generateValidJwt({
      userId: `user-google-${userData.sub || Date.now()}`,
      email: verifiedEmail,
      role: requestedRole,
      provider: 'google',
    });
    let isNewUser = false;
    let acceptedTermsAt: string | null = null;

    if (backendRes.ok) {
      const data = await backendRes.json();
      verifiedRole = (data.user?.role || requestedRole).toLowerCase();
      jwtToken = data.accessToken || jwtToken;
      isNewUser = data.user?.isNewUser ?? false;
      acceptedTermsAt = data.user?.acceptedTermsAt ?? null;
    }

    if (isNewUser || !acceptedTermsAt) {
      const consentUrl = new URL(`/onboarding/consent`, request.url);
      consentUrl.searchParams.set('role', verifiedRole);
      consentUrl.searchParams.set('provider', 'google');
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
  } catch (error: any) {
    console.error('Google OAuth processing error:', error);
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set(
      'error',
      `Google authentication error: ${error?.message || 'Unexpected error'}`,
    );
    return NextResponse.redirect(loginUrl);
  }
}
