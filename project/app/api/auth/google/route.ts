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
  
  const origin = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
  const redirectUri = `${origin}/api/auth/callback/google`;
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  if (googleClientId) {
    const scope = encodeURIComponent('openid email profile');
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${googleClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&state=${encodeURIComponent(role)}&prompt=select_account`;
    return NextResponse.redirect(authUrl);
  }

  // Direct Callback fallback with role and prompt bound in state/query
  const callbackUrl = new URL(`/api/auth/callback/google`, request.url);
  callbackUrl.searchParams.set('role', role);
  callbackUrl.searchParams.set('prompt', 'select_account');
  callbackUrl.searchParams.set('code', randomBytes(16).toString('hex'));
  return NextResponse.redirect(callbackUrl);
}
