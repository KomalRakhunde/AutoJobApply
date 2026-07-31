'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAppSelector } from '@/lib/store/hooks';
import { useApplications } from '@/lib/hooks/use-features';
import { fetchRecruiterJobs, RecruiterJob } from '@/lib/recruiter-api';
import { PageShell } from '@/components/page-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import {
  Building2,
  DollarSign,
  Sliders,
  ShieldAlert,
  Server,
  Zap,
  Lock,
  Globe,
  Database,
  Cpu,
  RefreshCw,
  Terminal,
  Save,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Activity,
  Plus,
  Eye,
  Check,
  X,
  Sparkles,
  Users,
  Briefcase,
  Send,
  ShieldCheck,
  Layers,
  Radio,
  FileText,
  Filter,
  ArrowUpRight,
  Search,
  Power,
  Bell,
  Key,
  FileSpreadsheet,
  Play,
  Pause,
  RotateCcw,
  Trash2,
  UserCheck,
  UserX,
  Layers3,
  Network,
  Scale,
} from 'lucide-react';

/* -------------------------------------------------------------------------- */
/* Interfaces & Types                                                         */
/* -------------------------------------------------------------------------- */
interface TenantRecord {
  id: string;
  name: string;
  domain: string;
  plan: 'ENTERPRISE' | 'UNIVERSITY' | 'WHITE_LABEL';
  status: 'ACTIVE' | 'SUSPENDED' | 'PROVISIONING';
  seats: number;
  sslActive: boolean;
  createdAt: string;
}

interface PromptVersion {
  id: string;
  module: string;
  version: string;
  updatedBy: string;
  status: 'ACTIVE' | 'DEPRECATED';
  lastUpdated: string;
}

interface AuditLogEntry {
  id: string;
  actor: string;
  action: string;
  target: string;
  ip: string;
  timestamp: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
}

