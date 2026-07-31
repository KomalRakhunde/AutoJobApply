'use client';

import { useState } from 'react';
import { PageShell } from '@/components/page-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Clock,
  Terminal,
  AlertTriangle,
  CheckCircle2,
  Key,
  Server,
  FileText,
  RefreshCw,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AuditLog {
  id: string;
  admin: string;
  action: string;
  target: string;
  ip: string;
  timestamp: string;
}

const initialAuditLogs: AuditLog[] = [
  { id: 'log_891', admin: 'System Admin', action: 'ROLE_OVERRIDE', target: 'jordan.miles@university.edu', ip: '192.168.1.45', timestamp: '5 mins ago' },
  { id: 'log_890', admin: 'System Admin', action: 'PROMO_CREATED', target: 'STUDENT50 (50% OFF)', ip: '192.168.1.45', timestamp: '20 mins ago' },
  { id: 'log_889', admin: 'Komal Rakhunde', action: 'ACCOUNT_SUSPENDED', target: 'elena.rod@univ.edu', ip: '10.0.0.12', timestamp: '2 hrs ago' },
  { id: 'log_888', admin: 'System Admin', action: 'LLM_WEIGHT_CHANGE', target: 'OpenAI GPT-4o -> 70%', ip: '192.168.1.45', timestamp: '5 hrs ago' },
];

export default function SecurityAuditOperationsPage() {
  const { toast } = useToast();
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [mfaEnforced, setMfaEnforced] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('60');
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);

  const handleToggleMaintenance = (enabled: boolean) => {
    setMaintenanceMode(enabled);
    toast({
      title: enabled ? '⚠️ Maintenance Mode Activated' : '✅ System Live',
      description: enabled
        ? 'Platform put into maintenance mode. Custom notice displayed to non-admins.'
        : 'Maintenance mode deactivated. All user access restored.',
    });
  };

  const handleSaveSecuritySettings = () => {
    toast({
      title: '🔐 Security Settings Updated',
      description: `MFA enforcement and ${sessionTimeout}-min session timeout saved.`,
    });
  };

  return (
    <PageShell title="" subtitle="">
      <div className="space-y-6 animate-fade-in font-sans text-sm pb-12">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Security Audit & System Operations
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Authentication rules, immutable administrative audit logs, and maintenance mode.
            </p>
          </div>

          {/* Global Maintenance Mode Toggle Banner */}
          <div className={`flex items-center gap-3 px-4 py-2 rounded-2xl border ${
            maintenanceMode ? 'bg-rose-50 border-rose-200 dark:bg-rose-950/50 dark:border-rose-800' : 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/50 dark:border-emerald-800'
          }`}>
            <span className="text-xs font-extrabold text-slate-900 dark:text-white">Maintenance Mode</span>
            <Switch checked={maintenanceMode} onCheckedChange={handleToggleMaintenance} />
          </div>
        </div>

        {/* SYSTEM SECURITY & AUTHENTICATION RULES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0b0f19] p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-blue-500" />
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Authentication & MFA Controls</h3>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Enforce Multi-Factor Auth (MFA)</p>
                  <p className="text-[11px] text-slate-500">Require 2FA TOTP for all Recruiter & Admin accounts</p>
                </div>
                <Checkbox checked={mfaEnforced} onCheckedChange={(c) => setMfaEnforced(!!c)} />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Session Timeout (Minutes)</label>
                <Input
                  type="number"
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                  className="text-xs rounded-xl bg-slate-50 dark:bg-[#0f111a]"
                />
              </div>

              <Button onClick={handleSaveSecuritySettings} className="w-full bg-black dark:bg-white text-white dark:text-slate-900 font-extrabold text-xs py-2.5 rounded-xl">
                Save Security Rules
              </Button>
            </div>
          </Card>

          {/* OAuth Client Secret & API Security */}
          <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0b0f19] p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-2">
              <Key className="h-5 w-5 text-indigo-500" />
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">OAuth & API Secret Keys</h3>
            </div>

            <div className="space-y-3 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Google OAuth Client ID</p>
                  <p className="text-[11px] font-mono text-slate-400">90123849...apps.googleusercontent.com</p>
                </div>
                <Badge variant="outline">Configured</Badge>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Stripe Webhook Signing Secret</p>
                  <p className="text-[11px] font-mono text-slate-400">whsec_************************</p>
                </div>
                <Badge variant="outline">Encrypted</Badge>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">SendGrid SMTP Key</p>
                  <p className="text-[11px] font-mono text-slate-400">SG.************************</p>
                </div>
                <Badge variant="outline">Active</Badge>
              </div>
            </div>
          </Card>
        </div>

        {/* IMMUTABLE ADMINISTRATIVE AUDIT LOG TABLE */}
        <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0b0f19] p-6 space-y-4 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Immutable Administrative Audit Log</h3>
              <p className="text-xs text-slate-400">Compliance recording of all admin privilege actions</p>
            </div>
            <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-extrabold">
              Audit Stream Active
            </Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs">
              <thead>
                <tr className="border-b border-slate-200/80 dark:border-slate-800 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Log ID</th>
                  <th className="py-3 px-4">Admin Actor</th>
                  <th className="py-3 px-4">Action Code</th>
                  <th className="py-3 px-4">Target Resource</th>
                  <th className="py-3 px-4">IP Address</th>
                  <th className="py-3 px-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/50 transition-colors font-mono">
                    <td className="py-3 px-4 text-slate-400">{log.id}</td>
                    <td className="py-3 px-4 font-sans font-extrabold text-slate-900 dark:text-white">{log.admin}</td>
                    <td className="py-3 px-4 font-bold text-blue-500">{log.action}</td>
                    <td className="py-3 px-4 font-sans text-slate-600 dark:text-slate-300">{log.target}</td>
                    <td className="py-3 px-4 text-slate-400">{log.ip}</td>
                    <td className="py-3 px-4 font-sans text-slate-400">{log.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </PageShell>
  );
}
