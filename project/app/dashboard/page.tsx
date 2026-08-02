'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAppSelector } from '@/lib/store/hooks';
import { useApplications } from '@/lib/hooks/use-features';
import { usePinnedFeatures, ALL_PINNABLE_FEATURES } from '@/lib/hooks/use-pinned-features';
import { getDisplayName } from '@/lib/utils';
import { PageShell } from '@/components/page-shell';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Calendar,
  ChevronRight,
  Briefcase,
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
  Clock,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Send,
  Filter,
  Video,
  ExternalLink,
  Bot,
  RefreshCw,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';

import RecruiterDashboardPage from './recruiter/page';
import AdminDashboardPage from './admin/page';
import SuperAdminDashboardPage from './super-admin/page';

import { AiSetupWizard } from '@/components/ai-setup-wizard';
import { ScheduleEventDialog } from '@/components/schedule-event-dialog';

export default function DashboardPage() {
  const user = useAppSelector((s) => s.auth.user);
  const { data: realApplications = [] } = useApplications();
  const { pinnedHrefs, togglePin, clearAllPins, hasPins } = usePinnedFeatures();
  const [chartPeriod, setChartPeriod] = useState<'monthly' | 'weekly'>('monthly');
  const [mounted, setMounted] = useState(false);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [scheduledEventsCount, setScheduledEventsCount] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const formattedUsername = getDisplayName(user);

  const appsList = realApplications || [];
  const totalApplied = appsList.length;
  const inProgress = appsList.filter(
    (a) => a.status?.toLowerCase() === 'applied' || a.status?.toLowerCase() === 'assessment' || a.status?.toLowerCase() === 'interview'
  ).length;
  const interviewApps = appsList.filter((a) => a.status?.toLowerCase() === 'interview');
  const interviewCount = interviewApps.length;
  const offersCount = appsList.filter((a) => a.status?.toLowerCase() === 'offer' || a.status?.toLowerCase() === 'joined').length;

  /* Dynamic Chart data from real applications or default zero volume */
  const barData = [
    { month: 'Jan', volume: appsList.filter(a => new Date(a.createdAt).getMonth() === 0).length },
    { month: 'Feb', volume: appsList.filter(a => new Date(a.createdAt).getMonth() === 1).length },
    { month: 'Mar', volume: appsList.filter(a => new Date(a.createdAt).getMonth() === 2).length },
    { month: 'Apr', volume: appsList.filter(a => new Date(a.createdAt).getMonth() === 3).length },
    { month: 'May', volume: appsList.filter(a => new Date(a.createdAt).getMonth() === 4).length },
    { month: 'Jun', volume: appsList.filter(a => new Date(a.createdAt).getMonth() === 5).length, active: true },
  ];

  /* Active Pipeline table rows */
  const pipelineRows = appsList.slice(0, 5).map((a) => ({
    company: a.job?.company ?? 'Company',
    role: a.job?.title ?? 'Role',
    status: a.status === 'offer' ? 'Offer' : a.status === 'interview' ? 'Interview' : a.status === 'assessment' ? 'Assessment' : 'Applied',
    statusBadgeClass:
      a.status === 'offer' || a.status === 'joined'
        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
        : a.status === 'interview' || a.status === 'assessment'
        ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    nextStep: a.status === 'offer' ? 'Review Offer' : a.status === 'interview' ? 'Interview Scheduled' : 'Awaiting Feedback',
  }));

  return (
    <PageShell title="" subtitle="">
      <div className="max-w-6xl mx-auto space-y-6 pb-12 animate-fade-in px-2 sm:px-4 font-sans text-sm">
        
        {/* Top Header - Welcome Greeting & Quick Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Welcome back, {formattedUsername}.
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-normal mt-0.5">
              You have {interviewCount + scheduledEventsCount} interviews scheduled this week. Keep the momentum going!
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setScheduleDialogOpen(true)}
              className="rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0e17] text-slate-700 dark:text-slate-200 font-bold text-xs gap-2 py-2 px-4 shadow-xs"
            >
              <Calendar className="h-4 w-4 text-slate-500" />
              <span>Schedule Event</span>
            </Button>

            <Link href="/jobs">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 px-4 rounded-xl shadow-md gap-2">
                <Plus className="h-4 w-4" />
                <span>New Application</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* 4-Step Setup & AI Autopilot Control Banner */}
        <AiSetupWizard />

        {/* 4 Top Metric KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-sans">
          
          {/* Card 1: Total Applications */}
          <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                <Send className="h-4 w-4" />
              </div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                <TrendingUp className="h-3.5 w-3.5" /> +12%
              </span>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Applications</p>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
                {totalApplied}
              </h2>
            </div>
          </Card>

          {/* Card 2: Active Pipeline */}
          <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <Filter className="h-4 w-4" />
              </div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                <TrendingUp className="h-3.5 w-3.5" /> +8%
              </span>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Active Pipeline</p>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
                {inProgress}
              </h2>
            </div>
          </Card>

          {/* Card 3: Interviews */}
          <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                <Video className="h-4 w-4" />
              </div>
              <Badge className="bg-rose-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-md">
                ! Today
              </Badge>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Interviews</p>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
                {interviewCount}
              </h2>
            </div>
          </Card>

          {/* Card 4: Offers Received */}
          <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                Active Offers
              </span>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Offers Received</p>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
                {offersCount}
              </h2>
            </div>
          </Card>

        </div>

        {/* Middle Section: Application Volume Bar Chart & AVG. ATS MATCH SCORE Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Application Volume Chart */}
          <Card className="lg:col-span-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-6 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Application Volume
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                  Tracking your outreach effectiveness over the last 6 months
                </p>
              </div>

              <div className="flex items-center bg-slate-100 dark:bg-[#121522] p-1 rounded-xl border border-slate-200 dark:border-slate-800 self-start sm:self-auto">
                <button
                  onClick={() => setChartPeriod('monthly')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    chartPeriod === 'monthly'
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setChartPeriod('weekly')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    chartPeriod === 'weekly'
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Weekly
                </button>
              </div>
            </div>

            <div className="h-64 w-full pt-4">
              {mounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} hide />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '11px',
                        fontFamily: 'sans-serif',
                      }}
                    />
                    <Bar dataKey="volume" radius={[8, 8, 0, 0]}>
                      {barData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.active ? '#6366f1' : '#818cf8'}
                          opacity={entry.active ? 1 : 0.65}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </Card>

          {/* Right: AVG. ATS MATCH SCORE Dark Card */}
          <Card className="lg:col-span-4 rounded-3xl border border-slate-800 bg-[#0c0e17] text-white p-6 space-y-5 shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                  AVG. ATS MATCH SCORE
                </span>
                <TrendingUp className="h-4 w-4 text-emerald-400" />
              </div>

              <h2 className="text-5xl font-black tracking-tight text-white">
                84%
              </h2>

              <p className="text-xs text-slate-400 font-normal leading-relaxed">
                Your resumes are performing significantly better than the industry average (62%).
              </p>
            </div>

            <div className="space-y-4 pt-2 border-t border-slate-800">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-300">Keywords Optimized</span>
                  <span className="text-emerald-400">92%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full w-[92%]" />
                </div>
              </div>

              <Link href="/resume">
                <Button variant="outline" className="w-full rounded-xl border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-white font-bold text-xs py-2.5">
                  View Detailed Resume Analysis
                </Button>
              </Link>
            </div>
          </Card>

        </div>

        {/* Lower Section: Quick Launch Tools, Active Pipeline Table & Recent Activity Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Quick Launch Tools & Active Pipeline Table */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Quick Launch Tools */}
            <div className="space-y-3">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Quick Launch Tools
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                
                <Link href="/cover-letter">
                  <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-5 text-center space-y-2 hover:border-blue-500/50 transition-all cursor-pointer shadow-xs">
                    <div className="h-10 w-10 mx-auto flex items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <p className="font-bold text-xs text-slate-900 dark:text-white">AI Cover Letter</p>
                  </Card>
                </Link>

                <Link href="/interview-prep">
                  <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-5 text-center space-y-2 hover:border-emerald-500/50 transition-all cursor-pointer shadow-xs">
                    <div className="h-10 w-10 mx-auto flex items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <MessageSquare className="h-5 w-5" />
                    </div>
                    <p className="font-bold text-xs text-slate-900 dark:text-white">Mock Interview</p>
                  </Card>
                </Link>

                <Link href="/jobs">
                  <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-5 text-center space-y-2 hover:border-cyan-500/50 transition-all cursor-pointer shadow-xs">
                    <div className="h-10 w-10 mx-auto flex items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                      <Briefcase className="h-5 w-5" />
                    </div>
                    <p className="font-bold text-xs text-slate-900 dark:text-white">Job Scraper</p>
                  </Card>
                </Link>

                <Link href="/resume">
                  <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-5 text-center space-y-2 hover:border-purple-500/50 transition-all cursor-pointer shadow-xs">
                    <div className="h-10 w-10 mx-auto flex items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                      <FileText className="h-5 w-5" />
                    </div>
                    <p className="font-bold text-xs text-slate-900 dark:text-white">Revision History</p>
                  </Card>
                </Link>

              </div>
            </div>

            {/* ACTIVE PIPELINE Table Card */}
            <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                  ACTIVE PIPELINE
                </h3>

                <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-blue-500" /> Interviewing
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" /> Applied
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                {pipelineRows.length === 0 ? (
                  <div className="py-8 text-center space-y-2">
                    <Briefcase className="h-8 w-8 text-slate-300 dark:text-slate-700 mx-auto" />
                    <p className="text-xs text-slate-500 font-medium">No active applications in pipeline yet.</p>
                    <Link href="/jobs" className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline inline-block mt-1">
                      Browse Jobs & Apply →
                    </Link>
                  </div>
                ) : (
                  <table className="w-full text-left font-sans text-xs">
                    <thead>
                      <tr className="text-[10px] font-extrabold uppercase text-slate-400 border-b border-slate-100 dark:border-slate-800">
                        <th className="pb-3 pt-1">COMPANY</th>
                        <th className="pb-3 pt-1">ROLE</th>
                        <th className="pb-3 pt-1">STATUS</th>
                        <th className="pb-3 pt-1">NEXT STEP</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {pipelineRows.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                          <td className="py-3 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Avatar className="h-7 w-7 border border-slate-200 dark:border-slate-800">
                              <AvatarFallback className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-extrabold text-[10px]">
                                {row.company.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span>{row.company}</span>
                          </td>
                          <td className="py-3 text-slate-600 dark:text-slate-300 font-medium">{row.role}</td>
                          <td className="py-3">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${row.statusBadgeClass}`}>
                              {row.status}
                            </span>
                          </td>
                          <td className="py-3 text-slate-500 dark:text-slate-400 font-normal">{row.nextStep}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </Card>

          </div>

          {/* Right Column: RECENT ACTIVITY Timeline Card */}
          <div className="lg:col-span-4">
            <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-6 space-y-4 shadow-sm h-full flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                    RECENT ACTIVITY
                  </h3>
                  <Link href="/applications" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
                    View All
                  </Link>
                </div>

                <div className="space-y-4 font-sans text-xs">
                  {appsList.length === 0 ? (
                    <div className="py-10 text-center space-y-2">
                      <Clock className="h-8 w-8 text-slate-300 dark:text-slate-700 mx-auto" />
                      <p className="text-xs text-slate-500 font-medium">No recent activity recorded yet.</p>
                    </div>
                  ) : (
                    appsList.slice(0, 4).map((app, idx) => (
                      <div key={app.id || idx} className="flex items-start gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm mt-0.5">
                          <Send className="h-4 w-4" />
                        </div>
                        <div className="space-y-0.5">
                          <p className="font-bold text-slate-900 dark:text-white text-xs">
                            Application: {app.job?.company || 'Company'}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {app.job?.title || 'Role'} • Status: {app.status || 'Applied'}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </Card>
          </div>

        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 font-sans">
          <p>© 2026 ApplyAI Professional Suite. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#privacy" className="hover:underline">Privacy Policy</a>
            <a href="#terms" className="hover:underline">Terms of Service</a>
            <a href="#resources" className="hover:underline">Career Resources</a>
          </div>
        </div>

        {/* Schedule Event Modal */}
        <ScheduleEventDialog
          open={scheduleDialogOpen}
          onOpenChange={setScheduleDialogOpen}
          onEventSaved={() => setScheduledEventsCount((prev) => prev + 1)}
        />

      </div>
    </PageShell>
  );
}
