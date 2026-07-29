'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/lib/store/hooks';
import { Loader2 } from 'lucide-react';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { token, status } = useAppSelector((s) => s.auth);

  useEffect(() => {
    if (status === 'unauthenticated' || (!token && status !== 'loading')) {
      router.replace('/login');
    }
  }, [status, token, router]);

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
