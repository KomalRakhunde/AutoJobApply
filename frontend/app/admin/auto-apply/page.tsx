'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Zap,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Terminal,
  Activity,
  Layers,
  ShieldCheck,
  Server,
  Maximize2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WorkerItem {
  id: string;
  status: 'ACTIVE' | 'WAITING' | 'PAUSED';
  jobType: string;
  platform: string;
  progress: number;
}

const initialWorkers: WorkerItem[] = [
  { id: '#9c02..4a1', status: 'ACTIVE', jobType: 'Application-Submit', platform: 'LinkedIn', progress: 85 },
  { id: '#4f18..2e3', status: 'ACTIVE', jobType: 'Captcha-Solving', platform: 'Indeed', progress: 60 },
  { id: '#7a52..1b9', status: 'WAITING', jobType: 'Scraper-Init', platform: 'Greenhouse', progress: 10 },
];

export default function AdminAutoApplyMatrix() {
  const { toast } = useToast();
  const [workers, setWorkers] = useState<WorkerItem[]>(initialWorkers);
  const [queuePaused, setQueuePaused] = useState(false);

  const handleTogglePauseQueue = () => {
    const next = !queuePaused;
    setQueuePaused(next);
    toast({
      title: next ? '⏸️ Worker Queue Paused' : '▶️ Worker Queue Resumed',
      description: next ? 'All background auto-apply dispatchers paused.' : 'All 42 active worker nodes resumed.',
    });
  };

  const handleFlushQueue = () => {
    toast({
      title: '🧹 Queue Flushed',
      description: 'Cleared waiting queue buffer in Redis.',
    });
  };

  const handleForceReconnect = () => {
    toast({
      title: '⚡ Reconnected Scraper Mesh',
      description: 'Re-established connection to 128 online proxy nodes.',
    });
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans text-sm pb-12">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              LIVE SYSTEM MONITOR
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
            Auto-Apply Queue & Proxy Matrix
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={handleForceReconnect}
            variant="outline"
            className="rounded-xl border-slate-200 dark:border-slate-800 text-xs font-bold gap-2 py-2 px-4 shadow-xs"
          >
            <RefreshCw className="h-4 w-4 text-slate-500" />
            <span>Force Reconnect</span>
          </Button>

          <Button
            onClick={handleTogglePauseQueue}
            className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs py-2 px-4 rounded-xl shadow-md gap-2"
          >
            {queuePaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            <span>{queuePaused ? 'Resume All Workers' : 'Pause All Workers'}</span>
          </Button>
        </div>
      </div>

      {/* MAIN GRID WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Queue Table & Proxy Matrix (lg:col-span-8) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Card 1: BullMQ / Redis Worker Queue */}
          <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0b0f19] p-6 space-y-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-blue-500" />
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight uppercase">
                  BULLMQ / REDIS WORKER QUEUE
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={handleTogglePauseQueue}
                  variant="outline"
                  className="rounded-lg text-[10px] font-bold h-7 px-3 border-slate-300 dark:border-slate-800"
                >
                  {queuePaused ? 'RESUME' : 'PAUSE'}
                </Button>
                <Button
                  onClick={handleFlushQueue}
                  variant="outline"
                  className="rounded-lg text-[10px] font-bold h-7 px-3 border-rose-200 dark:border-rose-950 text-rose-600 dark:text-rose-400 hover:bg-rose-50"
                >
                  FLUSH ALL
                </Button>
              </div>
            </div>

            {/* Queue Counter Metrics */}
            <div className="grid grid-cols-4 gap-4 text-center">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0f111a] border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase">WAITING</span>
                <p className="text-xl font-black text-blue-600 dark:text-blue-400 mt-0.5">1,248</p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0f111a] border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase">ACTIVE</span>
                <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">42</p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0f111a] border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase">COMPLETED</span>
                <p className="text-xl font-black text-slate-900 dark:text-white mt-0.5">8,902</p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0f111a] border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase">FAILED</span>
                <p className="text-xl font-black text-rose-600 dark:text-rose-400 mt-0.5">12</p>
              </div>
            </div>

            {/* Worker Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left font-sans text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    <th className="py-2.5 px-3">WORKER ID</th>
                    <th className="py-2.5 px-3">STATUS</th>
                    <th className="py-2.5 px-3">JOB TYPE</th>
                    <th className="py-2.5 px-3">PLATFORM</th>
                    <th className="py-2.5 px-3">PROGRESS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono text-xs">
                  {workers.map((w) => (
                    <tr key={w.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                      <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">{w.id}</td>
                      <td className="py-3 px-3">
                        <Badge
                          className={`font-extrabold text-[9px] px-2 py-0.5 rounded ${
                            w.status === 'ACTIVE'
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                          }`}
                        >
                          {w.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-slate-700 dark:text-slate-300 font-sans">{w.jobType}</td>
                      <td className="py-3 px-3 font-sans font-bold text-slate-900 dark:text-white">{w.platform}</td>
                      <td className="py-3 px-3">
                        <div className="w-32 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-blue-600 rounded-full transition-all duration-300"
                            style={{ width: `${w.progress}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Card 2: Proxy Health Matrix */}
          <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0b0f19] p-6 space-y-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Server className="h-4 w-4 text-emerald-500" />
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight uppercase">
                  PROXY HEALTH MATRIX
                </h3>
              </div>

              <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
                <span className="flex items-center gap-1">
                  <span className="h-2.5 w-2.5 rounded-sm bg-emerald-400" /> Healthy
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2.5 w-2.5 rounded-sm bg-rose-500" /> Flagged
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2.5 w-2.5 rounded-sm bg-slate-300 dark:bg-slate-700" /> Idle
                </span>
              </div>
            </div>

            {/* 5x10 Proxy Grid Blocks */}
            <div className="grid grid-cols-10 gap-2 p-2">
              {Array.from({ length: 50 }).map((_, i) => {
                const isFlagged = [12, 23, 34, 41, 42, 43].includes(i);
                const isIdle = [7, 17, 27, 37, 47].includes(i);
                return (
                  <div
                    key={i}
                    className={`h-7 rounded-md transition-all ${
                      isFlagged
                        ? 'bg-rose-500/80 shadow-xs'
                        : isIdle
                        ? 'bg-slate-200 dark:bg-slate-800'
                        : 'bg-emerald-400/80 dark:bg-emerald-500/80 shadow-xs'
                    }`}
                  />
                );
              })}
            </div>

            {/* 3 Metric Summary Boxes */}
            <div className="grid grid-cols-3 gap-4 pt-2 font-sans">
              <div className="p-3.5 rounded-2xl bg-blue-50/50 dark:bg-[#0f111a] border border-blue-200 dark:border-blue-900/40">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block uppercase">
                  AVG. RESPONSE TIME
                </span>
                <h4 className="text-lg font-black text-slate-900 dark:text-white mt-1">342ms</h4>
              </div>

              <div className="p-3.5 rounded-2xl bg-blue-50/50 dark:bg-[#0f111a] border border-blue-200 dark:border-blue-900/40">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block uppercase">
                  CAPTCHA SUCCESS RATE
                </span>
                <h4 className="text-lg font-black text-slate-900 dark:text-white mt-1">94.2%</h4>
              </div>

              <div className="p-3.5 rounded-2xl bg-blue-50/50 dark:bg-[#0f111a] border border-blue-200 dark:border-blue-900/40">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block uppercase">
                  IP ROTATIONS (24H)
                </span>
                <h4 className="text-lg font-black text-slate-900 dark:text-white mt-1">12,402</h4>
              </div>
            </div>
          </Card>

        </div>

        {/* RIGHT COLUMN: System Health & Live Terminal Console (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Card 1: System Health Dark Navy Panel */}
          <Card className="rounded-3xl border border-slate-800 bg-[#090d16] text-white p-6 space-y-5 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">
                  SYSTEM HEALTH
                </span>
                <h2 className="text-3xl font-black text-white tracking-tight mt-1">99.8%</h2>
                <p className="text-[11px] text-slate-400">Total Uptime (30d)</p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <ShieldCheck className="h-6 w-6" />
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t border-slate-800">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-300">Database (Redis)</span>
                  <span className="text-emerald-400">OPERATIONAL</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full w-[99%]" />
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-300">Scraper Nodes</span>
                  <span className="text-emerald-400">128/130 ONLINE</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full w-[95%]" />
                </div>
              </div>
            </div>
          </Card>

          {/* Card 2: Live Terminal Console (Worker_Log_v2.1) */}
          <Card className="rounded-3xl border border-slate-800 bg-[#07090e] text-emerald-400 p-5 space-y-3 shadow-2xl font-mono text-xs overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-rose-500 inline-block" />
                <span className="h-3 w-3 rounded-full bg-amber-500 inline-block" />
                <span className="h-3 w-3 rounded-full bg-emerald-500 inline-block text-[8px]" />
                <span className="font-bold text-xs text-slate-200 ml-2">Worker_Log_v2.1</span>
              </div>
              <Maximize2 className="h-3.5 w-3.5 cursor-pointer" />
            </div>

            <div className="space-y-2 h-72 overflow-y-auto leading-relaxed pt-1 text-[11px]">
              <p className="text-slate-400">[09:23:58] [CAPTCHA] Success in 4.2s. Resume navigation.</p>
              <p className="text-blue-400">[09:23:58] [QUEUE] Fetching next batch of jobs from LinkedIn API...</p>
              <p className="text-slate-400">[09:23:58] [QUEUE] Redis heartbeat: Latency 12ms</p>
              <p className="text-emerald-400">[09:23:58] [WORKER] Application submitted successfully to Airbnb.</p>
              <p className="text-slate-400">[09:23:58] [CAPTCHA] Success in 4.2s. Resume navigation.</p>
              <p className="text-slate-400">[09:23:58] [QUEUE] Redis heartbeat: Latency 12ms</p>
              <p className="text-blue-400">[09:23:58] [QUEUE] Fetching next batch of jobs from LinkedIn API...</p>
              <p className="text-slate-400">[09:24:01] [QUEUE] Redis heartbeat: Latency 12ms</p>
            </div>
          </Card>

        </div>

      </div>

    </div>
  );
}
