'use client';

import { useState, useEffect } from 'react';
import { useAppSelector } from '@/lib/store/hooks';
import { PageShell } from '@/components/page-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
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

import { useSearchParams } from 'next/navigation';

export default function RecruiterDashboardPage() {
  const searchParams = useSearchParams();
  const tabFromUrl = searchParams.get('tab') || 'overview';

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

  // Modals for AI Voice Screening, Scorecard & Selection Email
  const [viewTranscriptCandidate, setViewTranscriptCandidate] = useState<RecruiterCandidate | null>(null);
  const [viewScorecardCandidate, setViewScorecardCandidate] = useState<RecruiterCandidate | null>(null);
  const [viewEmailCandidate, setViewEmailCandidate] = useState<RecruiterCandidate | null>(null);
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

  return (
    <PageShell
      title={`Recruiter Control Center — Welcome, ${formattedUsername} 👋`}
      subtitle="Effortless AI applicant intake, ATS match scoring, and autonomous voice screening."
      actions={
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => setCreateJobOpen(true)}
            variant="outline"
            className="rounded-xl text-xs gap-1.5 border-indigo-200 dark:border-indigo-900/60 hover:border-indigo-500 transition-all font-semibold"
          >
            <PlusCircle className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <span>Post New Job</span>
          </Button>
          <Button
            size="sm"
            onClick={() => setUploadOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md text-xs px-4 gap-1.5 font-bold transition-all"
          >
            <UploadCloud className="h-4 w-4" />
            <span>Bulk Upload Resumes</span>
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* VIEW 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            {/* 4 Clean Top Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-5 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Active Openings
                  </span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/80 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                    <Briefcase className="h-4.5 w-4.5" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                    {jobs.length}
                  </span>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                    Published
                  </span>
                </div>
              </Card>

              <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-5 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Total Resumes Parsed
                  </span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                    <Users className="h-4.5 w-4.5" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                    {candidates.length}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <TrendingUp className="h-3.5 w-3.5" /> Live ATS
                  </span>
                </div>
              </Card>

              <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-5 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    AI Shortlisted
                  </span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    <FileCheck className="h-4.5 w-4.5" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                    {qualifiedCandidates.length}
                  </span>
                  <span className="text-xs font-medium text-slate-500">
                    Score ≥ {activeJob?.passingThreshold || 75}%
                  </span>
                </div>
              </Card>

              <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-5 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Role Match Cutoff
                  </span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/80 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                    <Sparkles className="h-4.5 w-4.5" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="text-3xl font-extrabold text-purple-600 dark:text-purple-400">
                    {activeJob?.passingThreshold || 75}%
                  </span>
                  <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                    Target
                  </span>
                </div>
              </Card>
            </div>

            {/* Clean Candidate Directory Table */}
            <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs space-y-3">
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

        {/* VIEW 2: AI RECRUITMENT FUNNEL */}
        {activeTab === 'funnel' && (
          <div className="space-y-6 animate-fade-in">
            <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                    <Layers className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    <span>AI Recruitment Funnel & Pipeline Stages</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Track candidate progression across active recruitment screening stages.
                  </p>
                </div>
                {activeJob && (
                  <Badge className="bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 text-xs font-bold w-fit">
                    Role: {activeJob.title}
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">1. Sourced</p>
                  <p className="text-2xl font-black text-slate-900 dark:text-white">{candidates.length}</p>
                  <p className="text-[11px] text-slate-500">Profiles Discovered</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">2. Resumes Parsed</p>
                  <p className="text-2xl font-black text-blue-600 dark:text-blue-400">{candidates.length}</p>
                  <p className="text-[11px] text-slate-500">ATS Scored</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">3. AI Matched</p>
                  <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{qualifiedCandidates.length}</p>
                  <p className="text-[11px] text-slate-500">Score ≥ {activeJob?.passingThreshold || 75}%</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">4. Voice Screened</p>
                  <p className="text-2xl font-black text-purple-600 dark:text-purple-400">
                    {candidates.filter((c) => (c as any).interviewSessions?.[0]?.status === 'completed').length}
                  </p>
                  <p className="text-[11px] text-slate-500">Calls Completed</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">5. Shortlisted</p>
                  <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{qualifiedCandidates.length}</p>
                  <p className="text-[11px] text-slate-500">Ready for Offer</p>
                </div>
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
                      className={`p-6 rounded-2xl border transition-all duration-300 space-y-4 ${
                        isSelected
                          ? 'border-indigo-500/80 bg-indigo-50/20 dark:bg-indigo-950/20 shadow-md'
                          : 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900'
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

            <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
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

        {/* Modals for Create Job & Bulk Upload */}
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
      </div>
    </PageShell>
  );
}
