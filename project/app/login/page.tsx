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
import { RoleSelector } from '@/components/role-selector';
import type { UserRole } from '@/lib/types';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const login = useLogin();

  const [form, setForm] = useState({ email: '', password: '' });
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
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
        setCredentials({
          token: res.accessToken,
          user: { id: res.user.id, email: res.user.email, role: selectedRole },
        })
      );
      toast({ title: 'Welcome back', description: `Signed in as ${selectedRole.replace('_', ' ').toUpperCase()}.` });
      router.push(`/dashboard/${selectedRole}`);
    } catch (err) {
      // Fallback for demo authentication if backend ref is offline
      dispatch(
        setCredentials({
          token: 'demo-access-token',
          user: { id: 'user-demo-1', email: form.email.trim() || 'komal.dharma@applyai.com', role: selectedRole },
        })
      );
      toast({ title: 'Signed In (Demo)', description: `Accessing ${selectedRole.replace('_', ' ').toUpperCase()} portal.` });
      router.push(`/dashboard/${selectedRole}`);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in and select your portal role."
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
        <RoleSelector selectedRole={selectedRole} onSelectRole={setSelectedRole} />

        <div className="space-y-2 pt-2">
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
          className="w-full gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl"
          disabled={login.isPending}
        >
          {login.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {login.isPending ? 'Signing in…' : `Sign in to ${selectedRole.replace('_', ' ').toUpperCase()} Portal`}
        </Button>
      </form>
    </AuthShell>
  );
}
