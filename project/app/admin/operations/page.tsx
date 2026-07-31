'use client';

import { useState } from 'react';
import { PageShell } from '@/components/page-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  Briefcase,
  Users,
  ShieldAlert,
  Check,
  Zap,
  Activity,
  Layers,
  Archive,
  UserCheck,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

interface EscalationTicket {
  id: string;
  ticketCode: string;
  title: string;
  category: 'DEADLINE_WARNING' | 'FAILED_INTERVIEW' | 'CANDIDATE_ISSUE' | 'OVERDUE_TASK';
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  assignee: string;
  assigneeInitials: string;
  details: string;
  status: 'PENDING' | 'RESOLVED';
  timeAgo: string;
  dotColor: string;
}

const initialTickets: EscalationTicket[] = [
  {
    id: 'esc-1',
    ticketCode: '#TKT-8002',
    title: 'Senior Full Stack Engineer SLA Deadline Overrun',
    category: 'DEADLINE_WARNING',
    severity: 'HIGH',
    assignee: 'KOMAL RAKHUNDE',
    assigneeInitials: 'KR',
    details: '27 days in pipeline against 30-day SLA window. Critical attention required for 2 pending offers.',
    status: 'PENDING',
    timeAgo: 'UPDATED 2H AGO',
    dotColor: 'bg-rose-500 animate-pulse',
  },
  {
    id: 'esc-2',
    ticketCode: '#TKT-9112',
    title: 'Stalled Technical Interview Scorecard Verification',
    category: 'FAILED_INTERVIEW',
    severity: 'HIGH',
    assignee: 'SANDHANI SHAIK',
    assigneeInitials: 'SS',
    details: "Candidate Alex Rivera's Round 2 technical evaluation scorecard has been unsubmitted for 48+ hours.",
    status: 'PENDING',
    timeAgo: 'UPDATED 5H AGO',
    dotColor: 'bg-rose-500',
  },
  {
    id: 'esc-3',
    ticketCode: '#TKT-3844',
    title: 'WebRTC Infrastructure Alert: Safari iOS Compatibility',
    category: 'CANDIDATE_ISSUE',
    severity: 'MEDIUM',
    assignee: 'SOFIA PATEL',
    assigneeInitials: 'SP',
    details: 'Microphone permission handshake failure reported by candidate during automated AI screening session.',
    status: 'PENDING',
    timeAgo: 'UPDATED 1D AGO',
    dotColor: 'bg-amber-500',
  },
  {
    id: 'esc-4',
    ticketCode: '#TKT-4102',
    title: 'Overdue Candidate Intake Review for Marketing Lead',
    category: 'OVERDUE_TASK',
    severity: 'LOW',
    assignee: 'ALEX RIVERA',
    assigneeInitials: 'AR',
    details: '14 new PDF resumes pending ATS score verification for over 72 hours.',
    status: 'PENDING',
    timeAgo: 'UPDATED 2D AGO',
    dotColor: 'bg-blue-500',
  },
];

