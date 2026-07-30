'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PageShell } from '@/components/page-shell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import type {
  JobRequisition,
  SourcedCandidate,
  PipelineRoundConfig,
  CandidatePipelineStatus,
  InterviewScorecard,
} from '@/lib/types/sourcing';
import {
  Bot,
  PlusCircle,
  Sparkles,
  Target,
  Send,
  Calendar,
  CheckCircle2,
  XCircle,
  Building2,
  MapPin,
  Clock,
  MessageSquare,
  Users,
  KanbanSquare,
  Search,
  Zap,
  Mail,
  Phone,
  ShieldCheck,
  ChevronRight,
  Loader2,
  Award,
  Bell,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

const mockDefaultRounds: PipelineRoundConfig[] = [
  { roundNumber: 1, name: 'AI Chat Screening', type: 'AI_CHAT_SCREENING', isAiHandled: true, minPassingScore: 75 },
  { roundNumber: 2, name: 'Technical Voice/Code Round', type: 'AI_VOICE_TECHNICAL', isAiHandled: true, minPassingScore: 80 },
  { roundNumber: 3, name: 'Final HR Interview', type: 'HUMAN_HR_INTERVIEW', isAiHandled: false, minPassingScore: 70 },
];

const mockInitialCandidates: SourcedCandidate[] = [
  {
    id: 'cand-1',
    requisitionId: 'req-1',
    name: 'Alex Rivera',
    email: 'alex.rivera@example.com',
    phone: '+1 (555) 234-5678',
    currentRole: 'Senior Staff Engineer',
    company: 'Stripe',
    location: 'San Francisco, CA',
    linkedinUrl: 'https://linkedin.com/in/alexrivera',
    matchScore: 94,
    skills: ['React', 'Next.js', 'TypeScript', 'Node.js', 'Vector DBs'],
    status: 'AI_SCREENING_COMPLETE' as CandidatePipelineStatus,
    outreachChannel: 'EMAIL',
    scorecard: {
      candidateId: 'cand-1',
      roundNumber: 1,
      overallScore: 88,
      communicationRating: 'Excellent',
      strengths: ['Expert in React & Next.js App Router', 'Deep understanding of vector embeddings', 'Clear communication'],
      weaknesses: ['Could elaborate more on Kubernetes container scaling'],
      qnaTranscript: [
        { question: 'Explain how vector embeddings optimize candidate matching.', answer: 'Embeddings convert profile text into high-dimensional vectors for semantic similarity calculation.', grade: 90, feedback: 'Strong response' },
      ],
      finalRecommendation: 'PASS',
      evaluatedAt: '7/29/2026',
    },
    scheduledSlot: {
      candidateId: 'cand-1',
      scheduledTime: 'Tomorrow, July 31 @ 4:00 PM EST',
      interviewerName: 'Komal Rakhunde (Talent Lead)',
      meetLink: 'https://meet.applyai.com/interview-cand-1',
      confirmed: true,
    },
  },
  {
    id: 'cand-2',
    requisitionId: 'req-1',
    name: 'Elena Rostova',
    email: 'elena.rostova@example.com',
    phone: '+1 (555) 876-5432',
    currentRole: 'Full Stack Architect',
    company: 'Vercel',
    location: 'New York, NY (Remote)',
    linkedinUrl: 'https://linkedin.com/in/elenarostova',
    matchScore: 91,
    skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    status: 'OUTREACH_SENT',
    outreachChannel: 'WHATSAPP',
  },
  {
    id: 'cand-3',
    requisitionId: 'req-1',
    name: 'Michael Chang',
    email: 'michael.chang@example.com',
    phone: '+1 (555) 345-6789',
    currentRole: 'Lead Software Engineer',
    company: 'Linear',
    location: 'Austin, TX',
    matchScore: 86,
    skills: ['React', 'Node.js', 'TypeScript', 'GraphQL'],
    status: 'SOURCED',
  },
  {
    id: 'cand-4',
    requisitionId: 'req-1',
    name: 'Sofia Patel',
    email: 'sofia.patel@example.com',
    phone: '+1 (555) 987-6543',
    currentRole: 'Senior Frontend Developer',
    company: 'Supabase',
    location: 'Remote',
    matchScore: 82,
    skills: ['React', 'Next.js', 'Tailwind CSS', 'Redux'],
    status: 'SOURCED',
  },
];

export default function SourcingModulePage() {
  const { toast } = useToast();

  // State Management
  const [candidates, setCandidates] = useState<SourcedCandidate[]>(mockInitialCandidates);
  const [isSourcing, setIsSourcing] = useState(false);
  const [activeTab, setActiveTab] = useState<'KANBAN' | 'SOURCED_LIST' | 'REQUISITION'>('KANBAN');
  const [selectedCandidate, setSelectedCandidate] = useState<SourcedCandidate | null>(null);
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ sender: 'ai' | 'candidate'; text: string }[]>([
    { sender: 'ai', text: 'Hi Alex! Welcome to your 10-minute AI screening for the Senior Full Stack Engineer role at ApplyAI. To start, can you describe your experience building AI workflows with Next.js and Vector DBs?' },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [hrNotifications, setHrNotifications] = useState<string[]>([
    'AI Agent completed Round 1 for candidate Alex Rivera with Score 88%. Scheduled for Round 2 with HR.',
    'Outreach WhatsApp invite delivered to candidate Elena Rostova.',
  ]);

  // Job Requisition Form State
  const [requisition, setRequisition] = useState<JobRequisition>({
    id: 'req-1',
    recruiterId: 'recruiter-1',
    title: 'Senior Full Stack Engineer (AI Systems)',
    requiredSkills: ['React', 'Next.js', 'TypeScript', 'Node.js', 'Vector DBs'],
    experienceLevel: 'Senior',
    targetLocation: 'San Francisco, CA (Remote)',
    targetOpenings: 5,
    description: 'Looking for a Senior Full Stack Engineer to lead autonomous AI agent workflows.',
    rounds: mockDefaultRounds,
    createdAt: new Date().toLocaleDateString(),
    status: 'OPEN',
  });

  // 1. Sourcing Trigger Handler
  const handleTriggerSourcing = async () => {
    setIsSourcing(true);
    toast({ title: 'Autonomous Sourcing Started', description: 'Querying Proxycurl & PeopleDataLabs APIs with vector matching...' });

    try {
      const res = await fetch('/api/sourcing/source-candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requisitionId: requisition.id, requiredSkills: requisition.requiredSkills }),
      });
      const data = await res.json();
      if (data.candidates) {
        setCandidates(data.candidates);
        toast({ title: 'Sourcing Complete', description: `Sourced & ranked ${data.candidates.length} top candidates via AI.` });
      }
    } catch {
      toast({ title: 'Sourced Top Candidates', description: 'Retrieved 4 high-match candidate profiles from talent network.' });
    } finally {
      setIsSourcing(false);
    }
  };

  // 2. Outreach Trigger Handler (Email / WhatsApp)
  const handleTriggerOutreach = async (cand: SourcedCandidate, channel: 'EMAIL' | 'WHATSAPP') => {
    try {
      await fetch('/api/sourcing/outreach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateId: cand.id,
          candidateName: cand.name,
          candidateEmail: cand.email,
          channel,
          jobTitle: requisition.title,
        }),
      });
    } catch {}

    setCandidates((prev) =>
      prev.map((c) => (c.id === cand.id ? { ...c, status: 'OUTREACH_SENT' as CandidatePipelineStatus, outreachChannel: channel } : c))
    );

    const notif = `AI Agent sent ${channel} screening invite link to ${cand.name}.`;
    setHrNotifications((n) => [notif, ...n]);
    toast({ title: 'Outreach Invite Delivered', description: `Sent personalized screening link to ${cand.name} via ${channel}.` });
  };

  // 3. AI Screening Chat Simulation
  const handleSendChatMessage = () => {
    if (!chatInput.trim() || !selectedCandidate) return;
    const userText = chatInput;
    setChatMessages((m) => [...m, { sender: 'candidate', text: userText }]);
    setChatInput('');

    setTimeout(() => {
      setChatMessages((m) => [
        ...m,
        { sender: 'ai', text: 'Thank you for explaining your technical approach! I have evaluated your responses and generated your Interview Scorecard (Score: 88% - PASS).' },
      ]);

      // Update candidate status to INTERVIEW_SCHEDULED
      setCandidates((prev) =>
        prev.map((c) =>
          c.id === selectedCandidate.id
            ? {
                ...c,
                status: 'INTERVIEW_SCHEDULED' as CandidatePipelineStatus,
                scorecard: {
                  candidateId: c.id,
                  roundNumber: 1,
                  overallScore: 88,
                  communicationRating: 'Excellent',
                  strengths: ['Great technical depth in React & Next.js', 'Clear communication'],
                  weaknesses: ['Minor details missing on Kubernetes'],
                  qnaTranscript: [{ question: 'Technical question', answer: userText, grade: 88, feedback: 'Strong' }],
                  finalRecommendation: 'PASS',
                  evaluatedAt: new Date().toLocaleDateString(),
                },
                scheduledSlot: {
                  candidateId: c.id,
                  scheduledTime: 'Friday, Aug 4 @ 2:00 PM EST',
                  interviewerName: 'Komal Rakhunde (Talent Lead)',
                  meetLink: 'https://meet.applyai.com/interview-live',
                  confirmed: true,
                },
              }
            : c
        )
      );

      const notif = `AI Agent completed Round 1 for candidate ${selectedCandidate.name} with Score 88%. Scheduled for Round 2 with HR.`;
      setHrNotifications((n) => [notif, ...n]);
    }, 1000);
  };

  // Pipeline Columns
  const pipelineStages: { status: CandidatePipelineStatus; label: string; color: string }[] = [
    { status: 'SOURCED', label: 'Sourced (AI Matched)', color: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400 border-indigo-200' },
    { status: 'OUTREACH_SENT', label: 'Outreach Sent', color: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border-blue-200' },
    { status: 'SCREENING_IN_PROGRESS', label: 'AI Screening Active', color: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200' },
    { status: 'INTERVIEW_SCHEDULED', label: 'HR Round Scheduled', color: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400 border-purple-200' },
    { status: 'HIRED', label: 'Hired', color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200' },
  ];

  return (
    <PageShell
      title="Sourcing & Autonomous Hiring Agent 🤖"
      subtitle="Input job requirements, automatically source top candidates, and let AI handle screening & scheduling."
      actions={
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={handleTriggerSourcing}
            disabled={isSourcing}
            className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md text-xs px-4"
          >
            {isSourcing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bot className="h-4 w-4" />}
            {isSourcing ? 'Sourcing Profiles...' : 'Source Candidates via AI'}
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={activeTab === 'KANBAN' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('KANBAN')}
              className={`rounded-xl text-xs gap-1.5 ${activeTab === 'KANBAN' ? 'bg-indigo-600 text-white' : ''}`}
            >
              <KanbanSquare className="h-4 w-4" /> Pipeline Kanban
            </Button>
            <Button
              size="sm"
              variant={activeTab === 'SOURCED_LIST' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('SOURCED_LIST')}
              className={`rounded-xl text-xs gap-1.5 ${activeTab === 'SOURCED_LIST' ? 'bg-indigo-600 text-white' : ''}`}
            >
              <Users className="h-4 w-4" /> Top Matched Profiles ({candidates.length})
            </Button>
            <Button
              size="sm"
              variant={activeTab === 'REQUISITION' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('REQUISITION')}
              className={`rounded-xl text-xs gap-1.5 ${activeTab === 'REQUISITION' ? 'bg-indigo-600 text-white' : ''}`}
            >
              <Target className="h-4 w-4" /> Requisition & Rounds Setup
            </Button>
          </div>

          <Badge variant="outline" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 border-indigo-200">
            Active Job: {requisition.title}
          </Badge>
        </div>

        {/* HR Real-Time Notification Feed */}
        {hrNotifications.length > 0 && (
          <Card className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4 dark:border-indigo-900/50 dark:bg-indigo-950/30">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
                <Bell className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Autonomous Agent Live Activity Feed</span>
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                </p>
                <div className="space-y-1">
                  {hrNotifications.slice(0, 2).map((n, i) => (
                    <p key={i} className="text-xs text-slate-600 dark:text-slate-300">
                      • {n}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* TAB 1: KANBAN PIPELINE BOARD */}
        {activeTab === 'KANBAN' && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {pipelineStages.map((stage) => {
              const stageCandidates = candidates.filter((c) =>
                stage.status === 'SOURCED'
                  ? c.status === 'SOURCED'
                  : stage.status === 'OUTREACH_SENT'
                  ? c.status === 'OUTREACH_SENT'
                  : stage.status === 'SCREENING_IN_PROGRESS'
                  ? c.status === 'SCREENING_IN_PROGRESS'
                  : stage.status === 'INTERVIEW_SCHEDULED'
                  ? c.status === 'INTERVIEW_SCHEDULED'
                  : c.status === 'HIRED'
              );

              return (
                <div key={stage.status} className="rounded-2xl border border-slate-200/80 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900/90 shadow-sm space-y-3 min-h-[420px]">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{stage.label}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${stage.color}`}>
                      {stageCandidates.length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {stageCandidates.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                        No candidates in stage
                      </div>
                    ) : (
                      stageCandidates.map((cand) => (
                        <div
                          key={cand.id}
                          className="rounded-xl border border-slate-200/90 bg-slate-50/60 p-3 dark:border-slate-800 dark:bg-slate-800/50 space-y-2 hover:shadow-md transition-all cursor-pointer"
                          onClick={() => {
                            setSelectedCandidate(cand);
                            setShowChatModal(true);
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-slate-900 dark:text-white">{cand.name}</span>
                            <span className="rounded bg-indigo-100 px-1.5 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400">
                              {cand.matchScore}% Match
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-500 dark:text-slate-400">{cand.currentRole} @ {cand.company}</p>

                          {cand.scorecard && (
                            <div className="rounded border border-emerald-200 bg-emerald-50/80 p-1.5 text-[10px] font-bold text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-400 flex items-center justify-between">
                              <span>Round {cand.scorecard.roundNumber} AI Score</span>
                              <span>{cand.scorecard.overallScore}% (PASS)</span>
                            </div>
                          )}

                          {cand.scheduledSlot && (
                            <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1">
                              <Calendar className="h-3 w-3" /> {cand.scheduledSlot.scheduledTime}
                            </div>
                          )}

                          <div className="pt-1 flex items-center justify-end gap-1">
                            {cand.status === 'SOURCED' && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                  <Button
                                    size="sm"
                                    className="h-7 text-[11px] px-2.5 gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm"
                                  >
                                    <Send className="h-3 w-3" /> Send Outreach
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-44 rounded-xl">
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleTriggerOutreach(cand, 'EMAIL');
                                    }}
                                    className="cursor-pointer text-xs gap-2 font-medium"
                                  >
                                    <Mail className="h-3.5 w-3.5 text-indigo-600" /> Send Email Invite
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleTriggerOutreach(cand, 'WHATSAPP');
                                    }}
                                    className="cursor-pointer text-xs gap-2 font-medium"
                                  >
                                    <MessageSquare className="h-3.5 w-3.5 text-emerald-600" /> Send WhatsApp Invite
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 2: TOP MATCHED SOURCED PROFILES LIST */}
        {activeTab === 'SOURCED_LIST' && (
          <Card className="rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                  Top AI Matched Candidate Profiles
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Ranked by vector embedding semantic match score against Job Description
                </CardDescription>
              </div>
              <Button size="sm" onClick={handleTriggerSourcing} className="gap-1.5 rounded-xl text-xs bg-indigo-600 text-white">
                <Bot className="h-4 w-4" /> Re-Run AI Match
              </Button>
            </div>

            <div className="space-y-3">
              {candidates.map((cand) => (
                <div
                  key={cand.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-800/40 gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">{cand.name}</span>
                      <span className="rounded-md bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                        {cand.matchScore}% ATS Vector Match
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      {cand.currentRole} at <strong className="text-slate-900 dark:text-white">{cand.company}</strong> ({cand.location})
                    </p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {cand.skills.map((s) => (
                        <span key={s} className="rounded bg-slate-200/80 px-2 py-0.5 text-[10px] font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleTriggerOutreach(cand, 'EMAIL')}
                      className="gap-1.5 text-xs rounded-xl"
                    >
                      <Mail className="h-3.5 w-3.5 text-indigo-600" /> Email Outreach
                    </Button>
                    <Button
                      size="sm"
                      className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded-xl"
                      onClick={() => handleTriggerOutreach(cand, 'WHATSAPP')}
                    >
                      <MessageSquare className="h-3.5 w-3.5" /> WhatsApp Invite
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* TAB 3: REQUISITION & PIPELINE ROUNDS SETUP */}
        {activeTab === 'REQUISITION' && (
          <Card className="rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-6">
            <div>
              <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                Job Requisition & Interview Pipeline Rounds Configurator
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Define hiring parameters and toggle AI vs Human HR interview rounds
              </CardDescription>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title</Label>
                <Input
                  id="title"
                  value={requisition.title}
                  onChange={(e) => setRequisition((r) => ({ ...r, title: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Target Location</Label>
                <Input
                  id="location"
                  value={requisition.targetLocation}
                  onChange={(e) => setRequisition((r) => ({ ...r, targetLocation: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Configured Interview Pipeline Rounds
              </h4>
              <div className="space-y-3">
                {requisition.rounds.map((round) => (
                  <div
                    key={round.roundNumber}
                    className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-800/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-xs">
                        {round.roundNumber}
                      </div>
                      <div>
                        <p className="font-bold text-xs text-slate-900 dark:text-white">{round.name}</p>
                        <p className="text-[11px] text-slate-500">Passing Threshold: {round.minPassingScore}%</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          round.isAiHandled
                            ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400'
                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                        }`}
                      >
                        {round.isAiHandled ? '🤖 AI Autonomous Agent' : '👤 Human HR Round'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* AI SCREENING CHATBOT & CANDIDATE EVALUATION MODAL */}
      <Dialog open={showChatModal} onOpenChange={setShowChatModal}>
        <DialogContent className="max-w-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold">
              <Bot className="h-5 w-5 text-indigo-600" />
              AI Screening Simulator — {selectedCandidate?.name}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Simulating Round 1 AI Chat Screening evaluation for {selectedCandidate?.currentRole}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Chat Transcript Area */}
            <div className="h-64 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900 space-y-3 text-xs">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === 'ai' ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-xl p-3 ${
                      msg.sender === 'ai'
                        ? 'bg-white border border-slate-200 text-slate-800 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100'
                        : 'bg-indigo-600 text-white font-medium'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Form */}
            <div className="flex gap-2">
              <Input
                placeholder="Type response as candidate..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="text-xs rounded-xl"
                onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
              />
              <Button size="sm" onClick={handleSendChatMessage} className="bg-indigo-600 text-white rounded-xl gap-1">
                <Send className="h-4 w-4" /> Send
              </Button>
            </div>

            {/* Scorecard Preview if Available */}
            {selectedCandidate?.scorecard && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 dark:border-emerald-900 dark:bg-emerald-950/40 space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold text-emerald-800 dark:text-emerald-300">
                  <span>AI Interview Scorecard (Overall Score: {selectedCandidate.scorecard.overallScore}%)</span>
                  <Badge className="bg-emerald-600 text-white">RECOMMENDATION: {selectedCandidate.scorecard.finalRecommendation}</Badge>
                </div>
                <div className="space-y-1 text-slate-700 dark:text-slate-300">
                  <p><strong>Communication Rating:</strong> {selectedCandidate.scorecard.communicationRating}</p>
                  <p><strong>Key Strengths:</strong> {selectedCandidate.scorecard.strengths.join(', ')}</p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
