'use client';

import Link from 'next/link';
import { Sparkles, ArrowLeft } from 'lucide-react';

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen lg:grid lg:grid-cols-2">
      {/* Left brand panel */}
      <div className="relative hidden overflow-hidden bg-brand-gradient lg:block">
        <div className="pointer-events-none absolute inset-0 bg-dots opacity-20" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <Link href="/" className="flex items-center gap-2.5 text-white">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-lg font-semibold tracking-tight">ApplyAI</span>
          </Link>
          <div className="max-w-md">
            <h2 className="text-3xl font-bold leading-tight text-white">
              The smartest way to apply for jobs.
            </h2>
            <p className="mt-4 text-white/85">
              ATS-optimized resumes, AI cover letters, application tracking, and
              interview prep — all in one place.
            </p>
            <div className="mt-10 space-y-4">
              {[
                'Beat ATS filters with a resume score',
                'Generate cover letters in seconds',
                'Track every application in one pipeline',
                'Prep with AI interview questions',
              ].map((t) => (
                <div key={t} className="flex items-center gap-3 text-white/90">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                      <path
                        fillRule="evenodd"
                        d="M16.7 5.3a1 1 0 0 1 0 1.4l-8 8a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4L8 12.6l7.3-7.3a1 1 0 0 1 1.4 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-sm text-white/60">© ApplyAI</p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="relative flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 bg-dots opacity-40 lg:hidden" />
        <div className="relative w-full max-w-md animate-scale-in">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground lg:hidden"
          >
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
          <div className="lg:hidden">
            <div className="mb-6 flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-semibold tracking-tight">ApplyAI</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <p className="mt-2 text-muted-foreground">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>
        </div>
      </div>
    </div>
  );
}
