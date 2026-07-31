'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Clock,
  Video,
  UserCheck,
  Send,
  Loader2,
  X,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { RecruiterCandidate } from '@/lib/recruiter-api';
import { useToast } from '@/hooks/use-toast';

interface ScheduleInterviewDialogProps {
  candidate: RecruiterCandidate;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onScheduled?: () => void;
}

export function ScheduleInterviewDialog({
  candidate,
  open,
  onOpenChange,
  onScheduled,
}: ScheduleInterviewDialogProps) {
  const { toast } = useToast();

  const [roundType, setRoundType] = useState('Technical Round 2 (System Architecture)');
  const [interviewerName, setInterviewerName] = useState('Komal Rakhunde (Technical Lead)');
  const [interviewerEmail, setInterviewerEmail] = useState('komal@applyai.com');
  const [scheduledDate, setScheduledDate] = useState('2026-08-04');
  const [scheduledTime, setScheduledTime] = useState('14:00');
  const [duration, setDuration] = useState('45');
  const [platform, setPlatform] = useState<'GOOGLE_MEET' | 'ZOOM' | 'TEAMS'>('GOOGLE_MEET');

  const [isSending, setIsSending] = useState(false);

  if (!open) return null;

  const meetingLink =
    platform === 'GOOGLE_MEET'
      ? `https://meet.google.com/applyai-tech-${candidate.id.slice(0, 6)}`
      : platform === 'ZOOM'
      ? `https://zoom.us/j/9847291039`
      : `https://teams.microsoft.com/l/meetup-join/applyai-tech-${candidate.id.slice(0, 6)}`;

  const handleDispatchSchedule = async () => {
    setIsSending(true);
    try {
      const formattedDateTime = `${scheduledDate} at ${scheduledTime} (${duration} mins)`;

      const res = await fetch('/api/recruiter/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateName: candidate.name,
          candidateEmail: candidate.email,
          jobRole: candidate.jobPostingId || 'Senior Full Stack Engineer',
          companyName: 'ApplyAI Corp',
          subject: `Interview Invitation: ${roundType} with ${interviewerName}`,
          interviewLink: meetingLink,
          scheduledTime: formattedDateTime,
          score: candidate.scores[0]?.overallScore || 88,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast({
          title: '📅 Interview Scheduled & Calendar Invite Sent!',
          description: `Dispatched calendar invite & video meeting link to ${candidate.email}.`,
        });
        onScheduled?.();
        onOpenChange(false);
      } else {
        toast({
          title: 'Scheduling Warning',
          description: data.error || 'Failed to dispatch interview email.',
          variant: 'destructive',
        });
      }
    } catch (err: any) {
      toast({
        title: 'Scheduling Failed',
        description: err.message || 'Could not dispatch scheduling invite.',
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-md p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[92vh] overflow-y-auto animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <span>Schedule Technical / HR Interview</span>
                <Badge className="bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 text-xs">
                  Calendar Sync
                </Badge>
              </h2>
              <p className="text-xs text-slate-500">
                Assign interviewers, generate meeting links, and dispatch calendar invitations.
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Candidate Summary Box */}
        <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/40 p-4 border border-slate-200/80 dark:border-slate-800 text-xs flex justify-between items-center">
          <div>
            <p className="font-extrabold text-slate-900 dark:text-white text-sm">{candidate.name}</p>
            <p className="text-slate-500">{candidate.email}</p>
          </div>
          <Badge className="bg-emerald-500 text-white font-bold text-xs">
            {candidate.scores[0]?.overallScore || 85}% ATS Score
          </Badge>
        </div>

        {/* Form Controls */}
        <div className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <Label className="text-slate-500 font-semibold">Interview Round Title</Label>
            <Input value={roundType} onChange={(e) => setRoundType(e.target.value)} className="h-9 text-xs font-semibold" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-slate-500 font-semibold">Assigned Interviewer</Label>
              <Input value={interviewerName} onChange={(e) => setInterviewerName(e.target.value)} className="h-9 text-xs font-semibold" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-slate-500 font-semibold">Interviewer Email</Label>
              <Input value={interviewerEmail} onChange={(e) => setInterviewerEmail(e.target.value)} className="h-9 text-xs" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label className="text-slate-500 font-semibold">Date</Label>
              <Input type="date" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} className="h-9 text-xs" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-slate-500 font-semibold">Time</Label>
              <Input type="time" value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)} className="h-9 text-xs" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-slate-500 font-semibold">Duration (Mins)</Label>
              <Input value={duration} onChange={(e) => setDuration(e.target.value)} className="h-9 text-xs" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-slate-500 font-semibold">Video Conference Platform</Label>
            <div className="flex gap-2">
              {[
                { id: 'GOOGLE_MEET', label: 'Google Meet' },
                { id: 'ZOOM', label: 'Zoom' },
                { id: 'TEAMS', label: 'Microsoft Teams' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPlatform(p.id as any)}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all ${
                    platform === p.id
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Generated Meeting Link Box */}
          <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Auto-Generated Meeting Room Link:
            </span>
            <a
              href={meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-indigo-600 dark:text-indigo-300 underline font-semibold flex items-center gap-1 hover:text-indigo-700"
            >
              <span>{meetingLink}</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="rounded-xl text-xs font-semibold"
          >
            Cancel
          </Button>

          <Button
            size="sm"
            disabled={isSending}
            onClick={handleDispatchSchedule}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs px-6 gap-2 shadow-md shadow-indigo-600/20"
          >
            {isSending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Scheduling Interview...</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span>Send Calendar & Video Invite</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}
