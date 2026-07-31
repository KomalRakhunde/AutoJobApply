'use client';

import { useState, useEffect } from 'react';
import { PageShell } from '@/components/page-shell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
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
} from '@/lib/types/sourcing';
import { RecruiterCandidate } from '@/lib/recruiter-api';
import {
  Bot,
  PlusCircle,
  Sparkles,
  Target,
  Send,
  Calendar,
  CheckCircle2,
  Building2,
  MessageSquare,
  Users,
  KanbanSquare,
  Zap,
  Mail,
  Loader2,
  Award,
  Bell,
  TrendingUp,
  UploadCloud,
  FileText,
  Scale,
  Download,
  Plus,
  Briefcase,
  FileSpreadsheet,
  Layers,
  Sparkle,
} from 'lucide-react';

// Import Recruiter Dialog Components
import { BulkResumeUploadDialog } from '@/components/recruiter/bulk-resume-upload-dialog';
import { AiJdGeneratorDialog } from '@/components/recruiter/ai-jd-generator-dialog';
import { CandidateCompareDialog } from '@/components/recruiter/candidate-compare-dialog';
import { CreateJobDialog } from '@/components/recruiter/create-job-dialog';
import { OfferLetterDialog } from '@/components/recruiter/offer-letter-dialog';
import { RecruiterCandidatesTable } from '@/components/recruiter/recruiter-candidates-table';
import { ScheduleInterviewDialog } from '@/components/recruiter/schedule-interview-dialog';

const defaultRounds: PipelineRoundConfig[] = [
  { roundNumber: 1, name: 'AI Chat Screening', type: 'AI_CHAT_SCREENING', isAiHandled: true, minPassingScore: 75 },
  { roundNumber: 2, name: 'Technical Voice/Code Round', type: 'AI_VOICE_TECHNICAL', isAiHandled: true, minPassingScore: 80 },
  { roundNumber: 3, name: 'Final HR Interview', type: 'HUMAN_HR_INTERVIEW', isAiHandled: false, minPassingScore: 70 },
];

const initialCandidates: SourcedCandidate[] = [
  {
    id: 'cand-1',
    requisitionId: 'req-1',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    phone: '+91 98765 43210',
    currentRole: 'Senior Full Stack Engineer',
    company: 'TechCorp Solutions',
    location: 'Bangalore, India (Remote)',
    matchScore: 94,
    skills: ['React', 'Next.js', 'Node.js', 'TypeScript', 'Vector DBs'],
    status: 'SOURCED',
  },
  {
    id: 'cand-2',
    requisitionId: 'req-1',
    name: 'Sophia Chen',
    email: 'sophia.chen@example.com',
    phone: '+1 (555) 342-9102',
    currentRole: 'AI Systems Architect',
    company: 'DataScale Labs',
    location: 'San Francisco, CA',
    matchScore: 89,
    skills: ['Python', 'LangChain', 'Next.js', 'PostgreSQL', 'Docker'],
    status: 'OUTREACH_SENT',
    outreachChannel: 'EMAIL',
  },
  {
    id: 'cand-3',
    requisitionId: 'req-1',
    name: 'Rohan Verma',
    email: 'rohan.verma@example.com',
    phone: '+91 91234 56789',
    currentRole: 'Backend Tech Lead',
    company: 'CloudMatrix Systems',
    location: 'Hyderabad, India',
    matchScore: 86,
    skills: ['Node.js', 'TypeScript', 'GraphQL', 'AWS', 'Redis'],
    status: 'SCREENING_IN_PROGRESS',
    scorecard: {
      candidateId: 'cand-3',
      roundNumber: 1,
      overallScore: 88,
      communicationRating: 'Excellent',
      strengths: ['Great technical depth in System Design & Next.js', 'Clear articulation of architecture'],
      weaknesses: ['Minor gaps in Kubernetes cluster tuning'],
      qnaTranscript: [{ question: 'Explain microservices scaling strategy', answer: 'Used Redis caching and async queues.', grade: 88, feedback: 'Strong' }],
      finalRecommendation: 'PASS',
      evaluatedAt: '2026-07-30',
    },
  },
  {
    id: 'cand-4',
    requisitionId: 'req-1',
    name: 'Emily Watson',
    email: 'emily.watson@example.com',
    phone: '+44 20 7946 0912',
    currentRole: 'Principal Frontend Engineer',
    company: 'Apex Digital UK',
    location: 'London, UK (Remote)',
    matchScore: 91,
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Redux Toolkit', 'Jest'],
    status: 'INTERVIEW_SCHEDULED',
    scheduledSlot: {
      candidateId: 'cand-4',
      scheduledTime: 'Aug 4, 2026 @ 2:00 PM EST',
      interviewerName: 'Komal Rakhunde (Talent Lead)',
      meetLink: 'https://meet.google.com/applyai-tech-cand-4',
      confirmed: true,
    },
  },
  {
    id: 'cand-5',
    requisitionId: 'req-1',
    name: 'Vikram Malhotra',
    email: 'vikram.malhotra@example.com',
    phone: '+91 99887 76655',
    currentRole: 'Lead Software Developer',
    company: 'Nexus Innovations',
    location: 'Pune, India',
    matchScore: 96,
    skills: ['Next.js', 'Node.js', 'PostgreSQL', 'AI Agents', 'Microservices'],
    status: 'HIRED',
  },
];

