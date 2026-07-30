'use client';

import Link from 'next/link';
import { useAppSelector } from '@/lib/store/hooks';
import { useApplications } from '@/lib/hooks/use-features';
import { usePinnedFeatures, ALL_PINNABLE_FEATURES } from '@/lib/hooks/use-pinned-features';
import { PageShell } from '@/components/page-shell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  KanbanSquare,
  Building2,
  ChevronRight,
  Briefcase,
  FileCheck,
  Award,
  Pin,
  PinOff,
  Target,
  FileText,
  MessageSquare,
  Compass,
  Mail,
  Zap,
  ArrowRight,
} from 'lucide-react';

import RecruiterDashboardPage from './recruiter/page';
import AdminDashboardPage from './admin/page';
import SuperAdminDashboardPage from './super-admin/page';

export default function DashboardPage() {
  const user = useAppSelector((s) => s.auth.user);
  const { data: realApplications = [] } = useApplications();
  const { pinnedHrefs, togglePin, clearAllPins, hasPins } = usePinnedFeatures();

  const role = user?.role ?? 'student';

  if (role === 'recruiter') {
    return <RecruiterDashboardPage />;
  }
  if (role === 'admin') {
    return <AdminDashboardPage />;
  }
  if (role === 'super_admin') {
    return <SuperAdminDashboardPage />;
  }

  const rawUsername = user?.email ? user.email.split('@')[0] : 'Student';
  const formattedUsername = rawUsername.charAt(0).toUpperCase() + rawUsername.slice(1);

  const appsList = realApplications || [];
  const totalApplied = appsList.length;
  const inProgress = appsList.filter(
    (a) => a.status?.toLowerCase() === 'applied' || a.status?.toLowerCase() === 'assessment' || a.status?.toLowerCase() === 'interview'
  ).length;
  const interviewApps = appsList.filter((a) => a.status?.toLowerCase() === 'interview');
  const offersCount = appsList.filter((a) => a.status?.toLowerCase() === 'offer' || a.status?.toLowerCase() === 'joined').length;

  const displayApps = appsList.slice(0, 6).map((a) => ({
    id: a.id,
    title: a.job?.title ?? 'Position Applied',
    company: a.job?.company ?? 'Company',
    date: new Date(a.createdAt).toLocaleDateString(),
    status:
      a.status?.toLowerCase() === 'applied'
        ? 'Applied'
        : a.status?.toLowerCase() === 'interview'
        ? 'Interviewing'
        : a.status?.toLowerCase() === 'offer'
        ? 'Offer Received'
        : a.status,
    statusColor:
      a.status?.toLowerCase() === 'interview'
        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
        : a.status?.toLowerCase() === 'offer'
        ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800'
        : 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border-blue-200 dark:border-blue-800',
  }));

  const pinnedFeatureInfos = ALL_PINNABLE_FEATURES.filter((f) => pinnedHrefs.includes(f.href));

  return (
    <PageShell
      title={`Welcome back, ${formattedUsername} 👋`}
      subtitle="Here is your clean application status overview."
      actions={
        hasPins ? (
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllPins}
            className="gap-2 text-xs border-amber-300 bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20"
          >
            <PinOff className="h-3.5 w-3.5" /> Clear Pinned Views ({pinnedHrefs.length})
          </Button>
        ) : null
      }
    >
      <div className="space-y-6">
        {/* 1. SIMPLE TOP METRICS SUMMARY */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Applied</span>
              <Briefcase className="h-4.5 w-4.5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{totalApplied}</span>
              <span className="text-xs text-slate-400">Submitted</span>
            </div>
          </Card>

          <Card className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">In Progress</span>
              <FileCheck className="h-4.5 w-4.5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{inProgress}</span>
              <span className="text-xs text-slate-400">Active</span>
            </div>
          </Card>

          <Card className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Scheduled Interviews</span>
              <Calendar className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">{interviewApps.length}</span>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Rounds</span>
            </div>
          </Card>

          <Card className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Offers Received</span>
              <Award className="h-4.5 w-4.5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-purple-600 dark:text-purple-400">{offersCount}</span>
              <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">Offers</span>
            </div>
          </Card>
        </div>

        {/* 2. PINNED FEATURE VIEWS (DISPLAYED ONLY IF PINNED BY USER FROM LEFT SIDEBAR) */}
        {hasPins && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold tracking-wider text-slate-400 uppercase flex items-center gap-2">
                <Pin className="h-4 w-4 text-amber-500 fill-amber-500" />
                Pinned Feature Workspace ({pinnedFeatureInfos.length})
              </h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {pinnedFeatureInfos.map((feat) => (
                <PinnedFeatureCard
                  key={feat.href}
                  feature={feat}
                  onUnpin={() => togglePin(feat.href)}
                  applications={appsList}
                />
              ))}
            </div>
          </div>
        )}

        {/* 3. SIMPLE & SORTED RECENT APPLICATIONS TABLE */}
        <Card className="rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between p-6 pb-4">
            <div>
              <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <KanbanSquare className="h-4.5 w-4.5 text-indigo-600 dark:text-indigo-400" />
                Recent Applications
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 mt-0.5">
                Sorted overview of your job applications
              </CardDescription>
            </div>
            <Button size="sm" variant="ghost" className="gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400" asChild>
              <Link href="/applications">
                Full Tracker <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>

          <CardContent className="px-6 pb-6 pt-0">
            {displayApps.length === 0 ? (
              <div className="p-10 text-center space-y-3 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                <Briefcase className="h-8 w-8 text-indigo-600 dark:text-indigo-400 mx-auto" />
                <p className="font-bold text-sm text-slate-900 dark:text-white">No active applications yet</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Browse open positions in Job Search & Matching to get started.
                </p>
                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs px-4" asChild>
                  <Link href="/jobs">Browse Job Openings</Link>
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 dark:border-slate-800/80">
                      <th className="pb-3 font-semibold uppercase tracking-wider text-[10px]">Position & Company</th>
                      <th className="pb-3 font-semibold uppercase tracking-wider text-[10px]">Date Applied</th>
                      <th className="pb-3 font-semibold uppercase tracking-wider text-[10px] text-right">Current Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {displayApps.map((app) => (
                      <tr key={app.id} className="group transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                        <td className="py-3.5 font-medium text-slate-900 dark:text-white">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 font-bold text-xs">
                              <Building2 className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                                {app.title}
                              </p>
                              <p className="text-xs text-slate-400">{app.company}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 text-slate-500 dark:text-slate-400 font-medium">{app.date}</td>
                        <td className="py-3.5 text-right">
                          <span className={`inline-block rounded-xl border px-3 py-1 text-xs font-bold ${app.statusColor}`}>
                            {app.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}

function PinnedFeatureCard({
  feature,
  onUnpin,
  applications,
}: {
  feature: (typeof ALL_PINNABLE_FEATURES)[0];
  onUnpin: () => void;
  applications: any[];
}) {
  return (
    <Card className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm transition-all hover:shadow-md">
      <CardHeader className="p-5 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20">
              {feature.id === 'resume' && <Target className="h-5 w-5" />}
              {feature.id === 'jobs' && <Briefcase className="h-5 w-5" />}
              {feature.id === 'applications' && <KanbanSquare className="h-5 w-5" />}
              {feature.id === 'auto-apply' && <Zap className="h-5 w-5" />}
              {feature.id === 'cover-letter' && <FileText className="h-5 w-5" />}
              {feature.id === 'interview-prep' && <MessageSquare className="h-5 w-5" />}
              {feature.id === 'career-coach' && <Compass className="h-5 w-5" />}
              {feature.id === 'email-sync' && <Mail className="h-5 w-5" />}
            </div>
            <div>
              <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                {feature.label}
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                {feature.description}
              </CardDescription>
            </div>
          </div>
          <button
            type="button"
            onClick={onUnpin}
            className="rounded-lg p-1.5 text-amber-500 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
            title="Unpin feature from dashboard"
          >
            <Pin className="h-4 w-4 fill-amber-500" />
          </button>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-0">
        <div className="mt-2 rounded-xl bg-slate-50 p-3.5 dark:bg-slate-800/50 space-y-2">
          {feature.id === 'resume' && (
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Resume ATS Score</span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400">85% Match</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-indigo-600 w-[85%]" />
              </div>
            </div>
          )}

          {feature.id === 'jobs' && (
            <div className="text-xs space-y-1">
              <p className="font-semibold text-slate-700 dark:text-slate-300">AI Job Matcher Active</p>
              <p className="text-[11px] text-slate-500">Top matches found for Full Stack & React Developer roles.</p>
            </div>
          )}

          {feature.id === 'applications' && (
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="rounded-lg bg-white p-1.5 dark:bg-slate-900 border">
                <p className="font-extrabold text-indigo-600">{applications.length}</p>
                <p className="text-[9px] text-slate-400">Applied</p>
              </div>
              <div className="rounded-lg bg-white p-1.5 dark:bg-slate-900 border">
                <p className="font-extrabold text-amber-500">1</p>
                <p className="text-[9px] text-slate-400">Assess</p>
              </div>
              <div className="rounded-lg bg-white p-1.5 dark:bg-slate-900 border">
                <p className="font-extrabold text-emerald-500">1</p>
                <p className="text-[9px] text-slate-400">Interview</p>
              </div>
              <div className="rounded-lg bg-white p-1.5 dark:bg-slate-900 border">
                <p className="font-extrabold text-purple-500">0</p>
                <p className="text-[9px] text-slate-400">Offer</p>
              </div>
            </div>
          )}

          {feature.id === 'auto-apply' && (
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Auto-Apply Status</span>
              <Badge className="bg-emerald-500 text-white text-[10px]">ACTIVE (8/15)</Badge>
            </div>
          )}

          {feature.id === 'cover-letter' && (
            <p className="text-xs text-slate-500">Generate tailored cover letters for specific job roles.</p>
          )}

          {feature.id === 'interview-prep' && (
            <p className="text-xs text-slate-500">AI Mock interview simulator & behavioral questions practice.</p>
          )}

          {feature.id === 'career-coach' && (
            <p className="text-xs text-slate-500">Target Role: Senior Full Stack Engineer • Missing skills roadmap.</p>
          )}

          {feature.id === 'email-sync' && (
            <p className="text-xs text-slate-500">Gmail Inbox scanner connected & auto-scanning for invites.</p>
          )}
        </div>

        <div className="mt-3 flex justify-end">
          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs gap-1.5" asChild>
            <Link href={feature.href}>
              Open {feature.label.split(' ')[0]} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
