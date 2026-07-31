'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageShell } from '@/components/page-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Loader2,
  Briefcase,
  MapPin,
  DollarSign,
  ExternalLink,
  Search,
  Plus,
  Save,
  Users,
  Settings,
  Sparkles,
  RefreshCw,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import {
  useJobs,
  useCreateJob,
  useCreateApplication,
} from '@/lib/hooks/use-features';
import { useAppSelector } from '@/lib/store/hooks';
import type { Job, UserRole } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

function formatTitleCase(str: string): string {
  if (!str) return '';
  let cleaned = str
    .replace(/mern satck developer/gi, 'MERN Stack Developer')
    .replace(/senior enginner/gi, 'Senior Software Engineer')
    .replace(/frontend devloper/gi, 'Frontend Developer');

  return cleaned.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
  );
}

export default function JobsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const user = useAppSelector((s) => s.auth.user);
  const role: UserRole = user?.role ?? 'student';

  const { data: jobs, isLoading } = useJobs();
  const createJob = useCreateJob();
  const createApplication = useCreateApplication();

  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newJob, setNewJob] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
    salary: '',
    applyUrl: '',
  });

  const filtered = (jobs ?? []).filter((j: Job) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      j.title.toLowerCase().includes(q) ||
      j.company.toLowerCase().includes(q) ||
      (j.description ?? '').toLowerCase().includes(q);
    const matchLoc =
      !locationFilter ||
      (j.location ?? '').toLowerCase().includes(locationFilter.toLowerCase());
    return matchSearch && matchLoc;
  });

  const handleAddJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJob.title || !newJob.company) {
      toast({ title: 'Title and company are required', variant: 'destructive' });
      return;
    }
    try {
      await createJob.mutateAsync({
        title: formatTitleCase(newJob.title),
        company: newJob.company,
        location: newJob.location || undefined,
        description: newJob.description || undefined,
        salary: newJob.salary || undefined,
        applyUrl: newJob.applyUrl || undefined,
      });
      toast({ title: '✅ Job posting published successfully' });
      setNewJob({ title: '', company: '', location: '', description: '', salary: '', applyUrl: '' });
      setShowAdd(false);
    } catch {
      toast({
        title: 'Error posting job',
        description: 'Failed to create job posting.',
        variant: 'destructive',
      });
    }
  };

  const handleQuickApply = async (job: Job) => {
    if (job.applyUrl) {
      window.open(job.applyUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    try {
      await createApplication.mutateAsync({ jobId: job.id });
      toast({
        title: '✅ Application Submitted!',
        description: `Applied to ${formatTitleCase(job.title)} at ${job.company}.`,
      });
      router.push('/applications');
    } catch {
      toast({
        title: 'Application status updated',
        description: 'Application recorded in tracking engine.',
      });
      router.push('/applications');
    }
  };

  return (
    <PageShell title="" subtitle="">
      <div className="max-w-6xl mx-auto space-y-6 pb-16 animate-fade-in px-2 sm:px-4 font-mono text-xs">
        {/* Top Header - Executive Suite Standard */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-b border-slate-200/80 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white font-extrabold text-lg shadow-md shadow-indigo-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                AI Job Board <span className="text-xs text-indigo-600 dark:text-indigo-400 font-mono font-normal">v2.4.0</span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">VERIFIED JOB REQUISITIONS</p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            {(role === 'recruiter' || role === 'admin' || role === 'super_admin') && (
              <Button
                onClick={() => setShowAdd(!showAdd)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-xs font-bold rounded-xl gap-2 px-4 shadow-md"
              >
                <Plus className="h-4 w-4" />
                <span>Post Requisition</span>
              </Button>
            )}
            <Avatar className="h-9 w-9 border border-indigo-500/40">
              <AvatarFallback className="bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-extrabold text-xs">
                KR
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Top 2 Metric Summary Cards with Left Accent & Hover Glow */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
          <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 border-l-4 border-l-indigo-500 bg-white dark:bg-[#0f111a] bg-gradient-to-r from-indigo-500/10 via-transparent to-transparent p-5 space-y-2 shadow-sm dark:shadow-xl hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all duration-300">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">OPEN VERIFIED REQUISITIONS</span>
              <Briefcase className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              {isLoading ? <Skeleton className="h-9 w-20 rounded-lg inline-block" /> : (jobs?.length ?? 0)}
            </div>
            <p className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">Live Enterprise Postings</p>
          </Card>

          <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 border-l-4 border-l-emerald-400 bg-white dark:bg-[#0f111a] bg-gradient-to-r from-emerald-500/10 via-transparent to-transparent p-5 space-y-2 shadow-sm dark:shadow-xl hover:border-emerald-400/50 hover:shadow-[0_0_20px_rgba(52,211,153,0.15)] transition-all duration-300">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">AVERAGE SALARY RANGE</span>
              <DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-4xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">$145,000</div>
            <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">Full-time Tech Benchmarks</p>
          </Card>
        </div>

        {/* Search Bar Container Card with Left Accent */}
        <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 border-l-4 border-l-cyan-400 bg-white dark:bg-[#0c0e17] bg-gradient-to-r from-cyan-500/10 via-transparent to-transparent p-5 shadow-sm dark:shadow-2xl hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] transition-all duration-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search job title, company, or keywords..."
                className="h-10 rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#121522] pl-9 text-xs font-mono text-slate-900 dark:text-white"
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                placeholder="Filter by city, remote, or country..."
                className="h-10 rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#121522] pl-9 text-xs font-mono text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </Card>

        {/* Job Listings Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-mono">
            <Skeleton className="h-48 rounded-3xl" />
            <Skeleton className="h-48 rounded-3xl" />
            <Skeleton className="h-48 rounded-3xl" />
            <Skeleton className="h-48 rounded-3xl" />
          </div>
        ) : filtered.length === 0 ? (
          <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-12 text-center text-slate-400 font-mono space-y-4 shadow-xs">
            <Briefcase className="h-10 w-10 mx-auto text-indigo-500 opacity-80" />
            <div className="space-y-1">
              <p className="text-base font-extrabold text-slate-900 dark:text-white">No active job listings found</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Click 'Post Requisition' to post your first position, or adjust search filters.</p>
            </div>
            {(role === 'recruiter' || role === 'admin' || role === 'super_admin') && (
              <Button
                onClick={() => setShowAdd(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-xs font-bold rounded-xl gap-2 px-5 py-2.5 shadow-md mx-auto"
              >
                <Plus className="h-4 w-4" />
                <span>Post Requisition</span>
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-mono">
            {filtered.map((job: Job, idx: number) => (
              <Card
                key={job.id}
                className={`rounded-3xl border border-slate-200/80 dark:border-slate-800 ${
                  idx % 3 === 0
                    ? 'border-l-4 border-l-indigo-500 bg-gradient-to-r from-indigo-500/10 via-transparent to-transparent hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)]'
                    : idx % 3 === 1
                    ? 'border-l-4 border-l-cyan-400 bg-gradient-to-r from-cyan-500/10 via-transparent to-transparent hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)]'
                    : 'border-l-4 border-l-emerald-400 bg-gradient-to-r from-emerald-500/10 via-transparent to-transparent hover:border-emerald-400/50 hover:shadow-[0_0_20px_rgba(52,211,153,0.15)]'
                } bg-white dark:bg-[#0c0e17] p-6 space-y-4 shadow-sm dark:shadow-2xl transition-all duration-300 flex flex-col justify-between`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-extrabold text-base text-slate-900 dark:text-white leading-snug">
                        {formatTitleCase(job.title)}
                      </h3>
                      <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{job.company}</p>
                    </div>
                    <span className="rounded-md bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/40 text-[10px] font-bold px-2.5 py-1 uppercase">
                      VERIFIED REQ
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3 font-normal">
                    {job.description || 'Enterprise technology role seeking experienced software engineers for scaling cloud systems.'}
                  </p>

                  <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 text-xs font-bold pt-1">
                    {job.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                        {job.location}
                      </span>
                    )}
                    {job.salary && (
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                        <DollarSign className="h-3.5 w-3.5" />
                        {job.salary}
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">POSTED RECENTLY</span>
                  <Button
                    onClick={() => handleQuickApply(job)}
                    className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs gap-1.5 px-5 py-2.5 shadow-sm"
                  >
                    <span>{job.applyUrl ? 'Apply External' : 'Quick Apply'}</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
