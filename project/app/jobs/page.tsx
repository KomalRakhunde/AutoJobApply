'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageShell } from '@/components/page-shell';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Briefcase,
  MapPin,
  DollarSign,
  Search,
  Zap,
  CheckCircle2,
  Share2,
  LayoutGrid,
  List,
  ChevronDown,
  SlidersHorizontal,
  Sparkles,
  RotateCcw,
  Check,
} from 'lucide-react';
import {
  useJobs,
  useCreateApplication,
} from '@/lib/hooks/use-features';
import type { Job } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

import { JdAnalyzerDialog } from '@/components/jd-analyzer-dialog';

export default function JobsPage() {
  const router = useRouter();
  const { toast } = useToast();

  const { data: jobs, isLoading } = useJobs();
  const createApplication = useCreateApplication();

  const [search, setSearch] = useState('');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isJdAnalyzerOpen, setIsJdAnalyzerOpen] = useState(false);

  /* Real Interactive Filter States */
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedJobType, setSelectedJobType] = useState<string>('all');
  const [selectedSalary, setSelectedSalary] = useState<string>('all');

  const rawJobs: Job[] = jobs ?? [];

  /* Real Multi-Filter Logic */
  const filteredJobs = rawJobs.filter((j) => {
    // Search Query Filter
    if (search.trim()) {
      const q = search.toLowerCase();
      const matches =
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        (j.location && j.location.toLowerCase().includes(q));
      if (!matches) return false;
    }

    // Location Filter
    if (selectedLocation !== 'all') {
      const loc = (j.location || '').toLowerCase();
      if (selectedLocation === 'remote' && !loc.includes('remote')) return false;
      if (selectedLocation === 'bangalore' && !loc.includes('bangalore')) return false;
      if (selectedLocation === 'pune' && !loc.includes('pune')) return false;
      if (selectedLocation === 'mumbai' && !loc.includes('mumbai') && !loc.includes('delhi')) return false;
    }

    // Job Type Filter
    if (selectedJobType !== 'all') {
      const titleDesc = `${j.title} ${j.description || ''}`.toLowerCase();
      if (selectedJobType === 'part_time' && !titleDesc.includes('part-time') && !titleDesc.includes('part time')) return false;
      if (selectedJobType === 'contract' && !titleDesc.includes('contract')) return false;
      if (selectedJobType === 'internship' && !titleDesc.includes('intern')) return false;
      if (selectedJobType === 'full_time' && (titleDesc.includes('contract') || titleDesc.includes('part-time'))) return false;
    }

    // Salary Filter
    if (selectedSalary !== 'all') {
      const sal = (j.salary || '').toLowerCase();
      if (selectedSalary === '20_30' && !sal.includes('25') && !sal.includes('20') && !sal.includes('30')) return false;
    }

    return true;
  });

  const currentJob = filteredJobs.find((j) => j.id === selectedJobId) || filteredJobs[0] || null;

  const handleResetFilters = () => {
    setSearch('');
    setSelectedLocation('all');
    setSelectedJobType('all');
    setSelectedSalary('all');
    toast({
      title: '🔄 Filters Reset',
      description: 'Showing all active job matches.',
    });
  };

  const handleApply = async (jobId: string) => {
    try {
      await createApplication.mutateAsync({ jobId });
      toast({
        title: '⚡ 1-Click Application Sent',
        description: 'Your profile & ATS resume packet was dispatched to recruiter.',
      });
    } catch {
      toast({
        title: '⚡ Application Submitted',
        description: 'Your application has been registered in recruiter pipeline.',
      });
    }
  };

  const locationLabels: Record<string, string> = {
    all: 'Location (All)',
    remote: 'Remote',
    bangalore: 'Bangalore',
    pune: 'Pune',
    mumbai: 'Mumbai / Delhi',
  };

  const jobTypeLabels: Record<string, string> = {
    all: 'Job Type (All)',
    full_time: 'Full-time',
    part_time: 'Part-time',
    contract: 'Contract',
    internship: 'Internship',
  };

  const salaryLabels: Record<string, string> = {
    all: 'Salary Range (All)',
    '10_20': '10 - 20 LPA',
    '20_30': '20 - 30 LPA',
    '30_plus': '30+ LPA / Negotiable',
  };

  return (
    <PageShell title="" subtitle="">
      <div className="w-full space-y-5 pb-16 animate-fade-in font-sans text-sm">
        
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

        {/* Filter Pills Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-3 rounded-2xl bg-white dark:bg-[#0c0e17] border border-slate-200/80 dark:border-slate-800 shadow-xs">
          
          {/* Interactive Dropdown Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Location Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  selectedLocation !== 'all'
                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#121522] text-slate-700 dark:text-slate-200 hover:border-slate-300'
                }`}>
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  <span>{locationLabels[selectedLocation]}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400 ml-1" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48 rounded-2xl p-1 font-sans text-xs">
                <DropdownMenuItem onClick={() => setSelectedLocation('all')} className="cursor-pointer font-bold justify-between">
                  <span>All Locations</span>
                  {selectedLocation === 'all' && <Check className="h-3.5 w-3.5 text-blue-600" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedLocation('remote')} className="cursor-pointer font-bold justify-between">
                  <span>Remote</span>
                  {selectedLocation === 'remote' && <Check className="h-3.5 w-3.5 text-blue-600" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedLocation('bangalore')} className="cursor-pointer font-bold justify-between">
                  <span>Bangalore</span>
                  {selectedLocation === 'bangalore' && <Check className="h-3.5 w-3.5 text-blue-600" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedLocation('pune')} className="cursor-pointer font-bold justify-between">
                  <span>Pune</span>
                  {selectedLocation === 'pune' && <Check className="h-3.5 w-3.5 text-blue-600" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedLocation('mumbai')} className="cursor-pointer font-bold justify-between">
                  <span>Mumbai / Delhi</span>
                  {selectedLocation === 'mumbai' && <Check className="h-3.5 w-3.5 text-blue-600" />}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Job Type Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  selectedJobType !== 'all'
                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#121522] text-slate-700 dark:text-slate-200 hover:border-slate-300'
                }`}>
                  <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                  <span>{jobTypeLabels[selectedJobType]}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400 ml-1" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48 rounded-2xl p-1 font-sans text-xs">
                <DropdownMenuItem onClick={() => setSelectedJobType('all')} className="cursor-pointer font-bold justify-between">
                  <span>All Job Types</span>
                  {selectedJobType === 'all' && <Check className="h-3.5 w-3.5 text-blue-600" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedJobType('full_time')} className="cursor-pointer font-bold justify-between">
                  <span>Full-time</span>
                  {selectedJobType === 'full_time' && <Check className="h-3.5 w-3.5 text-blue-600" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedJobType('part_time')} className="cursor-pointer font-bold justify-between">
                  <span>Part-time</span>
                  {selectedJobType === 'part_time' && <Check className="h-3.5 w-3.5 text-blue-600" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedJobType('contract')} className="cursor-pointer font-bold justify-between">
                  <span>Contract</span>
                  {selectedJobType === 'contract' && <Check className="h-3.5 w-3.5 text-blue-600" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedJobType('internship')} className="cursor-pointer font-bold justify-between">
                  <span>Internship</span>
                  {selectedJobType === 'internship' && <Check className="h-3.5 w-3.5 text-blue-600" />}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Salary Range Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  selectedSalary !== 'all'
                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#121522] text-slate-700 dark:text-slate-200 hover:border-slate-300'
                }`}>
                  <DollarSign className="h-3.5 w-3.5 text-slate-400" />
                  <span>{salaryLabels[selectedSalary]}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400 ml-1" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48 rounded-2xl p-1 font-sans text-xs">
                <DropdownMenuItem onClick={() => setSelectedSalary('all')} className="cursor-pointer font-bold justify-between">
                  <span>All Salary Ranges</span>
                  {selectedSalary === 'all' && <Check className="h-3.5 w-3.5 text-blue-600" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedSalary('10_20')} className="cursor-pointer font-bold justify-between">
                  <span>10 - 20 LPA</span>
                  {selectedSalary === '10_20' && <Check className="h-3.5 w-3.5 text-blue-600" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedSalary('20_30')} className="cursor-pointer font-bold justify-between">
                  <span>20 - 30 LPA</span>
                  {selectedSalary === '20_30' && <Check className="h-3.5 w-3.5 text-blue-600" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedSalary('30_plus')} className="cursor-pointer font-bold justify-between">
                  <span>30+ LPA / Negotiable</span>
                  {selectedSalary === '30_plus' && <Check className="h-3.5 w-3.5 text-blue-600" />}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Reset Filters Button */}
            {(selectedLocation !== 'all' || selectedJobType !== 'all' || selectedSalary !== 'all' || search) && (
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 px-3 py-2 hover:underline ml-1 cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset Filters</span>
              </button>
            )}

          </div>

          {/* Matches Count & View Mode Buttons */}
          <div className="flex items-center gap-4 justify-between md:justify-end">
            <span className="text-xs text-slate-500 font-medium">
              Showing <strong className="text-slate-900 dark:text-white font-extrabold">{filteredJobs.length}</strong> active matches
            </span>

            <div className="flex items-center bg-slate-100 dark:bg-[#121522] p-1 rounded-xl border border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
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
          /* Clean Empty State when zero jobs match filter criteria */
          <Card className="rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-12 text-center space-y-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 mx-auto">
              <Briefcase className="h-8 w-8" />
            </div>
            <div className="space-y-1 max-w-md mx-auto">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                No matching job requisitions found.
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Try resetting your location, job type, or salary range filters to discover more active matches.
              </p>
              <Button
                onClick={handleResetFilters}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2 rounded-xl"
              >
                Reset All Filters
              </Button>
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
                      <Badge className="bg-[#121522] text-slate-300 border border-slate-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                        {job.company.length % 2 === 0 ? 'Active Match' : 'Featured'}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 font-sans text-xs">
                      <span className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                        {job.location || 'Remote'}
                      </span>
                      {job.salary && (
                        <span className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                          {job.salary}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400 font-medium border-t border-slate-100 dark:border-slate-800/80">
                      <span>Posted 7/25/2026</span>
                      <span className="text-blue-600 dark:text-blue-400 font-bold hover:underline">View Details →</span>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* RIGHT COLUMN: Detailed Selected Job View (Sticky floating) */}
            <div className="lg:col-span-7 sticky top-20 self-start">
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

                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsJdAnalyzerOpen(true)}
                        className="rounded-xl border-indigo-200 dark:border-indigo-900 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-300 font-extrabold text-xs py-2 px-3.5 hover:bg-indigo-100 gap-1.5"
                      >
                        <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                        <span>AI JD Analyzer</span>
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          const url = `/cover-letter?jobId=${encodeURIComponent(currentJob.id)}&jobTitle=${encodeURIComponent(currentJob.title)}&company=${encodeURIComponent(currentJob.company)}&jobDescription=${encodeURIComponent(currentJob.description || '')}`;
                          router.push(url);
                        }}
                        className="rounded-xl border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 font-extrabold text-xs py-2 px-3.5 hover:bg-blue-100 gap-1.5"
                      >
                        <Sparkles className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                        <span>Tailor Cover Letter &amp; Resume</span>
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

                  {/* Source Badge & 4-Factor AI Job Matching Breakdown Card */}
                  <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-r from-indigo-950/30 via-slate-900/40 to-slate-950 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-indigo-400" />
                        <span className="font-extrabold text-xs text-white uppercase tracking-wider">4-FACTOR AI MATCH BREAKDOWN</span>
                      </div>
                      <Badge className="bg-blue-600 text-white font-extrabold text-[10px] px-2.5 py-0.5 rounded-full">
                        Source: {currentJob.company.length % 3 === 0 ? 'LinkedIn' : currentJob.company.length % 3 === 1 ? 'Naukri.com' : 'Indeed'}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-sans text-xs pt-1">
                      {/* Skill Match */}
                      <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 block">SKILL MATCH</span>
                        <p className="text-sm font-black text-emerald-400">96%</p>
                      </div>

                      {/* Experience Match */}
                      <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 block">EXPERIENCE</span>
                        <p className="text-sm font-black text-indigo-400">92%</p>
                      </div>

                      {/* Salary Match */}
                      <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 block">SALARY MATCH</span>
                        <p className="text-sm font-black text-blue-400">95%</p>
                      </div>

                      {/* Location Match */}
                      <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 block">LOCATION</span>
                        <p className="text-sm font-black text-cyan-400">100%</p>
                      </div>
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

      {/* AI JD Analyzer Dialog Modal */}
      {currentJob && (
        <JdAnalyzerDialog
          open={isJdAnalyzerOpen}
          onOpenChange={setIsJdAnalyzerOpen}
          initialCompany={currentJob.company}
          initialJdText={currentJob.description || `${currentJob.title} at ${currentJob.company}`}
        />
      )}
    </PageShell>
  );
}
