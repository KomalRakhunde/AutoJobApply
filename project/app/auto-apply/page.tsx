'use client';

import { useEffect, useState } from 'react';
import { PageShell } from '@/components/page-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Bot,
  Zap,
  SlidersHorizontal,
  DollarSign,
  Briefcase,
  Globe,
  Building2,
  ShieldAlert,
  Play,
  Pause,
  Clock,
  Activity,
  Layers,
  Sparkles,
  RefreshCw,
  Plus,
  X,
  CheckCircle2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { AutoApplyConfig, AutoApplyLog } from '@/lib/types';

const DEFAULT_PORTALS = [
  { name: 'LinkedIn Jobs', connected: true, lastSynced: '5 mins ago' },
  { name: 'Naukri.com', connected: true, lastSynced: '12 mins ago' },
  { name: 'Indeed', connected: true, lastSynced: '1 hour ago' },
  { name: 'Glassdoor', connected: false, lastSynced: 'Not connected' },
  { name: 'Wellfound (AngelList)', connected: true, lastSynced: '30 mins ago' },
  { name: 'Foundit (Monster)', connected: false, lastSynced: 'Not connected' },
];

export default function AutoApplyPage() {
  const { toast } = useToast();
  const [config, setConfig] = useState<AutoApplyConfig>({
    enabled: true,
    minSalary: '$110,000 / 20 LPA',
    experienceYears: '3 - 8 years',
    workMode: 'remote',
    requiredSkills: ['React', 'TypeScript', 'Next.js', 'Node.js'],
    excludedCompanies: ['Staffing Solutions', 'Third-Party Recruiters', 'CyberConsulting'],
    maxDailyApplications: 25,
    connectedPortals: DEFAULT_PORTALS,
  });

  const [logs, setLogs] = useState<AutoApplyLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newSkill, setNewSkill] = useState('');
  const [newExclude, setNewExclude] = useState('');

  useEffect(() => {
    async function loadLogs() {
      setIsLoading(true);
      try {
        const res = await fetch('/api/auto-apply/logs');
        if (res.ok) {
          const data = await res.json();
          setLogs(data.logs || []);
        } else {
          setLogs([]);
        }
      } catch {
        setLogs([]);
      } finally {
        setIsLoading(false);
      }
    }
    loadLogs();
  }, []);

  const toggleAutomation = () => {
    const nextState = !config.enabled;
    setConfig((prev) => ({ ...prev, enabled: nextState }));
    toast({
      title: nextState ? '⚡ Auto-Apply Engine Activated' : '⏸️ Auto-Apply Engine Paused',
      description: nextState
        ? 'AI is now actively monitoring portals and applying to matching roles.'
        : 'Automation engine has been safely paused.',
    });
  };

  const addSkill = () => {
    if (!newSkill.trim()) return;
    if (config.requiredSkills.includes(newSkill.trim())) return;
    setConfig((prev) => ({
      ...prev,
      requiredSkills: [...prev.requiredSkills, newSkill.trim()],
    }));
    setNewSkill('');
  };

  const removeSkill = (s: string) => {
    setConfig((prev) => ({
      ...prev,
      requiredSkills: prev.requiredSkills.filter((item) => item !== s),
    }));
  };

  const addExclude = () => {
    if (!newExclude.trim()) return;
    if (config.excludedCompanies.includes(newExclude.trim())) return;
    setConfig((prev) => ({
      ...prev,
      excludedCompanies: [...prev.excludedCompanies, newExclude.trim()],
    }));
    setNewExclude('');
  };

  const removeExclude = (c: string) => {
    setConfig((prev) => ({
      ...prev,
      excludedCompanies: prev.excludedCompanies.filter((item) => item !== c),
    }));
  };

  const triggerInstantRun = async () => {
    toast({
      title: '⚡ Instant Cycle Triggered',
      description: 'Running auto-apply cycle against matched open requisitions...',
    });
    try {
      const res = await fetch('/api/auto-apply/run', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        if (data.logs) {
          setLogs((prev) => [...data.logs, ...prev]);
        }
      }
    } catch {
      // Handled
    }
  };

  return (
    <PageShell title="" subtitle="">
      <div className="max-w-6xl mx-auto space-y-6 pb-16 animate-fade-in px-2 sm:px-4 font-mono text-xs">
        {/* Top Header - Executive Suite Standard */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-b border-slate-200/80 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white font-extrabold text-lg shadow-md shadow-indigo-500/20">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Auto-Apply Engine <span className="text-xs text-indigo-600 dark:text-indigo-400 font-mono font-normal">v2.4.0</span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">AUTO-APPLY BOT & MATCHING RULES</p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <Button
              variant={config.enabled ? 'default' : 'outline'}
              size="sm"
              onClick={toggleAutomation}
              className={`gap-2 rounded-xl text-xs font-mono font-bold ${
                config.enabled ? 'bg-indigo-600 text-white shadow-sm' : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              {config.enabled ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              <span>{config.enabled ? 'Pause Bot' : 'Start Bot'}</span>
            </Button>
            <Button
              size="sm"
              onClick={triggerInstantRun}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-bold rounded-xl gap-1.5 shadow-sm"
            >
              <Zap className="h-3.5 w-3.5" />
              <span>Run Cycle Now</span>
            </Button>
            <Avatar className="h-9 w-9 border border-indigo-500/40">
              <AvatarFallback className="bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-extrabold text-xs">
                KR
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Status Banner Card with Left Accent & Hover Glow */}
        <Card className={`rounded-3xl border ${config.enabled ? 'border-emerald-500/40 border-l-8 border-l-emerald-500 bg-gradient-to-r from-emerald-500/10 via-transparent to-transparent' : 'border-amber-500/40 border-l-8 border-l-amber-500 bg-gradient-to-r from-amber-500/10 via-transparent to-transparent'} p-6 space-y-3 shadow-sm dark:shadow-2xl hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all duration-300`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${config.enabled ? 'bg-emerald-600 text-white shadow-md' : 'bg-amber-600 text-white shadow-md'}`}>
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-slate-900 dark:text-white text-base">
                    Automation Engine: {config.enabled ? 'ACTIVE & MONITORING' : 'PAUSED'}
                  </h3>
                  <Badge className={config.enabled ? 'bg-emerald-500 text-white font-bold text-[10px]' : 'bg-amber-500 text-white font-bold text-[10px]'}>
                    {config.enabled ? 'RUNNING' : 'PAUSED'}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                  {config.enabled
                    ? 'AI scans job portals every 5 minutes and auto-submits applications matching your rules.'
                    : 'Auto-apply is currently paused. Click Start Bot anytime to resume.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-bold text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                <Clock className="h-4 w-4" /> Interval: 5m
              </span>
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <Activity className="h-4 w-4" /> Daily Cap: {config.maxDailyApplications}/day
              </span>
            </div>
          </div>
        </Card>

        {/* 2-Column Main Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono">
          {/* Left Panel: Smart Rules Settings */}
          <Card className="lg:col-span-1 rounded-3xl border border-slate-200/80 dark:border-slate-800 border-l-4 border-l-indigo-500 bg-white dark:bg-[#0c0e17] bg-gradient-to-r from-indigo-500/10 via-transparent to-transparent p-6 space-y-5 shadow-sm dark:shadow-2xl hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all duration-300">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <span>Smart Filter Rules</span>
              </h3>
              <p className="text-slate-400 font-normal">Configure automated application parameters</p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-slate-400 uppercase">TARGET SALARY FLOOR</Label>
                <Input
                  value={config.minSalary}
                  onChange={(e) => setConfig((p) => ({ ...p, minSalary: e.target.value }))}
                  className="rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#121522] font-mono text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-slate-400 uppercase">REQUIRED TECH SKILLS</Label>
                <div className="flex gap-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add skill (e.g. Next.js)..."
                    className="rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#121522] font-mono text-xs text-slate-900 dark:text-white"
                  />
                  <Button onClick={addSkill} size="sm" className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {config.requiredSkills.map((s) => (
                    <span key={s} className="inline-flex items-center gap-1 rounded-md bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/40 px-2 py-0.5 text-[10px] font-bold">
                      {s}
                      <X className="h-3 w-3 cursor-pointer hover:text-rose-500" onClick={() => removeSkill(s)} />
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <Label className="text-[10px] font-bold text-slate-400 uppercase">EXCLUDED COMPANIES / AGENCIES</Label>
                <div className="flex gap-2">
                  <Input
                    value={newExclude}
                    onChange={(e) => setNewExclude(e.target.value)}
                    placeholder="Add company to block..."
                    className="rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#121522] font-mono text-xs text-slate-900 dark:text-white"
                  />
                  <Button onClick={addExclude} size="sm" className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {config.excludedCompanies.map((c) => (
                    <span key={c} className="inline-flex items-center gap-1 rounded-md bg-rose-50 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-200 dark:border-rose-500/40 px-2 py-0.5 text-[10px] font-bold">
                      {c}
                      <X className="h-3 w-3 cursor-pointer hover:text-white" onClick={() => removeExclude(c)} />
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Right Panel: Portal Connections & Audit Logs */}
          <div className="lg:col-span-2 space-y-6 font-mono">
            {/* Connected Portals Card */}
            <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 border-l-4 border-l-cyan-400 bg-white dark:bg-[#0c0e17] bg-gradient-to-r from-cyan-500/10 via-transparent to-transparent p-6 space-y-4 shadow-sm dark:shadow-2xl hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] transition-all duration-300">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
                  <Globe className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                  <span>Connected Job Portals</span>
                </h3>
                <span className="text-[10px] font-bold text-slate-400 uppercase">4 OF 6 CONNECTED</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {config.connectedPortals.map((p) => (
                  <div
                    key={p.name}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#121522] border border-slate-200/60 dark:border-slate-800 flex items-center justify-between shadow-sm"
                  >
                    <div>
                      <h4 className="font-extrabold text-slate-900 dark:text-white text-xs">{p.name}</h4>
                      <p className="text-[10px] text-slate-400">Synced: {p.lastSynced}</p>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border ${p.connected ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/40' : 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400'}`}>
                      {p.connected ? 'CONNECTED' : 'OFFLINE'}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Live Audit Log Card */}
            <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 border-l-4 border-l-emerald-400 bg-white dark:bg-[#0c0e17] bg-gradient-to-r from-emerald-500/10 via-transparent to-transparent p-6 space-y-4 shadow-sm dark:shadow-2xl hover:border-emerald-400/50 hover:shadow-[0_0_20px_rgba(52,211,153,0.15)] transition-all duration-300">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
                  <Activity className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Real-time Submission Log</span>
                </h3>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">LIVE STREAM</span>
              </div>

              <div className="space-y-3">
                {isLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-16 w-full rounded-2xl" />
                    <Skeleton className="h-16 w-full rounded-2xl" />
                  </div>
                ) : logs.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 space-y-1 font-mono">
                    <p className="font-bold text-xs text-slate-900 dark:text-white">No submission logs recorded yet</p>
                    <p className="text-[10px]">Click "Run Cycle Now" above to initiate automated job submissions.</p>
                  </div>
                ) : (
                  logs.map((log) => (
                    <div
                      key={log.id}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-[#121522] border border-slate-200/60 dark:border-slate-800 flex items-center justify-between gap-4 hover:border-indigo-500/40 transition-all shadow-sm"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-slate-900 dark:text-white text-xs">{log.jobTitle}</h4>
                          <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">• {log.company}</span>
                        </div>
                        <p className="text-[10px] text-slate-400">{log.portal} • {log.timestamp}</p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs">{log.matchScore}% Match</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border ${log.status === 'submitted' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/40' : 'bg-amber-50 text-amber-700 dark:bg-amber-950/80 dark:text-amber-400 border-amber-200 dark:border-amber-500/40'}`}>
                          {log.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