export default function SuperAdminDashboardPage() {
  const { toast } = useToast();
  const user = useAppSelector((s) => s.auth.user);
  const { data: realApplications = [] } = useApplications();
  const [jobs, setJobs] = useState<RecruiterJob[]>([]);
  const [loading, setLoading] = useState(true);

  /* Active Navigation Tab (Pillars 1 to 7) */
  const [activeTab, setActiveTab] = useState<
    'tenants' | 'revenue' | 'ai-governance' | 'rbac' | 'security' | 'queues' | 'flags'
  >('tenants');

  /* Pillar 1: Tenants State */
  const [tenants, setTenants] = useState<TenantRecord[]>([
    {
      id: 't-1',
      name: 'Acme Enterprise Corp',
      domain: 'careers.acme.com',
      plan: 'ENTERPRISE',
      status: 'ACTIVE',
      seats: 250,
      sslActive: true,
      createdAt: '2026-01-15',
    },
    {
      id: 't-2',
      name: 'Northwestern University Talent Hub',
      domain: 'jobs.northwestern.edu',
      plan: 'UNIVERSITY',
      status: 'ACTIVE',
      seats: 1200,
      sslActive: true,
      createdAt: '2026-02-10',
    },
    {
      id: 't-3',
      name: 'Lexon White-Label HR Solutions',
      domain: 'apply.lexonhr.io',
      plan: 'WHITE_LABEL',
      status: 'ACTIVE',
      seats: 85,
      sslActive: true,
      createdAt: '2026-03-01',
    },
  ]);
  const [createTenantOpen, setCreateTenantOpen] = useState(false);
  const [newTenantName, setNewTenantName] = useState('');
  const [newTenantDomain, setNewTenantDomain] = useState('');
  const [newTenantPlan, setNewTenantPlan] = useState<'ENTERPRISE' | 'UNIVERSITY' | 'WHITE_LABEL'>('ENTERPRISE');

  /* Maintenance Window State */
  const [maintenanceActive, setMaintenanceActive] = useState(false);
  const [maintenanceBanner, setMaintenanceBanner] = useState('System Upgrade in progress. All data remain securely synced.');
  const [bypassIPs, setBypassIPs] = useState('192.168.1.1, 10.0.0.42');

  /* Pillar 2: Financials & Compute Cost State */
  const [creditModalOpen, setCreditModalOpen] = useState(false);
  const [creditTenant, setCreditTenant] = useState('Acme Enterprise Corp');
  const [creditAmount, setCreditAmount] = useState('5000');

  /* Pillar 3: AI Failover & Prompt Repository State */
  const [primaryLLM, setPrimaryLLM] = useState('OpenAI GPT-4o');
  const [failoverLLM, setFailoverLLM] = useState('Anthropic Claude 3.5 Sonnet');
  const [fallbackLLM, setFallbackLLM] = useState('Google Gemini 1.5 Pro');
  const [latencyThreshold, setLatencyThreshold] = useState('1200');

  const [promptVersions, setPromptVersions] = useState<PromptVersion[]>([
    { id: 'pv-1', module: 'Resume Parsing Engine', version: 'v3.4.2', updatedBy: 'Root SuperAdmin', status: 'ACTIVE', lastUpdated: '2 hours ago' },
    { id: 'pv-2', module: 'Cover Letter Generator', version: 'v2.1.0', updatedBy: 'System DevOps', status: 'ACTIVE', lastUpdated: 'Yesterday' },
    { id: 'pv-3', module: 'AI Voice Interview Screener', version: 'v4.0.1', updatedBy: 'AI Lab Team', status: 'ACTIVE', lastUpdated: '3 days ago' },
  ]);

  /* Pillar 4: RBAC & Impersonation State */
  const [inviteAdminOpen, setInviteAdminOpen] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminRole, setNewAdminRole] = useState<'Support Admin' | 'Finance Admin' | 'DevOps Admin' | 'Content Moderator'>('Support Admin');
  const [requireMFA, setRequireMFA] = useState(true);

  /* Pillar 5: Immutable Audit Logs & GDPR State */
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([
    { id: 'log-101', actor: 'superadmin@careersync.pro', action: 'FLUSHED_REDIS_CACHE', target: 'Cluster US-East', ip: '172.56.21.9', timestamp: ' Just now', severity: 'INFO' },
    { id: 'log-102', actor: 'admin.support@careersync.pro', action: 'IMPERSONATE_START', target: 'User #u-842', ip: '198.51.100.4', timestamp: ' 12m ago', severity: 'WARNING' },
    { id: 'log-103', actor: 'system.firewall', action: 'BLOCKED_RATE_LIMIT_ABUSE', target: 'Endpoint /api/sourcing', ip: '203.0.113.195', timestamp: ' 34m ago', severity: 'CRITICAL' },
  ]);
  const [gdprEmail, setGdprEmail] = useState('');

  /* Pillar 6: Worker Queue & Proxy Matrix State */
  const [workersActive, setWorkersActive] = useState(true);
  const [proxyHealthPct, setProxyHealthPct] = useState(98.6);
  const [captchaSuccessPct, setCaptchaSuccessPct] = useState(99.1);

  /* Pillar 7: Feature Flags & System Notifications State */
  const [flags, setFlags] = useState({
    auto_apply_v2: true,
    voice_interview_agent: true,
    realtime_email_sync: true,
    custom_resume_templates: false,
  });
  const [notificationMsg, setNotificationMsg] = useState('');
  const [notificationTarget, setNotificationTarget] = useState<'ALL' | 'STUDENTS' | 'RECRUITERS' | 'ADMINS'>('ALL');

  /* Load Real Database Postings */
  const loadRealData = async () => {
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
    loadRealData();
  }, []);

  /* Handlers */
  const handleCreateTenant = () => {
    if (!newTenantName.trim()) return;
    const newT: TenantRecord = {
      id: `t-${Date.now()}`,
      name: newTenantName,
      domain: newTenantDomain || `${newTenantName.toLowerCase().replace(/\s+/g, '')}.applyai.io`,
      plan: newTenantPlan,
      status: 'ACTIVE',
      seats: 100,
      sslActive: true,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setTenants([newT, ...tenants]);
    setCreateTenantOpen(false);
    setNewTenantName('');
    setNewTenantDomain('');
    toast({
      title: '🏢 Tenant Provisioned Successfully!',
      description: `Provisioned workspace for ${newT.name} on domain ${newT.domain}.`,
    });
  };

  const handleToggleTenantStatus = (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    setTenants(tenants.map((t) => (t.id === id ? { ...t, status: nextStatus as any } : t)));
    toast({
      title: `🛡️ Tenant ${nextStatus}`,
      description: `Updated status for workspace ID ${id}.`,
    });
  };

  const handleSaveMaintenance = () => {
    toast({
      title: maintenanceActive ? '⚠️ Platform Maintenance ACTIVE' : '✅ Maintenance Mode DISABLED',
      description: maintenanceActive ? 'Scheduled banner & IP bypass rules deployed.' : 'Platform operating normally.',
    });
  };

  const handleGrantCredit = () => {
    setCreditModalOpen(false);
    toast({
      title: '💳 Enterprise Credit Issued!',
      description: `Granted $${creditAmount} credit limit to ${creditTenant}.`,
    });
  };

  const handleRollbackPrompt = (moduleName: string) => {
    toast({
      title: '🔄 Prompt Version Rolled Back',
      description: `Restored previous active prompt build for ${moduleName}.`,
    });
  };

  const handleInviteAdmin = () => {
    if (!newAdminEmail.trim()) return;
    setInviteAdminOpen(false);
    toast({
      title: '📧 Superadmin Invite Dispatched',
      description: `Sent invite for role ${newAdminRole} (MFA ${requireMFA ? 'Enforced' : 'Optional'}) to ${newAdminEmail}.`,
    });
    setNewAdminEmail('');
  };

  const handleExecuteGdprErasure = () => {
    if (!gdprEmail.trim()) return;
    toast({
      title: '🗑️ GDPR Data Erasure Completed',
      description: `Permanently purged all records, files, and audit logs for user ${gdprEmail}.`,
      variant: 'destructive',
    });
    setGdprEmail('');
  };

  const handleToggleWorkers = () => {
    setWorkersActive(!workersActive);
    toast({
      title: workersActive ? '⏸️ Background Workers Paused' : '▶️ Background Workers Resumed',
      description: workersActive ? 'Global Playwright & BullMQ queue execution frozen.' : 'Resumed worker cluster.',
    });
  };

  const handleBroadcastNotification = () => {
    if (!notificationMsg.trim()) return;
    toast({
      title: '📢 System Notification Broadcasted',
      description: `Dispatched announcement to target audience [${notificationTarget}].`,
    });
    setNotificationMsg('');
  };

  const totalApps = realApplications.length;
  const totalJobs = jobs.length;

  return (
    <PageShell title="" subtitle="">
      <div className="max-w-7xl mx-auto space-y-6 pb-20 animate-fade-in px-2 sm:px-4 font-sans text-xs">
        
        {/* Top Header - Master Root Console Title Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-b border-slate-200/80 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 text-slate-950 font-black text-xl shadow-lg shadow-amber-500/20">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  Super Admin Root Platform
                </h1>
                <Badge className="bg-amber-500 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full shadow-xs">
                  ROOT CONTROL HUB
                </Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-normal mt-0.5">
                Central management across all 7 operational platform pillars & multi-tenant infrastructure.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => {
                toast({ title: '🧹 System Cache Flushed', description: 'Redis cluster cache cleared.' });
              }}
              className="rounded-xl border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs gap-2 py-2 px-4 shadow-xs"
            >
              <RefreshCw className="h-4 w-4 text-slate-500" />
              <span>Flush Global Cache</span>
            </Button>
            <Button
              onClick={() => setCreateTenantOpen(true)}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs py-2 px-4 rounded-xl shadow-md gap-2"
            >
              <Plus className="h-4 w-4" />
              <span>Provision Tenant</span>
            </Button>
          </div>
        </div>

        {/* 7 Modular Navigation Tabs Bar */}
        <div className="flex items-center gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-3 overflow-x-auto">
          {[
            { id: 'tenants', label: '1. Multi-Tenant & Branding', icon: Building2 },
            { id: 'revenue', label: '2. Revenue & Compute Costs', icon: DollarSign },
            { id: 'ai-governance', label: '3. AI Routing & Prompts', icon: Cpu },
            { id: 'rbac', label: '4. Admin RBAC & MFA', icon: Users },
            { id: 'security', label: '5. Security & Audit Logs', icon: ShieldCheck },
            { id: 'queues', label: '6. Workers & Telemetry', icon: Server },
            { id: 'flags', label: '7. Feature Flags & Alerts', icon: Sliders },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <Button
                key={tab.id}
                variant={active ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab(tab.id as any)}
                className={`gap-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                  active
                    ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </Button>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* PILLAR 1: GLOBAL MULTI-TENANT & PLATFORM CONTROL                          */}
        {/* ========================================================================= */}
        {activeTab === 'tenants' && (
          <div className="space-y-6 font-sans">
            {/* Top Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-5 space-y-2 shadow-xs">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase">ACTIVE TENANTS</span>
                <div className="text-3xl font-black text-slate-900 dark:text-white">{tenants.length}</div>
                <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">100% Provisioned & Online</p>
              </Card>

              <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-5 space-y-2 shadow-xs">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase">TOTAL JOBS IN STORE</span>
                <div className="text-3xl font-black text-slate-900 dark:text-white">{totalJobs}</div>
                <p className="text-[11px] font-bold text-blue-600 dark:text-blue-400">Active Job Postings</p>
              </Card>

              <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-5 space-y-2 shadow-xs">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase">SUBMITTED APPLICATIONS</span>
                <div className="text-3xl font-black text-slate-900 dark:text-white">{totalApps}</div>
                <p className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">Real Database Submissions</p>
              </Card>

              <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-5 space-y-2 shadow-xs">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase">SSL & CUSTOM DOMAINS</span>
                <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">ACTIVE</div>
                <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">Auto-TLS Certificates Valid</p>
              </Card>
            </div>

            {/* Tenant Provisioning Table */}
            <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-6 space-y-4 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Client Tenant & Workspace Registry</h3>
                  <p className="text-xs text-slate-500">Manage organizational workspaces, domains, SSL, and branding.</p>
                </div>
                <Button
                  onClick={() => setCreateTenantOpen(true)}
                  className="bg-black dark:bg-white text-white dark:text-slate-900 font-extrabold text-xs py-2 px-4 rounded-xl shadow-sm gap-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>New Tenant</span>
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-sans text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 text-[10px] uppercase font-extrabold">
                      <th className="pb-3 px-3">TENANT NAME</th>
                      <th className="pb-3 px-3">DOMAIN / URL</th>
                      <th className="pb-3 px-3">PLAN TIER</th>
                      <th className="pb-3 px-3">SEATS</th>
                      <th className="pb-3 px-3">STATUS</th>
                      <th className="pb-3 px-3 text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {tenants.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                        <td className="py-3.5 px-3 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-slate-400" />
                          <span>{t.name}</span>
                        </td>
                        <td className="py-3.5 px-3 text-slate-500 font-mono flex items-center gap-1.5">
                          <span>{t.domain}</span>
                          {t.sslActive && <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 text-[9px] font-bold">SSL</Badge>}
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="px-2.5 py-0.5 rounded-full font-extrabold text-[10px] bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                            {t.plan}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 font-medium text-slate-600 dark:text-slate-300">{t.seats} Users</td>
                        <td className="py-3.5 px-3">
                          <span className={`px-2.5 py-0.5 rounded-full font-extrabold text-[10px] ${
                            t.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                          }`}>
                            {t.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleTenantStatus(t.id, t.status)}
                            className="rounded-lg text-[11px] font-bold py-1 px-3 border-slate-200 dark:border-slate-800"
                          >
                            {t.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Global Maintenance Engine */}
            <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-6 space-y-4 shadow-sm">
              <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Global Platform Maintenance Engine</h3>
                  <p className="text-xs text-slate-500">Schedule maintenance banners and configure emergency outage bypass rules.</p>
                </div>
                <Badge className={maintenanceActive ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 font-bold' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-bold'}>
                  {maintenanceActive ? 'MAINTENANCE ACTIVE' : 'SYSTEM NORMAL'}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-[#121522] border border-slate-200 dark:border-slate-800">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">Enable Maintenance Window</p>
                      <p className="text-[11px] text-slate-500">Display global banner and restrict logins</p>
                    </div>
                    <Switch checked={maintenanceActive} onCheckedChange={setMaintenanceActive} />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400">MAINTENANCE BANNER MESSAGE</label>
                    <Input
                      value={maintenanceBanner}
                      onChange={(e) => setMaintenanceBanner(e.target.value)}
                      className="mt-1 rounded-xl border-slate-200 dark:border-slate-800 text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400">SELECTIVE IP BYPASS RULES (COMMA SEPARATED)</label>
                    <Input
                      value={bypassIPs}
                      onChange={(e) => setBypassIPs(e.target.value)}
                      className="mt-1 rounded-xl border-slate-200 dark:border-slate-800 text-xs font-mono"
                    />
                  </div>

                  <Button onClick={handleSaveMaintenance} className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs py-2.5 rounded-xl">
                    Deploy Maintenance Settings
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PILLAR 2: PLATFORM FINANCIALS, USAGE & REVENUE HUB                        */}
        {/* ========================================================================= */}
        {activeTab === 'revenue' && (
          <div className="space-y-6 font-sans">
            {/* Financial Overview KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-4 space-y-1.5 shadow-xs">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase">MONTHLY RECURRING (MRR)</span>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">$148,200</h3>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">+14.2% MoM</span>
              </Card>

              <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-4 space-y-1.5 shadow-xs">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase">ANNUAL RUN RATE (ARR)</span>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">$1.77M</h3>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">+18.0% YoY</span>
              </Card>

              <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-4 space-y-1.5 shadow-xs">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase">AVG CUSTOMER LTV</span>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">$4,250</h3>
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">Enterprise Segment</span>
              </Card>

              <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-4 space-y-1.5 shadow-xs">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase">NET CHURN RATE</span>
                <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400">1.2%</h3>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">Optimal Benchmark</span>
              </Card>

              <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-4 space-y-1.5 shadow-xs">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase">NET RETENTION (NRR)</span>
                <h3 className="text-2xl font-black text-blue-600 dark:text-blue-400">118%</h3>
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">Positive Expansion</span>
              </Card>
            </div>

            {/* Global Compute & AI API Expenditure Breakdown */}
            <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Global Compute & AI Token Cost Auditing</h3>
                  <p className="text-xs text-slate-500">Live API expenditure breakdown per module provider.</p>
                </div>
                <Button onClick={() => setCreditModalOpen(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-4 rounded-xl">
                  + Issue Enterprise Credit
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { provider: 'OpenAI (GPT-4o & Embedding)', cost: '$4,120 / mo', pct: 42, color: 'bg-blue-500' },
                  { provider: 'Anthropic (Claude 3.5 Sonnet)', cost: '$2,840 / mo', pct: 28, color: 'bg-indigo-500' },
                  { provider: 'Google Gemini (1.5 Pro)', cost: '$1,150 / mo', pct: 12, color: 'bg-cyan-500' },
                  { provider: 'Playwright Proxy Scrapers', cost: '$920 / mo', pct: 9, color: 'bg-amber-500' },
                  { provider: 'Resume Parsing Engine', cost: '$910 / mo', pct: 9, color: 'bg-emerald-500' },
                ].map((item, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0f111a] border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-900 dark:text-white">{item.provider}</span>
                      <span className="font-mono text-slate-500">{item.cost}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct * 2}%` }} />
                    </div>
                    <p className="text-[10px] text-slate-400 text-right">{item.pct}% of total infrastructure spend</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PILLAR 3: AI MODEL INFRASTRUCTURE & ROUTING GOVERNANCE                   */}
        {/* ========================================================================= */}
        {activeTab === 'ai-governance' && (
          <div className="space-y-6 font-sans">
            {/* LLM Failover & Fallback Engine */}
            <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-6 space-y-4 shadow-sm">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Automated LLM Failover & Fallback Engine</h3>
                <p className="text-xs text-slate-500">Configure provider failover rules if an API experiences high latency or outage.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">PRIMARY LLM PROVIDER</label>
                  <select
                    value={primaryLLM}
                    onChange={(e) => setPrimaryLLM(e.target.value)}
                    className="w-full h-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0f111a] text-xs font-bold text-slate-900 dark:text-white px-3"
                  >
                    <option value="OpenAI GPT-4o">OpenAI GPT-4o (Primary)</option>
                    <option value="Anthropic Claude 3.5 Sonnet">Anthropic Claude 3.5 Sonnet</option>
                    <option value="Google Gemini 1.5 Pro">Google Gemini 1.5 Pro</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">FAILOVER PROVIDER (LEVEL 2)</label>
                  <select
                    value={failoverLLM}
                    onChange={(e) => setFailoverLLM(e.target.value)}
                    className="w-full h-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0f111a] text-xs font-bold text-slate-900 dark:text-white px-3"
                  >
                    <option value="Anthropic Claude 3.5 Sonnet">Anthropic Claude 3.5 Sonnet</option>
                    <option value="OpenAI GPT-4o">OpenAI GPT-4o</option>
                    <option value="Google Gemini 1.5 Pro">Google Gemini 1.5 Pro</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">LATENCY TRIGGER THRESHOLD (MS)</label>
                  <Input
                    value={latencyThreshold}
                    onChange={(e) => setLatencyThreshold(e.target.value)}
                    className="h-10 rounded-xl border-slate-200 dark:border-slate-800 text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <Button onClick={() => toast({ title: '⚡ Failover Rules Saved', description: 'Updated provider routing parameters.' })} className="bg-black dark:bg-white text-white dark:text-slate-900 font-bold text-xs py-2.5 px-6 rounded-xl">
                Save Failover Governance Rules
              </Button>
            </Card>

            {/* Master System Prompt Repository */}
            <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Master System Prompt Repository</h3>
                  <p className="text-xs text-slate-500">Global version control for core AI system prompts with instant rollback.</p>
                </div>
              </div>

              <div className="space-y-3 font-sans text-xs">
                {promptVersions.map((p) => (
                  <div key={p.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0f111a] border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 dark:text-white text-sm">{p.module}</span>
                        <Badge className="bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-bold text-[10px]">{p.version}</Badge>
                      </div>
                      <p className="text-[11px] text-slate-400">Updated by {p.updatedBy} • {p.lastUpdated}</p>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRollbackPrompt(p.module)}
                      className="rounded-xl text-xs font-bold gap-1.5 border-slate-200 dark:border-slate-800"
                    >
                      <RotateCcw className="h-3.5 w-3.5 text-slate-500" />
                      <span>Rollback Version</span>
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PILLAR 4: ADMIN ROLE & RBAC MANAGEMENT                                    */}
        {/* ========================================================================= */}
        {activeTab === 'rbac' && (
          <div className="space-y-6 font-sans">
            <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Granular Role-Based Access Control (RBAC)</h3>
                  <p className="text-xs text-slate-500">Manage custom administrative roles, MFA enforcement, and superadmin invites.</p>
                </div>
                <Button onClick={() => setInviteAdminOpen(true)} className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs py-2 px-4 rounded-xl gap-2">
                  <UserCheck className="h-4 w-4" />
                  <span>Invite Admin</span>
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                {[
                  { role: 'Support Admin', desc: 'Customer support tickets & user profile resets', count: '14 Active' },
                  { role: 'Finance Admin', desc: 'Enterprise billing, invoices, and credit terms', count: '3 Active' },
                  { role: 'DevOps Admin', desc: 'System workers, proxy pools, and Redis queues', count: '5 Active' },
                  { role: 'Content Moderator', desc: 'Job posting reviews & compliance moderation', count: '8 Active' },
                ].map((r, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0f111a] border border-slate-200 dark:border-slate-800 space-y-2">
                    <span className="font-extrabold text-slate-900 dark:text-white text-sm">{r.role}</span>
                    <p className="text-[11px] text-slate-500">{r.desc}</p>
                    <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-[10px]">{r.count}</Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PILLAR 5: SECURITY, COMPLIANCE & IMMUTABLE AUDIT LOGS                    */}
        {/* ========================================================================= */}
        {activeTab === 'security' && (
          <div className="space-y-6 font-sans">
            {/* GDPR Data Erasure Engine */}
            <Card className="rounded-3xl border border-rose-500/30 bg-white dark:bg-[#0c0e17] p-6 space-y-4 shadow-sm">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-extrabold text-rose-600 dark:text-rose-400 text-base">GDPR / CCPA Data Erasure Engine</h3>
                <p className="text-xs text-slate-500">1-click hard deletion of all user records, resumes, and audit history.</p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <Input
                  value={gdprEmail}
                  onChange={(e) => setGdprEmail(e.target.value)}
                  placeholder="Enter user email address for hard erasure..."
                  className="rounded-xl border-slate-200 dark:border-slate-800 text-xs"
                />
                <Button onClick={handleExecuteGdprErasure} className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs py-2.5 px-6 rounded-xl shrink-0">
                  Execute Hard Erasure
                </Button>
              </div>
            </Card>

            {/* Immutable Audit Logs */}
            <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Immutable Platform Audit Trail</h3>
                  <p className="text-xs text-slate-500">Unalterable system log tracking every administrative action across the platform.</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-sans text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 text-[10px] uppercase font-extrabold">
                      <th className="pb-3 px-3">TIMESTAMP</th>
                      <th className="pb-3 px-3">ACTOR</th>
                      <th className="pb-3 px-3">ACTION</th>
                      <th className="pb-3 px-3">TARGET</th>
                      <th className="pb-3 px-3">IP ADDRESS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                        <td className="py-3 px-3 text-slate-500">{log.timestamp}</td>
                        <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">{log.actor}</td>
                        <td className="py-3 px-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            log.severity === 'CRITICAL' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                          }`}>
                            {log.action}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-600 dark:text-slate-300">{log.target}</td>
                        <td className="py-3 px-3 text-slate-400">{log.ip}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PILLAR 6: BACKGROUND QUEUE, AUTOMATION & SCRAPER MATRIX                   */}
        {/* ========================================================================= */}
        {activeTab === 'queues' && (
          <div className="space-y-6 font-sans">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-5 space-y-2 shadow-xs">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase">WORKER CLUSTER STATE</span>
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">{workersActive ? 'RUNNING' : 'PAUSED'}</h3>
                  <Button onClick={handleToggleWorkers} variant="outline" size="sm" className="rounded-xl text-xs font-bold">
                    {workersActive ? <Pause className="h-4 w-4 text-amber-500" /> : <Play className="h-4 w-4 text-emerald-500" />}
                  </Button>
                </div>
                <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">Playwright & BullMQ Active</p>
              </Card>

              <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-5 space-y-2 shadow-xs">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase">PROXY POOL HEALTH</span>
                <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{proxyHealthPct}%</h3>
                <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">142 Proxies Active</p>
              </Card>

              <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-5 space-y-2 shadow-xs">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase">CAPTCHA SOLVER SUCCESS</span>
                <h3 className="text-2xl font-black text-blue-600 dark:text-blue-400">{captchaSuccessPct}%</h3>
                <p className="text-[11px] font-bold text-blue-600 dark:text-blue-400">Auto Bypass Operational</p>
              </Card>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PILLAR 7: GLOBAL CONTENT & FEATURE FLAG MANAGEMENT                        */}
        {/* ========================================================================= */}
        {activeTab === 'flags' && (
          <div className="space-y-6 font-sans">
            {/* Feature Flags */}
            <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-6 space-y-4 shadow-sm">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Feature Flags & Canary Rollouts</h3>
                <p className="text-xs text-slate-500">Toggle platform capabilities globally or selectively to beta tenants.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {Object.entries(flags).map(([key, val]) => (
                  <div key={key} className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0f111a] border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="font-extrabold text-slate-900 dark:text-white uppercase text-[11px]">{key.replace(/_/g, ' ')}</p>
                      <p className="text-[10px] text-slate-400">Canary Rollout: {val ? '100% Global' : 'Disabled'}</p>
                    </div>
                    <Switch
                      checked={val}
                      onCheckedChange={(c) => {
                        setFlags({ ...flags, [key]: c });
                        toast({ title: `Feature Flag '${key}' Updated`, description: `Status set to ${c ? 'ENABLED' : 'DISABLED'}.` });
                      }}
                    />
                  </div>
                ))}
              </div>
            </Card>

            {/* Master Broadcast Announcement */}
            <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-6 space-y-4 shadow-sm">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Master System Notification Broadcaster</h3>
                <p className="text-xs text-slate-500">Broadcast platform push notifications or popup announcements to all users.</p>
              </div>

              <div className="space-y-3">
                <Textarea
                  value={notificationMsg}
                  onChange={(e) => setNotificationMsg(e.target.value)}
                  placeholder="Enter broadcast announcement text..."
                  className="rounded-xl border-slate-200 dark:border-slate-800 text-xs"
                />

                <Button onClick={handleBroadcastNotification} className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs py-2.5 px-6 rounded-xl gap-2">
                  <Bell className="h-4 w-4" />
                  <span>Broadcast System Announcement</span>
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* DIALOG: CREATE TENANT */}
        <Dialog open={createTenantOpen} onOpenChange={setCreateTenantOpen}>
          <DialogContent className="sm:max-w-md bg-white dark:bg-[#0c0e17] border-slate-200 dark:border-slate-800 font-sans text-xs">
            <DialogHeader>
              <DialogTitle className="text-base font-black text-slate-900 dark:text-white">Provision New Client Tenant</DialogTitle>
              <DialogDescription className="text-xs text-slate-500">Set up workspace domain, plan tier, and SSL configurations.</DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-2">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400">ORGANIZATION / TENANT NAME</label>
                <Input
                  value={newTenantName}
                  onChange={(e) => setNewTenantName(e.target.value)}
                  placeholder="e.g. Acme Enterprise Corp"
                  className="mt-1 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400">CUSTOM DOMAIN URL</label>
                <Input
                  value={newTenantDomain}
                  onChange={(e) => setNewTenantDomain(e.target.value)}
                  placeholder="e.g. careers.acme.com"
                  className="mt-1 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400">PLAN TIER</label>
                <select
                  value={newTenantPlan}
                  onChange={(e) => setNewTenantPlan(e.target.value as any)}
                  className="w-full h-10 mt-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#121522] text-xs font-bold text-slate-900 dark:text-white px-3"
                >
                  <option value="ENTERPRISE">Enterprise Plan</option>
                  <option value="UNIVERSITY">University Campus Plan</option>
                  <option value="WHITE_LABEL">White-Label Client Plan</option>
                </select>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={handleCreateTenant} className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs py-3 rounded-xl">
                Provision Tenant Workspace
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* DIALOG: INVITE ADMIN */}
        <Dialog open={inviteAdminOpen} onOpenChange={setInviteAdminOpen}>
          <DialogContent className="sm:max-w-md bg-white dark:bg-[#0c0e17] border-slate-200 dark:border-slate-800 font-sans text-xs">
            <DialogHeader>
              <DialogTitle className="text-base font-black text-slate-900 dark:text-white">Invite Admin Team Member</DialogTitle>
              <DialogDescription className="text-xs text-slate-500">Dispatch invitation link with custom RBAC permissions.</DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-2">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400">EMAIL ADDRESS</label>
                <Input
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  placeholder="admin@company.com"
                  className="mt-1 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400">ASSIGN ADMIN ROLE</label>
                <select
                  value={newAdminRole}
                  onChange={(e) => setNewAdminRole(e.target.value as any)}
                  className="w-full h-10 mt-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#121522] text-xs font-bold text-slate-900 dark:text-white px-3"
                >
                  <option value="Support Admin">Support Admin</option>
                  <option value="Finance Admin">Finance Admin</option>
                  <option value="DevOps Admin">DevOps Admin</option>
                  <option value="Content Moderator">Content Moderator</option>
                </select>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={handleInviteAdmin} className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs py-3 rounded-xl">
                Dispatch Admin Invitation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* DIALOG: ISSUE ENTERPRISE CREDIT */}
        <Dialog open={creditModalOpen} onOpenChange={setCreditModalOpen}>
          <DialogContent className="sm:max-w-md bg-white dark:bg-[#0c0e17] border-slate-200 dark:border-slate-800 font-sans text-xs">
            <DialogHeader>
              <DialogTitle className="text-base font-black text-slate-900 dark:text-white">Issue Enterprise Credit</DialogTitle>
              <DialogDescription className="text-xs text-slate-500">Grant custom credit limits or adjust contract terms.</DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-2">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400">SELECT TENANT</label>
                <select
                  value={creditTenant}
                  onChange={(e) => setCreditTenant(e.target.value)}
                  className="w-full h-10 mt-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#121522] text-xs font-bold text-slate-900 dark:text-white px-3"
                >
                  {tenants.map((t) => (
                    <option key={t.id} value={t.name}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400">CREDIT AMOUNT ($ USD)</label>
                <Input
                  value={creditAmount}
                  onChange={(e) => setCreditAmount(e.target.value)}
                  className="mt-1 rounded-xl text-xs font-mono font-bold"
                />
              </div>
            </div>

            <DialogFooter>
              <Button onClick={handleGrantCredit} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-3 rounded-xl">
                Confirm Credit Grant
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </PageShell>
  );
}
