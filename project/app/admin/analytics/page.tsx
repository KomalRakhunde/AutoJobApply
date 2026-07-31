'use client';

import { PageShell } from '@/components/page-shell';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Building2,
  Users,
  Briefcase,
  Layers,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

export default function AdminAnalyticsPage() {
  return (
    <PageShell title="" subtitle="">
      <div className="max-w-6xl mx-auto space-y-6 pb-16 animate-fade-in px-2 sm:px-4 font-mono">
        {/* Top Header - Matching Super Admin Layout & Spacing */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-b border-slate-200/80 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white font-extrabold text-lg shadow-md shadow-indigo-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Pipeline & Analytics <span className="text-xs text-indigo-600 dark:text-indigo-400 font-mono font-normal">v2.4.0</span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">GLOBAL CANDIDATE FUNNEL & DEPARTMENTAL CAPACITY ANALYTICS</p>
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

        {/* 2 Top Metric Cards Grid with Left Accent & Hover Glow */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
          <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 border-l-4 border-l-emerald-500 bg-white dark:bg-[#0f111a] bg-gradient-to-r from-emerald-500/10 via-transparent to-transparent p-5 space-y-2 shadow-sm dark:shadow-xl hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all duration-300">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">AVERAGE TIME TO HIRE</span>
              <Clock className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">18d</div>
            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">↓ 12% faster vs industry benchmark</p>
          </Card>

          <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 border-l-4 border-l-indigo-500 bg-white dark:bg-[#0f111a] bg-gradient-to-r from-indigo-500/10 via-transparent to-transparent p-5 space-y-2 shadow-sm dark:shadow-xl hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all duration-300">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">OFFER ACCEPTANCE RATE</span>
              <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">94%</div>
            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">↑ 2% vs Q2 quarterly target</p>
          </Card>
        </div>

        {/* Bottleneck Alert Card with Left Accent & Hover Glow */}
        <Card className="rounded-2xl border border-amber-500/40 border-l-4 border-l-amber-500 bg-amber-500/10 dark:bg-amber-950/30 bg-gradient-to-r from-amber-500/15 via-transparent to-transparent p-5 flex items-start gap-4 shadow-sm dark:shadow-xl hover:border-amber-500/60 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] transition-all duration-300">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <h4 className="font-extrabold text-amber-600 dark:text-amber-400 text-sm">Critical Bottleneck Detected</h4>
              <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-mono font-bold text-amber-700 dark:text-amber-300 border border-amber-500/40 uppercase">
                Action Required
              </span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-mono">
              Technical Round 2 (System Architecture) has <strong>14 candidates</strong> stuck for more than <strong>48 hours</strong>.
            </p>
          </div>
        </Card>

        {/* Global Funnel Section with Left Accent & Hover Glow */}
        <div className="space-y-4 font-mono">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-slate-900 dark:text-white text-lg">Global Candidate Funnel</h3>
            <span className="rounded-md bg-slate-100 dark:bg-slate-800/80 px-2.5 py-0.5 font-mono text-xs text-slate-600 dark:text-slate-400 font-bold border border-slate-200 dark:border-slate-700">
              Q3 Active Requisitions
            </span>
          </div>

          <div className="space-y-3 font-mono">
            {[
              { stage: 'Sourced Candidates', count: '1,240', border: 'border-l-4 border-l-indigo-500', glow: 'hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)]', bgGrad: 'bg-gradient-to-r from-indigo-500/10 via-transparent to-transparent' },
              { stage: 'AI Screened & Verified', count: '480', border: 'border-l-4 border-l-cyan-400', glow: 'hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)]', bgGrad: 'bg-gradient-to-r from-cyan-500/10 via-transparent to-transparent' },
              { stage: 'Technical Evaluation', count: '160', border: 'border-l-4 border-l-amber-500', glow: 'hover:border-amber-500/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]', bgGrad: 'bg-gradient-to-r from-amber-500/10 via-transparent to-transparent' },
              { stage: 'Offer Letters Dispatched', count: '45', border: 'border-l-4 border-l-purple-500', glow: 'hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]', bgGrad: 'bg-gradient-to-r from-purple-500/10 via-transparent to-transparent' },
              { stage: 'Hired & Onboarded', count: '38', border: 'border-l-4 border-l-emerald-400', glow: 'hover:border-emerald-400/50 hover:shadow-[0_0_20px_rgba(52,211,153,0.15)]', bgGrad: 'bg-gradient-to-r from-emerald-500/10 via-transparent to-transparent' },
            ].map((f, i) => (
              <Card
                key={i}
                className={`rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] ${f.bgGrad} p-5 flex items-center justify-between ${f.border} ${f.glow} shadow-sm dark:shadow-xl transition-all duration-300 cursor-pointer`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-extrabold text-slate-900 dark:text-white text-base">{f.stage}</span>
                </div>
                <span className="font-black text-2xl text-slate-900 dark:text-white tracking-tight">{f.count}</span>
              </Card>
            ))}
          </div>
        </div>

        {/* Departmental Load Section with Left Accent & Hover Glow */}
        <div className="space-y-4 pt-2 font-mono">
          <h3 className="font-black text-slate-900 dark:text-white text-lg">Departmental Hiring Capacity</h3>

          <div className="space-y-3">
            {[
              { icon: '<>', name: 'Engineering & Technology', filled: '12 / 15 Filled', pct: 80, border: 'border-l-4 border-l-indigo-500', bgGrad: 'bg-gradient-to-r from-indigo-500/10 via-transparent to-transparent', glow: 'hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)]', color: 'bg-indigo-500' },
              { icon: '💼', name: 'Product & Design', filled: '4 / 10 Filled', pct: 40, border: 'border-l-4 border-l-cyan-400', bgGrad: 'bg-gradient-to-r from-cyan-500/10 via-transparent to-transparent', glow: 'hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)]', color: 'bg-cyan-400' },
              { icon: '📈', name: 'Sales & Growth', filled: '22 / 25 Filled', pct: 88, border: 'border-l-4 border-l-amber-500', bgGrad: 'bg-gradient-to-r from-amber-500/10 via-transparent to-transparent', glow: 'hover:border-amber-500/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]', color: 'bg-amber-500' },
            ].map((d, i) => (
              <Card key={i} className={`rounded-2xl border border-slate-200/80 dark:border-slate-800 ${d.border} ${d.bgGrad} ${d.glow} bg-white dark:bg-[#0c0e17] p-5 space-y-3 shadow-sm dark:shadow-xl transition-all duration-300 cursor-pointer`}>
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                    <span className="text-slate-400">{d.icon}</span> {d.name}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 font-bold">{d.filled}</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800/80 overflow-hidden">
                  <div className={`h-full ${d.color} rounded-full transition-all duration-500`} style={{ width: `${d.pct}%` }} />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
