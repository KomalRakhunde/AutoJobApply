'use client';

import { useState, useEffect } from 'react';
import { useAppSelector } from '@/lib/store/hooks';
import { PageShell } from '@/components/page-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Briefcase,
  Users,
  PlusCircle,
  TrendingUp,
  FileCheck,
  Sparkles,
  Bot,
  UploadCloud,
  Layers,
  Mic,
  ArrowRight,
  Sliders,
  Clock,
  CheckCircle2,
  AlertCircle,
  Trash2,
  MessageSquareText,
  Send,
  Search,
  Zap,
  ShieldCheck,
  UserCheck,
  Info,
  Mail,
  Phone,
  FolderPlus,
  FileUp,
  FileText,
  FileSignature,
  DollarSign,
  RefreshCw,
} from 'lucide-react';
import Link from 'next/link';
import {
  fetchRecruiterJobs,
  fetchJobCandidates,
  deleteCandidateData,
  createAutomatedSelectionEmail,
  RecruiterJob,
  RecruiterCandidate,
} from '@/lib/recruiter-api';
import { triggerManualInterviewSession } from '@/lib/interview-api';
import { CreateJobDialog } from '@/components/recruiter/create-job-dialog';
import { BulkResumeUploadDialog } from '@/components/recruiter/bulk-resume-upload-dialog';
import { RecruiterCandidatesTable } from '@/components/recruiter/recruiter-candidates-table';
import { OfferLetterDialog } from '@/components/recruiter/offer-letter-dialog';
import { CandidateCompareDialog } from '@/components/recruiter/candidate-compare-dialog';
import { ScheduleInterviewDialog } from '@/components/recruiter/schedule-interview-dialog';
import { AiJdGeneratorDialog } from '@/components/recruiter/ai-jd-generator-dialog';

import { useSearchParams } from 'next/navigation';

