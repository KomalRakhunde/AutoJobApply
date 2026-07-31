'use client';

import Link from 'next/link';
import { useAppSelector } from '@/lib/store/hooks';
import { useApplications } from '@/lib/hooks/use-features';
import { usePinnedFeatures, ALL_PINNABLE_FEATURES } from '@/lib/hooks/use-pinned-features';
import { PageShell } from '@/components/page-shell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
  Sparkles,
  RefreshCw,
  Clock,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
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
    <PageShell title="" subtitle="">
      <div className="max-w-6xl mx-auto space-y-6 pb-16 animate-fade-in px-2 sm:px-4 font-mono text-xs">
        {/* Top Header - Matching Super Admin Layout & Spacing */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-b border-slate-200/80 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white font-extrabold text-lg shadow-md shadow-indigo-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Student Portal <span className="text-xs text-indigo-600 dark:text-indigo-400 font-mono font-normal">v2.4.0</span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">WELCOME BACK, {formattedUsername.toUpperCase()}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            {hasPins && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllPins}
                className="gap-2 text-xs font-mono font-bold border-amber-300 bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 rounded-xl"
              >
                <PinOff className="h-3.5 w-3.5" /> Clear Pins ({pinnedHrefs.length})
              </Button>
            )}
            <Avatar className="h-9 w-9 border border-indigo-500/40">
              <AvatarFallback className="bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-extrabold text-xs">
                {formattedUsername.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* 4 Top Metric KPI Cards (Live Database Metrics Only) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
          <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 border-l-4 border-l-indigo-500 bg-white dark:bg-[#0f111a] bg-gradient-to-r from-indigo-500/10 via-transparent to-transparent p-5 space-y-2 shadow-sm dark:shadow-xl hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all duration-300">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">APPLICATIONS</span>
              <Briefcase className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{totalApplied}</div>
            <p className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">Submitted</p>
          </Card>

          <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 border-l-4 border-l-cyan-400 bg-white dark:bg-[#0f111a] bg-gradient-to-r from-cyan-500/10 via-transparent to-transparent p-5 space-y-2 shadow-sm dark:shadow-xl hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] transition-all duration-300">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">IN PIPELINE</span>
              <Clock className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
            </div>
            <div className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{inProgress}</div>
            <p className="text-[11px] font-bold text-cyan-600 dark:text-cyan-400">Under Review</p>
          </Card>

          <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 border-l-4 border-l-amber-500 bg-white dark:bg-[#0f111a] bg-gradient-to-r from-amber-500/10 via-transparent to-transparent p-5 space-y-2 shadow-sm dark:shadow-xl hover:border-amber-500/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] transition-all duration-300">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">INTERVIEWS</span>
              <Calendar className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="text-4xl font-black text-amber-600 dark:text-amber-400 tracking-tight">{interviewApps.length}</div>
            <p className="text-[11px] font-bold text-amber-600 dark:text-amber-400">Scheduled</p>
          </Card>

          <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 border-l-4 border-l-emerald-400 bg-white dark:bg-[#0f111a] bg-gradient-to-r from-emerald-500/10 via-transparent to-transparent p-5 space-y-2 shadow-sm dark:shadow-xl hover:border-emerald-400/50 hover:shadow-[0_0_20px_rgba(52,211,153,0.15)] transition-all duration-300">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">OFFERS</span>
              <Award className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-4xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">{offersCount}</div>
            <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">Received</p>
          </Card>
        </div>

        {/* Pinned Features Row if pinned */}
        {pinnedFeatureInfos.length > 0 && (
          <div className="space-y-3 font-mono">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <Pin className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <span>Pinned Quick Launch</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {pinnedFeatureInfos.map((feat) => (
                <Card
                  key={feat.href}
                  className="rounded-2xl border border-slate-200/80 dark:border-slate-800 border-l-4 border-l-indigo-500 bg-white dark:bg-[#0c0e17] bg-gradient-to-r from-indigo-500/10 via-transparent to-transparent p-5 space-y-3 shadow-sm dark:shadow-xl hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all duration-300"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-slate-900 dark:text-white text-sm">{feat.label}</span>
                    <button onClick={() => togglePin(feat.href)} className="text-amber-500 hover:text-amber-600">
                      <Pin className="h-3.5 w-3.5 fill-current" />
                    </button>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 font-normal leading-relaxed">{feat.description}</p>
                  <Link href={feat.href}>
                    <Button size="sm" className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs gap-2">
                      Launch Tool <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Recent Applications Card with Left Accent & Hover Glow */}
        <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 border-l-4 border-l-indigo-500 bg-white dark:bg-[#0c0e17] bg-gradient-to-r from-indigo-500/10 via-transparent to-transparent p-6 space-y-5 shadow-sm dark:shadow-2xl hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all duration-300">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="font-black text-slate-900 dark:text-white text-base">Recent Applications</h3>
              <p className="text-slate-500 dark:text-slate-400 font-normal">Active candidate submissions</p>
            </div>
            <Link href="/applications">
              <Button variant="ghost" size="sm" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 gap-1">
                View All Applications <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
            {displayApps.length > 0 ? (
              displayApps.map((app) => (
                <div
                  key={app.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-[#121522] border border-slate-200/60 dark:border-slate-800/80 space-y-2 hover:border-indigo-500/40 transition-all shadow-sm cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">{app.title}</h4>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${app.statusColor}`}>
                      {app.status}
                    </span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 font-normal text-xs">{app.company}</p>
                  <p className="text-[10px] text-slate-400">Applied on {app.date}</p>
                </div>
              ))
            ) : (
              <div className="col-span-2 py-8 text-center text-slate-400">
                No active applications submitted yet. Browse jobs to apply!
              </div>
            )}
          </div>
        </Card>

        {/* Student Toolkit Launcher Grid */}
        <div className="space-y-4 font-mono">
          <h3 className="font-black text-slate-900 dark:text-white text-lg">AI Student Career Tools</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 border-l-4 border-l-cyan-400 bg-white dark:bg-[#0c0e17] bg-gradient-to-r from-cyan-500/10 via-transparent to-transparent p-5 space-y-3 shadow-sm dark:shadow-xl hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] transition-all duration-300">
              <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 w-fit">
                <Briefcase className="h-5 w-5" />
              </div>
              <h4 className="font-extrabold text-slate-900 dark:text-white text-base">Browse Job Board</h4>
              <p className="text-slate-500 dark:text-slate-400 font-normal">Explore verified enterprise requisitions with AI match scores.</p>
              <Link href="/jobs">
                <Button className="w-full rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs gap-2 mt-2">
                  Open Job Board <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </Card>

            <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 border-l-4 border-l-amber-500 bg-white dark:bg-[#0c0e17] bg-gradient-to-r from-amber-500/10 via-transparent to-transparent p-5 space-y-3 shadow-sm dark:shadow-xl hover:border-amber-500/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] transition-all duration-300">
              <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 w-fit">
                <FileText className="h-5 w-5" />
              </div>
              <h4 className="font-extrabold text-slate-900 dark:text-white text-base">AI Resume Optimizer</h4>
              <p className="text-slate-500 dark:text-slate-400 font-normal">Parse PDF resumes & get instant ATS keyword alignment reports.</p>
              <Link href="/resume">
                <Button className="w-full rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs gap-2 mt-2">
                  Launch Resume Studio <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </Card>

            <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 border-l-4 border-l-purple-500 bg-white dark:bg-[#0c0e17] bg-gradient-to-r from-purple-500/10 via-transparent to-transparent p-5 space-y-3 shadow-sm dark:shadow-xl hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] transition-all duration-300">
              <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 w-fit">
                <MessageSquare className="h-5 w-5" />
              </div>
              <h4 className="font-extrabold text-slate-900 dark:text-white text-base">AI Interview Studio</h4>
              <p className="text-slate-500 dark:text-slate-400 font-normal">Practice technical mock interviews with instant voice AI scoring.</p>
              <Link href="/interview-prep">
                <Button className="w-full rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs gap-2 mt-2">
                  Start Practice Studio <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
