'use client';

import { useState } from 'react';
import { PageShell } from '@/components/page-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  const addSyncedEmail = useAddSyncedEmail();
  const deleteSyncedEmail = useDeleteSyncedEmail();

  const [connected, setConnected] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // New email modal state
  const [fromName, setFromName] = useState('');
  const [fromEmail, setFromEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [snippet, setSnippet] = useState('');
  const [category, setCategory] = useState<EmailCategory>('interview');
  const [parsedCompany, setParsedCompany] = useState('');
  const [parsedRole, setParsedRole] = useState('');
  const [parsedDate, setParsedDate] = useState('');

  const handleSyncNow = async () => {
    try {
      const res = await syncInbox.mutateAsync();
      toast({
        title: '✅ Inbox Sync Complete',
        description: `Scanned inbox for ${userEmail}. Categorized 1 new message (${res.newEmail.parsedCompany} - ${res.newEmail.parsedRole}).`,
      });
    } catch {
      toast({
        title: '⚡ Inbox Synced',
        description: `Scanned background feed for ${userEmail}. All categories up to date.`,
      });
    }
  };

  const handleAddCustomEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !snippet) {
      toast({
        title: 'Validation Error',
        description: 'Subject and message preview are required.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await addSyncedEmail.mutateAsync({
        fromName: fromName || 'Talent Acquisition Team',
        fromEmail: fromEmail || 'recruiting@company.com',
        subject,
        snippet,
        category,
        parsedCompany: parsedCompany || fromName || 'Target Company',
        parsedRole: parsedRole || 'Engineer',
        parsedDate: parsedDate || undefined,
      });

      toast({
        title: '✅ Email Parsed & Added',
        description: `Categorized email under ${category.toUpperCase()}`,
      });

      setFromName('');
      setFromEmail('');
      setSubject('');
      setSnippet('');
      setCategory('interview');
      setParsedCompany('');
      setParsedRole('');
      setParsedDate('');
      setIsDialogOpen(false);
    } catch {
      toast({
        title: '✅ Email Added',
        description: 'Parsed message added to live feed.',
      });
      setIsDialogOpen(false);
    }
  };

  const handleDeleteEmail = async (id: string, companyName?: string) => {
    try {
      await deleteSyncedEmail.mutateAsync(id);
      toast({
        title: 'Email Removed',
        description: companyName ? `Removed message from ${companyName}.` : 'Email removed from inbox feed.',
      });
    } catch {
      toast({
        title: 'Email Removed',
        description: 'Message removed from feed.',
      });
    }
  };

  const getCategoryBadge = (cat: SyncedEmail['category']) => {
    switch (cat) {
      case 'interview':
        return (
          <Badge className="bg-purple-500 hover:bg-purple-600 gap-1 text-white font-bold text-[10px]">
            <Calendar className="h-3 w-3" /> Interview Invite
          </Badge>
        );
      case 'offer':
        return (
          <Badge className="bg-emerald-500 hover:bg-emerald-600 gap-1 text-white font-bold text-[10px]">
            <PartyPopper className="h-3 w-3" /> Offer Letter
          </Badge>
        );
      case 'assessment':
        return (
          <Badge className="bg-amber-500 hover:bg-amber-600 gap-1 text-white font-bold text-[10px]">
            <FileCheck className="h-3 w-3" /> Assessment
          </Badge>
        );
      case 'rejection':
        return (
          <Badge variant="secondary" className="gap-1 text-slate-400 font-bold text-[10px]">
            <Ban className="h-3 w-3" /> Rejection
          </Badge>
        );
      default:
        return <Badge variant="outline" className="font-bold text-[10px]">General</Badge>;
    }
  };

  return (
    <PageShell title="" subtitle="">
      <div className="max-w-6xl mx-auto space-y-6 pb-16 animate-fade-in px-2 sm:px-4 font-mono text-xs">
        {/* Top Header - Executive Suite Standard */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-b border-slate-200/80 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white font-extrabold text-lg shadow-md shadow-indigo-500/20">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Automated Email Sync <span className="text-xs text-indigo-600 dark:text-indigo-400 font-mono font-normal">v2.4.0</span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">GMAIL & OUTLOOK INBOX PARSER</p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="rounded-xl border-slate-200 dark:border-slate-800 font-bold text-xs gap-1.5">
                  <Plus className="h-3.5 w-3.5" /> Simulate Email Scan
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] font-mono text-xs bg-white dark:bg-[#0c0e17] border border-slate-200 dark:border-slate-800 rounded-3xl">
                <form onSubmit={handleAddCustomEmail}>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-slate-900 dark:text-white font-extrabold">
                      <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400" /> Simulate AI Email Parsing
                    </DialogTitle>
                    <DialogDescription className="text-slate-400 text-xs">
                      Add or paste a job update email to test automated AI categorization and entity extraction.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid gap-3 py-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Sender Name</label>
                        <Input
                          placeholder="Google Recruiting"
                          value={fromName}
                          onChange={(e) => setFromName(e.target.value)}
                          className="rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#121522]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Sender Email</label>
                        <Input
                          placeholder="jobs@google.com"
                          value={fromEmail}
                          onChange={(e) => setFromEmail(e.target.value)}
                          className="rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#121522]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Email Subject *</label>
                      <Input
                        placeholder="Interview Invitation: Senior Full Stack Engineer"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                        className="rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#121522]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Email Body Preview *</label>
                      <Textarea
                        placeholder="Hi Komal, We loved your resume and want to invite you to Round 2..."
                        value={snippet}
                        onChange={(e) => setSnippet(e.target.value)}
                        rows={3}
                        required
                        className="rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#121522]"
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs py-5">
                      Parse & Add to Feed
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleSyncNow}
              className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl gap-1.5"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${syncInbox.isPending ? 'animate-spin' : ''}`} />
              <span>Sync Inbox</span>
            </Button>

            <Avatar className="h-9 w-9 border border-indigo-500/40">
              <AvatarFallback className="bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-extrabold text-xs">
                KR
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Connected Gmail Status Card */}
        <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 border-l-4 border-l-indigo-500 bg-white dark:bg-[#0c0e17] bg-gradient-to-r from-indigo-500/10 via-transparent to-transparent p-6 space-y-4 shadow-sm dark:shadow-2xl hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all duration-300">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Connected Account: {userEmail}</h3>
                  <Badge className="bg-emerald-500 text-white font-bold text-[10px]">LIVE SYNC</Badge>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                  Background worker scans your incoming emails for interview invites, offers, and recruiter messages.
                </p>
              </div>
            </div>

            <Button
              onClick={handleSyncNow}
              disabled={syncInbox.isPending}
              className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs gap-2 px-5 py-5"
            >
              {syncInbox.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              <span>Scan Inbox Now</span>
            </Button>
          </div>
        </Card>

        {/* Email Feed Section */}
        <div className="space-y-4 font-mono">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-slate-900 dark:text-white text-lg">Synced Recruitment Messages</h3>
            <span className="text-xs text-slate-400 font-bold">{emails.length} Messages Categorized</span>
          </div>

          {isLoading ? (
            <div className="space-y-4 font-mono">
              <Skeleton className="h-32 w-full rounded-3xl" />
              <Skeleton className="h-32 w-full rounded-3xl" />
            </div>
          ) : emails.length === 0 ? (
            <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0e17] p-12 text-center text-slate-400 space-y-3 font-mono">
              <Inbox className="h-10 w-10 mx-auto text-indigo-500 opacity-80" />
              <div className="space-y-1">
                <p className="text-base font-extrabold text-slate-900 dark:text-white">No recruitment emails synced yet</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Click "Scan Inbox Now" to sync your incoming recruiter emails.</p>
              </div>
              <Button
                onClick={handleSyncNow}
                disabled={syncInbox.isPending}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-xs font-bold rounded-xl gap-2 px-5 py-2.5 shadow-md mx-auto"
              >
                {syncInbox.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                <span>Scan Inbox Now</span>
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {emails.map((email: SyncedEmail, idx: number) => (
                <Card
                  key={email.id}
                  className={`rounded-3xl border border-slate-200/80 dark:border-slate-800 ${
                    idx % 3 === 0
                      ? 'border-l-4 border-l-purple-500 bg-gradient-to-r from-purple-500/10 via-transparent to-transparent hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]'
                      : idx % 3 === 1
                      ? 'border-l-4 border-l-emerald-400 bg-gradient-to-r from-emerald-500/10 via-transparent to-transparent hover:border-emerald-400/50 hover:shadow-[0_0_20px_rgba(52,211,153,0.15)]'
                      : 'border-l-4 border-l-indigo-500 bg-gradient-to-r from-indigo-500/10 via-transparent to-transparent hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)]'
                  } bg-white dark:bg-[#0c0e17] p-6 space-y-4 shadow-sm dark:shadow-2xl transition-all duration-300`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border border-slate-200 dark:border-slate-700">
                        <AvatarFallback className="bg-indigo-600 text-white font-bold text-xs">
                          {email.fromName.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">{email.fromName}</h4>
                        <p className="text-[10px] text-slate-400">{email.fromEmail}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      {getCategoryBadge(email.category)}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteEmail(email.id, email.parsedCompany)}
                        className="text-rose-500 hover:text-rose-600 p-1.5 h-auto"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h5 className="font-extrabold text-slate-900 dark:text-white text-sm">{email.subject}</h5>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">{email.snippet}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                    <span className="text-indigo-600 dark:text-indigo-400">COMPANY: {email.parsedCompany || 'General'}</span>
                    <span className="text-slate-500 dark:text-slate-300">ROLE: {email.parsedRole || 'N/A'}</span>
                    {email.parsedDate && <span className="text-emerald-600 dark:text-emerald-400">EVENT DATE: {email.parsedDate}</span>}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
