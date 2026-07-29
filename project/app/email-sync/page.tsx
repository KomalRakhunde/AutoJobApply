'use client';

import { useState } from 'react';
import { PageShell } from '@/components/page-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Mail,
  RefreshCw,
  CheckCircle2,
  Calendar,
  Sparkles,
  Inbox,
  AlertCircle,
  Clock,
  PartyPopper,
  FileCheck,
  Ban,
  ArrowUpRight,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { SyncedEmail } from '@/lib/types';

const INITIAL_EMAILS: SyncedEmail[] = [
  {
    id: 'email-1',
    fromName: 'TechCorp Talent Acquisition',
    fromEmail: 'careers@techcorp.com',
    subject: 'Interview Invitation: Senior Full Stack Engineer at TechCorp',
    date: 'Today, 2:15 PM',
    snippet: 'Hi Komal, We reviewed your application and would love to schedule a 45-minute technical interview with our engineering lead next Tuesday...',
    category: 'interview',
    parsedCompany: 'TechCorp',
    parsedRole: 'Senior Full Stack Engineer',
    parsedDate: 'Next Tuesday, 10:00 AM',
  },
  {
    id: 'email-2',
    fromName: 'Innovate AI Recruiting',
    fromEmail: 'jobs@innovateai.com',
    subject: 'Offer Letter — Frontend Engineer Position',
    date: 'Yesterday',
    snippet: 'Dear Komal, Congratulations! We are thrilled to extend a formal offer of employment for the Frontend Engineer position at Innovate AI...',
    category: 'offer',
    parsedCompany: 'Innovate AI',
    parsedRole: 'Frontend Engineer',
  },
  {
    id: 'email-3',
    fromName: 'DataPulse HR',
    fromEmail: 'hr@datapulse.io',
    subject: 'Coding Assessment Instructions: AI Systems Engineer',
    date: '3 days ago',
    snippet: 'Thank you for applying. Please complete the following 90-minute coding challenge on Hackerrank within 48 hours...',
    category: 'assessment',
    parsedCompany: 'DataPulse AI',
    parsedRole: 'AI Systems Engineer',
    parsedDate: 'Complete within 48h',
  },
  {
    id: 'email-4',
    fromName: 'Global Soft',
    fromEmail: 'no-reply@globalsoft.com',
    subject: 'Application Status Update — Software Developer',
    date: '4 days ago',
    snippet: 'Thank you for your interest in Global Soft. After careful review, we have decided to move forward with other candidates whose experience more closely matches...',
    category: 'rejection',
    parsedCompany: 'Global Soft',
    parsedRole: 'Software Developer',
  },
];

export default function EmailSyncPage() {
  const { toast } = useToast();
  const [emails, setEmails] = useState<SyncedEmail[]>(INITIAL_EMAILS);
  const [syncing, setSyncing] = useState(false);
  const [connected, setConnected] = useState(true);

  const handleSyncNow = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      toast({
        title: 'Inbox Sync Complete',
        description: 'Scanned 14 new messages. 1 new interview invite categorized.',
      });
    }, 1200);
  };

  const getCategoryBadge = (cat: SyncedEmail['category']) => {
    switch (cat) {
      case 'interview':
        return <Badge className="bg-violet-500 hover:bg-violet-600 gap-1"><Calendar className="h-3 w-3" /> Interview Invite</Badge>;
      case 'offer':
        return <Badge className="bg-emerald-500 hover:bg-emerald-600 gap-1"><PartyPopper className="h-3 w-3" /> Offer Letter</Badge>;
      case 'assessment':
        return <Badge className="bg-amber-500 hover:bg-amber-600 gap-1"><FileCheck className="h-3 w-3" /> Assessment</Badge>;
      case 'rejection':
        return <Badge variant="secondary" className="gap-1 text-muted-foreground"><Ban className="h-3 w-3" /> Rejection</Badge>;
      default:
        return <Badge variant="outline">General</Badge>;
    }
  };

  return (
    <PageShell
      title="Automated Email Sync & Inbox AI"
      subtitle="Connect your Gmail account for automated background detection of interview invites, offers, and assessments."
      actions={
        <Button onClick={handleSyncNow} disabled={syncing} className="gap-2 shadow-md">
          <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? 'Syncing Inbox…' : 'Sync Inbox Now'}
        </Button>
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
                  <Badge variant="default" className="bg-emerald-500">CONNECTED</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Connected as <span className="font-medium text-foreground">komal.rakhunde@gmail.com</span> • Auto-scanned every 15 minutes.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={() => setConnected(!connected)}>
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
            <Tabs defaultValue="all" className="space-y-4">
              <TabsList className="grid grid-cols-5 w-full sm:w-auto">
                <TabsTrigger value="all">All ({emails.length})</TabsTrigger>
                <TabsTrigger value="interview">Interviews ({emails.filter((e) => e.category === 'interview').length})</TabsTrigger>
                <TabsTrigger value="offer">Offers ({emails.filter((e) => e.category === 'offer').length})</TabsTrigger>
                <TabsTrigger value="assessment">Assessments ({emails.filter((e) => e.category === 'assessment').length})</TabsTrigger>
                <TabsTrigger value="rejection">Rejections ({emails.filter((e) => e.category === 'rejection').length})</TabsTrigger>
              </TabsList>

              {['all', 'interview', 'offer', 'assessment', 'rejection'].map((tabVal) => {
                const filtered = tabVal === 'all' ? emails : emails.filter((e) => e.category === tabVal);
                return (
                  <TabsContent key={tabVal} value={tabVal} className="space-y-3">
                    {filtered.length === 0 ? (
                      <p className="py-12 text-center text-sm text-muted-foreground">No emails categorized under this filter.</p>
                    ) : (
                      filtered.map((mail) => (
                        <div
                          key={mail.id}
                          className="flex flex-col gap-3 rounded-xl border border-border p-4 transition-all hover:bg-muted/20 sm:flex-row sm:items-start sm:justify-between"
                        >
                          <div className="space-y-1.5 flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              {getCategoryBadge(mail.category)}
                              <span className="text-xs font-semibold text-foreground">{mail.fromName}</span>
                              <span className="text-xs text-muted-foreground">• {mail.date}</span>
                            </div>
                            <h4 className="font-semibold text-sm">{mail.subject}</h4>
                            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{mail.snippet}</p>

                            {mail.parsedDate && (
                              <div className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-violet-500/10 px-2.5 py-1 text-xs font-medium text-violet-600">
                                <Clock className="h-3.5 w-3.5" /> Interview Time: {mail.parsedDate}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0">
                            {mail.category === 'interview' && (
                              <Button size="sm" variant="secondary" className="gap-1 text-xs" onClick={() => toast({ title: 'Added to Calendar', description: `Scheduled ${mail.parsedCompany} interview.` })}>
                                <Calendar className="h-3.5 w-3.5" /> Sync Calendar
                              </Button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </TabsContent>
                );
              })}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
