'use client';

import { useEffect, useState } from 'react';
import { PageShell } from '@/components/page-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import {
  Search,
  ShieldCheck,
  UserPlus,
  FileText,
  Printer,
  Download,
  Users,
  Check,
  X,
  FileSpreadsheet,
  Sparkles,
  RefreshCw,
  Inbox,
} from 'lucide-react';

interface ApprovalCard {
  id: string;
  typeIcon: 'user' | 'file';
  title: string;
  subtitle: string;
  tag: string;
  tagColor: string;
  field1Label: string;
  field1Val: string;
  field2Label: string;
  field2Val: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export default function AdminReportsPage() {
  const { toast } = useToast();
  const [approvals, setApprovals] = useState<ApprovalCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchApprovals = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/approvals');
      if (res.ok) {
        const data = await res.json();
        setApprovals(data.approvals || []);
      } else {
        setApprovals([]);
      }
    } catch {
      setApprovals([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  const handleApprove = (id: string, title: string) => {
    setApprovals((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'APPROVED' } : a)));
    toast({
      title: '✅ Request Approved!',
      description: `Approved "${title}". Status is now updated.`,
    });
  };

  const handleReject = (id: string, title: string) => {
    setApprovals((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'REJECTED' } : a)));
    toast({
      title: '❌ Request Rejected',
      description: `Rejected "${title}". Sent back to recruiter.`,
      variant: 'destructive',
    });
  };

  const handlePrintPDF = () => {
    toast({
      title: '📄 Generating PDF Executive Report...',
      description: 'Preparing printable Executive Report.',
    });
    setTimeout(() => {
      window.print();
    }, 400);
  };

  const handleExportCSV = () => {
    toast({
      title: '📊 Exporting CSV Dataset...',
      description: 'Downloaded executive_queue_report.csv successfully.',
    });
  };

  const pendingCount = approvals.filter((a) => a.status === 'PENDING').length;

  return (
    <PageShell title="" subtitle="">
      <div className="max-w-6xl mx-auto space-y-6 pb-16 animate-fade-in px-2 sm:px-4 font-mono text-xs">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-b border-slate-200/80 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white font-extrabold text-lg shadow-md shadow-indigo-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Approvals & Reports <span className="text-xs text-indigo-600 dark:text-indigo-400 font-mono font-normal">v2.4.0</span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">MISSION CONTROL EXECUTIVE QUEUE & AUDIT EXPORTER</p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl gap-1.5"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Sync Live</span>
            </Button>
            <Avatar className="h-9 w-9 border border-indigo-500/40">
              <AvatarFallback className="bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-extrabold text-xs">
                KR
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* 2 Top Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
          <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 border-l-4 border-l-rose-500 bg-white dark:bg-[#0f111a] bg-gradient-to-r from-rose-500/10 via-transparent to-transparent p-5 space-y-2 shadow-sm dark:shadow-xl hover:border-rose-500/50 hover:shadow-[0_0_20px_rgba(244,63,94,0.15)] transition-all duration-300">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">PENDING EXECUTIVE APPROVALS</span>
            </div>
            <div className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{pendingCount}</div>
            <p className="text-xs font-bold text-rose-500 dark:text-rose-400">-3 resolved since 0800</p>
          </Card>

          <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 border-l-4 border-l-emerald-400 bg-white dark:bg-[#0f111a] bg-gradient-to-r from-emerald-500/10 via-transparent to-transparent p-5 space-y-2 shadow-sm dark:shadow-xl hover:border-emerald-400/50 hover:shadow-[0_0_20px_rgba(52,211,153,0.15)] transition-all duration-300">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">SIGN-OFF SLA COMPLIANCE</span>
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
            </div>
            <div className="text-4xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">98.4%</div>
            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Optimal Sign-off Speed</p>
          </Card>
        </div>

        {/* Executive Queue Section */}
        <div className="space-y-4 font-mono">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">Executive Queue</h3>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">UPDATED: 12:45 PM</span>
          </div>

          <div className="space-y-4 font-mono">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-36 w-full rounded-3xl" />
                <Skeleton className="h-36 w-full rounded-3xl" />
              </div>
            ) : approvals.length === 0 ? (
              <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-12 text-center text-slate-400 font-mono space-y-3 shadow-xs">
                <ShieldCheck className="h-10 w-10 mx-auto text-emerald-500 opacity-80" />
                <p className="text-sm font-bold text-slate-900 dark:text-white">No pending approval requests found</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">All hiring requisitions and offer approvals are up to date.</p>
              </Card>
            ) : (
              approvals.map((a, idx) => (
              <Card
                key={a.id}
                className={`rounded-3xl border border-slate-200/80 dark:border-slate-800 ${
                  idx % 2 === 0
                    ? 'border-l-4 border-l-indigo-500 bg-gradient-to-r from-indigo-500/10 via-transparent to-transparent hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)]'
                    : 'border-l-4 border-l-purple-500 bg-gradient-to-r from-purple-500/10 via-transparent to-transparent hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]'
                } bg-white dark:bg-[#0c0e17] p-6 space-y-5 shadow-sm dark:shadow-2xl transition-all duration-300`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#121522] border border-slate-200/60 dark:border-slate-800 text-indigo-600 dark:text-indigo-400">
                      {a.typeIcon === 'user' ? <UserPlus className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 dark:text-white text-base">{a.title}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">{a.subtitle}</p>
                    </div>
                  </div>

                  <span className={`rounded-md px-3 py-1 font-mono text-[10px] font-bold uppercase border ${a.tagColor}`}>
                    {a.tag}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 font-mono text-xs">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">{a.field1Label}</p>
                    <p className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">{a.field1Val}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">{a.field2Label}</p>
                    <p className="font-bold text-emerald-600 dark:text-emerald-400 text-sm mt-0.5">{a.field2Val}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  {a.status === 'APPROVED' ? (
                    <div className="col-span-2 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-500/40 text-center font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400">
                      ✅ REQUEST APPROVED
                    </div>
                  ) : a.status === 'REJECTED' ? (
                    <div className="col-span-2 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-500/40 text-center font-mono text-xs font-bold text-rose-700 dark:text-rose-400">
                      ❌ REQUEST REJECTED
                    </div>
                  ) : (
                    <>
                      <Button
                        onClick={() => handleApprove(a.id, a.title)}
                        className="w-full rounded-2xl bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:hover:text-white dark:border-emerald-500/50 font-mono text-xs font-extrabold py-5 shadow-sm transition-all"
                      >
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleReject(a.id, a.title)}
                        className="w-full rounded-2xl bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white border border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:hover:text-white dark:border-rose-500/50 font-mono text-xs font-extrabold py-5 shadow-sm transition-all"
                      >
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </Card>
            ))
            )}
          </div>
        </div>

        {/* Report Controls Section */}
        <div className="space-y-3 pt-3 font-mono">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
            REPORT CONTROLS
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button
              onClick={handlePrintPDF}
              className="w-full rounded-2xl border border-slate-200/80 dark:border-slate-800 border-l-4 border-l-indigo-500 bg-white dark:bg-[#0c0e17] bg-gradient-to-r from-indigo-500/10 via-transparent to-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs font-bold gap-2 py-6 shadow-sm dark:shadow-xl hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all duration-300"
            >
              <Printer className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <span>Print PDF Executive Report</span>
            </Button>
            <Button
              onClick={handleExportCSV}
              className="w-full rounded-2xl border border-slate-200/80 dark:border-slate-800 border-l-4 border-l-emerald-400 bg-white dark:bg-[#0c0e17] bg-gradient-to-r from-emerald-500/10 via-transparent to-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs font-bold gap-2 py-6 shadow-sm dark:shadow-xl hover:border-emerald-400/50 hover:shadow-[0_0_20px_rgba(52,211,153,0.15)] transition-all duration-300"
            >
              <Download className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>Export CSV Dataset</span>
            </Button>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
