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

function uint8ToBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 =
    typeof btoa === 'function'
      ? btoa(binary)
      : Buffer.from(bytes).toString('base64');
  return base64.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function rightRotate(n: number, b: number): number {
  return (n >>> b) | (n << (32 - b));
}

function sha256Bytes(ascii: Uint8Array<any>): Uint8Array {
  const K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
  ];

  let H = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
  ];

  const l = ascii.length;
  const bitLen = l * 8;
  const k = (448 - ((l * 8 + 8) % 512) + 512) % 512;
  const paddedLen = l + 1 + k / 8 + 8;
  const msg = new Uint8Array(paddedLen);
  msg.set(ascii, 0);
  msg[l] = 0x80;

  const view = new DataView(msg.buffer);
  view.setUint32(paddedLen - 4, bitLen & 0xffffffff, false);
  const highBits = Math.floor(bitLen / 0x100000000);
  view.setUint32(paddedLen - 8, highBits, false);

  const W = new Int32Array(64);
  for (let i = 0; i < paddedLen; i += 64) {
    for (let t = 0; t < 16; t++) {
      W[t] = view.getUint32(i + t * 4, false);
    }
    for (let t = 16; t < 64; t++) {
      const s0 = rightRotate(W[t - 15], 7) ^ rightRotate(W[t - 15], 18) ^ (W[t - 15] >>> 3);
      const s1 = rightRotate(W[t - 2], 17) ^ rightRotate(W[t - 2], 19) ^ (W[t - 2] >>> 10);
      W[t] = (W[t - 16] + s0 + W[t - 7] + s1) | 0;
    }

    let a = H[0], b = H[1], c = H[2], d = H[3], e = H[4], f = H[5], g = H[6], h = H[7];

    for (let t = 0; t < 64; t++) {
      const S1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
      const ch = (e & f) ^ (~e & g);
      const temp1 = (h + S1 + ch + K[t] + W[t]) | 0;
      const S0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (S0 + maj) | 0;

      h = g;
      g = f;
      f = e;
      e = (d + temp1) | 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) | 0;
    }

    H[0] = (H[0] + a) | 0;
    H[1] = (H[1] + b) | 0;
    H[2] = (H[2] + c) | 0;
    H[3] = (H[3] + d) | 0;
    H[4] = (H[4] + e) | 0;
    H[5] = (H[5] + f) | 0;
    H[6] = (H[6] + g) | 0;
    H[7] = (H[7] + h) | 0;
  }

  const out = new Uint8Array(32);
  const outView = new DataView(out.buffer);
  for (let i = 0; i < 8; i++) {
    outView.setUint32(i * 4, H[i], false);
  }
  return out;
}

function hmacSha256(keyStr: string, msgStr: string): Uint8Array {
  const encoder = new TextEncoder();
  let key: Uint8Array<any> = encoder.encode(keyStr);
  const msg = encoder.encode(msgStr);

  if (key.length > 64) {
    key = sha256Bytes(key);
  }

  const paddedKey = new Uint8Array(64);
  paddedKey.set(key, 0);

  const ipad = new Uint8Array(64);
  const opad = new Uint8Array(64);
  for (let i = 0; i < 64; i++) {
    ipad[i] = paddedKey[i] ^ 0x36;
    opad[i] = paddedKey[i] ^ 0x5c;
  }

  const innerPadded = new Uint8Array(64 + msg.length);
  innerPadded.set(ipad, 0);
  innerPadded.set(msg, 64);
  const innerHash = sha256Bytes(innerPadded);

  const outerPadded = new Uint8Array(64 + 32);
  outerPadded.set(opad, 0);
  outerPadded.set(innerHash, 64);
  return sha256Bytes(outerPadded);
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
    try {
      const signature = crypto
        .createHmac('sha256', secret)
        .update(data)
        .digest('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
      return `${data}.${signature}`;
    } catch {
      // Fallback to JS HMAC
    }
  }

  const hmacBytes = hmacSha256(secret, data);
  const signature = uint8ToBase64Url(hmacBytes);
  return `${data}.${signature}`;
}

