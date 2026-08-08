'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  Globe,
  Play,
  Pause,
  RotateCw,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Trash2,
  Search,
  Check,
  X,
  Server,
  Layers,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ScraperItem {
  id: string;
  target: string;
  interval: string;
  status: 'Running' | 'Paused' | 'Error';
  lastSync: string;
  scrapedCount: number;
  successRate: number;
}

const initialScrapers: ScraperItem[] = [
  { id: 'scr_01', target: 'LinkedIn Jobs API', interval: 'Every 15 mins', status: 'Running', lastSync: '2 mins ago', scrapedCount: 14200, successRate: 99.4 },
  { id: 'scr_02', target: 'Indeed Scraper Cluster', interval: 'Every 30 mins', status: 'Running', lastSync: '8 mins ago', scrapedCount: 8900, successRate: 96.1 },
  { id: 'scr_03', target: 'Greenhouse Board Feeds', interval: 'Hourly', status: 'Paused', lastSync: '1 hr ago', scrapedCount: 5200, successRate: 100 },
  { id: 'scr_04', target: 'Lever API Integration', interval: 'Every 2 hrs', status: 'Error', lastSync: '3 hrs ago', scrapedCount: 1800, successRate: 78.2 },
];

interface JobRequisition {
  id: string;
  title: string;
  company: string;
  location: string;
  source: string;
  flaggedReason?: string;
  status: 'Pending Review' | 'Approved' | 'Flagged';
}

const initialJobs: JobRequisition[] = [
  { id: 'job_401', title: 'Senior Full Stack Engineer', company: 'TechCorp Solutions', location: 'San Francisco, CA (Hybrid)', source: 'LinkedIn API', status: 'Approved' },
  { id: 'job_402', title: 'Data Scientist (Remote)', company: 'InnovateAI Inc', location: 'Remote', source: 'Greenhouse Feed', status: 'Approved' },
  { id: 'job_403', title: 'Work From Home - Make $500/day', company: 'Unknown Entity', location: 'Worldwide', source: 'Indeed Scraper', flaggedReason: 'Potential Spam / Phishing', status: 'Flagged' },
  { id: 'job_404', title: 'Product Manager - AI Platform', company: 'NextGen Cloud', location: 'New York, NY', source: 'Lever API', status: 'Pending Review' },
];

export default function ScraperJobControlPage() {
  const { toast } = useToast();
  const [scrapers, setScrapers] = useState<ScraperItem[]>(initialScrapers);
  const [requisitions, setRequisitions] = useState<JobRequisition[]>(initialJobs);

  const toggleScraper = (id: string) => {
    setScrapers((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: s.status === 'Running' ? 'Paused' : 'Running' } : s
      )
    );
    toast({
      title: '⚙️ Scraper Updated',
      description: `Toggled scraper cluster status.`,
    });
  };

  const handleApproveJob = (id: string) => {
    setRequisitions((prev) =>
      prev.map((j) => (j.id === id ? { ...j, status: 'Approved' } : j))
    );
    toast({ title: '✅ Requisition Approved', description: 'Job added to platform index.' });
  };

  const handleRemoveJob = (id: string) => {
    setRequisitions((prev) => prev.filter((j) => j.id !== id));
    toast({ title: '🗑️ Requisition Removed', description: 'Spam job deleted from central database.' });
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans text-sm pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Job Aggregator & Scraping Control
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Crawler schedulers, master requisition moderation, and scraper selector diagnostics.
          </p>
        </div>

        <Button className="bg-black dark:bg-white text-white dark:text-slate-900 font-extrabold text-xs rounded-xl gap-2">
          <Play className="h-4 w-4" />
          <span>Trigger All Crawlers</span>
        </Button>
      </div>

      {/* CRAWLER SCHEDULER & SCRAPER CLUSTERS */}
      <div className="space-y-3">
        <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Active Job Crawlers & Sync Schedulers</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {scrapers.map((s) => (
            <Card key={s.id} className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0b0f19] p-4 space-y-3 shadow-xs">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">{s.target}</h4>
                  <p className="text-[11px] text-slate-400 font-medium">{s.interval}</p>
                </div>
                <Badge className={
                  s.status === 'Running' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' :
                  s.status === 'Paused' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' :
                  'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                }>
                  {s.status}
                </Badge>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold text-slate-500">
                  <span>Selector Success</span>
                  <span>{s.successRate}%</span>
                </div>
                <Progress value={s.successRate} className="h-1.5 bg-slate-100 dark:bg-slate-900" />
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
                <span>{s.scrapedCount.toLocaleString()} jobs indexed</span>
                <Button onClick={() => toggleScraper(s.id)} variant="outline" size="sm" className="h-7 text-[11px] font-bold rounded-lg gap-1">
                  {s.status === 'Running' ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                  <span>{s.status === 'Running' ? 'Pause' : 'Start'}</span>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* MASTER REQUISITION MODERATION TABLE */}
      <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0b0f19] p-6 space-y-4 shadow-sm">
        <div>
          <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Master Requisition Moderation Desk</h3>
          <p className="text-xs text-slate-400">Review, flag, or remove spam job postings from the central database</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-xs">
            <thead>
              <tr className="border-b border-slate-200/80 dark:border-slate-800 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Job Title</th>
                <th className="py-3 px-4">Company</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Feed Source</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {requisitions.map((j) => (
                <tr key={j.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/50 transition-colors">
                  <td className="py-3.5 px-4 font-extrabold text-slate-900 dark:text-white">
                    {j.title}
                    {j.flaggedReason && <span className="block text-[10px] text-rose-500 font-semibold">{j.flaggedReason}</span>}
                  </td>
                  <td className="py-3.5 px-4 font-medium">{j.company}</td>
                  <td className="py-3.5 px-4 text-slate-500">{j.location}</td>
                  <td className="py-3.5 px-4 text-slate-400">{j.source}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full font-extrabold text-[10px] ${
                      j.status === 'Approved' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' :
                      j.status === 'Flagged' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' :
                      'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      {j.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    {j.status !== 'Approved' && (
                      <Button onClick={() => handleApproveJob(j.id)} size="sm" className="bg-emerald-600 text-white font-bold text-xs h-7 rounded-lg">
                        Approve
                      </Button>
                    )}
                    <Button onClick={() => handleRemoveJob(j.id)} variant="ghost" size="sm" className="text-rose-600 font-bold text-xs h-7">
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
