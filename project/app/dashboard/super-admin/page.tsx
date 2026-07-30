'use client';

import { useAppSelector } from '@/lib/store/hooks';
import { PageShell } from '@/components/page-shell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ShieldAlert,
  Crown,
  Zap,
  Globe,
  DollarSign,
  Building,
  Server,
  Activity,
} from 'lucide-react';
import Link from 'next/link';

export default function SuperAdminDashboardPage() {
  const user = useAppSelector((s) => s.auth.user);
  const username = user?.email ? user.email.split('@')[0] : 'SuperAdmin';
  const formattedUsername = username.charAt(0).toUpperCase() + username.slice(1);

  return (
    <PageShell
      title={`Super Admin Control Panel — Welcome, ${formattedUsername} ⚡`}
      subtitle="Global platform management, subscription billing analytics, system infrastructure, and enterprise controls."
    >
      <div className="space-y-6">
        {/* Super Admin Stats Overview Skeleton */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Platform MRR</span>
              <DollarSign className="h-4.5 w-4.5 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">$18,420</span>
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">+22% MoM</span>
            </div>
          </Card>

          <Card className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Active Organizations</span>
              <Building className="h-4.5 w-4.5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">84</span>
              <span className="text-xs font-medium text-slate-400">Enterprise accounts</span>
            </div>
          </Card>

          <Card className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Global API Calls</span>
              <Zap className="h-4.5 w-4.5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">1.2M</span>
              <span className="text-xs font-medium text-slate-400">Requests this month</span>
            </div>
          </Card>

          <Card className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Server Cluster</span>
              <Server className="h-4.5 w-4.5 text-emerald-500" />
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">Healthy</span>
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">0 Alerts</span>
            </div>
          </Card>
        </div>

        {/* Placeholder Feature Card */}
        <Card className="rounded-2xl border border-dashed border-amber-200 bg-amber-50/30 dark:border-amber-900/60 dark:bg-amber-950/20 p-8 text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-600 text-white shadow-md shadow-amber-500/20">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Global Platform Analytics & Settings coming soon
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Global subscription billing configuration, enterprise feature flags, tenant provisioning, and platform-wide analytics tools are being prepared.
            </p>
          </div>
          <div className="pt-2 flex justify-center gap-3">
            <Button size="sm" variant="outline" asChild className="rounded-xl text-xs">
              <Link href="/pricing">Manage Subscription Plans</Link>
            </Button>
            <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs" asChild>
              <Link href="/auto-apply">Platform Health Metrics</Link>
            </Button>
          </div>
        </Card>
      </div>
    </PageShell>
  );
}
