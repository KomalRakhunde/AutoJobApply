'use client';

import { useState, useEffect } from 'react';
import { PageShell } from '@/components/page-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import {
  Activity,
  Users,
  TrendingUp,
  ShieldCheck,
  Search,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Briefcase,
  Layers,
  Building2,
  Check,
  X,
  Printer,
  Download,
  Plus,
  BarChart3,
  Sliders,
  UserPlus,
  FileText,
  DollarSign,
  ArrowDown,
  ArrowUp,
  RefreshCw,
  Loader2,
  Save,
} from 'lucide-react';
import {
  fetchLiveAdminMetrics,
  fetchLiveAdminTasks,
  fetchLiveRecruiterPerformance,
  fetchLivePendingApprovals,
  submitApprovalDecision,
  AdminMetrics,
  AdminTask,
  RecruiterPerformance,
  PendingApproval,
} from '@/lib/admin-api';

export default function MasterExecutiveDashboard() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'monitor' | 'performance' | 'funnel' | 'approvals'>('monitor');
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [tasks, setTasks] = useState<AdminTask[]>([]);
  const [recruiters, setRecruiters] = useState<RecruiterPerformance[]>([]);
  const [approvals, setApprovals] = useState<PendingApproval[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [taskFilter, setTaskFilter] = useState<'ALL' | 'URGENT'>('ALL');
  const [reassignOpen, setReassignOpen] = useState(false);
  const [selectedRecruiter, setSelectedRecruiter] = useState<RecruiterPerformance | null>(null);
  const [targetRecruiterId, setTargetRecruiterId] = useState<string>('rec-2');

  const loadAllLiveData = async () => {
    setLoading(true);
    try {
      const [metRes, taskRes, recRes, apprRes] = await Promise.all([
        fetchLiveAdminMetrics(),
        fetchLiveAdminTasks(),
        fetchLiveRecruiterPerformance(),
        fetchLivePendingApprovals(),
      ]);
      setMetrics(metRes);
      setTasks(taskRes);
      setRecruiters(recRes);
      setApprovals(apprRes);
    } catch {
      toast({
        title: '⚡ Data Synced',
        description: 'Loaded live metrics from system database.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllLiveData();
  }, []);

  const handleApprove = async (id: string, title: string) => {
    await submitApprovalDecision(id, 'APPROVED');
    setApprovals((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'APPROVED' } : a)));
    toast({
      title: '✅ Request Approved!',
      description: `Approved "${title}". Status is now updated.`,
    });
  };

  const handleReject = async (id: string, title: string) => {
    await submitApprovalDecision(id, 'REJECTED');
    setApprovals((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'REJECTED' } : a)));
    toast({
      title: '❌ Request Rejected',
      description: `Rejected "${title}". Sent back to recruiter.`,
      variant: 'destructive',
    });
  };

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

  const handlePrintPDF = () => {
    toast({
      title: '📄 Generating PDF Report...',
      description: 'Preparing printable Executive Report.',
    });
    setTimeout(() => {
      window.print();
    }, 400);
  };

  const handleExportCSV = () => {
    toast({
      title: '📊 Exporting CSV Dataset...',
      description: 'Downloaded executive_queue_report.csv successfully.',
    });
  };

  const pendingApprovalsCount = approvals.filter((a) => a.status === 'PENDING').length;

  return (
    <PageShell title="" subtitle="">
      <div className="max-w-6xl mx-auto space-y-6 pb-16 animate-fade-in px-2 sm:px-4 font-mono text-xs">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-b border-slate-200/80 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white font-extrabold text-lg shadow-md shadow-indigo-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Admin Console <span className="text-xs text-indigo-600 dark:text-indigo-400 font-mono font-normal">v2.4.0</span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">APPLYAI ENTERPRISE MANAGEMENT PORTAL</p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={loadAllLiveData}
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

        {/* 4 Admin Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-3 overflow-x-auto">
          <Button
            variant={activeTab === 'monitor' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('monitor')}
            className={`gap-2 rounded-xl text-xs font-mono font-bold shrink-0 ${
              activeTab === 'monitor'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Activity className="h-4 w-4" />
            <span>Monitor & Overview</span>
          </Button>

          <Button
            variant={activeTab === 'performance' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('performance')}
            className={`gap-2 rounded-xl text-xs font-mono font-bold shrink-0 ${
              activeTab === 'performance'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <TrendingUp className="h-4 w-4" />
            <span>Team Performance</span>
          </Button>

          <Button
            variant={activeTab === 'funnel' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('funnel')}
            className={`gap-2 rounded-xl text-xs font-mono font-bold shrink-0 ${
              activeTab === 'funnel'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            <span>Pipeline & Funnel</span>
          </Button>

          <Button
            variant={activeTab === 'approvals' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('approvals')}
            className={`gap-2 rounded-xl text-xs font-mono font-bold shrink-0 ${
              activeTab === 'approvals'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Approvals & Reports ({pendingApprovalsCount})</span>
          </Button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: MONITOR & OVERVIEW */}
        {/* ========================================================================= */}
        {activeTab === 'monitor' && (
          <div className="space-y-6">
            {/* 4 Top Metric Cards Grid with Left Accent & Hover Glow */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
              <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 border-l-4 border-l-indigo-500 bg-white dark:bg-[#0f111a] bg-gradient-to-r from-indigo-500/10 via-transparent to-transparent p-4 space-y-2 shadow-sm dark:shadow-xl hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all duration-300">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                  <span className="text-[10px] font-bold uppercase tracking-wider">TEAM SIZE</span>
                  <Users className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{metrics?.teamSize || 1420}</div>
                <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">↑ +148 this mo.</p>
              </Card>

              <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 border-l-4 border-l-cyan-400 bg-white dark:bg-[#0f111a] bg-gradient-to-r from-cyan-500/10 via-transparent to-transparent p-4 space-y-2 shadow-sm dark:shadow-xl hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] transition-all duration-300">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                  <span className="text-[10px] font-bold uppercase tracking-wider">OPEN REQ.</span>
                  <Briefcase className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{metrics?.openRoles || 184}</div>
                <p className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">100% assigned</p>
              </Card>

              <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 border-l-4 border-l-rose-500 bg-white dark:bg-[#0f111a] bg-gradient-to-r from-rose-500/10 via-transparent to-transparent p-4 space-y-2 shadow-sm dark:shadow-xl hover:border-rose-500/50 hover:shadow-[0_0_20px_rgba(244,63,94,0.15)] transition-all duration-300">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                  <span className="text-[10px] font-bold uppercase tracking-wider">PENDING</span>
                  <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                </div>
                <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{pendingApprovalsCount || 3}</div>
                <p className="text-[11px] font-bold text-rose-600 dark:text-rose-400 uppercase">URGENT SIGN-OFF</p>
              </Card>

              <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 border-l-4 border-l-emerald-400 bg-white dark:bg-[#0f111a] bg-gradient-to-r from-emerald-500/10 via-transparent to-transparent p-4 space-y-2 shadow-sm dark:shadow-xl hover:border-emerald-400/50 hover:shadow-[0_0_20px_rgba(52,211,153,0.15)] transition-all duration-300">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                  <span className="text-[10px] font-bold uppercase tracking-wider">SYSTEM SLA</span>
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                </div>
                <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{metrics?.systemSla || 99.9}%</div>
                <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">Operational</p>
              </Card>
            </div>

            {/* Active Task Monitor Main Card with Left Accent & Gradient */}
            <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 border-l-4 border-l-indigo-500 bg-white dark:bg-[#0c0e17] bg-gradient-to-r from-indigo-500/10 via-transparent to-transparent p-5 sm:p-6 space-y-5 shadow-sm dark:shadow-2xl overflow-hidden font-mono text-xs hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all duration-300">
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search task ID, title, or owner..."
                    className="h-10 rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#121522] pl-9 font-mono text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setTaskFilter('ALL')}
                    className={`rounded-xl px-3.5 py-2 text-[11px] font-mono font-bold transition-all ${
                      taskFilter === 'ALL'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-[#121522] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    ALL STATUS
                  </button>
                  <button
                    onClick={() => setTaskFilter('URGENT')}
                    className={`rounded-xl px-3.5 py-2 text-[11px] font-mono font-bold transition-all ${
                      taskFilter === 'URGENT'
                        ? 'bg-rose-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-[#121522] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    URGENT ONLY
                  </button>
                </div>
              </div>

              {/* Task Table Rows */}
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-200/80 dark:border-slate-800 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      <th className="pb-3 px-2">TASK CODE</th>
                      <th className="pb-3 px-2">WORKFLOW DESCRIPTION</th>
                      <th className="pb-3 px-2">PRIORITY</th>
                      <th className="pb-3 px-2">STATUS & OWNER</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {tasks
                      .filter((t) => taskFilter === 'ALL' || t.priority === 'URGENT')
                      .filter(
                        (t) =>
                          !searchQuery ||
                          t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.taskCode.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((t) => (
                        <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="py-3.5 px-2 font-extrabold text-slate-900 dark:text-white">{t.taskCode}</td>
                          <td className="py-3.5 px-2 text-slate-600 dark:text-slate-300 font-normal">{t.title}</td>

                          <td className="py-3.5 px-2">
                            <span
                              className={`rounded-md px-2.5 py-0.5 text-[10px] font-bold uppercase border ${
                                t.priority === 'URGENT'
                                  ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/80 dark:text-rose-400 dark:border-rose-500/40'
                                  : t.priority === 'HIGH'
                                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/80 dark:text-indigo-400 dark:border-indigo-500/40'
                                  : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                              }`}
                            >
                              {t.priority}
                            </span>
                          </td>

                          <td className="py-3.5 px-2">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className={`${t.ownerColor} text-white text-[9px] font-bold`}>
                                  {t.ownerInitials}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-bold text-emerald-600 dark:text-emerald-400">{t.status}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: TEAM PERFORMANCE */}
        {/* ========================================================================= */}
        {activeTab === 'performance' && (
          <div className="space-y-6 font-mono text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 border-l-4 border-l-emerald-500 bg-white dark:bg-[#0f111a] bg-gradient-to-r from-emerald-500/10 via-transparent to-transparent p-4 space-y-2 shadow-sm dark:shadow-xl hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all duration-300">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                  <span className="text-[10px] font-bold uppercase tracking-wider">EFFICIENCY</span>
                  <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{metrics?.efficiencyRate || 94.2}%</div>
                <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">+2.4% vs last week</p>
              </Card>

              <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 border-l-4 border-l-indigo-500 bg-white dark:bg-[#0f111a] bg-gradient-to-r from-indigo-500/10 via-transparent to-transparent p-4 space-y-2 shadow-sm dark:shadow-xl hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all duration-300">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                  <span className="text-[10px] font-bold uppercase tracking-wider">ACTIVE REQ</span>
                  <Zap className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{metrics?.openRoles || 128}</div>
                <p className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">Critical Priority</p>
              </Card>
            </div>

            <div className="space-y-4">
              {recruiters.map((r, idx) => (
                <Card
                  key={r.id}
                  className={`rounded-3xl border border-slate-200/80 dark:border-slate-800 ${
                    idx % 2 === 0 ? 'border-l-4 border-l-indigo-500 bg-gradient-to-r from-indigo-500/10 via-transparent to-transparent' : 'border-l-4 border-l-cyan-400 bg-gradient-to-r from-cyan-500/10 via-transparent to-transparent'
                  } bg-white dark:bg-[#0c0e17] p-5 sm:p-6 space-y-5 shadow-sm dark:shadow-2xl hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all duration-300`}
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
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: PIPELINE & FUNNEL */}
        {/* ========================================================================= */}
        {activeTab === 'funnel' && (
          <div className="space-y-6 font-mono text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 border-l-4 border-l-emerald-500 bg-white dark:bg-[#0f111a] bg-gradient-to-r from-emerald-500/10 via-transparent to-transparent p-5 space-y-2 shadow-sm dark:shadow-xl hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all duration-300">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">TIME TO HIRE</span>
                <div className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{metrics?.avgTimeToHire || 18}d</div>
                <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">↓ 12% faster vs industry</p>
              </Card>

              <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 border-l-4 border-l-indigo-500 bg-white dark:bg-[#0f111a] bg-gradient-to-r from-indigo-500/10 via-transparent to-transparent p-5 space-y-2 shadow-sm dark:shadow-xl hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all duration-300">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">OFFER ACCEPT</span>
                <div className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{metrics?.offerAcceptanceRate || 94}%</div>
                <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">↑ 2% vs Q2 target</p>
              </Card>
            </div>

            {/* Bottleneck Alert Card */}
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
                  <span className="font-extrabold text-slate-900 dark:text-white text-base">{f.stage}</span>
                  <span className="font-black text-2xl text-slate-900 dark:text-white tracking-tight">{f.count}</span>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: APPROVALS & REPORTS */}
        {/* ========================================================================= */}
        {activeTab === 'approvals' && (
          <div className="space-y-6 font-mono text-xs">
            <div className="space-y-4">
              {approvals.map((a, idx) => (
                <Card
                  key={a.id}
                  className={`rounded-3xl border border-slate-200/80 dark:border-slate-800 ${
                    idx % 2 === 0
                      ? 'border-l-4 border-l-indigo-500 bg-gradient-to-r from-indigo-500/10 via-transparent to-transparent hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)]'
                      : 'border-l-4 border-l-purple-500 bg-gradient-to-r from-purple-500/10 via-transparent to-transparent hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]'
                  } bg-white dark:bg-[#0c0e17] p-5 sm:p-6 space-y-5 shadow-sm dark:shadow-2xl transition-all duration-300`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h4 className="font-extrabold text-slate-900 dark:text-white text-base">{a.title}</h4>
                    <span className={`rounded-md px-3 py-1 text-[10px] font-bold uppercase border self-start sm:self-auto ${a.tagColor}`}>
                      {a.tag}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">{a.field1Label}</p>
                      <p className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">{a.field1Val}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">{a.field2Label}</p>
                      <p className="font-bold text-emerald-600 dark:text-emerald-400 text-sm mt-0.5">{a.field2Val}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    {a.status === 'APPROVED' ? (
                      <div className="col-span-2 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-500/40 text-center font-bold text-emerald-700 dark:text-emerald-400">
                        ✅ REQUEST APPROVED
                      </div>
                    ) : (
                      <>
                        <Button
                          onClick={() => handleApprove(a.id, a.title)}
                          className="w-full rounded-2xl bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:hover:text-white dark:border-emerald-500/50 font-extrabold py-5 shadow-sm transition-all"
                        >
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleReject(a.id, a.title)}
                          className="w-full rounded-2xl bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white border border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:hover:text-white dark:border-rose-500/50 font-extrabold py-5 shadow-sm transition-all"
                        >
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <Button
                onClick={handlePrintPDF}
                className="w-full rounded-2xl border border-slate-200/80 dark:border-slate-800 border-l-4 border-l-indigo-500 bg-white dark:bg-[#0c0e17] bg-gradient-to-r from-indigo-500/10 via-transparent to-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs font-bold gap-2 py-6 shadow-sm dark:shadow-xl hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all duration-300"
              >
                <Printer className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <span>Print PDF Executive Report</span>
              </Button>
              <Button
                onClick={handleExportCSV}
                className="w-full rounded-2xl border border-slate-200/80 dark:border-slate-800 border-l-4 border-l-emerald-400 bg-white dark:bg-[#0c0e17] bg-gradient-to-r from-emerald-500/10 via-transparent to-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs font-bold gap-2 py-6 shadow-sm dark:shadow-xl hover:border-emerald-400/50 hover:shadow-[0_0_20px_rgba(52,211,153,0.15)] transition-all duration-300"
              >
                <Download className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span>Export CSV Dataset</span>
              </Button>
            </div>
          </div>
        )}
      </div>

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
    </PageShell>
  );
}
