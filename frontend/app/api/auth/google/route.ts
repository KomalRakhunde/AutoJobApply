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
  const redirectUri = `${origin}/api/auth/callback/google`;
  const googleClientId = process.env.GOOGLE_CLIENT_ID;

  if (!googleClientId || googleClientId === 'your_google_client_id') {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set(
      'error',
      'Google OAuth is not configured in environment variables. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env',
    );
    return NextResponse.redirect(loginUrl);
  }

  const scope = encodeURIComponent('openid email profile');
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${googleClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&state=${encodeURIComponent(role)}&prompt=select_account`;
  return NextResponse.redirect(authUrl);
}