export default function RecruiterDashboardPage() {
  const searchParams = useSearchParams();
  const tabFromUrl = searchParams?.get('tab') || 'overview';

  const user = useAppSelector((s) => s.auth.user);
  const username = user?.email ? user.email.split('@')[0] : 'Recruiter';
  const formattedUsername = username.charAt(0).toUpperCase() + username.slice(1);

  const [activeTab, setActiveTab] = useState<string>(tabFromUrl);
  const [jobs, setJobs] = useState<RecruiterJob[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [candidates, setCandidates] = useState<RecruiterCandidate[]>([]);
  const [createJobOpen, setCreateJobOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Modals for Voice Screening, Scorecard, Email, Offer Letters, AI Compare, Schedule & AI JD
  const [viewTranscriptCandidate, setViewTranscriptCandidate] = useState<RecruiterCandidate | null>(null);
  const [viewScorecardCandidate, setViewScorecardCandidate] = useState<RecruiterCandidate | null>(null);
  const [viewEmailCandidate, setViewEmailCandidate] = useState<RecruiterCandidate | null>(null);
  const [offerModalCandidate, setOfferModalCandidate] = useState<RecruiterCandidate | null>(null);

  const [compareOpen, setCompareOpen] = useState(false);
  const [scheduleCandidate, setScheduleCandidate] = useState<RecruiterCandidate | null>(null);
  const [aiJdOpen, setAiJdOpen] = useState(false);
  const [triggeringId, setTriggeringId] = useState<string | null>(null);

  // Keep active tab in sync with URL search parameters (Next.js useSearchParams)
  useEffect(() => {
    setActiveTab(tabFromUrl);
  }, [tabFromUrl]);

  const loadJobsAndCandidates = async () => {
    setLoading(true);
    try {
      const fetchedJobs = await fetchRecruiterJobs();
      setJobs(fetchedJobs);

      if (fetchedJobs && fetchedJobs.length > 0) {
        const targetJobId = fetchedJobs.find((j) => j.id === selectedJobId)?.id || fetchedJobs[0]?.id || '';
        setSelectedJobId(targetJobId);
        if (targetJobId) {
          const candidateList = await fetchJobCandidates(targetJobId);
          setCandidates(candidateList || []);
        } else {
          setCandidates([]);
        }
      } else {
        setSelectedJobId('');
        setCandidates([]);
      }
    } catch (err) {
      console.error('Error loading jobs and candidates', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobsAndCandidates();
  }, [selectedJobId]);

  const activeJob = jobs.find((j) => j.id === selectedJobId) || jobs[0];
  const qualifiedCandidates = candidates.filter(
    (c) => (c.scores[0]?.overallScore || 0) >= (activeJob?.passingThreshold || 75)
  );

  const handleManualTrigger = async (candidate: RecruiterCandidate) => {
    setTriggeringId(candidate.id);
    try {
      const res = await triggerManualInterviewSession(candidate.id, candidate.jobPostingId);
      alert(`AI Voice Screening invite generated!\nCandidate Link: ${res.joinUrl}`);
      loadJobsAndCandidates();
    } catch (err) {
      console.error(err);
    } finally {
      setTriggeringId(null);
    }
  };

  const handleDeleteCandidate = async (candidateId: string) => {
    if (!confirm('Are you sure you want to delete candidate data? This logs an audit entry.')) return;
    try {
      await deleteCandidateData(candidateId);
      loadJobsAndCandidates();
    } catch (err) {
      console.error(err);
    }
  };

  const getTabTitleAndSubtitle = (tab: string) => {
    switch (tab) {
      case 'jobs':
        return { title: 'Job Postings', subtitle: 'Manage active job openings and qualification thresholds.' };
      case 'candidates':
        return { title: 'Candidate Intake', subtitle: 'ATS match scores, extracted skills, and candidate summaries.' };
      case 'interviews':
        return { title: 'AI Voice Screening', subtitle: 'Review autonomous voice screening calls and transcripts.' };
      case 'offers':
        return { title: 'Offer Letter Manager', subtitle: 'Generate, customize, print, and email formal Lexon IT offer letters.' };
      case 'analytics':
        return { title: 'Hiring Analytics', subtitle: 'Time-to-hire velocity, source distribution, and hiring metrics.' };
      default:
        return { title: 'Recruiter Overview', subtitle: 'Manage job postings, applicant intake, and AI voice screening.' };
    }
  };

  // Listen to sidebar quick action events
  useEffect(() => {
    const handleAiJd = () => setAiJdOpen(true);
    const handleCreateJob = () => setCreateJobOpen(true);
    const handleBulkUpload = () => setUploadOpen(true);
    const handleCompare = () => setCompareOpen(true);

    window.addEventListener('open-ai-jd', handleAiJd);
    window.addEventListener('open-create-job', handleCreateJob);
    window.addEventListener('open-bulk-upload', handleBulkUpload);
    window.addEventListener('open-compare', handleCompare);

    return () => {
      window.removeEventListener('open-ai-jd', handleAiJd);
      window.removeEventListener('open-create-job', handleCreateJob);
      window.removeEventListener('open-bulk-upload', handleBulkUpload);
      window.removeEventListener('open-compare', handleCompare);
    };
  }, []);

  const { title: pageTitle, subtitle: pageSubtitle } = getTabTitleAndSubtitle(activeTab);

  return (
    <PageShell title="" subtitle="">
      <div className="max-w-6xl mx-auto space-y-6 pb-16 animate-fade-in px-2 sm:px-4 font-mono text-xs">
        {/* Top Header - Executive Suite Standard */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-b border-slate-200/80 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white font-extrabold text-lg shadow-md shadow-indigo-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {pageTitle} <span className="text-xs text-indigo-600 dark:text-indigo-400 font-mono font-normal">v2.4.0</span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">{pageSubtitle.toUpperCase()}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <Button
              onClick={() => setCreateJobOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-xs font-bold rounded-xl gap-1.5 px-4 shadow-md"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Post Job</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => setUploadOpen(true)}
              className="rounded-xl border-slate-200 dark:border-slate-800 font-bold text-xs gap-1.5"
            >
              <UploadCloud className="h-3.5 w-3.5" />
              <span>Upload Resumes</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={loadJobsAndCandidates}
              className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl gap-1.5"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Sync Live</span>
            </Button>
          </div>
        </div>

        {/* VIEW 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in font-mono">
            {/* 4 Clean Top Metric Cards with Left Accent & Hover Glow */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 border-l-4 border-l-indigo-500 bg-white dark:bg-[#0f111a] bg-gradient-to-r from-indigo-500/10 via-transparent to-transparent p-5 space-y-2 shadow-sm dark:shadow-xl hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all duration-300">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    ACTIVE OPENINGS
                  </span>
                  <Briefcase className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {loading ? <Skeleton className="h-8 w-16 rounded-lg" /> : jobs.length}
                </div>
                <p className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">Live Published Roles</p>
              </Card>

              <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 border-l-4 border-l-cyan-400 bg-white dark:bg-[#0f111a] bg-gradient-to-r from-cyan-500/10 via-transparent to-transparent p-5 space-y-2 shadow-sm dark:shadow-xl hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] transition-all duration-300">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    TOTAL RESUMES PARSED
                  </span>
                  <Users className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                </div>
                <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {loading ? <Skeleton className="h-8 w-16 rounded-lg" /> : candidates.length}
                </div>
                <p className="text-[11px] font-bold text-cyan-600 dark:text-cyan-400">Live Intake Stream</p>
              </Card>

              <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 border-l-4 border-l-emerald-400 bg-white dark:bg-[#0f111a] bg-gradient-to-r from-emerald-500/10 via-transparent to-transparent p-5 space-y-2 shadow-sm dark:shadow-xl hover:border-emerald-400/50 hover:shadow-[0_0_20px_rgba(52,211,153,0.15)] transition-all duration-300">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    AI SHORTLISTED
                  </span>
                  <FileCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
                  {loading ? <Skeleton className="h-8 w-16 rounded-lg" /> : qualifiedCandidates.length}
                </div>
                <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">Score ≥ {activeJob?.passingThreshold || 75}%</p>
              </Card>

              <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 border-l-4 border-l-amber-500 bg-white dark:bg-[#0f111a] bg-gradient-to-r from-amber-500/10 via-transparent to-transparent p-5 space-y-2 shadow-sm dark:shadow-xl hover:border-amber-500/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] transition-all duration-300">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    ROLE MATCH CUTOFF
                  </span>
                  <Sparkles className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="text-3xl font-black text-amber-600 dark:text-amber-400 tracking-tight">
                  {loading ? <Skeleton className="h-8 w-16 rounded-lg" /> : `${activeJob?.passingThreshold || 75}%`}
                </div>
                <p className="text-[11px] font-bold text-amber-600 dark:text-amber-400">Target Threshold</p>
              </Card>
            </div>

            {/* Clean Candidate Directory Table Card with Left Accent & Glow */}
            <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 border-l-4 border-l-indigo-500 bg-white dark:bg-[#0c0e17] bg-gradient-to-r from-indigo-500/10 via-transparent to-transparent overflow-hidden shadow-sm dark:shadow-2xl space-y-3 hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all duration-300">
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                    <UserCheck className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    <span>AI Evaluated Candidate Directory</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Real-time intake table of parsed resumes, ATS scores, and voice screening triggers.
                  </p>
                </div>
                <Link
                  href="/dashboard/recruiter?tab=candidates"
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                >
                  <span>Full Directory</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="p-4">
                <RecruiterCandidatesTable
                  candidates={candidates}
                  passingThreshold={activeJob?.passingThreshold || 75}
                  onRefresh={loadJobsAndCandidates}
                />
              </div>
            </Card>
          </div>
        )}


        {/* VIEW 3: JOB POSTINGS */}
        {activeTab === 'jobs' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">Active Job Openings</h3>
                <p className="text-xs text-slate-500">Configure role requirements, set cutoff thresholds, and publish open positions.</p>
              </div>
              <Button
                onClick={() => setCreateJobOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs gap-1.5 font-bold shadow-md shadow-indigo-600/20"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Create New Job</span>
              </Button>
            </div>

            {jobs.length === 0 ? (
              <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center space-y-3">
                <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 w-fit mx-auto">
                  <Briefcase className="h-8 w-8" />
                </div>
                <h4 className="font-bold text-base text-slate-900 dark:text-white">No active job postings created</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Click the button below to create your first job posting and set custom AI match thresholds.
                </p>
                <Button
                  onClick={() => setCreateJobOpen(true)}
                  className="bg-indigo-600 text-white text-xs rounded-xl px-5"
                >
                  Create First Job Posting
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {jobs.map((j) => {
                  const isSelected = selectedJobId === j.id;
                  return (
                    <Card
                      key={j.id}
                      className={`p-6 rounded-3xl border transition-all duration-300 space-y-4 font-mono ${
                        isSelected
                          ? 'border-indigo-500/80 border-l-4 border-l-indigo-500 bg-white dark:bg-[#0c0e17] bg-gradient-to-r from-indigo-500/15 via-transparent to-transparent shadow-md dark:shadow-2xl hover:shadow-[0_0_20px_rgba(99,102,241,0.2)]'
                          : 'border-slate-200/80 dark:border-slate-800 border-l-4 border-l-cyan-400 bg-white dark:bg-[#0c0e17] bg-gradient-to-r from-cyan-500/10 via-transparent to-transparent shadow-sm hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-extrabold text-slate-900 dark:text-white text-base">{j.title}</h4>
                            <Badge className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 text-[10px] font-bold">
                              {j.department}
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">{j.location} • {j.employmentType}</p>
                        </div>
                        <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold">
                          {j.status}
                        </Badge>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                        {j.description}
                      </p>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                        <div className="flex items-center gap-4 text-slate-500">
                          <span className="flex items-center gap-1 font-bold text-indigo-600 dark:text-indigo-400">
                            <Sliders className="h-3.5 w-3.5" />
                            Cutoff: {j.passingThreshold}%
                          </span>
                          <span className="flex items-center gap-1 font-medium">
                            <Clock className="h-3.5 w-3.5" />
                            {Math.round((j.maxInterviewDurationSeconds || 600) / 60)} mins call
                          </span>
                        </div>

                        <Button
                          size="sm"
                          variant={isSelected ? 'default' : 'outline'}
                          onClick={() => setSelectedJobId(j.id)}
                          className={`rounded-xl text-xs font-bold ${
                            isSelected
                              ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                              : ''
                          }`}
                        >
                          {isSelected ? 'Active Role' : 'Select Role'}
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* VIEW 4: CANDIDATE INTAKE */}
        {activeTab === 'candidates' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Users className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  <span>Candidate Intake & ATS Scorecard Directory</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Inspect parsed resumes, ATS scorecards, and AI matching evaluations.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => setUploadOpen(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs gap-1.5 font-bold shadow-md shadow-indigo-600/20"
                >
                  <UploadCloud className="h-4 w-4" />
                  <span>Bulk Upload Resumes</span>
                </Button>
              </div>
            </div>

            <RecruiterCandidatesTable
              candidates={candidates}
              passingThreshold={activeJob?.passingThreshold || 75}
              onRefresh={loadJobsAndCandidates}
            />
          </div>
        )}

        {/* VIEW 5: VOICE SCREENING */}
        {activeTab === 'interviews' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Mic className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  <span>AI Voice Screening & Interview Pipeline</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Trigger automated phone call outreach and review recorded candidate interview transcripts.
                </p>
              </div>
            </div>

            <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 border-l-4 border-l-purple-500 bg-white dark:bg-[#0c0e17] bg-gradient-to-r from-purple-500/10 via-transparent to-transparent overflow-hidden shadow-sm dark:shadow-2xl hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] transition-all duration-300">
              <div className="overflow-x-auto">
                {candidates.length === 0 ? (
                  <div className="p-12 text-center space-y-2">
                    <p className="font-bold text-sm text-slate-900 dark:text-white">No candidates available for voice screening</p>
                    <p className="text-xs text-slate-500">Upload candidate resumes to enable AI voice screening calls.</p>
                  </div>
                ) : (
                  <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
                    <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-800 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <tr>
                        <th className="py-3.5 px-4">Candidate Profile</th>
                        <th className="py-3.5 px-4">Match Score</th>
                        <th className="py-3.5 px-4">Voice Call Status</th>
                        <th className="py-3.5 px-4">Duration</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                      {candidates.map((cand) => {
                        const session = (cand as any).interviewSessions?.[0];
                        const score = cand.scores[0]?.overallScore || 0;
                        return (
                          <tr key={cand.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors">
                            <td className="py-4 px-4 font-medium">
                              <div>
                                <p className="font-bold text-slate-900 dark:text-white text-sm">{cand.name}</p>
                                <p className="text-[11px] text-slate-500">{cand.email}</p>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <span className="font-extrabold text-sm text-indigo-600 dark:text-indigo-400">
                                {score}%
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              {session ? (
                                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-[10px] px-2 py-0.5 font-bold">
                                  <Mic className="h-3 w-3 mr-1" />
                                  {session.status.toUpperCase()}
                                </Badge>
                              ) : (
                                <span className="text-slate-400 italic text-[11px]">Not Initiated</span>
                              )}
                            </td>
                            <td className="py-4 px-4 text-slate-500">
                              {session?.durationSeconds ? `${Math.round(session.durationSeconds / 60)} mins` : '—'}
                            </td>
                            <td className="py-4 px-4 text-right space-x-2">
                              {session?.transcript ? (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setViewTranscriptCandidate(cand)}
                                  className="rounded-xl text-xs text-indigo-600 dark:text-indigo-400 gap-1 font-bold"
                                >
                                  <MessageSquareText className="h-3.5 w-3.5" />
                                  <span>View Transcript</span>
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  disabled={triggeringId === cand.id}
                                  onClick={() => handleManualTrigger(cand)}
                                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs gap-1 font-bold"
                                >
                                  <Send className="h-3.5 w-3.5" />
                                  <span>Trigger Call</span>
                                </Button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* VIEW 6: OFFER LETTERS */}
        {activeTab === 'offers' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  <span>Offer Letter Manager & Compensation Dispatch</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Generate formal employment offer letters, preview compensation breakdowns, and dispatch official emails to qualified candidates.
                </p>
              </div>
            </div>

            {/* Metric Cards for Offers */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
              <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 border-l-4 border-l-emerald-400 bg-white dark:bg-[#0f111a] bg-gradient-to-r from-emerald-500/10 via-transparent to-transparent p-5 space-y-2 shadow-sm dark:shadow-xl hover:border-emerald-400/50 hover:shadow-[0_0_20px_rgba(52,211,153,0.15)] transition-all duration-300">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Qualified Candidates</span>
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                    <UserCheck className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-3 text-3xl font-black text-emerald-600 dark:text-emerald-400">{qualifiedCandidates.length}</p>
                <p className="text-[11px] text-slate-400">Eligible for Employment Offer</p>
              </Card>

              <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 border-l-4 border-l-indigo-500 bg-white dark:bg-[#0f111a] bg-gradient-to-r from-indigo-500/10 via-transparent to-transparent p-5 space-y-2 shadow-sm dark:shadow-xl hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all duration-300">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Standard Base Offer</span>
                  <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                    <DollarSign className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-3 text-3xl font-black text-indigo-600 dark:text-indigo-400">$145,000 / yr</p>
                <p className="text-[11px] text-slate-400">Senior Full Stack Engineer</p>
              </Card>

              <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 border-l-4 border-l-purple-500 bg-white dark:bg-[#0f111a] bg-gradient-to-r from-purple-500/10 via-transparent to-transparent p-5 space-y-2 shadow-sm dark:shadow-xl hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] transition-all duration-300">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Offer Expiry Term</span>
                  <div className="p-2 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
                    <Clock className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-3 text-3xl font-black text-purple-600 dark:text-purple-400">7 Days</p>
                <p className="text-[11px] text-slate-400">Standard Acceptance Window</p>
              </Card>
            </div>

            {/* Qualified Candidates Offer Table */}
            <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 border-l-4 border-l-emerald-400 bg-white dark:bg-[#0c0e17] bg-gradient-to-r from-emerald-500/10 via-transparent to-transparent overflow-hidden shadow-sm dark:shadow-2xl hover:border-emerald-400/50 hover:shadow-[0_0_20px_rgba(52,211,153,0.15)] transition-all duration-300 font-mono">
              <div className="p-4 border-b border-slate-100 dark:border-slate-800">
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Shortlisted Candidates Ready for Offer</h4>
                <p className="text-xs text-slate-500">Select a candidate to generate, print, or email their official employment offer letter.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-800 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4">Candidate</th>
                      <th className="py-3.5 px-4">ATS Match Score</th>
                      <th className="py-3.5 px-4">Offer Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {candidates.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-slate-400">No candidates available</td>
                      </tr>
                    ) : (
                      candidates.map((cand) => {
                        const score = cand.scores[0]?.overallScore || 0;
                        const isQual = score >= (activeJob?.passingThreshold || 75);
                        return (
                          <tr key={cand.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors">
                            <td className="py-4 px-4 font-medium">
                              <div>
                                <p className="font-bold text-slate-900 dark:text-white text-sm">{cand.name}</p>
                                <p className="text-[11px] text-slate-500">{cand.email}</p>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <span className="font-extrabold text-sm text-indigo-600 dark:text-indigo-400">{score}%</span>
                            </td>
                            <td className="py-4 px-4">
                              {isQual ? (
                                <Badge className="bg-emerald-500 text-white font-bold text-[10px] px-2 py-0.5 gap-1">
                                  <CheckCircle2 className="h-3 w-3" /> QUALIFIED FOR OFFER
                                </Badge>
                              ) : (
                                <Badge className="bg-amber-100 text-amber-800 border-amber-300 text-[10px] px-2 py-0.5 font-bold">
                                  REVIEW REQUIRED
                                </Badge>
                              )}
                            </td>
                            <td className="py-4 px-4 text-right">
                              <Button
                                size="sm"
                                onClick={() => setOfferModalCandidate(cand)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs gap-1.5 font-bold"
                              >
                                <FileText className="h-3.5 w-3.5" />
                                <span>Generate Offer Letter</span>
                              </Button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* VIEW 7: REPORTS & HIRING ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  <span>Enterprise Recruitment Analytics & Hiring Intelligence</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Comprehensive performance metrics, velocity insights, source breakdown, and offer acceptance ratios.
                </p>
              </div>
            </div>

            {/* 4 Analytics Metric Cards with Left Accents & Hover Glow */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
              <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 border-l-4 border-l-indigo-500 bg-white dark:bg-[#0f111a] bg-gradient-to-r from-indigo-500/10 via-transparent to-transparent p-5 space-y-2 shadow-sm dark:shadow-xl hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all duration-300">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Time-to-Hire Velocity</span>
                  <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                    <Clock className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-3 text-3xl font-black text-indigo-600 dark:text-indigo-400">14.2 Days</p>
                <p className="text-[11px] text-emerald-600 font-bold mt-1">↓ 3.5 Days faster than avg</p>
              </Card>

              <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 border-l-4 border-l-cyan-400 bg-white dark:bg-[#0f111a] bg-gradient-to-r from-cyan-500/10 via-transparent to-transparent p-5 space-y-2 shadow-sm dark:shadow-xl hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] transition-all duration-300">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Time-to-Fill Requisitions</span>
                  <div className="p-2 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                    <Briefcase className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-3 text-3xl font-black text-cyan-600 dark:text-cyan-400">18.5 Days</p>
                <p className="text-[11px] text-slate-400 mt-1">Avg Open Duration</p>
              </Card>

              <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 border-l-4 border-l-emerald-400 bg-white dark:bg-[#0f111a] bg-gradient-to-r from-emerald-500/10 via-transparent to-transparent p-5 space-y-2 shadow-sm dark:shadow-xl hover:border-emerald-400/50 hover:shadow-[0_0_20px_rgba(52,211,153,0.15)] transition-all duration-300">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Offer Acceptance Rate</span>
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-3 text-3xl font-black text-emerald-600 dark:text-emerald-400">88.5%</p>
                <p className="text-[11px] text-emerald-600 font-bold mt-1">High conversion success</p>
              </Card>

              <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 border-l-4 border-l-purple-500 bg-white dark:bg-[#0f111a] bg-gradient-to-r from-purple-500/10 via-transparent to-transparent p-5 space-y-2 shadow-sm dark:shadow-xl hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] transition-all duration-300">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Interview-to-Hire Ratio</span>
                  <div className="p-2 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
                    <Users className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-3 text-3xl font-black text-purple-600 dark:text-purple-400">3.2 : 1</p>
                <p className="text-[11px] text-slate-400 mt-1">Shortlist conversion</p>
              </Card>
            </div>

            {/* Source of Hire Breakdown & Monthly Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-mono">
              <Card className="lg:col-span-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 border-l-4 border-l-indigo-500 bg-white dark:bg-[#0c0e17] bg-gradient-to-r from-indigo-500/10 via-transparent to-transparent p-6 space-y-4 shadow-sm dark:shadow-2xl hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all duration-300">
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Source of Hire Distribution</h4>
                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300 mb-1">
                      <span>LinkedIn Recruiter Sourcing</span>
                      <span className="text-indigo-600 font-black">45%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div className="h-full bg-indigo-600 w-[45%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300 mb-1">
                      <span>Naukri Job Portal Intake</span>
                      <span className="text-blue-600 font-black">30%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div className="h-full bg-blue-600 w-[30%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300 mb-1">
                      <span>Indeed Direct Applications</span>
                      <span className="text-purple-600 font-black">15%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div className="h-full bg-purple-600 w-[15%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300 mb-1">
                      <span>Direct Employee Referrals</span>
                      <span className="text-emerald-600 font-black">10%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div className="h-full bg-emerald-600 w-[10%]" />
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="lg:col-span-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">AI Voice Screening Efficiency</h4>
                <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 border border-indigo-100 dark:border-indigo-900 space-y-2 text-xs">
                  <p className="font-bold text-indigo-900 dark:text-indigo-200">⚡ Autonomous Screener Impact</p>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    By leveraging browser-native speech synthesis and AI technical scoring, recruiter manual screening hours were reduced by <strong>78%</strong> over the past 30 days.
                  </p>
                  <div className="pt-2 flex gap-4 font-bold text-indigo-700 dark:text-indigo-300 text-xs">
                    <div>• 120+ Screener Hours Saved</div>
                    <div>• $0 API Token Expense</div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* SCORECARD MODAL */}
        {viewScorecardCandidate && (
          <Card className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto animate-scale-in">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                    {viewScorecardCandidate.name}
                  </h3>
                  <p className="text-xs text-slate-500">{viewScorecardCandidate.email}</p>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
                    {viewScorecardCandidate.scores[0]?.overallScore || 0}%
                  </span>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Match Score</p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <h4 className="font-bold uppercase tracking-wider text-slate-400 mb-1">
                    AI Summary
                  </h4>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800">
                    {viewScorecardCandidate.scores[0]?.summary || 'No summary recorded.'}
                  </p>
                </div>

                {viewScorecardCandidate.scores[0]?.strengths && (
                  <div>
                    <h4 className="font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
                      Key Strengths
                    </h4>
                    <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-1">
                      {viewScorecardCandidate.scores[0].strengths.map((str, i) => (
                        <li key={i}>{str}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  onClick={() => setViewScorecardCandidate(null)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold"
                >
                  Close Scorecard
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* AUTOMATED SELECTION EMAIL PREVIEW MODAL */}
        {viewEmailCandidate && (
          <Card className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto animate-scale-in">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-md shadow-emerald-500/20">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                      Automated Selection Email Sent
                    </h3>
                    <p className="text-xs text-slate-500">Dispatched automatically upon ATS score qualification</p>
                  </div>
                </div>
                <Badge className="bg-emerald-500 text-white font-bold text-xs gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> SENT & DELIVERED
                </Badge>
              </div>

              <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-4 border border-slate-200/80 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between border-b border-slate-200/60 dark:border-slate-700/60 pb-1.5">
                  <span className="font-semibold text-slate-400">To Candidate:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{viewEmailCandidate.name} &lt;{viewEmailCandidate.email}&gt;</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/60 dark:border-slate-700/60 pb-1.5">
                  <span className="font-semibold text-slate-400">From Recruiter:</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">ApplyAI Talent Acquisition &lt;careers@applyai.com&gt;</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-400">Subject:</span>
                  <span className="font-extrabold text-indigo-600 dark:text-indigo-400">
                    {viewEmailCandidate.emailOutreach?.subject || `Congratulations! Next Round Interview`}
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-indigo-100 bg-slate-50 dark:bg-slate-900 p-5 space-y-3 text-xs leading-relaxed">
                <p className="font-bold text-sm text-slate-900 dark:text-white">Dear {viewEmailCandidate.name},</p>
                <p>
                  Congratulations! We reviewed your application and resume. Based on your strong qualification score ({viewEmailCandidate.scores[0]?.overallScore || 85}%), you have been selected for the <strong className="text-emerald-600">Next Round — AI Voice Technical Screening Interview</strong>.
                </p>
                <div className="my-2 rounded-xl bg-white dark:bg-slate-800 p-3 border space-y-1">
                  <p className="font-bold text-indigo-600">AI Voice Interview Join Link:</p>
                  <p className="font-mono text-[11px] underline text-indigo-600 dark:text-indigo-400">
                    {viewEmailCandidate.emailOutreach?.interviewLink || `http://localhost:3001/interview-prep?candidate=${viewEmailCandidate.id}`}
                  </p>
                  <p className="text-[10px] text-slate-400">Scheduled: {viewEmailCandidate.emailOutreach?.scheduledTime || 'Next Tuesday at 10:00 AM'}</p>
                </div>
                <p>Best regards,<br />ApplyAI Talent Acquisition Team</p>
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  onClick={() => setViewEmailCandidate(null)}
                  className="bg-indigo-600 text-white rounded-xl text-xs font-bold"
                >
                  Close Preview
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* TRANSCRIPT MODAL */}
        {viewTranscriptCandidate && (
          <Card className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto animate-scale-in">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                    <MessageSquareText className="h-5 w-5 text-indigo-600" />
                    <span>AI Voice Screening Transcript — {viewTranscriptCandidate.name}</span>
                  </h3>
                  <p className="text-xs text-slate-500">{viewTranscriptCandidate.email}</p>
                </div>
              </div>

              <div className="space-y-2 bg-slate-950 p-4 rounded-xl text-xs text-slate-200 font-mono max-h-72 overflow-y-auto">
                <pre className="whitespace-pre-wrap leading-relaxed">
                  {(viewTranscriptCandidate as any).interviewSessions?.[0]?.transcript || 'No transcript recorded.'}
                </pre>
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  onClick={() => setViewTranscriptCandidate(null)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold"
                >
                  Close Transcript
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Modals for Create Job, Bulk Upload & Offer Letter */}
        <CreateJobDialog
          open={createJobOpen}
          onOpenChange={setCreateJobOpen}
          onJobCreated={() => loadJobsAndCandidates()}
        />

        {activeJob && (
          <BulkResumeUploadDialog
            open={uploadOpen}
            onOpenChange={setUploadOpen}
            jobId={activeJob.id}
            jobTitle={activeJob.title}
            onUploadSuccess={() => loadJobsAndCandidates()}
          />
        )}

        {offerModalCandidate && (
          <OfferLetterDialog
            candidate={offerModalCandidate}
            jobRole={activeJob?.title || 'Software Engineer Intern'}
            companyName="Lexon IT Solutions Pvt Ltd"
            open={!!offerModalCandidate}
            onOpenChange={(open) => {
              if (!open) setOfferModalCandidate(null);
            }}
            onOfferSent={() => {
              loadJobsAndCandidates();
            }}
          />
        )}

        {compareOpen && (
          <CandidateCompareDialog
            candidates={candidates}
            open={compareOpen}
            onOpenChange={setCompareOpen}
          />
        )}

        {scheduleCandidate && (
          <ScheduleInterviewDialog
            candidate={scheduleCandidate}
            open={!!scheduleCandidate}
            onOpenChange={(open) => {
              if (!open) setScheduleCandidate(null);
            }}
            onScheduled={() => loadJobsAndCandidates()}
          />
        )}

        <AiJdGeneratorDialog
          open={aiJdOpen}
          onOpenChange={setAiJdOpen}
          onUseTemplate={({ title, description, requirements }) => {
            setCreateJobOpen(true);
          }}
        />
      </div>
    </PageShell>
  );
}
