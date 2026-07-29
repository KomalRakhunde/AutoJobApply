'use client';

import { useState } from 'react';
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
} from 'lucide-react';
import {
  useJobs,
  useCreateJob,
  useCreateApplication,
} from '@/lib/hooks/use-features';
import type { Job } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export default function JobsPage() {
  const { toast } = useToast();
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
        title: newJob.title,
        company: newJob.company,
        location: newJob.location || undefined,
        description: newJob.description || undefined,
        salary: newJob.salary || undefined,
        applyUrl: newJob.applyUrl || undefined,
      });
      toast({ title: 'Job added' });
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
      title="Job Search"
      subtitle="Browse and add jobs, then track your applications."
      actions={
        <Button onClick={() => setShowAdd((s) => !s)} className="gap-2">
          <Plus className="h-4 w-4" /> Add Job
        </Button>
      }
    >
      {showAdd && (
        <Card className="mb-6 animate-scale-in">
          <CardHeader>
            <CardTitle className="text-lg">Add a Job</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddJob} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input id="title" required value={newJob.title} onChange={(e) => setNewJob((j) => ({ ...j, title: e.target.value }))} placeholder="Senior Frontend Engineer" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company *</Label>
                  <Input id="company" required value={newJob.company} onChange={(e) => setNewJob((j) => ({ ...j, company: e.target.value }))} placeholder="Acme Corp" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="loc">Location</Label>
                  <Input id="loc" value={newJob.location} onChange={(e) => setNewJob((j) => ({ ...j, location: e.target.value }))} placeholder="Remote / San Francisco" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salary">Salary</Label>
                  <Input id="salary" value={newJob.salary} onChange={(e) => setNewJob((j) => ({ ...j, salary: e.target.value }))} placeholder="$120k - $150k" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="desc">Description</Label>
                <Textarea id="desc" value={newJob.description} onChange={(e) => setNewJob((j) => ({ ...j, description: e.target.value }))} placeholder="Paste job description..." rows={4} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="url">Apply URL</Label>
                <Input id="url" value={newJob.applyUrl} onChange={(e) => setNewJob((j) => ({ ...j, applyUrl: e.target.value }))} placeholder="https://..." />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="gap-2" disabled={createJob.isPending}>
                  {createJob.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save Job
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by title, company, or keyword"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="relative sm:w-64">
          <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Filter by location"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <Briefcase className="h-12 w-12 text-muted-foreground/40" />
            <p className="mt-4 text-sm text-muted-foreground">
              {jobs && jobs.length > 0
                ? 'No jobs match your filters.'
                : 'No jobs yet. Click "Add Job" to create one.'}
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
  onApply,
  applying,
}: {
  job: Job;
  index: number;
  onApply: () => void;
  applying: boolean;
}) {
  return (
    <Card
      className="group flex flex-col transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 animate-fade-in-up"
      style={{ animationDelay: `${Math.min(index, 5) * 50}ms` }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Briefcase className="h-5 w-5" />
          </div>
          {job.applyUrl && (
            <a
              href={job.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-primary"
              aria-label="Apply externally"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
        <CardTitle className="text-base leading-snug">{job.title}</CardTitle>
        <p className="text-sm font-medium text-primary">{job.company}</p>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          {job.location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" /> {job.location}
            </span>
          )}
          {job.salary && (
            <span className="flex items-center gap-1">
              <DollarSign className="h-3.5 w-3.5" /> {job.salary}
            </span>
          )}
        </div>
        {job.description && (
          <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
            {job.description}
          </p>
        )}
        <div className="mt-auto pt-4">
          <Button
            size="sm"
            variant="outline"
            className="w-full gap-2 group-hover:border-primary/40"
            onClick={onApply}
            disabled={applying}
          >
            {applying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Track Application
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
