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

  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
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
        </div>

        {/* Kanban Board Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <Skeleton className="h-96 w-full rounded-3xl" />
            <Skeleton className="h-96 w-full rounded-3xl" />
            <Skeleton className="h-96 w-full rounded-3xl" />
          </div>
        ) : (
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
                          {/* Top row: Logo & Dropdown */}
                          <div className="flex items-start justify-between">
                            <Avatar className="h-9 w-9 border border-slate-200 dark:border-slate-800 rounded-xl">
                              <AvatarFallback className="bg-slate-100 dark:bg-slate-800 font-extrabold text-slate-900 dark:text-white text-xs">
                                {app.job?.company ? app.job.company.charAt(0) : 'C'}
                              </AvatarFallback>
                            </Avatar>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg touch-target">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="font-sans text-xs">
                                <DropdownMenuLabel>Move to Stage</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {APPLICATION_STATUSES.map((s) => (
                                  <DropdownMenuItem
                                    key={s.value}
                                    onClick={() => handleStatusChange(app.id, s.value)}
                                    disabled={app.status === s.value}
                                  >
                                    {s.label}
                                  </DropdownMenuItem>
                                ))}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleDelete(app.id)}
                                  className="text-rose-600 focus:text-rose-600 font-bold"
                                >
                                  <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          {/* Role & Company */}
                          <div>
                            <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">
                              {app.job?.title ?? 'Position Applied'}
                            </h4>
                            <p className="text-xs text-slate-500 font-normal mt-0.5">
                              {app.job?.company ?? 'Company'} • {app.job?.location ?? 'Remote'}
                            </p>
                          </div>

                          {/* Footer details */}
                          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
                            <span>{new Date(app.createdAt).toLocaleDateString()}</span>

                            {app.status === 'interview' && (
                              <Badge className="bg-rose-600 text-white font-bold text-[9px] px-2 py-0.5 rounded">
                                TOMORROW
                              </Badge>
                            )}

                            {app.status === 'offer' && (
                              <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-bold text-[9px] px-2 py-0.5 rounded">
                                TOP PRIORITY
                              </Badge>
                            )}

                            {app.status === 'applied' && (
                              <Paperclip className="h-3.5 w-3.5 text-slate-400" />
                            )}
                          </div>
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