export default function AdminOperationsPage() {
  const { toast } = useToast();
  const [tickets, setTickets] = useState<EscalationTicket[]>(initialTickets);

  const handleResolveTicket = (ticketId: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: 'RESOLVED' } : t))
    );
    toast({
      title: '✅ Escalation Resolved!',
      description: 'Marked escalation ticket as resolved and updated SLA audit log.',
    });
  };

  const highSeverityCount = tickets.filter((t) => t.severity === 'HIGH' && t.status === 'PENDING').length;
  const activeSlaAlertsCount = tickets.filter((t) => t.status === 'PENDING').length;
  const resolvedCount = tickets.filter((t) => t.status === 'RESOLVED').length;

  return (
    <PageShell title="" subtitle="">
      <div className="max-w-6xl mx-auto space-y-6 pb-16 animate-fade-in px-2 sm:px-4 font-mono">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-b border-slate-200/80 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white font-extrabold text-lg shadow-md shadow-indigo-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Operations & SLA <span className="text-xs text-indigo-600 dark:text-indigo-400 font-mono font-normal">v2.4.0</span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">REAL-TIME SLA MONITORING & SYSTEM ESCALATION BOARD</p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl gap-1.5"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Sync Live</span>
            </Button>
            <Avatar className="h-9 w-9 border border-indigo-500/40">
              <AvatarFallback className="bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-extrabold text-xs">
                KR
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Top 3 KPI Metric Cards with Subtle Left Accent & Glow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 font-mono">
          <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 border-l-4 border-l-rose-500 bg-white dark:bg-[#0f111a] bg-gradient-to-r from-rose-500/10 via-transparent to-transparent p-6 shadow-sm dark:shadow-xl hover:border-rose-500/50 hover:shadow-[0_0_20px_rgba(244,63,94,0.15)] transition-all duration-300 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                HIGH ESCALATIONS
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500">
                <AlertTriangle className="h-4 w-4" />
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                {highSeverityCount}
              </span>
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-rose-500">
                PENDING ACTION
              </p>
            </div>
          </Card>

          <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 border-l-4 border-l-amber-500 bg-white dark:bg-[#0f111a] bg-gradient-to-r from-amber-500/10 via-transparent to-transparent p-6 shadow-sm dark:shadow-xl hover:border-amber-500/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] transition-all duration-300 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                SLA ALERTS
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-4xl font-black text-amber-600 dark:text-amber-400 tracking-tight">
                {activeSlaAlertsCount}
              </span>
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-amber-500">
                CURRENTLY ACTIVE
              </p>
            </div>
          </Card>

          <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 border-l-4 border-l-emerald-400 bg-white dark:bg-[#0f111a] bg-gradient-to-r from-emerald-500/10 via-transparent to-transparent p-6 shadow-sm dark:shadow-xl hover:border-emerald-400/50 hover:shadow-[0_0_20px_rgba(52,211,153,0.15)] transition-all duration-300 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                RESOLVED
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-4xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
                {resolvedCount}
              </span>
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-500">
                THIS PERIOD
              </p>
            </div>
          </Card>
        </div>

        {/* Live Operations Board Card */}
        <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-6 sm:p-8 space-y-6 shadow-sm dark:shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 shadow-sm">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white leading-tight">
                  Live Operations Board
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Manage critical tickets and system health escalations
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl gap-1.5"
            >
              <Archive className="h-3.5 w-3.5" />
              <span>View All Archive</span>
            </Button>
          </div>

          {/* Ticket Rows with Left Accent & Hover Glow */}
          <div className="space-y-4">
            {tickets.map((t, idx) => (
              <div
                key={t.id}
                className={`p-5 rounded-2xl bg-slate-50 dark:bg-[#121522] border border-slate-200/60 dark:border-slate-800/60 ${
                  idx % 3 === 0
                    ? 'border-l-4 border-l-rose-500 bg-gradient-to-r from-rose-500/10 via-transparent to-transparent hover:border-rose-500/50 hover:shadow-[0_0_20px_rgba(244,63,94,0.15)]'
                    : idx % 3 === 1
                    ? 'border-l-4 border-l-amber-500 bg-gradient-to-r from-amber-500/10 via-transparent to-transparent hover:border-amber-500/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]'
                    : 'border-l-4 border-l-indigo-500 bg-gradient-to-r from-indigo-500/10 via-transparent to-transparent hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)]'
                } flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 transition-all duration-300 shadow-sm cursor-pointer`}
              >
                <div className="space-y-2 min-w-0 flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className={`h-2.5 w-2.5 rounded-full ${t.dotColor} shrink-0`} />
                    <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                      {t.title}
                    </h4>
                    <span className="font-mono text-xs text-slate-500 dark:text-slate-400 font-normal">
                      {t.ticketCode}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    {t.details}
                  </p>

                  <div className="flex items-center gap-3 pt-1">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-0.5 text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                      <UserCheck className="h-3 w-3" />
                      {t.assignee}
                    </span>
                    <span className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      {t.timeAgo}
                    </span>
                  </div>
                </div>

                <div className="shrink-0">
                  {t.status === 'RESOLVED' ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-4 py-1.5 text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                      <Check className="h-4 w-4" /> RESOLVED
                    </span>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleResolveTicket(t.id)}
                      className="bg-emerald-600/15 hover:bg-emerald-600 text-emerald-600 dark:text-emerald-400 hover:text-white border border-emerald-500/30 font-extrabold rounded-full text-xs px-5 py-2 transition-all shadow-sm"
                    >
                      Resolve Ticket
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-end text-[11px] font-extrabold text-slate-500 dark:text-slate-400 tracking-wider">
            <div className="flex items-center gap-2 uppercase">
              <span>SYSTEM STATUS:</span>
              <span className="text-emerald-600 dark:text-emerald-500 flex items-center gap-1">
                ALL SYSTEMS NORMAL <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
              </span>
            </div>
          </div>
        </Card>
      </div>
    </PageShell>
  );
}
