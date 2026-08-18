import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const role = (searchParams.get('role') || 'student').toLowerCase();

  // Security Restriction: Admin and Super Admin accounts cannot be auto-provisioned via OAuth
  if (role === 'admin' || role === 'super_admin' || role === 'superadmin') {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('error', 'Admin and Super Admin accounts require 2FA / Security Key validation and cannot be auto-provisioned via social login.');
    return NextResponse.redirect(loginUrl);
  }

  const origin = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || new URL(request.url).origin;
  const redirectUri = `${origin}/api/auth/callback/linkedin`;
  const linkedinClientId = process.env.LINKEDIN_CLIENT_ID;

  if (!linkedinClientId || linkedinClientId === 'your_linkedin_client_id') {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set(
      'error',
      'LinkedIn OAuth is not configured in environment variables. Please set LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET in .env',
    );
    return NextResponse.redirect(loginUrl);
  }

  const scope = encodeURIComponent('openid profile email');
  const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${linkedinClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&state=${encodeURIComponent(role)}&prompt=select_account`;
  return NextResponse.redirect(authUrl);
}
