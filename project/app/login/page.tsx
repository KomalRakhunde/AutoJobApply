'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthShell } from '@/components/auth-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, AlertCircle } from 'lucide-react';
import { useLogin } from '@/lib/hooks/use-auth';
import { useAppDispatch } from '@/lib/store/hooks';
import { setCredentials } from '@/lib/store/auth-slice';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const login = useLogin();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await login.mutateAsync({
        email: form.email.trim(),
        password: form.password,
      });
      dispatch(
        setCredentials({ token: res.accessToken, user: { id: res.user.id, email: res.user.email } })
      );
      toast({ title: 'Welcome back', description: 'You are now signed in.' });
      router.push('/dashboard');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Login failed. Please try again.';
      setError(message);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to manage your job applications."
      footer={
        <>
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-medium text-primary hover:underline">
            Create one
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            required
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            autoComplete="email"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="Your password"
            required
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            autoComplete="current-password"
          />
        </div>

        {error && (
          <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <Button
          type="submit"
          className="w-full gap-2"
          disabled={login.isPending}
        >
          {login.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {login.isPending ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>
    </AuthShell>
  );
}
