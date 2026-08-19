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
      `LinkedIn authentication was canceled or failed (${errorParam || 'No authorization code received'}).`,
    );
    return NextResponse.redirect(loginUrl);
  }

  const linkedinClientId = process.env.LINKEDIN_CLIENT_ID;
  const linkedinClientSecret = process.env.LINKEDIN_CLIENT_SECRET;
  const origin = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || new URL(request.url).origin;
  const redirectUri = `${origin}/api/auth/callback/linkedin`;

  if (!linkedinClientId || !linkedinClientSecret || linkedinClientId === 'your_linkedin_client_id') {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set(
      'error',
      'LinkedIn OAuth credentials are not properly configured in environment variables (.env).',
    );
    return NextResponse.redirect(loginUrl);
  }

  try {
    // 1. Exchange authorization code for LinkedIn access token
    const tokenRes = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: linkedinClientId,
        client_secret: linkedinClientSecret,
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || !tokenData.access_token) {
      console.error('LinkedIn OAuth token exchange error:', tokenData);
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set(
        'error',
        `LinkedIn OAuth token exchange failed: ${tokenData.error_description || tokenData.error || 'Invalid grant'}`,
      );
      return NextResponse.redirect(loginUrl);
    }

    // 2. Fetch user profile from LinkedIn OpenID UserInfo endpoint
    const userRes = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const userData = await userRes.json();
    if (!userRes.ok || !userData.email) {
      console.error('LinkedIn UserInfo error:', userData);
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('error', 'Failed to retrieve LinkedIn user profile data.');
      return NextResponse.redirect(loginUrl);
    }

    const verifiedEmail = userData.email.toLowerCase();
    const firstName = userData.given_name || userData.name || 'LinkedIn';
    const lastName = userData.family_name || 'Member';
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
        provider: 'linkedin',
        providerId: userData.sub,
        picture,
      }),
    });

    let verifiedRole = requestedRole;
    let verifiedUserId = `user-linkedin-${userData.sub || Date.now()}`;
    let jwtToken = generateValidJwt({
      userId: verifiedUserId,
      email: verifiedEmail,
      role: requestedRole,
      provider: 'linkedin',
    });
    let isNewUser = false;
    let acceptedTermsAt: string | null = null;

    if (backendRes.ok) {
      const data = await backendRes.json();
      verifiedRole = (data.user?.role || requestedRole).toLowerCase();
      verifiedUserId = data.user?.id || verifiedUserId;
      jwtToken = data.accessToken || jwtToken;
      isNewUser = data.user?.isNewUser ?? false;
      acceptedTermsAt = data.user?.acceptedTermsAt ?? null;
    }

    // Carried to the client so the app can hydrate Redux/localStorage with the
    // real authenticated profile — cookies alone only gate route access.
    // NextResponse's cookie serializer URI-encodes the value itself —
    // encoding it again here would leave it double-encoded on the client.
    const clientUserCookie = JSON.stringify({
      id: verifiedUserId,
      email: verifiedEmail,
      firstName,
      lastName,
      role: verifiedRole,
    });

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
      response.cookies.set('applyai_user', clientUserCookie, {
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
    response.cookies.set('applyai_user', clientUserCookie, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error: any) {
    console.error('LinkedIn OAuth processing error:', error);
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set(
      'error',
      `LinkedIn authentication error: ${error?.message || 'Unexpected error'}`,
    );
    return NextResponse.redirect(loginUrl);
  }
}
