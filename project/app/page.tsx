'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/lib/store/hooks';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  BarChart3,
  FileText,
  Sparkles,
  Target,
  CheckCircle2,
  Zap,
} from 'lucide-react';

const features = [
  {
    icon: Target,
    title: 'ATS Score Analysis',
    desc: 'Upload your resume and get a Jobscan-style ATS score with keyword match breakdown.',
  },
  {
    icon: FileText,
    title: 'AI Cover Letters',
    desc: 'Generate tailored cover letters in professional, friendly, startup, or corporate tone.',
  },
  {
    icon: BarChart3,
    title: 'Application Tracker',
    desc: 'Track every application across a clear pipeline: Applied → Interview → Offer → Joined.',
  },
  {
    icon: Sparkles,
    title: 'Interview Prep',
    desc: 'Get AI-generated interview questions and model answers tailored to the role.',
  },
];

const stats = [
  { value: '85%+', label: 'Avg. ATS improvement' },
  { value: '3x', label: 'More interviews' },
  { value: '12k+', label: 'Resumes optimized' },
];

export default function Home() {
  const router = useRouter();
  const { token } = useAppSelector((s) => s.auth);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 bg-dots opacity-60" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[40rem] w-[60rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />

      {/* Nav */}
      <header className="relative z-10 mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient shadow-lg shadow-primary/20">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-semibold tracking-tight">ApplyAI</span>
        </div>
        <div className="flex items-center gap-3">
          {token ? (
            <Button onClick={() => router.push('/dashboard')} className="gap-2">
              Go to dashboard <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Sign in</Button>
              </Link>
              <Link href="/register">
                <Button className="gap-2">
                  Get started <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 pt-16 pb-24 sm:px-6 lg:px-8 lg:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur animate-fade-in-up">
            <Zap className="h-3.5 w-3.5 text-primary" />
            AI-powered job application optimization
          </div>
          <h1 className="animate-fade-in-up text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Land your next role with
            <span className="block text-gradient">AI on your side</span>
          </h1>
          <p className="animate-fade-in-up animate-delay-100 mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Optimize your resume for ATS, generate cover letters, track applications,
            and prep for interviews — all in one place.
          </p>
          <div className="animate-fade-in-up animate-delay-200 mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/register">
              <Button size="lg" className="gap-2 px-8">
                Create your account <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="px-8">
                I already have an account
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="animate-fade-in-up animate-delay-300 mx-auto mt-20 grid max-w-3xl grid-cols-3 gap-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-border bg-card/60 p-6 text-center backdrop-blur"
            >
              <div className="text-3xl font-bold text-gradient">{s.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to apply smarter
          </h2>
          <p className="mt-4 text-muted-foreground">
            Four AI tools that turn the hardest parts of job hunting into a few clicks.
          </p>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="group rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-brand-gradient p-10 text-center sm:p-16">
          <div className="pointer-events-none absolute inset-0 bg-dots opacity-20" />
          <div className="relative">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to apply with confidence?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/90">
              Join thousands of job seekers using ApplyAI to get more interviews.
            </p>
            <Link href="/register">
              <Button
                size="lg"
                variant="secondary"
                className="mt-8 gap-2 px-8 shadow-lg"
              >
                Get started free <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/90">
              {['No credit card required', 'Free forever plan', 'Cancel anytime'].map(
                (t) => (
                  <li key={t} className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" /> {t}
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-border/70 py-8 text-center text-sm text-muted-foreground">
        ApplyAI — AI-powered job application platform
      </footer>
    </div>
  );
}
