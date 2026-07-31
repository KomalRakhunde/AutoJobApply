'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { PageShell } from '@/components/page-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Loader2, MoreVertical, Trash2, Briefcase, Filter, Sparkles, RefreshCw, Layers } from 'lucide-react';
import {
  useApplications,
  useUpdateApplication,
  useDeleteApplication,
  APPLICATION_STATUSES,
} from '@/lib/hooks/use-features';
import type { Application, ApplicationStatus } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export default function ApplicationsPage() {
  const { toast } = useToast();
  const { data: applications, isLoading, refetch } = useApplications();
  const updateApplication = useUpdateApplication();
  const deleteApplication = useDeleteApplication();

  const [mobileTab, setMobileTab] = useState<string>('ALL');

  const grouped = useMemo(() => {
    const map = new Map<ApplicationStatus, Application[]>();
    APPLICATION_STATUSES.forEach((s) => map.set(s.value, []));
    (applications ?? []).forEach((app: Application) => {
      const arr = map.get(app.status) ?? [];
      arr.push(app);
      map.set(app.status, arr);
    });
    return map;
  }, [applications]);

  const handleStatusChange = async (id: string, status: ApplicationStatus) => {
    try {
      await updateApplication.mutateAsync({ id, body: { status } });
      toast({ title: '✅ Application Status Updated' });
    } catch (err) {
      toast({
        title: 'Could not update',
        description: err instanceof Error ? err.message : 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteApplication.mutateAsync(id);
      toast({ title: 'Application removed' });
    } catch (err) {
      toast({
        title: 'Could not delete',
        description: err instanceof Error ? err.message : 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  const filteredStatuses = mobileTab === 'ALL'
    ? APPLICATION_STATUSES
    : APPLICATION_STATUSES.filter((s) => s.value === mobileTab);

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
                Application Pipeline <span className="text-xs text-indigo-600 dark:text-indigo-400 font-mono font-normal">v2.4.0</span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">CANDIDATE APPLICATION TRACKER</p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => refetch()}
              className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl gap-1.5"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Sync Live</span>
            </Button>
            <Avatar className="h-9 w-9 border border-indigo-500/40">
              <AvatarFallback className="bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-extrabold text-xs">
                KR
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Mobile Status Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 lg:hidden">
          <button
            onClick={() => setMobileTab('ALL')}
            className={`shrink-0 rounded-xl px-3.5 py-2 text-xs font-mono font-bold transition-all ${
              mobileTab === 'ALL'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-[#121522] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
            }`}
          >
            All Stages ({applications?.length ?? 0})
          </button>
          {APPLICATION_STATUSES.map((col) => {
            const count = grouped.get(col.value)?.length ?? 0;
            return (
              <button
                key={col.value}
                onClick={() => setMobileTab(col.value)}
                className={`shrink-0 rounded-xl px-3.5 py-2 text-xs font-mono font-bold transition-all ${
                  mobileTab === col.value
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-[#121522] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
                }`}
              >
                {col.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Kanban Board Columns */}
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-start font-mono">
            {APPLICATION_STATUSES.map((col) => (
              <div key={col.value} className="space-y-3">
                <Skeleton className="h-10 w-full rounded-2xl" />
                <Skeleton className="h-28 w-full rounded-2xl" />
                <Skeleton className="h-28 w-full rounded-2xl" />
              </div>
            ))}
          </div>
        ) : (applications?.length ?? 0) === 0 ? (
          <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-12 text-center text-slate-400 font-mono space-y-4 shadow-xs">
            <Sparkles className="h-10 w-10 mx-auto text-indigo-500 opacity-80" />
            <div className="space-y-1">
              <p className="text-base font-extrabold text-slate-900 dark:text-white">No active job applications found</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Explore open job requisitions to submit your first application.</p>
            </div>
            <Link href="/jobs" className="inline-block">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-xs font-bold rounded-xl px-5 py-2.5 shadow-md">
                Browse Open Jobs
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-start font-mono">
            {filteredStatuses.map((col) => {
              const list = grouped.get(col.value) ?? [];
              return (
                <div key={col.value} className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-100 dark:bg-[#0c0e17] border border-slate-200/80 dark:border-slate-800">
                    <span className="font-extrabold text-slate-900 dark:text-white text-xs">{col.label}</span>
                    <span className="rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold px-2 py-0.5 text-[10px]">
                      {list.length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {list.map((app) => (
                      <Card
                        key={app.id}
                        className="rounded-2xl border border-slate-200/80 dark:border-slate-800 border-l-4 border-l-indigo-500 bg-white dark:bg-[#0c0e17] bg-gradient-to-r from-indigo-500/10 via-transparent to-transparent p-4 space-y-3 shadow-sm dark:shadow-xl hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all duration-300"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-extrabold text-slate-900 dark:text-white text-xs leading-snug">
                              {app.job?.title ?? 'Position Applied'}
                            </h4>
                            <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold">{app.job?.company ?? 'Enterprise Co.'}</p>
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="text-slate-400 hover:text-slate-900 dark:hover:text-white p-1 rounded-md">
                                <MoreVertical className="h-4 w-4" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="font-mono text-xs">
                              <DropdownMenuLabel>Move Stage</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              {APPLICATION_STATUSES.map((s) => (
                                <DropdownMenuItem key={s.value} onClick={() => handleStatusChange(app.id, s.value)}>
                                  Move to {s.label}
                                </DropdownMenuItem>
                              ))}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleDelete(app.id)} className="text-rose-600">
                                <Trash2 className="h-3.5 w-3.5 mr-2" /> Remove
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <p className="text-[10px] text-slate-400 font-mono">
                          Applied: {new Date(app.createdAt).toLocaleDateString()}
                        </p>
                      </Card>
                    ))}

                    {list.length === 0 && (
                      <div className="p-6 text-center text-slate-400/60 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-[11px]">
                        No applications in stage
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </PageShell>
  );
}
