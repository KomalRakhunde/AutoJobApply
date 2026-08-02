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
import {
  Loader2,
  MoreVertical,
  Trash2,
  Briefcase,
  Plus,
  LayoutGrid,
  List,
  Paperclip,
  Clock,
  Video,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
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

  const [viewMode, setViewMode] = useState<'board' | 'list' | 'timeline'>('board');
  const [activeMobileStage, setActiveMobileStage] = useState<ApplicationStatus>('applied');

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

  return (
    <PageShell title="" subtitle="">
      <div className="max-w-6xl mx-auto space-y-6 pb-16 animate-fade-in px-2 sm:px-4 font-sans text-sm">
        
        {/* Breadcrumb Header */}
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <span>Application Manager</span>
          <ChevronRight className="h-3 w-3 text-slate-400" />
          <span className="font-bold text-slate-900 dark:text-white">2026 Hiring Cycle</span>
        </div>

        {/* Header & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Application Pipeline
          </h1>

          <div className="flex items-center gap-3">
            <div className="flex items-center bg-slate-100 dark:bg-[#121522] p-1 rounded-xl border border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setViewMode('board')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'board'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                <span>Board</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <List className="h-3.5 w-3.5" />
                <span>List</span>
              </button>
              <button
                onClick={() => setViewMode('timeline')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'timeline'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Clock className="h-3.5 w-3.5" />
                <span>Timeline</span>
              </button>
            </div>

            <Link href="/jobs">
              <Button className="bg-black dark:bg-white text-white dark:text-slate-900 hover:bg-slate-900 dark:hover:bg-slate-100 font-bold text-xs px-4 py-2 rounded-xl shadow-md gap-1.5 touch-target">
                <Plus className="h-4 w-4" />
                <span>New Application</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile Stage Selector Tabs (<768px) */}
        <div className="flex md:hidden overflow-x-auto gap-2 pb-2 no-scrollbar border-b border-slate-200 dark:border-slate-800">
          {APPLICATION_STATUSES.map((s) => {
            const count = (grouped.get(s.value) ?? []).length;
            const isActive = activeMobileStage === s.value;
            return (
              <button
                key={s.value}
                onClick={() => setActiveMobileStage(s.value)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all touch-target ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                <span>{s.label}</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${isActive ? 'bg-blue-700 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>        {/* Applications View Modes */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <Skeleton className="h-96 w-full rounded-3xl" />
            <Skeleton className="h-96 w-full rounded-3xl" />
            <Skeleton className="h-96 w-full rounded-3xl" />
          </div>
        ) : viewMode === 'timeline' ? (
          /* Timeline Chronological View */
          <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-6 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <span>Application Activity Timeline</span>
              </h3>
              <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-950 font-bold text-xs">
                {(applications ?? []).length} Chronological Records
              </Badge>
            </div>

            <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
              {(applications ?? []).length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  No application activity recorded in timeline yet.
                </div>
              ) : (
                (applications ?? []).map((app) => (
                  <div key={app.id} className="relative flex items-start gap-4 pl-8">
                    <div className="absolute left-1.5 top-1.5 h-4 w-4 rounded-full bg-blue-600 border-2 border-white dark:border-[#0c0e17] shadow-xs" />
                    
                    <div className="flex-1 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-[#121522] space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{app.job?.title ?? 'Position Applied'}</h4>
                          <Badge className="bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-[10px] uppercase font-bold">
                            {app.status}
                          </Badge>
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono">{new Date(app.createdAt).toLocaleString()}</span>
                      </div>

                      <p className="text-xs text-slate-500 font-normal">
                        {app.job?.company ?? 'Company'} • {app.job?.location ?? 'Remote'}
                      </p>

                      {app.status === 'interview' && (
                        <div className="pt-2">
                          <Link href={`/interview?jobTitle=${encodeURIComponent(app.job?.title || '')}&company=${encodeURIComponent(app.job?.company || '')}`}>
                            <Button className="h-8 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl gap-1.5">
                              <Video className="h-3.5 w-3.5" />
                              <span>Launch AI Voice Interview Room</span>
                            </Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        ) : (
          /* Kanban Board / List Grid */
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 items-start">
            {APPLICATION_STATUSES.map((statusObj) => {
              const list = grouped.get(statusObj.value) ?? [];
              const isHiddenOnMobile = activeMobileStage !== statusObj.value;

              return (
                <div
                  key={statusObj.value}
                  className={`rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0c0e17] p-4 space-y-3 ${
                    isHiddenOnMobile ? 'hidden md:block' : 'block'
                  }`}
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between px-1 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        {statusObj.label}
                      </span>
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-300">
                        {list.length}
                      </span>
                    </div>
                    <MoreVertical className="h-4 w-4 text-slate-400 cursor-pointer" />
                  </div>

                  {/* Cards Stack */}
                  <div className="space-y-3">
                    {list.length > 0 ? (
                      list.map((app) => (
                        <Card
                          key={app.id}
                          className="relative rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#121522] p-4 space-y-3 shadow-xs hover:shadow-md transition-all group"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {app.job?.title ?? 'Position Applied'}
                              </h4>
                              <p className="text-xs text-slate-500 font-medium">
                                {app.job?.company ?? 'Company'}
                              </p>
                            </div>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg"
                                >
                                  <MoreVertical className="h-3.5 w-3.5" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="rounded-xl font-sans text-xs">
                                <DropdownMenuItem onClick={() => handleStatusChange(app.id, 'applied')}>
                                  Mark as Applied
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(app.id, 'assessment')}>
                                  Mark as Assessment
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(app.id, 'interview')}>
                                  Mark as Interview
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(app.id, 'offer')}>
                                  Mark as Offer
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(app.id, 'rejected')}>
                                  Mark as Rejected
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(app.id, 'joined')}>
                                  Mark as Joined
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDelete(app.id)}
                                  className="text-rose-600 font-bold"
                                >
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          {/* AUTO-APPLIED BY AI BADGE */}
                          <Badge className="bg-indigo-100 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 font-extrabold text-[9px] px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800 flex items-center gap-1 w-fit">
                            <Sparkles className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
                            <span>AUTO-APPLIED BY AI</span>
                          </Badge>

                          {/* 1-Click Launch AI Voice Interview Button */}
                          {app.status === 'interview' && (
                            <Link
                              href={`/interview?jobTitle=${encodeURIComponent(app.job?.title || '')}&company=${encodeURIComponent(app.job?.company || '')}`}
                              className="block pt-1"
                            >
                              <Button className="w-full h-8 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[11px] rounded-xl gap-1.5 shadow-sm shadow-blue-500/20">
                                <Video className="h-3.5 w-3.5" />
                                <span>Launch AI Voice Interview</span>
                              </Button>
                            </Link>
                          )}
                        </Card>
                      ))
                    ) : (
                      <div className="py-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                        No applications in this stage
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
