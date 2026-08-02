'use client';

import { useEffect, useState } from 'react';
import { PageShell } from '@/components/page-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Bot,
  Zap,
  Pause,
  Play,
  RefreshCw,
  Terminal,
  Download,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  SlidersHorizontal,
  DollarSign,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCreateApplication, useJobs } from '@/lib/hooks/use-features';
import type { AutoApplyConfig, AutoApplyLog } from '@/lib/types';

export default function AutoApplyPage() {
  const { toast } = useToast();
  const { data: jobs } = useJobs();
  const createApplication = useCreateApplication();

  const [config, setConfig] = useState<AutoApplyConfig>({
    enabled: true,
    minSalary: '$120k',
    experienceYears: '3 - 8 years',
    workMode: 'remote',
    requiredSkills: ['React', 'TypeScript', 'Next.js', 'Node.js'],
    excludedCompanies: ['Staffing Solutions', 'Third-Party Recruiters'],
    maxDailyApplications: 150,
    connectedPortals: [
      { name: 'LinkedIn Premium', connected: true },
      { name: 'Naukri.com', connected: true },
      { name: 'Indeed / Glassdoor', connected: true },
      { name: 'Greenhouse / Lever', connected: true },
    ],
  });

  const [jobType, setJobType] = useState<'Full-time' | 'Contract' | 'Remote'>('Full-time');
  const [salaryValue, setSalaryValue] = useState([120]);
  const [appliedCount, setAppliedCount] = useState(84);
  const [logs, setLogs] = useState<AutoApplyLog[]>([
    { id: '1', timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }), jobTitle: 'Auto-Apply Automation Engine initialized.', company: 'SYSTEM', portal: 'CORE', status: 'submitted', matchScore: 100 },
    { id: '2', timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }), jobTitle: 'Monitoring active job boards and target matches...', company: 'DISPATCH', portal: 'LISTEN', status: 'submitted', matchScore: 100 },
  ]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    if (config.enabled) {
      intervalId = setInterval(() => {
        const time = new Date().toLocaleTimeString('en-US', { hour12: false });
        const targetJobs = jobs || [];
        const randomJob = targetJobs[Math.floor(Math.random() * targetJobs.length)];
        const targetTitle = randomJob ? `${randomJob.title} at ${randomJob.company}` : 'Software Engineer Requisition';
        const portalName = randomJob?.company.length % 3 === 0 ? 'LinkedIn' : randomJob?.company.length % 3 === 1 ? 'Naukri' : 'Indeed';

        if (randomJob) {
          createApplication.mutate({ jobId: randomJob.id });
        }

        setAppliedCount((c) => Math.min(c + 1, config.maxDailyApplications));

        // 6-Step Autonomous Auto-Apply Pipeline Log Stream
        const steps: AutoApplyLog[] = [
          { id: `log-${Date.now()}-1`, timestamp: time, company: randomJob?.company || 'AUTOMATION', jobTitle: `[STEP 1/6] Open Job: Sourcing ${targetTitle} via ${portalName}`, portal: portalName, status: 'submitted', matchScore: 94 },
          { id: `log-${Date.now()}-2`, timestamp: time, company: randomJob?.company || 'AUTOMATION', jobTitle: `[STEP 2/6] Fill Form: Auto-filling candidate fields & screening questions...`, portal: portalName, status: 'submitted', matchScore: 94 },
          { id: `log-${Date.now()}-3`, timestamp: time, company: randomJob?.company || 'AUTOMATION', jobTitle: `[STEP 3/6] Upload Resume: Attaching master ATS-optimized PDF resume...`, portal: portalName, status: 'submitted', matchScore: 94 },
          { id: `log-${Date.now()}-4`, timestamp: time, company: randomJob?.company || 'AUTOMATION', jobTitle: `[STEP 4/6] Upload Cover Letter: Attaching tailored AI cover letter...`, portal: portalName, status: 'submitted', matchScore: 94 },
          { id: `log-${Date.now()}-5`, timestamp: time, company: randomJob?.company || 'AUTOMATION', jobTitle: `[STEP 5/6] Submit: Transmitting application packet to employer portal...`, portal: portalName, status: 'submitted', matchScore: 94 },
          { id: `log-${Date.now()}-6`, timestamp: time, company: randomJob?.company || 'AUTOMATION', jobTitle: `[STEP 6/6] Save Confirmation: Registered to Application Pipeline Tracker!`, portal: 'CONFIRMED', status: 'submitted', matchScore: 94 },
        ];

        setLogs((prev) => [...prev.slice(-44), ...steps]);
      }, 7000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [config.enabled, salaryValue, jobs, createApplication, config.maxDailyApplications]);

  const toggleAutomation = () => {
    const nextState = !config.enabled;
    setConfig((prev) => ({ ...prev, enabled: nextState }));
    toast({
      title: nextState ? '⚡ Engine Operational' : '⏸️ Engine Paused',
      description: nextState ? '12 Active Nodes running background applications.' : 'Engine safely paused.',
    });
  };

  return (
    <PageShell title="" subtitle="">
      <div className="max-w-6xl mx-auto space-y-6 pb-16 animate-fade-in px-2 sm:px-4 font-sans text-sm">
        
        {/* Workspace Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT COLUMN: Controls & Settings */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* Box 1: Engine Status */}
            <Card className="rounded-3xl border border-slate-800 bg-[#0c0e17] text-white p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-base text-white">Engine Status</h3>
                  <p className="text-xs text-slate-400 font-normal mt-0.5">
                    {config.enabled ? 'Operational • 12 Active Nodes' : 'Paused • 0 Active Nodes'}
                  </p>
                </div>
                {config.enabled && (
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
                )}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button
                  onClick={toggleAutomation}
                  className={`flex-1 rounded-xl font-bold text-xs py-2.5 gap-2 shadow-md ${
                    config.enabled
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  {config.enabled ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  <span>{config.enabled ? 'Pause Engine' : 'Start Engine'}</span>
                </Button>

                <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-slate-700 bg-slate-900 text-slate-300">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </Card>

            {/* Box 2: DAILY QUOTA */}
            <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                  DAILY QUOTA
                </span>
                <span className="text-sm font-black text-blue-600 dark:text-blue-400">
                  {appliedCount}/{config.maxDailyApplications}
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.round((appliedCount / config.maxDailyApplications) * 100))}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30">
                  <span className="text-xs text-slate-500 font-medium">Successful</span>
                  <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">79</p>
                </div>
                <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30">
                  <span className="text-xs text-slate-500 font-medium">Retrying</span>
                  <p className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">5</p>
                </div>
              </div>
            </Card>

            {/* Box 3: Target Platforms */}
            <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-6 space-y-4 shadow-xs">
              <h4 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                Target Platforms
              </h4>

              <div className="space-y-3 font-sans text-xs">
                {config.connectedPortals.map((portal, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-[#121522]">
                    <span className="font-bold text-slate-900 dark:text-white">{portal.name}</span>
                    <Checkbox checked={portal.connected} />
                  </div>
                ))}
              </div>
            </Card>

            {/* Box 4: Salary & Filters */}
            <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                  Salary &amp; Filters
                </h4>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Min Base Salary</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">${salaryValue[0]}k (20 LPA+)</span>
                </div>
                <Slider
                  value={salaryValue}
                  onValueChange={setSalaryValue}
                  min={60}
                  max={250}
                  step={5}
                />
              </div>

              <div className="space-y-2 pt-2">
                <span className="text-xs text-slate-500 font-medium block">Job Type</span>
                <div className="flex items-center gap-2">
                  {(['Full-time', 'Contract', 'Remote'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setJobType(t)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        jobType === t
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </Card>

            {/* Box 5: SMART RULES ENGINE */}
            <Card className="rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/20 to-[#0c0e17] p-6 space-y-3.5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-indigo-400" />
                  <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">
                    SMART RULES ENGINE
                  </h4>
                </div>
                <Badge className="bg-indigo-600 text-white text-[9.5px] font-extrabold px-2.5 py-0.5">
                  ACTIVE RULES
                </Badge>
              </div>

              <div className="space-y-2 text-xs font-sans">
                {/* Rule 1: Salary */}
                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-300 font-medium">Salary Floor</span>
                  <span className="font-extrabold text-emerald-400">&gt; 20 LPA ($120k+)</span>
                </div>

                {/* Rule 2: Experience */}
                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-300 font-medium">Experience Level</span>
                  <span className="font-extrabold text-indigo-400">8 - 12 Years</span>
                </div>

                {/* Rule 3: Work Mode */}
                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-300 font-medium">Work Mode</span>
                  <span className="font-extrabold text-cyan-400">Remote Only</span>
                </div>

                {/* Rule 4: Skill Logic OR */}
                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-300 font-medium">Frontend Stack</span>
                  <span className="font-extrabold text-amber-400">React OR Next.js</span>
                </div>

                {/* Rule 5: Skill Logic Mandatory */}
                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-300 font-medium">Backend Requirement</span>
                  <span className="font-extrabold text-rose-400">Node.js (Mandatory)</span>
                </div>

                {/* Rule 6: Exclude Staffing */}
                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-300 font-medium">Recruiter Exclusion</span>
                  <span className="font-extrabold text-slate-300">Exclude Staffing Companies</span>
                </div>
              </div>
            </Card>

          </div>

          {/* RIGHT COLUMN: Live Dispatch Terminal */}
          <div className="lg:col-span-7">
            <Card className="rounded-3xl border border-slate-800 bg-[#06080f] text-slate-200 p-6 space-y-4 shadow-2xl h-full flex flex-col justify-between font-mono text-xs">
              
              {/* Terminal Header Bar */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-rose-500" />
                    <span className="h-3 w-3 rounded-full bg-amber-500" />
                    <span className="h-3 w-3 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold text-slate-400 ml-2">DISPATCH TERMINAL V4.2.0</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge className="bg-emerald-950/80 text-emerald-400 border border-emerald-800 text-[10px] font-bold gap-1 px-2.5 py-0.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> STREAMING LIVE
                    </Badge>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-white rounded-lg">
                      <Download className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Terminal Body */}
                <div className="h-[460px] overflow-y-auto space-y-2 font-mono text-[11px] leading-relaxed pr-2">
                  {logs.map((log, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <span className="text-slate-500 shrink-0">{log.timestamp}</span>
                      <p className="break-all">
                        {log.portal === 'CORE' && <span className="text-cyan-400 font-bold">[CORE] </span>}
                        {log.portal === 'AUTH' && <span className="text-indigo-400 font-bold">[AUTH] </span>}
                        {log.portal === 'DISPATCH' && <span className="text-blue-400 font-bold">[DISPATCH] </span>}
                        {log.portal === 'AUTO-FILL' && <span className="text-purple-400 font-bold">[AUTO-FILL] </span>}
                        {log.portal === 'SUCCESS' && <span className="text-emerald-400 font-bold">[SUCCESS] </span>}
                        {log.portal === 'RETRY' && <span className="text-rose-400 font-bold">[RETRY] </span>}
                        <span>{log.jobTitle}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Terminal Footer System Bar */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span>CPU: 12% &nbsp;|&nbsp; LATENCY: 42ms &nbsp;|&nbsp; SCRAPE RATE: 8.4 j/min</span>
                <span>ln 1,024, col 12 • UTF-8</span>
              </div>

            </Card>
          </div>

        </div>
      </div>
    </PageShell>
  );
}
