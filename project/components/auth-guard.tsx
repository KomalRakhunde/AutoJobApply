'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppSelector } from '@/lib/store/hooks';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const { token, status, user } = useAppSelector((s) => s.auth);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && (status === 'unauthenticated' || (!token && status !== 'loading'))) {
      router.replace('/login');
      return;
    }

    // Mandatory Profile Completion Guard ONLY for newly registered accounts
    if (mounted && token && user && pathname !== '/profile') {
      const isNewUser = localStorage.getItem(`is_new_user_${user.id}`);
      const isComplete = localStorage.getItem(`profile_complete_${user.id}`);
      
      // Only enforce mandatory setup if explicitly flagged as a new user registration
      if (isNewUser === 'true' && isComplete === 'false') {
        toast({
          title: '⚠️ Mandatory Profile Setup Required',
          description: 'Please complete your new account profile details before accessing dashboard features.',
          variant: 'destructive',
        });
        router.replace('/profile?mandatory=true');
      }
    }
  }, [mounted, status, token, user, pathname, router, toast]);

  if (!mounted || !token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
