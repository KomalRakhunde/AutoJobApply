'use client';

import { useMemo } from 'react';
import { PageShell } from '@/components/page-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Loader2, MoreVertical, Trash2, Briefcase } from 'lucide-react';
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
  const { data: applications, isLoading } = useApplications();
  const updateApplication = useUpdateApplication();
  const deleteApplication = useDeleteApplication();

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

  if (isLoading) {
    return (
      <PageShell title="Application Tracker" subtitle="Track your applications across a clear pipeline.">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      title="Application Tracker"
      subtitle="Track your applications across a clear pipeline."
    >
      <div className="grid gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {APPLICATION_STATUSES.map((col) => {
          const items = grouped.get(col.value) ?? [];
          return (
            <div key={col.value} className="flex flex-col rounded-xl bg-muted/30 p-3">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${col.color}`} />
                  <span className="text-sm font-semibold">{col.label}</span>
                </div>
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                  {items.length}
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-2">
                {items.length === 0 ? (
                  <p className="py-8 text-center text-xs text-muted-foreground">
                    No applications
                  </p>
                ) : (
                  items.map((app) => (
                    <AppCard
                      key={app.id}
                      app={app}
                      onStatusChange={(s) => handleStatusChange(app.id, s)}
                      onDelete={() => handleDelete(app.id)}
                      currentStatus={app.status}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </PageShell>
  );
}

function AppCard({
  app,
  onStatusChange,
  onDelete,
  currentStatus,
}: {
  app: Application;
  onStatusChange: (status: ApplicationStatus) => void;
  onDelete: () => void;
  currentStatus: ApplicationStatus;
}) {
  const otherStatuses = APPLICATION_STATUSES.filter((s) => s.value !== currentStatus);

  return (
    <Card className="group cursor-default transition-all hover:shadow-md animate-scale-in">
      <CardContent className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Briefcase className="h-4 w-4" />
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded-md p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-muted group-hover:opacity-100">
                <MoreVertical className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuLabel>Move to…</DropdownMenuLabel>
              {otherStatuses.map((s) => (
                <DropdownMenuItem
                  key={s.value}
                  onClick={() => onStatusChange(s.value)}
                  className="cursor-pointer gap-2"
                >
                  <span className={`h-2 w-2 rounded-full ${s.color}`} />
                  {s.label}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={onDelete}
                className="cursor-pointer gap-2 text-destructive focus:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <p className="mt-2 truncate text-sm font-medium">
          {app.job?.title ?? 'Unknown position'}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {app.job?.company ?? '—'}
        </p>
        <p className="mt-2 text-[10px] text-muted-foreground">
          Applied {new Date(app.createdAt).toLocaleDateString()}
        </p>
      </CardContent>
    </Card>
  );
}
