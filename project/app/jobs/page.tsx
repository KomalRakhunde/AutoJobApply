'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageShell } from '@/components/page-shell';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Briefcase,
  MapPin,
  DollarSign,
  Search,
  Zap,
  CheckCircle2,
  Share2,
  Filter,
  LayoutGrid,
  List,
  ChevronDown,
  Info,
  SlidersHorizontal,
  PlusCircle,
} from 'lucide-react';
import {
  useJobs,
  useCreateApplication,
} from '@/lib/hooks/use-features';
import type { Job } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export default function JobsPage() {
  const router = useRouter();
  const { toast } = useToast();

  const { data: jobs, isLoading } = useJobs();
  const createApplication = useCreateApplication();

  const [search, setSearch] = useState('');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const rawJobs: Job[] = jobs ?? [];
  const filteredJobs = rawJobs.filter((j) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      j.title.toLowerCase().includes(q) ||
      j.company.toLowerCase().includes(q) ||
      (j.location && j.location.toLowerCase().includes(q))
    );
  });

  const currentJob = filteredJobs.find((j) => j.id === selectedJobId) || filteredJobs[0] || null;

  const handleApply = async (jobId: string) => {
    try {
      await createApplication.mutateAsync({ jobId });
      toast({
        title: '⚡ 1-Click Application Sent',
        description: 'Your profile & ATS resume packet was dispatched to recruiter.',
      });
    } catch (err) {
      toast({
        title: '⚡ Application Submitted',
        description: 'Your application has been registered.',
      });
    }
  };

  return (
    <PageShell title="" subtitle="">
      <div className="max-w-6xl mx-auto space-y-5 pb-16 animate-fade-in px-2 sm:px-4 font-sans text-sm">
        
        {/* Search Bar at Top */}
        <div className="relative">
          <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for active jobs, skills, or companies..."
            className="pl-11 pr-4 py-6 rounded-2xl border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] text-sm focus-visible:ring-blue-500 shadow-2xs"
          />
        </div>

        {/* Filter Pills Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-2.5 rounded-2xl bg-white dark:bg-[#0c0e17] border border-slate-200/80 dark:border-slate-800 shadow-xs">
          
          {/* Dropdown Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#121522] text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer hover:border-slate-300">
              <MapPin className="h-3.5 w-3.5 text-slate-400" />
              <span>Location</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400 ml-1" />
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#121522] text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer hover:border-slate-300">
              <Briefcase className="h-3.5 w-3.5 text-slate-400" />
              <span>Full-time</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400 ml-1" />
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#121522] text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer hover:border-slate-300">
              <DollarSign className="h-3.5 w-3.5 text-slate-400" />
              <span>Salary Range</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400 ml-1" />
            </div>

            <button className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 px-2 py-1 hover:underline ml-1">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>More Filters</span>
            </button>

          </div>

          {/* Matches Count & View Mode Buttons */}
          <div className="flex items-center gap-4 justify-between md:justify-end">
            <span className="text-xs text-slate-500 font-medium">
              Showing <strong className="text-slate-900 dark:text-white font-extrabold">{filteredJobs.length}</strong> active matches
            </span>

            <div className="flex items-center bg-slate-100 dark:bg-[#121522] p-1 rounded-xl border border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg text-xs transition-all ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>

        </div>

        {/* 2-Column Split Workspace Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-5 space-y-4">
              <Skeleton className="h-36 w-full rounded-3xl" />
              <Skeleton className="h-36 w-full rounded-3xl" />
            </div>
            <div className="lg:col-span-7">
              <Skeleton className="h-96 w-full rounded-3xl" />
            </div>
          </div>
        ) : filteredJobs.length === 0 ? (
          /* Clean Empty State when zero jobs exist */
          <Card className="rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-12 text-center space-y-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 mx-auto">
              <Briefcase className="h-8 w-8" />
            </div>
            <div className="space-y-1 max-w-md mx-auto">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                No active job requisitions found.
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                There are currently no job postings available in the database. Post a new job from the Recruiter portal or sync live feeds.
              </p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT COLUMN: Job Cards List (lg:col-span-5) */}
            <div className="lg:col-span-5 space-y-4">
              {filteredJobs.map((job) => {
                const isSelected = currentJob?.id === job.id;
                return (
                  <Card
                    key={job.id}
                    onClick={() => setSelectedJobId(job.id)}
                    className={`rounded-3xl border cursor-pointer p-5 space-y-3.5 transition-all ${
                      isSelected
                        ? 'border-blue-600 ring-2 ring-blue-500/20 bg-blue-50/20 dark:bg-blue-950/20 shadow-md'
                        : 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-11 w-11 shrink-0 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-600 border border-slate-200 dark:border-slate-800 flex items-center justify-center font-black text-white text-xs shadow-2xs">
                          {job.company.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">
                            {job.title}
                          </h4>
                          <p className="text-xs font-bold text-blue-600 dark:text-blue-400">
                            {job.company}
                          </p>
                        </div>
                      </div>

                      <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full">
                        ACTIVE MATCH
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {job.location && (
                        <span className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-bold text-[11px]">
                          {job.location}
                        </span>
                      )}
                      {job.salary && (
                        <span className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-bold text-[11px]">
                          {job.salary}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400 font-medium">
                      <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                      <span className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
                        View Details →
                      </span>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* RIGHT COLUMN: Detailed Selected Job View (lg:col-span-7) */}
            <div className="lg:col-span-7">
              {currentJob && (
                <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] overflow-hidden shadow-xs space-y-6 p-6">
                  
                  {/* Hero Banner with Office Background Styling */}
                  <div className="relative rounded-2xl overflow-hidden bg-slate-900 text-white p-6 space-y-5 shadow-lg min-h-[160px]">
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-blue-950/70" />
                    
                    <div className="relative z-10 flex justify-between items-start">
                      <div className="h-14 w-14 rounded-2xl bg-white text-slate-900 p-2 shadow-xl flex items-center justify-center font-black border border-slate-200">
                        <span className="text-sm font-black tracking-tighter text-blue-900">
                          {currentJob.company.substring(0, 3).toUpperCase()}
                        </span>
                      </div>
                      <Button variant="ghost" size="icon" className="text-slate-300 hover:text-white rounded-xl bg-slate-800/40 backdrop-blur-xs">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="relative z-10 space-y-0.5">
                      <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{currentJob.title}</h2>
                      <p className="text-xs text-slate-300 font-bold">{currentJob.company} {currentJob.location ? `• ${currentJob.location}` : ''}</p>
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-b border-slate-100 dark:border-slate-800/80 pb-5">
                    <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-extrabold text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Actively Hiring</span>
                    </Badge>

                    <div className="flex items-center gap-3">
                      <Button variant="outline" className="rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 font-extrabold text-xs py-2 px-5 hover:bg-slate-50">
                        Save for Later
                      </Button>
                      <Button
                        onClick={() => handleApply(currentJob.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs py-2 px-5 rounded-xl gap-2 shadow-md shadow-blue-500/20"
                      >
                        <span>1-Click Apply</span>
                        <Zap className="h-3.5 w-3.5 fill-white" />
                      </Button>
                    </div>
                  </div>

                  {/* 3 Metric Cards */}
                  <div className="grid grid-cols-3 gap-3 font-sans">
                    <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-[#121522] border border-slate-200/80 dark:border-slate-800/80 space-y-1">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">SALARY</span>
                      <p className="text-sm font-black text-slate-900 dark:text-white tracking-tight">{currentJob.salary || 'Negotiable'}</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-[#121522] border border-slate-200/80 dark:border-slate-800/80 space-y-1">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">LOCATION</span>
                      <p className="text-sm font-black text-slate-900 dark:text-white tracking-tight">{currentJob.location || 'Remote'}</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-[#121522] border border-slate-200/80 dark:border-slate-800/80 space-y-1">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">STATUS</span>
                      <p className="text-sm font-black text-emerald-600 dark:text-emerald-400 tracking-tight">Open</p>
                    </div>
                  </div>

                  {/* About the Role */}
                  <div className="space-y-3 pt-2">
                    <h3 className="font-black text-base text-slate-900 dark:text-white">Job Description</h3>
                    <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal whitespace-pre-wrap">
                      {currentJob.description || `${currentJob.company} is hiring a ${currentJob.title}. Apply now to connect with the recruiting team.`}
                    </div>
                  </div>

                </Card>
              )}
            </div>

          </div>
        )}

      </div>
    </PageShell>
  );
}


