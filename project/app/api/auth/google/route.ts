import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const role = searchParams.get('role') || 'student';
  
  // Real OAuth Google Client Authorization URL (or simulated for dev/demo)
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/api/auth/callback/google`;
  
  if (googleClientId) {
    const scope = encodeURIComponent('openid email profile');
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${googleClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&state=${encodeURIComponent(role)}`;
    return NextResponse.redirect(authUrl);
  }

  // Direct Callback fallback with role bound in state/query
  const callbackUrl = new URL(`/api/auth/callback/google`, request.url);
  callbackUrl.searchParams.set('role', role);
  callbackUrl.searchParams.set('code', `mock-google-code-${Date.now()}`);
  return NextResponse.redirect(callbackUrl);
}
