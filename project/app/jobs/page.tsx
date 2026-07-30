'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageShell } from '@/components/page-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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
  // Fix common typos in job titles
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
      toast({ title: 'Job posting published successfully' });
      setNewJob({ title: '', company: '', location: '', description: '', salary: '', applyUrl: '' });
      setShowAdd(false);
    } catch (err) {
      toast({
        title: 'Could not add job',
        description: err instanceof Error ? err.message : 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleApply = async (jobId: string) => {
    if (role === 'recruiter' || role === 'admin' || role === 'super_admin') {
      router.push('/sourcing');
      return;
    }
    try {
      await createApplication.mutateAsync({ jobId });
      toast({ title: 'Added to tracker', description: 'Application moved to your tracker.' });
    } catch (err) {
      toast({
        title: 'Could not add',
        description: err instanceof Error ? err.message : 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <PageShell
      title={role === 'recruiter' ? 'Post & Manage Job Openings' : 'Job Search & Matching'}
      subtitle={
        role === 'recruiter'
          ? 'Manage your active job requisitions, view applicants, and configure AI sourcing.'
          : 'Browse open roles, score ATS compatibility, and track your applications.'
      }
      actions={
        <Button onClick={() => setShowAdd((s) => !s)} className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs">
          <Plus className="h-4 w-4" /> {role === 'recruiter' ? 'Post New Opening' : 'Add Job Listing'}
        </Button>
      }
    >
      {showAdd && (
        <Card className="mb-6 animate-scale-in rounded-2xl border border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-base font-bold">
              {role === 'recruiter' ? 'Create New Job Requisition' : 'Add Job Listing'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddJob} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title *</Label>
                  <Input id="title" required value={newJob.title} onChange={(e) => setNewJob((j) => ({ ...j, title: e.target.value }))} placeholder="Senior Software Engineer" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company *</Label>
                  <Input id="company" required value={newJob.company} onChange={(e) => setNewJob((j) => ({ ...j, company: e.target.value }))} placeholder="ApplyAI Inc" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="loc">Target Location</Label>
                  <Input id="loc" value={newJob.location} onChange={(e) => setNewJob((j) => ({ ...j, location: e.target.value }))} placeholder="San Francisco, CA (Remote)" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salary">Salary Range</Label>
                  <Input id="salary" value={newJob.salary} onChange={(e) => setNewJob((j) => ({ ...j, salary: e.target.value }))} placeholder="$140,000 - $180,000" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="desc">Description & Requirements</Label>
                <Textarea id="desc" value={newJob.description} onChange={(e) => setNewJob((j) => ({ ...j, description: e.target.value }))} placeholder="Paste job description..." rows={4} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="url">Application URL (Optional)</Label>
                <Input id="url" value={newJob.applyUrl} onChange={(e) => setNewJob((j) => ({ ...j, applyUrl: e.target.value }))} placeholder="https://..." />
              </div>
              <div className="flex gap-2 pt-2">
                <Button type="submit" className="gap-2 bg-indigo-600 text-white rounded-xl text-xs" disabled={createJob.isPending}>
                  {createJob.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Publish Opening
                </Button>
                <Button type="button" variant="outline" className="rounded-xl text-xs" onClick={() => setShowAdd(false)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search by job title, company, or required skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-xl text-xs"
          />
        </div>
        <div className="relative sm:w-64">
          <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Filter by location..."
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="pl-9 rounded-xl text-xs"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      ) : filtered.length === 0 ? (
        <Card className="rounded-2xl border border-slate-200 dark:border-slate-800">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <Briefcase className="h-12 w-12 text-slate-400/40" />
            <p className="mt-4 text-sm text-slate-500">
              {jobs && jobs.length > 0
                ? 'No job listings match your filters.'
                : 'No job postings yet. Click "Post New Opening" to publish one.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((job: Job, i: number) => (
            <JobCard
              key={job.id}
              job={job}
              index={i}
              role={role}
              onApply={() => handleApply(job.id)}
              applying={createApplication.isPending}
            />
          ))}
        </div>
      )}
    </PageShell>
  );
}

function JobCard({
  job,
  index,
  role,
  onApply,
  applying,
}: {
  job: Job;
  index: number;
  role: UserRole;
  onApply: () => void;
  applying: boolean;
}) {
  const formattedTitle = formatTitleCase(job.title);

  return (
    <Card
      className="group flex flex-col rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 transition-all hover:border-indigo-500/50 hover:shadow-md animate-fade-in-up"
      style={{ animationDelay: `${Math.min(index, 5) * 50}ms` }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
            <Briefcase className="h-5 w-5" />
          </div>
          {job.applyUrl && (
            <a
              href={job.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-indigo-600 transition-colors"
              aria-label="Apply externally"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
        <CardTitle className="text-base font-bold text-slate-900 dark:text-white leading-snug">{formattedTitle}</CardTitle>
        <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">{job.company}</p>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
            {job.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-slate-400" /> {job.location}
              </span>
            )}
            {job.salary && (
              <span className="flex items-center gap-1">
                <DollarSign className="h-3.5 w-3.5 text-emerald-500" /> {job.salary}
              </span>
            )}
          </div>
          {job.description && (
            <p className="line-clamp-3 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {job.description}
            </p>
          )}
        </div>

        <div className="pt-2">
          <Button
            size="sm"
            variant="outline"
            className="w-full gap-2 rounded-xl text-xs font-semibold border-slate-200 dark:border-slate-800 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-slate-800"
            onClick={onApply}
            disabled={applying}
          >
            {role === 'recruiter' || role === 'admin' || role === 'super_admin' ? (
              <>
                <Users className="h-3.5 w-3.5 text-indigo-600" />
                <span>View Applicants & Sourcing</span>
              </>
            ) : (
              <>
                {applying ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5 text-indigo-600" />}
                <span>+ Track Application</span>
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
