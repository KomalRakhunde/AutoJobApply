'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAppSelector } from '@/lib/store/hooks';
import { useApplications } from '@/lib/hooks/use-features';
import { PageShell } from '@/components/page-shell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Clock,
  Mail,
  KanbanSquare,
  Building2,
  ChevronRight,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Award,
  Video,
  ExternalLink,
} from 'lucide-react';

const mockInterviewsAndDeadlines = [
  {
    id: 'int-1',
    company: 'Stripe',
    role: 'Senior Full Stack Engineer',
    type: 'Technical Interview',
    date: 'Tomorrow, July 31',
    time: '4:00 PM EST',
    badgeColor: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
    icon: Video,
  },
  {
    id: 'int-2',
    company: 'Vercel',
    role: 'Frontend React Architect',
    type: 'Coding Assessment',
    date: 'Due in 2 days (Aug 2)',
    time: '11:59 PM EST',
    badgeColor: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    icon: Clock,
  },
  {
    id: 'int-3',
    company: 'DataPulse AI',
    role: 'Software Engineer - AI Systems',
    type: 'HR Screen Call',
    date: 'Friday, Aug 4',
    time: '11:00 AM EST',
    badgeColor: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    icon: Calendar,
  },
];

const mockEmailAlerts = [
  {
    id: 'email-1',
    company: 'Supabase',
    sender: 'Sarah Jenkins (Talent Partner)',
    subject: 'Official Offer Letter Package',
    snippet: 'Congratulations Komal! We are excited to extend an offer for the Staff Software Engineer role.',
    time: 'Yesterday',
    badge: 'OFFER',
    badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300',
  },
  {
    id: 'email-2',
    company: 'Stripe',
    sender: 'Alex Rivera (Engineering Recruiter)',
    subject: 'Interview Schedule Confirmation',
    snippet: 'Hi Komal, your technical interview with our Lead Engineer has been confirmed for July 31.',
    time: '3 hours ago',
    badge: 'INTERVIEW',
    badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300',
  },
  {
    id: 'email-3',
    company: 'InnovateAI',
    sender: 'Hiring Team',
    subject: 'Application Status Update',
    snippet: 'Thank you for applying. Your assessment results have been reviewed and advanced to next round.',
    time: '1 day ago',
    badge: 'UPDATE',
    badgeColor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300',
  },
];

const mockRecentApps = [
  {
    id: 'app-1',
    title: 'Senior Full Stack Engineer',
    company: 'Stripe',
    date: '7/27/2026',
    status: 'Interviewing',
    statusColor: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
  },
  {
    id: 'app-2',
    title: 'Frontend React Architect',
    company: 'Vercel',
    date: '7/25/2026',
    status: 'Assessment',
    statusColor: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  },
  {
    id: 'app-3',
    title: 'Product Engineer - AI Systems',
    company: 'Linear',
    date: '7/23/2026',
    status: 'Applied',
    statusColor: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border-blue-200 dark:border-blue-800',
  },
  {
    id: 'app-4',
    title: 'Staff Software Engineer',
    company: 'Supabase',
    date: '7/20/2026',
    status: 'Offer Received',
    statusColor: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800',
  },
];

