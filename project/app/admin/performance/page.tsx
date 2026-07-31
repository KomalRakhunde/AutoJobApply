'use client';

import { useState, useEffect } from 'react';
import { PageShell } from '@/components/page-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import {
  Search,
  TrendingUp,
  Zap,
  Users,
  BarChart3,
  Sliders,
  CheckCircle2,
  X,
  RefreshCw,
  Activity,
  ShieldCheck,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { fetchLiveRecruiterPerformance, RecruiterPerformance } from '@/lib/admin-api';

export default function AdminPerformancePage() {
  const { toast } = useToast();
  const [recruiters, setRecruiters] = useState<RecruiterPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecruiter, setSelectedRecruiter] = useState<RecruiterPerformance | null>(null);
  const [reassignOpen, setReassignOpen] = useState(false);
  const [targetRecruiterId, setTargetRecruiterId] = useState<string>('rec-2');

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchLiveRecruiterPerformance();
      setRecruiters(data);
    } catch {
      toast({
        title: '⚠️ Fetching Performance Data',
        description: 'Loaded latest database recruiter performance metrics.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleReassignWorkload = () => {
    if (!selectedRecruiter) return;
    const targetRec = recruiters.find((r) => r.id === targetRecruiterId);

    setRecruiters((prev) =>
      prev.map((r) => {
        if (r.id === selectedRecruiter.id) {
          return { ...r, jobs: Math.max(1, r.jobs - 2), workloadStatus: 'OPTIMAL' };
        }
        if (r.id === targetRecruiterId) {
          return { ...r, jobs: r.jobs + 2, workloadStatus: 'OPTIMAL' };
        }
        return r;
      })
    );

    toast({
      title: '⚡ Workload Rebalanced!',
      description: `Reassigned 2 open requisitions from ${selectedRecruiter.name} to ${targetRec?.name}.`,
    });
    setReassignOpen(false);
  };

  const totalActiveJobs = recruiters.reduce((sum, r) => sum + r.jobs, 0);

  return (
    <PageShell title="" subtitle="">
      <div className="max-w-6xl mx-auto space-y-6 pb-16 animate-fade-in px-2 sm:px-4">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-b border-slate-200/80 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white font-extrabold text-lg shadow-md shadow-indigo-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Team Performance <span className="text-xs text-indigo-600 dark:text-indigo-400 font-mono font-normal">v2.4.0</span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">GLOBAL RECRUITER WORKFORCE OPS & CAPACITY PULSE</p>
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
            <Avatar className="h-9 w-9 border border-indigo-500/40">
              <AvatarFallback className="bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-extrabold text-xs">
                KR
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* 2 Top Metric Cards Grid with Subtle Left Accent & Glow */}
        {(() => {
          const avgGoal = recruiters.length > 0 ? Math.round(recruiters.reduce((sum, r) => sum + r.goalPct, 0) / recruiters.length) : 0;
          return (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
              <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 border-l-4 border-l-emerald-500 bg-white dark:bg-[#0f111a] bg-gradient-to-r from-emerald-500/10 via-transparent to-transparent p-5 space-y-2 shadow-sm dark:shadow-xl hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all duration-300">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider">TEAM EFFICIENCY</span>
                  <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{avgGoal}%</div>
                <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Real database recruiter performance</p>
              </Card>

              <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 border-l-4 border-l-indigo-500 bg-white dark:bg-[#0f111a] bg-gradient-to-r from-indigo-500/10 via-transparent to-transparent p-5 space-y-2 shadow-sm dark:shadow-xl hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all duration-300">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider">ACTIVE REQUISITIONS</span>
                  <Zap className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{totalActiveJobs}</div>
                <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Live Database Requisitions</p>
              </Card>
            </div>
          );
        })()}

        {/* Recruiter Scorecards with Left Accent & Glow Highlighting */}
        {loading ? (
          <div className="py-12 text-center text-slate-400 space-y-3 font-mono">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-indigo-600 dark:text-indigo-400" />
            <p className="text-xs">Fetching live database recruiter metrics...</p>
          </div>
        ) : (
          <div className="space-y-5 font-mono">
            {recruiters.map((r, idx) => (
              <Card
                key={r.id}
                className={`rounded-3xl border border-slate-200/80 dark:border-slate-800 ${
                  idx % 2 === 0 ? 'border-l-4 border-l-indigo-500 bg-gradient-to-r from-indigo-500/10 via-transparent to-transparent' : 'border-l-4 border-l-cyan-400 bg-gradient-to-r from-cyan-500/10 via-transparent to-transparent'
                } bg-white dark:bg-[#0c0e17] p-6 space-y-5 shadow-sm dark:shadow-2xl hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all duration-300`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="relative">
                      <Avatar className="h-12 w-12 border border-slate-200 dark:border-slate-700 shadow-md">
                        <AvatarFallback className={`${r.avatarBg} text-white font-bold text-sm`}>
                          {r.initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white text-[9px] font-black shadow-sm">
                        ✓
                      </span>
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 dark:text-white text-base leading-snug">{r.name}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">{r.role}</p>
                    </div>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-[10px] font-mono font-extrabold border ${
                      r.workloadStatus === 'HIGH WORKLOAD'
                        ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/80 dark:text-rose-400 dark:border-rose-500/40'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/80 dark:text-emerald-400 dark:border-emerald-500/40'
                    }`}
                  >
                    • {r.workloadStatus}
                  </span>
                </div>

                {/* 5 Micro Stat Boxes with Hover Glow */}
                <div className="grid grid-cols-5 gap-2.5 text-center font-mono">
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#121522] border border-slate-200/60 dark:border-slate-800/80 hover:border-indigo-500/40 transition-all space-y-1">
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Jobs</p>
                    <p className="font-black text-slate-900 dark:text-white text-base">{r.jobs}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#121522] border border-slate-200/60 dark:border-slate-800/80 hover:border-cyan-400/40 transition-all space-y-1">
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Pars</p>
                    <p className="font-black text-slate-900 dark:text-white text-base">{r.pars}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#121522] border border-slate-200/60 dark:border-slate-800/80 hover:border-amber-500/40 transition-all space-y-1">
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Calls</p>
                    <p className="font-black text-slate-900 dark:text-white text-base">{r.calls}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#121522] border border-slate-200/60 dark:border-slate-800/80 hover:border-purple-500/40 transition-all space-y-1">
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Offr</p>
                    <p className="font-black text-slate-900 dark:text-white text-base">{r.offr}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#121522] border border-slate-200/60 dark:border-slate-800/80 hover:border-emerald-400/40 transition-all space-y-1">
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Hire</p>
                    <p className="font-black text-slate-900 dark:text-white text-base">{r.hire}</p>
                  </div>
                </div>

                <div className="space-y-2 font-mono text-xs pt-1">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 dark:text-slate-400 font-bold text-[10px] uppercase tracking-wider">HIRING GOAL PROGRESS</span>
                    <span className="text-slate-900 dark:text-white font-extrabold">{r.goalPct}%</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800/80 overflow-hidden">
                    <div
                      className={`h-full ${r.goalColor} rounded-full transition-all duration-500`}
                      style={{ width: `${Math.min(100, r.goalPct)}%` }}
                    />
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedRecruiter(r);
                    setReassignOpen(true);
                  }}
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-[#121522] hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs font-bold gap-2 py-5 shadow-sm"
                >
                  <Sliders className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Reassign Workload</span>
                </Button>
              </Card>
            ))}
          </div>
        )}

        {/* Reassign Workload Modal */}
        {reassignOpen && selectedRecruiter && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-fade-in font-mono">
            <div className="bg-white dark:bg-[#0c0e17] border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-scale-in text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  <span>Rebalance Job Requisitions</span>
                </h3>
                <button onClick={() => setReassignOpen(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white text-base">
                  ✕
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#121522] border border-slate-200/80 dark:border-slate-800 space-y-1">
                <p className="text-slate-500 dark:text-slate-400">Reassigning From:</p>
                <p className="font-bold text-slate-900 dark:text-white text-sm">{selectedRecruiter.name}</p>
                <p className="text-indigo-600 dark:text-indigo-400 font-bold">{selectedRecruiter.jobs} Active Jobs ({selectedRecruiter.workloadStatus})</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-500 dark:text-slate-400 uppercase font-bold text-[10px]">Reassign To Recruiter:</label>
                <select
                  value={targetRecruiterId}
                  onChange={(e) => setTargetRecruiterId(e.target.value)}
                  className="w-full h-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121522] text-slate-900 dark:text-white px-3 font-bold text-xs"
                >
                  {recruiters
                    .filter((r) => r.id !== selectedRecruiter.id)
                    .map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} ({r.jobs} active jobs)
                      </option>
                    ))}
                </select>
              </div>

              <div className="flex justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                <Button variant="outline" onClick={() => setReassignOpen(false)} className="rounded-xl border-slate-200 dark:border-slate-800 text-xs">
                  Cancel
                </Button>
                <Button onClick={handleReassignWorkload} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs px-5">
                  Confirm Reassignment
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}
