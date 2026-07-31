'use client';

import { useState, useEffect } from 'react';
import { PageShell } from '@/components/page-shell';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useApplications } from '@/lib/hooks/use-features';
import { fetchRecruiterJobs, RecruiterJob } from '@/lib/recruiter-api';
import {
  TrendingUp,
  AlertTriangle,
  Clock,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  Users,
  Briefcase,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminAnalyticsPage() {
  const { toast } = useToast();
  const { data: applications = [] } = useApplications();
  const [jobs, setJobs] = useState<RecruiterJob[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const realJobs = await fetchRecruiterJobs();
      setJobs(realJobs);
    } catch {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalApps = applications.length;
  const totalJobs = jobs.length;
  const screenedCount = applications.filter((a) => a.status === 'assessment' || a.status === 'interview' || a.status === 'offer' || a.status === 'joined').length;
  const interviewCount = applications.filter((a) => a.status === 'interview' || a.status === 'offer' || a.status === 'joined').length;
  const offerCount = applications.filter((a) => a.status === 'offer' || a.status === 'joined').length;
  const hiredCount = applications.filter((a) => a.status === 'joined').length;

  const offerAcceptancePct = offerCount > 0 ? Math.round((hiredCount / offerCount) * 100) : (totalApps > 0 ? 100 : 0);

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
                Pipeline & Analytics
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">LIVE CANDIDATE FUNNEL & REQUISITION ANALYTICS</p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={loadData}
              className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl gap-1.5"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Sync Live</span>
            </Button>
          </div>
        </div>

        {/* 2 Top Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
          <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 border-l-4 border-l-emerald-500 bg-white dark:bg-[#0f111a] bg-gradient-to-r from-emerald-500/10 via-transparent to-transparent p-5 space-y-2 shadow-sm dark:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">ACTIVE REQUISITIONS</span>
              <Briefcase className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{totalJobs}</div>
            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Open database job postings</p>
          </Card>

          <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 border-l-4 border-l-indigo-500 bg-white dark:bg-[#0f111a] bg-gradient-to-r from-indigo-500/10 via-transparent to-transparent p-5 space-y-2 shadow-sm dark:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">OFFER ACCEPTANCE RATE</span>
              <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{offerAcceptancePct}%</div>
            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Calculated from live applications</p>
          </Card>
        </div>

        {/* Global Funnel Section */}
        <div className="space-y-4 font-mono">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-slate-900 dark:text-white text-lg">Global Candidate Funnel</h3>
            <span className="rounded-md bg-slate-100 dark:bg-slate-800/80 px-2.5 py-0.5 font-mono text-xs text-slate-600 dark:text-slate-400 font-bold border border-slate-200 dark:border-slate-700">
              {totalApps} Total Applications
            </span>
          </div>

          <div className="space-y-3 font-mono">
            {[
              { stage: 'Total Submissions', count: totalApps, border: 'border-l-4 border-l-indigo-500', bgGrad: 'bg-gradient-to-r from-indigo-500/10 via-transparent to-transparent' },
              { stage: 'Screened & Assessed', count: screenedCount, border: 'border-l-4 border-l-cyan-400', bgGrad: 'bg-gradient-to-r from-cyan-500/10 via-transparent to-transparent' },
              { stage: 'Technical Interviews', count: interviewCount, border: 'border-l-4 border-l-amber-500', bgGrad: 'bg-gradient-to-r from-amber-500/10 via-transparent to-transparent' },
              { stage: 'Offer Letters Dispatched', count: offerCount, border: 'border-l-4 border-l-purple-500', bgGrad: 'bg-gradient-to-r from-purple-500/10 via-transparent to-transparent' },
              { stage: 'Hired & Joined', count: hiredCount, border: 'border-l-4 border-l-emerald-400', bgGrad: 'bg-gradient-to-r from-emerald-500/10 via-transparent to-transparent' },
            ].map((f, i) => (
              <Card
                key={i}
                className={`rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] ${f.bgGrad} p-5 flex items-center justify-between ${f.border} shadow-sm dark:shadow-xl transition-all duration-300`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-extrabold text-slate-900 dark:text-white text-base">{f.stage}</span>
                </div>
                <span className="font-black text-2xl text-slate-900 dark:text-white tracking-tight">{f.count}</span>
              </Card>
            ))}
          </div>
        </div>

        {/* Requisition Status Section */}
        <div className="space-y-4 pt-2 font-mono">
          <h3 className="font-black text-slate-900 dark:text-white text-lg">Active Requisitions Overview</h3>

          <div className="space-y-3">
            {jobs.length === 0 ? (
              <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-8 text-center text-slate-400 space-y-2">
                <Briefcase className="h-8 w-8 mx-auto text-slate-300 dark:text-slate-700" />
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">No active job requisitions recorded yet.</p>
                <p className="text-[11px]">Jobs posted by recruiters will appear here automatically.</p>
              </Card>
            ) : (
              jobs.map((j) => (
                <Card key={j.id} className="rounded-2xl border border-slate-200/80 dark:border-slate-800 border-l-4 border-l-indigo-500 bg-white dark:bg-[#0c0e17] p-5 space-y-2 shadow-sm dark:shadow-xl">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                      {j.title} ({j.department || 'Engineering'})
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold uppercase">{j.status}</span>
                  </div>
                  <p className="text-xs text-slate-500">{j.location} • Threshold: {j.passingThreshold}% Cutoff</p>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
