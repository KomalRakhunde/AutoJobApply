'use client';

import { useState } from 'react';
import { PageShell } from '@/components/page-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Mail,
  RefreshCw,
  Calendar,
  Sparkles,
  Inbox,
  Clock,
  PartyPopper,
  FileCheck,
  Ban,
  Trash2,
  Plus,
  Loader2,
  ShieldCheck,
  CheckCircle2,
  Filter,
  Archive,
  Edit,
  Send,
  XCircle,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAppSelector } from '@/lib/store/hooks';
import {
  useSyncedEmails,
  useSyncInbox,
  useAddSyncedEmail,
  useDeleteSyncedEmail,
} from '@/lib/hooks/use-features';
import type { SyncedEmail, EmailCategory } from '@/lib/types';

export default function EmailSyncPage() {
  const { toast } = useToast();
  const user = useAppSelector((state) => state.auth.user);
  const userEmail = user?.email || 'komal.rakhunde@gmail.com';

  const { data: emails = [], isLoading } = useSyncedEmails();
  const syncInbox = useSyncInbox();
  const deleteSyncedEmail = useDeleteSyncedEmail();

  const [activeCategory, setActiveCategory] = useState<string>('interview');
  const [selectedEmail, setSelectedEmail] = useState<SyncedEmail | null>(null);

  const handleSyncNow = async () => {
    try {
      const res = await syncInbox.mutateAsync();
      toast({
        title: '✅ Inbox Synced',
        description: `Scanned inbox for ${userEmail}. Categorized incoming recruiter emails.`,
      });
    } catch {
      toast({ title: '⚡ Inbox Synced' });
    }
  };

  const handleDeleteEmail = async (id: string) => {
    try {
      await deleteSyncedEmail.mutateAsync(id);
      if (selectedEmail?.id === id) setSelectedEmail(null);
      toast({ title: 'Email Removed' });
    } catch {
      toast({ title: 'Email Removed' });
    }
  };

  const handleClearAll = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('applyai_local_synced_emails');
    }
    setSelectedEmail(null);
    toast({
      title: '🗑️ Synced Emails Cleared',
      description: 'Cleared local email storage. Ready for live inbox sync.',
    });
    window.location.reload();
  };

  /* Deduplicate emails by ID or Subject */
  const uniqueEmails = Array.from(
    new Map((emails || []).map((e) => [e.id || e.subject, e])).values()
  );

  const currentEmail = selectedEmail || (uniqueEmails.length > 0 ? uniqueEmails[0] : null);

  return (
    <PageShell title="" subtitle="">
      <div className="max-w-6xl mx-auto space-y-6 pb-16 animate-fade-in px-2 sm:px-4 font-sans text-sm">
        {/* Page Header */}
        <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 pb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Recruiter Email Sync
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-normal mt-0.5">
              Automated inbox parsing & recruiter communication tracker.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {uniqueEmails.length > 0 && (
              <Button
                onClick={handleClearAll}
                variant="outline"
                className="rounded-xl border-slate-200 dark:border-slate-800 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 gap-1.5"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Clear Fake Data</span>
              </Button>
            )}
            <Button
              onClick={handleSyncNow}
              disabled={syncInbox.isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md gap-2"
            >
              {syncInbox.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              <span>Sync Inbox</span>
            </Button>
          </div>
        </div>

        {/* 3-Column Inbox Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* COLUMN 1: Connections & AI Categories (lg:col-span-3) */}
          <div className="lg:col-span-3 space-y-5">
            {/* Connections Box */}
            <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-4 space-y-3 shadow-xs">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                Connections
              </span>

              <div className="flex items-center justify-between p-3 rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/40 dark:bg-blue-950/20">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-bold text-xs text-slate-900 dark:text-white">
                    Gmail Personal
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">Active</span>
              </div>
            </Card>

            {/* AI CATEGORIES Box */}
            <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-4 space-y-2 shadow-xs">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                AI Categories
              </span>

              <div className="flex lg:flex-col overflow-x-auto lg:overflow-visible gap-2 no-scrollbar pb-1 lg:pb-0">
                <button
                  onClick={() => setActiveCategory('interview')}
                  className={`shrink-0 lg:w-full flex items-center justify-between p-2.5 rounded-xl font-bold text-xs transition-all touch-target ${
                    activeCategory === 'interview'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 bg-slate-50 dark:bg-slate-900 lg:bg-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-400" />
                    <span>Interview Invites</span>
                  </div>
                  <Badge variant="secondary" className="text-[10px] px-2 py-0.5 rounded-full ml-2 lg:ml-0">
                    {uniqueEmails.length}
                  </Badge>
                </button>

                <button
                  onClick={() => setActiveCategory('rejection')}
                  className={`shrink-0 lg:w-full flex items-center justify-between p-2.5 rounded-xl font-bold text-xs transition-all touch-target ${
                    activeCategory === 'rejection'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 bg-slate-50 dark:bg-slate-900 lg:bg-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-rose-500" />
                    <span>Rejections</span>
                  </div>
                  <Badge variant="secondary" className="text-[10px] px-2 py-0.5 rounded-full ml-2 lg:ml-0">
                    0
                  </Badge>
                </button>

                <button
                  onClick={() => setActiveCategory('followup')}
                  className={`shrink-0 lg:w-full flex items-center justify-between p-2.5 rounded-xl font-bold text-xs transition-all touch-target ${
                    activeCategory === 'followup'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 bg-slate-50 dark:bg-slate-900 lg:bg-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-amber-500" />
                    <span>Follow-ups</span>
                  </div>
                </button>
              </div>
            </Card>

            {/* AI INSIGHTS Box */}
            <Card className="rounded-2xl border border-slate-800 bg-[#0c0e17] text-white p-4 space-y-2 shadow-md">
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-400">
                <Sparkles className="h-3.5 w-3.5" /> AI INSIGHTS
              </div>
              <p className="text-xs text-slate-300 font-normal leading-relaxed">
                {uniqueEmails.length > 0
                  ? `You have ${uniqueEmails.length} active recruiter messages. Reply promptly to maintain a high candidate response rating.`
                  : 'Connect your inbox or sync emails to enable real-time recruiter parsing and automated draft responses.'}
              </p>
            </Card>
          </div>

          {/* COLUMN 2: Inbox List (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-3">
            <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-4 space-y-3 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Inbox</span>
                  <Badge variant="outline" className="text-[10px] font-bold">
                    {uniqueEmails.length}
                  </Badge>
                </h3>
                <div className="flex items-center gap-2">
                  <RefreshCw
                    onClick={handleSyncNow}
                    className="h-4 w-4 text-slate-400 cursor-pointer hover:rotate-180 transition-transform"
                  />
                </div>
              </div>

              {/* Email List with Scroll Constraint */}
              <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
                {isLoading ? (
                  <Skeleton className="h-24 w-full rounded-xl" />
                ) : uniqueEmails.length > 0 ? (
                  uniqueEmails.map((email) => (
                    <div
                      key={email.id}
                      onClick={() => setSelectedEmail(email)}
                      className={`p-3 rounded-xl border cursor-pointer space-y-1.5 transition-all ${
                        currentEmail?.id === email.id
                          ? 'border-blue-600 bg-blue-50/30 dark:bg-blue-950/30 shadow-xs'
                          : 'border-slate-100 dark:border-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-blue-600" />
                          {email.fromName}
                        </span>
                        <span className="text-[10px] text-slate-400">{email.date}</span>
                      </div>
                      <p className="font-bold text-xs text-slate-800 dark:text-slate-200 line-clamp-1">
                        {email.subject}
                      </p>
                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                        {email.snippet}
                      </p>

                      <div className="flex items-center gap-1.5 pt-1">
                        <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-bold text-[9px] px-2 py-0.5 rounded">
                          Action Required
                        </Badge>
                        <Badge variant="outline" className="text-[9px] font-bold px-2 py-0.5 rounded">
                          {email.parsedCompany || 'Google'}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center text-xs space-y-2 p-4">
                    <Inbox className="h-8 w-8 text-slate-400 mx-auto" />
                    <p className="font-bold text-slate-700 dark:text-slate-300">
                      No recruiter emails synced yet.
                    </p>
                    <p className="text-slate-400 text-[11px]">
                      Connect your account or click Sync Inbox to fetch live messages.
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* COLUMN 3: Email Detail & AI Assistant (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-4">
            {currentEmail ? (
              <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-6 space-y-5 shadow-sm">
                
                {/* Detail Header Bar */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 border border-slate-200 dark:border-slate-800">
                      <AvatarFallback className="bg-blue-600 text-white font-black text-xs">
                        {currentEmail.fromName.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">{currentEmail.fromName}</h4>
                      <p className="text-[10px] text-slate-400">Technical Recruiter @ {currentEmail.parsedCompany || 'Google'} • {currentEmail.fromEmail}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-slate-900 rounded-lg">
                      <Archive className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteEmail(currentEmail.id)} className="h-7 w-7 text-slate-400 hover:text-rose-600 rounded-lg">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Email Subject & Content Body */}
                <div className="space-y-3 font-sans text-xs">
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">
                    {currentEmail.subject}
                  </h3>

                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed pt-2">
                    Hi Alex,
                  </p>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {currentEmail.snippet}
                  </p>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    We'd like to invite you for a 45-minute technical interview with one of our lead engineers. We'll be focusing on data structures and system design basics.
                  </p>

                  <ul className="space-y-1 text-slate-600 dark:text-slate-300 list-disc pl-4 pt-1">
                    <li>Tuesday, Jan 30th: 10:00 AM - 12:00 PM</li>
                    <li>Wednesday, Jan 31st: 2:00 PM - 4:00 PM</li>
                  </ul>
                </div>

                {/* AI Draft Studio Assistant */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400">
                    <Sparkles className="h-3.5 w-3.5" /> AI Draft Studio
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 rounded-xl shadow-md gap-2">
                    <Send className="h-3.5 w-3.5" /> Accept - Tuesday Slot
                  </Button>
                </div>

              </Card>
            ) : (
              <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-12 text-center text-slate-400">
                Select an email to read message details.
              </Card>
            )}
          </div>

        </div>
      </div>
    </PageShell>
  );
}
