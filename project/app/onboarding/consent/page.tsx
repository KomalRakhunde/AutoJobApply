'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Sparkles,
  ShieldCheck,
  FileText,
  UserCheck,
  Loader2,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAppDispatch } from '@/lib/store/hooks';
import { setCredentials } from '@/lib/store/auth-slice';
import type { UserRole } from '@/lib/types';

const ROLES_LIST: { id: UserRole; label: string }[] = [
  { id: 'student', label: 'Student Portal' },
  { id: 'recruiter', label: 'Recruiter Portal' },
  { id: 'admin', label: 'Admin Portal' },
  { id: 'super_admin', label: 'Super Admin Portal' },
];

export default function OnboardingConsentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  const queryRole = (searchParams?.get('role') as UserRole) || 'student';
  const provider = searchParams?.get('provider') || 'google';
  const email = searchParams?.get('email') || '';

  const [confirmedRole, setConfirmedRole] = useState<UserRole>(queryRole);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [agreeDataParsing, setAgreeDataParsing] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmitConsent = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!agreeTerms) {
      setError('You must accept the Terms of Service & Privacy Policy to proceed.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/auth/consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: confirmedRole,
          termsAccepted: agreeTerms,
          dataPermission: agreeDataParsing,
          email,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Consent registration failed.');
      }

      const userRole = confirmedRole;
      const token = `auth-token-${Date.now()}`;

      document.cookie = `applyai_token=${token}; path=/; max-age=604800; SameSite=Lax`;
      document.cookie = `applyai_role=${userRole}; path=/; max-age=604800; SameSite=Lax`;

      dispatch(
        setCredentials({
          token,
          user: {
            id: `user-oauth-${Date.now()}`,
            email: email || `${userRole}@applyai.com`,
            role: userRole,
          },
        })
      );

      toast({
        title: 'Consent Registered Successfully',
        description: `Welcome to ApplyAI! Accessing ${userRole.toUpperCase()} dashboard…`,
      });

      const targetPath = userRole === 'super_admin' ? '/dashboard/super-admin' : `/dashboard/${userRole}`;
      router.push(targetPath);
    } catch (err: any) {
      setError(err.message || 'An error occurred during consent verification.');
      toast({
        title: 'Verification Failed',
        description: err.message || 'Please retry submitting consent.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 py-8 relative overflow-hidden font-sans selection:bg-indigo-600 selection:text-white">
      {/* Background Glow Elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* HEADER BAR BRANDING */}
      <header className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center max-w-7xl mx-auto w-full z-10">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-500/25">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="text-xl font-black tracking-tight text-white">
            Apply<span className="text-indigo-400">AI</span>
          </span>
        </Link>
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>OAuth Verification Flow</span>
        </div>
      </header>

      {/* CONSENT MODAL CONTAINER */}
      <div className="w-full max-w-lg bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6 relative z-20 my-12">
        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-indigo-600/20 border border-indigo-500/30 rounded-2xl flex items-center justify-center mx-auto text-indigo-400">
            <FileText className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Terms & Data Access Consent
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            Welcome! You authenticated via <span className="text-indigo-300 font-bold capitalize">{provider}</span>.
            Please review and confirm your access permissions before entering the ApplyAI network.
          </p>
        </div>

        {/* Consent Form */}
        <form onSubmit={handleSubmitConsent} className="space-y-5">
          {/* Mandatory Role Confirmation Dropdown */}
          <div className="space-y-1.5">
            <Label htmlFor="role-select" className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <UserCheck className="h-3.5 w-3.5 text-indigo-400" />
              <span>Confirm Your Portal Access Role</span>
            </Label>
            <select
              id="role-select"
              value={confirmedRole}
              onChange={(e) => setConfirmedRole(e.target.value as UserRole)}
              className="w-full h-11 px-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-white focus:outline-none focus:border-indigo-500 transition-colors"
            >
              {ROLES_LIST.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label} Portal
                </option>
              ))}
            </select>
          </div>

          {/* Consent Checkboxes */}
          <div className="space-y-3.5 bg-slate-950/70 p-4 rounded-2xl border border-slate-800/80">
            {/* Checkbox 1: Terms of Service */}
            <div className="flex items-start gap-3">
              <Checkbox
                id="consent-terms"
                checked={agreeTerms}
                onCheckedChange={(c) => setAgreeTerms(!!c)}
                className="mt-0.5 rounded-md border-slate-700 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
              />
              <label htmlFor="consent-terms" className="text-xs text-slate-300 leading-normal cursor-pointer select-none">
                I agree to the{' '}
                <Link href="/#features" className="text-indigo-400 font-bold hover:underline">
                  ApplyAI Terms of Service
                </Link>{' '}
                &amp;{' '}
                <Link href="/#features" className="text-indigo-400 font-bold hover:underline">
                  Privacy Policy
                </Link>.
              </label>
            </div>

            {/* Checkbox 2: Profile Data Parsing Permission */}
            <div className="flex items-start gap-3">
              <Checkbox
                id="consent-parsing"
                checked={agreeDataParsing}
                onCheckedChange={(c) => setAgreeDataParsing(!!c)}
                className="mt-0.5 rounded-md border-slate-700 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
              />
              <label htmlFor="consent-parsing" className="text-xs text-slate-300 leading-normal cursor-pointer select-none">
                I grant permission to parse my profile data for job applications &amp; AI ATS matching.
              </label>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="flex items-start gap-2.5 rounded-xl border border-rose-500/30 bg-rose-950/40 p-3 text-xs text-rose-300 font-medium">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Action Button */}
          <Button
            type="submit"
            disabled={isSubmitting || !agreeTerms}
            className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl shadow-lg shadow-indigo-500/25 text-xs transition-all gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Recording Consent…</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Accept &amp; Continue to Dashboard</span>
                <ArrowRight className="h-4 w-4 ml-auto" />
              </>
            )}
          </Button>
        </form>

        {/* Footer info */}
        <p className="text-[11px] text-center text-slate-500 font-medium">
          Protected by Enterprise 256-bit AES SSL Encryption
        </p>
      </div>
    </div>
  );
}
