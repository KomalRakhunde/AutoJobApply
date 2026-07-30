'use client';

import { useState } from 'react';
import { PageShell } from '@/components/page-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
        title: 'Inbox Sync Complete',
        description: `Scanned inbox for ${userEmail}. Categorized 1 new message (${res.newEmail.parsedCompany} - ${res.newEmail.parsedRole}).`,
      });
    } catch (err) {
      toast({
        title: 'Sync Failed',
        description: err instanceof Error ? err.message : 'Could not scan inbox.',
        variant: 'destructive',
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
        title: 'Email Parsed & Added',
        description: `Successfully categorized email under ${category.toUpperCase()}`,
      });

      // Reset form
      setFromName('');
      setFromEmail('');
      setSubject('');
      setSnippet('');
      setCategory('interview');
      setParsedCompany('');
      setParsedRole('');
      setParsedDate('');
      setIsDialogOpen(false);
    } catch (err) {
      toast({
        title: 'Failed to add email',
        description: err instanceof Error ? err.message : 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteEmail = async (id: string, companyName?: string) => {
    try {
      await deleteSyncedEmail.mutateAsync(id);
      toast({
        title: 'Email Removed',
        description: companyName ? `Removed message from ${companyName}.` : 'Email removed from inbox feed.',
      });
    } catch (err) {
      toast({
        title: 'Could not delete',
        description: err instanceof Error ? err.message : 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  const getCategoryBadge = (cat: SyncedEmail['category']) => {
    switch (cat) {
      case 'interview':
        return (
          <Badge className="bg-violet-500 hover:bg-violet-600 gap-1 text-white">
            <Calendar className="h-3 w-3" /> Interview Invite
          </Badge>
        );
      case 'offer':
        return (
          <Badge className="bg-emerald-500 hover:bg-emerald-600 gap-1 text-white">
            <PartyPopper className="h-3 w-3" /> Offer Letter
          </Badge>
        );
      case 'assessment':
        return (
          <Badge className="bg-amber-500 hover:bg-amber-600 gap-1 text-white">
            <FileCheck className="h-3 w-3" /> Assessment
          </Badge>
        );
      case 'rejection':
        return (
          <Badge variant="secondary" className="gap-1 text-muted-foreground">
            <Ban className="h-3 w-3" /> Rejection
          </Badge>
        );
      default:
        return <Badge variant="outline">General</Badge>;
    }
  };

  return (
    <PageShell
      title="Automated Email Sync & Inbox AI"
      subtitle="Connect your Gmail account for automated background detection of interview invites, offers, and assessments."
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Plus className="h-4 w-4" /> Simulate Email Scan
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <form onSubmit={handleAddCustomEmail}>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" /> Simulate AI Email Parsing
                  </DialogTitle>
                  <DialogDescription>
                    Add or paste a job update email to test automated AI categorization and entity extraction.
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-muted-foreground">Sender Name</label>
                      <Input
                        placeholder="Google Recruiting"
                        value={fromName}
                        onChange={(e) => setFromName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-muted-foreground">Sender Email</label>
                      <Input
                        placeholder="jobs@google.com"
                        value={fromEmail}
                        onChange={(e) => setFromEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">Email Subject *</label>
                    <Input
                      placeholder="Technical Interview Invitation: Software Engineer"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">Message Snippet / Body *</label>
                    <Textarea
                      placeholder="Hi! We are excited to schedule a 60-min coding round next Thursday at 3:00 PM."
                      value={snippet}
                      onChange={(e) => setSnippet(e.target.value)}
                      rows={3}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-muted-foreground">Category</label>
                      <Select
                        value={category}
                        onValueChange={(val) => setCategory(val as EmailCategory)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="interview">Interview Invite</SelectItem>
                          <SelectItem value="offer">Offer Letter</SelectItem>
                          <SelectItem value="assessment">Assessment</SelectItem>
                          <SelectItem value="rejection">Rejection</SelectItem>
                          <SelectItem value="general">General</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-muted-foreground">Parsed Company</label>
                      <Input
                        placeholder="Google"
                        value={parsedCompany}
                        onChange={(e) => setParsedCompany(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-muted-foreground">Parsed Role</label>
                      <Input
                        placeholder="Software Engineer"
                        value={parsedRole}
                        onChange={(e) => setParsedRole(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-muted-foreground">Parsed Interview Date</label>
                      <Input
                        placeholder="Next Thursday, 3:00 PM"
                        value={parsedDate}
                        onChange={(e) => setParsedDate(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={addSyncedEmail.isPending} className="gap-2">
                    {addSyncedEmail.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                    Add & AI Parse
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Button
            onClick={handleSyncNow}
            disabled={syncInbox.isPending || !connected}
            className="gap-2 shadow-md"
          >
            <RefreshCw className={`h-4 w-4 ${syncInbox.isPending ? 'animate-spin' : ''}`} />
            {syncInbox.isPending ? 'Scanning Inbox…' : 'Sync Inbox Now'}
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Account Connection Status */}
        <Card className="border-2 border-primary/20 bg-primary/5">
          <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-md text-red-500">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold">Gmail Integration</h3>
                  <Badge variant="default" className={connected ? 'bg-emerald-500' : 'bg-muted text-muted-foreground'}>
                    {connected ? 'CONNECTED' : 'DISCONNECTED'}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Connected as <span className="font-medium text-foreground">{userEmail}</span> • Auto-scanned every 15 minutes.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setConnected(!connected);
                  toast({
                    title: !connected ? 'Gmail Connected' : 'Gmail Disconnected',
                    description: !connected
                      ? `Syncing automated updates to ${userEmail}.`
                      : 'Background email scanner paused.',
                  });
                }}
              >
                {connected ? 'Disconnect' : 'Connect Account'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Categorized Email Feed */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Inbox className="h-5 w-5 text-primary" /> AI Parsed Communication Feed
            </CardTitle>
            <CardDescription>
              Messages automatically extracted and categorized from your inbox
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm">Loading synchronized emails…</p>
              </div>
            ) : (
              <Tabs defaultValue="all" className="space-y-4">
                <TabsList className="grid grid-cols-5 w-full sm:w-auto">
                  <TabsTrigger value="all">All ({emails.length})</TabsTrigger>
                  <TabsTrigger value="interview">
                    Interviews ({emails.filter((e) => e.category === 'interview').length})
                  </TabsTrigger>
                  <TabsTrigger value="offer">
                    Offers ({emails.filter((e) => e.category === 'offer').length})
                  </TabsTrigger>
                  <TabsTrigger value="assessment">
                    Assessments ({emails.filter((e) => e.category === 'assessment').length})
                  </TabsTrigger>
                  <TabsTrigger value="rejection">
                    Rejections ({emails.filter((e) => e.category === 'rejection').length})
                  </TabsTrigger>
                </TabsList>

                {['all', 'interview', 'offer', 'assessment', 'rejection'].map((tabVal) => {
                  const filtered =
                    tabVal === 'all' ? emails : emails.filter((e) => e.category === tabVal);
                  return (
                    <TabsContent key={tabVal} value={tabVal} className="space-y-3">
                      {filtered.length === 0 ? (
                        <p className="py-12 text-center text-sm text-muted-foreground">
                          No emails categorized under this filter.
                        </p>
                      ) : (
                        filtered.map((mail) => (
                          <div
                            key={mail.id}
                            className="flex flex-col gap-3 rounded-xl border border-border p-4 transition-all hover:bg-muted/20 sm:flex-row sm:items-start sm:justify-between"
                          >
                            <div className="space-y-1.5 flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                {getCategoryBadge(mail.category)}
                                <span className="text-xs font-semibold text-foreground">
                                  {mail.fromName}
                                </span>
                                <span className="text-xs text-muted-foreground">• {mail.date}</span>
                              </div>
                              <h4 className="font-semibold text-sm">{mail.subject}</h4>
                              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                {mail.snippet}
                              </p>

                              {mail.parsedDate && (
                                <div className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-violet-500/10 px-2.5 py-1 text-xs font-medium text-violet-600 dark:text-violet-400">
                                  <Clock className="h-3.5 w-3.5" /> Interview Time: {mail.parsedDate}
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0">
                              {mail.category === 'interview' && (
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  className="gap-1 text-xs"
                                  onClick={() =>
                                    toast({
                                      title: 'Added to Calendar',
                                      description: `Scheduled ${mail.parsedCompany || mail.fromName} interview in your calendar.`,
                                    })
                                  }
                                >
                                  <Calendar className="h-3.5 w-3.5" /> Sync Calendar
                                </Button>
                              )}
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                onClick={() => handleDeleteEmail(mail.id, mail.parsedCompany || mail.fromName)}
                                title="Remove email from feed"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </TabsContent>
                  );
                })}
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
