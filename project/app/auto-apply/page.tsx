'use client';

import { useState } from 'react';
import { PageShell } from '@/components/page-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

const INITIAL_LOGS: AutoApplyLog[] = [
  {
    id: 'log-1',
    jobTitle: 'Senior Full Stack Engineer',
    company: 'TechCorp Global',
    portal: 'LinkedIn Jobs',
    timestamp: '2 mins ago',
    status: 'submitted',
    matchScore: 94,
  },
  {
    id: 'log-2',
    jobTitle: 'Frontend Developer (React/Next.js)',
    company: 'Innovate AI',
    portal: 'Naukri.com',
    timestamp: '15 mins ago',
    status: 'submitted',
    matchScore: 88,
  },
  {
    id: 'log-3',
    jobTitle: 'Junior Developer (Entry Level)',
    company: 'Staffing Solutions Inc',
    portal: 'Indeed',
    timestamp: '32 mins ago',
    status: 'skipped',
    matchScore: 42,
  },
  {
    id: 'log-4',
    jobTitle: 'Lead Next.js Architect',
    company: 'CloudPulse Cloud',
    portal: 'Wellfound',
    timestamp: '1 hour ago',
    status: 'submitted',
    matchScore: 91,
  },
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

  const [logs, setLogs] = useState<AutoApplyLog[]>(INITIAL_LOGS);
  const [newSkill, setNewSkill] = useState('');
  const [newExclude, setNewExclude] = useState('');

  const toggleAutomation = () => {
    const nextState = !config.enabled;
    setConfig((prev) => ({ ...prev, enabled: nextState }));
    toast({
      title: nextState ? 'Auto-Apply Automation Activated' : 'Auto-Apply Automation Paused',
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

  const triggerInstantRun = () => {
    const mockLog: AutoApplyLog = {
      id: `log-${Date.now()}`,
      jobTitle: 'Full Stack React & Node Engineer',
      company: 'NextGen AI Labs',
      portal: 'LinkedIn Jobs',
      timestamp: 'Just now',
      status: 'submitted',
      matchScore: 96,
    };
    setLogs((prev) => [mockLog, ...prev]);
    toast({
      title: 'Manual Cycle Triggered',
      description: 'Applied to NextGen AI Labs (96% Match). Confirmation saved to tracker.',
    });
  };

  return (
    <PageShell
      title="Auto-Apply Engine & Smart Rules"
      subtitle="Automate job applications across major portals with precision AI matching and smart filter rules."
      actions={
        <div className="flex items-center gap-3">
          <Button
            variant={config.enabled ? 'default' : 'outline'}
            className="gap-2 shadow-md"
            onClick={toggleAutomation}
          >
            {config.enabled ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {config.enabled ? 'Pause Auto-Apply' : 'Start Auto-Apply'}
          </Button>
          <Button variant="secondary" className="gap-2" onClick={triggerInstantRun}>
            <Zap className="h-4 w-4 text-amber-500" /> Run Cycle Now
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Status banner */}
        <Card className={`border-2 transition-all ${config.enabled ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-amber-500/40 bg-amber-500/5'}`}>
          <CardContent className="flex flex-col items-start justify-between gap-4 p-5 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${config.enabled ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-amber-500 text-white shadow-lg shadow-amber-500/30'}`}>
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold">
                    Automation Status: {config.enabled ? 'Active & Monitoring' : 'Paused'}
                  </h3>
                  <Badge variant={config.enabled ? 'default' : 'secondary'} className={config.enabled ? 'bg-emerald-500 hover:bg-emerald-600' : ''}>
                    {config.enabled ? 'RUNNING' : 'PAUSED'}
                  </Badge>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {config.enabled
                    ? 'AI scans job portals every 5 minutes and auto-submits applications matching your rules.'
                    : 'Auto-apply is currently paused. Resume anytime to resume automated submissions.'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-primary" /> Interval: 5 mins
              </div>
              <div className="flex items-center gap-1.5">
                <Activity className="h-4 w-4 text-primary" /> Cap: {config.maxDailyApplications}/day
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Panel: Smart Filter Rules */}
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <SlidersHorizontal className="h-5 w-5 text-primary" /> Smart Matching Rules
                </CardTitle>
                <CardDescription>
                  Define non-negotiable criteria. The AI will strictly skip any position failing these rules.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1.5">
                      <DollarSign className="h-4 w-4 text-emerald-500" /> Minimum Salary
                    </Label>
                    <Input
                      value={config.minSalary}
                      onChange={(e) => setConfig({ ...config, minSalary: e.target.value })}
                      placeholder="e.g. $110,000 / 20 LPA"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-1.5">
                      <Briefcase className="h-4 w-4 text-blue-500" /> Experience Level
                    </Label>
                    <Input
                      value={config.experienceYears}
                      onChange={(e) => setConfig({ ...config, experienceYears: e.target.value })}
                      placeholder="e.g. 3 - 8 years"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-1.5">
                      <Globe className="h-4 w-4 text-violet-500" /> Work Mode
                    </Label>
                    <Select
                      value={config.workMode}
                      onValueChange={(val: 'remote' | 'hybrid' | 'onsite' | 'any') =>
                        setConfig({ ...config, workMode: val })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="remote">Remote Only</SelectItem>
                        <SelectItem value="hybrid">Hybrid Allowed</SelectItem>
                        <SelectItem value="onsite">On-site Allowed</SelectItem>
                        <SelectItem value="any">Any Work Mode</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Mandatory Skills */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-primary" /> Mandatory Required Technologies
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add required skill (e.g. React, Docker, Python)..."
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') addSkill(); }}
                    />
                    <Button onClick={addSkill} variant="secondary">Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {config.requiredSkills.map((s) => (
                      <Badge key={s} variant="outline" className="gap-1 bg-primary/5 py-1 text-sm font-medium">
                        {s}
                        <button onClick={() => removeSkill(s)} className="ml-1 text-muted-foreground hover:text-foreground">
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Excluded Companies */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-1.5">
                    <ShieldAlert className="h-4 w-4 text-destructive" /> Exclude Companies & Staffing Agencies
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Company name to exclude..."
                      value={newExclude}
                      onChange={(e) => setNewExclude(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') addExclude(); }}
                    />
                    <Button onClick={addExclude} variant="secondary">Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {config.excludedCompanies.map((c) => (
                      <Badge key={c} variant="destructive" className="gap-1 py-1 text-sm font-medium">
                        {c}
                        <button onClick={() => removeExclude(c)} className="ml-1 opacity-70 hover:opacity-100">
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Live Activity Logs Stream */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Activity className="h-5 w-5 text-primary" /> Live Application Execution Logs
                  </CardTitle>
                  <CardDescription>Real-time stream of jobs evaluated and auto-submitted by AI</CardDescription>
                </div>
                <Badge variant="outline" className="gap-1 text-xs">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Live Stream
                </Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="flex flex-col gap-2 rounded-xl border border-border bg-muted/20 p-3.5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm">{log.jobTitle}</p>
                        <Badge
                          variant={log.status === 'submitted' ? 'default' : 'secondary'}
                          className={log.status === 'submitted' ? 'bg-emerald-500' : 'bg-muted text-muted-foreground'}
                        >
                          {log.status === 'submitted' ? 'Auto-Submitted' : 'Skipped'}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {log.company} • <span className="font-medium text-foreground">{log.portal}</span> • {log.timestamp}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-xs font-semibold text-primary">{log.matchScore}% Match</span>
                        <div className="h-1.5 w-20 rounded bg-muted">
                          <div className="h-1.5 rounded bg-primary" style={{ width: `${log.matchScore}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Panel: Connected Portals & Daily Controls */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Layers className="h-5 w-5 text-primary" /> Connected Job Sources
                </CardTitle>
                <CardDescription>Portals synced for automatic job monitoring</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {config.connectedPortals.map((portal) => (
                  <div
                    key={portal.name}
                    className="flex items-center justify-between rounded-xl border border-border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${portal.connected ? 'bg-emerald-500/10 text-emerald-600' : 'bg-muted text-muted-foreground'}`}>
                        <Building2 className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{portal.name}</p>
                        <p className="text-xs text-muted-foreground">{portal.lastSynced}</p>
                      </div>
                    </div>
                    <Switch
                      checked={portal.connected}
                      onCheckedChange={(val) => {
                        setConfig((prev) => ({
                          ...prev,
                          connectedPortals: prev.connectedPortals.map((p) =>
                            p.name === portal.name ? { ...p, connected: val } : p
                          ),
                        }));
                      }}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
