'use client';

import type { ReactNode } from 'react';
import { AppNav } from '@/components/app-nav';
import { AuthGuard } from '@/components/auth-guard';

export function PageShell({
  title,
  subtitle,
  children,
  actions,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <AppNav />
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="animate-fade-in-up flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
              {subtitle && (
                <p className="mt-2 text-muted-foreground">{subtitle}</p>
              )}
            </div>
            {actions && <div className="flex items-center gap-2">{actions}</div>}
          </div>
          <div className="mt-8">{children}</div>
        </main>
      </div>
    </AuthGuard>
  );
}
