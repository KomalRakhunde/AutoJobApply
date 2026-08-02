'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sparkles,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useResetPassword } from '@/lib/hooks/use-auth';
import { PasswordMeter, isPasswordValid } from '@/components/password-meter';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const resetPassword = useResetPassword();

  const token = searchParams?.get('token') || '';
  const email = searchParams?.get('email') || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!token || !email) {
      setError('Invalid or missing password reset token. Please request a new link.');
    }
  }, [token, email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token || !email) {
      setError('Missing reset token. Please re-open the link from your email.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match. Please verify your entry.');
      return;
    }

    if (!isPasswordValid(newPassword)) {
      setError(
        'Password must contain min 8 characters, A-Z, a-z, 0-9, & special symbol (@$!%*?&).'
      );
      return;
    }

    try {
      const res = await resetPassword.mutateAsync({
        token,
        email,
        newPassword,
      });

      setIsSuccess(true);
      toast({
        title: 'Security Key Updated',
        description: res.message || 'Your password has been successfully reset.',
      });
    } catch (err: any) {
      const errorMsg =
        (typeof err?.message === 'string' && err.message) ||
        (err?.data && typeof err.data === 'object' && err.data.message) ||
        'Failed to reset password. The link may have expired.';

      setError(errorMsg);
      toast({
        title: 'Reset Failed',
        description: errorMsg,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-[#07090e] text-slate-900 dark:text-slate-100 flex flex-col justify-between font-sans selection:bg-indigo-600 selection:text-white">
      {/* HEADER BAR */}
      <header className="w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-6 py-3 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold shadow-md shadow-indigo-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
              Apply<span className="text-indigo-600 dark:text-indigo-400">AI</span>
            </span>
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>256-bit AES Token Guard</span>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 w-full max-w-md mx-auto px-4 py-8 flex flex-col justify-center items-center">
        <div className="w-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
          {/* Title Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-indigo-600/10 dark:bg-indigo-600/20 border border-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto text-indigo-600 dark:text-indigo-400 shadow-md">
              <Lock className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Set New Security Key
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Updating security key for <span className="font-bold text-slate-700 dark:text-slate-300">{email || 'your account'}</span>.
            </p>
          </div>

          {isSuccess ? (
            <div className="space-y-4 text-center bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 rounded-2xl p-5 text-xs text-emerald-800 dark:text-emerald-300">
              <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto" />
              <div className="space-y-1">
                <h3 className="font-bold text-sm">Security Key Updated!</h3>
                <p className="text-xs opacity-90">
                  Your password has been changed successfully. You can now log into your ApplyAI portal.
                </p>
              </div>
              <Button
                onClick={() => router.push('/login')}
                className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-md text-xs transition-all gap-1.5 mt-2"
              >
                <span>Proceed to Sign In</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              {/* New Security Key */}
              <div className="space-y-1.5">
                <Label htmlFor="newPassword" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  New Security Key
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pl-10 pr-10 rounded-xl h-11 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-xs focus:border-indigo-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <PasswordMeter password={newPassword} />
              </div>

              {/* Confirm New Security Key */}
              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Confirm New Security Key
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 rounded-xl h-11 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-xs focus:border-indigo-600"
                  />
                </div>
              </div>

              {/* Error Banner */}
              {error && (
                <div className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 dark:border-rose-900/50 dark:bg-rose-950/40 p-3 text-xs text-rose-600 dark:text-rose-400 font-medium">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-500" />
                  <span>{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={resetPassword.isPending || !token || !email}
                className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl shadow-md text-xs transition-all gap-2"
              >
                {resetPassword.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Updating Security Key…</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4" />
                    <span>Update Security Key</span>
                  </>
                )}
              </Button>
            </form>
          )}

          <p className="text-[11px] text-center text-slate-500 font-medium pt-2 border-t border-slate-100 dark:border-slate-800/80">
            Remembered your credentials?{' '}
            <Link href="/login" className="text-indigo-600 dark:text-indigo-400 font-extrabold hover:underline">
              Back to Sign In
            </Link>
          </p>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="w-full border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 py-3 px-6 text-[10.5px] text-slate-500 text-center">
        ApplyAI Security Governance System © 2026. All rights reserved.
      </footer>
    </div>
  );
}
