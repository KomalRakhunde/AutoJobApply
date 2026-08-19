'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Loader2,
  AlertCircle,
  Sparkles,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Menu,
  X,
  UserCheck,
  Zap,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { useRegister } from '@/hooks/use-auth';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials } from '@/store/auth-slice';
import { useToast } from '@/hooks/use-toast';
import { PasswordMeter, isPasswordValid } from '@/components/common/password-meter';
import type { UserRole } from '@/types/types';

const ROLES_LIST: { id: UserRole; label: string }[] = [
  { id: 'student', label: 'Student' },
  { id: 'recruiter', label: 'Recruiter' },
  { id: 'admin', label: 'Admin' },
  { id: 'super_admin', label: 'Super Admin' },
];

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const register = useRegister();

  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [oauthLoading, setOauthLoading] = useState<'google' | 'linkedin' | 'microsoft' | null>(null);

  useEffect(() => {
    const errorParam = searchParams?.get('error');
    if (errorParam) {
      setError(errorParam);
      toast({
        title: 'Authentication Notice',
        description: errorParam,
        variant: 'destructive',
      });
    }
  }, [searchParams, toast]);

  const update = (key: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleOAuthLogin = (provider: 'google' | 'linkedin' | 'microsoft') => {
    setError(null);
    if (selectedRole === 'admin' || selectedRole === 'super_admin') {
      const msg = 'Admin and Super Admin accounts require 2FA / Security Key validation and cannot be auto-provisioned via social login.';
      setError(msg);
      toast({
        title: 'Social Auth Restricted',
        description: msg,
        variant: 'destructive',
      });
      return;
    }

    setOauthLoading(provider);

    // Purge stale session tokens and cookies prior to initiating OAuth registration flow
    document.cookie = 'applyai_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
    document.cookie = 'applyai_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';

    toast({
      title: `${provider.toUpperCase()} OAuth Initialized`,
      description: `Creating ${selectedRole.replace('_', ' ').toUpperCase()} account...`,
    });

    window.location.href = `/api/auth/${provider}?role=${selectedRole}&prompt=select_account`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!acceptedTerms) {
      setError('You must accept the Terms of Service and Privacy Policy to register.');
      return;
    }
    if (!isPasswordValid(form.password)) {
      setError(
        'Password must contain min 8 characters, A-Z, a-z, 0-9, & special symbol.'
      );
      return;
    }

    const nameParts = form.fullName.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || undefined;

    try {
      const res = await register.mutateAsync({
        email: form.email.trim(),
        password: form.password,
        firstName: firstName || undefined,
        lastName: lastName,
        role: selectedRole,
      });

      const userRole: UserRole = (res.user?.role || selectedRole).toLowerCase() as UserRole;
      const token = res.accessToken || res.token;
      if (!token) {
        throw new Error('Server did not return an authentication token.');
      }

      document.cookie = `applyai_token=${token}; path=/; max-age=604800; SameSite=Lax`;
      document.cookie = `applyai_role=${userRole}; path=/; max-age=604800; SameSite=Lax`;

      // Flag newly created user account for mandatory profile setup
      localStorage.setItem(`is_new_user_${res.user.id}`, 'true');
      localStorage.setItem(`profile_complete_${res.user.id}`, 'false');

      dispatch(
        setCredentials({
          token,
          user: {
            id: res.user.id,
            email: res.user.email,
            role: userRole,
          },
        })
      );

      toast({
        title: 'Account Created Successfully!',
        description: `Welcome to ApplyAI. Redirecting to ${userRole.replace('_', ' ')} portal…`,
      });

      const targetPath = userRole === 'super_admin' ? '/dashboard/super-admin' : `/dashboard/${userRole}`;
      router.push(targetPath);
      return;
    } catch (err: any) {
      const errMsg =
        (typeof err?.data === 'object' && err?.data?.message) ||
        (typeof err?.data === 'string' && err?.data) ||
        err?.message ||
        '';

      const isAlreadyExists =
        err?.status === 409 ||
        (typeof errMsg === 'string' && errMsg.toLowerCase().includes('already exists'));

      if (isAlreadyExists) {
        const errorMsg =
          typeof errMsg === 'string' && errMsg.length > 5
            ? errMsg
            : 'An account with this email address already exists. Please sign in or use a different email.';
        setError(errorMsg);
        toast({
          title: 'Account Already Exists',
          description: errorMsg,
          variant: 'destructive',
        });
        return;
      }

      const displayMsg =
        typeof errMsg === 'string' && errMsg
          ? errMsg
          : 'Registration failed. Please try again.';
      setError(displayMsg);
      toast({
        title: 'Registration Failed',
        description: displayMsg,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-slate-50 dark:bg-[#07090e] text-slate-900 dark:text-slate-100 flex flex-col justify-between font-sans selection:bg-indigo-600 selection:text-white">
      
      {/* HEADER BAR (MOBILE & DESKTOP SAFE) */}
      <header className="w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-3 sm:px-6 py-3 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold shadow-md shadow-indigo-500/20">
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <span className="text-base sm:text-xl font-black tracking-tight text-slate-900 dark:text-white">
              Apply<span className="text-indigo-600 dark:text-indigo-400">AI</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-600 dark:text-slate-400">
            <Link href="/pricing" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Plans & Pricing</Link>
            <Link href="/contact" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Contact Details</Link>
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <span className="text-xs text-slate-500 hidden md:inline-block font-medium">Already registered?</span>
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 sm:px-4 h-8 sm:h-9 rounded-xl shadow-md" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden pt-2 pb-2 px-2 border-t border-slate-200/80 dark:border-slate-800 mt-2 space-y-1 bg-white dark:bg-slate-900 rounded-xl shadow-lg">
            <Link
              href="/pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-xs font-bold rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Plans & Pricing
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-xs font-bold rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Contact Details
            </Link>
          </div>
        )}
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 flex items-center justify-center overflow-x-hidden">
        <div className="w-full grid lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          
          {/* DESKTOP BRAND SIDEBAR (Hidden on Mobile/Tablet) */}
          <div className="hidden lg:flex lg:col-span-5 flex-col justify-between bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white rounded-3xl p-8 border border-indigo-500/20 shadow-2xl relative overflow-hidden min-h-[600px]">
            <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
            
            <div className="space-y-6 relative z-10">
              <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/30 px-3 py-1.5 rounded-full text-xs font-bold text-indigo-300">
                <Zap className="h-3.5 w-3.5 text-amber-400" /> Join Next-Gen Hiring Network
              </div>

              <h2 className="text-3xl font-black tracking-tight leading-tight">
                Unlock AI Autonomous Tools Tailored to Your Role
              </h2>

              <p className="text-xs text-indigo-200/80 leading-relaxed">
                Create your account identity to experience AI ATS optimization, multi-round interview prep, automated sourcing, or platform governance.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  'Student Portal: ATS Scoring, AI Cover Letters & Interview Prep',
                  'Recruiter Suite: Vector Sourcing, Bulk Resumes & Offer Letters',
                  'Admin & Operations: Team Analytics & System Configuration',
                  'Super Admin: Security Audit Logs & Governance Controls',
                ].map((feature, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-indigo-100 font-medium">
                    <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10 border-t border-indigo-800/60 pt-4 mt-6 flex items-center justify-between text-xs text-indigo-300/70">
              <span className="flex items-center gap-1.5 font-mono">
                <ShieldCheck className="h-4 w-4 text-emerald-400" /> SSL Encrypted
              </span>
              <span>ApplyAI Enterprise</span>
            </div>
          </div>

          {/* RESPONSIVE AUTH CARD CONTAINER (COMPACT SAFE BOUNDS FOR ALL MOBILE SCREEN SIZES) */}
          <div className="w-full lg:col-span-7 flex justify-center">
            <div className="w-full max-w-[100%] sm:max-w-md bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-xl space-y-4 overflow-hidden">
              
              {/* Header Badge & Title */}
              <div className="text-center space-y-1">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-600 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto shadow-md shadow-indigo-500/25">
                  <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Join the Network
                </h1>
                <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                  Select your role to create your account identity.
                </p>
              </div>

              {/* RESPONSIVE ROLE SELECTOR GRID */}
              <div className="space-y-1.5 text-left">
                <Label className="text-[11px] sm:text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <UserCheck className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>Select Account Registration Role</span>
                </Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200/80 dark:border-slate-800">
                  {ROLES_LIST.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setSelectedRole(r.id)}
                      className={`py-2 px-1 rounded-lg transition-all text-[11px] sm:text-xs font-bold truncate text-center ${
                        selectedRole === r.id
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <span className="truncate block w-full">{r.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* AUTH REGISTRATION FORM */}
              <form onSubmit={handleSubmit} className="space-y-3 text-left">
                {/* Full Name */}
                <div className="space-y-1">
                  <Label htmlFor="fullName" className="text-[11px] sm:text-xs font-bold text-slate-700 dark:text-slate-300">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="e.g. Kiran Sharma"
                      required
                      value={form.fullName}
                      onChange={(e) => update('fullName', e.target.value)}
                      autoComplete="name"
                      className="pl-9 rounded-xl h-10 min-h-[40px] bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-indigo-600"
                    />
                  </div>
                </div>

                {/* Work Email */}
                <div className="space-y-1">
                  <Label htmlFor="email" className="text-[11px] sm:text-xs font-bold text-slate-700 dark:text-slate-300">
                    Work Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="kiran@example.com"
                      required
                      value={form.email}
                      onChange={(e) => update('email', e.target.value)}
                      autoComplete="email"
                      className="pl-9 rounded-xl h-10 min-h-[40px] bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-indigo-600"
                    />
                  </div>
                </div>

                {/* Password Input & Password Meter */}
                <div className="space-y-1">
                  <Label htmlFor="password" className="text-[11px] sm:text-xs font-bold text-slate-700 dark:text-slate-300">
                    Security Key
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      required
                      value={form.password}
                      onChange={(e) => update('password', e.target.value)}
                      autoComplete="new-password"
                      className="pl-9 pr-9 rounded-xl h-10 min-h-[40px] bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-indigo-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <PasswordMeter password={form.password} />
                </div>

                {/* Terms Acceptance */}
                <div className="flex items-start gap-2 pt-0.5">
                  <Checkbox
                    id="terms"
                    checked={acceptedTerms}
                    onCheckedChange={(c) => setAcceptedTerms(!!c)}
                    className="mt-0.5 rounded-md border-slate-300 dark:border-slate-700 data-[state=checked]:bg-indigo-600"
                  />
                  <label htmlFor="terms" className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight cursor-pointer">
                    I accept the{' '}
                    <Link href="/#features" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/#features" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
                      Privacy Policy
                    </Link>.
                  </label>
                </div>

                {error && (
                  <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 dark:border-rose-900/50 dark:bg-rose-950/40 p-2.5 text-[11px] text-rose-600 dark:text-rose-400 font-medium">
                    <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Submit Action */}
                <Button
                  type="submit"
                  className="h-10 sm:h-11 min-h-[42px] bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl w-full shadow-md text-xs transition-all gap-1.5 mt-1"
                  disabled={register.isPending}
                >
                  {register.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                  {register.isPending
                    ? 'Creating Account…'
                    : `Create ${selectedRole.replace('_', ' ').toUpperCase()} Account`}
                </Button>
              </form>

              {/* OAuth Divider */}
              <div className="relative w-full my-2 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-200 dark:border-slate-800" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase">
                  <span className="bg-white dark:bg-slate-900 px-2.5 text-slate-400 font-bold tracking-wider">
                    OR CONTINUE WITH
                  </span>
                </div>
              </div>

              {/* Social Login Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full">
                <button
                  type="button"
                  disabled={!!oauthLoading}
                  onClick={() => handleOAuthLogin('google')}
                  aria-label={`Continue with Google as ${selectedRole.replace('_', ' ').toUpperCase()}`}
                  className="border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl h-10 min-h-[40px] px-2 flex items-center justify-center gap-1.5 text-[11px] sm:text-xs font-bold transition-all shadow-xs w-full disabled:opacity-50"
                >
                  {oauthLoading === 'google' ? (
                    <Loader2 className="h-4 w-4 animate-spin text-indigo-600 dark:text-indigo-400 shrink-0" />
                  ) : (
                    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                  )}
                  <span className="truncate">Google as [{selectedRole.replace('_', ' ').toUpperCase()}]</span>
                </button>

                <button
                  type="button"
                  disabled={!!oauthLoading}
                  onClick={() => handleOAuthLogin('linkedin')}
                  aria-label={`Continue with LinkedIn as ${selectedRole.replace('_', ' ').toUpperCase()}`}
                  className="border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl h-10 min-h-[40px] px-2 flex items-center justify-center gap-1.5 text-[11px] sm:text-xs font-bold transition-all shadow-xs w-full disabled:opacity-50"
                >
                  {oauthLoading === 'linkedin' ? (
                    <Loader2 className="h-4 w-4 animate-spin text-indigo-600 dark:text-indigo-400 shrink-0" />
                  ) : (
                    <svg className="h-4 w-4 shrink-0 fill-[#0A66C2]" viewBox="0 0 24 24">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                    </svg>
                  )}
                  <span className="truncate">LinkedIn as [{selectedRole.replace('_', ' ').toUpperCase()}]</span>
                </button>

                <button
                  type="button"
                  disabled={!!oauthLoading}
                  onClick={() => handleOAuthLogin('microsoft')}
                  aria-label={`Continue with Microsoft as ${selectedRole.replace('_', ' ').toUpperCase()}`}
                  className="border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl h-10 min-h-[40px] px-2 flex items-center justify-center gap-1.5 text-[11px] sm:text-xs font-bold transition-all shadow-xs w-full disabled:opacity-50"
                >
                  {oauthLoading === 'microsoft' ? (
                    <Loader2 className="h-4 w-4 animate-spin text-indigo-600 dark:text-indigo-400 shrink-0" />
                  ) : (
                    <svg className="h-4 w-4 shrink-0" viewBox="0 0 23 23">
                      <path fill="#f35325" d="M1 1h10v10H1z"/>
                      <path fill="#81bc06" d="M12 1h10v10H12z"/>
                      <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                      <path fill="#ffba08" d="M12 12h10v10H12z"/>
                    </svg>
                  )}
                  <span className="truncate">Microsoft as [{selectedRole.replace('_', ' ').toUpperCase()}]</span>
                </button>
              </div>

              {/* Login Switcher */}
              <p className="text-center text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
                Already part of the network?{' '}
                <Link href="/login" className="text-indigo-600 dark:text-indigo-400 font-extrabold hover:underline">
                  Login
                </Link>
              </p>
            </div>
          </div>

        </div>
      </main>

      {/* FOOTER BAR */}
      <footer className="w-full border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 py-3 px-3 sm:px-6 text-[10.5px] text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div>
            <span className="font-bold text-slate-700 dark:text-slate-300">ApplyAI Enterprise</span> © 2026 ApplyAI. All rights reserved.
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 font-medium">
            <Link href="/pricing" className="hover:text-indigo-600">Plans</Link>
            <Link href="/contact" className="hover:text-indigo-600">Contact Details</Link>
            <Link href="/#features" className="hover:text-indigo-600">Privacy Policy</Link>
            <Link href="/#features" className="hover:text-indigo-600">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
