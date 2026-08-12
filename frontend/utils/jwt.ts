import crypto from 'crypto';

function base64UrlEncode(str: string): string {
  if (typeof window !== 'undefined' && typeof btoa === 'function') {
    return btoa(
      encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) =>
        String.fromCharCode(parseInt(p1, 16))
      )
    )
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  }
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

export function generateValidJwt(payload: {
  userId: string;
  email: string;
  role: string;
  [key: string]: any;
}): string {
  const secret = process.env.JWT_SECRET || 'your_super_secret_jwt_key_min_32_chars';
  const header = { alg: 'HS256', typ: 'JWT' };

  const now = Math.floor(Date.now() / 1000);
  const fullPayload = {
    sub: payload.userId,
    iat: now,
    exp: now + 7 * 24 * 60 * 60, // 7 days
    ...payload,
    role: payload.role || 'student',
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload));
  const data = `${encodedHeader}.${encodedPayload}`;

  if (typeof window === 'undefined' && crypto && crypto.createHmac) {
    const signature = crypto
      .createHmac('sha256', secret)
      .update(data)
      .digest('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
    return `${data}.${signature}`;
  }

  // Fallback signature calculation for client browser if crypto is unavailable
  const fallbackSignature = base64UrlEncode(`sig_${secret}_${data}`).substring(0, 32);
  return `${data}.${fallbackSignature}`;
}
