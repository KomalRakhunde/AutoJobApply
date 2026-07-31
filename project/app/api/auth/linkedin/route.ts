import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const role = searchParams.get('role') || 'student';

  const linkedinClientId = process.env.LINKEDIN_CLIENT_ID;
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/api/auth/callback/linkedin`;

  if (linkedinClientId) {
    const scope = encodeURIComponent('openid profile email');
    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${linkedinClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&state=${encodeURIComponent(role)}`;
    return NextResponse.redirect(authUrl);
  }

  const callbackUrl = new URL(`/api/auth/callback/linkedin`, request.url);
  callbackUrl.searchParams.set('role', role);
  callbackUrl.searchParams.set('code', `mock-linkedin-code-${Date.now()}`);
  return NextResponse.redirect(callbackUrl);
}
