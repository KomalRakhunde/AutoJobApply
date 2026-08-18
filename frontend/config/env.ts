/**
 * Centralized Production Environment Configuration & Variable Provider
 * Provides typed, safe access to application environment variables with dynamic runtime fallbacks.
 */

function getAppUrl(): string {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return 'http://localhost:3000';
}

export const envConfig = {
  /** Public Application Host URL */
  NEXT_PUBLIC_APP_URL: getAppUrl(),

  /** Backend API Base URL */
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',


  /** OpenRouter LLM API Key */
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY || '',

  /** Groq LLM API Key */
  GROQ_API_KEY: process.env.GROQ_API_KEY || '',

  /** Gmail / SMTP User Email Address */
  GMAIL_USER: process.env.GMAIL_USER || process.env.SMTP_USER || process.env.EMAIL_USER || '',

  /** Gmail / SMTP Password or App Password */
  GMAIL_PASS: process.env.GMAIL_PASS || process.env.SMTP_PASS || process.env.EMAIL_PASS || '',

  /** SMTP Host Server */
  SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',

  /** SMTP Server Port */
  SMTP_PORT: Number(process.env.SMTP_PORT) || 587,

  /** JWT Secret Key for Token Signatures */
  JWT_SECRET: process.env.JWT_SECRET || 'your_super_secret_jwt_key_min_32_chars',
} as const;

/**
 * Validates critical environment variables at startup in non-browser environments.
 */
export function validateProductionEnv(): { valid: boolean; missing: string[] } {
  if (typeof window !== 'undefined') return { valid: true, missing: [] };

  const requiredInProduction = [
    'DATABASE_URL',
  ];

  const missing = requiredInProduction.filter((key) => !process.env[key]);
  return {
    valid: missing.length === 0,
    missing,
  };
}
