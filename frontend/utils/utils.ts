import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDisplayName(user?: { firstName?: string | null; lastName?: string | null; email?: string } | null): string {
  if (user?.firstName) {
    return `${user.firstName} ${user.lastName || ''}`.trim();
  }
  if (user?.email) {
    const handle = user.email.split('@')[0];
    if (handle.toLowerCase().includes('komal')) {
      return 'Komal Rakhunde';
    }
    const cleaned = handle.replace(/[0-9]/g, '').replace(/[\._\-]/g, ' ').trim();
    if (cleaned.length > 0) {
      return cleaned
        .split(' ')
        .filter(Boolean)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');
    }
  }
  return 'Komal Rakhunde';
}

export function getUserInitials(name: string): string {
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase() || 'KR';
}

/**
 * Robust cross-browser Copy to Clipboard helper with fallback
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (typeof window !== 'undefined' && navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (err) {
    console.warn('Clipboard API failed, attempting fallback copy', err);
  }

  try {
    if (typeof document !== 'undefined') {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.left = '-999999px';
      textarea.style.top = '-999999px';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textarea);
      return successful;
    }
  } catch (err) {
    console.error('Fallback copy failed', err);
  }

  return false;
}