function convertToRecruiterCandidate(cand: SourcedCandidate): RecruiterCandidate {
  return {
    id: cand.id,
    jobPostingId: cand.requisitionId || 'req-1',
    name: cand.name,
    email: cand.email,
    phone: cand.phone || '+1 (555) 234-5678',
    skills: cand.skills,
    experience: { summary: `${cand.currentRole} at ${cand.company}` },
    currentStage: cand.status,
    status: cand.status === 'HIRED' ? 'HIRED' : 'QUALIFIED',
    consentGiven: true,
    createdAt: new Date().toISOString(),
    scores: [
      {
        id: `score-${cand.id}`,
        overallScore: cand.matchScore,
        summary: cand.scorecard ? `Round ${cand.scorecard.roundNumber} score: ${cand.scorecard.overallScore}%` : 'Sourced candidate profile',
        strengths: cand.scorecard?.strengths || cand.skills.slice(0, 3),
        gaps: cand.scorecard?.weaknesses || ['Further domain depth recommended'],
      },
    ],
    emailOutreach: cand.outreachChannel === 'EMAIL' ? {
      sent: true,
      sentAt: new Date().toISOString(),
      recipientEmail: cand.email,
      subject: 'Interview Invitation — ApplyAI',
      body: 'You are invited for an interview round.',
      interviewLink: cand.scheduledSlot?.meetLink || 'https://meet.google.com/applyai-interview',
      scheduledTime: cand.scheduledSlot?.scheduledTime || 'Aug 4, 2:00 PM EST',
      companyName: cand.company,
      jobRole: cand.currentRole,
    } : undefined,
  };
}

