'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sparkles,
  Mail,
  ShieldCheck,
  RefreshCw,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  KeyRound,
  Lock,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useForgotPassword } from '@/lib/hooks/use-auth';

function generateCaptcha() {
  const num1 = Math.floor(Math.random() * 8) + 2;
  const num2 = Math.floor(Math.random() * 8) + 1;
  return { num1, num2, answer: (num1 + num2).toString() };
}

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const forgotPassword = useForgotPassword();

  const [email, setEmail] = useState('');
  const [captcha, setCaptcha] = useState({ num1: 5, num2: 3, answer: '8' });
  const [userCaptcha, setUserCaptcha] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successResult, setSuccessResult] = useState<{ message: string; resetUrl?: string } | null>(null);

  useEffect(() => {
    setCaptcha(generateCaptcha());
  }, []);

  const handleRefreshCaptcha = () => {
    setCaptcha(generateCaptcha());
    setUserCaptcha('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessResult(null);

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setError('Please enter your work email address.');
      return;
    }

    if (userCaptcha.trim() !== captcha.answer) {
      setError('Incorrect CAPTCHA answer. Please solve the security math challenge.');
      handleRefreshCaptcha();
      return;
    }

    try {
      const res = await forgotPassword.mutateAsync({
        email: cleanEmail,
        captchaToken: userCaptcha,
      });

      setSuccessResult({
        message: res.message,
        resetUrl: res.resetUrl,
      });

      toast({
        title: 'Reset Link Dispatched',
        description: 'Password reset link sent to your email address.',
      });
    } catch (err: any) {
      const errorMsg =
        (typeof err?.message === 'string' && err.message) ||
        (err?.data && typeof err.data === 'object' && err.data.message) ||
        'Failed to request password reset. Please try again.';

      setError(errorMsg);
      toast({
        title: 'Request Failed',
        description: errorMsg,
        variant: 'destructive',
      });
      handleRefreshCaptcha();
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

          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" className="text-xs font-bold gap-1 text-slate-600 dark:text-slate-300" asChild>
              <Link href="/login">
                <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 w-full max-w-md mx-auto px-4 py-8 flex flex-col justify-center items-center">
        <div className="w-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
          {/* Header Icon & Text */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-indigo-600/10 dark:bg-indigo-600/20 border border-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto text-indigo-600 dark:text-indigo-400 shadow-md">
              <KeyRound className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Forgot Security Key?
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Enter your work email address and complete the security verification challenge to receive a password reset link.
            </p>
          </div>

          {/* Success Banner */}
          {successResult ? (
            <div className="space-y-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 rounded-2xl p-4 text-xs text-emerald-800 dark:text-emerald-300">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold">{successResult.message}</p>
                  <p className="text-[11px] opacity-90">
                    If an account matches <span className="font-semibold">{email}</span>, a 15-minute single-use reset link has been dispatched.
                  </p>
                </div>
              </div>

              {/* Direct Dev Link helper for testing */}
              {successResult.resetUrl && (
                <div className="pt-2 border-t border-emerald-200 dark:border-emerald-800/60 space-y-1.5">
                  <span className="text-[10.5px] uppercase font-bold text-emerald-700 dark:text-emerald-400 tracking-wider">
                    Quick Reset Action Link:
                  </span>
                  <Link
                    href={successResult.resetUrl}
                    className="block bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold p-2.5 rounded-xl text-center transition-all text-xs shadow-sm"
                  >
                    Open Password Reset Page →
                  </Link>
                </div>
              )}
            </div>
          ) : (
            /* Form Area */
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              {/* Work Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Work Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 rounded-xl h-11 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-xs focus:border-indigo-600"
                  />
                </div>
              </div>

              {/* CAPTCHA Anti-Bot Security Challenge */}
              <div className="space-y-1.5 bg-slate-100 dark:bg-slate-950 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <Label htmlFor="captcha" className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>Security CAPTCHA Challenge</span>
                  </Label>
                  <button
                    type="button"
                    onClick={handleRefreshCaptcha}
                    className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-bold"
                  >
                    <RefreshCw className="h-3 w-3" /> Refresh
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 items-center pt-1">
                  <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl h-10 flex items-center justify-center font-mono font-black text-sm text-indigo-600 dark:text-indigo-400 select-none shadow-xs">
                    {captcha.num1} + {captcha.num2} = ?
                  </div>
                  <Input
                    id="captcha"
                    type="number"
                    placeholder="Answer"
                    required
                    value={userCaptcha}
                    onChange={(e) => setUserCaptcha(e.target.value)}
                    className="rounded-xl h-10 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-xs font-bold text-center"
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
                disabled={forgotPassword.isPending}
                className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl shadow-md text-xs transition-all gap-2"
              >
                {forgotPassword.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Verifying &amp; Dispatching…</span>
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    <span>Send Reset Instructions</span>
                  </>
                )}
              </Button>
            </form>
          )}

          {/* Footer note */}
          <p className="text-[11px] text-center text-slate-500 font-medium pt-2 border-t border-slate-100 dark:border-slate-800/80">
            Protected by Rate-Limiting &amp; 256-bit Audit Security
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
