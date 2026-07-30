'use client';

import { useAppSelector } from '@/lib/store/hooks';
import { PageShell } from '@/components/page-shell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ShieldCheck,
  Users,
  Briefcase,
  AlertTriangle,
  Activity,
  UserCheck,
  FileSpreadsheet,
  Zap,
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const user = useAppSelector((s) => s.auth.user);
  const username = user?.email ? user.email.split('@')[0] : 'Admin';
  const formattedUsername = username.charAt(0).toUpperCase() + username.slice(1);

  return (
    <PageShell
      title={`Admin Console — Welcome, ${formattedUsername} 🛡️`}
      subtitle="System moderation, organization user management, job listing approvals, and platform metrics."
    >
      <div className="space-y-6">
        {/* Admin Stats Overview Skeleton */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Registered Users</span>
              <Users className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">1,420</span>
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">+148 this month</span>
            </div>
          </Card>

          <Card className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Job Postings</span>
              <Briefcase className="h-4.5 w-4.5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">184</span>
              <span className="text-xs font-medium text-slate-400">Approved listings</span>
            </div>
          </Card>

          <Card className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Moderation Flags</span>
              <AlertTriangle className="h-4.5 w-4.5 text-amber-500" />
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">2</span>
              <span className="text-xs font-medium text-amber-600 dark:text-amber-400">Pending review</span>
            </div>
          </Card>

          <Card className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">System Health</span>
              <Activity className="h-4.5 w-4.5 text-emerald-500" />
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">99.9%</span>
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Operational</span>
            </div>
          </Card>
        </div>

        {/* Placeholder Feature Card */}
        <Card className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/30 dark:border-emerald-900/60 dark:bg-emerald-950/20 p-8 text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md shadow-emerald-500/20">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              User Management & Moderation tools coming soon
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Organization user directory, role permissions, job listing moderation queue, and team audit logs are being configured.
            </p>
          </div>
          <div className="pt-2 flex justify-center gap-3">
            <Button size="sm" variant="outline" asChild className="rounded-xl text-xs">
              <Link href="/profile">View User Directory</Link>
            </Button>
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs" asChild>
              <Link href="/jobs">Review Job Listings</Link>
            </Button>
          </div>
        </Card>
      </div>
    </PageShell>
  );
}
