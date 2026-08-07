'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  LifeBuoy,
  MessageSquare,
  Star,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  Send,
  User,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Ticket {
  id: string;
  user: string;
  category: 'Bug Report' | 'Feature Request' | 'Billing Query' | 'General';
  subject: string;
  priority: 'Urgent' | 'High' | 'Normal';
  status: 'Open' | 'In Progress' | 'Resolved';
  date: string;
}

const initialTickets: Ticket[] = [
  { id: 'TICK-901', user: 'Jordan Miles', category: 'Bug Report', subject: 'Auto-apply stalled on LinkedIn Captcha step', priority: 'Urgent', status: 'Open', date: '10 mins ago' },
  { id: 'TICK-902', user: 'Sarah Jenkins', category: 'Billing Query', subject: 'Receipt missing invoice VAT ID', priority: 'Normal', status: 'In Progress', date: '1 hr ago' },
  { id: 'TICK-903', user: 'Marcus Vane', category: 'Feature Request', subject: 'Add support for Workday multi-step auto-apply', priority: 'High', status: 'Open', date: '3 hrs ago' },
  { id: 'TICK-904', user: 'Elena Rodriguez', category: 'General', subject: 'Resume ATS score feedback query', priority: 'Normal', status: 'Resolved', date: 'Yesterday' },
];

const feedbackReviews = [
  { user: 'Alex Rivers', tool: 'Resume Analyzer', rating: 5, comment: 'ATS keyword matching was spot on! Saved me hours of tweaking.' },
  { user: 'Maya Lin', tool: 'Voice Interviewer', rating: 4, comment: 'Great mock interview feedback, though audio response latency could be slightly faster.' },
  { user: 'Devon Vance', tool: 'Auto-Apply Engine', rating: 5, comment: 'Dispatched 40 applications seamlessly while I was asleep.' },
];

export default function SupportFeedbackDeskPage() {
  const { toast } = useToast();
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(initialTickets[0]);
  const [replyText, setReplyText] = useState('');

  const handleResolveTicket = (id: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'Resolved' } : t))
    );
    toast({ title: '✅ Ticket Resolved', description: `Marked ${id} as resolved.` });
  };

  const handleSendReply = () => {
    if (!replyText.trim() || !selectedTicket) return;
    toast({
      title: '✉️ Reply Dispatched',
      description: `Dispatched support reply to ${selectedTicket.user}.`,
    });
    setReplyText('');
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans text-sm pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Support & Feedback Desk
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Central ticket inbox, candidate bug reports, and platform review repository.
          </p>
        </div>

        <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-extrabold text-xs px-3 py-1">
          2 Open Tickets
        </Badge>
      </div>

      {/* TICKET INBOX & REPLY CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Ticket List (1 col) */}
        <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0b0f19] p-4 space-y-3 shadow-sm">
          <h3 className="font-extrabold text-slate-900 dark:text-white text-base px-2">Support Tickets</h3>
          
          <div className="space-y-2">
            {tickets.map((t) => (
              <div
                key={t.id}
                onClick={() => setSelectedTicket(t)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-1.5 ${
                  selectedTicket?.id === t.id
                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30'
                    : 'border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 hover:bg-slate-100/80 dark:hover:bg-slate-900/80'
                }`}
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="font-mono font-bold text-slate-500">{t.id}</span>
                  <Badge className={
                    t.priority === 'Urgent' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' :
                    t.priority === 'High' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' :
                    'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }>
                    {t.priority}
                  </Badge>
                </div>
                <p className="font-extrabold text-slate-900 dark:text-white line-clamp-1">{t.subject}</p>
                <div className="flex justify-between items-center text-[11px] text-slate-400">
                  <span>{t.user}</span>
                  <span>{t.date}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Right: Selected Ticket Detail & Response Box (2 cols) */}
        <Card className="lg:col-span-2 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0b0f19] p-6 space-y-6 shadow-sm flex flex-col justify-between">
          {selectedTicket ? (
            <div className="space-y-6">
              <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-400">{selectedTicket.id}</span>
                    <Badge variant="outline">{selectedTicket.category}</Badge>
                  </div>
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                    {selectedTicket.subject}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">Submitted by <strong className="text-slate-700 dark:text-slate-300">{selectedTicket.user}</strong> • {selectedTicket.date}</p>
                </div>

                {selectedTicket.status !== 'Resolved' && (
                  <Button onClick={() => handleResolveTicket(selectedTicket.id)} className="bg-emerald-600 text-white font-extrabold text-xs rounded-xl">
                    Mark as Resolved
                  </Button>
                )}
              </div>

              {/* Message Thread Box */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 space-y-2">
                <p className="text-xs font-bold text-slate-900 dark:text-white">{selectedTicket.user}:</p>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  "Hello Support, I noticed an issue when trying to run the auto-apply engine on LinkedIn. The browser window opens but gets stuck on the secondary multi-choice verification step. Please advise."
                </p>
              </div>

              {/* Reply Box */}
              <div className="space-y-3 pt-4">
                <h4 className="font-extrabold text-slate-900 dark:text-white text-xs">Dispatch Response</h4>
                <Textarea
                  placeholder="Type official support reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="rounded-2xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0f111a] text-xs min-h-[100px]"
                />
                <Button onClick={handleSendReply} className="bg-black dark:bg-white text-white dark:text-slate-900 font-extrabold text-xs px-6 rounded-xl gap-2">
                  <Send className="h-4 w-4" />
                  <span>Send Response</span>
                </Button>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400">Select a ticket to view conversation details</div>
          )}
        </Card>
      </div>

      {/* FEEDBACK & REVIEWS AUDIT REPOSITORY */}
      <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0b0f19] p-6 space-y-4 shadow-sm">
        <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Candidate Ratings & Analyzer Feedback</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {feedbackReviews.map((f, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-slate-900 dark:text-white">{f.user}</span>
                <div className="flex items-center text-amber-400">
                  {Array.from({ length: f.rating }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />
                  ))}
                </div>
              </div>
              <Badge variant="outline" className="text-[10px]">{f.tool}</Badge>
              <p className="text-xs text-slate-600 dark:text-slate-400 italic font-medium">"{f.comment}"</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