export default function RedesignedRecruiterDashboard() {
  const { toast } = useToast();

  // State Management
  const [candidates, setCandidates] = useState<SourcedCandidate[]>(initialCandidates);
  const [isLoading, setIsLoading] = useState(false);
  const [isSourcing, setIsSourcing] = useState(false);
  const [activeTab, setActiveTab] = useState<'KANBAN' | 'TABLE' | 'REQUISITION'>('KANBAN');

  // Modal Dialog Visibility States
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [showAiJdGenerator, setShowAiJdGenerator] = useState(false);
  const [showCreateJob, setShowCreateJob] = useState(false);
  const [showCompareDialog, setShowCompareDialog] = useState(false);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [showOfferDialog, setShowOfferDialog] = useState(false);
  const [selectedCandidateForModal, setSelectedCandidateForModal] = useState<RecruiterCandidate | null>(null);

  // AI Chat Screening Simulator State
  const [selectedCandidate, setSelectedCandidate] = useState<SourcedCandidate | null>(null);
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ sender: 'ai' | 'candidate'; text: string }[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [hrNotifications, setHrNotifications] = useState<string[]>([
    'AI Agent completed Round 1 for Vikram Malhotra (Score: 96% - PASSED). Hired!',
    'Automated Email invite dispatched to Emily Watson for Technical Round.',
  ]);

  // Job Requisition State
  const [requisition, setRequisition] = useState<JobRequisition>({
    id: 'req-1',
    recruiterId: 'recruiter-1',
    title: 'Senior Full Stack Engineer (AI Systems)',
    requiredSkills: ['React', 'Next.js', 'TypeScript', 'Node.js', 'Vector DBs'],
    experienceLevel: 'Senior',
    targetLocation: 'San Francisco, CA (Remote)',
    targetOpenings: 5,
    description: 'Looking for a Senior Full Stack Engineer to lead autonomous AI agent workflows.',
    rounds: defaultRounds,
    createdAt: new Date().toLocaleDateString(),
    status: 'OPEN',
  });

  // 1. Autonomous Sourcing Handler
  const handleTriggerSourcing = async () => {
    setIsSourcing(true);
    toast({ title: '🤖 Autonomous AI Sourcing Started', description: 'Scanning Vector DBs & candidate networks for skill match...' });

    setTimeout(() => {
      const newSourced: SourcedCandidate = {
        id: `cand-${Date.now()}`,
        requisitionId: requisition.id,
        name: 'Ananya Deshmukh',
        email: 'ananya.deshmukh@example.com',
        phone: '+91 97654 32109',
        currentRole: 'Senior React / Next.js Developer',
        company: 'InnovateX Labs',
        location: 'Bangalore, India',
        matchScore: 95,
        skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Redux'],
        status: 'SOURCED',
      };

      setCandidates((prev) => [newSourced, ...prev]);
      setIsSourcing(false);
      const notif = `AI Sourcing Agent retrieved top profile Ananya Deshmukh (95% Vector Match Score).`;
      setHrNotifications((n) => [notif, ...n]);
      toast({ title: '✨ Sourcing Complete', description: 'Retrieved 1 high-match candidate profile (95% Match Score).' });
    }, 1200);
  };

  // 2. Outreach Trigger Handler (Email / WhatsApp)
  const handleTriggerOutreach = (cand: SourcedCandidate, channel: 'EMAIL' | 'WHATSAPP') => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === cand.id ? { ...c, status: 'OUTREACH_SENT' as CandidatePipelineStatus, outreachChannel: channel } : c))
    );
    const notif = `AI Agent sent ${channel} screening invite to ${cand.name}.`;
    setHrNotifications((n) => [notif, ...n]);
    toast({
      title: '📲 Outreach Delivered',
      description: `Sent personalized screening link to ${cand.name} via ${channel}.`,
    });
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
        { sender: 'ai', text: 'Thank you for explaining your technical approach! Evaluation complete: Interview Scorecard generated (Score: 88% - PASS).' },
      ]);

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
                  strengths: ['Great technical depth in React & Next.js', 'Clear architecture explanation'],
                  weaknesses: ['Minor details missing on Kubernetes deployment'],
                  qnaTranscript: [{ question: 'Technical question', answer: userText, grade: 88, feedback: 'Strong' }],
                  finalRecommendation: 'PASS',
                  evaluatedAt: new Date().toLocaleDateString(),
                },
                scheduledSlot: {
                  candidateId: c.id,
                  scheduledTime: 'Aug 5, 2026 @ 3:00 PM EST',
                  interviewerName: 'Komal Rakhunde (Talent Lead)',
                  meetLink: `https://meet.google.com/applyai-tech-${c.id.slice(0, 6)}`,
                  confirmed: true,
                },
              }
            : c
        )
      );

      const notif = `AI Agent completed Round 1 for candidate ${selectedCandidate.name} (Score 88%). Scheduled for HR interview.`;
      setHrNotifications((n) => [notif, ...n]);
    }, 900);
  };

  // 4. Export CSV Intake Report
  const handleExportCSV = () => {
    if (candidates.length === 0) {
      toast({ title: 'No Candidates to Export', description: 'The pipeline currently has no candidates.', variant: 'destructive' });
      return;
    }

    const headers = ['Candidate Name', 'Email', 'Phone', 'Current Role', 'Company', 'Match Score (%)', 'Pipeline Stage', 'Skills'];
    const rows = candidates.map((c) => [
      `"${c.name.replace(/"/g, '""')}"`,
      `"${c.email.replace(/"/g, '""')}"`,
      `"${(c.phone || '').replace(/"/g, '""')}"`,
      `"${c.currentRole.replace(/"/g, '""')}"`,
      `"${c.company.replace(/"/g, '""')}"`,
      c.matchScore,
      `"${c.status}"`,
      `"${(c.skills || []).join('; ').replace(/"/g, '""')}"`,
    ]);

    const csvData = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ApplyAI_Candidate_Intake_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: '📊 Candidate Report Exported!',
      description: `Generated CSV report for ${candidates.length} candidate(s).`,
    });
  };

  // Converted Recruiter Candidates for Table & Modals
  const recruiterCandidates = candidates.map(convertToRecruiterCandidate);

  // Pipeline Stage Configs
  const pipelineStages: { status: CandidatePipelineStatus; label: string; icon: any; color: string; headerBg: string }[] = [
    { status: 'SOURCED', label: '1. Sourced Profiles', icon: Bot, color: 'text-indigo-600 dark:text-indigo-400', headerBg: 'bg-indigo-50/80 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-900' },
    { status: 'OUTREACH_SENT', label: '2. Outreach Sent', icon: Send, color: 'text-blue-600 dark:text-blue-400', headerBg: 'bg-blue-50/80 dark:bg-blue-950/50 border-blue-200 dark:border-blue-900' },
    { status: 'SCREENING_IN_PROGRESS', label: '3. AI Screening', icon: Sparkles, color: 'text-purple-600 dark:text-purple-400', headerBg: 'bg-purple-50/80 dark:bg-purple-950/50 border-purple-200 dark:border-purple-900' },
    { status: 'INTERVIEW_SCHEDULED', label: '4. HR Interview', icon: Calendar, color: 'text-amber-600 dark:text-amber-400', headerBg: 'bg-amber-50/80 dark:bg-amber-950/50 border-amber-200 dark:border-amber-900' },
    { status: 'HIRED', label: '5. Offer / Hired', icon: CheckCircle2, color: 'text-emerald-600 dark:text-emerald-400', headerBg: 'bg-emerald-50/80 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-900' },
  ];

  return (
    <PageShell title="" subtitle="">
      <div className="max-w-7xl mx-auto space-y-6 pb-16 animate-fade-in px-2 sm:px-4">
        
        {/* Executive Dashboard Header & Overview Metrics */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-2 border-b border-slate-200/80 dark:border-slate-800 pb-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white font-extrabold shadow-lg shadow-indigo-500/25">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  Recruiter Executive Command Center
                </h1>
                <Badge className="bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 font-mono text-xs px-2.5 py-0.5">
                  AI v2.4
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                Autonomous Sourcing, AI Screening, Interview Prep, Offer Management & Candidate Analytics
              </p>
            </div>
          </div>

          {/* Quick Metrics Pills */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 px-3.5 py-2 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 text-xs">
              <Users className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Candidates</span>
                <span className="font-extrabold text-slate-900 dark:text-white text-sm">{candidates.length}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/40 px-3.5 py-2 rounded-2xl border border-emerald-200/80 dark:border-emerald-800/60 text-xs">
              <Award className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <div>
                <span className="text-emerald-600 dark:text-emerald-400 block text-[10px] uppercase font-bold">Avg ATS Score</span>
                <span className="font-extrabold text-emerald-700 dark:text-emerald-300 text-sm">
                  {Math.round(candidates.reduce((acc, c) => acc + c.matchScore, 0) / (candidates.length || 1))}%
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950/40 px-3.5 py-2 rounded-2xl border border-indigo-200/80 dark:border-indigo-800/60 text-xs">
              <Briefcase className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <div>
                <span className="text-indigo-600 dark:text-indigo-400 block text-[10px] uppercase font-bold">Open Position</span>
                <span className="font-extrabold text-indigo-900 dark:text-indigo-200 text-xs truncate max-w-[140px] block">
                  {requisition.title}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Action Toolbar (All 10 Core Features Included) */}
        <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            
            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Feature 1: Autonomous AI Sourcing */}
              <Button
                size="sm"
                onClick={handleTriggerSourcing}
                disabled={isSourcing}
                className="gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-xl shadow-md text-xs font-bold px-4"
              >
                {isSourcing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bot className="h-4 w-4" />}
                {isSourcing ? 'Sourcing via AI...' : '1. Source Candidates via AI'}
              </Button>

              {/* Feature 5: Bulk Resume Upload */}
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowBulkUpload(true)}
                className="gap-2 rounded-xl text-xs font-semibold hover:border-indigo-500/50 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30"
              >
                <UploadCloud className="h-4 w-4 text-indigo-600" /> 5. Upload Resumes (Bulk)
              </Button>

              {/* Feature 6: AI JD Generator */}
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowAiJdGenerator(true)}
                className="gap-2 rounded-xl text-xs font-semibold hover:border-purple-500/50 hover:bg-purple-50/50 dark:hover:bg-purple-950/30"
              >
                <Sparkles className="h-4 w-4 text-purple-600" /> 6. Generate AI JD
              </Button>

              {/* Feature 7: Side-by-Side Candidate Compare */}
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowCompareDialog(true)}
                className="gap-2 rounded-xl text-xs font-semibold hover:border-amber-500/50 hover:bg-amber-50/50 dark:hover:bg-amber-950/30"
              >
                <Scale className="h-4 w-4 text-amber-600" /> 7. Compare Candidates
              </Button>
            </div>

            {/* Secondary Action Triggers */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Feature 8: Schedule Interview */}
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setSelectedCandidateForModal(recruiterCandidates[0] || null);
                  setShowScheduleDialog(true);
                }}
                className="gap-2 rounded-xl text-xs font-semibold hover:border-blue-500/50 hover:bg-blue-50/50 dark:hover:bg-blue-950/30"
              >
                <Calendar className="h-4 w-4 text-blue-600" /> 8. Schedule Interview
              </Button>

              {/* Feature 9: Offer Letter Generator */}
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setSelectedCandidateForModal(recruiterCandidates[0] || null);
                  setShowOfferDialog(true);
                }}
                className="gap-2 rounded-xl text-xs font-semibold hover:border-emerald-500/50 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30"
              >
                <FileText className="h-4 w-4 text-emerald-600" /> 9. Offer Letter
              </Button>

              {/* Feature Export CSV */}
              <Button
                size="sm"
                variant="secondary"
                onClick={handleExportCSV}
                className="gap-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200"
              >
                <Download className="h-4 w-4 text-slate-600 dark:text-slate-300" /> Export CSV Report
              </Button>
            </div>
          </div>
        </Card>

        {/* Real-Time Agent Activity & Notification Banner */}
        {hrNotifications.length > 0 && (
          <Card className="rounded-2xl border border-indigo-200/80 dark:border-indigo-900/60 border-l-4 border-l-indigo-600 bg-white dark:bg-[#0d101d] p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
                <Bell className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>Autonomous AI Recruiter Log</span>
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  </p>
                  <span className="text-[10px] text-slate-400">Live Agent Stream</span>
                </div>
                <div className="space-y-1">
                  {hrNotifications.slice(0, 2).map((n, i) => (
                    <p key={i} className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                      <span className="text-indigo-500 font-bold">•</span> {n}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Navigation Tabs Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
            {/* Tab 1: Kanban Board */}
            <Button
              size="sm"
              variant={activeTab === 'KANBAN' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('KANBAN')}
              className={`rounded-xl text-xs gap-2 ${activeTab === 'KANBAN' ? 'bg-indigo-600 text-white font-bold shadow-xs' : 'text-slate-600 dark:text-slate-400'}`}
            >
              <KanbanSquare className="h-4 w-4" /> Feature 4: Pipeline Kanban
            </Button>

            {/* Tab 2: Candidate Intake Table */}
            <Button
              size="sm"
              variant={activeTab === 'TABLE' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('TABLE')}
              className={`rounded-xl text-xs gap-2 ${activeTab === 'TABLE' ? 'bg-indigo-600 text-white font-bold shadow-xs' : 'text-slate-600 dark:text-slate-400'}`}
            >
              <FileSpreadsheet className="h-4 w-4" /> Feature 4: Candidate Intake Table ({candidates.length})
            </Button>

            {/* Tab 3: Job Requisition Setup */}
            <Button
              size="sm"
              variant={activeTab === 'REQUISITION' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('REQUISITION')}
              className={`rounded-xl text-xs gap-2 ${activeTab === 'REQUISITION' ? 'bg-indigo-600 text-white font-bold shadow-xs' : 'text-slate-600 dark:text-slate-400'}`}
            >
              <Layers className="h-4 w-4" /> Feature 3 & 6: Pipeline Rounds Config
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowCreateJob(true)}
              className="gap-2 rounded-xl text-xs font-semibold"
            >
              <Plus className="h-4 w-4 text-indigo-600" /> Create Job Requisition
            </Button>
          </div>
        </div>

        {/* TAB 1: KANBAN PIPELINE BOARD */}
        {activeTab === 'KANBAN' && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {pipelineStages.map((stage) => {
              const StageIcon = stage.icon;
              const stageCandidates = candidates.filter((c) => c.status === stage.status);

              return (
                <div key={stage.status} className="rounded-2xl border border-slate-200/80 bg-white dark:bg-slate-900/90 p-3.5 dark:border-slate-800 shadow-xs space-y-3 min-h-[440px]">
                  {/* Stage Header */}
                  <div className={`p-2.5 rounded-xl border ${stage.headerBg} flex items-center justify-between`}>
                    <div className="flex items-center gap-2">
                      <StageIcon className={`h-4 w-4 ${stage.color}`} />
                      <span className="text-xs font-extrabold text-slate-900 dark:text-white">{stage.label}</span>
                    </div>
                    <Badge className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 text-[10px] font-black px-2 py-0.5">
                      {stageCandidates.length}
                    </Badge>
                  </div>

                  {/* Stage Candidates */}
                  <div className="space-y-3">
                    {stageCandidates.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-400 bg-slate-50/50 dark:bg-slate-800/30 border border-slate-200/60 dark:border-slate-800/60 rounded-xl space-y-2">
                        <div className="flex justify-center">
                          <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400">
                            <StageIcon className="h-4 w-4" />
                          </div>
                        </div>
                        <p className="font-bold text-slate-500 dark:text-slate-400 text-xs">No Candidates in Stage</p>
                        <p className="text-[10px] text-slate-400 leading-tight">Profiles advance automatically with AI evaluation.</p>
                      </div>
                    ) : (
                      stageCandidates.map((cand) => {
                        const initials = cand.name.split(' ').map((n) => n[0]).join('').toUpperCase();
                        return (
                          <div
                            key={cand.id}
                            className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 shadow-xs hover:border-indigo-500/60 hover:shadow-md transition-all cursor-pointer space-y-2.5"
                            onClick={() => {
                              setSelectedCandidate(cand);
                              setShowChatModal(true);
                            }}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2 min-w-0">
                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white font-bold text-[10px]">
                                  {initials}
                                </div>
                                <div className="min-w-0">
                                  <span className="font-extrabold text-xs text-slate-900 dark:text-white truncate block">{cand.name}</span>
                                  <p className="text-[10px] text-slate-400 truncate">{cand.currentRole}</p>
                                </div>
                              </div>
                              <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 text-[9.5px] font-extrabold shrink-0">
                                {cand.matchScore}% ATS
                              </Badge>
                            </div>

                            <p className="text-[10.5px] text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
                              <Building2 className="h-3 w-3 text-slate-400 shrink-0" />
                              <span className="truncate">{cand.company}</span>
                            </p>

                            {/* Skills Tag Pills */}
                            <div className="flex flex-wrap gap-1">
                              {cand.skills.slice(0, 3).map((s) => (
                                <span key={s} className="rounded-md bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[9.5px] font-medium text-slate-600 dark:text-slate-300">
                                  {s}
                                </span>
                              ))}
                            </div>

                            {cand.scorecard && (
                              <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-2 text-[10px] font-bold text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300 flex items-center justify-between">
                                <span>Round {cand.scorecard.roundNumber} AI Score</span>
                                <span className="font-black text-emerald-600">{cand.scorecard.overallScore}% (PASS)</span>
                              </div>
                            )}

                            {cand.scheduledSlot && (
                              <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1 bg-indigo-50/60 dark:bg-indigo-950/40 p-1.5 rounded-lg border border-indigo-100 dark:border-indigo-900">
                                <Calendar className="h-3 w-3 shrink-0" />
                                <span className="truncate">{cand.scheduledSlot.scheduledTime}</span>
                              </div>
                            )}

                            {/* Card Action Footer */}
                            <div className="pt-1 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                              <span className="text-[9.5px] text-slate-400">Click to view AI screening</span>
                              
                              {cand.status === 'SOURCED' && (
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                    <Button
                                      size="sm"
                                      className="h-6 text-[10px] px-2.5 gap-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                                    >
                                      <Send className="h-2.5 w-2.5" /> Invite
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-48 rounded-xl">
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
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 2: CANDIDATE INTAKE TABLE & ADVANCED ACTIONS */}
        {activeTab === 'TABLE' && (
          <div className="space-y-4">
            <RecruiterCandidatesTable
              candidates={recruiterCandidates}
              passingThreshold={75}
              onRefresh={() => {
                toast({ title: 'Refreshed Candidates', description: 'Table list updated with latest candidate status.' });
              }}
            />
          </div>
        )}

        {/* TAB 3: REQUISITION & PIPELINE ROUNDS CONFIG */}
        {activeTab === 'REQUISITION' && (
          <Card className="rounded-3xl border border-slate-200/80 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <CardTitle className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Job Requisition & AI Pipeline Configurator</span>
                  <Badge className="bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 text-xs">
                    Requisition ID: {requisition.id}
                  </Badge>
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                  Configure target skills, experience requirements, and multi-round AI vs HR interview criteria.
                </CardDescription>
              </div>

              <Button
                size="sm"
                onClick={() => setShowAiJdGenerator(true)}
                className="gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl text-xs font-bold"
              >
                <Sparkles className="h-4 w-4" /> AI JD Generator
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="req-title" className="text-xs font-bold">Job Title</Label>
                <Input
                  id="req-title"
                  value={requisition.title}
                  onChange={(e) => setRequisition((r) => ({ ...r, title: e.target.value }))}
                  className="rounded-xl text-xs"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="req-location" className="text-xs font-bold">Target Location</Label>
                <Input
                  id="req-location"
                  value={requisition.targetLocation}
                  onChange={(e) => setRequisition((r) => ({ ...r, targetLocation: e.target.value }))}
                  className="rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <Layers className="h-4 w-4 text-indigo-600" />
                Configured Pipeline Rounds (Multi-Round AI & HR)
              </h4>
              <div className="space-y-3">
                {requisition.rounds.map((round) => (
                  <div
                    key={round.roundNumber}
                    className="flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-800/50 gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white font-extrabold text-sm shadow-sm">
                        {round.roundNumber}
                      </div>
                      <div>
                        <p className="font-extrabold text-sm text-slate-900 dark:text-white">{round.name}</p>
                        <p className="text-xs text-slate-500">Min Passing Score: <strong>{round.minPassingScore}%</strong></p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge
                        className={`px-3 py-1 text-xs font-bold ${
                          round.isAiHandled
                            ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}
                      >
                        {round.isAiHandled ? '🤖 Autonomous AI Agent' : '👤 Human HR Round'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}

      </div>

      {/* MODAL 1: BULK RESUME UPLOAD DIALOG (Feature 5) */}
      <BulkResumeUploadDialog
        open={showBulkUpload}
        onOpenChange={setShowBulkUpload}
        jobId={requisition.id}
        jobTitle={requisition.title}
        onUploadSuccess={(newCands) => {
          toast({
            title: '✨ Resumes Parsed & Scored!',
            description: `Successfully ingested and scored ATS match for ${newCands.length} resume(s).`,
          });
        }}
      />

      {/* MODAL 2: AI JD GENERATOR DIALOG (Feature 6) */}
      <AiJdGeneratorDialog
        open={showAiJdGenerator}
        onOpenChange={setShowAiJdGenerator}
        onUseTemplate={(data) => {
          setRequisition((prev) => ({
            ...prev,
            title: data.title || prev.title,
            description: data.description || prev.description,
          }));
          toast({ title: 'AI Job Description Applied', description: 'Updated requisition parameters with AI template.' });
        }}
      />

      {/* MODAL 3: CREATE JOB REQUISITION DIALOG (Feature 6) */}
      <CreateJobDialog
        open={showCreateJob}
        onOpenChange={setShowCreateJob}
        onJobCreated={(newJob) => {
          setRequisition({
            id: newJob.id,
            recruiterId: 'recruiter-1',
            title: newJob.title,
            requiredSkills: ['React', 'TypeScript', 'Node.js'],
            experienceLevel: 'Senior',
            targetLocation: newJob.location || 'Remote',
            targetOpenings: 3,
            description: newJob.description,
            rounds: defaultRounds,
            createdAt: new Date().toLocaleDateString(),
            status: 'OPEN',
          });
          toast({ title: 'Job Requisition Created', description: `Requisition "${newJob.title}" active.` });
        }}
      />

      {/* MODAL 4: SIDE-BY-SIDE CANDIDATE COMPARE DIALOG (Feature 7) */}
      <CandidateCompareDialog
        candidates={recruiterCandidates}
        open={showCompareDialog}
        onOpenChange={setShowCompareDialog}
      />

      {/* MODAL 5: SCHEDULE INTERVIEW DIALOG (Feature 8) */}
      {selectedCandidateForModal && (
        <ScheduleInterviewDialog
          candidate={selectedCandidateForModal}
          open={showScheduleDialog}
          onOpenChange={setShowScheduleDialog}
          onScheduled={() => {
            toast({ title: 'Interview Scheduled', description: 'Calendar invite and meeting link dispatched.' });
          }}
        />
      )}

      {/* MODAL 6: OFFER LETTER GENERATOR DIALOG (Feature 9) */}
      {selectedCandidateForModal && (
        <OfferLetterDialog
          candidate={selectedCandidateForModal}
          jobRole={requisition.title}
          companyName="Lexon IT Solutions / ApplyAI"
          open={showOfferDialog}
          onOpenChange={setShowOfferDialog}
          onOfferSent={() => {
            toast({ title: 'Offer Letter Dispatched', description: 'Sent offer letter email to candidate.' });
          }}
        />
      )}

      {/* MODAL 7: AI SCREENING CHAT SIMULATION MODAL (Feature 3) */}
      <Dialog open={showChatModal} onOpenChange={setShowChatModal}>
        <DialogContent className="max-w-2xl rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-black text-slate-900 dark:text-white">
              <Bot className="h-5 w-5 text-indigo-600" />
              Autonomous AI Chat Screening — {selectedCandidate?.name}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Interactive AI Round 1 technical & communication screening for {selectedCandidate?.currentRole}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Chat Transcript Container */}
            <div className="h-64 overflow-y-auto rounded-2xl border border-slate-200/80 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900 space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-slate-800 dark:text-slate-100">
                🤖 <strong>AI Agent:</strong> Hello {selectedCandidate?.name}! Welcome to the Round 1 AI Screening for {requisition.title}. Can you walk me through your hands-on experience building scalable applications using {selectedCandidate?.skills.slice(0, 3).join(', ')}?
              </div>

              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === 'ai' ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-xl p-3 ${
                      msg.sender === 'ai'
                        ? 'bg-white border border-slate-200 text-slate-800 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100'
                        : 'bg-indigo-600 text-white font-medium shadow-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input & Send Form */}
            <div className="flex gap-2">
              <Input
                placeholder="Type response as candidate to test AI evaluation..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="text-xs rounded-xl"
                onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
              />
              <Button size="sm" onClick={handleSendChatMessage} className="bg-indigo-600 text-white rounded-xl gap-1 font-bold">
                <Send className="h-4 w-4" /> Evaluate
              </Button>
            </div>

            {/* AI Scorecard Result Preview */}
            {selectedCandidate?.scorecard && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 dark:border-emerald-900 dark:bg-emerald-950/40 space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold text-emerald-800 dark:text-emerald-300">
                  <span>AI Scorecard Generated (Overall Score: {selectedCandidate.scorecard.overallScore}%)</span>
                  <Badge className="bg-emerald-600 text-white">PASS</Badge>
                </div>
                <div className="space-y-1 text-slate-700 dark:text-slate-300">
                  <p><strong>Communication:</strong> {selectedCandidate.scorecard.communicationRating}</p>
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
