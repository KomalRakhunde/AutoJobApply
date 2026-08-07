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
  const redirectUri = `${origin}/api/auth/callback/microsoft`;
  const msClientId = process.env.MICROSOFT_CLIENT_ID;

  if (msClientId) {
    const scope = encodeURIComponent('openid profile email User.Read');
    const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${msClientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&state=${encodeURIComponent(role)}&prompt=select_account`;
    return NextResponse.redirect(authUrl);
  }

  const callbackUrl = new URL(`/api/auth/callback/microsoft`, request.url);
  callbackUrl.searchParams.set('role', role);
  callbackUrl.searchParams.set('prompt', 'select_account');
  callbackUrl.searchParams.set('code', randomBytes(16).toString('hex'));
  return NextResponse.redirect(callbackUrl);
}
