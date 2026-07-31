'use client';

import { useState } from 'react';
import { useAppSelector } from '@/lib/store/hooks';
import { PageShell } from '@/components/page-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
  EyeOff,
  Check,
  X,
  Sparkles,
} from 'lucide-react';

export default function SuperAdminDashboardPage() {
  const { toast } = useToast();
  const user = useAppSelector((s) => s.auth.user);
  const username = user?.email ? user.email.split('@')[0] : 'SuperAdmin';

  const [activeTab, setActiveTab] = useState<'tenants' | 'billing' | 'config' | 'security'>('tenants');
  const [showApiKey, setShowApiKey] = useState(false);

  const [primaryModel, setPrimaryModel] = useState('GPT-4o (Default)');
  const [contextWindow, setContextWindow] = useState('128,000 TOKENS');
  const [autoScaling, setAutoScaling] = useState(true);
  const [strictCompliance, setStrictCompliance] = useState(true);
  const [logPayloads, setLogPayloads] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [betaFeatures, setBetaFeatures] = useState(true);

  const handleSaveConfig = () => {
    toast({
      title: '⚡ Configuration Saved!',
      description: 'Platform AI engine parameters & system flags updated live.',
    });
  };

  const handleFlushCache = () => {
    toast({
      title: '🧹 Cache Flushed',
      description: 'Cleared global Redis cluster cache across all edge locations.',
    });
  };

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
                Super Admin Console <span className="text-xs text-indigo-600 dark:text-indigo-400 font-mono font-normal">v2.4.0</span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">APPLYAI PLATFORM ROOT CONTROL CENTER</p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <Button
              onClick={handleSaveConfig}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-xs font-bold rounded-xl gap-2 px-4 shadow-md"
            >
              <Save className="h-4 w-4" />
              <span>Apply Changes</span>
            </Button>
          </div>
        </div>

        {/* 4 Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-3 overflow-x-auto">
          <Button
            variant={activeTab === 'tenants' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('tenants')}
            className={`gap-2 rounded-xl text-xs font-mono font-bold shrink-0 ${
              activeTab === 'tenants'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Building2 className="h-4 w-4" />
            <span>Tenants & Roles</span>
          </Button>

          <Button
            variant={activeTab === 'billing' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('billing')}
            className={`gap-2 rounded-xl text-xs font-mono font-bold shrink-0 ${
              activeTab === 'billing'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <DollarSign className="h-4 w-4" />
            <span>Billing & Analytics</span>
          </Button>

          <Button
            variant={activeTab === 'config' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('config')}
            className={`gap-2 rounded-xl text-xs font-mono font-bold shrink-0 ${
              activeTab === 'config'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sliders className="h-4 w-4" />
            <span>Platform Config</span>
          </Button>

          <Button
            variant={activeTab === 'security' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('security')}
            className={`gap-2 rounded-xl text-xs font-mono font-bold shrink-0 ${
              activeTab === 'security'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShieldAlert className="h-4 w-4" />
            <span>Security & System Health</span>
          </Button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: TENANTS & ROLES */}
        {/* ========================================================================= */}
        {activeTab === 'tenants' && (
          <div className="space-y-6 font-mono">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 border-l-4 border-l-indigo-500 bg-white dark:bg-[#0f111a] bg-gradient-to-r from-indigo-500/10 via-transparent to-transparent p-4 space-y-2 shadow-sm dark:shadow-xl hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all duration-300">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Total Tenants</span>
                <div className="text-3xl font-black text-slate-900 dark:text-white">128</div>
                <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">📈 +12.4% MoM</p>
              </Card>

              <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 border-l-4 border-l-cyan-400 bg-white dark:bg-[#0f111a] bg-gradient-to-r from-cyan-500/10 via-transparent to-transparent p-4 space-y-2 shadow-sm dark:shadow-xl hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] transition-all duration-300">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Admin Users</span>
                <div className="text-3xl font-black text-slate-900 dark:text-white">1,402</div>
                <p className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">Stable Growth</p>
              </Card>

              <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 border-l-4 border-l-emerald-400 bg-white dark:bg-[#0f111a] bg-gradient-to-r from-emerald-500/10 via-transparent to-transparent p-4 space-y-2 shadow-sm dark:shadow-xl hover:border-emerald-400/50 hover:shadow-[0_0_20px_rgba(52,211,153,0.15)] transition-all duration-300">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Resource Load</span>
                <div className="text-3xl font-black text-slate-900 dark:text-white">42%</div>
                <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">✓ Under Limit</p>
              </Card>

              <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 border-l-4 border-l-rose-500 bg-white dark:bg-[#0f111a] bg-gradient-to-r from-rose-500/10 via-transparent to-transparent p-4 space-y-2 shadow-sm dark:shadow-xl hover:border-rose-500/50 hover:shadow-[0_0_20px_rgba(244,63,94,0.15)] transition-all duration-300">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Urgent Policies</span>
                <div className="text-3xl font-black text-rose-600 dark:text-rose-400">3</div>
                <p className="text-[11px] font-bold text-rose-600 dark:text-rose-400">Policy Audit Pending</p>
              </Card>
            </div>

            <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-5 space-y-4 shadow-sm dark:shadow-2xl font-mono text-xs">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Global Tenant Directory</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 text-[10px] uppercase">
                      <th className="pb-3 px-2">TENANT NAME</th>
                      <th className="pb-3 px-2">PLAN TIER</th>
                      <th className="pb-3 px-2">ACTIVE SEATS</th>
                      <th className="pb-3 px-2">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {[
                      { name: 'Acme Corp', tier: 'ENTERPRISE', seats: '142 Seats', status: 'ACTIVE' },
                      { name: 'TechCorp Global', tier: 'BUSINESS', seats: '84 Seats', status: 'ACTIVE' },
                      { name: 'Stripe AI Labs', tier: 'ENTERPRISE', seats: '210 Seats', status: 'ACTIVE' },
                      { name: 'OpenAI Partner Org', tier: 'GROWTH', seats: '18 Seats', status: 'ACTIVE' },
                    ].map((t, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-2 font-bold text-slate-900 dark:text-white">{t.name}</td>
                        <td className="py-3 px-2 font-bold text-indigo-600 dark:text-indigo-400">{t.tier}</td>
                        <td className="py-3 px-2 text-slate-500 dark:text-slate-400">{t.seats}</td>
                        <td className="py-3 px-2 text-emerald-600 dark:text-emerald-400 font-bold">{t.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: BILLING & ANALYTICS */}
        {/* ========================================================================= */}
        {activeTab === 'billing' && (
          <div className="space-y-6 font-mono text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 border-l-4 border-l-indigo-500 bg-white dark:bg-[#0f111a] bg-gradient-to-r from-indigo-500/10 via-transparent to-transparent p-4 space-y-2 shadow-sm dark:shadow-xl hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all duration-300">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Total Organizations</span>
                <div className="text-3xl font-black text-slate-900 dark:text-white">1,482</div>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">+12.4% Active</p>
              </Card>

              <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 border-l-4 border-l-cyan-400 bg-white dark:bg-[#0f111a] bg-gradient-to-r from-cyan-500/10 via-transparent to-transparent p-4 space-y-2 shadow-sm dark:shadow-xl hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] transition-all duration-300">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Active Recruiters</span>
                <div className="text-3xl font-black text-slate-900 dark:text-white">12,504</div>
                <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold">+8.3% MoM</p>
              </Card>

              <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 border-l-4 border-l-amber-500 bg-white dark:bg-[#0f111a] bg-gradient-to-r from-amber-500/10 via-transparent to-transparent p-4 space-y-2 shadow-sm dark:shadow-xl hover:border-amber-500/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] transition-all duration-300">
                <span className="text-[10px] text-slate-400 font-bold uppercase">System Admins</span>
                <div className="text-3xl font-black text-slate-900 dark:text-white">342</div>
                <p className="text-[11px] text-slate-400">Stable</p>
              </Card>

              <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 border-l-4 border-l-emerald-400 bg-white dark:bg-[#0f111a] bg-gradient-to-r from-emerald-500/10 via-transparent to-transparent p-4 space-y-2 shadow-sm dark:shadow-xl hover:border-emerald-400/50 hover:shadow-[0_0_20px_rgba(52,211,153,0.15)] transition-all duration-300">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Platform Hires</span>
                <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">84,200</div>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">+14.7% MoM</p>
              </Card>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: PLATFORM CONFIG */}
        {/* ========================================================================= */}
        {activeTab === 'config' && (
          <div className="space-y-6 font-mono text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 border-l-4 border-l-indigo-500 bg-white dark:bg-[#0c0e17] bg-gradient-to-r from-indigo-500/10 via-transparent to-transparent p-6 space-y-5 shadow-sm dark:shadow-2xl hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all duration-300">
                <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base">AI Engine Core</h3>
                    <p className="text-slate-400 font-normal">Global LLM orchestration & model context windows.</p>
                  </div>
                  <span className="rounded-md bg-indigo-950/80 text-indigo-400 border border-indigo-500/40 text-[10px] font-bold px-2 py-0.5">
                    ID: CORE_AI_V4
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-slate-400 uppercase font-bold text-[10px]">PRIMARY MODEL SELECTION</label>
                    <select
                      value={primaryModel}
                      onChange={(e) => setPrimaryModel(e.target.value)}
                      className="w-full h-10 mt-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#121522] text-slate-900 dark:text-white px-3 font-bold text-xs"
                    >
                      <option value="GPT-4o (Default)">GPT-4o (Default Recommended)</option>
                      <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet</option>
                      <option value="Llama 3 70B Fine-tuned">Llama 3 70B Fine-tuned</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-400 uppercase font-bold text-[10px]">CONTEXT WINDOW LIMIT</label>
                    <Input
                      value={contextWindow}
                      onChange={(e) => setContextWindow(e.target.value)}
                      className="h-10 mt-1 rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#121522] text-slate-900 dark:text-white font-bold"
                    />
                  </div>
                </div>
              </Card>

              <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 border-l-4 border-l-rose-500 bg-white dark:bg-[#0c0e17] bg-gradient-to-r from-rose-500/10 via-transparent to-transparent p-6 space-y-5 shadow-sm dark:shadow-2xl hover:border-rose-500/50 hover:shadow-[0_0_20px_rgba(244,63,94,0.15)] transition-all duration-300">
                <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base">System Control Center</h3>
                    <p className="text-slate-400 font-normal">Emergency maintenance controls and backup triggers.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3.5 rounded-2xl bg-slate-50 dark:bg-[#121522] border border-slate-200/60 dark:border-slate-800">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">Maintenance Mode</p>
                      <p className="text-[10px] text-slate-400">Freeze all user interactions immediately.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={maintenanceMode}
                      onChange={(e) => setMaintenanceMode(e.target.checked)}
                      className="h-5 w-5 rounded border-slate-700 bg-slate-900 accent-indigo-600 cursor-pointer"
                    />
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: SECURITY & SYSTEM HEALTH */}
        {/* ========================================================================= */}
        {activeTab === 'security' && (
          <div className="space-y-6 font-mono text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 border-l-4 border-l-emerald-400 bg-white dark:bg-[#0f111a] bg-gradient-to-r from-emerald-500/10 via-transparent to-transparent p-4 space-y-2 shadow-sm dark:shadow-xl hover:border-emerald-400/50 hover:shadow-[0_0_20px_rgba(52,211,153,0.15)] transition-all duration-300">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Server Cluster</span>
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">HEALTHY</div>
                <p className="text-[11px] text-slate-400">CPU 24% • Memory 8.4GB / 16GB</p>
              </Card>

              <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 border-l-4 border-l-indigo-500 bg-white dark:bg-[#0f111a] bg-gradient-to-r from-indigo-500/10 via-transparent to-transparent p-4 space-y-2 shadow-sm dark:shadow-xl hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all duration-300">
                <span className="text-[10px] text-slate-400 font-bold uppercase">API Gateway</span>
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">ACTIVE</div>
                <p className="text-[11px] text-slate-400">1.2M Requests • Error 0.02%</p>
              </Card>

              <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 border-l-4 border-l-cyan-400 bg-white dark:bg-[#0f111a] bg-gradient-to-r from-cyan-500/10 via-transparent to-transparent p-4 space-y-2 shadow-sm dark:shadow-xl hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] transition-all duration-300">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Neural Database</span>
                <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">OPTIMIZED</div>
                <p className="text-[11px] text-slate-400">Usage 78% • Lag 2ms</p>
              </Card>
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}
