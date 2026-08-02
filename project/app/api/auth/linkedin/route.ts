import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const role = (searchParams.get('role') || 'student').toLowerCase();

  // Security Restriction: Admin and Super Admin accounts cannot be auto-provisioned via OAuth
  if (role === 'admin' || role === 'super_admin' || role === 'superadmin') {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('error', 'Admin and Super Admin accounts require 2FA / Security Key validation and cannot be auto-provisioned via social login.');
    return NextResponse.redirect(loginUrl);
  }

  const linkedinClientId = process.env.LINKEDIN_CLIENT_ID;
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/api/auth/callback/linkedin`;

  if (linkedinClientId) {
    const scope = encodeURIComponent('openid profile email');
    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${linkedinClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&state=${encodeURIComponent(role)}&prompt=select_account`;
    return NextResponse.redirect(authUrl);
  }

  const callbackUrl = new URL(`/api/auth/callback/linkedin`, request.url);
  callbackUrl.searchParams.set('role', role);
  callbackUrl.searchParams.set('prompt', 'select_account');
  callbackUrl.searchParams.set('code', `mock-linkedin-code-${Date.now()}`);
  return NextResponse.redirect(callbackUrl);
}