export default function DashboardPage() {
  const user = useAppSelector((s) => s.auth.user);
  const { data: realApplications } = useApplications();

  const rawUsername = user?.email ? user.email.split('@')[0] : 'Komal';
  const formattedUsername = rawUsername.charAt(0).toUpperCase() + rawUsername.slice(1);

  const displayApps = (realApplications && realApplications.length > 0)
    ? realApplications.slice(0, 4).map((a) => ({
        id: a.id,
        title: a.job?.title ?? 'Full Stack Engineer',
        company: a.job?.company ?? 'TechCorp Solutions',
        date: new Date(a.createdAt).toLocaleDateString(),
        status: a.status === 'applied' ? 'Applied' : a.status === 'interview' ? 'Interviewing' : a.status === 'offer' ? 'Offer Received' : a.status,
        statusColor: a.status === 'interview'
          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
          : a.status === 'offer'
          ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800'
          : 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border-blue-200 dark:border-blue-800',
      }))
    : mockRecentApps;

  return (
    <PageShell
      title={`Welcome back, ${formattedUsername} 👋`}
      subtitle="Here are your active application counts, interview schedules, and important HR notifications."
    >
      <div className="space-y-6 sm:space-y-8">
        {/* 1. TOP SECTION: 4 Simple Application Count Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Applied</span>
              <Briefcase className="h-4.5 w-4.5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">48</span>
              <span className="text-xs font-medium text-slate-400">Applications submitted</span>
            </div>
          </Card>

          <Card className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">In Progress / Next Step</span>
              <FileCheck className="h-4.5 w-4.5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">9</span>
              <span className="text-xs font-medium text-slate-400">Active evaluation</span>
            </div>
          </Card>

          <Card className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Scheduled Interviews</span>
              <Calendar className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">3</span>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Upcoming rounds</span>
            </div>
          </Card>

          <Card className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Offers Received</span>
              <Award className="h-4.5 w-4.5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-purple-600 dark:text-purple-400">2</span>
              <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">Offer packages</span>
            </div>
          </Card>
        </div>

        {/* 2. MIDDLE SECTION: Urgent Action Items & Important HR Alerts (2 Column Cards) */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Card 1: Upcoming Interviews & Assessment Deadlines */}
          <Card className="rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm">
            <CardHeader className="p-6 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                      Upcoming Interviews & Deadlines
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500">
                      Scheduled rounds and assessment due dates
                    </CardDescription>
                  </div>
                </div>
                <Button size="sm" variant="ghost" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400" asChild>
                  <Link href="/interview-prep">
                    Prep Details <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </CardHeader>

            <CardContent className="px-6 pb-6 pt-0 space-y-3">
              {mockInterviewsAndDeadlines.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    className="flex flex-col gap-2 rounded-xl border border-slate-100 bg-slate-50/60 p-3.5 dark:border-slate-800 dark:bg-slate-800/40 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white dark:bg-slate-700 shadow-sm">
                        <Icon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div>
                        <p className="font-bold text-xs text-slate-900 dark:text-white">
                          {item.company} — <span className="font-medium text-slate-600 dark:text-slate-300">{item.role}</span>
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {item.type} • <span className="font-semibold text-slate-700 dark:text-slate-300">{item.date}</span> ({item.time})
                        </p>
                      </div>
                    </div>
                    <span className={`inline-block rounded-lg border px-2.5 py-1 text-[10px] font-bold shrink-0 self-start sm:self-center ${item.badgeColor}`}>
                      {item.type}
                    </span>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Card 2: Important HR Email Alerts & Action Notes */}
          <Card className="rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm">
            <CardHeader className="p-6 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                      Important HR Email Alerts
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500">
                      Latest extracted notes from synced Gmail inbox
                    </CardDescription>
                  </div>
                </div>
                <Button size="sm" variant="ghost" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400" asChild>
                  <Link href="/email-sync">
                    View Inbox <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </CardHeader>

            <CardContent className="px-6 pb-6 pt-0 space-y-3">
              {mockEmailAlerts.map((email) => (
                <div
                  key={email.id}
                  className="rounded-xl border border-slate-100 bg-slate-50/60 p-3.5 dark:border-slate-800 dark:bg-slate-800/40 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900 dark:text-white">{email.company}</span>
                      <span className="text-[10px] text-slate-400">({email.sender})</span>
                    </div>
                    <span className={`rounded-md px-2 py-0.5 text-[9px] font-extrabold ${email.badgeColor}`}>
                      {email.badge}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{email.subject}</p>
                  <p className="line-clamp-1 text-[11px] text-slate-500 dark:text-slate-400">{email.snippet}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* 3. BOTTOM SECTION: Sorted Recent Applications Table (Full Width) */}
        <Card className="rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between p-6 pb-4">
            <div>
              <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <KanbanSquare className="h-4.5 w-4.5 text-indigo-600 dark:text-indigo-400" />
                Recent Applications Overview
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 mt-0.5">
                Sorted list of your active job applications
              </CardDescription>
            </div>
            <Button size="sm" variant="ghost" className="gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400" asChild>
              <Link href="/applications">
                Full Tracker <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>

          <CardContent className="px-6 pb-6 pt-0">
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
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
