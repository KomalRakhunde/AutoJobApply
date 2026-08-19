import { BadRequestException } from '@nestjs/common';
import { promises as dns } from 'dns';
import { isIP } from 'net';

const BLOCKED_HOSTNAMES = new Set(['localhost', 'localhost.localdomain', 'metadata.google.internal']);

function isPrivateIPv4(ip: string): boolean {
  const parts = ip.split('.').map(Number);
  if (parts.length !== 4 || parts.some((n) => Number.isNaN(n))) return true;
  const [a, b] = parts;
  if (a === 0) return true;
  if (a === 10) return true; // 10.0.0.0/8
  if (a === 127) return true; // loopback
  if (a === 169 && b === 254) return true; // link-local, incl. cloud metadata 169.254.169.254
  if (a === 172 && b >= 16 && b <= 31) return true; // 172.16.0.0/12
  if (a === 192 && b === 168) return true; // 192.168.0.0/16
  if (a === 100 && b >= 64 && b <= 127) return true; // 100.64.0.0/10 (CGNAT)
  if (a >= 224) return true; // multicast/reserved
  return false;
}

function isPrivateIPv6(ip: string): boolean {
  const lower = ip.toLowerCase();
  if (lower === '::1' || lower === '::') return true; // loopback / unspecified
  if (lower.startsWith('fe80:') || lower.startsWith('fec0:')) return true; // link-local
  if (/^f[cd][0-9a-f]{2}:/.test(lower)) return true; // unique local fc00::/7
  if (lower.startsWith('::ffff:')) {
    const embedded = lower.split(':').pop() || '';
    if (isIP(embedded) === 4) return isPrivateIPv4(embedded);
  }
  return false;
}

/**
 * Blocks server-side-request-forgery: rejects any user-supplied URL that
 * is not a plain public http(s) address, including ones that only resolve
 * to a private/internal/link-local address (e.g. cloud metadata endpoints).
 */
export async function assertPublicHttpUrl(rawUrl: string): Promise<URL> {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    throw new BadRequestException('Invalid URL');
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new BadRequestException('Only http(s) URLs are allowed');
  }

  const hostname = url.hostname.toLowerCase();
  if (
    BLOCKED_HOSTNAMES.has(hostname) ||
    hostname.endsWith('.local') ||
    hostname.endsWith('.internal')
  ) {
    throw new BadRequestException('This URL is not allowed');
  }

  const ipVersion = isIP(hostname);
  if (ipVersion === 4 && isPrivateIPv4(hostname)) {
    throw new BadRequestException('This URL points to a private network address and is not allowed');
  }
  if (ipVersion === 6 && isPrivateIPv6(hostname)) {
    throw new BadRequestException('This URL points to a private network address and is not allowed');
  }

  if (!ipVersion) {
    let records: { address: string; family: number }[];
    try {
      records = await dns.lookup(hostname, { all: true });
    } catch {
      throw new BadRequestException(`Could not resolve hostname: ${hostname}`);
    }
    for (const record of records) {
      if (record.family === 4 && isPrivateIPv4(record.address)) {
        throw new BadRequestException('This URL resolves to a private network address and is not allowed');
      }
      if (record.family === 6 && isPrivateIPv6(record.address)) {
        throw new BadRequestException('This URL resolves to a private network address and is not allowed');
      }
    }
  }

  return url;
}
