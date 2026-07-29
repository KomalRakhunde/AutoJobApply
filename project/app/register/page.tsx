'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthShell } from '@/components/auth-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useRegister } from '@/lib/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const register = useRegister();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirm: '',
  });
  const [error, setError] = useState<string | null>(null);

  const update = (key: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const passwordsMismatch = form.confirm.length > 0 && form.password !== form.confirm;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }

    try {
      await register.mutateAsync({
        email: form.email.trim(),
        password: form.password,
        firstName: form.firstName.trim() || undefined,
        lastName: form.lastName.trim() || undefined,
      });
      toast({
        title: 'Account created',
        description: 'Your registration was successful. Please sign in.',
      });
      router.push('/login');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Registration failed. Please try again.';
      setError(message);
    }
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Start optimizing your job applications with AI."
      footer={
        <>
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First name</Label>
            <Input
              id="firstName"
              placeholder="Jane"
              value={form.firstName}
              onChange={(e) => update('firstName', e.target.value)}
              autoComplete="given-name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last name</Label>
            <Input
              id="lastName"
              placeholder="Doe"
              value={form.lastName}
              onChange={(e) => update('lastName', e.target.value)}
              autoComplete="family-name"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            required
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            autoComplete="email"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="At least 6 characters"
            required
            value={form.password}
            onChange={(e) => update('password', e.target.value)}
            autoComplete="new-password"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm">Confirm password</Label>
          <Input
            id="confirm"
            type="password"
            placeholder="Re-enter your password"
            required
            value={form.confirm}
            onChange={(e) => update('confirm', e.target.value)}
            autoComplete="new-password"
            aria-invalid={passwordsMismatch}
          />
          {passwordsMismatch && (
            <p className="text-xs text-destructive">Passwords do not match.</p>
          )}
        </div>

        {error && (
          <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {register.isSuccess && (
          <div className="flex items-start gap-2 rounded-lg border border-success/30 bg-success/5 p-3 text-sm text-success">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            <span>Account created. Redirecting to sign in…</span>
          </div>
        )}

        <Button
          type="submit"
          className="w-full gap-2"
          disabled={register.isPending || passwordsMismatch}
        >
          {register.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {register.isPending ? 'Creating account…' : 'Create account'}
        </Button>
      </form>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        By creating an account you agree to our Terms and Privacy Policy.
      </p>
    </AuthShell>
  );
}
