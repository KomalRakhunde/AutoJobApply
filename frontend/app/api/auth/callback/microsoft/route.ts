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
      `Microsoft authentication was canceled or failed (${errorParam || 'No authorization code received'}).`,
    );
    return NextResponse.redirect(loginUrl);
  }

  const msClientId = process.env.MICROSOFT_CLIENT_ID;
  const msClientSecret = process.env.MICROSOFT_CLIENT_SECRET;
  const tenantId = process.env.MICROSOFT_TENANT_ID || 'common';
  const origin = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || new URL(request.url).origin;
  const redirectUri = `${origin}/api/auth/callback/microsoft`;

  if (!msClientId || !msClientSecret || msClientId === 'your_microsoft_client_id') {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set(
      'error',
      'Microsoft OAuth credentials are not properly configured in environment variables (.env).',
    );
    return NextResponse.redirect(loginUrl);
  }

  try {
    // 1. Exchange authorization code for Microsoft access token
    const tokenRes = await fetch(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: msClientId,
        client_secret: msClientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || !tokenData.access_token) {
      console.error('Microsoft OAuth token exchange error:', tokenData);
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set(
        'error',
        `Microsoft OAuth token exchange failed: ${tokenData.error_description || tokenData.error || 'Invalid grant'}`,
      );
      return NextResponse.redirect(loginUrl);
    }

    // 2. Fetch user profile from Microsoft Graph API me endpoint
    const userRes = await fetch('https://graph.microsoft.com/v1.0/me', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const userData = await userRes.json();
    const rawEmail = userData.mail || userData.userPrincipalName;
    if (!userRes.ok || !rawEmail) {
      console.error('Microsoft Graph error:', userData);
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('error', 'Failed to retrieve Microsoft user profile data.');
      return NextResponse.redirect(loginUrl);
    }

    const verifiedEmail = rawEmail.toLowerCase();
    const firstName = userData.givenName || userData.displayName?.split(' ')[0] || 'Microsoft';
    const lastName = userData.surname || userData.displayName?.split(' ').slice(1).join(' ') || 'User';

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
        provider: 'microsoft',
        providerId: userData.id,
      }),
    });

    let verifiedRole = requestedRole;
    let jwtToken = generateValidJwt({
      userId: `user-microsoft-${userData.id || Date.now()}`,
      email: verifiedEmail,
      role: requestedRole,
      provider: 'microsoft',
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
      consentUrl.searchParams.set('provider', 'microsoft');
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
    console.error('Microsoft OAuth processing error:', error);
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set(
      'error',
      `Microsoft authentication error: ${error?.message || 'Unexpected error'}`,
    );
    return NextResponse.redirect(loginUrl);
  }
}
