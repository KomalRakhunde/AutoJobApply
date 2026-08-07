'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, Sparkles } from 'lucide-react';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const role = (searchParams?.get('role') || 'student').toLowerCase();
    const provider = searchParams?.get('provider') || 'google';
    const isNewUser = searchParams?.get('isNewUser') === 'true';
    const acceptedTerms = searchParams?.get('acceptedTermsAt');

    if (role === 'admin' || role === 'super_admin' || role === 'superadmin') {
      router.push('/login?error=Admin+and+Super+Admin+accounts+require+2FA+validation');
      return;
    }

    if (isNewUser || !acceptedTerms) {
      router.push(`/onboarding/consent?role=${role}&provider=${provider}`);
    } else {
      const targetPortal = role === 'super_admin' ? '/dashboard/super-admin' : `/dashboard/${role}`;
      router.push(targetPortal);
    }
  }, [router, searchParams]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-950 text-white">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 animate-bounce">
          <Sparkles className="h-6 w-6 text-white" />
        </div>
        <div className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin text-indigo-400" />
          <span className="text-sm font-semibold tracking-wide text-slate-300">
            Verifying Authentication & Access Permissions…
          </span>
        </div>
      </div>
    </div>
  );
}
